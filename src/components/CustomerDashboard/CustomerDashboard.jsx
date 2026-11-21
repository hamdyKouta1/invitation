import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart3,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Download,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  XCircle,
  Search,
  MessageSquare,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  HeartHandshake,
  FileCode,
  ShieldCheck,
  X,
} from 'lucide-react';

import {
  loginCustomer,
  logoutCustomer,
  sendPasswordReset,
  subscribeCustomerAuthState,
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  deleteWish,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  resetGalleryImages,
} from '../../services';
import { getFirebaseProjectInfo } from '../../services/firebase/config';
import { getActiveConfig } from '../../utils/configManager';
import { validateImageFile, isSafeImageUrl } from '../../utils/security';
import '../Admin/AdminPortal.css';

const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true';
const IS_DEV = import.meta.env.DEV === true;

const CustomerDashboard = ({ onClose }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(FIREBASE_ENABLED);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Dashboard tabs: 'guests' | 'analytics' | 'gallery'
  const [activeTab, setActiveTab] = useState('guests');
  const [toastMessage, setToastMessage] = useState(null);

  // Guests & RSVPs state
  const [guests, setGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [editingGuest, setEditingGuest] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageAspect, setNewImageAspect] = useState('portrait');
  const [newImageOrder, setNewImageOrder] = useState('');

  const activeConfig = getActiveConfig();
  const projectInfo = getFirebaseProjectInfo();
  const eventTitleAr = activeConfig?.meta?.titleAr || 'لوحة متابعة الضيوف وتأكيد الحضور';

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to Firebase Authentication state for this customer's dedicated Firebase project
  useEffect(() => {
    const unsubscribe = subscribeCustomerAuthState((user) => {
      setAuthUser(user);
      setAuthChecking(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser) return;
    loadGuestsList();
    loadGalleryList();
  }, [authUser]);

  const loadGuestsList = async () => {
    setLoadingGuests(true);
    try {
      const data = await getGuests();
      setGuests(data || []);
    } catch (err) {
      console.error('[CustomerDashboard] Load guests error:', err);
      showToast('تعذر تحميل قائمة الضيوف. تأكد من صلاحيات حسابك.', 'error');
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
      console.error('[CustomerDashboard] Load gallery error:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setResetEmailSent(false);

    if (!FIREBASE_ENABLED) {
      if (IS_DEV) {
        // Strictly local offline dev simulation (never active in production Firebase builds)
        setAuthUser({ uid: 'local-dev-customer', email: emailInput.trim() || 'customer@local.dev' });
        showToast('تم الدخول في وضع المعاينة المحلية (Local Dev Mode)');
        return;
      }
      setAuthError('خدمة Firebase Authentication غير مفعلة لهذا الموقع.');
      return;
    }

    setAuthLoading(true);
    try {
      const user = await loginCustomer(emailInput, passwordInput);
      setAuthUser(user);
      setPasswordInput('');
      showToast('تم تسجيل الدخول بنجاح إلى لوحة متابعة الضيوف!');
    } catch (err) {
      console.error('[CustomerDashboard] Auth error:', err);
      setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة، أو الحساب غير مسجل في مشروع Firebase الخاص بكم.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setAuthError('');
    if (!emailInput.trim()) {
      setAuthError('يرجى إدخال البريد الإلكتروني أولاً لإرسال رابط استعادة كلمة المرور.');
      return;
    }
    if (!FIREBASE_ENABLED) {
      setAuthError('استعادة كلمة المرور تتطلب تفعيل Firebase Authentication.');
      return;
    }
    setAuthLoading(true);
    try {
      await sendPasswordReset(emailInput.trim());
      setResetEmailSent(true);
      showToast('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.');
    } catch (err) {
      console.error('[CustomerDashboard] Password reset error:', err);
      setAuthError('تعذر إرسال رابط استعادة كلمة المرور. تحقق من البريد المدخل.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutCustomer();
    setAuthUser(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // ─── Guest & RSVP Actions ───
  const handleSaveGuest = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const guestPayload = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      attendance: formData.get('attendance') || 'will_attend',
      guestsCount: Number(formData.get('guestsCount')) || 0,
      message: String(formData.get('message') || '').trim(),
    };

    try {
      if (editingGuest && editingGuest.id) {
        await updateGuest(editingGuest.id, guestPayload);
        showToast('تم تحديث بيانات الضيف بنجاح');
      } else {
        await addGuest(guestPayload);
        showToast('تمت إضافة الضيف بنجاح');
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
    if (!window.confirm(`هل أنت متأكد من حذف رد الضيف "${name}"؟`)) return;
    try {
      await deleteGuest(id);
      try {
        await deleteWish(id);
      } catch {
        // optional public wish cleanup
      }
      showToast('تم حذف الرد بنجاح');
      loadGuestsList();
    } catch (err) {
      console.error(err);
      showToast('فشل حذف الرد', 'error');
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
    link.download = `guests_rsvps_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف CSV بنجاح');
  };

  const exportGuestsJSON = () => {
    const blob = new Blob([JSON.stringify(guests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guests_rsvps_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف JSON بنجاح');
  };

  // ─── Gallery Actions (Validated Raster Images Only — SEC-007) ───
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.errorAr, 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (isSafeImageUrl(result)) {
        setNewImageUrl(result);
        showToast('تم فحص وتحميل الصورة بنجاح');
      } else {
        showToast('ملف الصورة غير صالح أو غير آمن', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!isSafeImageUrl(newImageUrl)) {
      showToast('يرجى إدخال رابط صورة آمن (JPG/PNG/WEBP أو Google Drive)', 'error');
      return;
    }

    try {
      const orderVal = newImageOrder !== '' ? parseInt(newImageOrder, 10) : (galleryImages.length + 1);
      await addGalleryImage({
        url: newImageUrl.trim(),
        alt: newImageAlt.trim() || eventTitleAr,
        aspectRatio: newImageAspect,
        order: !isNaN(orderVal) ? orderVal : 1,
      });
      setNewImageUrl('');
      setNewImageAlt('');
      setNewImageOrder('');
      showToast('تمت إضافة الصورة بنجاح إلى المعرض');
      loadGalleryList();
    } catch (err) {
      console.error(err);
      showToast('تعذر إضافة الصورة', 'error');
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الصورة من المعرض؟')) return;
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

  if (authChecking) {
    return (
      <div className="admin-portal-overlay">
        <div className="admin-portal-login-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <RefreshCw className="admin-spin" size={32} />
          <p style={{ marginTop: '1rem' }}>جارٍ التحقق من جلسة الدخول...</p>
        </div>
      </div>
    );
  }

  // ─── 1. Customer Firebase Authentication Gate ───
  if (!authUser) {
    return (
      <div className="admin-portal-overlay">
        <div className="admin-portal-login-card">
          {onClose && (
            <button onClick={onClose} className="admin-portal-close-top" title="إغلاق">
              <X size={20} />
            </button>
          )}

          <div className="admin-portal-login-header">
            <div className="admin-portal-icon-badge">
              <ShieldCheck size={32} />
            </div>
            <h2 className="admin-portal-title font-serif">لوحة العميل لمتابعة الضيوف</h2>
            <p className="admin-portal-subtitle">Customer Guest & RSVP Dashboard</p>
          </div>

          {authError && <div className="admin-alert admin-alert--error">{authError}</div>}
          {resetEmailSent && (
            <div className="admin-alert" style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="admin-portal-form">
            <div className="admin-form-group">
              <label className="admin-label">
                <Mail size={16} /> البريد الإلكتروني للعميل (Customer Email)
              </label>
              <input
                type="email"
                required
                className="admin-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                <Lock size={16} /> كلمة المرور (Password)
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
              <Lock size={18} />
              {authLoading ? 'جارٍ تسجيل الدخول...' : 'دخول إلى لوحة متابعة الضيوف'}
            </button>

            {FIREBASE_ENABLED && (
              <div className="admin-otp-footer" style={{ marginTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={authLoading}
                  className="admin-btn-link"
                >
                  نسيت كلمة المرور؟ إرسال رابط استعادة
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ─── 2. Authenticated Customer Dashboard Interface ───
  return (
    <div className="admin-portal-fullpage">
      {toastMessage && (
        <div className={`admin-toast admin-toast--${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <header className="admin-navbar">
        <div className="admin-navbar__brand">
          <Sparkles className="admin-brand-icon" size={24} />
          <div>
            <h1 className="admin-brand-title font-serif">{eventTitleAr}</h1>
            <div className="admin-brand-badges">
              <span className="admin-badge admin-badge--gold">لوحة العميل (Customer Dashboard)</span>
              <span className={`admin-badge ${FIREBASE_ENABLED ? 'admin-badge--success' : 'admin-badge--warning'}`}>
                {FIREBASE_ENABLED ? `🟢 Firebase: ${projectInfo.projectId || 'Connected'}` : '🟡 Local Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-navbar__actions">
          {onClose ? (
            <button onClick={onClose} className="admin-btn admin-btn--outline" title="العودة للدعوة">
              <ExternalLink size={16} />
              <span>عرض الدعوة</span>
            </button>
          ) : (
            <a href="./" className="admin-btn admin-btn--outline">
              <ExternalLink size={16} />
              <span>عرض الدعوة</span>
            </a>
          )}
          <button onClick={handleLogout} className="admin-btn admin-btn--danger-outline" title="تسجيل الخروج">
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      </header>

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
          <span>إحصائيات الحضور</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'gallery' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} />
          <span>معرض الصور ({galleryImages.length})</span>
        </button>
      </nav>

      <main className="admin-main">
        {/* TAB 1: GUESTS & RSVP RESPONSES */}
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
                  <p>جارٍ تحميل ردود الضيوف...</p>
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
                          <span className="admin-companions-pill">+{g.guestsCount || 0}</span>
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
                              title="حذف الرد أو التهنئة غير المرغوبة"
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
                إضافة صورة جديدة لمعرض المناسبة (JPG / PNG / WEBP / Google Drive)
              </h3>
              <form onSubmit={handleAddGalleryImage} className="admin-gallery-form">
                <div className="admin-gallery-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">رفع صورة آمنة من الجهاز (JPG, PNG, WEBP — بحد أقصى 2MB)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="admin-input admin-input--file"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">أو رابط الصورة المباشر / Google Drive *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="https://drive.google.com/file/d/... أو رابط مباشر"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">ترتيب ظهور الصورة (Order)</label>
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

                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">وصف الصورة (Alt Text)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="وصف مختصر للصورة"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    <Plus size={18} />
                    إضافة الصورة للمعرض
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
                  <p>جارٍ تحميل صور المعرض...</p>
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
                        {img.url && isSafeImageUrl(img.url) ? (
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
                  placeholder="ألف مبروك..."
                />
              </div>

              <div className="admin-modal-actions">
                <button type="submit" className="admin-btn admin-btn--primary">
                  {editingGuest ? 'تحديث البيانات' : 'إضافة الضيف'}
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

export default CustomerDashboard;
