import React, { useState, useEffect } from 'react';
import { X, Volume2, BookOpen, Loader2, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { fetchWordDefinition } from '../utils/words';

export default function DefinitionModal({ isOpen, onClose, word }) {
  const [loading, setLoading] = useState(true);
  const [definitionData, setDefinitionData] = useState(null);

  // Support ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !word) return;

    let isMounted = true;
    setLoading(true);

    fetchWordDefinition(word).then(data => {
      if (isMounted) {
        setDefinitionData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, word]);

  if (!isOpen) return null;

  const playAudio = () => {
    if (definitionData?.audio) {
      const audio = new Audio(definitionData.audio);
      audio.play().catch(() => {});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="definition-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-modal-backdrop select-none"
    >
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-hidden animate-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <h2 id="definition-modal-title" className="font-extrabold text-base sm:text-lg tracking-wider">
              WORD DICTIONARY
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

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
            <span className="text-sm font-medium">Looking up definition...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
            {/* Word & Phonetics */}
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                  {definitionData?.word || word}
                </span>
                {definitionData?.phonetic && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                    {definitionData.phonetic}
                  </span>
                )}
              </div>

              {definitionData?.audio && (
                <button
                  onClick={playAudio}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sky-600 dark:text-sky-400 transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-sm"
                  title="Pronounce word"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Meanings or Fallback State */}
            {!definitionData?.meanings || definitionData.meanings.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center gap-2.5 my-2">
                <HelpCircle className="w-8 h-8 text-amber-500 mb-0.5" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  No public definition indexed
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                  "{word}" is an accepted valid word in the Wordle dictionary, but detailed definitions are not available via the public dictionary service.
                </p>
                <a
                  href={`https://www.google.com/search?q=define+${encodeURIComponent(word)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Search definition on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {definitionData.meanings.map((meaning, index) => (
                  <div
                    key={index}
                    className="bg-zinc-50/80 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-2"
                  >
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider italic">
                      {meaning.partOfSpeech}
                    </span>

                    <div className="flex flex-col gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                      {meaning.definitions.map((def, dIdx) => (
                        <div key={dIdx} className="flex flex-col gap-0.5">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span className="leading-relaxed">{def.definition}</span>
                          </div>
                          {def.example && (
                            <span className="text-xs text-zinc-500 italic pl-4">
                              "{def.example}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                        <span className="text-zinc-500 font-medium">Synonyms:</span>
                        {meaning.synonyms.map((syn, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-medium"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
