import React from 'react';
import {
  Server,
  Database,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  AlertCircle,
  Wifi,
  Globe
} from 'lucide-react';

interface SystemMonitorViewProps {
  lastRefreshedAt: string;
  countdownFormatted: string;
  onTriggerRefresh: () => void;
  isRefreshing: boolean;
}

export const SystemMonitorView: React.FC<SystemMonitorViewProps> = ({
  lastRefreshedAt,
  countdownFormatted,
  onTriggerRefresh,
  isRefreshing,
}) => {
  const services = [
    {
      name: 'Express Node.js Server',
      status: 'Operational',
      badge: 'HEALTHY',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      uptime: '99.98%',
      latency: '18ms',
      details: 'Port 3000 Ingress - Single CommonJS dist/server.cjs Bundle',
      icon: Server,
    },
    {
      name: 'GitHub State Authority ($0 Ongoing Cost)',
      status: 'Connected',
      badge: 'ACTIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      uptime: '100%',
      latency: '2ms',
      details: 'Authoritative State JSONs, Git Atomic Compare-and-Swap, $0/month Persistence',
      icon: Database,
    },
    {
      name: 'Core API Gateway & Search Service',
      status: 'Online',
      badge: 'CONNECTED',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      uptime: '99.95%',
      latency: '40ms',
      details: 'Server-side Grounding with Google Search & Nepal Legal Index',
      icon: Cpu,
    },
    {
      name: 'Firebase Firestore & Auth',
      status: 'Operational',
      badge: 'SYNCED',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      uptime: '99.99%',
      latency: '22ms',
      details: 'Real-time Push Notifications, User Auth & Document Vault',
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Status</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">99.98%</span>
            <span className="text-xs font-bold text-emerald-400">Optimal</span>
          </div>
          <span className="text-[11px] text-slate-400 block">0 Critical Incidents reported today</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Memory & CPU</span>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">184 MB</span>
            <span className="text-xs font-bold text-sky-400">/ 512 MB</span>
          </div>
          <span className="text-[11px] text-slate-400 block">CPU utilization: 12% average</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">API Error Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">0.00%</span>
            <span className="text-xs font-bold text-emerald-400">Zero Errors</span>
          </div>
          <span className="text-[11px] text-slate-400 block">1,420 successful requests / hr</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Next Auto Refresh</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{countdownFormatted}</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Last refreshed at {lastRefreshedAt}</span>
        </div>
      </div>

      {/* Infrastructure Services Grid */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span>Core Service Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400">Live health indicators for Saarthi backend infrastructure.</p>
          </div>

          <button
            onClick={onTriggerRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Force Health Scan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{srv.name}</h4>
                      <p className="text-[11px] text-slate-400">{srv.details}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase border ${srv.badgeColor}`}>
                    {srv.badge}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Uptime SLA</span>
                    <span className="font-bold text-slate-200 font-mono">{srv.uptime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Response Time</span>
                    <span className="font-bold text-emerald-400 font-mono">{srv.latency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Build & Start Specs */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span>Container Production Specs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Build Script</span>
            <span className="text-emerald-400 font-bold block truncate">vite build && esbuild server.ts --bundle --outfile=dist/server.cjs</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Start Command</span>
            <span className="text-amber-400 font-bold block truncate">node dist/server.cjs (Port 3000)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Ingress Binding</span>
            <span className="text-sky-400 font-bold block truncate">0.0.0.0:3000 (Nginx Proxy)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
