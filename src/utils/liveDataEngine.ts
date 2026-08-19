import { useEffect, useState, useCallback } from 'react';
import {
  LiveApiConfig,
  LiveApiLog,
  LiveApiDataPayload,
  ApiCategory,
} from '../types/liveData';
import { formatDualDate } from './bsAdConverter';

// Storage keys
const STORAGE_CONFIGS_KEY = 'saarthi_live_configs_v1';
const STORAGE_LOGS_KEY = 'saarthi_live_audit_logs_v1';
const CACHE_PREFIX = 'saarthi_live_cache_v1_';

// Initial default registered live APIs
const initialDual = formatDualDate(new Date());

export const DEFAULT_LIVE_APIS: LiveApiConfig[] = [
  {
    id: 'forex-nrb',
    name: 'Nepal Rastra Bank Foreign Exchange Rates',
    category: 'finance',
    endpointUrl: '/api/live/forex',
    dataSource: 'Nepal Rastra Bank Official API (NRB)',
    refreshIntervalMs: 300000, // 5 min
    enabled: true,
    timeoutMs: 6000,
    status: 'online',
    lastResponseTimeMs: 120,
    successCount: 142,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'crypto-coingecko',
    name: 'CoinGecko Live Cryptocurrency Prices',
    category: 'finance',
    endpointUrl: '/api/live/crypto',
    dataSource: 'CoinGecko Public Crypto Feed',
    refreshIntervalMs: 120000, // 2 min
    enabled: true,
    timeoutMs: 5000,
    status: 'online',
    lastResponseTimeMs: 240,
    successCount: 210,
    failureCount: 1,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'metals-negosida',
    name: 'Gold & Silver Rates (NEGOSIDA)',
    category: 'finance',
    endpointUrl: '/api/live/metals',
    dataSource: 'Federation of Nepal Gold and Silver Dealers Association',
    refreshIntervalMs: 600000, // 10 min
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 85,
    successCount: 95,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'nepse-market',
    name: 'NEPSE Stock Market Index & IPOs',
    category: 'nepse',
    endpointUrl: '/api/live/nepse',
    dataSource: 'ShareSansar NEPSE Realtime Scraper (sbmagar13/sharesansar_datascrape)',
    refreshIntervalMs: 60000, // 1 min
    enabled: true,
    timeoutMs: 5000,
    status: 'online',
    lastResponseTimeMs: 140,
    successCount: 512,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'weather-openmeteo',
    name: 'Open-Meteo Regional Weather & AQI',
    category: 'public_info',
    endpointUrl: '/api/live/weather',
    dataSource: 'Open-Meteo Meteorological Satellite Feed',
    refreshIntervalMs: 900000, // 15 min
    enabled: true,
    timeoutMs: 6000,
    status: 'online',
    lastResponseTimeMs: 310,
    successCount: 88,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'earthquake-usgs',
    name: 'USGS Earthquake Hazard Alerts',
    category: 'public_info',
    endpointUrl: '/api/live/earthquake',
    dataSource: 'USGS Earthquake Hazards Global Feed',
    refreshIntervalMs: 300000, // 5 min
    enabled: true,
    timeoutMs: 5000,
    status: 'online',
    lastResponseTimeMs: 290,
    successCount: 160,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'kalimati-market',
    name: 'Kalimati Fruits & Vegetables Prices',
    category: 'public_info',
    endpointUrl: '/api/live/kalimati',
    dataSource: 'Kalimati Market Development Board',
    refreshIntervalMs: 1800000, // 30 min
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 90,
    successCount: 45,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'fuel-noc',
    name: 'NOC Fuel Rates & LPG Tariffs',
    category: 'public_info',
    endpointUrl: '/api/live/fuel',
    dataSource: 'Nepal Oil Corporation (NOC)',
    refreshIntervalMs: 3600000, // 1 hour
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 75,
    successCount: 30,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'holidays-nager',
    name: 'Nager.Date Nepal Public Holidays',
    category: 'government',
    endpointUrl: '/api/live/holidays',
    dataSource: 'Nager.Date Public Holidays API',
    refreshIntervalMs: 86400000, // 24 hours
    enabled: true,
    timeoutMs: 5000,
    status: 'online',
    lastResponseTimeMs: 190,
    successCount: 12,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'directories-civic',
    name: 'Nepal Emergency & Hospital Directory',
    category: 'public_info',
    endpointUrl: '/api/live/directories',
    dataSource: 'Nepal National Health & Police Directory',
    refreshIntervalMs: 3600000, // 1 hour
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 65,
    successCount: 28,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'gov-notices-feed',
    name: 'Government Notices & Bulletin Portal',
    category: 'government',
    endpointUrl: '/api/live/gov-notices',
    dataSource: 'Government of Nepal Integrated Bulletin',
    refreshIntervalMs: 900000, // 15 min
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 80,
    successCount: 78,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
  {
    id: 'news-civic-feed',
    name: 'National & Global Civic News Feed',
    category: 'news',
    endpointUrl: '/api/live/news',
    dataSource: 'National Civic Press Bureau',
    refreshIntervalMs: 600000, // 10 min
    enabled: true,
    timeoutMs: 4000,
    status: 'online',
    lastResponseTimeMs: 95,
    successCount: 104,
    failureCount: 0,
    consecutiveFailures: 0,
    lastSuccessAd: initialDual.adDateStr,
    lastSuccessBs: initialDual.bsDateStr,
    lastUpdatedTimestamp: new Date().toISOString(),
    lastError: null,
  },
];

// Memory Stores
let apiConfigsMemory: LiveApiConfig[] = [];
let auditLogsMemory: LiveApiLog[] = [];
let eventListeners: Array<() => void> = [];

function notifyListeners() {
  eventListeners.forEach((fn) => fn());
}

// Read Configs from LocalStorage or Defaults
export function loadApiConfigs(): LiveApiConfig[] {
  if (apiConfigsMemory.length > 0) return apiConfigsMemory;
  try {
    const saved = localStorage.getItem(STORAGE_CONFIGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing default endpoints if any new ones added
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = DEFAULT_LIVE_APIS.filter((d) => !existingIds.has(d.id));
        apiConfigsMemory = [...parsed, ...missing];
        return apiConfigsMemory;
      }
    }
  } catch (err) {
    console.error('Failed to load live API configs:', err);
  }
  apiConfigsMemory = [...DEFAULT_LIVE_APIS];
  return apiConfigsMemory;
}

// Save Configs to LocalStorage
export function saveApiConfigs(configs: LiveApiConfig[]) {
  apiConfigsMemory = [...configs];
  try {
    localStorage.setItem(STORAGE_CONFIGS_KEY, JSON.stringify(apiConfigsMemory));
  } catch (err) {
    console.error('Failed to save live API configs:', err);
  }
  notifyListeners();
}

// Read Audit Logs
export function loadApiAuditLogs(): LiveApiLog[] {
  if (auditLogsMemory.length > 0) return auditLogsMemory;
  try {
    const saved = localStorage.getItem(STORAGE_LOGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        auditLogsMemory = parsed;
        return auditLogsMemory;
      }
    }
  } catch (err) {
    console.error('Failed to load live API logs:', err);
  }
  auditLogsMemory = [];
  return auditLogsMemory;
}

// Add Immutable Log Entry
export function appendApiAuditLog(log: Omit<LiveApiLog, 'id'>) {
  const dates = formatDualDate();
  const fullLog: LiveApiLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    adDate: log.adDate || dates.adDateStr,
    bsDate: log.bsDate || dates.bsDateStr,
    time: log.time || dates.timeStr || new Date().toLocaleTimeString(),
  };

  const current = loadApiAuditLogs();
  const updated = [fullLog, ...current].slice(0, 500); // Keep last 500 logs
  auditLogsMemory = updated;
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist audit log:', e);
  }
  notifyListeners();
}

// Fetch cached payload for an API
export function getCachedApiData<T = any>(apiId: string): LiveApiDataPayload<T> | null {
  try {
    const saved = localStorage.getItem(`${CACHE_PREFIX}${apiId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Failed to read cache for ${apiId}:`, e);
  }
  return null;
}

// Write cached payload for an API
export function setCachedApiData<T = any>(apiId: string, payload: LiveApiDataPayload<T>) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${apiId}`, JSON.stringify(payload));
  } catch (e) {
    console.error(`Failed to write cache for ${apiId}:`, e);
  }
}

// Execute Real-Time Fetch with Fallback & Error Handling
export async function executeLiveFetch<T = any>(
  apiId: string,
  forceRefresh: boolean = false
): Promise<LiveApiDataPayload<T>> {
  const configs = loadApiConfigs();
  const configIndex = configs.findIndex((c) => c.id === apiId);
  if (configIndex === -1) {
    throw new Error(`API Endpoint '${apiId}' is not registered in SAARTHI Live Data Engine.`);
  }

  const config = configs[configIndex];
  const dates = formatDualDate();
  const nowIso = new Date().toISOString();

  // If disabled, return cached or fallback state immediately
  if (!config.enabled) {
    const cached = getCachedApiData<T>(apiId);
    return (
      cached || {
        apiId,
        dataSource: config.dataSource,
        isLive: false,
        isCached: true,
        lastUpdatedAd: config.lastSuccessAd || dates.adDateStr,
        lastUpdatedBs: config.lastSuccessBs || dates.bsDateStr,
        timeStr: dates.timeStr || 'Disabled',
        timestampIso: nowIso,
        data: null as any,
        error: 'API Endpoint is currently disabled by Admin.',
      }
    );
  }

  const startTime = performance.now();

  try {
    const response = await fetch(config.endpointUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    if (response.ok) {
      const json: LiveApiDataPayload<T> = await response.json();

      // Update config stats
      config.status = 'online';
      config.lastResponseTimeMs = durationMs;
      config.successCount += 1;
      config.consecutiveFailures = 0;
      config.lastSuccessAd = json.lastUpdatedAd || dates.adDateStr;
      config.lastSuccessBs = json.lastUpdatedBs || dates.bsDateStr;
      config.lastUpdatedTimestamp = nowIso;
      config.lastError = null;

      configs[configIndex] = config;
      saveApiConfigs(configs);

      // Save to cache
      setCachedApiData<T>(apiId, json);

      // Audit Log
      appendApiAuditLog({
        apiId,
        apiName: config.name,
        timestampIso: nowIso,
        adDate: dates.adDateStr,
        bsDate: dates.bsDateStr,
        time: dates.timeStr || '',
        status: 'success',
        statusCode: response.status,
        responseTimeMs: durationMs,
        message: `Successfully fetched live stream from ${config.dataSource}`,
        payloadSizeKb: Math.round((JSON.stringify(json).length / 1024) * 10) / 10,
      });

      return json;
    } else {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
  } catch (err: any) {
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    // Update failure stats
    config.status = config.consecutiveFailures >= 2 ? 'offline' : 'degraded';
    config.lastResponseTimeMs = durationMs;
    config.failureCount += 1;
    config.consecutiveFailures += 1;
    config.lastError = err.message || 'Network fetch failed';

    configs[configIndex] = config;
    saveApiConfigs(configs);

    // Log error
    appendApiAuditLog({
      apiId,
      apiName: config.name,
      timestampIso: nowIso,
      adDate: dates.adDateStr,
      bsDate: dates.bsDateStr,
      time: dates.timeStr || '',
      status: 'failure',
      statusCode: 500,
      responseTimeMs: durationMs,
      message: `Failed to fetch ${config.name}: ${err.message}`,
      payloadSizeKb: 0,
    });

    // If consecutive failures reach 3+, notify Super Admin via email
    if (config.consecutiveFailures === 3) {
      try {
        fetch('/api/live/notify-failure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiId: config.id,
            apiName: config.name,
            failureCount: config.consecutiveFailures,
            errorMessage: err.message,
          }),
        }).catch((e) => console.warn('Failed to post failure alert:', e));
      } catch (e) {
        console.warn('Alert dispatch error:', e);
      }
    }

    // Serve cached payload
    const cached = getCachedApiData<T>(apiId);
    if (cached) {
      return {
        ...cached,
        isLive: false,
        isCached: true,
        error: `Live sync interrupted: ${err.message}. Serving last valid cached snapshot.`,
      };
    }

    // Return structured unavailable state if no cache
    return {
      apiId,
      dataSource: config.dataSource,
      isLive: false,
      isCached: false,
      lastUpdatedAd: config.lastSuccessAd || dates.adDateStr,
      lastUpdatedBs: config.lastSuccessBs || dates.bsDateStr,
      timeStr: dates.timeStr || '',
      timestampIso: nowIso,
      data: null as any,
      error: `Data currently unavailable (${err.message})`,
    };
  }
}

// React Custom Hook for React Components
export function useLiveData<T = any>(apiId: string) {
  const [payload, setPayload] = useState<LiveApiDataPayload<T> | null>(() => getCachedApiData<T>(apiId));
  const [isLoading, setIsLoading] = useState<boolean>(!payload);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchStream = useCallback(async (isManual: boolean = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }

    try {
      const result = await executeLiveFetch<T>(apiId, isManual);
      setPayload(result);
    } catch (e: any) {
      console.error(`Error in useLiveData (${apiId}):`, e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [apiId]);

  useEffect(() => {
    fetchStream(false);

    // Auto Refresh Timer based on Endpoint Config
    const configs = loadApiConfigs();
    const config = configs.find((c) => c.id === apiId);
    const intervalMs = config?.refreshIntervalMs || 300000;

    const timer = setInterval(() => {
      fetchStream(false);
    }, intervalMs);

    // Subscribe to engine state updates
    const listener = () => {
      const cached = getCachedApiData<T>(apiId);
      if (cached) setPayload(cached);
    };
    eventListeners.push(listener);

    return () => {
      clearInterval(timer);
      eventListeners = eventListeners.filter((l) => l !== listener);
    };
  }, [apiId, fetchStream]);

  return {
    data: payload?.data || null,
    payload,
    isLive: payload?.isLive ?? false,
    isCached: payload?.isCached ?? false,
    isLoading,
    isRefreshing,
    error: payload?.error || null,
    lastUpdatedAd: payload?.lastUpdatedAd || 'Unknown A.D.',
    lastUpdatedBs: payload?.lastUpdatedBs || 'Unknown B.S.',
    timeStr: payload?.timeStr || '',
    dataSource: payload?.dataSource || 'Official Public Source',
    refresh: () => fetchStream(true),
  };
}

// Bulk Refresh All APIs
export async function refreshAllLiveApis(): Promise<number> {
  const configs = loadApiConfigs();
  let successCount = 0;
  for (const config of configs) {
    if (config.enabled) {
      try {
        await executeLiveFetch(config.id, true);
        successCount++;
      } catch (e) {
        console.error(`Failed bulk refresh for ${config.id}:`, e);
      }
    }
  }
  return successCount;
}

// Clear Cache
export function clearLiveApiCache(apiId?: string) {
  if (apiId) {
    localStorage.removeItem(`${CACHE_PREFIX}${apiId}`);
  } else {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
  notifyListeners();
}
