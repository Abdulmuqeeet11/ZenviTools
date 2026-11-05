import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'Disclaimer – Zenvi Tools',
  description:
    'Read the Zenvi Tools disclaimer regarding calculation accuracy, document conversions, and external exchange rates.',
};

export default function Page() {
  return <LegalPages page="disclaimer" />;
}
