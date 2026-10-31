import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Volume2,
  Eye,
  ShieldAlert,
  Sparkles,
  Trash2,
  Clock,
  Cloud,
  CloudUpload,
  CloudDownload,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  Loader2,
} from 'lucide-react';
import {
  getPlayerSyncId,
  setPlayerSyncId,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
} from '../utils/supabase';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onResetData,
  onSyncToCloud,
  onSyncFromCloud,
  showToast,
}) {
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Supabase creds state
  const creds = getSupabaseCredentials();
  const [url, setUrl] = useState(creds.url || '');
  const [anonKey, setAnonKey] = useState(creds.anonKey || '');
  const [playerId, setPlayerIdInput] = useState(getPlayerSyncId());

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

  const handleToggle = (key) => {
    onUpdateSetting(key, !settings[key]);
  };

  const handleConfirmReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all stats, level progress, and history? This cannot be undone.'
      )
    ) {
      onResetData();
      showToast('All progress and statistics have been reset.', 'success');
      onClose();
    }
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(playerId).then(() => {
        setCopiedId(true);
        showToast('Player Sync ID copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(false), 2000);
      });
    }
  };

  const handleSavePlayerId = () => {
    setPlayerSyncId(playerId);
    showToast('Player Sync ID updated.', 'info');
  };

  const handleTestConnection = async () => {
    setSyncLoading(true);
    setTestResult(null);
    saveSupabaseCredentials(url, anonKey);

    const res = await testSupabaseConnection(url, anonKey);
    setSyncLoading(false);
    setTestResult(res);

    if (res.success) {
      showToast('Connected to Supabase!', 'success');
    } else {
      showToast(res.message || 'Connection failed', 'error');
    }
  };

  const handleCloudBackup = async () => {
    if (!onSyncToCloud) return;
    setSyncLoading(true);
    const res = await onSyncToCloud();
    setSyncLoading(false);
    if (res?.success) {
      showToast('All game progress backed up to Supabase!', 'success');
    } else {
      showToast(res?.message || 'Sync failed', 'error');
    }
  };

  const handleCloudRestore = async () => {
    if (!onSyncFromCloud) return;
    setSyncLoading(true);
    const res = await onSyncFromCloud();
    setSyncLoading(false);
    if (res?.success) {
      showToast('Progress restored from cloud!', 'success');
    } else {
      showToast(res?.message || 'Restore failed', 'error');
    }
  };

  const isConfigured = Boolean(url && anonKey);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-modal-backdrop select-none"
    >
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-6 text-zinc-900 dark:text-white shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto animate-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h2 id="settings-modal-title" className="font-extrabold text-base sm:text-lg tracking-wider">SETTINGS</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Sync (Supabase) Section */}
        <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-bold text-xs sm:text-sm">Cloud Sync (Supabase)</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {isConfigured ? 'Cloud sync enabled' : 'Offline Mode (Local Storage)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCloudConfig(!showCloudConfig)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{showCloudConfig ? 'Hide' : 'Configure'}</span>
              {showCloudConfig ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Sync Code / Player ID */}
          <div className="flex flex-col gap-1.5 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              Your Device Sync Code:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerIdInput(e.target.value)}
                onBlur={handleSavePlayerId}
                className="flex-1 bg-zinc-100 dark:bg-zinc-950 px-2 py-1 rounded font-mono text-[11px] border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-200"
                placeholder="Device Sync ID"
              />
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Copy Sync ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
              Paste this same code on your other devices to sync progress.
            </span>
          </div>

          {/* Expandable Configuration Inputs */}
          {showCloudConfig && (
            <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Supabase Public Anon Key
                </label>
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={syncLoading}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {syncLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Save & Test</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloudBackup}
                  disabled={syncLoading || !url}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Backup</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloudRestore}
                  disabled={syncLoading || !url}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <CloudDownload className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2 rounded text-[11px] font-semibold ${
                    testResult.success
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gameplay Settings List */}
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800/80">
          {/* Hard Mode */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Hard Mode</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Any revealed hints must be used in subsequent guesses
              </span>
            </div>
            <button
              onClick={() => handleToggle('hardMode')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.hardMode ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.hardMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Time Attack */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Time Attack Challenge
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Add a 90-second countdown per puzzle
              </span>
            </div>
            <button
              onClick={() => handleToggle('timeAttack')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.timeAttack ? 'bg-amber-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.timeAttack ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                High Contrast Mode
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                For improved color vision accessibility (Orange & Sky Blue)
              </span>
            </div>
            <button
              onClick={() => handleToggle('highContrast')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.highContrast ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Dark / Light Theme */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Dark Theme</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Toggle between Dark and Light appearance
              </span>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.darkMode !== false ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.darkMode !== false ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Sound Effects
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Play click, flip, victory, and error audio tones
              </span>
            </div>
            <button
              onClick={() => handleToggle('soundEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.soundEnabled !== false ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.soundEnabled !== false ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Haptic Vibration
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Tactile feedback on mobile screen taps
              </span>
            </div>
            <button
              onClick={() => handleToggle('hapticsEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.hapticsEnabled !== false ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.hapticsEnabled !== false ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Strict Dictionary */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col pr-4">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Strict Dictionary
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Enforce only valid dictionary words as guesses
              </span>
            </div>
            <button
              onClick={() => handleToggle('strictDictionary')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings?.strictDictionary !== false ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                  settings?.strictDictionary !== false ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset Data */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleConfirmReset}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Game Memory & Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
