// render.js — Render briefing, article cards, dashboard

import { formatTimeAgo, formatShortDate, escapeHtml, $, $$ } from './utils.js';
import { loadSection, loadLatest, loadSources } from './data-loader.js';

// Render the daily briefing block
// Now dynamically generates summary from today's articles only
export function renderBriefing(briefing, sourceMap, articleMap, articles) {
  if (!briefing) return '';

  // Determine today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Filter to today's articles only for the summary
  const todayArticles = articles
    ? articles.filter(a => (a.publishedAt || '').split('T')[0] === today)
    : [];

  // If we have today's articles, build a dynamic summary
  let summaryHtml = '';
  if (todayArticles.length > 0) {
    const sourceNames = [...new Set(todayArticles.map(a => a.source))];
    const dateDisplay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    summaryHtml = `<p class="briefing-summary briefing-body">${dateDisplay} &mdash; ${todayArticles.length} article${todayArticles.length > 1 ? 's' : ''} from ${sourceNames.join(', ')} covering this section.</p>`;
  } else {
    // Fallback: show the pre-generated summary if no today articles
    summaryHtml = briefing.summary
      ? `<div class="briefing-summary briefing-body">${escapeHtml(briefing.summary)}</div>`
      : '';
  }

  // Build takeaways from today's articles
  const keyTakeawaysHtml = todayArticles.map(a => {
    const desc = (a.description || '').length > 200
      ? a.description.substring(0, 197) + '...'
      : (a.description || a.title);
    return `
      <div class="takeaway-item">
        <span class="takeaway-bullet">&bull;</span>
        <span class="takeaway-text briefing-takeaway">
          ${escapeHtml(desc)}
          <a href="${escapeHtml(a.url)}" target="_blank" rel="noopener" class="takeaway-source-link">${escapeHtml(a.source)}</a>
        </span>
      </div>
    `;
  }).join('');

  const hasContent = summaryHtml || keyTakeawaysHtml;
  if (!hasContent) return '';

  const todayCount = todayArticles.length;
  const scopeLabel = todayCount > 0
    ? `Today's Briefing <span class="briefing-date-badge">${todayCount} article${todayCount > 1 ? 's' : ''} today</span>`
    : 'Daily Briefing';

  return `
    <div class="briefing-block">
      <div class="briefing-label">${scopeLabel}</div>
      ${summaryHtml}
      ${keyTakeawaysHtml ? `<div class="takeaways-list">${keyTakeawaysHtml}</div>` : ''}
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
  const articles = data.articles || [];
  const articleMap = {};
  for (const a of articles) {
    articleMap[a.id] = a;
  }

  // Dynamic: pass articles so briefing only covers today
  const briefingHtml = renderBriefing(data.briefing, null, articleMap, articles);

  // Split articles: today vs older
  const today = new Date().toISOString().split('T')[0];
  const todayArticles = articles.filter(a => (a.publishedAt || '').split('T')[0] === today);
  const olderArticles = articles.filter(a => (a.publishedAt || '').split('T')[0] !== today);

  // Build the date-filtered view
  let articlesHtml = '';

  if (todayArticles.length > 0) {
    articlesHtml += '<div class="date-section"><h3 class="date-section-heading">Today</h3>';
    articlesHtml += renderArticleList(todayArticles);
    articlesHtml += '</div>';
  }

  if (olderArticles.length > 0) {
    articlesHtml += '<div class="date-section">';
    articlesHtml += `<h3 class="date-section-heading">Earlier This Year <span class="date-section-count">${olderArticles.length} article${olderArticles.length > 1 ? 's' : ''}</span></h3>`;
    articlesHtml += renderArticleList(olderArticles);
    articlesHtml += '</div>';
  }

  if (articles.length === 0) {
    articlesHtml = renderArticleList([]);
  }

  return { briefingHtml, articlesHtml };
}

// Render dashboard cards on index page
export function renderDashboard(latest) {
  if (!latest || !latest.sections) return '';

  return Object.entries(latest.sections).map(([id, info]) => {
    const topHeadline = info.topHeadline || 'No articles today';
    const count = info.articleCount || 0;
    const todayCount = info.todayCount || 0;
    const date = latest.date || '';

    return `
      <a href="#/${id}" class="dashboard-card">
        <h3 class="dashboard-card-title">${escapeHtml(info.title || id)}</h3>
        <div class="dashboard-card-count">
          ${todayCount} today <span class="dashboard-card-total">/ ${count} total</span>
        </div>
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
