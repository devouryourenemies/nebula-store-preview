import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { complianceDisclaimer, formatPrice, getProductBySlug, products } from '@/lib/products';
import { ProductPurchasePanel } from '@/components/product-purchase-panel';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product not found | Nebula',
    };
  }

  return {
    title: `${product.name} — ${product.subtitle} | Nebula H.Y.L.ING`,
    description: `${product.name} (${product.dosage}) — ${product.summary} Independently tested by Janoshik Analytical. For research use only.`,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 3);

  const categoryLabel =
    product.category === 'stacks'
      ? 'Stack'
      : product.category === 'accessories'
        ? 'Essential'
        : 'Individual Peptide';

  return (
    <div className="shell py-16 sm:py-20">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-white/40">
        <Link href="/products" className="transition hover:text-white">
          Products
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60">{product.name}</span>
      </nav>

      {/* ── Hero area: display + purchase ── */}
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Product display — larger, more visual */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-cosmos/80 via-black to-nebula-supernova/10 p-1">
          {/* Subtle shimmer */}
          <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />

          <div className="relative rounded-[1.65rem] border border-white/10 bg-gradient-to-br from-nebula-cosmos/60 via-black to-black p-8 shadow-glow sm:p-12">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-nebula-supernova/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-[180px] w-[180px] rounded-full bg-nebula-horizon/10 blur-[70px]" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-nebula-supernova/20 bg-nebula-supernova/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-nebula-supernova">
                  {categoryLabel}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                  {product.dosage}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                {product.name}
              </h1>
              <p className="mt-3 text-lg text-white/70 sm:text-xl">{product.subtitle}</p>

              {/* Price — visual anchor */}
              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-5xl font-extrabold text-gradient-sundust sm:text-6xl">
                  {formatPrice(product.unitPriceCents)}
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
                  per vial
                </span>
              </div>

              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </div>

        {/* ── Info column ── */}
        <div className="space-y-6">
          {/* Research Overview */}
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-nebula-supernova">
              Research Overview
            </p>
            <p className="mt-4 text-sm leading-7 text-white/70">{product.summary}</p>
          </div>

          {/* Research Focus — more visual */}
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-nebula-horizon">
              Research Focus
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.researchFocus.map((focus) => (
                <span
                  key={focus}
                  className="rounded-full border border-nebula-horizon/20 bg-nebula-horizon/10 px-3.5 py-2 text-xs font-medium text-white/80"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {/* Composition — collapsed visual */}
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-nebula-stardust">
              Composition
            </p>
            <ul className="mt-4 space-y-3">
              {product.composition.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-stardust/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Features */}
          {product.highlights.length > 0 && (
            <div className="glass-card p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-nebula-supernova">
                Key Features
              </p>
              <ul className="mt-4 space-y-2">
                {product.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lab testing */}
          <div className="relative overflow-hidden rounded-2xl border border-nebula-supernova/20 bg-gradient-to-r from-nebula-supernova/10 to-transparent p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-[120px] w-[120px] rounded-full bg-nebula-supernova/10 blur-[60px]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-nebula-supernova">
                Lab Tested
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Every batch of {product.name} is independently tested by Janoshik Analytical.
                Each shipment includes a lot-specific Certificate of Analysis with purity, heavy
                metals, endotoxins, and sterility results.
              </p>
              <Link
                href="/lab-testing"
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-nebula-sundust transition hover:text-white"
              >
                Verify a batch
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
              Compliance
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60">{complianceDisclaimer}</p>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-block rounded-full border border-nebula-supernova/20 bg-nebula-supernova/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-nebula-supernova">
                Related Products
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Continue your research
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-1 text-sm font-semibold text-nebula-sundust transition hover:text-white"
            >
              Browse all
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group/rel glass-card p-6 transition-all duration-300 hover-glow hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                    {item.dosage}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">
                    {item.category === 'stacks' ? 'Stack' : 'Peptide'}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-white transition-colors duration-300 group-hover/rel:text-nebula-supernova">
                  {item.name}
                </h3>
                <p className="mt-1 text-2xl font-extrabold text-gradient-sundust">
                  {formatPrice(item.unitPriceCents)}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/50 line-clamp-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
