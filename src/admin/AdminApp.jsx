import React from 'react';
import CustomerDashboard from '../components/CustomerDashboard/CustomerDashboard';
import OwnerAdmin from '../components/OwnerAdmin/OwnerAdmin';

/**
 * Standalone Admin Entry Wrapper (Phase 5 — Consolidates AdminApp.jsx & AdminPortal.jsx — ARC-002)
 * Eliminates hardcoded passwords ('wedding2026', '123456') and delegates to the
 * modular CustomerDashboard or OwnerAdmin based on URL hash/query.
 */
const AdminApp = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isOwnerMode = hash === 'owner-admin' || params?.get('portal') === 'owner';

  if (isOwnerMode) {
    return <OwnerAdmin />;
  }
  return <CustomerDashboard />;
};

export default AdminApp;
