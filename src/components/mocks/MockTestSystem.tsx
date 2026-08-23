'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MockTest } from '@/types';
import { ExamSimulationMode } from '@/components/mocks/ExamSimulationMode';
import {
  FileCheck2,
  Play,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export function MockTestSystem() {
  const { mocks, mockAttempts } = useApp();
  const [activeSimulationMock, setActiveSimulationMock] = useState<MockTest | null>(null);

  if (activeSimulationMock) {
    return (
      <ExamSimulationMode
        mockTest={activeSimulationMock}
        onExit={() => setActiveSimulationMock(null)}
      />
    );
  }

  // Calculate average mock percentage
  const avgMockPct = mockAttempts.length
    ? Math.round(mockAttempts.reduce((acc, m) => acc + m.percentage, 0) / mockAttempts.length)
    : 70;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          ICAI Simulation Suite
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">MOCK TEST SYSTEM</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Full syllabus & subject tests configured with ICAI time limits and objective negative marking.
        </p>
      </div>

      {/* Mock Progression History Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Mock Score Progression (Average: {avgMockPct}%)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{mockAttempts.length} Tests Completed</span>
        </div>

        {/* Horizontal Improvement Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mockAttempts.map((att, idx) => (
            <div
              key={att.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mock #{idx + 1}</span>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                {att.percentage}%
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
                {att.mockTitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Mocks List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Simulation Tests:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mocks.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {test.subjectId ? test.subjectId.toUpperCase() : 'ALL PAPERS'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {test.totalMarks} Marks
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {test.title}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {test.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Passing Benchmark: {test.passingMarks} Marks</span>
                  </div>
                  {test.negativeMarkingRatio > 0 && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      ⚠ Negative Marking: -{test.negativeMarkingRatio} for wrong answers
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveSimulationMock(test)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Authentic Exam Mode</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
