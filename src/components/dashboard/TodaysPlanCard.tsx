'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { DailyTask } from '@/types';
import {
  CalendarCheck,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  SkipForward,
} from 'lucide-react';

export function TodaysPlanCard() {
  const { tasks, updateTask, startTimer, setActiveTab, setSelectedSubjectId } = useApp();

  const handleStartTask = (task: DailyTask) => {
    setSelectedSubjectId(task.subjectId);
    startTimer(
      task.estimatedMinutes,
      'pomodoro',
      task.subjectId,
      task.chapterId,
      task.chapterName
    );
    updateTask(task.id, { status: 'in_progress' });
    setActiveTab('timer');
  };

  const handleComplete = (task: DailyTask) => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? undefined : new Date().toISOString(),
    });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Structured Schedule
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">TODAY'S PLAN</h3>
        </div>

        <button
          onClick={() => setActiveTab('plan')}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => {
          const isCompleted = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCompleted
                  ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
                  : isInProgress
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/80 shadow-md ring-1 ring-blue-400/40'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Task Left Info */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(task)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    {task.scheduledTime && (
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700/80 px-2 py-0.5 rounded-md">
                        {task.scheduledTime}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {task.subjectId.toUpperCase()}
                    </span>
                    {task.priority === 'urgent' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-sm font-bold mt-1 ${
                      isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.recommendedReason && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Reason: {task.recommendedReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Task Right Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1 mr-2">
                  <Clock className="w-3.5 h-3.5" />
                  {task.estimatedMinutes}m
                </span>

                {!isCompleted && (
                  <button
                    onClick={() => handleStartTask(task)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>START</span>
                  </button>
                )}

                <button
                  onClick={() => handleComplete(task)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
                    isCompleted
                      ? 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  {isCompleted ? 'UNDO' : 'MARK COMPLETE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
