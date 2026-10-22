import React from 'react';
import Link from 'next/link';
import { SAMPLE_QUIZZES } from '@/lib/quizzes-data';
import { Shield, Clock, Award, CheckCircle, ArrowRight, Play, BookOpen } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function TestsPortalPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-[#183B2B] text-white p-8 sm:p-12 rounded-3xl border border-[#2A5A44] shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-xs text-honor-gold uppercase tracking-widest font-bold">
              GHQ • NHQ • Air HQ Standard Simulation
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Computerized Intelligence & Academic Tests
            </h1>
            <p className="text-sm text-gray-200">
              Practice under exact military selection testing algorithms. Includes timer countdowns, Question Palettes, and performance scorecards.
            </p>
          </div>
        </div>

        {/* 10s WAT Banner Special */}
        <div className="bg-gradient-to-r from-[#0F261C] via-[#183B2B] to-[#0F261C] p-6 sm:p-8 rounded-3xl border-2 border-honor-gold/50 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-honor-gold text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
              Exclusive ISSB Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ISSB 10-Second Word Association Test (WAT) Battery
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              1 single English word appears for 10 seconds with automated slide transitions. Type or write sentences under psychological testing pressure.
            </p>
          </div>

          <Link
            href="/tests/wat"
            className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch 10s WAT Simulator</span>
          </Link>
        </div>

        {/* List of Computerized Tests */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Computerized Practice Exams
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase bg-emerald-100 text-emerald-800">
                      {quiz.test_type}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{quiz.duration_minutes} Minutes</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {quiz.title}
                  </h3>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Passing Threshold: {quiz.passing_score}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant Scorecard & Detailed Solutions</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  {quiz.test_type === 'WAT' ? (
                    <Link
                      href="/tests/wat"
                      className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start 10s WAT Battery</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/tests/quiz/${quiz.id}`}
                      className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Begin Computer Test</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
