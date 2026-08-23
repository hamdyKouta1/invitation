import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  XCircle,
  Search,
  MessageSquare,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  HeartHandshake,
  Music,
  Calendar,
  Save,
  FileCode,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

import {
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  resetGalleryImages,
  getWeddingConfigFromDB,
  saveWeddingConfigToDB,
} from '../../services';

import {
  getActiveConfig,
  saveActiveConfig,
  resetActiveConfig,
  downloadConfigFile,
  clone,
} from '../../utils/configManager';

import { generateOTP, sendOTPEmail, verifyOTP, isMailProviderConfigured } from '../../services/mail/otpService';
import './AdminPortal.css';

const AUTH_STORAGE_KEY = 'wedding_admin_2fa_auth';
// Credentials read ONLY from environment variables — no hardcoded fallbacks
const ENV_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ENV_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true';
const IS_DEV = import.meta.env.DEV;

const AdminPortal = ({ onClose }) => {
  // ─── Authentication State ───
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  // Step 1: Credentials — empty by default (user must type, not auto-filled)
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email+Password, 2 = OTP verification
  const [otpSentTo, setOtpSentTo] = useState(''); // Only the EMAIL shown, never the code

  // Step 2: OTP — code is stored in sessionStorage ONLY, never in React state
  const [otpInput, setOtpInput] = useState('');
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(5);
  const [resendTimer, setResendTimer] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // ─── Dashboard State ───
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'analytics' | 'gallery' | 'config'
  const [toastMessage, setToastMessage] = useState(null);

  // Guests
  const [guests, setGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [editingGuest, setEditingGuest] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  // Gallery
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageAspect, setNewImageAspect] = useState('portrait');
  const [newImageOrder, setNewImageOrder] = useState('');

  // Config
  const [configData, setConfigData] = useState(() => getActiveConfig());
  const [savingConfig, setSavingConfig] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Load data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    loadGuestsList();
    loadGalleryList();
    loadConfigFromCloud();
  };

  const loadGuestsList = async () => {
    setLoadingGuests(true);
    try {
      const data = await getGuests();
      setGuests(data || []);
    } catch (err) {
      console.error(err);
      showToast('تعذر تحميل قائمة الضيوف', 'error');
    } finally {
      setLoadingGuests(false);
    }
  };

  const loadGalleryList = async () => {
    setLoadingGallery(true);
    try {
      const data = await getGalleryImages();
      setGalleryImages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadConfigFromCloud = async () => {
    if (FIREBASE_ENABLED) {
      try {
        const cloudConfig = await getWeddingConfigFromDB();
        if (cloudConfig) {
          saveActiveConfig(cloudConfig);
          setConfigData(cloudConfig);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ─── Step 1: Submit Credentials & Send OTP ───
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!ENV_EMAIL || !ENV_PASSWORD) {
      setAuthError('خطأ في الإعداد: VITE_ADMIN_EMAIL أو VITE_ADMIN_PASSWORD غير محدد في ملف .env');
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();
    const expectedEmail = ENV_EMAIL.trim().toLowerCase();

    // Strict check — ONLY against .env values, no hardcoded fallbacks
    const emailMatch = trimmedEmail === expectedEmail;
    const passwordMatch = passwordInput === ENV_PASSWORD;

    if (!emailMatch || !passwordMatch) {
      setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      return;
    }

    setAuthLoading(true);
    try {
      const generatedCode = generateOTP();
      // OTP is sent to session storage inside sendOTPEmail — code is NOT stored in React state
      await sendOTPEmail(trimmedEmail, generatedCode);
      setOtpSentTo(trimmedEmail); // Only store EMAIL, never the code
      setOtpAttemptsLeft(5);
      setStep(2);
      setResendTimer(60);
      const mailConfigured = isMailProviderConfigured();
      showToast(
        mailConfigured
          ? `تم إرسال رمز التحقق OTP إلى ${trimmedEmail}`
          : IS_DEV
            ? 'وضع التطوير: رمز OTP موجود في Console المتصفح فقط (F12)'
            : 'تحذير: لم يتم إعداد خدمة البريد الإلكتروني في ملف .env'
      );
    } catch (err) {
      console.error('[AdminPortal] OTP send error:', err);
      setAuthError(
        err.message.includes('No mail provider')
          ? 'لم يتم إعداد خدمة البريد (EmailJS أو SMTP). يرجى إعداد ملف .env وإعادة تشغيل السيرفر.'
          : 'تعذر إرسال رمز التحقق، يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ───
  const handleStep2Submit = (e) => {
    e.preventDefault();
    setAuthError('');

    const res = verifyOTP(otpInput);
    if (res.valid) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      showToast('تمت المصادقة الثنائية بنجاح! مرحباً بك في لوحة التحكم.');
    } else {
      if (res.error === 'expired') {
        setAuthError('انتهت صلاحية رمز التحقق. يرجى العودة وإرسال رمز جديد.');
        setStep(1);
      } else if (res.error === 'too_many_attempts') {
        setAuthError('تم تجاوز عدد المحاولات المسموحة. يرجى البدء من جديد.');
        setStep(1);
      } else {
        const left = res.attemptsLeft ?? (otpAttemptsLeft - 1);
        setOtpAttemptsLeft(left);
        setOtpInput('');
        setAuthError(
          left > 0
            ? `رمز التحقق غير صحيح. تبقّى ${left} محاولة.`
            : 'تم تجاوز عدد المحاولات. يرجى البدء من جديد.'
        );
        if (left <= 0) setStep(1);
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setAuthLoading(true);
    setAuthError('');
    setOtpInput('');
    try {
      const generatedCode = generateOTP();
      // OTP stored in sessionStorage ONLY — never in React state
      await sendOTPEmail(otpSentTo, generatedCode);
      setOtpAttemptsLeft(5);
      setResendTimer(60);
      const mailConfigured = isMailProviderConfigured();
      showToast(
        mailConfigured
          ? 'تم إرسال رمز تحقق جديد بنجاح'
          : IS_DEV ? 'رمز جديد في Console المتصفح (F12)' : 'يرجى إعداد خدمة البريد في .env'
      );
    } catch (err) {
      console.error(err);
      setAuthError('تعذر إعادة إرسال الرمز.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setStep(1);
    setEmailInput('');
    setPasswordInput('');
    setOtpInput('');
    setOtpSentTo('');
    setOtpAttemptsLeft(5);
    setAuthError('');
  };

  // ─── Guest Actions ───
  const handleSaveGuest = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const guestPayload = {
      name: formData.get('name'),
      phone: formData.get('phone') || '',
      attendance: formData.get('attendance'),
      guestsCount: Number(formData.get('guestsCount')) || 0,
      message: formData.get('message') || '',
    };

    try {
      if (editingGuest && editingGuest.id) {
        await updateGuest(editingGuest.id, guestPayload);
        showToast('تم تحديث بيانات الضيف بنجاح في قاعدة البيانات');
      } else {
        await addGuest(guestPayload);
        showToast('تمت إضافة الضيف بنجاح إلى قاعدة البيانات');
      }
      setIsGuestModalOpen(false);
      setEditingGuest(null);
      loadGuestsList();
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ بيانات الضيف', 'error');
    }
  };

  const handleDeleteGuest = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف الضيف "${name}" من قاعدة البيانات؟`)) return;
    try {
      await deleteGuest(id);
      showToast('تم حذف الضيف بنجاح من قاعدة البيانات');
      loadGuestsList();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف الضيف', 'error');
    }
  };

  const exportGuestsCSV = () => {
    if (guests.length === 0) {
      showToast('لا يوجد ضيوف لتصديرهم', 'error');
      return;
    }
    const headers = ['الاسم', 'الهاتف', 'الحالة', 'عدد المرافقين', 'رسالة التهنئة', 'تاريخ التسجيل'];
    const rows = guests.map((g) => [
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      g.attendance === 'will_attend' ? 'سأحضر' : 'اعتذر',
      g.guestsCount || 0,
      `"${(g.message || '').replace(/"/g, '""')}"`,
      `"${g.createdAt ? new Date(g.createdAt).toLocaleString('ar-EG') : ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding_guests_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف CSV بنجاح');
  };

  const exportGuestsJSON = () => {
    const blob = new Blob([JSON.stringify(guests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding_guests_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف JSON بنجاح');
  };

  // ─── Gallery Actions ───
  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      showToast('يرجى إدخال رابط الصورة أو رابط Google Drive', 'error');
      return;
    }

    try {
      const orderVal = newImageOrder !== '' ? parseInt(newImageOrder, 10) : (galleryImages.length + 1);
      await addGalleryImage({
        url: newImageUrl.trim(),
        alt: newImageAlt.trim() || 'صورة من حفل زفاف حمدى ورودينا',
        aspectRatio: newImageAspect,
        order: !isNaN(orderVal) ? orderVal : 1,
      });
      setNewImageUrl('');
      setNewImageAlt('');
      setNewImageOrder('');
      showToast('تمت إضافة الصورة بنجاح إلى قاعدة بيانات المعرض');
      loadGalleryList();
    } catch (err) {
      console.error(err);
      showToast('تعذر إضافة الصورة', 'error');
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الصورة من المعرض وقاعدة البيانات؟')) return;
    try {
      await deleteGalleryImage(id);
      showToast('تم حذف الصورة بنجاح');
      loadGalleryList();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف الصورة', 'error');
    }
  };

  const handleResetGallery = async () => {
    if (!window.confirm('هل تريد استعادة الصور الافتراضية للمعرض؟')) return;
    try {
      await resetGalleryImages();
      showToast('تمت استعادة المعرض الافتراضي');
      loadGalleryList();
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Config Actions ───
  const handleConfigChange = (section, field, value) => {
    setConfigData((prev) => {
      const next = clone(prev);
      if (section) {
        next[section][field] = value;
      } else {
        next[field] = value;
      }
      return next;
    });
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      saveActiveConfig(configData);

      if (FIREBASE_ENABLED) {
        await saveWeddingConfigToDB(configData);
      }

      showToast(
        FIREBASE_ENABLED
          ? 'تم حفظ الإعدادات مباشرة في قاعدة بيانات Firestore ومحلياً!'
          : 'تم حفظ الإعدادات محلياً بنجاح!'
      );
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الإعدادات', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleUploadDefaultToFirestore = async () => {
    if (!window.confirm('هل تريد رفع الإعدادات الافتراضية (weddingConfig) وتعيينها كأولوية أولى في Firestore DB؟')) return;
    setSavingConfig(true);
    try {
      if (FIREBASE_ENABLED) {
        await saveWeddingConfigToDB(configData);
      }
      saveActiveConfig(configData);
      showToast('تم رفع وتعيين الإعدادات بنجاح في قاعدة بيانات Firestore!');
    } catch (err) {
      console.error(err);
      showToast('فشل رفع الإعدادات إلى Firestore', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleResetConfig = () => {
    if (!window.confirm('هل تريد استعادة الإعدادات الأصلية؟')) return;
    resetActiveConfig();
    setConfigData(getActiveConfig());
    showToast('تمت استعادة الإعدادات الأصلية');
  };

  // ─── Metrics ───
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      (g.name || '').toLowerCase().includes(guestSearch.toLowerCase()) ||
      (g.phone || '').includes(guestSearch) ||
      (g.message || '').toLowerCase().includes(guestSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (guestFilter === 'will_attend') return g.attendance === 'will_attend';
    if (guestFilter === 'wont_attend') return g.attendance === 'wont_attend';
    if (guestFilter === 'has_message') return g.message && g.message.trim().length > 0;
    return true;
  });

  const totalRsvps = guests.length;
  const attendingGuests = guests.filter((g) => g.attendance === 'will_attend');
  const declinedGuests = guests.filter((g) => g.attendance === 'wont_attend');
  const totalAttendeesCount = attendingGuests.reduce((sum, g) => sum + 1 + (Number(g.guestsCount) || 0), 0);
  const acceptanceRate = totalRsvps > 0 ? Math.round((attendingGuests.length / totalRsvps) * 100) : 0;
  const messagesCount = guests.filter((g) => g.message && g.message.trim().length > 0).length;

  // ─── 1. Two-Factor Authentication Modal ───
  if (!isAuthenticated) {
    return (
      <div className="admin-portal-overlay">
        <div className="admin-portal-login-card">
          <button onClick={onClose} className="admin-portal-close-top" title="إغلاق">
            <X size={20} />
          </button>

          <div className="admin-portal-login-header">
            <div className="admin-portal-icon-badge">
              <ShieldCheck size={32} />
            </div>
            <h2 className="admin-portal-title font-serif">لوحة الإدارة والمتابعة السرية</h2>
            <p className="admin-portal-subtitle">نظام المصادقة الثنائية (2FA Authentication)</p>
          </div>

          {authError && <div className="admin-alert admin-alert--error">{authError}</div>}

          {step === 1 ? (
            /* Step 1: Email & Password */
            <form onSubmit={handleStep1Submit} className="admin-portal-form">
              <div className="admin-form-group">
                <label className="admin-label">
                  <Mail size={16} /> البريد الإلكتروني للمسؤول (Admin Email)
                </label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  <Lock size={16} /> كلمة المرور السرية (Password)
                </label>
                <div className="admin-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="admin-input"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="admin-btn admin-btn--primary admin-btn--block"
              >
                <Send size={18} />
                {authLoading ? 'جارٍ التحقق والإرسال...' : 'متابعة وإرسال رمز التحقق OTP'}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleStep2Submit} className="admin-portal-form">
              <div className="admin-otp-notice">
                <p>
                  تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني:
                </p>
                <strong className="admin-otp-email-display">{otpSentTo}</strong>

                {IS_DEV && !isMailProviderConfigured() && (
                  <div className="admin-dev-console-hint">
                    <span>🔧 وضع التطوير (Dev Mode):</span> لم يتم إعداد خدمة البريد في ملف <code>.env</code>.
                    يمكنك إيجاد رمز OTP في <strong>Console المتصفح → F12</strong>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  <KeyRound size={16} /> أدخل رمز التحقق (OTP Code)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  className="admin-input admin-input--otp"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                />
                <span className="admin-otp-attempts-label">
                  المحاولات المتبقية: {otpAttemptsLeft} من 5
                </span>
              </div>

              <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
                <CheckCircle size={18} />
                تأكيد الدخول إلى لوحة التحكم
              </button>

              <div className="admin-otp-footer">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || authLoading}
                  className="admin-btn-link"
                >
                  {resendTimer > 0 ? `إعادة الإرسال بعد (${resendTimer}s)` : 'إعادة إرسال رمز جديد'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setAuthError(''); setOtpInput(''); }}
                  className="admin-btn-link"
                >
                  تغيير البريد أو كلمة المرور
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── 2. Main Dashboard Interface ───
  return (
    <div className="admin-portal-fullpage">
      {/* Toast */}
      {toastMessage && (
        <div className={`admin-toast admin-toast--${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="admin-navbar">
        <div className="admin-navbar__brand">
          <Sparkles className="admin-brand-icon" size={24} />
          <div>
            <h1 className="admin-brand-title font-serif">لوحة إدارة دعوة زفاف حمدى ورودينا</h1>
            <div className="admin-brand-badges">
              <span className="admin-badge admin-badge--gold">المصادقة الثنائية 2FA نشطة</span>
              <span className={`admin-badge ${FIREBASE_ENABLED ? 'admin-badge--success' : 'admin-badge--warning'}`}>
                {FIREBASE_ENABLED ? '🟢 Firestore Live DB' : '🟡 Local Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-navbar__actions">
          <button onClick={onClose} className="admin-btn admin-btn--outline" title="العودة للدعوة الرئيسية">
            <ExternalLink size={16} />
            <span>عرض الدعوة</span>
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn--danger-outline" title="تسجيل الخروج">
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'guests' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          <Users size={18} />
          <span>الضيوف وتأكيد الحضور ({totalRsvps})</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>التحليلات والإحصائيات</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'gallery' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} />
          <span>معرض الصور ({galleryImages.length})</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'config' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={18} />
          <span>إعدادات الزفاف المباشرة</span>
        </button>
      </nav>

      {/* Content */}
      <main className="admin-main">
        {/* TAB 1: GUESTS */}
        {activeTab === 'guests' && (
          <div className="admin-section">
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon admin-kpi-icon--gold"><Users size={24} /></div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-label">إجمالي الردود (RSVPs)</span>
                  <span className="admin-kpi-value">{totalRsvps}</span>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon admin-kpi-icon--green"><CheckCircle size={24} /></div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-label">المؤكد حضورهم</span>
                  <span className="admin-kpi-value">{attendingGuests.length}</span>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon admin-kpi-icon--blue"><HeartHandshake size={24} /></div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-label">إجمالي الحضور (+المرافقين)</span>
                  <span className="admin-kpi-value">{totalAttendeesCount}</span>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon admin-kpi-icon--red"><XCircle size={24} /></div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-label">المعتذرون</span>
                  <span className="admin-kpi-value">{declinedGuests.length}</span>
                </div>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <Search size={18} className="admin-search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="بحث باسم الضيف، رقم الهاتف، أو نص التهنئة..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-group">
                <button
                  className={`admin-filter-btn ${guestFilter === 'all' ? 'admin-filter-btn--active' : ''}`}
                  onClick={() => setGuestFilter('all')}
                >
                  الكل ({guests.length})
                </button>
                <button
                  className={`admin-filter-btn ${guestFilter === 'will_attend' ? 'admin-filter-btn--active' : ''}`}
                  onClick={() => setGuestFilter('will_attend')}
                >
                  سأحضر ({attendingGuests.length})
                </button>
                <button
                  className={`admin-filter-btn ${guestFilter === 'wont_attend' ? 'admin-filter-btn--active' : ''}`}
                  onClick={() => setGuestFilter('wont_attend')}
                >
                  اعتذر ({declinedGuests.length})
                </button>
                <button
                  className={`admin-filter-btn ${guestFilter === 'has_message' ? 'admin-filter-btn--active' : ''}`}
                  onClick={() => setGuestFilter('has_message')}
                >
                  تهاني ({messagesCount})
                </button>
              </div>

              <div className="admin-btn-group">
                <button
                  onClick={() => { setEditingGuest(null); setIsGuestModalOpen(true); }}
                  className="admin-btn admin-btn--primary"
                >
                  <Plus size={16} />
                  <span>إضافة ضيف</span>
                </button>
                <button onClick={exportGuestsCSV} className="admin-btn admin-btn--outline" title="تصدير CSV">
                  <Download size={16} />
                  <span>CSV</span>
                </button>
                <button onClick={exportGuestsJSON} className="admin-btn admin-btn--outline" title="تصدير JSON">
                  <FileCode size={16} />
                  <span>JSON</span>
                </button>
                <button onClick={loadGuestsList} className="admin-btn admin-btn--ghost" title="تحديث">
                  <RefreshCw size={16} className={loadingGuests ? 'admin-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="admin-table-container">
              {loadingGuests ? (
                <div className="admin-loading-state">
                  <RefreshCw className="admin-spin" size={32} />
                  <p>جارٍ تحميل بيانات الضيوف من Firestore...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="admin-empty-state">
                  <Users size={48} />
                  <p>لا توجد نتائج مطابقة</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>الاسم واللقب</th>
                      <th>رقم الهاتف</th>
                      <th>الحالة</th>
                      <th>المرافقين</th>
                      <th>كلمة التهنئة</th>
                      <th>تاريخ التسجيل</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((g, idx) => (
                      <tr key={g.id || idx}>
                        <td className="admin-td-muted">{idx + 1}</td>
                        <td className="admin-td-strong">{g.name}</td>
                        <td className="admin-td-mono">{g.phone || '—'}</td>
                        <td>
                          {g.attendance === 'will_attend' ? (
                            <span className="admin-status-badge admin-status-badge--success">
                              <CheckCircle size={14} /> سأحضر
                            </span>
                          ) : (
                            <span className="admin-status-badge admin-status-badge--danger">
                              <XCircle size={14} /> اعتذر
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="admin-companions-pill">
                            +{g.guestsCount || 0}
                          </span>
                        </td>
                        <td className="admin-td-message" title={g.message}>
                          {g.message ? (
                            <span className="admin-message-preview">
                              <MessageSquare size={14} /> {g.message}
                            </span>
                          ) : (
                            <span className="admin-td-muted">—</span>
                          )}
                        </td>
                        <td className="admin-td-muted">
                          {g.createdAt ? new Date(g.createdAt).toLocaleDateString('ar-EG') : '—'}
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              onClick={() => { setEditingGuest(g); setIsGuestModalOpen(true); }}
                              className="admin-icon-btn admin-icon-btn--edit"
                              title="تعديل"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(g.id, g.name)}
                              className="admin-icon-btn admin-icon-btn--delete"
                              title="حذف"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <div className="admin-analytics-grid">
              <div className="admin-card">
                <h3 className="admin-card-title">معدل قبول الدعوة (Acceptance Rate)</h3>
                <div className="admin-gauge-wrap">
                  <div className="admin-gauge-val">{acceptanceRate}%</div>
                  <p className="admin-gauge-desc">
                    {attendingGuests.length} من إجمالي {totalRsvps} أكدوا حضورهم
                  </p>
                </div>
                <div className="admin-progress-bar">
                  <div className="admin-progress-bar__fill" style={{ width: `${acceptanceRate}%` }} />
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">توزيع الحضور والمرافقين</h3>
                <div className="admin-stats-list">
                  <div className="admin-stat-row">
                    <span>المدعوون الأساسيون المؤكدون:</span>
                    <strong>{attendingGuests.length}</strong>
                  </div>
                  <div className="admin-stat-row">
                    <span>إجمالي المرافقين الإضافيين:</span>
                    <strong>{totalAttendeesCount - attendingGuests.length}</strong>
                  </div>
                  <div className="admin-stat-row admin-stat-row--total">
                    <span>المجموع الإجمالي للأفراد المتوقعين:</span>
                    <strong>{totalAttendeesCount} شخص</strong>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">حائط التهاني (Wishes Wall)</h3>
                <div className="admin-stats-list">
                  <div className="admin-stat-row">
                    <span>رسائل التهنئة المستلمة:</span>
                    <strong>{messagesCount} رسالة</strong>
                  </div>
                  <div className="admin-stat-row">
                    <span>نسبة الضيوف الذين تركوا رسائل:</span>
                    <strong>{totalRsvps > 0 ? Math.round((messagesCount / totalRsvps) * 100) : 0}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="admin-section">
            <div className="admin-card admin-card--highlight">
              <h3 className="admin-card-title">
                <ImageIcon size={20} />
                إضافة صورة جديدة لمعرض الزفاف (Google Drive / Direct URL ➔ Firestore DB)
              </h3>
              <form onSubmit={handleAddGalleryImage} className="admin-gallery-form">
                <div className="admin-gallery-form-grid">
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">رابط الصورة المباشر أو رابط Google Drive *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="https://drive.google.com/file/d/1Tse-ZniYpa1yU7p2wvn6P8wbqYmL... أو أي رابط صورة مباشر"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">ترتيب ظهور الصورة (Order - رقم صحيح 1, 2, 3...) *</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="admin-input"
                      placeholder={String((galleryImages?.length || 0) + 1)}
                      value={newImageOrder}
                      onChange={(e) => setNewImageOrder(e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">أبعاد الصورة (Aspect Ratio)</label>
                    <select
                      className="admin-input admin-select"
                      value={newImageAspect}
                      onChange={(e) => setNewImageAspect(e.target.value)}
                    >
                      <option value="portrait">طولية (Portrait 3:4)</option>
                      <option value="landscape">عرضية (Landscape 4:3)</option>
                      <option value="square">مربعة (Square 1:1)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">وصف الصورة (Alt Text)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="جلسة تصوير العروسين بورسعيد"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                  </div>
                </div>

                {newImageUrl && (
                  <div className="admin-img-preview-box">
                    <span>معاينة الرابط:</span>
                    <img src={newImageUrl} alt="Preview" className="admin-img-preview-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span style={{ fontSize: '0.8rem', color: '#a89f91', wordBreak: 'break-all' }}>{newImageUrl}</span>
                  </div>
                )}

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    <Plus size={18} />
                    إضافة الصورة لمعرض Firestore
                  </button>
                  <button type="button" onClick={handleResetGallery} className="admin-btn admin-btn--ghost">
                    استعادة الصور الافتراضية
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-gallery-grid-section">
              <div className="admin-section-header">
                <h3 className="admin-card-title">الصور الحالية في المعرض ({galleryImages.length})</h3>
                <button onClick={loadGalleryList} className="admin-btn admin-btn--ghost">
                  <RefreshCw size={16} className={loadingGallery ? 'admin-spin' : ''} />
                  تحديث
                </button>
              </div>

              {loadingGallery ? (
                <div className="admin-loading-state">
                  <RefreshCw className="admin-spin" size={32} />
                  <p>جارٍ تحميل صور المعرض من Firestore...</p>
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="admin-empty-state">
                  <ImageIcon size={48} />
                  <p>لا توجد صور مضافة في المعرض حالياً.</p>
                </div>
              ) : (
                <div className="admin-gallery-grid">
                  {galleryImages.map((img, index) => (
                    <div key={img.id || index} className="admin-gallery-card">
                      <div className={`admin-gallery-thumb-wrap admin-gallery-thumb-wrap--${img.aspectRatio || 'portrait'}`}>
                        {img.url ? (
                          <img src={img.url} alt={img.alt || 'Photo'} className="admin-gallery-img" />
                        ) : (
                          <div className="admin-gallery-no-img">بدون صورة</div>
                        )}
                        <span className="admin-aspect-pill">{img.aspectRatio || 'portrait'}</span>
                        <span className="admin-order-pill">#{img.order ?? index + 1}</span>
                      </div>
                      <div className="admin-gallery-info">
                        <p className="admin-gallery-alt">{img.alt || `صورة رقم ${index + 1}`}</p>
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="admin-btn admin-btn--danger-sm"
                          title="حذف الصورة"
                        >
                          <Trash2 size={14} />
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CONFIG */}
        {activeTab === 'config' && (
          <div className="admin-section">
            <div className="admin-config-header">
              <div>
                <h2 className="admin-section-title font-serif">تعديل إعدادات الزفاف المباشرة</h2>
                <p className="admin-section-desc">
                  الأولوية الأولى: يتم قراءة الإعدادات وحفظها مباشرة في قاعدة بيانات Firestore <code style={{ color: '#d4af37' }}>config/wedding</code> لتنعكس فوراً على موقع الدعوة.
                </p>
              </div>
              <div className="admin-btn-group">
                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="admin-btn admin-btn--primary"
                  title="حفظ التعديلات في سحابة Firestore"
                >
                  <Save size={18} />
                  <span>{savingConfig ? 'جارٍ الحفظ...' : 'حفظ في Firestore DB'}</span>
                </button>
                <button
                  onClick={handleUploadDefaultToFirestore}
                  disabled={savingConfig}
                  className="admin-btn admin-btn--outline"
                  title="رفع الإعدادات المعروضة وتعيينها كأولوية أولى في Firestore"
                >
                  <Upload size={18} />
                  <span>رفع إلى Firebase</span>
                </button>
                <button
                  onClick={() => downloadConfigFile(configData)}
                  className="admin-btn admin-btn--outline"
                >
                  <Download size={18} />
                  <span>تحميل weddingConfig.js</span>
                </button>
                <button onClick={handleResetConfig} className="admin-btn admin-btn--ghost">
                  استعادة الافتراضي
                </button>
              </div>
            </div>

            <div className="admin-config-grid">
              {/* Couple */}
              <div className="admin-card">
                <h3 className="admin-card-title">
                  <HeartHandshake size={20} />
                  بيانات العريس والعروسة
                </h3>

                <h4 className="admin-subset-title">بيانات العريس (Groom)</h4>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">اسم العريس (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.name || ''}
                      onChange={(e) => handleConfigChange('groom', 'name', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم العريس (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.nameEn || ''}
                      onChange={(e) => handleConfigChange('groom', 'nameEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عائلة العريس (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.familyTitleAr || ''}
                      onChange={(e) => handleConfigChange('groom', 'familyTitleAr', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عائلة العريس (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.familyTitleEn || ''}
                      onChange={(e) => handleConfigChange('groom', 'familyTitleEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم والد العريس</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.father || ''}
                      onChange={(e) => handleConfigChange('groom', 'father', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم والدة العريس</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.groom?.mother || ''}
                      onChange={(e) => handleConfigChange('groom', 'mother', e.target.value)}
                    />
                  </div>
                </div>

                <h4 className="admin-subset-title" style={{ marginTop: '1.5rem' }}>بيانات العروسة (Bride)</h4>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">اسم العروسة (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.name || ''}
                      onChange={(e) => handleConfigChange('bride', 'name', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم العروسة (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.nameEn || ''}
                      onChange={(e) => handleConfigChange('bride', 'nameEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عائلة العروسة (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.familyTitleAr || ''}
                      onChange={(e) => handleConfigChange('bride', 'familyTitleAr', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عائلة العروسة (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.familyTitleEn || ''}
                      onChange={(e) => handleConfigChange('bride', 'familyTitleEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم والد العروسة</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.father || ''}
                      onChange={(e) => handleConfigChange('bride', 'father', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم والدة العروسة</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.bride?.mother || ''}
                      onChange={(e) => handleConfigChange('bride', 'mother', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="admin-card">
                <h3 className="admin-card-title">
                  <Calendar size={20} />
                  موعد الحفل والمكان
                </h3>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">التاريخ (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={configData.wedding?.date || ''}
                      onChange={(e) => handleConfigChange('wedding', 'date', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">تاريخ ISO للعد التنازلي</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.wedding?.dateTime || ''}
                      onChange={(e) => handleConfigChange('wedding', 'dateTime', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عرض التاريخ (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.wedding?.dateDisplay || ''}
                      onChange={(e) => handleConfigChange('wedding', 'dateDisplay', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">عرض التاريخ (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.wedding?.dateDisplayEn || ''}
                      onChange={(e) => handleConfigChange('wedding', 'dateDisplayEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">الوقت (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.wedding?.time || ''}
                      onChange={(e) => handleConfigChange('wedding', 'time', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">الوقت (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.wedding?.timeEn || ''}
                      onChange={(e) => handleConfigChange('wedding', 'timeEn', e.target.value)}
                    />
                  </div>
                </div>

                <h4 className="admin-subset-title" style={{ marginTop: '1.5rem' }}>تفاصيل القاعة والمكان (Venue)</h4>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">اسم القاعة (بالعربي)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.venue?.nameAr || ''}
                      onChange={(e) => handleConfigChange('venue', 'nameAr', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">اسم القاعة (English)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.venue?.nameEn || ''}
                      onChange={(e) => handleConfigChange('venue', 'nameEn', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">رابط خرائط جوجل المباشر (Google Maps Link)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.venue?.mapsUrl || ''}
                      onChange={(e) => handleConfigChange('venue', 'mapsUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Music & Toggles */}
              <div className="admin-card">
                <h3 className="admin-card-title">
                  <Music size={20} />
                  الموسيقى واللغة وتفعيل الأقسام
                </h3>
                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">اللغة الافتراضية للدعوة</label>
                    <select
                      className="admin-input admin-select"
                      value={configData.defaultLanguage || 'ar'}
                      onChange={(e) => handleConfigChange(null, 'defaultLanguage', e.target.value)}
                    >
                      <option value="ar">العربية (Arabic)</option>
                      <option value="en">English (الإنجليزية)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">مسار ملف الأغنية (Audio URL / File)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={configData.music?.url || ''}
                      onChange={(e) => handleConfigChange('music', 'url', e.target.value)}
                    />
                  </div>
                </div>

                <h4 className="admin-subset-title" style={{ marginTop: '1.5rem' }}>تفعيل وتعطيل الأقسام</h4>
                <div className="admin-toggles-grid">
                  <label className="admin-toggle-label">
                    <input
                      type="checkbox"
                      checked={configData.music?.enabled === true}
                      onChange={(e) => handleConfigChange('music', 'enabled', e.target.checked)}
                    />
                    <span>تشغيل الموسيقى (Music)</span>
                  </label>

                  <label className="admin-toggle-label">
                    <input
                      type="checkbox"
                      checked={configData.gallery?.enabled === true}
                      onChange={(e) => handleConfigChange('gallery', 'enabled', e.target.checked)}
                    />
                    <span>معرض الصور (Gallery)</span>
                  </label>

                  <label className="admin-toggle-label">
                    <input
                      type="checkbox"
                      checked={configData.dressCode?.enabled === true}
                      onChange={(e) => handleConfigChange('dressCode', 'enabled', e.target.checked)}
                    />
                    <span>الدريس كود (Dress Code)</span>
                  </label>

                  <label className="admin-toggle-label">
                    <input
                      type="checkbox"
                      checked={configData.rsvp?.enabled === true}
                      onChange={(e) => handleConfigChange('rsvp', 'enabled', e.target.checked)}
                    />
                    <span>تأكيد الحضور (RSVP)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Guest Edit/Add Modal */}
      {isGuestModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingGuest ? 'تعديل بيانات الضيف' : 'إضافة ضيف جديد'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => { setIsGuestModalOpen(false); setEditingGuest(null); }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="admin-modal-form">
              <div className="admin-form-group">
                <label className="admin-label">الاسم واللقب *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="admin-input"
                  defaultValue={editingGuest?.name || ''}
                  placeholder="مثال: د. أحمد محمد"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  className="admin-input"
                  defaultValue={editingGuest?.phone || ''}
                  placeholder="010XXXXXXXX"
                />
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">تأكيد الحضور *</label>
                  <select
                    name="attendance"
                    className="admin-input admin-select"
                    defaultValue={editingGuest?.attendance || 'will_attend'}
                  >
                    <option value="will_attend">سأحضر بإذن الله</option>
                    <option value="wont_attend">اعتذر عن الحضور</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">عدد المرافقين الإضافيين</label>
                  <input
                    type="number"
                    name="guestsCount"
                    min="0"
                    max="15"
                    className="admin-input"
                    defaultValue={editingGuest?.guestsCount || 0}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">رسالة التهنئة / ملاحظات</label>
                <textarea
                  name="message"
                  rows={3}
                  className="admin-input admin-textarea"
                  defaultValue={editingGuest?.message || ''}
                  placeholder="ألف مبروك لأجمل عروسين..."
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="admin-btn admin-btn--primary">
                  {editingGuest ? 'تحديث في Firestore' : 'إضافة الضيف'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => { setIsGuestModalOpen(false); setEditingGuest(null); }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
