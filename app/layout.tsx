import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Landmark } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://sarkari-link-hub.vercel.app'),
  title: {
    default: 'sarkari link hub - Official Government Services Directory',
    template: '%s | sarkari link hub'
  },
  description: 'Find and apply for government services easily. Official guides, documents required, and direct application links for 2000+ services.',
  keywords: ['government services', 'apply for passport', 'drivers license renewal', 'social security benefits', 'business registration', 'voter registration', 'official guides'],
  authors: [{ name: 'sks-technologies Team' }],
  creator: 'sarkari link hub',
  publisher: 'sarkari link hub',
  // Metadata for Icons - Next.js will handle this automatically
  icons: {
    icon: [
      { url: '/favicon.ico?v=1' }, // ?v=1 adds cache-busting to force update
      { url: '/favicon.ico?v=1', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: ['/favicon.ico?v=1'],
    apple: [
      { url: '/apple-touch-icon.png?v=1', sizes: '180x180', type: 'image/png' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'GovPortal - Official Government Services Directory',
    description: 'Find and apply for government services easily. Official guides, documents required, and direct application links.',
    url:'https://sarkari-link-hub.vercel.app',
    siteName: 'sarkari link hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/apple-touch-icon.png',
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GovPortal - Official Government Services Directory',
    description: 'Find and apply for government services easily. Official guides, documents required, and direct application links.',
    images: ['/apple-touch-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Structured Data (Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "sarkari link hub",
    "alternateName": ["sarkari link hub", "sarkari link hub 1"],
    "url": "https://sarkari-link-hub.vercel.app"
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Next.js manages metadata, but adding this for legacy browser support */}
        <link rel="icon" href="/favicon.ico?v=1" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=1" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col" suppressHydrationWarning>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <Landmark className="w-8 h-8" />
              <span>GovPortal</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <Link href="/#categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
              <Link href="/#services" className="hover:text-indigo-600 transition-colors">All Services</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
                  <Landmark className="w-6 h-6" />
                  <span>sarkari link hub</span>
                </div>
                <p className="text-sm leading-relaxed">
                  The official directory for all government services. We simplify the process of finding and applying for the services you need.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Categories</Link></li>
                  <li><Link href="/#services" className="hover:text-white transition-colors">Directory</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Accessibility</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 text-center text-xs">
              <p>© {new Date().getFullYear()} GovPortal. All rights reserved. This is a directory portal.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
