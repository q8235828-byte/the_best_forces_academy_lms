import React from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, Mail, MessageCircle, MapPin, Award, CheckCircle } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#0F261C] text-gray-300 border-t border-[#183B2B] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: About Academy */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#183B2B] border border-honor-gold flex items-center justify-center">
                <Shield className="w-6 h-6 text-honor-gold" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  THE BEST FORCES ACADEMY
                </h3>
                <span className="text-xs text-honor-gold font-medium">LMS Platform</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Pakistan&apos;s premier defense preparatory academy empowering candidates for Army, Navy, PAF initial computerized tests, ISSB screening, and Cadet College entrance exams.
            </p>
            <div className="flex items-center gap-2 text-xs bg-[#183B2B] p-2.5 rounded-lg border border-[#2A5A44] text-gray-300">
              <Award className="w-4 h-4 text-honor-gold flex-shrink-0" />
              <span>Under the direct mentorship of <strong>{ACADEMY_CONFIG.leadInstructor}</strong></span>
            </div>
          </div>

          {/* Col 2: Major Course Streams */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-b border-gray-700 pb-2">
              Defense Preparation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses?cat=issb" className="hover:text-honor-gold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-honor-gold" />
                  <span>ISSB Complete Master Course</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=army" className="hover:text-honor-gold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-honor-gold" />
                  <span>Pakistan Army (PMA, TCC, AFNS, Clerk)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=navy" className="hover:text-honor-gold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-honor-gold" />
                  <span>Pakistan Navy (PN Cadet, Sailor, FMT)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=paf" className="hover:text-honor-gold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-honor-gold" />
                  <span>PAF (GDP, CAE, AD, Aerotrade)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=cadet_college" className="hover:text-honor-gold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-honor-gold" />
                  <span>Cadet & Military Colleges Prep</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Testing Portal */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-b border-gray-700 pb-2">
              Testing & Student Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tests" className="hover:text-honor-gold transition-colors">
                  GHQ / Air HQ Initial Mock Tests
                </Link>
              </li>
              <li>
                <Link href="/tests/wat" className="hover:text-honor-gold transition-colors">
                  ISSB 10-Second WAT Simulator
                </Link>
              </li>
              <li>
                <Link href="/portal/leaderboard" className="hover:text-honor-gold transition-colors">
                  National Candidate Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/admission-form" className="hover:text-honor-gold transition-colors">
                  Online Admission & Roll Slip (PDF)
                </Link>
              </li>
              <li>
                <Link href="/admin/courses" className="hover:text-honor-gold transition-colors text-amber-400">
                  Admin Control & Student Registry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Mentor */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-b border-gray-700 pb-2">
              Official Academy Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-honor-gold mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400">Direct Contact & Helpline:</div>
                  <a href={`tel:${ACADEMY_CONFIG.phoneRaw}`} className="text-white font-semibold hover:text-honor-gold">
                    {ACADEMY_CONFIG.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400">Official WhatsApp:</div>
                  <a 
                    href={ACADEMY_CONFIG.whatsappUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#25D366] font-semibold hover:underline"
                  >
                    +92 305 4599659 (Chat Now)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-honor-gold mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400">Support Email:</div>
                  <a href={`mailto:${ACADEMY_CONFIG.supportEmail}`} className="text-gray-200 hover:text-white">
                    {ACADEMY_CONFIG.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-honor-gold mt-1 flex-shrink-0" />
                <div className="text-xs text-gray-300">
                  The Best Forces Academy • {ACADEMY_CONFIG.domain}
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} {ACADEMY_CONFIG.name}. All Rights Reserved. Lead Instructor: {ACADEMY_CONFIG.leadInstructor}.
          </div>
          <div className="flex gap-4">
            <span>Domain: <strong>{ACADEMY_CONFIG.domain}</strong></span>
            <span>•</span>
            <span>Currency: <strong>{ACADEMY_CONFIG.currency}</strong></span>
            <span>•</span>
            <span className="text-emerald-400">Cloudflare Edge Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
