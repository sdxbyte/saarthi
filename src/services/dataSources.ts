// Centralized Source Registry & Hierarchy for SAARTHI
// Rule 2 & Rule 3: Source-First Architecture & Trusted-Source Hierarchy

export type SourceTier = 'TIER_1_PRIMARY_OFFICIAL' | 'TIER_2_REPUTABLE_SECONDARY' | 'TIER_3_DISCOVERY_ONLY';

export interface DataSourceRegistryItem {
  id: string;
  name: string;
  shortName: string;
  tier: SourceTier;
  category: 'forex' | 'nepse' | 'ipo' | 'gold_silver' | 'banking' | 'fuel' | 'weather' | 'earthquake' | 'holidays' | 'news' | 'government';
  officialUrl: string;
  apiEndpoint?: string;
  freshnessWindowMs: number; // Maximum age before marked STALE
  description: string;
  reliabilityScore: number; // 0 - 100
  isVerified: boolean;
}

export const OFFICIAL_DATA_SOURCES: Record<string, DataSourceRegistryItem> = {
  nrb: {
    id: 'nrb',
    name: 'Nepal Rastra Bank (Central Bank of Nepal)',
    shortName: 'NRB',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'forex',
    officialUrl: 'https://www.nrb.org.np/forex/',
    apiEndpoint: 'https://www.nrb.org.np/api/forex/v1/rates',
    freshnessWindowMs: 86400000, // 24 hours
    description: 'Official monetary authority publishing daily reference exchange rates and banking indicators.',
    reliabilityScore: 100,
    isVerified: true,
  },
  nepse: {
    id: 'nepse',
    name: 'Nepal Stock Exchange Limited',
    shortName: 'NEPSE',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'nepse',
    officialUrl: 'https://www.nepalstock.com.np',
    apiEndpoint: '/api/live/nepse',
    freshnessWindowMs: 120000, // 2 minutes during trading hours
    description: 'Sole official stock exchange of Nepal for market indices, stock quotes, and trading status.',
    reliabilityScore: 100,
    isVerified: true,
  },
  cdsc: {
    id: 'cdsc',
    name: 'CDS and Clearing Limited (CDSC / MeroShare)',
    shortName: 'CDSC',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'ipo',
    officialUrl: 'https://cdsc.com.np',
    apiEndpoint: 'https://iporesult.cdsc.com.np',
    freshnessWindowMs: 3600000, // 1 hour
    description: 'Central depository issuing C-ASBA allotment results, MeroShare portal access, and demat services.',
    reliabilityScore: 100,
    isVerified: true,
  },
  sebon: {
    id: 'sebon',
    name: 'Securities Board of Nepal',
    shortName: 'SEBON',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'ipo',
    officialUrl: 'https://sebon.gov.np',
    freshnessWindowMs: 86400000, // 24 hours
    description: 'Capital market regulator issuing official IPO prospectus approvals and public issue permits.',
    reliabilityScore: 100,
    isVerified: true,
  },
  fenegosida: {
    id: 'fenegosida',
    name: 'Federation of Nepal Gold and Silver Dealers Association',
    shortName: 'FENEGOSIDA / NEGOSIDA',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'gold_silver',
    officialUrl: 'https://www.fenegosida.org',
    apiEndpoint: '/api/live/metals',
    freshnessWindowMs: 43200000, // 12 hours
    description: 'Sole authoritative national organization publishing official daily bullion trading rates in Nepal.',
    reliabilityScore: 100,
    isVerified: true,
  },
  noc: {
    id: 'noc',
    name: 'Nepal Oil Corporation Limited',
    shortName: 'NOC',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'fuel',
    officialUrl: 'http://noc.org.np',
    apiEndpoint: '/api/live/fuel',
    freshnessWindowMs: 86400000, // 24 hours
    description: 'State petroleum enterprise publishing official retail prices for Petrol, Diesel, Kerosene, and LPG.',
    reliabilityScore: 100,
    isVerified: true,
  },
  openmeteo: {
    id: 'openmeteo',
    name: 'Open-Meteo Global Meteorological Forecast',
    shortName: 'Open-Meteo',
    tier: 'TIER_2_REPUTABLE_SECONDARY',
    category: 'weather',
    officialUrl: 'https://open-meteo.com',
    apiEndpoint: 'https://api.open-meteo.com/v1/forecast',
    freshnessWindowMs: 1800000, // 30 minutes
    description: 'Open-access weather forecast engine providing temperature, humidity, wind, and air quality.',
    reliabilityScore: 95,
    isVerified: true,
  },
  usgs: {
    id: 'usgs',
    name: 'USGS Earthquake Hazards Live Monitoring System',
    shortName: 'USGS',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'earthquake',
    officialUrl: 'https://earthquake.usgs.gov',
    apiEndpoint: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
    freshnessWindowMs: 300000, // 5 minutes
    description: 'Global seismic network monitoring real-time earthquake occurrences and epicenter data in Nepal.',
    reliabilityScore: 99,
    isVerified: true,
  },
  kalimati: {
    id: 'kalimati',
    name: 'Kalimati Fruits & Vegetable Market Development Board',
    shortName: 'KFVMDB',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'government',
    officialUrl: 'https://kalimatimarket.gov.np',
    apiEndpoint: '/api/live/kalimati',
    freshnessWindowMs: 43200000, // 12 hours
    description: 'Government commodity market board publishing wholesale daily agricultural tariffs in Kathmandu.',
    reliabilityScore: 100,
    isVerified: true,
  },
};

export function getSourceInfo(sourceId: string): DataSourceRegistryItem {
  return OFFICIAL_DATA_SOURCES[sourceId] || {
    id: sourceId,
    name: 'Verified Source',
    shortName: 'Official Source',
    tier: 'TIER_1_PRIMARY_OFFICIAL',
    category: 'government',
    officialUrl: 'https://saarthi.gov.np',
    freshnessWindowMs: 3600000,
    description: 'Verified public data provider.',
    reliabilityScore: 90,
    isVerified: true,
  };
}
