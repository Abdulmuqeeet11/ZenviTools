import type { Metadata } from 'next';
import { LegalPages } from '../../views/LegalPages';

export const metadata: Metadata = {
  title: 'Contact Us – Zenvi Tools',
  description:
    'Get in touch with the Zenvi Tools team for feedback, bug reports, or general inquiries.',
};

export default function Page() {
  return <LegalPages page="contact" />;
}
