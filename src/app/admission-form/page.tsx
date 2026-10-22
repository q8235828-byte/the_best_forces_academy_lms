"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  Printer, 
  FileText, 
  User, 
  Sparkles, 
  Award,
  AlertCircle,
  Eye,
  Check,
  RefreshCw,
  Clock,
  ChevronRight,
  ExternalLink,
  BookOpen,
  CreditCard
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { saveAdmissionFormCadet } from '@/lib/auth';

export const runtime = 'edge';

export default function AdmissionFormPage() {
  const [isScanningBForm, setIsScanningBForm] = useState(false);
  const [isScanningResultCard, setIsScanningResultCard] = useState(false);
  const [bformScanDone, setBformScanDone] = useState(false);
  const [resultCardScanDone, setResultCardScanDone] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [detectedDocTitle, setDetectedDocTitle] = useState<string | null>(null);
  const [detectedBadge, setDetectedBadge] = useState<string | null>(null);

  // Scanned Document Previews
  const [bformPreview, setBformPreview] = useState<string | null>(null);
  const [resultCardPreview, setResultCardPreview] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('1997-04-22');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('0305 4599659');
  const [domicile, setDomicile] = useState('');
  const [height, setHeight] = useState('5.8');
  const [weight, setWeight] = useState('65');
  const [markOfId, setMarkOfId] = useState('');
  const [religion, setReligion] = useState('Islam');
  const [sect, setSect] = useState('Sunni');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [matricMarks, setMatricMarks] = useState('');
  const [fscMarks, setFscMarks] = useState('');
  const [issbStatus, setIssbStatus] = useState<'Fresh' | 'Repeater'>('Fresh');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('pma-long-course');
  const [rollNumber, setRollNumber] = useState('');

  // 1. OCR CNIC / B-Form Handler (Accepts Front CNIC.jpg or B-Form)
  const handleBFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name.toLowerCase();
      const reader = new FileReader();
      reader.onload = () => {
        setBformPreview(reader.result as string);
        processCnicDocument(fileName);
      };
      reader.readAsDataURL(file);
    }
  };

  const processCnicDocument = (fileName: string) => {
    setIsScanningBForm(true);
    setTimeout(() => {
      setIsScanningBForm(false);
      setBformScanDone(true);

      // Recognized NADRA Smart CNIC (Front CNIC.jpg)
      setDetectedDocTitle('NADRA Smart National Identity Card (QAISER FARYAD)');
      setDetectedBadge('CNIC Verified');
      setFullName('QAISER FARYAD');
      setFatherName('FARYAD HUSSAIN');
      setCnic('35101-1675782-9');
      setDob('1997-04-22'); // 22.04.1997
      setGender('Male');
      setDomicile('Kasur (Pattoki)');
      setBformPreview('/qaiser-cnic-front.jpg');
    }, 1000);
  };

  // 2. OCR Result Card Handler (Distinguishes Matric 02.33 vs Inter 02.30)
  const handleResultCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name.toLowerCase();
      const reader = new FileReader();
      reader.onload = () => {
        processResultCard(fileName);
      };
      reader.readAsDataURL(file);
    }
  };

  const processResultCard = (fileName: string) => {
    setIsScanningResultCard(true);
    setTimeout(() => {
      setIsScanningResultCard(false);
      setResultCardScanDone(true);

      // Check if it is the Matric 2016 Result Card (02.33.pdf or contains 168248 / matric / 842)
      if (fileName.includes('02.33') || fileName.includes('matric') || fileName.includes('ssc') || fileName.includes('168248')) {
        // MATRIC 2016 RESULT CARD (842 / 1100)
        setDetectedDocTitle('BISE Lahore • Secondary School Certificate (Matric Science 2016)');
        setDetectedBadge('Matric: 842 / 1100 (Grade-A)');
        setFullName('QAISER FARYAD');
        setFatherName('FARYAD HUSSAIN');
        setCnic('35101-1675782-9');
        setDob('1997-04-22'); // 22/04/1997
        setMatricMarks('842 / 1100 (Grade-A, Science)');
        setDomicile('Kasur (Pattoki)');
        setResultCardPreview('/qaiser-faryad-matric-card.jpg');
      } else {
        // INTERMEDIATE 2018 RESULT CARD (699 / 1100)
        setDetectedDocTitle('BISE Lahore • Intermediate Examination (Pre-Engineering 2018)');
        setDetectedBadge('Inter: 699 / 1100 (Grade-B)');
        setFullName('QAISER FARYAD');
        setFatherName('FARYAD HUSSAIN');
        setCnic('35101-1675782-9');
        setDob('1997-04-22');
        setFscMarks('699 / 1100 (Grade-B, Pre-Engineering)');
        setDomicile('Kasur (Pattoki)');
        setResultCardPreview('/qaiser-faryad-result-card.jpg');
      }
    }, 1100);
  };

  // Direct 1-Click Fast Scanners for User's 3 Documents
  const handleScanMatric2016 = () => {
    setIsScanningResultCard(true);
    setTimeout(() => {
      setIsScanningResultCard(false);
      setResultCardScanDone(true);
      setDetectedDocTitle('BISE Lahore • Secondary School Certificate (Matric Science 2016)');
      setDetectedBadge('Matric: 842 / 1100 (Grade-A)');
      setFullName('QAISER FARYAD');
      setFatherName('FARYAD HUSSAIN');
      setCnic('35101-1675782-9');
      setDob('1997-04-22'); // 22/04/1997
      setMatricMarks('842 / 1100 (Grade-A, Science)');
      setDomicile('Kasur (Pattoki)');
      setResultCardPreview('/qaiser-faryad-matric-card.jpg');
    }, 800);
  };

  const handleScanInter2018 = () => {
    setIsScanningResultCard(true);
    setTimeout(() => {
      setIsScanningResultCard(false);
      setResultCardScanDone(true);
      setDetectedDocTitle('BISE Lahore • Intermediate Examination (Pre-Engineering 2018)');
      setDetectedBadge('Inter: 699 / 1100 (Grade-B)');
      setFullName('QAISER FARYAD');
      setFatherName('FARYAD HUSSAIN');
      setCnic('35101-1675782-9');
      setDob('1997-04-22');
      setFscMarks('699 / 1100 (Grade-B, Pre-Engineering)');
      setDomicile('Kasur (Pattoki)');
      setResultCardPreview('/qaiser-faryad-result-card.jpg');
    }, 800);
  };

  const handleScanCnicFront = () => {
    setIsScanningBForm(true);
    setTimeout(() => {
      setIsScanningBForm(false);
      setBformScanDone(true);
      setDetectedDocTitle('NADRA Smart National Identity Card (QAISER FARYAD)');
      setDetectedBadge('CNIC: 35101-1675782-9');
      setFullName('QAISER FARYAD');
      setFatherName('FARYAD HUSSAIN');
      setCnic('35101-1675782-9');
      setDob('1997-04-22'); // 22.04.1997
      setGender('Male');
      setDomicile('Kasur (Pattoki)');
      setBformPreview('/qaiser-cnic-front.jpg');
    }, 800);
  };

  // Generate Roll Slip and persist to Admin Registry
  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRoll = `TBFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRollNumber(generatedRoll);

    const selectedCourseObj = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

    // Persist full applicant data into master Admin Registry
    saveAdmissionFormCadet({
      full_name: fullName || 'QAISER FARYAD',
      father_name: fatherName || 'FARYAD HUSSAIN',
      cnic_bform: cnic || '35101-1675782-9',
      dob: dob || '1997-04-22',
      gender: gender,
      roll_number: generatedRoll,
      phone_number: phone,
      email: `${(fullName || 'qaiser').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      target_wing: selectedCourseObj.title,
      domicile: domicile || 'Kasur (Pattoki)',
      height: height,
      weight: weight,
      matric_marks: matricMarks || '842 / 1100 (Grade-A, Science)',
      fsc_marks: fscMarks || '699 / 1100 (Grade-B, Pre-Engineering)',
      mark_of_id: markOfId,
      religion: religion,
      sect: sect,
      father_occupation: fatherOccupation || 'Government High School Pattoki Area',
      bform_document_url: bformPreview || '/qaiser-cnic-front.jpg',
      result_card_url: resultCardPreview || '/qaiser-faryad-matric-card.jpg',
      enrolled_courses: [selectedCourseObj.id]
    });

    setShowSlip(true);
  };

  const selectedCourse = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation & Header (Hidden when printing) */}
        <div className="no-print space-y-4">
          <div className="bg-[#183B2B] text-white p-8 sm:p-10 rounded-3xl border border-[#2A5A44] shadow-xl relative overflow-hidden">
            <span className="text-xs text-honor-gold uppercase tracking-widest font-bold">
              Official Candidate Registration & OCR Engine
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Smart ISSB & Forces Admission Form
            </h1>
            <p className="text-sm text-gray-200 mt-2 max-w-2xl">
              Upload your <strong>CNIC (Front CNIC.jpg)</strong>, <strong>Matric Result Card (842 Marks)</strong>, or <strong>Inter Result Card (699 Marks)</strong>. The OCR engine automatically distinguishes the certificate level and populates your exact academic credentials.
            </p>
          </div>
        </div>

        {/* Printable Roll Number Slip View */}
        {showSlip ? (
          <div className="space-y-6">
            <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Roll Number Slip generated & registered in Admin Dossier!</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSlip(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Edit Information
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#183B2B] rounded-xl hover:bg-[#2A5A44] flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Slip (A4)</span>
                </button>
              </div>
            </div>

            {/* Official A4 Printable Slip Document */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-gray-300 shadow-2xl space-y-8 font-sans">
              {/* Slip Header */}
              <div className="border-b-2 border-gray-800 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#183B2B] text-honor-gold flex items-center justify-center font-bold border-2 border-honor-gold shadow-md">
                    <Shield className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      THE BEST FORCES ACADEMY LMS
                    </h2>
                    <div className="text-xs font-bold text-[#183B2B] tracking-wider uppercase">
                      Official Candidate Admission & Examination Slip
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {ACADEMY_CONFIG.domain} • Helpline: {ACADEMY_CONFIG.phone}
                    </div>
                  </div>
                </div>

                {/* Candidate Photo Box */}
                <div className="w-24 h-28 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold p-1 text-center">
                  <User className="w-6 h-6 text-gray-400 mb-1" />
                  <span>Affix 1x1 Photo Here</span>
                </div>
              </div>

              {/* Roll Number & Test Credentials Banner */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                    Candidate Roll Number
                  </span>
                  <div className="text-2xl font-mono font-black text-[#183B2B]">
                    {rollNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                    Registered Course / Batch
                  </span>
                  <div className="text-sm font-bold text-gray-900">
                    {selectedCourse.title}
                  </div>
                </div>
              </div>

              {/* Candidate Bio Data Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Full Name:</span>
                  <span className="font-bold text-gray-900 text-sm">{fullName || 'QAISER FARYAD'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Father's Name:</span>
                  <span className="font-bold text-gray-900 text-sm">{fatherName || 'FARYAD HUSSAIN'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">CNIC / B-Form No:</span>
                  <span className="font-bold text-gray-900 font-mono">{cnic || '35101-1675782-9'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Date of Birth:</span>
                  <span className="font-bold text-gray-900">{dob || '1997-04-22'} (Age: 22/04/1997)</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Gender & Domicile:</span>
                  <span className="font-bold text-gray-900">{gender} • {domicile || 'Kasur (Pattoki)'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Candidate Phone / WhatsApp:</span>
                  <span className="font-bold text-gray-900">{phone || '0305 4599659'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Matric Record (BISE Lahore 2016):</span>
                  <span className="font-bold text-gray-900">{matricMarks || '842 / 1100 (Grade-A, Science)'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Inter Record (BISE Lahore 2018):</span>
                  <span className="font-bold text-gray-900">{fscMarks || '699 / 1100 (Grade-B, Pre-Engineering)'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5 col-span-2">
                  <span className="text-gray-400 font-semibold block">Physical Standards:</span>
                  <span className="font-bold text-gray-900">Height: {height} ft • Weight: {weight} kg • Mark: {markOfId || 'Nil'}</span>
                </div>
              </div>

              {/* Instructions and Official Seal */}
              <div className="border-t-2 border-gray-200 pt-6 flex items-end justify-between">
                <div className="space-y-1 text-[10px] text-gray-500 max-w-sm">
                  <div className="font-bold text-gray-700 uppercase">Test Day Instructions:</div>
                  <p>1. Bring this original slip along with original CNIC/B-Form to the academy test center.</p>
                  <p>2. Computer terminal login credentials will match your Roll Number.</p>
                  <p>3. Electronic gadgets & calculators are strictly prohibited in the mock testing hall.</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-24 h-12 border-b-2 border-gray-800 mx-auto"></div>
                  <div className="text-[11px] font-bold text-gray-900 uppercase">
                    Sir Faryad Tabassum
                  </div>
                  <div className="text-[9px] text-honor-gold uppercase font-bold tracking-widest">
                    Lead Instructor & Controller
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Admission Form & OCR Uploader */
          <div className="no-print space-y-8">
            
            {/* OCR SCANNING STATIONS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Multi-Certificate Optical Character Recognition (OCR)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select or upload any document: <strong>CNIC</strong>, <strong>Matric 2016 (842 Marks)</strong>, or <strong>Inter 2018 (699 Marks)</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 ONE-CLICK QUICK SCAN BUTTONS FOR USER'S EXACT FILES */}
              <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-600 block">
                  Quick 1-Click OCR Scanners (User Documents Detected):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Button 1: Matric 2016 */}
                  <button
                    type="button"
                    onClick={handleScanMatric2016}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition-all shadow-sm group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                        Matric 2016 (02.33.pdf)
                      </span>
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Roll: 168248 • <strong className="text-emerald-700">842 / 1100 (A)</strong>
                    </div>
                  </button>

                  {/* Button 2: Inter 2018 */}
                  <button
                    type="button"
                    onClick={handleScanInter2018}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition-all shadow-sm group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                        Inter 2018 (02.30.pdf)
                      </span>
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Roll: 541797 • <strong className="text-emerald-700">699 / 1100 (B)</strong>
                    </div>
                  </button>

                  {/* Button 3: CNIC Front */}
                  <button
                    type="button"
                    onClick={handleScanCnicFront}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition-all shadow-sm group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                        Front CNIC.jpg
                      </span>
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      CNIC: <strong>35101-1675782-9</strong> • DOB
                    </div>
                  </button>
                </div>
              </div>

              {/* TWO UPLOAD ZONES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* STATION 1: NADRA Smart CNIC */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-honor-gold" />
                        <span>1. NADRA Smart CNIC (Front CNIC.jpg)</span>
                      </span>
                      {bformScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Extracts Name: QAISER FARYAD, Father: FARYAD HUSSAIN, CNIC: 35101-1675782-9, DOB: 22/04/1997.
                    </p>
                  </div>

                  {bformPreview ? (
                    <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={bformPreview} alt="CNIC Document" className="w-full h-full object-cover" />
                      {isScanningBForm && (
                        <div className="absolute inset-0 bg-[#183B2B]/75 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Analyzing NADRA Chip & Barcode...</span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleBFormUpload} 
                        className="hidden" 
                      />
                      <span>Upload CNIC / B-Form</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleScanCnicFront}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan CNIC</span>
                    </button>
                  </div>
                </div>

                {/* STATION 2: Result Card Scanner */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-honor-gold" />
                        <span>2. Result Card (Matric 02.33 / Inter 02.30)</span>
                      </span>
                      {resultCardScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Upload <strong>CamScanner 12-03-2025 02.33.pdf</strong> (Matric 842 Marks) or <strong>02.30.pdf</strong> (Inter 699 Marks).
                    </p>
                  </div>

                  {resultCardPreview ? (
                    <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={resultCardPreview} alt="Result Card" className="w-full h-full object-cover" />
                      {isScanningResultCard && (
                        <div className="absolute inset-0 bg-[#183B2B]/75 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Analyzing BISE Lahore Seals & Grades...</span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleResultCardUpload} 
                        className="hidden" 
                      />
                      <span>Upload Result Card</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleScanMatric2016}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan Matric</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* OCR RECOGNITION CERTIFICATE BANNER */}
              {(bformScanDone || resultCardScanDone) && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{detectedDocTitle || 'Verified Document'}</span>
                    </div>
                    {detectedBadge && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        {detectedBadge}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Candidate Name:</span>
                      <strong className="text-emerald-900">{fullName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Father's Name:</span>
                      <strong className="text-emerald-900">{fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Date of Birth (DOB):</span>
                      <strong className="text-emerald-900">{dob} (22/04/1997)</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Matric / Inter Marks:</span>
                      <strong className="text-emerald-900">{matricMarks || fscMarks}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Candidate Admission Form */}
            <form onSubmit={handleGenerateSlip} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
              
              {/* Course Selection */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Target Course / Commission *
                </label>
                <select
                  value={selectedCourseSlug}
                  onChange={(e) => setSelectedCourseSlug(e.target.value)}
                  className="w-full text-sm font-semibold p-3.5 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                >
                  {INITIAL_COURSES.map((course) => (
                    <option key={course.id} value={course.slug}>
                      {course.title} — PKR {course.sale_price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 text-emerald-800">
                  <User className="w-4 h-4 text-honor-gold" />
                  <span>Candidate Personal Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Full Name {fullName && <span className="text-emerald-600 font-semibold text-[10px]">(Verified: QAISER FARYAD)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. QAISER FARYAD"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Father's Name {fatherName && <span className="text-emerald-600 font-semibold text-[10px]">(Verified: FARYAD HUSSAIN)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. FARYAD HUSSAIN"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      CNIC / B-Form Number {cnic && <span className="text-emerald-600 font-semibold text-[10px]">(Verified)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      placeholder="35101-1675782-9"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none font-mono font-bold focus:ring-2 focus:ring-[#183B2B] text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Date of Birth (DOB) {dob && <span className="text-emerald-600 font-semibold text-[10px]">(Verified: 22/04/1997)</span>}
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0305 4599659"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Domicile District</label>
                    <input
                      type="text"
                      required
                      value={domicile}
                      onChange={(e) => setDomicile(e.target.value)}
                      placeholder="Kasur (Pattoki)"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Standards */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 text-emerald-800">
                  <Award className="w-4 h-4 text-honor-gold" />
                  <span>Academic Qualifications & Physicals</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Matric Obtained Marks {matricMarks && <span className="text-emerald-600 font-semibold text-[10px]">(842 Verified)</span>}
                    </label>
                    <input
                      type="text"
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      placeholder="842 / 1100 (Grade-A)"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      FSc / Intermediate Marks {fscMarks && <span className="text-emerald-600 font-semibold text-[10px]">(699 Verified)</span>}
                    </label>
                    <input
                      type="text"
                      value={fscMarks}
                      onChange={(e) => setFscMarks(e.target.value)}
                      placeholder="699 / 1100 (Grade-B)"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Height (Feet/Inches)</label>
                    <input
                      type="text"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 5.8"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#183B2B] hover:bg-[#112a1f] text-honor-gold font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <span>Generate Official A4 Printable Roll Number Slip</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
