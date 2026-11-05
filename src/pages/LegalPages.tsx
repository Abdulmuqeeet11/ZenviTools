import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { usePageSeo } from '../components/ToolPageLayout';
import { handleLinkClick } from '../utils/navigation';

export type LegalPageType =
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'disclaimer'
  | 'faq';

const GENERAL_FAQS = [
  {
    q: 'How does Zenvi Tools process my files?',
    a: 'All PDF, image, text, calculator, and QR code tools run locally in your web browser using client-side JavaScript and HTML5 Canvas. Your files are not uploaded to external servers.',
  },
  {
    q: 'Do I need to create an account or pay to use Zenvi Tools?',
    a: 'No. Every tool on Zenvi Tools is free to use without registration, login, or subscriptions.',
  },
  {
    q: 'Which devices and browsers are supported?',
    a: 'Zenvi Tools works on modern desktop browsers (Chrome, Firefox, Safari, Edge) as well as mobile browsers on Android (Chrome) and iOS (Safari).',
  },
  {
    q: 'Are there any limitations on PDF or Office conversions?',
    a: 'Yes. Because conversions happen inside your browser for privacy, complex Word/PowerPoint layouts are simplified to standard PDF typography, and scanned image-only PDFs without embedded text cannot be converted to editable DOCX without an OCR engine.',
  },
  {
    q: 'Where does the Currency Converter get its exchange rates?',
    a: 'The Currency Converter fetches public European Central Bank reference rates from the free Frankfurter API (api.frankfurter.app) and displays the exact rate date.',
  },
];

export const LegalPages: React.FC<{ page: LegalPageType }> = ({ page }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactPrepared, setContactPrepared] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const metaMap: Record<
    LegalPageType,
    { title: string; desc: string; path: string; heading: string }
  > = {
    about: {
      title: 'About Us – Zenvi Tools',
      desc: 'Learn about Zenvi Tools, our privacy-first client-side architecture, and our mission to provide free everyday utilities.',
      path: '/about',
      heading: 'About Zenvi Tools',
    },
    contact: {
      title: 'Contact Us – Zenvi Tools',
      desc: 'Get in touch with the Zenvi Tools team for feedback, bug reports, or general inquiries.',
      path: '/contact',
      heading: 'Contact Us',
    },
    'privacy-policy': {
      title: 'Privacy Policy – Zenvi Tools',
      desc: 'Read the Zenvi Tools Privacy Policy covering local browser file processing, cookies, third-party APIs, and advertising.',
      path: '/privacy-policy',
      heading: 'Privacy Policy',
    },
    terms: {
      title: 'Terms and Conditions – Zenvi Tools',
      desc: 'Read the Terms and Conditions for using Zenvi Tools online utilities.',
      path: '/terms',
      heading: 'Terms and Conditions',
    },
    disclaimer: {
      title: 'Disclaimer – Zenvi Tools',
      desc: 'Read the Zenvi Tools disclaimer regarding calculation accuracy, document conversions, and external exchange rates.',
      path: '/disclaimer',
      heading: 'Disclaimer',
    },
    faq: {
      title: 'Frequently Asked Questions – Zenvi Tools',
      desc: 'Answers to common questions about Zenvi Tools, privacy, file formats, and browser compatibility.',
      path: '/faq',
      heading: 'Frequently Asked Questions',
    },
  };

  const current = metaMap[page];
  usePageSeo(current.title, current.desc, current.path);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <article className="bg-white dark:bg-[#19112B] border border-[#E4D9FA] dark:border-[#2E214D] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 transition-colors">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#38205F] dark:text-[#F3EEFF]">
          {current.heading}
        </h1>

        {page === 'about' && (
          <div className="space-y-4 text-sm sm:text-base text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
            <p>
              <strong>Zenvi Tools</strong> is a free, browser-based utility
              platform built around a simple idea: <em>All Your Tools. One Place.</em>
            </p>
            <p>
              Whether you need to merge or compress a PDF, resize or convert
              images, calculate loan EMIs or grades, clean up text, or generate a
              Wi-Fi QR code, Zenvi Tools brings 87 everyday utilities together in
              a clean, mobile-friendly interface.
            </p>
            <h2 className="text-xl font-bold text-[#38205F] dark:text-[#F3EEFF] pt-2">
              Privacy-First Architecture
            </h2>
            <p>
              Unlike traditional online converters that upload your private
              documents and photos to remote servers, Zenvi Tools processes your
              files locally inside your own web browser using open-source
              libraries. Your documents never leave your device.
            </p>
            <div className="pt-2">
              <a
                href="/all-tools"
                onClick={(e) => handleLinkClick(e, '/all-tools')}
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7045C6] text-white hover:bg-[#5B34AB]"
              >
                Explore All 87 Tools
              </a>
            </div>
          </div>
        )}

        {page === 'contact' && (
          <div className="space-y-6 text-sm sm:text-base text-[#4A3B69] dark:text-[#C5B8E0]">
            <p className="leading-relaxed">
              Have a question, bug report, or tool suggestion? Reach out using
              the contact details below or prepare an inquiry message.
            </p>

            <div className="rounded-xl bg-[#F7F3FF] dark:bg-[#120C20] border border-[#E4D9FA] dark:border-[#2E214D] p-4 text-sm space-y-1">
              <p>
                <strong>Support Email:</strong>{' '}
                <span className="font-mono-tabular text-[#38205F] dark:text-[#F3EEFF]">
                  [contact@yourdomain.com]
                </span>
              </p>
              <p>
                <strong>Operator / Publisher:</strong>{' '}
                <span className="text-[#38205F] dark:text-[#F3EEFF]">
                  [Your Name or Company Name, City, Country]
                </span>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactPrepared(true);
              }}
              className="space-y-4 max-w-lg"
            >
              <div>
                <label className="block text-xs font-semibold text-[#38205F] dark:text-[#F3EEFF] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full rounded-xl border border-[#D6C6F7] dark:border-[#362859] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#38205F] dark:text-[#F3EEFF] mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-[#D6C6F7] dark:border-[#362859] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#38205F] dark:text-[#F3EEFF] mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-[#D6C6F7] dark:border-[#362859] px-3.5 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#7045C6] text-white hover:bg-[#5B34AB] cursor-pointer"
              >
                Prepare Message
              </button>
            </form>

            {contactPrepared && (
              <div className="rounded-xl border border-[#7045C6]/30 dark:border-[#A682FF]/30 bg-[#F7F3FF] dark:bg-[#120C20] p-4 flex items-start gap-2.5 text-sm text-[#38205F] dark:text-[#F3EEFF]">
                <CheckCircle2 className="w-5 h-5 text-[#7045C6] dark:text-[#A682FF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Message Prepared</p>
                  <p className="text-xs text-[#5B4D7A] dark:text-[#A998CC] mt-1">
                    Because Zenvi Tools is a static client-side application
                    without a backend mail server, please send your message
                    directly to{' '}
                    <span className="font-mono-tabular">[contact@yourdomain.com]</span>{' '}
                    once your domain email is configured.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {page === 'privacy-policy' && (
          <div className="space-y-4 text-sm sm:text-base text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
            <p className="text-xs text-[#7B6B9E] dark:text-[#8E7BB8]">
              Effective Date: November 5, 2026
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              1. Local File Processing
            </h2>
            <p>
              Zenvi Tools processes PDFs, images, text, and QR codes locally
              within your web browser. We do not upload, store, or transmit your
              files to our servers.
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              2. Third-Party Services & APIs
            </h2>
            <p>
              When you use the <strong>Currency Converter</strong>, your browser
              requests public exchange-rate data from the Frankfurter API (
              <code>api.frankfurter.app</code>). Standard HTTP request metadata
              (such as your IP address) is handled by that third-party API
              provider.
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              3. Cookies & Future Advertising (Google AdSense)
            </h2>
            <p>
              Zenvi Tools does not currently load third-party advertising
              scripts. If Google AdSense is enabled in the future after
              eligibility and approval, Google and its partners may use cookies
              or web beacons to serve ads based on prior visits to this or other
              websites. Users may opt out of personalized advertising by
              visiting Google Ads Settings.
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              4. Contact Information
            </h2>
            <p>
              For privacy questions, contact{' '}
              <span className="font-mono-tabular">[contact@yourdomain.com]</span>.
            </p>
          </div>
        )}

        {page === 'terms' && (
          <div className="space-y-4 text-sm sm:text-base text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
            <p className="text-xs text-[#7B6B9E] dark:text-[#8E7BB8]">
              Effective Date: November 5, 2026
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Zenvi Tools, you agree to use the utilities
              solely for lawful purposes.
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              2. Authorized Document Use
            </h2>
            <p>
              Tools such as <strong>Unlock PDF</strong> are intended strictly for
              documents you own or are legally authorized to modify.
            </p>
            <h2 className="text-lg font-bold text-[#38205F] dark:text-[#F3EEFF]">
              3. No Warranty
            </h2>
            <p>
              All tools are provided "as is" without warranties of any kind.
              Always keep backup copies of important documents before
              converting or editing them.
            </p>
          </div>
        )}

        {page === 'disclaimer' && (
          <div className="space-y-4 text-sm sm:text-base text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
            <p>
              <strong>Calculators:</strong> Financial, tax, loan EMI, salary,
              GPA, and BMI calculators are provided for informational and
              educational purposes only and do not constitute professional
              financial, tax, or medical advice.
            </p>
            <p>
              <strong>Document Conversions:</strong> Browser-based conversions
              (such as DOCX to PDF, PPTX to PDF, and PDF to DOCX) preserve text
              and basic structure but may not reproduce complex desktop layouts
              or scanned image-only PDFs.
            </p>
            <p>
              <strong>Currency Rates:</strong> Exchange rates are sourced from
              European Central Bank reference data via the Frankfurter API and
              may differ from retail bank or broker rates.
            </p>
          </div>
        )}

        {page === 'faq' && (
          <div className="divide-y divide-[#F0E8FF] dark:divide-[#2E214D]">
            {GENERAL_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left font-semibold text-base text-[#38205F] dark:text-[#F3EEFF] hover:text-[#7045C6] dark:hover:text-[#A682FF] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7045C6] dark:text-[#A682FF] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-sm text-[#4A3B69] dark:text-[#C5B8E0] leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
};
