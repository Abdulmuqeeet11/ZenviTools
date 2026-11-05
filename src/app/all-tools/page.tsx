import type { Metadata } from 'next';
import { AllToolsPage } from '../../views/AllToolsPage';

export const metadata: Metadata = {
  title: 'All 87 Free Online Tools – Zenvi Tools',
  description:
    'Browse all 87 free browser-based PDF, calculator, image, text, and QR/utility tools on Zenvi Tools.',
};

export default function Page() {
  return <AllToolsPage />;
}
