"use client";

import { Course } from '@/types';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { PAYMENT_ACCOUNTS } from '@/lib/constants';

export interface PaymentAccountsConfig {
  jazzcash: { title: string; accountNumber: string; accountTitle: string };
  easypaisa: { title: string; accountNumber: string; accountTitle: string };
  bank: { title: string; accountNumber: string; iban: string; accountTitle: string };
}

export interface PaymentTransaction {
  id: string;
  candidateName: string;
  candidatePhone: string;
  courseId: number;
  courseTitle: string;
  amount: number;
  method: 'jazzcash' | 'easypaisa' | 'bank_transfer';
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

const COURSE_OVERRIDES_KEY = 'bfa_course_overrides';
const CUSTOM_COURSES_KEY = 'bfa_custom_courses';
const PAYMENT_ACCOUNTS_KEY = 'bfa_payment_accounts';
const PAYMENT_TRANSACTIONS_KEY = 'bfa_payment_transactions';

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    candidateName: 'QAISER FARYAD',
    candidatePhone: '+92 305 4599659',
    courseId: 6,
    courseTitle: 'Pakistan Army - PMA Long Course (Commission)',
    amount: 3800,
    method: 'jazzcash',
    trxId: 'JC-8492017482',
    status: 'approved',
    submittedAt: '2026-11-26T09:30:00.000Z',
    notes: 'Verified by Mentor',
  },
  {
    id: 'tx-1002',
    candidateName: 'Ayesha Fatima',
    candidatePhone: '+92 333 5192847',
    courseId: 26,
    courseTitle: 'PAF - GDP (General Duty Pilot)',
    amount: 3800,
    method: 'easypaisa',
    trxId: 'EP-5529104811',
    status: 'approved',
    submittedAt: '2026-11-26T14:15:00.000Z',
  },
  {
    id: 'tx-1003',
    candidateName: 'Hamza Tariq',
    candidatePhone: '+92 314 7821904',
    courseId: 17,
    courseTitle: 'Pakistan Navy - PN Cadet Commission',
    amount: 3800,
    method: 'bank_transfer',
    trxId: 'MEZN-993018472',
    status: 'pending',
    submittedAt: '2026-11-27T08:40:00.000Z',
  },
];

export function getManagedCourses(): Course[] {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const overridesRaw = localStorage.getItem(COURSE_OVERRIDES_KEY);
    const customRaw = localStorage.getItem(CUSTOM_COURSES_KEY);
    const overrides: Record<number, Partial<Course>> = overridesRaw ? JSON.parse(overridesRaw) : {};
    const customCourses: Course[] = customRaw ? JSON.parse(customRaw) : [];

    const base = INITIAL_COURSES.map((c) => (overrides[c.id] ? { ...c, ...overrides[c.id] } : c));
    return [...customCourses, ...base];
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveCourseUpdate(courseId: number, patch: Partial<Course>): Course[] {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const customRaw = localStorage.getItem(CUSTOM_COURSES_KEY);
    const customCourses: Course[] = customRaw ? JSON.parse(customRaw) : [];
    const customIdx = customCourses.findIndex((c) => c.id === courseId);

    if (customIdx !== -1) {
      customCourses[customIdx] = { ...customCourses[customIdx], ...patch };
      localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(customCourses));
    } else {
      const overridesRaw = localStorage.getItem(COURSE_OVERRIDES_KEY);
      const overrides: Record<number, Partial<Course>> = overridesRaw ? JSON.parse(overridesRaw) : {};
      overrides[courseId] = { ...(overrides[courseId] || {}), ...patch };
      localStorage.setItem(COURSE_OVERRIDES_KEY, JSON.stringify(overrides));
    }
    window.dispatchEvent(new Event('bfa_courses_updated'));
  } catch {
    // ignore
  }
  return getManagedCourses();
}

export function addCustomCourse(course: Course): Course[] {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const customRaw = localStorage.getItem(CUSTOM_COURSES_KEY);
    const customCourses: Course[] = customRaw ? JSON.parse(customRaw) : [];
    const next = [course, ...customCourses];
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('bfa_courses_updated'));
  } catch {
    // ignore
  }
  return getManagedCourses();
}

export function getPaymentAccounts(): PaymentAccountsConfig {
  if (typeof window === 'undefined') return PAYMENT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(PAYMENT_ACCOUNTS_KEY);
    if (!raw) return PAYMENT_ACCOUNTS;
    return { ...PAYMENT_ACCOUNTS, ...JSON.parse(raw) };
  } catch {
    return PAYMENT_ACCOUNTS;
  }
}

export function savePaymentAccounts(config: PaymentAccountsConfig): PaymentAccountsConfig {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PAYMENT_ACCOUNTS_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('bfa_payments_updated'));
  }
  return config;
}

export function getPaymentTransactions(): PaymentTransaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(PAYMENT_TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENT_TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function addPaymentTransaction(tx: Omit<PaymentTransaction, 'id' | 'submittedAt'>): PaymentTransaction[] {
  const existing = getPaymentTransactions();
  const nextTx: PaymentTransaction = {
    ...tx,
    id: `tx-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  const updated = [nextTx, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PAYMENT_TRANSACTIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bfa_payments_updated'));
  }
  return updated;
}

export function updateTransactionStatus(
  txId: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): PaymentTransaction[] {
  const existing = getPaymentTransactions();
  const updated = existing.map((t) =>
    t.id === txId ? { ...t, status, ...(notes !== undefined ? { notes } : {}) } : t
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(PAYMENT_TRANSACTIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bfa_payments_updated'));
  }
  return updated;
}
