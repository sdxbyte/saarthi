import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  Plus,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import {
  CURRENT_VERSION_INFO,
  RELEASE_HISTORY_CATALOG,
  ReleaseNoteItem,
} from '../../utils/versionEngine';
import { useTimeCalendar } from '../../utils/timeCalendarEngine';

export const AdminReleaseCenterView: React.FC = () => {
  const [history, setHistory] = useState<ReleaseNoteItem[]>(RELEASE_HISTORY_CATALOG);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<ReleaseNoteItem>(RELEASE_HISTORY_CATALOG[0]);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // Form State for Manual Release Note
  const [newVersion, setNewVersion] = useState<string>('v1.4.2');
  const [newBuild, setNewBuild] = useState<number>(242);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newWhatsNew, setNewWhatsNew] = useState<string>('');
  const [newImprovements, setNewImprovements] = useState<string>('');
  const [newBugFixes, setNewBugFixes] = useState<string>('');

  const liveTime = useTimeCalendar('Asia/Kathmandu');

  const filteredHistory = history.filter(
    (r) =>
      r.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddReleaseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a release title');
      return;
    }

    const newNote: ReleaseNoteItem = {
      id: `rel-${Date.now()}`,
      version: newVersion.trim(),
      buildNumber: Number(newBuild),
      releaseDateAd: liveTime.adDateIso,
      releaseDateBs: liveTime.bsDateIso,
      title: newTitle.trim(),
      whatsNew: newWhatsNew.split('\n').filter((s) => s.trim().length > 0),
      improvements: newImprovements.split('\n').filter((s) => s.trim().length > 0),
      bugFixes: newBugFixes.split('\n').filter((s) => s.trim().length > 0),
      knownIssues: [],
      author: 'SAARTHI System',
      isImportant: true,
    };

    const updated = [newNote, ...history];
    setHistory(updated);
    setSelectedVersion(newNote);
    setIsAddingNote(false);
    setNewTitle('');
    setNewWhatsNew('');
    setNewImprovements('');
    setNewBugFixes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Release & Version Management</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {CURRENT_VERSION_INFO.version}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Build #{CURRENT_VERSION_INFO.buildNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Permanent release history, version increment policy, changelog synchronization, and user release notes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Manual Release</span>
          </button>
        </div>
      </div>

      {/* Live System Time Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Current Server Time:</span>
          <span className="font-mono text-cyan-300 font-bold">{liveTime.time12h} ({liveTime.timeZoneIana})</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span>A.D. Date: <strong className="text-white">{liveTime.adDateFormatted}</strong></span>
          <span>•</span>
          <span>B.S. Date: <strong className="text-amber-300">{liveTime.bsFormattedNp}</strong></span>
        </div>
      </div>

      {/* Manual Release Form Modal */}
      {isAddingNote && (
        <form onSubmit={handleAddReleaseNote} className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Add Manual Version Release Note</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Version (SemVer)</label>
              <input
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Build Number</label>
              <input
                type="number"
                value={newBuild}
                onChange={(e) => setNewBuild(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Release Title</label>
              <input
                type="text"
                placeholder="e.g. Security Hardening & Payment Gateways"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">New Features (1 per line)</label>
              <textarea
                rows={3}
                value={newWhatsNew}
                onChange={(e) => setNewWhatsNew(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Improvements (1 per line)</label>
              <textarea
                rows={3}
                value={newImprovements}
                onChange={(e) => setNewImprovements(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Bug Fixes (1 per line)</label>
              <textarea
                rows={3}
                value={newBugFixes}
                onChange={(e) => setNewBugFixes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Save Release Note
            </button>
          </div>
        </form>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Release Catalog */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Release Catalog</h3>
              <span className="text-[11px] font-mono text-slate-400">{filteredHistory.length} Releases</span>
            </div>

            <input
              type="text"
              placeholder="Filter releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
            />

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredHistory.map((rel) => {
                const isSelected = selectedVersion.id === rel.id;
                return (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedVersion(rel)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400 text-xs">{rel.version}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Build #{rel.buildNumber}</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-200 mt-1 line-clamp-1">{rel.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {rel.releaseDateAd} (BS {rel.releaseDateBs})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Release Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-extrabold text-sm border border-amber-500/30">
                    {selectedVersion.version}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Build #{selectedVersion.buildNumber}</span>
                </div>
                <h2 className="text-lg font-extrabold text-white mt-2">{selectedVersion.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Released on {selectedVersion.releaseDateAd} A.D. ({selectedVersion.releaseDateBs} B.S.) • Source: SAARTHI Core System
                </p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                  Active in Production
                </span>
              </div>
            </div>

            {/* Whats New */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>New Features Introduced ({selectedVersion.whatsNew.length})</span>
              </h4>
              <div className="space-y-2">
                {selectedVersion.whatsNew.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Improvements & Optimizations ({selectedVersion.improvements.length})</span>
              </h4>
              <div className="space-y-2">
                {selectedVersion.improvements.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bug Fixes */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Bug Fixes & Corrections ({selectedVersion.bugFixes.length})</span>
              </h4>
              <div className="space-y-2">
                {selectedVersion.bugFixes.map((bf, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                    <span>{bf}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
