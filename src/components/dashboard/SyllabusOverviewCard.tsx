'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SubjectId } from '@/types';
import { BookOpen, ChevronRight } from 'lucide-react';

export function SyllabusOverviewCard() {
  const { subjects, setActiveTab, setSelectedSubjectId } = useApp();

  // Calculate subject completion rates
  const subjectStats = subjects.map((sub) => {
    const total = sub.chapters.length;
    const completed = sub.chapters.filter((c) =>
      ['completed', 'revised', 'mastered'].includes(c.status)
    ).length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    return {
      id: sub.id,
      name: sub.name,
      paperCode: sub.paperCode,
      color: sub.color,
      percentage,
      total,
      completed,
    };
  });

  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const totalCompleted = subjects.reduce(
    (acc, s) =>
      acc + s.chapters.filter((c) => ['completed', 'revised', 'mastered'].includes(c.status)).length,
    0
  );
  const overallPercentage = totalChapters ? Math.round((totalCompleted / totalChapters) * 100) : 0;

  const handleOpenSubject = (id: SubjectId) => {
    setSelectedSubjectId(id);
    setActiveTab('syllabus');
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Curriculum Coverage
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">SYLLABUS</h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">Overall Completion</span>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {overallPercentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar Rows for the 4 Papers */}
      <div className="space-y-4">
        {subjectStats.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenSubject(item.id)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">({item.paperCode})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">
                  {item.percentage}%
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition" />
              </div>
            </div>

            {/* Visual ASCII / Bar representation */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
