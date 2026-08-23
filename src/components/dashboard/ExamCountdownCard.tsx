'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, Clock, Target, Sparkles, AlertCircle, Edit3 } from 'lucide-react';

export function ExamCountdownCard() {
  const { profile, setProfile, setActiveTab } = useApp();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState(profile.examDate);

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(profile.examDate + 'T09:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [profile.examDate]);

  const weeksRemaining = Math.max(Math.floor(timeLeft.days / 7), 0);
  const studyDaysRemaining = Math.max(timeLeft.days, 0);
  const remainingTargetHours = Math.round(studyDaysRemaining * profile.dailyTargetHours);

  const handleSaveDate = () => {
    if (newDate) {
      setProfile({ ...profile, examDate: newDate });
      setIsEditingDate(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-8">
      {/* Background Decorative Rings & Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-extrabold text-xs tracking-wider uppercase">
            CA FOUNDATION
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase">
            {profile.attempt} ATTEMPT
          </span>
        </div>

        {/* Date editor toggle */}
        <div className="flex items-center gap-2">
          {isEditingDate ? (
            <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="bg-slate-900 text-xs px-2 py-1 rounded text-white outline-none border border-slate-700"
              />
              <button
                onClick={handleSaveDate}
                className="text-[11px] font-bold bg-blue-600 px-2.5 py-1 rounded text-white hover:bg-blue-500"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingDate(false)}
                className="text-[11px] font-bold text-slate-400 px-1 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDate(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60"
              title="Change examination date"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Exam: {profile.examDate}</span>
              <Edit3 className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Display */}
      {timeLeft.isPassed ? (
        <div className="my-8 text-center py-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <h3 className="text-2xl font-black text-emerald-400">Exam Window Completed</h3>
          <p className="text-xs text-slate-400 mt-1">
            Ready to transition to the next milestone? Update your examination date in Settings.
          </p>
          <button
            onClick={() => setActiveTab('settings')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
          >
            Configure Next Attempt
          </button>
        </div>
      ) : (
        <div className="my-6 sm:my-8 text-center relative z-10">
          {/* Days Callout */}
          <div className="inline-block">
            <span className="text-6xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm font-mono">
              {String(timeLeft.days).padStart(3, '0')}
            </span>
            <div className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-blue-400 mt-1">
              DAYS REMAINING
            </div>
          </div>

          {/* Time Clock Ticker */}
          <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-slate-300 font-mono text-sm sm:text-lg font-bold">
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="text-amber-400 font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-sans uppercase">Hours</span>
            </div>
            <span className="text-slate-500 font-black">:</span>
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="text-amber-400 font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-sans uppercase">Mins</span>
            </div>
            <span className="text-slate-500 font-black">:</span>
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="text-blue-400 font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-sans uppercase">Secs</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            until ICAI CA Foundation examination commencement
          </p>
        </div>
      )}

      {/* Secondary Dynamic Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 relative z-10">
        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Days Left
          </span>
          <span className="text-lg font-black text-white font-mono mt-0.5 block">
            {timeLeft.days} days
          </span>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Weeks Remaining
          </span>
          <span className="text-lg font-black text-white font-mono mt-0.5 block">
            {weeksRemaining} weeks
          </span>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Daily Study Target
          </span>
          <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
            {profile.dailyTargetHours}h / day
          </span>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Target Hours Left
          </span>
          <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
            {remainingTargetHours}h total
          </span>
        </div>
      </div>
    </div>
  );
}
