"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  BookOpen, 
  Award, 
  FileText, 
  Clock, 
  MessageCircle, 
  Menu, 
  X, 
  Lock,
  PhoneCall
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'All Courses (41)' },
    { href: '/tests', label: 'Computer Mock Tests' },
    { href: '/tests/wat', label: '10s WAT Engine' },
    { href: '/portal/leaderboard', label: 'Leaderboard' },
    { href: '/admission-form', label: 'Admission & Roll Slip' },
    { href: '/admin/courses', label: 'Admin Portal' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#183B2B] text-white shadow-lg border-b border-[#2A5A44]">
      {/* Top Notification Bar */}
      <div className="bg-[#0F261C] text-xs py-1.5 px-4 text-center border-b border-[#183B2B]/50 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-gray-300 hidden sm:inline">Admissions Open 2026-2027: PMA, PAF, PN, ISSB Batches</span>
          <span className="text-gray-300 sm:hidden">Admissions Open 2026-2027</span>
        </div>
        <div className="flex items-center gap-4 text-gray-300">
          <a 
            href={`tel:${ACADEMY_CONFIG.phoneRaw}`}
            className="hover:text-honor-gold flex items-center gap-1 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-honor-gold" />
            <span>{ACADEMY_CONFIG.phone}</span>
          </a>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="hidden md:inline text-honor-gold font-medium">Head: {ACADEMY_CONFIG.leadInstructor}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2A5A44] to-[#0F261C] border border-honor-gold/60 flex items-center justify-center shadow-md group-hover:border-honor-gold transition-all">
              <Shield className="w-7 h-7 text-honor-gold" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                THE BEST FORCES <span className="text-honor-gold">ACADEMY</span>
              </div>
              <div className="text-[11px] text-gray-300 uppercase tracking-widest font-medium">
                Premier Defense LMS • bestforcesacademy.net
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/30' 
                      : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* WhatsApp Direct Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Sir Faryad Tabassum, I want admission guidance for The Best Forces Academy courses.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Sir Faryad</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg bg-[#2A5A44]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F261C] border-b border-[#2A5A44] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-[#2A5A44]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Sir Faryad Tabassum, I need admission guidance for The Best Forces Academy.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-3 rounded-lg text-center font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>WhatsApp Sir Faryad Tabassum</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
