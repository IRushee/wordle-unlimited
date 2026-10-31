import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  PLAYER_ID: 'wordle_player_sync_id',
  SUPABASE_CONFIG: 'wordle_supabase_config_v1',
};

// Retrieve or generate a persistent Sync Player ID
export function getPlayerSyncId() {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
    if (!id) {
      id = 'player_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.PLAYER_ID, id);
    }
    return id;
  } catch {
    return 'player_local_guest';
  }
}

export function setPlayerSyncId(newId) {
  try {
    if (newId && typeof newId === 'string') {
      localStorage.setItem(STORAGE_KEYS.PLAYER_ID, newId.trim());
    }
  } catch {}
}

export function getSupabaseCredentials() {
  // Check localStorage first (runtime configuration via UI)
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch {}

  // Fallback to Vite environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  return { url: '', anonKey: '' };
}

export function saveSupabaseCredentials(url, anonKey) {
  try {
    if (!url || !anonKey) {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
    } else {
      localStorage.setItem(
        STORAGE_KEYS.SUPABASE_CONFIG,
        JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
      );
    }
  } catch {}
}

let cachedClient = null;
let lastCredsKey = '';

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  const credsKey = `${url}:${anonKey}`;
  if (cachedClient && lastCredsKey === credsKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastCredsKey = credsKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url, anonKey) {
  try {
    if (!url || !anonKey) {
      return { success: false, message: 'URL and Anon Key are required.' };
    }
    const client = createClient(url, anonKey);
    const { data, error } = await client.from('wordle_profiles').select('id').limit(1);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

// Push local state to Supabase
export async function syncToCloud({ levelProgress, stats, history }) {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase not configured' };

  const playerId = getPlayerSyncId();

  try {
    // 1. Upsert Profile
    const { error: profileError } = await client.from('wordle_profiles').upsert({
      id: playerId,
      current_level: levelProgress?.currentLevel || 1,
      max_unlocked_level: levelProgress?.maxUnlockedLevel || 1,
      stars: levelProgress?.stars || {},
      total_xp: levelProgress?.totalXP || 0,
      updated_at: new Date().toISOString(),
    });
    if (profileError) throw profileError;

    // 2. Upsert Stats (for each length and overall)
    if (stats) {
      const statsEntries = Object.entries(stats).map(([category, s]) => ({
        player_id: playerId,
        category,
        played: s.played || 0,
        wins: s.wins || 0,
        current_streak: s.currentStreak || 0,
        max_streak: s.maxStreak || 0,
        distribution: s.distribution || {},
        updated_at: new Date().toISOString(),
      }));

      const { error: statsError } = await client
        .from('wordle_stats')
        .upsert(statsEntries, { onConflict: 'player_id,category' });
      if (statsError) throw statsError;
    }

    // 3. Upsert History
    if (history && history.length > 0) {
      const historyRows = history.slice(0, 50).map((h) => ({
        id: h.id,
        player_id: playerId,
        word: h.word,
        length: h.length,
        mode: h.mode,
        won: h.won,
        guesses_count: h.guessesCount,
        duration_seconds: h.durationSeconds || 0,
        level: h.level || null,
        played_at: h.timestamp || new Date().toISOString(),
      }));

      const { error: histError } = await client
        .from('wordle_history')
        .upsert(historyRows, { onConflict: 'id' });
      if (histError) throw histError;
    }

    return { success: true, message: 'All stats & progress backed up to cloud!' };
  } catch (err) {
    return { success: false, message: err.message || 'Sync failed' };
  }
}

// Pull cloud data into local state
export async function syncFromCloud() {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase not configured' };

  const playerId = getPlayerSyncId();

  try {
    // Fetch profile
    const { data: profile, error: pErr } = await client
      .from('wordle_profiles')
      .select('*')
      .eq('id', playerId)
      .maybeSingle();

    if (pErr) throw pErr;

    // Fetch stats
    const { data: statsRows, error: sErr } = await client
      .from('wordle_stats')
      .select('*')
      .eq('player_id', playerId);

    if (sErr) throw sErr;

    // Fetch history
    const { data: historyRows, error: hErr } = await client
      .from('wordle_history')
      .select('*')
      .eq('player_id', playerId)
      .order('played_at', { ascending: false })
      .limit(100);

    if (hErr) throw hErr;

    if (!profile && (!statsRows || statsRows.length === 0)) {
      return { success: true, message: 'No existing cloud data found for this Player ID.' };
    }

    // Structure stats
    const formattedStats = {};
    if (statsRows) {
      statsRows.forEach((row) => {
        formattedStats[row.category] = {
          played: row.played,
          wins: row.wins,
          currentStreak: row.current_streak,
          maxStreak: row.max_streak,
          distribution: row.distribution || {},
        };
      });
    }

    const formattedProgress = profile
      ? {
          currentLevel: profile.current_level,
          maxUnlockedLevel: profile.max_unlocked_level,
          stars: profile.stars || {},
          totalXP: profile.total_xp,
        }
      : null;

    const formattedHistory = historyRows
      ? historyRows.map((h) => ({
          id: h.id,
          timestamp: h.played_at,
          mode: h.mode,
          length: h.length,
          word: h.word,
          won: h.won,
          guessesCount: h.guesses_count,
          durationSeconds: h.duration_seconds,
          level: h.level,
        }))
      : [];

    return {
      success: true,
      data: {
        profile: formattedProgress,
        stats: formattedStats,
        history: formattedHistory,
      },
      message: 'Cloud data successfully retrieved!',
    };
  } catch (err) {
    return { success: false, message: err.message || 'Fetch failed' };
  }
}
