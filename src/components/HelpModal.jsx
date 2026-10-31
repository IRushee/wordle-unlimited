import React, { useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';

export default function HelpModal({ isOpen, onClose, settings }) {
  // Support ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isHC = settings?.highContrast;
  const isDark = settings?.darkMode !== false;

  const correctBg = isHC ? 'bg-[#f5793a]' : isDark ? 'bg-[#538d4e]' : 'bg-[#6aaa64]';
  const presentBg = isHC ? 'bg-[#85c0f9] text-black' : isDark ? 'bg-[#b59f3b]' : 'bg-[#c9b458]';
  const absentBg = isDark ? 'bg-[#3a3a3c]' : 'bg-[#787c7e]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-modal-backdrop select-none"
    >
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto animate-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 id="help-modal-title" className="font-extrabold text-base sm:text-lg tracking-wider">
              HOW TO PLAY
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 flex flex-col gap-2">
          <p>
            Guess the mystery word in a limited number of tries (6 tries for 4–6 letters, 7 for 7 letters, 8 for 8 letters).
          </p>
          <p>
            Each guess must be a valid word. Hit the <span className="font-bold text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">ENTER</span> button to submit.
          </p>
          <p>
            After each guess, the color of the tiles will flip cell-by-cell to show how close your guess was:
          </p>
        </div>

        {/* Visual Examples */}
        <div className="flex flex-col gap-3 py-2 border-y border-zinc-200 dark:border-zinc-800">
          {/* Example 1: Green */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5 font-black text-base sm:text-lg">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${correctBg} text-white flex items-center justify-center rounded font-bold`}>W</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">E</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">A</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">R</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">Y</div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">W</span> is in the word and in the <span className="font-bold text-zinc-900 dark:text-white">correct spot</span>.
            </p>
          </div>

          {/* Example 2: Yellow */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5 font-black text-base sm:text-lg">
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">P</div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${presentBg} text-white flex items-center justify-center rounded font-bold`}>I</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">L</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">O</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">T</div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-amber-600 dark:text-amber-400">I</span> is in the word but in the <span className="font-bold text-zinc-900 dark:text-white">wrong spot</span>.
            </p>
          </div>

          {/* Example 3: Gray */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5 font-black text-base sm:text-lg">
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">V</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">A</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">G</div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${absentBg} text-white flex items-center justify-center rounded font-bold`}>U</div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded font-bold">E</div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">U</span> is <span className="font-bold text-zinc-900 dark:text-white">not in the word</span> in any spot.
            </p>
          </div>
        </div>

        {/* Game Modes Guide */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Game Features
          </h3>
          <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc pl-4">
            <li><strong className="text-emerald-600 dark:text-emerald-400">N-Letter Select:</strong> Play with 4, 5, 6, 7, or 8 letter words with independent scores.</li>
            <li><strong className="text-amber-600 dark:text-amber-400">Level Journey:</strong> Progress through 100+ staged levels from 4L up to 8L words.</li>
            <li><strong className="text-blue-600 dark:text-blue-400">Daily Mode:</strong> A fresh synchronized puzzle every day for every letter length.</li>
            <li><strong className="text-purple-600 dark:text-purple-400">Persistent Memory:</strong> All streaks, stats, and active puzzles persist offline.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}