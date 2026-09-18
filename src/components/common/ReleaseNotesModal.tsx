import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  Bug,
  AlertTriangle,
  History,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import {
  CURRENT_VERSION_INFO,
  RELEASE_HISTORY_CATALOG,
  ReleaseNoteItem,
} from '../../utils/versionEngine';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNoteItem>(RELEASE_HISTORY_CATALOG[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentNote = RELEASE_HISTORY_CATALOG[0];

  const filteredHistory = RELEASE_HISTORY_CATALOG.filter((r) =>
    r.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.whatsNew.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">What's New in SAARTHI</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {CURRENT_VERSION_INFO.version}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Build #{CURRENT_VERSION_INFO.buildNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>Released: {CURRENT_VERSION_INFO.releaseDateAd} A.D. ({CURRENT_VERSION_INFO.releaseDateBs} B.S.)</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">{CURRENT_VERSION_INFO.releaseTime}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'current'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Current Release Highlights</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Release History ({RELEASE_HISTORY_CATALOG.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* Title & Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-cyan-500/10 border border-amber-500/20">
                <h3 className="text-base font-extrabold text-amber-300">{currentNote.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered & Released by <strong className="text-slate-200">SAARTHI Core Team</strong> on {currentNote.releaseDateAd} (BS {currentNote.releaseDateBs})
                </p>
              </div>

              {/* What's New */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Key Features & Capabilities Introduced</span>
                </h4>
                <ul className="space-y-2">
                  {currentNote.whatsNew.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* System Improvements */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>System & Performance Enhancements</span>
                </h4>
                <ul className="space-y-2">
                  {currentNote.improvements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bug Fixes */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Bug className="w-4 h-4 text-rose-400" />
                  <span>Resolved Issues & Corrections</span>
                </h4>
                <ul className="space-y-2">
                  {currentNote.bugFixes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Known Issues / Maintenance Notes */}
              {currentNote.knownIssues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Known Operational Notes</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentNote.knownIssues.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search release history by version or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <div className="space-y-4">
                {filteredHistory.map((release) => (
                  <div key={release.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-xs border border-amber-500/30">
                          {release.version}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{release.title}</h4>
                          <span className="text-[11px] text-slate-400">
                            Build #{release.buildNumber} • {release.releaseDateAd} (BS {release.releaseDateBs})
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">SAARTHI Core Team</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-300">Highlights:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {release.whatsNew.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 font-mono text-[11px] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>SAARTHI Environment: {CURRENT_VERSION_INFO.environment}</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            Got it, Continue to SAARTHI
          </button>
        </div>
      </div>
    </div>
  );
};
