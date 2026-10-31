import React, { useState, useEffect } from 'react';
import { X, Volume2, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { fetchWordDefinition } from '../utils/words';

export default function DefinitionModal({ isOpen, onClose, word }) {
  const [loading, setLoading] = useState(true);
  const [definitionData, setDefinitionData] = useState(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-letter-pop">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-5 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <h2 className="font-extrabold text-lg sm:text-xl tracking-wider">
              WORD DICTIONARY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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

            {/* Meanings */}
            <div className="flex flex-col gap-3">
              {definitionData?.meanings?.map((meaning, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
