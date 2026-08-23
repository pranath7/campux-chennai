'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StorageEngine } from '@/lib/storage';
import { ShieldCheck, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export function ExamReadinessSnapshot() {
  const { setActiveTab } = useApp();
  const readiness = StorageEngine.calculateExamReadiness();
  const strengthScores = StorageEngine.calculateSubjectStrengthScores();

  const sorted = [...strengthScores].sort((a, b) => b.score - a.score);
  const bestScore = sorted[0]?.score || 0;
  const lowestScore = sorted[sorted.length - 1]?.score || 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Preparation Health
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">EXAM READINESS</h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Preparation Indicator</span>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Score Ring / Block */}
        <div className="sm:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white text-center border border-slate-800 shadow-md">
          <span className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
            {readiness.overallScore}
          </span>
          <span className="text-slate-400 text-lg font-mono"> / 100</span>
          <div className="text-[10px] uppercase font-black tracking-widest text-slate-300 mt-1">
            Readiness Index
          </div>
        </div>

        {/* Strengths & Weakness Callouts */}
        <div className="sm:col-span-8 space-y-2.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                  Top Subject
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {readiness.biggestStrength}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-mono">
              {bestScore}/100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 block">
                  Focus Area
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {readiness.biggestWeakness}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-mono">
              {lowestScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Next Action Bar */}
      <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
          NEXT PRIORITY ACTION
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
          {readiness.mostImportantNextAction}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[10px] text-slate-400 italic">
          *Readiness is a preparation tracker reflecting syllabus, consistency & accuracy.
        </p>
        <button
          onClick={() => setActiveTab('analytics')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Deep Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
