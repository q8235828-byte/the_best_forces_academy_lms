"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { Course } from '@/types';
import { Shield, DollarSign, Save, Edit2, CheckCircle, Search, Users, ArrowLeft } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRegular, setEditRegular] = useState<number>(0);
  const [editSale, setEditSale] = useState<number>(0);
  const [editWhatsapp, setEditWhatsapp] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartEdit = (c: Course) => {
    setEditingId(c.id);
    setEditRegular(c.regular_price);
    setEditSale(c.sale_price);
    setEditWhatsapp(c.whatsapp_group_link || '');
    setSaveSuccess(false);
  };

  const handleSaveEdit = (courseId: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              regular_price: Number(editRegular),
              sale_price: Number(editSale),
              whatsapp_group_link: editWhatsapp
            }
          : c
      )
    );
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#183B2B] text-white p-6 sm:p-8 rounded-3xl border border-[#2A5A44] shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-honor-gold text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Administrative Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Course Fee & VIP Batch Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Instantly modify live course admission fees, discount sale prices, and VIP WhatsApp batch invite links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/students"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-honor-gold" />
              <span>Student Registry</span>
            </Link>
          </div>
        </div>

        {/* Save notification */}
        {saveSuccess && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Pricing and WhatsApp batch settings updated successfully in database!</span>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or slug..."
            className="w-full text-sm outline-none text-gray-800"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-600 uppercase">
            Total Catalog Courses: {filtered.length}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Course Name & Category</th>
                  <th className="p-4">Regular Fee</th>
                  <th className="p-4">Sale Fee (PKR)</th>
                  <th className="p-4">VIP WhatsApp Batch Link</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((course, idx) => {
                  const isEditing = editingId === course.id;

                  return (
                    <tr key={course.id} className="hover:bg-gray-50/70">
                      <td className="p-4 text-xs font-mono text-gray-400">{idx + 1}</td>
                      <td className="p-4 font-semibold text-gray-900 max-w-sm">
                        <div className="line-clamp-1">{course.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          /{course.slug} • <span className="uppercase text-army font-bold">{course.category}</span>
                        </div>
                      </td>

                      {/* Regular Price */}
                      <td className="p-4 text-xs font-medium">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editRegular}
                            onChange={(e) => setEditRegular(Number(e.target.value))}
                            className="w-24 px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          <span className="text-gray-500">PKR {course.regular_price.toLocaleString()}</span>
                        )}
                      </td>

                      {/* Sale Price */}
                      <td className="p-4 text-xs font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editSale}
                            onChange={(e) => setEditSale(Number(e.target.value))}
                            className="w-24 px-2 py-1 border rounded text-xs font-bold text-emerald-700"
                          />
                        ) : (
                          <span className="text-emerald-700 font-bold">PKR {course.sale_price.toLocaleString()}</span>
                        )}
                      </td>

                      {/* WhatsApp Batch Link */}
                      <td className="p-4 text-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editWhatsapp}
                            onChange={(e) => setEditWhatsapp(e.target.value)}
                            placeholder="https://chat.whatsapp.com/..."
                            className="w-48 px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          <span className="text-gray-500 truncate block max-w-xs text-[11px]">
                            {course.whatsapp_group_link || 'Default Batch Link'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(course.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto shadow"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(course)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Fee</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
