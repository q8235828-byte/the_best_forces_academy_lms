"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CourseCard from '@/components/CourseCard';
import VideoPlayerWithWatermark from '@/components/VideoPlayerWithWatermark';
import { INITIAL_COURSES, SAMPLE_LESSONS } from '@/lib/courses-data';
import { ACADEMY_CONFIG, PAYMENT_ACCOUNTS } from '@/lib/constants';
import { 
  Shield, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  ArrowRight, 
  MessageCircle,
  FileText,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { CourseCategory } from '@/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 41 Courses' },
    { id: 'issb', label: 'ISSB Master' },
    { id: 'initial_prep', label: 'Initial Tests' },
    { id: 'army', label: 'Pakistan Army' },
    { id: 'navy', label: 'Pakistan Navy' },
    { id: 'paf', label: 'PAF Air Force' },
    { id: 'cadet_college', label: 'Cadet Colleges' },
    { id: 'entry_test', label: 'Entry Tests' },
    { id: 'academics', label: 'School & College' }
  ];

  const filteredCourses = selectedCategory === 'all'
    ? INITIAL_COURSES
    : INITIAL_COURSES.filter((c) => c.category === selectedCategory);

  const demoCourse = INITIAL_COURSES[0];
  const demoLesson = SAMPLE_LESSONS[1][0];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Military Prestige Hero */}
      <Hero />

      {/* 2. Free Demo Lecture Spotlight (Lesson 1 is Always Free Rule) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0F261C] to-[#183B2B] rounded-3xl p-6 sm:p-10 border border-[#2A5A44] text-white shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <Play className="w-3 h-3 fill-emerald-400" />
              100% Free Demo Lecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
              Try Before You Enroll: Free Lecture 1 Access
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2">
              Every course at The Best Forces Academy provides Lecture 1 completely free with no payment required. Watch below with our anti-piracy watermark system.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <VideoPlayerWithWatermark
              course={demoCourse}
              lesson={demoLesson}
              isEnrolled={false}
              studentName="Guest Candidate"
              studentPhone="+92 305 4599659"
            />
          </div>
        </div>
      </section>

      {/* 3. Filterable 41 Course Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-honor-gold uppercase tracking-wider">
              Comprehensive Defense Syllabus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Explore All 41 Master Preparation Courses
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-[#183B2B] hover:text-[#2A5A44] flex items-center gap-1.5"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#183B2B] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.slice(0, 12).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length > 12 && (
          <div className="text-center pt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-[#183B2B] hover:bg-[#2A5A44] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105 text-sm"
            >
              <span>See Remaining {filteredCourses.length - 12} Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Computerized Testing & 10s WAT Callout */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-50 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Box 1: GHQ/AirHQ Mock Tests */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#183B2B] text-honor-gold flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                GHQ / NHQ / Air HQ Computerized Mock Tests
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Practice under strict timer conditions identical to actual military selection center computers. Instant scores, question palettes, and Non-Verbal image reasoning.
              </p>
              <div className="pt-2">
                <Link
                  href="/tests"
                  className="bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow"
                >
                  <span>Launch Computer Mock Test</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Box 2: ISSB 10-Second WAT */}
            <div className="bg-[#0F261C] p-8 rounded-3xl border border-[#2A5A44] shadow-xl text-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2A5A44] text-honor-gold flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                ISSB Official 10-Second WAT Engine
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Experience the authentic Psychological Word Association Test. 1 word every 10 seconds with automated slide transitions. Type or write sentences in real time.
              </p>
              <div className="pt-2">
                <Link
                  href="/tests/wat"
                  className="bg-honor-gold hover:bg-honor-dark text-slate-950 text-xs font-bold px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow"
                >
                  <span>Start 10s WAT Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Easy Manual Pakistani Payment & Instant Enrollment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-honor-dark uppercase tracking-wider">
              Hassle-Free Pakistani Payment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              JazzCash, EasyPaisa & Bank Transfer Accepted
            </h2>
            <p className="text-sm text-gray-500">
              Send fee directly and receive instant batch activation & WhatsApp group invite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-red-600 uppercase">JazzCash</span>
              <div className="text-xl font-bold text-gray-900">{PAYMENT_ACCOUNTS.jazzcash.accountNumber}</div>
              <div className="text-xs text-gray-600">Title: <strong>{PAYMENT_ACCOUNTS.jazzcash.accountTitle}</strong></div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase">EasyPaisa</span>
              <div className="text-xl font-bold text-gray-900">{PAYMENT_ACCOUNTS.easypaisa.accountNumber}</div>
              <div className="text-xs text-gray-600">Title: <strong>{PAYMENT_ACCOUNTS.easypaisa.accountTitle}</strong></div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase">Bank Transfer</span>
              <div className="text-lg font-bold text-gray-900">{PAYMENT_ACCOUNTS.bank.title}</div>
              <div className="text-xs text-gray-600 font-mono">A/C: {PAYMENT_ACCOUNTS.bank.accountNumber}</div>
              <div className="text-xs text-gray-600">Title: <strong>{PAYMENT_ACCOUNTS.bank.accountTitle}</strong></div>
            </div>
          </div>

          <div className="bg-[#183B2B] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base">Made a payment? Send screenshot to Mentor</h4>
              <p className="text-xs text-gray-300">Your account and VIP WhatsApp batch link will be activated in minutes.</p>
            </div>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Mentor, I have transferred the fee for my course. Here is my transaction receipt screenshot.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Receipt on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
