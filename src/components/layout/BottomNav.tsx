'use client';

import React from 'react';
import { useApp, AppNavigationTab } from '@/context/AppContext';
import {
  Home,
  CalendarCheck,
  Target,
  BarChart3,
  Menu,
} from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: AppNavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'plan', label: 'PLAN', icon: CalendarCheck },
    { id: 'practice', label: 'PRACTICE', icon: Target },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'more', label: 'MORE', icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'practice' &&
              ['practice', 'mistakes', 'mocks', 'pyq', 'flashcards', 'law_recall', 'accounts_practice', 'qa_drills', 'eco_quiz'].includes(activeTab)) ||
            (item.id === 'plan' && ['plan', 'calendar', 'timer'].includes(activeTab)) ||
            (item.id === 'more' && ['more', 'settings', 'notes', 'syllabus', 'ai_assistant'].includes(activeTab));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-wider mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
