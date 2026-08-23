'use client';

import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { sounds } from '@/lib/sound';

export function EconomicsQuizMode() {
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const ecoQuizzes = [
    {
      topic: 'Theory of Demand & Elasticity',
      question: 'If the price of a commodity increases by 10% and total expenditure on it increases, the price elasticity of demand (Ep) is:',
      options: [
        'Ep > 1 (Elastic)',
        'Ep < 1 (Inelastic)',
        'Ep = 1 (Unitary)',
        'Ep = 0 (Perfectly Inelastic)',
      ],
      correct: 'B',
      explanation: 'Under Total Outlay Method: When Price and Total Expenditure move in the SAME direction (both increase or both decrease), Price Elasticity of Demand is Less than 1 (Inelastic demand).',
    },
    {
      topic: 'Theory of Production & Cost',
      question: 'At what point does the Marginal Cost (MC) curve intersect the Average Variable Cost (AVC) and Average Total Cost (ATC) curves?',
      options: [
        'At their maximum points',
        'At their minimum points',
        'At the falling stage',
        'At the shutdown point only',
      ],
      correct: 'B',
      explanation: 'The MC curve always intersects both the AVC and ATC curves at their respective lowest/minimum points from below.',
    },
    {
      topic: 'Market Structures & Oligopoly',
      question: 'Why is the demand curve faced by an Oligopolist "kinked" at the ruling market price?',
      options: [
        'Firms expect rivals to match price cuts but ignore price increases',
        'Firms have colluded to fix prices',
        'There is free entry and exit in the industry',
        'Homogeneous goods are produced',
      ],
      correct: 'A',
      explanation: 'Paul Sweezy hypothesis: Rivals do not follow a price increase (making upper demand highly elastic), but follow a price cut (making lower demand inelastic). This asymmetry creates the kink and explains price rigidity.',
    },
  ];

  const currentQuiz = ecoQuizzes[selectedConceptIndex];

  const handleSelect = (idx: number) => {
    const letter = String.fromCharCode(65 + idx);
    setSelectedOption(letter);
    if (letter === currentQuiz.correct) {
      sounds.playSuccess();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Paper 4: Business Economics
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
              Concept Drills
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">ECONOMICS CONCEPT QUIZ</h2>
        </div>

        <div className="flex items-center gap-2">
          {ecoQuizzes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedConceptIndex(idx);
                setSelectedOption(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedConceptIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Quiz #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-800/50 shadow-2xl text-white space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-amber-400">
            {currentQuiz.topic}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Concept {selectedConceptIndex + 1} of {ecoQuizzes.length}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold leading-relaxed">{currentQuiz.question}</h3>

        <div className="space-y-2.5">
          {currentQuiz.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            const isSelected = selectedOption === letter;
            const isCorrect = currentQuiz.correct === letter;

            let style = 'bg-slate-800/80 border-slate-700 hover:border-amber-500';
            if (selectedOption) {
              if (isCorrect) style = 'bg-emerald-600 border-emerald-500 text-white font-bold';
              else if (isSelected) style = 'bg-rose-600 border-rose-500 text-white font-bold';
            }

            return (
              <div
                key={oIdx}
                onClick={() => !selectedOption && handleSelect(oIdx)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${style}`}
              >
                <span className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center font-mono font-bold text-xs">
                  {letter}
                </span>
                <span className="text-xs sm:text-sm font-semibold">{opt}</span>
              </div>
            );
          })}
        </div>

        {selectedOption && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 leading-relaxed animate-fade-in">
            <strong className="text-amber-400 block mb-1">Economic Principle & Verification:</strong>
            {currentQuiz.explanation}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setSelectedOption(null);
              setSelectedConceptIndex((i) => (i + 1) % ecoQuizzes.length);
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            Next Concept Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}
