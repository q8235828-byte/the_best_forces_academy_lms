"use client";

import React from 'react';
import Link from 'next/link';
import QuizEngine from '@/components/QuizEngine';
import { ArrowLeft, Shield } from 'lucide-react';
import { Quiz, QuizQuestion } from '@/types';

interface QuizAttemptClientProps {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export default function QuizAttemptClient({ quiz, questions }: QuizAttemptClientProps) {
  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#183B2B] bg-white px-3 py-2 rounded-lg border border-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Testing Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Shield className="w-4 h-4 text-honor-gold" />
            <span>Standard Forces Examination Terminal</span>
          </div>
        </div>

        {/* Interactive Testing Engine */}
        <QuizEngine quiz={quiz} questions={questions} />

      </div>
    </div>
  );
}
