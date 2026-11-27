"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Bookmark, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  LayoutGrid,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz, QuizQuestion } from '@/types';
import { ACADEMY_CONFIG } from '@/lib/constants';

interface QuizEngineProps {
  quiz: Quiz;
  questions: QuizQuestion[];
  onAttemptComplete?: (score: number, timeSpent: number) => void;
}

export default function QuizEngine({ quiz, questions, onAttemptComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [celebratedCategories, setCelebratedCategories] = useState<string[]>([]);
  const [categoryCongrats, setCategoryCongrats] = useState<{
    category: string;
    total: number;
    correct: number;
  } | null>(null);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    const nextAnswers: Record<number, 'A' | 'B' | 'C' | 'D'> = {
      ...selectedAnswers,
      [currentQ.id]: option
    };
    setSelectedAnswers(nextAnswers);

    const cat = currentQ.category;
    if (cat && !celebratedCategories.includes(cat)) {
      const catQuestions = questions.filter((q) => q.category === cat);
      const allAnswered = catQuestions.length > 0 && catQuestions.every((q) => Boolean(nextAnswers[q.id]));
      if (allAnswered) {
        const correctCount = catQuestions.filter((q) => nextAnswers[q.id] === q.correct_option).length;
        setCelebratedCategories((prev) => [...prev, cat]);
        setCategoryCongrats({
          category: cat,
          total: catQuestions.length,
          correct: correctCount,
        });
        try {
          confetti({
            particleCount: 95,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore canvas errors
        }
      }
    }
  };

  const handleContinueNextCategory = () => {
    const finishedCat = categoryCongrats?.category;
    setCategoryCongrats(null);
    if (!finishedCat) return;
    const nextIdx = questions.findIndex((q) => q.category !== finishedCat && !selectedAnswers[q.id]);
    if (nextIdx !== -1) {
      setCurrentIndex(nextIdx);
    } else if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleToggleFlag = () => {
    if (isSubmitted) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        correct += 1;
      }
    });
    const percentage = Math.round((correct / questions.length) * 100);
    return { correct, percentage };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const { percentage } = calculateScore();
    const timeSpent = quiz.duration_minutes * 60 - Math.max(0, timeLeft);

    if (percentage >= quiz.passing_score) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (onAttemptComplete) {
      onAttemptComplete(percentage, timeSpent);
    }
  };

  // Format Time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const { correct, percentage } = calculateScore();
  const isPassed = percentage >= quiz.passing_score;

  // Question Status Color for Palette
  const getStatusColor = (index: number) => {
    const q = questions[index];
    if (index === currentIndex) return 'ring-2 ring-honor-gold font-bold';
    if (flaggedQuestions[q.id]) return 'bg-amber-400 text-slate-900 font-semibold';
    if (selectedAnswers[q.id]) return 'bg-emerald-600 text-white font-semibold';
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
      {/* Top Header: Compact Mobile + GHQ Style Computerized Testing Bar */}
      <div className="bg-[#183B2B] text-white p-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#2A5A44]">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs text-honor-gold uppercase tracking-wider font-semibold truncate">
            {quiz.test_type} Intelligence & Academic Terminal
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-white leading-tight truncate">
            {quiz.title}
          </h2>
        </div>

        {/* Live Countdown Timer & Submit */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono text-xs sm:text-base font-bold shadow-inner ${
            timeLeft < 180 ? 'bg-red-500/20 text-red-300 border border-red-500 animate-pulse' : 'bg-[#0F261C] text-honor-gold border border-honor-gold/30'
          }`}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all whitespace-nowrap"
            >
              Finish & Submit
            </button>
          )}
        </div>
      </div>

      {/* Live Progress Bar */}
      {!isSubmitted && (
        <div className="w-full h-1.5 bg-slate-200">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${Math.round((Object.keys(selectedAnswers).length / Math.max(1, questions.length)) * 100)}%` }}
          />
        </div>
      )}

      {/* Category Completion Congratulations Modal */}
      {categoryCongrats && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl border-2 border-emerald-500 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
              <Award className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Category Completed
              </span>
              <h3 className="text-2xl font-black text-gray-900 pt-1">
                Congratulations!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                You have completed all questions in <strong className="text-[#183B2B]">{categoryCongrats.category}</strong>!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="text-gray-500 font-semibold">Completed</div>
                <div className="text-lg font-black text-[#183B2B]">{categoryCongrats.total} / {categoryCongrats.total}</div>
              </div>
              <div>
                <div className="text-gray-500 font-semibold">Score in Category</div>
                <div className="text-lg font-black text-emerald-600">{categoryCongrats.correct} Correct</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleContinueNextCategory}
              className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Next Category</span>
              <ArrowRight className="w-4 h-4 text-honor-gold" />
            </button>
          </div>
        </div>
      )}

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 p-3.5 sm:p-6">
          {/* Main Question Interface (3 cols) */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Q <strong className="text-gray-900">{currentIndex + 1}</strong>/{questions.length}
                </span>
                {currentQ.category && (
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 truncate max-w-[180px] sm:max-w-none">
                    {currentQ.category}
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleFlag}
                className={`text-[11px] sm:text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors shrink-0 ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'text-gray-600 hover:bg-gray-50 border-gray-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                <span className="sm:hidden">{flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Text & Matrix Image */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 leading-snug sm:leading-relaxed">
                {currentQ.question_text}
              </h3>

              {currentQ.question_image_url && (
                <div className="p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-2 border-emerald-100 flex justify-center shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQ.question_image_url}
                    alt="Question Diagram"
                    className="max-h-36 sm:max-h-64 w-auto object-contain rounded-lg sm:rounded-xl shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Options List */}
            {currentQ.option_a_image_url ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optImg = (currentQ as any)[`option_${optKey.toLowerCase()}_image_url`];
                  const optText = currentQ[`option_${optKey.toLowerCase()}` as keyof QuizQuestion] as string;
                  const isSelected = selectedAnswers[currentQ.id] === optKey;

                  return (
                    <button
                      key={optKey}
                      onClick={() => handleSelectOption(optKey)}
                      className={`group relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-col items-center justify-between gap-2 text-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/30'
                          : 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-gray-50/80 shadow-sm'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between">
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                        }`}>
                          {optKey}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" />
                            Selected
                          </span>
                        )}
                      </div>

                      {optImg && (
                        <div className="w-full h-16 sm:h-24 flex items-center justify-center p-1.5 sm:p-2 bg-gray-50/60 rounded-lg sm:rounded-xl border border-gray-100 group-hover:bg-white transition-colors overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={optImg}
                            alt={`Option ${optKey}`}
                            className="max-h-full max-w-full object-contain rounded transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}

                      <span className="text-[11px] sm:text-xs font-semibold text-gray-600 group-hover:text-gray-900 leading-tight">
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optText = currentQ[`option_${optKey.toLowerCase()}` as keyof QuizQuestion] as string;
                  const isSelected = selectedAnswers[currentQ.id] === optKey;

                  return (
                    <button
                      key={optKey}
                      onClick={() => handleSelectOption(optKey)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {optKey}
                      </div>
                      <span className="text-gray-800 text-base font-medium flex-1">
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#183B2B] hover:bg-[#2A5A44] flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  Submit & View Result
                </button>
              )}
            </div>
            {/* Mobile Compact Question Navigator Bar (replaces giant scrollbox on mobile) */}
            <div className="lg:hidden pt-3">
              <button
                type="button"
                onClick={() => setMobilePaletteOpen(true)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-between text-xs font-bold text-gray-800 hover:bg-slate-100 transition-all"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#183B2B]" />
                  <span>Question Palette ({currentIndex + 1} / {questions.length})</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#183B2B] text-white text-[11px]">
                  {Object.keys(selectedAnswers).length} Done • View All
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Question Palette Bottom-Sheet Drawer */}
          {mobilePaletteOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex items-end justify-center">
              <div className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] flex flex-col space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                      Question Palette
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Tap any question number to jump directly ({questions.length} Total)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobilePaletteOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Compact Legend */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
                    Attempted ({Object.keys(selectedAnswers).length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
                    Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-gray-200 inline-block"></span>
                    Remaining ({questions.length - Object.keys(selectedAnswers).length})
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2 overflow-y-auto py-1 flex-1">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setMobilePaletteOpen(false);
                      }}
                      className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${getStatusColor(idx)}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Question Palette Sidebar (1 col) */}
          <div className="hidden lg:block bg-gray-50 p-5 rounded-xl border border-gray-200 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                Question Palette
              </h4>
              <span className="text-[11px] font-bold text-gray-500">
                {questions.length} Questions
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 max-h-80 overflow-y-auto pr-1">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${getStatusColor(idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block"></span>
                <span>Attempted ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block"></span>
                <span>Flagged for Review ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-gray-200 inline-block"></span>
                <span>Unattempted ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Post-Submission Scorecard & Detailed Review */
        <div className="p-3.5 sm:p-8 space-y-6 sm:space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8 rounded-2xl border border-gray-200 text-center space-y-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
              isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
            }`}>
              {isPassed ? <Award className="w-8 h-8 sm:w-10 sm:h-10" /> : <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />}
            </div>

            <div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">
                Official Result Card
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-gray-900">
                {isPassed ? 'Congratulations! Test Cleared' : 'Requires Further Practice'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
                {isPassed 
                  ? 'Your score qualifies for standard Armed Forces initial computerized screening benchmarks.' 
                  : 'Forces screening requires a passing score of at least ' + quiz.passing_score + '%. Revise and re-attempt.'}
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto pt-3">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm min-w-0 flex flex-col items-center justify-center">
                <div className="text-xl sm:text-2xl font-black text-gray-900">{percentage}%</div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">Final Score</div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm min-w-0 flex flex-col items-center justify-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 whitespace-nowrap">{correct} / {questions.length}</div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">Correct Answers</div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm min-w-0 flex flex-col items-center justify-center">
                <div className="text-xl sm:text-2xl font-black text-honor-dark whitespace-nowrap">
                  {formatTime(quiz.duration_minutes * 60 - timeLeft)}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">Time Taken</div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm min-w-0 flex flex-col items-center justify-center">
                <div className={`text-sm sm:text-base font-black tracking-tight whitespace-nowrap ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isPassed ? 'RECOMMENDED' : 'NOT CLEARED'}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">Status Benchmark</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-3">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full sm:w-auto justify-center bg-[#183B2B] hover:bg-[#2A5A44] text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{showReview ? 'Hide Answers' : 'Review Questions & Explanations'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setFlaggedQuestions({});
                  setCelebratedCategories([]);
                  setCategoryCongrats(null);
                  setTimeLeft(quiz.duration_minutes * 60);
                  setCurrentIndex(0);
                  setShowReview(false);
                }}
                className="w-full sm:w-auto justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Re-Attempt Test</span>
              </button>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          {showReview && (
            <div className="space-y-6 pt-4">
              <h4 className="text-lg font-bold text-gray-900 border-b pb-2">
                Detailed Solutions & Explanations
              </h4>

              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correct_option;

                return (
                  <div key={q.id} className={`p-3.5 sm:p-5 rounded-xl border-2 ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'
                  }`}>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm text-gray-900">Q{idx + 1}.</span>
                          {q.category && (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {q.category}
                            </span>
                          )}
                        </div>
                        {isCorrect ? (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-md shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-red-600 font-bold text-xs flex items-center gap-1 bg-red-100 px-2.5 py-1 rounded-md shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {q.question_text}
                      </div>
                    </div>

                    {q.question_image_url && (
                      <div className="my-3 p-2 bg-white rounded-xl border border-gray-200 flex justify-center max-w-md mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.question_image_url}
                          alt={`Question ${idx + 1} Diagram`}
                          className="max-h-48 object-contain rounded-lg"
                        />
                      </div>
                    )}

                    <div className={`gap-2.5 my-3 ${q.option_a_image_url ? 'grid grid-cols-2 sm:grid-cols-4' : 'grid grid-cols-1 sm:grid-cols-2 text-sm'}`}>
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const optImg = (q as any)[`option_${opt.toLowerCase()}_image_url`];
                        const isCorrectKey = opt === q.correct_option;
                        const isUserChoice = opt === userAns;

                        return (
                          <div
                            key={opt}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-xs font-medium text-center gap-2 ${
                              isCorrectKey
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                : isUserChoice
                                ? 'bg-red-100 border-red-400 text-red-900 font-bold'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold">{opt}</span>
                              {isCorrectKey && <span className="text-[10px] text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">Correct Key</span>}
                              {isUserChoice && !isCorrectKey && <span className="text-[10px] text-red-800 bg-red-200/60 px-1.5 py-0.5 rounded font-bold">Your Choice</span>}
                            </div>
                            {optImg && (
                              <div className="w-full h-20 flex items-center justify-center p-1 bg-white/80 rounded border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={optImg} alt={`Option ${opt}`} className="max-h-full max-w-full object-contain" />
                              </div>
                            )}
                            <span className="text-[11px] truncate w-full">
                              {q[`option_${opt.toLowerCase()}` as keyof QuizQuestion] as string}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 p-3 bg-white/80 rounded-lg border border-gray-200 text-xs text-gray-700">
                        <strong className="text-honor-dark">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
