import React, { useState, useEffect } from 'react';

export default function Tile({
  letter,
  status = 'empty', // 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  colIndex = 0,
  isRevealing = false,
  isBouncing = false,
  settings,
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        setFlipped(true);
      }, colIndex * 250);
      return () => clearTimeout(timer);
    } else if (status === 'correct' || status === 'present' || status === 'absent') {
      setFlipped(true);
    } else {
      setFlipped(false);
    }
  }, [isRevealing, colIndex, status]);

  // Color mappings
  const getRevealedColorClasses = () => {
    const isHC = settings?.highContrast;
    const isDark = settings?.darkMode !== false;

    if (status === 'correct') {
      return isHC
        ? 'bg-[#f5793a] text-white border-[#f5793a]'
        : isDark
        ? 'bg-[#538d4e] text-white border-[#538d4e]'
        : 'bg-[#6aaa64] text-white border-[#6aaa64]';
    }

    if (status === 'present') {
      return isHC
        ? 'bg-[#85c0f9] text-black border-[#85c0f9]'
        : isDark
        ? 'bg-[#b59f3b] text-white border-[#b59f3b]'
        : 'bg-[#c9b458] text-white border-[#c9b458]';
    }

    if (status === 'absent') {
      return isDark
        ? 'bg-[#3a3a3c] text-white border-[#3a3a3c]'
        : 'bg-[#787c7e] text-white border-[#787c7e]';
    }

    return '';
  };

  const isDark = settings?.darkMode !== false;

  // Unflipped / current state border & background
  const getPreRevealStyle = () => {
    if (letter) {
      return isDark
        ? 'border-zinc-500 text-white bg-zinc-900/40 animate-letter-pop'
        : 'border-zinc-700 text-zinc-900 bg-white animate-letter-pop';
    }
    return isDark
      ? 'border-[#3a3a3c] text-white bg-transparent'
      : 'border-zinc-300 text-zinc-900 bg-white';
  };

  return (
    <div
      className={`relative select-none aspect-square flex items-center justify-center font-bold text-lg sm:text-2xl md:text-3xl rounded-sm sm:rounded-md transition-all duration-150 tile-flip-container ${
        isBouncing ? 'animate-win-bounce' : ''
      }`}
      style={{
        animationDelay: isBouncing ? `${colIndex * 100}ms` : undefined,
        perspective: '1000px',
      }}
    >
      <div
        className={`w-full h-full flex items-center justify-center border-2 uppercase font-extrabold transition-transform duration-500 transform-gpu ${
          flipped
            ? `${getRevealedColorClasses()} rotate-x-0`
            : `${getPreRevealStyle()} ${isRevealing ? 'rotate-x-90' : 'rotate-x-0'}`
        }`}
        style={{
          transitionDelay: isRevealing ? `${colIndex * 250}ms` : '0ms',
        }}
      >
        {letter || ''}
      </div>
    </div>
  );
}
