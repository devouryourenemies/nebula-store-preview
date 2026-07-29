import Link from 'next/link';
import { complianceDisclaimer } from '@/lib/products';

const timeline = [
  { year: '2023', event: 'Nebula founded with a mission to bring clinical-grade peptide research to serious investigators.' },
  { year: '2024', event: 'Established partnership with Janoshik Analytical for independent third-party testing on every batch.' },
  { year: '2025', event: 'Expanded to 16 SKUs including proprietary stack formulations and advanced longevity peptides.' },
  { year: '2026', event: 'Launched member pricing, live COA verification, and a US-based fulfillment network.' },
];

const values = [
  {
    title: 'Transparency',
    desc: 'Every batch has a publicly verifiable Certificate of Analysis. We publish results, not claims.',
  },
  {
    title: 'Quality',
    desc: 'Pharmaceutical-standard manufacturing with HPLC purity analysis, ICP-MS heavy metals screening, and sterility validation.',
  },
  {
    title: 'Research Focus',
    desc: 'Every product is positioned for legitimate research use. We serve labs, investigators, and serious researchers.',
  },
  {
    title: 'Continuous Evolution',
    desc: 'Our catalog grows with the science. New compounds are added as peer-reviewed research validates their significance.',
  },
];

export default function AboutPage() {
  return (
    <div className="shell py-16 sm:py-20">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">About Nebula</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Health. Youth. Longevity.
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Nebula exists to bridge the gap between advanced peptide research and the serious investigator.
          We combine rigorous third-party testing with premium presentation because quality shouldn&apos;t
          stop at the vial.
        </p>
      </div>

      {/* Brand story */}
      <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="panel p-8 sm:p-10">
          <p className="eyebrow">The Nebula Standard</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Why Nebula exists
          </h2>
          <p className="mt-5 copy-muted">
            The peptide research space is flooded with inconsistent product quality, opaque sourcing,
            and packaging that feels more like an afterthought than a tool for serious work. Nebula was
            built to change that.
          </p>
          <p className="mt-4 copy-muted">
            Every product we carry is independently tested by Janoshik Analytical — one of the most
            respected third-party labs in the industry. We publish batch-specific COAs online so
            researchers can verify purity, heavy metals, endotoxins, and sterility before reconstitution.
            No blind trust required.
          </p>
          <p className="mt-4 copy-muted">
            Our catalog is curated, not dumped. We don&apos;t carry dozens of obscure compounds with
            minimal research history. Every SKU in our lineup has meaningful peer-reviewed science
            behind it — from the tissue-repair BPC-157 to the metabolic research power of Retatrutide.
          </p>
        </div>

        <div className="panel overflow-hidden p-6 sm:p-8">
          <div className="rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-nebula-cosmos/70 via-[#12072e] to-black p-8 shadow-glow">
            <p className="text-xs uppercase tracking-[0.28em] text-nebula-stardust">
              H.Y.L.ING Philosophy
            </p>
            <div className="mt-6 space-y-6">
              {[
                { letter: 'H', word: 'Health', desc: 'Recovery, metabolic balance, and cellular repair research.' },
                { letter: 'Y', word: 'Youth', desc: 'Growth hormone pathways, collagen support, and vitality.' },
                { letter: 'L', word: 'Longevity', desc: 'Mitochondrial function, NAD+ metabolism, and telomere science.' },
                { letter: 'ING', word: 'Inquiry', desc: 'Every product is positioned for legitimate, compliance-focused investigation.' },
              ].map((item) => (
                <div key={item.letter} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-bold text-nebula-supernova">
                    {item.letter}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.word}</p>
                    <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <div className="text-center">
          <p className="eyebrow">Our Values</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Built on trust and transparency
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="panel p-6 sm:p-8">
              <p className="eyebrow">{v.title}</p>
              <p className="mt-4 copy-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-16">
        <div className="panel p-8 sm:p-10">
          <p className="eyebrow">Our Journey</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Milestones</h2>
          <div className="mt-8 space-y-6">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nebula-supernova/20 text-xs font-bold text-nebula-supernova">
                    {t.year.slice(-2)}
                  </span>
                  <div className="mt-2 w-px flex-1 bg-white/10" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-nebula-stardust">{t.year}</p>
                  <p className="mt-1 text-sm leading-7 text-white/70">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <div className="mt-16 rounded-2xl border border-nebula-supernova/20 bg-nebula-supernova/10 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Compliance</p>
        <p className="mt-3 text-sm leading-7 text-white/70">
          {complianceDisclaimer} Nebula products are intended for laboratory research purposes only and
          are not for human consumption. No claims are made regarding the diagnostic, therapeutic, or
          curative effects of any product sold.
        </p>
      </div>
    </div>
  );
}
