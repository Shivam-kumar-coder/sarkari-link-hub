import React from 'react';
import Link from 'next/link';
import { Menu, ChevronRight, Search } from 'lucide-react';

export default function HomePage() {
  // ... aapka existing logic (linksData, categories, etc.) yahan rahega ...

  const paginatedLinks = linksData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Fixed Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">S</div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">Sarkari Link Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-emerald-600">Home</Link>
            {categories.slice(0, 4).map(cat => (
              <span key={cat} className="text-sm font-bold text-slate-500 hover:text-emerald-600 cursor-pointer transition-colors">{cat}</span>
            ))}
          </nav>

          <button className="md:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* 2. Hero & Search - Fixed Overlap */}
        <section className="bg-emerald-700 py-16 md:py-24 px-4 relative z-40">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6 leading-tight">
              Search and find official direct links
            </h1>
            
            {/* Search Input Container */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search services (e.g. Udyam, Aadhar...)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none text-slate-900"
                />
              </div>

              {/* SEARCH RESULTS DROPDOWN - This won't push content now */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] hidden group-focus-within:block">
                <div className="p-4 text-left hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b border-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">Udyam Registration Verify</p>
                    <p className="text-xs text-slate-500">MSME Services</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Filter - Fixed Scrolling */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-50">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {['All Services', ...categories].map((cat) => (
              <button 
                key={cat}
                className="whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-100"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Modern Link Cards Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLinks.map((link, idx) => (
              <div key={idx} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-4 inline-block">
                  {link.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{link.title}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">Official portal for {link.title} and related services.</p>
                <Link href={link.url} className="flex items-center justify-between font-bold text-sm text-emerald-600 group/link">
                  Visit Official Portal
                  <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 5. Fixed Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">S</div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">Sarkari Link Hub</span>
              </div>
              <p className="max-w-sm mb-8 leading-relaxed">
                The most reliable directory for official government service links. No ads, no fluff.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Home</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-8">Top Categories</h4>
              <ul className="space-y-4 text-sm font-medium">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat}>
                    <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> {cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-900 text-center text-xs tracking-widest uppercase text-slate-500">
            <p>&copy; {new Date().getFullYear()} Sarkari Link Hub. Not affiliated with any government entity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
