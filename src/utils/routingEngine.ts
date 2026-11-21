// SAARTHI Master Routing Engine (Rule 8: Proper Application Routing & Unified Service Grouping)
export type AppTabRoute =
  | 'home'
  | 'dashboard'
  | 'explore'
  | 'modules'
  | 'services'
  | 'finance'
  | 'documents'
  | 'civic'
  | 'news'
  | 'tools'
  | 'account'
  | 'nepse'
  | 'forex'
  | 'gold'
  | 'fuel'
  | 'vault'
  | 'bluebook'
  | 'tax'
  | 'ird'
  | 'emi'
  | 'receipt'
  | 'loksewa'
  | 'calendar'
  | 'donate'
  | 'support'
  | 'about'
  | 'vision'
  | 'roadmap'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'emergency'
  | 'rashifal'
  | 'devtrack'
  | 'public-apis'
  | 'account-deletion'
  | 'sajilo'
  | 'links'
  | 'sitehub'
  | 'osint4all';

export const ROUTE_PATH_MAP: Record<string, AppTabRoute> = {
  '/': 'home',
  '/home': 'home',
  '/dashboard': 'home',
  '/explore': 'explore',
  '/projects': 'explore',
  '/index': 'explore',
  '/services': 'services',
  '/directory': 'services',
  '/modules': 'explore',
  '/sajilo': 'sajilo',
  '/links': 'links',
  '/resources': 'links',
  '/fmhy': 'links',
  '/sitehub': 'sitehub',
  '/allsitehub': 'sitehub',
  '/osint4all': 'osint4all',
  '/osint': 'osint4all',
  '/media': 'sitehub',
  '/streaming': 'sitehub',
  '/daily': 'sajilo',
  '/bazar': 'sajilo',
  '/kalimati': 'sajilo',
  '/keeper': 'sajilo',
  '/radio': 'sajilo',

  // Finance Group
  '/finance': 'finance',
  '/ipo': 'nepse',
  '/share': 'nepse',
  '/nepse': 'nepse',
  '/market': 'nepse',
  '/banking': 'forex',
  '/forex': 'forex',
  '/gold': 'gold',
  '/silver': 'gold',
  '/fuel': 'fuel',
  '/tax': 'tax',
  '/ird': 'ird',
  '/emi': 'emi',
  '/receipt': 'receipt',

  // Documents & Transport Group
  '/documents': 'vault',
  '/vault': 'vault',
  '/bluebook': 'bluebook',
  '/dotm': 'bluebook',
  '/license': 'bluebook',
  '/driving-license': 'bluebook',
  '/yatayat': 'bluebook',

  // Civic Group
  '/civic': 'services',
  '/government': 'services',
  '/loksewa': 'loksewa',
  '/jobs': 'loksewa',
  '/devtrack': 'devtrack',
  '/laws': 'services',

  // News Group
  '/news': 'services',

  // Tools Group
  '/tools': 'tools',
  '/utilities': 'tools',
  '/calendar': 'calendar',
  '/patro': 'calendar',
  '/converter': 'calendar',
  '/rashifal': 'rashifal',
  '/horoscope': 'rashifal',
  '/panchanga': 'rashifal',
  '/emergency': 'services',
  '/apis': 'public-apis',
  '/public-apis': 'public-apis',
  '/api-explorer': 'public-apis',

  // Account & Support Group
  '/account': 'account',
  '/support': 'support',
  '/help': 'support',
  '/donation': 'donate',
  '/donate': 'donate',
  '/about': 'about',
  '/vision': 'vision',
  '/roadmap': 'roadmap',
  '/contact': 'contact',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/account-deletion': 'account-deletion',
  '/delete-account': 'account-deletion',
};

export const TAB_PATH_MAP: Record<AppTabRoute, string> = {
  home: '/',
  dashboard: '/',
  explore: '/explore',
  modules: '/explore',
  services: '/services',
  finance: '/finance',
  documents: '/vault',
  civic: '/services',
  news: '/services',
  tools: '/tools',
  account: '/account',
  nepse: '/nepse',
  forex: '/forex',
  gold: '/gold',
  fuel: '/fuel',
  vault: '/vault',
  bluebook: '/bluebook',
  tax: '/tax',
  ird: '/ird',
  emi: '/emi',
  receipt: '/receipt',
  loksewa: '/loksewa',
  calendar: '/calendar',
  donate: '/donation',
  support: '/support',
  about: '/about',
  vision: '/vision',
  roadmap: '/roadmap',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  emergency: '/services',
  rashifal: '/rashifal',
  devtrack: '/devtrack',
  'public-apis': '/public-apis',
  'account-deletion': '/account-deletion',
  sajilo: '/sajilo',
  links: '/links',
  sitehub: '/sitehub',
  osint4all: '/osint4all',
};

const QUERY_TAB_ALIASES: Record<string, AppTabRoute> = {
  'calendar-bs-ad': 'calendar',
  stocks: 'nepse',
  'cdsc-ipo-result': 'nepse',
  dashboard: 'home',
};

export function getTabFromPath(pathname: string, search: string = ''): AppTabRoute {
  if (search) {
    const params = new URLSearchParams(search);
    const tabParam = (params.get('tab') || '').trim().toLowerCase();
    if (tabParam) {
      if (QUERY_TAB_ALIASES[tabParam]) {
        return QUERY_TAB_ALIASES[tabParam];
      }
      if (TAB_PATH_MAP[tabParam as AppTabRoute]) {
        return tabParam as AppTabRoute;
      }
      if (ROUTE_PATH_MAP[`/${tabParam}`]) {
        return ROUTE_PATH_MAP[`/${tabParam}`];
      }
    }
  }
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (ROUTE_PATH_MAP[cleanPath]) {
    return ROUTE_PATH_MAP[cleanPath];
  }
  if (cleanPath.startsWith('/admin')) {
    return 'home';
  }
  return 'home';
}

export function syncUrlWithTab(tab: AppTabRoute) {
  if (typeof window === 'undefined') return;
  const targetPath = TAB_PATH_MAP[tab] || '/';
  if (window.location.pathname !== targetPath) {
    window.history.pushState({ tab }, '', targetPath);
  }
}
