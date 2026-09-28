# Theme Packages

This directory contains sample `.fytheme` packages for development and testing.

Each subdirectory is an extracted theme package. In production, themes would be
distributed as `<name>.fytheme` files (zip archives with this same structure).

## Structure

```
<theme-id>/
├── manifest.json           ← Required. Package metadata and component list.
├── wallpaper/
│   └── *.jpg|png|webp|svg  ← At least one wallpaper file.
├── colors/
│   └── palette.json        ← Color palette with hex values.
├── icons/
│   ├── index.theme         ← GTK icon theme index.
│   └── apps/scalable/      ← SVG application icons.
├── cursor/
│   ├── index.theme
│   └── cursors/            ← XCursor binary files (*.xcursor).
├── gtk/
│   └── gtk-4.0/gtk.css     ← GTK4 theme CSS.
└── gnome/
    └── gnome-shell.css     ← GNOME Shell CSS (requires User Themes extension).
```

## Testing

Run the validator against a package:

```js
const { validateThemePackage } = require('./electron/engine/validator.js');
const result = validateThemePackage('./themes/cosmic-lavender');
console.log(result);
```

Apply via the Electron app using `npm run electron:dev`, then use the
"Import .fytheme" button or set `localPath` in `src/data/themes.js` to point
to the absolute path of a theme directory here.
