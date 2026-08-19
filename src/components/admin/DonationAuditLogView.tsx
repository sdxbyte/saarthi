import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  History,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Building,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { DonationAuditEntry, getDonationAuditLogs } from '../../utils/donationAuditStore';
import { formatDualDate } from '../../utils/bsAdConverter';

export const DonationAuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<DonationAuditEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('ALL');
  const [selectedLogModal, setSelectedLogModal] = useState<DonationAuditEntry | null>(null);

  useEffect(() => {
    setLogs(getDonationAuditLogs());
  }, []);

  const handleRefresh = () => {
    setLogs(getDonationAuditLogs());
  };

  const filteredLogs = logs.filter((log) => {
    // Action type filter
    if (selectedActionType !== 'ALL' && log.actionType !== selectedActionType) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText =
        log.title.toLowerCase().includes(q) ||
        log.adminName.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q) ||
        (log.notes && log.notes.toLowerCase().includes(q)) ||
        (log.previousValue && log.previousValue.toLowerCase().includes(q)) ||
        (log.updatedValue && log.updatedValue.toLowerCase().includes(q));
      if (!matchesText) return false;
    }

    // Date range filter
    if (selectedDateFilter !== 'ALL') {
      const logDate = new Date(log.timestampIso).getTime();
      const now = Date.now();
      if (selectedDateFilter === '7_DAYS' && now - logDate > 7 * 86400000) return false;
      if (selectedDateFilter === '30_DAYS' && now - logDate > 30 * 86400000) return false;
    }

    return true;
  });

  const getActionTypeBadge = (actionType: DonationAuditEntry['actionType']) => {
    switch (actionType) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase">PUBLISHED</span>;
      case 'ACTIVATED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold uppercase">ACTIVATED</span>;
      case 'DEACTIVATED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold uppercase">DEACTIVATED</span>;
      case 'QR_UPDATED':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold uppercase">QR UPDATED</span>;
      case 'BANK_INFO_UPDATED':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold uppercase">BANK UPDATED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px] font-bold uppercase">DETAILS MODIFIED</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Admin Audit Log — Donation Section</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Immutable tracking record of all publication dates, QR updates, bank modifications, and configuration changes for the Donation portal.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2 transition-all shrink-0 self-start md:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit entries, admin name, values..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-medium"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400 shrink-0" />
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
          >
            <option value="ALL">All Action Types</option>
            <option value="PUBLISHED">Published</option>
            <option value="ACTIVATED">Activated</option>
            <option value="DEACTIVATED">Deactivated</option>
            <option value="QR_UPDATED">QR Code Updates</option>
            <option value="BANK_INFO_UPDATED">Bank Info Updates</option>
            <option value="DETAILS_MODIFIED">Details Modified</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60"
          >
            <option value="ALL">All Time</option>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <History className="w-4 h-4 text-amber-400" />
            <span>Audit Event Log Stream ({filteredLogs.length} Entries)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">B.S. & A.D. Standardized Timestamps</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => {
            const dualDate = formatDualDate(log.timestampIso);
            return (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getActionTypeBadge(log.actionType)}
                    <span className="font-bold text-white text-sm">{log.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{log.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px] pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Admin Identity: <strong className="text-slate-200">{log.adminName}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-mono text-emerald-300 font-semibold">{dualDate.combined} ({dualDate.timeStr})</span>
                    </div>
                  </div>

                  {(log.previousValue || log.updatedValue) && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {log.previousValue && (
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase font-bold">Previous Value:</span>
                          <span className="text-rose-300/90 truncate block">{log.previousValue}</span>
                        </div>
                      )}
                      {log.updatedValue && (
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase font-bold">Updated Value:</span>
                          <span className="text-emerald-300 font-bold truncate block">{log.updatedValue}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedLogModal(log)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shrink-0 self-start md:self-center transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Entry</span>
                </button>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Info className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">No audit log entries match the selected search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inspect Detail Modal */}
      {selectedLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Audit Log Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedLogModal(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Event Title & Action</span>
                <div className="text-sm font-bold text-amber-300">{selectedLogModal.title}</div>
                <div className="pt-1">{getActionTypeBadge(selectedLogModal.actionType)}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Admin Identity</span>
                  <div className="text-slate-200 font-bold">{selectedLogModal.adminName}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Exact Timestamp (B.S. & A.D.)</span>
                  <div className="text-emerald-400 font-bold">
                    {formatDualDate(selectedLogModal.timestampIso).combined} ({formatDualDate(selectedLogModal.timestampIso).timeStr})
                  </div>
                </div>
              </div>

              {selectedLogModal.previousValue && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1">
                  <span className="text-[10px] text-rose-400 block uppercase font-bold">Previous Recorded State</span>
                  <div className="text-rose-200">{selectedLogModal.previousValue}</div>
                </div>
              )}

              {selectedLogModal.updatedValue && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">Updated Recorded State</span>
                  <div className="text-emerald-200 font-bold">{selectedLogModal.updatedValue}</div>
                </div>
              )}

              {selectedLogModal.notes && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Administrative Context & Notes</span>
                  <div className="text-slate-300 text-xs leading-relaxed font-sans">{selectedLogModal.notes}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLogModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
            >
              Close Detail Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
