/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StorageEngine } from '@/lib/storage';
import {
  BarChart3,
  TrendingUp,
  Clock,
  HelpCircle,
  Award,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export function PerformanceDashboard() {
  const { sessions, questions, mockAttempts, subjects, pyqs, revisions } = useApp();

  const strengthScores = StorageEngine.calculateSubjectStrengthScores();
  const readiness = StorageEngine.calculateExamReadiness();
  const streaks = StorageEngine.calculateStreaks();
  const attempts = StorageEngine.getAttempts();

  // Real Total Study Minutes
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const daysStudied = Math.max(streaks.totalDaysStudied, 1);
  const dailyAverageHours = Math.round((totalHours / daysStudied) * 10) / 10;

  const questionsCount = attempts.length;
  const correctCount = attempts.filter((a: any) => a.isCorrect).length;
  const overallAccuracy = questionsCount > 0 ? Math.round((correctCount / questionsCount) * 100) : 0;

  const mocksCount = mockAttempts.length;
  const avgMockScore = mocksCount > 0
    ? Math.round(mockAttempts.reduce((acc, m) => acc + m.percentage, 0) / mocksCount)
    : 0;

  // Real 7-day study trend data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const studyTrendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter((s) => s.startedAt && s.startedAt.startsWith(dateStr));
    const dayMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    return {
      day: daysOfWeek[d.getDay()],
      hours: Math.round((dayMinutes / 60) * 10) / 10,
    };
  });

  const mockTrendData = mockAttempts.map((m, i) => ({
    name: `Mock ${i + 1}`,
    score: m.percentage,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Preparation Diagnostics
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">PERFORMANCE ANALYTICS</h2>
      </div>

      {/* 4 Core Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Total Study Hours</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalHours}h
          </div>
          <span className="text-[10px] text-slate-400">Daily Avg: {dailyAverageHours}h/day</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Questions Solved</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {questionsCount}
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">{overallAccuracy}% Accuracy</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Mocks & Tests</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {mocksCount} Mocks
          </div>
          <span className="text-[10px] text-purple-500 font-bold">{avgMockScore}% Avg Score</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Active Streak</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {streaks.currentStreak} Days
          </div>
          <span className="text-[10px] text-amber-500 font-bold">Longest: {streaks.longestStreak} Days</span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Study Hours Over Past 7 Days (Target: 4h/day)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mock Progression Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Mock Test Score Progression (% Trend)
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            {mockTrendData.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">
                No mock tests submitted yet. Take your first mock under the MOCKS tab!
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Transparent Subject Strength Breakdown Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            TRANSPARENT SUBJECT STRENGTH SCORES
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formula = Syllabus (25%) + Accuracy (25%) + Revision (20%) + PYQ (15%) + Mock (15%) - Mistake Penalty
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengthScores.map((scoreObj: any) => (
            <div
              key={scoreObj.subjectId}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {scoreObj.subjectName}
                  </h4>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      scoreObj.strengthLevel === 'Strong'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : scoreObj.strengthLevel === 'Moderate'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {scoreObj.strengthLevel}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {scoreObj.score}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>

              {/* Contributing Factor Breakdown Bars */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>Syllabus Coverage (25% weight):</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">
                    {scoreObj.factors.syllabusCompletion}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Practice Accuracy (25% weight):</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">
                    {scoreObj.factors.recentAccuracy}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Revision Completion (20% weight):</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">
                    {scoreObj.factors.revisionCompletion}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>PYQ Completion (15% weight):</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">
                    {scoreObj.factors.pyqCompletion}%
                  </strong>
                </div>
                {scoreObj.factors.mistakePenalty > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Unresolved Mistake Deduction:</span>
                    <strong className="font-mono">-{scoreObj.factors.mistakePenalty} pts</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
