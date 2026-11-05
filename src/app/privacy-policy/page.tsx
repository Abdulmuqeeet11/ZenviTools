import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'Privacy Policy – Zenvi Tools',
  description:
    'Read the Zenvi Tools Privacy Policy covering local browser file processing, cookies, third-party APIs, and advertising.',
};

export default function Page() {
  return <LegalPages page="privacy-policy" />;
}
