import React, { useState } from 'react';
import { X, Share2, Flame, Award, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../utils/audio';

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  gameStatus,
  solution,
  guesses,
  results,
  wordLength,
  mode,
  level,
  onNextWord,
  onOpenDefinition,
  showToast,
  settings,
}) {
  const [selectedTab, setSelectedTab] = useState('all');

  if (!isOpen) return null;

  const currentStats = stats[selectedTab] || stats.all;
  const winPercent = currentStats.played > 0
    ? Math.round((currentStats.wins / currentStats.played) * 100)
    : 0;

  // Max count in distribution for proportional bars
  const distValues = Object.values(currentStats.distribution || {});
  const maxDist = Math.max(...distValues, 1);

  const handleShare = async () => {
    if (guesses.length === 0) return;

    const isHC = settings?.highContrast;
    const greenEmoji = isHC ? '🟧' : '🟩';
    const yellowEmoji = isHC ? '🟦' : '🟨';
    const darkEmoji = '⬛';

    const header = mode === 'levels'
      ? `Wordle Journey • Level ${level} (${wordLength}L)`
      : mode === 'daily'
      ? `Wordle Daily • (${wordLength}L)`
      : `Wordle Unlimited • (${wordLength}L)`;

    const scoreLine = `${gameStatus === 'WON' ? guesses.length : 'X'}/${wordLength <= 6 ? 6 : wordLength === 7 ? 7 : 8}${settings?.hardMode ? '*' : ''}`;

    const grid = results.map(row => {
      return row.map(res => {
        if (res === 'correct') return greenEmoji;
        if (res === 'present') return yellowEmoji;
        return darkEmoji;
      }).join('');
    }).join('\n');

    const shareText = `${header} ${scoreLine}\n\n${grid}\n\nPlay at Wordle Unlimited`;

    // Try Native Web Share API first (on iOS/Android/Safari)
    if (navigator.share) {
      try {
        await navigator.share({
          title: header,
          text: shareText,
        });
        triggerHaptic('light');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Copied result to clipboard!', 'success');
        triggerHaptic('light');
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-letter-pop">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-5 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-5 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-extrabold text-lg sm:text-xl tracking-wider">
            STATISTICS & SCORESHEET
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Length selector tabs */}
        <div className="flex items-center justify-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
          {['all', '4', '5', '6', '7', '8'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                selectedTab === tab
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab === 'all' ? 'All' : `${tab}L`}
            </button>
          ))}
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-zinc-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{currentStats.played}</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">Played</span>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{winPercent}%</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">Win %</span>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col items-center">
            <div className="flex items-center gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">{currentStats.currentStreak}</span>
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">Streak</span>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col items-center">
            <div className="flex items-center gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">{currentStats.maxStreak}</span>
              <Award className="w-3.5 h-3.5 text-purple-500 inline" />
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">Max</span>
          </div>
        </div>

        {/* Guess Distribution */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Guess Distribution
          </h3>
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            {Object.keys(currentStats.distribution || {}).map(numStr => {
              const num = parseInt(numStr, 10);
              const count = currentStats.distribution[num] || 0;
              const pct = maxDist > 0 ? (count / maxDist) * 100 : 0;
              const isCurrentGameGuess = gameStatus === 'WON' && guesses.length === num;

              return (
                <div key={num} className="flex items-center gap-2">
                  <span className="w-3 font-bold text-right text-zinc-500 dark:text-zinc-400">{num}</span>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 rounded overflow-hidden h-5 flex items-center p-0.5 border border-zinc-200 dark:border-zinc-800/60">
                    <div
                      className={`h-full rounded px-2 flex items-center justify-end font-bold text-[11px] transition-all duration-500 ${
                        isCurrentGameGuess
                          ? 'bg-emerald-500 text-white font-black'
                          : count > 0
                          ? 'bg-zinc-500 dark:bg-zinc-700 text-white'
                          : 'bg-transparent text-zinc-400 dark:text-zinc-500 justify-start'
                      }`}
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 4)}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* End of game banner / actions */}
        {(gameStatus === 'WON' || gameStatus === 'LOST') && (
          <div className="flex flex-col gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Secret Word:</span>
                <span className="text-lg font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                  {solution}
                </span>
              </div>
              <button
                onClick={() => onOpenDefinition(solution)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                Definition
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700 active:scale-95 shadow-sm"
              >
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Share Score
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNextWord();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 active:scale-95 text-white"
              >
                <span>Next Word</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
