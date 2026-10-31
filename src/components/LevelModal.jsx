import React, { useState } from 'react';
import { X, Trophy, Lock, Star, Sparkles } from 'lucide-react';
import { getWordLengthForLevel } from '../utils/words';

function getRankTitle(level) {
  if (level <= 5) return 'Novice Apprentice';
  if (level <= 15) return 'Word Finder';
  if (level <= 35) return 'Puzzle Solver';
  if (level <= 65) return 'Lexicon Master';
  if (level <= 90) return 'Word Champion';
  return 'Mythic Grandmaster';
}

export default function LevelModal({
  isOpen,
  onClose,
  levelProgress,
  onSelectLevel,
}) {
  const [tierFilter, setTierFilter] = useState('all');

  if (!isOpen) return null;

  const currentLevel = levelProgress?.currentLevel || 1;
  const maxUnlocked = levelProgress?.maxUnlockedLevel || 1;
  const starsMap = levelProgress?.stars || {};
  const totalStars = Object.values(starsMap).reduce((a, b) => a + b, 0);
  const totalXP = levelProgress?.totalXP || 0;

  // 100 levels
  const totalLevels = 100;
  const levelsList = [];
  for (let i = 1; i <= totalLevels; i++) {
    levelsList.push(i);
  }

  const filteredLevels = levelsList.filter(lvl => {
    const len = getWordLengthForLevel(lvl);
    if (tierFilter === '4') return len === 4;
    if (tierFilter === '5') return len === 5;
    if (tierFilter === '6') return len === 6;
    if (tierFilter === '7') return len === 7;
    if (tierFilter === '8') return len === 8;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-letter-pop">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-lg sm:text-xl tracking-wider">
              LEVEL JOURNEY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Profile & Rank Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-zinc-950 dark:to-zinc-950 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Rank: {getRankTitle(currentLevel)}
            </span>
            <span className="text-xl font-black text-zinc-900 dark:text-white">
              Level {currentLevel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Stars</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-300">
                ⭐ {totalStars}
              </span>
            </div>
            <div className="h-7 w-[1px] bg-zinc-300 dark:bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total XP</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {totalXP}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tiers */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', label: 'All Levels' },
            { id: '4', label: 'Tier 1 (4L)' },
            { id: '5', label: 'Tier 2 (5L)' },
            { id: '6', label: 'Tier 3 (6L)' },
            { id: '7', label: 'Tier 4 (7L)' },
            { id: '8', label: 'Tier 5 (8L)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTierFilter(tab.id)}
              className={`flex-1 whitespace-nowrap px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tierFilter === tab.id
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 gap-2.5 py-1">
          {filteredLevels.map(lvl => {
            const isUnlocked = lvl <= maxUnlocked;
            const isCurrent = lvl === currentLevel;
            const stars = starsMap[lvl] || 0;
            const len = getWordLengthForLevel(lvl);

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all relative aspect-square cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/50 shadow-md shadow-amber-500/10'
                    : isUnlocked
                    ? 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950/80 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'
                    : 'bg-zinc-100/50 dark:bg-zinc-950/30 border-zinc-200/50 dark:border-zinc-900 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Level Length indicator tag */}
                <span className="text-[9px] font-bold text-zinc-500 uppercase">
                  {len}L
                </span>

                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <span className={`text-base font-black ${isCurrent ? 'text-amber-600 dark:text-amber-300 scale-110' : 'text-zinc-900 dark:text-white'}`}>
                    {lvl}
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-600 my-auto" />
                )}

                {/* Star Rating display */}
                <div className="flex gap-0.5 text-[10px]">
                  {isUnlocked ? (
                    [1, 2, 3].map(s => (
                      <span
                        key={s}
                        className={s <= stars ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-700'}
                      >
                        ★
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">Locked</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
