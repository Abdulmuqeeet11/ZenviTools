import type { Metadata } from 'next';
import { getCategoryBySlug } from '../../data/toolsRegistry';
import { CategoryPage } from '../../views/CategoryPage';

const category = getCategoryBySlug('pdf-tools')!;

export const metadata: Metadata = {
  title: `${category.name} – Zenvi Tools`,
  description: category.description,
};

export default function Page() {
  return <CategoryPage category={category} />;
}
