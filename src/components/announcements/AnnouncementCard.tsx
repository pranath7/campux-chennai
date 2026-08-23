'use client';

import React from 'react';
import { Announcement } from '@/types/marketplace';
import { Calendar, Building, ArrowUpRight, Trophy, Tag, Clock, Sparkles } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const categoryColors: Record<string, string> = {
    Internship: 'bg-purple-100 text-purple-900 border-purple-200',
    Competition: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    Symposium: 'bg-amber-100 text-amber-900 border-amber-200',
    Workshop: 'bg-blue-100 text-blue-900 border-blue-200',
    Club: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    Seminar: 'bg-rose-100 text-rose-900 border-rose-200',
    General: 'bg-stone-100 text-stone-900 border-stone-200',
  };

  const badgeClass = categoryColors[announcement.category] || 'bg-stone-100 text-stone-800 border-stone-200';

  return (
    <div className="warm-card rounded-[22px] sm:rounded-[28px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative group text-left border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white w-full max-w-full min-w-0">
      {/* Banner image */}
      {announcement.imageUrl ? (
        <div className="aspect-[16/8] w-full overflow-hidden relative bg-stone-100">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-xs ${badgeClass}`}>
              {announcement.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{announcement.collegeName || 'All Chennai Colleges'}</span>
            </span>
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md text-[10px]">
              <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{announcement.date || '30 Aug'}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-5 pb-0 flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeClass}`}>
            {announcement.category}
          </span>
          <span className="text-[11px] text-stone-400 font-semibold">{announcement.date}</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-[#121316] text-base leading-snug group-hover:text-[#059669] transition-colors line-clamp-2 min-h-[2.5rem]">
            {announcement.title}
          </h3>

          {!announcement.imageUrl && (
            <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
              <Building className="w-3.5 h-3.5 text-stone-400" />
              <span>{announcement.collegeName || 'All Chennai Colleges'}</span>
            </div>
          )}

          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {announcement.description}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">Apply before: <strong className="text-stone-800">{announcement.date || '30 Aug'}</strong></span>
          </div>
        </div>

        {/* Action Link & Register CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-stone-400 font-medium truncate max-w-[120px]">
            By {announcement.organizer}
          </span>

          <a
            href={announcement.registrationLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#121316] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>VIEW OPPORTUNITY</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
