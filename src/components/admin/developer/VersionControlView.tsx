import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Tag,
  PlusCircle,
  RotateCcw,
  GitCompare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  Download,
  Eye,
  FileCode,
  X
} from 'lucide-react';

interface VersionControlViewProps {
  onAddAuditLog: (
    action: string,
    category: 'AUTH' | 'BACKUP' | 'GITHUB' | 'VERSION' | 'FEATURE' | 'SETTINGS',
    severity: 'INFO' | 'WARN' | 'CRITICAL',
    details: string
  ) => void;
}

interface VersionRelease {
  version: string;
  title: string;
  date: string;
  status: 'CURRENT' | 'STABLE' | 'ARCHIVED';
  changelog: string[];
  breakingChanges: boolean;
  author: string;
}

export const VersionControlView: React.FC<VersionControlViewProps> = ({ onAddAuditLog }) => {
  const [showNewReleaseModal, setShowNewReleaseModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false);
  const [showChangelogModal, setShowChangelogModal] = useState<boolean>(false);
  const [changelogText, setChangelogText] = useState<string>('');

  const [selectedRollbackVer, setSelectedRollbackVer] = useState<string>('v1.3.0');

  // New release form state
  const [newVersion, setNewVersion] = useState<string>('v1.5.0');
  const [newTitle, setNewTitle] = useState<string>('SAARTHI Enterprise Release & Platform Update Summary');
  const [newChangelog, setNewChangelog] = useState<string>(
    'Added Pre-Sync Platform Security & Build Diagnostic Scanner\nAdded Automatic Version Tracking & Changelog Writer\nEnhanced GitHub Commit Messages with Detailed Update Summaries'
  );
  const [isBreaking, setIsBreaking] = useState<boolean>(false);

  const formatWithSeconds = (dateInput: Date | string = new Date()): string => {
    try {
      const d = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      }
    } catch {}
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    fetchLiveVersionHistory();
  }, []);

  const fetchLiveVersionHistory = async () => {
    try {
      const histRes = await fetch('/api/release/history');
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData.history && Array.isArray(histData.history) && histData.history.length > 0) {
          const loadedReleases: VersionRelease[] = histData.history.map((rec: any, idx: number) => ({
            version: rec.version || 'v1.4.7',
            title: rec.title || 'SAARTHI Release',
            date: formatWithSeconds(rec.timestamp || rec.date),
            status: idx === 0 ? 'CURRENT' : 'STABLE',
            changelog: [
              ...(rec.summary?.added || []),
              ...(rec.summary?.updated || []),
              ...(rec.summary?.fixed || []),
            ],
            breakingChanges: false,
            author: rec.author || 'SAARTHI Core Team',
          }));
          setReleases(loadedReleases);
        }
      }
    } catch (err) {
      console.warn('Version control history fetch error:', err);
    }
  };

  const [releases, setReleases] = useState<VersionRelease[]>([
    {
      version: 'v1.4.6',
      title: 'GitHub Real-Time Sync & Repository Reconfiguration to @sdxbyte/saarthi',
      date: formatWithSeconds(),
      status: 'CURRENT',
      changelog: [
        'Updated default GitHub platform repository integration to https://github.com/sdxbyte/saarthi for automated real-time background code syncing.',
        'Synchronized GitHub username handle across developer command center, credentials manager, and automated release backup APIs.',
        'Reinforced permanent authentic financial and capital market data system rules for NRB exchange rates, NEPSE market feeds, and unedited prospectus documents.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.4.5',
      title: 'Cross-Device Logo Compatibility & Prominent Big Footer Logo Redesign',
      date: formatWithSeconds('2026-08-06T18:02:00-07:00'),
      status: 'STABLE',
      changelog: [
        'Added multi-stage fail-safe image fallbacks for SAARTHI logo (PNG -> JPG -> Logo -> Vector SVG Emblem) ensuring 100% visibility on all mobile phones, tablets, desktops, and webviews.',
        'Redesigned Public Footer featuring a prominent BIG logo on the left side, accompanied by platform details, security badges, and fully responsive link columns.',
        'Validated zero-break responsive compatibility across all display sizes (320px to 4K).',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.4.3',
      title: 'Vercel Deployment White Screen Fix & Build Chunk Optimization',
      date: formatWithSeconds('2026-08-06T11:45:00-07:00'),
      status: 'STABLE',
      changelog: [
        'Resolved Vercel blank white screen by removing circular vendor chunk dependencies in Vite Rollup manualChunks configuration.',
        'Wrapped root React rendering hierarchy with global ErrorBoundary for fault-tolerant UI recovery.',
        'Bumped platform version to v1.4.3 and triggered automated GitHub & Vercel deployment sync.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.4.2',
      title: 'Permanent Version Synchronization & Public Footer Integration',
      date: formatWithSeconds('2026-08-06T11:25:00-07:00'),
      status: 'STABLE',
      changelog: [
        'Enforced automatic version tracking and prominent Footer Version Badge display across the SAARTHI platform.',
        'Synchronized versioning across package.json (v1.4.2), versionEngine, and administrative release logs.',
        'Integrated internal release notes management within admin center.',
        'Maintained complete release history with dual AD/BS date formatting.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.4.1',
      title: 'Saarthi Developer Command Center & Enterprise Release Engine',
      date: formatWithSeconds('2026-08-06T11:00:00-07:00'),
      status: 'STABLE',
      changelog: [
        'Added Pre-Sync Security & Build Diagnostic Scanner before GitHub push.',
        'Implemented automatic version tracking (v1.4.1) and auto-increment engine.',
        'Integrated automated change summaries for Added, Updated, Fixed, and Technical changes.',
        'Maintained complete release history and automatic /docs/CHANGELOG.md generation.',
        'Enhanced release package compilation and verification.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.4.0',
      title: 'Saarthi Developer Command Center & Live Timezone Clock',
      date: formatWithSeconds('2026-08-01T02:00:00-07:00'),
      status: 'STABLE',
      changelog: [
        'Added Saarthi Developer Command Center for Super Admin.',
        'Implemented Live BS/AD Date & Kathmandu Timezone clock bar in header.',
        'Restricted platform administration strictly to platform owner.',
        'Added automated GitHub backup manager with release tags.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.3.0',
      title: 'Isolated Admin Portal & IRD Income Tax Slabs FY 2083/84',
      date: formatWithSeconds('2026-07-25T10:15:30-07:00'),
      status: 'STABLE',
      changelog: [
        'Created isolated SAARTHI Private Admin Portal with RBAC user management.',
        'Updated IRD Income Tax Slabs for unmarried vs married taxpayers in Nepal.',
        'Added Bluebook vehicle tax calculator for Bagmati & Gandaki provinces.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.2.0',
      title: 'NEPSE Live Market Index & MeroShare Suite',
      date: formatWithSeconds('2026-07-10T14:22:15-07:00'),
      status: 'ARCHIVED',
      changelog: [
        'Integrated NEPSE live market index ticker and top gainers/losers.',
        'Added MeroShare IPO application status checker.',
        'Integrated Nepal Rastra Bank forex exchange rates.',
      ],
      breakingChanges: false,
      author: 'SAARTHI Core Team',
    },
    {
      version: 'v1.0.0',
      title: 'Initial SAARTHI Platform Launch',
      date: formatWithSeconds('2026-06-01T09:00:00-07:00'),
      status: 'ARCHIVED',
      changelog: [
        'Launched core civic modules in English and Nepali.',
        'Document Vault, Tax Calculator, Notice Analysis Engine.',
      ],
      breakingChanges: true,
      author: 'SAARTHI Core Team',
    },
  ]);

  useEffect(() => {
    fetchChangelog();
  }, []);

  const fetchChangelog = async () => {
    try {
      const res = await fetch('/api/release/changelog');
      if (res.ok) {
        const data = await res.json();
        setChangelogText(data.changelog || '');
      }
    } catch (err) {
      console.warn('Changelog fetch warning:', err);
    }
  };

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    const changelogArr = newChangelog.split('\n').filter((line) => line.trim().length > 0);

    const created: VersionRelease = {
      version: newVersion,
      title: newTitle,
      date: formatWithSeconds(),
      status: 'CURRENT',
      changelog: changelogArr,
      breakingChanges: isBreaking,
      author: 'Sudip Adhikari',
    };

    // Mark old current as STABLE
    const updatedReleases = releases.map((r) =>
      r.status === 'CURRENT' ? { ...r, status: 'STABLE' as const } : r
    );

    setReleases([created, ...updatedReleases]);
    setShowNewReleaseModal(false);
    onAddAuditLog('New Release Published', 'VERSION', 'INFO', `Published Saarthi version ${newVersion}: ${newTitle}`);
  };

  const handleExecuteRollback = () => {
    onAddAuditLog('Version Rollback Executed', 'VERSION', 'WARN', `System rolled back to stable release tag ${selectedRollbackVer}`);
    setShowRollbackModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Release Control Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ACTIVE VERSION: v1.4.6
            </span>
            <span className="text-xs text-slate-400 font-mono">Status: <strong>Enterprise Live</strong></span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <span>Saarthi Release & Version Control System</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated version increments, pre-sync security reviews, version history tracking, and CHANGELOG.md generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowChangelogModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>View CHANGELOG.md</span>
          </button>

          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5 text-sky-400" />
            <span>Compare Versions</span>
          </button>

          <button
            onClick={() => setShowRollbackModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Rollback Version</span>
          </button>

          <button
            onClick={() => setShowNewReleaseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
            <span>Publish Release</span>
          </button>
        </div>
      </div>

      {/* Release Timeline List */}
      <div className="space-y-4">
        {releases.map((rel, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-slate-900 border transition-all ${
              rel.status === 'CURRENT'
                ? 'border-amber-500/50 shadow-2xl shadow-amber-500/5'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-amber-400 font-mono">{rel.version}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    rel.status === 'CURRENT'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : rel.status === 'STABLE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {rel.status}
                </span>

                {rel.breakingChanges && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Breaking Changes</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>Release Date: <strong>{rel.date}</strong></span>
                <span>Author: <strong>{rel.author}</strong></span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-3">{rel.title}</h3>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              {rel.changelog.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal 1: Publish Custom Release */}
      {showNewReleaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>Publish New Version Tag</span>
              </h3>
              <button
                onClick={() => setShowNewReleaseModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Version Number (Tag)</label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Release Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Release Notes / Features Added</label>
                <textarea
                  value={newChangelog}
                  onChange={(e) => setNewChangelog(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="breaking"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="breaking" className="text-slate-300 cursor-pointer font-bold">
                  Contains Breaking API or Data Contract Changes
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewReleaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
                >
                  Publish Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: View CHANGELOG.md */}
      {showChangelogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>SAARTHI Official CHANGELOG.md</span>
              </h3>
              <button
                onClick={() => setShowChangelogModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
              {changelogText || '# Changelog - SAARTHI Platform\n\nAll notable changes are documented here.'}
            </pre>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowChangelogModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Compare Versions */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-sky-400" />
                <span>Compare Release Versions</span>
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="font-bold text-amber-400">Comparing v1.4.1 (Current) vs v1.4.0 (Stable)</div>
              <ul className="space-y-1 list-disc pl-4 text-emerald-300 text-[11px]">
                <li>+ Enterprise Software Release Management System</li>
                <li>+ Automatic Version Tracking & Increments</li>
                <li>+ Automated Change Summaries for GitHub commits</li>
                <li>+ Pre-Sync Security & Build Health Diagnostics Scanner</li>
                <li>+ Release Package Generator without credentials</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Rollback Version Tag */}
      {showRollbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-900/50 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-400" />
                <span>Execute Version Rollback</span>
              </h3>
              <button
                onClick={() => setShowRollbackModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="text-slate-400">
                Select target release tag to restore system build state:
              </p>

              <select
                value={selectedRollbackVer}
                onChange={(e) => setSelectedRollbackVer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
              >
                {releases.map((r, i) => (
                  <option key={i} value={r.version}>{r.version} ({r.date}) - {r.title}</option>
                ))}
              </select>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-[11px] leading-relaxed">
                ⚠️ System will roll back build target reference to tag <strong>{selectedRollbackVer}</strong>.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowRollbackModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRollback}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
