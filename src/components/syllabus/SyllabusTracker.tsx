'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubjectId, ChapterStatus, Chapter } from '@/types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Flame,
  Star,
  Play,
  RotateCcw,
  Edit2,
  Plus,
} from 'lucide-react';

export function SyllabusTracker() {
  const {
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    updateChapter,
    startTimer,
    setActiveTab,
    setSelectedChapterId,
  } = useApp();

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const totalChapters = currentSubject.chapters.length;
  const completedChapters = currentSubject.chapters.filter((c) =>
    ['completed', 'revised', 'mastered'].includes(c.status)
  ).length;
  const subjectPercent = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const filteredChapters = currentSubject.chapters.filter((ch) => {
    if (filterStatus === 'all') return true;
    return ch.status === filterStatus;
  });

  const handleStatusChange = (chapter: Chapter, newStatus: ChapterStatus) => {
    updateChapter(selectedSubjectId, chapter.id, {
      status: newStatus,
      lastStudiedAt: new Date().toISOString(),
    });
  };

  const handleConfidenceChange = (chapter: Chapter, newScore: number) => {
    updateChapter(selectedSubjectId, chapter.id, {
      confidenceScore: newScore,
    });
  };

  const handleStartChapter = (chapter: Chapter) => {
    setSelectedChapterId(chapter.id);
    startTimer(45, 'pomodoro', selectedSubjectId, chapter.id, chapter.name);
    setActiveTab('timer');
  };

  const statusColors: Record<ChapterStatus, { label: string; bg: string; text: string }> = {
    not_started: { label: 'Not Started', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
    learning: { label: 'Learning', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300' },
    completed: { label: 'Completed', bg: 'bg-blue-100 dark:bg-blue-950/80', text: 'text-blue-700 dark:text-blue-300' },
    revised: { label: 'Revised', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-700 dark:text-purple-300' },
    mastered: { label: 'Mastered', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-700 dark:text-emerald-300' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          const total = sub.chapters.length;
          const comp = sub.chapters.filter((c) =>
            ['completed', 'revised', 'mastered'].includes(c.status)
          ).length;
          const pct = total ? Math.round((comp / total) * 100) : 0;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  {sub.paperCode}
                </span>
                <span className={`text-xs font-mono font-black ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                  {pct}%
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold truncate">{sub.name}</h4>
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-blue-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapter Heatmap Visualizer */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Chapter Strength & Weightage Heatmap
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Green = Mastered • Red = Urgent</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {currentSubject.chapters.map((ch) => {
            let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
            if (ch.status === 'mastered') bgClass = 'bg-emerald-500 text-white';
            else if (ch.status === 'revised') bgClass = 'bg-purple-600 text-white';
            else if (ch.status === 'completed') bgClass = 'bg-blue-600 text-white';
            else if (ch.status === 'learning') bgClass = 'bg-amber-500 text-white';

            return (
              <div
                key={ch.id}
                onClick={() => setExpandedChapterId(expandedChapterId === ch.id ? null : ch.id)}
                className={`p-2.5 rounded-xl text-center cursor-pointer transition hover:scale-105 ${bgClass} shadow-sm`}
              >
                <span className="text-[10px] font-mono font-bold block">{ch.code}</span>
                <span className="text-[11px] font-black truncate block mt-0.5">{ch.name}</span>
                <span className="text-[9px] opacity-80 block">~{ch.weightageEstimatedMarks}M • {ch.accuracy}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['all', 'not_started', 'learning', 'completed', 'revised', 'mastered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                filterStatus === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredChapters.length} of {totalChapters} Chapters
        </span>
      </div>

      {/* Chapter List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          const statusInfo = statusColors[chapter.status];

          return (
            <div
              key={chapter.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Main Chapter Card Row */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {chapter.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      ~{chapter.weightageEstimatedMarks} Marks in Exam
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusInfo.bg} ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {chapter.name}
                  </h3>

                  {/* Chapter Stats Pill Row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Accuracy: <strong className="text-slate-800 dark:text-slate-200 font-mono">{chapter.accuracy}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Questions Solved: <strong className="text-slate-800 dark:text-slate-200 font-mono">{chapter.questionsSolved}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Revisions: <strong className="text-slate-800 dark:text-slate-200 font-mono">{chapter.revisionCount}x</strong>
                    </span>
                    <span>•</span>
                    {/* Confidence Stars */}
                    <div className="flex items-center gap-1">
                      <span>Confidence:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => handleConfidenceChange(chapter, star)}
                          className={`w-3.5 h-3.5 cursor-pointer transition ${
                            chapter.confidenceScore >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Quick Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={chapter.status}
                    onChange={(e) => handleStatusChange(chapter, e.target.value as ChapterStatus)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="learning">Learning</option>
                    <option value="completed">Completed</option>
                    <option value="revised">Revised</option>
                    <option value="mastered">Mastered</option>
                  </select>

                  <button
                    onClick={() => handleStartChapter(chapter)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Study</span>
                  </button>

                  <button
                    onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="View Subtopics"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Subtopic Drilldown Panel */}
              {isExpanded && (
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Topics & Subtopics Checklist:
                  </h4>
                  {chapter.topics.map((t) => (
                    <div key={t.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.title}</span>
                      </div>
                      <div className="pl-3 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-700">
                        {t.subtopics.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <span className={`w-2 h-2 rounded-full ${st.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            <span>{st.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
