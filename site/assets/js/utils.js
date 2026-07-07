// utils.js — Date/time formatting and DOM helpers

export function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function todayBeijingDate() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bj.toISOString().slice(0, 10);
}

export function yesterdayBeijingDate() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  bj.setDate(bj.getDate() - 1);
  return bj.toISOString().slice(0, 10);
}

// Generate source-group CSS class from group id
export function sourceGroupClass(group) {
  return `badge-${group}`;
}

// Debounce for search input
export function debounce(fn, delay = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Get URL hash params as object (format: #/path?key=val&key2=val2)
export function getHashParams() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('?');
  const params = {};
  if (parts.length < 2) return params;
  const queryStr = parts[1];
  for (const pair of queryStr.split('&')) {
    const [key, val] = pair.split('=');
    if (key) params[key] = decodeURIComponent(val || '');
  }
  return params;
}

// Get current route path from hash
export function getHashPath() {
  const hash = window.location.hash.replace(/^#/, '');
  const questionIdx = hash.indexOf('?');
  return questionIdx >= 0 ? hash.slice(0, questionIdx) : hash;
}

// Set URL hash params while preserving the route path
export function setHashParams(newParams) {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('?');
  const path = parts[0] || '';
  const current = {};
  if (parts.length > 1) {
    for (const pair of parts[1].split('&')) {
      const [k, v] = pair.split('=');
      if (k) current[k] = decodeURIComponent(v || '');
    }
  }
  const merged = { ...current, ...newParams };
  for (const [k, v] of Object.entries(merged)) {
    if (!v) delete merged[k];
  }
  const queryStr = Object.entries(merged)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.location.hash = queryStr ? `#/${path}?${queryStr}` : `#/${path}`;
}

// Escape HTML for safe insertion
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Get element safely
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

// Set inner content for element by id
export function setContent(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
