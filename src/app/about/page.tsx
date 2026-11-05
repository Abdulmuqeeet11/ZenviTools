import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'About Us – Zenvi Tools',
  description:
    'Learn about Zenvi Tools, our privacy-first client-side architecture, and our mission to provide free everyday utilities.',
};

export default function Page() {
  return <LegalPages page="about" />;
}
