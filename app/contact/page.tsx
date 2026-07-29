'use client';

import { useState } from 'react';
import { complianceDisclaimer } from '@/lib/products';

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSending(true);
    setError('');
    // For now, simulate sending. In production, wire to an API route.
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch {
      setError('Message failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="shell py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-5 max-w-2xl mx-auto copy-muted">
            Have a question about a product, an order, or a partnership opportunity? We&apos;re here to help.
            Typical response time: within 24 hours.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="panel p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Email</p>
              <p className="mt-3 text-lg font-semibold text-white">support@nebulahylying.com</p>
              <p className="mt-2 text-sm text-white/60">For order inquiries, product questions, and general support.</p>
            </div>

            <div className="panel p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-nebula-stardust">Partnerships</p>
              <p className="mt-3 text-lg font-semibold text-white">partners@nebulahylying.com</p>
              <p className="mt-2 text-sm text-white/60">Wholesale, bulk orders, and research collaborations.</p>
            </div>

            <div className="panel p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-nebula-horizon">Lab Verification</p>
              <p className="mt-3 text-lg font-semibold text-white">coa@nebulahylying.com</p>
              <p className="mt-2 text-sm text-white/60">COA requests, batch verification, and testing inquiries.</p>
            </div>

            <div className="panel p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Business Hours</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Monday – Friday</span>
                  <span className="font-semibold text-white">9:00 AM – 6:00 PM EST</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Saturday</span>
                  <span className="font-semibold text-white">10:00 AM – 4:00 PM EST</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Sunday</span>
                  <span className="font-semibold text-white">Closed</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-nebula-supernova/20 bg-nebula-supernova/10 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-nebula-supernova">Compliance</p>
              <p className="mt-3 text-sm leading-7 text-white/70">{complianceDisclaimer}</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="panel p-6 sm:p-8">
            {sent ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-white">Message sent</h2>
                <p className="mt-3 text-sm text-white/60">
                  Thank you for reaching out. We&apos;ll respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-nebula-sundust transition hover:text-white"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-white/75">
                    First name <span className="text-nebula-supernova">*</span>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="John"
                      required
                      className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-nebula-supernova/50"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-white/75">
                    Last name <span className="text-nebula-supernova">*</span>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                      required
                      className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-nebula-supernova/50"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm text-white/75">
                  Email <span className="text-nebula-supernova">*</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                    className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-nebula-supernova/50"
                  />
                </label>

                <label className="grid gap-2 text-sm text-white/75">
                  Subject
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Order inquiry, product question, partnership"
                    className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-nebula-supernova/50"
                  />
                </label>

                <label className="grid gap-2 text-sm text-white/75">
                  Message <span className="text-nebula-supernova">*</span>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    required
                    className="rounded-[1.5rem] border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-nebula-supernova/50"
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-nebula-sundust disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
