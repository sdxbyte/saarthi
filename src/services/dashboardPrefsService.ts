export type DashboardWidgetId =
  | 'live_snapshot'
  | 'personal_shortcuts'
  | 'recent_services'
  | 'frequent_services'
  | 'civic_tax'
  | 'important_notices';

export interface WidgetMeta {
  id: DashboardWidgetId;
  titleEn: string;
  titleNe: string;
  descriptionEn: string;
  descriptionNe: string;
}

export const DASHBOARD_WIDGET_CATALOG: WidgetMeta[] = [
  {
    id: 'live_snapshot',
    titleEn: 'Official Financial Snapshot',
    titleNe: 'आधिकारिक वित्तीय झलक',
    descriptionEn: 'NRB forex, gold bullion, NEPSE index, and IPO status.',
    descriptionNe: 'राष्ट्र बैंक विनिमय दर, सुनचाँदी, नेप्से र आइपिओ स्थिति।',
  },
  {
    id: 'personal_shortcuts',
    titleEn: 'Saved Shortcuts & Watchlist',
    titleNe: 'सुरक्षित सर्टकटहरू',
    descriptionEn: 'Pinned services and saved bookmarks synced across devices.',
    descriptionNe: 'पिन गरिएका सेवा र सर्टकटहरू (सबै उपकरणमा सिङ्क)।',
  },
  {
    id: 'recent_services',
    titleEn: 'Recently Used',
    titleNe: 'भर्खरै प्रयोग गरिएका',
    descriptionEn: 'Quick resume for modules you opened most recently.',
    descriptionNe: 'भर्खरै खोलिएका सेवा र औजारहरू।',
  },
  {
    id: 'frequent_services',
    titleEn: 'Frequently Used Services',
    titleNe: 'धेरै प्रयोग हुने सेवाहरू',
    descriptionEn: 'Core SAARTHI capital market, transport, calendar & vault modules.',
    descriptionNe: 'मुख्य वित्तीय, यातायात, पात्रो र डिजिटल भल्ट सेवाहरू।',
  },
  {
    id: 'civic_tax',
    titleEn: 'Civic & Tax Services',
    titleNe: 'नागरिक तथा कर सेवाहरू',
    descriptionEn: 'IRD income tax, Loan EMI, Lok Sewa & DevTrack infrastructure.',
    descriptionNe: 'आयकर, ऋण ई.एम.आई., लोक सेवा र विकास परियोजना।',
  },
  {
    id: 'important_notices',
    titleEn: 'Important Public Notices',
    titleNe: 'महत्त्वपूर्ण सार्वजनिक सूचनाहरू',
    descriptionEn: 'Verified notices and headlines from Nepal public feeds.',
    descriptionNe: 'प्रमाणित सार्वजनिक र बजार सूचनाहरू।',
  },
];

export const DEFAULT_WIDGET_ORDER: DashboardWidgetId[] = [
  'live_snapshot',
  'personal_shortcuts',
  'recent_services',
  'frequent_services',
  'civic_tax',
  'important_notices',
];

export interface DashboardPreferences {
  widgetOrder: DashboardWidgetId[];
  hiddenWidgets: DashboardWidgetId[];
  updatedAtIso: string;
}

export interface RecentModuleEntry {
  tab: string;
  titleEn: string;
  titleNe: string;
  category: string;
  visitedAtIso: string;
}

const PREFS_STORAGE_KEY = 'saarthi_dashboard_prefs_v2';
const RECENT_STORAGE_KEY = 'saarthi_recent_modules_v2';
export const DASHBOARD_LAYOUT_SYNC_ID = 'saarthi-dashboard-layout-v2';

const MODULE_LABELS: Record<string, { titleEn: string; titleNe: string; category: string }> = {
  services: { titleEn: 'Services Directory', titleNe: 'सेवा निर्देशिका', category: 'Civic' },
  finance: { titleEn: 'Finance Hub', titleNe: 'वित्त केन्द्र', category: 'Finance' },
  nepse: { titleEn: 'NEPSE & IPO Suite', titleNe: 'नेप्से र आइपिओ', category: 'Capital' },
  forex: { titleEn: 'NRB Forex Rates', titleNe: 'विदेशी मुद्रा दर', category: 'Currency' },
  gold: { titleEn: 'Gold & Silver Rates', titleNe: 'सुनचाँदी दर', category: 'Bullion' },
  fuel: { titleEn: 'NOC Fuel Prices', titleNe: 'इन्धन मूल्य', category: 'Energy' },
  tax: { titleEn: 'Income Tax Calculator', titleNe: 'आयकर हिसाब', category: 'Tax' },
  emi: { titleEn: 'Loan EMI Calculator', titleNe: 'ई.एम.आई. हिसाब', category: 'Banking' },
  receipt: { titleEn: 'Receipt Ledger', titleNe: 'खर्च रसिद', category: 'Finance' },
  calendar: { titleEn: 'BS / AD Calendar', titleNe: 'नेपाली पात्रो', category: 'Calendar' },
  bluebook: { titleEn: 'Bluebook & Vehicle Tax', titleNe: 'ब्लुबुक र सवारी कर', category: 'Transport' },
  vault: { titleEn: 'Citizen Document Vault', titleNe: 'डिजिटल भल्ट', category: 'Vault' },
  sajilo: { titleEn: 'Sajilo Essentials', titleNe: 'सजिलो दैनिक', category: 'Utilities' },
  loksewa: { titleEn: 'Lok Sewa & Careers', titleNe: 'लोक सेवा सूचना', category: 'Careers' },
  devtrack: { titleEn: 'DevTrack Projects', titleNe: 'विकास परियोजना', category: 'Civic' },
  rashifal: { titleEn: 'Daily Rashifal', titleNe: 'दैनिक राशिफल', category: 'Panchanga' },
  tools: { titleEn: 'Utilities & Tools', titleNe: 'दैनिक औजार', category: 'Tools' },
  explore: { titleEn: 'Full Directory', titleNe: 'सम्पूर्ण सूची', category: 'Directory' },
  account: { titleEn: 'Account & Sync', titleNe: 'खाता र सिङ्क', category: 'Account' },
  'public-apis': { titleEn: 'Public APIs Hub', titleNe: 'पब्लिक ए.पी.आई.', category: 'Developer' },
  sitehub: { titleEn: 'AllSite Hub', titleNe: 'वेब निर्देशिका', category: 'Directory' },
  osint4all: { titleEn: 'OSINT4ALL Directory', titleNe: 'OSINT निर्देशिका', category: 'Research' },
};

const SHORT_WIDGET_CODES: Record<DashboardWidgetId, string> = {
  live_snapshot: 'ls',
  personal_shortcuts: 'ps',
  recent_services: 'rs',
  frequent_services: 'fs',
  civic_tax: 'ct',
  important_notices: 'in',
};

const CODE_TO_WIDGET: Record<string, DashboardWidgetId> = {
  ls: 'live_snapshot',
  ps: 'personal_shortcuts',
  rs: 'recent_services',
  fs: 'frequent_services',
  ct: 'civic_tax',
  in: 'important_notices',
};

export function normalizeDashboardPreferences(
  raw?: Partial<DashboardPreferences> | null
): DashboardPreferences {
  const validSet = new Set<DashboardWidgetId>(DEFAULT_WIDGET_ORDER);
  const incomingOrder = Array.isArray(raw?.widgetOrder)
    ? raw!.widgetOrder.filter((id): id is DashboardWidgetId => validSet.has(id as DashboardWidgetId))
    : [];

  const seen = new Set<DashboardWidgetId>();
  const widgetOrder: DashboardWidgetId[] = [];
  for (const id of [...incomingOrder, ...DEFAULT_WIDGET_ORDER]) {
    if (!seen.has(id)) {
      seen.add(id);
      widgetOrder.push(id);
    }
  }

  const hiddenWidgets = Array.isArray(raw?.hiddenWidgets)
    ? Array.from(
        new Set(raw!.hiddenWidgets.filter((id): id is DashboardWidgetId => validSet.has(id as DashboardWidgetId)))
      )
    : [];

  return {
    widgetOrder,
    hiddenWidgets,
    updatedAtIso: raw?.updatedAtIso || new Date().toISOString(),
  };
}

export function loadLocalDashboardPreferences(): DashboardPreferences {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) {
        return normalizeDashboardPreferences(JSON.parse(raw));
      }
    }
  } catch {
    // ignore storage errors
  }
  return normalizeDashboardPreferences(null);
}

export function saveLocalDashboardPreferences(prefs: DashboardPreferences): DashboardPreferences {
  const normalized = normalizeDashboardPreferences({
    ...prefs,
    updatedAtIso: new Date().toISOString(),
  });
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(normalized));
    }
  } catch {
    // ignore storage errors
  }
  return normalized;
}

export function encodeDashboardPrefsForSync(prefs: DashboardPreferences): {
  tags: string[];
  subtitle: string;
} {
  const normalized = normalizeDashboardPreferences(prefs);
  const tags = normalized.widgetOrder.map((id) => SHORT_WIDGET_CODES[id]).slice(0, 10);
  const hiddenCodes = normalized.hiddenWidgets.map((id) => SHORT_WIDGET_CODES[id]).join(',');
  return {
    tags,
    subtitle: `h=${hiddenCodes}|t=${normalized.updatedAtIso}`,
  };
}

export function decodeDashboardPrefsFromSync(
  tags?: string[],
  subtitle?: string
): DashboardPreferences | null {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  const widgetOrder = tags
    .map((code) => CODE_TO_WIDGET[code])
    .filter((id): id is DashboardWidgetId => Boolean(id));
  if (widgetOrder.length === 0) return null;

  let hiddenWidgets: DashboardWidgetId[] = [];
  let updatedAtIso = new Date().toISOString();
  if (typeof subtitle === 'string') {
    for (const part of subtitle.split('|')) {
      if (part.startsWith('h=')) {
        hiddenWidgets = part
          .slice(2)
          .split(',')
          .map((c) => CODE_TO_WIDGET[c])
          .filter((id): id is DashboardWidgetId => Boolean(id));
      } else if (part.startsWith('t=')) {
        updatedAtIso = part.slice(2) || updatedAtIso;
      }
    }
  }
  return normalizeDashboardPreferences({ widgetOrder, hiddenWidgets, updatedAtIso });
}

export function loadRecentModules(): RecentModuleEntry[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.slice(0, 6);
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function recordRecentModule(tab: string): RecentModuleEntry[] {
  const normalized = (tab || '').trim().toLowerCase();
  if (!normalized || normalized === 'home' || normalized === 'dashboard') {
    return loadRecentModules();
  }
  const meta = MODULE_LABELS[normalized];
  if (!meta) return loadRecentModules();

  const existing = loadRecentModules().filter((item) => item.tab !== normalized);
  const next: RecentModuleEntry[] = [
    {
      tab: normalized,
      titleEn: meta.titleEn,
      titleNe: meta.titleNe,
      category: meta.category,
      visitedAtIso: new Date().toISOString(),
    },
    ...existing,
  ].slice(0, 6);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
  return next;
}
