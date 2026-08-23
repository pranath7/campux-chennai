'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StorageEngine } from '@/lib/storage';
import { Clock, HelpCircle, RefreshCw, Award, Flame } from 'lucide-react';

export function TodaysProgressCard() {
  const { profile, sessions, questions, revisions, mockAttempts, setActiveTab } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's study minutes
  const todaySessions = sessions.filter((s) => s.startedAt && s.startedAt.startsWith(todayStr));
  const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const targetMinutes = (profile.dailyTargetHours || 4) * 60;
  const timeProgressRatio = targetMinutes > 0 ? Math.min(todayStudyMinutes / targetMinutes, 1) : 0;

  const hours = Math.floor(todayStudyMinutes / 60);
  const mins = todayStudyMinutes % 60;
  const timeFormatted = `${hours}h ${mins}m`;

  const attempts = StorageEngine.getAttempts();
  const questionsSolvedToday = attempts.filter((a: any) => a.attemptedAt && a.attemptedAt.startsWith(todayStr)).length;
  const targetQuestionsToday = 30;

  const revisionsCompletedToday = revisions.filter(
    (r) => r.completedAt && r.completedAt.startsWith(todayStr)
  ).length;
  const targetRevisionsToday = Math.max(revisions.filter((r) => r.status === 'due_today').length, 1);

  const mockAttemptedToday = mockAttempts.some((m) => m.submittedAt && m.submittedAt.startsWith(todayStr));

  // Composite overall today's completion percentage
  const overallPercentage = Math.round(
    timeProgressRatio * 50 +
      Math.min(questionsSolvedToday / targetQuestionsToday, 1) * 30 +
      Math.min(revisionsCompletedToday / targetRevisionsToday, 1) * 20
  );

  const streaks = StorageEngine.calculateStreaks();

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Daily Execution
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">TODAY'S PROGRESS</h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{streaks.currentStreak > 0 ? `${streaks.currentStreak} Day Streak` : 'Day 1 Launch'}</span>
        </div>
      </div>

      {/* Progress Ring & Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Circular Progress Ring */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - overallPercentage / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {overallPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* 4 Detail Metric Cards */}
        <div className="sm:col-span-8 grid grid-cols-2 gap-3">
          {/* Study Time */}
          <div
            onClick={() => setActiveTab('timer')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-blue-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Study Time</span>
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {timeFormatted}{' '}
              <span className="text-xs text-slate-400 font-sans font-medium">
                / {profile.dailyTargetHours}h
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(timeProgressRatio * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div
            onClick={() => setActiveTab('practice')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-emerald-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Questions</span>
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {questionsSolvedToday}{' '}
              <span className="text-xs text-slate-400 font-sans font-medium">
                / {targetQuestionsToday}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((questionsSolvedToday / targetQuestionsToday) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Revision */}
          <div
            onClick={() => setActiveTab('plan')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-purple-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
              <span>Revision</span>
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {revisionsCompletedToday}{' '}
              <span className="text-xs text-slate-400 font-sans font-medium">
                / {targetRevisionsToday}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((revisionsCompletedToday / targetRevisionsToday) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Mock Test */}
          <div
            onClick={() => setActiveTab('mocks')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Mock Test</span>
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
              {mockAttemptedToday ? (
                <span className="text-emerald-500">Attempted ✓</span>
              ) : (
                <span className="text-slate-400">0 Mocks Taken</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Ready for Day 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
