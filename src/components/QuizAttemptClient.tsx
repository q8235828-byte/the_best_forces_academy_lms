"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import QuizEngine from '@/components/QuizEngine';
import { 
  ArrowLeft, 
  Shield, 
  BookOpen, 
  Download, 
  Play, 
  Clock, 
  CheckCircle, 
  Layers, 
  Award,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { Quiz, QuizQuestion } from '@/types';
import { getRandomVerbalQuizQuestions } from '@/lib/verbal-questions-bank';
import { getRandomNonVerbalQuizQuestions } from '@/lib/non-verbal-questions-bank';
import { VERBAL_REASONING_TYPES, NON_VERBAL_REASONING_TYPES } from '@/lib/quizzes-data';

interface QuizAttemptClientProps {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export default function QuizAttemptClient({ quiz, questions }: QuizAttemptClientProps) {
  const isVerbal = quiz.id === 1;
  const isNonVerbal = quiz.id === 2;
  const isMatric = quiz.id === 3;
  const isInter = quiz.id === 4;
  const isSpecialStep = isVerbal || isNonVerbal || isMatric || isInter;

  const [hasStarted, setHasStarted] = useState(!isSpecialStep);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(() => {
    if (isVerbal) {
      return getRandomVerbalQuizQuestions();
    }
    if (isNonVerbal) {
      return getRandomNonVerbalQuizQuestions();
    }
    return questions;
  });

  const handleStartExam = () => {
    if (isVerbal) {
      setActiveQuestions(getRandomVerbalQuizQuestions());
    } else if (isNonVerbal) {
      setActiveQuestions(getRandomNonVerbalQuizQuestions());
    }
    setHasStarted(true);
  };

  // Determine metadata based on test
  let stepLabel = 'Forces Computerized Simulation';
  let testTitle = quiz.title;
  let testSummary = 'Official forces exam simulation with timer and scoring.';
  let categoriesList: string[] = [];

  if (isVerbal) {
    stepLabel = 'Step 1 of 4 • Computerized Intelligence Exam';
    testTitle = 'Verbal Intelligence Test (100 Questions)';
    testSummary = '100 questions randomly selected (10 questions from each of the 10 verbal reasoning types).';
    categoriesList = VERBAL_REASONING_TYPES;
  } else if (isNonVerbal) {
    stepLabel = 'Step 2 of 4 • Visual & Spatial Intelligence Exam';
    testTitle = 'Non-Verbal Intelligence Test (100 Questions)';
    testSummary = '100 visual pattern questions randomly selected (10 questions from each of the 10 non-verbal spatial types).';
    categoriesList = NON_VERBAL_REASONING_TYPES;
  } else if (isMatric) {
    stepLabel = 'Step 3A • Matric Level Academic Exam';
    testTitle = 'Forces Academic Test - Matriculation Base (50 Questions)';
    testSummary = 'Covers English Grammar, Basic Mathematics, General Science & Physics, Pakistan Studies, and Islamic Studies.';
    categoriesList = [
      'English Grammar & Vocabulary (10 Qs)',
      'Matric Mathematics & Algebra (10 Qs)',
      'General Science & Physics (10 Qs)',
      'Pakistan Studies History & Geography (10 Qs)',
      'Islamic Studies & General Knowledge (10 Qs)'
    ];
  } else if (isInter) {
    stepLabel = 'Step 3B • Intermediate (FSc / ICS) Level Academic Exam';
    testTitle = 'Forces Academic Test - Intermediate Base (50 Questions)';
    testSummary = 'Covers FSc Physics, FSc Mathematics, Advanced English, and Defense/Pakistan Affairs.';
    categoriesList = [
      'FSc Part 1 & 2 Physics (15 Qs)',
      'FSc Mathematics / Calculus / Trigonometry (15 Qs)',
      'Advanced English Structure & Grammar (10 Qs)',
      'Defense Affairs & World General Knowledge (10 Qs)'
    ];
  }

  const pdfGuideUrl = isVerbal ? '/tests/verbal-pdf' : isNonVerbal ? '/tests/non-verbal-pdf' : null;

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#183B2B] bg-white px-3 py-2 rounded-lg border border-gray-200 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Testing Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Shield className="w-4 h-4 text-honor-gold" />
            <span>GHQ • NHQ • Air HQ Computer Terminal</span>
          </div>
        </div>

        {/* Pre-Exam Instructions & Mentor PDF Recommendation */}
        {!hasStarted && isSpecialStep ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                  isMatric
                    ? 'text-blue-800 bg-blue-100'
                    : isInter
                    ? 'text-indigo-800 bg-indigo-100'
                    : 'text-emerald-800 bg-emerald-100'
                }`}>
                  {stepLabel}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                  {testTitle}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {testSummary}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                <div className="text-center px-3">
                  <p className="text-xs text-gray-500 font-bold">Time Limit</p>
                  <p className="text-lg font-black text-[#183B2B]">{quiz.duration_minutes} Mins</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center px-3">
                  <p className="text-xs text-gray-500 font-bold">Passing Mark</p>
                  <p className="text-lg font-black text-emerald-700">{quiz.passing_score}%</p>
                </div>
              </div>
            </div>

            {/* ⭐ Mentor's Recommendation Box (For Verbal and Non-Verbal) ⭐ */}
            {pdfGuideUrl && (
              <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded">
                      ⭐ Mentor Recommendation (Must Read)
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900">
                      Test Shuru Karne Se Pehle 500 Questions Solved PDF Guide Study Karein!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Passing ratio barhane ke liye Mentor ne tamam 10 categories ke 50-50 solved questions (Total 500 Questions) with authentic shortcuts & solutions tayar kiye hain. Is PDF ko read karne se aap ka exam 1st attempt mein 90%+ marks ke sath clear hoga.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={pdfGuideUrl}
                    target="_blank"
                    className="bg-[#183B2B] hover:bg-[#2A5A44] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                  >
                    <Download className="w-4 h-4 text-honor-gold" />
                    <span>Download / View 500 Solved Questions PDF Guide</span>
                  </Link>

                  <button
                    onClick={handleStartExam}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>I Am Ready: Start Exam Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* Academic Track Guidance Banner (For Matric and Inter) */}
            {(isMatric || isInter) && (
              <div className={`p-6 rounded-2xl border-2 space-y-3 ${
                isMatric 
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950' 
                  : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
              }`}>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-700" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Official Armed Forces Academic Examination Standard
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isMatric
                    ? 'Yeh test Pakistan Army (Soldier/Technical), Pakistan Navy (Sailor), aur PAF (Airman/Aero-trade) ke matric qualification syllabus par mushtamil hai. Total 50 questions hain aur time 25 minutes hai.'
                    : 'Yeh test PMA Long Course, PAF GDP / Aeronautical Engineering, aur Pakistan Navy PN Cadet commission exam ke FSc Part 1 & 2 syllabus ke mutabiq hai. Total 50 questions hain aur time 25 minutes hai.'}
                </p>
              </div>
            )}

            {/* Structure of the Exam Subjects / Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Exam Composition & Subject Breakdown:
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeQuestions.length} Questions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                {categoriesList.map((type, idx) => (
                  <div 
                    key={type} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{type}</span>
                    </div>
                    <span className="font-bold text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-100">
                      Standard Ratio
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Button Footer */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Timer starts immediately once you click begin.</span>
              </div>

              <button
                onClick={handleStartExam}
                className={`w-full sm:w-auto font-black px-10 py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all text-white ${
                  isMatric
                    ? 'bg-blue-800 hover:bg-blue-900'
                    : isInter
                    ? 'bg-indigo-800 hover:bg-indigo-900'
                    : 'bg-[#183B2B] hover:bg-[#2A5A44]'
                }`}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch {testTitle}</span>
              </button>
            </div>

          </div>
        ) : (
          /* Interactive Testing Engine */
          <QuizEngine 
            quiz={quiz} 
            questions={activeQuestions} 
          />
        )}

      </div>
    </div>
  );
}
