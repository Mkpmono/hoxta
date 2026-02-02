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

### Register Page Flow
1. Navigate to `/register`
2. ✅ Verify: "New Customer" tab shows full registration form with WHMCS-compatible fields
3. ✅ Verify: "Existing Customer" tab links to `/panel/login`
4. Fill in required fields (firstname, lastname, email, password, phone, address1, city, postcode, country)
5. Check "I agree to Terms & Conditions"
6. Submit form
7. ✅ On success: redirects to `/panel` and shows toast "Account Created"
8. ✅ On error: shows inline error message from API

### Register → Checkout Flow
1. Navigate to `/checkout?category=games&product=minecraft&plan=standard&billing=monthly`
2. Click "Sign Up" or navigate to `/register?category=games&product=minecraft&plan=standard&billing=monthly`
3. Complete registration
4. ✅ Verify: After success, redirects back to checkout with params preserved
5. ✅ Verify: `/api/auth/me` returns profile data after registration

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
