// filters.js — Client-side filtering UI
// Router (app.js) handles url sync; this module handles UI interactions only

import { renderArticleList } from './render.js';
import { getHashParams, setHashParams, debounce, $, $$ } from './utils.js';

let currentArticles = [];
let onFilterCallback = null;

// Initialize filter bar UI
export function initFilters(articles, onFilterChange) {
  currentArticles = articles;
  onFilterCallback = onFilterChange;

  // Read initial params from hash and apply
  const params = getHashParams();
  if (Object.keys(params).length > 0) {
    const result = applyFilterFn(articles, params);
    onFilterChange(result);
  }

  // Source select
  const sourceSelect = $('#filter-source');
  if (sourceSelect) {
    sourceSelect.addEventListener('change', () => {
      const val = sourceSelect.value;
      setHashParams({ source: val });
      const result = applyFilterFn(currentArticles, getHashParams());
      onFilterCallback(result);
    });
  }

  // Sub-category chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const active = $$('.filter-chip.active').map(c => c.dataset.sub).join(',');
      setHashParams({ sub: active || null });
      const result = applyFilterFn(currentArticles, getHashParams());
      onFilterCallback(result);
    });
  });

  // Search input with debounce
  const searchInput = $('#filter-search');
  if (searchInput) {
    const debouncedSearch = debounce(() => {
      setHashParams({ search: searchInput.value || null });
      const result = applyFilterFn(currentArticles, getHashParams());
      onFilterCallback(result);
    }, 300);
    searchInput.addEventListener('input', debouncedSearch);
  }

  // Clear all filters
  const clearBtn = $('#filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (sourceSelect) sourceSelect.value = '';
      if (searchInput) searchInput.value = '';
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      // Remove all query params from hash, keep path
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = hash.split('?')[0] || '';
      window.location.hash = `#/${path}`;
      onFilterCallback([...currentArticles]);
    });
  }

  // Mobile filter toggle
  const filterToggle = $('#filter-toggle');
  const filterBar = $('#filter-bar');
  if (filterToggle && filterBar) {
    filterToggle.addEventListener('click', () => filterBar.classList.toggle('collapsed'));
  }

  updateFilterCount(params);
}

// Pure filter function (no DOM side effects)
function applyFilterFn(articles, params) {
  let filtered = [...articles];

  if (params.source) {
    filtered = filtered.filter(a => a.sourceId === params.source);
  }
  if (params.sub) {
    const activeSubs = params.sub.split(',').filter(Boolean);
    if (activeSubs.length > 0) {
      filtered = filtered.filter(a => activeSubs.includes(a.subCategory));
    }
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.summary || '').toLowerCase().includes(q) ||
      (a.source || '').toLowerCase().includes(q)
    );
  }

  updateFilterCount(params);
  return filtered;
}

function updateFilterCount(params) {
  const countEl = $('#filter-active-count');
  if (countEl) {
    const activeCount = Object.values(params || {}).filter(v => v).length;
    countEl.textContent = activeCount > 0
      ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active`
      : '';
  }
}

// Update articles reference without re-rendering filter UI
export function updateArticles(articles) {
  currentArticles = articles;
}
