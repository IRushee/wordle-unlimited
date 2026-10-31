import React from 'react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2.5 rounded-lg font-bold text-sm shadow-xl transition-all duration-200 animate-letter-pop pointer-events-auto ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border border-rose-400/30'
              : toast.type === 'success'
              ? 'bg-emerald-600 text-white border border-emerald-400/30'
              : 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 dark:bg-zinc-100 dark:text-zinc-900'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
