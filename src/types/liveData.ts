export type ApiCategory = 'finance' | 'nepse' | 'government' | 'public_info' | 'news';

export type ApiStatus = 'online' | 'offline' | 'degraded' | 'disabled';

export interface LiveApiConfig {
  id: string;
  name: string;
  category: ApiCategory;
  endpointUrl: string;
  dataSource: string;
  refreshIntervalMs: number; // e.g. 300000 = 5 minutes
  enabled: boolean;
  timeoutMs: number;
  status: ApiStatus;
  lastResponseTimeMs: number;
  successCount: number;
  failureCount: number;
  consecutiveFailures: number;
  lastSuccessAd: string;
  lastSuccessBs: string;
  lastUpdatedTimestamp: string;
  lastError: string | null;
  isCustom?: boolean;
}

export interface LiveApiLog {
  id: string;
  apiId: string;
  apiName: string;
  timestampIso: string;
  adDate: string;
  bsDate: string;
  time: string;
  status: 'success' | 'failure' | 'timeout';
  statusCode: number;
  responseTimeMs: number;
  message: string;
  payloadSizeKb: number;
}

export interface LiveApiDataPayload<T = any> {
  apiId: string;
  dataSource: string;
  isLive: boolean;
  isCached: boolean;
  lastUpdatedAd: string;
  lastUpdatedBs: string;
  timeStr: string;
  timestampIso: string;
  data: T;
  error: string | null;
}

// Data models for specific live feeds
export interface CryptoRate {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  priceNpr: number;
  change24h: number;
}

export interface KalimatiItem {
  id: string;
  commodity: string;
  commodityNp: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface WeatherInfo {
  city: string;
  cityNp: string;
  temperature: number;
  weatherCode: number;
  condition: string;
  conditionNp: string;
  humidity: number;
  windSpeed: number;
  aqiUs: number;
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  updatedAtAd: string;
  updatedAtBs: string;
}

export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  location: string;
  depthKm: number;
  timeIso: string;
  adDate: string;
  bsDate: string;
  distanceFromKathmanduKm: number;
}

export interface PublicHoliday {
  id: string;
  dateIso: string;
  adDateStr: string;
  bsDateStr: string;
  localName: string;
  englishName: string;
  isNational: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Nepal' | 'Economy' | 'Government' | 'Technology' | 'Health' | 'Sports' | 'International';
  source: string;
  publishedAtAd: string;
  publishedAtBs: string;
  link?: string;
}

export interface EmergencyContact {
  id: string;
  category: 'Police' | 'Fire' | 'Ambulance' | 'Hospital' | 'Blood Bank' | 'Pharmacy' | 'Disaster Management';
  name: string;
  nameNp: string;
  location: string;
  phone: string;
  altPhone?: string;
  availableHours: string;
  isVerified: boolean;
}
