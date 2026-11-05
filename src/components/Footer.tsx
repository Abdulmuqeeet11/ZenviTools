'use client';
import React from 'react';
import { LogoIcon } from './Logo';
import { handleLinkClick } from '../utils/navigation';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E4D9FA] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-flex items-center gap-2.5 text-lg font-bold text-[#38205F]"
            >
              <LogoIcon className="w-7 h-7" />
              <span>Zenvi Tools</span>
            </a>
            <p className="text-sm text-[#5B4D7A] leading-relaxed">
              All Your Tools. One Place. Fast, free, and privacy-focused online
              utilities that run directly in your browser.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#38205F] mb-3">
              Tool Categories
            </h3>
            <ul className="space-y-2 text-sm text-[#5B4D7A]">
              <li>
                <a
                  href="/pdf-tools"
                  onClick={(e) => handleLinkClick(e, '/pdf-tools')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  PDF & Document Tools
                </a>
              </li>
              <li>
                <a
                  href="/calculators"
                  onClick={(e) => handleLinkClick(e, '/calculators')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Calculator Tools
                </a>
              </li>
              <li>
                <a
                  href="/image-tools"
                  onClick={(e) => handleLinkClick(e, '/image-tools')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Image Tools
                </a>
              </li>
              <li>
                <a
                  href="/text-tools"
                  onClick={(e) => handleLinkClick(e, '/text-tools')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Text Tools
                </a>
              </li>
              <li>
                <a
                  href="/qr-other-tools"
                  onClick={(e) => handleLinkClick(e, '/qr-other-tools')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  QR & Utility Tools
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#38205F] mb-3">
              Popular Utilities
            </h3>
            <ul className="space-y-2 text-sm text-[#5B4D7A]">
              <li>
                <a
                  href="/tool/merge-pdf"
                  onClick={(e) => handleLinkClick(e, '/tool/merge-pdf')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Merge PDF
                </a>
              </li>
              <li>
                <a
                  href="/tool/image-compressor"
                  onClick={(e) => handleLinkClick(e, '/tool/image-compressor')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Image Compressor
                </a>
              </li>
              <li>
                <a
                  href="/tool/percentage-calculator"
                  onClick={(e) => handleLinkClick(e, '/tool/percentage-calculator')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Percentage Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tool/word-counter"
                  onClick={(e) => handleLinkClick(e, '/tool/word-counter')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Word Counter
                </a>
              </li>
              <li>
                <a
                  href="/tool/qr-code-generator"
                  onClick={(e) => handleLinkClick(e, '/tool/qr-code-generator')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  QR Code Generator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#38205F] mb-3">
              Information & Legal
            </h3>
            <ul className="space-y-2 text-sm text-[#5B4D7A]">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLinkClick(e, '/privacy-policy')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, '/terms')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => handleLinkClick(e, '/disclaimer')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleLinkClick(e, '/faq')}
                  className="hover:text-[#7045C6] transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E4D9FA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5F8F]">
          <p>© {currentYear} Zenvi Tools. All rights reserved.</p>
          <p>Client-side processing · Files stay on your device</p>
        </div>
      </div>
    </footer>
  );
};
