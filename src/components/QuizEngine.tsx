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
  FileCheck
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
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Top Header: GHQ Style Computerized Testing Bar */}
      <div className="bg-[#183B2B] text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#2A5A44]">
        <div>
          <div className="text-xs text-honor-gold uppercase tracking-wider font-semibold">
            {quiz.test_type} Intelligence & Academic Terminal
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
            {quiz.title}
          </h2>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold shadow-inner ${
            timeLeft < 180 ? 'bg-red-500/20 text-red-300 border border-red-500 animate-pulse' : 'bg-[#0F261C] text-honor-gold border border-honor-gold/30'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
            >
              Finish & Submit Test
            </button>
          )}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Main Question Interface (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-semibold text-gray-500">
                  Question <strong className="text-gray-900">{currentIndex + 1}</strong> of {questions.length}
                </span>
                {currentQ.category && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Type: {currentQ.category}
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleFlag}
                className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'text-gray-600 hover:bg-gray-50 border-gray-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text & Matrix Image */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed">
                {currentQ.question_text}
              </h3>

              {currentQ.question_image_url && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQ.question_image_url}
                    alt="Question Diagram"
                    className="max-h-64 object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Options List */}
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
          </div>

          {/* Question Palette Sidebar (1 col) */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-fit space-y-4">
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
        <div className="p-8 space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
              isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
            }`}>
              {isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">
                Official Result Card
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {isPassed ? 'Congratulations! Test Cleared' : 'Requires Further Practice'}
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mt-1">
                {isPassed 
                  ? 'Your score qualifies for standard Armed Forces initial computerized screening benchmarks.' 
                  : 'Forces screening requires a passing score of at least ' + quiz.passing_score + '%. Revise and re-attempt.'}
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-xs text-gray-500 font-medium">Final Score</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">{correct} / {questions.length}</div>
                <div className="text-xs text-gray-500 font-medium">Correct Answers</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-honor-dark">
                  {formatTime(quiz.duration_minutes * 60 - timeLeft)}
                </div>
                <div className="text-xs text-gray-500 font-medium">Time Taken</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className={`text-2xl font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isPassed ? 'RECOMMENDED' : 'NOT CLEARED'}
                </div>
                <div className="text-xs text-gray-500 font-medium">Status Benchmark</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className="bg-[#183B2B] hover:bg-[#2A5A44] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>{showReview ? 'Hide Answers' : 'Review Questions & Explanations'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setFlaggedQuestions({});
                  setTimeLeft(quiz.duration_minutes * 60);
                  setCurrentIndex(0);
                  setShowReview(false);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
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
                  <div key={q.id} className={`p-5 rounded-xl border-2 ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'
                  }`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <span>Q{idx + 1}.</span>
                          <span>{q.question_text}</span>
                        </div>
                        {q.category && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                            Category: {q.category}
                          </span>
                        )}
                      </div>
                      {isCorrect ? (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-md">
                          <CheckCircle className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold text-xs flex items-center gap-1 bg-red-100 px-2.5 py-1 rounded-md">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm my-3">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                        <div
                          key={opt}
                          className={`p-2.5 rounded-lg border text-xs font-medium ${
                            opt === q.correct_option
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                              : opt === userAns
                              ? 'bg-red-100 border-red-400 text-red-900 font-bold'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          {opt}: {q[`option_${opt.toLowerCase()}` as keyof QuizQuestion] as string}
                          {opt === q.correct_option && ' (Correct Key)'}
                          {opt === userAns && opt !== q.correct_option && ' (Your Choice)'}
                        </div>
                      ))}
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
