# 🚀 الدليل الشامل لنشر موقع الدعوة على GitHub Pages (Publishing Guide)

يشرح هذا الدليل خطوة بخطوة كيفية رفع ونشر موقع دعوة الزفاف مجاناً على **GitHub Pages** ليصبح متاحاً أونلاين عبر رابط مباشر يسهل مشاركته عبر واتساب ووسائل التواصل.

---

## 📌 الخطوة 1: إنشـاء المستودع (Repository) على GitHub

1. سجّل الدخول إلى حسابك على [GitHub.com](https://github.com/).
2. اضغط على زر **"+"** في الأعلى جهة اليمين واختر **"New repository"**.
3. ادخل اسم المستودع (Repository Name): مثلاً `wedding` (أو `invitation`).
4. اجعل المستودع **Public** (عام) ليتاح تفعيل خدمة GitHub Pages المجانية.
5. لا تقم بتحديد "Add a README file" إذا كان المشروع موجوداً بالفعل على جهازك.
6. اضغط زر **"Create repository"**.
7. انسخ رابط المستودع الجديد (مثلاً: `https://github.com/your-username/wedding.git`).

---

## 🛠️ الخطوة 2: تهيئة Git ورفع الكود المصدري

افتح مبدل الأوامر (Terminal / PowerShell) داخل مجلد المشروع ونفّذ الأوامر التالية بالترتيب:

```bash
# 1. تهيئة مستودع Git محلي
git init

# 2. إضافة جميع ملفات المشروع
git add .

# 3. حفظ التغييرات بحافظة أولية
git commit -m "Initial wedding invitation project commit"

# 4. تغيير اسم الفرع الرئيسي إلى main
git branch -M main

# 5. ربط المستودع المحلي بمستودع GitHub (استبدل your-username و wedding برابطك)
git remote add origin https://github.com/your-username/wedding.git

# 6. رفع الكود إلى GitHub
git push -u origin main
```

---

## ⚙️ الخطوة 3: إضافة سكريبت النشر `gh-pages` في `package.json`

تثبيت أداة `gh-pages` لبناء ونشر المجلد التلقائي بضغط زر واحدة:

1. نفّذ الأمر التالي في التيرمنال لتثبيت الأداة:
   ```bash
   npm install --save-dev gh-pages
   ```

2. افتح ملف **`package.json`** وأضف الأوامر التالية داخل قسم `"scripts"`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

---

## 🌐 الخطوة 4: ضبط مسار البناء (Base Path) في `vite.config.js`

إذا كان اسم المستودع على GitHub هو `wedding` (والرابط سيكون `https://your-username.github.io/wedding/`):

1. افتح ملف **`vite.config.js`**.
2. تأكد أن المتغير `base` مضبوط كالتالي (أو اكتب اسم المستودع مباشرة):

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// استبدل '/wedding/' باسم المستودع الخاص بك على GitHub
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/wedding/' : '/',
  build: {
    outDir: 'dist'
  }
})
```

---

## 🚀 الخطوة 5: تشغيل النشر (Deploy)

نفّذ أمر النشر التلقائي في التيرمنال:

```bash
npm run deploy
```

سيقوم السكريبت تلقائياً بـ:
1. بناء نسخة الانتاج الرسمية في مجلد `dist/`.
2. إنشاء فرع جديد على GitHub باسم `gh-pages`.
3. رفع الملفات الجاهزة وتفعيل البث المباشر.

---

## ⚙️ الخطوة 6: تفعيل GitHub Pages من إعدادات المستودع

1. اذهب إلى صفحة المستودع الخاص بك على موقع GitHub.
2. اضغط على تبويب **"Settings" (الإعدادات)** ➔ اختر من القائمة الجانبية **"Pages"**.
3. تحت قسم **"Build and deployment"**:
   - Source: اختر **"Deploy from a branch"**.
   - Branch: اختر فرع **`gh-pages`** ثم مجلد **`/(root)`**.
   - اضغط **"Save"**.
4. انتظر دقيقة واحدة، ثم أعد تنشيط الصفحة. ستشاهد بنر أخضر يخبرك برابط الموقع المباشر:
   `https://your-username.github.io/wedding/`

---

## 📲 الخطوة 7: تحديث رابط المشاركة في `weddingConfig.js`

بعد الحصول على رابط الموقع المباشر:

1. افتح ملف **`src/config/weddingConfig.js`**.
2. حدّث قسم الـ `sharing` بالرابط الجديد الخاص بك ليعمل زر المشاركة عبر الواتساب بدقة:

```javascript
sharing: {
  url: "https://your-username.github.io/wedding/",
  messageAr: "🎉 دعوة زفاف — شاركونا فرحتنا! {url}",
  messageEn: "🎉 Wedding Invitation — Join us on our special day! {url}",
}
```

3. قم برفع التعديل مجدداً بـ:
   ```bash
   npm run deploy
   ```

---

✨ **مبارك! أصبح موقع دعوة الزفاف لايف ومتاحاً للعالم أجمع أونلاين.**
