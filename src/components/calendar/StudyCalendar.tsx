'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, Clock, BookOpen, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export function StudyCalendar() {
  const { sessions, tasks, revisions, mockAttempts } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Generate 28 past days for contribution grid
  const daysGrid = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter((s) => s.startedAt.startsWith(dateStr));
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    return {
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      totalMinutes,
    };
  });

  const selectedDaySessions = sessions.filter((s) => s.startedAt.startsWith(selectedDate));
  const selectedDayTasks = tasks.filter((t) => t.date === selectedDate);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Study Activity Timeline
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">STUDY CALENDAR & HEATMAP</h2>
      </div>

      {/* GitHub-style Contribution Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            28-Day Study Consistency Grid (Click a day to inspect)
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded bg-blue-300" />
            <span className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span className="w-2.5 h-2.5 rounded bg-blue-700" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysGrid.map((day) => {
            const isSelected = day.dateStr === selectedDate;
            let intensityClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
            if (day.totalMinutes >= 240) intensityClass = 'bg-blue-700 text-white font-bold';
            else if (day.totalMinutes >= 120) intensityClass = 'bg-blue-500 text-white font-bold';
            else if (day.totalMinutes > 0) intensityClass = 'bg-blue-300 text-slate-900 font-bold';

            return (
              <div
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`p-2.5 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 border ${intensityClass} ${
                  isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border-amber-400' : 'border-transparent'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block opacity-70">
                  {day.dayName}
                </span>
                <span className="text-sm font-mono font-black block mt-0.5">{day.dayNumber}</span>
                <span className="text-[9px] block mt-0.5">
                  {Math.floor(day.totalMinutes / 60)}h {day.totalMinutes % 60}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Timeline & Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Activity for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>

          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            {selectedDaySessions.reduce((acc, s) => acc + s.durationMinutes, 0)} mins total
          </span>
        </div>

        {selectedDaySessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            No study sessions recorded for this day.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDaySessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {sess.subjectId.toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {sess.taskType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {sess.chapterName || 'General Subject Study'}
                  </h4>
                  {sess.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {sess.notes}
                    </p>
                  )}
                </div>

                <div className="text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Clock className="w-3 h-3" />
                    <span>{sess.durationMinutes}m</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    {new Date(sess.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
