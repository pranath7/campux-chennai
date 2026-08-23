'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubjectId } from '@/types';
import { sounds } from '@/lib/sound';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Flame,
  Clock,
  BookOpen,
  Volume2,
  Award,
  CheckCircle2,
} from 'lucide-react';

export function StudyTimer() {
  const {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    selectedChapterId,
    setSelectedChapterId,
    sessions,
  } = useApp();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [timerPreset, setTimerPreset] = useState<'25' | '45' | '50' | '60' | 'stopwatch' | 'custom'>('25');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const currentChapter = currentSubject.chapters.find((c) => c.id === selectedChapterId);

  // Formatting seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate today's study minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = sessions
    .filter((s) => s.startedAt.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const handlePresetSelect = (preset: '25' | '45' | '50' | '60' | 'stopwatch' | 'custom') => {
    setTimerPreset(preset);
    if (preset === 'stopwatch') {
      startTimer(0, 'stopwatch', selectedSubjectId, selectedChapterId || undefined, currentChapter?.name);
    } else if (preset === 'custom') {
      startTimer(customMinutes, 'custom', selectedSubjectId, selectedChapterId || undefined, currentChapter?.name);
    } else {
      const mins = Number(preset);
      startTimer(mins, 'pomodoro', selectedSubjectId, selectedChapterId || undefined, currentChapter?.name);
    }
  };

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-12 flex flex-col justify-between overflow-y-auto'
          : 'animate-fade-in'
      }`}
    >
      {/* Top Controls in Fullscreen */}
      {isFullscreen && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">
              CA
            </div>
            <span className="font-bold text-sm text-slate-300">Focus Mode</span>
          </div>

          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold hover:bg-slate-700 transition"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      )}

      {/* Main Timer Display Box */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 relative z-10 mb-6">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-extrabold uppercase tracking-wider">
            {activeTimer.subjectId ? activeTimer.subjectId.toUpperCase() : 'ACCOUNTING'}
          </span>
          {activeTimer.chapterName && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              {activeTimer.chapterName}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase">
            {activeTimer.mode}
          </span>
        </div>

        {/* Time Digits */}
        <div className="relative z-10 my-4">
          <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-lg select-none">
            {formatTime(activeTimer.timeLeft)}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
            {activeTimer.isRunning ? '🔥 Focus session actively in progress...' : 'Session paused or ready'}
          </p>
        </div>

        {/* Play / Pause / Reset Action Controls */}
        <div className="flex items-center justify-center gap-4 relative z-10 mt-8">
          {activeTimer.isRunning ? (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Pause className="w-5 h-5 fill-slate-950" />
              <span>PAUSE SESSION</span>
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START / RESUME</span>
            </button>
          )}

          <button
            onClick={() => stopTimer(true)}
            className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            title="Complete & Log Session"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>FINISH & LOG</span>
          </button>

          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Fullscreen Focus Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 relative z-10 mt-8 pt-6 border-t border-slate-800">
          {[
            { id: '25' as const, label: '25/5 Pomodoro' },
            { id: '45' as const, label: '45/10 Focus' },
            { id: '50' as const, label: '50/10 Deep' },
            { id: '60' as const, label: '60/10 Marathon' },
            { id: 'stopwatch' as const, label: 'Stopwatch' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timerPreset === preset.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject & Chapter Context Selector for Timer */}
      {!isFullscreen && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Session Target
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Select Subject & Chapter for this Session
              </h3>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Today's Total: {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Select Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value as SubjectId);
                  setSelectedChapterId(null);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.paperCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Select Chapter (Optional)
              </label>
              <select
                value={selectedChapterId || ''}
                onChange={(e) => setSelectedChapterId(e.target.value || null)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
              >
                <option value="">-- General Subject Study --</option>
                {currentSubject.chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.code}: {ch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
