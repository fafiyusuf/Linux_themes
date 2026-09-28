/**
 * src/hooks/useEngine.js
 * React hook that bridges the UI to the Aura engine via window.aura (preload).
 *
 * When running in the browser (Vite dev server without Electron),
 * it falls back to a mock so the UI still works.
 */

import { useState, useEffect, useCallback } from 'react';

// Check if we're inside Electron (window.aura is injected by preload.js)
const isElectron = typeof window !== 'undefined' && window.aura != null;

// ── Mock engine for browser-only dev ─────────────────────────────────────────
const MOCK_ENV = {
  desktop: 'GNOME',
  sessionType: 'Wayland',
  gnomeVersion: '46.0',
  gtkVersion: '4.12.3',
  libadwaitaVersion: '1.4.2',
  distribution: 'Arch Linux',
  kernel: '6.9.3-arch1',
  capabilities: {
    wallpaper: true,
    iconTheme: true,
    cursorTheme: true,
    gtkTheme: true,
    gnomeShell: true,
    accentColor: true,
    colorScheme: true,
    terminals: ['gnome-terminal', 'alacritty'],
  },
};

const mock = {
  detectEnvironment: async () => ({ success: true, data: MOCK_ENV }),

  applyTheme: async ({ manifest }) => {
    // Simulate a real apply with slight delay
    await new Promise(r => setTimeout(r, 800));
    const results = {};
    for (const [k, enabled] of Object.entries(manifest.components || {})) {
      results[k] = enabled
        ? { status: 'success', message: `${k} applied (simulated)` }
        : { status: 'skipped', message: 'Not included in this theme' };
    }
    return { success: true, data: { results, backupId: 'mock-backup' } };
  },

  createBackup: async (label) => ({
    success: true,
    data: { id: `mock-${Date.now()}`, label },
  }),

  listBackups: async () => ({ success: true, data: [] }),

  restoreBackup: async () => ({
    success: true,
    data: { results: {} },
  }),

  exportLog: async () => ({
    success: true,
    data: '{"ts":"2026-01-01T00:00:00Z","level":"info","category":"mock","message":"Running in browser mode"}\n',
  }),
};

const engine = isElectron ? window.aura : mock;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useEngine() {
  const [env, setEnv] = useState(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [envError, setEnvError] = useState(null);

  useEffect(() => {
    engine.detectEnvironment().then(res => {
      if (res.success) setEnv(res.data);
      else setEnvError(res.error?.message || 'Detection failed');
      setEnvLoading(false);
    });
  }, []);

  /**
   * Apply a theme package.
   * @param {string} themeDir - Absolute path to the theme package directory
   * @param {object} manifest - Parsed manifest.json
   * @returns {Promise<{ results, backupId }>}
   */
  const applyTheme = useCallback(async (themeDir, manifest) => {
    const res = await engine.applyTheme({ themeDir, manifest });
    if (!res.success) throw new Error(res.error?.message || 'Apply failed');
    return res.data;
  }, []);

  const createBackup = useCallback(async (label) => {
    const res = await engine.createBackup(label);
    if (!res.success) throw new Error(res.error?.message || 'Backup failed');
    return res.data;
  }, []);

  const listBackups = useCallback(async () => {
    const res = await engine.listBackups();
    if (!res.success) throw new Error(res.error?.message);
    return res.data;
  }, []);

  const restoreBackup = useCallback(async (backupId) => {
    const res = await engine.restoreBackup(backupId);
    if (!res.success) throw new Error(res.error?.message || 'Restore failed');
    return res.data;
  }, []);

  const exportLog = useCallback(async () => {
    const res = await engine.exportLog();
    return res.success ? res.data : '';
  }, []);

  return {
    env,
    envLoading,
    envError,
    isElectron,
    applyTheme,
    createBackup,
    listBackups,
    restoreBackup,
    exportLog,
  };
}
