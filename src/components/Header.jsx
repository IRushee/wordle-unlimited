import React from 'react';
import {
  HelpCircle,
  BarChart2,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Trophy,
  History,
  RotateCcw,
  Sparkles,
  Calendar,
  Infinity as InfinityIcon,
  Timer,
  Sun,
  Moon,
} from 'lucide-react';

export default function Header({
  mode,
  setMode,
  wordLength,
  setWordLength,
  levelInfo,
  onOpenHelp,
  onOpenStats,
  onOpenLevels,
  onOpenHistory,
  onOpenSettings,
  onNewGame,
  onHint,
  soundEnabled,
  toggleSound,
  onUpdateSetting,
  settings,
  timeLeft,
  gameStatus,
}) {
  const isDark = settings?.darkMode !== false;

  return (
    <header className="w-full flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#121213]/95 backdrop-blur-md sticky top-0 z-40 transition-colors select-none">
      {/* Top Navbar Row */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 h-12 sm:h-14 max-w-4xl w-full mx-auto">
        {/* Left Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="How to play"
            title="How to play"
          >
            <HelpCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-zinc-400 dark:text-zinc-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onUpdateSetting('darkMode', !isDark)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-amber-400 hover:text-amber-300" />
            ) : (
              <Moon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-indigo-600 hover:text-indigo-700" />
            )}
          </button>

          {/* Desktop Mode Switcher Tabs */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold ml-2">
            <button
              onClick={() => setMode('unlimited')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                mode === 'unlimited'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              Unlimited
            </button>
            <button
              onClick={() => setMode('levels')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                mode === 'levels'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Levels
            </button>
            <button
              onClick={() => setMode('daily')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                mode === 'daily'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Daily
            </button>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-1.5">
          <span className="font-black text-lg sm:text-2xl tracking-wider text-zinc-900 dark:text-white">
            WORDLE
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1 sm:px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            {mode}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {mode === 'levels' && (
            <button
              type="button"
              onClick={onOpenLevels}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Level Map & Roadmap"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              <span className="hidden sm:inline">Map</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistory}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Game History"
            title="Game History"
          >
            <History className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Scoresheet & Stats"
            title="Scoresheet & Stats"
          >
            <BarChart2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Control Bar: Responsive Sub-Nav */}
      <div className="w-full bg-zinc-50/90 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800/80 px-2 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto gap-2">
          {/* Left Side: Mode Pill on Mobile / Length Selector on Desktop */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Mode Segmented Pill */}
            <div className="flex md:hidden items-center bg-zinc-200/80 dark:bg-zinc-900 p-0.5 rounded-lg text-[11px] font-semibold border border-zinc-300 dark:border-zinc-800">
              <button
                onClick={() => setMode('unlimited')}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-0.5 cursor-pointer ${
                  mode === 'unlimited'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <InfinityIcon className="w-3 h-3" />
                <span>Unl</span>
              </button>
              <button
                onClick={() => setMode('levels')}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-0.5 cursor-pointer ${
                  mode === 'levels'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>Lvl</span>
              </button>
              <button
                onClick={() => setMode('daily')}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-0.5 cursor-pointer ${
                  mode === 'daily'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Day</span>
              </button>
            </div>

            {/* Word Length Selector (when in unlimited mode) */}
            {mode === 'unlimited' && (
              <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                {[4, 5, 6, 7, 8].map((len) => (
                  <button
                    key={len}
                    onClick={() => setWordLength(len)}
                    className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      wordLength === len
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {len}L
                  </button>
                ))}
              </div>
            )}

            {/* Level status indicator (when in levels mode) */}
            {mode === 'levels' && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[11px] sm:text-xs border border-amber-500/20">
                  Lvl {levelInfo?.currentLevel || 1} ({wordLength}L)
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-300">
                  ⭐ {levelInfo?.totalStars || 0}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Quick Actions & Timer */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {settings?.timeAttack && timeLeft !== null && (
              <div
                className={`flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] sm:text-xs ${
                  timeLeft <= 10
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <Timer className="w-3 h-3" />
                <span>{timeLeft}s</span>
              </div>
            )}

            {gameStatus === 'IN_PROGRESS' && onHint && (
              <button
                type="button"
                onClick={onHint}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all text-[11px] sm:text-xs font-bold border border-amber-500/20 cursor-pointer shadow-xs active:scale-95"
                title="Hint"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="hidden sm:inline">Hint</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewGame}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all text-[11px] sm:text-xs font-bold border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="New Word"
            >
              <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>New</span>
              <span className="hidden sm:inline">Word</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}