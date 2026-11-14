/**
 * ============================================================
 * WEDDING INVITATION THEMES REGISTRY
 * Scalable architecture for managing and previewing themes.
 * Adding a future theme only requires adding a descriptor here
 * and a matching `html[data-theme="<id>"]` block in `themes.css`.
 * ============================================================
 */

export const DEFAULT_THEME_ID = 'default';
export const THEME_STORAGE_KEY = 'wedding_active_theme';

export const WEDDING_THEMES = [
  {
    id: 'default',
    isDefault: true,
    nameAr: 'العاجي الدافئ والذهبي (التصميم الأصلي)',
    nameEn: 'Warm Ivory & Gold (Original Default)',
    categoryAr: 'التصميم الافتراضي الحالي',
    categoryEn: 'Original Default Theme',
    descriptionAr:
      'التصميم الكلاسيكي الدافئ بدرجات العاجي والكريمي مع ورود الألوان المائية الناعمة وأوراق الميرمية ولمسات الذهبي الهادئة.',
    descriptionEn:
      'The signature warm ivory stationery design featuring soft blush watercolor florals, botanical sage leaves, and classic gold accents.',
    themeColor: '#F8F4EF',
    palette: [
      { hex: '#F8F4EF', nameAr: 'عاجي دافئ', nameEn: 'Warm Ivory' },
      { hex: '#D4A5A5', nameAr: 'وردي هادئ', nameEn: 'Dusty Blush' },
      { hex: '#8B9E7A', nameAr: 'أخضر ميرمية', nameEn: 'Botanical Sage' },
      { hex: '#C9A96E', nameAr: 'ذهبي كلاسيكي', nameEn: 'Antique Gold' },
      { hex: '#3D2B1F', nameAr: 'بني دافئ', nameEn: 'Warm Espresso' },
    ],
    typography: {
      displayEn: 'Great Vibes',
      headingEn: 'Cormorant Garamond',
      bodyEn: 'Lato',
      displayAr: 'Aref Ruqaa',
      bodyAr: 'Alexandria',
    },
    featuresAr: ['خلفية ورقية عاجية دافئة', 'زخارف ورد مائية ناعمة', 'إطار مقوس كلاسيكي بلمسات ذهبية'],
    featuresEn: ['Warm textured ivory paper', 'Watercolor floral corners', 'Classic gold-trimmed arch frame'],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FDFAF6 0%, #F0E8DC 100%)',
      cardBg: 'rgba(253, 250, 246, 0.85)',
      cardBorder: '1px solid rgba(201, 169, 110, 0.45)',
      cardRadius: '60px 60px 12px 12px',
      textPrimary: '#3D2B1F',
      textSecondary: '#6B4C3B',
      accent: '#C9A96E',
      buttonBg: 'linear-gradient(135deg, #C9A96E 0%, #B8924A 100%)',
      buttonText: '#FDFAF6',
      buttonRadius: '999px',
      sealBg: 'radial-gradient(circle at 35% 35%, #E6C868 0%, #B8924A 70%, #947234 100%)',
      envelopeBg: '#EDE4D8',
      envelopeFlap: '#F6EFE6',
      ornament: '✦',
    },
  },
  {
    id: 'elegant-luxury',
    isDefault: false,
    nameAr: 'الفخامة الذهبية (Elegant Luxury)',
    nameEn: 'Elegant Luxury (Noir & Gold)',
    categoryAr: 'فخامة سهرات المساء',
    categoryEn: 'Black-Tie Haute Couture',
    descriptionAr:
      'تصميم فاخر مستوحى من حفلات المساء الملكية، يجمع بين الخلفية المخملية الداكنة وإطارات الذهب عيار 24 قيراطاً والخطوط الرفيعة.',
    descriptionEn:
      'Sophisticated black-tie gala aesthetic with deep obsidian velvet backgrounds, luminous 24k champagne gold foil borders, and haute couture typography.',
    themeColor: '#0F0D0B',
    palette: [
      { hex: '#0F0D0B', nameAr: 'أسود أوبسيديان', nameEn: 'Obsidian Noir' },
      { hex: '#1C1814', nameAr: 'مخملي داكن', nameEn: 'Dark Velvet' },
      { hex: '#D4AF37', nameAr: 'ذهبي ملكي', nameEn: '24k Metallic Gold' },
      { hex: '#F3E5AB', nameAr: 'شامبين لامع', nameEn: 'Champagne Foil' },
      { hex: '#FAF6F0', nameAr: 'لؤلؤي ناصع', nameEn: 'Pearl Ivory' },
    ],
    typography: {
      displayEn: 'Cinzel Decorative',
      headingEn: 'Playfair Display',
      bodyEn: 'Montserrat',
      displayAr: 'Aref Ruqaa',
      bodyAr: 'Alexandria',
    },
    featuresAr: ['خلفية أوبسيديان مخملية بلمعة ذهبية', 'أسماء العروسين بتدرج الذهب اللامع', 'أزرار وإطارات مذهبة مزدوجة'],
    featuresEn: ['Obsidian velvet & gold stardust', 'Metallic gold shimmer typography', 'Double-bordered luxury frames'],
    preview: {
      bgGradient: 'radial-gradient(circle at 50% 20%, #241E17 0%, #0F0D0B 85%)',
      cardBg: 'rgba(24, 20, 16, 0.92)',
      cardBorder: '1px solid rgba(212, 175, 55, 0.65)',
      cardRadius: '48px 48px 6px 6px',
      textPrimary: '#FAF6F0',
      textSecondary: '#D8CEBE',
      accent: '#D4AF37',
      buttonBg: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA8220 100%)',
      buttonText: '#0F0D0B',
      buttonRadius: '4px',
      sealBg: 'radial-gradient(circle at 35% 35%, #F3E5AB 0%, #D4AF37 60%, #8A6615 100%)',
      envelopeBg: '#181512',
      envelopeFlap: '#221E19',
      ornament: '❖',
    },
  },
  {
    id: 'minimalist-modern',
    isDefault: false,
    nameAr: 'البساطة العصرية (Minimalist Modern)',
    nameEn: 'Minimalist Modern (Editorial)',
    categoryAr: 'تصميم معماري عصري',
    categoryEn: 'Contemporary Editorial',
    descriptionAr:
      'تخطيط معماري نظيف على طريقة المجلات العالمية، بألوان الأبيض الصافي والحجر الدافئ مع خطوط عالية التباين ولمسات الأخضر الزيتوني.',
    descriptionEn:
      'Clean architectural layouts, gallery-white and warm stone surfaces, high-contrast editorial Didone typography, and subtle olive-cypress accents.',
    themeColor: '#F6F5F0',
    palette: [
      { hex: '#F6F5F0', nameAr: 'حجر ألاباستر', nameEn: 'Alabaster Stone' },
      { hex: '#FFFFFF', nameAr: 'أبيض صافي', nameEn: 'Gallery White' },
      { hex: '#181818', nameAr: 'حبر فحمي', nameEn: 'Carbon Ink' },
      { hex: '#55604E', nameAr: 'أخضر زيتوني', nameEn: 'Olive Cypress' },
      { hex: '#8C857B', nameAr: 'رمادي رملي', nameEn: 'Warm Taupe' },
    ],
    typography: {
      displayEn: 'Bodoni Moda',
      headingEn: 'Bodoni Moda',
      bodyEn: 'Plus Jakarta Sans',
      displayAr: 'Cairo',
      bodyAr: 'Cairo',
    },
    featuresAr: ['إطارات هندسية حادة وعصرية', 'تباين أبيض وأسود مع أخضر زيتوني', 'خطوط مجلات الموضة الحديثة'],
    featuresEn: ['Sharp architectural gallery frames', 'Monochrome ink & olive palette', 'High-fashion editorial typography'],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #EFECE6 100%)',
      cardBg: '#FFFFFF',
      cardBorder: '1px solid #181818',
      cardRadius: '2px',
      textPrimary: '#181818',
      textSecondary: '#52504C',
      accent: '#55604E',
      buttonBg: '#181818',
      buttonText: '#FFFFFF',
      buttonRadius: '2px',
      sealBg: 'radial-gradient(circle at 35% 35%, #3A3A3A 0%, #181818 100%)',
      envelopeBg: '#EFECE6',
      envelopeFlap: '#FFFFFF',
      ornament: '—',
    },
  },
  {
    id: 'romantic-floral',
    isDefault: false,
    nameAr: 'الرومانسية الوردية (Romantic Floral)',
    nameEn: 'Romantic Floral (Rose Garden)',
    categoryAr: 'رومانسية الحديقة الوردية',
    categoryEn: 'Pastel Garden Romance',
    descriptionAr:
      'درجات الباستيل الوردي الحالمة وزهور الحدائق الإنجليزية مع تفاصيل الروز جولد والخطوط الانسيابية الرومانسية الناعمة.',
    descriptionEn:
      'Dreamy pastel blush and English rosewater tones, blooming botanical illustrations, rose-gold details, and flowing romantic calligraphy.',
    themeColor: '#FFF5F7',
    palette: [
      { hex: '#FFF5F7', nameAr: 'ندى الورد', nameEn: 'Rosewater Mist' },
      { hex: '#FCE4EC', nameAr: 'وردي باستيل', nameEn: 'Petal Blush' },
      { hex: '#C86D7E', nameAr: 'وردي بيوني', nameEn: 'Peony Rose' },
      { hex: '#D48C9A', nameAr: 'روز جولد', nameEn: 'Rose Gold' },
      { hex: '#4A202D', nameAr: 'عنابي الورد', nameEn: 'Deep Rosewood' },
    ],
    typography: {
      displayEn: 'Alex Brush',
      headingEn: 'Lora',
      bodyEn: 'Quicksand',
      displayAr: 'Aref Ruqaa',
      bodyAr: 'Tajawal',
    },
    featuresAr: ['تدرجات الباستيل الوردي والروز جولد', 'إطارات مقوسة ناعمة بظلال وردية', 'ختم شمعي بلون ورد البيوني'],
    featuresEn: ['Soft blush & rose-gold gradients', 'Dreamy arched vellum cards', 'Peony rose wax seal & florals'],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FFF9FA 0%, #FCE4EC 100%)',
      cardBg: 'rgba(255, 251, 252, 0.9)',
      cardBorder: '1px solid rgba(200, 109, 126, 0.45)',
      cardRadius: '70px 70px 20px 20px',
      textPrimary: '#4A202D',
      textSecondary: '#7A4052',
      accent: '#C86D7E',
      buttonBg: 'linear-gradient(135deg, #D98A98 0%, #B85D6F 100%)',
      buttonText: '#FFFFFF',
      buttonRadius: '999px',
      sealBg: 'radial-gradient(circle at 35% 35%, #F2A2B0 0%, #C86D7E 65%, #9B4354 100%)',
      envelopeBg: '#FADCE4',
      envelopeFlap: '#FFF0F4',
      ornament: '❀',
    },
  },
  {
    id: 'royal-classic',
    isDefault: false,
    nameAr: 'الملكي الكلاسيكي (Royal Classic)',
    nameEn: 'Royal Classic (Imperial Emerald)',
    categoryAr: 'التراث الملكي الفاخر',
    categoryEn: 'Palatial Royal Heritage',
    descriptionAr:
      'فخامة القصور الملكية الكلاسيكية بمزيج الأخضر الزمردي العميق والعاجي الملكي مع الزخارف الذهبية المتقنة وختم الشمع الياقوتي.',
    descriptionEn:
      'Regal palatial grandeur combining deep imperial emerald and royal ivory with burnished gold filigree, crimson ruby wax seal, and aristocratic script.',
    themeColor: '#0A221A',
    palette: [
      { hex: '#0A221A', nameAr: 'زمردي ملكي', nameEn: 'Imperial Emerald' },
      { hex: '#12382B', nameAr: 'أخضر القصور', nameEn: 'Palace Jade' },
      { hex: '#E5C158', nameAr: 'ذهبي معتق', nameEn: 'Burnished Gold' },
      { hex: '#9B1B30', nameAr: 'ياقوتي ملكي', nameEn: 'Royal Ruby Seal' },
      { hex: '#FDFBF7', nameAr: 'عاجي القصور', nameEn: 'Palace Parchment' },
    ],
    typography: {
      displayEn: 'Pinyon Script',
      headingEn: 'Cinzel',
      bodyEn: 'EB Garamond',
      displayAr: 'Reem Kufi',
      bodyAr: 'Amiri',
    },
    featuresAr: ['خلفية زمردية بنقش أرابيسك ملكي', 'ختم شمعي ياقوتي أحمر بإطار ذهبي', 'إطارات قصور مذهبة وزخارف تقليدية'],
    featuresEn: ['Emerald damask palace pattern', 'Crimson ruby & gold royal wax seal', 'Ornate gilded palatial arches'],
    preview: {
      bgGradient: 'radial-gradient(circle at 50% 20%, #164233 0%, #091E17 90%)',
      cardBg: 'rgba(15, 45, 34, 0.94)',
      cardBorder: '2px solid rgba(229, 193, 88, 0.7)',
      cardRadius: '56px 56px 10px 10px',
      textPrimary: '#FDFBF7',
      textSecondary: '#DFD3B8',
      accent: '#E5C158',
      buttonBg: 'linear-gradient(135deg, #E5C158 0%, #B38728 100%)',
      buttonText: '#091E17',
      buttonRadius: '8px',
      sealBg: 'radial-gradient(circle at 35% 35%, #D9384A 0%, #9B1B30 65%, #610C1A 100%)',
      envelopeBg: '#0E2D22',
      envelopeFlap: '#164031',
      ornament: '♛',
    },
  },
];

/**
 * Check if a given theme ID exists in our registry
 */
export const isValidThemeId = (themeId) => {
  return Boolean(themeId && WEDDING_THEMES.some((t) => t.id === themeId));
};

/**
 * Retrieve a theme descriptor by ID (falls back to 'default')
 */
export const getThemeById = (themeId) => {
  return WEDDING_THEMES.find((t) => t.id === themeId) || WEDDING_THEMES[0];
};

/**
 * Apply the selected theme to the document root (`<html data-theme="...">`)
 * and update the browser `<meta name="theme-color">`.
 * When `themeId` is 'default' (or omitted), the original theme remains untouched.
 */
export const applyThemeToDOM = (themeId) => {
  if (typeof document === 'undefined') return DEFAULT_THEME_ID;
  const resolvedId = isValidThemeId(themeId) ? themeId : DEFAULT_THEME_ID;
  const themeObj = getThemeById(resolvedId);

  document.documentElement.setAttribute('data-theme', resolvedId);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor && themeObj?.themeColor) {
    metaThemeColor.setAttribute('content', themeObj.themeColor);
  }

  return resolvedId;
};

export default WEDDING_THEMES;
