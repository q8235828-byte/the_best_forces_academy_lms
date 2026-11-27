"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  BookOpen,
  CreditCard,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Unlock,
  Save,
  X,
  DollarSign,
  Eye,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  CadetSession,
  getAllRegisteredCadets,
  updateCadetRecord,
  addCadetRecord,
  deleteCadetRecord,
  toggleCadetCourseAccess,
  getCurrentAdmin,
  logoutUser,
} from '@/lib/auth';
import {
  getManagedCourses,
  saveCourseUpdate,
  addCustomCourse,
  getPaymentAccounts,
  savePaymentAccounts,
  getPaymentTransactions,
  addPaymentTransaction,
  updateTransactionStatus,
  PaymentAccountsConfig,
  PaymentTransaction,
} from '@/lib/admin-store';
import { Course, CourseCategory, TargetGender } from '@/types';
import { useRouter } from 'next/navigation';

type AdminTab = 'overview' | 'students' | 'courses' | 'payments';

export default function AdminCommandCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Data state
  const [cadets, setCadets] = useState<CadetSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [accounts, setAccounts] = useState<PaymentAccountsConfig>(() => getPaymentAccounts());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentWing, setStudentWing] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Student Edit/Add Modal
  const [editingStudent, setEditingStudent] = useState<CadetSession | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentForm, setStudentForm] = useState<Partial<CadetSession>>({});
  const [courseAccessStudent, setCourseAccessStudent] = useState<CadetSession | null>(null);

  // Course Edit/Add Modal
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});

  // Payment Account Form
  const [accountsForm, setAccountsForm] = useState<PaymentAccountsConfig>(() => getPaymentAccounts());

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const refreshAll = () => {
    setCadets(getAllRegisteredCadets());
    setCourses(getManagedCourses());
    const acc = getPaymentAccounts();
    setAccounts(acc);
    setAccountsForm(acc);
    setTransactions(getPaymentTransactions());
  };

  useEffect(() => {
    const admin = getCurrentAdmin();
    if (!admin) {
      setIsAuthorized(false);
    }
    refreshAll();
    window.addEventListener('bfa_cadets_updated', refreshAll);
    window.addEventListener('bfa_courses_updated', refreshAll);
    window.addEventListener('bfa_payments_updated', refreshAll);
    return () => {
      window.removeEventListener('bfa_cadets_updated', refreshAll);
      window.removeEventListener('bfa_courses_updated', refreshAll);
      window.removeEventListener('bfa_payments_updated', refreshAll);
    };
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0F261C] flex items-center justify-center p-6">
        <div className="bg-[#183B2B] border border-honor-gold/40 rounded-3xl p-8 max-w-md w-full text-center text-white space-y-5 shadow-2xl">
          <Lock className="w-12 h-12 text-honor-gold mx-auto" />
          <h1 className="text-2xl font-black">Officer Login Required</h1>
          <p className="text-xs text-gray-300">
            Please sign in with authorized Command Center credentials to access Student, Course, and Payment controls.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 bg-honor-gold text-slate-950 font-black px-6 py-3 rounded-xl text-sm hover:bg-amber-400 transition-all"
          >
            Go to Officer Login
          </Link>
        </div>
      </div>
    );
  }

  // Stats
  const approvedRevenue = transactions
    .filter((t) => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  // Filtered Lists
  const filteredStudents = cadets.filter((c) => {
    const q = studentSearch.toLowerCase();
    const matchesQ =
      c.full_name.toLowerCase().includes(q) ||
      c.roll_number.toLowerCase().includes(q) ||
      c.phone_number.includes(studentSearch) ||
      c.email.toLowerCase().includes(q) ||
      (c.cnic_bform && c.cnic_bform.includes(studentSearch));
    const matchesWing = studentWing === 'all' || c.target_wing.toLowerCase().includes(studentWing.toLowerCase());
    return matchesQ && matchesWing;
  });

  const filteredCourses = courses.filter((c) => {
    const q = courseSearch.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const filteredTx = transactions.filter((t) => txFilter === 'all' || t.status === txFilter);

  // Handlers: Students
  const openEditStudent = (c: CadetSession) => {
    setIsAddingStudent(false);
    setEditingStudent(c);
    setStudentForm({ ...c });
  };

  const openAddStudent = () => {
    setEditingStudent(null);
    setIsAddingStudent(true);
    setStudentForm({
      full_name: '',
      father_name: '',
      phone_number: '+92 ',
      email: '',
      cnic_bform: '',
      roll_number: `BFA-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      target_wing: 'Pakistan Army (PMA Long Course)',
      gender: 'Male',
      domicile: '',
      matric_marks: '',
      fsc_marks: '',
      enrolled_courses: [],
    });
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.full_name || !studentForm.phone_number) return;
    if (isAddingStudent) {
      const newCadet: CadetSession = {
        id: `cadet-${Date.now()}`,
        full_name: studentForm.full_name || 'Candidate',
        father_name: studentForm.father_name || '',
        phone_number: studentForm.phone_number || '',
        email: studentForm.email || '',
        cnic_bform: studentForm.cnic_bform || '',
        roll_number: studentForm.roll_number || `BFA-2026-${Date.now().toString().slice(-6)}`,
        target_wing: studentForm.target_wing || 'Pakistan Army',
        gender: studentForm.gender || 'Male',
        domicile: studentForm.domicile || '',
        matric_marks: studentForm.matric_marks || '',
        fsc_marks: studentForm.fsc_marks || '',
        role: 'student',
        enrolled_courses: studentForm.enrolled_courses || [],
        created_at: new Date().toISOString(),
        source: 'admission_form',
      };
      addCadetRecord(newCadet);
      setIsAddingStudent(false);
      showToast(`Student "${newCadet.full_name}" added successfully!`);
    } else if (editingStudent) {
      updateCadetRecord(editingStudent.id, studentForm);
      setEditingStudent(null);
      showToast(`Student "${studentForm.full_name}" updated successfully!`);
    }
    refreshAll();
  };

  const handleDeleteStudent = (c: CadetSession) => {
    if (!confirm(`Delete student "${c.full_name}" (${c.roll_number})?`)) return;
    deleteCadetRecord(c.id);
    refreshAll();
    showToast(`Student "${c.full_name}" removed.`);
  };

  const handleToggleStudentCourse = (courseId: number) => {
    if (!courseAccessStudent) return;
    toggleCadetCourseAccess(courseAccessStudent.id, courseId);
    const updated = getAllRegisteredCadets().find((x) => x.id === courseAccessStudent.id) || null;
    setCourseAccessStudent(updated);
    refreshAll();
    showToast('Student course access updated!');
  };

  // Handlers: Courses
  const openEditCourse = (c: Course) => {
    setIsAddingCourse(false);
    setEditingCourse(c);
    setCourseForm({ ...c });
  };

  const openAddCourse = () => {
    setEditingCourse(null);
    setIsAddingCourse(true);
    setCourseForm({
      title: '',
      slug: '',
      category: 'army',
      qualification: 'Intermediate (FA/FSc/ICS)',
      target_gender: 'Both',
      regular_price: 6000,
      sale_price: 3500,
      whatsapp_group_link: 'https://chat.whatsapp.com/',
      syllabus_summary: '',
      is_published: 1,
    });
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) return;
    if (isAddingCourse) {
      const slug =
        courseForm.slug?.trim() ||
        courseForm.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      const newCourse: Course = {
        id: Date.now(),
        title: courseForm.title,
        slug,
        category: (courseForm.category as CourseCategory) || 'army',
        qualification: courseForm.qualification || 'Intermediate',
        target_gender: (courseForm.target_gender as TargetGender) || 'Both',
        regular_price: Number(courseForm.regular_price) || 5000,
        sale_price: Number(courseForm.sale_price) || 3000,
        whatsapp_group_link: courseForm.whatsapp_group_link || '',
        syllabus_summary: courseForm.syllabus_summary || '',
        is_published: courseForm.is_published ?? 1,
      };
      addCustomCourse(newCourse);
      setIsAddingCourse(false);
      showToast(`Course "${newCourse.title}" created!`);
    } else if (editingCourse) {
      saveCourseUpdate(editingCourse.id, {
        ...courseForm,
        regular_price: Number(courseForm.regular_price),
        sale_price: Number(courseForm.sale_price),
      });
      setEditingCourse(null);
      showToast(`Course "${courseForm.title}" updated!`);
    }
    refreshAll();
  };

  // Handlers: Payments
  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentAccounts(accountsForm);
    refreshAll();
    showToast('Payment Accounts (JazzCash / EasyPaisa / Meezan Bank) updated!');
  };

  const handleTxStatus = (tx: PaymentTransaction, status: 'approved' | 'rejected' | 'pending') => {
    updateTransactionStatus(tx.id, status);
    if (status === 'approved') {
      // Auto-unlock course for matching student by phone or name
      const match = cadets.find(
        (c) =>
          c.phone_number.replace(/\D/g, '').slice(-10) === tx.candidatePhone.replace(/\D/g, '').slice(-10) ||
          c.full_name.toLowerCase() === tx.candidateName.toLowerCase()
      );
      if (match && !match.enrolled_courses.includes(tx.courseId)) {
        updateCadetRecord(match.id, {
          enrolled_courses: [...match.enrolled_courses, tx.courseId],
        });
      }
    }
    refreshAll();
    showToast(`Transaction ${tx.trxId} marked as ${status.toUpperCase()}.`);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F261C] border border-honor-gold text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{toast}</span>
          </div>
        )}

        {/* Top Command Header */}
        <div className="bg-[#183B2B] text-white p-6 sm:p-8 rounded-3xl border border-[#2A5A44] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-honor-gold text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Full Control Officer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Academy Admin Panel</h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Complete control over Student Records, Course Catalog & Pricing, and Payment Accounts & Approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/students"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 transition-all"
            >
              Student Dossiers
            </Link>
            <Link
              href="/admin/courses"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 transition-all"
            >
              Quick Price Table
            </Link>
            <button
              onClick={() => {
                logoutUser();
                router.push('/admin/login');
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-red-400/30 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'students', label: `Students (${cadets.length})`, icon: Users },
            { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
            { id: 'payments', label: `Payments & Accounts (${pendingCount} Pending)`, icon: CreditCard },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  active ? 'bg-[#183B2B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-honor-gold' : 'text-gray-500'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase">Registered Students</div>
                <div className="text-3xl font-black text-[#183B2B]">{cadets.length}</div>
                <button onClick={() => setActiveTab('students')} className="text-xs font-bold text-emerald-700 hover:underline">
                  Manage Student Data →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase">Total Courses</div>
                <div className="text-3xl font-black text-[#183B2B]">{courses.length}</div>
                <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-emerald-700 hover:underline">
                  Edit Courses & Fees →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase">Approved Revenue</div>
                <div className="text-3xl font-black text-emerald-700">PKR {approvedRevenue.toLocaleString()}</div>
                <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-emerald-700 hover:underline">
                  View Transactions →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase">Pending Payments</div>
                <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
                <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-amber-700 hover:underline">
                  Verify & Approve →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Student Registrations</h3>
                  <button onClick={() => setActiveTab('students')} className="text-xs font-bold text-[#183B2B] hover:underline">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {cadets.slice(0, 5).map((c) => (
                    <div key={c.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{c.full_name}</div>
                        <div className="text-gray-500">{c.roll_number} • {c.target_wing}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                        {c.enrolled_courses.length} Courses
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Fee Transactions</h3>
                  <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-[#183B2B] hover:underline">
                    Manage All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{tx.candidateName} • PKR {tx.amount.toLocaleString()}</div>
                        <div className="text-gray-500">{tx.method.toUpperCase()} • TRX: {tx.trxId}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        tx.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by name, roll number, phone, CNIC..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#183B2B]"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={studentWing}
                  onChange={(e) => setStudentWing(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
                >
                  <option value="all">All Wings</option>
                  <option value="army">Army</option>
                  <option value="paf">PAF / Air Force</option>
                  <option value="navy">Navy</option>
                </select>
                <button
                  onClick={openAddStudent}
                  className="inline-flex items-center gap-1.5 bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  <Plus className="w-4 h-4 text-honor-gold" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Student & Roll #</th>
                    <th className="p-4">Contact & CNIC</th>
                    <th className="p-4">Target Wing</th>
                    <th className="p-4">Enrolled Courses</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{c.full_name}</div>
                        <div className="text-xs font-mono text-emerald-700">{c.roll_number}</div>
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        <div>{c.phone_number}</div>
                        <div className="text-gray-400">{c.cnic_bform || c.email}</div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-gray-800">{c.target_wing}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setCourseAccessStudent(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>{c.enrolled_courses.length} Courses (Manage)</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditStudent(c)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700"
                            title="Edit Student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(c)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search courses by title, slug, or category..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#183B2B]"
                />
              </div>
              <button
                onClick={openAddCourse}
                className="inline-flex items-center justify-center gap-1.5 bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
              >
                <Plus className="w-4 h-4 text-honor-gold" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Course</th>
                    <th className="p-4">Category & Gender</th>
                    <th className="p-4">Regular / Sale Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-4 max-w-sm">
                        <div className="font-bold text-gray-900 line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono">/{c.slug}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <span className="uppercase font-bold text-[#183B2B]">{c.category}</span> • {c.target_gender}
                      </td>
                      <td className="p-4 text-xs">
                        <span className="line-through text-gray-400 mr-2">PKR {c.regular_price.toLocaleString()}</span>
                        <span className="font-black text-emerald-700">PKR {c.sale_price.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          c.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {c.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditCourse(c)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Course</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS & ACCOUNTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Accounts Editor */}
            <form onSubmit={handleSaveAccounts} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Academy Payment Accounts Control</h3>
                  <p className="text-xs text-gray-500">
                    Update JazzCash, EasyPaisa, and Meezan Bank details shown to students during course enrollment.
                  </p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  <Save className="w-4 h-4 text-honor-gold" />
                  <span>Save Accounts</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* JazzCash */}
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                  <div className="text-xs font-black uppercase text-red-700">JazzCash Account</div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountsForm.jazzcash.accountNumber}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          jazzcash: { ...accountsForm.jazzcash, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Title</label>
                    <input
                      type="text"
                      value={accountsForm.jazzcash.accountTitle}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          jazzcash: { ...accountsForm.jazzcash, accountTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>
                </div>

                {/* EasyPaisa */}
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                  <div className="text-xs font-black uppercase text-emerald-700">EasyPaisa Account</div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountsForm.easypaisa.accountNumber}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          easypaisa: { ...accountsForm.easypaisa, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Title</label>
                    <input
                      type="text"
                      value={accountsForm.easypaisa.accountTitle}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          easypaisa: { ...accountsForm.easypaisa, accountTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>
                </div>

                {/* Meezan Bank */}
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                  <div className="text-xs font-black uppercase text-purple-700">Meezan Bank Limited</div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountsForm.bank.accountNumber}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          bank: { ...accountsForm.bank, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">IBAN</label>
                    <input
                      type="text"
                      value={accountsForm.bank.iban}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          bank: { ...accountsForm.bank, iban: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Account Title</label>
                    <input
                      type="text"
                      value={accountsForm.bank.accountTitle}
                      onChange={(e) =>
                        setAccountsForm({
                          ...accountsForm,
                          bank: { ...accountsForm.bank, accountTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-gray-900">Student Fee Transactions & Approvals</h3>
                <div className="flex gap-1.5">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setTxFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${
                        txFilter === st ? 'bg-[#183B2B] text-white' : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Method & TRX ID</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{tx.candidateName}</div>
                          <div className="text-xs text-gray-500">{tx.candidatePhone}</div>
                        </td>
                        <td className="p-4 text-xs text-gray-700 max-w-xs line-clamp-2">{tx.courseTitle}</td>
                        <td className="p-4 text-xs font-mono">
                          <span className="uppercase font-bold text-[#183B2B]">{tx.method}</span>
                          <div className="text-gray-500">{tx.trxId}</div>
                        </td>
                        <td className="p-4 font-black text-gray-900">PKR {tx.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleTxStatus(tx, 'approved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleTxStatus(tx, 'rejected')}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT STUDENT */}
        {(editingStudent || isAddingStudent) && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveStudent}
              className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-gray-900">
                  {isAddingStudent ? 'Add New Student' : `Edit Student: ${editingStudent?.full_name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setIsAddingStudent(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={studentForm.full_name || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Father Name</label>
                  <input
                    type="text"
                    value={studentForm.father_name || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, father_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    required
                    type="text"
                    value={studentForm.phone_number || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={studentForm.roll_number || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, roll_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={studentForm.email || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">CNIC / B-Form</label>
                  <input
                    type="text"
                    value={studentForm.cnic_bform || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, cnic_bform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Wing</label>
                  <input
                    type="text"
                    value={studentForm.target_wing || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, target_wing: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Domicile</label>
                  <input
                    type="text"
                    value={studentForm.domicile || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, domicile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Matric Marks</label>
                  <input
                    type="text"
                    value={studentForm.matric_marks || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, matric_marks: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">FSc Marks</label>
                  <input
                    type="text"
                    value={studentForm.fsc_marks || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, fsc_marks: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setIsAddingStudent(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#183B2B] text-white"
                >
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: MANAGE STUDENT COURSE ACCESS */}
        {courseAccessStudent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Course Access: {courseAccessStudent.full_name}
                  </h3>
                  <p className="text-xs text-gray-500">Click any course to Unlock or Revoke paid access.</p>
                </div>
                <button onClick={() => setCourseAccessStudent(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                {courses.map((c) => {
                  const unlocked = courseAccessStudent.enrolled_courses.includes(c.id);
                  return (
                    <div key={c.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{c.title}</div>
                        <div className="text-gray-400">PKR {c.sale_price.toLocaleString()}</div>
                      </div>
                      <button
                        onClick={() => handleToggleStudentCourse(c.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ${
                          unlocked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{unlocked ? 'Unlocked' : 'Locked'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT COURSE */}
        {(editingCourse || isAddingCourse) && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveCourse}
              className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-gray-900">
                  {isAddingCourse ? 'Add New Course' : `Edit Course: ${editingCourse?.title}`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddingCourse(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Course Title *</label>
                  <input
                    required
                    type="text"
                    value={courseForm.title || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={courseForm.category || 'army'}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as CourseCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  >
                    <option value="issb">ISSB</option>
                    <option value="initial_prep">Initial Prep</option>
                    <option value="army">Pakistan Army</option>
                    <option value="paf">Air Force (PAF)</option>
                    <option value="navy">Pakistan Navy</option>
                    <option value="cadet_college">Cadet Colleges</option>
                    <option value="entry_test">Entry Tests</option>
                    <option value="academics">Academics</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Gender</label>
                  <select
                    value={courseForm.target_gender || 'Both'}
                    onChange={(e) => setCourseForm({ ...courseForm, target_gender: e.target.value as TargetGender })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  >
                    <option value="Both">Both</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    value={courseForm.regular_price ?? 0}
                    onChange={(e) => setCourseForm({ ...courseForm, regular_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={courseForm.sale_price ?? 0}
                    onChange={(e) => setCourseForm({ ...courseForm, sale_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Qualification</label>
                  <input
                    type="text"
                    value={courseForm.qualification || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Visibility</label>
                  <select
                    value={courseForm.is_published ?? 1}
                    onChange={(e) => setCourseForm({ ...courseForm, is_published: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  >
                    <option value={1}>Published (Live)</option>
                    <option value={0}>Hidden (Draft)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">VIP WhatsApp Group Link</label>
                  <input
                    type="text"
                    value={courseForm.whatsapp_group_link || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, whatsapp_group_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Syllabus Summary</label>
                  <textarea
                    rows={3}
                    value={courseForm.syllabus_summary || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, syllabus_summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddingCourse(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#183B2B] text-white"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
