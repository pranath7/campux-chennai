'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubjectId, QuestionDifficulty, QuestionSource, Question } from '@/types';
import {
  HelpCircle,
  Filter,
  Play,
  CheckCircle2,
  AlertTriangle,
  Tag,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function QuestionBank() {
  const { questions, subjects, setActiveTab, setSelectedSubjectId } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedSource !== 'all' && q.source !== selectedSource) return false;
    if (searchQuery.trim()) {
      const matchText = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTags = q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchText && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Start Practice CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ICAI Standard Question Repository
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">QUESTION BANK</h2>
        </div>

        <button
          onClick={() => setActiveTab('practice')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Timed Practice Mode</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Subject Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Subjects (4 Papers)</option>
              <option value="accounting">Paper 1: Accounting</option>
              <option value="law">Paper 2: Business Laws</option>
              <option value="qa">Paper 3: Quantitative Aptitude</option>
              <option value="economics">Paper 4: Business Economics</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (Direct Concept)</option>
              <option value="medium">Medium (ICAI Standard)</option>
              <option value="hard">Hard (Advanced Scenario)</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="all">All Sources</option>
              <option value="ICAI">ICAI Study Material</option>
              <option value="PYQ">Previous Year Questions (PYQ)</option>
              <option value="RTP">Revision Test Paper (RTP)</option>
              <option value="MTP">Mock Test Paper (MTP)</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Search by Keyword
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. BRS, Section 25, TVM..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQuestionId === q.id;

          return (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
            >
              {/* Question Header Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {q.subjectId.toUpperCase()}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {q.source} {q.year ? `(${q.year})` : ''}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : q.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{q.marks} Mark(s)</span>
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    <span>{isExpanded ? 'Hide Solution' : 'View Solution'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {q.questionText}
              </p>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const optLetter = String.fromCharCode(65 + oIdx);
                    const isCorrect = isExpanded && q.correctAnswer === optLetter;
                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-2xl border text-xs font-semibold transition ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <strong className="mr-2 font-mono">{optLetter}.</strong>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Working Notes Drawer */}
              {isExpanded && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct Answer: Option {q.correctAnswer}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {q.tags.map((t, idx2) => (
                      <span
                        key={idx2}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
