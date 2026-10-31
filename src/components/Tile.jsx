import React, { useState, useEffect } from 'react';

export default function Tile({
  letter,
  status = 'empty', // 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  colIndex = 0,
  isRevealing = false,
  isBouncing = false,
  settings,
}) {
  // animationStage: 'idle' | 'flipping-down' | 'flipping-up'
  const [animationStage, setAnimationStage] = useState('idle');
  const [revealed, setRevealed] = useState(
    status === 'correct' || status === 'present' || status === 'absent'
  );

  useEffect(() => {
    if (isRevealing) {
      const startDelay = colIndex * 300; // 300ms stagger between cells
      const switchColorDelay = startDelay + 250; // halfway through the flip
      const endFlipDelay = startDelay + 500; // flip complete

      // 1. Start Phase 1: fold up to 90deg
      const timer1 = setTimeout(() => {
        setAnimationStage('flipping-down');
      }, startDelay);

      // 2. Switch color at 90deg and start unfolding
      const timer2 = setTimeout(() => {
        setRevealed(true);
        setAnimationStage('flipping-up');
      }, switchColorDelay);

      // 3. Complete flip
      const timer3 = setTimeout(() => {
        setAnimationStage('idle');
      }, endFlipDelay);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      if (status === 'correct' || status === 'present' || status === 'absent') {
        setRevealed(true);
      } else {
        setRevealed(false);
      }
      setAnimationStage('idle');
    }
  }, [isRevealing, colIndex, status]);

  const isDark = settings?.darkMode !== false;
  const isHC = settings?.highContrast;

  // Clue color styles (NYT authentic colors)
  const getRevealedClasses = () => {
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

  // Pre-reveal border & fill
  const getPreRevealClasses = () => {
    if (letter) {
      return isDark
        ? 'border-[#565758] text-white bg-transparent animate-pop'
        : 'border-[#878a8c] text-zinc-900 bg-white animate-pop';
    }
    return isDark
      ? 'border-[#3a3a3c] text-white bg-transparent'
      : 'border-[#d3d6da] text-zinc-900 bg-white';
  };

  // Select flip animation class based on stage
  const getFlipClass = () => {
    if (animationStage === 'flipping-down') return 'flip-phase-1';
    if (animationStage === 'flipping-up') return 'flip-phase-2';
    return '';
  };

  return (
    <div
      className={`relative aspect-square flex items-center justify-center font-extrabold select-none text-xl sm:text-2xl md:text-3xl rounded-[3px] sm:rounded-[4px] border-2 transition-colors duration-100 ${
        revealed ? getRevealedClasses() : getPreRevealClasses()
      } ${getFlipClass()} ${isBouncing ? 'animate-win-bounce' : ''}`}
      style={{
        animationDelay: isBouncing ? `${colIndex * 100}ms` : undefined,
        perspective: '1000px',
        willChange: 'transform',
      }}
    >
      <span className="leading-none transform-gpu uppercase tracking-wide">
        {letter || ''}
      </span>
    </div>
  );
}
