'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Mistake, MistakeType, SubjectId } from '@/types';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Filter,
  Tag,
  BookOpen,
  Sparkles,
  HelpCircle,
  Clock,
  Play,
} from 'lucide-react';

export function MistakeBook() {
  const { mistakes, updateMistake, resolveMistake, triggerCelebration } = useApp();

  const [selectedFilterSubject, setSelectedFilterSubject] = useState<string>('all');
  const [selectedMistakeType, setSelectedMistakeType] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const mistakeTypes: { id: MistakeType; label: string; color: string }[] = [
    { id: 'conceptual', label: 'Conceptual Mistake', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    { id: 'calculation', label: 'Calculation Error', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { id: 'careless', label: 'Careless Oversight', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    { id: 'memory', label: 'Memory / Section Blank', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { id: 'question_interpretation', label: 'Misinterpreted Question', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
    { id: 'time_pressure', label: 'Time Pressure Error', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
  ];

  const filteredMistakes = mistakes.filter((m) => {
    if (!showResolved && m.resolved) return false;
    if (selectedFilterSubject !== 'all' && m.subjectId !== selectedFilterSubject) return false;
    if (selectedMistakeType !== 'all' && m.mistakeType !== selectedMistakeType) return false;
    return true;
  });

  // Prioritize repeated and high weightage mistakes for review
  const sortedForReview = [...filteredMistakes].sort((a, b) => b.timesRepeated - a.timesRepeated);

  const currentReviewItem = sortedForReview[reviewIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Launch Review CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
              High ROI Retention Tool
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
              {mistakes.filter((m) => !m.resolved).length} Unresolved Errors
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">MISTAKE BOOK</h2>
        </div>

        <button
          onClick={() => {
            setReviewMode(!reviewMode);
            setReviewIndex(0);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{reviewMode ? 'Exit Review Mode' : 'Start Mistake Review Mode'}</span>
        </button>
      </div>

      {/* Review Mode Interactive Screen */}
      {reviewMode && currentReviewItem && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/60 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-400">
                Reviewing Mistake {reviewIndex + 1} of {sortedForReview.length}
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Repeated {currentReviewItem.timesRepeated}x
              </span>
            </div>

            <button
              onClick={() => {
                resolveMistake(currentReviewItem.id);
                if (reviewIndex < sortedForReview.length - 1) {
                  setReviewIndex((i) => i + 1);
                } else {
                  setReviewMode(false);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Concept Mastered</span>
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">
              {currentReviewItem.subjectId.toUpperCase()} • {currentReviewItem.chapterName}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentReviewItem.questionText}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-700/60 text-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-400">Your Answer (Incorrect)</span>
              <p className="text-sm font-bold mt-1 font-mono">{currentReviewItem.userAnswer}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Correct Answer</span>
              <p className="text-sm font-bold mt-1 font-mono">{currentReviewItem.correctAnswer}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-xs font-bold text-blue-400">ICAI Conceptual Correction:</span>
            <p className="text-xs text-slate-300 leading-relaxed">{currentReviewItem.explanation}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              disabled={reviewIndex === 0}
              onClick={() => setReviewIndex((i) => Math.max(i - 1, 0))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
            >
              Previous Mistake
            </button>

            <button
              onClick={() => {
                if (reviewIndex < sortedForReview.length - 1) {
                  setReviewIndex((i) => i + 1);
                } else {
                  setReviewMode(false);
                }
              }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Next Mistake →
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Subject
            </label>
            <select
              value={selectedFilterSubject}
              onChange={(e) => setSelectedFilterSubject(e.target.value)}
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
              Mistake Classification
            </label>
            <select
              value={selectedMistakeType}
              onChange={(e) => setSelectedMistakeType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Mistake Types</option>
              {mistakeTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pb-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Show Resolved / Mastered Mistakes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Mistake Items List */}
      <div className="space-y-4">
        {filteredMistakes.map((item) => {
          const typeConfig = mistakeTypes.find((t) => t.id === item.mistakeType) || mistakeTypes[0];

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                item.resolved
                  ? 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {item.subjectId.toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                  {item.timesRepeated > 1 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Repeated {item.timesRepeated}x
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">Added: {item.dateAdded}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mistake classification changer */}
                  <select
                    value={item.mistakeType}
                    onChange={(e) => updateMistake(item.id, { mistakeType: e.target.value as MistakeType })}
                    className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 outline-none"
                  >
                    {mistakeTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  {!item.resolved ? (
                    <button
                      onClick={() => resolveMistake(item.id)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-500">Mastered ✓</span>
                  )}
                </div>
              </div>

              {/* Question */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Chapter: {item.chapterName}
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {item.questionText}
                </p>
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200">
                  <strong>Your Wrong Choice:</strong> {item.userAnswer}
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
                  <strong>Correct ICAI Answer:</strong> {item.correctAnswer}
                </div>
              </div>

              {/* Detailed Explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-1">Concept & Rule:</strong>
                {item.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
