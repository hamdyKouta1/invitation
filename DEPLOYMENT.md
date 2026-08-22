# Wedding Invitation — Deployment Guide

## Quick Start (Development)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Configuration

All wedding data lives in ONE file: `src/config/weddingConfig.js`

Update:
- Groom & bride names + parents
- Wedding date & time
- Venue name & Google Maps URL
- Music URL (optional)
- Sharing URL

## Firebase Setup (Optional)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy `.env.example` to `.env`
4. Fill in Firebase credentials in `.env`
5. Set `VITE_FIREBASE_ENABLED=true`

**Firestore Collections to create:**
- `rsvps` — auto-populated by guests
- `gallery` — add image documents manually or via Admin panel
- `wishlist` — add items manually

**Firestore Security Rules (example):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{doc} {
      allow create: if request.auth == null &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 60 &&
        request.resource.data.guestsCount <= 10;
      allow read: if false; // Admin only via server SDK
    }
    match /gallery/{doc} {
      allow read: if true;
      allow write: if request.auth != null; // Admin only
    }
    match /wishlist/{doc} {
      allow read: if true;
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['status', 'reservedBy', 'reservedAt']); // Only reserve fields
      allow create, delete: if request.auth != null; // Admin only
    }
  }
}
```

## GitHub Pages Deployment

### Method 1: Manual

```bash
# Build for GitHub Pages
GITHUB_PAGES=true npm run build

# Push dist/ to gh-pages branch (use gh-pages package)
npx gh-pages -d dist
```

### Method 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_PAGES: true
          VITE_FIREBASE_ENABLED: ${{ secrets.VITE_FIREBASE_ENABLED }}
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Add Firebase credentials as **GitHub Secrets** (Settings > Secrets).

## URL Structure

Update these after deployment:
1. `src/config/weddingConfig.js` → `sharing.url`
2. `index.html` → all `og:url` and `og:image` meta tags
3. `vite.config.js` → `base` path (change `/wedding/` to your repo name)

## Customizing Names in index.html

After setting up the couple's names in `weddingConfig.js`, also update `index.html`:
- `<title>` tag
- `og:title` meta
- `og:description` meta
- `twitter:title` and `twitter:description`

## Adding Real Gallery Photos

**Option A — Firebase Storage:**
1. Upload photos to Firebase Storage
2. Add documents to `gallery` Firestore collection with `url`, `alt`, `aspectRatio`, `order` fields

**Option B — Static assets:**
1. Place photos in `public/gallery/`
2. Update `src/config/weddingConfig.js` → `gallery.mockImages` with the URLs

## Adding Wedding Music

1. Host an MP3 file (e.g., on Firebase Storage or a CDN)
2. Set the URL in `weddingConfig.js` → `music.url`
3. Ensure `music.enabled: true`
