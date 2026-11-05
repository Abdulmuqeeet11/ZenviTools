import React, { useState, useEffect, createContext, useContext } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { LegalPages, LegalPageType } from './pages/LegalPages';
import { getCategoryBySlug } from './data/toolsRegistry';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('zenvi-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // Ignore storage access errors
  }
  return 'light';
}

const LEGAL_SLUGS: LegalPageType[] = [
  'about',
  'contact',
  'privacy-policy',
  'terms',
  'disclaimer',
  'faq',
];

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('zenvi-theme', theme);
    } catch {
      // Ignore storage access errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const segments = cleanPath.split('/').filter(Boolean);

  let content: React.ReactNode = null;

  if (cleanPath === '/') {
    content = <HomePage />;
  } else if (cleanPath === '/all-tools') {
    content = <AllToolsPage />;
  } else if (segments[0] === 'tool' && segments[1]) {
    content = <ToolDetailPage toolId={segments[1]} />;
  } else if (
    segments.length === 1 &&
    LEGAL_SLUGS.includes(segments[0] as LegalPageType)
  ) {
    content = <LegalPages page={segments[0] as LegalPageType} />;
  } else if (segments.length === 1) {
    const cat = getCategoryBySlug(segments[0]);
    if (cat) {
      content = <CategoryPage category={cat} />;
    }
  }

  if (!content) {
    content = (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-[#171026] border border-[#E4D9FA] dark:border-[#2F224D] rounded-2xl p-8 sm:p-10 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7045C6] dark:text-[#A985FF]">
            404 — Page Not Found
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#38205F] dark:text-[#F3EEFF]">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4A3B69] dark:text-[#C4B6E3]">
            The link may be mistyped or moved. Browse all 87 free tools or return to the homepage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                setPathname('/');
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7045C6] text-white hover:bg-[#5B34AB]"
            >
              Go to Homepage
            </a>
            <a
              href="/all-tools"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/all-tools');
                setPathname('/all-tools');
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#F7F3FF] dark:bg-[#211738] text-[#38205F] dark:text-[#F3EEFF] border border-[#D6C6F7] dark:border-[#362859] hover:bg-[#EDE4FF] dark:hover:bg-[#2C1F4A]"
            >
              Browse All 87 Tools
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      <div className="min-h-screen flex flex-col bg-[#F7F3FF] dark:bg-[#0F0A1A] text-[#1E1533] dark:text-[#F3EEFF] overflow-x-hidden transition-colors duration-150">
        <Header currentPath={cleanPath} />
        <main className="flex-1">{content}</main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
