export * from './admin';
export * from './liveData';

export type ModuleCategory =
  | 'finance'
  | 'government'
  | 'documents'
  | 'employment'
  | 'banking'
  | 'utilities'
  | 'community';

export interface ModuleItem {
  id: string;
  number: number;
  title: string;
  titleNp: string;
  category: ModuleCategory;
  description: string;
  descriptionNp: string;
  iconName: string;
  badge?: string;
}

export interface StockQuote {
  symbol: string;
  companyName: string;
  ltp: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
  volume: number;
  sector: string;
}

export interface IPOItem {
  id: string;
  companyName: string;
  type: 'IPO' | 'Right Share' | 'FPO' | 'Debenture';
  units: string;
  pricePerShare: number;
  openDate: string;
  closeDate: string;
  status: 'Open' | 'Upcoming' | 'Closed' | 'Allotment Out';
  minUnits: number;
  issueManager: string;
  rating: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  pChange: number;
}

export interface ForexRate {
  code: string;
  name: string;
  nameNp?: string;
  country?: string;
  countryNp?: string;
  region?: string;
  unit: number;
  buy: number;
  sell: number;
  midRate?: number;
  flag: string;
  symbol?: string;
  isNrbOfficial?: boolean;
  rateCategory?: string;
  aliases?: string[];
  initials?: string[];
}

export interface GoldSilverRate {
  item: string;
  itemNp: string;
  perTola: number;
  perTenGram: number;
  change: number;
}

export interface FuelPrice {
  item: string;
  itemNp: string;
  priceNpr: number;
  unit: string;
  change: number;
}

export interface RemittanceRate {
  provider: string;
  sendAmountUSD: number;
  payoutNPR: number;
  ratePerUSD: number;
  transferFeeUSD: number;
  speed: string;
}

export interface GovService {
  id: string;
  title: string;
  titleNp: string;
  department: string;
  departmentNp: string;
  fee: string;
  processingDays: string;
  reqDocuments: string[];
  steps: string[];
  portalUrl: string;
  category: string;
}

export interface GovForm {
  id: string;
  title: string;
  titleNp: string;
  department: string;
  category: string;
  format: 'PDF' | 'Fillable Online' | 'DOCX';
  downloadUrl: string;
  instructions: string[];
}

export interface LawSummary {
  id: string;
  title: string;
  titleNp: string;
  category: string;
  summary: string;
  summaryNp: string;
  keyArticles: { article: string; text: string }[];
}

export interface VaultDocument {
  id: string;
  title: string;
  documentType: 'Citizenship' | 'Passport' | 'Driving License' | 'Bluebook' | 'PAN Card' | 'Academic' | 'Other';
  docNumber: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  notes?: string;
  fileDataUrl?: string;
  createdAt: string;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  trigger: 'auto' | 'manual';
  details: string;
  itemsSynced?: number;
}

export interface GitHubSyncConfig {
  isConnected: boolean;
  username: string;
  repository: string;
  token?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  status?: 'idle' | 'syncing' | 'success' | 'error';
  syncLogs?: SyncLogEntry[];
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone?: string;
  nagarikId?: string;
  citizenshipNo?: string;
  avatarUrl?: string;
  memberSince?: string;
  githubSync?: GitHubSyncConfig;
}

export interface JobListing {
  id: string;
  title: string;
  organization: string;
  category: 'Lok Sewa Aayog' | 'Banking' | 'IT & Tech' | 'NGO/INGO' | 'Private Sector';
  location: string;
  vacancies: number;
  deadline: string;
  qualification: string;
  applyUrl: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  nameNp: string;
  category: 'Emergency' | 'Hospital' | 'Police' | 'Fire' | 'Helpline';
  number: string;
  location: string;
  description: string;
}

export interface BankInfo {
  id: string;
  name: string;
  classType: 'Class A Commercial' | 'Class B Development' | 'Class C Finance';
  swiftCode: string;
  headOffice: string;
  phone: string;
  savingsInterestRate: string;
  fdInterestRate: string;
  branchesCount: number;
}

export interface EmbassyItem {
  country: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  emergencyLine: string;
}

export interface CalendarDay {
  bsDate: string;
  bsDay: number;
  bsMonth: string;
  bsYear: number;
  adDate: string;
  dayOfWeek: string;
  tithi: string;
  tithiNp: string;
  festival?: string;
  festivalNp?: string;
  isHoliday: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleNp: string;
  source: string;
  category: 'National' | 'Finance' | 'Sports' | 'Technology' | 'Society';
  publishedAt: string;
  summary: string;
  summaryNp: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
  searchQueries?: string[];
}
