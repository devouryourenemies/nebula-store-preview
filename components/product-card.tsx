'use client';

import Link from 'next/link';

import type { Product } from '@/lib/products';
import { complianceDisclaimer, formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

type ProductCardProps = {
  product: Product;
  featured?: boolean;
};

const accentMap: Record<string, string> = {
  cosmos: 'from-nebula-cosmos/80 via-nebula-horizon/40 to-black',
  supernova: 'from-nebula-supernova/80 via-nebula-galaxy/40 to-black',
  stardust: 'from-nebula-stardust/70 via-nebula-sundust/30 to-black',
  horizon: 'from-nebula-horizon/80 via-nebula-cosmos/40 to-black',
};

const categoryLabels: Record<string, string> = {
  stacks: 'Stack',
  'individual-peptides': 'Peptide',
  accessories: 'Essential',
};

const categoryBadgeColors: Record<string, string> = {
  stacks: 'bg-nebula-supernova/20 text-nebula-supernova border-nebula-supernova/30',
  'individual-peptides': 'bg-nebula-horizon/20 text-nebula-horizon border-nebula-horizon/30',
  accessories: 'bg-nebula-stardust/20 text-nebula-stardust border-nebula-stardust/30',
};

const CategoryBadge = ({ category }: { category: string }) => (
  <span
    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
      categoryBadgeColors[category] || categoryBadgeColors['individual-peptides']
    }`}
  >
    {categoryLabels[category] || 'Peptide'}
  </span>
);

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      dosage: product.dosage,
      unitPriceCents: product.unitPriceCents,
      accent: product.accent,
    });
  };

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-500 ease-out hover-glow ${
        featured ? 'hover:scale-[1.015]' : 'hover:scale-[1.02]'
      } hover:-translate-y-1 hover:border-nebula-supernova/40`}
    >
      {/* Visual area — bigger, gradient-rich */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${accentMap[product.accent]} ${
            featured ? 'h-56' : 'h-48'
          }`}
        >
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 shimmer opacity-30" />

          {/* Inner card */}
          <div className="relative flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <CategoryBadge category={product.category} />
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
                {product.dosage}
              </span>
            </div>
            <div className="mt-auto">
              <p className="text-xl font-bold text-white drop-shadow-sm">{product.shortName}</p>
              <p className="mt-1 text-sm leading-5 text-white/80">{product.subtitle}</p>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      </Link>

      {/* Info section */}
      <div className="flex flex-1 flex-col p-6 pt-5">
        {/* Price — prominent */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-nebula-sundust tracking-tight">
              {formatPrice(product.unitPriceCents)}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">per vial</p>
          </div>
          {product.featured && (
            <span className="rounded-full bg-nebula-supernova/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-nebula-supernova">
              Best Seller
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl font-bold text-white leading-tight">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-white/60 line-clamp-2">{product.summary}</p>

        {/* Research focus pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.researchFocus.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/50"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Add to cart — premium feel */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-nebula-supernova to-nebula-galaxy px-6 py-3.5 text-sm font-bold text-black tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,138,195,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Add to cart
              <span className="text-black/70">·</span>
              {formatPrice(product.unitPriceCents)}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
          </button>
        </div>

        {/* Compliance */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[10px] leading-4 uppercase tracking-[0.2em] text-white/35">
            {complianceDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
