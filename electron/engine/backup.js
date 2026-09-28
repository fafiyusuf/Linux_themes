/**
 * electron/engine/backup.js
 * Snapshots the current desktop configuration before any theme is applied,
 * and can restore it (rollback).
 *
 * Backups are stored in: ~/.local/share/aura/backups/<timestamp>/
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BACKUP_ROOT = path.join(os.homedir(), '.local', 'share', 'aura', 'backups');

/**
 * Run gsettings get and return the raw value string.
 * Returns null if the schema/key doesn't exist.
 */
function gsettingsGet(schema, key) {
  try {
    return execSync(`gsettings get ${schema} ${key}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Apply a gsettings value back (used during restore).
 */
function gsettingsSet(schema, key, value) {
  try {
    execSync(`gsettings set ${schema} ${key} ${value}`, {
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * The full set of settings Aura can change.
 * Each entry: { schema, key }
 */
const TRACKED_SETTINGS = [
  { schema: 'org.gnome.desktop.background', key: 'picture-uri' },
  { schema: 'org.gnome.desktop.background', key: 'picture-uri-dark' },
  { schema: 'org.gnome.desktop.interface',  key: 'icon-theme' },
  { schema: 'org.gnome.desktop.interface',  key: 'cursor-theme' },
  { schema: 'org.gnome.desktop.interface',  key: 'gtk-theme' },
  { schema: 'org.gnome.desktop.interface',  key: 'color-scheme' },
  { schema: 'org.gnome.desktop.interface',  key: 'accent-color' },
  { schema: 'org.gnome.shell.extensions.user-theme', key: 'name' },
];

/**
 * Create a backup of the current configuration.
 * Returns the backup ID (timestamp string).
 */
function createBackup(label = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(BACKUP_ROOT, timestamp);
  fs.mkdirSync(backupDir, { recursive: true });

  const snapshot = {
    timestamp,
    label: label || `Backup ${timestamp}`,
    settings: {},
  };

  for (const { schema, key } of TRACKED_SETTINGS) {
    const value = gsettingsGet(schema, key);
    if (value !== null) {
      if (!snapshot.settings[schema]) snapshot.settings[schema] = {};
      snapshot.settings[schema][key] = value;
    }
  }

  const snapshotPath = path.join(backupDir, 'snapshot.json');
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf8');

  return { id: timestamp, path: backupDir, snapshot };
}

/**
 * Restore a backup by its timestamp ID.
 * Returns a result object with per-key success/failure.
 */
function restoreBackup(backupId) {
  const snapshotPath = path.join(BACKUP_ROOT, backupId, 'snapshot.json');

  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Backup not found: ${backupId}`);
  }

  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const results = {};

  for (const [schema, keys] of Object.entries(snapshot.settings)) {
    for (const [key, value] of Object.entries(keys)) {
      const ok = gsettingsSet(schema, key, value);
      results[`${schema}.${key}`] = ok ? 'restored' : 'failed';
    }
  }

  return { id: backupId, results };
}

/**
 * List all available backups, newest first.
 */
function listBackups() {
  if (!fs.existsSync(BACKUP_ROOT)) return [];

  return fs.readdirSync(BACKUP_ROOT)
    .filter(name => {
      const snapshotPath = path.join(BACKUP_ROOT, name, 'snapshot.json');
      return fs.existsSync(snapshotPath);
    })
    .map(name => {
      const snapshotPath = path.join(BACKUP_ROOT, name, 'snapshot.json');
      try {
        const snap = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        return { id: name, label: snap.label, timestamp: snap.timestamp };
      } catch {
        return { id: name, label: name, timestamp: name };
      }
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Delete a backup by ID.
 */
function deleteBackup(backupId) {
  const backupDir = path.join(BACKUP_ROOT, backupId);
  if (!fs.existsSync(backupDir)) throw new Error(`Backup not found: ${backupId}`);
  fs.rmSync(backupDir, { recursive: true });
}

module.exports = { createBackup, restoreBackup, listBackups, deleteBackup };
