'use client';

import React, { useState, useEffect } from 'react';
import { Binary, Clock, Sparkles, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { sounds } from '@/lib/sound';

export function QADrillsMode() {
  const [activeTabQA, setActiveTabQA] = useState<'drill' | 'formulas' | 'shortcuts'>('drill');
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [drillTimer, setDrillTimer] = useState(45); // 45s target per MCQ
  const [score, setScore] = useState(0);

  const speedQuestions = [
    {
      q: 'If the simple interest on a sum of money for 2 years at 5% p.a. is ₹50, what is the compound interest at the same rate and period?',
      opts: ['₹51.25', '₹52.50', '₹50.50', '₹55.00'],
      ans: 'A',
      exp: 'Formula: CI - SI = P(r/100)^2. Since SI for 1 year is ₹25, CI for year 2 includes interest on ₹25 at 5% = ₹1.25. Total CI = ₹50 + ₹1.25 = ₹51.25.',
    },
    {
      q: 'In how many ways can 5 boys and 3 girls be seated in a row so that all the 3 girls sit together?',
      opts: ['720', '4320', '5040', '1440'],
      ans: 'B',
      exp: 'Treat 3 girls as 1 unit. Total units = 5 boys + 1 unit = 6 units. 6 units can be arranged in 6! = 720 ways. 3 girls internally arrange in 3! = 6 ways. Total = 720 × 6 = 4,320 ways.',
    },
    {
      q: 'If two regression coefficients are b_yx = -0.8 and b_xy = -0.2, then the correlation coefficient r is:',
      opts: ['+0.4', '-0.4', '+0.16', '-0.16'],
      ans: 'B',
      exp: 'r = ±√(b_yx × b_xy) = -√((-0.8) × (-0.2)) = -√(0.16) = -0.4. (Both regression coefficients are negative, so r must also be negative!).',
    },
  ];

  const currentQ = speedQuestions[drillIndex];

  useEffect(() => {
    let timer: any = null;
    if (activeTabQA === 'drill' && !selectedOpt && drillTimer > 0) {
      timer = setInterval(() => setDrillTimer((t) => Math.max(t - 1, 0)), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeTabQA, selectedOpt, drillTimer]);

  const handleSelect = (idx: number) => {
    const letter = String.fromCharCode(65 + idx);
    setSelectedOpt(letter);
    if (letter === currentQ.ans) {
      setScore((s) => s + 1);
      sounds.playSuccess();
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setDrillTimer(45);
    setDrillIndex((i) => (i + 1) % speedQuestions.length);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Paper 3: Quantitative Aptitude
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              Target &lt;45s/MCQ
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">QA SPEED DRILLS & FORMULAS</h2>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTabQA('drill')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabQA === 'drill' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Speed Drill
          </button>
          <button
            onClick={() => setActiveTabQA('formulas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabQA === 'formulas' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Formula Bank
          </button>
          <button
            onClick={() => setActiveTabQA('shortcuts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabQA === 'shortcuts' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Calculator Tricks
          </button>
        </div>
      </div>

      {activeTabQA === 'drill' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-800/50 shadow-2xl text-white space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">
              Drill #{drillIndex + 1} • Score: {score}/{speedQuestions.length}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{drillTimer}s Left</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold leading-relaxed">{currentQ.q}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.opts.map((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const isSelected = selectedOpt === letter;
              const isCorrect = currentQ.ans === letter;

              let style = 'bg-slate-800/80 border-slate-700 hover:border-emerald-500';
              if (selectedOpt) {
                if (isCorrect) style = 'bg-emerald-600 border-emerald-500 text-white font-bold';
                else if (isSelected) style = 'bg-rose-600 border-rose-500 text-white font-bold';
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => !selectedOpt && handleSelect(oIdx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center font-mono font-bold text-xs">
                    {letter}
                  </span>
                  <span className="text-xs font-semibold">{opt}</span>
                </div>
              );
            })}
          </div>

          {selectedOpt && (
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 leading-relaxed animate-fade-in">
              <strong className="text-emerald-400 block mb-1">Shortcut & Explanation:</strong>
              {currentQ.exp}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Next Speed Question →
            </button>
          </div>
        </div>
      )}

      {activeTabQA === 'formulas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              Time Value of Money (TVM)
            </span>
            <ul className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
              <li>• CI Amount: A = P(1 + i)^n</li>
              <li>• Effective Rate: E = (1 + i/m)^m - 1</li>
              <li>• PV of Annuity Regular: P = (A / i) × [1 - (1+i)^-n]</li>
              <li>• FV of Annuity Regular: A_n = (A / i) × [(1+i)^n - 1]</li>
              <li>• Perpetuity: PV = Cash Flow / i</li>
            </ul>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
            <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
              Statistics & Dispersion
            </span>
            <ul className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
              <li>• Change of Scale: SD_y = |b| × SD_x</li>
              <li>• Combined Variance: σ^2 = (n1*σ1^2 + n2*σ2^2 + n1*d1^2 + n2*d2^2)/(n1+n2)</li>
              <li>• Coefficient of Variation (CV) = (SD / Mean) × 100</li>
              <li>• Regression: b_yx × b_xy = r^2</li>
              <li>• Fisher Ideal Index: √(Laspeyres × Paasche)</li>
            </ul>
          </div>
        </div>
      )}

      {activeTabQA === 'shortcuts' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Citizen / Standard Calculator Shortcuts for CA Foundation:
          </h3>
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>1. Power Calculation (e.g. 1.08^5):</strong> Type 1.08, press [×], then press [=] 4 times (n-1 times).
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>2. Negative Power (e.g. 1.08^-5):</strong> Type 1.08, press [÷], then press [=] 5 times (n times).
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>3. Present Value of Annuity:</strong> Type [1.08], press [÷], press [=] n times, press [GT] or [M+] memory recall.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
