/* eslint-disable @typescript-eslint/no-require-imports */
// Design tokens live in src/theme/tokens.json (single source shared with src/theme/tokens.ts).
const tokens = require('./src/theme/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: tokens.colors.appBackground,
        surface: tokens.colors.surface,
        cream: tokens.colors.cream,
        ink: tokens.colors.questionInk,
        primary: tokens.colors.textPrimary,
        secondary: tokens.colors.textSecondary,
      },
      fontFamily: {
        display: [tokens.fonts.display],
        question: [tokens.fonts.question],
        body: [tokens.fonts.body],
      },
    },
  },
  plugins: [],
};
