import React from 'react';
import { Delete } from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audio';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export default function Keyboard({
  onKey,
  onEnter,
  onBackspace,
  keyStatuses = {},
  disabled = false,
  gameStatus = 'IN_PROGRESS',
  mode = 'unlimited',
  settings,
}) {
  const isDark = settings?.darkMode !== false;
  const isHC = settings?.highContrast;
  const isGameOver = gameStatus !== 'IN_PROGRESS';

  const handleKeyClick = (key) => {
    // If the game is over and player taps ENTER / PLAY AGAIN:
    if (isGameOver && key === 'ENTER') {
      if (settings?.hapticsEnabled !== false) {
        triggerHaptic('light');
      }
      soundEngine.playKey();
      onEnter();
      return;
    }

    if (disabled) return;

    if (settings?.hapticsEnabled !== false) {
      triggerHaptic('light');
    }

    if (key === 'ENTER') {
      soundEngine.playKey();
      onEnter();
    } else if (key === 'BACKSPACE') {
      soundEngine.playBackspace();
      onBackspace();
    } else {
      soundEngine.playKey();
      onKey(key);
    }
  };

  const getKeyColor = (key) => {
    const status = keyStatuses[key];

    if (status === 'correct') {
      return isHC
        ? 'bg-[#f5793a] text-white hover:bg-[#e06828]'
        : isDark
        ? 'bg-[#538d4e] text-white hover:bg-[#477a43]'
        : 'bg-[#6aaa64] text-white hover:bg-[#5b9456]';
    }

    if (status === 'present') {
      return isHC
        ? 'bg-[#85c0f9] text-black hover:bg-[#72b1ee]'
        : isDark
        ? 'bg-[#b59f3b] text-white hover:bg-[#9d8a32]'
        : 'bg-[#c9b458] text-white hover:bg-[#b5a24b]';
    }

    if (status === 'absent') {
      return isDark
        ? 'bg-[#3a3a3c] text-white hover:bg-[#454547]'
        : 'bg-[#787c7e] text-white hover:bg-[#6c7072]';
    }

    // Default untested key
    return isDark
      ? 'bg-[#818384] text-white hover:bg-[#999b9c]'
      : 'bg-[#d3d6da] text-zinc-900 hover:bg-[#c4c7cb]';
  };

  return (
    <div
      role="group"
      aria-label="Virtual keyboard"
      className="w-full max-w-[500px] mx-auto px-1 sm:px-2 select-none safe-bottom flex flex-col gap-1.5 sm:gap-2 pb-2"
    >
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const isEnterKey = key === 'ENTER';
            const isButtonDisabled = disabled && !(isGameOver && isEnterKey);
            const colorClass = getKeyColor(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyClick(key)}
                disabled={isButtonDisabled}
                aria-label={key === 'BACKSPACE' ? 'Backspace' : key === 'ENTER' ? (isGameOver ? 'Play Again' : 'Enter') : key}
                className={`h-12 sm:h-14 rounded-[4px] font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-colors duration-250 key-touch touch-manipulation cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                  isSpecial ? 'flex-[1.5] text-[10px] sm:text-xs tracking-wider' : 'flex-1'
                } ${
                  isGameOver && isEnterKey && mode !== 'daily'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black animate-pulse'
                    : colorClass
                } ${isButtonDisabled ? 'cursor-not-allowed opacity-80' : ''}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : isEnterKey ? (
                  isGameOver && mode !== 'daily' ? 'NEXT ➔' : 'ENTER'
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}