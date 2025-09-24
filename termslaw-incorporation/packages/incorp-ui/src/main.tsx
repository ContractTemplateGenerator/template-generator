import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

function resolveBasename() {
  const raw = import.meta.env.BASE_URL ?? '/';
  if (raw === './') {
    return '/';
  }
  if (!raw.startsWith('/')) {
    const sanitized = raw.replace(/^\/+/u, '').replace(/\/+$/u, '');
    return sanitized ? `/${sanitized}` : '/';
  }
  return raw.length > 1 ? raw.replace(/\/+$/u, '') : raw;
}

function applyFavicon() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    return;
  }
  const href = new URL('favicon.svg', import.meta.env.BASE_URL ?? '/');
  link.href = href.toString();
}

if (typeof document !== 'undefined') {
  applyFavicon();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={resolveBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
