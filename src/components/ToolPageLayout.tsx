'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { ToolDefinition } from '../types/tools';
import { getCategoryById, getToolById } from '../data/toolsRegistry';
import { handleLinkClick } from '../utils/navigation';
import { ToolCard } from './ToolCard';
import { AdPlaceholder } from './AdPlaceholder';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function usePageSeo(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    const canonicalUrl = `${window.location.origin}${path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, path]);
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  children,
}) => {
  const category = getCategoryById(tool.category);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  usePageSeo(tool.seoTitle, tool.seoDescription, `/tool/${tool.id}`);

  const relatedTools = tool.relatedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => Boolean(t));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#5B4D7A]">
          <li>
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="hover:text-[#7045C6] transition-colors"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5 text-[#8C7CAE]" />
          </li>
          {category && (
            <>
              <li>
                <a
                  href={`/${category.slug}`}
                  onClick={(e) => handleLinkClick(e, `/${category.slug}`)}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  {category.name}
                </a>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5 text-[#8C7CAE]" />
              </li>
            </>
          )}
          <li className="font-semibold text-[#38205F]" aria-current="page">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* Tool Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#38205F] tracking-tight">
          {tool.name}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#4A3B69] max-w-3xl leading-relaxed">
          {tool.fullDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5B4D7A]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#38205F]">
            <ShieldCheck className="w-4 h-4 text-[#7045C6]" />
            Processed locally in your browser
          </span>
          {tool.supportedFormats && tool.supportedFormats.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Supported formats:{' '}
                <strong className="font-semibold text-[#38205F]">
                  {tool.supportedFormats.join(', ')}
                </strong>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Main Interactive Tool Workspace */}
      <section
        aria-label={`${tool.name} Workspace`}
        className="bg-white border border-[#E4D9FA] rounded-2xl p-5 sm:p-8 shadow-[0_4px_24px_rgba(112,69,198,0.06)]"
      >
        {children}
      </section>

      {/* Clearly Separated Advertisement Placeholder (away from upload/download controls) */}
      <AdPlaceholder slotName={`${tool.name} – Below Workspace`} />

      {/* Instructions & Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <section className="bg-white border border-[#E4D9FA] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#38205F] mb-4">
            How to Use {tool.name}
          </h2>
          <ol className="space-y-3 text-sm text-[#4A3B69]">
            {tool.instructions.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F7F3FF] border border-[#D6C6F7] text-[#7045C6] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {tool.examples && tool.examples.length > 0 ? (
          <section className="bg-white border border-[#E4D9FA] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#38205F] mb-4">
              Examples
            </h2>
            <div className="space-y-3">
              {tool.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] p-3.5 text-sm"
                >
                  <p className="text-xs font-semibold text-[#7045C6] mb-1">
                    Input
                  </p>
                  <p className="font-mono-tabular text-[#38205F] mb-2">
                    {ex.input}
                  </p>
                  <p className="text-xs font-semibold text-[#7045C6] mb-1">
                    Output
                  </p>
                  <p className="font-mono-tabular font-semibold text-[#1E1533]">
                    {ex.output}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="bg-white border border-[#E4D9FA] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#38205F] mb-3">
              Privacy & Security
            </h2>
            <p className="text-sm text-[#4A3B69] leading-relaxed mb-3">
              Zenvi Tools runs {tool.name} directly inside your web browser
              using client-side JavaScript and HTML5 APIs. Your files and inputs
              are never uploaded to or stored on external servers.
            </p>
            <p className="text-sm text-[#4A3B69] leading-relaxed">
              Works on Android Chrome, iPhone Safari, tablets, and desktop
              browsers without installing any software.
            </p>
          </section>
        )}
      </div>

      {/* Tool-Specific FAQs */}
      {tool.faqs.length > 0 && (
        <section className="mt-10 bg-white border border-[#E4D9FA] rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#38205F] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#F0E8FF]">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-[#38205F] hover:text-[#7045C6] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7045C6] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-sm text-[#4A3B69] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#38205F] mb-5">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => (
              <ToolCard key={rel.id} tool={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
