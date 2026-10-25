import React from 'react';
import Link from 'next/link';
import { SAMPLE_QUIZZES, VERBAL_REASONING_TYPES, NON_VERBAL_REASONING_TYPES } from '@/lib/quizzes-data';
import { 
  Shield, 
  Clock, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Check, 
  HelpCircle,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function TestsPortalPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-[#183B2B] text-white p-8 sm:p-12 rounded-3xl border border-[#2A5A44] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-3">
            <span className="text-xs text-honor-gold uppercase tracking-widest font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-honor-gold" />
              GHQ • NHQ • Air HQ • ISSB Computerized Mock Test Sequence
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Forces Free Mock Test Simulation Hub
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed">
              Selection centers test candidates in a strict 4-stage sequential battery. Follow the official order below to prepare with authentic countdown timers, question palettes, and instant scorecards.
            </p>
          </div>
        </div>

        {/* 4-Step Sequence Roadmap Indicator */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
            <span>Official Candidate Testing Sequence</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Pass Step by Step
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-[#183B2B] text-honor-gold flex items-center justify-center font-black text-sm shrink-0">
                1
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#183B2B] truncate">Step 1: Verbal Intelligence</p>
                <p className="text-[11px] text-gray-500 truncate">100 Qs • 10 Types</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-[#183B2B] text-honor-gold flex items-center justify-center font-black text-sm shrink-0">
                2
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#183B2B] truncate">Step 2: Non-Verbal</p>
                <p className="text-[11px] text-gray-500 truncate">Pattern & Matrix Tests</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-[#183B2B] text-honor-gold flex items-center justify-center font-black text-sm shrink-0">
                3
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#183B2B] truncate">Step 3: Academic Test</p>
                <p className="text-[11px] text-gray-500 truncate">Physics, Math, English, GK</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-300">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                4
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-amber-950 truncate">Step 4: ISSB Test</p>
                <p className="text-[11px] text-amber-800 truncate">10s Word Association (WAT)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ Mentor's Mandatory Preparation Banner (500 Questions PDF Guides) ⭐ */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-6 sm:p-8 rounded-3xl text-slate-950 shadow-xl border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                ⭐ Mentor Recommendation
              </span>
              <span className="text-xs font-bold text-slate-950 uppercase">
                Must Prepare Before Attempting Step 1 & 2
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
              500 Solved Verbal & 500 Non-Verbal Question Banks & PDFs
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              Verbal aur Non-Verbal tests mein 10, 10 categories se 100 questions puche jaate hain. Mentor ne dono tests ke 500-500 solved questions with authentic shortcuts & diagrams tayar kiye hain. Test shuru karne se pehle in PDFs ko lazmi download aur study karein!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/tests/verbal-pdf"
              target="_blank"
              className="bg-slate-950 hover:bg-slate-900 text-white font-black px-5 py-3.5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-honor-gold" />
              <span>500 Verbal Qs PDF</span>
            </Link>

            <Link
              href="/tests/non-verbal-pdf"
              target="_blank"
              className="bg-[#183B2B] hover:bg-[#2A5A44] text-white font-black px-5 py-3.5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap"
            >
              <Eye className="w-4 h-4 text-honor-gold" />
              <span>500 Non-Verbal PDF</span>
            </Link>
          </div>
        </div>

        {/* Detailed Sequential Tests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Sequential Mock Tests (Start in Order)
            </h2>
            <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
              100% Free Computer Exam Practice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_QUIZZES.map((quiz, index) => {
              const stepNumber = quiz.sequence_number || index + 1;
              const isVerbal = quiz.test_type === 'Verbal';
              const isNonVerbal = quiz.test_type === 'Non-Verbal';
              const isWAT = quiz.test_type === 'WAT';

              return (
                <div
                  key={quiz.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 shadow-sm hover:shadow-xl ${
                    isWAT 
                      ? 'border-amber-400/80 bg-gradient-to-b from-white to-amber-50/30' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isWAT 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          Step {stepNumber}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase">
                          {quiz.test_type} Test
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>{quiz.duration_minutes} Minutes</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-black text-gray-900 text-xl tracking-tight leading-snug">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                          {quiz.description}
                        </p>
                      )}
                    </div>

                    {/* Special 10 Verbal Types Breakdown on Verbal Card */}
                    {isVerbal && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#183B2B] uppercase tracking-wide flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-emerald-600" />
                            10 Core Types of Verbal Included:
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Complete Syllabus
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-700 font-medium">
                          {VERBAL_REASONING_TYPES.map((type, tIdx) => (
                            <div key={type} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                              <span className="text-emerald-600 font-bold">{tIdx + 1}.</span>
                              <span className="truncate">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special 10 Non-Verbal Types Breakdown on Non-Verbal Card */}
                    {isNonVerbal && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#183B2B] uppercase tracking-wide flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            10 Core Types of Non-Verbal Included:
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Visual Syllabus
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-700 font-medium">
                          {NON_VERBAL_REASONING_TYPES.map((type, tIdx) => (
                            <div key={type} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                              <span className="text-emerald-600 font-bold">{tIdx + 1}.</span>
                              <span className="truncate">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Passing: <strong className="text-gray-900">{quiz.passing_score}%</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant Solutions</span>
                      </div>
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    {isVerbal && (
                      <Link
                        href="/tests/verbal-pdf"
                        target="_blank"
                        className="w-full mb-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        <span>Study 500 Solved Verbal Questions PDF</span>
                      </Link>
                    )}

                    {isNonVerbal && (
                      <Link
                        href="/tests/non-verbal-pdf"
                        target="_blank"
                        className="w-full mb-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Study 500 Solved Non-Verbal Questions PDF</span>
                      </Link>
                    )}

                    {isWAT ? (
                      <Link
                        href="/tests/wat"
                        className="w-full bg-[#0F261C] hover:bg-[#183B2B] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-honor-gold text-honor-gold" />
                        <span className="text-white">Launch Step 4: ISSB 10s WAT Simulator</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    ) : (
                      <Link
                        href={`/tests/quiz/${quiz.id}`}
                        className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Begin Step {stepNumber}: {quiz.test_type} Test</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
