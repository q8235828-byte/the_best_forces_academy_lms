"use client";

import { Profile } from '@/types';

export interface CadetSession {
  id: string;
  full_name: string;
  roll_number: string;
  phone_number: string;
  email: string;
  target_wing: string;
  role: 'student' | 'admin';
  enrolled_courses?: number[];
  created_at: string;
}

const CADET_SESSION_KEY = 'bfa_cadet_session';
const ADMIN_SESSION_KEY = 'bfa_admin_session';

export const DEMO_CADET: CadetSession = {
  id: 'cadet-demo-01',
  full_name: 'Muhammad Hamza',
  roll_number: 'BFA-2026-7841',
  phone_number: '+92 305 4599659',
  email: 'cadet.hamza@bestforcesacademy.net',
  target_wing: 'Pakistan Army (PMA Long Course)',
  role: 'student',
  enrolled_courses: [1, 2, 4],
  created_at: new Date().toISOString()
};

export const DEMO_ADMIN: CadetSession = {
  id: 'admin-01',
  full_name: 'Sir Faryad Tabassum',
  roll_number: 'HQ-COMMAND-01',
  phone_number: '+92 305 4599659',
  email: 'admin@bestforcesacademy.net',
  target_wing: 'Director General / Lead Instructor',
  role: 'admin',
  created_at: new Date().toISOString()
};

/**
 * Get the currently logged-in user session
 */
export function getCurrentUser(): CadetSession | null {
  if (typeof window === 'undefined') return null;
  
  // Check admin session first
  const adminRaw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (adminRaw) {
    try {
      return JSON.parse(adminRaw);
    } catch (e) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }

  // Check student session
  const studentRaw = localStorage.getItem(CADET_SESSION_KEY);
  if (studentRaw) {
    try {
      return JSON.parse(studentRaw);
    } catch (e) {
      localStorage.removeItem(CADET_SESSION_KEY);
    }
  }

  return null;
}

/**
 * Log in student/cadet
 */
export function loginStudent(identifier: string, pass: string): { success: boolean; error?: string; session?: CadetSession } {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your Roll Number, Email or WhatsApp Phone.' };
  }

  // Generate or retrieve cadet session
  const storedListRaw = localStorage.getItem('bfa_registered_cadets');
  let registeredList: CadetSession[] = [];
  if (storedListRaw) {
    try {
      registeredList = JSON.parse(storedListRaw);
    } catch (e) {}
  }

  const existing = registeredList.find(
    (c) => 
      c.roll_number.toLowerCase() === identifier.trim().toLowerCase() ||
      c.email.toLowerCase() === identifier.trim().toLowerCase() ||
      c.phone_number.includes(identifier.trim())
  );

  let session: CadetSession;
  if (existing) {
    session = existing;
  } else {
    // If not in registered list, create instant session
    session = {
      id: 'cadet-' + Date.now(),
      full_name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      roll_number: 'BFA-2026-' + Math.floor(1000 + Math.random() * 9000),
      phone_number: '+92 300 0000000',
      email: identifier.includes('@') ? identifier : `${identifier}@bestforcesacademy.net`,
      target_wing: 'Pakistan Armed Forces',
      role: 'student',
      enrolled_courses: [1, 2],
      created_at: new Date().toISOString()
    };
  }

  localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('bfa_auth_changed'));
  return { success: true, session };
}

/**
 * Register new cadet
 */
export function registerCadet(data: {
  full_name: string;
  father_name: string;
  phone_number: string;
  email: string;
  target_wing: string;
  password?: string;
}): { success: boolean; session: CadetSession } {
  const rollNumber = 'BFA-2026-' + Math.floor(1000 + Math.random() * 9000);
  const newCadet: CadetSession = {
    id: 'cadet-' + Date.now(),
    full_name: data.full_name,
    roll_number: rollNumber,
    phone_number: data.phone_number,
    email: data.email,
    target_wing: data.target_wing,
    role: 'student',
    enrolled_courses: [1],
    created_at: new Date().toISOString()
  };

  // Persist to cadet directory in localStorage
  let registeredList: CadetSession[] = [];
  const storedListRaw = localStorage.getItem('bfa_registered_cadets');
  if (storedListRaw) {
    try {
      registeredList = JSON.parse(storedListRaw);
    } catch (e) {}
  }
  registeredList.push(newCadet);
  localStorage.setItem('bfa_registered_cadets', JSON.stringify(registeredList));

  // Set active session
  localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(newCadet));
  window.dispatchEvent(new Event('bfa_auth_changed'));

  return { success: true, session: newCadet };
}

/**
 * Admin Officer Authentication
 */
export function loginAdmin(emailOrUser: string, pin: string): { success: boolean; error?: string; session?: CadetSession } {
  const cleanUser = emailOrUser.trim().toLowerCase();
  const cleanPin = pin.trim();

  // Acceptable admin credentials for academy administrators
  const validUsernames = ['admin', 'admin@bestforcesacademy.net', 'sirfaryad', 'command'];
  const validPins = ['admin123', 'forces2026', '123456', 'pakistan'];

  if ((validUsernames.includes(cleanUser) || cleanUser === 'admin') && (validPins.includes(cleanPin) || cleanPin === 'admin123')) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(DEMO_ADMIN));
    window.dispatchEvent(new Event('bfa_auth_changed'));
    return { success: true, session: DEMO_ADMIN };
  }

  // Fallback allowing direct login with default pass for testing
  if (cleanPin === 'admin123' || cleanPin === 'forces2026') {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(DEMO_ADMIN));
    window.dispatchEvent(new Event('bfa_auth_changed'));
    return { success: true, session: DEMO_ADMIN };
  }

  return { success: false, error: 'Invalid Command Credentials. Use demo officer login or enter correct Pin (admin123).' };
}

/**
 * Terminate Session (Logout)
 */
export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CADET_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    window.dispatchEvent(new Event('bfa_auth_changed'));
  }
}
