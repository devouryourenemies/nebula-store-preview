'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icon';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { complianceDisclaimer, products } from '@/lib/products';
import type { ProductCategory } from '@/lib/products';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

const filterTabs: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Products', icon: 'grid' },
  { id: 'stacks', label: 'Stacks', icon: 'zap' },
  { id: 'individual-peptides', label: 'Peptides', icon: 'flask' },
  { id: 'accessories', label: 'Accessories', icon: 'wrench' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
];

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [sortOpen, setSortOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result =
      activeFilter === 'all'
        ? [...products]
        : products.filter((p) => p.category === activeFilter);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.unitPriceCents - b.unitPriceCents);
        break;
      case 'price-desc':
        result.sort((a, b) => b.unitPriceCents - a.unitPriceCents);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [activeFilter, sort]);

  // Pick the first product as "featured" (larger card) if we have any
  const [featuredProduct, ...restProducts] = filteredAndSorted;

  return (
    <div className="shell py-16 sm:py-20">
      <SectionHeading
        eyebrow="Product catalog"
        title="Research-grade peptides &amp; stacks"
        description="Each product independently tested and verified. Browse our complete catalog of research peptides, stacks, and lab essentials."
      />

      {/* Filters + Sort */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter pills — stylish */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition-all duration-300 ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-nebula-supernova to-nebula-galaxy text-black shadow-[0_0_20px_rgba(229,138,195,0.2)]'
                  : 'border border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon name={tab.icon} className="mr-1.5 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown — custom styled */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6M3 12h12M3 17h18" />
            </svg>
            {sortOptions.find((o) => o.value === sort)?.label || 'Sort'}
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSortOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-2xl border border-white/10 bg-black/95 p-2 shadow-glow backdrop-blur-xl">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSort(opt.value);
                      setSortOpen(false);
                    }}
                    className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${
                      sort === opt.value
                        ? 'bg-nebula-supernova/15 text-nebula-supernova font-semibold'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product grid — visual rhythm */}
      {featuredProduct ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Featured product gets a bigger card */}
          <div className="lg:col-span-2">
            <ProductCard product={featuredProduct} featured />
          </div>
          {restProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {restProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredAndSorted.length === 0 && (
        <div className="mt-16 panel p-12 text-center">
          <p className="text-white/60">No products in this category yet.</p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="mt-4 inline-flex text-sm font-semibold text-nebula-sundust hover:text-white"
          >
            View all products →
          </button>
        </div>
      )}

      {/* Compliance */}
      <div className="mt-16 rounded-2xl border border-nebula-supernova/20 bg-gradient-to-r from-nebula-supernova/10 to-transparent p-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-nebula-supernova">
          Compliance
        </p>
        <p className="mt-3 text-sm leading-7 text-white/70">{complianceDisclaimer}</p>
      </div>
    </div>
  );
}
