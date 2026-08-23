'use client';

import React from 'react';
import { useApp, AppNavigationTab } from '@/context/AppContext';
import {
  Home,
  CalendarCheck,
  Target,
  BarChart3,
  BookOpen,
  Timer,
  AlertTriangle,
  FileCheck2,
  History,
  Layers,
  Sparkles,
  Settings,
  Calendar,
  FileText,
  Scale,
  Calculator,
  Binary,
  TrendingUp,
} from 'lucide-react';

export function Sidebar() {
  const { activeTab, setActiveTab, setSelectedSubjectId } = useApp();

  const mainNav = [
    { id: 'home' as AppNavigationTab, label: 'Dashboard', icon: Home },
    { id: 'syllabus' as AppNavigationTab, label: 'Syllabus Tracker', icon: BookOpen },
    { id: 'plan' as AppNavigationTab, label: 'Daily Planner', icon: CalendarCheck },
    { id: 'timer' as AppNavigationTab, label: 'Study Timer', icon: Timer },
    { id: 'calendar' as AppNavigationTab, label: 'Study Calendar', icon: Calendar },
    { id: 'analytics' as AppNavigationTab, label: 'Performance Analytics', icon: BarChart3 },
  ];

  const practiceNav = [
    { id: 'practice' as AppNavigationTab, label: 'Question Bank & Practice', icon: Target },
    { id: 'mistakes' as AppNavigationTab, label: 'Mistake Book', icon: AlertTriangle, badge: 'Crucial' },
    { id: 'mocks' as AppNavigationTab, label: 'Mock Test Simulator', icon: FileCheck2 },
    { id: 'pyq' as AppNavigationTab, label: 'PYQ Tracker', icon: History },
    { id: 'flashcards' as AppNavigationTab, label: 'Flashcards', icon: Layers },
    { id: 'notes' as AppNavigationTab, label: 'Notes & Law Summaries', icon: FileText },
  ];

  const subjectToolkits = [
    {
      id: 'law_recall' as AppNavigationTab,
      label: 'Law Section Recall',
      icon: Scale,
      color: 'text-purple-500',
      action: () => {
        setSelectedSubjectId('law');
        setActiveTab('law_recall');
      },
    },
    {
      id: 'accounts_practice' as AppNavigationTab,
      label: 'Accounts Numericals',
      icon: Calculator,
      color: 'text-blue-500',
      action: () => {
        setSelectedSubjectId('accounting');
        setActiveTab('accounts_practice');
      },
    },
    {
      id: 'qa_drills' as AppNavigationTab,
      label: 'QA Speed Drills',
      icon: Binary,
      color: 'text-emerald-500',
      action: () => {
        setSelectedSubjectId('qa');
        setActiveTab('qa_drills');
      },
    },
    {
      id: 'eco_quiz' as AppNavigationTab,
      label: 'Economics Concept Quiz',
      icon: TrendingUp,
      color: 'text-amber-500',
      action: () => {
        setSelectedSubjectId('economics');
        setActiveTab('eco_quiz');
      },
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-6 flex-1">
        {/* Core Nav */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Hub
          </p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice & Mastery */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Practice & Evaluation
          </p>
          <div className="space-y-1">
            {practiceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject-Specific Toolkits */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Subject Toolkits
          </p>
          <div className="space-y-1">
            {subjectToolkits.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'ai_assistant'
              ? 'bg-purple-600 text-white'
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 hover:opacity-90'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI Doubt Solver</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings & Backup</span>
        </button>
      </div>
    </aside>
  );
}
