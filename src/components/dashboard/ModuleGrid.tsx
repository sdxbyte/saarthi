import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Search,
  LayoutGrid,
  TrendingUp,
  Coins,
  Calculator,
  Lock,
  Car,
  Building,
  Briefcase,
  BookOpen,
  CalendarDays,
  Compass,
  Newspaper,
  UserCheck,
  Globe,
  Sparkles,
  Film,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ModuleItem, ModuleCategory } from '../../types';
import { ALL_45_MODULES } from '../../data/modulesList';

export interface BentoSpanConfig {
  span: '2x2' | '2x1' | '1x1';
  colSpan: string;
  rowSpan?: string;
  accentGlow: string;
  badgeText: string;
  borderHover: string;
  highlightText?: string;
  metricPreview?: {
    label: string;
    value: string;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
  };
  features?: string[];
  isHero?: boolean;
}

export const BENTO_GRID_CONFIG: Record<string, BentoSpanConfig> = {
  'nepse-market': {
    span: '2x2',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-2',
    accentGlow: 'from-emerald-500/20 via-emerald-950/10 to-transparent',
    badgeText: 'BENTO 2x2',
    borderHover: 'hover:border-emerald-500/60',
    highlightText: 'PRIMARY CAPITAL SUITE',
    metricPreview: {
      label: 'NEPSE Index Live',
      value: '2,748.15',
      subtext: '+1.42% • Turnover NPR 6.82B • SEBON Verified',
      trend: 'up',
    },
    features: ['Live Stock Tickers', 'Meroshare IPO Filings', 'Portfolio WACC Calc', 'Audited Statements'],
    isHero: true,
  },
  'nepse': {
    span: '2x2',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-2',
    accentGlow: 'from-emerald-500/20 via-emerald-950/10 to-transparent',
    badgeText: 'BENTO 2x2',
    borderHover: 'hover:border-emerald-500/60',
    highlightText: 'PRIMARY CAPITAL SUITE',
    metricPreview: {
      label: 'NEPSE Index Live',
      value: '2,748.15',
      subtext: '+1.42% • Turnover NPR 6.82B • SEBON Verified',
      trend: 'up',
    },
    features: ['Live Stock Tickers', 'Meroshare IPO Filings', 'Portfolio WACC Calc', 'Audited Statements'],
    isHero: true,
  },
  'forex-converter': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-cyan-500/20 via-cyan-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-cyan-500/60',
    highlightText: 'OFFICIAL NRB FEEDS',
    metricPreview: {
      label: 'NRB Forex Reference',
      value: 'USD = NPR 134.85',
      subtext: 'Gold NPR 1,68,500/tola • NOC Fuel Rates',
      trend: 'neutral',
    },
    features: ['NRB Daily Fixing', 'FENEGOSIDA Bullion', 'NOC Fuel Slabs', 'Bank SWIFT Codes'],
  },
  'tax-calculator': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-amber-500/20 via-amber-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-amber-500/60',
    highlightText: 'IRD TAX ENGINE',
    metricPreview: {
      label: 'Income Tax FY 2083/84',
      value: '1% to 39%',
      subtext: 'Individual & Married Slab Optimization',
      trend: 'neutral',
    },
    features: ['FY 2083/84 Brackets', 'SSF / CIT Deductions', 'PDF Tax Ledger', 'Dual Language'],
  },
  'secure-vault': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-purple-500/20 via-purple-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-purple-500/60',
    highlightText: 'CITIZEN VAULT AES-256',
    metricPreview: {
      label: 'Local Encrypted Vault',
      value: 'AES-256 GCM',
      subtext: 'Citizenship, Passport, NID & Driving License',
      trend: 'neutral',
    },
    features: ['Biometric QR Check', 'Nagrik App Sync', 'Encrypted Offline Store', 'Zero Knowledge'],
  },
  'bluebook-tax': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-blue-500/20 via-blue-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-blue-500/60',
    highlightText: 'DOTM TRANSIT HUB',
    metricPreview: {
      label: 'DOTM Vehicle Rates',
      value: 'Bagmati & All 7 Prov.',
      subtext: 'Motorbike, Car, EV & Commercial Slabs',
      trend: 'neutral',
    },
    features: ['70-Mark Trial Rules', 'Written Exam 500 Qs', 'Smart Card Print Status', 'Provincial Tax Calc'],
  },
  'lok-sewa-alerts': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-rose-500/20 via-rose-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-rose-500/60',
    highlightText: 'CIVIC CAREERS & PSC',
    metricPreview: {
      label: 'PSC Gazetted Openings',
      value: '420+ Section Officers',
      subtext: 'Annual Routine 2083 & Syllabus PDF',
      trend: 'up',
    },
    features: ['Lok Sewa Gazetted / Non-Gazetted', 'Banking Careers', 'DOFE Labor Permit Verifier', 'Curriculum Portal'],
  },
  'public-calendar': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-red-500/20 via-red-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-red-500/60',
    highlightText: 'NEPALI PANCHANGA',
    metricPreview: {
      label: 'Bikram Sambat Calendar',
      value: '2083 BS Official',
      subtext: 'Tithi, Festivals, Govt Holidays & Rashifal',
      trend: 'neutral',
    },
    features: ['AD ↔ BS Converter', 'Panchanga & Tithi', 'Public Holiday Notifications', 'Zodiac Horoscope'],
  },
  'sajilo-essentials': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-orange-500/20 via-orange-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-orange-500/60',
    highlightText: 'SAJILO DAILY SUITE',
    metricPreview: {
      label: 'Sajilo Daily Suite',
      value: 'Kalimati + FM Radio',
      subtext: 'Vegetable Wholesale Rates, Local News & Sticky Notes',
      trend: 'neutral',
    },
    features: ['Kalimati Mandi Rates', 'Live Online FM Stations', 'Personal Note Keeper', 'Quick Area Converter'],
  },
  'sajilo': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-orange-500/20 via-orange-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-orange-500/60',
    highlightText: 'SAJILO DAILY SUITE',
    metricPreview: {
      label: 'Sajilo Daily Suite',
      value: 'Kalimati + FM Radio',
      subtext: 'Vegetable Wholesale Rates, Local News & Sticky Notes',
      trend: 'neutral',
    },
    features: ['Kalimati Mandi Rates', 'Live Online FM Stations', 'Personal Note Keeper', 'Quick Area Converter'],
  },
  'allsitehub': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-teal-500/20 via-teal-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-teal-500/60',
    highlightText: 'MEDIA STREAMING INDEX',
    metricPreview: {
      label: 'AllSiteHub Media',
      value: '97+ Platforms',
      subtext: 'Cinema, Anime, Sports, Manga & TV Streams',
      trend: 'up',
    },
    features: ['Zero Pop-up Directory', 'Adblock Recommendations', 'Searchable Categories', 'Direct Access'],
  },
  'sitehub': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-teal-500/20 via-teal-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-teal-500/60',
    highlightText: 'MEDIA STREAMING INDEX',
    metricPreview: {
      label: 'AllSiteHub Media',
      value: '97+ Platforms',
      subtext: 'Cinema, Anime, Sports, Manga & TV Streams',
      trend: 'up',
    },
    features: ['Zero Pop-up Directory', 'Adblock Recommendations', 'Searchable Categories', 'Direct Access'],
  },
  'useful-links': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-sky-500/20 via-sky-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-sky-500/60',
    highlightText: 'FMHY & WEB INDEX',
    metricPreview: {
      label: 'Useful Links & FMHY',
      value: '10,000+ Curated Links',
      subtext: 'Open Source Tools, Media, Adblock & Privacy',
      trend: 'neutral',
    },
    features: ['FMHY.net Mirror', 'Developer Hub', 'Ad-Free Guides', 'Community Curated'],
  },
  'public-apis-hub': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-cyan-500/20 via-cyan-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-cyan-500/60',
    highlightText: 'DEVELOPER WORKBENCH',
    metricPreview: {
      label: 'Public APIs Hub',
      value: '18+ REST Endpoints',
      subtext: 'Interactive CORS Sandbox & Open Catalog',
      trend: 'up',
    },
    features: ['Live JSON Endpoints', 'Interactive Sandbox', 'Dual Timestamps AD/BS', 'Official Feeds'],
  },
  'gov-service-directory': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-red-500/20 via-red-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-red-500/60',
    highlightText: 'CIVIC CENTRAL PORTALS',
    metricPreview: {
      label: 'Gov Services & Funds',
      value: '45+ Portals',
      subtext: 'Nagarik App, SSF, EPF, CIT & Ministries',
      trend: 'neutral',
    },
    features: ['Nagarik App Integration', 'Social Security Fund (SSF)', 'Citizen Investment Trust', 'Official Forms'],
  },
  'nepal-laws-constitution': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-amber-600/20 via-amber-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-amber-500/60',
    highlightText: 'CONSTITUTION & STATUTES',
    metricPreview: {
      label: 'Constitution 2072 & Court Hub',
      value: '308 Articles Plain Text',
      subtext: 'Supreme Court Verdicts, Labor Act & Legal Aid',
      trend: 'neutral',
    },
    features: ['Constitution 2072', 'Legal Aid Directory', 'Labor Act Clauses', 'Parliamentary Bills'],
  },
  'nepal-news-digest': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-rose-500/20 via-rose-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-rose-500/60',
    highlightText: 'VERIFIED CITIZEN DIGEST',
    metricPreview: {
      label: 'Nepal News & Rajpatra',
      value: 'Official Press & Gazette',
      subtext: 'Zero AI Fabrications, Verified Source Attribution',
      trend: 'up',
    },
    features: ['Nepal Rajpatra', 'NRB Circulars', 'NEPSE Announcements', 'Direct Source Links'],
  },
  'support-contact': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-emerald-500/20 via-emerald-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-emerald-500/60',
    highlightText: 'CITIZEN SUPPORT & DESK',
    metricPreview: {
      label: 'Helpdesk & Transparency',
      value: 'Dual AD/BS Audited',
      subtext: '24/7 Citizen Queries & Project Roadmap Tracker',
      trend: 'neutral',
    },
    features: ['Support Ticketing', 'Dual Date AD/BS', 'Platform Roadmap', 'Donation System'],
  },
  'public-utilities': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-sky-500/20 via-sky-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-sky-500/60',
    highlightText: 'CIVIC UTILITIES & AQI',
    metricPreview: {
      label: 'Real-time AQI & Utilities',
      value: 'NEA Electricity & KUKL',
      subtext: 'Live Kathmandu AQI, Tariff Calculator & Bill Portals',
      trend: 'neutral',
    },
    features: ['Air Quality Index (AQI)', 'NEA Bill Calculator', 'Emergency Helplines', 'Disaster Alerts'],
  },
  // Aliases for seamless routing
  'forex': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-cyan-500/20 via-cyan-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-cyan-500/60',
    highlightText: 'OFFICIAL NRB FEEDS',
    metricPreview: {
      label: 'NRB Forex Reference',
      value: 'USD = NPR 134.85',
      subtext: 'Gold NPR 1,68,500/tola • NOC Fuel Rates',
      trend: 'neutral',
    },
    features: ['NRB Daily Fixing', 'FENEGOSIDA Bullion', 'NOC Fuel Slabs', 'Bank SWIFT Codes'],
  },
  'tax': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-amber-500/20 via-amber-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-amber-500/60',
    highlightText: 'IRD TAX ENGINE',
    metricPreview: {
      label: 'Income Tax FY 2083/84',
      value: '1% to 39%',
      subtext: 'Individual & Married Slab Optimization',
      trend: 'neutral',
    },
    features: ['FY 2083/84 Brackets', 'SSF / CIT Deductions', 'PDF Tax Ledger', 'Dual Language'],
  },
  'vault': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-purple-500/20 via-purple-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-purple-500/60',
    highlightText: 'CITIZEN VAULT AES-256',
    metricPreview: {
      label: 'Local Encrypted Vault',
      value: 'AES-256 GCM',
      subtext: 'Citizenship, Passport, NID & Driving License',
      trend: 'neutral',
    },
    features: ['Biometric QR Check', 'Nagrik App Sync', 'Encrypted Offline Store', 'Zero Knowledge'],
  },
  'bluebook': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-blue-500/20 via-blue-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-blue-500/60',
    highlightText: 'DOTM TRANSIT HUB',
    metricPreview: {
      label: 'DOTM Vehicle Rates',
      value: 'Bagmati & All 7 Prov.',
      subtext: 'Motorbike, Car, EV & Commercial Slabs',
      trend: 'neutral',
    },
    features: ['70-Mark Trial Rules', 'Written Exam 500 Qs', 'Smart Card Print Status', 'Provincial Tax Calc'],
  },
  'loksewa': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-rose-500/20 via-rose-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-rose-500/60',
    highlightText: 'CIVIC CAREERS & PSC',
    metricPreview: {
      label: 'PSC Gazetted Openings',
      value: '420+ Section Officers',
      subtext: 'Annual Routine 2083 & Syllabus PDF',
      trend: 'up',
    },
    features: ['Lok Sewa Gazetted / Non-Gazetted', 'Banking Careers', 'DOFE Labor Permit Verifier', 'Curriculum Portal'],
  },
  'calendar': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-red-500/20 via-red-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-red-500/60',
    highlightText: 'NEPALI PANCHANGA',
    metricPreview: {
      label: 'Bikram Sambat Calendar',
      value: '2083 BS Official',
      subtext: 'Tithi, Festivals, Govt Holidays & Rashifal',
      trend: 'neutral',
    },
    features: ['AD ↔ BS Converter', 'Panchanga & Tithi', 'Public Holiday Notifications', 'Zodiac Horoscope'],
  },
  'news': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-rose-500/20 via-rose-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-rose-500/60',
    highlightText: 'VERIFIED CITIZEN DIGEST',
    metricPreview: {
      label: 'Nepal News & Rajpatra',
      value: 'Official Press & Gazette',
      subtext: 'Zero AI Fabrications, Verified Source Attribution',
      trend: 'up',
    },
    features: ['Nepal Rajpatra', 'NRB Circulars', 'NEPSE Announcements', 'Direct Source Links'],
  },
  'support': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-emerald-500/20 via-emerald-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-emerald-500/60',
    highlightText: 'CITIZEN SUPPORT & DESK',
    metricPreview: {
      label: 'Helpdesk & Transparency',
      value: 'Dual AD/BS Audited',
      subtext: '24/7 Citizen Queries & Project Roadmap Tracker',
      trend: 'neutral',
    },
    features: ['Support Ticketing', 'Dual Date AD/BS', 'Platform Roadmap', 'Donation System'],
  },
  'links': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-sky-500/20 via-sky-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-sky-500/60',
    highlightText: 'FMHY & WEB INDEX',
    metricPreview: {
      label: 'Useful Links & FMHY',
      value: '10,000+ Curated Links',
      subtext: 'Open Source Tools, Media, Adblock & Privacy',
      trend: 'neutral',
    },
    features: ['FMHY.net Mirror', 'Developer Hub', 'Ad-Free Guides', 'Community Curated'],
  },
  'apis': {
    span: '2x1',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1',
    accentGlow: 'from-cyan-500/20 via-cyan-950/10 to-transparent',
    badgeText: 'BENTO 2x1',
    borderHover: 'hover:border-cyan-500/60',
    highlightText: 'DEVELOPER WORKBENCH',
    metricPreview: {
      label: 'Public APIs Hub',
      value: '18+ REST Endpoints',
      subtext: 'Interactive CORS Sandbox & Open Catalog',
      trend: 'up',
    },
    features: ['Live JSON Endpoints', 'Interactive Sandbox', 'Dual Timestamps AD/BS', 'Official Feeds'],
  },
};

const DEFAULT_BENTO_CONFIG: BentoSpanConfig = {
  span: '1x1',
  colSpan: 'col-span-1',
  rowSpan: 'row-span-1',
  accentGlow: 'from-slate-700/10 via-slate-900/5 to-transparent',
  badgeText: '1x1 CARD',
  borderHover: 'hover:border-slate-600',
};

interface ModuleGridProps {
  currentLang: 'en' | 'ne';
  onSelectModule: (moduleId: string) => void;
  theme?: 'dark' | 'light';
}

function renderModuleIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Lock':
      return <Lock className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'CalendarDays':
    case 'Calendar':
      return <CalendarDays className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Newspaper':
      return <Newspaper className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Film':
      return <Film className={className} />;
    default:
      return <Layers className={className} />;
  }
}

export const ModuleGrid: React.FC<ModuleGridProps> = React.memo(({ currentLang, onSelectModule, theme = 'dark' }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const categories = useMemo<{ labelEn: string; labelNp: string; value: ModuleCategory | 'All' }[]>(() => [
    { labelEn: 'All Services', labelNp: 'सबै सेवाहरू', value: 'All' },
    { labelEn: 'Finance & Capital', labelNp: 'वित्त तथा सेयर', value: 'finance' },
    { labelEn: 'Government & Civic', labelNp: 'सरकारी तथा कानुन', value: 'government' },
    { labelEn: 'Identity & Vault', labelNp: 'नागरिकता र कागजात', value: 'documents' },
    { labelEn: 'Employment & PSC', labelNp: 'रोजगार र लोक सेवा', value: 'employment' },
    { labelEn: 'Banking & Forex', labelNp: 'बैंक र विदेशी मुद्रा', value: 'banking' },
    { labelEn: 'Daily Utilities', labelNp: 'दैनिक सेवा र सजिलो', value: 'utilities' },
    { labelEn: 'Community & Media', labelNp: 'पात्रो र मिडिया', value: 'community' },
  ], []);

  const filteredModules = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return ALL_45_MODULES.filter((mod) => {
      const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        mod.title.toLowerCase().includes(query) ||
        mod.titleNp.includes(query) ||
        mod.description.toLowerCase().includes(query) ||
        mod.id.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pt-2">
      {/* =========================================================================
          BENTO HEADER CONSOLE WITH TELEMETRY STRIP
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                {currentLang === 'ne' ? 'सारथी एकीकृत बेन्टो कन्सोल' : 'Civic Service Bento Grid'}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ai2.design dense blocks
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {currentLang === 'ne'
                ? 'सरकारी सेवा, नेप्से सेयर बजार, कर, डिजिटल भल्ट र दैनिक औजारहरूको एकीकृत बेन्टो प्रणाली'
                : 'Adaptive 2x2, 2x1, and 1x1 structural bento blocks with real-time telemetry and instant shortcuts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
            {filteredModules.length} {currentLang === 'ne' ? 'मोड्युल उपलब्ध' : 'Modules Live'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & ZERO-PILL CATEGORY GLIDER
          ========================================================================= */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'सेवा वा औजार खोज्नुहोस् (उदा: नेप्से, कर, ब्लुबुक, लोक सेवा, सजिलो, राहदानी)...'
                : 'Search civic services or tools (e.g. NEPSE, Tax, Bluebook, Lok Sewa, Sajilo, Vault)...'
            }
            className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all ${
              isDark
                ? 'bg-[#14161b] border-[#262a31] text-white placeholder-slate-500 shadow-inner'
                : 'bg-[#f4f6fa] border-[#d3dbe6] text-slate-900 placeholder-slate-500 shadow-sm'
            }`}
          />
        </div>

        {/* Zero-Pill Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md scrollbar-none">
          {categories.map((cat, idx) => {
            const isCatActive = selectedCategory === cat.value;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.value)}
                className="relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {isCatActive && (
                  <motion.div
                    layoutId="moduleCatGlider"
                    className="absolute inset-0 bg-red-600/25 border border-red-500/50 rounded-lg shadow-xs"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    isCatActive ? 'text-red-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentLang === 'ne' ? cat.labelNp : cat.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          RESPONSIVE CSS GRID-BASED BENTO LAYOUT (grid-flow-dense)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto grid-flow-dense gap-4">
        {filteredModules.map((module) => {
          const config = BENTO_GRID_CONFIG[module.id] || DEFAULT_BENTO_CONFIG;
          const is2x2 = config.span === '2x2';
          const is2x1 = config.span === '2x1';

          return (
            <div
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`group relative rounded-2xl border transition-all duration-200 hover:-translate-y-1 active:scale-[0.99] cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg ${
                config.colSpan
              } ${config.rowSpan || ''} ${
                isDark
                  ? `bg-[#0B0F17]/95 border-slate-800 ${config.borderHover} hover:bg-[#10141f] text-white shadow-black/40`
                  : `bg-white border-slate-200 ${config.borderHover} hover:bg-[#f8faff] text-slate-900 shadow-slate-200`
              } ${is2x2 ? 'p-6 sm:p-7' : is2x1 ? 'p-5 sm:p-6' : 'p-5'}`}
            >
              {/* Dynamic Ambient Background Glow */}
              <div
                className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${config.accentGlow} rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`}
              />

              {/* Top Meta Strip */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl border flex items-center justify-center ${
                        isDark
                          ? 'bg-slate-900/90 border-slate-800 text-slate-200 group-hover:text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      {renderModuleIcon(module.iconName, is2x2 ? 'w-6 h-6 text-emerald-400' : 'w-4 h-4')}
                    </div>

                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                        isDark
                          ? 'text-red-400 bg-red-950/40 border-red-800/50'
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}
                    >
                      #{module.number < 10 ? `0${module.number}` : module.number}
                    </span>

                    {config.highlightText && (
                      <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                        {config.highlightText}
                      </span>
                    )}
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${
                      is2x2
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : is2x1
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : isDark
                        ? 'bg-slate-900/80 text-slate-400 border-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {config.badgeText}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    className={`font-display font-black tracking-tight transition-colors ${
                      is2x2
                        ? 'text-xl sm:text-2xl text-white group-hover:text-emerald-300'
                        : is2x1
                        ? 'text-base sm:text-lg text-white group-hover:text-red-300'
                        : 'text-sm font-bold text-white group-hover:text-red-300'
                    }`}
                  >
                    {currentLang === 'ne' ? module.titleNp : module.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed mt-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    } ${is2x2 ? 'line-clamp-3 sm:line-clamp-4' : is2x1 ? 'line-clamp-2 sm:line-clamp-3' : 'line-clamp-2'}`}
                  >
                    {currentLang === 'ne' ? module.descriptionNp : module.description}
                  </p>
                </div>

                {/* Bento Metric Preview Block (For 2x2 and 2x1 Spans) */}
                {config.metricPreview && (
                  <div
                    className={`p-3 rounded-xl border mt-3 transition-colors ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-800/90 group-hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 font-medium">{config.metricPreview.label}</span>
                      {config.metricPreview.trend === 'up' && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                          <Activity className="w-3 h-3" /> LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono text-white mt-0.5">
                      {config.metricPreview.value}
                    </div>
                    {config.metricPreview.subtext && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {config.metricPreview.subtext}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Feature Tags (If configured for 2x2 or 2x1) */}
                {config.features && config.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {config.features.map((feat, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                          isDark
                            ? 'bg-slate-900/60 text-slate-300 border-slate-800/80'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Strip Footer */}
              <div
                className={`relative z-10 pt-3 mt-4 border-t flex items-center justify-between text-xs font-semibold ${
                  isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}
              >
                <span className="text-[11px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{is2x2 ? 'Official Live Feed' : is2x1 ? 'Unified Service' : 'Instant Tool'}</span>
                </span>

                <div className="flex items-center gap-1 font-bold text-red-400 group-hover:text-red-300">
                  <span className="text-[11px]">
                    {currentLang === 'ne' ? 'खोल्नुहोस्' : 'Launch'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
