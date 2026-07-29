'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/lab-testing', label: 'Lab Testing' },
  { href: '/contact', label: 'Contact' },
];

const categoryLinks = [
  { href: '/products?category=stacks', label: 'Stacks' },
  { href: '/products?category=individual-peptides', label: 'Peptides' },
  { href: '/products?category=accessories', label: 'Accessories' },
];

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2.4l2.2 10.1a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8l1.6-6.5H7.1" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-gradient-to-r from-nebula-cosmos/50 via-transparent to-nebula-supernova/20 px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.3em] text-white/60 sm:px-6 lg:px-8">
        For research use only — not for human consumption.
      </div>

      <div className="mx-auto flex w-full max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo — bolder */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Nebula home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-nebula-supernova/50 via-nebula-cosmos to-nebula-stardust/40 text-base font-bold text-white shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(229,138,195,0.25)]">
            N
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white">Nebula</p>
            <p className="text-[10px] leading-4 text-white/50 tracking-wider">H.Y.L.ING</p>
          </div>
        </Link>

        {/* Desktop nav — cleaner */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.href === '/products' ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
                {shopOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-glow backdrop-blur-xl">
                    {categoryLinks.map((cl) => (
                      <Link
                        key={cl.href}
                        href={cl.href}
                        className="block rounded-xl px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                        onClick={() => setShopOpen(false)}
                      >
                        {cl.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}

          <Link
            href="/account"
            className="text-white/60 transition hover:text-white"
            aria-label="Account"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-nebula-supernova/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(229,138,195,0.1)]"
            aria-label={`Cart — ${itemCount} items`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-nebula-supernova px-1.5 text-[10px] font-bold text-black shadow-[0_0_12px_rgba(229,138,195,0.5)]">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current transition-all duration-200" />
              <span className="block h-0.5 w-5 bg-current transition-all duration-200" />
              <span className="block h-0.5 w-5 bg-current transition-all duration-200" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-white/10 bg-black/90 px-4 py-6 md:hidden sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-white/70 transition hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-5">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categoryLinks.map((cl) => (
                  <Link
                    key={cl.href}
                    href={cl.href}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {cl.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-white/10 pt-5">
              <Link
                href="/account"
                className="text-sm text-white/60 transition hover:text-white"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <Link
                href="/cart"
                className="text-sm font-semibold text-nebula-supernova transition hover:text-white"
                onClick={() => setOpen(false)}
              >
                Cart ({itemCount})
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
