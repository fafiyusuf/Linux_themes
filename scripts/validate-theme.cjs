#!/usr/bin/env node
// scripts/validate-theme.cjs — run with: node scripts/validate-theme.cjs <theme-dir>
'use strict';
const { validateThemePackage } = require('../electron/engine/validator.js');
const path = require('path');
const themeDir = path.resolve(process.argv[2] || './themes/cosmic-lavender');
const result = validateThemePackage(themeDir);
console.log('\nTheme:', themeDir);
console.log('Valid:', result.valid);
if (result.errors.length)    console.log('Errors:\n ', result.errors.join('\n  '));
if (result.warnings.length)  console.log('Warnings:\n ', result.warnings.join('\n  '));
if (!result.errors.length && !result.warnings.length) console.log('No issues found.');
if (result.manifest) console.log('Components:', JSON.stringify(result.manifest.components, null, 2));
