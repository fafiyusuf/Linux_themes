// themes.js — Aura Theme Catalog
// Each theme represents a complete desktop aesthetic package

import wpCosmicLavender  from '../assets/wallpapers/cosmic-lavender.jpg';
import wpNorthernLights  from '../assets/wallpapers/northern-lights.jpg';
import wpSolarRose       from '../assets/wallpapers/solar-rose.jpg';
import wpMidnightOcean   from '../assets/wallpapers/midnight-ocean.jpg';
import wpForestMist      from '../assets/wallpapers/forest-mist.jpg';
import wpCyberpunkNeon   from '../assets/wallpapers/cyberpunk-neon.jpg';

// Icon previews (6 per theme, imported as asset URLs)
import icCL_terminal  from '../assets/icons/cosmic-lavender/terminal.svg?url';
import icCL_files     from '../assets/icons/cosmic-lavender/files.svg?url';
import icCL_browser   from '../assets/icons/cosmic-lavender/browser.svg?url';
import icCL_settings  from '../assets/icons/cosmic-lavender/settings.svg?url';
import icCL_calendar  from '../assets/icons/cosmic-lavender/calendar.svg?url';
import icCL_music     from '../assets/icons/cosmic-lavender/music.svg?url';

import icNL_terminal  from '../assets/icons/northern-lights/terminal.svg?url';
import icNL_files     from '../assets/icons/northern-lights/files.svg?url';
import icNL_browser   from '../assets/icons/northern-lights/browser.svg?url';
import icNL_settings  from '../assets/icons/northern-lights/settings.svg?url';
import icNL_calendar  from '../assets/icons/northern-lights/calendar.svg?url';
import icNL_music     from '../assets/icons/northern-lights/music.svg?url';

import icSR_terminal  from '../assets/icons/solar-rose/terminal.svg?url';
import icSR_files     from '../assets/icons/solar-rose/files.svg?url';
import icSR_browser   from '../assets/icons/solar-rose/browser.svg?url';
import icSR_settings  from '../assets/icons/solar-rose/settings.svg?url';
import icSR_calendar  from '../assets/icons/solar-rose/calendar.svg?url';
import icSR_music     from '../assets/icons/solar-rose/music.svg?url';

import icMO_terminal  from '../assets/icons/midnight-ocean/terminal.svg?url';
import icMO_files     from '../assets/icons/midnight-ocean/files.svg?url';
import icMO_browser   from '../assets/icons/midnight-ocean/browser.svg?url';
import icMO_settings  from '../assets/icons/midnight-ocean/settings.svg?url';
import icMO_calendar  from '../assets/icons/midnight-ocean/calendar.svg?url';
import icMO_music     from '../assets/icons/midnight-ocean/music.svg?url';

import icFM_terminal  from '../assets/icons/forest-mist/terminal.svg?url';
import icFM_files     from '../assets/icons/forest-mist/files.svg?url';
import icFM_browser   from '../assets/icons/forest-mist/browser.svg?url';
import icFM_settings  from '../assets/icons/forest-mist/settings.svg?url';
import icFM_calendar  from '../assets/icons/forest-mist/calendar.svg?url';
import icFM_music     from '../assets/icons/forest-mist/music.svg?url';

import icCN_terminal  from '../assets/icons/cyberpunk-neon/terminal.svg?url';
import icCN_files     from '../assets/icons/cyberpunk-neon/files.svg?url';
import icCN_browser   from '../assets/icons/cyberpunk-neon/browser.svg?url';
import icCN_settings  from '../assets/icons/cyberpunk-neon/settings.svg?url';
import icCN_calendar  from '../assets/icons/cyberpunk-neon/calendar.svg?url';
import icCN_music     from '../assets/icons/cyberpunk-neon/music.svg?url';

import icND_terminal  from '../assets/icons/nordic-dawn/terminal.svg?url';
import icND_files     from '../assets/icons/nordic-dawn/files.svg?url';
import icND_browser   from '../assets/icons/nordic-dawn/browser.svg?url';
import icND_settings  from '../assets/icons/nordic-dawn/settings.svg?url';
import icND_calendar  from '../assets/icons/nordic-dawn/calendar.svg?url';
import icND_music     from '../assets/icons/nordic-dawn/music.svg?url';

import icED_terminal  from '../assets/icons/ember-dusk/terminal.svg?url';
import icED_files     from '../assets/icons/ember-dusk/files.svg?url';
import icED_browser   from '../assets/icons/ember-dusk/browser.svg?url';
import icED_settings  from '../assets/icons/ember-dusk/settings.svg?url';
import icED_calendar  from '../assets/icons/ember-dusk/calendar.svg?url';
import icED_music     from '../assets/icons/ember-dusk/music.svg?url';

export const themes = [
  {
    id: 'cosmic-lavender',
    name: 'Cosmic Lavender',
    category: 'Space',
    style: ['Dark', 'Purple', 'Galaxy'],
    author: 'Aura Studio',
    version: '1.0.0',
    description: 'A deep-space lavender aesthetic. Soft purples and cosmic darkness create a serene, otherworldly desktop.',
    gradient: 'linear-gradient(135deg, #11101A 0%, #2D1B69 50%, #1a0a2e 100%)',
    wallpaper: wpCosmicLavender,
    accentColor: '#B58CFF',
    textColor: '#F4EEFF',
    // localPath: absolute path to the extracted theme package for the real engine.
    // In production this would be resolved from the installed themes directory.
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/cosmic-lavender',
    components: { wallpaper: true, colors: true, icons: true, cursor: true, gtk: true, gnome: true, terminal: true },
    icons: [
      { name: 'Terminal',  src: icCL_terminal  },
      { name: 'Files',     src: icCL_files     },
      { name: 'Browser',   src: icCL_browser   },
      { name: 'Settings',  src: icCL_settings  },
      { name: 'Calendar',  src: icCL_calendar  },
      { name: 'Music',     src: icCL_music     },
    ],
    colors: {
      background: '#11101A',
      surface: '#191625',
      foreground: '#F4EEFF',
      primary: '#B58CFF',
      secondary: '#7B61C9',
      accent: '#E3C8FF',
      success: '#8FD694',
      warning: '#F5C77A',
      error: '#F28B82',
    },
    downloads: 12400,
    rating: 4.9,
    tags: ['space', 'purple', 'dark', 'aesthetic'],
    featured: true,
    installed: false,
    applied: false,
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    category: 'Nature',
    style: ['Dark', 'Green', 'Aurora'],
    author: 'PixelForge',
    version: '1.2.0',
    description: 'Inspired by the Aurora Borealis. Electric greens and deep teals dance across your desktop.',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0d3b2e 40%, #1a5c3a 70%, #0a2a1a 100%)',
    wallpaper: wpNorthernLights,
    accentColor: '#00E5A0',
    textColor: '#D4FFF0',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/northern-lights',
    components: { wallpaper: true, colors: true, icons: true, cursor: true, gtk: true, gnome: false, terminal: true },
    icons: [
      { name: 'Terminal',  src: icNL_terminal  },
      { name: 'Files',     src: icNL_files     },
      { name: 'Browser',   src: icNL_browser   },
      { name: 'Settings',  src: icNL_settings  },
      { name: 'Calendar',  src: icNL_calendar  },
      { name: 'Music',     src: icNL_music     },
    ],
    colors: {
      background: '#0a1628',
      surface: '#0d2035',
      foreground: '#D4FFF0',
      primary: '#00E5A0',
      secondary: '#00B57D',
      accent: '#7FFFD4',
      success: '#00E5A0',
      warning: '#FFD700',
      error: '#FF6B6B',
    },
    downloads: 8900,
    rating: 4.7,
    tags: ['nature', 'green', 'dark', 'aurora'],
    featured: true,
    installed: false,
    applied: false,
  },
  {
    id: 'solar-rose',
    name: 'Solar Rose',
    category: 'Warm',
    style: ['Light', 'Pink', 'Sunset'],
    author: 'DawnThemes',
    version: '2.0.1',
    description: 'Warm pinks and golden ambers capture the magic hour. A luminous, energetic theme for daytime productivity.',
    gradient: 'linear-gradient(135deg, #FFF0E8 0%, #FFD4B2 40%, #FFB5A0 70%, #FF8C7A 100%)',
    wallpaper: wpSolarRose,
    accentColor: '#FF6B6B',
    textColor: '#2D1206',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/solar-rose',
    components: { wallpaper: true, colors: true, icons: true, cursor: false, gtk: true, gnome: true, terminal: true },
    icons: [
      { name: 'Terminal',  src: icSR_terminal  },
      { name: 'Files',     src: icSR_files     },
      { name: 'Browser',   src: icSR_browser   },
      { name: 'Settings',  src: icSR_settings  },
      { name: 'Calendar',  src: icSR_calendar  },
      { name: 'Music',     src: icSR_music     },
    ],
    colors: {
      background: '#FFF8F5',
      surface: '#FFF0E8',
      foreground: '#2D1206',
      primary: '#FF6B6B',
      secondary: '#FF8C7A',
      accent: '#FFB5A0',
      success: '#52C78E',
      warning: '#FFB347',
      error: '#E53E3E',
    },
    downloads: 6700,
    rating: 4.6,
    tags: ['light', 'warm', 'pink', 'productivity'],
    featured: false,
    installed: true,
    applied: false,
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    category: 'Dark',
    style: ['Dark', 'Blue', 'Minimal'],
    author: 'DeepBlue Labs',
    version: '1.4.0',
    description: 'The calm depth of the midnight sea. Deep navy blues and subtle cyan highlights for distraction-free focus.',
    gradient: 'linear-gradient(135deg, #020917 0%, #071b3e 50%, #0a2a5c 80%, #041224 100%)',
    wallpaper: wpMidnightOcean,
    accentColor: '#4FC3F7',
    textColor: '#E3F2FD',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/midnight-ocean',
    components: { wallpaper: true, colors: true, icons: true, cursor: true, gtk: true, gnome: true, terminal: true },
    icons: [
      { name: 'Terminal',  src: icMO_terminal  },
      { name: 'Files',     src: icMO_files     },
      { name: 'Browser',   src: icMO_browser   },
      { name: 'Settings',  src: icMO_settings  },
      { name: 'Calendar',  src: icMO_calendar  },
      { name: 'Music',     src: icMO_music     },
    ],
    colors: {
      background: '#020917',
      surface: '#071b3e',
      foreground: '#E3F2FD',
      primary: '#4FC3F7',
      secondary: '#0288D1',
      accent: '#B3E5FC',
      success: '#80CBC4',
      warning: '#FFD54F',
      error: '#EF9A9A',
    },
    downloads: 15200,
    rating: 4.8,
    tags: ['dark', 'blue', 'minimal', 'focus'],
    featured: true,
    installed: true,
    applied: true,
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    category: 'Nature',
    style: ['Dark', 'Green', 'Earthy'],
    author: 'Verdant Labs',
    version: '1.1.3',
    description: 'Morning mist through ancient trees. Muted olive greens and warm browns for a grounding, natural workspace.',
    gradient: 'linear-gradient(135deg, #0d1a0d 0%, #1a2e1a 45%, #2d4a1e 80%, #1a3310 100%)',
    wallpaper: wpForestMist,
    accentColor: '#8BC34A',
    textColor: '#E8F5E9',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/forest-mist',
    components: { wallpaper: true, colors: true, icons: false, cursor: false, gtk: true, gnome: false, terminal: true },
    icons: [],
    colors: {
      background: '#0d1a0d',
      surface: '#1a2e1a',
      foreground: '#E8F5E9',
      primary: '#8BC34A',
      secondary: '#689F38',
      accent: '#CCFF90',
      success: '#A5D6A7',
      warning: '#FFE082',
      error: '#EF9A9A',
    },
    downloads: 4300,
    rating: 4.5,
    tags: ['nature', 'green', 'earthy', 'calm'],
    featured: false,
    installed: false,
    applied: false,
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Synthwave',
    style: ['Dark', 'Neon', 'Cyberpunk'],
    author: 'NeonCity',
    version: '3.0.0',
    description: 'Rain-slicked streets and neon signs. Hot pink and electric cyan cut through the darkness of a dystopian cityscape.',
    gradient: 'linear-gradient(135deg, #080014 0%, #1a0033 40%, #2d0050 70%, #0a001a 100%)',
    wallpaper: wpCyberpunkNeon,
    accentColor: '#FF0090',
    textColor: '#FFE4FF',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/cyberpunk-neon',
    components: { wallpaper: true, colors: true, icons: true, cursor: true, gtk: true, gnome: true, terminal: true },
    icons: [
      { name: 'Terminal',  src: icCN_terminal  },
      { name: 'Files',     src: icCN_files     },
      { name: 'Browser',   src: icCN_browser   },
      { name: 'Settings',  src: icCN_settings  },
      { name: 'Calendar',  src: icCN_calendar  },
      { name: 'Music',     src: icCN_music     },
    ],
    colors: {
      background: '#080014',
      surface: '#1a0033',
      foreground: '#FFE4FF',
      primary: '#FF0090',
      secondary: '#00FFFF',
      accent: '#FF00FF',
      success: '#00FF88',
      warning: '#FFD700',
      error: '#FF4444',
    },
    downloads: 19800,
    rating: 4.9,
    tags: ['dark', 'neon', 'cyberpunk', 'synthwave'],
    featured: true,
    installed: false,
    applied: false,
  },
  {
    id: 'nordic-dawn',
    name: 'Nordic Dawn',
    category: 'Minimal',
    style: ['Light', 'Nordic', 'Minimal'],
    author: 'FjordThemes',
    version: '1.0.5',
    description: 'Clean Scandinavian minimalism. Cool whites and frosty greys inspired by nordic winter mornings.',
    gradient: 'linear-gradient(135deg, #ECEFF4 0%, #E5E9F0 50%, #D8DEE9 100%)',
    wallpaper: null,
    accentColor: '#5E81AC',
    textColor: '#2E3440',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/nordic-dawn',
    components: { wallpaper: true, colors: true, icons: true, cursor: true, gtk: true, gnome: true, terminal: true },
    icons: [
      { name: 'Terminal',  src: icND_terminal  },
      { name: 'Files',     src: icND_files     },
      { name: 'Browser',   src: icND_browser   },
      { name: 'Settings',  src: icND_settings  },
      { name: 'Calendar',  src: icND_calendar  },
      { name: 'Music',     src: icND_music     },
    ],
    colors: {
      background: '#ECEFF4',
      surface: '#E5E9F0',
      foreground: '#2E3440',
      primary: '#5E81AC',
      secondary: '#81A1C1',
      accent: '#88C0D0',
      success: '#A3BE8C',
      warning: '#EBCB8B',
      error: '#BF616A',
    },
    downloads: 9100,
    rating: 4.7,
    tags: ['light', 'minimal', 'nordic', 'clean'],
    featured: false,
    installed: false,
    applied: false,
  },
  {
    id: 'ember-dusk',
    name: 'Ember Dusk',
    category: 'Warm',
    style: ['Dark', 'Orange', 'Warm'],
    author: 'FireSide',
    version: '1.3.0',
    description: 'The warmth of embers at dusk. Deep charcoals and molten oranges for a cozy, focused evening session.',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 45%, #6b2d00 75%, #2d1000 100%)',
    wallpaper: null,
    accentColor: '#FF6B00',
    textColor: '#FFE8D0',
    localPath: '/home/newuser/Projects/Linux Themes/aura/themes/ember-dusk',
    components: { wallpaper: true, colors: true, icons: true, cursor: false, gtk: true, gnome: false, terminal: true },
    icons: [
      { name: 'Terminal',  src: icED_terminal  },
      { name: 'Files',     src: icED_files     },
      { name: 'Browser',   src: icED_browser   },
      { name: 'Settings',  src: icED_settings  },
      { name: 'Calendar',  src: icED_calendar  },
      { name: 'Music',     src: icED_music     },
    ],
    colors: {
      background: '#1a0a00',
      surface: '#3d1a00',
      foreground: '#FFE8D0',
      primary: '#FF6B00',
      secondary: '#E55800',
      accent: '#FFB347',
      success: '#7CB87C',
      warning: '#FFD700',
      error: '#FF4444',
    },
    downloads: 7600,
    rating: 4.6,
    tags: ['dark', 'warm', 'orange', 'cozy'],
    featured: false,
    installed: false,
    applied: false,
  },
];

export const categories = ['All', 'Featured', 'Dark', 'Light', 'Nature', 'Space', 'Synthwave', 'Minimal', 'Warm'];

export const getInstalledThemes = (themes) => themes.filter(t => t.installed);
export const getFeaturedThemes = (themes) => themes.filter(t => t.featured);
export const getAppliedTheme = (themes) => themes.find(t => t.applied);
