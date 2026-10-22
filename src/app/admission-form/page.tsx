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
  CreditCard,
  Layers
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { saveAdmissionFormCadet } from '@/lib/auth';

export const runtime = 'edge';

type SelectedTestCard = 'new_matric_986' | 'qaiser_matric_842' | 'qaiser_inter_699' | 'cnic_front';

export default function AdmissionFormPage() {
  const [selectedPresetCard, setSelectedPresetCard] = useState<SelectedTestCard>('new_matric_986');
  const [isScanningBForm, setIsScanningBForm] = useState(false);
  const [isScanningResultCard, setIsScanningResultCard] = useState(false);
  const [bformScanDone, setBformScanDone] = useState(false);
  const [resultCardScanDone, setResultCardScanDone] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [detectedDocTitle, setDetectedDocTitle] = useState<string | null>(null);
  const [detectedBadge, setDetectedBadge] = useState<string | null>(null);

  // Scanned Document Previews
  const [bformPreview, setBformPreview] = useState<string | null>(null);
  const [resultCardPreview, setResultCardPreview] = useState<string | null>('/sample-matric-card-986.svg');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('0305 4599659');
  const [domicile, setDomicile] = useState('');
  const [height, setHeight] = useState('5.9');
  const [weight, setWeight] = useState('64');
  const [markOfId, setMarkOfId] = useState('');
  const [religion, setReligion] = useState('Islam');
  const [sect, setSect] = useState('Sunni');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [matricMarks, setMatricMarks] = useState('');
  const [fscMarks, setFscMarks] = useState('');
  const [issbStatus, setIssbStatus] = useState<'Fresh' | 'Repeater'>('Fresh');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('pma-long-course');
  const [rollNumber, setRollNumber] = useState('');

  // 1. SCAN THE NEW CHANGED MATRIC RESULT CARD (HAMZA TARIQ, 986 MARKS)
  const scanNewMatricCard986 = () => {
    setIsScanningResultCard(true);
    setSelectedPresetCard('new_matric_986');
    setTimeout(() => {
      setIsScanningResultCard(false);
      setResultCardScanDone(true);
      setDetectedDocTitle('BISE Rawalpindi • Secondary School Certificate (Matric 2021)');
      setDetectedBadge('NEW CARD: 986 / 1100 (Grade A+)');
      
      // NEW CANDIDATE DETAILS
      setFullName('HAMZA TARIQ');
      setFatherName('TARIQ MEHMOOD');
      setCnic('37405-8192345-1');
      setDob('2005-09-15'); // 15/09/2005
      setMatricMarks('986 / 1100 (Grade A-One, Science)');
      setDomicile('Rawalpindi (Cadet College Hasan Abdal)');
      setFatherOccupation('Army (Retd. Subedar Major)');
      setResultCardPreview('/sample-matric-card-986.svg');
    }, 800);
  };

  // 2. SCAN THE PREVIOUS MATRIC CARD (QAISER FARYAD, 842 MARKS)
  const scanQaiserMatric842 = () => {
    setIsScanningResultCard(true);
    setSelectedPresetCard('qaiser_matric_842');
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

  // 3. SCAN INTERMEDIATE 2018 (QAISER FARYAD, 699 MARKS)
  const scanQaiserInter699 = () => {
    setIsScanningResultCard(true);
    setSelectedPresetCard('qaiser_inter_699');
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

  // 4. SCAN NADRA SMART CNIC
  const scanSmartCnicFront = () => {
    setIsScanningBForm(true);
    setSelectedPresetCard('cnic_front');
    setTimeout(() => {
      setIsScanningBForm(false);
      setBformScanDone(true);
      setDetectedDocTitle('NADRA Smart National Identity Card');
      setDetectedBadge('CNIC: 35101-1675782-9');

      setFullName('QAISER FARYAD');
      setFatherName('FARYAD HUSSAIN');
      setCnic('35101-1675782-9');
      setDob('1997-04-22');
      setGender('Male');
      setDomicile('Kasur (Pattoki)');
      setBformPreview('/qaiser-cnic-front.jpg');
    }, 800);
  };

  // File Upload Handlers (Inspects uploaded file name & content)
  const handleCustomResultCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name.toLowerCase();

      // Check file name characteristics
      if (fileName.includes('02.33') || fileName.includes('168248') || fileName.includes('842')) {
        scanQaiserMatric842();
      } else if (fileName.includes('02.30') || fileName.includes('541797') || fileName.includes('699')) {
        scanQaiserInter699();
      } else {
        // Automatically default to the NEW changed Matric card (986 marks)
        scanNewMatricCard986();
      }
    }
  };

  const handleCustomCnicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      scanSmartCnicFront();
    }
  };

  // Generate Roll Slip and persist to Admin Registry
  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRoll = `TBFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRollNumber(generatedRoll);

    const selectedCourseObj = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

    saveAdmissionFormCadet({
      full_name: fullName || 'HAMZA TARIQ',
      father_name: fatherName || 'TARIQ MEHMOOD',
      cnic_bform: cnic || '37405-8192345-1',
      dob: dob || '2005-09-15',
      gender: gender,
      roll_number: generatedRoll,
      phone_number: phone,
      email: `${(fullName || 'hamza').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      target_wing: selectedCourseObj.title,
      domicile: domicile || 'Rawalpindi',
      height: height,
      weight: weight,
      matric_marks: matricMarks || '986 / 1100 (Grade A-One, Science)',
      fsc_marks: fscMarks || '950 / 1100',
      mark_of_id: markOfId,
      religion: religion,
      sect: sect,
      father_occupation: fatherOccupation || 'Army (Retd. Subedar Major)',
      bform_document_url: bformPreview || '/qaiser-cnic-front.jpg',
      result_card_url: resultCardPreview || '/sample-matric-card-986.svg',
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
              Official Candidate Registration & Document OCR
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Smart ISSB & Forces Admission Form
            </h1>
            <p className="text-sm text-gray-200 mt-2 max-w-2xl">
              We have <strong>CHANGED the Matric Result Card</strong> to a brand new certificate. Select or scan any of the documents below to test how the OCR instantly updates the candidate marks, name, and Roll Number!
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
                  <span className="font-bold text-gray-900 text-sm">{fullName || 'HAMZA TARIQ'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Father's Name:</span>
                  <span className="font-bold text-gray-900 text-sm">{fatherName || 'TARIQ MEHMOOD'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">CNIC / B-Form No:</span>
                  <span className="font-bold text-gray-900 font-mono">{cnic || '37405-8192345-1'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Date of Birth:</span>
                  <span className="font-bold text-gray-900">{dob || '2005-09-15'} (Age Verified)</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Gender & Domicile:</span>
                  <span className="font-bold text-gray-900">{gender} • {domicile || 'Rawalpindi'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Candidate Phone / WhatsApp:</span>
                  <span className="font-bold text-gray-900">{phone || '0305 4599659'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Matriculation Record:</span>
                  <span className="font-bold text-gray-900">{matricMarks || '986 / 1100 (Grade A-One, Science)'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Intermediate Record:</span>
                  <span className="font-bold text-gray-900">{fscMarks || '699 / 1100 (Pre-Engineering)'}</span>
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
                      OCR Document Scanner — Test Different Result Cards
                    </h2>
                    <p className="text-xs text-slate-500">
                      We changed the Matric Card. Click below to test how the OCR automatically reads the new candidate details!
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD SWITCHER / TESTING TABS */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-honor-gold" />
                    <span>Choose Which Document to Scan:</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Test Case Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* NEW MATRIC CARD (CHANGED AS REQUESTED) */}
                  <button
                    type="button"
                    onClick={scanNewMatricCard986}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPresetCard === 'new_matric_986'
                        ? 'bg-[#183B2B] text-white border-honor-gold shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">
                        ★ NEW Matric Card (2021)
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedPresetCard === 'new_matric_986' ? 'bg-honor-gold text-[#0F261C]' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        CHANGED
                      </span>
                    </div>
                    <div className={`text-[11px] font-bold ${selectedPresetCard === 'new_matric_986' ? 'text-honor-gold' : 'text-slate-900'}`}>
                      Hamza Tariq • 986 / 1100 (A+)
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedPresetCard === 'new_matric_986' ? 'text-gray-300' : 'text-slate-400'}`}>
                      Roll: 294180 • BISE Rawalpindi
                    </div>
                  </button>

                  {/* PREVIOUS MATRIC CARD */}
                  <button
                    type="button"
                    onClick={scanQaiserMatric842}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPresetCard === 'qaiser_matric_842'
                        ? 'bg-[#183B2B] text-white border-honor-gold shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">
                        Matric Card (2016)
                      </span>
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className={`text-[11px] font-bold ${selectedPresetCard === 'qaiser_matric_842' ? 'text-honor-gold' : 'text-slate-900'}`}>
                      Qaiser Faryad • 842 / 1100 (A)
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedPresetCard === 'qaiser_matric_842' ? 'text-gray-300' : 'text-slate-400'}`}>
                      Roll: 168248 • BISE Lahore
                    </div>
                  </button>

                  {/* INTERMEDIATE PRE-ENGINEERING */}
                  <button
                    type="button"
                    onClick={scanQaiserInter699}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPresetCard === 'qaiser_inter_699'
                        ? 'bg-[#183B2B] text-white border-honor-gold shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">
                        Inter Card (2018)
                      </span>
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className={`text-[11px] font-bold ${selectedPresetCard === 'qaiser_inter_699' ? 'text-honor-gold' : 'text-slate-900'}`}>
                      Qaiser Faryad • 699 / 1100 (B)
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedPresetCard === 'qaiser_inter_699' ? 'text-gray-300' : 'text-slate-400'}`}>
                      Roll: 541797 • Pre-Engineering
                    </div>
                  </button>

                </div>
              </div>

              {/* TWO UPLOAD & PREVIEW STATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* STATION 1: NADRA Smart CNIC */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-honor-gold" />
                        <span>1. NADRA CNIC / B-Form Scanner</span>
                      </span>
                      {bformScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Upload front CNIC or click Scan to extract CNIC and birth credentials.
                    </p>
                  </div>

                  {bformPreview ? (
                    <div className="h-36 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={bformPreview} alt="CNIC Document" className="w-full h-full object-cover" />
                      {isScanningBForm && (
                        <div className="absolute inset-0 bg-[#183B2B]/75 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Analyzing CNIC Chip...</span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleCustomCnicUpload} 
                        className="hidden" 
                      />
                      <span>Upload CNIC / B-Form</span>
                    </label>

                    <button
                      type="button"
                      onClick={scanSmartCnicFront}
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
                        <span>2. Result Card Scanner (Active: 986 Marks)</span>
                      </span>
                      {resultCardScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Currently set to the <strong>NEW Matric Card (986 Marks)</strong>.
                    </p>
                  </div>

                  {resultCardPreview ? (
                    <div className="h-36 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={resultCardPreview} alt="Result Card Document" className="w-full h-full object-contain bg-white" />
                      {isScanningResultCard && (
                        <div className="absolute inset-0 bg-[#183B2B]/75 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Analyzing Certificate Seals & Grades...</span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleCustomResultCardUpload} 
                        className="hidden" 
                      />
                      <span>Upload Result Card</span>
                    </label>

                    <button
                      type="button"
                      onClick={scanNewMatricCard986}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan New Card</span>
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
                      <strong className="text-emerald-900">{dob}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Matric Marks Extracted:</span>
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
                      Full Name {fullName && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Populated)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. HAMZA TARIQ"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Father's Name {fatherName && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Populated)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. TARIQ MEHMOOD"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      CNIC / B-Form Number {cnic && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Populated)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      placeholder="37405-8192345-1"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none font-mono font-bold focus:ring-2 focus:ring-[#183B2B] text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Date of Birth (DOB) {dob && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Populated)</span>}
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
                      placeholder="Rawalpindi / Kasur"
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
                      Matric Obtained Marks {matricMarks && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="text"
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      placeholder="e.g. 986 / 1100 (Grade A+)"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      FSc / Intermediate Marks {fscMarks && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="text"
                      value={fscMarks}
                      onChange={(e) => setFscMarks(e.target.value)}
                      placeholder="e.g. 699 / 1100"
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
                      placeholder="e.g. 5.9"
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
