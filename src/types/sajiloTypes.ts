// Types for Sajilo Daily Essentials (Sajilo Engine & Tray Mode)

export type SajiloTab =
  | 'today'
  | 'bazar'
  | 'calendar'
  | 'saait'
  | 'kundali'
  | 'gotra'
  | 'stotra'
  | 'keeper'
  | 'news'
  | 'radio'
  | 'tools'
  | 'rashifal'
  | 'weather'
  | 'links';

export interface UsefulLinkItem {
  id: string;
  title: string;
  titleNp?: string;
  url: string;
  category: 'featured' | 'fmhy' | 'nepali_tools' | 'civic_gov' | 'dev_tech' | 'media_learning' | 'custom';
  descriptionEn: string;
  descriptionNp: string;
  tags: string[];
  isFeatured?: boolean;
  authorOrSource?: string;
  badge?: string;
  subLinks?: { label: string; url: string }[];
}

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

// ----------------------------------------------------
// New Sajilo Modules: Astrology, Gotra, Saait, Stotra & Remittance
// ----------------------------------------------------

export interface GotraRecord {
  id: string;
  tharNp: string;
  tharEn: string;
  gotraNp: string;
  gotraEn: string;
  pravaraNp: string;
  pravaraEn: string;
  rishiNp: string;
  kuldevataNp: string;
  kuldevataEn: string;
  originNp: string;
  community: 'brahmin' | 'chhetri' | 'newar' | 'janajati' | 'dalit' | 'madhesi' | 'all';
  subClansNp?: string[];
}

export interface SaaitRecord {
  id: string;
  category: 'vivaha' | 'bratabandha' | 'pasni' | 'grihapravesh' | 'rudri' | 'all';
  titleNp: string;
  titleEn: string;
  bsDate: string;
  adDate: string;
  bsMonth: string;
  tithiNp: string;
  nakshatraNp: string;
  auspiciousTimeNp: string;
  notesNp?: string;
  isRecommended: boolean;
}

export interface StotraItem {
  id: string;
  titleNp: string;
  titleEn: string;
  deityNp: string;
  authorNp?: string;
  descriptionNp: string;
  verses: {
    number: number;
    sanskritText: string;
    nepaliMeaning: string;
  }[];
  totalChants?: number;
}

export interface PujaVidhiItem {
  id: string;
  titleNp: string;
  titleEn: string;
  occasionNp: string;
  materialsNeededNp: string[];
  steps: {
    stepNumber: number;
    stepTitleNp: string;
    instructionsNp: string;
    mantraNp?: string;
  }[];
}

export interface RemittanceRate {
  id: string;
  corridor: string; // e.g. 'USD', 'QAR', 'AED', 'AUD', 'SAR', 'JPY', 'KRW', 'GBP', 'MYR'
  currencyName: string;
  currencySymbol: string;
  flagEmoji: string;
  officialNrbBuy: number;
  officialNrbSell: number;
  providers: {
    name: string;
    nameNp: string;
    rate: number;
    feeNpr: number;
    deliverySpeed: string;
    deliverySpeedNp: string;
    isBestRate?: boolean;
    channel: 'Bank Transfer' | 'Cash Pickup' | 'Wallet (eSewa/Khalti)';
  }[];
  lastUpdated: string;
}

export interface MicroPanchangData {
  city: string;
  cityNp: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithiEndsAt: string;
  nakshatra: string;
  nakshatraEndsAt: string;
  yoga: string;
  karana: string;
  chandraRashi: string;
  suryaRashi: string;
  rahuKaal: string;
  yamaGhanta: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  amritKaal: string;
  brahmaMuhurat: string;
  ayan: string;
  ritu: string;
}
