"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Shield, 
  MessageCircle, 
  CreditCard,
  FileCheck
} from 'lucide-react';
import { Enrollment } from '@/types';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function AdminStudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 1,
      user_id: 'usr_001',
      student_name: 'Muhammad Ali Khan',
      student_phone: '0305 4599659',
      course_id: 1,
      course_title: 'ISSB Complete Master Preparation Course (Army, Navy, PAF)',
      payment_method: 'jazzcash',
      trx_id: '92817293841',
      status: 'approved',
      created_at: '2026-10-22 12:15'
    },
    {
      id: 2,
      user_id: 'usr_002',
      student_name: 'Cadet Hamza Tariq',
      student_phone: '0300 8472910',
      course_id: 6,
      course_title: 'Pakistan Army - PMA Long Course (Commission)',
      payment_method: 'easypaisa',
      trx_id: '81726354819',
      status: 'approved',
      created_at: '2026-10-22 13:40'
    },
    {
      id: 3,
      user_id: 'usr_003',
      student_name: 'Ayesha Fatima',
      student_phone: '0333 5192847',
      course_id: 7,
      course_title: 'Pakistan Army - AFNS (Armed Forces Nursing Services)',
      payment_method: 'bank_transfer',
      trx_id: 'MEZN-9481920',
      status: 'pending',
      created_at: '2026-10-22 16:50'
    },
    {
      id: 4,
      user_id: 'usr_004',
      student_name: 'Usman Ghani',
      student_phone: '0312 9481029',
      course_id: 26,
      course_title: 'PAF - GDP (General Duty Pilot)',
      payment_method: 'jazzcash',
      trx_id: '30194829102',
      status: 'pending',
      created_at: '2026-10-22 17:10'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = (id: number, newStatus: 'approved' | 'rejected' | 'pending') => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const filtered = enrollments.filter((e) =>
    e.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.trx_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.student_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.course_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#183B2B] text-white p-6 sm:p-8 rounded-3xl border border-[#2A5A44] shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-honor-gold text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Administrative Student Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Candidate Enrollment & Payment Verifications
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Review candidate payment proofs (JazzCash, EasyPaisa, Bank), activate course lectures, and grant VIP batch access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all"
            >
              Fee Manager
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate by name, phone, course, or TRX ID..."
            className="w-full text-sm outline-none text-gray-800"
          />
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-600 uppercase flex items-center justify-between">
            <span>Enrolled Students ({filtered.length})</span>
            <span className="text-emerald-700 font-bold">
              Approved: {filtered.filter((e) => e.status === 'approved').length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Candidate Information</th>
                  <th className="p-4">Selected Course</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">TRX ID</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-semibold text-gray-900">
                      <div>{item.student_name}</div>
                      <div className="text-xs text-gray-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{item.student_phone}</span>
                        <a
                          href={`https://wa.me/${item.student_phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:underline flex items-center gap-0.5 text-[11px]"
                        >
                          <MessageCircle className="w-3 h-3 fill-[#25D366]" /> Chat
                        </a>
                      </div>
                    </td>

                    <td className="p-4 text-xs text-gray-700 max-w-xs truncate">
                      {item.course_title}
                    </td>

                    <td className="p-4 text-xs uppercase font-bold">
                      <span className={`px-2.5 py-1 rounded-md ${
                        item.payment_method === 'jazzcash' ? 'bg-red-50 text-red-700' :
                        item.payment_method === 'easypaisa' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {item.payment_method}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-xs font-bold text-gray-800">
                      {item.trx_id}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {item.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'approved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow"
                        >
                          Approve
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'rejected')}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-3 py-1.5 rounded-lg"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
