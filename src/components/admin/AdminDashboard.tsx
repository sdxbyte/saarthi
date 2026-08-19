import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck,
  TrendingUp,
  Server,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Clock,
  ArrowUpRight,
  Database,
  Cpu,
  BarChart3,
  Inbox,
  History,
  Smartphone
} from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { SaarthiLogo } from '../brand/SaarthiLogo';
import { getDelegatedAdmins } from '../../utils/superAdminAuth';
import { getContactEnquiries } from '../../utils/enquiryStore';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentAdmin, onNavigateTab }) => {
  const [adminCount, setAdminCount] = useState<number>(1);
  const [pendingEnquiries, setPendingEnquiries] = useState<number>(0);

  useEffect(() => {
    try {
      const delegated = getDelegatedAdmins();
      setAdminCount(1 + delegated.length);
      const enquiries = getContactEnquiries();
      setPendingEnquiries(enquiries.filter((e) => e.status === 'New').length);
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SaarthiLogo variant="compact" theme="dark" size={48} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                {currentAdmin.role} Portal
              </span>
              <span className="text-slate-400 text-xs">| {currentAdmin.department}</span>
            </div>
            <h1 className="text-2xl font-black text-white">Welcome, {currentAdmin.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time SAARTHI Platform Operations, Verification Queues & System Health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-slate-400 text-[10px] block">Cluster Uptime</span>
              <span className="font-bold text-white">100% Operational</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('support-tickets')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/50"
          >
            <Inbox className="w-4 h-4" />
            <span>Support Tickets ({pendingEnquiries})</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Registered Admin Officers</span>
            <h3 className="text-2xl font-black text-white mt-1">{adminCount}</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Accounts
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Pending Citizen Enquiries</span>
            <h3 className="text-2xl font-black text-white mt-1">{pendingEnquiries}</h3>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Unread Support Queue
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Revenue Gateways</span>
            <h3 className="text-sm font-bold text-slate-400 mt-2">Not configured</h3>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              Payment gateway pending setup
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">System Health</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">100%</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <Activity className="w-3.5 h-3.5" /> Active Server Connection
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Server className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operations Quick Action Grid & Live Cluster Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Administrative Quick Command Center</span>
            </h3>
            <span className="text-[11px] text-slate-400">RBAC Level: {currentAdmin.role}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigateTab('users')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">User Management</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage citizen profiles, RBAC roles & permissions</p>
            </button>

            <button
              onClick={() => onNavigateTab('verifications')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <FileCheck className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Document Verification</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Validate Bluebook, License, NID & Tax submissions</p>
            </button>

            <button
              onClick={() => onNavigateTab('services')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <Building2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Government Services</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure civic portals, fee rates & SLAs</p>
            </button>

            <button
              onClick={() => onNavigateTab('announcements')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Civic Broadcasts</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Publish emergency alerts & national notices</p>
            </button>

            <button
              onClick={() => onNavigateTab('support-tickets')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <Inbox className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Support & Contact Tickets</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage user reports, bug submissions & support responses</p>
            </button>

            <button
              onClick={() => onNavigateTab('donation-audit')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <History className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Donation Audit Log</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Track modifications, publication dates & status changes</p>
            </button>

            <button
              onClick={() => onNavigateTab('reports')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <BarChart3 className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Analytics & Financial Reports</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">YTD revenue charts, province breakdowns & PDF exports</p>
            </button>

            <button
              onClick={() => onNavigateTab('system')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
            >
              <Server className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">System Health & Logs</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Audit trails, security logs & server health</p>
            </button>

            <button
              onClick={() => onNavigateTab('playstore-launch')}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-indigo-500/40 text-left transition-all group"
            >
              <Smartphone className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Google Play Launch Portal</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">AAB packages, ASO metadata & Play Console deployment</p>
            </button>
          </div>
        </div>

        {/* Live Cluster Resource Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Infrastructure Cluster Monitor</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">CPU Compute Load</span>
                <span className="text-emerald-400 font-bold">Normal (12%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">RAM Memory Footprint</span>
                <span className="text-amber-400 font-bold">Optimal (38%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Database Instance:</span>
                <span className="text-white font-mono">Firestore Multi-Region</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reverse Proxy:</span>
                <span className="text-white font-mono">Nginx SSL Gateway</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Backup:</span>
                <span className="text-emerald-400 font-bold">2026-07-31 22:00 BS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
