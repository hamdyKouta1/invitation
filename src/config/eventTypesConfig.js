/**
 * ============================================================================
 * MULTIPLE EVENT TYPES & DYNAMIC INVITATION ENGINE (Phase 3)
 * ============================================================================
 * Supports all 10 commercial event categories within the same reusable template:
 *   1. wedding        — حفل زفاف (Wedding)
 *   2. engagement     — حفل خطوبة (Engagement)
 *   3. birthday       — عيد ميلاد (Birthday Celebration)
 *   4. private_party  — حفل خاص (Private Party / Soirée)
 *   5. graduation     — حفل تخرج (Graduation Ceremony)
 *   6. baby_shower    — استقبال مولود (Baby Shower / السبوع)
 *   7. anniversary    — ذكرى سنوية (Anniversary)
 *   8. corporate      — فعالية شركات (Corporate Gala / Event)
 *   9. conference     — مؤتمر (Conference / Summit)
 *  10. custom         — مناسبة خاصة (Custom Event)
 *
 * Backward Compatibility Guarantee:
 * - Any configuration without `eventType` defaults to `'wedding'`.
 * - The existing Hamdy & Rodina `weddingConfig.js` continues to work 100% unchanged.
 * ============================================================================
 */

export const DEFAULT_EVENT_TYPE_ID = 'wedding';

export const EVENT_TYPES = [
  {
    id: 'wedding',
    mode: 'couple',
    nameAr: 'حفل زفاف (Wedding)',
    nameEn: 'Wedding Celebration',
    badgeAr: 'دعوة زفاف',
    badgeEn: 'Wedding Invitation',
    editorialLabelAr: 'الإصدار الخاص — ليلة العمر',
    editorialLabelEn: 'ISSUE NO. 01 — THE WEDDING EDITION',
    celebrationQuoteAr: 'بدأ الاحتفال!',
    celebrationQuoteEn: 'The celebration has begun!',
    hostsSectionTitleAr: 'العائلتان الكريمتان',
    hostsSectionTitleEn: 'The Families',
    detailsSectionTitleAr: 'تفاصيل الحفل',
    detailsSectionTitleEn: 'Wedding Details',
    wishesSectionTitleAr: 'أمنيات وتهاني الأحبة',
    wishesSectionTitleEn: 'Wishes & Blessings',
  },
  {
    id: 'engagement',
    mode: 'couple',
    nameAr: 'حفل خطوبة (Engagement)',
    nameEn: 'Engagement Celebration',
    badgeAr: 'دعوة خطوبة',
    badgeEn: 'Engagement Invitation',
    editorialLabelAr: 'الإصدار الخاص — حفل الخطوبة',
    editorialLabelEn: 'SPECIAL EDITION — THE ENGAGEMENT',
    celebrationQuoteAr: 'بدأت فرحة الخطوبة!',
    celebrationQuoteEn: 'The engagement celebration has begun!',
    hostsSectionTitleAr: 'العائلتان الكريمتان',
    hostsSectionTitleEn: 'The Families',
    detailsSectionTitleAr: 'تفاصيل حفل الخطوبة',
    detailsSectionTitleEn: 'Engagement Details',
    wishesSectionTitleAr: 'تهاني وأمنيات الخطوبة',
    wishesSectionTitleEn: 'Engagement Wishes',
  },
  {
    id: 'birthday',
    mode: 'honoree',
    nameAr: 'حفل عيد ميلاد (Birthday)',
    nameEn: 'Birthday Celebration',
    badgeAr: 'دعوة عيد ميلاد',
    badgeEn: 'Birthday Invitation',
    editorialLabelAr: 'احتفالية خاصة — عيد ميلاد سعيد',
    editorialLabelEn: 'SPECIAL EDITION — BIRTHDAY CELEBRATION',
    celebrationQuoteAr: 'كل عام وأنتم بخير — بدأ الحفل!',
    celebrationQuoteEn: 'Happy Birthday — The party has started!',
    hostsSectionTitleAr: 'صاحب الاحتفال والمضيفون',
    hostsSectionTitleEn: 'Guest of Honor & Hosts',
    detailsSectionTitleAr: 'تفاصيل حفل عيد الميلاد',
    detailsSectionTitleEn: 'Birthday Party Details',
    wishesSectionTitleAr: 'رسائل وتهاني عيد الميلاد',
    wishesSectionTitleEn: 'Birthday Wishes',
  },
  {
    id: 'private_party',
    mode: 'honoree',
    nameAr: 'حفل خاص / سهرة (Private Party)',
    nameEn: 'Private Party & Soirée',
    badgeAr: 'دعوة خاصة',
    badgeEn: 'Private Invitation',
    editorialLabelAr: 'دعوة خاصة — أمسية استثنائية',
    editorialLabelEn: 'EXCLUSIVE EDITION — PRIVATE SOIRÉE',
    celebrationQuoteAr: 'بدأت الأمسية!',
    celebrationQuoteEn: 'The soirée has begun!',
    hostsSectionTitleAr: 'المضيفون',
    hostsSectionTitleEn: 'Your Hosts',
    detailsSectionTitleAr: 'تفاصيل الأمسية',
    detailsSectionTitleEn: 'Evening Details',
    wishesSectionTitleAr: 'كلمات الضيوف',
    wishesSectionTitleEn: 'Guestbook Notes',
  },
  {
    id: 'graduation',
    mode: 'honoree',
    nameAr: 'حفل تخرج (Graduation)',
    nameEn: 'Graduation Celebration',
    badgeAr: 'دعوة حفل تخرج',
    badgeEn: 'Graduation Invitation',
    editorialLabelAr: 'دفعة التميز — احتفالية التخرج',
    editorialLabelEn: 'HONORS EDITION — GRADUATION CEREMONY',
    celebrationQuoteAr: 'مبارك التخرج — بدأ الاحتفال!',
    celebrationQuoteEn: 'Congratulations Graduate — Celebration Time!',
    hostsSectionTitleAr: 'الخريج والعائلة',
    hostsSectionTitleEn: 'The Graduate & Family',
    detailsSectionTitleAr: 'تفاصيل حفل التخرج',
    detailsSectionTitleEn: 'Graduation Details',
    wishesSectionTitleAr: 'تهاني النجاح والتخرج',
    wishesSectionTitleEn: 'Congratulations & Wishes',
  },
  {
    id: 'baby_shower',
    mode: 'honoree',
    nameAr: 'استقبال مولود / سبوع (Baby Shower)',
    nameEn: 'Baby Shower & Welcome',
    badgeAr: 'استقبال مولود جديد',
    badgeEn: 'Baby Shower Invitation',
    editorialLabelAr: 'فرحة العائلة — استقبال المولود',
    editorialLabelEn: 'NEW ARRIVAL — BABY SHOWER EDITION',
    celebrationQuoteAr: 'أهلاً بالمولود الجديد!',
    celebrationQuoteEn: 'Welcome Little One!',
    hostsSectionTitleAr: 'المولود والوالدان',
    hostsSectionTitleEn: 'Baby & Parents',
    detailsSectionTitleAr: 'تفاصيل حفل الاستقبال',
    detailsSectionTitleEn: 'Celebration Details',
    wishesSectionTitleAr: 'أمنيات ودعوات للمولود',
    wishesSectionTitleEn: 'Blessings for the Baby',
  },
  {
    id: 'anniversary',
    mode: 'couple',
    nameAr: 'ذكرى سنوية (Anniversary)',
    nameEn: 'Anniversary Celebration',
    badgeAr: 'دعوة ذكرى سنوية',
    badgeEn: 'Anniversary Invitation',
    editorialLabelAr: 'مسيرة حب — الذكرى السنوية',
    editorialLabelEn: 'MILESTONE EDITION — ANNIVERSARY GALA',
    celebrationQuoteAr: 'دامت محبتكما — بدأ الاحتفال!',
    celebrationQuoteEn: 'Cheers to Many More Years!',
    hostsSectionTitleAr: 'المحتفى بهما والعائلة',
    hostsSectionTitleEn: 'The Couple & Family',
    detailsSectionTitleAr: 'تفاصيل الحفل',
    detailsSectionTitleEn: 'Anniversary Details',
    wishesSectionTitleAr: 'تهاني الذكرى السنوية',
    wishesSectionTitleEn: 'Anniversary Wishes',
  },
  {
    id: 'corporate',
    mode: 'organization',
    nameAr: 'فعالية شركات (Corporate Event)',
    nameEn: 'Corporate Event & Gala',
    badgeAr: 'دعوة رسمية',
    badgeEn: 'Official Corporate Invitation',
    editorialLabelAr: 'الفعالية السنوية — دعوة رسمية',
    editorialLabelEn: 'EXECUTIVE SERIES — CORPORATE GALA',
    celebrationQuoteAr: 'بدأت الفعالية الآن!',
    celebrationQuoteEn: 'The event is now live!',
    hostsSectionTitleAr: 'الجهة المنظمة والمتحدثون',
    hostsSectionTitleEn: 'Organizers & Keynotes',
    detailsSectionTitleAr: 'تفاصيل وأجندة الفعالية',
    detailsSectionTitleEn: 'Event Details & Agenda',
    wishesSectionTitleAr: 'سجل الزوار والشركاء',
    wishesSectionTitleEn: 'Partner & Guest Remarks',
  },
  {
    id: 'conference',
    mode: 'organization',
    nameAr: 'مؤتمر / ندوة (Conference)',
    nameEn: 'Conference & Summit',
    badgeAr: 'دعوة حضور مؤتمر',
    badgeEn: 'Conference Pass & Invitation',
    editorialLabelAr: 'المؤتمر السنوي — دعوة حضور',
    editorialLabelEn: 'SUMMIT EDITION — OFFICIAL INVITATION',
    celebrationQuoteAr: 'انطلقت أعمال المؤتمر!',
    celebrationQuoteEn: 'The conference has commenced!',
    hostsSectionTitleAr: 'المتحدثون والمنظمون',
    hostsSectionTitleEn: 'Speakers & Organizers',
    detailsSectionTitleAr: 'موعد وأجندة المؤتمر',
    detailsSectionTitleEn: 'Conference Schedule & Details',
    wishesSectionTitleAr: 'تعليقات المشاركين',
    wishesSectionTitleEn: 'Attendee Remarks',
  },
  {
    id: 'custom',
    mode: 'honoree',
    nameAr: 'مناسبة خاصة مخصصة (Custom Event)',
    nameEn: 'Custom Special Event',
    badgeAr: 'دعوة خاصة',
    badgeEn: 'Special Invitation',
    editorialLabelAr: 'إصدار خاص — دعوة مميزة',
    editorialLabelEn: 'BESPOKE EDITION — SPECIAL EVENT',
    celebrationQuoteAr: 'بدأ الحدث!',
    celebrationQuoteEn: 'The event has begun!',
    hostsSectionTitleAr: 'المضيفون والمحتفى بهم',
    hostsSectionTitleEn: 'Hosts & Honorees',
    detailsSectionTitleAr: 'تفاصيل المناسبة',
    detailsSectionTitleEn: 'Event Details',
    wishesSectionTitleAr: 'سجل التهاني والكلمات',
    wishesSectionTitleEn: 'Guestbook & Wishes',
  },
];

export const isValidEventTypeId = (eventTypeId) => {
  if (!eventTypeId || typeof eventTypeId !== 'string') return false;
  return EVENT_TYPES.some((et) => et.id === eventTypeId);
};

export const getEventTypeById = (eventTypeId) => {
  return (
    EVENT_TYPES.find((et) => et.id === eventTypeId) ||
    EVENT_TYPES[0]
  );
};
