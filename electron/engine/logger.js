/**
 * electron/engine/logger.js
 * Structured logger for Aura engine operations.
 * Writes to ~/.local/share/aura/logs/aura.log
 * Each line is a JSON object for easy parsing/export.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(os.homedir(), '.local', 'share', 'aura', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'aura.log');
const MAX_LOG_BYTES = 2 * 1024 * 1024; // 2 MB — rotate after this

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function rotateIfNeeded() {
  try {
    const stat = fs.statSync(LOG_FILE);
    if (stat.size > MAX_LOG_BYTES) {
      fs.renameSync(LOG_FILE, LOG_FILE + '.old');
    }
  } catch {}
}

function write(level, category, message, data = null) {
  try {
    ensureLogDir();
    rotateIfNeeded();
    const entry = {
      ts: new Date().toISOString(),
      level,
      category,
      message,
      ...(data ? { data } : {}),
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
  } catch {}
}

const logger = {
  info:  (cat, msg, data) => write('info',  cat, msg, data),
  warn:  (cat, msg, data) => write('warn',  cat, msg, data),
  error: (cat, msg, data) => write('error', cat, msg, data),

  /** Read recent log lines (last N) */
  readLog(lines = 200) {
    try {
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      return content.trim().split('\n').slice(-lines).map(line => {
        try { return JSON.parse(line); } catch { return { raw: line }; }
      });
    } catch {
      return [];
    }
  },

  /** Export full log as a string for the user to copy */
  exportLog() {
    try {
      return fs.readFileSync(LOG_FILE, 'utf8');
    } catch {
      return '';
    }
  },
};

module.exports = logger;
