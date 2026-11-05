import React, { useState, useEffect } from 'react';
import { CATEGORIES, TOOLS_REGISTRY, searchTools } from '../data/toolsRegistry';
import { ToolCategoryId } from '../types/tools';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { usePageSeo } from '../components/ToolPageLayout';

export const AllToolsPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const initialQ = params.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryId | 'all'>('all');

  usePageSeo(
    'All Tools – 87 Free Online Utilities | Zenvi Tools',
    'Browse all 87 free online PDF, calculator, image, text, and QR tools on Zenvi Tools.',
    '/all-tools'
  );

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get('q') || '');
  }, [window.location.search]);

  const filtered = searchTools(query).filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#38205F] dark:text-[#F3EEFF]">
          All Zenvi Tools ({TOOLS_REGISTRY.length})
        </h1>
        <p className="mt-3 text-base text-[#4A3B69] dark:text-[#C5B8E0]">
          Search or filter our complete collection of client-side PDF,
          calculator, image, text, and QR tools.
        </p>
        <div className="mt-6">
          <SearchBar
            initialQuery={query}
            onSearchSubmit={(q) => setQuery(q)}
            showDropdown={false}
          />
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter tools by category"
        className="flex flex-wrap items-center justify-center gap-2 mb-8"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#7045C6] text-white'
              : 'bg-white dark:bg-[#19112B] text-[#38205F] dark:text-[#F3EEFF] border border-[#E4D9FA] dark:border-[#2E214D] hover:border-[#7045C6] dark:hover:border-[#A682FF]'
          }`}
        >
          All ({TOOLS_REGISTRY.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#7045C6] text-white'
                : 'bg-white dark:bg-[#19112B] text-[#38205F] dark:text-[#F3EEFF] border border-[#E4D9FA] dark:border-[#2E214D] hover:border-[#7045C6] dark:hover:border-[#A682FF]'
            }`}
          >
            {cat.name.replace(' Tools', '')} ({cat.toolCount})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#19112B] border border-[#E4D9FA] dark:border-[#2E214D] rounded-2xl p-10 text-center">
          <p className="text-base font-semibold text-[#38205F] dark:text-[#F3EEFF]">
            No tools matched "{query}".
          </p>
          <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
            Try clearing your search or selecting "All" categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7045C6] text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
