import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  UserCheck
} from 'lucide-react';
import { AuditLogEntry } from './DeveloperCommandCenter';

interface SecurityAuditLogsViewProps {
  auditLogs: AuditLogEntry[];
}

export const SecurityAuditLogsView: React.FC<SecurityAuditLogsViewProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Admin Email', 'Action', 'Category', 'Severity', 'Details', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.adminEmail,
      `"${l.action}"`,
      l.category,
      l.severity,
      `"${l.details}"`,
      l.ipAddress,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-security-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const severityBadges: Record<AuditLogEntry['severity'], string> = {
    INFO: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    WARN: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold',
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Button */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Developer Security & Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of Super Admin logins, backup verification, GitHub code pushes, and version changes.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, email, or details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">AUTH (Logins & PINs)</option>
            <option value="BACKUP">BACKUP (System Snapshots)</option>
            <option value="GITHUB">GITHUB (Code Pushes)</option>
            <option value="VERSION">VERSION (Releases)</option>
            <option value="FEATURE">FEATURE (Roadmap)</option>
            <option value="SETTINGS">SETTINGS (System Config)</option>
          </select>
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="py-2.5 px-3">Log ID</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Admin Email</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-950/50 transition-colors">
                <td className="py-3 px-3 font-bold text-amber-400">{log.id}</td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-3 text-slate-200 font-bold truncate max-w-[160px]">{log.adminEmail}</td>
                <td className="py-3 px-3 font-bold text-white max-w-[220px]">
                  {log.action}
                  <span className="block text-[10px] text-slate-400 font-normal font-sans mt-0.5">{log.details}</span>
                </td>
                <td className="py-3 px-3 font-bold text-sky-400">{log.category}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityBadges[log.severity]}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
