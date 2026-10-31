import React from 'react';
import { X, History, CheckCircle2, XCircle, BookOpen, Clock } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  onOpenDefinition,
}) {
  // Support ESC key to close modal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-modal-backdrop select-none"
    >
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-4 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-hidden animate-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 id="history-modal-title" className="font-extrabold text-base sm:text-lg tracking-wider">
              GAME HISTORY
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

        {/* List of past games */}
        {(!history || history.length === 0) ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            No games recorded yet. Play a game to build your history!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
            {history.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-3 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {item.won ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base tracking-wider text-zinc-900 dark:text-white">
                          {item.word}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {item.length}L
                        </span>
                        {item.level && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Lvl {item.level}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {formattedDate} • {item.won ? `${item.guessesCount} guesses` : 'Failed'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDefinition(item.word)}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm"
                    title="View word definition"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
