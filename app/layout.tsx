import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { AgeGate } from '@/components/age-gate';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nebula H.Y.L.ING — Premium Research Peptides | Health, Youth & Longevity',
  description:
    'Shop premium research peptides at Nebula H.Y.L.ING. BPC-157, TB-500, Retatrutide, Tirzepatide, and more. Each batch independently tested by Janoshik Analytical. For research use only.',
  keywords: 'research peptides, BPC-157, TB-500, Retatrutide, Tirzepatide, peptide stacks, Nebula, HYLING',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-black font-sans text-white antialiased`}>
        <CartProvider>
          <div className="min-h-screen bg-hero-radial">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
          <AgeGate />
        </CartProvider>
      </body>
    </html>
  );
}
