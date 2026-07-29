'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice, complianceDisclaimer } from '@/lib/products';

type CheckoutStep = 'info' | 'payment' | 'confirm';

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export default function CheckoutPage() {
  const { items, totalCents, itemCount, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
  });
  const [orderId, setOrderId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0 && !orderId) {
    return (
      <div className="shell py-16 sm:py-20">
        <div className="panel mx-auto max-w-3xl p-8 text-center sm:p-12">
          <h1 className="text-4xl font-semibold text-white">Nothing to check out</h1>
          <p className="mt-4 copy-muted">Add products to your cart first.</p>
          <Link
            href="/products"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="shell py-16 sm:py-20">
        <div className="panel mx-auto max-w-3xl p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10">
            <span className="text-3xl text-green-400">✓</span>
          </div>
          <p className="mt-6 eyebrow">Order confirmed</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Thank you for your order</h1>
          <p className="mt-4 copy-muted">
            Your order <span className="font-semibold text-nebula-supernova">{orderId}</span> has been placed.
            You&apos;ll receive a confirmation email with tracking details shortly.
          </p>
          <p className="mt-6 text-sm text-white/50">
            Order total: <span className="font-semibold text-white">{formatPrice(totalCents)}</span>
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.address) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/ops/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({
            productSlug: i.slug,
            quantity: i.quantity,
            unitPriceCents: i.unitPriceCents,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      setOrderId(data.orderId);
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="shell py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-start">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            {step === 'info' ? 'Shipping information' : 'Review & pay'}
          </h1>

          {/* Progress indicators */}
          <div className="mt-8 flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 'info' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>1</span>
            <span className="h-px flex-1 bg-white/20" />
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 'payment' ? 'bg-white text-black' : 'border border-white/20 text-white/40'}`}>2</span>
          </div>

          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contact</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="First name" value={customer.firstName} onChange={(v) => setCustomer({ ...customer, firstName: v })} required />
                <InputField label="Last name" value={customer.lastName} onChange={(v) => setCustomer({ ...customer, lastName: v })} required />
              </div>
              <InputField label="Email" type="email" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} required />
              <InputField label="Phone (optional)" type="tel" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} />

              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Shipping</p>
              <InputField label="Street address" value={customer.address} onChange={(v) => setCustomer({ ...customer, address: v })} required />
              <div className="grid gap-5 sm:grid-cols-3">
                <InputField label="City" value={customer.city} onChange={(v) => setCustomer({ ...customer, city: v })} required />
                <InputField label="State" value={customer.state} onChange={(v) => setCustomer({ ...customer, state: v })} required />
                <InputField label="ZIP code" value={customer.zip} onChange={(v) => setCustomer({ ...customer, zip: v })} required />
              </div>

              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/30">{complianceDisclaimer}</p>

              <button
                type="submit"
                className="mt-4 flex min-h-14 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-nebula-sundust"
              >
                Continue to payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="mt-8">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="panel p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Shipping to</p>
                <p className="mt-3 text-white">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-white/60">{customer.address}</p>
                <p className="text-sm text-white/60">{customer.city}, {customer.state} {customer.zip}</p>
                <p className="text-sm text-white/60">{customer.email}</p>
                {customer.phone && <p className="text-sm text-white/60">{customer.phone}</p>}
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="mt-3 text-xs text-nebula-supernova transition hover:text-white"
                >
                  Edit
                </button>
              </div>

              <div className="mt-6 panel p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Payment method</p>
                <p className="mt-3 text-sm text-white/60">
                  Pay with credit card, debit card, or crypto. Your payment is processed securely.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'Crypto'].map((m) => (
                    <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-nebula-sundust disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Place order — ${formatPrice(totalCents)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="panel p-6 sm:p-8 lg:sticky lg:top-32">
          <h2 className="text-xl font-semibold text-white">Order summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-white/10 pt-5 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Subtotal</span>
              <span className="text-white">{formatPrice(totalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Shipping</span>
              <span className="text-white/60">Calculated at fulfillment</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-semibold text-white">{formatPrice(totalCents)}</span>
          </div>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-white/40">
            {complianceDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
        {label} {required && <span className="text-nebula-supernova">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-nebula-supernova/50 focus:outline-none focus:ring-1 focus:ring-nebula-supernova/30"
      />
    </div>
  );
}
