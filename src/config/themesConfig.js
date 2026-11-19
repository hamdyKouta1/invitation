/**
 * ============================================================================
 * WEDDING INVITATION THEMES CONFIGURATION — COMPLETE VISUAL THEME SYSTEM
 * ============================================================================
 * Each theme defines its own complete visual identity:
 *   1. Color Palette & Surface Treatments
 *   2. Typography & Font Combinations (EN + AR)
 *   3. Image & Photography Assets (Hero, Envelope Card, Curated Gallery, Frames)
 *   4. Icon & Decorative Illustration Variants (Corners, Dividers, Seals, Crests)
 *   5. Animation & Ambient Motion Presets (Particles, Section Reveals, Transitions)
 *   6. Structural Layout Variants (Hero, Envelope, Countdown, Details, Gallery)
 *
 * IMPORTANT:
 * - 'default' is the original Warm Ivory & Gold wedding invitation theme.
 *   It remains 100% intact and active by default until an administrator
 *   explicitly selects and applies another theme.
 * ============================================================================
 */

export const DEFAULT_THEME_ID = 'default';
export const THEME_STORAGE_KEY = 'wedding_active_theme';
export const THEME_PREVIEW_EVENT = 'wedding_theme_preview_change';

// Temporary in-memory preview theme ID (does not persist across refresh unless applied)
let currentPreviewThemeId = null;

export const GOOGLE_FONTS_THEMES_HREF =
  'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Amiri:ital,wght@0,400;0,700;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;1,6..96,400&family=Cairo:wght@300;400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Quicksand:wght@400;500;600&family=Reem+Kufi:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap';

export const WEDDING_THEMES = [
  /* ──────────────────────────────────────────────────────────────────────────
   * 0. DEFAULT THEME — Original Warm Ivory & Gold (100% Preserved)
   * ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'default',
    isDefault: true,
    nameAr: 'الكلاسيكي الدافئ — التصميم الأصلي (Default)',
    nameEn: 'Warm Ivory & Gold (Original Default)',
    categoryAr: 'التصميم الافتراضي الحالي',
    categoryEn: 'Original Signature Theme',
    descriptionAr:
      'التصميم الأصلي لدعوة الزفاف بألوان العاج الدافئ والذهب المعتق مع رسومات الزهور المائية الناعمة والإطار المقوس الكلاسيكي.',
    descriptionEn:
      'The original signature design featuring warm ivory paper textures, antique gold accents, watercolor floral corners, and classic romantic calligraphy.',
    themeColor: '#C9A96E',
    palette: [
      { hex: '#FDFAF6', nameAr: 'عاجي دافئ', nameEn: 'Warm Ivory' },
      { hex: '#F0E8DC', nameAr: 'كريمي ناعم', nameEn: 'Soft Cream' },
      { hex: '#C9A96E', nameAr: 'ذهبي معتق', nameEn: 'Antique Gold' },
      { hex: '#E8C5B0', nameAr: 'وردي خوخي', nameEn: 'Blush Rose' },
      { hex: '#3D2B1F', nameAr: 'بني إسبريسو', nameEn: 'Deep Espresso' },
    ],
    typography: {
      displayEn: 'Great Vibes',
      headingEn: 'Cormorant Garamond',
      bodyEn: 'Lato',
      displayAr: 'Aref Ruqaa',
      bodyAr: 'Alexandria',
    },
    assets: {
      heroImage: '/couple-illustration.png',
      envelopeCardImage: '/og-image.jpg',
      imageFrameStyle: 'classic-arch',
      imageFrameLabelAr: 'إطار مقوس كلاسيكي ناعم',
      imageFrameLabelEn: 'Classic Soft Arch Frame',
      galleryLayout: 'masonry-classic',
      galleryLayoutLabelAr: 'شبكة المعرض الكلاسيكية (Masonry)',
      galleryLayoutLabelEn: 'Classic Masonry Grid',
      galleryImages: [], // Uses weddingConfig.gallery.mockImages untouched
    },
    icons: {
      style: 'classic-watercolor',
      labelAr: 'زخارف مائية ونجوم كلاسيكية (✦ / ❧)',
      labelEn: 'Watercolor Florals & Classic Stars',
      cornerVariant: 'watercolor-rose',
      dividerVariant: 'classic-star',
      sealVariant: 'classic-heart',
      headerCrest: 'none',
    },
    animations: {
      preset: 'gentle-float',
      labelAr: 'تموج هادئ وتلاشي ناعم',
      labelEn: 'Gentle Float & Soft Fade',
      ambientParticleType: 'none',
      revealDuration: 0.8,
      revealEase: [0.25, 0.46, 0.45, 0.94],
    },
    layout: {
      heroVariant: 'classic-arch',
      heroLabelAr: 'البطاقة المقوسة الكلاسيكية',
      heroLabelEn: 'Classic Centered Arch Card',
      envelopeVariant: 'classic-flap',
      countdownVariant: 'classic-cards',
      detailsVariant: 'classic-split',
    },
    featuresAr: [
      'رسمة العروسين المائية الأصلية وإطار القوس الكلاسيكي',
      'زخارف زهور الألوان المائية في الزوايا',
      'ظرف كلاسيكي بختم القلب الذهبي',
      'حركات ظهور ناعمة وتصميم متوازن دافئ',
    ],
    featuresEn: [
      'Original watercolor couple illustration & classic arch frame',
      'Soft watercolor botanical corner flourishes',
      'Classic cream envelope with golden heart wax seal',
      'Gentle floating motion and warm ivory stationery',
    ],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FDFAF6 0%, #F0E8DC 100%)',
      cardBg: 'rgba(253, 250, 246, 0.9)',
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

  /* ──────────────────────────────────────────────────────────────────────────
   * 1. ELEGANT LUXURY — Black-Tie Noir Obsidian & 24k Champagne Gold
   * ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'elegant-luxury',
    isDefault: false,
    nameAr: 'الفخامة الذهبية (Elegant Luxury)',
    nameEn: 'Elegant Luxury (Noir & 24k Gold)',
    categoryAr: 'فخامة سهرات المساء (Black-Tie Gala)',
    categoryEn: 'Black-Tie Haute Couture',
    descriptionAr:
      'تصميم سهرة فاخر مستوحى من حفلات الـ Black-Tie العالمية، يتميز ببوابة آرت ديكو المذهّبة، إضاءات الثريات المتلألئة، ذرات الذهب الطائرة، وإطارات الألماس الثمانية.',
    descriptionEn:
      'Haute couture evening gala experience featuring an Art-Deco 24k gold ballroom illustration, shimmering stardust bokeh particles, faceted octagonal frames, and tuxedo gatefold stationery.',
    themeColor: '#0F0D0B',
    palette: [
      { hex: '#0F0D0B', nameAr: 'أسود أوبسيديان', nameEn: 'Obsidian Noir' },
      { hex: '#1C1814', nameAr: 'مخملي داكن', nameEn: 'Dark Velvet' },
      { hex: '#D4AF37', nameAr: 'ذهبي ملكي 24k', nameEn: '24k Metallic Gold' },
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
    assets: {
      heroImage: '/themes/elegant-luxury/hero-illustration.png',
      heroFallbackSvg: '/themes/elegant-luxury/hero-illustration.svg',
      envelopeCardImage: '/themes/elegant-luxury/envelope-card.svg',
      imageFrameStyle: 'gilded-octagonal',
      imageFrameLabelAr: 'إطار آرت-ديكو مثمّن مزدوج بالذهب',
      imageFrameLabelEn: 'Double-Gilded Art-Deco Octagonal Frame',
      galleryLayout: 'cinema-spotlight',
      galleryLayoutLabelAr: 'عرض سينمائي بانورامي مضاء بالذهب (Spotlight Grid)',
      galleryLayoutLabelEn: 'Cinema Spotlight Showcase Grid',
      galleryImages: [
        {
          id: 'el-1',
          url: '/themes/elegant-luxury/gallery-1.svg',
          alt: 'The Grand Ballroom — قاعة الاحتفال الملكية',
          titleAr: 'قاعة الاحتفال الملكية',
          titleEn: 'The Grand Ballroom',
          captionAr: 'أجواء السهرة الفاخرة تحت أضواء الثريات الكريستالية',
          captionEn: 'Black-tie grandeur beneath crystal chandeliers',
          aspectRatio: 'portrait',
        },
        {
          id: 'el-2',
          url: '/themes/elegant-luxury/gallery-2.svg',
          alt: '24k Gold & Diamond Rings — خواتم الذهب والألماس',
          titleAr: 'خواتم الذهب والألماس',
          titleEn: '24k Gold & Diamond Rings',
          captionAr: 'عهد أبدي مرصع بالذهب الخالص والألماس',
          captionEn: 'Eternal vows crafted in 24k gold',
          aspectRatio: 'square',
        },
        {
          id: 'el-3',
          url: '/themes/elegant-luxury/gallery-3.svg',
          alt: 'Midnight Champagne Tower — نخب ليلة العمر',
          titleAr: 'نخب ليلة العمر',
          titleEn: 'Midnight Celebration Tower',
          captionAr: 'لحظات الاحتفال المميزة في منتصف الليل',
          captionEn: 'Sparkling toasts in the velvet night',
          aspectRatio: 'portrait',
        },
        {
          id: 'el-4',
          url: '/themes/elegant-luxury/gallery-4.svg',
          alt: 'Haute Couture Silhouette — إطلالة الفخامة الساحرة',
          titleAr: 'إطلالة الفخامة الساحرة',
          titleEn: 'Haute Couture Silhouette',
          captionAr: 'تصميم أزياء راقٍ يعكس أناقة ليلة الزفاف',
          captionEn: 'Bespoke evening couture and golden veil',
          aspectRatio: 'landscape',
        },
        {
          id: 'el-5',
          url: '/themes/elegant-luxury/gallery-5.svg',
          alt: 'Candlelit Velvet Tables — طاولات المخمل والشموع',
          titleAr: 'طاولات المخمل والشموع',
          titleEn: 'Candlelit Velvet Tables',
          captionAr: 'تنسيقات الشموع الذهبية على المخمل الأسود',
          captionEn: 'Golden candelabras on obsidian velvet',
          aspectRatio: 'square',
        },
        {
          id: 'el-6',
          url: '/themes/elegant-luxury/gallery-6.svg',
          alt: 'First Dance Under Stars — الرقصة الأولى تحت النجوم',
          titleAr: 'الرقصة الأولى تحت النجوم',
          titleEn: 'First Dance Under Stardust',
          captionAr: 'رقصة ساحرة في قلب القاعة المذهّبة',
          captionEn: 'A timeless waltz in golden spotlight',
          aspectRatio: 'portrait',
        },
      ],
    },
    icons: {
      style: 'art-deco-gold',
      labelAr: 'زخارف آرت-ديكو هندسية، ثريات وألماسات مذهّبة',
      labelEn: 'Art-Deco Sunbursts, Chandeliers & Faceted Diamonds',
      cornerVariant: 'art-deco-fan',
      dividerVariant: 'chandelier-diamond',
      sealVariant: 'diamond-monogram',
      headerCrest: 'sunburst-crown',
    },
    animations: {
      preset: 'golden-stardust',
      labelAr: 'غبار الذهب المتلألئ ولمعان الحرير السينمائي',
      labelEn: 'Floating 24k Gold Stardust & Shimmer Sweeps',
      ambientParticleType: 'champagne-bokeh',
      revealDuration: 0.95,
      revealEase: [0.16, 1, 0.3, 1],
    },
    layout: {
      heroVariant: 'gala-chandelier',
      heroLabelAr: 'بوابة السهرة المذهّبة مع شعار المونوجرام',
      heroLabelEn: 'Grand Gala Chandelier Marquee with Monogram Crest',
      envelopeVariant: 'tuxedo-gatefold',
      countdownVariant: 'octagonal-timepiece',
      detailsVariant: 'gilded-plaques',
    },
    featuresAr: [
      'لوحة فنية خاصة للعروسين في قاعة آرت-ديكو بالذهب والأسود المخملي',
      'تأثير ذرات الذهب المضيئة المتحركة (24k Gold Stardust)',
      'زوايا وفواصل هندسية مذهّبة على طراز القصور الحديثة',
      'معرض صور بتخطيط سينمائي بانورامي (Spotlight Showcase)',
    ],
    featuresEn: [
      'Exclusive Noir & 24k Gold Art-Deco couple illustration & envelope card',
      'Live animated 24k gold stardust & bokeh ambient effects',
      'Custom Art-Deco sunburst corners, chandelier dividers & diamond seal',
      'Cinema Spotlight gallery layout & octagonal timepiece countdown',
    ],
    preview: {
      bgGradient: 'radial-gradient(circle at 50% 20%, #241E17 0%, #0F0D0B 85%)',
      cardBg: 'rgba(24, 20, 16, 0.94)',
      cardBorder: '1px solid rgba(212, 175, 55, 0.65)',
      cardRadius: '24px 24px 6px 6px',
      textPrimary: '#FAF6F0',
      textSecondary: '#C8B99E',
      accent: '#D4AF37',
      buttonBg: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA8220 100%)',
      buttonText: '#0F0D0B',
      buttonRadius: '4px',
      sealBg: 'radial-gradient(circle at 35% 35%, #FFF3C4 0%, #D4AF37 60%, #7A5C12 100%)',
      envelopeBg: '#181410',
      envelopeFlap: '#241E17',
      ornament: '❖',
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 2. MINIMALIST MODERN — Fine-Art Editorial Alabaster, Carbon Ink & Olive
   * ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'minimalist-modern',
    isDefault: false,
    nameAr: 'العصري البسيط (Minimalist Modern)',
    nameEn: 'Minimalist Modern (Fine-Art Editorial)',
    categoryAr: 'تصميم مجلات الموضة المعماري',
    categoryEn: 'Architectural Editorial Lookbook',
    descriptionAr:
      'تصميم معماري معاصر مستوحى من مجلات الأزياء الراقية (Vogue Editorial)، يعتمد على التخطيط غير المتماثل، الترقيم التحريري (01 / 06)، الخطوط الرفيعة، ورسومات الخط الواحد.',
    descriptionEn:
      'Contemporary Vogue-inspired architectural design featuring asymmetric magazine layouts, continuous fine-line art illustrations, numbered editorial headers, and crisp geometric framing.',
    themeColor: '#181818',
    palette: [
      { hex: '#FAF9F6', nameAr: 'أبيض ألابستر', nameEn: 'Pure Alabaster' },
      { hex: '#F1EFEA', nameAr: 'حجري دافئ', nameEn: 'Warm Stone' },
      { hex: '#181818', nameAr: 'حبر كربوني', nameEn: 'Carbon Ink' },
      { hex: '#6B705C', nameAr: 'أخضر زيتوني', nameEn: 'Olive Cypress' },
      { hex: '#A5A58D', nameAr: 'رمادي ميرمية', nameEn: 'Muted Sage' },
    ],
    typography: {
      displayEn: 'Bodoni Moda',
      headingEn: 'Bodoni Moda',
      bodyEn: 'Plus Jakarta Sans',
      displayAr: 'Cairo',
      bodyAr: 'Cairo',
    },
    assets: {
      heroImage: '/themes/minimalist-modern/hero-illustration.png',
      heroFallbackSvg: '/themes/minimalist-modern/hero-illustration.svg',
      envelopeCardImage: '/themes/minimalist-modern/envelope-card.svg',
      imageFrameStyle: 'editorial-polaroid',
      imageFrameLabelAr: 'إطار مجلة معماري حاد بظل جانبي',
      imageFrameLabelEn: 'Architectural Magazine Frame with Offset Shadow',
      galleryLayout: 'editorial-magazine',
      galleryLayoutLabelAr: 'تخطيط مجلة الأزياء غير المتماثل (Editorial Bento)',
      galleryLayoutLabelEn: 'Asymmetric Editorial Lookbook Grid',
      galleryImages: [
        {
          id: 'mm-1',
          url: '/themes/minimalist-modern/gallery-1.svg',
          alt: '01 / Architectural First Look',
          titleAr: '٠١ / اللقاء الأول العصري',
          titleEn: '01 / Architectural First Look',
          captionAr: 'تكوين بصري معماري بخطوط نقية وظلال هادئة',
          captionEn: 'Minimalist composition in warm stone & natural light',
          aspectRatio: 'portrait',
        },
        {
          id: 'mm-2',
          url: '/themes/minimalist-modern/gallery-2.svg',
          alt: '02 / Sculptural Calla Lilies',
          titleAr: '٠٢ / باقة الزهور النحتية',
          titleEn: '02 / Sculptural Calla Lilies',
          captionAr: 'تنسيق نباتي معاصر بأغصان الزيتون والزهور البيضاء',
          captionEn: 'Contemporary botanical form with olive branches',
          aspectRatio: 'square',
        },
        {
          id: 'mm-3',
          url: '/themes/minimalist-modern/gallery-3.svg',
          alt: '03 / Linen & Olive Cypress',
          titleAr: '٠٣ / تفاصيل الكتان والزيتون',
          titleEn: '03 / Linen & Olive Tablescape',
          captionAr: 'بساطة الخامات الطبيعية على طاولات الاستقبال',
          captionEn: 'Raw organic linen, ceramic stoneware & cypress',
          aspectRatio: 'landscape',
        },
        {
          id: 'mm-4',
          url: '/themes/minimalist-modern/gallery-4.svg',
          alt: '04 / Minimalist Bands',
          titleAr: '٠٤ / خواتم الزفاف الهندسية',
          titleEn: '04 / Pure Geometric Bands',
          captionAr: 'تصميم خواتم نقي يعبر عن الأناقة الهادئة',
          captionEn: 'Clean architectural silhouettes in matte gold',
          aspectRatio: 'square',
        },
        {
          id: 'mm-5',
          url: '/themes/minimalist-modern/gallery-5.svg',
          alt: '05 / Courtyard Shadows',
          titleAr: '٠٥ / ظلال العمارة الهادئة',
          titleEn: '05 / Courtyard Shadows',
          captionAr: 'لقطات فنية تجمع بين الضوء والظل بأسلوب تحريري',
          captionEn: 'Editorial study of light, form, and movement',
          aspectRatio: 'portrait',
        },
        {
          id: 'mm-6',
          url: '/themes/minimalist-modern/gallery-6.svg',
          alt: '06 / Evening Rooftop Toast',
          titleAr: '٠٦ / أمسية الاحتفال المعاصرة',
          titleEn: '06 / Modern Rooftop Soirée',
          captionAr: 'أجواء احتفالية عصرية تحت سماء المدينة',
          captionEn: 'Intimate modern celebration under open skies',
          aspectRatio: 'landscape',
        },
      ],
    },
    icons: {
      style: 'minimal-hairline',
      labelAr: 'رموز هندسية رفيعة وعلامات ترقيم تحريرية (01 — 07)',
      labelEn: 'Hairline Geometric Crosshairs & Editorial Issue Markers',
      cornerVariant: 'architectural-crosshair',
      dividerVariant: 'editorial-line',
      sealVariant: 'minimal-square',
      headerCrest: 'editorial-issue',
    },
    animations: {
      preset: 'editorial-reveal',
      labelAr: 'انزلاق معماري متزن وحركة خطوط دقيقة',
      labelEn: 'Crisp Architectural Slide & Hairline Grid Reveal',
      ambientParticleType: 'architectural-lines',
      revealDuration: 0.65,
      revealEase: [0.22, 1, 0.36, 1],
    },
    layout: {
      heroVariant: 'editorial-split',
      heroLabelAr: 'ملصق مجلة مزدوج (Editorial Magazine Poster)',
      heroLabelEn: 'Editorial Magazine Split Poster with Issue Header',
      envelopeVariant: 'editorial-sleeve',
      countdownVariant: 'editorial-ticker',
      detailsVariant: 'editorial-columns',
    },
    featuresAr: [
      'تخطيط بوستر مجلة عصري (Editorial Split Layout) مع ترويسة العدد',
      'رسم فني معاصر بالخط الواحد المستمر (Fine-Line Art) وأغصان الزيتون',
      'عدّاد تنازلي شريطي معماري ومعرض صور مرقم بأسلوب المجلات',
      'علامات تحديد هندسية (Crosshairs) وأزرار مستطيلة حادة',
    ],
    featuresEn: [
      'Asymmetric Editorial Poster Hero layout with issue header metadata',
      'Continuous fine-line couple illustration with olive cypress accents',
      'Horizontal architectural countdown ticker & numbered lookbook gallery',
      'Registration crosshair marks, hairline dividers & square architectural seal',
    ],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FAF9F6 0%, #F1EFEA 100%)',
      cardBg: '#FFFFFF',
      cardBorder: '1.5px solid #181818',
      cardRadius: '0px',
      textPrimary: '#181818',
      textSecondary: '#52524E',
      accent: '#6B705C',
      buttonBg: '#181818',
      buttonText: '#FAF9F6',
      buttonRadius: '0px',
      sealBg: 'linear-gradient(135deg, #2B2B2A 0%, #141413 100%)',
      envelopeBg: '#EAE6DF',
      envelopeFlap: '#F4F2ED',
      ornament: '—',
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 3. ROMANTIC FLORAL — English Rose Garden, Blush Peony & Sage Eucalyptus
   * ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'romantic-floral',
    isDefault: false,
    nameAr: 'الرومانسي الوردي (Romantic Floral)',
    nameEn: 'Romantic Floral (Pastel Rose Garden)',
    categoryAr: 'حديقة الورود الإنجليزية الحالمة',
    categoryEn: 'English Rose Garden Romance',
    descriptionAr:
      'تصميم شاعري حالم ينبض بجمال الطبيعة، يتضمن بوابة أزهار الفاونيا الوردية وأوراق الأوكالبتوس، بتلات الورد المتساقطة بنعومة، وإطارات الصور التذكارية.',
    descriptionEn:
      'Dreamy English garden celebration featuring a blooming peony archway illustration, gently falling blush rose petals, botanical wreath medallions, and scrapbook keepsake gallery frames.',
    themeColor: '#C86D7E',
    palette: [
      { hex: '#FFF9FA', nameAr: 'ندى الورد', nameEn: 'Petal Mist' },
      { hex: '#F4DCE0', nameAr: 'وردي فاونيا', nameEn: 'Peony Blush' },
      { hex: '#C86D7E', nameAr: 'روز عتيق', nameEn: 'Dusty Rose' },
      { hex: '#7A9A8B', nameAr: 'أخضر أوكالبتوس', nameEn: 'Eucalyptus Sage' },
      { hex: '#4A252C', nameAr: 'برغندي ناعم', nameEn: 'Deep Berry' },
    ],
    typography: {
      displayEn: 'Alex Brush',
      headingEn: 'Lora',
      bodyEn: 'Quicksand',
      displayAr: 'Tajawal',
      bodyAr: 'Tajawal',
    },
    assets: {
      heroImage: '/themes/romantic-floral/hero-illustration.png',
      heroFallbackSvg: '/themes/romantic-floral/hero-illustration.svg',
      envelopeCardImage: '/themes/romantic-floral/envelope-card.svg',
      imageFrameStyle: 'botanical-wreath',
      imageFrameLabelAr: 'إكليل زهور بيضاوي محاط بأغصان الأوكالبتوس',
      imageFrameLabelEn: 'Botanical Peony & Eucalyptus Oval Wreath',
      galleryLayout: 'polaroid-scrapbook',
      galleryLayoutLabelAr: 'ألبوم ذكريات الورود المائل (Botanical Scrapbook)',
      galleryLayoutLabelEn: 'Botanical Keepsake Polaroid Layout',
      galleryImages: [
        {
          id: 'rf-1',
          url: '/themes/romantic-floral/gallery-1.svg',
          alt: 'Blooming Rose Pergola — بوابة الورود المزهرة',
          titleAr: 'بوابة الورود المزهرة',
          titleEn: 'Blooming Rose Pergola',
          captionAr: 'عقد القران تحت قوس الفاونيا الوردية والياسمين',
          captionEn: 'Vows exchanged beneath cascading blush peonies',
          aspectRatio: 'portrait',
        },
        {
          id: 'rf-2',
          url: '/themes/romantic-floral/gallery-2.svg',
          alt: 'Blush Peony Bouquet — باقة الفاونيا الوردية',
          titleAr: 'باقة الفاونيا الوردية',
          titleEn: 'Blush Peony Bouquet',
          captionAr: 'تنسيق زهور العروس بألوان الباستيل الحالمة',
          captionEn: 'Hand-tied garden roses and eucalyptus sprigs',
          aspectRatio: 'square',
        },
        {
          id: 'rf-3',
          url: '/themes/romantic-floral/gallery-3.svg',
          alt: 'Heirloom Rings in Roses — خواتم المحبة بين الزهور',
          titleAr: 'خواتم المحبة بين الزهور',
          titleEn: 'Rings Amidst Rose Petals',
          captionAr: 'تفاصيل رقيقة تخلد أجمل لحظات العمر',
          captionEn: 'Delicate rose-gold bands nestled in velvet petals',
          aspectRatio: 'portrait',
        },
        {
          id: 'rf-4',
          url: '/themes/romantic-floral/gallery-4.svg',
          alt: 'Golden Hour in the Meadow — لحظات الغروب الرومانسية',
          titleAr: 'لحظات الغروب الرومانسية',
          titleEn: 'Golden Hour in the Garden',
          captionAr: 'نسمات المساء الدافئة وسط حديقة الأزهار',
          captionEn: 'Soft sunlight filtering through blooming gardens',
          aspectRatio: 'landscape',
        },
        {
          id: 'rf-5',
          url: '/themes/romantic-floral/gallery-5.svg',
          alt: 'Botanical Tiered Cake — كعكة الزفاف المزينة بالزهور',
          titleAr: 'كعكة الزفاف المزينة بالزهور',
          titleEn: 'Pressed-Flower Wedding Cake',
          captionAr: 'لمسات الورد الطبيعي وأوراق الميرمية الخضراء',
          captionEn: 'Artisanal tiers adorned with organic rosebuds',
          aspectRatio: 'square',
        },
        {
          id: 'rf-6',
          url: '/themes/romantic-floral/gallery-6.svg',
          alt: 'Lantern-Lit Garden Waltz — رقصة الحديقة المضيئة',
          titleAr: 'رقصة الحديقة المضيئة',
          titleEn: 'Lantern-Lit Garden Waltz',
          captionAr: 'أمسية شاعرية تحت فوانيس الحديقة المتلألئة',
          captionEn: 'Dancing beneath floral garlands and warm lanterns',
          aspectRatio: 'portrait',
        },
      ],
    },
    icons: {
      style: 'botanical-floral',
      labelAr: 'أكاليل الفاونيا، أغصان الأوكالبتوس وزخارف القلوب الزهرية',
      labelEn: 'Peony Wreaths, Eucalyptus Vines & Floral Hearts',
      cornerVariant: 'peony-garland',
      dividerVariant: 'rose-vine',
      sealVariant: 'botanical-peony',
      headerCrest: 'blooming-wreath',
    },
    animations: {
      preset: 'floating-petals',
      labelAr: 'بتلات الورد المتساقطة بنعومة وتفتح زهدي شاعري',
      labelEn: 'Drifting Blush Rose Petals & Soft Bloom Reveal',
      ambientParticleType: 'rose-petals',
      revealDuration: 0.9,
      revealEase: [0.34, 1.56, 0.64, 1],
    },
    layout: {
      heroVariant: 'garden-archway',
      heroLabelAr: 'شرفة الحديقة المزهرة بإكليل الفاونيا',
      heroLabelEn: 'Enchanted Garden Archway with Peony Wreath Crown',
      envelopeVariant: 'vellum-botanical',
      countdownVariant: 'petal-medallions',
      detailsVariant: 'garden-ribbons',
    },
    featuresAr: [
      'رسمة العروسين وسط إكليل زهور الفاونيا الوردية وأوراق الأوكالبتوس',
      'بتلات ورد باستيل تتساقط بنعومة في الخلفية (Floating Petals)',
      'عداد تنازلي داخل ميداليات زهرية دائرية وفواصل أغصان الورد',
      'معرض صور بتصميم ألبوم الذكريات الرومانسي (Botanical Scrapbook)',
    ],
    featuresEn: [
      'Exclusive English Rose Garden couple artwork & botanical Save-the-Date card',
      'Gentle drifting rose petals & botanical leaf animations across the screen',
      'Custom peony garland corners, rose-vine dividers & wax peony seal',
      'Scrapbook keepsake gallery frames & circular botanical countdown dials',
    ],
    preview: {
      bgGradient: 'linear-gradient(180deg, #FFF9FA 0%, #F9E6EA 100%)',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      cardBorder: '1.5px solid rgba(200, 109, 126, 0.38)',
      cardRadius: '120px 120px 32px 32px',
      textPrimary: '#4A252C',
      textSecondary: '#7D4E57',
      accent: '#C86D7E',
      buttonBg: 'linear-gradient(135deg, #D98292 0%, #B85668 100%)',
      buttonText: '#FFF9FA',
      buttonRadius: '999px',
      sealBg: 'radial-gradient(circle at 35% 35%, #F2A6B3 0%, #C86D7E 65%, #8F3D4C 100%)',
      envelopeBg: '#F6E0E4',
      envelopeFlap: '#FDF0F2',
      ornament: '❀',
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 4. ROYAL CLASSIC — Imperial Emerald, Palace Parchment & Crimson Ruby
   * ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'royal-classic',
    isDefault: false,
    nameAr: 'الملكي الكلاسيكي (Royal Classic)',
    nameEn: 'Royal Classic (Imperial Heritage)',
    categoryAr: 'فخامة القصور والتراث الملكي',
    categoryEn: 'Royal Palace & Heritage Luxury',
    descriptionAr:
      'تصميم ملكي مهيب مستوحى من دعوات القصور التاريخية، يجمع بين الأخضر الزمردي الملكي، ورق البرشمان العتيق، التيجان المذهّبة، والأختام الشمعية بالياقوت الأحمر.',
    descriptionEn:
      'Majestic imperial palace proclamation featuring emerald velvet, antique parchment scrolls, crowned heraldic crests, baroque acanthus filigree, and royal ruby wax seals.',
    themeColor: '#072A20',
    palette: [
      { hex: '#072A20', nameAr: 'زمردي ملكي', nameEn: 'Imperial Emerald' },
      { hex: '#0D3B2E', nameAr: 'أخضر قصر', nameEn: 'Palace Green' },
      { hex: '#F9F4E8', nameAr: 'رق ملكي عتيق', nameEn: 'Royal Parchment' },
      { hex: '#D4AF37', nameAr: 'ذهبي مصقول', nameEn: 'Burnished Gold' },
      { hex: '#721121', nameAr: 'أحمر ياقوتي', nameEn: 'Royal Ruby' },
    ],
    typography: {
      displayEn: 'Pinyon Script',
      headingEn: 'Cinzel',
      bodyEn: 'EB Garamond',
      displayAr: 'Reem Kufi',
      bodyAr: 'Amiri',
    },
    assets: {
      heroImage: '/themes/royal-classic/hero-illustration.png',
      heroFallbackSvg: '/themes/royal-classic/hero-illustration.svg',
      envelopeCardImage: '/themes/royal-classic/envelope-card.svg',
      imageFrameStyle: 'royal-cathedral',
      imageFrameLabelAr: 'قوس كاتدرائي ملكي متوج بشعار القصر',
      imageFrameLabelEn: 'Crowned Royal Cathedral Arch with Baroque Filigree',
      galleryLayout: 'palace-portraits',
      galleryLayoutLabelAr: 'قاعة اللوحات الملكية المؤطرة بالذهب (Palace Portrait Hall)',
      galleryLayoutLabelEn: 'Grand Palace Portrait Hall Grid',
      galleryImages: [
        {
          id: 'rc-1',
          url: '/themes/royal-classic/gallery-1.svg',
          alt: 'The Grand Palace Procession — الموكب الملكي المهيب',
          titleAr: 'الموكب الملكي المهيب',
          titleEn: 'The Grand Palace Procession',
          captionAr: 'مراسم الاستقبال الرسمية في البهو الزمردي الكبير',
          captionEn: 'Ceremonial entrance through the emerald palace hall',
          aspectRatio: 'portrait',
        },
        {
          id: 'rc-2',
          url: '/themes/royal-classic/gallery-2.svg',
          alt: 'Crown & Royal Signet Rings — التاج وخواتم القصر الملكي',
          titleAr: 'التاج وخواتم القصر الملكي',
          titleEn: 'Crown & Royal Signet Rings',
          captionAr: 'رموز الفخامة المتوارثة المرصعة بالذهب والياقوت',
          captionEn: 'Heirloom gold craftsmanship and imperial insignia',
          aspectRatio: 'square',
        },
        {
          id: 'rc-3',
          url: '/themes/royal-classic/gallery-3.svg',
          alt: 'Gilded Banquet Hall — قاعة المأدبة المذهبة',
          titleAr: 'قاعة المأدبة المذهبة',
          titleEn: 'The Gilded Banquet Hall',
          captionAr: 'احتفالية ملكية فاخرة على أضواء الشمعدانات الذهبية',
          captionEn: 'Royal reception beneath gilded palace vaults',
          aspectRatio: 'landscape',
        },
        {
          id: 'rc-4',
          url: '/themes/royal-classic/gallery-4.svg',
          alt: 'Marble Staircase Portrait — درج القصر الرخامي',
          titleAr: 'درج القصر الرخامي',
          titleEn: 'Grand Marble Staircase',
          captionAr: 'إطلالة ملكية خالدة على الدرج الرخامي العريق',
          captionEn: 'Regal portrait framed by baroque architecture',
          aspectRatio: 'portrait',
        },
        {
          id: 'rc-5',
          url: '/themes/royal-classic/gallery-5.svg',
          alt: 'Royal Toast & Goblets — كؤوس الاحتفال الملكية',
          titleAr: 'كؤوس الاحتفال الملكية',
          titleEn: 'Ceremonial Golden Goblets',
          captionAr: 'مراسم الاحتفال على الطريقة الكلاسيكية العريقة',
          captionEn: 'Traditional royal toast in engraved gold chalices',
          aspectRatio: 'square',
        },
        {
          id: 'rc-6',
          url: '/themes/royal-classic/gallery-6.svg',
          alt: 'Palace Garden Fireworks — الألعاب النارية فوق القصر',
          titleAr: 'الألعاب النارية فوق القصر',
          titleEn: 'Palace Garden Finale',
          captionAr: 'ختام مهيب يضيء سماء القصر بالألوان الذهبية',
          captionEn: 'Golden fireworks illuminating the royal gardens',
          aspectRatio: 'landscape',
        },
      ],
    },
    icons: {
      style: 'imperial-baroque',
      labelAr: 'تيجان ملكية، شعارات نبالة وزخارف الباروك الكلاسيكية',
      labelEn: 'Imperial Crowns, Heraldic Crests & Baroque Scrollwork',
      cornerVariant: 'baroque-acanthus',
      dividerVariant: 'royal-fleur',
      sealVariant: 'royal-crown',
      headerCrest: 'imperial-crest',
    },
    animations: {
      preset: 'regal-glow',
      labelAr: 'إشراقة الشموع الملكية وظهور مهيب على طراز المراسيم',
      labelEn: 'Ceremonial Scroll Unfurl & Imperial Candlelight Glow',
      ambientParticleType: 'palace-lanterns',
      revealDuration: 0.9,
      revealEase: [0.2, 0.8, 0.2, 1],
    },
    layout: {
      heroVariant: 'imperial-decree',
      heroLabelAr: 'مرسوم القصر الملكي المتوّج بالتاج وشريط الشرف',
      heroLabelEn: 'Imperial Palace Proclamation with Royal Crown & Scroll Ribbon',
      envelopeVariant: 'royal-scroll',
      countdownVariant: 'imperial-pillars',
      detailsVariant: 'royal-scrolls',
    },
    featuresAr: [
      'لوحة العروسين الملكية داخل قوس القصر المتوّج بالتاج الذهبي والوشاح الياقوتي',
      'ختم شمعي ملكي باللون الأحمر الياقوتي محفور بالتاج الإمبراطوري',
      'زوايا باروك (Baroque Acanthus) وفواصل زهرة الزنبق الملكية (Fleur-de-lis)',
      'معرض صور على طراز قاعة اللوحات الملكية المؤطرة بالذهب',
    ],
    featuresEn: [
      'Imperial Palace couple portrait with royal crown finial & crimson sash',
      'Royal Ruby wax seal embossed with an imperial crown emblem',
      'Baroque acanthus scrollwork corners & heraldic Fleur-de-lis dividers',
      'Palace Portrait Hall gallery frames & Roman pillar countdown plaques',
    ],
    preview: {
      bgGradient: 'radial-gradient(circle at 50% 30%, #0E3D2F 0%, #072A20 85%)',
      cardBg: '#F9F4E8',
      cardBorder: '2px solid #D4AF37',
      cardRadius: '20px',
      textPrimary: '#072A20',
      textSecondary: '#2C4A3E',
      accent: '#D4AF37',
      buttonBg: 'linear-gradient(135deg, #0D3B2E 0%, #072A20 100%)',
      buttonText: '#F9F4E8',
      buttonRadius: '8px',
      sealBg: 'radial-gradient(circle at 35% 35%, #A41E34 0%, #721121 65%, #4A0813 100%)',
      envelopeBg: '#F3EBDD',
      envelopeFlap: '#FBF7F0',
      ornament: '⚜',
    },
  },
];

/**
 * Validate whether a theme ID exists in WEDDING_THEMES
 */
export const isValidThemeId = (themeId) => {
  if (!themeId || typeof themeId !== 'string') return false;
  return WEDDING_THEMES.some((theme) => theme.id === themeId);
};

/**
 * Retrieve a theme object by ID (falls back to 'default' if not found)
 */
export const getThemeById = (themeId) => {
  return (
    WEDDING_THEMES.find((theme) => theme.id === themeId) ||
    WEDDING_THEMES[0]
  );
};

/**
 * Ensure Google Fonts stylesheet for themes is loaded once in <head>
 */
const ensureThemeFontsLoaded = () => {
  if (typeof document === 'undefined') return;
  const linkId = 'wedding-themes-google-fonts';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_THEMES_HREF;
    document.head.appendChild(link);
  }
};

/**
 * Apply the selected theme ID to the document root (<html data-theme="...">)
 * with a smooth visual transition class.
 */
export const applyThemeToDOM = (themeId) => {
  if (typeof document === 'undefined') return DEFAULT_THEME_ID;

  const targetId = currentPreviewThemeId || themeId;
  const validId = isValidThemeId(targetId) ? targetId : DEFAULT_THEME_ID;
  const themeObj = getThemeById(validId);

  if (validId !== DEFAULT_THEME_ID) {
    ensureThemeFontsLoaded();
  }

  const prevTheme = document.documentElement.getAttribute('data-theme');
  if (prevTheme && prevTheme !== validId && document.body) {
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 550);
  }

  document.documentElement.setAttribute('data-theme', validId);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor && themeObj?.themeColor) {
    metaThemeColor.setAttribute('content', themeObj.themeColor);
  }

  return validId;
};

/**
 * Temporarily preview a theme on the live DOM without saving to localStorage/Firestore
 */
export const setTemporaryThemePreview = (themeId) => {
  currentPreviewThemeId = isValidThemeId(themeId) ? themeId : null;
  if (typeof document !== 'undefined') {
    ensureThemeFontsLoaded();
    document.documentElement.setAttribute(
      'data-theme',
      currentPreviewThemeId || localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_ID
    );
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(THEME_PREVIEW_EVENT, { detail: { previewThemeId: currentPreviewThemeId } })
    );
  }
  return currentPreviewThemeId;
};

/**
 * Clear temporary preview and restore the saved active theme
 */
export const clearTemporaryThemePreview = (savedThemeId = DEFAULT_THEME_ID) => {
  currentPreviewThemeId = null;
  applyThemeToDOM(savedThemeId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(THEME_PREVIEW_EVENT, { detail: { previewThemeId: null } })
    );
  }
};

export const getTemporaryThemePreview = () => currentPreviewThemeId;
