/**
 * electron/engine/validator.js
 * Validates a .fytheme package directory before applying.
 * Returns a structured result: { valid, errors[], warnings[] }
 *
 * Never executes any scripts. Only reads and inspects files.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_MANIFEST_FIELDS = ['schemaVersion', 'id', 'name', 'version', 'components'];
const SUPPORTED_WALLPAPER_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

/**
 * Validate a theme package at a given directory path.
 * @param {string} pkgPath - Absolute path to the extracted theme directory
 * @returns {{ valid: boolean, errors: string[], warnings: string[], manifest: object|null }}
 */
function validateThemePackage(pkgPath) {
  const errors = [];
  const warnings = [];
  let manifest = null;

  // 1. Directory must exist
  if (!fs.existsSync(pkgPath)) {
    return { valid: false, errors: [`Theme directory does not exist: ${pkgPath}`], warnings: [], manifest: null };
  }

  // 2. manifest.json must exist and be valid JSON
  const manifestPath = path.join(pkgPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    errors.push('manifest.json is missing');
  } else {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      errors.push(`manifest.json is not valid JSON: ${e.message}`);
    }
  }

  if (!manifest) {
    return { valid: false, errors, warnings, manifest: null };
  }

  // 3. Required manifest fields
  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push(`manifest.json is missing required field: "${field}"`);
    }
  }

  // 4. Schema version check
  if (manifest.schemaVersion !== 1) {
    warnings.push(`Unsupported schema version: ${manifest.schemaVersion}. Expected 1.`);
  }

  // 5. ID must be a safe string (no path traversal)
  if (manifest.id && !/^[a-z0-9-]+$/.test(manifest.id)) {
    errors.push(`manifest.json "id" contains invalid characters. Use only lowercase letters, numbers, and hyphens.`);
  }

  // 6. Components object
  const components = manifest.components || {};

  // 7. Validate each declared component has its directory/files
  if (components.wallpaper) {
    const wallpaperDir = path.join(pkgPath, 'wallpaper');
    if (!fs.existsSync(wallpaperDir)) {
      errors.push('Wallpaper component declared but "wallpaper/" directory is missing');
    } else {
      const files = fs.readdirSync(wallpaperDir);
      const validFiles = files.filter(f =>
        SUPPORTED_WALLPAPER_EXTS.includes(path.extname(f).toLowerCase())
      );
      if (validFiles.length === 0) {
        errors.push('Wallpaper directory is empty or contains no supported image files (.jpg, .png, .webp)');
      }
    }
  }

  if (components.colors) {
    const colorsPath = path.join(pkgPath, 'colors', 'palette.json');
    if (!fs.existsSync(colorsPath)) {
      errors.push('Colors component declared but "colors/palette.json" is missing');
    } else {
      try {
        const palette = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        const required = ['background', 'foreground', 'primary'];
        for (const key of required) {
          if (!palette[key]) warnings.push(`Color palette is missing "${key}" color`);
          else if (!/^#[0-9A-Fa-f]{6}$/.test(palette[key])) {
            warnings.push(`Color "${key}" value "${palette[key]}" is not a valid hex color`);
          }
        }
      } catch (e) {
        errors.push(`colors/palette.json is not valid JSON: ${e.message}`);
      }
    }
  }

  if (components.icons) {
    const iconsDir = path.join(pkgPath, 'icons');
    if (!fs.existsSync(iconsDir)) {
      errors.push('Icons component declared but "icons/" directory is missing');
    }
  }

  if (components.cursor) {
    const cursorDir = path.join(pkgPath, 'cursor');
    if (!fs.existsSync(cursorDir)) {
      errors.push('Cursor component declared but "cursor/" directory is missing');
    }
  }

  if (components.gtk) {
    const gtkDir = path.join(pkgPath, 'gtk');
    if (!fs.existsSync(gtkDir)) {
      errors.push('GTK component declared but "gtk/" directory is missing');
    }
  }

  if (components.gnome) {
    const gnomeDir = path.join(pkgPath, 'gnome');
    if (!fs.existsSync(gnomeDir)) {
      errors.push('GNOME Shell component declared but "gnome/" directory is missing');
    }
  }

  // 8. Confirm no executable scripts are present (security check)
  const dangerousFiles = findDangerousFiles(pkgPath);
  if (dangerousFiles.length > 0) {
    for (const f of dangerousFiles) {
      errors.push(`Security: Theme package contains a disallowed file type: ${f}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    manifest,
  };
}

/**
 * Find any files that should never be in a theme package (shell scripts, executables, etc.).
 */
function findDangerousFiles(dir, results = [], base = dir) {
  const BLOCKED_EXTS = ['.sh', '.bash', '.py', '.rb', '.pl', '.exe', '.AppImage', '.deb', '.rpm'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findDangerousFiles(fullPath, results, base);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (BLOCKED_EXTS.includes(ext)) {
        results.push(path.relative(base, fullPath));
      }
    }
  }
  return results;
}

module.exports = { validateThemePackage };
