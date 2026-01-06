'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  keywords: string[];
}

interface GlobalSearchProps {
  className?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  module: '🔧',
  documentation: '📄',
  standard: '✅',
  country: '🌍',
};

const CATEGORY_LABELS: Record<string, string> = {
  module: 'Module',
  documentation: 'Documentation',
  standard: 'Standard',
  country: 'Country',
};

export function GlobalSearch({ className = '' }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  }, [results, selectedIndex]);

  const navigateToResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    router.push(result.path);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-2 px-3 py-2
          bg-slate-800/50 hover:bg-slate-800
          border border-slate-700 hover:border-slate-600
          rounded-lg text-slate-400 hover:text-slate-200
          transition-all duration-150
          ${className}
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-sm">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-slate-700 rounded">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative min-h-screen flex items-start justify-center pt-[10vh] px-4">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search modules, documentation, countries..."
                  className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-lg focus:outline-none"
                />
                {isLoading && (
                  <div className="w-5 h-5 border-2 border-slate-600 border-t-cyan-500 rounded-full animate-spin" />
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-300"
                >
                  <kbd className="px-1.5 py-0.5 text-xs bg-slate-800 rounded">ESC</kbd>
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query && results.length === 0 && !isLoading && (
                  <div className="px-4 py-8 text-center text-slate-500">
                    No results found for "{query}"
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="py-2">
                    {results.map((result, index) => (
                      <li key={result.id}>
                        <button
                          onClick={() => navigateToResult(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`
                            w-full flex items-start gap-3 px-4 py-3 text-left
                            transition-colors duration-100
                            ${index === selectedIndex ? 'bg-slate-800' : 'hover:bg-slate-800/50'}
                          `}
                        >
                          <span className="text-xl mt-0.5">
                            {CATEGORY_ICONS[result.category] || '📁'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-100 font-medium truncate">
                                {result.title}
                              </span>
                              <span className="px-1.5 py-0.5 text-xs bg-slate-700 text-slate-400 rounded">
                                {CATEGORY_LABELS[result.category] || result.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate mt-0.5">
                              {result.description}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {result.path}
                            </p>
                          </div>
                          <svg 
                            className={`w-4 h-4 mt-1 text-slate-600 ${index === selectedIndex ? 'text-cyan-500' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Quick Links when no query */}
                {!query && (
                  <div className="px-4 py-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'HBS Prometheus', path: '/hbs/prometheus', icon: '🏛️' },
                        { label: 'Documentation', path: '/docs', icon: '📄' },
                        { label: 'AI Ops', path: '/hbs/ai', icon: '🤖' },
                        { label: 'Analytics', path: '/hbs/analytics', icon: '📊' },
                      ].map((link) => (
                        <button
                          key={link.path}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(link.path);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                          <span>{link.icon}</span>
                          <span className="text-sm">{link.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/50">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↵</kbd>
                      <span>Open</span>
                    </span>
                  </div>
                  <span>HBS Global Search</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalSearch;
