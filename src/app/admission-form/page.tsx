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
  Award,
  AlertCircle,
  Clock,
  ChevronRight,
  CreditCard,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Check
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';
import { INITIAL_COURSES } from '@/lib/courses-data';
import { saveAdmissionFormCadet } from '@/lib/auth';

export const runtime = 'edge';

export default function AdmissionFormPage() {
  const [showSlip, setShowSlip] = useState(false);

  // Document Upload Previews
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bformPreview, setBformPreview] = useState<string | null>(null);
  const [resultCardPreview, setResultCardPreview] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('0305 4599659');
  const [domicile, setDomicile] = useState('');
  const [height, setHeight] = useState('5.9');
  const [weight, setWeight] = useState('65');
  const [markOfId, setMarkOfId] = useState('Mole on right cheek');
  const [religion, setReligion] = useState('Islam');
  const [sect, setSect] = useState('Sunni');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [matricMarks, setMatricMarks] = useState('');
  const [fscMarks, setFscMarks] = useState('');
  const [issbStatus, setIssbStatus] = useState<'Fresh' | 'Repeater'>('Fresh');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('pma-long-course');
  const [rollNumber, setRollNumber] = useState('');

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle CNIC / B-Form Upload
  const handleBFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBformPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Result Card Upload
  const handleResultCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setResultCardPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Roll Slip and persist to Admin Registry
  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRoll = `TBFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRollNumber(generatedRoll);

    const selectedCourseObj = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

    saveAdmissionFormCadet({
      full_name: fullName.trim(),
      father_name: fatherName.trim(),
      cnic_bform: cnic.trim(),
      dob: dob,
      gender: gender,
      roll_number: generatedRoll,
      phone_number: phone.trim(),
      email: `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cadet'}@bestforcesacademy.net`,
      target_wing: selectedCourseObj.title,
      domicile: domicile.trim() || 'Rawalpindi',
      height: height,
      weight: weight,
      matric_marks: matricMarks.trim() || 'Passed',
      fsc_marks: fscMarks.trim() || 'Passed',
      mark_of_id: markOfId,
      religion: religion,
      sect: sect,
      father_occupation: fatherOccupation || 'Government Service',
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
              Official Candidate Registration & Admission
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Candidate Admission Form
            </h1>
            <p className="text-sm text-gray-200 mt-2 max-w-2xl">
              Fill in your academic and personal details, attach your required documents, and generate your official printable A4 Roll Number Slip instantly.
            </p>
          </div>
        </div>

        {/* Printable Roll Number Slip View */}
        {showSlip ? (
          <div className="space-y-6">
            <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Roll Number Slip generated & registered in Academy Registry!</span>
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

                {/* Candidate Photo */}
                <div className="w-24 h-28 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold overflow-hidden text-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Candidate" className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-2">
                      <User className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span>Affix 1x1 Photo</span>
                    </div>
                  )}
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
                  <span className="font-bold text-gray-900 text-sm uppercase">{fullName || 'Candidate Name'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Father's Name:</span>
                  <span className="font-bold text-gray-900 text-sm uppercase">{fatherName || 'Father Name'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">CNIC / B-Form No:</span>
                  <span className="font-bold text-gray-900 font-mono">{cnic || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Date of Birth:</span>
                  <span className="font-bold text-gray-900">{dob || 'N/A'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Gender & Domicile:</span>
                  <span className="font-bold text-gray-900">{gender} • {domicile || 'Punjab'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Candidate Phone / WhatsApp:</span>
                  <span className="font-bold text-gray-900">{phone}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Matriculation Record:</span>
                  <span className="font-bold text-gray-900">{matricMarks || 'Passed'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5">
                  <span className="text-gray-400 font-semibold block">Intermediate Record:</span>
                  <span className="font-bold text-gray-900">{fscMarks || 'Passed'}</span>
                </div>
                <div className="border-b border-gray-200 pb-1.5 col-span-2">
                  <span className="text-gray-400 font-semibold block">Physical Standards:</span>
                  <span className="font-bold text-gray-900">Height: {height} ft • Weight: {weight} kg • Mark of ID: {markOfId || 'None'}</span>
                </div>
              </div>

              {/* Instructions and Official Seal */}
              <div className="border-t-2 border-gray-200 pt-6 flex items-end justify-between">
                <div className="space-y-1 text-[10px] text-gray-500 max-w-sm">
                  <div className="font-bold text-gray-700 uppercase">Test Day Instructions:</div>
                  <p>1. Bring this original slip along with original CNIC/B-Form to the academy test center.</p>
                  <p>2. Computer terminal login credentials will match your Roll Number ({rollNumber}).</p>
                  <p>3. Electronic gadgets & calculators are strictly prohibited in the examination hall.</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-24 h-12 border-b-2 border-gray-800 mx-auto"></div>
                  <div className="text-[11px] font-bold text-gray-900 uppercase">
                    Mentor
                  </div>
                  <div className="text-[9px] text-honor-gold uppercase font-bold tracking-widest">
                    Lead Instructor & Controller
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Admission Form & Document Upload */
          <div className="no-print space-y-8">
            
            {/* DOCUMENT ATTACHMENTS (STANDARD CLEAN UPLOAD) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>Attach Candidate Documents</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please attach copies of your photograph, CNIC/B-Form, and educational certificates for academy records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Passport Size Photo */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-4 bg-slate-50 text-center flex flex-col items-center justify-between space-y-3 transition-colors">
                  <div className="w-20 h-24 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Candidate Photo" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Candidate Photo</span>
                    <span className="text-[10px] text-slate-500 block">Passport size (White / Blue background)</span>
                  </div>
                  <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                    <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                </div>

                {/* 2. CNIC / B-Form Front */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-4 bg-slate-50 text-center flex flex-col items-center justify-between space-y-3 transition-colors">
                  <div className="w-full h-24 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                    {bformPreview ? (
                      <img src={bformPreview} alt="CNIC / B-Form" className="w-full h-full object-cover" />
                    ) : (
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">CNIC / B-Form</span>
                    <span className="text-[10px] text-slate-500 block">Front side image or PDF scan</span>
                  </div>
                  <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleBFormUpload} 
                      className="hidden" 
                    />
                    <span>{bformPreview ? 'Change Document' : 'Upload Document'}</span>
                  </label>
                </div>

                {/* 3. Result Card / Certificate */}
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-4 bg-slate-50 text-center flex flex-col items-center justify-between space-y-3 transition-colors">
                  <div className="w-full h-24 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                    {resultCardPreview ? (
                      <img src={resultCardPreview} alt="Result Card" className="w-full h-full object-contain bg-white" />
                    ) : (
                      <Award className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Result Card / DMC</span>
                    <span className="text-[10px] text-slate-500 block">Matric or Intermediate certificate</span>
                  </div>
                  <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleResultCardUpload} 
                      className="hidden" 
                    />
                    <span>{resultCardPreview ? 'Change Result Card' : 'Upload Result Card'}</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Candidate Admission Form */}
            <form onSubmit={handleGenerateSlip} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
              
              {/* Course Selection */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Target Defense Course / Wing *
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
                    <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">CNIC / B-Form Number *</label>
                    <input
                      type="text"
                      required
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      placeholder="e.g. 35202-1234567-1"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none font-mono font-bold focus:ring-2 focus:ring-[#183B2B] text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Date of Birth (DOB) *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Gender *</label>
                    <div className="flex gap-4 p-2 bg-slate-50 border border-gray-300 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender === 'Male'}
                          onChange={() => setGender('Male')}
                          className="text-[#183B2B] focus:ring-[#183B2B]"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender === 'Female'}
                          onChange={() => setGender('Female')}
                          className="text-[#183B2B] focus:ring-[#183B2B]"
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">WhatsApp / Phone Number *</label>
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
                    <label className="font-bold text-gray-700 block mb-1">Domicile District *</label>
                    <input
                      type="text"
                      required
                      value={domicile}
                      onChange={(e) => setDomicile(e.target.value)}
                      placeholder="e.g. Lahore / Rawalpindi / Kasur"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      placeholder="e.g. Army / Business / Teacher"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Standards */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 text-emerald-800">
                  <Award className="w-4 h-4 text-honor-gold" />
                  <span>Academic Qualifications & Physical Standards</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Matric Marks / Grade *</label>
                    <input
                      type="text"
                      required
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      placeholder="e.g. 986 / 1100 (Grade A+)"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">FSc / Intermediate Marks</label>
                    <input
                      type="text"
                      value={fscMarks}
                      onChange={(e) => setFscMarks(e.target.value)}
                      placeholder="e.g. 840 / 1100"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B] font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Height (Feet.Inches) *</label>
                    <input
                      type="text"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 5.9"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Weight (in kg)</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 65"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Mark of Identification</label>
                    <input
                      type="text"
                      value={markOfId}
                      onChange={(e) => setMarkOfId(e.target.value)}
                      placeholder="e.g. Mole on right cheek"
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">ISSB Attempt Status</label>
                    <select
                      value={issbStatus}
                      onChange={(e) => setIssbStatus(e.target.value as 'Fresh' | 'Repeater')}
                      className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#183B2B]"
                    >
                      <option value="Fresh">Fresh Candidate</option>
                      <option value="Repeater">Repeater Candidate</option>
                    </select>
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
