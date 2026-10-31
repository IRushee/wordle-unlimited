import React from 'react';
import Tile from './Tile';

export default function Board({
  wordLength,
  maxGuesses,
  guesses,
  results,
  currentGuess,
  currentRow,
  shakeRowIndex,
  revealingRowIndex,
  winningRowIndex,
  settings,
}) {
  const rows = [];

  for (let r = 0; r < maxGuesses; r++) {
    const isSubmitted = r < guesses.length;
    const isCurrent = r === currentRow;
    const isShaking = shakeRowIndex === r;
    const isRevealing = revealingRowIndex === r;
    const isBouncing = winningRowIndex === r;

    let rowLetters = [];
    let rowResults = [];

    if (isSubmitted) {
      rowLetters = guesses[r].split('');
      rowResults = results[r] || [];
    } else if (isCurrent) {
      rowLetters = currentGuess.split('');
    }

    const tiles = [];
    for (let c = 0; c < wordLength; c++) {
      const letter = rowLetters[c] || '';
      let status = 'empty';
      if (isSubmitted) {
        status = rowResults[c] || 'absent';
      } else if (letter) {
        status = 'tbd';
      }

      tiles.push(
        <Tile
          key={c}
          colIndex={c}
          letter={letter}
          status={status}
          isRevealing={isRevealing}
          isBouncing={isBouncing}
          settings={settings}
        />
      );
    }

    rows.push(
      <div
        key={r}
        className={`grid gap-1 sm:gap-1.5 w-full ${isShaking ? 'animate-shake-row' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
        }}
      >
        {tiles}
      </div>
    );
  }

  // Adjust max width based on word length so tiles don't get awkwardly stretched
  const getMaxWidthClass = () => {
    switch (wordLength) {
      case 4: return 'max-w-[260px] sm:max-w-[280px]';
      case 5: return 'max-w-[310px] sm:max-w-[340px]';
      case 6: return 'max-w-[360px] sm:max-w-[390px]';
      case 7: return 'max-w-[400px] sm:max-w-[430px]';
      case 8: return 'max-w-[440px] sm:max-w-[470px]';
      default: return 'max-w-[340px]';
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-2 w-full min-h-0 overflow-hidden">
      <div className={`w-full ${getMaxWidthClass()} flex flex-col gap-1 sm:gap-1.5 transition-all duration-300`}>
        {rows}
      </div>
    </div>
  );
}
