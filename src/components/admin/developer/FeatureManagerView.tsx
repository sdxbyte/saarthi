import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  Code2,
  TestTube,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertOctagon,
  Key,
  Users,
  Bot,
  Megaphone,
  PhoneCall,
  Mail,
  Wrench,
} from 'lucide-react';
import {
  getFeatureFlags,
  saveFeatureFlags,
  FeatureFlag,
} from '../../../utils/featureFlags';

interface FeatureManagerViewProps {
  onAddAuditLog: (
    action: string,
    category: 'AUTH' | 'BACKUP' | 'GITHUB' | 'VERSION' | 'FEATURE' | 'SETTINGS',
    severity: 'INFO' | 'WARN' | 'CRITICAL',
    details: string
  ) => void;
}

export type FeatureTarget = 'Public User' | 'Admin Only' | 'Both';
export type FeatureStatus = 'Requested' | 'Approved' | 'Development' | 'Testing' | 'Completed';
export type FeaturePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  priority: FeaturePriority;
  target: FeatureTarget;
  status: FeatureStatus;
  requestedBy: string;
  createdAt: string;
}

export const FeatureManagerView: React.FC<FeatureManagerViewProps> = ({ onAddAuditLog }) => {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>(() => getFeatureFlags());
  const [targetFilter, setTargetFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Toggle Modal reason input
  const [activeToggleId, setActiveToggleId] = useState<string | null>(null);
  const [toggleReason, setToggleReason] = useState<string>('');

  // New feature form state
  const [nameInput, setNameInput] = useState<string>('');
  const [descInput, setDescInput] = useState<string>('');
  const [priorityInput, setPriorityInput] = useState<FeaturePriority>('High');
  const [targetInput, setTargetInput] = useState<FeatureTarget>('Both');
  const [statusInput, setStatusInput] = useState<FeatureStatus>('Requested');

  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      id: 'FEAT-101',
      name: 'Saarthi Operations Center & Self-Diagnostics',
      description: 'Super Admin Operations Center with live health score, automated broken link detection, and alert management.',
      priority: 'Critical',
      target: 'Admin Only',
      status: 'Completed',
      requestedBy: 'Super Admin',
      createdAt: '2026-08-01',
    },
    {
      id: 'FEAT-102',
      name: 'Official Notice Analysis Engine',
      description: 'Rule-based official notice breakdown engine that formats gazette bulletins and public circulars.',
      priority: 'High',
      target: 'Public User',
      status: 'Completed',
      requestedBy: 'Ministry of Communication',
      createdAt: '2026-08-01',
    },
  ]);

  const handleToggleClick = (flagId: string) => {
    setActiveToggleId(flagId);
    setToggleReason('');
  };

  const handleConfirmToggle = () => {
    if (!activeToggleId) return;

    const current = flags[activeToggleId];
    if (!current) return;

    const updatedFlag: FeatureFlag = {
      ...current,
      enabled: !current.enabled,
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19),
      modifiedBy: 'Super Admin',
      reason: toggleReason.trim() || 'Admin runtime toggle adjustment',
    };

    const nextFlags = { ...flags, [activeToggleId]: updatedFlag };
    setFlags(nextFlags);
    saveFeatureFlags(nextFlags);

    onAddAuditLog(
      'Feature Toggle Changed',
      'FEATURE',
      updatedFlag.enabled ? 'INFO' : 'WARN',
      `Toggled "${updatedFlag.name}" to ${updatedFlag.enabled ? 'ENABLED' : 'DISABLED'}. Reason: ${updatedFlag.reason}`
    );

    setActiveToggleId(null);
    setToggleReason('');
  };

  const handleCreateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newFeat: FeatureItem = {
      id: `FEAT-${Math.floor(100 + Math.random() * 900)}`,
      name: nameInput,
      description: descInput,
      priority: priorityInput,
      target: targetInput,
      status: statusInput,
      requestedBy: 'Super Admin',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setFeatures([newFeat, ...features]);
    setNameInput('');
    setDescInput('');
    setShowAddModal(false);
    onAddAuditLog('Feature Request Created', 'FEATURE', 'INFO', `Created feature "${newFeat.name}" for target ${newFeat.target}`);
  };

  const handleUpdateStatus = (id: string, newStatus: FeatureStatus) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)));
    onAddAuditLog('Feature Status Updated', 'FEATURE', 'INFO', `Feature #${id} status changed to ${newStatus}`);
  };

  const filteredFeatures = features.filter((f) => {
    if (targetFilter !== 'ALL' && f.target !== targetFilter) return false;
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    return true;
  });

  const priorityColors: Record<FeaturePriority, string> = {
    Low: 'bg-slate-800 text-slate-300 border-slate-700',
    Medium: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold',
  };

  const statusIcons: Record<FeatureStatus, any> = {
    Requested: Clock,
    Approved: Sparkles,
    Development: Code2,
    Testing: TestTube,
    Completed: CheckCircle2,
  };

  return (
    <div className="space-y-8 text-slate-100 font-sans">
      {/* SECTION 1: LIVE FEATURE TOGGLES MANAGEMENT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Runtime Feature Management</span>
          </div>
          <h2 className="text-2xl font-black text-white">Platform Feature Enable/Disable Toggles</h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantly control public feature availability across the platform without requiring code deployment or server restarts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(flags).map((flag) => (
            <div
              key={flag.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                flag.enabled
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-rose-950/10 border-rose-900/40 opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {flag.category}
                  </span>
                  <button
                    onClick={() => handleToggleClick(flag.id)}
                    className="flex items-center gap-1 font-bold text-xs transition-all"
                  >
                    {flag.enabled ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                        <span>Enabled</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400">
                        <ToggleLeft className="w-6 h-6 text-rose-400" />
                        <span>Disabled</span>
                      </span>
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-white text-sm">{flag.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{flag.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-0.5 font-mono">
                <div>Last Modified: {flag.lastModified}</div>
                <div>By: {flag.modifiedBy}</div>
                {flag.reason && <div className="text-amber-300/80 font-sans italic">"{flag.reason}"</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Modal: Capture Reason for Audit Log */}
      {activeToggleId && flags[activeToggleId] && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-white">
              Confirm Feature Toggle: {flags[activeToggleId].name}
            </h3>
            <p className="text-xs text-slate-400">
              You are changing the status to{' '}
              <strong className={flags[activeToggleId].enabled ? 'text-rose-400' : 'text-emerald-400'}>
                {flags[activeToggleId].enabled ? 'DISABLED' : 'ENABLED'}
              </strong>
              . This change will take effect immediately.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Reason for change (Required for Audit Log)</label>
              <input
                type="text"
                value={toggleReason}
                onChange={(e) => setToggleReason(e.target.value)}
                placeholder="e.g. Scheduled maintenance window or security policy update..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setActiveToggleId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg"
              >
                Apply Toggle Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FEATURE ROADMAP & REQUEST MANAGEMENT */}
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Feature Planning & Request Roadmap</span>
            </h2>
            <p className="text-xs text-slate-400">
              Categorized roadmap planner with target audience assignment (Public User, Admin Only, Both).
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Feature Request</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter Target:</span>
            {['ALL', 'Public User', 'Admin Only', 'Both'].map((t) => (
              <button
                key={t}
                onClick={() => setTargetFilter(t)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  targetFilter === t
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Status:</span>
            {['ALL', 'Requested', 'Approved', 'Development', 'Testing', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map((feat) => {
            const StatusIcon = statusIcons[feat.status];
            return (
              <div
                key={feat.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-500 font-bold">{feat.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${priorityColors[feat.priority]}`}>
                        {feat.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                        {feat.target}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">{feat.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feat.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold">
                    <StatusIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{feat.status}</span>
                  </div>

                  <select
                    value={feat.status}
                    onChange={(e) => handleUpdateStatus(feat.id, e.target.value as FeatureStatus)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Requested">Requested</option>
                    <option value="Approved">Approved</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Feature Request */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <span>Add Feature Request</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFeature} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Feature Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="E.g., Automated Municipal Waste Schedule Alerts"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description & Purpose</label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Describe functional scope and value to citizens..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value as FeaturePriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target</label>
                  <select
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value as FeatureTarget)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Public User">Public User</option>
                    <option value="Admin Only">Admin Only</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as FeatureStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Requested">Requested</option>
                    <option value="Approved">Approved</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg"
                >
                  Save Feature Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
