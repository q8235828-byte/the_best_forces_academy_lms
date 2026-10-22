import React from 'react';
import Link from 'next/link';
import { Shield, Award, CheckCircle, Play, FileText, ArrowRight, MessageCircle, Star } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0F261C] via-[#183B2B] to-[#0F261C] text-white py-16 lg:py-24 overflow-hidden border-b border-[#2A5A44]">
      {/* Background Decorative Rings & Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Shield className="w-[600px] h-[600px] text-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2A5A44]/80 border border-honor-gold/40 text-honor-gold text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-honor-gold" />
              <span>Official LMS Platform • bestforcesacademy.net</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Wear The Uniform.<br />
              <span className="text-honor-gold drop-shadow-md">Lead With Honor.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed">
              Pakistan&apos;s ultimate online academy for <strong>Army, Navy, PAF initial computerized intelligence tests, academic screening, and ISSB preparation</strong> under the personal guidance of <strong>{ACADEMY_CONFIG.leadInstructor}</strong>.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5 bg-[#0F261C] px-3 py-1.5 rounded-lg border border-[#2A5A44]">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Lesson 1 Always Free
              </span>
              <span className="flex items-center gap-1.5 bg-[#0F261C] px-3 py-1.5 rounded-lg border border-[#2A5A44]">
                <CheckCircle className="w-4 h-4 text-honor-gold" />
                GHQ/AirHQ Computerized Engine
              </span>
              <span className="flex items-center gap-1.5 bg-[#0F261C] px-3 py-1.5 rounded-lg border border-[#2A5A44]">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                10-Second WAT Simulator
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto bg-honor-gold hover:bg-honor-dark text-slate-950 px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Explore All 41 Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tests"
                className="w-full sm:w-auto bg-[#2A5A44] hover:bg-[#346d53] text-white px-7 py-3.5 rounded-xl font-bold text-sm border border-honor-gold/30 shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Take Free Mock Test</span>
              </Link>

              <a
                href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Sir Faryad Tabassum, I need admission guidance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Sir Faryad</span>
              </a>
            </div>
          </div>

          {/* Right Hero Column: Authority & Academy Badge Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#2A5A44]/90 to-[#0F261C] p-7 rounded-3xl border-2 border-honor-gold/40 shadow-2xl space-y-6 relative">
              <div className="flex items-center gap-4 border-b border-[#183B2B] pb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#183B2B] border-2 border-honor-gold flex items-center justify-center shadow-md">
                  <Shield className="w-8 h-8 text-honor-gold" />
                </div>
                <div>
                  <div className="text-xs text-honor-gold font-bold uppercase tracking-wider">
                    Academy Leadership
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {ACADEMY_CONFIG.leadInstructor}
                  </h3>
                  <div className="text-xs text-gray-300">
                    Chief Defense Mentor & Selection Strategist
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#0F261C]/80 p-3.5 rounded-xl border border-[#2A5A44]">
                  <div className="text-2xl font-black text-honor-gold">41</div>
                  <div className="text-[11px] text-gray-300 font-medium">Defense & Prep Courses</div>
                </div>
                <div className="bg-[#0F261C]/80 p-3.5 rounded-xl border border-[#2A5A44]">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-gray-300 font-medium">Free Demo Lesson 1</div>
                </div>
                <div className="bg-[#0F261C]/80 p-3.5 rounded-xl border border-[#2A5A44]">
                  <div className="text-2xl font-black text-blue-400">10s WAT</div>
                  <div className="text-[11px] text-gray-300 font-medium">ISSB Psychological Engine</div>
                </div>
                <div className="bg-[#0F261C]/80 p-3.5 rounded-xl border border-[#2A5A44]">
                  <div className="text-2xl font-black text-white">Edge D1</div>
                  <div className="text-[11px] text-gray-300 font-medium">High Speed Cloudflare</div>
                </div>
              </div>

              <div className="p-4 bg-[#183B2B]/70 rounded-xl border border-honor-gold/30 text-xs text-gray-200 leading-relaxed">
                <strong>Direct Helpline & Enrollment:</strong>
                <div className="text-honor-gold font-bold text-sm mt-0.5">
                  {ACADEMY_CONFIG.phone} • {ACADEMY_CONFIG.supportEmail}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
