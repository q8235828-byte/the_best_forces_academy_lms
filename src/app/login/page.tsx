"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { loginStudent, loginAdmin, DEMO_CADET, DEMO_ADMIN } from '@/lib/auth';
import { ACADEMY_CONFIG } from '@/lib/constants';

export const runtime = 'edge';

export default function LoginPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (roleTab === 'student') {
        const res = loginStudent(identifier, password);
        if (res.success) {
          router.push('/portal/dashboard');
        } else {
          setError(res.error || 'Failed to login as student.');
          setIsLoading(false);
        }
      } else {
        const res = loginAdmin(identifier, password);
        if (res.success) {
          router.push('/admin/courses');
        } else {
          setError(res.error || 'Invalid Admin / Officer credentials.');
          setIsLoading(false);
        }
      }
    }, 400);
  };

  const handleDemoStudent = () => {
    setIdentifier(DEMO_CADET.roll_number);
    setPassword('cadet123');
    loginStudent(DEMO_CADET.roll_number, 'cadet123');
    router.push('/portal/dashboard');
  };

  const handleDemoAdmin = () => {
    setRoleTab('admin');
    setIdentifier('qa034942@gmail.com');
    setPassword('Qa034942@#$');
    loginAdmin('qa034942@gmail.com', 'Qa034942@#$');
    router.push('/admin/courses');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-honor-gold to-emerald-800" />

        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#183B2B] to-[#0F261C] border border-honor-gold flex items-center justify-center shadow-lg">
            <Shield className="w-9 h-9 text-honor-gold" />
          </div>
          <span className="text-[11px] font-bold text-honor-gold uppercase tracking-widest block">
            THE BEST FORCES ACADEMY LMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {roleTab === 'student' ? 'Cadet Portal Sign In' : 'Officer Command Login'}
          </h2>
          <p className="text-xs text-slate-500">
            {roleTab === 'student'
              ? 'Access your enrolled courses, WAT simulator & computerized test reports'
              : 'Authorized defense academy administrators and instructors only'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setRoleTab('student'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'student'
                ? 'bg-[#183B2B] text-honor-gold shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Cadet Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setRoleTab('admin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'admin'
                ? 'bg-[#183B2B] text-honor-gold shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin / Officer</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {roleTab === 'student' ? 'Roll No / WhatsApp / Email' : 'Admin Username / Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={roleTab === 'student' ? 'e.g. BFA-2026-7841 or 03054599659' : 'qa034942@gmail.com'}
                className="w-full px-4 py-3 pl-10 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password / Security Pin
              </label>
              {roleTab === 'student' && (
                <a
                  href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Sir Faryad Tabassum, I forgot my Cadet LMS password.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Forgot? Ask on WhatsApp
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pl-10 pr-10 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#183B2B] focus:border-transparent outline-none transition-all"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to {roleTab === 'student' ? 'Cadet Portal' : 'Admin Suite'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="pt-2 border-t border-slate-200">
          <div className="text-center text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-2.5">
            Quick 1-Click Test Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Cadet Login</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Demo Officer Login</span>
            </button>
          </div>
        </div>

        {/* Registration Footer CTA */}
        {roleTab === 'student' && (
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              New Cadet seeking admission?{' '}
              <Link 
                href="/register" 
                className="font-bold text-[#183B2B] hover:text-honor-gold underline transition-colors"
              >
                Register for 2026-2027 Batches →
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
