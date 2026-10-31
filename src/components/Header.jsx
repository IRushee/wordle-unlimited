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
  Layers,
  Infinity as InfinityIcon,
  Timer,
  Sun,
  Moon
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
    <header className="w-full flex flex-col border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Navbar Row */}
      <div className="flex items-center justify-between px-3 sm:px-6 h-12 sm:h-14 max-w-4xl w-full mx-auto">
        {/* Left Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="How to play"
            title="How to play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onUpdateSetting('darkMode', !isDark)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 hover:text-indigo-700" />
            )}
          </button>

          {/* Desktop Mode Switcher Tabs */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold ml-2">
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-black text-xl sm:text-2xl tracking-wider text-zinc-900 dark:text-white">
            WORDLE
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            {mode}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {mode === 'levels' && (
            <button
              type="button"
              onClick={onOpenLevels}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Level Map & Roadmap"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Map</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHistory}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="History log"
            title="History log"
          >
            <History className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Statistics"
            title="Statistics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Row */}
      <div className="flex md:hidden items-center justify-center bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800/50 py-1 px-2 text-xs font-semibold gap-1">
        <button
          onClick={() => setMode('unlimited')}
          className={`flex-1 py-1 rounded text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
            mode === 'unlimited'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <InfinityIcon className="w-3 h-3" />
          Unlimited
        </button>
        <button
          onClick={() => setMode('levels')}
          className={`flex-1 py-1 rounded text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
            mode === 'levels'
              ? 'bg-amber-600 text-white font-bold'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Trophy className="w-3 h-3" />
          Levels
        </button>
        <button
          onClick={() => setMode('daily')}
          className={`flex-1 py-1 rounded text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
            mode === 'daily'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Calendar className="w-3 h-3" />
          Daily
        </button>
      </div>

      {/* Sub-bar: Length Selector / Level Status / Timer */}
      <div className="w-full bg-zinc-100/90 dark:bg-zinc-950/70 border-t border-zinc-200 dark:border-zinc-800/50 px-3 py-1.5 flex items-center justify-between text-xs">
        {mode === 'levels' ? (
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-1 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Level {levelInfo?.currentLevel || 1}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                ({wordLength} Letters)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-bold">
                <span>⭐ {levelInfo?.totalStars || 0}</span>
              </div>
              <button
                onClick={onOpenLevels}
                className="text-amber-600 dark:text-amber-400 underline hover:opacity-80 font-semibold cursor-pointer"
              >
                Change Level
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-1 sm:px-4">
            {/* Word Length Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium hidden sm:inline">Length:</span>
              <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {[4, 5, 6, 7, 8].map((len) => (
                  <button
                    key={len}
                    onClick={() => setWordLength(len)}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      wordLength === len
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {len}L
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions / Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {settings?.timeAttack && timeLeft !== null && (
                <div className={`flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded ${
                  timeLeft <= 10
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              )}

              {gameStatus === 'IN_PROGRESS' && onHint && (
                <button
                  type="button"
                  onClick={onHint}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all text-xs font-bold border border-amber-500/20 cursor-pointer shadow-sm active:scale-95"
                  title="Need a hint?"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Hint</span>
                </button>
              )}

              <button
                type="button"
                onClick={onNewGame}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all text-xs font-bold border border-zinc-200 dark:border-zinc-700/60 cursor-pointer shadow-sm active:scale-95"
                title="Start a new random word"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>New Word</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
