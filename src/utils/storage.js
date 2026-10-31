// LocalStorage persistence for Wordle Unlimited

const STORAGE_KEYS = {
  SETTINGS: 'wordle_unlimited_settings_v1',
  GAME_STATE: 'wordle_unlimited_game_state_v1',
  STATS: 'wordle_unlimited_stats_v1',
  LEVELS: 'wordle_unlimited_levels_v1',
  HISTORY: 'wordle_unlimited_history_v1',
  LAST_MODE: 'wordle_unlimited_last_mode_v1',
  LAST_LENGTH: 'wordle_unlimited_last_length_v1',
};

const DEFAULT_SETTINGS = {
  hardMode: false,
  darkMode: true,
  highContrast: false,
  soundEnabled: true,
  hapticsEnabled: true,
  strictDictionary: true,
  timeAttack: false,
  timerDuration: 90, // seconds for time attack
  languageVariant: 'indian', // 'indian' (British/Commonwealth + Desi words) | 'american'
};

const DEFAULT_STATS_ENTRY = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
};

export const storage = {
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  getLastPlayedMode() {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.LAST_MODE);
      return mode && ['unlimited', 'levels', 'daily'].includes(mode) ? mode : 'unlimited';
    } catch {
      return 'unlimited';
    }
  },

  setLastPlayedMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
    } catch {}
  },

  getLastWordLength() {
    try {
      const len = localStorage.getItem(STORAGE_KEYS.LAST_LENGTH);
      const parsed = len ? parseInt(len, 10) : 5;
      return [4, 5, 6, 7, 8].includes(parsed) ? parsed : 5;
    } catch {
      return 5;
    }
  },

  setLastWordLength(len) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_LENGTH, String(len));
    } catch {}
  },

  getSavedGameState(mode, length, level = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (!data) return null;
      const parsed = JSON.parse(data);
      let key = `${mode}_${length}`;
      if (mode === 'levels') {
        key = `levels_lvl_${level || 1}`;
      } else if (mode === 'daily') {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        key = `daily_${length}_${dateStr}`;
      }
      return parsed[key] || null;
    } catch {
      return null;
    }
  },

  saveGameState(mode, length, state, level = null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      const parsed = raw ? JSON.parse(raw) : {};
      let key = `${mode}_${length}`;
      if (mode === 'levels') {
        key = `levels_lvl_${level || 1}`;
      } else if (mode === 'daily') {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        key = `daily_${length}_${dateStr}`;
      }
      if (state === null) {
        delete parsed[key];
      } else {
        parsed[key] = state;
      }
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(parsed));
    } catch {}
  },

  getStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) {
        return {
          all: { ...DEFAULT_STATS_ENTRY },
          4: { ...DEFAULT_STATS_ENTRY },
          5: { ...DEFAULT_STATS_ENTRY },
          6: { ...DEFAULT_STATS_ENTRY },
          7: { ...DEFAULT_STATS_ENTRY },
          8: { ...DEFAULT_STATS_ENTRY },
        };
      }
      return JSON.parse(data);
    } catch {
      return {
        all: { ...DEFAULT_STATS_ENTRY },
        4: { ...DEFAULT_STATS_ENTRY },
        5: { ...DEFAULT_STATS_ENTRY },
        6: { ...DEFAULT_STATS_ENTRY },
        7: { ...DEFAULT_STATS_ENTRY },
        8: { ...DEFAULT_STATS_ENTRY },
      };
    }
  },

  recordGameResult({ length, won, guessesCount, durationSeconds, word, mode, level }) {
    try {
      const stats = this.getStats();
      const updateEntry = (entry) => {
        entry.played += 1;
        if (won) {
          entry.wins += 1;
          entry.currentStreak += 1;
          if (entry.currentStreak > entry.maxStreak) {
            entry.maxStreak = entry.currentStreak;
          }
          if (guessesCount in entry.distribution) {
            entry.distribution[guessesCount] += 1;
          }
        } else {
          entry.currentStreak = 0;
        }
      };

      if (!stats.all) stats.all = { ...DEFAULT_STATS_ENTRY };
      if (!stats[length]) stats[length] = { ...DEFAULT_STATS_ENTRY };

      updateEntry(stats.all);
      updateEntry(stats[length]);

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));

      // Append to history
      this.addHistoryEntry({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        timestamp: new Date().toISOString(),
        mode,
        length,
        word,
        won,
        guessesCount,
        durationSeconds,
        level: mode === 'levels' ? level : null,
      });

      return stats;
    } catch {
      return this.getStats();
    }
  },

  getLevelProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEVELS);
      if (!data) {
        return {
          currentLevel: 1,
          maxUnlockedLevel: 1,
          stars: {},
          totalXP: 0,
        };
      }
      return JSON.parse(data);
    } catch {
      return {
        currentLevel: 1,
        maxUnlockedLevel: 1,
        stars: {},
        totalXP: 0,
      };
    }
  },

  saveLevelComplete(level, stars, xpGained = 100) {
    try {
      const prog = this.getLevelProgress();
      const currentStars = prog.stars[level] || 0;
      if (stars > currentStars) {
        prog.stars[level] = stars;
      }
      prog.totalXP = (prog.totalXP || 0) + xpGained;
      if (level >= prog.maxUnlockedLevel) {
        prog.maxUnlockedLevel = level + 1;
      }
      prog.currentLevel = level + 1;
      localStorage.setItem(STORAGE_KEYS.LEVELS, JSON.stringify(prog));
      return prog;
    } catch {
      return this.getLevelProgress();
    }
  },

  setCurrentLevel(level) {
    try {
      const prog = this.getLevelProgress();
      prog.currentLevel = level;
      localStorage.setItem(STORAGE_KEYS.LEVELS, JSON.stringify(prog));
      return prog;
    } catch {
      return this.getLevelProgress();
    }
  },

  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistoryEntry(entry) {
    try {
      const history = this.getHistory();
      history.unshift(entry);
      // Keep most recent 150 entries
      const trimmed = history.slice(0, 150);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch {}
  },

  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch {}
  }
};
