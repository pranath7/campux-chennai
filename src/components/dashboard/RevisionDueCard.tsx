'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { RefreshCw, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export function RevisionDueCard() {
  const { revisions, completeRevision, setActiveTab } = useApp();

  const dueRevisions = revisions.filter(
    (r) => r.status === 'due_today' || r.status === 'overdue'
  );

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Spaced Repetition
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">REVISION DUE</h3>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs">
          {dueRevisions.length} chapters today
        </span>
      </div>

      {dueRevisions.length === 0 ? (
        <div className="py-6 text-center text-slate-400">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All revisions up to date!</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Upcoming revisions will appear based on spaced repetition intervals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dueRevisions.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    {item.subjectId.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Interval #{item.intervalIndex + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {item.chapterName}
                </h4>
              </div>

              <button
                onClick={() => completeRevision(item.id)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition"
              >
                [ REVIEW ]
              </button>
            </div>
          ))}

          <button
            onClick={() => setActiveTab('plan')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Open Spaced Repetition Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
