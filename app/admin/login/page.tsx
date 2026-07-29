'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ops/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token in cookie
      document.cookie = `nebula-admin-token=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure`;
      router.push('/admin');
    } catch {
      setError('Network error — please try again');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            <span className="text-[#E58AC3]">Nebula</span>{' '}
            <span className="text-gray-400">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">Enter your admin password to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-800 bg-black/60 p-6"
        >
          {error && (
            <div className="mb-4 rounded border border-red-900/50 bg-red-900/20 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className="w-full rounded border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#7E84E5] focus:ring-1 focus:ring-[#7E84E5]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded bg-[#7E84E5] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6B71D4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          For research use only — not for human consumption
        </p>
      </div>
    </div>
  );
}
