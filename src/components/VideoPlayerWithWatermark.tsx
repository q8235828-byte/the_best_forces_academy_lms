"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Play, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Lesson, Course } from '@/types';
import { ACADEMY_CONFIG } from '@/lib/constants';

interface VideoPlayerWithWatermarkProps {
  lesson: Lesson;
  course: Course;
  isEnrolled: boolean;
  studentName?: string;
  studentPhone?: string;
  onOpenEnrollmentModal?: () => void;
}

export default function VideoPlayerWithWatermark({
  lesson,
  course,
  isEnrolled,
  studentName = "Candidate",
  studentPhone = "+92 305 4599659",
  onOpenEnrollmentModal
}: VideoPlayerWithWatermarkProps) {
  // Free Lesson 1 rule:
  const isFree = lesson.order_index === 1 || lesson.is_free_preview === 1;
  const canPlay = isFree || isEnrolled;

  // Anti-piracy watermark coordinates
  const [coords, setCoords] = useState({ top: '20%', left: '25%' });

  useEffect(() => {
    if (!canPlay) return;

    // Shift coordinates every 15 seconds dynamically across the 4 quadrants
    const interval = setInterval(() => {
      const topPos = Math.floor(Math.random() * 70) + 10; // 10% to 80%
      const leftPos = Math.floor(Math.random() * 60) + 10; // 10% to 70%
      setCoords({ top: `${topPos}%`, left: `${leftPos}%` });
    }, 15000);

    return () => clearInterval(interval);
  }, [canPlay]);

  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#2A5A44]/60">
      {/* Video Container */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {canPlay ? (
          <>
            <video
              key={lesson.video_url}
              controls
              playsInline
              preload="none"
              poster={course.thumbnail_url || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'}
              className="w-full h-full object-contain"
              src={lesson.video_url}
            >
              Your browser does not support HTML5 video streaming.
            </video>

            {/* Dynamic Anti-Piracy Watermark (20% Opacity) */}
            <div
              className="absolute pointer-events-none select-none transition-all duration-1000 z-30"
              style={{
                top: coords.top,
                left: coords.left,
                opacity: 0.22,
              }}
            >
              <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono border border-white/20 whitespace-nowrap">
                <span>{studentName}</span> • <span>{studentPhone}</span>
                <div className="text-[9px] text-gray-300">bestforcesacademy.net</div>
              </div>
            </div>

            {/* Free Demo Indicator Badge */}
            {isFree && !isEnrolled && (
              <div className="absolute top-4 left-4 z-20 bg-emerald-600/90 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md border border-emerald-400/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>FREE DEMO LECTURE</span>
              </div>
            )}
          </>
        ) : (
          /* Locked Paywall for Lessons 2+ */
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F261C]/95 via-[#0F261C]/98 to-black flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Lecture Locked (Enrollment Required)
            </h3>
            <p className="text-sm text-gray-300 max-w-md mb-6 leading-relaxed">
              This lecture is part of the approved premium syllabus for <strong>{course.title}</strong>. Complete enrollment to unlock all lectures, notes, and VIP WhatsApp batch access.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {onOpenEnrollmentModal ? (
                <button
                  onClick={onOpenEnrollmentModal}
                  className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105"
                >
                  Enroll Now (PKR {course.sale_price.toLocaleString()})
                </button>
              ) : (
                <a
                  href={`#enrollment-section`}
                  className="bg-honor-gold hover:bg-honor-dark text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105"
                >
                  Enroll Now (PKR {course.sale_price.toLocaleString()})
                </a>
              )}

              <a
                href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Sir Faryad Tabassum, I want to unlock full course: ${course.title} (PKR ${course.sale_price}). Please share payment details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Verify with Sir Faryad</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* In-Lesson Bottom Bar: Doubt Button with Sir Faryad Tabassum */}
      <div className="bg-[#183B2B] p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A5A44]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F261C] border border-honor-gold/40 flex items-center justify-center text-honor-gold font-bold">
            {lesson.order_index}
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight text-white">{lesson.title}</h4>
            <span className="text-xs text-gray-300">
              {course.title} • {lesson.duration_minutes || 45} Minutes
            </span>
          </div>
        </div>

        {/* WhatsApp Direct Doubt Button */}
        <a
          href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent(`Assalam-o-Alaikum Sir Faryad Tabassum, I am watching ${course.title} -> Lesson ${lesson.order_index} (${lesson.title}) and have a question regarding the topic:`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow transition-all hover:scale-105 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Ask Sir Faryad Tabassum on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
