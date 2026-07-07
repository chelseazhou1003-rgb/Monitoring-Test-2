// render.js — Render briefing, article cards, dashboard

import { formatTimeAgo, formatShortDate, escapeHtml, $, $$ } from './utils.js';
import { loadSection, loadLatest, loadSources } from './data-loader.js';

// Render the daily briefing block
export function renderBriefing(briefing, sourceMap, articleMap) {
  if (!briefing) return '';

  const keyTakeaways = (briefing.keyTakeaways || []).map(kt => {
    // Build links to the referenced articles
    const articleLinks = (kt.articleIds || []).map(id => {
      const article = articleMap[id];
      if (!article) return id;
      return `<a href="${escapeHtml(article.url)}" target="_blank" rel="noopener" class="takeaway-source-link">${escapeHtml(article.title)}</a>`;
    }).join(', ');

    const linkSuffix = articleLinks ? ` (${articleLinks})` : '';

    return `
      <div class="takeaway-item">
        <span class="takeaway-bullet">&bull;</span>
        <span class="takeaway-text briefing-takeaway">${escapeHtml(kt.text)}${linkSuffix}</span>
      </div>
    `;
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

// Render a single article card
export function renderArticleCard(article) {
  const timeDisplay = article.publishedAt ? formatTimeAgo(article.publishedAt) : '';
  const groupBadge = article.sourceGroup
    ? `<span class="source-group-badge badge-${article.sourceGroup}">${article.sourceGroup}</span>`
    : '';

  // Tag chips
  const tags = [];
  if (article.subCategory) {
    const subLabel = article.subLabel || article.subCategory;
    tags.push(`<span class="tag-chip">${escapeHtml(subLabel)}</span>`);
  }
  if (article.competitors && article.competitors.length > 0) {
    for (const comp of article.competitors) {
      tags.push(`<span class="tag-chip competitor">${escapeHtml(comp)}</span>`);
    }
  }

  const tagsHtml = tags.length > 0
    ? `<div class="tag-row">${tags.join('')}</div>`
    : '';

  return `
    <article class="article-card" data-id="${escapeHtml(article.id || '')}">
      <div class="article-meta">
        <span class="article-source">${escapeHtml(article.source || '')}</span>
        ${groupBadge}
        <span class="article-dot"></span>
        <span class="article-time meta-text">${timeDisplay}</span>
      </div>
      <a href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener" class="article-headline-link">
        <h3 class="article-headline">${escapeHtml(article.title || '')}</h3>
      </a>
      ${article.summary ? `<p class="article-summary">${escapeHtml(article.summary)}</p>` : ''}
      ${tagsHtml}
      <a href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener" class="read-original">Read on ${escapeHtml(article.source || 'original')}</a>
    </article>
  `;
}

// Render article list
export function renderArticleList(articles) {
  if (!articles || articles.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📰</div>
        <div class="empty-state-title">No articles matching your filters</div>
        <div class="empty-state-desc">Try adjusting your filter criteria or check back tomorrow at 07:00 CST for updated coverage.</div>
      </div>
    `;
  }
  return articles.map(renderArticleCard).join('');
}

// Render the full section page (briefing + articles)
export function renderSectionPage(data) {
  const articleMap = {};
  for (const a of (data.articles || [])) {
    articleMap[a.id] = a;
  }

  const briefingHtml = renderBriefing(data.briefing, null, articleMap);
  const articlesHtml = renderArticleList(data.articles || []);

  return { briefingHtml, articlesHtml };
}

// Render dashboard cards on index page
export function renderDashboard(latest) {
  if (!latest || !latest.sections) return '';

  return Object.entries(latest.sections).map(([id, info]) => {
    const topHeadline = info.topHeadline || 'No articles today';
    const count = info.articleCount || 0;
    const date = latest.date || '';

    return `
      <a href="#/${id}" class="dashboard-card">
        <h3 class="dashboard-card-title">${escapeHtml(info.title || id)}</h3>
        <div class="dashboard-card-count">${count} article${count !== 1 ? 's' : ''}</div>
        <p class="dashboard-card-headline">${escapeHtml(topHeadline)}</p>
        <span class="dashboard-card-link">View section →</span>
      </a>
    `;
  }).join('');
}

// Build source filter options (grouped)
export async function buildSourceOptions() {
  const sources = await loadSources();
  const groups = {};

  for (const s of sources) {
    const group = s.groupLabel || s.group;
    if (!groups[group]) groups[group] = [];
    groups[group].push(s);
  }

  let html = '<option value="">All Sources</option>';
  for (const [group, srcs] of Object.entries(groups)) {
    html += `<optgroup label="${escapeHtml(group)}">`;
    for (const s of srcs) {
      html += `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`;
    }
    html += '</optgroup>';
  }
  return html;
}

// Update masthead with date and update time
export function updateMasthead(data) {
  const dateEl = document.getElementById('masthead-date');
  const updatedEl = document.getElementById('masthead-updated');

  if (dateEl && data) {
    const dateStr = data.date || '';
    dateEl.textContent = dateStr ? formatShortDate(data.date) : '';
  }
  if (updatedEl) {
    updatedEl.textContent = 'Updated daily at 07:00 CST (UTC+8)';
  }
}
