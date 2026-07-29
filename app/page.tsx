import Link from 'next/link';

import { Icon } from '@/components/icon';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { complianceDisclaimer, featuredProducts } from '@/lib/products';

const trustSignals = [
  { icon: 'microscope', label: 'Independently Lab Tested', sub: 'Janoshik Analytical — every batch' },
  { icon: 'shield', label: 'COA Verified', sub: 'Batch-specific results, verifiable online' },
  { icon: 'flag', label: 'US-Based Fulfillment', sub: 'Cold-chain, same-week dispatch' },
  { icon: 'star', label: 'Premium Research Grade', sub: 'Pharmaceutical-standard lyophilized' },
  { icon: 'flask', label: 'Sterility Tested', sub: 'Endotoxins & sterility verified' },
  { icon: 'box', label: 'Discrete Shipping', sub: 'Plain packaging, no branding' },
];

const productHighlights = [
  { name: 'BPC-157', price: '$64.99', accent: 'supernova' },
  { name: 'Glow Stack', price: '$129.99', accent: 'stardust' },
  { name: 'Retatrutide', price: '$139.99', accent: 'horizon' },
  { name: 'NAD+', price: '$99.99', accent: 'cosmos' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero — BIG bold, one statement ── */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-nebula-supernova/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-nebula-horizon/10 blur-[100px]" />

        <div className="shell relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-4xl">
            <p className="inline-block rounded-full border border-nebula-supernova/20 bg-nebula-supernova/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-nebula-supernova">
              H.Y.L.ING — Health, Youth, Longevity
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl leading-[1.05]">
              Research Peptides,
              <br />
              <span className="text-gradient-supernova">Full Transparency.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Independently tested, COA-verified, and shipped same-week.
              Every batch analyzed by Janoshik Analytical — no shortcuts, no blind spots.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-nebula-supernova to-nebula-galaxy px-10 py-3.5 text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(229,138,195,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10">Shop all products</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/lab-testing"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-10 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-nebula-supernova/40 hover:bg-white/10"
              >
                Verify a batch
              </Link>
            </div>

            {/* Quick product highlights */}
            <div className="mt-10 flex flex-wrap gap-2">
              {productHighlights.map((p) => (
                <Link
                  key={p.name}
                  href={`/products/${p.name.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
                  className="group/highlight rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition-all duration-300 hover:border-nebula-supernova/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(229,138,195,0.08)]"
                >
                  {p.name}{' '}
                  <span className="font-bold text-nebula-sundust group-hover/highlight:text-white transition-colors">
                    {p.price}
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-white/35">
              {complianceDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Products — big visual cards ── */}
      <section className="shell py-20 sm:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Featured products"
            title="Curated for serious research"
            description="Our most popular peptides and stacks, selected for purity, potency, and research demand."
          />
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-nebula-sundust transition hover:text-white"
          >
            View full catalog
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {featuredProducts.length > 3 && (
          <div className="mt-8">
            <ProductCard product={featuredProducts[3]} />
          </div>
        )}
      </section>

      {/* ── Trust Signals — horizontal scrolling strip ── */}
      <section className="border-y border-white/10 bg-white/[0.02] py-10">
        <div className="marquee-track">
          <div className="marquee-content">
            {/* Duplicate content for seamless loop */}
            {[...trustSignals, ...trustSignals].map((signal, i) => (
              <div
                key={`${signal.label}-${i}`}
                className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4"
              >
                <Icon name={signal.icon} className="h-6 w-6 text-nebula-supernova" />
                <div>
                  <p className="text-sm font-bold text-white whitespace-nowrap">{signal.label}</p>
                  <p className="text-xs text-white/50 whitespace-nowrap">{signal.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Member Pricing — gradient card hook ── */}
      <section className="shell py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-nebula-supernova/20 bg-gradient-to-br from-nebula-cosmos/90 via-nebula-supernova/15 to-nebula-stardust/20 p-8 sm:p-14">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-nebula-supernova/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-nebula-horizon/15 blur-[80px]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-block rounded-full border border-nebula-supernova/20 bg-nebula-supernova/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-nebula-supernova">
              Member Pricing
            </p>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Research accounts get{' '}
              <span className="text-gradient-supernova">preferred rates</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-base leading-7 text-white/60">
              Free account unlocks member-only pricing, order history, and priority batch notifications.
              Returning researchers save on every order.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/account"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-nebula-supernova to-nebula-galaxy px-10 py-3.5 text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(229,138,195,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10">Create free account</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-10 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-nebula-supernova/40 hover:bg-white/10"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── H.Y.L.ING Philosophy ── */}
      <section className="shell py-20 sm:py-24">
        <div className="text-center">
          <p className="inline-block rounded-full border border-nebula-supernova/20 bg-nebula-supernova/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-nebula-supernova">
            The H.Y.L.ING Philosophy
          </p>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Health. <span className="text-gradient-supernova">Youth.</span> Longevity.
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-base leading-7 text-white/60">
            Every product at Nebula is selected and tested with three principles in mind:
            advancing health research, supporting vitality, and extending the quality of life.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Health',
              icon: 'dna',
              desc: 'Recovery-focused compounds and metabolic research peptides for the investigator exploring tissue repair, gut health, and cellular function.',
            },
            {
              title: 'Youth',
              icon: 'sparkle',
              desc: 'Growth hormone secretagogues, collagen-supporting stacks, and antioxidants that support the biology of vitality and skin health.',
            },
            {
              title: 'Longevity',
              icon: '⏳',
              desc: 'Mitochondrial peptides, NAD+ precursors, and telomere-focused compounds at the forefront of aging research.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="group glass-card p-8 transition-all duration-300 hover-glow hover:-translate-y-0.5"
            >
              <Icon name={pillar.icon} className="h-8 w-8 text-nebula-stardust" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-nebula-supernova">
                {pillar.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/60">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
