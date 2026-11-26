import { formatCentralDualDate } from './timeCalendarEngine';
import { convertAdToBs } from './bsAdConverter';

export interface PlatformVersionInfo {
  version: string;             // e.g. "v1.0.0"
  buildNumber: number;         // e.g. 100
  releaseId: string;           // e.g. "REL-20261126-100"
  releaseDateAd: string;       // "2026-11-26"
  releaseDateBs: string;       // Computed from convertAdToBs
  releaseTime: string;         // "14:30 NPT"
  timezone: string;            // "Asia/Kathmandu (GMT+5:45)"
  environment: 'Development' | 'Staging' | 'Production';
  commitHash: string;
  footerText: string;          // "SAARTHI v1.0.0 • Build #100 • Released 2026-11-26 • ..."
}

export interface ReleaseNoteItem {
  id: string;
  version: string;
  buildNumber: number;
  releaseDateAd: string;
  releaseDateBs: string;
  title: string;
  whatsNew: string[];
  improvements: string[];
  bugFixes: string[];
  knownIssues: string[];
  isImportant?: boolean;
  author: string;
}

const V1_RELEASE_DATE_AD = '2026-11-26';
const V1_RELEASE_DATE_BS = convertAdToBs(V1_RELEASE_DATE_AD);

export const CURRENT_VERSION_INFO: PlatformVersionInfo = {
  version: 'v1.0.0',
  buildNumber: 100,
  releaseId: 'REL-20261126-100',
  releaseDateAd: V1_RELEASE_DATE_AD,
  releaseDateBs: V1_RELEASE_DATE_BS,
  releaseTime: '14:30 NPT',
  timezone: 'Asia/Kathmandu (GMT+5:45)',
  environment: 'Production',
  commitHash: 'v1.0.0',
  footerText: `SAARTHI v1.0.0 • Build #100 • Released ${V1_RELEASE_DATE_AD} • BS ${V1_RELEASE_DATE_BS}`,
};

export const RELEASE_HISTORY_CATALOG: ReleaseNoteItem[] = [
  {
    id: 'rel-100',
    version: 'v1.0.0',
    buildNumber: 100,
    releaseDateAd: V1_RELEASE_DATE_AD,
    releaseDateBs: V1_RELEASE_DATE_BS,
    title: 'SAARTHI v1.0.0 — Unified Web, PWA & Native Android App Release',
    whatsNew: [
      'App-First Native Android APK Experience: Material 3 TopAppBar with sub-screen Back navigation, Android hardware back-stack support, status/navigation bar theme sync, tactile haptics, and distraction-free native shell layout',
      'APK Mobile Home Launcher: Kathmandu greeting & live dual-date clock, thumb-first search bar, swipeable NRB/Gold/NEPSE/Fuel market strip, 12-tile quick services grid, 1-tap Live Nepali FM Radio player, and Offline Vault card',
      'Background Pre-Downloaded APK Updater: Automatically downloads releases in the background, validates package ID and signing key parity, prompts 1-tap Install Downloaded Update, and resumes installer after Android permission grant',
      'Unified Account & Cross-Device Sync: Firebase Auth + Cloud Firestore backed by resilient offline-first IndexedDB outbox with 3-way conflict resolution and remote device session management',
      'Authentic Nepal Live Data Suites: Verified NRB Forex (160+ world currencies), NEPSE & CDSC IPO tools, Kalimati wholesale rates, FENEGOSIDA Gold/Silver, NOC fuel tariffs, IRD tax & Bluebook calculators, and DoTM services',
    ],
    improvements: [
      'Unified platform versioning cleanly at v1.0.0 across Web, PWA, API endpoints, documentation, and Android APK CI/CD release workflows',
      'Lowered /api/app/sync-info release cache TTL to 20s with ?force=1 bypass for faster GitHub release discovery',
      'Enforced strict Rule 16 zero-fabrication fallbacks when external official feeds are temporarily unreachable',
    ],
    bugFixes: [
      'Resolved native IndexedDB transaction edge cases with automatic store repair and resilient fallback storage',
      'Eliminated redundant APK re-downloads when a verified cached update is already stored on disk',
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Engineering',
  },
];

const LAST_SEEN_VERSION_KEY = 'saarthi_last_seen_version_v1';

export function hasUserSeenCurrentVersion(): boolean {
  try {
    const saved = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    return saved === CURRENT_VERSION_INFO.version;
  } catch (e) {
    return false;
  }
}

export function markCurrentVersionAsSeen(): void {
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION_INFO.version);
  } catch (e) {
    console.error('Failed to mark version as seen:', e);
  }
}

// Download Version & Release Report as CSV / JSON
export function exportReleaseHistory(format: 'json' | 'csv'): void {
  if (format === 'json') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(RELEASE_HISTORY_CATALOG, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `saarthi_release_history_${CURRENT_VERSION_INFO.version}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } else {
    const headers = ['Version', 'Build', 'AD Date', 'BS Date', 'Title', 'Author', 'What\'s New Count', 'Improvements Count', 'Bug Fixes Count'];
    const rows = RELEASE_HISTORY_CATALOG.map((r) => [
      r.version,
      r.buildNumber,
      r.releaseDateAd,
      r.releaseDateBs,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      r.whatsNew.length,
      r.improvements.length,
      r.bugFixes.length,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saarthi_release_history_${CURRENT_VERSION_INFO.version}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
