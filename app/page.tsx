'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, ChevronRight, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import linksDataRaw from '@/data/links.json';
import { searchLinks, LinkData } from '@/lib/search';

// Type assertion (ensure links.json matches LinkData)
const linksData = linksDataRaw as LinkData[];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 9;

  // Extract unique categories
  const categories = useMemo(
    () => Array.from(new Set(linksData.map((l) => l.category))),
    []
  );

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1); // Reset pagination on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter links based on search query and selected category
  const filteredLinks = useMemo(() => {
    let filtered = linksData;

    if (debouncedQuery.length > 1) {
      filtered = searchLinks(filtered, debouncedQuery);
    }

    if (selectedCategory) {
      filtered = filtered.filter((link) => link.category === selectedCategory);
    }

    return filtered;
  }, [debouncedQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedLinks = useMemo(
    () => filteredLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredLinks, currentPage]
  );

  // Search suggestions (only from current filter scope, limited to 5)
  const suggestions = useMemo(() => {
    if (debouncedQuery.length > 1) {
      return searchLinks(linksData, debouncedQuery).slice(0, 5);
    }
    return [];
  }, [debouncedQuery]);

  // Click outside handler for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search and category filter
  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
              Sarkari Link Hub
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-emerald-600">
              Home
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'text-emerald-600'
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
          <button
            className="md:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow min-h-[70vh]">
        {/* Hero & Search */}
        <section className="bg-emerald-700 py-16 md:py-24 px-4 relative z-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            </div>
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
              Search and find official direct links for tracking, registration, and downloads. No
              ads, no fluff.
            </motion.p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto" ref={searchRef}>
              <div
                className={`relative flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                  isSearchFocused ? 'ring-4 ring-emerald-400/30' : ''
                }`}
              >
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
                  aria-label="Search government services"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="pr-5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {isSearchFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left"
                  >
                    {suggestions.map((link) => (
                      <Link
                        key={link.id}
                        href={`/links/${link.slug}.html`}
                        className="flex items-center justify-between p-4 hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0"
                        onClick={() => setIsSearchFocused(false)}
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
        <section className="py-8 bg-white border-b border-slate-100 overflow-hidden z-10 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar flex-nowrap">
              <button
                onClick={clearFilters}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === null && debouncedQuery.length <= 1
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Links Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {selectedCategory ? selectedCategory : 'Popular Services'}
            </h2>
            <p className="text-sm text-slate-500">
              Showing {paginatedLinks.length} of {filteredLinks.length} links
            </p>
          </div>

          {paginatedLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedLinks.map((link) => (
                <motion.div
                  key={link.id}
                  whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(16 185 129 / 0.05), 0 8px 10px -6px rgb(16 185 129 / 0.05)' }}
                  className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 border border-slate-200/60 shadow-sm hover:border-emerald-200/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-100/50">
                      {link.category}
                    </span>
                    <Link
                      href={`/links/${link.slug}.html`}
                      className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-300"
                      aria-label={`View guide for ${link.title}`}
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>

                  <Link href={`/links/${link.slug}.html`} className="relative z-10 block">
                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-800 transition-colors leading-tight">
                      {link.title}
                    </h3>
                  </Link>

                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed relative z-10">
                    {link.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    <Link
                      href={`/links/${link.slug}.html`}
                      className="flex-grow text-center py-3.5 bg-slate-900 text-white hover:bg-emerald-600 font-bold rounded-2xl transition-all duration-300 text-sm shadow-lg shadow-slate-200 hover:shadow-emerald-200"
                    >
                      View Guide
                    </Link>
                    <a
                      href={link.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="p-3.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-2xl transition-all duration-300"
                      title="Official Portal"
                      aria-label={`Visit official portal for ${link.title}`}
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No services match your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-xl border border-slate-200 font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  S
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  Sarkari Link Hub
                </span>
              </div>
              <p className="max-w-sm mb-8 leading-relaxed text-slate-400">
                The most reliable directory for official government service links. We help you find
                the right portal without the confusion of ads or third-party blogs.
              </p>
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Facebook"
                >
                  <span className="text-white text-xs font-bold">FB</span>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Twitter"
                >
                  <span className="text-white text-xs font-bold">TW</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronRight size={14} /> Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronRight size={14} /> About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronRight size={14} /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronRight size={14} /> Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Top Categories</h4>
              <ul className="space-y-4 text-sm font-medium">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight size={14} /> {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-900 text-center text-xs tracking-widest uppercase text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Sarkari Link Hub. All rights reserved. Not affiliated
              with any government entity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
