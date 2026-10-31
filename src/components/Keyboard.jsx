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
  settings,
}) {
  const isDark = settings?.darkMode !== false;
  const isHC = settings?.highContrast;

  const handleKeyClick = (key) => {
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
        ? 'bg-[#538d4e] text-white hover:bg-[#467842]'
        : 'bg-[#6aaa64] text-white hover:bg-[#5b9556]';
    }

    if (status === 'present') {
      return isHC
        ? 'bg-[#85c0f9] text-black hover:bg-[#70aee8]'
        : isDark
        ? 'bg-[#b59f3b] text-white hover:bg-[#9d8a32]'
        : 'bg-[#c9b458] text-white hover:bg-[#b09d4c]';
    }

    if (status === 'absent') {
      return isDark
        ? 'bg-[#3a3a3c] text-zinc-400 opacity-60'
        : 'bg-[#787c7e] text-zinc-200 opacity-70';
    }

    // Default key color
    return isDark
      ? 'bg-[#818384] text-white hover:bg-[#999b9c]'
      : 'bg-[#d3d6da] text-zinc-900 hover:bg-[#c2c5c9]';
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-1 sm:px-2 select-none safe-bottom flex flex-col gap-1.5 sm:gap-2 pb-2">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const colorClass = getKeyColor(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                aria-label={key === 'BACKSPACE' ? 'Backspace' : key}
                className={`h-11 sm:h-14 rounded-md font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-all active:scale-95 duration-100 touch-manipulation shadow-sm cursor-pointer ${
                  isSpecial ? 'flex-[1.5] text-[10px] sm:text-xs tracking-wider' : 'flex-1'
                } ${colorClass} ${disabled ? 'cursor-not-allowed opacity-80' : ''}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : key === 'ENTER' ? (
                  'ENTER'
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
