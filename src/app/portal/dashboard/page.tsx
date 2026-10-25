"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  BookOpen, 
  Clock, 
  Award, 
  FileText, 
  MessageCircle, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  TrendingUp, 
  Sparkles,
  PhoneCall,
  User,
  GraduationCap
} from 'lucide-react';
import { getCurrentUser, logoutUser, DEMO_CADET, CadetSession } from '@/lib/auth';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { ACADEMY_CONFIG } from '@/lib/constants';

export const runtime = 'edge';

export default function CadetDashboardPage() {
  const router = useRouter();
  const [cadet, setCadet] = useState<CadetSession | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Default to demo cadet so user can view dashboard seamlessly
      setCadet(DEMO_CADET);
    } else {
      setCadet(user);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  // Dynamically resolve courses granted to this cadet
  const enrolledCourseList = INITIAL_COURSES.filter((course) => 
    cadet?.enrolled_courses?.includes(course.id)
  );
  const displayedCourses = enrolledCourseList.length > 0 ? enrolledCourseList : INITIAL_COURSES.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-[#183B2B] text-white p-6 sm:p-10 rounded-3xl border border-[#2A5A44] shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
            <Shield className="w-96 h-96 text-honor-gold -mr-20 -mt-10" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#0F261C] border-2 border-honor-gold flex items-center justify-center text-honor-gold shadow-lg flex-shrink-0">
                <GraduationCap className="w-8 h-8 sm:w-11 sm:h-11" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active Cadet
                  </span>
                  <span className="text-xs text-honor-gold font-bold">
                    Roll: {cadet?.roll_number || 'BFA-2026-7841'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-white truncate">
                  Cadet {cadet?.full_name || 'Muhammad Hamza'}
                </h1>
                <p className="text-xs text-gray-300 truncate">
                  Target Wing: <span className="text-honor-gold font-semibold">{cadet?.target_wing || 'Pakistan Army'}</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Mentor, I am Cadet ${cadet?.full_name || ''} (Roll: ${cadet?.roll_number || ''}). I need guidance on my course preparation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contact Mentor</span>
              </a>

              <Link
                href="/admission-form"
                className="bg-[#2A5A44] hover:bg-[#356e54] text-honor-gold border border-honor-gold/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Roll Slip</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/50 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Testing Station Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Computerized Tests */}
          <Link
            href="/tests"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Computer Mock Tests
              </h3>
              <p className="text-xs text-slate-500">
                Simulated GHQ / NHQ / Air HQ computerized terminal with real-time countdown & question palette.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all mt-1" />
          </Link>

          {/* Card 2: WAT Simulator */}
          <Link
            href="/tests/wat"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                10s WAT Simulator
              </h3>
              <p className="text-xs text-slate-500">
                ISSB Word Association Test automatic 10-second projection slide engine with psychological tips.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-1 transition-all mt-1" />
          </Link>

          {/* Card 3: Leaderboard */}
          <Link
            href="/portal/leaderboard"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-yellow-700 transition-colors">
                National Leaderboard
              </h3>
              <p className="text-xs text-slate-500">
                Check your rank against top candidates from Lahore, Rawalpindi, Karachi and Peshawar.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-yellow-700 group-hover:translate-x-1 transition-all mt-1" />
          </Link>
        </div>

        {/* Enrolled Courses Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                My Enrolled Courses & Study Modules
              </h2>
              <p className="text-xs text-slate-500">
                Official syllabus, anti-piracy secured video lectures & practice papers
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-[#183B2B] hover:text-honor-gold flex items-center gap-1"
            >
              <span>Explore All 41 Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedCourses.map((course, idx) => (
              <div 
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-slate-800 relative overflow-hidden">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#183B2B]/90 text-honor-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-honor-gold/40">
                    Lesson 1 Free Preview
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Enrolled & Active
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.syllabus_summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full py-2 px-3 bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-honor-gold" />
                      <span>Continue Learning</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
