'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CategorySliderProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategorySlider({ categories, activeCategory, onSelect }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group py-4 flex justify-center" id="categories">
      <div className="relative max-w-full">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-xl rounded-full border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all -ml-6"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => onSelect('All')}
            className={`flex-shrink-0 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all snap-start border-2 ${
              activeCategory === 'All'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200'
                : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`flex-shrink-0 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all snap-start border-2 ${
                activeCategory === category
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200'
                  : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-xl rounded-full border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all -mr-6"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
