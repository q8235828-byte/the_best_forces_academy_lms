"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { VERBAL_500_BANK, BankQuestion } from '@/lib/verbal-questions-bank';
import { VERBAL_REASONING_TYPES } from '@/lib/quizzes-data';
import { 
  Printer, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  FileText, 
  Shield, 
  BookOpen, 
  Search,
  Filter,
  Award
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function VerbalPdfGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = VERBAL_500_BANK.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category_id === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-6 text-slate-900 print:bg-white print:py-0 print:text-black">
      
      {/* 1. Interactive Control Header (Hidden when printing) */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 space-y-4">
        
        {/* Top Breadcrumb & Action Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#183B2B] bg-slate-50 px-3 py-2 rounded-xl border border-gray-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Tests Hub</span>
            </Link>

            <span className="text-xs font-bold text-gray-500 hidden md:inline">
              Step 1 Preparation Material • 500 Questions Solved Bank
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial bg-[#183B2B] hover:bg-[#2A5A44] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Printer className="w-4 h-4 text-honor-gold" />
              <span>Print / Save as PDF (A4)</span>
            </button>

            <Link
              href="/tests/quiz/1"
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 100-Question Exam</span>
            </Link>
          </div>
        </div>

        {/* Category Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#183B2B]"
              />
            </div>

            {/* Questions Counter */}
            <div className="text-xs font-bold text-gray-600 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Showing {filteredQuestions.length} of 500 Questions
              </span>
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#183B2B] text-white shadow-sm'
                  : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200'
              }`}
            >
              All 10 Categories (500 Qs)
            </button>

            {VERBAL_REASONING_TYPES.map((catName, idx) => {
              const catId = idx + 1;
              const isSelected = selectedCategory === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200'
                  }`}
                >
                  {catId}. {catName} (50)
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Official Printable Document Paper (A4 Standard Format) */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-300 shadow-xl print:shadow-none print:border-none rounded-3xl print:rounded-none overflow-hidden p-8 sm:p-12 print:p-0">
        
        {/* Document Official Header Banner */}
        <div className="border-b-2 border-[#183B2B] pb-6 mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#183B2B]">
            <Shield className="w-4 h-4 text-honor-gold" />
            <span>{ACADEMY_CONFIG.name} • Official Armed Forces Training</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            GHQ / NHQ / AIR HQ VERBAL INTELLIGENCE MASTER QUESTION BANK
          </h1>

          <p className="text-xs text-gray-600 font-medium">
            10 Core Categories • 50 Questions per Category • Total 500 Questions with Authentic Keys & Shortcut Explanations
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-bold text-gray-700">
            <span className="bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full border border-amber-300">
              Prepared by: {ACADEMY_CONFIG.leadInstructor} (Lead Instructor)
            </span>
            <span className="text-gray-400">•</span>
            <span>Passing Rate Goal: 95%+</span>
          </div>
        </div>

        {/* 10 Categories Guide Index */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 print:border print:border-gray-300">
          <h2 className="text-xs font-extrabold text-[#183B2B] uppercase tracking-wider mb-3">
            Syllabus Structure & Category Breakdown (50 Questions Each):
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-800">
            {VERBAL_REASONING_TYPES.map((type, idx) => (
              <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                <span className="font-semibold">
                  <strong className="text-emerald-700">{idx + 1}.</strong> {type}
                </span>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  50 Qs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Render List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => (
            <div 
              key={q.id}
              className="p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 bg-white transition-all space-y-3 break-inside-avoid print:border-gray-300 print:mb-4 print:p-4"
            >
              {/* Question Header & Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#183B2B] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {q.category}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-semibold">
                  Bank Q#{q.id}
                </span>
              </div>

              {/* Question Statement */}
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                {q.question_text}
              </p>

              {/* Options 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optVal = q[`option_${optKey.toLowerCase()}` as keyof BankQuestion] as string;
                  const isCorrect = q.correct_option === optKey;

                  return (
                    <div
                      key={optKey}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-slate-50/50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-black shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {optKey}
                      </span>
                      <span className="truncate">{optVal}</span>
                      {isCorrect && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Solution / Shortcut Explanation */}
              <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-amber-900 uppercase text-[10px] tracking-wide block">
                  Correct Key: [{q.correct_option}] • Solution & Shortcut:
                </span>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {q.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Document Footer (Printable & Screen) */}
        <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center space-y-2 text-xs text-gray-500">
          <p className="font-bold text-gray-700">
            {ACADEMY_CONFIG.name} — Computerized Intelligence Preparation Hub
          </p>
          <p>
            Official Online Portal: {ACADEMY_CONFIG.domain} • Helpline: {ACADEMY_CONFIG.phone}
          </p>
          <p className="text-[11px] text-gray-400 italic">
            Confidential study document for enrolled cadets & registered candidates. Unauthorized duplication is strictly prohibited.
          </p>
        </div>

      </div>

      {/* Floating Action Button (Only on screen) */}
      <div className="no-print fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={() => window.print()}
          className="bg-[#183B2B] hover:bg-[#2A5A44] text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
          title="Print Document or Save as PDF"
        >
          <Printer className="w-5 h-5 text-honor-gold" />
        </button>
      </div>

    </div>
  );
}
