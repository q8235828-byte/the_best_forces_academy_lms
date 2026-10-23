import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const discountPercent = course.regular_price > course.sale_price
    ? Math.round(((course.regular_price - course.sale_price) / course.regular_price) * 100)
    : 0;

  const categoryLabels: Record<string, { label: string; color: string }> = {
    issb: { label: 'ISSB Master', color: 'bg-honor-gold text-slate-950 font-bold' },
    initial_prep: { label: 'Initial Tests', color: 'bg-emerald-700 text-white font-semibold' },
    army: { label: 'Pakistan Army', color: 'bg-[#183B2B] text-white font-semibold' },
    navy: { label: 'Pakistan Navy', color: 'bg-[#0F3B66] text-white font-semibold' },
    paf: { label: 'PAF Air Force', color: 'bg-[#0284C7] text-white font-semibold' },
    cadet_college: { label: 'Cadet College', color: 'bg-purple-800 text-white font-semibold' },
    entry_test: { label: 'Entry Test', color: 'bg-indigo-700 text-white font-semibold' },
    academics: { label: 'Academics', color: 'bg-teal-700 text-white font-semibold' }
  };

  const badge = categoryLabels[course.category] || { label: 'Forces Prep', color: 'bg-gray-800 text-white' };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Card Header Image / Graphic */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Top Left: Category Badge */}
        <div className="absolute top-3 left-3 flex items-center">
          <span className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider ${badge.color} shadow-sm whitespace-nowrap`}>
            {badge.label}
          </span>
        </div>

        {/* Top Right: Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
            {discountPercent}% OFF
          </div>
        )}

        {/* Bottom Image Bar: Target Gender & Qualification (Zero Collision) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-semibold text-gray-200 border border-white/10 whitespace-nowrap flex-shrink-0">
            For: {course.target_gender}
          </span>
          <span className="bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] text-gray-300 border border-white/10 truncate text-right">
            {course.qualification}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-army transition-colors line-clamp-2 mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {course.syllabus_summary || 'Comprehensive video lectures, open PDF notes, and simulated computer mock tests.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#183B2B]">
                PKR {course.sale_price.toLocaleString()}
              </span>
              {course.regular_price > course.sale_price && (
                <span className="text-xs text-gray-400 line-through">
                  PKR {course.regular_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Free Demo Pill beside Price */}
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm flex-shrink-0">
              <Play className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" /> Free Demo
            </span>
          </div>

          {/* Clean View Course Button */}
          <Link
            href={`/courses/${course.slug}`}
            className="w-full bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-sm border border-[#2A5A44]/60 group-hover:border-honor-gold/60"
          >
            <span>View Course Details</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
