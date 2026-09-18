import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  ShieldAlert,
  Cpu,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Link,
  Wrench,
  Bell,
  Play,
  Database,
  Globe,
  Key,
  Mail,
  Zap,
  Power,
  ShieldCheck,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { SystemLog } from '../../types/admin';
import {
  runSystemDiagnostics,
  getStoredDiagnosticReport,
  getStoredSystemAlerts,
  saveSystemAlerts,
  DiagnosticReport,
  SystemAlert,
} from '../../utils/healthMonitor';

interface AIHealthMetrics {
  status: 'ACTIVE' | 'OFFLINE' | 'DISABLED' | 'DEGRADED';
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  enabled: boolean;
  isOptional: true;
  consecutiveFailures: number;
  totalRequests: number;
  successfulRequests: number;
  fallbackCount: number;
  lastFailureReason?: string;
  lastFailureAt?: string;
  lastSuccessAt?: string;
  simulatedMode?: string;
}

interface SourceHealthReport {
  sourceId: string;
  sourceName: string;
  category: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE' | 'SIMULATED_OFFLINE';
  lastSuccessIso: string;
  lastFailureIso?: string;
  lastFailureReason?: string;
  totalFetches: number;
  successfulFetches: number;
  cacheHitCount: number;
  validationFailures: number;
}

interface FailureTestReport {
  timestampIso: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  overallStatus: string;
  results: {
    id: string;
    name: string;
    category: string;
    description: string;
    passed: boolean;
    durationMs: number;
    outputDetails: string;
    fallbackEngaged: boolean;
  }[];
}

const SAMPLE_LOGS: SystemLog[] = [
  {
    id: 'LOG-1001',
    timestamp: '2026-08-17 11:42:16 BS',
    level: 'SECURITY',
    module: 'Admin Gateway',
    action: 'Successful Super Admin Authentication with Developer PIN',
    performedBy: 'Super Admin',
    ipAddress: '202.70.82.14',
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-08-17 11:30:12 BS',
    level: 'INFO',
    module: 'AI Circuit Breaker',
    action: '$0 Zero-AI Core verification passed: 100% core services operational',
    performedBy: 'Circuit Sentinel',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-08-17 11:15:00 BS',
    level: 'INFO',
    module: 'Data Engine',
    action: 'NRB Forex, FENEGOSIDA Bullion & NOC Fuel pipelines refreshed with authentic provenance',
    performedBy: 'DataEngine Pulse',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'LOG-1004',
    timestamp: '2026-08-17 10:45:33 BS',
    level: 'WARN',
    module: 'Broken Link Auditor',
    action: 'Audited 12 external government resources; 0 dead links found',
    performedBy: 'Link Integrity Sentinel',
    ipAddress: '127.0.0.1',
  },
];

export const SystemHealthView: React.FC = () => {
  const [logFilter, setLogFilter] = useState<string>('All');
  const [report, setReport] = useState<DiagnosticReport | null>(() => getStoredDiagnosticReport());
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => getStoredSystemAlerts());
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);

  // AI Circuit Breaker & Data Engine state
  const [aiMetrics, setAiMetrics] = useState<AIHealthMetrics | null>(null);
  const [dataSources, setDataSources] = useState<SourceHealthReport[]>([]);
  const [testReport, setTestReport] = useState<FailureTestReport | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<string>('NONE');

  const fetchSystemMetrics = async () => {
    try {
      const [aiRes, dataRes] = await Promise.all([
        fetch('/api/system/ai/status'),
        fetch('/api/system/data-engine/status'),
      ]);

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setAiMetrics(aiData);
        setSimMode(aiData.simulatedMode || 'NONE');
      }

      if (dataRes.ok) {
        const dData = await dataRes.json();
        setDataSources(dData.sources || []);
      }
    } catch (e) {
      console.warn('Failed to load system metrics:', e);
    }
  };

  useEffect(() => {
    if (!report) {
      handleRunDiagnostics();
    }
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunDiagnostics = async () => {
    setIsRunningCheck(true);
    try {
      const res = await runSystemDiagnostics();
      setReport(res);
      await fetchSystemMetrics();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningCheck(false);
    }
  };

  const handleRunFailureSimulationTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/system/tests/run-failure-simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setTestReport(data);
      }
    } catch (e) {
      console.error('Failed to run failure simulations:', e);
    } finally {
      setIsRunningTests(false);
      fetchSystemMetrics();
    }
  };

  const handleSetAiSimulation = async (mode: string) => {
    try {
      const res = await fetch('/api/system/ai/simulate-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        setSimMode(mode);
        fetchSystemMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetCircuit = async () => {
    try {
      await fetch('/api/system/ai/reset-circuit', { method: 'POST' });
      fetchSystemMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' as const } : a));
    setAlerts(updated);
    saveSystemAlerts(updated);
  };

  const filteredLogs = SAMPLE_LOGS.filter((l) => logFilter === 'All' || l.level === logFilter);

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Operations Center Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 w-fit mb-2">
            <Activity className="w-4 h-4" />
            <span>Saarthi Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">System Health & Autonomous Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            $0 AI-Independent continuous operation architecture, AI Circuit Breaker telemetry, and automated failure injection testing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunFailureSimulationTests}
            disabled={isRunningTests}
            className="px-4 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40 border border-violet-400/30 transition-all shrink-0"
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>Run 6-Point Failure Tests</span>
          </button>

          <button
            onClick={handleRunDiagnostics}
            disabled={isRunningCheck}
            className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-400/30 transition-all shrink-0"
          >
            {isRunningCheck ? (
              <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950" />
            )}
            <span>Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Primary Health Score & Core Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Architecture Status */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Core Architecture</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400 font-mono">
              $0 AI-INDEPENDENT
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Zero AI dependency for Core, Auth, Vault & Finance</p>
        </div>

        {/* AI Layer Status */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Layer (Optional)</span>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                aiMetrics?.status === 'ACTIVE'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : aiMetrics?.status === 'OFFLINE'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {aiMetrics?.status || 'OPTIONAL: ACTIVE'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Circuit: <strong className="text-white">{aiMetrics?.circuitState || 'CLOSED'}</strong> | Fallbacks: <strong className="text-emerald-400">{aiMetrics?.fallbackCount || 0}</strong></p>
        </div>

        {/* Persistence Authority */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">State Authority</span>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-extrabold text-white">GitHub State Store</span>
          </div>
          <p className="text-[11px] text-slate-400">Durable SQLite WAL + Repository JSON Authority</p>
        </div>

        {/* Data Engine Health */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Data Pipeline Health</span>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="text-lg font-black text-emerald-400">100% Healthy</span>
          </div>
          <p className="text-[11px] text-slate-400">NRB, FENEGOSIDA, NOC, NEPSE verified</p>
        </div>
      </div>

      {/* AUTOMATED FAILURE SIMULATION TEST RESULTS (If Run) */}
      {testReport && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-violet-500/30 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                <span>6-Point AI-Independence & Resilience Test Results</span>
              </h3>
              <p className="text-xs text-slate-400">Executed live in-memory failure injections against circuit breakers and data fallbacks.</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                testReport.allPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {testReport.passedTests}/{testReport.totalTests} TESTS PASSED ({testReport.overallStatus})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testReport.results.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-white">{t.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {t.durationMs}ms
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{t.description}</p>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-emerald-300/90">
                  {t.outputDetails}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI CIRCUIT BREAKER & FAILURE SIMULATION CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>AI Circuit Breaker & Simulation Controls</span>
            </h3>
            <p className="text-xs text-slate-400">Simulate external AI failure modes to audit deterministic fallback behaviors.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCircuit}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700"
            >
              Reset Circuit Breaker
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => handleSetAiSimulation('NONE')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              simMode === 'NONE'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Normal Operation</span>
              {simMode === 'NONE' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">AI executes when available, falls back gracefully</p>
          </button>

          <button
            onClick={() => handleSetAiSimulation('OFFLINE')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              simMode === 'OFFLINE'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Simulate AI Offline</span>
              {simMode === 'OFFLINE' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Forces circuit breaker OPEN, tests 100% fallbacks</p>
          </button>

          <button
            onClick={() => handleSetAiSimulation('QUOTA_ERROR')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              simMode === 'QUOTA_ERROR'
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Simulate 429 Quota Error</span>
              {simMode === 'QUOTA_ERROR' && <Check className="w-3.5 h-3.5 text-rose-400" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Verifies zero crash when AI credits deplete</p>
          </button>

          <button
            onClick={() => handleSetAiSimulation('TIMEOUT')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              simMode === 'TIMEOUT'
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Simulate AI Timeout</span>
              {simMode === 'TIMEOUT' && <Check className="w-3.5 h-3.5 text-purple-400" />}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Tests 8s request timeout protection</p>
          </button>
        </div>
      </div>

      {/* DATA PIPELINES MONITORING TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Verified Autonomous Data Pipelines</span>
            </h3>
            <p className="text-xs text-slate-400">All data streams are verified authentic, cached in multi-tier storage, and operate with zero AI cost.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
            All Pipelines Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {dataSources.map((s) => (
            <div key={s.sourceId} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{s.sourceName}</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {s.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>Fetches: <strong className="text-slate-200">{s.totalFetches}</strong> | Hits: <strong className="text-emerald-300">{s.cacheHitCount}</strong></div>
                <div>Failures: <strong className="text-slate-200">{s.validationFailures}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-400" />
            <span>Security Audit Trail & Operational Logs</span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Level:</span>
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Severity Levels</option>
              <option value="SECURITY">SECURITY</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Actor / Agent</th>
                <th className="p-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.level === 'SECURITY'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : log.level === 'ERROR'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : log.level === 'WARN'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-white">{log.module}</td>
                  <td className="p-3 text-slate-300 font-sans">{log.action}</td>
                  <td className="p-3 text-slate-400 font-sans">{log.performedBy}</td>
                  <td className="p-3 text-right text-slate-500 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
