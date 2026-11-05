import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'Terms and Conditions – Zenvi Tools',
  description: 'Read the Terms and Conditions for using Zenvi Tools online utilities.',
};

export default function Page() {
  return <LegalPages page="terms" />;
}
