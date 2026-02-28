'use client';

import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Search as SearchIcon, X, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
}

export default function Search({ data }: { data: Service[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const popularSearches = ['Passport', 'Drivers License', 'Taxes', 'Grants', 'Benefits'];

  const fuse = new Fuse(data, {
    keys: [
      { name: 'title', weight: 1.0 },
      { name: 'category', weight: 0.5 },
      { name: 'description', weight: 0.3 }
    ],
    threshold: 0.4,
    distance: 100,
    ignoreLocation: true,
  });

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = fuse.search(query).map(r => r.item);
      setResults(searchResults.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-14 pr-14 py-6 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl shadow-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-lg text-slate-900 placeholder-slate-400"
          placeholder="What service are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute mt-4 w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden z-[60]"
          >
            <div className="p-4">
              {query.length === 0 ? (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2 px-4 pb-4">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-full text-sm font-medium transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Matching Services
                  </div>
                  <div className="space-y-1">
                    {results.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/links/${service.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {service.title.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-900">
                              {service.title}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {service.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-slate-400 mb-2 font-medium">No results found for "{query}"</div>
                  <div className="text-sm text-slate-500">Try searching for broader terms like "Travel" or "Business"</div>
                </div>
              )}
            </div>
            {results.length > 0 && (
              <div className="bg-slate-50/50 px-6 py-4 text-xs text-slate-400 flex justify-between items-center border-t border-slate-100">
                <span className="font-medium">Found {results.length} results</span>
                <span className="italic">Press ESC to close</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
