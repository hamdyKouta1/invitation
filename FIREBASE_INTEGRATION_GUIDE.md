# 🌐 الدليل الشامل لربط خادم الفايربيس (Firebase Integration Guide)

يقدم هذا الدليل خطوة بخطوة كيفية ربط موقع دعوة الزفاف بقاعدة بيانات **Google Firebase** الحية، لحفظ واستقبال تأكيدات الحضور (RSVP) ورسائل التهاني (Wishes) من الضيوف ومزامنتها لحظياً.

---

## 📋 الخطوة 1: إنشاء مشروع جديد على Google Firebase

1. افتح متصفح الإنترنت وانتقل إلى موقع [Firebase Console](https://console.firebase.google.com/).
2. قم بتسجيل الدخول باستخدام حساب Google الخاص بك.
3. اضغط على زر **"Add project" (إضافة مشروع)**.
4. أدخل اسم المشروع (مثلاً: `wedding-invitation-2026`).
5. اضغط **"Continue"**.
6. (اختياري) يمكنك تعطيل أو تفعيل **Google Analytics** حسب رغبتك، ثم اضغط **"Create project"**.
7. انتظر عدة ثوانٍ حتى يتم تجهيز المشروع ثم اضغط **"Continue"**.

---

## 💻 الخطوة 2: إضافة تطبيق ويب (Web App) واستخراج مفاتيح الاتصال

1. من الصفحة الرئيسية للمشروع في Firebase Console، اضغط على أيقونة الويب **`</>`** (Add app).
2. أدخل اسماً للتطبيق (مثلاً: `Wedding Web App`).
3. (اختياري) لا داعي للـ Firebase Hosting حالياً إذا كنت ستستخدم GitHub Pages.
4. اضغط **"Register app"**.
5. سيظهر لك كود إعداد الـ Firebase يحتوي على كائن `firebaseConfig`. **احتفظ بهذه البيانات**:
   ```javascript
   apiKey: "AIzaSy...",
   authDomain: "wedding-invitation-2026.firebaseapp.com",
   projectId: "wedding-invitation-2026",
   storageBucket: "wedding-invitation-2026.appspot.com",
   messagingSenderId: "1234567890",
   appId: "1:1234567890:web:abcdef123456"
   ```

---

## 🗄️ الخطوة 3: تفعيل قاعدة البيانات (Cloud Firestore Database)

1. من القائمة الجانبية اليسرى لـ Firebase Console، اختر **"Build"** ➔ **"Firestore Database"**.
2. اضغط على زر **"Create database" (إصدار قاعدة بيانات)**.
3. اختر موقع الخادم (Database Location): يُفضل اختيار **`eur3 (europe-west)`** للمستخدمين في مصر والشرق الأوسط لسرعة الاستجابة.
4. اختر وضع البدء: **"Start in test mode" (البدء في وضع الاختبار)** ثم اضغط **"Next"** ➔ **"Enable"**.

---

## 🔐 الخطوة 4: ضبط قواعد الأمان (Firestore Security Rules)

لكي يتمكن الضيوف من إرسال تأكيدات الحضور وقراءة التهاني دون الحاجة لتسجيل دخول:

1. من داخل **Firestore Database**، انتقل إلى تبويب **"Rules" (القواعد)** في الأعلى.
2. قم باستبدال الكود الموجود بالكود التالي لتأمين القراءة والكتابة:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. قواعد إعدادات الزفاف الحية (Config) — القراءة للجميع والكتابة للوحة الإدارة
    match /config/{document} {
      allow read: if true;
      allow write: if true;
    }
    
    // 2. قواعد تأكيد الحضور والتهاني (RSVP & Wishes)
    match /rsvps/{document} {
      allow read: if true;
      allow create: if request.resource.data.name is string 
                   && request.resource.data.name.size() > 0;
      allow update, delete: if true; // للوحة التحكم
    }
    
    // 3. قواعد معرض الصور (Gallery)
    match /gallery/{document} {
      allow read: if true;
      allow write: if true; // لإضافة وحذف الصور من لوحة التحكم
    }
  }
}
```
3. اضغط على زر **"Publish" (نشر)** لتطبيق القواعد.

---

## ⚙️ الخطوة 5: ربط مفاتيح الفايربيس بالمشروع (`.env.local`)

1. في مجلد المشروع الرئيسي، أنشئ ملفاً جديداً باسم **`.env.local`** (أو انسخ الملف `.env.example`).
2. ضع المفاتيح التي حصلت عليها في الخطوة 2 داخل الملف كالتالي:

```env
# تفعيل الفايربيس بدلاً من البيانات الوهمية
VITE_FIREBASE_ENABLED=true

# بيانات المشروع من Firebase Console
VITE_FIREBASE_API_KEY=AIzaSy...ضع_المفتاح_الخاص_بك
VITE_FIREBASE_AUTH_DOMAIN=wedding-invitation-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wedding-invitation-2026
VITE_FIREBASE_STORAGE_BUCKET=wedding-invitation-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

> ⚠️ **ملاحظة مهمة:** ملف `.env.local` محمي وموجود في `.gitignore` فلن يتم رفعه على GitHub لضمان أمان المفاتيح.

---

## 🧪 الخطوة 6: اختبار الربط وقراءة البيانات الحية

1. شغّل سيرفر التطوير المحلي:
   ```bash
   npm run dev
   ```
2. افتح الموقع، وانتقل إلى قسم **تأكيد الحضور (RSVP)**.
3. أدخل اسم تجريبي ورسالة تهنئة واضغط **"تأكيد الحضور وإرسال التهنئة"**.
4. ادخل إلى **Firebase Console** ➔ **Firestore Database** ➔ **Data**.
5. ستشاهد مجموعة جديدة باسم `rsvps` تم إنشاؤها فورياً تحتوي على الاسم، الهاتف، عدد المرافقين، والتهنئة!
6. ستظهر التهنئة فورياً في قسم **"أمنيات وتهاني الأحبة"** على الموقع.

---

🎉 **تهانينا! اكتمل ربط الفايربيس بنجاح 100%.**
