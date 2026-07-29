'use client';

import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Get the redirect from URL params
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/';

    // Submit password to the middleware via redirect
    window.location.href = `/?password=${encodeURIComponent(password)}`;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 24,
          color: 'white',
          fontWeight: 700,
        }}>N</div>

        <h1 style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 600,
          margin: '0 0 4px',
        }}>Nebula H.Y.L.ING</h1>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          margin: '0 0 32px',
        }}>Preview Site · Client Review</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: 8,
          }}>
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Site password"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 16,
            }}
            autoFocus
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: loading
                ? 'rgba(124,58,237,0.5)'
                : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Verifying...' : 'Enter Site'}
          </button>
        </form>
      </div>
    </div>
  );
}
