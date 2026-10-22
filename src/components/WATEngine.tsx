"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Award, 
  MessageCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { WAT_WORDS } from '@/lib/quizzes-data';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function WATEngine() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [currentSentence, setCurrentSentence] = useState('');
  const [recordedSentences, setRecordedSentences] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // 10-second auto countdown per word
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    if (secondsLeft <= 0) {
      // Auto save whatever was typed and transition to next word
      setRecordedSentences((prev) => ({
        ...prev,
        [currentIndex]: currentSentence.trim() || '(No sentence formed)'
      }));
      setCurrentSentence('');

      if (currentIndex + 1 < WAT_WORDS.length) {
        setCurrentIndex((prev) => prev + 1);
        setSecondsLeft(10);
      } else {
        setIsCompleted(true);
        setIsRunning(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isRunning, isCompleted, currentIndex, currentSentence]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setSecondsLeft(10);
    setRecordedSentences({});
    setCurrentSentence('');
  };

  const handleNextWordManually = () => {
    setRecordedSentences((prev) => ({
      ...prev,
      [currentIndex]: currentSentence.trim() || '(No sentence formed)'
    }));
    setCurrentSentence('');

    if (currentIndex + 1 < WAT_WORDS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSecondsLeft(10);
    } else {
      setIsCompleted(true);
      setIsRunning(false);
    }
  };

  const currentWord = WAT_WORDS[currentIndex];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-[#183B2B] text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#2A5A44]">
        <div>
          <div className="text-xs text-honor-gold uppercase font-bold tracking-wider">
            Inter Services Selection Board (ISSB) Psychological Testing
          </div>
          <h2 className="text-xl font-bold text-white">
            10-Second Word Association Test (WAT) Simulator
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {isRunning && (
            <div className={`px-4 py-1.5 rounded-xl font-mono text-xl font-extrabold flex items-center gap-2 border ${
              secondsLeft <= 3 
                ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse' 
                : 'bg-[#0F261C] text-honor-gold border-honor-gold/30'
            }`}>
              <Clock className="w-5 h-5" />
              <span>{secondsLeft}s</span>
            </div>
          )}

          {!isRunning && !isCompleted && (
            <button
              onClick={handleStart}
              className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start 10s WAT Battery</span>
            </button>
          )}

          {(isRunning || isCompleted) && (
            <button
              onClick={handleStart}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Simulator Screen */}
      {!isCompleted ? (
        isRunning ? (
          <div className="p-8 sm:p-12 max-w-3xl mx-auto text-center space-y-8">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
              Word {currentIndex + 1} of {WAT_WORDS.length}
            </div>

            {/* Word Flash Screen */}
            <div className="py-10 px-6 bg-slate-900 text-white rounded-3xl border-4 border-honor-gold/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-3 right-4 font-mono text-xs text-gray-400">
                Auto-transition in: <strong className="text-honor-gold text-sm">{secondsLeft}s</strong>
              </div>
              
              <div className="text-4xl sm:text-6xl font-black tracking-widest text-honor-gold font-mono uppercase drop-shadow-md">
                {currentWord}
              </div>
            </div>

            {/* Candidate Live Sentence Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-600 uppercase text-left">
                Type your first positive spontaneous thought:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={currentSentence}
                  onChange={(e) => setCurrentSentence(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNextWordManually();
                    }
                  }}
                  placeholder="e.g., Courage leads to victory in battle..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-honor-gold focus:ring-2 focus:ring-honor-gold/20 outline-none text-base"
                />
                <button
                  onClick={handleNextWordManually}
                  className="bg-[#183B2B] hover:bg-[#2A5A44] text-white px-5 rounded-xl font-bold flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Next</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-left">
                💡 Tip from Sir Faryad: Keep sentences short, active, and optimistic. Avoid negation words like &apos;not&apos;, &apos;never&apos;, or &apos;cannot&apos;.
              </p>
            </div>
          </div>
        ) : (
          /* Introduction & Instructions */
          <div className="p-8 max-w-2xl mx-auto space-y-6 text-gray-700">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 text-amber-700" />
              <div>
                <strong>ISSB Official Examination Rule:</strong> Each word appears for exactly 10 seconds on the projector screen. You must write an instinctive, meaningful sentence before the next word replaces it.
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">Key Rules for Success by Sir Faryad Tabassum:</h3>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>Make positive, constructive sentences showing leadership and determination.</li>
                <li>Avoid textbook proverbs (e.g. &apos;Honesty is the best policy&apos;); write original thoughts.</li>
                <li>Write complete sentences with a clear subject and action verb.</li>
                <li>Do not leave words blank; continuous writing builds strong psychological profile marks.</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleStart}
                className="bg-[#183B2B] hover:bg-[#2A5A44] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-base hover:scale-105"
              >
                Begin 20-Word WAT Battery Now
              </button>
            </div>
          </div>
        )
      ) : (
        /* Completion Summary & Review */
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              WAT Battery Completed!
            </h3>
            <p className="text-sm text-gray-500">
              You completed all {WAT_WORDS.length} words under strict 10-second constraints.
            </p>
          </div>

          {/* Review Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3 w-16">#</th>
                  <th className="p-3 w-36">Prompt Word</th>
                  <th className="p-3">Your Formed Sentence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {WAT_WORDS.map((w, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60">
                    <td className="p-3 text-gray-400 font-mono text-xs">{idx + 1}</td>
                    <td className="p-3 font-bold text-honor-dark uppercase tracking-wider">{w}</td>
                    <td className="p-3 text-gray-800 font-medium">
                      {recordedSentences[idx] || <span className="text-red-400 italic">No sentence entered</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WhatsApp Direct Review with Sir Faryad */}
          <div className="bg-[#183B2B] text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Want Sir Faryad Tabassum to Psychologically Assess Your Sentences?</h4>
              <p className="text-xs text-gray-300">Send your WAT sheet directly to our WhatsApp evaluation wing.</p>
            </div>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Sir Faryad Tabassum, I just completed the 20-word ISSB WAT test on bestforcesacademy.net and would like psychological feedback on my sentences.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Sentences for Evaluation</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
