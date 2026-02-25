const paginatedLinks = linksData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

return (
  <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
    {/* Header */}
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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

        <button className
