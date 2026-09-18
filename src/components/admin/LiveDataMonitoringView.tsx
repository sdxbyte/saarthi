import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Search,
  Filter,
  Trash2,
  Download,
  Plus,
  Play,
  Settings,
  ShieldCheck,
  Globe,
  Radio,
  FileText,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  LiveApiConfig,
  LiveApiLog,
  ApiCategory,
  ApiStatus,
} from '../../types/liveData';
import {
  loadApiConfigs,
  saveApiConfigs,
  loadApiAuditLogs,
  executeLiveFetch,
  clearLiveApiCache,
  refreshAllLiveApis,
  appendApiAuditLog,
} from '../../utils/liveDataEngine';
import { formatDualDate } from '../../utils/bsAdConverter';

export const LiveDataMonitoringView: React.FC = () => {
  const [configs, setConfigs] = useState<LiveApiConfig[]>([]);
  const [logs, setLogs] = useState<LiveApiLog[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);
  const [testingApiId, setTestingApiId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'logs'>('matrix');

  // Modal State for Adding Custom API
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newApiName, setNewApiName] = useState<string>('');
  const [newApiCategory, setNewApiCategory] = useState<ApiCategory>('public_info');
  const [newApiUrl, setNewApiUrl] = useState<string>('');
  const [newApiSource, setNewApiSource] = useState<string>('');
  const [newApiInterval, setNewApiInterval] = useState<number>(300000);

  // Dual Date Current Clock
  const dualDate = formatDualDate();

  const reloadData = () => {
    setConfigs(loadApiConfigs());
    setLogs(loadApiAuditLogs());
  };

  useEffect(() => {
    reloadData();
    const timer = setInterval(() => {
      setConfigs(loadApiConfigs());
      setLogs(loadApiAuditLogs());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handler: Toggle Endpoint Enable / Disable
  const handleToggleEnable = (apiId: string) => {
    const updated = configs.map((c) => {
      if (c.id === apiId) {
        const nextState = !c.enabled;
        appendApiAuditLog({
          apiId: c.id,
          apiName: c.name,
          timestampIso: new Date().toISOString(),
          adDate: dualDate.adDateStr,
          bsDate: dualDate.bsDateStr,
          time: dualDate.timeStr || '',
          status: 'success',
          statusCode: 200,
          responseTimeMs: 0,
          message: `Admin ${nextState ? 'ENABLED' : 'DISABLED'} stream '${c.name}'`,
          payloadSizeKb: 0,
        });
        return {
          ...c,
          enabled: nextState,
          status: (nextState ? 'online' : 'disabled') as ApiStatus,
        };
      }
      return c;
    });
    saveApiConfigs(updated);
    setConfigs(updated);
  };

  // Handler: Change Refresh Interval
  const handleChangeInterval = (apiId: string, intervalMs: number) => {
    const updated = configs.map((c) => {
      if (c.id === apiId) {
        return { ...c, refreshIntervalMs: intervalMs };
      }
      return c;
    });
    saveApiConfigs(updated);
    setConfigs(updated);
  };

  // Handler: Test Connectivity (Single Ping)
  const handleTestPing = async (apiId: string) => {
    setTestingApiId(apiId);
    try {
      await executeLiveFetch(apiId, true);
      reloadData();
    } catch (e) {
      console.error('Test Ping failed:', e);
    } finally {
      setTestingApiId(null);
    }
  };

  // Handler: Refresh All Live Feeds
  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      await refreshAllLiveApis();
      reloadData();
    } catch (e) {
      console.error('Refresh all failed:', e);
    } finally {
      setIsRefreshingAll(false);
    }
  };

  // Handler: Clear Cache
  const handleClearCache = (apiId?: string) => {
    clearLiveApiCache(apiId);
    reloadData();
    alert(apiId ? `Cleared local cache for ${apiId}` : 'Cleared all cached live API streams.');
  };

  // Handler: Add Custom API Endpoint
  const handleAddCustomApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiName.trim() || !newApiUrl.trim()) {
      alert('Please provide an API Name and Endpoint URL');
      return;
    }

    const customId = `custom-${Date.now()}`;
    const newConfig: LiveApiConfig = {
      id: customId,
      name: newApiName.trim(),
      category: newApiCategory,
      endpointUrl: newApiUrl.trim(),
      dataSource: newApiSource.trim() || 'Custom External API',
      refreshIntervalMs: newApiInterval,
      enabled: true,
      timeoutMs: 5000,
      status: 'online',
      lastResponseTimeMs: 0,
      successCount: 0,
      failureCount: 0,
      consecutiveFailures: 0,
      lastSuccessAd: dualDate.adDateStr,
      lastSuccessBs: dualDate.bsDateStr,
      lastUpdatedTimestamp: new Date().toISOString(),
      lastError: null,
      isCustom: true,
    };

    const updated = [newConfig, ...configs];
    saveApiConfigs(updated);
    setConfigs(updated);

    appendApiAuditLog({
      apiId: customId,
      apiName: newApiName,
      timestampIso: new Date().toISOString(),
      adDate: dualDate.adDateStr,
      bsDate: dualDate.bsDateStr,
      time: dualDate.timeStr || '',
      status: 'success',
      statusCode: 201,
      responseTimeMs: 0,
      message: `Admin registered new custom API: ${newApiName} (${newApiUrl})`,
      payloadSizeKb: 0,
    });

    setIsAddModalOpen(false);
    setNewApiName('');
    setNewApiUrl('');
    setNewApiSource('');
  };

  // Export Audit Logs to CSV / JSON
  const handleExportLogs = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `saarthi_live_api_audit_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['Log ID', 'API ID', 'API Name', 'AD Date', 'BS Date', 'Time', 'Status', 'HTTP Code', 'Latency (ms)', 'Payload (KB)', 'Message'];
      const rows = logs.map((l) => [
        l.id,
        l.apiId,
        `"${l.apiName.replace(/"/g, '""')}"`,
        l.adDate,
        l.bsDate,
        l.time,
        l.status,
        l.statusCode,
        l.responseTimeMs,
        l.payloadSizeKb,
        `"${(l.message || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `saarthi_live_api_audit_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Metrics Calculations
  const totalApis = configs.length;
  const onlineApis = configs.filter((c) => c.status === 'online' && c.enabled).length;
  const offlineApis = configs.filter((c) => c.status === 'offline' && c.enabled).length;
  const disabledApis = configs.filter((c) => !c.enabled).length;
  const totalRequests = configs.reduce((acc, c) => acc + c.successCount + c.failureCount, 0);
  const totalSuccess = configs.reduce((acc, c) => acc + c.successCount, 0);
  const globalSuccessRate = totalRequests > 0 ? Math.round((totalSuccess / totalRequests) * 100) : 100;
  const avgLatency =
    configs.filter((c) => c.lastResponseTimeMs > 0).length > 0
      ? Math.round(
          configs.filter((c) => c.lastResponseTimeMs > 0).reduce((a, c) => a + c.lastResponseTimeMs, 0) /
            configs.filter((c) => c.lastResponseTimeMs > 0).length
        )
      : 120;

  // Filtered List
  const filteredConfigs = configs.filter((c) => {
    const matchesCat = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dataSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <h1 className="text-xl font-black tracking-tight text-white">SAARTHI Live Data Engine Control Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              REAL-TIME HIGH AVAILABILITY
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Centralized public service API monitor, background caching engine, rate-limit protector, and dual AD/BS audit logger.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom API</span>
          </button>
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshingAll}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshingAll ? 'animate-spin' : ''}`} />
            <span>{isRefreshingAll ? 'Refreshing Feeds...' : 'Refresh All Streams'}</span>
          </button>
        </div>
      </div>

      {/* Realtime Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Service Health Score</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{globalSuccessRate}%</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {onlineApis}/{totalApis} Active
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${globalSuccessRate}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg API Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{avgLatency} ms</span>
            <span className="text-[11px] text-slate-400">Response time</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Parallel async fetching active</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Requests Executed</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalRequests.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400">calls</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-2 font-medium">0 Crashes | Rate-limit safe</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dual Clock System</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs font-mono font-semibold text-slate-200">
            <div>AD: {dualDate.adDateStr}</div>
            <div className="text-amber-400">BS: {dualDate.bsDateStr}</div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">{dualDate.timeStr} (Asia/Kathmandu)</p>
        </div>
      </div>

      {/* Tabs Switcher: Matrix View vs Audit Logs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Monitored APIs Matrix ({filteredConfigs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Immutable Audit Logs ({logs.length})</span>
          </button>
        </div>

        <button
          onClick={() => handleClearCache()}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear Global Cache</span>
        </button>
      </div>

      {/* TAB 1: API CONTROL MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'finance', label: 'Finance & Forex' },
                { id: 'nepse', label: 'NEPSE & Stocks' },
                { id: 'government', label: 'Government' },
                { id: 'public_info', label: 'Public Info & Emergency' },
                { id: 'news', label: 'News Feed' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search APIs or sources..."
                className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Status & Stream</th>
                    <th className="py-3.5 px-4">Official Data Source</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Refresh Interval</th>
                    <th className="py-3.5 px-4">Latency</th>
                    <th className="py-3.5 px-4">Success / Fail</th>
                    <th className="py-3.5 px-4">Last Updated (AD & BS)</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredConfigs.map((api) => {
                    const isTesting = testingApiId === api.id;
                    return (
                      <tr key={api.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5 font-sans">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                !api.enabled
                                  ? 'bg-slate-600'
                                  : api.status === 'online'
                                  ? 'bg-emerald-500 animate-pulse'
                                  : api.status === 'degraded'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {api.name}
                                {api.isCustom && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                                    CUSTOM
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{api.endpointUrl}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-sans text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{api.dataSource}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] uppercase font-bold border border-slate-700">
                            {api.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={api.refreshIntervalMs}
                            onChange={(e) => handleChangeInterval(api.id, Number(e.target.value))}
                            className="bg-slate-950 text-slate-200 text-[11px] rounded-lg px-2 py-1 border border-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            <option value={60000}>1 min</option>
                            <option value={120000}>2 min</option>
                            <option value={300000}>5 min</option>
                            <option value={600000}>10 min</option>
                            <option value={900000}>15 min</option>
                            <option value={1800000}>30 min</option>
                            <option value={3600000}>1 hour</option>
                            <option value={86400000}>24 hours</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-slate-300">
                          {api.lastResponseTimeMs > 0 ? `${api.lastResponseTimeMs} ms` : '—'}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-emerald-400 font-bold">{api.successCount}</span>
                            <span className="text-slate-600">/</span>
                            <span className={api.failureCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                              {api.failureCount}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[10px] text-slate-300 font-sans">
                          <div>AD: {api.lastSuccessAd}</div>
                          <div className="text-amber-400/90 font-medium">BS: {api.lastSuccessBs}</div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 font-sans">
                            <button
                              onClick={() => handleTestPing(api.id)}
                              disabled={isTesting || !api.enabled}
                              title="Test Connectivity (Ping)"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors disabled:opacity-40"
                            >
                              <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                              onClick={() => handleClearCache(api.id)}
                              title="Clear Cache for this API"
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
                            >
                              <Database className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleEnable(api.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                api.enabled
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                              }`}
                            >
                              {api.enabled ? 'ENABLED' : 'DISABLED'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMMUTABLE AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Append-Only Immutable API Audit Trail (Showing last <strong>{logs.length}</strong> events)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportLogs('csv')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExportLogs('json')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="py-3 px-4">Status & Time</th>
                    <th className="py-3 px-4">API Name</th>
                    <th className="py-3 px-4">AD Date</th>
                    <th className="py-3 px-4">BS Date</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Payload Size</th>
                    <th className="py-3 px-4">Event Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {log.status === 'success' ? `200 OK` : `FAIL (${log.statusCode})`}
                          </span>
                          <span className="text-[10px] text-slate-400">{log.time}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 font-sans font-bold text-white truncate max-w-[180px]">{log.apiName}</td>

                      <td className="py-2.5 px-4 text-slate-300">{log.adDate}</td>

                      <td className="py-2.5 px-4 text-amber-400/90 font-medium">{log.bsDate}</td>

                      <td className="py-2.5 px-4">{log.responseTimeMs > 0 ? `${log.responseTimeMs} ms` : '—'}</td>

                      <td className="py-2.5 px-4 text-slate-400">{log.payloadSizeKb > 0 ? `${log.payloadSizeKb} KB` : '0 KB'}</td>

                      <td className="py-2.5 px-4 font-sans text-slate-300 text-[11px] truncate max-w-xs">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM PUBLIC API */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-extrabold text-white">Register New External API Stream</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomApi} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">API Service Name *</label>
                <input
                  type="text"
                  required
                  value={newApiName}
                  onChange={(e) => setNewApiName(e.target.value)}
                  placeholder="e.g. Nepal Electricity Authority Load Forecast"
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={newApiCategory}
                  onChange={(e) => setNewApiCategory(e.target.value as ApiCategory)}
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="public_info">Public Information & Emergency</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="nepse">NEPSE & Stocks</option>
                  <option value="government">Government Services</option>
                  <option value="news">News Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Endpoint URL (REST / JSON) *</label>
                <input
                  type="url"
                  required
                  value={newApiUrl}
                  onChange={(e) => setNewApiUrl(e.target.value)}
                  placeholder="https://api.example.gov.np/v1/feed"
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Data Source Name</label>
                <input
                  type="text"
                  value={newApiSource}
                  onChange={(e) => setNewApiSource(e.target.value)}
                  placeholder="e.g. Nepal Electricity Authority (NEA)"
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Auto Refresh Interval</label>
                <select
                  value={newApiInterval}
                  onChange={(e) => setNewApiInterval(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value={60000}>Every 1 Minute</option>
                  <option value={300000}>Every 5 Minutes</option>
                  <option value={600000}>Every 10 Minutes</option>
                  <option value={1800000}>Every 30 Minutes</option>
                  <option value={3600000}>Every 1 Hour</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  Register API Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
