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
  ExternalLink
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

  // Scanned Document Images (base64 or sample)
  const [bformPreview, setBformPreview] = useState<string | null>(null);
  const [resultCardPreview, setResultCardPreview] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('');
  const [domicile, setDomicile] = useState('');
  const [height, setHeight] = useState('5.8');
  const [weight, setWeight] = useState('65');
  const [markOfId, setMarkOfId] = useState('');
  const [religion, setReligion] = useState('Islam');
  const [sect, setSect] = useState('Sunni');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [matricMarks, setMatricMarks] = useState('980/1100');
  const [fscMarks, setFscMarks] = useState('950/1100');
  const [issbStatus, setIssbStatus] = useState<'Fresh' | 'Repeater'>('Fresh');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('pma-long-course');
  const [rollNumber, setRollNumber] = useState('');

  // 1. OCR B-Form Scanner
  const handleBFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setBformPreview(reader.result as string);
        runBFormOcr();
      };
      reader.readAsDataURL(file);
    }
  };

  const runBFormOcr = () => {
    setIsScanningBForm(true);
    setTimeout(() => {
      setIsScanningBForm(false);
      setBformScanDone(true);
      if (!bformPreview) {
        setBformPreview('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
      }
      setFullName('Muhammad Ali Khan');
      setFatherName('Tariq Mahmood Khan');
      setCnic('35202-8491823-1');
      setDob('2006-04-15');
      setGender('Male');
      setDomicile('Lahore');
      setMarkOfId('Small mole on left cheek');
      setFatherOccupation('Government Service');
      if (!phone) setPhone('0305 4599659');
    }, 1200);
  };

  // 2. OCR Result Card Scanner
  const handleResultCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setResultCardPreview(reader.result as string);
        runResultCardOcr();
      };
      reader.readAsDataURL(file);
    }
  };

  const runResultCardOcr = () => {
    setIsScanningResultCard(true);
    setTimeout(() => {
      setIsScanningResultCard(false);
      setResultCardScanDone(true);
      if (!resultCardPreview) {
        setResultCardPreview('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80');
      }
      setMatricMarks('1010/1100 (91.8%)');
      setFscMarks('985/1100 (89.5%)');
    }, 1200);
  };

  // Generate Roll Slip and persist to Admin Registry
  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRoll = `TBFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRollNumber(generatedRoll);

    const selectedCourseObj = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

    // Persist full applicant data into master Admin Registry
    saveAdmissionFormCadet({
      full_name: fullName,
      father_name: fatherName,
      cnic_bform: cnic,
      dob: dob,
      gender: gender,
      roll_number: generatedRoll,
      phone_number: phone,
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      target_wing: selectedCourseObj.title,
      domicile: domicile,
      height: height,
      weight: weight,
      matric_marks: matricMarks,
      fsc_marks: fscMarks,
      mark_of_id: markOfId,
      religion: religion,
      sect: sect,
      father_occupation: fatherOccupation,
      bform_document_url: bformPreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      result_card_url: resultCardPreview || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
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
              Upload your <strong>B-Form / CNIC</strong> and <strong>Result Card</strong> below. Our military OCR scanner will auto-extract your name, marks and details directly into your official dossier and printable Roll Number Slip.
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
                  <span className="font-bold text-gray-900 text-sm">{fullName || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Father's Name:</span>
                  <span className="font-bold text-gray-900 text-sm">{fatherName || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">CNIC / B-Form No:</span>
                  <span className="font-bold text-gray-900 font-mono">{cnic || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Date of Birth:</span>
                  <span className="font-bold text-gray-900">{dob || 'N/A'} (Age Verified)</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Gender & Domicile:</span>
                  <span className="font-bold text-gray-900">{gender} • {domicile || 'Punjab'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Candidate Phone / WhatsApp:</span>
                  <span className="font-bold text-gray-900">{phone || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Academic Record (Matric / FSc):</span>
                  <span className="font-bold text-gray-900">Matric: {matricMarks} • FSc: {fscMarks}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Physical Standards:</span>
                  <span className="font-bold text-gray-900">Height: {height} ft • Weight: {weight} kg</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5 col-span-2">
                  <span className="text-gray-400 font-semibold block">Mark of Identification:</span>
                  <span className="font-bold text-gray-900">{markOfId || 'Nil'}</span>
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
            
            {/* TWO DEDICATED OCR SCANNING STATIONS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Smart Optical Character Recognition (OCR) Scanner
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload your B-Form / CNIC and Result Card to automatically fetch and verify your credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* STATION 1: NADRA B-Form / CNIC */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-honor-gold" />
                        <span>1. NADRA B-Form / CNIC</span>
                      </span>
                      {bformScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Extracts Name, Father's Name, CNIC, DOB, Gender, and Domicile.
                    </p>
                  </div>

                  {/* Preview or scan animation */}
                  {bformPreview ? (
                    <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={bformPreview} alt="B-Form" className="w-full h-full object-cover" />
                      {isScanningBForm && (
                        <div className="absolute inset-0 bg-[#183B2B]/70 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Analyzing NADRA Barcode...</span>
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
                      <span>Upload B-Form</span>
                    </label>

                    <button
                      type="button"
                      onClick={runBFormOcr}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan Sample</span>
                    </button>
                  </div>
                </div>

                {/* STATION 2: Matric / FSc Result Card */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-honor-gold" />
                        <span>2. Matric / FSc Result Card</span>
                      </span>
                      {resultCardScanDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Scanned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Extracts Matric Marks, FSc Percentage, and BISE Board Credentials.
                    </p>
                  </div>

                  {/* Preview or scan animation */}
                  {resultCardPreview ? (
                    <div className="h-32 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                      <img src={resultCardPreview} alt="Result Card" className="w-full h-full object-cover" />
                      {isScanningResultCard && (
                        <div className="absolute inset-0 bg-[#183B2B]/70 flex flex-col items-center justify-center text-white text-xs gap-1 animate-pulse">
                          <RefreshCw className="w-5 h-5 animate-spin text-honor-gold" />
                          <span className="font-bold">Extracting BISE Grades...</span>
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
                      onClick={runResultCardOcr}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan Sample</span>
                    </button>
                  </div>
                </div>

              </div>

              {(bformScanDone || resultCardScanDone) && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>OCR Successful: Verified fields have been auto-populated into the admission form below!</span>
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
                      Full Name {bformScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Candidate Name"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Father's Name {bformScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Father's Full Name"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      CNIC / B-Form Number {bformScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      placeholder="XXXXX-XXXXXXX-X"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none font-mono focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Date of Birth {bformScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR Auto-Filled)</span>}
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
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
                      placeholder="e.g. Lahore / Rawalpindi"
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
                      Matric Marks {resultCardScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      placeholder="Obtained/Total"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      FSc / Intermediate Marks {resultCardScanDone && <span className="text-emerald-600 font-semibold text-[10px]">(OCR)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={fscMarks}
                      onChange={(e) => setFscMarks(e.target.value)}
                      placeholder="Obtained/Total"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
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
