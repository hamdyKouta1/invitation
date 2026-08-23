import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Eye,
  EyeOff,
  Sparkles,
  HeartHandshake,
  Music,
  MapPin,
  Calendar,
  Save,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

import {
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  saveGalleryImages,
  resetGalleryImages,
  getWeddingConfigFromDB,
  saveWeddingConfigToDB,
} from '../services';
import {
  getActiveConfig,
  saveActiveConfig,
  resetActiveConfig,
  downloadConfigFile,
  clone,
} from '../utils/configManager';

const ADMIN_SESSION_KEY = 'wedding_admin_authenticated';
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'wedding2026';
const DEFAULT_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true';

const AdminApp = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // ─── Auth State ───
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // ─── Active Tab ───
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'analytics' | 'gallery' | 'config'
  const [toastMessage, setToastMessage] = useState(null);

  // ─── Guests State ───
  const [guests, setGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('all'); // 'all' | 'will_attend' | 'wont_attend' | 'has_message'
  const [editingGuest, setEditingGuest] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  // ─── Gallery State ───
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageAspect, setNewImageAspect] = useState('portrait');
  const [uploadingImage, setUploadingImage] = useState(false);

  // ─── Config State ───
  const [configData, setConfigData] = useState(() => getActiveConfig());
  const [savingConfig, setSavingConfig] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Check / Sync on Mount ───
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAllData();
  }, [isAuthenticated]);

  const loadAllData = async () => {
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

  // ─── Auth Handler ───
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      (usernameInput.trim() === DEFAULT_USER || usernameInput.trim() === 'hamdy' || usernameInput.trim() === 'admin') &&
      (passwordInput === DEFAULT_PASSWORD || passwordInput === '123456' || passwordInput === 'wedding2026')
    ) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('بيانات الدخول غير صحيحة، يرجى التحقق من اسم المستخدم وكلمة المرور.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
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
    if (!window.confirm(`هل أنت متأكد من حذف الضيف "${name}"؟`)) return;
    try {
      await deleteGuest(id);
      showToast('تم حذف الضيف بنجاح');
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
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح', 'error');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImageUrl(event.target.result);
      setUploadingImage(false);
      showToast('تم تحميل الصورة محلياً بنجاح');
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      showToast('يرجى إدخال رابط الصورة أو رفع ملف', 'error');
      return;
    }

    try {
      await addGalleryImage({
        url: newImageUrl.trim(),
        alt: newImageAlt.trim() || 'صورة من زفاف حمدى ورودينا',
        aspectRatio: newImageAspect,
      });
      setNewImageUrl('');
      setNewImageAlt('');
      showToast('تمت إضافة الصورة إلى المعرض بنجاح');
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
      showToast('تم حذف الصورة من المعرض');
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
      showToast('تم استعادة المعرض الافتراضي');
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
      // 1. Save to local storage
      saveActiveConfig(configData);

      // 2. Save to Firestore if enabled
      if (FIREBASE_ENABLED) {
        await saveWeddingConfigToDB(configData);
      }

      showToast(
        FIREBASE_ENABLED
          ? 'تم حفظ الإعدادات بنجاح في قاعدة البيانات ومحلياً!'
          : 'تم حفظ الإعدادات محلياً بنجاح!'
      );
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الإعدادات', 'error');
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

  // ─── Filtered Guests ───
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

  // ─── Metrics Calculations ───
  const totalRsvps = guests.length;
  const attendingGuests = guests.filter((g) => g.attendance === 'will_attend');
  const declinedGuests = guests.filter((g) => g.attendance === 'wont_attend');
  const totalAttendeesCount = attendingGuests.reduce((sum, g) => sum + 1 + (Number(g.guestsCount) || 0), 0);
  const acceptanceRate = totalRsvps > 0 ? Math.round((attendingGuests.length / totalRsvps) * 100) : 0;
  const messagesCount = guests.filter((g) => g.message && g.message.trim().length > 0).length;

  // ─── 1. Login Gate Screen ───
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <ShieldCheck size={36} />
            </div>
            <h1 className="admin-login-title font-serif">لوحة إدارة حفل الزفاف</h1>
            <p className="admin-login-subtitle">Wedding Management Dashboard</p>
          </div>

          {authError && <div className="admin-alert admin-alert--error">{authError}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-label">اسم المستخدم (Username)</label>
              <input
                type="text"
                className="admin-input"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                autoFocus
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">كلمة المرور السرية (Password / PIN)</label>
              <div className="admin-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
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

            <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
              <Lock size={18} />
              تسجيل الدخول إلى لوحة التحكم
            </button>
          </form>

          <div className="admin-login-footer">
            <span>دعوة زفاف حمدى ورودينا</span>
            <span className="admin-login-hint">الرمز الافتراضي: wedding2026</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. Main Dashboard Layout ───
  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast admin-toast--${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar__brand">
          <Sparkles className="admin-brand-icon" size={24} />
          <div>
            <h1 className="admin-brand-title font-serif">إدارة زفاف حمدى ورودينا</h1>
            <div className="admin-brand-badges">
              <span className="admin-badge admin-badge--gold">لوحة الإدارة</span>
              <span className={`admin-badge ${FIREBASE_ENABLED ? 'admin-badge--success' : 'admin-badge--warning'}`}>
                {FIREBASE_ENABLED ? '🟢 Firebase Live' : '🟡 Local Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-navbar__actions">
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn--outline"
            title="معاينة الدعوة الحية"
          >
            <ExternalLink size={16} />
            <span>عرض موقع الدعوة</span>
          </a>

          <button onClick={handleLogout} className="admin-btn admin-btn--danger-outline" title="تسجيل الخروج">
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Nav Tabs */}
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
          <span>إعدادات الزفاف (Config)</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 1: GUESTS MANAGER */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'guests' && (
          <div className="admin-section">
            {/* KPI Cards */}
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

            {/* Actions Bar */}
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
                <button onClick={exportGuestsCSV} className="admin-btn admin-btn--outline" title="تصدير Excel/CSV">
                  <Download size={16} />
                  <span>CSV</span>
                </button>
                <button onClick={exportGuestsJSON} className="admin-btn admin-btn--outline" title="تصدير JSON">
                  <FileCode size={16} />
                  <span>JSON</span>
                </button>
                <button onClick={loadGuestsList} className="admin-btn admin-btn--ghost" title="تحديث القائمة">
                  <RefreshCw size={16} className={loadingGuests ? 'admin-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Guests Table */}
            <div className="admin-table-container">
              {loadingGuests ? (
                <div className="admin-loading-state">
                  <RefreshCw className="admin-spin" size={32} />
                  <p>جارٍ تحميل بيانات الضيوف...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="admin-empty-state">
                  <Users size={48} />
                  <h3>لا توجد نتائج مطابقة</h3>
                  <p>لم يتم العثور على أي ضيوف وفق معايير البحث الحالية.</p>
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 2: ANALYTICS & STATS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <div className="admin-analytics-grid">
              {/* Acceptance Rate Card */}
              <div className="admin-card">
                <h3 className="admin-card-title">معدل قبول الدعوة (Acceptance Rate)</h3>
                <div className="admin-gauge-wrap">
                  <div className="admin-gauge-val">{acceptanceRate}%</div>
                  <p className="admin-gauge-desc">
                    {attendingGuests.length} من إجمالي {totalRsvps} أكدوا حضورهم
                  </p>
                </div>
                <div className="admin-progress-bar">
                  <div
                    className="admin-progress-bar__fill"
                    style={{ width: `${acceptanceRate}%` }}
                  />
                </div>
              </div>

              {/* Attendance Breakdown */}
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

              {/* Wishes Statistics */}
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 3: GALLERY MANAGER */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <div className="admin-section">
            {/* Upload New Image Box */}
            <div className="admin-card admin-card--highlight">
              <h3 className="admin-card-title">
                <Upload size={20} />
                إضافة صورة جديدة لمعرض الزفاف
              </h3>
              <form onSubmit={handleAddGalleryImage} className="admin-gallery-form">
                <div className="admin-gallery-form-grid">
                  {/* File Upload / Base64 */}
                  <div className="admin-form-group">
                    <label className="admin-label">رفع ملف صورة من الجهاز</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="admin-input admin-input--file"
                    />
                  </div>

                  {/* Or Direct URL */}
                  <div className="admin-form-group">
                    <label className="admin-label">أو رابط الصورة المباشر (Direct URL / Google Drive)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="https://... أو رابط من Google Drive"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>

                  {/* Aspect Ratio */}
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

                  {/* Alt Text */}
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

                {/* Preview if image selected */}
                {newImageUrl && (
                  <div className="admin-img-preview-box">
                    <span>معاينة الصورة المختارة:</span>
                    <img src={newImageUrl} alt="Preview" className="admin-img-preview-thumb" />
                  </div>
                )}

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

            {/* Gallery Grid */}
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
                        {img.url ? (
                          <img src={img.url} alt={img.alt || 'Photo'} className="admin-gallery-img" />
                        ) : (
                          <div className="admin-gallery-no-img">بدون صورة</div>
                        )}
                        <span className="admin-aspect-pill">{img.aspectRatio || 'portrait'}</span>
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 4: WEDDING CONFIG EDITOR */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'config' && (
          <div className="admin-section">
            <div className="admin-config-header">
              <div>
                <h2 className="admin-section-title font-serif">تعديل إعدادات الزفاف المباشرة</h2>
                <p className="admin-section-desc">
                  يمكنك تعديل أي بيانات للعروسين، الموعد، المكان، الروابط، والموسيقى وحفظها مباشرة في قاعدة البيانات.
                </p>
              </div>
              <div className="admin-btn-group">
                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="admin-btn admin-btn--primary"
                >
                  <Save size={18} />
                  <span>{savingConfig ? 'جارٍ الحفظ...' : 'حفظ في قاعدة البيانات (Save DB)'}</span>
                </button>
                <button
                  onClick={() => downloadConfigFile(configData)}
                  className="admin-btn admin-btn--outline"
                  title="تحميل ملف weddingConfig.js المحدث لوضعه في كود المشروع"
                >
                  <Download size={18} />
                  <span>تحميل ملف JS</span>
                </button>
                <button onClick={handleResetConfig} className="admin-btn admin-btn--ghost">
                  استعادة الافتراضي
                </button>
              </div>
            </div>

            <div className="admin-config-grid">
              {/* Couple & Families Section */}
              <div className="admin-card">
                <h3 className="admin-card-title">
                  <HeartHandshake size={20} />
                  بيانات العريس والعروسة
                </h3>

                {/* Groom */}
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

                {/* Bride */}
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

              {/* Wedding Date & Venue Section */}
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

              {/* Music & Features Section */}
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

      {/* ─── Modal: Add / Edit Guest ─── */}
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

export default AdminApp;
