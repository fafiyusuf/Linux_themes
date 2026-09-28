/**
 * electron/preload.js
 * Exposes a safe, controlled API to the renderer via contextBridge.
 *
 * The renderer (React) can ONLY call what is explicitly listed here.
 * It has no direct access to Node.js, fs, or ipcRenderer.
 */

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Invoke an IPC channel and return the result.
 * All calls return { success, data?, error? }
 */
function invoke(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args);
}

contextBridge.exposeInMainWorld('aura', {
  /** Detect the current desktop environment and capabilities */
  detectEnvironment: () => invoke('aura:detect-environment'),

  /** Validate a theme package directory */
  validateTheme: (themeDir) => invoke('aura:validate-theme', themeDir),

  /**
   * Apply a theme.
   * @param {{ themeDir: string, manifest: object }} opts
   */
  applyTheme: (opts) => invoke('aura:apply-theme', opts),

  /** Create a manual backup of the current configuration */
  createBackup: (label) => invoke('aura:create-backup', label),

  /** List all available backups */
  listBackups: () => invoke('aura:list-backups'),

  /** Restore a backup by its ID */
  restoreBackup: (backupId) => invoke('aura:restore-backup', backupId),

  /** Open the OS file picker to select a .fytheme file */
  openThemeFile: () => invoke('aura:open-theme-file'),

  /** Export the full log as a string */
  exportLog: () => invoke('aura:export-log'),

  /** Read recent log entries */
  readLog: () => invoke('aura:read-log'),
});
