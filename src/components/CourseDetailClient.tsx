"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoPlayerWithWatermark from '@/components/VideoPlayerWithWatermark';
import { getCourseLessonsWithNonVerbal, getLessonNonVerbalCategoryId } from '@/lib/courses-data';
import { ACADEMY_CONFIG, PAYMENT_ACCOUNTS } from '@/lib/constants';
import { getPaymentAccounts, addPaymentTransaction, PaymentAccountsConfig } from '@/lib/admin-store';
import { getCurrentUser, loginStudent, registerCadet, updateCadetRecord, CadetSession } from '@/lib/auth';
import { getCourseEligibility, getCourseTestPattern, getCourseSelectionProcedure, checkCandidateEligibility } from '@/lib/eligibility';
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
  X,
  ClipboardCheck,
  Ruler,
  GraduationCap,
  Calendar,
  ArrowRight,
  Layers,
  ListChecks
} from 'lucide-react';
import { Course, Lesson } from '@/types';

interface CourseDetailClientProps {
  course: Course;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'eligibility' | 'pattern' | 'procedure' | 'syllabus'>('eligibility');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<CadetSession | null>(null);
  const [enrollStage, setEnrollStage] = useState<'auth' | 'eligibility' | 'payment'>('auth');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Registration & Eligibility Check fields
  const [regFatherName, setRegFatherName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [eligGender, setEligGender] = useState('Male');
  const [eligDob, setEligDob] = useState('');
  const [eligHeight, setEligHeight] = useState('');
  const [eligMatric, setEligMatric] = useState('');
  const [eligFsc, setEligFsc] = useState('');

  const eligibility = getCourseEligibility(course);
  const testPattern = getCourseTestPattern(course);
  const selectionSteps = getCourseSelectionProcedure(course);

  // Check paid course clearance & user session, and remember last viewed course for /register auto-select
  useEffect(() => {
    try {
      sessionStorage.setItem('bfa_last_course_slug', course.slug);
    } catch {
      // ignore storage errors
    }
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        if (user.role === 'admin' || user.enrolled_courses?.includes(course.id)) {
          setIsEnrolled(true);
        }
        setCandidateName((prev) => prev || user.full_name || '');
        setCandidatePhone((prev) => prev || user.phone_number || '');
        if (user.gender) setEligGender(user.gender);
        if (user.dob) setEligDob(user.dob);
        if (user.height) setEligHeight(user.height);
        if (user.matric_marks) setEligMatric(user.matric_marks);
        if (user.fsc_marks) setEligFsc(user.fsc_marks);
      }
    };
    syncUser();
    window.addEventListener('bfa_auth_changed', syncUser);
    return () => window.removeEventListener('bfa_auth_changed', syncUser);
  }, [course.id]);

  const openEnrollFlow = () => {
    const user = getCurrentUser();
    setAuthError(null);
    setFormSubmitted(false);
    if (user) {
      setCurrentUser(user);
      setCandidateName(user.full_name || '');
      setCandidatePhone(user.phone_number || '');
      if (user.gender) setEligGender(user.gender);
      if (user.dob) setEligDob(user.dob);
      if (user.height) setEligHeight(user.height);
      if (user.matric_marks) setEligMatric(user.matric_marks);
      if (user.fsc_marks) setEligFsc(user.fsc_marks);
      setEnrollStage(user.role === 'admin' ? 'payment' : 'eligibility');
    } else {
      setEnrollStage('auth');
    }
    setShowEnrollModal(true);
  };
  
  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer'>('jazzcash');
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountsConfig>(PAYMENT_ACCOUNTS);
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setPaymentAccounts(getPaymentAccounts());
    const onPayUpdate = () => setPaymentAccounts(getPaymentAccounts());
    window.addEventListener('bfa_payments_updated', onPayUpdate);
    return () => window.removeEventListener('bfa_payments_updated', onPayUpdate);
  }, []);

  // Load course lessons including the 9 Non-Verbal Urdu AI voiceover videos
  const lessons: Lesson[] = getCourseLessonsWithNonVerbal(course.id, course.title);

  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const currentNvCatId = getLessonNonVerbalCategoryId(currentLesson.video_url);

  // 3-Step Progression: Video Completed -> Additional Course PDF -> 20-Question QuizBank
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [studiedPdfs, setStudiedPdfs] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`course_progress_${course.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedLessons)) setCompletedLessons(parsed.completedLessons);
        if (Array.isArray(parsed.studiedPdfs)) setStudiedPdfs(parsed.studiedPdfs);
      }
    } catch {
      // ignore storage errors
    }
  }, [course.id]);

  const saveProgress = (nextCompleted: number[], nextPdfs: number[]) => {
    try {
      localStorage.setItem(
        `course_progress_${course.id}`,
        JSON.stringify({ completedLessons: nextCompleted, studiedPdfs: nextPdfs })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleVideoCompleted = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      const next = [...completedLessons, currentLesson.id];
      setCompletedLessons(next);
      saveProgress(next, studiedPdfs);
    }
  };

  const handlePdfOpened = () => {
    if (!studiedPdfs.includes(currentLesson.id)) {
      const next = [...studiedPdfs, currentLesson.id];
      setStudiedPdfs(next);
      saveProgress(completedLessons, next);
    }
  };

  const isVideoCompleted = completedLessons.includes(currentLesson.id);
  const isPdfStudied = studiedPdfs.includes(currentLesson.id);
  const pdfHref = currentNvCatId ? `/tests/non-verbal-pdf?cat=${currentNvCatId}` : '/tests/non-verbal-pdf';
  const quizHref = currentNvCatId ? `/tests/quiz/2?count=20&cat=${currentNvCatId}` : '/tests/quiz/2?count=20';

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidatePhone || !trxId) {
      alert("Please fill all required enrollment details.");
      return;
    }
    addPaymentTransaction({
      candidateName,
      candidatePhone,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.sale_price,
      method: paymentMethod,
      trxId,
      status: 'pending',
    });
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
                  onClick={openEnrollFlow}
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
              onOpenEnrollmentModal={openEnrollFlow}
              onVideoEnded={handleVideoCompleted}
            />

            {/* 3-Step Course Progression: 1. Video -> 2. Additional Course PDF -> 3. 20-Question QuizBank */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Guided Learning Path
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                    Complete Video → Study Additional PDF → Attempt 20-Question QuizBank
                  </h3>
                </div>
                {!isVideoCompleted && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-auto">
                    Watch full video to unlock PDF & QuizBank
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Watch Video */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isVideoCompleted
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50 border-[#183B2B]/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-[#183B2B]">Step 1: Watch Video</span>
                    {isVideoCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Play className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {isVideoCompleted
                      ? 'Video lecture completed! Your Additional Course PDF is now unlocked.'
                      : 'Watch the full lecture above. When the video finishes, Step 2 unlocks automatically.'}
                  </p>
                  <div className="text-[11px] font-bold text-emerald-700">
                    {isVideoCompleted ? 'Status: Completed ✓' : 'Status: In Progress...'}
                  </div>
                </div>

                {/* Step 2: Additional Course PDF */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !isVideoCompleted
                    ? 'bg-gray-100/80 border-gray-200 opacity-75'
                    : isPdfStudied
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/60 border-amber-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-gray-900">Step 2: Additional PDF</span>
                    {!isVideoCompleted ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : isPdfStudied ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {isVideoCompleted
                      ? 'Open and study the solved PDF notes for this lecture to unlock the 20-question QuizBank.'
                      : 'Locked until you finish watching the video lecture.'}
                  </p>
                  {isVideoCompleted ? (
                    <Link
                      href={pdfHref}
                      onClick={handlePdfOpened}
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-3 py-2.5 rounded-lg transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-honor-gold" />
                      <span>{isPdfStudied ? 'Re-open Course PDF' : 'Open Additional Course PDF'}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-200 text-gray-500 text-xs font-bold px-3 py-2.5 rounded-lg cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked (Finish Video First)</span>
                    </button>
                  )}
                </div>

                {/* Step 3: QuizBank (20 Random Questions from PDF) */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !isPdfStudied
                    ? 'bg-gray-100/80 border-gray-200 opacity-75'
                    : 'bg-emerald-50/70 border-emerald-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-gray-900">Step 3: QuizBank (20 Qs)</span>
                    {!isPdfStudied ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Award className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {isPdfStudied
                      ? 'QuizBank ready! Attempt 20 random questions generated directly from the PDF.'
                      : 'Locked until you open the Additional Course PDF in Step 2.'}
                  </p>
                  {isPdfStudied ? (
                    <Link
                      href={quizHref}
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-lg shadow-sm transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start 20-Q Random QuizBank</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-200 text-gray-500 text-xs font-bold px-3 py-2.5 rounded-lg cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked (Open PDF First)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Course Overview & Syllabus / Eligibility Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Tab Bar */}
              <div className="flex flex-wrap border-b border-gray-200 bg-slate-50/70 px-4 sm:px-6 pt-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('eligibility')}
                  className={`px-3.5 py-3 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'eligibility'
                      ? 'border-[#183B2B] text-[#183B2B] bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  <span>Eligibility Criteria</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pattern')}
                  className={`px-3.5 py-3 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'pattern'
                      ? 'border-[#183B2B] text-[#183B2B] bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Test Pattern</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('procedure')}
                  className={`px-3.5 py-3 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'procedure'
                      ? 'border-[#183B2B] text-[#183B2B] bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ListChecks className="w-4 h-4 text-amber-600" />
                  <span>Selection Procedure</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('syllabus')}
                  className={`px-3.5 py-3 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'syllabus'
                      ? 'border-[#183B2B] text-[#183B2B] bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Syllabus & Roadmap</span>
                </button>
              </div>

              {activeTab === 'pattern' ? (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Official Examination Test Pattern
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {testPattern.mode}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-emerald-800 uppercase block text-[10px]">Passing Criteria</span>
                      <span className="font-bold text-gray-900 text-sm">{testPattern.passingScore}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                      <span className="font-bold text-blue-800 uppercase block text-[10px]">Negative Marking</span>
                      <span className="font-bold text-gray-900 text-sm">{testPattern.negativeMarking}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {testPattern.sections.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-gray-900">{sec.title}</div>
                          <p className="text-xs text-gray-600">{sec.details}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#183B2B]">
                            {sec.questions}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-[#183B2B] text-white text-xs font-bold">
                            {sec.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'procedure' ? (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Step-by-Step Selection Procedure
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Complete induction journey from registration to final joining for {course.title}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectionSteps.map((st) => (
                      <div key={st.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#183B2B] text-honor-gold font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {st.step}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{st.title}</div>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{st.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'syllabus' ? (
                <div className="p-6 sm:p-8 space-y-6">
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
                      <span className="text-xs font-semibold text-gray-700">Mentor Personal Guidance</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-700">VIP WhatsApp Discussion Batch Access</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Official Selection Eligibility Criteria
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Minimum standards required to apply for {course.title}
                      </p>
                    </div>
                    <Link
                      href={`/admission-form?course=${course.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <span>Apply & Check My Eligibility</span>
                      <ArrowRight className="w-3.5 h-3.5 text-honor-gold" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-emerald-800 uppercase">Age Limit</div>
                        <div className="text-sm font-bold text-gray-900">{eligibility.ageLabel}</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-blue-800 uppercase">Education</div>
                        <div className="text-sm font-bold text-gray-900">{eligibility.educationLabel}</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-start gap-3">
                      <Ruler className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-amber-800 uppercase">Height Standard</div>
                        <div className="text-sm font-bold text-gray-900">{eligibility.heightLabel}</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-purple-800 uppercase">Gender & Status</div>
                        <div className="text-sm font-bold text-gray-900">
                          {eligibility.genderLabel} • {eligibility.maritalStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {eligibility.notes.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Important Physical & Selection Notes:
                      </div>
                      <ul className="space-y-1.5">
                        {eligibility.notes.map((note, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
                    onClick={openEnrollFlow}
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

      {/* 3-Stage Enrollment Modal: 1. Login/Register -> 2. Eligibility Verify -> 3. Payment */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Stage Indicator */}
            {!formSubmitted && (
              <div className="flex items-center gap-2 mb-5 pr-8 text-[11px] font-bold">
                <span className={`px-2.5 py-1 rounded-full ${enrollStage === 'auth' ? 'bg-[#183B2B] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  1. Account
                </span>
                <span className="text-gray-300">→</span>
                <span className={`px-2.5 py-1 rounded-full ${enrollStage === 'eligibility' ? 'bg-[#183B2B] text-white' : enrollStage === 'payment' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                  2. Eligibility Check
                </span>
                <span className="text-gray-300">→</span>
                <span className={`px-2.5 py-1 rounded-full ${enrollStage === 'payment' ? 'bg-[#183B2B] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  3. Fee Payment
                </span>
              </div>
            )}

            {formSubmitted ? (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Admission Form & Proof Submitted!
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  Candidate <strong>{candidateName}</strong>, your premium lectures are now unlocked. Please send your screenshot to Mentor for official VIP batch verification.
                </p>

                <div className="pt-4 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Mentor, I just submitted fee proof for ${course.title}. TRX ID: ${trxId}, Name: ${candidateName}, Phone: ${candidatePhone}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Verify Receipt via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setShowEnrollModal(false)}
                    className="text-xs text-gray-500 hover:underline py-2"
                  >
                    Close and Start Watching Lectures
                  </button>
                </div>
              </div>
            ) : enrollStage === 'auth' ? (
              /* STAGE 1: LOGIN OR REGISTER + ELIGIBILITY */
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Step 1 of 3 • Cadet Account Verification
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    Sign In or Register Before Payment
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    For <strong>{course.title}</strong>, please sign in or register so we can verify your eligibility first.
                  </p>
                </div>

                {/* Auth Mode Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setAuthTab('login'); setAuthError(null); }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'login' ? 'bg-white text-[#183B2B] shadow-sm' : 'text-gray-600'}`}
                  >
                    Already Registered (Sign In)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('register'); setAuthError(null); }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${authTab === 'register' ? 'bg-[#183B2B] text-white shadow-sm' : 'text-gray-600'}`}
                  >
                    New Student (Register)
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authTab === 'login' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAuthError(null);
                      const res = loginStudent(loginIdentifier, loginPassword);
                      if (res.success && res.session) {
                        setCurrentUser(res.session);
                        setCandidateName(res.session.full_name || '');
                        setCandidatePhone(res.session.phone_number || '');
                        if (res.session.gender) setEligGender(res.session.gender);
                        if (res.session.dob) setEligDob(res.session.dob);
                        if (res.session.height) setEligHeight(res.session.height);
                        if (res.session.matric_marks) setEligMatric(res.session.matric_marks);
                        if (res.session.fsc_marks) setEligFsc(res.session.fsc_marks);
                        setEnrollStage('eligibility');
                      } else {
                        setAuthError(res.error || 'Invalid credentials. Try New Student Registration.');
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email, Roll Number, or Mobile Number:
                      </label>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. qaiser.faryad@gmail.com or +92 305 4599659"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#183B2B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Password / Pin:
                      </label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#183B2B]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                    >
                      Sign In & Verify Eligibility →
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAuthError(null);
                      const res = registerCadet({
                        full_name: candidateName,
                        father_name: regFatherName,
                        phone_number: candidatePhone,
                        email: regEmail,
                        target_wing: course.title,
                        password: regPassword,
                      });
                      if (res.success && res.session) {
                        updateCadetRecord(res.session.id, {
                          gender: eligGender,
                          dob: eligDob,
                          height: eligHeight,
                          matric_marks: eligMatric,
                          fsc_marks: eligFsc,
                        });
                        const updatedUser = {
                          ...res.session,
                          gender: eligGender,
                          dob: eligDob,
                          height: eligHeight,
                          matric_marks: eligMatric,
                          fsc_marks: eligFsc,
                        };
                        setCurrentUser(updatedUser);
                        setEnrollStage('eligibility');
                      } else {
                        setAuthError('Could not complete registration. Please check your details.');
                      }
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="Muhammad Ali"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Father Name *</label>
                        <input
                          type="text"
                          required
                          value={regFatherName}
                          onChange={(e) => setRegFatherName(e.target.value)}
                          placeholder="Father Name"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">WhatsApp / Mobile *</label>
                        <input
                          type="tel"
                          required
                          value={candidatePhone}
                          onChange={(e) => setCandidatePhone(e.target.value)}
                          placeholder="0300 1234567"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="student@gmail.com"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Gender *</label>
                        <select
                          value={eligGender}
                          onChange={(e) => setEligGender(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={eligDob}
                          onChange={(e) => setEligDob(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Height (e.g. 5.6) *</label>
                        <input
                          type="text"
                          required
                          value={eligHeight}
                          onChange={(e) => setEligHeight(e.target.value)}
                          placeholder="5.6"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Matric / FSc Marks *</label>
                        <input
                          type="text"
                          required
                          value={eligFsc || eligMatric}
                          onChange={(e) => {
                            setEligMatric(e.target.value);
                            setEligFsc(e.target.value);
                          }}
                          placeholder="e.g. 850/1100"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-gray-700 mb-1">Create Password *</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Minimum 4 characters"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                    >
                      Register & Check Eligibility →
                    </button>
                  </form>
                )}
              </div>
            ) : enrollStage === 'eligibility' ? (
              /* STAGE 2: ELIGIBILITY VERIFICATION BEFORE PAYMENT */
              (() => {
                const evalResult = checkCandidateEligibility(course, {
                  dob: eligDob,
                  gender: (eligGender === 'Female' ? 'Female' : 'Male'),
                  height: eligHeight,
                  matricMarks: eligMatric,
                  fscMarks: eligFsc,
                });
                return (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Step 2 of 3 • Official Eligibility Verification
                      </span>
                      <h3 className="text-xl font-black text-gray-900 mt-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Verify your physical & academic details before fee payment.
                      </p>
                    </div>

                    {/* Quick profile fields if incomplete or updating */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="font-bold text-gray-600 block mb-1">Gender</label>
                        <select
                          value={eligGender}
                          onChange={(e) => setEligGender(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-gray-600 block mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={eligDob}
                          onChange={(e) => setEligDob(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-600 block mb-1">Height (ft.in)</label>
                        <input
                          type="text"
                          value={eligHeight}
                          onChange={(e) => setEligHeight(e.target.value)}
                          placeholder="5.6"
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-600 block mb-1">Marks</label>
                        <input
                          type="text"
                          value={eligFsc || eligMatric}
                          onChange={(e) => {
                            setEligMatric(e.target.value);
                            setEligFsc(e.target.value);
                          }}
                          placeholder="850/1100"
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {evalResult.checks.map((chk, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            chk.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{chk.label}</div>
                            <div className="text-[11px] opacity-85">{chk.detail}</div>
                          </div>
                          <span className="font-black text-xs">{chk.passed ? 'PASS ✓' : 'FAIL ✕'}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold border ${
                        evalResult.isEligible
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}
                    >
                      {evalResult.summaryMessage}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Link
                        href="/courses"
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Browse Other Courses
                      </Link>
                      {evalResult.isEligible ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (currentUser) {
                              updateCadetRecord(currentUser.id, {
                                gender: eligGender,
                                dob: eligDob,
                                height: eligHeight,
                                matric_marks: eligMatric,
                                fsc_marks: eligFsc,
                              });
                            }
                            setEnrollStage('payment');
                          }}
                          className="px-5 py-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        >
                          Eligible ✓ Proceed to Payment →
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-5 py-3 rounded-xl text-xs font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          Not Eligible for Payment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* STAGE 3: PAYMENT FORM */
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
                    paymentMethod === 'jazzcash' ? paymentAccounts.jazzcash.accountNumber :
                    paymentMethod === 'easypaisa' ? paymentAccounts.easypaisa.accountNumber :
                    paymentAccounts.bank.iban
                  }</div>
                  <div><strong>Account Title:</strong> {
                    paymentMethod === 'bank_transfer'
                      ? paymentAccounts.bank.accountTitle
                      : paymentMethod === 'easypaisa'
                      ? paymentAccounts.easypaisa.accountTitle
                      : paymentAccounts.jazzcash.accountTitle
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
