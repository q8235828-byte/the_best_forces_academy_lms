"use client";

import React from 'react';
import Link from 'next/link';
import WATEngine from '@/components/WATEngine';
import { ArrowLeft, Award, Shield } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function WATPage() {
  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#183B2B] bg-white px-3 py-2 rounded-lg border border-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Testing Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Award className="w-4 h-4 text-honor-gold" />
            <span>ISSB Psychological Testing Battery • {ACADEMY_CONFIG.domain}</span>
          </div>
        </div>

        {/* 10-Second WAT Engine */}
        <WATEngine />

      </div>
    </div>
  );
}
