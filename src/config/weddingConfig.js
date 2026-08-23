/**
 * ============================================================
 * WEDDING CONFIGURATION — Edit this file to customize your
 * invitation. All wedding-specific data lives here.
 * ============================================================
 */

// ─── 1. COUPLE & FAMILIES (Single Source of Truth) ──────────
const groom = {
  name: "حمـدى",
  nameEn: "Hamdy",
  familyTitleAr: "عائلة قوطه",
  familyTitleEn: "The Kouta Family",
  father: "محمد قوطه",
  fatherEn: "Mohamed Kouta",
  mother: "سلوي عبد المقصود",
  motherEn: "Salwa Abdelmaksoud",
  showMother: false, // Toggle to false to hide mother's name
};

const bride = {
  name: "رودينـا",
  nameEn: "Rodina",
  familyTitleAr: "عائلة حمودة",
  familyTitleEn: "The Hamoda Family",
  father: "محمد حمودة",
  fatherEn: "Mohamed Hamoda",
  mother: "عبير غانم",
  motherEn: "Abeer Ghanem",
  showMother: false, // Toggle to false to hide mother's name
};

// ─── 2. MAIN CONFIGURATION OBJECT ────────────────────────────
const weddingConfig = {
  /**
   * ─── LANGUAGE ─────────────────────────────────────────────
   * Default language for the invitation: 'ar' (Arabic) or 'en' (English)
   */
  defaultLanguage: "en",

  /**
   * ─── COUPLE ──────────────────────────────────────────────
   */
  groom,
  bride,

  // Family Invitation Phrase (Auto-generated from family titles)
  invitationPhraseAr: `تتشرف ${groom.familyTitleAr} و${bride.familyTitleAr} بدعوتكم لحضور حفل زفاف نجليهما`,
  invitationPhraseEn: `${groom.familyTitleEn} & ${bride.familyTitleEn} cordially request the honor of your presence at the wedding of their children`,

  /**
   * ─── WEDDING DATE & TIME ─────────────────────────────────
   * date: ISO date string (YYYY-MM-DD)
   * time: Display string
   * timeEn: English display string
   * dateTime: Full ISO datetime for countdown (Africa/Cairo timezone)
   */
  wedding: {
    date: "2026-09-11",
    dateDisplay: "١١ سبتمبر ٢٠٢٦",
    dateDisplayEn: "11 September 2026",
    dayAr: "الجمعة",
    dayEn: "Friday",
    time: "٥:٠٠ مساءً",
    timeEn: "5:00 PM",
    // Full ISO datetime — used for countdown (Egypt = UTC+2)
    dateTime: "2026-09-11T17:00:00+02:00",
    timezone: "Africa/Cairo",
  },

  /**
   * ─── VENUE ───────────────────────────────────────────────
   */
  venue: {
    nameAr: "حديقة جراند لامور",
    nameEn: "Garden Grand Lamour",
    addressAr: "شارع 23 يوليو، بورسعيد",
    addressEn: "23 jul St, Port Said",
    cityAr: "بورسعيد، مصر",
    cityEn: "Port Said, Egypt",
    descriptionAr: "قلب بورسعيد العريق بجوار البحر ",
    descriptionEn: "In the heart of historic Port Said, by the Sea",
    // Replace with real Google Maps URL
    mapsUrl: "https://maps.app.goo.gl/RnjQCZTrd8nHVCC19",
    // Embed URL for iframe map
    mapsEmbedUrl: "https://maps.google.com/maps?q=Garden+Grand+Lamour+Port+Said+Egypt&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },

  /**
   * ─── MUSIC ───────────────────────────────────────────────
   * Set enabled to true and provide a URL to enable background music
   */
  music: {
    enabled: true,
    // Background wedding song
    url: "/Die-with-a-smile.mp3",
    titleAr: "موسيقى الحفل",
    titleEn: "Wedding Music",
  },

  /**
   * ─── GALLERY ─────────────────────────────────────────────
   */
  gallery: {
    enabled: true,
    // When Firebase is enabled, images are loaded from Firestore
    // Otherwise, images below are used as mock data
    mockImages: [
      { id: "1", url: "", alt: "Couple photo 1", aspectRatio: "portrait" },
      { id: "2", url: "", alt: "Couple photo 2", aspectRatio: "landscape" },
      { id: "3", url: "", alt: "Couple photo 3", aspectRatio: "portrait" },
      { id: "4", url: "", alt: "Couple photo 4", aspectRatio: "square" },
      { id: "5", url: "", alt: "Couple photo 5", aspectRatio: "landscape" },
      { id: "6", url: "", alt: "Couple photo 6", aspectRatio: "portrait" },
    ],
  },

  /**
   * ─── DRESS CODE ───────────────────────────────────────────
   */
  dressCode: {
    enabled: true,
  },

  /**
   * ─── WISHLIST (Disabled) ──────────────────────────────────
   */
  wishlist: {
    enabled: false,
  },

  /**
   * ─── RSVP ─────────────────────────────────────────────────
   */
  rsvp: {
    enabled: true,
    maxGuests: 10,
    // Optional: unique ID for this invitation instance
    invitationId: "wedding-2026",
  },

  /**
   * ─── SHARING ──────────────────────────────────────────────
   */
  sharing: {
    // Live GitHub Pages URL
    url: "https://hamdyKouta1.github.io/invitation/",
    // WhatsApp share message template (use {url} placeholder)
    messageAr: `🎉 دعوة زفاف ${groom.name} و${bride.name} — شاركونا فرحتنا! {url}`,
    messageEn: `🎉 ${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation — Join us on our special day! {url}`,
  },

  /**
   * ─── SEO & META ───────────────────────────────────────────
   */
  meta: {
    titleAr: `دعوة زفاف ${groom.name} و${bride.name}`,
    titleEn: `${groom.nameEn} & ${bride.nameEn}'s Wedding Invitation`,
    descriptionAr: "يسعدنا دعوتكم لمشاركتنا فرحة زفافنا في بورسعيد",
    descriptionEn: "We joyfully invite you to celebrate our wedding in Port Said",
    // OG image URL
    ogImageUrl: "https://hamdyKouta1.github.io/invitation/og-image.jpg",
    faviconUrl: "/favicon.svg",
  },

  /**
   * ─── ANALYTICS ────────────────────────────────────────────
   * Set enabled to true and provide a measurement ID
   */
  analytics: {
    enabled: false,
    measurementId: "",
  },

  /**
   * ─── FIREBASE ─────────────────────────────────────────────
   * Firebase config is loaded from environment variables.
   * Set VITE_FIREBASE_ENABLED=true in .env to activate Firebase.
   * See .env.example for required variables.
   */
};

export default weddingConfig;
