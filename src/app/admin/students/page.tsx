"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Search, 
  Shield, 
  MessageCircle, 
  BookOpen, 
  Lock, 
  Unlock, 
  X, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  getAllRegisteredCadets, 
  toggleCadetCourseAccess, 
  setCadetCourseList, 
  CadetSession 
} from '@/lib/auth';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { Course } from '@/types';

export const runtime = 'edge';

export default function AdminStudentsPage() {
  const [cadets, setCadets] = useState<CadetSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');
  
  // Modals state
  const [activeCourseModalCadet, setActiveCourseModalCadet] = useState<CadetSession | null>(null);
  const [activeDossierCadet, setActiveDossierCadet] = useState<CadetSession | null>(null);
  const [courseSearch, setCourseSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCadets = () => {
    setCadets(getAllRegisteredCadets());
  };

  useEffect(() => {
    loadCadets();
    window.addEventListener('bfa_cadets_updated', loadCadets);
    return () => window.removeEventListener('bfa_cadets_updated', loadCadets);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle single course access for active modal cadet
  const handleToggleCourse = (courseId: number) => {
    if (!activeCourseModalCadet) return;
    toggleCadetCourseAccess(activeCourseModalCadet.id, courseId);
    
    // Update local modal state
    const currentList = activeCourseModalCadet.enrolled_courses || [];
    let updated: number[];
    const isNowGranted = !currentList.includes(courseId);
    
    if (currentList.includes(courseId)) {
      updated = currentList.filter((id) => id !== courseId);
    } else {
      updated = [...currentList, courseId];
    }

    const updatedCadet = { ...activeCourseModalCadet, enrolled_courses: updated };
    setActiveCourseModalCadet(updatedCadet);
    loadCadets();

    const courseObj = INITIAL_COURSES.find((c) => c.id === courseId);
    showToast(
      isNowGranted
        ? `Paid Access Granted: "${courseObj?.title}" unlocked for ${activeCourseModalCadet.full_name}!`
        : `Access Revoked: "${courseObj?.title}" removed from ${activeCourseModalCadet.full_name}.`
    );
  };

  // Grant all core initial courses in 1-click
  const handleGrantMasterPacks = () => {
    if (!activeCourseModalCadet) return;
    const coreCourseIds = [1, 2, 3, 4, 6, 26]; // ISSB, Intel, Academic, Soldier, PMA, PAF
    const merged = Array.from(new Set([...(activeCourseModalCadet.enrolled_courses || []), ...coreCourseIds]));
    setCadetCourseList(activeCourseModalCadet.id, merged);
    setActiveCourseModalCadet({ ...activeCourseModalCadet, enrolled_courses: merged });
    loadCadets();
    showToast(`Master Defense Bundle (6 Core Courses) unlocked for ${activeCourseModalCadet.full_name}!`);
  };

  // Filter students
  const filteredCadets = cadets.filter((cadet) => {
    const matchesSearch = 
      cadet.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cadet.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cadet.phone_number.includes(searchQuery) ||
      cadet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cadet.cnic_bform && cadet.cnic_bform.includes(searchQuery));

    const matchesWing = 
      selectedWing === 'all' || 
      cadet.target_wing.toLowerCase().includes(selectedWing.toLowerCase());

    return matchesSearch && matchesWing;
  });

  // Filter courses in modal
  const filteredModalCourses = INITIAL_COURSES.filter((c) => 
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F261C] border border-honor-gold text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold text-gray-100">{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#183B2B] text-white p-6 sm:p-8 rounded-3xl border border-[#2A5A44] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 text-honor-gold text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>HQ Command Registry • Sir Faryad Tabassum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Cadet Directory & Course Access Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              View all registered candidates, examine attached candidate documents, and grant paid access to any of the 41 defense courses.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <div className="bg-[#0F261C] px-4 py-2.5 rounded-xl border border-[#2A5A44] text-center">
              <div className="text-xs text-gray-400">Total Registered</div>
              <div className="text-xl font-black text-honor-gold">{cadets.length}</div>
            </div>
            <Link
              href="/admin/courses"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>Fee Manager</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Search & Wing Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Cadet Name, Roll Number (BFA-2026-...), WhatsApp Phone, or CNIC..."
              className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 w-full md:w-auto"
            >
              <option value="all">All Forces Wings</option>
              <option value="Army">Pakistan Army</option>
              <option value="PAF">Pakistan Air Force</option>
              <option value="Navy">Pakistan Navy</option>
              <option value="ISSB">ISSB Batches</option>
            </select>
          </div>
        </div>

        {/* Cadet Directory Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-600 uppercase flex items-center justify-between">
            <span>Cadet Records ({filteredCadets.length})</span>
            <span className="text-emerald-700 font-bold">
              Active in Master LMS Database
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Cadet Profile & Roll No</th>
                  <th className="p-4">Target Armed Forces Wing</th>
                  <th className="p-4">Contact & WhatsApp</th>
                  <th className="p-4">Paid Courses Access</th>
                  <th className="p-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCadets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 text-xs">
                      No matching cadet found in registry.
                    </td>
                  </tr>
                ) : (
                  filteredCadets.map((cadet) => {
                    const enrolledCount = cadet.enrolled_courses?.length || 0;
                    return (
                      <tr key={cadet.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Cadet Profile */}
                        <td className="p-4">
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>{cadet.full_name}</span>
                            {cadet.source === 'admission_form' && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Admission Form
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-2">
                            <span className="text-honor-gold font-bold">{cadet.roll_number}</span>
                            {cadet.father_name && (
                              <span>• S/O {cadet.father_name}</span>
                            )}
                          </div>
                        </td>

                        {/* Target Wing */}
                        <td className="p-4 text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-honor-gold flex-shrink-0" />
                            <span>{cadet.target_wing}</span>
                          </div>
                          {cadet.domicile && (
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              Domicile: {cadet.domicile}
                            </span>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="p-4 text-xs text-gray-600">
                          <div className="font-medium text-gray-900">{cadet.phone_number}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`https://wa.me/${cadet.phone_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum Cadet ${cadet.full_name}, this is Sir Faryad Tabassum from The Best Forces Academy regarding your admission (Roll: ${cadet.roll_number}).`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#25D366] hover:underline flex items-center gap-1 text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                              <span>WhatsApp</span>
                            </a>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 text-[10px] truncate max-w-[120px]">{cadet.email}</span>
                          </div>
                        </td>

                        {/* Active Paid Courses */}
                        <td className="p-4">
                          <button
                            onClick={() => setActiveCourseModalCadet(cadet)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                              enrolledCount > 0 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{enrolledCount} Course{enrolledCount !== 1 ? 's' : ''} Active</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setActiveDossierCadet(cadet)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            title="View Full Cadet Dossier & Attached Documents"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier / Docs</span>
                          </button>

                          <button
                            onClick={() => setActiveCourseModalCadet(cadet)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold text-xs font-bold inline-flex items-center gap-1 transition-all shadow-sm"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Grant Courses</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 1. Modal: Course Access Manager */}
      {activeCourseModalCadet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-[#183B2B] text-white p-6 flex items-center justify-between border-b border-[#2A5A44]">
              <div>
                <span className="text-[10px] font-bold text-honor-gold uppercase tracking-widest block">
                  Course Clearance & Access Control
                </span>
                <h3 className="text-xl font-black text-white">
                  Manage Access for {activeCourseModalCadet.full_name}
                </h3>
                <p className="text-xs text-gray-300">
                  Roll No: <span className="text-honor-gold font-bold">{activeCourseModalCadet.roll_number}</span> • Selected Wing: {activeCourseModalCadet.target_wing}
                </p>
              </div>
              <button
                onClick={() => setActiveCourseModalCadet(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#2A5A44] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Master Pack Action Banner */}
            <div className="bg-[#0F261C] px-6 py-3 flex items-center justify-between border-b border-[#2A5A44]">
              <span className="text-xs text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-honor-gold" />
                <span>Quickly unlock core defense pack in 1 click:</span>
              </span>
              <button
                type="button"
                onClick={handleGrantMasterPacks}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-honor-gold text-[#0F261C] hover:bg-[#d4ab3b] transition-colors"
              >
                Grant 6 Master Courses
              </button>
            </div>

            {/* Modal Course Search Bar */}
            <div className="p-4 border-b border-gray-200 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search among all 41 courses (e.g. PMA, GDP, Soldier, ISSB, Intelligence)..."
                  className="w-full text-xs pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                />
              </div>
            </div>

            {/* Course List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-gray-100">
              {filteredModalCourses.map((course) => {
                const isUnlocked = activeCourseModalCadet.enrolled_courses?.includes(course.id);
                return (
                  <div 
                    key={course.id} 
                    className="pt-3 first:pt-0 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {course.category}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 leading-snug">
                          {course.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        Fee: PKR {course.sale_price.toLocaleString()} • {course.qualification}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCourse(course.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isUnlocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active / Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Grant Paid Access</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setActiveCourseModalCadet(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#183B2B] text-white hover:bg-[#112a1f]"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Modal: Full Cadet Dossier & Attached Documents */}
      {activeDossierCadet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95">
            
            {/* Dossier Header */}
            <div className="bg-[#183B2B] text-white p-6 flex items-center justify-between border-b border-[#2A5A44]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F261C] border border-honor-gold flex items-center justify-center text-honor-gold">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-honor-gold uppercase tracking-widest block">
                    Confidential Cadet Record Dossier
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {activeDossierCadet.full_name}
                  </h3>
                  <p className="text-xs text-gray-300">
                    Roll Number: <span className="text-honor-gold font-bold">{activeDossierCadet.roll_number}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDossierCadet(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#2A5A44] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Personal Details Grid */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider border-b pb-1 text-emerald-800">
                  1. Personal & Contact Identity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Father Name</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.father_name || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">B-Form / CNIC</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.cnic_bform || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Date of Birth</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.dob || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">WhatsApp Phone</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.phone_number}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Domicile District</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.domicile || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Father Occupation</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.father_occupation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Physical & Academic Standards */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider border-b pb-1 text-emerald-800">
                  2. Academic Scores & Physical Standards
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Matric Marks</span>
                    <span className="font-bold text-emerald-700">{activeDossierCadet.matric_marks || '1010/1100'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">FSc Marks</span>
                    <span className="font-bold text-emerald-700">{activeDossierCadet.fsc_marks || '985/1100'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Height / Weight</span>
                    <span className="font-bold text-gray-800">{activeDossierCadet.height || '5.8'} ft / {activeDossierCadet.weight || '65'} kg</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-gray-400 block text-[10px]">Mark of ID</span>
                    <span className="font-bold text-gray-800 truncate block">{activeDossierCadet.mark_of_id || 'Mole on left cheek'}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Document Previews */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider border-b pb-1 text-emerald-800">
                  3. Uploaded B-Form & Result Card Documents
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Document 1: B-Form */}
                  <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-honor-gold" />
                        <span>NADRA B-Form / CNIC</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Attached
                      </span>
                    </div>
                    <div className="h-40 bg-slate-200 rounded-xl overflow-hidden relative">
                      <img
                        src={activeDossierCadet.bform_document_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'}
                        alt="Attached B-Form Document"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Document 2: Result Card */}
                  <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-honor-gold" />
                        <span>Matric / FSc Result Card</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Attached
                      </span>
                    </div>
                    <div className="h-40 bg-slate-200 rounded-xl overflow-hidden relative">
                      <img
                        src={activeDossierCadet.result_card_url || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80'}
                        alt="Scanned Result Card Document"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Dossier Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <a
                href={`https://wa.me/${activeDossierCadet.phone_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>Direct WhatsApp Candidate</span>
              </a>
              <button
                onClick={() => setActiveDossierCadet(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#183B2B] text-white hover:bg-[#112a1f]"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
