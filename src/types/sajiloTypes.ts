// Types for Sajilo Daily Essentials (Sajilo Engine & Tray Mode)

export type SajiloTab =
  | 'today'
  | 'bazar'
  | 'calendar'
  | 'keeper'
  | 'news'
  | 'radio'
  | 'tools'
  | 'rashifal'
  | 'weather';

export type KeeperCategory =
  | 'passport'
  | 'bluebook'
  | 'license'
  | 'citizenship'
  | 'voter_id'
  | 'insurance'
  | 'bill'
  | 'custom';

export type KeeperStatus = 'safe' | 'expiring_soon' | 'urgent' | 'expired';

export interface KeeperItem {
  id: string;
  title: string;
  category: KeeperCategory;
  documentNumber?: string;
  expiryDateAd: string; // YYYY-MM-DD
  expiryDateBs?: string;
  remindDaysBefore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface KalimatiProduceItem {
  id: string;
  commodity: string;
  commodityNp: string;
  category: 'vegetables' | 'fruits' | 'spices' | 'fish' | 'other';
  unit: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RadioStation {
  id: string;
  name: string;
  nameNp: string;
  frequency: string;
  location: string;
  locationNp: string;
  streamUrl: string;
  fallbackStreamUrl?: string;
  category: string;
  categoryNp: string;
  bitrate: string;
  isLive: boolean;
}

export interface LandAreaInput {
  // Hill system
  ropani: number;
  aana: number;
  paisa: number;
  daam: number;
  // Terai system
  bigha: number;
  kattha: number;
  dhur: number;
  kanwa: number;
  // Metric
  sqFeet: number;
  sqMeters: number;
}

export interface EmergencyContact {
  id: string;
  titleEn: string;
  titleNp: string;
  number: string;
  descriptionEn: string;
  descriptionNp: string;
  category: 'police' | 'medical' | 'fire' | 'social' | 'utility' | 'helpline';
  tollFree?: boolean;
}
