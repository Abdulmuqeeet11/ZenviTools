import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { searchTools, getCategoryById } from '../data/toolsRegistry';
import { navigateTo } from '../utils/navigation';

interface SearchBarProps {
  initialQuery?: string;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  showDropdown?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearchSubmit,
  placeholder = 'Search 87 tools (e.g., Merge PDF, BMI, Image Compressor)...',
  showDropdown = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matches = useMemo(
    () => (query.trim() ? searchTools(query).slice(0, 8) : []),
    [query]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else {
      navigateTo(`/all-tools?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} role="search" className="relative flex items-center">
        <Search
          className="w-5 h-5 text-[#7B6B9E] absolute left-4 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearchSubmit) onSearchSubmit(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full h-12 sm:h-13 pl-11 pr-32 rounded-2xl bg-white dark:bg-[#120C20] border border-[#D6C6F7] dark:border-[#362859] text-[#1E1533] dark:text-[#F3EEFF] placeholder:text-[#8C7CAE] dark:placeholder:text-[#8E7DB5] text-sm sm:text-base shadow-xs focus:outline-none focus:border-[#7045C6] dark:focus:border-[#A985FF] focus:ring-3 focus:ring-[#7045C6]/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              if (onSearchSubmit) onSearchSubmit('');
            }}
            aria-label="Clear search"
            className="absolute right-24 p-2 text-[#7B6B9E] hover:text-[#38205F] dark:hover:text-[#F3EEFF] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#7045C6] hover:bg-[#5B34AB] rounded-xl transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {showDropdown && open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#171026] border border-[#E4D9FA] dark:border-[#2F224D] rounded-2xl shadow-lg z-30 overflow-hidden text-left">
          {matches.length === 0 ? (
            <div className="px-4 py-4 text-sm text-[#5B4D7A] dark:text-[#B5A6D6]">
              No tools found matching "{query}". Try searching for PDF, Image,
              Calculator, or QR.
            </div>
          ) : (
            <ul className="divide-y divide-[#F3ECFF] dark:divide-[#281C42] max-h-80 overflow-y-auto">
              {matches.map((tool) => {
                const cat = getCategoryById(tool.category);
                return (
                  <li key={tool.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigateTo(`/tool/${tool.id}`);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#F7F3FF] dark:hover:bg-[#211738] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#38205F] dark:text-[#F3EEFF] truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-[#5B4D7A] dark:text-[#B5A6D6] truncate">
                          {tool.shortDescription}
                        </p>
                      </div>
                      <span className="text-xs text-[#7045C6] dark:text-[#A985FF] font-medium shrink-0">
                        {cat?.name.replace(' Tools', '')}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
