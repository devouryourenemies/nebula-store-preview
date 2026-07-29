'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nebula-age-verified';

export function AgeGate() {
  const [status, setStatus] = useState<'loading' | 'required' | 'verified' | 'denied'>('loading');

  useEffect(() => {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    setStatus(savedValue === 'true' ? 'verified' : 'required');
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setStatus('verified');
  };

  const deny = () => {
    setStatus('denied');
  };

  if (status === 'loading' || status === 'verified') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#050505] p-8 shadow-[0_24px_120px_rgba(36,0,124,0.45)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-nebula-supernova">
          Age verification
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Nebula is intended for adults 21+.
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
          This storefront presents peptide research products and clinical brand content.
          By entering, you confirm that you are at least 21 years old and understand
          that all listed products are for research use only.
        </p>

        {status === 'denied' ? (
          <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm leading-7 text-white/80">
            Access denied. Please exit if you are under 21.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={accept}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
          >
            I am 21+
          </button>
          <button
            type="button"
            onClick={deny}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            I am under 21
          </button>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/45">
          For research use only — not for human consumption.
        </p>
      </div>
    </div>
  );
}
