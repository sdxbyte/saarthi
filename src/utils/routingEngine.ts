// SAARTHI Master Routing Engine (Rule 8: Proper Application Routing & Unified Service Grouping)
export type AppTabRoute =
  | 'dashboard'
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
  | 'account-deletion';

export const ROUTE_PATH_MAP: Record<string, AppTabRoute> = {
  '/': 'dashboard',
  '/home': 'dashboard',
  '/services': 'services',
  '/directory': 'services',
  '/modules': 'modules',

  // Finance Group
  '/finance': 'finance',
  '/ipo': 'nepse',
  '/share': 'nepse',
  '/nepse': 'nepse',
  '/market': 'nepse',
  '/banking': 'forex',
  '/forex': 'forex',
  '/gold': 'forex',
  '/fuel': 'forex',
  '/tax': 'tax',
  '/ird': 'ird',
  '/emi': 'emi',
  '/receipt': 'receipt',

  // Documents Group
  '/documents': 'documents',
  '/vault': 'vault',
  '/bluebook': 'bluebook',
  '/dotm': 'bluebook',
  '/license': 'bluebook',
  '/driving-license': 'bluebook',
  '/yatayat': 'bluebook',

  // Civic Group
  '/civic': 'civic',
  '/government': 'civic',
  '/loksewa': 'loksewa',
  '/jobs': 'loksewa',
  '/devtrack': 'devtrack',

  // News Group
  '/news': 'news',

  // Tools Group
  '/tools': 'tools',
  '/calendar': 'calendar',
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
  dashboard: '/',
  modules: '/services',
  services: '/services',
  finance: '/finance',
  documents: '/documents',
  civic: '/civic',
  news: '/news',
  tools: '/tools',
  account: '/account',
  nepse: '/nepse',
  forex: '/forex',
  vault: '/documents',
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
  emergency: '/emergency',
  rashifal: '/rashifal',
  devtrack: '/devtrack',
  'public-apis': '/public-apis',
  'account-deletion': '/account-deletion',
};

export function getTabFromPath(pathname: string): AppTabRoute {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (ROUTE_PATH_MAP[cleanPath]) {
    return ROUTE_PATH_MAP[cleanPath];
  }
  if (cleanPath.startsWith('/admin')) {
    return 'dashboard';
  }
  return 'dashboard';
}

export function syncUrlWithTab(tab: AppTabRoute) {
  if (typeof window === 'undefined') return;
  const targetPath = TAB_PATH_MAP[tab] || '/';
  if (window.location.pathname !== targetPath) {
    window.history.pushState({ tab }, '', targetPath);
  }
}
