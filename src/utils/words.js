import wordsData from '../data/words.json';

// Pre-create Sets for fast O(1) membership checks
const allowedSets = {};
const targetsCache = {};

for (const length of [4, 5, 6, 7, 8]) {
  const lenStr = String(length);
  const data = wordsData[lenStr] || { targets: [], allowed: [] };
  allowedSets[length] = new Set(data.allowed.map(w => w.toLowerCase()));
  targetsCache[length] = data.targets.map(w => w.toLowerCase());
}

// Simple deterministic PRNG (Linear Congruential Generator / Mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}

export function getWordLengthForLevel(level) {
  if (level <= 10) return 4;
  if (level <= 35) return 5;
  if (level <= 65) return 6;
  if (level <= 90) return 7;
  return 8;
}

export function getMaxGuesses(length) {
  if (length <= 6) return 6;
  if (length === 7) return 7;
  return 8;
}

export function getRandomWord(length = 5) {
  const targets = targetsCache[length] || targetsCache[5];
  const index = Math.floor(Math.random() * targets.length);
  return targets[index].toUpperCase();
}

export function getLevelWord(level) {
  const length = getWordLengthForLevel(level);
  const targets = targetsCache[length];
  // Seed with level number plus salt for fun distribution
  const rng = mulberry32(level * 7919 + 1013);
  const index = Math.floor(rng() * targets.length);
  return {
    word: targets[index].toUpperCase(),
    length,
    maxGuesses: getMaxGuesses(length),
  };
}

export function getDailyWord(length = 5, dateStr = new Date().toISOString().slice(0, 10)) {
  const targets = targetsCache[length] || targetsCache[5];
  const seed = stringToSeed(`${dateStr}-len-${length}`);
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * targets.length);
  return targets[index].toUpperCase();
}

export function isValidWord(word, length, strictMode = true) {
  const clean = word.toLowerCase().trim();
  if (clean.length !== length) return false;
  if (!strictMode) return /^[a-z]+$/i.test(clean);
  
  const set = allowedSets[length];
  if (!set) return false;
  return set.has(clean);
}

export function evaluateGuess(guess, solution) {
  const len = solution.length;
  const result = new Array(len).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');
  
  const letterCounts = {};
  for (let i = 0; i < len; i++) {
    const char = solutionChars[i];
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }
  
  // Pass 1: find exact matches (correct)
  for (let i = 0; i < len; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      letterCounts[guessChars[i]]--;
    }
  }
  
  // Pass 2: find present matches (present)
  for (let i = 0; i < len; i++) {
    if (result[i] !== 'correct') {
      const char = guessChars[i];
      if (letterCounts[char] > 0) {
        result[i] = 'present';
        letterCounts[char]--;
      }
    }
  }
  
  return result;
}

export function validateHardMode(currentGuess, previousGuesses, previousResults) {
  if (!previousGuesses || previousGuesses.length === 0) return { valid: true };
  
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  
  // Rule 1: Every correct (green) letter from ANY previous guess must stay in the same position
  for (let r = 0; r < previousGuesses.length; r++) {
    const guess = previousGuesses[r];
    const res = previousResults[r] || [];

    for (let i = 0; i < res.length; i++) {
      if (res[i] === 'correct') {
        const requiredChar = guess[i];
        if (currentGuess[i] !== requiredChar) {
          return {
            valid: false,
            message: `${ordinals[i] || `${i + 1}th`} letter must be ${requiredChar}`,
            rule: 'hard-mode-position',
          };
        }
      }
    }
  }
  
  // Rule 2: Every present (yellow) letter from ANY previous guess must be used in the current guess
  for (let r = 0; r < previousGuesses.length; r++) {
    const guess = previousGuesses[r];
    const res = previousResults[r] || [];

    for (let i = 0; i < res.length; i++) {
      if (res[i] === 'present') {
        const requiredChar = guess[i];
        if (!currentGuess.includes(requiredChar)) {
          return {
            valid: false,
            message: `Guess must contain ${requiredChar}`,
            rule: 'hard-mode-include',
          };
        }
      }
    }
  }
  
  return { valid: true };
}

// Definition lookup via free public dictionary API with robust fallback
export async function fetchWordDefinition(word) {
  const cleanWord = word.toLowerCase().trim();
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
    
    const entry = data[0];
    const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics[0]?.text) || '';
    const audio = entry.phonetics?.find(p => p.audio)?.audio || null;
    
    const meanings = (entry.meanings || []).map(m => ({
      partOfSpeech: m.partOfSpeech,
      definitions: (m.definitions || []).slice(0, 2).map(d => ({
        definition: d.definition,
        example: d.example || null,
      })),
      synonyms: (m.synonyms || []).slice(0, 5),
    }));
    
    return {
      word: word.toUpperCase(),
      phonetic,
      audio,
      meanings,
      isFallback: false,
    };
  } catch {
    return {
      word: word.toUpperCase(),
      phonetic: '',
      audio: null,
      meanings: [],
      isFallback: true,
    };
  }
}
