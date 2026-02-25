import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'Sarkari Link Hub - Official Government Services Directory',
    template: '%s | Sarkari Link Hub'
  },
  description: 'Fast, mobile-first directory for all official Indian government services, tracking, and registrations.',
  keywords: ['sarkari result', 'government links', 'udyam registration', 'pan card status', 'aadhar download'],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
