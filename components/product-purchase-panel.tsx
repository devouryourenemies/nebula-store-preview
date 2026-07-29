'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/products';
import { AddToCartButton } from '@/components/add-to-cart-button';
import type { Product } from '@/lib/products';

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="mt-8 flex items-baseline gap-3">
        <span className="text-4xl font-bold text-nebula-sundust">
          {formatPrice(product.unitPriceCents)}
        </span>
        <span className="text-sm text-white/40">per vial</span>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Qty</p>
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-4 py-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-lg font-semibold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-sm text-white/40">
          {formatPrice(product.unitPriceCents * quantity)} total
        </span>
      </div>

      <div className="mt-6">
        <AddToCartButton product={product} />
      </div>
    </>
  );
}
