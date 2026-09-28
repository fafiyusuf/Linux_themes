/**
 * electron/ipc/handlers.js
 * Registers all ipcMain handlers.
 * The renderer (React) never calls Node.js directly —
 * all engine work is done here via the contextBridge preload.
 *
 * Every handler returns: { success: boolean, data?, error?: { code, message } }
 */

'use strict';

const { ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const { detectEnvironment } = require('../engine/detector.js');
const { validateThemePackage } = require('../engine/validator.js');
const { createBackup, restoreBackup, listBackups } = require('../engine/backup.js');
const { applyTheme } = require('../engine/applier.js');
const logger = require('../engine/logger.js');

function ok(data) { return { success: true, data }; }
function fail(code, message) { return { success: false, error: { code, message } }; }

function registerHandlers() {

  // ── Environment ────────────────────────────────────────────────────────────

  ipcMain.handle('aura:detect-environment', async () => {
    try {
      logger.info('detect', 'Running environment detection');
      const env = detectEnvironment();
      logger.info('detect', 'Environment detected', { desktop: env.desktop, gnome: env.gnomeVersion });
      return ok(env);
    } catch (e) {
      logger.error('detect', e.message);
      return fail('DETECT_FAILED', e.message);
    }
  });

  // ── Theme validation ───────────────────────────────────────────────────────

  ipcMain.handle('aura:validate-theme', async (_event, themeDir) => {
    try {
      logger.info('validate', `Validating: ${themeDir}`);
      const result = validateThemePackage(themeDir);
      logger.info('validate', `Validation ${result.valid ? 'passed' : 'failed'}`, {
        errors: result.errors,
        warnings: result.warnings,
      });
      return ok(result);
    } catch (e) {
      logger.error('validate', e.message);
      return fail('VALIDATE_FAILED', e.message);
    }
  });

  // ── Apply theme ────────────────────────────────────────────────────────────

  ipcMain.handle('aura:apply-theme', async (_event, { themeDir, manifest }) => {
    try {
      logger.info('apply', `Applying theme: ${manifest.id}`);

      // 1. Detect current environment
      const env = detectEnvironment();
      logger.info('apply', 'Environment', { desktop: env.desktop });

      // 2. Backup before making any changes
      const backup = createBackup(`Before applying ${manifest.name}`);
      logger.info('apply', `Backup created: ${backup.id}`);

      // 3. Validate
      const validation = validateThemePackage(themeDir);
      if (!validation.valid) {
        return fail('VALIDATION_FAILED',
          `Theme validation failed: ${validation.errors.join('; ')}`
        );
      }

      // 4. Apply each component
      const { results } = applyTheme(themeDir, manifest, env.capabilities);

      logger.info('apply', `Theme applied: ${manifest.id}`, results);

      return ok({ results, backupId: backup.id });
    } catch (e) {
      logger.error('apply', e.message);
      return fail('APPLY_FAILED', e.message);
    }
  });

  // ── Backup / Rollback ──────────────────────────────────────────────────────

  ipcMain.handle('aura:create-backup', async (_event, label) => {
    try {
      const backup = createBackup(label);
      logger.info('backup', `Manual backup created: ${backup.id}`);
      return ok(backup);
    } catch (e) {
      logger.error('backup', e.message);
      return fail('BACKUP_FAILED', e.message);
    }
  });

  ipcMain.handle('aura:list-backups', async () => {
    try {
      return ok(listBackups());
    } catch (e) {
      return fail('LIST_BACKUPS_FAILED', e.message);
    }
  });

  ipcMain.handle('aura:restore-backup', async (_event, backupId) => {
    try {
      logger.info('restore', `Restoring backup: ${backupId}`);
      const result = restoreBackup(backupId);
      logger.info('restore', 'Restore complete', result.results);
      return ok(result);
    } catch (e) {
      logger.error('restore', e.message);
      return fail('RESTORE_FAILED', e.message);
    }
  });

  // ── File picker (import .fytheme) ──────────────────────────────────────────

  ipcMain.handle('aura:open-theme-file', async (event) => {
    const win = require('electron').BrowserWindow.fromWebContents(event.sender);
    try {
      const result = await dialog.showOpenDialog(win, {
        title: 'Import Theme Package',
        filters: [{ name: 'Aura Theme', extensions: ['fytheme', 'zip'] }],
        properties: ['openFile'],
      });
      if (result.canceled || result.filePaths.length === 0) {
        return ok(null);
      }
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail('FILE_OPEN_FAILED', e.message);
    }
  });

  // ── Diagnostics ────────────────────────────────────────────────────────────

  ipcMain.handle('aura:export-log', async () => {
    try {
      return ok(logger.exportLog());
    } catch (e) {
      return fail('LOG_EXPORT_FAILED', e.message);
    }
  });

  ipcMain.handle('aura:read-log', async () => {
    try {
      return ok(logger.readLog(500));
    } catch (e) {
      return fail('LOG_READ_FAILED', e.message);
    }
  });
}

module.exports = { registerHandlers };
