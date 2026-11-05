import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  Image as ImageIcon,
  Type,
  QrCode,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import {
  CATEGORIES,
  TOOLS_REGISTRY,
  getToolsByCategory,
} from '../data/toolsRegistry';
import { ToolCategoryId } from '../types/tools';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { usePageSeo } from '../components/ToolPageLayout';
import { handleLinkClick } from '../utils/navigation';

function getCategoryIcon(id: ToolCategoryId) {
  const cls = 'w-6 h-6 text-[#7045C6]';
  switch (id) {
    case 'pdf':
      return <FileText className={cls} />;
    case 'calculators':
      return <Calculator className={cls} />;
    case 'image':
      return <ImageIcon className={cls} />;
    case 'text':
      return <Type className={cls} />;
    case 'qr-other':
      return <QrCode className={cls} />;
  }
}

const HOME_FAQS = [
  {
    question: 'Are my files uploaded to a server when using Zenvi Tools?',
    answer:
      'No. PDF, image, text, calculator, and QR tools run directly inside your web browser. Your files stay on your device and are never uploaded to external servers.',
  },
  {
    question: 'Is Zenvi Tools free to use on mobile and desktop?',
    answer:
      'Yes. All tools are free to use without registration and are designed to work smoothly on Android phones, iPhones, tablets, and desktop browsers.',
  },
  {
    question: 'Why does the Currency Converter require an internet connection?',
    answer:
      'While all other tools work offline once loaded, the Currency Converter fetches live European Central Bank reference rates from the public Frankfurter API and displays the exact rate date.',
  },
  {
    question: 'Can I convert scanned image-only PDFs to editable Word DOCX?',
    answer:
      'The PDF to editable DOCX tool extracts embedded text from digital PDFs. Scanned PDFs that contain only images without a text layer require an OCR engine and cannot be converted to editable text.',
  },
];

export const HomePage: React.FC = () => {
  usePageSeo(
    'Zenvi Tools – All Your Tools. One Place.',
    'Free, fast, and privacy-first online tools for PDFs, calculators, images, text, and QR codes. Process files directly in your browser.',
    '/'
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const popularTools = TOOLS_REGISTRY.filter((t) => t.popular).slice(0, 8);
  const recentTools = TOOLS_REGISTRY.filter((t) => t.recentlyAdded).slice(0, 4);
  const featuredPdf = getToolsByCategory('pdf').slice(0, 4);
  const featuredCalcs = getToolsByCategory('calculators').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white dark:bg-[#19112B] border-b border-[#E4D9FA] dark:border-[#2E214D] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#38205F] dark:text-[#F3EEFF] tracking-tight leading-tight">
            All Your Tools. One Place.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#4A3B69] dark:text-[#C5B8E0] max-w-2xl mx-auto leading-relaxed">
            Fast, free, and privacy-first online tools for PDFs, calculators,
            images, text, and QR codes. Everything runs directly in your browser
            with no account required.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#5B4D7A] dark:text-[#A998CC]">
            <span>{TOOLS_REGISTRY.length} Free Tools</span>
            <span aria-hidden="true">·</span>
            <span>Client-Side Privacy</span>
            <span aria-hidden="true">·</span>
            <span>Mobile & Desktop Ready</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Browse by Category */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                id="categories-heading"
                className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF]"
              >
                Browse by Category
              </h2>
              <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
                Explore organized toolkits for documents, math, media, writing, and everyday utilities.
              </p>
            </div>
            <a
              href="/all-tools"
              onClick={(e) => handleLinkClick(e, '/all-tools')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#7045C6] dark:text-[#A682FF] hover:underline whitespace-nowrap shrink-0"
            >
              <span>View all {TOOLS_REGISTRY.length} tools</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={(e) => handleLinkClick(e, `/${cat.slug}`)}
                className="group bg-white dark:bg-[#19112B] border border-[#E4D9FA] dark:border-[#2E214D] rounded-2xl p-5 shadow-[0_2px_10px_rgba(112,69,198,0.04)] hover:shadow-[0_8px_24px_rgba(112,69,198,0.10)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-[#7045C6]/50 dark:hover:border-[#A682FF]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#F7F3FF] dark:bg-[#251A3E] border border-[#E4D9FA] dark:border-[#362859] flex items-center justify-center mb-4">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <h3 className="text-base font-bold text-[#38205F] dark:text-[#F3EEFF] group-hover:text-[#7045C6] dark:group-hover:text-[#A682FF] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#5B4D7A] dark:text-[#A998CC] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <p className="mt-4 pt-3 border-t border-[#F3ECFF] dark:border-[#2E214D] text-xs font-semibold text-[#7045C6] dark:text-[#A682FF] font-mono-tabular">
                  {cat.toolCount} tools →
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Popular Tools */}
        <section aria-labelledby="popular-heading">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                id="popular-heading"
                className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF]"
              >
                Popular Tools
              </h2>
              <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
                Most-used everyday utilities across PDF, image, calculator, and QR workflows.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Recently Added Tools */}
        <section aria-labelledby="recent-heading">
          <div className="mb-6">
            <h2
              id="recent-heading"
              className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF]"
            >
              Recently Added Tools
            </h2>
            <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
              Newly added utilities ready to use in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Featured PDF Tools */}
        <section aria-labelledby="featured-pdf-heading">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                id="featured-pdf-heading"
                className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF]"
              >
                Featured PDF & Document Tools
              </h2>
              <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
                Convert images and office files to PDF, or merge, split, and compress PDFs locally.
              </p>
            </div>
            <a
              href="/pdf-tools"
              onClick={(e) => handleLinkClick(e, '/pdf-tools')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#7045C6] dark:text-[#A682FF] hover:underline whitespace-nowrap shrink-0"
            >
              <span>All 20 PDF tools</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPdf.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Featured Calculators */}
        <section aria-labelledby="featured-calc-heading">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                id="featured-calc-heading"
                className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF]"
              >
                Featured Calculators
              </h2>
              <p className="text-sm text-[#5B4D7A] dark:text-[#A998CC] mt-1">
                Instant, accurate math for percentages, finance, grades, health, and dates.
              </p>
            </div>
            <a
              href="/calculators"
              onClick={(e) => handleLinkClick(e, '/calculators')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#7045C6] dark:text-[#A682FF] hover:underline whitespace-nowrap shrink-0"
            >
              <span>All 20 calculators</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCalcs.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* AdSense-Ready Placeholder */}
        <AdPlaceholder slotName="Homepage – Mid Content" />

        {/* FAQ Section */}
        <section
          aria-labelledby="home-faq-heading"
          className="bg-white dark:bg-[#19112B] border border-[#E4D9FA] dark:border-[#2E214D] rounded-2xl p-6 sm:p-8 transition-colors"
        >
          <h2
            id="home-faq-heading"
            className="text-2xl font-bold text-[#38205F] dark:text-[#F3EEFF] mb-5"
          >
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#F0E8FF] dark:divide-[#2E214D]">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-[#38205F] dark:text-[#F3EEFF] hover:text-[#7045C6] dark:hover:text-[#A682FF] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7045C6] dark:text-[#A682FF] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-sm text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
