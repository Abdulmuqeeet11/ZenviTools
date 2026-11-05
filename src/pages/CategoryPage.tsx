import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CategoryInfo } from '../types/tools';
import { getToolsByCategory } from '../data/toolsRegistry';
import { ToolCard } from '../components/ToolCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { usePageSeo } from '../components/ToolPageLayout';
import { handleLinkClick } from '../utils/navigation';

export const CategoryPage: React.FC<{ category: CategoryInfo }> = ({
  category,
}) => {
  usePageSeo(
    `${category.name} – Free Online Tools | Zenvi Tools`,
    category.description,
    `/${category.slug}`
  );

  const tools = getToolsByCategory(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5B4D7A] dark:text-[#B5A6D6]">
          <li>
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="hover:text-[#7045C6] dark:hover:text-[#A985FF]"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5 text-[#8C7CAE]" />
          </li>
          <li className="font-semibold text-[#38205F] dark:text-[#F3EEFF]" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#38205F] dark:text-[#F3EEFF]">
          {category.name}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#4A3B69] dark:text-[#C4B6E3] max-w-3xl">
          {category.description}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <AdPlaceholder slotName={`${category.name} – Bottom`} />
    </div>
  );
};
