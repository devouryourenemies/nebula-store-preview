'use client';

import { useState } from 'react';
import Link from 'next/link';

import { complianceDisclaimer } from '@/lib/products';

const footerColumns = [
  {
    title: 'Shop',
    links: [
      { href: '/products?category=stacks', label: 'Stacks' },
      { href: '/products?category=individual-peptides', label: 'Peptides' },
      { href: '/products?category=accessories', label: 'Accessories' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/lab-testing', label: 'Lab Testing' },
      { href: '/account', label: 'My Account' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/contact', label: 'Help Center' },
      { href: '/lab-testing', label: 'COA Verification' },
      { href: '/about', label: 'Shipping & Returns' },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-white/10">
      {/* Newsletter — full-width gradient band */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-nebula-cosmos/60 via-nebula-supernova/10 to-nebula-stardust/20">
        <div className="absolute inset-0 shimmer opacity-20" />
        <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-2xl font-bold text-white">Stay in the loop</p>
              <p className="mt-1 text-sm text-white/60">
                Batch alerts, research news, and member pricing drops.
              </p>
            </div>
            <div className="w-full max-w-md shrink-0">
              {subscribed ? (
                <p className="text-sm font-semibold text-nebula-supernova">
                  You&apos;re in. ✦
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm transition focus:border-nebula-supernova/50 focus:outline-none focus:ring-2 focus:ring-nebula-supernova/20"
                  />
                  <button
                    type="submit"
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-nebula-supernova to-nebula-galaxy px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,138,195,0.25)]"
                  >
                    <span className="relative z-10">Subscribe</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_2fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-nebula-supernova/50 via-nebula-cosmos to-nebula-stardust/40 text-lg font-bold text-white shadow-glow">
                N
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">Nebula</p>
                <p className="text-xs leading-4 text-white/50">H.Y.L.ING — Premium Research Peptides</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
              Independently tested, research-grade peptides for the serious investigator.
              Every batch verified by Janoshik Analytical — full COA transparency, always.
            </p>

            {/* Social placeholder */}
            <div className="mt-8 flex gap-3">
              {['X', 'IG', 'TT', 'YT'].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40 transition hover:border-nebula-supernova/30 hover:bg-white/10 hover:text-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns — cleaner */}
          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-nebula-stardust">
                  {col.title}
                </p>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>{complianceDisclaimer}</p>
          <p>&copy; {new Date().getFullYear()} Nebula H.Y.L.ING. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
