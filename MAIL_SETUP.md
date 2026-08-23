# Mail Server Config for Wedding Admin OTP (EmailJS Setup Guide)

## Option A — EmailJS (Recommended, No Backend Needed)

1. Go to https://www.emailjs.com and create a free account.
2. **Add a Service**: Choose Gmail or Outlook, connect your email.
3. **Create a Template** with these template variables:
   ```
   Subject: رمز التحقق {{otp_code}} — لوحة إدارة حفل الزفاف
   
   مرحباً،
   
   رمز التحقق الخاص بك هو: {{otp_code}}
   
   صالح لمدة: {{valid_minutes}} دقيقة
   أُرسل الساعة: {{sent_time}}
   
   إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
   ```
4. Copy your **Service ID**, **Template ID**, and **Public Key** from EmailJS dashboard.
5. Add them to your `.env.local`:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
6. **Restart the dev server**: `npm run dev`

---

## Option B — SMTP Proxy (Node.js backend, for private use)

If you want to use Gmail/SMTP directly without EmailJS:

### 1. Install nodemailer proxy server dependencies:
```bash
cd smtp-proxy
npm install
```

### 2. Create `smtp-proxy/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hamdykouta@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=hamdykouta@gmail.com
PROXY_SECRET=your_random_secret_here
PORT=3001
```

> **Gmail Note**: You need to create an **App Password** (not your regular password):
> Google Account → Security → 2-Step Verification → App Passwords

### 3. Start the proxy:
```bash
cd smtp-proxy
node server.js
```

### 4. Configure `.env.local`:
```env
VITE_MAIL_SERVER_URL=http://localhost:3001/api/send-otp
VITE_MAIL_SERVER_SECRET=your_random_secret_here
```

---

## Dev Mode (No Mail Setup)

If **neither** option is configured:
- OTP is printed to the **browser DevTools Console** only (never in UI).
- Open F12 → Console → look for `[Wedding Admin – Dev OTP]` group.
- This is intentional for security — always configure mail before deploying.
