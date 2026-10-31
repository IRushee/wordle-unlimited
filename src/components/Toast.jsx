import React from 'react';
import { ShieldAlert, AlertCircle, Sparkles, CheckCircle2, Info } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  // Display only the latest/active toast (Wordle signature behavior: never stacks)
  const activeToast = toasts[toasts.length - 1];

  const getIcon = () => {
    switch (activeToast.type) {
      case 'hard-mode':
        return <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'hint':
        return <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />;
      case 'game-over':
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[104px] sm:top-[116px] left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 select-none"
    >
      <div
        key={activeToast.id + (activeToast.shakeCount || 0)}
        onClick={() => onDismiss && onDismiss(activeToast.id)}
        className={`pointer-events-auto cursor-pointer max-w-[92vw] px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-wide shadow-2xl transition-all flex items-center gap-2 border ${
          activeToast.shake ? 'animate-toast-shake' : 'animate-toast'
        } ${
          // Authentic Wordle High-Contrast Inverted Pill
          'bg-zinc-900 text-white border-zinc-800 shadow-zinc-950/40 dark:bg-white dark:text-zinc-950 dark:border-zinc-200 dark:shadow-black/70'
        }`}
        title="Click to dismiss"
      >
        {getIcon()}
        <span>{activeToast.message}</span>
      </div>
    </div>
  );
}