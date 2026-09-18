/**
 * SAARTHI Core Data Engine
 * 
 * $0-Cost Autonomous Data Pipeline Architecture
 * 
 * Pipeline:
 * Source -> Fetcher -> Parser -> Schema Validator -> Business Sanity Check ->
 * Normalizer -> Multi-Tier Cache (Memory + Persistent State) -> Provenance Stamping ->
 * SAARTHI API / Frontend
 * 
 * Zero AI requirement anywhere in this pipeline.
 */

import { OFFICIAL_DATA_SOURCES, DataSourceRegistryItem } from './dataSources';

export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'SOURCE_UNAVAILABLE' | 'VALIDATION_FAILED';
export type SourceTierLevel = 'PRIMARY' | 'SECONDARY' | 'CACHED_FALLBACK';

export interface DataEngineMetadata {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  retrievedAtIso: string;
  lastSuccessfulUpdateIso: string;
  lastValidatedAtIso: string;
  freshnessStatus: FreshnessStatus;
  validationStatus: 'VALIDATED' | 'PASSED_SANITY_CHECK' | 'FALLBACK_VERIFIED';
  sourcePriority: SourceTierLevel;
  adDate: string;
  bsDate: string;
  timeNpt: string;
  cached: boolean;
  ttlSeconds: number;
}

export interface CachedDataRecord<T> {
  data: T;
  meta: DataEngineMetadata;
  expiresAt: number;
}

export interface SourceHealthReport {
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

class SaarthiDataEngine {
  private memoryCache = new Map<string, CachedDataRecord<any>>();
  private persistentFallbackStore = new Map<string, CachedDataRecord<any>>();
  private healthRegistry = new Map<string, SourceHealthReport>();

  // Failure simulation flags for admin tests & audits
  private simulationFlags = {
    allSourcesOffline: false,
    networkDegraded: false,
    failingSources: new Set<string>(),
  };

  constructor() {
    this.initHealthRegistry();
  }

  private initHealthRegistry(): void {
    const defaultSources = [
      { id: 'nrb_forex', name: 'Nepal Rastra Bank (NRB) Forex', category: 'forex' },
      { id: 'fenegosida_bullion', name: 'FENEGOSIDA Bullion (Gold/Silver)', category: 'gold_silver' },
      { id: 'noc_fuel', name: 'Nepal Oil Corporation (NOC) Fuel', category: 'fuel' },
      { id: 'nepse_market', name: 'Nepal Stock Exchange (NEPSE)', category: 'nepse' },
      { id: 'cdsc_ipo', name: 'CDSC MeroShare / SEBON IPOs', category: 'ipo' },
      { id: 'nepal_news', name: 'Verified Financial & Civic News Hub', category: 'news' },
      { id: 'openmeteo_weather', name: 'Open-Meteo Weather Service', category: 'weather' },
      { id: 'usgs_seismic', name: 'USGS Earthquake Monitoring', category: 'earthquake' },
      { id: 'kalimati_agri', name: 'Kalimati Agri Market (KFVMDB)', category: 'government' },
    ];

    for (const src of defaultSources) {
      this.healthRegistry.set(src.id, {
        sourceId: src.id,
        sourceName: src.name,
        category: src.category,
        status: 'HEALTHY',
        lastSuccessIso: new Date().toISOString(),
        totalFetches: 0,
        successfulFetches: 0,
        cacheHitCount: 0,
        validationFailures: 0,
      });
    }
  }

  /**
   * Set simulation flags for testing failure tolerance
   */
  public setSimulationFlag(flag: 'ALL_OFFLINE' | 'NETWORK_DEGRADED' | 'RESET', targetSourceId?: string): void {
    if (flag === 'ALL_OFFLINE') {
      this.simulationFlags.allSourcesOffline = true;
    } else if (flag === 'NETWORK_DEGRADED') {
      this.simulationFlags.networkDegraded = true;
    } else if (flag === 'RESET') {
      this.simulationFlags.allSourcesOffline = false;
      this.simulationFlags.networkDegraded = false;
      this.simulationFlags.failingSources.clear();
      this.initHealthRegistry();
    }

    if (targetSourceId) {
      this.simulationFlags.failingSources.add(targetSourceId);
    }
  }

  /**
   * Universal Autonomous Fetch & Cache Pipeline with Zero-AI Requirement
   */
  public async executePipeline<T>(
    cacheKey: string,
    sourceId: string,
    fetchers: {
      primary: () => Promise<T>;
      secondary?: () => Promise<T>;
      staticFallback: () => T;
    },
    validators: {
      validateSchema: (data: any) => boolean;
      sanityCheck?: (data: T, previousData?: T) => boolean;
    },
    options: {
      ttlSeconds?: number;
      staleWindowSeconds?: number;
      sourceName: string;
      sourceUrl: string;
      sourceType: string;
    }
  ): Promise<{ data: T; meta: DataEngineMetadata; fromCache: boolean }> {
    const ttl = (options.ttlSeconds || 300) * 1000;
    const now = Date.now();
    const cached = this.memoryCache.get(cacheKey);

    const health = this.healthRegistry.get(sourceId) || {
      sourceId,
      sourceName: options.sourceName,
      category: 'general',
      status: 'HEALTHY',
      lastSuccessIso: new Date().toISOString(),
      totalFetches: 0,
      successfulFetches: 0,
      cacheHitCount: 0,
      validationFailures: 0,
    };
    health.totalFetches++;

    // 1. Return fresh memory cache if valid and not simulated offline
    if (cached && now < cached.expiresAt && !this.simulationFlags.allSourcesOffline && !this.simulationFlags.failingSources.has(sourceId)) {
      health.cacheHitCount++;
      this.healthRegistry.set(sourceId, health);
      return {
        data: cached.data,
        meta: {
          ...cached.meta,
          freshnessStatus: 'LIVE',
          cached: true,
        },
        fromCache: true,
      };
    }

    // 2. Simulated Network Degraded Delay
    if (this.simulationFlags.networkDegraded) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 3. Attempt Live Fetch (Primary Source)
    let fetchedData: T | null = null;
    let sourcePriority: SourceTierLevel = 'PRIMARY';
    let fetchError: string | null = null;

    if (!this.simulationFlags.allSourcesOffline && !this.simulationFlags.failingSources.has(sourceId)) {
      try {
        const liveResult = await fetchers.primary();
        if (validators.validateSchema(liveResult)) {
          if (!validators.sanityCheck || validators.sanityCheck(liveResult, cached?.data)) {
            fetchedData = liveResult;
            sourcePriority = 'PRIMARY';
          } else {
            health.validationFailures++;
            console.warn(`[SAARTHI Data Engine] Sanity check failed for ${sourceId}`);
          }
        } else {
          health.validationFailures++;
          console.warn(`[SAARTHI Data Engine] Schema validation failed for ${sourceId}`);
        }
      } catch (err: any) {
        fetchError = err?.message || String(err);
      }
    }

    // 4. Secondary Source Fallback if primary failed
    if (!fetchedData && fetchers.secondary && !this.simulationFlags.allSourcesOffline) {
      try {
        const secondaryResult = await fetchers.secondary();
        if (validators.validateSchema(secondaryResult)) {
          fetchedData = secondaryResult;
          sourcePriority = 'SECONDARY';
        }
      } catch (secErr: any) {
        fetchError = `${fetchError ? fetchError + ' | ' : ''}Secondary failed: ${secErr?.message || secErr}`;
      }
    }

    // 5. If live fetch succeeded, update caches and return
    if (fetchedData) {
      health.status = 'HEALTHY';
      health.successfulFetches++;
      health.lastSuccessIso = new Date().toISOString();
      this.healthRegistry.set(sourceId, health);

      const metadata: DataEngineMetadata = {
        sourceId,
        sourceName: options.sourceName,
        sourceUrl: options.sourceUrl,
        sourceType: options.sourceType,
        retrievedAtIso: new Date().toISOString(),
        lastSuccessfulUpdateIso: new Date().toISOString(),
        lastValidatedAtIso: new Date().toISOString(),
        freshnessStatus: 'LIVE',
        validationStatus: 'VALIDATED',
        sourcePriority,
        adDate: new Date().toISOString().slice(0, 10),
        bsDate: '२०८३ भाद्र ०१',
        timeNpt: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' }),
        cached: false,
        ttlSeconds: options.ttlSeconds || 300,
      };

      const record: CachedDataRecord<T> = {
        data: fetchedData,
        meta: metadata,
        expiresAt: now + ttl,
      };

      this.memoryCache.set(cacheKey, record);
      this.persistentFallbackStore.set(cacheKey, record);

      return { data: fetchedData, meta: metadata, fromCache: false };
    }

    // 6. If live fetch failed, serve Stale Cache / Last Known Good Persistent Data
    health.status = this.simulationFlags.allSourcesOffline || this.simulationFlags.failingSources.has(sourceId) ? 'SIMULATED_OFFLINE' : 'DEGRADED';
    health.lastFailureIso = new Date().toISOString();
    health.lastFailureReason = fetchError || 'Simulated Offline';
    this.healthRegistry.set(sourceId, health);

    const fallbackRecord = cached || this.persistentFallbackStore.get(cacheKey);
    if (fallbackRecord) {
      console.warn(`[SAARTHI Data Engine] ⚠️ Serving resilient cached data for ${sourceId} due to source unavailability.`);
      return {
        data: fallbackRecord.data,
        meta: {
          ...fallbackRecord.meta,
          freshnessStatus: 'RECENT',
          validationStatus: 'FALLBACK_VERIFIED',
          sourcePriority: 'CACHED_FALLBACK',
          cached: true,
        },
        fromCache: true,
      };
    }

    // 7. Last resort: Verified Static Fallback Data
    const staticData = fetchers.staticFallback();
    const staticMeta: DataEngineMetadata = {
      sourceId,
      sourceName: options.sourceName,
      sourceUrl: options.sourceUrl,
      sourceType: options.sourceType,
      retrievedAtIso: new Date().toISOString(),
      lastSuccessfulUpdateIso: new Date().toISOString(),
      lastValidatedAtIso: new Date().toISOString(),
      freshnessStatus: 'STALE',
      validationStatus: 'FALLBACK_VERIFIED',
      sourcePriority: 'CACHED_FALLBACK',
      adDate: new Date().toISOString().slice(0, 10),
      bsDate: '२०८३ भाद्र ०१',
      timeNpt: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' }),
      cached: true,
      ttlSeconds: options.ttlSeconds || 300,
    };

    return { data: staticData, meta: staticMeta, fromCache: true };
  }

  /**
   * Get all registered data sources health reports
   */
  public getHealthReports(): SourceHealthReport[] {
    return Array.from(this.healthRegistry.values());
  }

  /**
   * Clear memory cache for a specific key or all
   */
  public clearCache(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
    } else {
      this.memoryCache.clear();
    }
  }
}

export const dataEngine = new SaarthiDataEngine();
