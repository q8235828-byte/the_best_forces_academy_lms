"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayerWithWatermark from '@/components/VideoPlayerWithWatermark';
import { INITIAL_COURSES, SAMPLE_LESSONS } from '@/lib/courses-data';
import { ACADEMY_CONFIG, PAYMENT_ACCOUNTS } from '@/lib/constants';
import { 
  Shield, 
  Lock, 
  Play, 
  FileText, 
  CheckCircle, 
  MessageCircle, 
  Clock, 
  Users, 
  Award,
  AlertCircle,
  CreditCard,
  X
} from 'lucide-react';
import { Lesson } from '@/types';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CourseDetailPage({ params }: PageProps) {
  const { slug } = params;
  const course = INITIAL_COURSES.find((c) => c.slug === slug);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  
  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer'>('jazzcash');
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!course) {
    notFound();
  }

  // Load sample lessons or default 3 lessons
  const lessons: Lesson[] = SAMPLE_LESSONS[course.id] || [
    {
      id: 9001,
      course_id: course.id,
      title: `Lecture 1: ${course.title} Comprehensive Overview & Test Syllabus (Free Demo)`,
      order_index: 1,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      is_free_preview: 1,
      duration_minutes: 45
    },
    {
      id: 9002,
      course_id: course.id,
      title: `Lecture 2: Core Concept Mastery & Computer Screen Speed Shortcuts`,
      order_index: 2,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      is_free_preview: 0,
      duration_minutes: 50
    },
    {
      id: 9003,
      course_id: course.id,
      title: `Lecture 3: Advanced Past Papers & Selection Board Strategy`,
      order_index: 3,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      is_free_preview: 0,
      duration_minutes: 42
    }
  ];

  const currentLesson = lessons[activeLessonIndex];

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidatePhone || !trxId) {
      alert("Please fill all required enrollment details.");
      return;
    }
    setFormSubmitted(true);
    setIsEnrolled(true); // Locally unlock premium lectures for demo
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-army">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-army">Courses</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{course.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#183B2B] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                  {course.category}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  For: {course.target_gender}
                </span>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  {course.qualification}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {course.title}
              </h1>
            </div>

            {/* Price & Direct Enroll Button */}
            <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <div className="text-xs text-gray-400">Total Admission Fee:</div>
                <div className="text-2xl font-black text-[#183B2B]">
                  PKR {course.sale_price.toLocaleString()}
                </div>
              </div>

              {!isEnrolled ? (
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105 text-sm"
                >
                  Enroll Now
                </button>
              ) : (
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled (Active)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Player + Lesson Syllabus Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Player Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <VideoPlayerWithWatermark
              course={course}
              lesson={currentLesson}
              isEnrolled={isEnrolled}
              studentName={candidateName || "Candidate"}
              studentPhone={candidatePhone || "+92 305 4599659"}
              onOpenEnrollmentModal={() => setShowEnrollModal(true)}
            />

            {/* Course Overview & Syllabus Highlights */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Course Syllabus & Training Roadmap
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.syllabus_summary || 'Detailed coverage including verbal intelligence series, non-verbal matrices, academic subjects, and personality assessment.'}
                </p>
              </div>

              {/* What You Receive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">Official Computerized Testing Practice</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">Open High-Yield PDF Lecture Notes</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">Sir Faryad Tabassum Personal Guidance</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">VIP WhatsApp Discussion Batch Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Playlist Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-[#183B2B] text-white flex items-center justify-between border-b border-[#2A5A44]">
                <h3 className="font-bold text-sm">Course Lectures ({lessons.length})</h3>
                <span className="text-xs text-honor-gold font-semibold">
                  {isEnrolled ? 'All Unlocked' : 'Lesson 1 Free'}
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {lessons.map((lesson, idx) => {
                  const isFree = lesson.order_index === 1 || lesson.is_free_preview === 1;
                  const isCurrent = idx === activeLessonIndex;
                  const isLocked = !isFree && !isEnrolled;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`w-full text-left p-4 transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isLocked
                          ? 'bg-gray-100 text-gray-400'
                          : isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#183B2B] text-white'
                      }`}>
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 fill-white" />}
                      </div>

                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400">
                            {lesson.duration_minutes || 45} mins
                          </span>
                          {isFree && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              FREE DEMO
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              LOCKED
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VIP WhatsApp Batch Card */}
            <div className="bg-[#0F261C] text-white p-6 rounded-2xl border border-[#2A5A44] shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">VIP WhatsApp Batch</h4>
                  <span className="text-xs text-gray-300">Daily Updates & Mentorship</span>
                </div>
              </div>

              {isEnrolled ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-300">
                    Your enrollment is verified. Join your official course WhatsApp group below:
                  </p>
                  <a
                    href={course.whatsapp_group_link || 'https://chat.whatsapp.com/sample-forces-vip'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Join Official WhatsApp Group</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">
                    VIP WhatsApp group link unlocks automatically once your course admission is approved.
                  </p>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-gray-700"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Enroll to Unlock VIP Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Manual Pakistani Payment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative my-8">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {!formSubmitted ? (
              <form onSubmit={handleEnrollmentSubmit} className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-honor-dark uppercase tracking-wider">
                    Instant Course Admission
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    Enroll in {course.title}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 font-semibold text-emerald-700">
                    Fee to Transfer: PKR {course.sale_price.toLocaleString()}
                  </div>
                </div>

                {/* Account Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Choose Payment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'jazzcash', label: 'JazzCash' },
                      { id: 'easypaisa', label: 'EasyPaisa' },
                      { id: 'bank_transfer', label: 'Meezan Bank' }
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === m.id
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
                  <div><strong>Account Number / IBAN:</strong> {
                    paymentMethod === 'jazzcash' ? PAYMENT_ACCOUNTS.jazzcash.accountNumber :
                    paymentMethod === 'easypaisa' ? PAYMENT_ACCOUNTS.easypaisa.accountNumber :
                    PAYMENT_ACCOUNTS.bank.iban
                  }</div>
                  <div><strong>Account Title:</strong> {
                    paymentMethod === 'bank_transfer' ? PAYMENT_ACCOUNTS.bank.accountTitle : PAYMENT_ACCOUNTS.jazzcash.accountTitle
                  }</div>
                </div>

                {/* Candidate Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Candidate Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile & WhatsApp Number:
                    </label>
                    <input
                      type="tel"
                      required
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Transaction ID (TRX ID / TID):
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 19283746201"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
                  >
                    Submit Proof & Activate Lectures
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Admission Form & Proof Submitted!
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  Candidate <strong>{candidateName}</strong>, your premium lectures are now unlocked. Please send your screenshot to Sir Faryad Tabassum for official VIP batch verification.
                </p>

                <div className="pt-4 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Sir Faryad Tabassum, I just submitted fee proof for ${course.title}. TRX ID: ${trxId}, Name: ${candidateName}, Phone: ${candidatePhone}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Send Receipt on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setShowEnrollModal(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Continue to Lectures
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
