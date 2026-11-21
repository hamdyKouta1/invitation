/**
 * DEPRECATED IN PHASE 1 (SEC-002, SEC-004):
 * Client-side OTP generation, sessionStorage verification, and embedded mail server secrets
 * have been removed and replaced by Firebase Authentication (src/services/firebase/auth.js).
 */

export const isMailProviderConfigured = () => false;
export const generateOTP = () => {
  throw new Error('Client-side OTP is deprecated (SEC-002). Use Firebase Authentication.');
};
export const sendOTPEmail = async () => {
  throw new Error('Client-side OTP mail proxy is deprecated (SEC-004). Use Firebase Authentication.');
};
export const verifyOTP = () => ({ valid: false, error: 'deprecated' });
