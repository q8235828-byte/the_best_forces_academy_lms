"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, CheckCircle, Shield, Star, X, ZoomIn, ArrowRight, Trophy } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

interface StoryItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  category: 'defense' | 'academic';
  badge: string;
}

const SUCCESS_STORIES: StoryItem[] = [
  {
    id: 1,
    image: '/images/success-stories/story-1.webp',
    title: 'AFNS Medical Test Cleared — Entry 2026/27',
    subtitle: 'Armed Forces Nursing Services • Approved Online Test & Medical Clearance',
    category: 'defense',
    badge: 'AFNS Selection',
  },
  {
    id: 2,
    image: '/images/success-stories/story-2.webp',
    title: 'Cadet Umme Sara Zafar — AFNS Selected',
    subtitle: 'ASRC Lahore • Initial & Medical Screening Qualified',
    category: 'defense',
    badge: 'ASRC Lahore',
  },
  {
    id: 3,
    image: '/images/success-stories/story-3.webp',
    title: 'Verified Armed Forces Selection Achievement',
    subtitle: 'Computerized Intelligence & Academic Examination Cleared',
    category: 'defense',
    badge: 'Recommended',
  },
  {
    id: 4,
    image: '/images/success-stories/story-4.webp',
    title: 'AFNS 2026 Initial Test Qualified — ASRC Multan',
    subtitle: 'Haroonabad Batch • Cleared 1st Attempt with Mentor Guidance',
    category: 'defense',
    badge: 'ASRC Multan',
  },
  {
    id: 5,
    image: '/images/success-stories/story-5.webp',
    title: 'Defense Forces Initial Test Success',
    subtitle: 'Verbal, Non-Verbal & Academic Test Cleared',
    category: 'defense',
    badge: 'Initial Qualified',
  },
  {
    id: 6,
    image: '/images/success-stories/story-6.webp',
    title: 'Cadet Selection Slip & Merit Achievement',
    subtitle: 'Official Forces Selection Center Verification',
    category: 'defense',
    badge: 'Verified Pass',
  },
  {
    id: 7,
    image: '/images/success-stories/story-7.webp',
    title: 'Armed Forces Induction Milestone',
    subtitle: 'Prepared under The Best Forces Academy LMS',
    category: 'defense',
    badge: 'Honor Roll',
  },
  {
    id: 8,
    image: '/images/success-stories/story-8.webp',
    title: 'Cadet Aqsa Zafar — AFNS 2026 Initial Pass',
    subtitle: 'ASRC Faisalabad • Outstanding Result & Merit Selection',
    category: 'defense',
    badge: 'ASRC Faisalabad',
  },
  {
    id: 9,
    image: '/images/success-stories/story-9.webp',
    title: 'Defense Entry Merit Achievement',
    subtitle: 'Initial Computerized & Physical Screening Cleared',
    category: 'defense',
    badge: 'Merit Pass',
  },
  {
    id: 10,
    image: '/images/success-stories/story-10.webp',
    title: 'Cadet Aneesa Rasheed — AFNS 2026 Initial Pass',
    subtitle: 'ASRC Faisalabad • Approved & Qualified for Next Stage',
    category: 'defense',
    badge: 'ASRC Faisalabad',
  },
  {
    id: 11,
    image: '/images/success-stories/story-11.webp',
    title: 'BISE Lahore 9th & 10th Board Toppers 2026',
    subtitle: '95% Passing Ratio • 1155/1200 Marks • Pattoki Campus Pride',
    category: 'academic',
    badge: '95% Pass Ratio',
  },
];

export default function SuccessStoriesPage() {
  const [filter, setFilter] = useState<'all' | 'defense' | 'academic'>('all');
  const [lightboxItem, setLightboxItem] = useState<StoryItem | null>(null);

  const visibleStories = SUCCESS_STORIES.filter(
    (item) => filter === 'all' || item.category === filter
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#0F261C] via-[#183B2B] to-[#0A1A12] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#2A5A44] relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honor-gold/20 border border-honor-gold/40 text-honor-gold text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Honor • Verified Results</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Our Cadets & <span className="text-honor-gold">Success Stories</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Verified Armed Forces selections (AFNS, PMA Long Course, PAF, Pakistan Navy) and 95%+ BISE Board Toppers mentored by {ACADEMY_CONFIG.name}.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/admission-form"
                className="bg-honor-gold hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Apply & Check Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tests"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-honor-gold" />
                <span>Start Free Practice Tests</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#183B2B] text-honor-gold shadow-sm'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              All Stories ({SUCCESS_STORIES.length})
            </button>
            <button
              onClick={() => setFilter('defense')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'defense'
                  ? 'bg-[#183B2B] text-honor-gold shadow-sm'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              Armed Forces Selections ({SUCCESS_STORIES.filter((s) => s.category === 'defense').length})
            </button>
            <button
              onClick={() => setFilter('academic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'academic'
                  ? 'bg-[#183B2B] text-honor-gold shadow-sm'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              Academic Board Toppers ({SUCCESS_STORIES.filter((s) => s.category === 'academic').length})
            </button>
          </div>
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Click any card to view full-size verification slip</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleStories.map((story) => (
            <div
              key={story.id}
              onClick={() => setLightboxItem(story)}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/4] bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#183B2B]/90 backdrop-blur-sm text-honor-gold text-[10px] font-extrabold uppercase tracking-wider border border-honor-gold/40">
                    {story.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View Full Poster</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#183B2B] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{story.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-2 border-t border-gray-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Verified Student Result</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#183B2B] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base">{lightboxItem.title}</h3>
                <p className="text-xs text-gray-300">{lightboxItem.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 overflow-auto flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
