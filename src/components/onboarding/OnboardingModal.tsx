'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserProfile, SubjectId } from '@/types';
import { Sparkles, ArrowRight, CheckCircle2, BookOpen, Clock, Calendar, ShieldCheck } from 'lucide-react';

export function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, profile, setProfile, triggerCelebration } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    name: profile.name || 'CA Aspirant',
    attempt: 'January',
    examDate: profile.examDate || new Date(Date.now() + 137 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyTargetHours: 4.0,
    preferredStudyHours: 'Morning (6:00 AM - 10:00 AM)',
    onboardingCompleted: false,
    confidenceBySubject: {
      accounting: 4,
      law: 3,
      qa: 5,
      economics: 4,
    },
  });

  if (!showOnboarding) return null;

  const handleFinish = () => {
    const updated = {
      ...formData,
      onboardingCompleted: true,
    };
    setProfile(updated);
    setShowOnboarding(false);
    triggerCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Setup Your Preparation OS • Step {step} of 3
            </span>
            <span className="text-xs text-white/80 font-mono font-medium">CA Foundation 2025</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Personalize Your Study Strategy</h2>
          <p className="text-xs text-white/80 mt-1">
            Tailor syllabus tracking, spaced repetition intervals, and daily targets.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  1. Your Name / Nickname
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pranav"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    2. Target Attempt
                  </label>
                  <select
                    value={formData.attempt}
                    onChange={(e) => setFormData({ ...formData, attempt: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="January">January Attempt (Default)</option>
                    <option value="June">June Attempt</option>
                    <option value="December">December Attempt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    3. Exact Examination Date
                  </label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  The countdown ticker and daily hourly targets will automatically adjust if ICAI updates official exam notifications.
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  4. Daily Target Study Hours
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setFormData({ ...formData, dailyTargetHours: hours })}
                      className={`py-3 rounded-xl border text-center font-bold text-sm transition ${
                        formData.dailyTargetHours === hours
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {hours}h / day
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  5. Preferred Study Slot
                </label>
                <select
                  value={formData.preferredStudyHours}
                  onChange={(e) => setFormData({ ...formData, preferredStudyHours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Morning (6:00 AM - 10:00 AM)">Early Morning (6:00 AM - 10:00 AM)</option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon Slot (1:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 9:00 PM)">Evening Slot (5:00 PM - 9:00 PM)</option>
                  <option value="Late Night (9:00 PM - 1:00 AM)">Night Owl (9:00 PM - 1:00 AM)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  The planner schedules higher-difficulty topics (Law and Partnership accounts) during your peak focus hours.
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                6. Self-Assessed Confidence by Subject (1 to 5 Stars)
              </label>

              {[
                { id: 'accounting' as SubjectId, name: 'Paper 1: Accounting', color: 'text-blue-600 dark:text-blue-400' },
                { id: 'law' as SubjectId, name: 'Paper 2: Business Laws', color: 'text-purple-600 dark:text-purple-400' },
                { id: 'qa' as SubjectId, name: 'Paper 3: Quantitative Aptitude', color: 'text-emerald-600 dark:text-emerald-400' },
                { id: 'economics' as SubjectId, name: 'Paper 4: Business Economics', color: 'text-amber-600 dark:text-amber-400' },
              ].map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <span className={`text-xs font-bold ${sub.color}`}>{sub.name}</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            confidenceBySubject: {
                              ...formData.confidenceBySubject,
                              [sub.id]: star,
                            },
                          })
                        }
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          formData.confidenceBySubject[sub.id] >= star
                            ? 'bg-amber-400 text-slate-900 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  All realistic ICAI syllabus chapters, previous year questions, mistake logs, and formula cards are ready out-of-the-box!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:opacity-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Launch CA Foundation OS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
