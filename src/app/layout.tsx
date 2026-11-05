import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '../components/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7045C6',
};

export const metadata: Metadata = {
  title: 'Zenvi Tools – All Your Tools. One Place.',
  description:
    'Free, fast, and privacy-first online tools for PDFs, calculators, images, text, and QR codes. Process files directly in your browser with Zenvi Tools.',
  openGraph: {
    type: 'website',
    siteName: 'Zenvi Tools',
    title: 'Zenvi Tools – All Your Tools. One Place.',
    description:
      'Free, fast, and privacy-first online tools for PDFs, calculators, images, text, and QR codes. Process files directly in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenvi Tools – All Your Tools. One Place.',
    description:
      'Free, fast, and privacy-first online tools for PDFs, calculators, images, text, and QR codes.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Zenvi Tools',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    description:
      'All Your Tools. One Place. Free, privacy-first online PDF, calculator, image, text, and QR utilities that run directly in your browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F7F3FF] text-[#1E1533] antialiased selection:bg-[#7045C6]/15 selection:text-[#38205F]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
