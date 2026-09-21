# 💒 موقع دعوة الزفاف التفاعلي الفاخر | Luxury Interactive Wedding Invitation

موقع ويب تفاعلي متكامل لدعوة زفاف ملكية فاخرة، مبني بأحدث تقنيات الويب مع لوحة تحكم أمنية كاملة بالمصادقة الثنائية (2FA) ومزامنة لحظية مباشرة عبر **Google Cloud Firestore**.

---

## ✨ المميزات الرئيسية (Key Features)

- ✉️ **فتح الظرف التفاعلي (Interactive Envelope & Wax Seal):** تجربة ثلاثية الأبعاد بصرية مبهرة مع موسيقى ناعمة ومؤثرات صوتية.
- 🌐 **ثنائي اللغة كامل (Dual Language AR / EN):** دعم أصيل للغة العربية باتجاه **RTL** مع خطوط رقعة وإسكندرية ملكية، واللغة الإنجليزية مع التبديل الفوري دون إعادة تحميل الصفحة.
- ⏳ **العد التنازلي المباشر (Dynamic Countdown):** عداد تنازلي دقيق حتى لحظة الحفل مع جملة انتهاء احتفالية قابلة للتخصيص بالعربية والإنجليزية.
- 👨‍👩‍👧‍👦 **بطاقات العائلات (Families & Parents):** بطاقات فخمة لآباء وأمهات العروسين مع إمكانية إظهار أو إخفاء أسماء الأمهات بضغطة زر.
- 🗺️ **المكان والخريطة (Venue & Maps):** تفاصيل موعد ومكان الحفل مع خريطة جوجل تفاعلية وزر للانتقال المباشر لتطبيق الخرائط.
- 💌 **تأكيد الحضور الذكي (Smart RSVP):** نموذج إلكتروني مرن لتأكيد الحضور أو الاعتذار مع تحديد عدد المرافقين، وحفظ فوري في قاعدة بيانات Firestore.
- 💬 **حائط التهاني الحي (Live Wishes Wall):** عرض رسائل وتهاني الأحبة مباشرة فور إرسالها مع بطاقات مميزة.
- 📸 **معرض الصور التفاعلي (Photo Gallery):** استعراض صور الخطوبة والزفاف بتقنية Lightbox مع دعم الصور الطولية والعرضية.
- 👔 **الدريس كود (Dress Code):** استعراض لوحة ألوان ملابس الحفل للرجال والسيدات.
- 🎁 **قسم الهدايا والتحويل الرقمي (Wishlist & Gifting):**
  - دعم التحويل المباشر عبر **Instapay** و الحساب البنكي / **IBAN** مع زر نسخ بنقرة واحدة.
  - **قائمة هدايا تفاعلية (Gift Items):** فحص وتحديد حالة التوفر والحجز (`Available` / `Reserved`) مع إمكانية حجز الهدية مباشرة من قبل الضيف.
- 🛡️ **لوحة إدارة وتحكم سرية متكاملة (Admin Portal & 2FA):**
  - محمية بمصادقة ثنائية (Email + Password + OTP).
  - إدارة كاملة للضيوف والردود وتصديرها إلى **Excel/CSV** و **JSON**.
  - إدارة ورفع صور المعرض.
  - **معدّل الإعدادات المباشر (Live Config Editor):** تعديل كافة بيانات الزفاف والمكان والهدايا مع زر حفظ مباشر في سحابة Firestore لتنعكس فوراً على موقع الدعوة دون إعادة نشر الكود.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19, Vite 8, Framer Motion 13, Lucide React
- **Internationalization:** i18next, react-i18next (Arabic RTL & English LTR)
- **Database & Backend:** Google Cloud Firestore (Firebase 12), EmailJS / Resend (OTP Service)
- **Styling:** Custom Luxury CSS Design System (Ivory, Gold, Blush tones)
- **Deployment:** GitHub Pages (Automated Deployment via `gh-pages`)

---

## 🚀 كيفية التشغيل محلياً (Quick Start)

### المتطلبات:
- Node.js (الإصدار 18 أو أحدث)
- npm

### الخطوات:
```bash
# 1. استنساخ المشروع
git clone https://github.com/hamdyKouta1/invitation.git
cd invitation

# 2. تثبيت الحزم والمكتبات
npm install

# 3. تشغيل سيرفر التطوير المحلي
npm run dev
```

افتح المتصفح على: `http://localhost:5173/` (أو الرابط الموضح في التيرمنال).

---

## 🔑 فتح لوحة التحكم (Admin Portal Access)

للدخول إلى لوحة التحكم من المتصفح:
- محلياً: `http://localhost:5173/#admin-secret`
- الرابط الحي: `https://hamdyKouta1.github.io/invitation/#admin-secret`

> يتم سحب بيانات تسجيل الدخول من ملف البيئة المتغيرات `.env` (`VITE_ADMIN_EMAIL`, `VITE_ADMIN_PASSWORD`).

---

## 📦 النشر على GitHub Pages (Deployment)

لتحديث النسخة الحية على الإنترنت بضغطة واحدة:
```bash
npm run deploy
```

---

## 📖 الأدلة التوضيحية الإضافية (Documentation Guides)

- 📘 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md): الدليل الشامل لكافة إعدادات المشروع وتخصيص البيانات.
- 🔥 [FIREBASE_INTEGRATION_GUIDE.md](./FIREBASE_INTEGRATION_GUIDE.md): دليل ربط وتفعيل الفايربيس وFirestore.
- 🚀 [GITHUB_PUBLISHING_GUIDE.md](./GITHUB_PUBLISHING_GUIDE.md): دليل نشر وتحديث المشروع على GitHub Pages.
- 🖼️ [HOW_TO_ADD_GALLERY_PHOTOS.md](./HOW_TO_ADD_GALLERY_PHOTOS.md): دليل إدارة ورفع صور المعرض.
- ✉️ [MAIL_SETUP.md](./MAIL_SETUP.md): دليل إعداد خدمة إرسال رموز التحقق بالبريد (OTP 2FA).
