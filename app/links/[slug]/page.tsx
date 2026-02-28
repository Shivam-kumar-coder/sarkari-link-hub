import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ExternalLink, CheckCircle2, FileText, Info, HelpCircle } from 'lucide-react';
import linksData from '@/data/links.json';

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  howToApply: string;
  documentsRequired: string[];
  officialUrl: string;
}

export async function generateStaticParams() {
  return linksData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = linksData.find((s) => s.slug === slug);

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `How to apply for ${service.title} - Official Guide`,
    description: service.description,
    alternates: {
      canonical: `/links/${slug}`,
    },
    openGraph: {
      title: `How to apply for ${service.title} - Official Guide`,
      description: service.description,
      type: 'article',
      url: `/links/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = linksData.find((s) => s.slug === slug) as Service | undefined;

  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to apply for ${service.title}`,
    "description": service.description,
    "step": service.howToApply.split('. ').map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })),
    "tool": service.documentsRequired.map(doc => ({
      "@type": "HowToTool",
      "name": doc
    }))
  };

  return (
    <div className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/#categories`} className="hover:text-indigo-600 transition-colors">{service.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
              <span className="px-3 py-1 bg-indigo-50 rounded-full text-xs uppercase tracking-widest">Official Guide</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-semibold">{service.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {service.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Complete step-by-step guide on how to apply, required documents, and official links.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all group"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6 text-slate-900 font-black text-2xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Info className="w-6 h-6 text-indigo-600" />
                </div>
                <h2>Overview</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-xl">
                {service.overview}
              </p>
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 text-slate-900 font-black text-2xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h2>Application Process</h2>
              </div>
              <div className="space-y-8">
                {service.howToApply.split('. ').map((step, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 pt-1.5 leading-relaxed text-lg font-medium">
                      {step.endsWith('.') ? step : `${step}.`}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 text-slate-900 font-black text-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-500" />
                </div>
                <h2>Required Documents</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.documentsRequired.map((doc, index) => (
                  <li key={index} className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-700 font-bold text-lg">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                    {doc}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-24">
              <h3 className="text-2xl font-black mb-6">Need Assistance?</h3>
              <p className="text-slate-400 mb-8 text-base leading-relaxed">
                If you encounter issues with the official portal, please contact the respective department&apos;s support line directly.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Support Hours</div>
                  <div className="text-sm font-bold">Mon - Fri, 9AM - 5PM</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Response Time</div>
                  <div className="text-sm font-bold">24 - 48 Hours</div>
                </div>
              </div>
              <Link href="/" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">
                Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
