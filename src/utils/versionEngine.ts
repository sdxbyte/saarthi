import { formatCentralDualDate } from './timeCalendarEngine';

export interface PlatformVersionInfo {
  version: string;             // e.g. "v1.4.1"
  buildNumber: number;         // e.g. 241
  releaseId: string;           // e.g. "REL-20260806-241"
  releaseDateAd: string;       // "2026-08-06"
  releaseDateBs: string;       // "2083-04-22"
  releaseTime: string;         // "14:35 NPT"
  timezone: string;            // "Asia/Kathmandu (GMT+5:45)"
  environment: 'Development' | 'Staging' | 'Production';
  commitHash: string;
  footerText: string;          // "SAARTHI v1.4.1 • Build #241 • Released 2026-08-06 • BS 2083-04-22"
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

export const CURRENT_VERSION_INFO: PlatformVersionInfo = {
  version: 'v1.5.0',
  buildNumber: 250,
  releaseId: 'REL-20260812-250',
  releaseDateAd: '2026-08-12',
  releaseDateBs: '2083-04-27',
  releaseTime: '19:15 NPT',
  timezone: 'Asia/Kathmandu (GMT+5:45)',
  environment: 'Production',
  commitHash: 'e9f5a2b',
  footerText: 'SAARTHI v1.5.0 • Build #250 • Released 2026-08-12 • BS 2083-04-27',
};

export const RELEASE_HISTORY_CATALOG: ReleaseNoteItem[] = [
  {
    id: 'rel-150',
    version: 'v1.5.0',
    buildNumber: 250,
    releaseDateAd: '2026-08-12',
    releaseDateBs: '2083-04-27',
    title: 'DevTrack Municipal Government Project Tracking Service',
    whatsNew: [
      'Integrated the DevTrack Municipal & Government Project Tracker Service for public information and citizen oversight',
      'Added tracking for Kathmandu Metropolitan City (KMC) and municipal infrastructure projects with budget allocations, contractor details, and physical vs. financial progress metrics',
      'Implemented dual AD & BS date scheduling on all project milestones (start dates, target close dates, and audit timestamps)',
      'Created citizen quality audit and grievance reporting system allowing citizens to log observations into project logs'
    ],
    improvements: [
      'Added dedicated "Project Tracker (DevTrack)" item to Sidebar navigation under Government & Civic',
      'Featured DevTrack transparency highlight cards across Government Services and Civic Portal'
    ],
    bugFixes: [
      'Resolved navigation tab routing for DevTrack municipal project views'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-148',
    version: 'v1.4.8',
    buildNumber: 248,
    releaseDateAd: '2026-08-12',
    releaseDateBs: '2083-04-27',
    title: 'Incubate Nepal DevTrack Integration & Full Dual Date System Alignment',
    whatsNew: [
      'Added DevTrack municipal project tracking information and telemetry service',
      'Unified dual AD & BS date display across Upcoming IPOs, NEPSE Market Feed, MeroShare Auto-Apply, and IRD Verified Tax Certificates',
      'Configured automated GitHub release backup and email notification engine for platform codebases'
    ],
    improvements: [
      'Added DevTrack connected partner repository manager in Developer Settings and Backup Command Center',
      'Enhanced date conversion accuracy and dual AD/BS formatting across public and admin dashboards'
    ],
    bugFixes: [
      'Resolved missing AD date translation on IPO issue closing widgets and IRD registration lookup results'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-146',
    version: 'v1.4.6',
    buildNumber: 246,
    releaseDateAd: '2026-08-07',
    releaseDateBs: '2083-04-22',
    title: 'GitHub Real-time Sync & Repository Reconfiguration to @sdxbyte/saarthi',
    whatsNew: [
      'Updated default GitHub platform repository integration to https://github.com/sdxbyte/saarthi for automated real-time background code syncing',
      'Synchronized GitHub username handle across developer command center, credentials manager, and automated release backup APIs',
      'Reinforced permanent authentic financial and capital market data system rules for NRB exchange rates, NEPSE market feeds, and unedited prospectus documents'
    ],
    improvements: [
      'Seamless real-time code backup and automated release sync directly to github.com/sdxbyte/saarthi',
      'Enhanced credential verification with automatic user handle resolution and 1-click token setup'
    ],
    bugFixes: [
      'Fixed repository path mismatch on automatic GitHub push API triggers'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-145',
    version: 'v1.4.5',
    buildNumber: 245,
    releaseDateAd: '2026-08-06',
    releaseDateBs: '2083-04-21',
    title: 'Cross-Device Logo Compatibility & Prominent Footer Brand Redesign',
    whatsNew: [
      'Engineered multi-stage fail-safe image fallbacks for SAARTHI logo (PNG -> JPG -> Logo -> Crisp Vector SVG) ensuring 100% visibility on all mobile, desktop, TV, and webview screens',
      'Redesigned Public Footer featuring a prominent BIG logo on the left side, accompanied by platform details, security badges, and fully responsive link columns',
      'Enforced zero-break responsive layout across mobile phones (320px+), tablets, laptops, and ultra-wide desktop monitors'
    ],
    improvements: [
      'Eliminated image clipping and aspect ratio distortion across all screen resolutions',
      'Upgraded footer layout with a glass-morphism brand showcase header and structured navigation grid'
    ],
    bugFixes: [
      'Fixed potential logo loading failures on restricted mobile networks and webviews',
      'Resolved Vercel production deployment blank white screen caused by Rollup circular chunks'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-143',
    version: 'v1.4.3',
    buildNumber: 243,
    releaseDateAd: '2026-08-06',
    releaseDateBs: '2083-04-21',
    title: 'Vercel Deployment White Screen Resolution & Build Optimization',
    whatsNew: [
      'Resolved production Vercel white screen issue caused by Rollup circular chunk dependencies in manualChunks configuration',
      'Wrapped root React application mount point with an ErrorBoundary to prevent silent blank screens on client rendering exceptions',
      'Optimized Vite build pipeline for zero-warning deployment bundling'
    ],
    improvements: [
      'Eliminated circular vendor chunk dependencies between React, Framer Motion, and Lucide React',
      'Enhanced Vercel serverless SPA rewrites for seamless frontend route handling'
    ],
    bugFixes: [
      'Fixed blank white screen on Vercel production deployment URLs'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-142',
    version: 'v1.4.2',
    buildNumber: 242,
    releaseDateAd: '2026-08-06',
    releaseDateBs: '2083-04-21',
    title: 'Permanent Version Synchronization & Prominent Footer Version Display',
    whatsNew: [
      'Enforced version bump to v1.4.2 across all system configuration files, release history catalogs, and package manifests',
      'Integrated an interactive Version Badge directly into the main Public Footer with instant Release Notes modal launcher',
      'Synchronized versioning across Admin Portal, Developer Command Center, and Public UI components'
    ],
    improvements: [
      'Enhanced footer layout with clear, high-visibility version tags displaying current build number and dual AD/BS dates',
      'Integrated automated release notes notification on initial platform load after every version update'
    ],
    bugFixes: [
      'Fixed version string inconsistency across package.json, versionEngine, and administrative release logs'
    ],
    knownIssues: [],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-141',
    version: 'v1.4.1',
    buildNumber: 241,
    releaseDateAd: '2026-08-06',
    releaseDateBs: '2083-04-21',
    title: 'Live Real-Time Data Engine & Centralized Time-Calendar Synchronization',
    whatsNew: [
      'Connected 12 official live data streams (Nepal Rastra Bank Forex, CoinGecko Crypto, NEGOSIDA Gold/Silver, NEPSE Index, Open-Meteo Weather, USGS Earthquake, Kalimati Veg Rates, NOC Fuel, Nager Holidays, Emergency Directories, Government Notices, Civic News)',
      'Integrated centralized Time & Calendar Engine across every module, audit log, scheduler, and live card with dual AD/BS formatting',
      'Implemented Permanent Version Management, Footer Version Display, and What\'s New release notification engine'
    ],
    improvements: [
      'Automatic retry, failure detection, and admin email notification dispatch upon 3 consecutive live feed connection failures',
      'Local caching layer preserves last valid snapshot if external feeds experience temporary network downtime',
      'Full-stack Express/Node ESM CommonJS bundle compilation via esbuild for Cloud Run deployment'
    ],
    bugFixes: [
      'Resolved time offset calculations for Bikram Sambat (BS) leap day transitions',
      'Fixed timezone offset drift when formatting audit timestamps across regional clients',
      'Removed all static mock arrays in favor of live endpoint streams with automatic cache fallback'
    ],
    knownIssues: [
      'NRB Forex feed updates once daily at 10:00 AM NPT; off-peak queries return previous business day rates as expected',
      'USGS seismic events filtered to magnitude 2.5+ within 1,000km radius of Kathmandu'
    ],
    isImportant: true,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-140',
    version: 'v1.4.0',
    buildNumber: 240,
    releaseDateAd: '2026-08-01',
    releaseDateBs: '2083-04-17',
    title: 'Super Admin Customer Support & Complete Audit Logging System',
    whatsNew: [
      'Super Admin Customer Support control suite with full user profile edit, verification, suspension, and password reset',
      'Immutable Audit & Activity Log tracking all admin actions, logins, and settings modifications',
      'Official Donation QR Payment details section with strict QR protection policies'
    ],
    improvements: [
      'Automated release note generation and email notification dispatches',
      'Enhanced theme color presets (Crimson, Emerald, Sapphire, Pearl, Obsidian)'
    ],
    bugFixes: [
      'Corrected navigation tab switching in mobile responsive drawer',
      'Fixed CSV/JSON export formatting for administrative audit records'
    ],
    knownIssues: [],
    isImportant: false,
    author: 'SAARTHI Core Team',
  },
  {
    id: 'rel-130',
    version: 'v1.3.0',
    buildNumber: 230,
    releaseDateAd: '2026-07-15',
    releaseDateBs: '2083-03-31',
    title: 'Citizen Document Vault, IRD Tax Suite & Emergency Hotline Modules',
    whatsNew: [
      'Citizen Encrypted Document Vault for Citizenship, License, Bluebook, and PAN cards',
      'IRD Income Tax Calculator and Bluebook Vehicle Renewal Tax Estimator',
      'Integrated Emergency SOS Hotline modal with 100/101/102 direct dispatch'
    ],
    improvements: [
      'Added dark/light contrast mode with high accessibility compliance',
      'Optimized Vite bundle chunking for faster mobile page load'
    ],
    bugFixes: [
      'Fixed calculation logic for single vs married IRD tax exemption slabs'
    ],
    knownIssues: [],
    isImportant: false,
    author: 'SAARTHI Core Team',
  }
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
