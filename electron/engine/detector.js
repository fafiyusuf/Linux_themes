/**
 * electron/engine/detector.js
 * Detects the user's desktop environment, capabilities, and system info.
 * All detection is read-only — nothing is modified here.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

/**
 * Run a shell command and return stdout as a trimmed string.
 * Returns null if the command fails.
 */
function run(cmd) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Check if a gsettings key is readable.
 */
function gsettingsReadable(schema, key) {
  return run(`gsettings get ${schema} ${key}`) !== null;
}

/**
 * Detect which terminal emulators are installed.
 */
function detectTerminals() {
  const supported = ['gnome-terminal', 'alacritty', 'kitty'];
  return supported.filter(t => run(`which ${t}`) !== null);
}

/**
 * Detect the full environment.
 */
function detectEnvironment() {
  const desktop = process.env.XDG_CURRENT_DESKTOP
    || process.env.XDG_SESSION_DESKTOP
    || run('echo $DESKTOP_SESSION')
    || 'Unknown';

  const sessionType = process.env.XDG_SESSION_TYPE || 'Unknown';

  const gnomeVersion = run('gnome-shell --version')
    ?.replace('GNOME Shell ', '') || null;

  // GTK version — try GTK4 first, fall back to GTK3
  const gtkVersion =
    run('pkg-config --modversion gtk4') ||
    run('pkg-config --modversion gtk+-3.0') ||
    null;

  // libadwaita
  const libadwaitaVersion = run('pkg-config --modversion libadwaita-1') || null;

  // Distribution name
  let distribution = 'Unknown';
  try {
    const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
    const match = osRelease.match(/^PRETTY_NAME="(.+)"$/m);
    if (match) distribution = match[1];
  } catch {}

  const kernel = run('uname -r') || 'Unknown';

  // Capability probes — what can we actually change?
  const capabilities = {
    wallpaper:       gsettingsReadable('org.gnome.desktop.background', 'picture-uri'),
    iconTheme:       gsettingsReadable('org.gnome.desktop.interface', 'icon-theme'),
    cursorTheme:     gsettingsReadable('org.gnome.desktop.interface', 'cursor-theme'),
    gtkTheme:        gsettingsReadable('org.gnome.desktop.interface', 'gtk-theme'),
    gnomeShell:      gsettingsReadable('org.gnome.shell.extensions.user-theme', 'name'),
    accentColor:     gsettingsReadable('org.gnome.desktop.interface', 'accent-color'),
    colorScheme:     gsettingsReadable('org.gnome.desktop.interface', 'color-scheme'),
    terminals:       detectTerminals(),
  };

  return {
    desktop,
    sessionType,
    gnomeVersion,
    gtkVersion,
    libadwaitaVersion,
    distribution,
    kernel,
    homeDir: os.homedir(),
    capabilities,
  };
}

/**
 * Returns true if the detected environment is GNOME.
 */
function isGnome(env) {
  return (
    env.desktop?.toLowerCase().includes('gnome') ||
    env.gnomeVersion !== null
  );
}

module.exports = { detectEnvironment, isGnome };
