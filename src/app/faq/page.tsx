import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions – Zenvi Tools',
  description:
    'Answers to common questions about Zenvi Tools, privacy, file formats, and browser compatibility.',
};

export default function Page() {
  return <LegalPages page="faq" />;
}
