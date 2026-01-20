# Hoxta Hosting Template

Premium hosting template with React, TypeScript, and Tailwind CSS.

## Quick Start

```sh
npm install
npm run dev
```

## Self-Test Checklist

### Game Servers Order Now Flow
1. Navigate to `/game-servers`
2. Click **Order Now** on any game card (e.g., Minecraft, FiveM, Rust)
3. ✅ Verify URL: `/checkout?category=games&product=<slug>&plan=<planId>&billing=monthly`
4. ✅ Verify checkout starts at "Your Details" step (skips plan selection)
5. Repeat for 3 different games

### i18n Language Switching
1. Click the 🌐 language switcher in the navbar
2. Switch between EN and RO
3. ✅ Verify: All UI text updates instantly without page refresh
4. ✅ Verify: Selection persists after page reload (stored in localStorage as `lang`)
5. ✅ Verify: Works on both public pages and `/panel` pages

## Technologies

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- react-i18next for internationalization
- Framer Motion for animations
- Edge Functions (Supabase) for WHMCS API proxy

## Architecture

- All WHMCS API calls go through Edge Functions (no PHP backend)
- Product catalog in `src/data/products.ts`
- i18n translations in `src/i18n/locales/{en,ro}/common.json`
