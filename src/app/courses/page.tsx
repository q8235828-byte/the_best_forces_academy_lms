"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseCard from '@/components/CourseCard';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { Search, Filter, Shield, BookOpen, Check } from 'lucide-react';
import { CourseCategory, TargetGender } from '@/types';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'issb', label: 'ISSB Master Preparation' },
    { id: 'initial_prep', label: 'Initial Tests (Intelligence & Academic)' },
    { id: 'army', label: 'Pakistan Army' },
    { id: 'navy', label: 'Pakistan Navy' },
    { id: 'paf', label: 'Pakistan Air Force (PAF)' },
    { id: 'cadet_college', label: 'Cadet & Military Colleges' },
    { id: 'entry_test', label: 'Entry Tests (MDCAT/ECAT/LAT)' },
    { id: 'academics', label: 'School & College Coaching' }
  ];

  const filteredCourses = useMemo(() => {
    return INITIAL_COURSES.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.syllabus_summary && course.syllabus_summary.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCat = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesGender = selectedGender === 'all' || course.target_gender === selectedGender || course.target_gender === 'Both';

      return matchesSearch && matchesCat && matchesGender;
    });
  }, [searchQuery, selectedCategory, selectedGender]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="bg-[#183B2B] text-white p-8 sm:p-12 rounded-3xl border border-[#2A5A44] shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-xs text-honor-gold uppercase tracking-widest font-bold">
              The Best Forces Academy • Course Master Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              All 41 Defense & Academic Courses
            </h1>
            <p className="text-sm text-gray-200">
              Browse syllabus guidelines, free preview lectures, and computerized testing prep for every commission and non-commission trade in Pakistan Armed Forces.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses (e.g. PMA, GD Pilot, PN Cadet)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#183B2B] focus:ring-1 focus:ring-[#183B2B] outline-none text-sm"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Target Gender:</span>
            <div className="flex gap-1.5">
              {['all', 'Boys', 'Girls'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedGender === g
                      ? 'bg-[#183B2B] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#183B2B] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="space-y-4">
          <div className="text-xs text-gray-500 font-semibold">
            Showing <strong className="text-gray-900">{filteredCourses.length}</strong> available courses
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No courses match your search</h3>
              <p className="text-sm text-gray-500 mt-1">Try clearing your filters or search terms.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-16 text-center text-gray-500">
        Loading Courses Catalog...
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
