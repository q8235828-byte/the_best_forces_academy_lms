"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ACADEMY_CONFIG } from '@/lib/constants';

export default function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 no-print">
      <div className="hidden md:flex flex-col items-end bg-[#0F261C] text-white px-3 py-1.5 rounded-lg border border-[#2A5A44] shadow-xl text-xs">
        <span className="font-semibold text-honor-gold">Need Admission Help?</span>
        <span className="text-gray-300">Chat with Sir Faryad Tabassum</span>
      </div>

      <a
        href={`https://wa.me/${ACADEMY_CONFIG.phoneRaw}?text=${encodeURIComponent('Assalam-o-Alaikum Sir Faryad Tabassum, I am visiting bestforcesacademy.net and need guidance regarding Forces admission & test prep.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Sir Faryad Tabassum on WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        <MessageCircle className="w-8 h-8 fill-white" />
      </a>
    </div>
  );
}
