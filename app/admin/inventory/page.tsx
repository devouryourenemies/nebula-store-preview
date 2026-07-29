'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type InventoryItem = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  dosage: string;
  unitPriceCents: number;
  quantityOnHand: number;
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [adjustSlug, setAdjustSlug] = useState('');
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const t = document.cookie.split(';').find((c) => c.trim().startsWith('nebula-admin-token='));
    setToken(t?.split('=')[1] || '');
  }, []);

  const loadInventory = () => {
    if (!token) return;
    fetch('/api/ops/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadInventory(); }, [token]);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustSlug || !delta) return;
    setMessage('');
    const res = await fetch('/api/ops/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productSlug: adjustSlug, delta: Number(delta), reason: reason || 'manual adjustment' }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
      setAdjustSlug('');
      setDelta('');
      setReason('');
      setMessage('Inventory adjusted successfully.');
    } else {
      setMessage('Failed to adjust inventory.');
    }
  };

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Inventory</h1>
        </div>
        <Link href="/admin" className="text-sm text-nebula-sundust hover:text-white">← Dashboard</Link>
      </div>

      {/* Adjustment form */}
      <div className="mt-8 panel p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Adjust inventory</h2>
        <form onSubmit={handleAdjust} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Product</label>
            <select
              value={adjustSlug}
              onChange={(e) => setAdjustSlug(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white"
            >
              <option value="">Select product...</option>
              {items.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name} ({item.quantityOnHand} on hand)</option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Delta (+/-)</label>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              placeholder="+10 or -5"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Restock from supplier"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-nebula-sundust"
          >
            Adjust
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-nebula-supernova">{message}</p>}
      </div>

      {/* Inventory table */}
      {loading ? (
        <p className="mt-8 text-white/50">Loading inventory...</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/40">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">SKU</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4 text-right">Price</th>
                <th className="pb-3 text-right">On Hand</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-white/40">{item.dosage}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-white/50 font-mono">{item.sku}</td>
                  <td className="py-3 pr-4 text-xs text-white/50">{item.category}</td>
                  <td className="py-3 pr-4 text-right text-sm text-white">${(item.unitPriceCents / 100).toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                      item.quantityOnHand < 10 ? 'text-red-400' : item.quantityOnHand < 25 ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {item.quantityOnHand < 10 && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
                      {item.quantityOnHand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
