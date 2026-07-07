// router.js — Hash-based SPA routing
// Format: #/section-id?key=val&key2=val2
// #/ or empty → dashboard

const ROUTES = {
  '/':                { type: 'dashboard', title: 'Today\'s Briefing' },
  '/core-businesses': { type: 'section',   id: 'core-businesses',   title: 'Core Businesses' },
  '/ip-legal':        { type: 'section',   id: 'ip-legal',          title: 'IP & Legal' },
  '/growth-areas':    { type: 'section',   id: 'growth-areas',      title: 'Growth Areas' },
  '/macro-environment':{ type: 'section',  id: 'macro-environment', title: 'Macro Environment' },
  '/competitors':     { type: 'section',   id: 'competitors',       title: 'Competitors' },
  '/stakeholders':    { type: 'section',   id: 'stakeholders',      title: 'Key Stakeholders' },
  '/about':           { type: 'about',     title: 'About & Methodology' }
};

let currentRoute = null;
let routeChangeHandler = null;

export function initRouter(onRouteChange) {
  routeChangeHandler = onRouteChange;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const route = parseHash();
  if (!route) return;

  // Same path + same params → nothing to do
  if (currentRoute && currentRoute.path === route.path &&
      JSON.stringify(currentRoute.params) === JSON.stringify(route.params)) {
    return;
  }

  // Same path but different params → only re-apply filters, don't re-render view
  const paramsOnly = currentRoute && currentRoute.path === route.path;

  currentRoute = route;
  updateActiveNav(route.path);
  updatePageTitle(route.path);

  if (routeChangeHandler) {
    routeChangeHandler(route, { paramsOnly });
  }
}

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const path = '/' + (pathPart || '');

  // Find matching route
  let routeDef = ROUTES[path];
  if (!routeDef) {
    // Try fuzzy match: strip trailing slash
    const cleanPath = path.replace(/\/$/, '');
    routeDef = ROUTES[cleanPath];
  }
  if (!routeDef) {
    // Default to dashboard
    routeDef = ROUTES['/'];
  }

  // Parse query params
  const params = {};
  if (queryPart) {
    for (const pair of queryPart.split('&')) {
      const [k, v] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }
  }

  return { ...routeDef, path, params };
}

function updateActiveNav(activePath) {
  document.querySelectorAll('.primary-nav .nav-link, [data-route]').forEach(link => {
    const route = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', route === activePath || (activePath === '/' && route === '/'));
  });
}

function updatePageTitle(path) {
  const route = ROUTES[path] || ROUTES['/'];
  document.title = route.type === 'dashboard'
    ? 'Qualcomm News Monitor — Today\'s Briefing'
    : `${route.title} — Qualcomm News Monitor`;
}

// Navigate programmatically
export function navigate(path, params = {}) {
  const queryStr = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.location.hash = queryStr ? `#${path}?${queryStr}` : `#${path}`;
}

// Update only the query params (keep same route)
export function updateParams(params) {
  if (!currentRoute) return;
  navigate(currentRoute.path, params);
}

// Get current route info
export function getCurrentRoute() {
  return currentRoute || { type: 'dashboard', path: '/', params: {} };
}

export { ROUTES };
