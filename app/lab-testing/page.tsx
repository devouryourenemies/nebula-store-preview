'use client';

import { useState } from 'react';
import Link from 'next/link';

type CoaResult = {
  batchNumber: string;
  productName: string;
  labName: string;
  testDate: string;
  purityPct: number | null;
  heavyMetalsPass: boolean;
  endotoxinsPass: boolean;
  sterilityPass: boolean;
  reportUrl: string;
};

export default function LabTestingPage() {
  const [batchNumber, setBatchNumber] = useState('');
  const [result, setResult] = useState<CoaResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber.trim()) {
      setError('Please enter a batch number.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/ops/coa?batch=${encodeURIComponent(batchNumber.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Batch not found. Please check the number and try again.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Verification service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Lab Testing &amp; COA Verification</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Certificate of Analysis
        </h1>
        <p className="mt-5 max-w-2xl copy-muted">
          Every Nebula product is independently tested by Janoshik Analytical — a leading
          third-party laboratory. Each batch undergoes HPLC purity analysis, ICP-MS heavy metals
          screening, LAL endotoxin testing, and sterility validation. Results are published below.
        </p>

        {/* Verification form */}
        <form onSubmit={handleVerify} className="mt-10">
          <div className="panel p-6 sm:p-8">
            <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
              Batch number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. NEB-2026-0042"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-nebula-supernova/50 focus:outline-none focus:ring-1 focus:ring-nebula-supernova/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-nebula-sundust disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <p className="mt-3 text-xs text-white/40">
              Batch numbers are printed on every product vial label and shipment invoice.
            </p>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 space-y-5">
            <div className="panel p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Verified</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{result.productName}</h2>
                  <p className="mt-1 text-sm text-white/60">Batch: {result.batchNumber}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-semibold text-green-400">
                  ✓ Verified
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Lab</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.labName}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Test Date</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.testDate}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Purity</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {result.purityPct ? `${result.purityPct}%` : 'In progress'}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-nebula-stardust">Test Results</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <TestResult label="Heavy Metals" passed={result.heavyMetalsPass} />
                <TestResult label="Endotoxins" passed={result.endotoxinsPass} />
                <TestResult label="Sterility" passed={result.sterilityPass} />
              </div>
            </div>

            {result.reportUrl && (
              <a
                href={result.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-semibold text-nebula-sundust transition hover:text-white"
              >
                View full report →
              </a>
            )}
          </div>
        )}

        {/* Testing protocols */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Testing Protocol</p>
            <p className="mt-4 copy-muted">
              Each batch is subjected to:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-supernova" />
                <span><strong className="text-white">HPLC Purity Analysis</strong> — quantification of peptide content and impurity profiling.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-supernova" />
                <span><strong className="text-white">ICP-MS Heavy Metals</strong> — screening for arsenic, cadmium, lead, mercury, and other contaminants.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-supernova" />
                <span><strong className="text-white">LAL Endotoxin Testing</strong> — bacterial endotoxin levels below pharmacopoeial limits.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-supernova" />
                <span><strong className="text-white">Sterility Validation</strong> — membrane filtration and microbiological incubation.</span>
              </li>
            </ul>
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-nebula-stardust">Janoshik Analytical</p>
            <p className="mt-4 copy-muted">
              All testing is performed by Janoshik Analytical, an independent third-party laboratory
              specializing in peptide and research compound analysis. Results are published to
              janoshik.com/public for full transparency and independent verification.
            </p>
            <p className="mt-4 copy-muted">
              Nebula does not alter, withhold, or cherry-pick COA results. Every batch is tested
              and published regardless of outcome. If a batch fails any criterion it is discarded
              and does not ship.
            </p>
            <a
              href="https://janoshik.com/public"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-nebula-sundust transition hover:text-white"
            >
              View Janoshik public database →
            </a>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-10 rounded-2xl border border-nebula-supernova/20 bg-nebula-supernova/10 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Compliance</p>
          <p className="mt-3 copy-muted text-white/80">
            For research use only — not for human consumption. Nebula products are not intended
            to diagnose, treat, cure, or prevent any disease. COA results are provided for
            informational and quality-assurance purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

function TestResult({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${
      passed
        ? 'border-green-400/20 bg-green-400/5'
        : 'border-red-400/20 bg-red-400/5'
    }`}>
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-2 text-sm font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}>
        {passed ? '✓ Pass' : '✗ Fail'}
      </p>
    </div>
  );
}
