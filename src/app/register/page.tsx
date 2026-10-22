"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Compass,
  FileText,
  Sparkles
} from 'lucide-react';
import { registerCadet } from '@/lib/auth';
import { ACADEMY_CONFIG } from '@/lib/constants';

export const runtime = 'edge';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    phone_number: '',
    email: '',
    target_wing: 'Pakistan Army (PMA Long Course)',
    password: '',
    confirm_password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [successCadet, setSuccessCadet] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const targetWings = [
    'Pakistan Army (PMA Long Course 154-156)',
    'Pakistan Army (Technical Cadet Course - TCC)',
    'Pakistan Army (Soldier Recruitment)',
    'Pakistan Air Force (GD Pilot / GDP)',
    'Pakistan Air Force (Aeronautical Engineering)',
    'Pakistan Air Force (Aero Trades / Airmen)',
    'Pakistan Navy (PN Cadet Regular Commission)',
    'Pakistan Navy (Sailor / Marine)',
    'ISSB Complete 4-Day Master Batch',
    'Cadet & Military Colleges (Class 7/8/11)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password && formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerCadet({
        full_name: formData.full_name,
        father_name: formData.father_name,
        phone_number: formData.phone_number,
        email: formData.email,
        target_wing: formData.target_wing,
        password: formData.password
      });

      if (res.success) {
        setSuccessCadet(res.session);
        setIsLoading(false);
      } else {
        setError('Registration could not be completed. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Top Header Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-honor-gold to-emerald-800" />

        {/* Success Modal / State */}
        {successCadet ? (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-honor-gold uppercase tracking-widest">
                Registration Confirmed
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Welcome Cadet, {successCadet.full_name}!
              </h2>
              <p className="text-xs text-slate-600">
                Your official cadet profile has been generated in The Best Forces Academy LMS.
              </p>
            </div>

            {/* Official Cadet Identity Card Preview */}
            <div className="bg-[#183B2B] text-white p-6 rounded-2xl border border-honor-gold/60 shadow-xl text-left space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-[#2A5A44] pb-3">
                <div>
                  <div className="text-[10px] text-honor-gold uppercase tracking-widest font-bold">
                    Official Roll Number
                  </div>
                  <div className="text-2xl font-black text-white tracking-wider">
                    {successCadet.roll_number}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#2A5A44] text-honor-gold">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Cadet Name</span>
                  <span className="font-bold text-white">{successCadet.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">WhatsApp Phone</span>
                  <span className="font-bold text-white">{successCadet.phone_number}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px]">Target Commission / Wing</span>
                  <span className="font-bold text-honor-gold">{successCadet.target_wing}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/portal/dashboard')}
                className="w-full py-3.5 px-4 bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Cadet Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/admission-form"
                className="block text-center text-xs font-bold text-[#183B2B] hover:underline"
              >
                Download / Print Official Roll Number Slip →
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#183B2B] border border-honor-gold flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-honor-gold" />
              </div>
              <span className="text-[11px] font-bold text-honor-gold uppercase tracking-widest block">
                Admissions 2026–2027 Batches
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                New Cadet Registration
              </h2>
              <p className="text-xs text-slate-500">
                Register to enroll in 41 defense courses, computerized test modules & ISSB guidance
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cadet Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Father Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Father / Guardian Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      placeholder="e.g. Tariq Mahmood"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="0305 4599659"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cadet@gmail.com"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Target Defense Wing */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Armed Forces Wing / Course *
                </label>
                <div className="relative">
                  <select
                    value={formData.target_wing}
                    onChange={(e) => setFormData({ ...formData, target_wing: e.target.value })}
                    className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                  >
                    {targetWings.map((wing) => (
                      <option key={wing} value={wing}>{wing}</option>
                    ))}
                  </select>
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Registering Cadet...</span>
                ) : (
                  <>
                    <span>Generate Cadet Roll Number & Register</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                Already registered with a Roll Number?{' '}
                <Link 
                  href="/login" 
                  className="font-bold text-[#183B2B] hover:text-honor-gold underline transition-colors"
                >
                  Sign In to Cadet Portal →
                </Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
