// app.js — SPA bootstrap with dynamic view rendering

import { initRouter, navigate, getCurrentRoute } from './router.js';
import { loadSection, loadLatest, loadSources } from './data-loader.js';
import {
  renderArticleList, renderDashboard, buildSourceOptions, updateMasthead
} from './render.js';
import { initFilters } from './filters.js';
import { escapeHtml, formatShortDate, $, debounce } from './utils.js';

// ===== Section metadata (sub-categories per section) =====
const SECTION_META = {
  'core-businesses': {
    title: 'Core Businesses',
    desc: 'Semiconductor chips, wireless communication, mobile chips, PC chips & computing platforms, automotive chips & platforms, IoT & XR.',
    subs: [
      { id: 'semiconductors', label: 'Semiconductors' },
      { id: 'wireless', label: 'Wireless' },
      { id: 'mobile-chips', label: 'Mobile Chips' },
      { id: 'pc-chips-computing', label: 'PC Chips' },
      { id: 'automotive', label: 'Automotive' },
      { id: 'iot-xr', label: 'IoT & XR' }
    ]
  },
  'ip-legal': {
    title: 'IP & Legal',
    desc: 'SEP, intellectual property, patent litigation, FRAND and licensing disputes, regulatory and antitrust.',
    subs: [
      { id: 'sep', label: 'SEP / Standards' },
      { id: 'ip', label: 'IP / Intellect. Property' },
      { id: 'patent-litigation', label: 'Patent Litigation' },
      { id: 'frand-licensing', label: 'FRAND & Licensing' },
      { id: 'regulatory-antitrust', label: 'Regulatory & Antitrust' }
    ]
  },
  'growth-areas': {
    title: 'Growth Areas',
    desc: 'On-device AI and edge AI, AI PC, embodied AI and robotics, in-vehicle infotainment and ADAS, XR and spatial computing.',
    subs: [
      { id: 'on-device-ai', label: 'On-Device AI / Edge AI' },
      { id: 'ai-pc', label: 'AI PC' },
      { id: 'embodied-ai-robotics', label: 'Embodied AI & Robotics' },
      { id: 'in-vehicle-infotainment-adas', label: 'Infotainment & ADAS' },
      { id: 'xr-spatial-computing', label: 'XR / Spatial Computing' }
    ]
  },
  'macro-environment': {
    title: 'Macro Environment',
    desc: 'Customers and partners, supply chain, market performance, and geopolitics / export controls.',
    subs: [
      { id: 'customers-partners', label: 'Customers & Partners' },
      { id: 'supply-chain', label: 'Supply Chain' },
      { id: 'market-performance', label: 'Market Performance' },
      { id: 'geopolitics-export-controls', label: 'Geopolitics & Export Controls' }
    ]
  },
  'competitors': {
    title: 'Competitors',
    desc: 'Apple, MediaTek, Intel, NVIDIA, AMD, Samsung, Broadcom, Huawei and other relevant competitors.',
    subs: [
      { id: 'apple', label: 'Apple' },
      { id: 'mediatek', label: 'MediaTek' },
      { id: 'intel', label: 'Intel' },
      { id: 'nvidia', label: 'NVIDIA' },
      { id: 'amd', label: 'AMD' },
      { id: 'samsung', label: 'Samsung' },
      { id: 'broadcom', label: 'Broadcom' },
      { id: 'huawei', label: 'Huawei' },
      { id: 'other', label: 'Other' }
    ]
  },
  'stakeholders': {
    title: 'Key Stakeholders',
    desc: '3GPP, ETSI, IEEE, Wi-Fi Alliance, Bluetooth SIG, USB-IF, O-RAN Alliance, regulators, industry associations, OEMs, foundries, platform partners.',
    subs: [
      { id: '3gpp', label: '3GPP' },
      { id: 'etsi', label: 'ETSI' },
      { id: 'ieee', label: 'IEEE' },
      { id: 'wi-fi-alliance', label: 'Wi-Fi Alliance' },
      { id: 'bluetooth-sig', label: 'Bluetooth SIG' },
      { id: 'usb-if', label: 'USB-IF' },
      { id: 'o-ran', label: 'O-RAN Alliance' },
      { id: 'regulators', label: 'Regulators' },
      { id: 'industry-assoc', label: 'Industry Assoc.' },
      { id: 'oem', label: 'OEM Customers' },
      { id: 'foundry', label: 'Foundries' },
      { id: 'platform-partner', label: 'Platform Partners' }
    ]
  }
};

// ===== Bootstrap =====
async function boot() {
  initHamburger();

  // Load latest data once for masthead date
  const latest = await loadLatest();
  if (latest) updateMasthead(latest);

  let currentSectionId = null;
  let currentSectionArticles = [];

  // Init router — handles all navigation
  initRouter(async (route, opts = {}) => {
    const main = document.getElementById('app-content');
    if (!main) return;

    // Params-only change on a section → just re-apply filters
    if (opts.paramsOnly && route.type === 'section' && route.id === currentSectionId) {
      applyFilteredView(currentSectionArticles, route.params);
      return;
    }

    if (route.type === 'dashboard') {
      currentSectionId = null;
      await renderDashboardView(main, latest);
    } else if (route.type === 'section') {
      currentSectionId = route.id;
      const data = await renderSectionView(main, route.id, route.params);
      currentSectionArticles = data?.articles || [];
    } else if (route.type === 'about') {
      currentSectionId = null;
      await renderAboutView(main, latest);
    }
  });
}

// ===== Hamburger menu =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ===== Dashboard View =====
async function renderDashboardView(main, latest) {
  if (!latest) latest = await loadLatest();

  main.innerHTML = `
    <div class="section-header" style="border-bottom:2px solid var(--ink);">
      <h1 class="section-title">Today's Briefing</h1>
      <p class="body-text section-desc" id="total-articles">${latest ? `${latest.totalArticles || 0} articles across 6 sections` : 'Loading...'}</p>
    </div>
    <div class="mt-8">
      <div class="dashboard-grid" id="dashboard-grid">
        ${renderDashboard(latest)}
      </div>
    </div>
  `;

  if (!latest) {
    document.getElementById('dashboard-grid').innerHTML =
      '<div class="empty-state"><div class="empty-state-title">Unable to load data</div><div class="empty-state-desc">Please check back later.</div></div>';
  }
}

// ===== Section View =====
async function renderSectionView(main, sectionId, params) {
  const meta = SECTION_META[sectionId] || { title: sectionId, desc: '', subs: [] };
  const data = await loadSection(sectionId);

  main.innerHTML = `
    <div class="section-header">
      <h1 class="section-title" id="section-title">${escapeHtml(meta.title)}</h1>
      <p class="body-text section-desc">${escapeHtml(meta.desc)}</p>
      <p class="body-xs mt-2" id="section-count">${data ? `${data.articles?.length || 0} articles` : 'Loading...'}</p>
    </div>
    <div class="section-layout mt-6">
      <div>
        <div id="briefing-container">${data ? renderBriefingHtml(data) : '<div class="briefing-block skeleton" style="height:200px;"></div>'}</div>
        <div id="articles-container">${data ? renderArticleList(data.articles || []) : '<div class="skeleton-card"><div class="skeleton skeleton-line-lg" style="width:80%;"></div><div class="skeleton skeleton-line" style="width:100%;"></div></div>'}</div>
      </div>
      <aside class="sticky-sidebar" id="filter-sidebar">
        ${renderFilterSidebar(meta, params)}
      </aside>
    </div>
  `;

  if (!data) {
    document.getElementById('articles-container').innerHTML =
      '<div class="empty-state"><div class="empty-state-title">Unable to load data</div></div>';
    return null;
  }

  // Populate source filter & date filter
  const sourceSelect = document.getElementById('filter-source');
  if (sourceSelect) {
    sourceSelect.innerHTML = await buildSourceOptions();
    if (params.source) sourceSelect.value = params.source;
  }

  // Set search value
  const searchInput = document.getElementById('filter-search');
  if (searchInput && params.search) {
    searchInput.value = params.search;
  }

  // Set active sub-category chips from params
  if (params.sub) {
    const activeSubs = params.sub.split(',').filter(Boolean);
    document.querySelectorAll('.filter-chip').forEach(chip => {
      if (activeSubs.includes(chip.dataset.sub)) chip.classList.add('active');
    });
  }

  // Initialize filters
  initFilters(data.articles || [], (filtered) => {
    document.getElementById('articles-container').innerHTML = renderArticleList(filtered);
  });

  // Mobile filter toggle
  const filterToggle = document.getElementById('filter-toggle');
  const filterBar = document.getElementById('filter-bar');
  if (filterToggle && filterBar) {
    filterToggle.addEventListener('click', () => filterBar.classList.toggle('collapsed'));
  }

  return data;
}

// Apply filters to already-loaded section data (params-only hash change)
function applyFilteredView(articles, params) {
  // Sync filter UI from params
  const sourceSelect = document.getElementById('filter-source');
  if (sourceSelect) sourceSelect.value = params.source || '';

  const searchInput = document.getElementById('filter-search');
  if (searchInput) searchInput.value = params.search || '';

  const chips = document.querySelectorAll('.filter-chip');
  const activeSubs = (params.sub || '').split(',').filter(Boolean);
  chips.forEach(chip => {
    chip.classList.toggle('active', activeSubs.includes(chip.dataset.sub));
  });

  // Apply filtering
  let filtered = [...articles];
  if (params.source) filtered = filtered.filter(a => a.sourceId === params.source);
  if (params.sub) {
    const subs = params.sub.split(',').filter(Boolean);
    if (subs.length > 0) filtered = filtered.filter(a => subs.includes(a.subCategory));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.summary || '').toLowerCase().includes(q) ||
      (a.source || '').toLowerCase().includes(q)
    );
  }

  document.getElementById('articles-container').innerHTML = renderArticleList(filtered);
}

// Render briefing HTML inline (avoids import timing issues)
function renderBriefingHtml(data) {
  const articleMap = {};
  for (const a of (data.articles || [])) articleMap[a.id] = a;

  const briefing = data.briefing;
  if (!briefing) return '';

  const keyTakeaways = (briefing.keyTakeaways || []).map(kt => {
    const articleLinks = (kt.articleIds || []).map(id => {
      const article = articleMap[id];
      if (!article) return id;
      return `<a href="${escapeHtml(article.url)}" target="_blank" rel="noopener" class="takeaway-source-link">${escapeHtml(article.title)}</a>`;
    }).join(', ');
    const linkSuffix = articleLinks ? ` (${articleLinks})` : '';
    return `<div class="takeaway-item"><span class="takeaway-bullet">&bull;</span><span class="takeaway-text briefing-takeaway">${escapeHtml(kt.text)}${linkSuffix}</span></div>`;
  }).join('');

  const hasContent = briefing.summary || keyTakeaways;
  if (!hasContent) return '';

  return `
    <div class="briefing-block">
      <div class="briefing-label">Daily Briefing</div>
      ${briefing.summary ? `<div class="briefing-summary briefing-body">${escapeHtml(briefing.summary)}</div>` : ''}
      ${keyTakeaways ? `<div class="takeaways-list">${keyTakeaways}</div>` : ''}
    </div>
  `;
}

// ===== Filter Sidebar =====
function renderFilterSidebar(meta, params) {
  const subChips = meta.subs.map(s =>
    `<button class="filter-chip" data-sub="${s.id}">${escapeHtml(s.label)}</button>`
  ).join('');

  return `
    <button class="filter-toggle" id="filter-toggle">Filters ▾</button>
    <div class="filter-bar" id="filter-bar">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);">
        <span class="filter-heading" style="margin-bottom:0;">Filters</span>
        <a href="#" class="filter-clear" id="filter-clear">Clear all</a>
      </div>
      <p class="body-xs" id="filter-active-count" style="margin-bottom:var(--space-3);"></p>

      <div class="filter-group">
        <label class="filter-label">Source</label>
        <select class="filter-select" id="filter-source"><option value="">All Sources</option></select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Date</label>
        <select class="filter-select" id="filter-date">
          <option value="">Today</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Sub-category</label>
        <div class="filter-chips">${subChips}</div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Search</label>
        <input type="text" class="search-input" id="filter-search" placeholder="Search articles..." value="${escapeHtml(params.search || '')}">
      </div>
    </div>
  `;
}

// ===== About View =====
async function renderAboutView(main, latest) {
  const sources = await loadSources();

  const sourcesTableHtml = sources.length > 0
    ? sources.map(s => `
        <tr>
          <td>${escapeHtml(s.name)}</td>
          <td><span class="source-group-badge badge-${s.group}">${escapeHtml(s.groupLabel || s.group)}</span></td>
          <td class="${s.hasRss ? 'rss-available' : 'rss-unavailable'}">${s.hasRss ? 'Native RSS' : 'Google News'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3">Loading...</td></tr>';

  main.innerHTML = `
    <div class="section-header" style="border-bottom:2px solid var(--ink);">
      <h1 class="section-title">About & Methodology</h1>
      <p class="body-text section-desc">How this monitor works and what you need to know.</p>
    </div>

    <div class="mt-8">
      <div class="about-section">
        <h3>What This Is</h3>
        <p>Qualcomm News Monitor aggregates daily news coverage related to Qualcomm Incorporated from over 20 major foreign media sources. It is updated automatically at 07:00 CST (UTC+8) each day.</p>
        <p>The monitor organizes coverage into six thematic sections, covering Qualcomm's core businesses, intellectual property landscape, growth initiatives, competitive dynamics, macro-level forces, and key industry stakeholders.</p>
      </div>

      <div class="about-section">
        <h3>Data Sources (${sources.length} sources)</h3>
        <div style="overflow-x:auto;">
          <table class="source-table">
            <thead><tr><th>Source</th><th>Group</th><th>Feed Type</th></tr></thead>
            <tbody id="sources-tbody">${sourcesTableHtml}</tbody>
          </table>
        </div>
      </div>

      <div class="about-section">
        <h3>Methodology</h3>
        <p>Articles are fetched daily via RSS feeds (where available) and Google News search. Each article is filtered for Qualcomm relevance, deduplicated across sources, and tagged by section and sub-category.</p>
        <p>The Daily Briefing is synthesized from the most important articles using rule-based extraction (with optional LLM enhancement when an API key is configured). Key takeaways link directly to original sources.</p>
      </div>

      <div class="about-section">
        <h3>Limitations</h3>
        <p>Some premium sources (Bloomberg, WSJ, FT, etc.) do not offer public RSS feeds and are sourced via Google News or Yahoo Finance headlines. Paywalled articles are still listed when their headline contains "Qualcomm" or related keywords, even if the full text is not publicly accessible.</p>
        <p>This is an automated news aggregation tool. It is not affiliated with Qualcomm Incorporated or any of the listed media sources. All content remains the property of the original publishers.</p>
      </div>
    </div>
  `;
}

// ===== Boot =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
