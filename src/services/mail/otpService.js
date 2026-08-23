/**
 * 2FA OTP Service for Admin Portal
 *
 * ─── Mail Configuration (via .env) ─────────────────────────
 *  Method 1 — EmailJS (Recommended for static hosting):
 *    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *    VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *    VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *
 *  Method 2 — SMTP via Proxy / Backend (advanced):
 *    VITE_MAIL_SERVER_URL=http://localhost:3001/api/send-otp
 *    VITE_MAIL_SERVER_SECRET=your_server_secret
 *
 *  If neither is configured → OTP goes to browser console ONLY (not visible in UI).
 */

const OTP_STORAGE_KEY = 'wedding_admin_otp_session';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const IS_DEV = import.meta.env.DEV;

/**
 * Generate a cryptographically strong 6-digit OTP
 */
export const generateOTP = () => {
  // Use crypto.getRandomValues for better randomness
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const otp = (array[0] % 900000) + 100000;
  return otp.toString();
};

/**
 * Send OTP via configured mail provider.
 * Returns { success: boolean, sentVia: string } — NEVER returns the code.
 * The code is stored in sessionStorage for verification only.
 */
export const sendOTPEmail = async (targetEmail, otpCode) => {
  // Always store in session first (for verification later)
  const sessionData = {
    code: otpCode,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  };
  sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessionData));

  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const mailServerUrl = import.meta.env.VITE_MAIL_SERVER_URL;
  const mailServerSecret = import.meta.env.VITE_MAIL_SERVER_SECRET;

  // ── Method 1: EmailJS ────────────────────────────────────
  if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: targetEmail,
            otp_code: otpCode,
            app_name: 'Wedding Invitation Admin',
            valid_minutes: '10',
            sent_time: new Date().toLocaleTimeString('ar-EG'),
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[OTPService] EmailJS error:', res.status, errorText);
        // Fallback to dev console if EmailJS fails
        if (IS_DEV) _logOTPToConsole(otpCode, 'EmailJS failed, using dev console');
        return { success: true, sentVia: 'emailjs_error_dev_fallback' };
      }

      return { success: true, sentVia: 'emailjs' };
    } catch (err) {
      console.error('[OTPService] EmailJS network error:', err);
      if (IS_DEV) _logOTPToConsole(otpCode, 'EmailJS network error, using dev console');
      return { success: true, sentVia: 'emailjs_error_dev_fallback' };
    }
  }

  // ── Method 2: Custom SMTP Proxy Server ──────────────────
  if (mailServerUrl) {
    try {
      const res = await fetch(mailServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-secret': mailServerSecret || '',
        },
        body: JSON.stringify({
          to: targetEmail,
          otp: otpCode,
          subject: 'رمز التحقق (OTP) — لوحة إدارة حفل الزفاف',
        }),
      });

      if (!res.ok) {
        console.error('[OTPService] Mail server error:', res.status);
        if (IS_DEV) _logOTPToConsole(otpCode, 'Mail server error, using dev console');
        return { success: true, sentVia: 'mail_server_error_dev_fallback' };
      }

      return { success: true, sentVia: 'mail_server' };
    } catch (err) {
      console.error('[OTPService] Mail server network error:', err);
      if (IS_DEV) _logOTPToConsole(otpCode, 'Mail server unreachable, using dev console');
      return { success: true, sentVia: 'mail_server_error_dev_fallback' };
    }
  }

  // ── No mail provider configured ──────────────────────────
  if (IS_DEV) {
    _logOTPToConsole(otpCode, 'No mail provider configured. Add VITE_EMAILJS_* or VITE_MAIL_SERVER_URL to .env');
    return { success: true, sentVia: 'dev_console_only' };
  }

  // Production: refuse to proceed without mail config
  throw new Error(
    'No mail provider configured. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY (or VITE_MAIL_SERVER_URL) in your .env file.'
  );
};

/**
 * Verify submitted OTP code against the stored session.
 * Implements attempt limiting (max 5 tries) and expiry checks.
 */
export const verifyOTP = (inputCode) => {
  const stored = sessionStorage.getItem(OTP_STORAGE_KEY);
  if (!stored) {
    return { valid: false, error: 'no_otp_session' };
  }

  try {
    const session = JSON.parse(stored);

    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: false, error: 'expired' };
    }

    if ((session.attempts || 0) >= 5) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: false, error: 'too_many_attempts' };
    }

    if (session.code === inputCode.trim()) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: true };
    }

    // Increment attempts
    session.attempts = (session.attempts || 0) + 1;
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(session));
    const remaining = 5 - session.attempts;
    return { valid: false, error: 'invalid_code', attemptsLeft: remaining };
  } catch (err) {
    console.error('[OTPService] Verification error:', err);
    return { valid: false, error: 'parse_error' };
  }
};

/**
 * Returns whether a mail provider is configured (so UI can show a warning).
 */
export const isMailProviderConfigured = () => {
  const hasEmailJS =
    !!import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    !!import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const hasMailServer = !!import.meta.env.VITE_MAIL_SERVER_URL;
  return hasEmailJS || hasMailServer;
};

/**
 * Console-only dev helper — never called in production.
 * @private
 */
const _logOTPToConsole = (code, reason) => {
  console.groupCollapsed('%c[Wedding Admin – Dev OTP]', 'color: #D4AF37; font-weight: bold; font-size: 12px;');
  console.info('%cReason:', 'color: #aaa', reason);
  console.info(
    '%cYour OTP Code: %c' + code,
    'color: #ccc',
    'color: #2ECC71; font-size: 22px; font-weight: bold; letter-spacing: 4px;'
  );
  console.info('%cValid for: 10 minutes', 'color: #aaa');
  console.groupEnd();
};
