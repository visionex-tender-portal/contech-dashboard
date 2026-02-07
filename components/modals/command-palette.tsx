'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Building2, Users, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'company' | 'investor' | 'investment';
  title: string;
  subtitle?: string;
  url: string;
}

const quickActions = [
  { icon: TrendingUp, label: 'Browse Investments', url: '/investments' },
  { icon: Building2, label: 'View Companies', url: '/companies' },
  { icon: Users, label: 'Explore Investors', url: '/investors' },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        // TODO: Implement actual search API
        // For now, simulate search results
        const mockResults: SearchResult[] = [];
        setResults(mockResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < (results.length > 0 ? results.length : quickActions.length) - 1
            ? prev + 1
            : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0) {
          router.push(results[selectedIndex].url);
          onClose();
        } else if (!query && selectedIndex < quickActions.length) {
          router.push(quickActions[selectedIndex].url);
          onClose();
        }
      }
    },
    [isOpen, results, selectedIndex, query, router, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, investors, investments..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto"
                />
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      router.push(result.url);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {result.type === 'company' && <Building2 className="w-5 h-5 text-brand-500" />}
                      {result.type === 'investor' && <Users className="w-5 h-5 text-accent-500" />}
                      {result.type === 'investment' && <TrendingUp className="w-5 h-5 text-green-500" />}
                      <div className="text-left">
                        <div className="font-medium text-foreground">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </div>
                {quickActions.map((action, index) => (
                  <button
                    key={action.url}
                    onClick={() => {
                      router.push(action.url);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-5 h-5 text-brand-500" />
                      <span className="font-medium text-foreground">{action.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-muted rounded text-[10px]">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-muted rounded text-[10px]">Enter</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-muted rounded text-[10px]">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
