# Stage 1 (Pre-SaaS Sellable MVP) — Changes & New Features

Concise summary of the security, isolation, multi-event, and dashboard upgrades completed in **Stage 1 (Phases 1–5 + Gate 10A)**.

---

## 1. Security & Data Privacy (Phase 1)
- **Zero Exposed Secrets:** Removed all hardcoded admin credentials (`VITE_ADMIN_*`, `wedding2026`, `123456`), mail proxy secrets, and client-side `sessionStorage` OTP bypasses from the frontend bundle.
- **Guest PII Protection:** Separated public `wishes` (`name`, `message`, `createdAt` only) from private `rsvps` (contains `phone`, `attendance`, `guestsCount`). Public visitors cannot read guest phone numbers.
- **XSS & Upload Guards (`src/utils/security.js`):** Added `sanitizeUrl()` (`http://` & `https://` allowlist), `validateImageFile()` / `isSafeImageUrl()` (blocks `image/svg+xml` XSS and files > 2 MB), and a baseline CSP `<meta>` header in `index.html`.

---

## 2. Repository & Firebase Isolation Per Customer (Phases 2 & 4)
- **One Customer = One Repo + One Firebase Project:**
  - Parameterized `vite.config.js` (`VITE_BASE_PATH`) and Open Graph `<meta>` tags (`VITE_OG_TITLE`, `VITE_OG_DESCRIPTION`, `VITE_OG_IMAGE`, `VITE_SITE_URL`).
  - Namespaced all `localStorage` keys per customer (`VITE_CUSTOMER_SLUG` / `VITE_FIREBASE_PROJECT_ID`) via `getScopedStorageKey()`.
  - Added `.gitattributes` (`merge=ours` on `src/config/weddingConfig.js`) so template updates never overwrite customer data.
  - Added `.github/workflows/deploy.yml` for automated per-repository CI/CD and bundle security verification.
  - Added `firestore.rules` and `firebase.json` enforcing Firebase Auth (`request.auth != null`) for reading/deleting `rsvps` and updating `config`/`gallery`.

---

## 3. Multiple Event Types & UI Enhancements (Phase 3)
- **10 Supported Event Types (`src/config/eventTypesConfig.js`):**
  `wedding`, `engagement`, `birthday`, `private_party`, `graduation`, `baby_shower`, `anniversary`, `corporate`, `conference`, and `custom` — all compatible with the 5 visual themes and 100% backward-compatible with `weddingConfig.js`.
- **Component Upgrades:**
  - `Hero.jsx`, `Families.jsx`, & `WeddingDetails.jsx` adapt headings and badges dynamically to the active `eventType`.
  - Added optional multi-slot **Event Agenda / Timeline** (`config.agenda`) in `WeddingDetails.jsx`.
  - Added customizable color palettes in `DressCode.jsx` and replaced `window.prompt()` with an accessible React modal in `Wishlist.jsx`.

---

## 4. Separated Customer Dashboard & Owner Admin (Phase 5)
| Interface | URL Route | Target User | Key Features |
|---|---|---|---|
| **Customer Dashboard** (`src/components/CustomerDashboard/`) | `#dashboard` or `#admin` | **Event Customer** (via Firebase Auth) | View RSVPs & phone numbers, attendance KPIs, search/filter guests, delete spam RSVPs/wishes, export **CSV/JSON**, manage gallery photos. Zero Owner Admin controls. |
| **Owner Admin** (`src/components/OwnerAdmin/`) | `#owner-admin` *(Dev / Operator Only)* | **Platform Owner** (`403` blocked on customer sites) | Register customers, enforce unique Firebase project IDs, select from 10 event types & 5 themes, edit dynamic sections/wishlist, generate CLI provisioning commands & export `weddingConfig.js`. |

---

## 5. Verification & Commands (Phase 9A & Gate 10A)
- **Code Splitting:** `CustomerDashboard` and `OwnerAdmin` are lazy-loaded (`React.lazy`), reducing the main public JS bundle from **310 kB** to **178 kB**.
- **Run Build & Verification Tests:**
  ```bash
  npm run build
  npm test
  ```
