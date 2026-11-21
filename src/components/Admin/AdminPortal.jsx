import React from 'react';
import CustomerDashboard from '../CustomerDashboard/CustomerDashboard';
import OwnerAdmin from '../OwnerAdmin/OwnerAdmin';

/**
 * AdminPortal Wrapper (Phase 5 — Role Separation & Phase 1 — Security Remediation)
 * - Routes customer RSVP/guest management to CustomerDashboard (Firebase Auth protected).
 * - Routes operator-only provisioning (#owner-admin) to OwnerAdmin (operator environment gated).
 * - Contains zero hardcoded credentials or client-side OTP secrets (SEC-001, SEC-002).
 */
const AdminPortal = ({ mode = 'customer', onClose }) => {
  if (mode === 'owner') {
    return <OwnerAdmin onClose={onClose} />;
  }
  return <CustomerDashboard onClose={onClose} />;
};

export default AdminPortal;
