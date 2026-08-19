import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  LogOut,
  ExternalLink,
  ChevronRight,
  QrCode,
  Inbox,
  Activity,
  Radio,
  Tag,
  BarChart3,
  History,
  Smartphone
} from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { AdminDashboard } from './AdminDashboard';
import { UserManagementView } from './UserManagementView';
import { DocumentVerificationView } from './DocumentVerificationView';
import { GovernmentServiceManager } from './GovernmentServiceManager';
import { SystemHealthView } from './SystemHealthView';
import { AnalyticsReportsView } from './AnalyticsReportsView';
import { SupportQrManagerView } from './SupportQrManagerView';
import { ContactInboxView } from './ContactInboxView';
import { LiveDataMonitoringView } from './LiveDataMonitoringView';
import { AdminReleaseCenterView } from './AdminReleaseCenterView';
import { PlayStoreLaunchPortal } from './PlayStoreLaunchPortal';
import { SaarthiLogo } from '../brand/SaarthiLogo';

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  onLogoutAdmin: () => void;
  onReturnToPublicApp: () => void;
  onOpenAdminLogin?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdmin,
  onLogoutAdmin,
  onReturnToPublicApp,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [operationsSubTab, setOperationsSubTab] = useState<'users' | 'verifications' | 'services'>('users');
  const [systemSubTab, setSystemSubTab] = useState<'telemetry' | 'livedata' | 'releases' | 'analytics' | 'playstore'>('telemetry');

  // Handle direct navigation from dashboard buttons
  const handleDashboardNavigate = (target: string) => {
    if (['users', 'verifications', 'services'].includes(target)) {
      setActiveTab('operations');
      setOperationsSubTab(target as any);
    } else if (['contact-inbox', 'inbox', 'tickets', 'support-tickets'].includes(target)) {
      setActiveTab('support-tickets');
    } else if (['playstore-launch', 'playstore'].includes(target)) {
      setActiveTab('system');
      setSystemSubTab('playstore');
    } else {
      setActiveTab(target);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'operations', label: 'Operations & Verifications', icon: Users },
    { id: 'support-tickets', label: 'Support & Contact Tickets', icon: Inbox },
    { id: 'system', label: 'System & Live Data', icon: Activity },
    { id: 'support-qr', label: 'Donations & Payment Channels', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Security Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SaarthiLogo variant="compact" theme="dark" size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">SAARTHI ADMIN PORTAL</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase">
                {currentAdmin.role}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">{currentAdmin.department}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToPublicApp}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Public App View</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-slate-900/80 border-r border-slate-800 p-4 shrink-0 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              {currentAdmin.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-white text-xs truncate block">{currentAdmin.name}</span>
              <span className="text-[10px] text-slate-400 truncate block font-mono">{currentAdmin.id}</span>
            </div>
          </div>

          <nav className="space-y-1">
            <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Main Control Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full p-2.5 rounded-xl text-left font-semibold text-xs flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
          {/* 1. EXECUTIVE OVERVIEW */}
          {activeTab === 'dashboard' && (
            <AdminDashboard currentAdmin={currentAdmin} onNavigateTab={handleDashboardNavigate} />
          )}

          {/* 2. MERGED OPERATIONS & VERIFICATIONS */}
          {activeTab === 'operations' && (
            <div className="space-y-4">
              <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1">
                <button
                  onClick={() => setOperationsSubTab('users')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    operationsSubTab === 'users'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </button>

                <button
                  onClick={() => setOperationsSubTab('verifications')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    operationsSubTab === 'verifications'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Document Verifications</span>
                </button>

                <button
                  onClick={() => setOperationsSubTab('services')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    operationsSubTab === 'services'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Civic Service Operations</span>
                </button>

              </div>

              {operationsSubTab === 'users' && <UserManagementView />}
              {operationsSubTab === 'verifications' && <DocumentVerificationView />}
              {operationsSubTab === 'services' && <GovernmentServiceManager />}
            </div>
          )}

          {/* 3. CENTRALIZED SUPPORT & CONTACT TICKETS */}
          {activeTab === 'support-tickets' && (
            <ContactInboxView />
          )}

          {/* 4. MERGED SYSTEM & LIVE DATA */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1">
                <button
                  onClick={() => setSystemSubTab('telemetry')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    systemSubTab === 'telemetry'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>System Telemetry</span>
                </button>

                <button
                  onClick={() => setSystemSubTab('livedata')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    systemSubTab === 'livedata'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>Live Data Engine & APIs</span>
                </button>

                <button
                  onClick={() => setSystemSubTab('releases')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    systemSubTab === 'releases'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Releases & Versioning</span>
                </button>

                <button
                  onClick={() => setSystemSubTab('analytics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    systemSubTab === 'analytics'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics Reports</span>
                </button>

                <button
                  onClick={() => setSystemSubTab('playstore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    systemSubTab === 'playstore'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-indigo-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Google Play Console Hub</span>
                </button>
              </div>

              {systemSubTab === 'telemetry' && <SystemHealthView />}
              {systemSubTab === 'livedata' && <LiveDataMonitoringView />}
              {systemSubTab === 'releases' && <AdminReleaseCenterView />}
              {systemSubTab === 'analytics' && <AnalyticsReportsView />}
              {systemSubTab === 'playstore' && (
                <PlayStoreLaunchPortal
                  currentLang="en"
                  theme="dark"
                  onNavigateTab={(tab) => handleDashboardNavigate(tab)}
                />
              )}
            </div>
          )}

          {/* 5. DONATIONS & PAYMENT CHANNELS */}
          {activeTab === 'support-qr' && (
            <SupportQrManagerView currentAdmin={currentAdmin} />
          )}
        </main>
      </div>
    </div>
  );
};
