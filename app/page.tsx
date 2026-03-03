'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search as SearchIcon, 
  X, 
  TrendingUp, 
  History, 
  Sparkles,
  ArrowUpRight,
  Command,
  Zap,
  Clock
} from 'lucide-react';

interface SearchProps {
  data: any[];
}

// Popular search suggestions
const POPULAR_SEARCHES = [
  'Aadhaar Card', 
  'PAN Card', 
  'GST Registration', 
  'Passport', 
  'Voter ID', 
  'Driving License',
  'Income Tax Return',
  'Udyam Registration'
];

export default function Search({ data }: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on query
  const suggestions = query.trim() 
    ? data
        .filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="w-full relative">
      {/* Main Search Input */}
      <div className="relative group">
        {/* Animated gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
        
        {/* Search input container */}
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300 shadow-2xl">
          <div className="flex items-center px-5 py-4">
            {/* Search Icon with glow */}
            <div className="relative">
              <SearchIcon className="w-6 h-6 text-indigo-400 mr-3" />
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-50 animate-ping"></div>
            </div>
            
            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for any government service..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg outline-none font-light"
            />
            
            {/* Clear button */}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-gray-800 rounded-full transition-all duration-200 group/btn"
              >
                <X className="w-5 h-5 text-gray-500 group-hover/btn:text-gray-300" />
              </button>
            )}
            
            {/* Search button */}
            <button
              onClick={() => handleSearch(query)}
              className="ml-3 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-600/25 transition-all duration-300 flex items-center gap-2 group/btn"
            >
              <span>Search</span>
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Command hint */}
          <div className="absolute right-24 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-400 border border-gray-700">⌘</kbd>
            <kbd className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-400 border border-gray-700">K</kbd>
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden z-50"
          >
            {/* Popular Searches Section */}
            {!query && (
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-indigo-600/20 rounded-lg">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="group px-4 py-2.5 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-gray-700/50 hover:border-indigo-500/50"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-emerald-600/20 rounded-lg">
                    <History className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800/80 text-gray-300 hover:text-white rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Clock className="w-4 h-4 text-gray-600 group-hover:text-emerald-400" />
                      <span className="flex-1">{term}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {query && suggestions.length > 0 && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-purple-600/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(item.title)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800/80 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <SearchIcon className="w-4 h-4 text-gray-600 group-hover:text-indigo-400" />
                        <div className="flex-1">
                          <span className="text-gray-200 group-hover:text-white text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 group-hover:text-gray-400">
                            in {item.category}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && suggestions.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-2xl mb-4">
                  <SearchIcon className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-2">No services found for "{query}"</p>
                <p className="text-sm text-gray-600">Try different keywords or browse categories</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-900 border-t border-gray-800">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> to search or <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">ESC</kbd> to close</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
