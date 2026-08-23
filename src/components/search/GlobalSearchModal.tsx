'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  X,
  BookOpen,
  FileText,
  HelpCircle,
  AlertTriangle,
  Layers,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    subjects,
    questions,
    notes,
    mistakes,
    flashcards,
    mocks,
    setActiveTab,
    setSelectedSubjectId,
  } = useApp();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      id: string;
      category: 'Chapter' | 'Question' | 'Note' | 'Mistake' | 'Flashcard' | 'Mock';
      title: string;
      subtitle: string;
      icon: React.ElementType;
      color: string;
      action: () => void;
    }> = [];

    // Search Chapters
    subjects.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        if (ch.name.toLowerCase().includes(q) || ch.code.toLowerCase().includes(q)) {
          items.push({
            id: ch.id,
            category: 'Chapter',
            title: `${ch.code}: ${ch.name}`,
            subtitle: `${sub.name} • Status: ${ch.status} • Weightage: ~${ch.weightageEstimatedMarks}M`,
            icon: BookOpen,
            color: 'text-blue-500',
            action: () => {
              setSelectedSubjectId(sub.id);
              setActiveTab('syllabus');
              setIsSearchOpen(false);
            },
          });
        }
      });
    });

    // Search Notes
    notes.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          id: n.id,
          category: 'Note',
          title: n.title,
          subtitle: `Subject: ${n.subjectId.toUpperCase()} • Tags: ${n.tags.join(', ')}`,
          icon: FileText,
          color: 'text-amber-500',
          action: () => {
            setActiveTab('notes');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Questions
    questions.forEach((qu) => {
      if (
        qu.questionText.toLowerCase().includes(q) ||
        qu.tags.some((t) => t.toLowerCase().includes(q)) ||
        qu.topic?.toLowerCase().includes(q)
      ) {
        items.push({
          id: qu.id,
          category: 'Question',
          title: qu.questionText.slice(0, 80) + '...',
          subtitle: `${qu.subjectId.toUpperCase()} • ${qu.source} • Diff: ${qu.difficulty}`,
          icon: HelpCircle,
          color: 'text-emerald-500',
          action: () => {
            setActiveTab('practice');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Mistakes
    mistakes.forEach((m) => {
      if (
        m.questionText.toLowerCase().includes(q) ||
        m.explanation.toLowerCase().includes(q) ||
        m.mistakeType.toLowerCase().includes(q)
      ) {
        items.push({
          id: m.id,
          category: 'Mistake',
          title: m.questionText.slice(0, 80) + '...',
          subtitle: `Error Type: ${m.mistakeType} • Times Repeated: ${m.timesRepeated}`,
          icon: AlertTriangle,
          color: 'text-rose-500',
          action: () => {
            setActiveTab('mistakes');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Flashcards
    flashcards.forEach((fc) => {
      if (
        fc.front.toLowerCase().includes(q) ||
        fc.back.toLowerCase().includes(q) ||
        fc.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          id: fc.id,
          category: 'Flashcard',
          title: fc.front,
          subtitle: `Mastery: ${fc.mastery} • ${fc.subjectId.toUpperCase()}`,
          icon: Layers,
          color: 'text-purple-500',
          action: () => {
            setActiveTab('flashcards');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Mocks
    mocks.forEach((mo) => {
      if (mo.title.toLowerCase().includes(q)) {
        items.push({
          id: mo.id,
          category: 'Mock',
          title: mo.title,
          subtitle: `Duration: ${mo.durationMinutes}m • Total Marks: ${mo.totalMarks}`,
          icon: FileCheck,
          color: 'text-indigo-500',
          action: () => {
            setActiveTab('mocks');
            setIsSearchOpen(false);
          },
        });
      }
    });

    return items.slice(0, 15);
  }, [query, subjects, notes, questions, mistakes, flashcards, mocks]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, case laws, sections, formulas, notes, mistakes..."
            autoFocus
            className="w-full bg-transparent text-sm font-semibold outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-blue-500" />
              <p className="text-xs font-medium">Type any keyword like "Contract", "TVM", "Depreciation", "AS-2", or "Elasticity"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs font-semibold">No matches found for "{query}"</p>
              <p className="text-[11px] mt-1 text-slate-500">Try searching for broader keywords or section numbers.</p>
            </div>
          ) : (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.category}-${item.id}`}
                  onClick={item.action}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 cursor-pointer transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
