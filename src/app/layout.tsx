import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { ACADEMY_CONFIG } from '@/lib/constants';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${ACADEMY_CONFIG.name} | Pakistan Army, Navy, PAF & ISSB Preparation`,
  description: `Official LMS for ${ACADEMY_CONFIG.name} (${ACADEMY_CONFIG.domain}). Guided by ${ACADEMY_CONFIG.leadInstructor}. Initial computer tests, intelligence questions, 10s WAT, and ISSB prep.`,
  keywords: [
    'Forces Academy LMS',
    'Pakistan Army initial test prep',
    'PMA Long Course preparation',
    'PAF GDP CAE preparation',
    'Pakistan Navy PN Cadet',
    'ISSB preparation online',
    'Sir Faryad Tabassum',
    'Verbal Non Verbal Intelligence Tests',
    'bestforcesacademy.net'
  ],
  authors: [{ name: ACADEMY_CONFIG.leadInstructor }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
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
