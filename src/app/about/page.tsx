'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building, GraduationCap, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 text-[#121316]">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-block bg-[#E8E1D5] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800">
          Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900">
          Empowering Chennai Collegiate Education
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Campux is Chennai's first verified peer-to-peer academic marketplace, connecting students across DG Vaishnav, Loyola, Madras Christian College, SRM IST, and VIT Chennai.
        </p>
      </div>

      <div className="warm-card rounded-[32px] p-8 sm:p-12 space-y-8 bg-white border border-stone-200">
        <h2 className="text-2xl font-black text-stone-900">Why We Built Campux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600 leading-relaxed">
          <p>
            Every semester, thousands of hardworking students spend hundreds of hours creating exceptional lecture summaries, solving past university exam questions, and drawing crystal-clear accounting ledgers or engineering diagrams.
          </p>
          <p>
            Campux provides a fair, safe, and transparent marketplace where top students are compensated for their academic diligence while helping their juniors and peers master difficult subjects before exam season.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/login?redirect=/app"
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md"
        >
          <span>Join the Student Network</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
