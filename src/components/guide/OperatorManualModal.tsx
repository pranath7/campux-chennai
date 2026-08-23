'use client';

import React from 'react';
import {
  Compass,
  X,
  Target,
  CheckCircle2,
  Timer,
  AlertTriangle,
  FileCheck2,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
} from 'lucide-react';

interface OperatorManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OperatorManualModal({ isOpen, onClose }: OperatorManualModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                Official User Manual
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                HOW TO OPERATE CA FOUNDATION OS
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The 3 Core Answers */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-800/50 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-400">
            🎯 The 3 Core Questions This App Answers 24/7:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200 pt-1">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <strong className="text-amber-400 block mb-0.5">1. Time Left?</strong>
              Live days, hours, & target study hours remaining until exam.
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <strong className="text-emerald-400 block mb-0.5">2. Am I on Track?</strong>
              Exam Readiness Index & Subject Strength scores updated in real time.
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <strong className="text-purple-400 block mb-0.5">3. What to do NOW?</strong>
              Multi-factor recommendation engine picking the highest-priority chapter.
            </div>
          </div>
        </div>

        {/* Daily Study Routine Step-by-Step */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            📅 Your Daily Operating Routine (How to use it each day)
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">
                  Morning: Check "What Should I Study Right Now?"
                </strong>
                Open the app and check your Daily Tasks on the Dashboard. Click <strong>[START NOW]</strong> on the top recommendation banner to launch the Study Timer with the exact recommended chapter.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">
                  During Study: Use the Focus Timer (Pomodoro / Stopwatch)
                </strong>
                Hit Start. The timer keeps track of your exact hours. When it completes, it automatically saves to your Study Logs and builds your consistency streak.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">
                  After Studying: Practice Questions & Review Mistakes
                </strong>
                Go to <strong>PRACTICE</strong> tab. Solve 10-20 MCQs or numerical problems. If you make a mistake, the app <strong>automatically logs it into your Mistake Book</strong> so you never repeat it in the exam.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">
                  Evening: Complete Spaced Revisions & Flashcards
                </strong>
                Check the <strong>Revision Due</strong> card. The system schedules automatic reviews on days 1, 3, 7, 15, 30, and 60. Flip through flashcards for 10 minutes before sleeping.
              </div>
            </div>
          </div>
        </div>

        {/* Feature Directory */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            🛠️ Complete Feature Directory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Syllabus Tracker</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Track all 4 papers chapter-by-chapter. Mark status: Learning, Completed, Revised, Mastered.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Mistake Book</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Categorizes your errors into 6 mistake types and allows targeted Mistake Review drills.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                <span>Mock Exam Simulator</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Authentic ICAI examination interface with -0.25 negative marking and real timer.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>AI CA Mentor</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Ask any legal, numerical, or conceptual doubt. Converts notes to flashcards instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            Got It, Let's Start Studying! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
