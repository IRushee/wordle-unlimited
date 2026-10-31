import React from 'react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none select-none max-w-[90vw]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg font-extrabold text-xs sm:text-sm shadow-xl transition-all duration-200 animate-toast pointer-events-auto tracking-wide ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border border-rose-400/40 shadow-rose-950/20'
              : toast.type === 'success'
              ? 'bg-emerald-600 text-white border border-emerald-400/40 shadow-emerald-950/20'
              : 'bg-zinc-900 text-white border border-zinc-700/80 dark:bg-zinc-100 dark:text-zinc-900 shadow-zinc-950/30'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}