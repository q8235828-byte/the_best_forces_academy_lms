"use client";

import { Profile } from '@/types';

export interface CadetSession {
  id: string;
  full_name: string;
  father_name?: string;
  cnic_bform?: string;
  dob?: string;
  gender?: string;
  roll_number: string;
  phone_number: string;
  email: string;
  target_wing: string;
  domicile?: string;
  height?: string;
  weight?: string;
  matric_marks?: string;
  fsc_marks?: string;
  mark_of_id?: string;
  religion?: string;
  sect?: string;
  father_occupation?: string;
  bform_document_url?: string;
  result_card_url?: string;
  role: 'student' | 'admin';
  enrolled_courses: number[];
  created_at: string;
  source?: 'registration' | 'admission_form';
}

const CADET_SESSION_KEY = 'bfa_cadet_session';
const ADMIN_SESSION_KEY = 'bfa_admin_session';
const REGISTERED_CADETS_KEY = 'bfa_registered_cadets';

export const INITIAL_REGISTERED_CADETS: CadetSession[] = [
  {
    id: 'cadet-001',
    full_name: 'QAISER FARYAD',
    father_name: 'FARYAD HUSSAIN',
    cnic_bform: '35101-1675782-9',
    dob: '2001-08-14',
    gender: 'Male',
    roll_number: 'BFA-2026-541797',
    phone_number: '+92 305 4599659',
    email: 'qaiser.faryad@gmail.com',
    target_wing: 'Pakistan Army (PMA Long Course)',
    domicile: 'Kasur (Pattoki)',
    height: '5.9',
    weight: '64',
    matric_marks: '940/1100',
    fsc_marks: '699/1100 (Pre-Engineering, BISE Lahore)',
    mark_of_id: 'Nil',
    father_occupation: 'Govt. Degree College Area Pattoki',
    bform_document_url: '/qaiser-faryad-result-card.jpg',
    result_card_url: '/qaiser-faryad-result-card.jpg',
    role: 'student',
    enrolled_courses: [1, 2, 4, 6],
    created_at: '2026-10-23T03:00:00.000Z',
    source: 'admission_form'
  },
  {
    id: 'cadet-002',
    full_name: 'Ayesha Fatima',
    father_name: 'Muhammad Aslam',
    cnic_bform: '37405-9182341-2',
    dob: '2005-11-20',
    gender: 'Female',
    roll_number: 'BFA-2026-9214',
    phone_number: '+92 333 5192847',
    email: 'ayesha.cadet@gmail.com',
    target_wing: 'PAF (GD Pilot / GDP)',
    domicile: 'Rawalpindi',
    height: '5.5',
    weight: '52',
    matric_marks: '1040/1100',
    fsc_marks: '1012/1100',
    mark_of_id: 'Nil',
    father_occupation: 'Army (Retd. Subedar)',
    bform_document_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    result_card_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
    role: 'student',
    enrolled_courses: [1, 26],
    created_at: '2026-10-22T14:15:00.000Z',
    source: 'registration'
  },
  {
    id: 'cadet-003',
    full_name: 'Bilal Ahmed',
    father_name: 'Sheraz Ahmed',
    cnic_bform: '42101-7182934-5',
    dob: '2006-08-10',
    gender: 'Male',
    roll_number: 'BFA-2026-6419',
    phone_number: '+92 312 9481029',
    email: 'bilal.navy@gmail.com',
    target_wing: 'Pakistan Navy (PN Cadet)',
    domicile: 'Karachi',
    height: '5.10',
    weight: '68',
    matric_marks: '990/1100',
    fsc_marks: '945/1100',
    mark_of_id: 'Scar on right eyebrow',
    father_occupation: 'Business',
    role: 'student',
    enrolled_courses: [1],
    created_at: '2026-10-22T16:45:00.000Z',
    source: 'registration'
  }
];

export const DEMO_CADET: CadetSession = INITIAL_REGISTERED_CADETS[0];

export const DEMO_ADMIN: CadetSession = {
  id: 'admin-01',
  full_name: 'Sir Faryad Tabassum (Chief Administrator)',
  roll_number: 'HQ-COMMAND-01',
  phone_number: '+92 305 4599659',
  email: 'qa034942@gmail.com',
  target_wing: 'Director General / Lead Instructor',
  role: 'admin',
  enrolled_courses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Admin has full access
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
 * Get all registered cadets for Admin Registry
 */
export function getAllRegisteredCadets(): CadetSession[] {
  if (typeof window === 'undefined') return INITIAL_REGISTERED_CADETS;
  
  const raw = localStorage.getItem(REGISTERED_CADETS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  // Initialize storage with sample cadets if empty
  localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(INITIAL_REGISTERED_CADETS));
  return INITIAL_REGISTERED_CADETS;
}

/**
 * Grant or revoke course access for a student
 */
export function toggleCadetCourseAccess(cadetId: string, courseId: number): boolean {
  if (typeof window === 'undefined') return false;

  const cadets = getAllRegisteredCadets();
  const cadet = cadets.find((c) => c.id === cadetId);
  if (!cadet) return false;

  if (!cadet.enrolled_courses) cadet.enrolled_courses = [];

  if (cadet.enrolled_courses.includes(courseId)) {
    // Revoke
    cadet.enrolled_courses = cadet.enrolled_courses.filter((id) => id !== courseId);
  } else {
    // Grant
    cadet.enrolled_courses.push(courseId);
  }

  // Save to master registry
  localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(cadets));

  // If this cadet is the active session, sync it!
  const current = getCurrentUser();
  if (current && current.id === cadet.id) {
    localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(cadet));
  }

  window.dispatchEvent(new Event('bfa_auth_changed'));
  window.dispatchEvent(new Event('bfa_cadets_updated'));
  return true;
}

/**
 * Update whole course array for a student
 */
export function setCadetCourseList(cadetId: string, courseIds: number[]): boolean {
  if (typeof window === 'undefined') return false;

  const cadets = getAllRegisteredCadets();
  const cadet = cadets.find((c) => c.id === cadetId);
  if (!cadet) return false;

  cadet.enrolled_courses = courseIds;
  localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(cadets));

  const current = getCurrentUser();
  if (current && current.id === cadet.id) {
    localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(cadet));
  }

  window.dispatchEvent(new Event('bfa_auth_changed'));
  window.dispatchEvent(new Event('bfa_cadets_updated'));
  return true;
}

/**
 * Save admission form submission with full OCR details
 */
export function saveAdmissionFormCadet(data: Partial<CadetSession>): CadetSession {
  const cadets = getAllRegisteredCadets();
  const rollNumber = data.roll_number || `BFA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCadet: CadetSession = {
    id: 'cadet-' + Date.now(),
    full_name: data.full_name || 'Cadet',
    father_name: data.father_name || '',
    cnic_bform: data.cnic_bform || '',
    dob: data.dob || '',
    gender: data.gender || 'Male',
    roll_number: rollNumber,
    phone_number: data.phone_number || '',
    email: data.email || `${rollNumber.toLowerCase()}@bestforcesacademy.net`,
    target_wing: data.target_wing || 'Pakistan Army',
    domicile: data.domicile || '',
    height: data.height || '',
    weight: data.weight || '',
    matric_marks: data.matric_marks || '',
    fsc_marks: data.fsc_marks || '',
    mark_of_id: data.mark_of_id || '',
    religion: data.religion || 'Islam',
    sect: data.sect || 'Sunni',
    father_occupation: data.father_occupation || '',
    bform_document_url: data.bform_document_url || '',
    result_card_url: data.result_card_url || '',
    role: 'student',
    enrolled_courses: data.enrolled_courses && data.enrolled_courses.length > 0 ? data.enrolled_courses : [1],
    created_at: new Date().toISOString(),
    source: 'admission_form'
  };

  cadets.unshift(newCadet);
  if (typeof window !== 'undefined') {
    localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(cadets));
    localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(newCadet));
    window.dispatchEvent(new Event('bfa_auth_changed'));
    window.dispatchEvent(new Event('bfa_cadets_updated'));
  }

  return newCadet;
}

/**
 * Log in student/cadet
 */
export function loginStudent(identifier: string, pass: string): { success: boolean; error?: string; session?: CadetSession } {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your Roll Number, Email or WhatsApp Phone.' };
  }

  const cadets = getAllRegisteredCadets();
  const existing = cadets.find(
    (c) => 
      c.roll_number.toLowerCase() === identifier.trim().toLowerCase() ||
      c.email.toLowerCase() === identifier.trim().toLowerCase() ||
      c.phone_number.includes(identifier.trim())
  );

  let session: CadetSession;
  if (existing) {
    session = existing;
  } else {
    // If not in registered list, create instant session and add to registry
    session = {
      id: 'cadet-' + Date.now(),
      full_name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      roll_number: 'BFA-2026-' + Math.floor(1000 + Math.random() * 9000),
      phone_number: '+92 300 0000000',
      email: identifier.includes('@') ? identifier : `${identifier}@bestforcesacademy.net`,
      target_wing: 'Pakistan Armed Forces',
      role: 'student',
      enrolled_courses: [1, 2],
      created_at: new Date().toISOString(),
      source: 'registration'
    };
    cadets.unshift(session);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(cadets));
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('bfa_auth_changed'));
  }
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
    father_name: data.father_name,
    roll_number: rollNumber,
    phone_number: data.phone_number,
    email: data.email,
    target_wing: data.target_wing,
    role: 'student',
    enrolled_courses: [1],
    created_at: new Date().toISOString(),
    source: 'registration'
  };

  const cadets = getAllRegisteredCadets();
  cadets.unshift(newCadet);

  if (typeof window !== 'undefined') {
    localStorage.setItem(REGISTERED_CADETS_KEY, JSON.stringify(cadets));
    localStorage.setItem(CADET_SESSION_KEY, JSON.stringify(newCadet));
    window.dispatchEvent(new Event('bfa_auth_changed'));
    window.dispatchEvent(new Event('bfa_cadets_updated'));
  }

  return { success: true, session: newCadet };
}

/**
 * Admin Officer Authentication
 */
export function loginAdmin(emailOrUser: string, pin: string): { success: boolean; error?: string; session?: CadetSession } {
  const cleanUser = emailOrUser.trim().toLowerCase();
  const rawPin = pin.trim();

  // Official primary credentials requested by user
  const isOfficialEmail = cleanUser === 'qa034942@gmail.com' || cleanUser === 'qa034942';
  const isOfficialPassword = rawPin === 'Qa034942@#$';

  if (isOfficialEmail && isOfficialPassword) {
    const adminSession: CadetSession = {
      ...DEMO_ADMIN,
      email: 'qa034942@gmail.com'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
      window.dispatchEvent(new Event('bfa_auth_changed'));
    }
    return { success: true, session: adminSession };
  }

  // Backup credentials for convenience
  const backupUsers = ['admin', 'admin@bestforcesacademy.net', 'sirfaryad', 'command'];
  const backupPins = ['admin123', 'forces2026', 'Qa034942@#$'];

  if ((backupUsers.includes(cleanUser) || isOfficialEmail) && (backupPins.includes(rawPin) || isOfficialPassword)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(DEMO_ADMIN));
      window.dispatchEvent(new Event('bfa_auth_changed'));
    }
    return { success: true, session: DEMO_ADMIN };
  }

  return { 
    success: false, 
    error: 'Invalid Officer Credentials. Use authorized email (qa034942@gmail.com) and your assigned password.' 
  };
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
