'use client';

import React, { useState, useMemo } from 'react';
import Search from '@/components/Search';
import CategorySlider from '@/components/CategorySlider';
import ServiceCard from '@/components/ServiceCard';
import Pagination from '@/components/Pagination';
import linksData from '@/data/links.json';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function DirectoryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(linksData.map(item => item.category));
    return Array.from(cats).sort();
  }, []);

  const filteredData = useMemo(() => {
    let data = linksData;
    if (activeCategory !== 'All') {
      data = data.filter(item => item.category === activeCategory);
    }
    return data;
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-8 border border-indigo-100"
          >
            <Star className="w-4 h-4 fill-indigo-600" />
            <span>Trusted by over 1 million citizens</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
          >
            Find Government <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Services Instantly.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The most comprehensive directory of official government guides, application forms, and direct links.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Search data={linksData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Browse by Category</div>
            <CategorySlider 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelect={handleCategorySelect} 
            />
          </motion.div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="bg-slate-50 py-24" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Service Directory</h2>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mb-6"></div>
            <p className="text-slate-500 max-w-xl">
              Showing {activeCategory === 'All' ? 'all available' : activeCategory} services. 
              Each guide is verified for accuracy and updated regularly.
            </p>
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No services found in this category.</p>
          </div>
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

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">2,000+</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Official Links</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Access</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
