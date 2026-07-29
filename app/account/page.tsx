'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalCents: number;
  createdAt: string;
};

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    const token = document.cookie.split(';').find((c) => c.trim().startsWith('nebula-customer-token='));
    if (token) {
      const t = token.split('=')[1].trim();
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => r.json())
        .then((data) => {
          if (data.customer) {
            setCustomer(data.customer);
            setOrders(data.orders || []);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : form;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }
    document.cookie = `nebula-customer-token=${data.token}; path=/; max-age=2592000`;
    setCustomer(data.customer);
    setOrders(data.orders || []);
  };

  const logout = () => {
    document.cookie = 'nebula-customer-token=; path=/; max-age=0';
    setCustomer(null);
    setOrders([]);
  };

  if (loading) {
    return (
      <div className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <p className="text-white/50">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <p className="eyebrow">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-3 text-sm text-white/60">
              {mode === 'login'
                ? 'Sign in to access member pricing and order history.'
                : 'Register for member pricing, faster checkout, and order tracking.'}
            </p>
          </div>

          <div className="mt-8 panel p-6 sm:p-8">
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-white text-black' : 'border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-white text-black' : 'border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
                  <InputField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
                </div>
              )}
              <InputField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <InputField label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
              {mode === 'register' && (
                <InputField label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              )}
              {mode === 'register' && (
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
                  For research use only — not for human consumption.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
              >
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-white/40">
                  Member pricing available for registered researchers.{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-semibold text-nebula-supernova hover:text-white"
                  >
                    Sign up free
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-start">
        {/* Profile sidebar */}
        <div className="panel p-6 sm:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-nebula-supernova/40 via-nebula-cosmos to-nebula-stardust/30 text-xl font-semibold text-white">
            {customer.firstName?.[0] || customer.email[0].toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">{customer.firstName} {customer.lastName}</h2>
          <p className="mt-1 text-sm text-white/50">{customer.email}</p>
          {customer.phone && <p className="text-sm text-white/40">{customer.phone}</p>}
          <div className="mt-4 rounded-2xl border border-nebula-supernova/20 bg-nebula-supernova/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-nebula-supernova">Member</p>
            <p className="mt-1 text-sm font-semibold text-white">Member pricing active</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-6 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white"
          >
            Sign out
          </button>
        </div>

        {/* Orders */}
        <div>
          <p className="eyebrow">Order history</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your orders</h1>

          {orders.length === 0 ? (
            <div className="mt-8 panel p-8 text-center">
              <p className="text-white/50">No orders yet.</p>
              <Link href="/products" className="mt-4 inline-flex text-sm font-semibold text-nebula-sundust hover:text-white">
                Browse products →
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="panel flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {order.id.length > 16 ? `${order.id.slice(0, 16)}...` : order.id}
                    </p>
                    <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                    order.status === 'shipped' ? 'bg-purple-400/10 text-purple-400 border-purple-400/20' :
                    order.status === 'confirmed' ? 'bg-nebula-supernova/10 text-nebula-supernova border-nebula-supernova/20' :
                    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-semibold text-white">{formatPrice(order.totalCents)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function InputField({ label, type = 'text', value, onChange, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-nebula-supernova/50 focus:outline-none focus:ring-1 focus:ring-nebula-supernova/30"
      />
    </div>
  );
}
