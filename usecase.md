# Multi-Customer Provisioning Use Case Guide (`usecase.md`)

Step-by-step operator workflow for creating and deploying **two completely isolated customer invitation websites**:
- **Customer 1 (Couple A & B):** **Engagement** (`engagement` — حفل خطوبة)
- **Customer 2 (Couple C & D):** **Wedding** (`wedding` — حفل زفاف)

---

## One-Time Prerequisites (Do Once)

1. **Mark Your Main Repository as a GitHub Template:**
   - Open `https://github.com/hamdyKouta1/invitation/settings`
   - Check ✅ **Template repository**.
2. **Start Your Local Owner Admin Workbench:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/#owner-admin` and log in.

---

## Part 1: Provision Customer 1 — Couple A & B (`Engagement`)

### Step 1.1: Register A & B and Configure Their Engagement in `#owner-admin`
1. Open **Tab 1 (`سجل العملاء والعزل`)** in `#owner-admin`:
   - **Customer Name:** `A & B — Engagement`
   - **Customer Email:** `ab-couple@example.com`
   - **Repository Slug:** `invite-a-and-b`
   - **Dedicated Firebase Project ID:** `invite-a-and-b-prod`
   - **Event Type:** `حفل خطوبة (Engagement)`
   - **Theme:** Select their preferred theme (e.g., `romantic-floral`)
   - Click **"إنشاء سجل العميل وتوليد أوامر التجهيز المعزولة"**.
2. In the customer table, click **"تجهيز المحتوى"** next to `A & B — Engagement` (this opens **Tab 3** with `eventType: "engagement"` pre-selected):
   - Enter Groom `A` & Bride `B` names, family titles, engagement date/time, venue, and sections.
   - Click **"حفظ وتطبيق الإعدادات"**, then click **"تصدير weddingConfig.js"** to download their customized `weddingConfig.js`.

### Step 1.2: Create Dedicated Firebase Project for A & B (`invite-a-and-b-prod`)
1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project** → name it `invite-a-and-b-prod`.
2. **Enable Firestore:** Go to **Build → Firestore Database → Create database** (Production mode).
3. **Enable Authentication (for A & B's Customer Dashboard):**
   - Go to **Build → Authentication → Sign-in method** → Enable **Email/Password**.
   - Go to **Users → Add user** → create `ab-couple@example.com` + password (share these credentials with Couple A & B).
4. **Copy Web Config:** Go to **Project Settings → General → Your apps → Web (`</>`)** → Register app and copy `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`.

### Step 1.3: Create A & B's GitHub Repository & Deploy
```bash
# 1. Create A & B's isolated repo from your master template and clone it
gh repo create invite-a-and-b --template hamdyKouta1/invitation --public --clone
cd invite-a-and-b

# 2. Replace src/config/weddingConfig.js with the downloaded A & B weddingConfig.js file

# 3. Deploy hardened Firestore rules to A & B's Firebase project
npx firebase-tools deploy --only firestore:rules --project invite-a-and-b-prod

# 4. Set A & B's isolated GitHub Actions Secrets
gh secret set VITE_BASE_PATH --body "/invite-a-and-b/"
gh secret set VITE_CUSTOMER_SLUG --body "invite-a-and-b"
gh secret set VITE_FIREBASE_ENABLED --body "true"
gh secret set VITE_FIREBASE_API_KEY --body "AIzaSy_AB_KEY..."
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "invite-a-and-b-prod.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID --body "invite-a-and-b-prod"
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "invite-a-and-b-prod.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "111111111"
gh secret set VITE_FIREBASE_APP_ID --body "1:111111111:web:aaaa"
gh secret set VITE_OG_TITLE --body "دعوة خطوبة A & B | Engagement Invitation"

# 5. Commit config & push to trigger automatic GitHub Pages deployment
git add src/config/weddingConfig.js
git commit -m "Configure A & B Engagement Invitation"
git push origin main
```
- Enable GitHub Pages on `invite-a-and-b` (**Settings → Pages → Branch: `gh-pages`**).
- **Deliver to Couple A & B:**
  - **Public Engagement URL:** `https://hamdykouta1.github.io/invite-a-and-b/`
  - **Customer Dashboard URL:** `https://hamdykouta1.github.io/invite-a-and-b/#dashboard` (Login: `ab-couple@example.com`)

---

## Part 2: Provision Customer 2 — Couple C & D (`Wedding`)

### Step 2.1: Register C & D and Configure Their Wedding in `#owner-admin`
1. Return to your local `#owner-admin` → **Tab 1 (`سجل العملاء والعزل`)**:
   - **Customer Name:** `C & D — Wedding`
   - **Customer Email:** `cd-couple@example.com`
   - **Repository Slug:** `invite-c-and-d`
   - **Dedicated Firebase Project ID:** `invite-c-and-d-prod` *(Owner Admin rejects duplicate Firebase project IDs to guarantee isolation)*
   - **Event Type:** `حفل زفاف (Wedding)`
   - **Theme:** Select their preferred theme (e.g., `royal-classic` or `elegant-luxury`)
   - Click **"إنشاء سجل العميل وتوليد أوامر التجهيز المعزولة"**.
2. Click **"تجهيز المحتوى"** next to `C & D — Wedding`:
   - Fill in Groom `C` & Bride `D` names, parents, wedding date/time, venue, dress code, and wishlist items.
   - Click **"حفظ وتطبيق الإعدادات"**, then click **"تصدير weddingConfig.js"** to download C & D's `weddingConfig.js`.

### Step 2.2: Create Dedicated Firebase Project for C & D (`invite-c-and-d-prod`)
1. In [Firebase Console](https://console.firebase.google.com/) → **Add project** → name it `invite-c-and-d-prod`.
2. **Enable Firestore:** Create Firestore database in `invite-c-and-d-prod`.
3. **Enable Authentication:** Enable **Email/Password** and add user `cd-couple@example.com` + password.
4. **Copy Web Config:** Register Web App (`</>`) in `invite-c-and-d-prod` and copy its `VITE_FIREBASE_*` values.

### Step 2.3: Create C & D's GitHub Repository & Deploy
```bash
# 1. Create C & D's isolated repo from your master template and clone it
gh repo create invite-c-and-d --template hamdyKouta1/invitation --public --clone
cd invite-c-and-d

# 2. Replace src/config/weddingConfig.js with the downloaded C & D weddingConfig.js file

# 3. Deploy hardened Firestore rules to C & D's Firebase project
npx firebase-tools deploy --only firestore:rules --project invite-c-and-d-prod

# 4. Set C & D's isolated GitHub Actions Secrets
gh secret set VITE_BASE_PATH --body "/invite-c-and-d/"
gh secret set VITE_CUSTOMER_SLUG --body "invite-c-and-d"
gh secret set VITE_FIREBASE_ENABLED --body "true"
gh secret set VITE_FIREBASE_API_KEY --body "AIzaSy_CD_KEY..."
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "invite-c-and-d-prod.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID --body "invite-c-and-d-prod"
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "invite-c-and-d-prod.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "222222222"
gh secret set VITE_FIREBASE_APP_ID --body "1:222222222:web:bbbb"
gh secret set VITE_OG_TITLE --body "دعوة زفاف C & D | Wedding Invitation"

# 5. Commit config & push to trigger automatic GitHub Pages deployment
git add src/config/weddingConfig.js
git commit -m "Configure C & D Wedding Invitation"
git push origin main
```
- Enable GitHub Pages on `invite-c-and-d` (**Settings → Pages → Branch: `gh-pages`**).
- **Deliver to Couple C & D:**
  - **Public Wedding URL:** `https://hamdykouta1.github.io/invite-c-and-d/`
  - **Customer Dashboard URL:** `https://hamdykouta1.github.io/invite-c-and-d/#dashboard` (Login: `cd-couple@example.com`)

---

## Resulting Isolation Summary

| Feature | Couple A & B (Engagement) | Couple C & D (Wedding) |
|---|---|---|
| **Event Type & Labels** | `engagement` (*دعوة خطوبة / تفاصيل حفل الخطوبة*) | `wedding` (*دعوة زفاف / تفاصيل الحفل*) |
| **GitHub Repo & URL** | `invite-a-and-b` (`/invite-a-and-b/`) | `invite-c-and-d` (`/invite-c-and-d/`) |
| **Firebase Project** | `invite-a-and-b-prod` | `invite-c-and-d-prod` |
| **Customer Dashboard** | `#dashboard` (`ab-couple@example.com` — sees only A & B's guests) | `#dashboard` (`cd-couple@example.com` — sees only C & D's guests) |
| **Owner Admin (`#owner-admin`)** | Blocked (`403`) on public site | Blocked (`403`) on public site |

---

## Part 3: Publishing to Another GitHub User or Organization (e.g., `hamdyhkouta2/invvite-a-B`)

Because the template repository (`hamdyKouta1/invitation`) is public (or accessible to you) and `vite.config.js` uses `VITE_BASE_PATH`, you can publish any customer repository under **any other GitHub account or organization** (such as `hamdyhkouta2/invvite-a-B`).

The live URL will be:
- **Public Invitation:** `https://hamdyhkouta2.github.io/invvite-a-B/`
- **Customer Dashboard:** `https://hamdyhkouta2.github.io/invvite-a-B/#dashboard`

### Option A: Using GitHub CLI (`gh`) When Logged into `hamdyhkouta2` (or with Collaborator Access)
```bash
# 1. Create the repository directly under hamdyhkouta2 from the hamdyKouta1/invitation template
gh repo create hamdyhkouta2/invvite-a-B --template hamdyKouta1/invitation --public --clone
cd invvite-a-B

# 2. Place the downloaded weddingConfig.js in src/config/weddingConfig.js
#    (Make sure sharing.url in weddingConfig.js is set to "https://hamdyhkouta2.github.io/invvite-a-B/")

# 3. Set GitHub Actions Secrets on hamdyhkouta2/invvite-a-B
gh secret set VITE_BASE_PATH --repo hamdyhkouta2/invvite-a-B --body "/invvite-a-B/"
gh secret set VITE_CUSTOMER_SLUG --repo hamdyhkouta2/invvite-a-B --body "invvite-a-B"
gh secret set VITE_SITE_URL --repo hamdyhkouta2/invvite-a-B --body "https://hamdyhkouta2.github.io/invvite-a-B/"
gh secret set VITE_OG_IMAGE --repo hamdyhkouta2/invvite-a-B --body "https://hamdyhkouta2.github.io/invvite-a-B/og-image.jpg"
gh secret set VITE_FIREBASE_ENABLED --repo hamdyhkouta2/invvite-a-B --body "true"
gh secret set VITE_FIREBASE_API_KEY --repo hamdyhkouta2/invvite-a-B --body "AIzaSy..."
gh secret set VITE_FIREBASE_AUTH_DOMAIN --repo hamdyhkouta2/invvite-a-B --body "invite-a-and-b-prod.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID --repo hamdyhkouta2/invvite-a-B --body "invite-a-and-b-prod"
gh secret set VITE_FIREBASE_STORAGE_BUCKET --repo hamdyhkouta2/invvite-a-B --body "invite-a-and-b-prod.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --repo hamdyhkouta2/invvite-a-B --body "111111111"
gh secret set VITE_FIREBASE_APP_ID --repo hamdyhkouta2/invvite-a-B --body "1:111111111:web:aaaa"

# 4. Commit and push to hamdyhkouta2/invvite-a-B
git add src/config/weddingConfig.js
git commit -m "Deploy A & B invitation to hamdyhkouta2/invvite-a-B"
git push origin main
```

### Option B: Pushing From Your Local Folder Using Standard `git remote` (Without `gh` CLI)
1. Log into GitHub as `hamdyhkouta2` and create an empty **Public** repository named `invvite-a-B` (`https://github.com/hamdyhkouta2/invvite-a-B.git`).
2. Clone the template and push it to `hamdyhkouta2/invvite-a-B`:
   ```bash
   git clone https://github.com/hamdyKouta1/invitation.git invvite-a-B
   cd invvite-a-B
   git remote set-url origin https://github.com/hamdyhkouta2/invvite-a-B.git

   # Replace src/config/weddingConfig.js with A & B's config, then push:
   git add src/config/weddingConfig.js
   git commit -m "Configure A & B invitation"
   git push -u origin main
   ```
3. To deploy immediately from your local machine (or configure GitHub Secrets in `https://github.com/hamdyhkouta2/invvite-a-B/settings/secrets/actions`):
   - **In PowerShell (Local Direct Deploy to `gh-pages`):**
     ```powershell
     $env:VITE_BASE_PATH="/invvite-a-B/"
     $env:VITE_CUSTOMER_SLUG="invvite-a-B"
     npm run deploy
     ```
4. In `https://github.com/hamdyhkouta2/invvite-a-B/settings/pages`, set **Branch** to `gh-pages` → `/ (root)` → **Save**, and in **Firebase Console → Authentication → Settings → Authorized domains**, add `hamdyhkouta2.github.io`.

