# ذكر ودعاء - Islamic App

A complete Islamic web app with:
- 🤲 Arabic Duas (supplications)
- 🕋 Qibla direction finder
- 📿 Dhikr counter

## Files
- `index.html` — main app
- `manifest.json` — PWA manifest
- `sw.js` — service worker (offline support)

## How to host FREE on GitHub Pages

1. Create a free account at https://github.com
2. Click **New repository** → name it anything (e.g. `dhikr-app`)
3. Make it **Public**
4. Upload all 3 files (index.html, manifest.json, sw.js)
5. Go to **Settings** → **Pages** → Source: **main branch**
6. Your app will be live at: `https://YOUR-USERNAME.github.io/dhikr-app`

## Add icons (required for full PWA)
- Create a 192×192 PNG image named `icon-192.png`
- Create a 512×512 PNG image named `icon-512.png`
- Upload them alongside the other files
- Use a crescent moon & star or Kaaba as your icon design

## Convert to Android App (Play Store)
Once hosted, use https://pwabuilder.com:
1. Paste your GitHub Pages URL
2. Click **Package for stores**
3. Download the Android package (.aab)
4. Submit to Google Play Console ($25 one-time fee)

## Notes
- Qibla finder requires location permission in the browser
- App works offline after first visit (service worker cache)
