"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { loginAdmin } from '@/lib/auth';

export const runtime = 'edge';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('qa034942@gmail.com');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(username, pin);
      if (res.success) {
        router.push('/admin/courses');
      } else {
        setError(res.error || 'Access Denied: Invalid Security Pin or Username.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickOfficerLogin = () => {
    setUsername('qa034942@gmail.com');
    setPin('Qa034942@#$');
    loginAdmin('qa034942@gmail.com', 'Qa034942@#$');
    router.push('/admin/courses');
  };

  return (
    <div className="min-h-screen bg-[#0F261C] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Seals */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Shield className="w-[600px] h-[600px] text-honor-gold" />
      </div>

      <div className="max-w-md w-full bg-[#183B2B] p-8 sm:p-10 rounded-3xl shadow-2xl border border-honor-gold/40 relative z-10 space-y-6">
        
        {/* Top Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-honor-gold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Academy Home</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0F261C] border border-honor-gold flex items-center justify-center shadow-xl">
            <Lock className="w-8 h-8 text-honor-gold" />
          </div>
          <span className="text-[10px] font-bold text-honor-gold uppercase tracking-widest block">
            Command Center • Head: Mentor
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Officer Portal
          </h1>
          <p className="text-xs text-gray-300">
            Defense LMS Course Management, Fee Verifications & Cadet Registries
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-900/60 border border-red-500/50 flex items-start gap-2 text-red-200 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-honor-gold uppercase tracking-wider mb-1">
              Officer Email / ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="qa034942@gmail.com"
                className="w-full px-4 py-3 pl-10 text-sm bg-[#0F261C] border border-[#2A5A44] text-white rounded-xl focus:ring-2 focus:ring-honor-gold focus:border-transparent outline-none transition-all placeholder:text-gray-500"
              />
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-honor-gold uppercase tracking-wider mb-1">
              Security Pin / Key
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pl-10 pr-10 text-sm bg-[#0F261C] border border-[#2A5A44] text-white rounded-xl focus:ring-2 focus:ring-honor-gold focus:border-transparent outline-none transition-all placeholder:text-gray-500"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white focus:outline-none"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-honor-gold hover:bg-[#d4ab3b] text-[#0F261C] font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Clearance...</span>
            ) : (
              <>
                <span>Access Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Officer Access */}
        <div className="pt-2 border-t border-[#2A5A44]">
          <button
            type="button"
            onClick={handleQuickOfficerLogin}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-[#2A5A44] text-honor-gold border border-honor-gold/30 hover:bg-[#346E53] flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-honor-gold" />
            <span>1-Click Officer Auto-Sign In</span>
          </button>
        </div>

        {/* Student Redirection */}
        <div className="text-center pt-1">
          <Link 
            href="/login" 
            className="text-xs text-gray-400 hover:text-white underline transition-colors"
          >
            Cadet Student? Click here for Student Sign In →
          </Link>
        </div>

      </div>
    </div>
  );
}
