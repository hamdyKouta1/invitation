import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import '../i18n';
import '../styles/global.css';
import '../styles/animations.css';
import '../styles/rtl.css';
import './AdminApp.css';

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
