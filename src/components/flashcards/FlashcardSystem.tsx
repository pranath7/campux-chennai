'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Flashcard, FlashcardMastery, SubjectId } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function FlashcardSystem() {
  const { flashcards, updateFlashcardMastery, triggerCelebration } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'learning' | 'familiar' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredCards = flashcards.filter((fc) => {
    if (selectedSubject !== 'all' && fc.subjectId !== selectedSubject) return false;
    if (selectedMode !== 'all' && fc.mastery !== selectedMode) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex];

  const handleMasteryChange = (mastery: FlashcardMastery) => {
    if (!currentCard) return;
    updateFlashcardMastery(currentCard.id, mastery);
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">
            Leitner Active Recall System
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">FLASHCARDS & DEFINITIONS</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
              setIsFlipped(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-200 transition"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-wrap gap-2">
          {['all', 'accounting', 'law', 'qa', 'economics'].map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition uppercase ${
                selectedSubject === sub
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {(['all', 'learning', 'familiar', 'mastered'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSelectedMode(mode);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                selectedMode === mode
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard View */}
      {currentCard ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="uppercase font-bold text-purple-600 dark:text-purple-400">
              Mastery: {currentCard.mastery}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[280px] sm:min-h-[320px] rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="uppercase font-bold text-blue-400">
                {currentCard.subjectId.toUpperCase()} • {currentCard.chapterName}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to Flip Card</span>
              </span>
            </div>

            <div className="my-auto py-6 text-center">
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-2">
                      QUESTION / CONCEPT FRONT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold leading-relaxed">
                      {currentCard.front}
                    </h3>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block mb-2">
                      ANSWER / STATUTORY PROVISION
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-slate-100 whitespace-pre-line leading-relaxed">
                      {currentCard.back}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentCard.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Mastery Rating Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleMasteryChange('learning')}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition text-center"
            >
              1. Still Learning
            </button>
            <button
              onClick={() => handleMasteryChange('familiar')}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition text-center"
            >
              2. Familiar
            </button>
            <button
              onClick={() => handleMasteryChange('mastered')}
              className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center shadow-md shadow-emerald-500/20"
            >
              3. Mastered ✓
            </button>
          </div>

          {/* Previous / Next Stepper */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((i) => Math.max(i - 1, 0));
                setIsFlipped(false);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={currentIndex === filteredCards.length - 1}
              onClick={() => {
                setCurrentIndex((i) => Math.min(i + 1, filteredCards.length - 1));
                setIsFlipped(false);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Layers className="w-10 h-10 mx-auto text-purple-400 opacity-40 mb-2" />
          <p className="text-sm font-bold">No flashcards match this filter criteria.</p>
        </div>
      )}
    </div>
  );
}
