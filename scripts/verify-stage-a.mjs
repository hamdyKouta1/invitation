/**
 * ============================================================================
 * STAGE A (PHASES 1–5 + GATE 10A) AUTOMATED VERIFICATION & ISOLATION TEST SUITE
 * ============================================================================
 * Executes:
 *   1. Phase 1 Security Tests (sanitizeUrl, SVG upload blocking, OTP removal, bundle scan)
 *   2. Phase 2 & 4 Customer Isolation Tests (ISO-TEST-01: Customer A vs Customer B, PII protection, firestore.rules)
 *   3. Phase 3 Multiple Event Types & 5-Theme Engine Tests (All 10 event types + backward compatibility)
 *   4. Phase 5 Role Separation Tests (Customer Dashboard vs Owner Admin boundary)
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const bundleOnly = process.argv.includes('--bundle-only');

// ─── Browser Globals Mock for Node Testing ────────────────────
const storageMap = new Map();
globalThis.localStorage = {
  getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k),
  clear: () => storageMap.clear(),
};

const domAttributes = new Map();
globalThis.document = {
  documentElement: {
    setAttribute: (k, v) => domAttributes.set(k, v),
    getAttribute: (k) => domAttributes.get(k),
    classList: { add: () => {}, remove: () => {} },
  },
  body: { setAttribute: () => {} },
  head: { appendChild: () => {} },
  getElementById: () => null,
  createElement: () => ({}),
  querySelector: () => null,
};

globalThis.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};

console.log('======================================================================');
console.log('🚀 VERIFYING STAGE A (PRE-SAAS SELLABLE MVP: PHASES 1–5 + GATE 10A)');
console.log('======================================================================\n');

// ─── 1. Production Bundle Secret Scan (SEC-001, SEC-002, SEC-004) ───
const distAssetsDir = path.join(projectRoot, 'dist', 'assets');
if (fs.existsSync(distAssetsDir)) {
  const jsFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
  assert.ok(jsFiles.length > 0, 'dist/assets should contain built JS chunks');

  const forbiddenLiterals = [
    'wedding2026',
    'wedding_admin_2fa_auth',
    'wedding_admin_otp_session',
    'x-api-secret',
  ];

  for (const file of jsFiles) {
    const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
    for (const forbidden of forbiddenLiterals) {
      assert.ok(
        !content.includes(forbidden),
        `SECURITY FAILURE: Forbidden secret/bypass literal "${forbidden}" found in bundle ${file}`
      );
    }
  }
  console.log(`✅ [Phase 1 / Gate 10A] Production bundle scan passed across ${jsFiles.length} JS chunks (0 leaked secrets).`);
}

if (bundleOnly) {
  process.exit(0);
}

// Import application modules
const {
  sanitizeUrl,
  validateImageFile,
  isSafeImageUrl,
  setCustomerNamespaceOverride,
  getCustomerNamespace,
  getScopedStorageKey,
} = await import('file:///' + path.join(projectRoot, 'src/utils/security.js').replace(/\\/g, '/'));

const { generateOTP, verifyOTP } = await import(
  'file:///' + path.join(projectRoot, 'src/services/mail/otpService.js').replace(/\\/g, '/')
);

const { EVENT_TYPES, isValidEventTypeId, getEventTypeById } = await import(
  'file:///' + path.join(projectRoot, 'src/config/eventTypesConfig.js').replace(/\\/g, '/')
);

const { WEDDING_THEMES, isValidThemeId } = await import(
  'file:///' + path.join(projectRoot, 'src/config/themesConfig.js').replace(/\\/g, '/')
);

const {
  mergeConfig,
  getActiveConfig,
  saveActiveConfig,
  resetActiveConfig,
} = await import('file:///' + path.join(projectRoot, 'src/utils/configManager.js').replace(/\\/g, '/'));

const mockService = await import(
  'file:///' + path.join(projectRoot, 'src/services/mock/mockService.js').replace(/\\/g, '/')
);

// ─── 2. Phase 1 Security Unit Tests (SEC-002, SEC-006, SEC-007) ──────
assert.equal(sanitizeUrl('https://maps.google.com/test'), 'https://maps.google.com/test');
assert.equal(sanitizeUrl('http://example.com/gift'), 'http://example.com/gift');
assert.equal(sanitizeUrl('/couple-illustration.png'), '/couple-illustration.png');
assert.equal(sanitizeUrl('#rsvp'), '#rsvp');
assert.equal(sanitizeUrl('javascript:alert(1)', ''), '', 'Must block javascript: XSS');
assert.equal(sanitizeUrl('JAVASCRIPT:alert(document.cookie)', ''), '', 'Must block uppercase JAVASCRIPT:');
assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>', ''), '', 'Must block data:text/html');
assert.equal(sanitizeUrl('//evil.example.com/payload', ''), '', 'Must block protocol-relative URLs');

assert.equal(
  validateImageFile({ name: 'photo.jpg', type: 'image/jpeg', size: 500 * 1024 }).valid,
  true
);
assert.equal(
  validateImageFile({ name: 'attack.svg', type: 'image/svg+xml', size: 1024 }).valid,
  false,
  'Must block SVG files (SEC-007)'
);
assert.equal(
  validateImageFile({ name: 'huge.png', type: 'image/png', size: 5 * 1024 * 1024 }).valid,
  false,
  'Must block oversized >2MB files (SEC-007)'
);
assert.equal(isSafeImageUrl('data:image/svg+xml;base64,PHN2Zz4='), false, 'Must block SVG data URIs');
assert.equal(isSafeImageUrl('data:image/png;base64,iVBORw0KGgo='), true, 'Must allow raster PNG data URIs');

assert.throws(() => generateOTP(), /deprecated/i, 'Client-side OTP must be disabled (SEC-002)');
assert.equal(verifyOTP('123456').valid, false);
console.log('✅ [Phase 1] Security unit tests passed (sanitizeUrl XSS guard, SVG upload blocker, client OTP disabled).');

// ─── 3. Phase 2 & Phase 4 Customer Isolation Tests (ISO-TEST-01) ─────
globalThis.localStorage.clear();

// Provision Customer A
setCustomerNamespaceOverride('invite-customer-a');
assert.equal(getCustomerNamespace(), 'invite-customer-a');
assert.equal(getScopedStorageKey('wedding_rsvps'), 'wedding_rsvps__invite-customer-a');

saveActiveConfig({
  eventType: 'wedding',
  theme: 'elegant-luxury',
  groom: { name: 'أحمد (العميل أ)', nameEn: 'Ahmed (Customer A)' },
  bride: { name: 'سارة (العميل أ)', nameEn: 'Sara (Customer A)' },
});
await mockService.submitRSVP({
  name: 'ضيف العميل أ',
  phone: '01011111111',
  attendance: 'will_attend',
  guestsCount: 2,
  message: 'مبروك لأحمد وسارة من ضيف أ!',
});

// Provision Customer B
setCustomerNamespaceOverride('invite-customer-b');
assert.equal(getCustomerNamespace(), 'invite-customer-b');
assert.equal(getScopedStorageKey('wedding_rsvps'), 'wedding_rsvps__invite-customer-b');

saveActiveConfig({
  eventType: 'conference',
  theme: 'minimalist-modern',
  groom: { name: 'قمة التقنية (العميل ب)', nameEn: 'Tech Summit (Customer B)' },
});
await mockService.submitRSVP({
  name: 'ضيف العميل ب',
  phone: '01222222222',
  attendance: 'will_attend',
  guestsCount: 0,
  message: 'بالتوفيق في مؤتمر التقنية من ضيف ب!',
});

// Verify Customer A sees ONLY Customer A's config, RSVPs, and wishes
setCustomerNamespaceOverride('invite-customer-a');
const cfgA = getActiveConfig();
const guestsA = await mockService.getGuests();
const wishesA = await mockService.getWishes();
assert.equal(cfgA.theme, 'elegant-luxury');
assert.equal(cfgA.groom.name, 'أحمد (العميل أ)');
assert.equal(guestsA.length, 1, 'Customer A must have exactly 1 RSVP');
assert.equal(guestsA[0].name, 'ضيف العميل أ');
assert.equal(guestsA[0].phone, '01011111111');
assert.equal(wishesA.length, 1, 'Customer A must have exactly 1 public wish');
assert.equal(wishesA[0].message, 'مبروك لأحمد وسارة من ضيف أ!');
assert.equal('phone' in wishesA[0], false, 'SEC-005: Public wishes must NEVER expose guest phone numbers');

// Verify Customer B sees ONLY Customer B's config, RSVPs, and wishes
setCustomerNamespaceOverride('invite-customer-b');
const cfgB = getActiveConfig();
const guestsB = await mockService.getGuests();
const wishesB = await mockService.getWishes();
assert.equal(cfgB.eventType, 'conference');
assert.equal(cfgB.theme, 'minimalist-modern');
assert.equal(guestsB.length, 1, 'Customer B must have exactly 1 RSVP');
assert.equal(guestsB[0].name, 'ضيف العميل ب');
assert.equal(wishesB.length, 1);
assert.equal(wishesB[0].message, 'بالتوفيق في مؤتمر التقنية من ضيف ب!');
assert.equal('phone' in wishesB[0], false, 'SEC-005: Public wishes must NEVER expose guest phone numbers');

// Verify deleting a guest in Customer A does not affect Customer B
setCustomerNamespaceOverride('invite-customer-a');
await mockService.deleteGuest(guestsA[0].id);
assert.equal((await mockService.getGuests()).length, 0, 'Customer A RSVP deleted');
setCustomerNamespaceOverride('invite-customer-b');
assert.equal((await mockService.getGuests()).length, 1, 'Customer B RSVP remains untouched');

// Reset namespace override
setCustomerNamespaceOverride(null);

// Verify firestore.rules & .gitattributes exist and enforce boundaries
const rulesContent = fs.readFileSync(path.join(projectRoot, 'firestore.rules'), 'utf8');
assert.ok(rulesContent.includes('match /rsvps/{document}'), 'firestore.rules must define /rsvps rules');
assert.ok(rulesContent.includes('allow read, update, delete: if isAuthenticatedCustomer()'), 'rsvps read/delete must require auth');
assert.ok(rulesContent.includes('match /wishes/{document}'), 'firestore.rules must define /wishes rules');
assert.ok(rulesContent.includes("!('phone' in data)"), 'wishes rule must forbid phone field');

const gitattributesContent = fs.readFileSync(path.join(projectRoot, '.gitattributes'), 'utf8');
assert.ok(gitattributesContent.includes('src/config/weddingConfig.js merge=ours'), '.gitattributes must protect weddingConfig.js');
console.log('✅ [Phase 2 & Phase 4] Customer Isolation Suite (ISO-TEST-01) passed (Customer A vs Customer B 100% isolated, PII protected).');

// ─── 4. Phase 3 Multiple Event Types & 5-Theme Engine Tests ──────────
const expectedEventTypes = [
  'wedding',
  'engagement',
  'birthday',
  'private_party',
  'graduation',
  'baby_shower',
  'anniversary',
  'corporate',
  'conference',
  'custom',
];
assert.equal(EVENT_TYPES.length, 10, 'Must support all 10 commercial event types');
for (const etId of expectedEventTypes) {
  assert.ok(isValidEventTypeId(etId), `Event type ${etId} must be valid`);
  const mergedEt = mergeConfig({ eventType: etId, groom: { name: 'اختبار', nameEn: 'Test' } });
  assert.equal(mergedEt.eventType, etId);
  assert.equal(mergedEt.eventMeta.id, etId);
}
assert.equal(WEDDING_THEMES.length, 6, 'Must include all 6 visual themes (including golden-theme)');
assert.ok(isValidThemeId('golden-theme'), 'golden-theme must be registered in WEDDING_THEMES');
for (const th of WEDDING_THEMES) {
  assert.ok(isValidThemeId(th.id));
}

// Verify backward compatibility with default Hamdy & Rodina weddingConfig.js
globalThis.localStorage.clear();
resetActiveConfig();
const defaultHamdyConfig = getActiveConfig();
assert.equal(defaultHamdyConfig.eventType, 'wedding');
assert.equal(defaultHamdyConfig.theme, 'default');
assert.equal(defaultHamdyConfig.groom.nameEn, 'Hamdy');
assert.equal(defaultHamdyConfig.bride.nameEn, 'Rodina');
console.log('✅ [Phase 3] All 10 Event Types, 5 Visual Themes, and Hamdy & Rodina backward compatibility verified.');

// ─── 5. Phase 5 Role Separation Tests (DASH-TEST-02 & OWNER-TEST-03) ─
const customerDashSource = fs.readFileSync(
  path.join(projectRoot, 'src/components/CustomerDashboard/CustomerDashboard.jsx'),
  'utf8'
);
const ownerAdminSource = fs.readFileSync(
  path.join(projectRoot, 'src/components/OwnerAdmin/OwnerAdmin.jsx'),
  'utf8'
);
assert.ok(
  !customerDashSource.includes('CUSTOMERS_REGISTRY_KEY') && !customerDashSource.includes('handleCreateCustomerRecord'),
  'CustomerDashboard must NOT contain Owner Admin customer provisioning controls'
);
assert.ok(
  ownerAdminSource.includes('403 — غير مصرح بالدخول (Owner Admin Disabled)'),
  'OwnerAdmin must enforce 403 gate when OWNER_ADMIN_ENABLED is false'
);
console.log('✅ [Phase 5] Customer Dashboard & Owner Admin separation verified (DASH-TEST-02 & OWNER-TEST-03).');

console.log('\n🎉 ALL STAGE A (PHASES 1–5 + GATE 10A) ACCEPTANCE TESTS PASSED!');
