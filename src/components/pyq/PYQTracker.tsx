'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PYQItem, SubjectId } from '@/types';
import { History, CheckCircle2, Award, Clock, Sparkles, Filter } from 'lucide-react';

export function PYQTracker() {
  const { pyqs, togglePYQ, triggerCelebration } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filtered = pyqs.filter((p) => {
    if (selectedSubject !== 'all' && p.subjectId !== selectedSubject) return false;
    if (selectedYear !== 'all' && p.year !== selectedYear) return false;
    return true;
  });

  const total = pyqs.length;
  const solved = pyqs.filter((p) => p.solved).length;
  const solvedPct = total ? Math.round((solved / total) * 100) : 0;

  const handleToggle = (id: string) => {
    togglePYQ(id);
    triggerCelebration();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ICAI Past Examination Repository
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">PYQ TRACKER (2022 - 2024)</h2>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs">
          <span>Completion: {solvedPct}% ({solved}/{total} Questions)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Subjects</option>
              <option value="accounting">Paper 1: Accounting</option>
              <option value="law">Paper 2: Business Laws</option>
              <option value="qa">Paper 3: Quantitative Aptitude</option>
              <option value="economics">Paper 4: Business Economics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Attempt / Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Attempts</option>
              <option value="May 2024">May 2024</option>
              <option value="Nov 2023">Nov 2023</option>
              <option value="Dec 2023">Dec 2023</option>
              <option value="June 2023">June 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* PYQ List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all space-y-3 ${
              item.solved
                ? 'bg-slate-50/80 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {item.subjectId.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.year}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  Tested {item.repeatedCount}x in Exam History
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">{item.marks} Marks</span>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border flex items-center gap-1.5 ${
                    item.solved
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.solved ? 'Solved ✓' : 'Mark Solved'}</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Chapter: {item.chapterName}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {item.questionText}
              </p>
            </div>

            {item.notes && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-slate-200">ICAI Examiner Note: </strong>
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
