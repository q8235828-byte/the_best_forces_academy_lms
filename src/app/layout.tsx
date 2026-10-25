import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { ACADEMY_CONFIG } from '@/lib/constants';

export const viewport: Viewport = {
  themeColor: '#183B2B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bestforcesacademy.com'),
  title: `${ACADEMY_CONFIG.name} | Pakistan Army, Navy, PAF & ISSB Preparation`,
  description: `Official LMS for ${ACADEMY_CONFIG.name} (${ACADEMY_CONFIG.domain}). Guided by ${ACADEMY_CONFIG.leadInstructor}. Initial computer tests, intelligence questions, 10s WAT, and ISSB prep.`,
  keywords: [
    'Forces Academy LMS',
    'Pakistan Army initial test prep',
    'PMA Long Course preparation',
    'PAF GDP CAE preparation',
    'Pakistan Navy PN Cadet',
    'ISSB preparation online',
    'Mentor',
    'Verbal Non Verbal Intelligence Tests',
    'bestforcesacademy.net',
    'bestforcesacademy.com'
  ],
  authors: [{ name: ACADEMY_CONFIG.leadInstructor }],
  openGraph: {
    title: `${ACADEMY_CONFIG.name} | Pakistan Army, Navy, PAF & ISSB Preparation`,
    description: `Official LMS for ${ACADEMY_CONFIG.name}. Initial computer tests, intelligence questions, 10s WAT, and ISSB prep.`,
    url: 'https://bestforcesacademy.com',
    siteName: ACADEMY_CONFIG.name,
    locale: 'en_PK',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-900 selection:bg-[#183B2B] selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
