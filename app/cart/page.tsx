'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice, complianceDisclaimer } from '@/lib/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCents, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="shell py-16 sm:py-20">
        <div className="panel mx-auto max-w-3xl p-8 text-center sm:p-12">
          <p className="eyebrow">Your cart</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Cart is empty</h1>
          <p className="mt-4 copy-muted">
            Browse the catalog to add research peptide products to your cart.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-start">
        {/* Cart items */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Your cart</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </h1>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-white/50 transition hover:text-white"
            >
              Clear cart
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.slug}
                className="panel flex items-center gap-5 p-5 sm:p-6"
              >
                <div className="hidden h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-nebula-cosmos/50 to-black sm:flex">
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    {item.dosage}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{item.subtitle}</p>
                  <p className="mt-1 text-sm font-semibold text-nebula-stardust">
                    {formatPrice(item.unitPriceCents)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="mt-1 text-xs text-white/40 transition hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="panel p-6 sm:p-8 lg:sticky lg:top-32">
          <h2 className="text-xl font-semibold text-white">Order summary</h2>

          <div className="mt-6 space-y-3 border-b border-white/10 pb-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Subtotal ({itemCount} items)</span>
              <span className="font-semibold text-white">{formatPrice(totalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Shipping</span>
              <span className="text-white/60">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Member discount</span>
              <span className="text-sm text-nebula-supernova">Sign in for pricing</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-semibold text-white">{formatPrice(totalCents)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-nebula-sundust"
          >
            Proceed to checkout
          </Link>

          <Link
            href="/products"
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white transition hover:border-nebula-supernova/50 hover:bg-white/5"
          >
            Continue shopping
          </Link>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              All major payment methods accepted
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              {complianceDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
