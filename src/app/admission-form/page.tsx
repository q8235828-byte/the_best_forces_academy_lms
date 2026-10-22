"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  Printer, 
  FileText, 
  User, 
  Sparkles, 
  Award,
  AlertCircle
} from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';
import { INITIAL_COURSES } from '@/lib/courses-data';

export default function AdmissionFormPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

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
  const [matricMarks, setMatricMarks] = useState('980');
  const [fscMarks, setFscMarks] = useState('950');
  const [issbStatus, setIssbStatus] = useState<'Fresh' | 'Repeater'>('Fresh');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('pma-long-course');
  const [rollNumber, setRollNumber] = useState('');

  // OCR Scan Simulation
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        // Pre-fill extracted fields
        setFullName('Muhammad Ali Khan');
        setFatherName('Tariq Mahmood Khan');
        setCnic('35202-8491823-1');
        setDob('2006-04-15');
        setGender('Male');
        setDomicile('Lahore');
        setMatricMarks('1010');
        setFscMarks('985');
        setMarkOfId('Small mole on left cheek');
        setFatherOccupation('Government Service');
        setPhone('0305 4599659');
      }, 1500);
    }
  };

  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRoll = `TBFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setRollNumber(generatedRoll);
    setShowSlip(true);
  };

  const selectedCourse = INITIAL_COURSES.find((c) => c.slug === selectedCourseSlug) || INITIAL_COURSES[0];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation & Header (Hidden when printing) */}
        <div className="no-print space-y-4">
          <div className="bg-[#183B2B] text-white p-8 sm:p-10 rounded-3xl border border-[#2A5A44] shadow-xl">
            <span className="text-xs text-honor-gold uppercase tracking-widest font-bold">
              Official Candidate Registration
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Smart ISSB & Forces Admission Form
            </h1>
            <p className="text-sm text-gray-200 mt-2">
              Upload your CNIC / B-Form or Result Card to auto-fill your profile via OCR scan, or fill manually to generate your authorized printable Roll Number Slip.
            </p>
          </div>
        </div>

        {/* Printable Roll Number Slip View */}
        {showSlip ? (
          <div className="space-y-6">
            <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Roll Number Slip generated successfully!</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSlip(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
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
                <div className="w-24 h-28 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center text-center p-2 text-gray-400 text-[10px]">
                  <User className="w-8 h-8 mb-1 text-gray-300" />
                  <span>Affix 1.5&quot; x 2&quot; Photograph</span>
                </div>
              </div>

              {/* Roll Number & Course Banner */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Candidate Roll Number:</div>
                  <div className="text-2xl font-black font-mono text-[#183B2B]">{rollNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Enrolled Course:</div>
                  <div className="text-base font-extrabold text-gray-900">{selectedCourse.title}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Candidate Status:</div>
                  <div className="text-sm font-bold text-emerald-700 uppercase">{issbStatus} Candidate</div>
                </div>
              </div>

              {/* Candidate Biodata Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="divide-x divide-gray-200">
                      <td className="p-3 bg-gray-50 font-bold text-gray-600 w-1/4">Full Name</td>
                      <td className="p-3 font-semibold text-gray-900 w-1/4">{fullName}</td>
                      <td className="p-3 bg-gray-50 font-bold text-gray-600 w-1/4">Father&apos;s Name</td>
                      <td className="p-3 font-semibold text-gray-900 w-1/4">{fatherName}</td>
                    </tr>
                    <tr className="divide-x divide-gray-200">
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">CNIC / B-Form No.</td>
                      <td className="p-3 font-mono font-semibold text-gray-900">{cnic}</td>
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Date of Birth</td>
                      <td className="p-3 font-semibold text-gray-900">{dob}</td>
                    </tr>
                    <tr className="divide-x divide-gray-200">
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Contact / WhatsApp</td>
                      <td className="p-3 font-semibold text-gray-900">{phone}</td>
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Domicile District</td>
                      <td className="p-3 font-semibold text-gray-900">{domicile}</td>
                    </tr>
                    <tr className="divide-x divide-gray-200">
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Height & Weight</td>
                      <td className="p-3 font-semibold text-gray-900">{height} ft / {weight} kg</td>
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Identification Mark</td>
                      <td className="p-3 font-semibold text-gray-900">{markOfId || 'N/A'}</td>
                    </tr>
                    <tr className="divide-x divide-gray-200">
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">Matric Marks</td>
                      <td className="p-3 font-semibold text-gray-900">{matricMarks} / 1100</td>
                      <td className="p-3 bg-gray-50 font-bold text-gray-600">FSc / Inter Marks</td>
                      <td className="p-3 font-semibold text-gray-900">{fscMarks} / 1100</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-[11px] text-gray-600">
                <div className="font-bold text-gray-900 uppercase">Important Instructions for Candidate:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keep this official admission slip with you during live interactive classes and mock test evaluations.</li>
                  <li>Join your designated course VIP WhatsApp batch using the link provided in your student portal.</li>
                  <li>For any academic queries or test date adjustments, contact Chief Mentor Sir Faryad Tabassum directly at +92 305 4599659.</li>
                </ul>
              </div>

              {/* Signature & Seal Section */}
              <div className="pt-8 border-t border-gray-300 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ISSUED ON: {new Date().toLocaleDateString('en-GB')} • VERIFIED DIGITAL SLIP
                  </div>
                  <div className="w-24 h-24 border-2 border-honor-gold rounded-full flex flex-col items-center justify-center text-honor-dark font-black text-[9px] uppercase tracking-tighter text-center mt-2 opacity-80">
                    <span>THE BEST FORCES</span>
                    <Shield className="w-4 h-4 my-0.5" />
                    <span>ACADEMY SEAL</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="font-serif italic font-bold text-lg text-gray-800">
                    Sir Faryad Tabassum
                  </div>
                  <div className="w-48 h-0.5 bg-gray-800 mx-auto" />
                  <div className="text-xs font-bold text-gray-900">
                    Sir Faryad Tabassum
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase">
                    Authorized Signatory & Chief Mentor
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Input Form */
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-8">
            
            {/* Step 1: OCR Document Upload Box */}
            <div className="p-6 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-300 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Smart OCR Auto-Fill (Optional)
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Upload your B-Form / CNIC or Matric Result Card. Our scanner will automatically read and populate your information.
              </p>

              <label className="inline-flex items-center gap-2 bg-[#183B2B] hover:bg-[#2A5A44] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow transition-all">
                <Sparkles className="w-4 h-4 text-honor-gold" />
                <span>{isScanning ? 'Scanning Document...' : 'Upload Document to Auto-Fill'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>

              {scanComplete && (
                <div className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5 pt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Document parsed successfully! Review the fields below.</span>
                </div>
              )}
            </div>

            {/* Step 2: Form Fields */}
            <form onSubmit={handleGenerateSlip} className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                Candidate Biodata & Course Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Select Target Course:
                  </label>
                  <select
                    value={selectedCourseSlug}
                    onChange={(e) => setSelectedCourseSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-army outline-none bg-white"
                  >
                    {INITIAL_COURSES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title} (PKR {c.sale_price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Father&apos;s Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Father Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    CNIC / B-Form Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35202-xxxxxxx-x"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Date of Birth (DOB):
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    WhatsApp & Phone:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Domicile District:
                  </label>
                  <input
                    type="text"
                    required
                    value={domicile}
                    onChange={(e) => setDomicile(e.target.value)}
                    placeholder="e.g. Rawalpindi, Lahore, Multan"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Height (feet) & Weight (kg):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height (e.g. 5.8)"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                    />
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Weight (kg)"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ISSB Candidate Status:
                  </label>
                  <select
                    value={issbStatus}
                    onChange={(e) => setIssbStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none bg-white"
                  >
                    <option value="Fresh">Fresh Candidate</option>
                    <option value="Repeater">Repeater Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Matric Obtained Marks:
                  </label>
                  <input
                    type="number"
                    value={matricMarks}
                    onChange={(e) => setMatricMarks(e.target.value)}
                    placeholder="e.g. 980"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    FSc / Inter Obtained Marks:
                  </label>
                  <input
                    type="number"
                    value={fscMarks}
                    onChange={(e) => setFscMarks(e.target.value)}
                    placeholder="e.g. 950"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Visible Mark of Identification:
                  </label>
                  <input
                    type="text"
                    value={markOfId}
                    onChange={(e) => setMarkOfId(e.target.value)}
                    placeholder="e.g. Small scar on right forehead"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-army outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#183B2B] hover:bg-[#2A5A44] text-white py-4 rounded-xl font-extrabold text-sm shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5 text-honor-gold" />
                  <span>Verify Information & Generate Roll Number Slip</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
