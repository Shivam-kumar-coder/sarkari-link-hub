'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, ChevronRight, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import linksDataRaw from '@/data/links.json';
import { searchLinks, LinkData } from '@/lib/search';

const linksData = linksDataRaw as LinkData[];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 9;
  const categories = Array.from(new Set(linksData.map(l => l.category)));

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = React.useMemo(() => {
    if (debouncedQuery.length > 1) {
      return searchLinks(linksData, debouncedQuery).slice(0, 5);
    }
    return [];
  }, [debouncedQuery]);

  const handleLinkClick = (slug: string) => {
    return `/links/${slug}.html`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.ceil(linksData.length / itemsPerPage);
  const paginatedLinks = linksData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">Sarkari Link Hub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-emerald-600">Home</Link>
            {categories.slice(0, 4).map(cat => (
              <span key={cat} className="text-sm font-medium text-slate-600 hover:text-emerald-600 cursor-pointer transition-colors">{cat}</span>
            ))}
          </nav>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero & Search */}
        <section className="bg-emerald-700 py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Direct Access to <span className="text-emerald-200">Government Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            >
              Search and find official direct links for tracking, registration, and downloads. No ads, no fluff.
            </motion.p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto" ref={searchRef}>
              <div className={`relative flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-300 ${isSearchFocused ? 'ring-4 ring-emerald-400/30' : ''}`}>
                <div className="pl-5 text-slate-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Try 'udyam check' or 'pan status'..."
                  className="w-full py-5 px-4 bg-transparent outline-none text-lg text-slate-800 placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="pr-5 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {isSearchFocused && results.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left"
                  >
                    {results.map((link) => (
                      <Link 
                        key={link.id} 
                        href={`/links/${link.slug}.html`}
                        className="flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{link.title}</p>
                          <p className="text-xs text-slate-500">{link.category}</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Categories Slider */}
        <section className="py-8 bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              <button className="whitespace-nowrap px-6 py-2 rounded-full bg-emerald-600 text-white font-medium shadow-md shadow-emerald-200">All Services</button>
              {categories.map(cat => (
                <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Links Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Popular Services</h2>
            <p className="text-sm text-slate-500">Showing {paginatedLinks.length} of {linksData.length} links</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLinks.map((link) => (
              <motion.div 
                key={link.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {link.category}
                  </span>
                  <Link href={`/links/${link.slug}.html`} className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                    <ArrowRight size={20} />
                  </Link>
                </div>
                <Link href={`/links/${link.slug}.html`}>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {link.title}
                  </h3>
                </Link>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                  {link.shortDescription}
                </p>
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/links/${link.slug}.html`}
                    className="flex-grow text-center py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold rounded-xl transition-colors text-sm"
                  >
                    View Details
                  </Link>
                  <a 
                    href={link.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    title="Direct Official Link"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-xl border border-slate-200 font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                <span className="font-display font-bold text-xl tracking-tight text-white">Sarkari Link Hub</span>
              </div>
              <p className="max-w-sm mb-6">
                The most reliable directory for official government service links. We help you find the right portal without the confusion of ads or third-party blogs.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Top Categories</h4>
              <ul className="space-y-4 text-sm">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat}><Link href="#" className="hover:text-emerald-400 transition-colors">{cat}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Sarkari Link Hub. All rights reserved. This is an independent directory and not affiliated with any government entity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
