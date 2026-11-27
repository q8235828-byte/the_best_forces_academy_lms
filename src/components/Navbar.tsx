"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  PhoneCall,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Crosshair,
  Compass,
  Trophy,
  Sparkles,
  User,
  UserCheck,
  LogOut,
  KeyRound,
  Play
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';
import { getCurrentUser, logoutUser, CadetSession } from '@/lib/auth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'courses' | 'tests' | 'user' | 'account' | null>(null);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileTestsOpen, setMobileTestsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CadetSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync auth state
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('bfa_auth_changed', handleAuthChange);
    return () => window.removeEventListener('bfa_auth_changed', handleAuthChange);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menu: 'courses' | 'tests' | 'user' | 'account') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#183B2B] text-white shadow-xl border-b border-[#2A5A44]/80">
      {/* Top Notification Bar */}
      <div className="bg-[#0F261C] text-xs py-1.5 border-b border-[#183B2B]/60 w-full">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-300 hidden sm:inline font-medium">
              Admissions Open 2026–2027: PMA, PAF, PN & ISSB Batches
            </span>
            <span className="text-gray-300 sm:hidden font-medium text-[11px] truncate">
              Admissions Open 2026–2027
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-gray-300 flex-shrink-0">
            {/* Top Quick Auth Links (if not logged in) */}
            {!currentUser ? (
              <div className="hidden lg:flex items-center gap-3 text-[11px]">
                <Link href="/login" className="text-gray-300 hover:text-honor-gold flex items-center gap-1 font-medium transition-colors">
                  <User className="w-3 h-3 text-honor-gold" />
                  <span>Cadet Login</span>
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/register" className="text-honor-gold hover:underline font-bold transition-colors">
                  New Registration
                </Link>
                <span className="text-gray-600">|</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3 text-[11px]">
                <Link 
                  href={currentUser.role === 'admin' ? '/admin' : '/portal/dashboard'} 
                  className="text-honor-gold font-bold hover:underline flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{currentUser.role === 'admin' ? 'Officer HQ' : `Cadet: ${currentUser.full_name}`}</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
                <span className="text-gray-600">|</span>
              </div>
            )}

            <a 
              href={`tel:${ACADEMY_CONFIG.phoneRaw}`}
              className="hover:text-honor-gold flex items-center gap-1.5 transition-colors font-medium text-[11px] sm:text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-honor-gold" />
              <span>{ACADEMY_CONFIG.phone}</span>
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <span className="hidden md:inline text-honor-gold font-semibold tracking-wide">
              Head: {ACADEMY_CONFIG.leadInstructor}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-3 sm:px-5 lg:px-6" ref={navContainerRef}>
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 w-full">
          
          {/* Logo / Brand (Compact, no domain) */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 min-w-max">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#2A5A44] to-[#0F261C] border border-honor-gold/70 flex items-center justify-center shadow-md group-hover:border-honor-gold transition-all duration-300 flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-honor-gold transform group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col justify-center flex-shrink-0 min-w-max">
              <div className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight whitespace-nowrap select-none">
                THE BEST FORCES <span className="text-honor-gold">ACADEMY</span>
              </div>
              <div className="text-[9px] text-gray-300 uppercase tracking-wider font-semibold whitespace-nowrap select-none">
                PREMIER DEFENSE LMS
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 whitespace-nowrap">
            {/* Home */}
            <Link
              href="/"
              className={`px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                pathname === '/' 
                  ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/40' 
                  : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
              }`}
            >
              Home
            </Link>

            {/* Mega Menu: Courses & Wings */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('courses')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'courses' ? null : 'courses')}
                className={`px-2.5 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1 transition-all ${
                  activeDropdown === 'courses' || pathname.startsWith('/courses')
                    ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/40' 
                    : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
                }`}
                aria-expanded={activeDropdown === 'courses'}
              >
                <BookOpen className="w-3.5 h-3.5 text-honor-gold" />
                <span>Courses & Wings</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-honor-gold/20 text-honor-gold border border-honor-gold/30">
                  41
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'courses' ? 'rotate-180 text-honor-gold' : 'text-gray-400'}`} />
              </button>

              {/* Mega Menu Dropdown Container */}
              {activeDropdown === 'courses' && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[880px] bg-[#0F261C] border border-[#2A5A44] rounded-2xl shadow-2xl overflow-hidden p-6 text-left transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  {/* Category Grid */}
                  <div className="grid grid-cols-4 gap-5 pb-6 border-b border-[#2A5A44]">
                    
                    {/* Column 1: Army */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#2A5A44]/60">
                        <div className="p-1.5 rounded-md bg-[#183B2B] text-emerald-400">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Pakistan Army</h4>
                          <span className="text-[10px] text-gray-400">PMA & Recruits</span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link href="/courses/pma-long-course" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            PMA Long Course (154-156)
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/tcc-technical-cadet" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Technical Cadet (TCC)
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/army-soldier" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Soldier Recruitment
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/army-lcc" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Lady Cadet Course (LCC)
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/amc-medical-cadet" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Army Medical College (AMC)
                          </Link>
                        </li>
                      </ul>
                      <Link 
                        href="/courses?cat=army" 
                        className="text-[11px] font-bold text-honor-gold hover:underline flex items-center gap-1 pt-1"
                      >
                        Explore Army Programs <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Column 2: PAF */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#2A5A44]/60">
                        <div className="p-1.5 rounded-md bg-[#183B2B] text-sky-400">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Air Force (PAF)</h4>
                          <span className="text-[10px] text-gray-400">Officers & Airmen</span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link href="/courses/paf-gdp" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            GD Pilot (GDP)
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/paf-cae" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Aeronautical Engineering
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/paf-ad" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Air Defence / Logistics
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/paf-aerotrade" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Aero Trades & Airmen
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/paf-asd" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Admin & Special Duties
                          </Link>
                        </li>
                      </ul>
                      <Link 
                        href="/courses?cat=paf" 
                        className="text-[11px] font-bold text-honor-gold hover:underline flex items-center gap-1 pt-1"
                      >
                        Explore PAF Programs <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Column 3: Navy */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#2A5A44]/60">
                        <div className="p-1.5 rounded-md bg-[#183B2B] text-blue-400">
                          <Crosshair className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Pakistan Navy</h4>
                          <span className="text-[10px] text-gray-400">Cadets & Sailors</span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link href="/courses/pn-cadet" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            PN Cadet Commission
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/navy-technical" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Technical Branch
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/navy-marine" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Marine Branch
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/navy-sailor" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Sailor Recruitment
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/navy-ssc" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Direct Short Service (SSC)
                          </Link>
                        </li>
                      </ul>
                      <Link 
                        href="/courses?cat=navy" 
                        className="text-[11px] font-bold text-honor-gold hover:underline flex items-center gap-1 pt-1"
                      >
                        Explore Navy Programs <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Column 4: ISSB Master */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-[#2A5A44]/60">
                        <div className="p-1.5 rounded-md bg-[#183B2B] text-honor-gold">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">ISSB & Tests</h4>
                          <span className="text-[10px] text-gray-400">Master Preparation</span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link href="/courses/issb-complete-prep" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block font-medium">
                            ISSB 4-Day Master Pack
                          </Link>
                        </li>
                        <li>
                          <Link href="/tests/wat" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            10s WAT Video Engine
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/initial-intelligence-mastery" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Verbal & Non-Verbal Intel
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/initial-academic-mastery" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Academic Test Mastery
                          </Link>
                        </li>
                        <li>
                          <Link href="/courses/cadet-college-prep" className="text-gray-300 hover:text-honor-gold hover:pl-1 transition-all block">
                            Cadet Colleges & Entry
                          </Link>
                        </li>
                      </ul>
                      <Link 
                        href="/courses?cat=issb" 
                        className="text-[11px] font-bold text-honor-gold hover:underline flex items-center gap-1 pt-1"
                      >
                        Explore ISSB Programs <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="pt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Sparkles className="w-4 h-4 text-honor-gold" />
                      <span>All 41 courses include syllabus guidelines, video lectures & computerized exam testing.</span>
                    </div>
                    <Link
                      href="/courses"
                      className="px-4 py-2 rounded-lg bg-[#2A5A44] hover:bg-[#346E53] text-honor-gold font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>View All 41 Academy Courses</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown: Testing Engine */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('tests')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'tests' ? null : 'tests')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  activeDropdown === 'tests' || pathname.startsWith('/tests') || pathname.startsWith('/portal/leaderboard')
                    ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/40' 
                    : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
                }`}
                aria-expanded={activeDropdown === 'tests'}
              >
                <Clock className="w-4 h-4 text-honor-gold" />
                <span>Testing Lab</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tests' ? 'rotate-180 text-honor-gold' : 'text-gray-400'}`} />
              </button>

              {/* Testing Lab Dropdown Menu */}
              {activeDropdown === 'tests' && (
                <div 
                  className="absolute left-0 top-full mt-2 w-80 bg-[#0F261C] border border-[#2A5A44] rounded-2xl shadow-2xl overflow-hidden p-3 text-left transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2 space-y-1"
                >
                  <Link
                    href="/tests"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#183B2B] transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-[#2A5A44] text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-honor-gold transition-colors flex items-center gap-1.5">
                        <span>Computer Mock Tests</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Simulated GHQ/NHQ/Air HQ computerized exam terminal with live countdown.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/tests/wat"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#183B2B] transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-[#2A5A44] text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-honor-gold transition-colors flex items-center gap-1.5">
                        <span>10s WAT Simulator</span>
                        <span className="text-[9px] bg-red-600/80 text-white font-black px-1.5 py-0.5 rounded uppercase">
                          ISSB
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Word Association Test automatic 10-second projection slide engine.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/portal/leaderboard"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#183B2B] transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-[#2A5A44] text-honor-gold group-hover:bg-honor-gold group-hover:text-white transition-colors">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-honor-gold transition-colors flex items-center gap-1.5">
                        <span>Hall of Fame / Leaderboard</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        National cadet rankings by test accuracy, speed & aggregate scores.
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Admission & Roll Slip */}
            <Link
              href="/admission-form"
              className={`px-2.5 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                pathname === '/admission-form' 
                  ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/40' 
                  : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-honor-gold" />
              <span>Admission & Roll Slip</span>
            </Link>

            {/* Success Stories */}
            <Link
              href="/success-stories"
              className={`px-2.5 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                pathname === '/success-stories' 
                  ? 'bg-[#2A5A44] text-honor-gold border border-honor-gold/40' 
                  : 'text-gray-200 hover:text-white hover:bg-[#2A5A44]/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-honor-gold" />
              <span>Success Stories</span>
            </Link>
          </nav>

          {/* Right Action: Account/Portal Dropdown + WhatsApp CTA Button */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 min-w-max">
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'account' ? null : 'account')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-honor-gold bg-[#0F261C] border border-honor-gold/60 hover:border-honor-gold hover:bg-[#183B2B] flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                aria-expanded={activeDropdown === 'account'}
              >
                <User className="w-3.5 h-3.5 text-honor-gold flex-shrink-0" />
                <span>
                  {currentUser
                    ? currentUser.role === 'admin'
                      ? 'Mentor'
                      : currentUser.full_name?.split(' ')[0] || 'Cadet'
                    : 'Login / Register'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'account' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'account' && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0F261C] border border-[#2A5A44] rounded-2xl shadow-2xl overflow-hidden p-3 text-left z-50 space-y-2">
                  {!currentUser ? (
                    <div className="space-y-1.5 pb-2 border-b border-[#2A5A44]">
                      <Link
                        href="/login"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-honor-gold" />
                          <span>Cadet Sign In</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-honor-gold hover:bg-amber-400 text-slate-950 text-xs font-black transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>New Cadet Registration</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pb-2 border-b border-[#2A5A44]">
                      <Link
                        href={currentUser.role === 'admin' ? '/admin' : '/portal/dashboard'}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#183B2B] hover:bg-[#2A5A44] text-honor-gold text-xs font-bold transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>{currentUser.role === 'admin' ? 'Officer Command Center' : 'My Cadet Dashboard'}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/20 text-xs font-bold transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}

                  {/* Quick Student Tools inside Dropdown */}
                  <div className="space-y-1 pt-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Quick Student Tools
                    </div>
                    <Link
                      href="/admission-form"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:text-white hover:bg-[#183B2B] transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-honor-gold" />
                      <span>Online Admission & Roll Slip</span>
                    </Link>
                    <Link
                      href="/tests"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:text-white hover:bg-[#183B2B] transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Initial & ISSB Mock Tests</span>
                    </Link>
                    <Link
                      href="/tests/non-verbal-pdf"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:text-white hover:bg-[#183B2B] transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      <span>Non-Verbal Solved PDF Guide</span>
                    </Link>
                    <Link
                      href="/tests/wat"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:text-white hover:bg-[#183B2B] transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>10s WAT Video Simulator</span>
                    </Link>
                    <Link
                      href="/success-stories"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:text-white hover:bg-[#183B2B] transition-all"
                    >
                      <Award className="w-3.5 h-3.5 text-honor-gold" />
                      <span>Academy Success Stories</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Mentor, I want admission guidance for The Best Forces Academy courses.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 sm:p-2.5 rounded-xl bg-[#2A5A44] border border-[#2A5A44] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-honor-gold" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0F261C] border-b border-[#2A5A44] px-4 pt-3 pb-8 space-y-3 max-h-[85vh] overflow-y-auto">
          
          {/* User Status Bar in Mobile */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-[#183B2B] border border-honor-gold/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F261C] text-honor-gold flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.full_name}</div>
                  <div className="text-[10px] text-honor-gold">Roll: {currentUser.roll_number}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={currentUser.role === 'admin' ? '/admin/courses' : '/portal/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-gray-400 hover:text-red-400"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#2A5A44]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl bg-[#2A5A44] text-white hover:bg-[#346E53]"
              >
                Cadet Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl bg-honor-gold text-[#0F261C] hover:bg-[#d4ab3b]"
              >
                Register Cadet
              </Link>
            </div>
          )}

          {/* Home Link */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-200 hover:text-white hover:bg-[#2A5A44]"
          >
            Home
          </Link>

          {/* Mobile Courses Accordion */}
          <div className="border border-[#2A5A44] rounded-xl overflow-hidden bg-[#183B2B]/40">
            <button
              onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
              className="w-full px-3 py-3 flex items-center justify-between text-sm font-bold text-white text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-honor-gold" />
                <span>Courses & Defense Wings</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-honor-gold/20 text-honor-gold font-bold">
                  41 Courses
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileCoursesOpen ? 'rotate-180 text-honor-gold' : ''}`} />
            </button>

            {mobileCoursesOpen && (
              <div className="px-3 pb-3 pt-1 space-y-2 border-t border-[#2A5A44] text-xs">
                <Link
                  href="/courses?cat=army"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">Pakistan Army</div>
                  <div className="text-[10px] text-gray-400">PMA Long Course, Soldier, TCC, LCC, AMC</div>
                </Link>

                <Link
                  href="/courses?cat=paf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">Pakistan Air Force (PAF)</div>
                  <div className="text-[10px] text-gray-400">GD Pilot, Aeronautical Engg, Air Defence, Airmen</div>
                </Link>

                <Link
                  href="/courses?cat=navy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">Pakistan Navy</div>
                  <div className="text-[10px] text-gray-400">PN Cadet, Operations, Marines, Sailor</div>
                </Link>

                <Link
                  href="/courses?cat=issb"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">ISSB Complete Master Pack</div>
                  <div className="text-[10px] text-gray-400">Screening, WAT, TAT, OPI, Group Tasks, Interviews</div>
                </Link>

                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-xs font-bold text-honor-gold bg-[#2A5A44] rounded-lg mt-2"
                >
                  View All 41 Academy Courses →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Testing Lab Accordion */}
          <div className="border border-[#2A5A44] rounded-xl overflow-hidden bg-[#183B2B]/40">
            <button
              onClick={() => setMobileTestsOpen(!mobileTestsOpen)}
              className="w-full px-3 py-3 flex items-center justify-between text-sm font-bold text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-honor-gold" />
                <span>Testing Lab & Simulators</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileTestsOpen ? 'rotate-180 text-honor-gold' : ''}`} />
            </button>

            {mobileTestsOpen && (
              <div className="px-3 pb-3 pt-1 space-y-2 border-t border-[#2A5A44] text-xs">
                <Link
                  href="/tests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">Computer Mock Tests</div>
                  <div className="text-[10px] text-gray-400">GHQ/NHQ/Air HQ computerized exam terminal</div>
                </Link>

                <Link
                  href="/tests/wat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>10s WAT Simulator</span>
                    <span className="text-[9px] bg-red-600 px-1 rounded text-white">ISSB</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Word Association Test with countdown</div>
                </Link>

                <Link
                  href="/portal/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-[#0F261C] text-gray-300 hover:text-honor-gold"
                >
                  <div className="font-bold text-white">Hall of Fame / Leaderboard</div>
                  <div className="text-[10px] text-gray-400">Cadet test rankings and badges</div>
                </Link>
              </div>
            )}
          </div>

          {/* Admission & Roll Slip */}
          <Link
            href="/admission-form"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-200 hover:text-white hover:bg-[#2A5A44]"
          >
            <FileText className="w-4 h-4 text-honor-gold" />
            <span>Admission Form & Roll Slip</span>
          </Link>

          {/* Success Stories */}
          <Link
            href="/success-stories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-200 hover:text-white hover:bg-[#2A5A44]"
          >
            <Award className="w-4 h-4 text-honor-gold" />
            <span>Success Stories</span>
          </Link>

          {/* Mobile WhatsApp Button */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Mentor, I need admission guidance for The Best Forces Academy.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>WhatsApp Mentor</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
