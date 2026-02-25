import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ChevronRight, Home, Info, HelpCircle, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import linksDataRaw from '@/data/links.json';
import { LinkData } from '@/lib/search';

const linksData = linksDataRaw as LinkData[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return linksData.map((link) => ({
    slug: `${link.slug}.html`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.replace('.html', '');
  const link = linksData.find((l) => l.slug === cleanSlug);

  if (!link) return { title: 'Not Found' };

  return {
    title: link.title,
    description: link.metaDescription,
    keywords: link.keywords,
    openGraph: {
      title: `${link.title} - Sarkari Link Hub`,
      description: link.metaDescription,
      type: 'article',
    },
  };
}

export default async function LinkPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = slug.replace('.html', '');
  const link = linksData.find((l) => l.slug === cleanSlug);

  if (!link) notFound();

  const relatedLinks = linksData
    .filter((l) => l.category === link.category && l.id !== link.id)
    .slice(0, 3);

  // Structured Data (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": link.title,
    "description": link.metaDescription,
    "step": [
      {
        "@type": "HowToStep",
        "text": link.shortDescription
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">S</div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900 hidden sm:inline">Sarkari Link Hub</span>
          </Link>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 hover:bg-emerald-600 hover:text-white flex items-center gap-2 transition-all">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="hover:text-emerald-600 cursor-pointer">{link.category}</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium truncate">{link.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <article className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                    {link.category}
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                    {link.title}
                  </h1>
                  <p className="text-lg text-slate-600 italic border-l-4 border-emerald-500 pl-4 py-1">
                    {link.shortDescription}
                  </p>
                </div>

                {/* Direct Link Button */}
                <div className="bg-emerald-50 rounded-2xl p-6 mb-10 text-center border border-emerald-100">
                  <p className="text-sm text-emerald-800 font-medium mb-4">Official Direct Link for {link.title}</p>
                  <a 
                    href={link.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Visit Official Portal
                    <ExternalLink size={20} />
                  </a>
                  <p className="mt-4 text-xs text-emerald-600/70">Opens in a new tab. Verified official government link.</p>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                  <ReactMarkdown>{link.content}</ReactMarkdown>
                </div>
              </article>

              {/* FAQs */}
              <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <HelpCircle size={24} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                  {link.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-bold text-slate-900 mb-2 flex gap-2">
                        <span className="text-emerald-600">Q.</span>
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Quick Info */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Info size={20} className="text-emerald-400" />
                  <h3 className="font-bold">Quick Details</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Category</span>
                    <span className="font-medium text-emerald-400">{link.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Type</span>
                    <span className="font-medium">Official Link</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Verified</span>
                    <span className="font-medium text-emerald-400">Yes</span>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              {relatedLinks.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <LinkIcon size={20} className="text-emerald-600" />
                    <h3 className="font-bold text-slate-900">Related Services</h3>
                  </div>
                  <div className="space-y-4">
                    {relatedLinks.map((rel) => (
                      <Link 
                        key={rel.id} 
                        href={`/links/${rel.slug}.html`}
                        className="block p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group"
                      >
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm mb-1">{rel.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{rel.category}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                <h3 className="font-bold text-amber-900 text-sm mb-2">Disclaimer</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sarkari Link Hub is an independent directory. We are not affiliated with the government. Always ensure you are on the official .gov.in or .nic.in domain before entering sensitive details.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20 px-4 border-t border-slate-900 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">S</div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">Sarkari Link Hub</span>
              </div>
              <p className="max-w-sm mb-8 leading-relaxed text-slate-400">
                The most reliable directory for official government service links. We help you find the right portal without the confusion of ads or third-party blogs.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Home</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Top Categories</h4>
              <ul className="space-y-4 text-sm font-medium">
                {linksData.map(l => l.category).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map(cat => (
                  <li key={cat}><Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> {cat}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-900 text-center text-xs tracking-widest uppercase text-slate-500">
            <p>&copy; {new Date().getFullYear()} Sarkari Link Hub. All rights reserved. Not affiliated with any government entity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
