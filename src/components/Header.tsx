import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LogoIcon } from './Logo';
import { handleLinkClick, navigateTo } from '../utils/navigation';

interface HeaderProps {
  currentPath: string;
}

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'All Tools', path: '/all-tools' },
  { label: 'PDF Tools', path: '/pdf-tools' },
  { label: 'Calculators', path: '/calculators' },
  { label: 'Image Tools', path: '/image-tools' },
  { label: 'Text Tools', path: '/text-tools' },
  { label: 'About', path: '/about' },
];

export const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('zenvi-theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4D9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            setMobileOpen(false);
            handleLinkClick(e, '/');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#38205F] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7045C6] rounded-md"
        >
          <LogoIcon className="w-7 h-7 shrink-0" />
          <span>Zenvi Tools</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#4A3B69]"
        >
          {NAV_LINKS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#7045C6] border-[#7045C6] font-semibold'
                    : 'border-transparent hover:text-[#7045C6] hover:border-[#7045C6]/40'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Dark mode toggle, primary action + mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E4D9FA] bg-[#F7F3FF] text-[#38205F] hover:border-[#7045C6] transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#A985F7]" /> : <Moon className="w-4 h-4 text-[#7045C6]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              navigateTo('/qr-other-tools');
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7045C6]"
          >
            QR & Utilities
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#38205F] hover:bg-[#F7F3FF] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-white border-b border-[#E4D9FA] px-4 py-4 space-y-1"
        >
          {NAV_LINKS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  setMobileOpen(false);
                  handleLinkClick(e, item.path);
                }}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F7F3FF] text-[#7045C6] font-semibold'
                    : 'text-[#38205F] hover:bg-[#F7F3FF]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/qr-other-tools"
            onClick={(e) => {
              setMobileOpen(false);
              handleLinkClick(e, '/qr-other-tools');
            }}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#7045C6] hover:bg-[#F7F3FF]"
          >
            QR & Utility Tools
          </a>
        </nav>
      )}
    </header>
  );
};
