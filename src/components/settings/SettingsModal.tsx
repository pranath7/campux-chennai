'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StorageEngine } from '@/lib/storage';
import {
  Settings,
  Calendar,
  Clock,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export function SettingsModal() {
  const { profile, setProfile, theme, setTheme, refreshData, triggerCelebration } = useApp();

  const [name, setName] = useState(profile.name);
  const [attempt, setAttempt] = useState(profile.attempt);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [dailyTargetHours, setDailyTargetHours] = useState(profile.dailyTargetHours);
  const [apiKey, setApiKey] = useState(profile.apiKey || '');
  const [importJson, setImportJson] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name,
      attempt,
      examDate,
      dailyTargetHours: Number(dailyTargetHours),
      apiKey: apiKey.trim() || undefined,
    });
    setSaveSuccess(true);
    triggerCelebration();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = StorageEngine.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ca-foundation-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerCelebration();
  };

  const handleExportCSV = (entity: 'mistakes' | 'sessions') => {
    const csvStr = StorageEngine.exportCSV(entity);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ca-foundation-${entity}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerCelebration();
  };

  const handleImportJSON = () => {
    if (!importJson.trim()) return;
    const ok = StorageEngine.importData(importJson);
    if (ok) {
      refreshData();
      triggerCelebration();
      alert('Data imported successfully!');
      setImportJson('');
    } else {
      alert('Invalid JSON format.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to restore default ICAI demo data?')) {
      StorageEngine.resetToDemoData();
      refreshData();
      triggerCelebration();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          System Preferences
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">SETTINGS & DATA MANAGEMENT</h2>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
      >
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Examination & Target Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Attempt Name
            </label>
            <select
              value={attempt}
              onChange={(e) => setAttempt(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="January">January Attempt (Default)</option>
              <option value="June">June Attempt</option>
              <option value="December">December Attempt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Exact Examination Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Daily Target Hours
            </label>
            <input
              type="number"
              value={dailyTargetHours}
              onChange={(e) => setDailyTargetHours(Number(e.target.value))}
              step="0.5"
              min="1"
              max="16"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            />
          </div>
        </div>

        {/* AI API Key Config */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Google Gemini AI API Key (Optional)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            If provided, live Gemini 1.5 Flash models will be used for custom doubt solving. If left blank, the high-intellect offline expert CA tutor engine will handle all doubts.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            Save Configuration
          </button>
        </div>
      </form>

      {/* Data Export & Backup Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Data Portability & Backup
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Export your complete study data, mistakes, mock attempts, and notes for offline archiving.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export Full JSON Backup</span>
          </button>

          <button
            onClick={() => handleExportCSV('mistakes')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            <Download className="w-4 h-4 text-rose-500" />
            <span>Export Mistakes (CSV)</span>
          </button>

          <button
            onClick={() => handleExportCSV('sessions')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Study Logs (CSV)</span>
          </button>
        </div>

        {/* Restore / Import */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
            Import JSON Backup:
          </label>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste your JSON backup data here..."
            rows={3}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
          />
          <button
            onClick={handleImportJSON}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
          >
            Restore Backup
          </button>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div>
              <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                🌱 Start Fresh from Day 0 (Zero Progress)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Clears all past study hours, sets syllabus to 0%, empties mistake book, and configures a clean Day 1 study schedule for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Start fresh from Day 0? All progress will reset to zero so you can begin your actual preparation from today.')) {
                  StorageEngine.resetToFreshDayZero();
                  refreshData();
                  triggerCelebration();
                  alert('Reset complete! Welcome to Day 1 of your CA Foundation journey.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Reset to Day 0 (Fresh Start)
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                🔄 Restore Sample Demo Data
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Populates sample mocks, study sessions, and progress to preview all analytics and chart dashboards.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs whitespace-nowrap"
            >
              Restore Sample Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
