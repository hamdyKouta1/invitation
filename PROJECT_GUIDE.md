# 💒 الدليل الشامل لمشروع موقع دعوة الزفاف التفاعلي (Wedding Invitation Master Guide)

مرحباً بك! هذا الملف هو **المجع والدليل التشغيلي والتطويري الكامل** لموقع دعوة الزفاف التفاعلي الخاص بـ **حمدى ورودينا**. يشرح هذا الدليل بالتفصيل الدقيق كل ما يمكنك تعديله، كيفية التشغيل على جهازك الشخصي (Local)، كيفية النشر والتحديث أونلاين عبر (GitHub Pages)، وتفاصيل التقنيات والميزات المستخدمة.

---

## 📚 فهرس المحتويات
1. [🛠️ التقنيات والأدوات المستخدمة (Tech Stack & Tools)](#1-التقنيات-والأدوات-المستخدمة)
2. [💻 كيفية تشغيل المشروع على الجهاز المحلي (Running Locally)](#2-كيفية-تشغيل-المشروع-على-الجهاز-المحلي)
3. [🚀 كيفية نشر وتحديث الموقع أونلاين (Deploying to GitHub Pages)](#3-كيفية-نشر-وتحديث-الموقع-أونلاين)
4. [⚙️ دليل تخصيص وتعديل كافة بيانات الدعوة (`weddingConfig.js`)](#4-دليل-تخصيص-وتعديل-كافة-بيانات-الدعوة)
5. [🖼️ طريقة تغيير الصور والأصوات والأصول (`public/`)](#5-طريقة-تغيير-الصور-والأصوات-والأصول)
6. [🔥 ربط الفايربيس وإضافة صور المعرض والتهاني](#6-ربط-الفايربيس-وإضافة-صور-المعرض-والتهاني)
7. [🎨 نظام التصميم والألوان والخطوط (Design System & Fonts)](#7-نظام-التصميم-والألوان-والخطوط)

---

## 1. 🛠️ التقنيات والأدوات المستخدمة (Tech Stack & Tools)

تم بناء هذا الموقع باستخدام أحدث تقنيات الويب لضمان الفخامة والسرعة الفائقة والاستجابة لجميع الشاشات:

* **React 19 + Vite 8:** بيئة بناء فائقة السرعة وخفيفة الوزن.
* **Framer Motion 13:** للمؤثرات والحركات الانسيابية ثلاثية الأبعاد (مثل فتح الظرف والبطاقات وتمرير الصور).
* **i18next + react-i18next:** لدعم اللغتين **العربية (RTL)** و **الإنجليزية (LTR)** مع التبديل الفوري.
* **Lucide React:** حزمة الأيقونات الناعمة والأنيقة.
* **React Hook Form + Zod:** لنماذج إدخال البيانات المعتمدة مع التحقق الذكي من المدخلات.
* **Cloud Firestore (Firebase 12):** لحفظ واستقبال تأكيدات الحضور (RSVP) ورسائل التهاني (Wishes) وصور المعرض حياً.
* **Google Fonts (Custom Calligraphy):**
  * **Aref Ruqaa (عارف رقعة):** للأسماء العربية الملكية والخط العربي الأصيل.
  * **Alexandria (الإسكندرية):** للنصوص العربية الحديثة والتفاصيل.
  * **Great Vibes & Cormorant Garamond:** للأسماء والعناوين باللغة الإنجليزية.

---

## 2. 💻 كيفية تشغيل المشروع على الجهاز المحلي (Running Locally)

لتشغيل الموقع والمعاينة على جهازك الشخصي، اتبع الخطوات التالية:

### المتطلبات الأساسية:
تأكد من تثبيت برنامج **Node.js** (الإصدار 18 أو أحدث) على جهازك.

### خطوات التشغيل:
1. افتح مبدل الأوامر (Terminal / PowerShell) داخل مجلد المشروع.
2. تثبيت جميع المكتبات والحزم (يُنفّذ مرة واحدة):
   ```bash
   npm install
   ```
3. تشغيل سيرفر التطوير المحلي:
   ```bash
   npm run dev
   ```
4. افتح المتصفح على الرابط الموضح في التيرمنال (عادةً):
   `http://localhost:5175/`

### 💡 التبديل بين وضع الفايربيس والبيانات المحلية:
* لتشغيل الفايربيس حياً: افتح ملف `.env.local` واجعل `VITE_FIREBASE_ENABLED=true`.
* للتجربة المحلية بدون فايربيس: اجعل `VITE_FIREBASE_ENABLED=false` في ملف `.env.local`.

---

## 3. 🚀 كيفية نشر وتحديث الموقع أونلاين (Deploying to GitHub Pages)

الموقع مجهز ومربوط بنظام النشر التلقائي على **GitHub Pages** تحت المستودع:
`https://github.com/hamdyKouta1/invitation`

### عند إجراء أي تعديل وتريد رفعه وتحديثه لايف على الإنترنت:

افتح التيرمنال داخل مجلد المشروع ونفّذ الأوامر التالية بالترتيب:

```bash
# 1. حفظ وحفظ التغيرات في Git
git add .
git commit -m "تحديث بيانات وحجم الصور"

# 2. رفع الكود المصدري على GitHub
git push origin main

# 3. بناء ونشر النسخة الحية أونلاين بضغطة زر واحدة
npm run deploy
```

> ✨ **الرابط المباشر للضيوف بعد النشر:**  
> **[https://hamdyKouta1.github.io/invitation/](https://hamdyKouta1.github.io/invitation/)**

---

## 4. ⚙️ دليل تخصيص وتعديل كافة بيانات الدعوة (`weddingConfig.js`)

جميع بيانات الزفاف والعروسين والمكان والتاريخ محفوظة في ملف واحد سهل التعديل:  
📁 **`src/config/weddingConfig.js`**

إليك شرح الحقول وكيفية التعديل عليها:

```javascript
// ─── 1. بيانات العريس والعروسة والعائلتين (المصدر الموحد) ───
const groom = {
  name: "حمدى",                // اسم العريس بالعربي
  nameEn: "Hamdy",            // اسم العريس بالإنكليزي
  familyTitleAr: "عائلة قوطة",  // اسم عائلة العريس بالعربي
  familyTitleEn: "The Kouta Family", // اسم عائلة العريس بالإنكليزي
  father: "محمد قوطة",          // اسم والد العريس
  fatherEn: "Mohamed Kouta",
  mother: "سلوي عبد المقصود",   // اسم والدة العريس
  motherEn: "Salwa Abdelmaksoud",
  showMother: false,          // 👈 اجعلها false لإخفاء اسم الأم، أو true لإظهاره
};

const bride = {
  name: "رودينا",               // اسم العروسة بالعربي
  nameEn: "Rodina",           // اسم العروسة بالإنكليزي
  familyTitleAr: "عائلة حمودة", // اسم عائلة العروسة بالعربي
  familyTitleEn: "The Hamoda Family", // اسم عائلة العروسة بالإنكليزي
  father: "محمد حمودة",        // اسم والد العروسة
  fatherEn: "Mohamed Hamoda",
  mother: "عبير غانم",          // اسم والدة العروسة
  motherEn: "Abeer Ghanem",
  showMother: false,          // 👈 اجعلها false لإخفاء اسم الأم، أو true لإظهاره
};

const weddingConfig = {
  // ─── اللغة الافتراضية للدعوة ──────────────────────────
  defaultLanguage: "ar",        // 'ar' للغة العربية أو 'en' للغة الإنجليزية

  groom,
  bride,

  // يتم توليد عبارة الدعوة والروابط ورسائل المشاركة وعناوين SEO تلقائياً من بيانات العروسين والعائلتين:
  // invitationPhraseAr, invitationPhraseEn, sharing, meta...

  // ─── الموعد والوقت والعد التنازلي ──────────────────────────
  wedding: {
    date: "2026-09-11",
    dateDisplay: "١١ سبتمبر ٢٠٢٦",
    dateDisplayEn: "11 September 2026",
    dayAr: "الجمعة",
    dayEn: "Friday",
    time: "٥:٠٠ مساءً",
    timeEn: "5:00 PM",
    dateTime: "2026-09-11T17:00:00+02:00", // تاريخ ISO للعد التنازلي
  },

  // ─── تفاصيل المكان والخريطة ──────────────────────────────
  venue: {
    nameAr: "حديقة جراند لامور",
    nameEn: "Garden Grand Lamour",
    addressAr: "شارع 23 يوليو، بورسعيد",
    addressEn: "23 jul St, Port Said",
    cityAr: "بورسعيد، مصر",
    cityEn: "Port Said, Egypt",
    descriptionAr: "قلب بورسعيد العريق بجوار البحر",
    descriptionEn: "In the heart of historic Port Said, by the Sea",
    mapsUrl: "https://maps.app.goo.gl/RnjQCZTrd8nHVCC19", // رابط خرائط جوجل المباشر
    mapsEmbedUrl: "https://maps.google.com/maps?q=Garden+Grand+Lamour+Port+Said+Egypt&t=&z=15&ie=UTF8&iwloc=&output=embed", // رابط الإطار التفاعلي
  },

  // ─── ملف الموسيقى والصوت ──────────────────────────────────
  music: {
    enabled: true,               // true لتشغيل زر الموسيقى
    url: "/wedding-song.mp3",     // مسار الملف الصوتي في مجلد public
    titleAr: "موسيقى الحفل",
    titleEn: "Wedding Music",
  },

  // ─── خيارات الأقسام (تفعيل / تعطيل) ────────────────────────
  gallery: { enabled: true },
  dressCode: { enabled: true },
  rsvp: { enabled: true, maxGuests: 10 },
  wishlist: { enabled: false },  // معطل
};
```

---

## 5. 🖼️ طريقة تغيير الصور والأصوات والأصول (`public/`)

جميع الملفات الثابتة (الصور، الأيقونات، ملف الصوت) تحفظ في مجلد **`public/`** في الجذر الرئيسي للمشروع:

* **`public/wedding-song.mp3`**: أغنية / موسيقى الخلفية.
* **`public/og-image.jpg`**: صورة بطاقة الظرف وصورة المعاينة عند مشاركة الرابط على واتساب وفيسبوك.
* **`public/couple-illustration.png`**: الرسم الإليستريتور للعروسين في واجهة Hero.
* **`public/watercolor-splash.png`**: الخلفيات والألوان المائية.
* **`public/watercolor-floral.png`**: أوراق الورد في الأركان.

> 💡 **ملاحظة:** يتم استدعاء جميع الملفات عبر الدالة الذكية `getAssetUrl('/filename')` لتضمن عملها تلقائياً على اللوكل وعلى GitHub Pages دون مشاكل مسارات.

---

## 6. 🔥 ربط الفايربيس وإضافة صور المعرض والتهاني

المشروع مزود بدعم **Cloud Firestore**:

### 💌 تأكيدات الحضور والتهاني (RSVP & Wishes):
* عندما يقوم الضيف بتأكيد حضوره وكتابة كلمة تهنئة، يتم حفظ البيانات فورياً في كولكشن `rsvps` في الفايربيس.
* تظهر الرسالة فوراً في قسم **"أمنيات وتهاني الأحبة" (Wishes Wall)** على الموقع.

### 📷 إضافة صور إلى معرض الصور عبر الفايربيس:
1. اذهب إلى **Firebase Console** ➔ **Firestore Database**.
2. اختر الكولكشن باسم **`gallery`**.
3. أضف مستند جديد بالـ **Auto-ID** وأضف الحقول:
   * **`url`**: رابط الصورة المباشر (يدعم روابط Google Drive و Imgur تلقائياً).
   * **`alt`**: وصف الصورة.
   * **`aspectRatio`**: اختر بين (`portrait` طولي / `landscape` عرضي / `square` مربع).
   * **`order`**: رقم الترتيب (1, 2, 3...).

📄 **لمزيد من التفاصيل والدلائل المخصصة، اراجع الملفات المرفقة للمشروع:**
* [FIREBASE_INTEGRATION_GUIDE.md](file:///c:/Users/Hamdy/OneDrive/Documents/Projects/Invitations/FIREBASE_INTEGRATION_GUIDE.md)
* [GITHUB_PUBLISHING_GUIDE.md](file:///c:/Users/Hamdy/OneDrive/Documents/Projects/Invitations/GITHUB_PUBLISHING_GUIDE.md)
* [HOW_TO_ADD_GALLERY_PHOTOS.md](file:///c:/Users/Hamdy/OneDrive/Documents/Projects/Invitations/HOW_TO_ADD_GALLERY_PHOTOS.md)

---

## 7. 🎨 نظام التصميم والألوان والخطوط (Design System & Fonts)

جميع التنسيقات والمتغيرات محفوظة في ملف **`src/styles/global.css`**:

```css
:root {
  /* درجات العاجي والكريمي (Ivory Backgrounds) */
  --cream-50:  #FDFAF6;
  --cream-100: #F8F4EF;
  --cream-200: #F0E8DC;

  /* درجات الروز الهادئ (Blush Accent) */
  --blush-100: #EDCFCF;
  --blush-200: #D4A5A5;
  --blush-300: #C08080;

  /* درجات الذهبي الفاخر (Gold Elements) */
  --gold-200:  #D4AF37;
  --gold-300:  #C9A96E;
  --gold-400:  #B8924A;

  /* درجات البني الترابي للنصوص (Warm Brown Typography) */
  --text-primary:   #3D2B1F;
  --text-secondary: #6B4C3B;
  --text-muted:     #A07860;
}
```

---

✨ **بهذا يصبح لديك مرجع دائم وشامل لكل ما يتعلق بمشروع زفاف حمدى ورودينا!**
