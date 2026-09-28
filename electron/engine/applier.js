/**
 * electron/engine/applier.js
 * Applies individual theme components to the GNOME desktop.
 *
 * Each component is applied independently. A failure in one component
 * does not prevent others from being applied.
 *
 * Architecture:
 *   applyTheme(themeDir, manifest, capabilities)
 *     → applyWallpaper()
 *     → applyColors()
 *     → applyIcons()
 *     → applyCursor()
 *     → applyGtk()
 *     → applyGnomeShell()
 *     → applyTerminal()
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const AURA_DATA = path.join(HOME, '.local', 'share', 'aura');
const WALLPAPER_DIR = path.join(AURA_DATA, 'wallpapers');
const THEMES_DIR = path.join(HOME, '.local', 'share', 'themes');
const ICONS_DIR = path.join(HOME, '.local', 'share', 'icons');

// ── helpers ──────────────────────────────────────────────────────────────────

function gsSet(schema, key, value) {
  execSync(`gsettings set ${schema} ${key} ${value}`, {
    stdio: ['ignore', 'ignore', 'ignore'],
    timeout: 5000,
  });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

// ── component appliers ────────────────────────────────────────────────────────

function applyWallpaper(themeDir, manifest) {
  const wallpaperDir = path.join(themeDir, 'wallpaper');
  const files = fs.readdirSync(wallpaperDir)
    .filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));

  if (files.length === 0) throw new Error('No wallpaper image found in wallpaper/ directory');

  const src = path.join(wallpaperDir, files[0]);
  ensureDir(WALLPAPER_DIR);
  const dest = path.join(WALLPAPER_DIR, `${manifest.id}${path.extname(src)}`);
  fs.copyFileSync(src, dest);

  const uri = `file://${dest}`;
  gsSet('org.gnome.desktop.background', 'picture-uri', `'${uri}'`);

  // Set dark variant (GNOME 42+). Silently skip if unsupported.
  try { gsSet('org.gnome.desktop.background', 'picture-uri-dark', `'${uri}'`); } catch {}

  return `Wallpaper set to ${path.basename(dest)}`;
}

function applyColors(themeDir, manifest) {
  const palettePath = path.join(themeDir, 'colors', 'palette.json');

  let palette;
  try {
    palette = JSON.parse(fs.readFileSync(palettePath, 'utf8'));
  } catch {
    throw new Error('Could not read colors/palette.json');
  }

  // color-scheme (dark / light mode) — GNOME 42+
  const style = manifest.style || [];
  const isDark = Array.isArray(style) ? style.includes('Dark') : style === 'dark';
  try {
    gsSet('org.gnome.desktop.interface', 'color-scheme', isDark ? "'prefer-dark'" : "'default'");
  } catch {}

  // accent-color — GNOME 47+
  // Map from hex to the nearest GNOME accent name
  const ACCENT_MAP = [
    { hex: '#5E81AC', name: 'blue'   },
    { hex: '#4FC3F7', name: 'blue'   },
    { hex: '#88C0D0', name: 'teal'   },
    { hex: '#00E5A0', name: 'teal'   },
    { hex: '#8BC34A', name: 'green'  },
    { hex: '#A3BE8C', name: 'green'  },
    { hex: '#EBCB8B', name: 'yellow' },
    { hex: '#FFD700', name: 'yellow' },
    { hex: '#FF6B00', name: 'orange' },
    { hex: '#FF6B6B', name: 'red'    },
    { hex: '#BF616A', name: 'red'    },
    { hex: '#FF0090', name: 'pink'   },
    { hex: '#B58CFF', name: 'purple' },
    { hex: '#A078FF', name: 'purple' },
    { hex: '#7C5FD4', name: 'purple' },
  ];

  const primary = (palette.primary || '').toUpperCase();
  const matched = ACCENT_MAP.find(e => primary.startsWith(e.hex.toUpperCase().slice(0, 4)));
  if (matched) {
    try {
      gsSet('org.gnome.desktop.interface', 'accent-color', `'${matched.name}'`);
    } catch {}
  }

  return `Color scheme: ${isDark ? 'dark' : 'light'}${matched ? `, accent: ${matched.name}` : ''}`;
}

function applyIcons(themeDir, manifest) {
  const iconSrc = path.join(themeDir, 'icons');
  if (!fs.existsSync(iconSrc)) throw new Error('icons/ directory not found');

  const themeName = `aura-${manifest.id}`;
  const dest = path.join(ICONS_DIR, themeName);

  ensureDir(ICONS_DIR);
  copyDir(iconSrc, dest);

  // If the bundle didn't include an index.theme, write a minimal fallback.
  // In practice our bundles always ship one (with apps/scalable, places/scalable, status/scalable).
  const indexTheme = path.join(dest, 'index.theme');
  if (!fs.existsSync(indexTheme)) {
    fs.writeFileSync(indexTheme, [
      '[Icon Theme]',
      `Name=${manifest.name}`,
      `Comment=Icon theme from Aura package ${manifest.id}`,
      'Inherits=Adwaita,hicolor',
      'Directories=apps/scalable,places/scalable,status/scalable',
      '',
      '[apps/scalable]',
      'Size=48',
      'Type=Scalable',
      'MinSize=8',
      'MaxSize=512',
      'Context=Applications',
      '',
      '[places/scalable]',
      'Size=48',
      'Type=Scalable',
      'MinSize=8',
      'MaxSize=512',
      'Context=Places',
      '',
      '[status/scalable]',
      'Size=48',
      'Type=Scalable',
      'MinSize=8',
      'MaxSize=512',
      'Context=Status',
    ].join('\n'), 'utf8');
  }

  gsSet('org.gnome.desktop.interface', 'icon-theme', `'${themeName}'`);

  // Tell GTK icon caches to refresh
  try {
    const { execSync } = require('child_process');
    execSync(`gtk-update-icon-cache -f -t "${dest}" 2>/dev/null || true`, { stdio: 'ignore', timeout: 10000 });
  } catch {}

  return `Icon theme installed: ${themeName}`;

}

function applyCursor(themeDir, manifest) {
  const cursorSrc = path.join(themeDir, 'cursor');
  if (!fs.existsSync(cursorSrc)) throw new Error('cursor/ directory not found');

  const themeName = `aura-${manifest.id}-cursor`;
  // Cursor themes live inside the icons directory
  const dest = path.join(ICONS_DIR, themeName);

  ensureDir(ICONS_DIR);
  copyDir(cursorSrc, dest);

  // Ensure index.theme exists for cursor
  const indexTheme = path.join(dest, 'index.theme');
  if (!fs.existsSync(indexTheme)) {
    fs.writeFileSync(indexTheme, [
      '[Icon Theme]',
      `Name=${manifest.name} Cursor`,
      'Comment=Cursor theme from Aura',
    ].join('\n'), 'utf8');
  }

  gsSet('org.gnome.desktop.interface', 'cursor-theme', `'${themeName}'`);
  return `Cursor theme installed: ${themeName}`;
}

function applyGtk(themeDir, manifest) {
  const gtkSrc = path.join(themeDir, 'gtk');
  if (!fs.existsSync(gtkSrc)) throw new Error('gtk/ directory not found');

  const themeName = `aura-${manifest.id}`;
  const dest = path.join(THEMES_DIR, themeName);

  ensureDir(THEMES_DIR);
  copyDir(gtkSrc, dest);

  gsSet('org.gnome.desktop.interface', 'gtk-theme', `'${themeName}'`);
  return `GTK theme installed: ${themeName}`;
}

function applyGnomeShell(themeDir, manifest) {
  const shellSrc = path.join(themeDir, 'gnome');
  if (!fs.existsSync(shellSrc)) throw new Error('gnome/ directory not found');

  const themeName = `aura-${manifest.id}`;
  const themeRoot = path.join(THEMES_DIR, themeName);
  const shellDest = path.join(themeRoot, 'gnome-shell');

  ensureDir(themeRoot);
  copyDir(shellSrc, shellDest);

  try {
    gsSet('org.gnome.shell.extensions.user-theme', 'name', `'${themeName}'`);
  } catch {
    throw new Error(
      'Cannot apply GNOME Shell theme. The "User Themes" extension must be installed and enabled. ' +
      'Install it from https://extensions.gnome.org/extension/19/user-themes/'
    );
  }

  return `GNOME Shell theme installed: ${themeName}`;
}

function applyTerminal(themeDir, manifest) {
  // Load palette
  const palettePath = path.join(themeDir, 'colors', 'palette.json');
  let palette;
  try {
    palette = JSON.parse(fs.readFileSync(palettePath, 'utf8'));
  } catch {
    // Try terminal/ directory for a terminal-specific config
    const termDir = path.join(themeDir, 'terminal');
    if (!fs.existsSync(termDir)) throw new Error('No color palette or terminal/ directory found');
    return applyTerminalFromDir(termDir);
  }

  // Try GNOME Terminal first
  const gnomeTermResult = tryApplyGnomeTerminal(palette);
  if (gnomeTermResult.success) return gnomeTermResult.message;

  // Fall back to Alacritty
  const alacrittyResult = tryApplyAlacritty(palette, manifest);
  if (alacrittyResult.success) return alacrittyResult.message;

  // Fall back to Kitty
  const kittyResult = tryApplyKitty(palette, manifest);
  if (kittyResult.success) return kittyResult.message;

  throw new Error('No supported terminal found (tried gnome-terminal, alacritty, kitty)');
}

function tryApplyGnomeTerminal(palette) {
  try {
    const profileList = execSync(
      "dconf read /org/gnome/terminal/legacy/profiles:/list",
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();

    const uuidMatch = profileList.match(/'([a-f0-9-]{36})'/);
    if (!uuidMatch) return { success: false };

    const uuid = uuidMatch[1];
    const base = `/org/gnome/terminal/legacy/profiles:/:${uuid}/`;

    const dconf = (key, val) =>
      execSync(`dconf write ${base}${key} ${val}`, { stdio: 'ignore' });

    dconf('use-theme-colors', 'false');
    dconf('background-color', `'${palette.background}'`);
    dconf('foreground-color', `'${palette.foreground}'`);
    dconf('bold-color-same-as-fg', 'true');

    return { success: true, message: 'Terminal colors applied to GNOME Terminal' };
  } catch {
    return { success: false };
  }
}

function tryApplyAlacritty(palette, manifest) {
  try {
    const configDir = path.join(HOME, '.config', 'alacritty');
    const colorsFile = path.join(configDir, 'aura-colors.toml');

    const toml = `# Generated by Aura — ${manifest.name}
[colors.primary]
background = "${palette.background}"
foreground = "${palette.foreground}"

[colors.normal]
black   = "${palette.background}"
red     = "${palette.error   || '#F28B82'}"
green   = "${palette.success || '#8FD694'}"
yellow  = "${palette.warning || '#F5C77A'}"
blue    = "${palette.primary}"
magenta = "${palette.secondary || palette.primary}"
cyan    = "${palette.accent  || palette.primary}"
white   = "${palette.foreground}"

[colors.bright]
black   = "${palette.surface || palette.background}"
red     = "${palette.error   || '#F28B82'}"
green   = "${palette.success || '#8FD694'}"
yellow  = "${palette.warning || '#F5C77A'}"
blue    = "${palette.primary}"
magenta = "${palette.secondary || palette.primary}"
cyan    = "${palette.accent  || palette.primary}"
white   = "${palette.foreground}"
`;

    ensureDir(configDir);
    fs.writeFileSync(colorsFile, toml, 'utf8');

    // Inject import into alacritty.toml if it exists and doesn't already import
    const mainConfig = path.join(configDir, 'alacritty.toml');
    if (fs.existsSync(mainConfig)) {
      let content = fs.readFileSync(mainConfig, 'utf8');
      if (!content.includes('aura-colors.toml')) {
        // Prepend an import line at the top
        content = `import = ["~/.config/alacritty/aura-colors.toml"]\n\n` + content;
        fs.writeFileSync(mainConfig, content, 'utf8');
      }
    }

    return { success: true, message: 'Terminal colors written to ~/.config/alacritty/aura-colors.toml' };
  } catch {
    return { success: false };
  }
}

function tryApplyKitty(palette, manifest) {
  try {
    const configDir = path.join(HOME, '.config', 'kitty');
    const colorsFile = path.join(configDir, 'aura-colors.conf');

    const conf = `# Generated by Aura — ${manifest.name}
background ${palette.background}
foreground ${palette.foreground}
color0  ${palette.background}
color1  ${palette.error   || '#F28B82'}
color2  ${palette.success || '#8FD694'}
color3  ${palette.warning || '#F5C77A'}
color4  ${palette.primary}
color5  ${palette.secondary || palette.primary}
color6  ${palette.accent  || palette.primary}
color7  ${palette.foreground}
`;

    ensureDir(configDir);
    fs.writeFileSync(colorsFile, conf, 'utf8');

    // Add include to kitty.conf if needed
    const mainConfig = path.join(configDir, 'kitty.conf');
    if (fs.existsSync(mainConfig)) {
      let content = fs.readFileSync(mainConfig, 'utf8');
      if (!content.includes('aura-colors.conf')) {
        content += '\ninclude aura-colors.conf\n';
        fs.writeFileSync(mainConfig, content, 'utf8');
      }
    }

    return { success: true, message: 'Terminal colors written to ~/.config/kitty/aura-colors.conf' };
  } catch {
    return { success: false };
  }
}

function applyTerminalFromDir(termDir) {
  // If the theme includes a pre-built terminal config file, copy it
  const files = fs.existsSync(termDir) ? fs.readdirSync(termDir) : [];

  if (files.includes('alacritty.toml') || files.includes('colors.toml')) {
    const src = path.join(termDir, files.find(f => f.includes('alacritty') || f.includes('colors')));
    const dest = path.join(HOME, '.config', 'alacritty', 'aura-colors.toml');
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    return 'Terminal config copied to ~/.config/alacritty/aura-colors.toml';
  }

  if (files.includes('kitty.conf') || files.includes('colors.conf')) {
    const src = path.join(termDir, files.find(f => f.includes('kitty') || f.includes('colors')));
    const dest = path.join(HOME, '.config', 'kitty', 'aura-colors.conf');
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    return 'Terminal config copied to ~/.config/kitty/aura-colors.conf';
  }

  throw new Error('No recognized terminal config file found in terminal/ directory');
}

// ── orchestrator ──────────────────────────────────────────────────────────────

const APPLIERS = {
  wallpaper: applyWallpaper,
  colors:    applyColors,
  icons:     applyIcons,
  cursor:    applyCursor,
  gtk:       applyGtk,
  gnome:     applyGnomeShell,
  terminal:  applyTerminal,
};

/**
 * Apply all enabled components of a theme, independently.
 *
 * @param {string} themeDir - Path to the extracted theme package directory
 * @param {object} manifest - Parsed manifest.json
 * @param {object} capabilities - Output of detector.detectEnvironment().capabilities
 * @returns {{ results: { [component]: { status, message } } }}
 */
function applyTheme(themeDir, manifest, capabilities) {
  const results = {};
  const components = manifest.components || {};

  for (const [component, enabled] of Object.entries(components)) {
    if (!enabled) {
      results[component] = { status: 'skipped', message: 'Not included in this theme' };
      continue;
    }

    // Check if the system supports this component
    const capKey = {
      wallpaper: 'wallpaper',
      colors:    'colorScheme',
      icons:     'iconTheme',
      cursor:    'cursorTheme',
      gtk:       'gtkTheme',
      gnome:     'gnomeShell',
      terminal:  'terminals',
    }[component];

    const cap = capabilities?.[capKey];
    if (cap === false || (Array.isArray(cap) && cap.length === 0)) {
      results[component] = {
        status: 'unsupported',
        message: `This component is not supported on your system`,
      };
      continue;
    }

    const applierFn = APPLIERS[component];
    if (!applierFn) {
      results[component] = { status: 'skipped', message: 'No applier for this component' };
      continue;
    }

    try {
      const message = applierFn(themeDir, manifest);
      results[component] = { status: 'success', message };
    } catch (err) {
      results[component] = {
        status: 'error',
        message: err.message || String(err),
      };
    }
  }

  return { results };
}

module.exports = { applyTheme };
