import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell py-16 sm:py-20">
      <div className="panel mx-auto max-w-3xl p-8 text-center sm:p-12">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">That page drifted out of orbit.</h1>
        <p className="mt-4 copy-muted">
          The page you requested does not exist. Check the URL or browse our product catalog below.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-nebula-sundust"
        >
          Return home
        </Link>
        <Link
          href="/products"
          className="mt-4 ml-3 inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-nebula-supernova/50 hover:bg-white/5"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
