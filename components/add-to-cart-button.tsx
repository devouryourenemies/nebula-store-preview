'use client';

import type { Product } from '@/lib/products';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.slug === product.slug);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() =>
          addItem({
            slug: product.slug,
            name: product.name,
            subtitle: product.subtitle,
            dosage: product.dosage,
            unitPriceCents: product.unitPriceCents,
            accent: product.accent,
          })
        }
        className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
      >
        Add to cart — {formatPrice(product.unitPriceCents)}
      </button>
      {inCart && (
        <span className="text-sm text-nebula-supernova">
          {inCart.quantity} in cart
        </span>
      )}
    </div>
  );
}
