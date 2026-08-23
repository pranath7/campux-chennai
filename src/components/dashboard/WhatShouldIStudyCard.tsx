'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateWhatShouldIStudyNow, StudyRecommendation } from '@/lib/recommendation';
import { Sparkles, Play, X, HelpCircle, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export function WhatShouldIStudyCard() {
  const { startTimer, setActiveTab, setSelectedSubjectId, setSelectedChapterId } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  const recommendation: StudyRecommendation = useMemo(() => {
    return calculateWhatShouldIStudyNow();
  }, []);

  if (isDismissed) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-4 text-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Need guidance? Re-open "What Should I Study Now?" recommendation</span>
        </button>
      </div>
    );
  }

  const handleStartNow = () => {
    setSelectedSubjectId(recommendation.subjectId);
    setSelectedChapterId(recommendation.chapterId);
    startTimer(
      recommendation.durationMinutes,
      'pomodoro',
      recommendation.subjectId,
      recommendation.chapterId,
      recommendation.chapterName
    );
    setActiveTab('timer');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-7 shadow-2xl border border-blue-400/20">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-200">
            Intelligent Focus Engine
          </span>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/20">
          Priority: {recommendation.priorityScore}/100
        </span>
      </div>

      {/* Big Title Callout */}
      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
          WHAT SHOULD I STUDY RIGHT NOW?
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight flex items-center gap-2">
          <span>{recommendation.subjectName}</span>
          <span className="text-blue-200 font-light">—</span>
          <span className="text-amber-100">{recommendation.chapterName}</span>
        </h2>
        <div className="text-xs font-semibold text-blue-100 mt-0.5">
          Recommended Duration: {recommendation.durationMinutes} Minutes Focused Block
        </div>

        {/* Why Reason Box */}
        <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white leading-relaxed">
                {recommendation.reason}
              </p>
              <ul className="mt-2 space-y-1">
                {recommendation.bulletPoints.map((point, idx) => (
                  <li key={idx} className="text-[11px] text-blue-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartNow}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START NOW (LAUNCH TIMER)</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
