import type { Metadata } from 'next';
import { HomePage } from '../views/HomePage';

export const metadata: Metadata = {
  title: 'Zenvi Tools – All Your Tools. One Place.',
  description:
    'Free, fast, and privacy-first online tools for PDFs, calculators, images, text, and QR codes. Process files directly in your browser with Zenvi Tools.',
};

export default function Page() {
  return <HomePage />;
}
