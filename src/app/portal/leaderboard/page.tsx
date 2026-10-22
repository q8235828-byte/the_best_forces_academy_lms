"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Trophy, Medal, Clock, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { QuizAttempt } from '@/types';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'verbal' | 'academic'>('all');

  // Sample official leaderboard seed data sorted by score DESC, time_spent_seconds ASC
  const sampleAttempts: QuizAttempt[] = [
    {
      id: 1,
      user_id: 'usr_001',
      user_name: 'Cadet Hamza Tariq',
      quiz_id: 1,
      quiz_title: 'GHQ Initial Verbal Intelligence Computer Mock Test 01',
      score: 100,
      total_questions: 20,
      time_spent_seconds: 412, // 6m 52s
      created_at: '2026-10-22 14:30'
    },
    {
      id: 2,
      user_id: 'usr_002',
      user_name: 'Cadet Bilal Ahmed',
      quiz_id: 1,
      quiz_title: 'GHQ Initial Verbal Intelligence Computer Mock Test 01',
      score: 95,
      total_questions: 20,
      time_spent_seconds: 440, // 7m 20s
      created_at: '2026-10-22 15:10'
    },
    {
      id: 3,
      user_id: 'usr_003',
      user_name: 'Ayesha Fatima (AFNS)',
      quiz_id: 3,
      quiz_title: 'Forces Initial Academic Test (Physics, Math, English, GK)',
      score: 95,
      total_questions: 20,
      time_spent_seconds: 520, // 8m 40s
      created_at: '2026-10-22 16:05'
    },
    {
      id: 4,
      user_id: 'usr_004',
      user_name: 'Usman Ali (PMA 156)',
      quiz_id: 1,
      quiz_title: 'GHQ Initial Verbal Intelligence Computer Mock Test 01',
      score: 90,
      total_questions: 20,
      time_spent_seconds: 485,
      created_at: '2026-10-22 11:20'
    },
    {
      id: 5,
      user_id: 'usr_005',
      user_name: 'Zainab Noor (PAF CAE)',
      quiz_id: 3,
      quiz_title: 'Forces Initial Academic Test (Physics, Math, English, GK)',
      score: 90,
      total_questions: 20,
      time_spent_seconds: 510,
      created_at: '2026-10-22 12:45'
    },
    {
      id: 6,
      user_id: 'usr_006',
      user_name: 'Saad Khan (PN Cadet)',
      quiz_id: 2,
      quiz_title: 'PAF / Navy Non-Verbal Pattern Matrix Mock Test 02',
      score: 85,
      total_questions: 20,
      time_spent_seconds: 490,
      created_at: '2026-10-22 09:30'
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const top3 = sampleAttempts.slice(0, 3);
  const remainingRankers = sampleAttempts.slice(3);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>National Forces Preparation Ranking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            Candidate Hall of Fame
          </h1>
          <p className="text-sm text-gray-600">
            Ranked strictly by highest score and fastest computer completion time under official GHQ / NHQ / Air HQ timer benchmarks.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-300 shadow-lg text-center flex flex-col justify-between order-2 md:order-1 transform md:translate-y-4">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-500 font-black text-xl border border-gray-300">
                  <Medal className="w-7 h-7 text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Rank #2 • Silver Honor
                </span>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {top3[1].user_name}
                </h3>
                <div className="text-xs text-gray-500 line-clamp-1">
                  {top3[1].quiz_title}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-around text-xs">
                <div>
                  <div className="font-black text-lg text-emerald-600">{top3[1].score}%</div>
                  <div className="text-gray-400 font-medium">Score</div>
                </div>
                <div>
                  <div className="font-black text-lg text-gray-800">{formatTime(top3[1].time_spent_seconds)}</div>
                  <div className="text-gray-400 font-medium">Time Taken</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="bg-gradient-to-b from-[#183B2B] to-[#0F261C] text-white rounded-3xl p-8 border-2 border-honor-gold shadow-2xl text-center flex flex-col justify-between order-1 md:order-2 gold-glow">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-honor-gold text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Trophy className="w-8 h-8 fill-slate-950" />
                </div>
                <span className="text-xs font-black text-honor-gold uppercase tracking-widest block">
                  ★ National Champion • Gold Trophy ★
                </span>
                <h3 className="font-black text-white text-xl">
                  {top3[0].user_name}
                </h3>
                <div className="text-xs text-gray-300 line-clamp-1">
                  {top3[0].quiz_title}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#2A5A44] flex items-center justify-around text-xs">
                <div>
                  <div className="font-black text-2xl text-honor-gold">{top3[0].score}%</div>
                  <div className="text-gray-300 font-medium">Top Score</div>
                </div>
                <div>
                  <div className="font-black text-2xl text-white">{formatTime(top3[0].time_spent_seconds)}</div>
                  <div className="text-gray-300 font-medium">Speed</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-lg text-center flex flex-col justify-between order-3 transform md:translate-y-4">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 font-black text-xl border border-amber-200">
                  <Medal className="w-7 h-7 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Rank #3 • Bronze Honor
                </span>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {top3[2].user_name}
                </h3>
                <div className="text-xs text-gray-500 line-clamp-1">
                  {top3[2].quiz_title}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-around text-xs">
                <div>
                  <div className="font-black text-lg text-emerald-600">{top3[2].score}%</div>
                  <div className="text-gray-400 font-medium">Score</div>
                </div>
                <div>
                  <div className="font-black text-lg text-gray-800">{formatTime(top3[2].time_spent_seconds)}</div>
                  <div className="text-gray-400 font-medium">Time Taken</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-[#183B2B] text-white flex items-center justify-between">
            <h3 className="font-bold text-sm">Official Selection Center Rankings</h3>
            <span className="text-xs text-honor-gold">Live Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4 w-20">Rank</th>
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">Exam Module</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-center">Time Spent</th>
                  <th className="p-4 text-right">Selection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sampleAttempts.map((attempt, idx) => (
                  <tr key={attempt.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-bold text-gray-900">
                      #{idx + 1}
                    </td>
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-bold">
                        {attempt.user_name?.charAt(0)}
                      </div>
                      <span>{attempt.user_name}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-600 max-w-xs truncate">
                      {attempt.quiz_title}
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-600">
                      {attempt.score}%
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-gray-700">
                      {formatTime(attempt.time_spent_seconds)}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Recommended
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action: Take a Test to Compete */}
        <div className="bg-gradient-to-r from-[#183B2B] to-[#0F261C] p-6 rounded-2xl border border-honor-gold/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base">Want to Test Your Speed and Qualify for the Top 3 Podium?</h4>
            <p className="text-xs text-gray-300">Take an official computerized test under strict time constraints.</p>
          </div>

          <Link
            href="/tests"
            className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 whitespace-nowrap"
          >
            <span>Start Mock Exam Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
