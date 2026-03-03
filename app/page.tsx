'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Search from '@/components/Search';
import CategorySlider from '@/components/CategorySlider';
import ServiceCard from '@/components/ServiceCard';
import Pagination from '@/components/Pagination';
import linksData from '@/data/links.json';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Search as SearchIcon, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Shield, 
  ArrowRight,
  X,
  History,
  Zap,
  BadgeCheck,
  ArrowUpRight
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

// Popular search suggestions
const POPULAR_SEARCHES = [
  'Aadhaar Card', 
  'PAN Card', 
  'GST Registration', 
  'Passport', 
  'Voter ID', 
  'Driving License'
];

// Recent searches (in a real app, this would come from localStorage)
const RECENT_SEARCHES = [
  'Income Tax Return',
  'Udyam Registration',
  'EPF Passbook'
];

export default function DirectoryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const cats = new Set(linksData.map(item => item.category));
    return Array.from(cats).sort();
  }, []);

  const filteredData = useMemo(() => {
    let data = linksData;
    
    // Apply category filter
    if (activeCategory !== 'All') {
      data = data.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    return data;
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSearchSuggestions(false);
    
    // Add to recent searches (avoid duplicates)
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section with Enhanced Search */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 pt-28 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-indigo-500/30 to-emerald-500/30 rounded-full blur-[150px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
            className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-r from-emerald-500/30 to-indigo-500/30 rounded-full blur-[150px]"
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-8 border border-white/20 shadow-lg"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>Trusted by over 1 million citizens</span>
            <BadgeCheck className="w-4 h-4 text-emerald-400 ml-2" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]"
          >
            Find Government{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-emerald-300 to-teal-300">
              Services Instantly
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-indigo-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The most comprehensive directory of official government guides, 
            application forms, and direct links — all verified and updated daily.
          </motion.p>
          
          {/* Enhanced Search Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
            ref={searchRef}
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Search Input Container */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border-2 border-white/20 hover:border-white/30 transition-all duration-300">
                <div className="flex items-center px-6 py-4">
                  <SearchIcon className="w-6 h-6 text-indigo-200 mr-3" />
                  
                  <input
                    type="text"
                    placeholder="Search for any government service (e.g., Aadhaar, PAN, Passport)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchSuggestions(true);
                    }}
                    onFocus={() => setShowSearchSuggestions(true)}
                    className="flex-1 bg-transparent text-white placeholder-indigo-200/70 text-lg outline-none"
                  />
                  
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-indigo-200" />
                    </button>
                  )}
                  
                  <button className="ml-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSearchSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                      {/* Popular Searches */}
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
                          <Zap className="w-4 h-4" />
                          <span>Popular Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_SEARCHES.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <TrendingUp className="w-3 h-3" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            <History className="w-4 h-4" />
                            <span>Recent Searches</span>
                          </div>
                          <div className="space-y-1">
                            {recentSearches.map((term) => (
                              <button
                                key={term}
                                onClick={() => handleSearch(term)}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-sm transition-colors flex items-center gap-3 group"
                              >
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="flex-1">{term}</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Tips */}
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-emerald-50">
                        <p className="text-xs text-slate-600 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span>Try searching by service name, category, or keywords like "application form"</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 mt-6 text-sm text-indigo-200/80"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Official Links</span>
              </div>
              <div className="w-1 h-1 bg-indigo-300/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Updated Daily</span>
              </div>
              <div className="w-1 h-1 bg-indigo-300/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{linksData.length}+ Services</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="text-sm font-bold text-indigo-200/80 uppercase tracking-[0.2em] mb-8">Browse by Category</div>
            <CategorySlider 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelect={handleCategorySelect} 
            />
          </motion.div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Directory Section */}
      <section className="bg-slate-50 py-24" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Service Directory</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-full mb-4"></div>
              <p className="text-slate-500">
                {searchQuery ? (
                  <>Found <span className="font-semibold text-indigo-600">{filteredData.length}</span> results for "<span className="font-semibold">{searchQuery}</span>"</>
                ) : (
                  <>Showing <span className="font-semibold text-indigo-600">{filteredData.length}</span> services in <span className="font-semibold text-indigo-600">{activeCategory === 'All' ? 'all categories' : activeCategory}</span></>
                )}
              </p>
            </div>

            {/* Active Filters */}
            {(activeCategory !== 'All' || searchQuery) && (
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span className="text-sm text-slate-400">Active filters:</span>
                {activeCategory !== 'All' && (
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-indigo-600 border border-indigo-200 shadow-sm flex items-center gap-2">
                    {activeCategory}
                    <button onClick={() => handleCategorySelect('All')}>
                      <X className="w-4 h-4 hover:text-red-500" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-emerald-600 border border-emerald-200 shadow-sm flex items-center gap-2">
                    "{searchQuery}"
                    <button onClick={clearSearch}>
                      <X className="w-4 h-4 hover:text-red-500" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          {paginatedData.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
            >
              <SearchIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">No services found matching your criteria</p>
              <p className="text-slate-400 mb-6">Try adjusting your search or category filter</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      </section>

      {/* Stats Section - Updated Design */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {linksData.length}+
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Shield className="w-4 h-4 text-indigo-400" />
                Verified Services
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {categories.length}+
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Categories
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <BadgeCheck className="w-4 h-4 text-indigo-400" />
                Official Links
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Free Access
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
