'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items?: { productSlug: string; quantity: number; unitPriceCents: number }[];
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  processing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  shipped: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  delivered: 'bg-green-400/10 text-green-400 border-green-400/20',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = document.cookie.split(';').find((c) => c.trim().startsWith('nebula-admin-token='));
    setToken(t?.split('=')[1] || '');
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/ops/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [token]);

  const loadOrderDetail = async (orderId: string) => {
    if (expanded === orderId) { setExpanded(null); return; }
    const res = await fetch(`/api/ops/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, items: data.items } : o)));
    setExpanded(orderId);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/ops/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Orders</h1>
        </div>
        <Link href="/admin" className="text-sm text-nebula-sundust hover:text-white">← Dashboard</Link>
      </div>

      {loading ? (
        <p className="mt-10 text-white/50">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 panel p-8 text-center">
          <p className="text-white/60">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="panel overflow-hidden">
              <button
                type="button"
                onClick={() => loadOrderDetail(order.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{order.customerName}</p>
                  <p className="text-xs text-white/40">{order.customerEmail}</p>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusColors[order.status] || 'bg-white/5 text-white/50 border-white/10'}`}>
                  {order.status}
                </span>
                <p className="text-sm font-semibold text-white">${(order.totalCents / 100).toFixed(2)}</p>
                <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</p>
              </button>

              {expanded === order.id && (
                <div className="border-t border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-white/40">Update status:</span>
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateStatus(order.id, s)}
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                          order.status === s ? statusColors[s] : 'border-white/10 text-white/30 hover:text-white/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2">
                          <span className="text-sm text-white/70">{item.productSlug.replace(/-/g, ' ')}</span>
                          <span className="text-xs text-white/40">Qty: {item.quantity}</span>
                          <span className="text-sm font-semibold text-white">${(item.unitPriceCents * item.quantity / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-[11px] text-white/30">ID: {order.id}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
