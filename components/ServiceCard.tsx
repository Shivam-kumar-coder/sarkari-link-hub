import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  featured?: boolean;
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/links/${service.slug}`}
      className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-12px_rgba(79,70,229,0.12)] transition-all flex flex-col h-full overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
          {service.category}
        </span>
        {service.featured && (
          <div className="p-2 bg-amber-50 rounded-lg">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
        )}
      </div>
      
      <h3 className="relative z-10 text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
        {service.title}
      </h3>
      
      <p className="relative z-10 text-slate-500 text-base line-clamp-2 mb-8 flex-grow font-medium leading-relaxed">
        {service.description}
      </p>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center text-indigo-600 text-sm font-black gap-2 group-hover:gap-3 transition-all">
          <span>View Guide</span>
          <ArrowRight className="w-5 h-5" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </Link>
  );
}
