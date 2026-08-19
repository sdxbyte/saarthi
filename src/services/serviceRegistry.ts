import { PrimaryCategory, ServiceDefinition, PrimaryCategoryId } from '../types/serviceRegistry';

export const PRIMARY_CATEGORIES: PrimaryCategory[] = [
  {
    id: 'home',
    title: 'Home Overview',
    titleNp: 'गृह पृष्ठ (सारांश)',
    description: 'Central dashboard with live Nepal data feeds, quick shortcuts, and key alerts.',
    descriptionNp: 'नेपालका मुख्य तथ्याङ्क, लाइभ अपडेट र द्रुत सेवाहरू।',
    iconName: 'LayoutDashboard',
    route: 'dashboard',
    subcategories: [],
  },
  {
    id: 'services',
    title: 'Services Directory',
    titleNp: 'एकीकृत नागरिक सेवाहरू',
    description: 'Unified civic directory providing seamless access to financial, document, and public services.',
    descriptionNp: 'एकीकृत नागरिक सेवा तथा डिजिटल प्रणालीहरू।',
    iconName: 'Layers',
    route: 'services',
    badge: 'Civic',
    subcategories: [],
  },
  {
    id: 'finance',
    title: 'Finance & Money',
    titleNp: 'वित्त, सेयर तथा बैंकिङ',
    description: 'Stock market, IPO suite, foreign exchange rates, gold & silver prices, and tax calculator.',
    descriptionNp: 'सेयर बजार, आइपिओ, विदेशी मुद्रा, सुनचाँदी र कर क्याल्कुलेटर।',
    iconName: 'TrendingUp',
    route: 'nepse',
    badge: 'Live',
    subcategories: [
      {
        id: 'investments',
        title: 'NEPSE & Capital Market Suite',
        titleNp: 'आइपिओ तथा सेयर बजार',
        description: 'Live NEPSE, IPO application, portfolio tracker, and dividend records.',
        descriptionNp: 'नेप्से सेयर बजार, नयाँ आइपिओ र नतिजा।',
        iconName: 'Sparkles',
      },
      {
        id: 'forex_rates',
        title: 'Forex, Bullion & Fuel Rates',
        titleNp: 'विदेशी मुद्रा, सुनचाँदी र इन्धन',
        description: 'NRB exchange rates, daily gold/silver rates, NOC fuel prices & SWIFT directory.',
        descriptionNp: 'विदेशी मुद्रा, सुनचाँदीको भाउ र इन्धन दर।',
        iconName: 'Coins',
      },
      {
        id: 'calculators',
        title: 'Tax, EMI & Receipt Tools',
        titleNp: 'कर, ऋण तथा बिल औजार',
        description: 'Salary Tax FY 2083/84, Bank EMI, IRD e-PAN & Receipt Scanner.',
        descriptionNp: 'आयकर, बैंक लोन क्याल्कुलेटर र खर्च ट्र्याकर।',
        iconName: 'Calculator',
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents & Vehicles',
    titleNp: 'कागजात तथा सवारी भल्ट',
    description: 'Encrypted document vault, e-Passport, NID, and Bluebook vehicle tax manager.',
    descriptionNp: 'सुरक्षित डिजिटल भल्ट, राहदानी, NID र ब्लुबुक सवारी कर।',
    iconName: 'Lock',
    route: 'vault',
    badge: 'Vault',
    subcategories: [
      {
        id: 'digital_vault',
        title: 'Encrypted Vault & Identity',
        titleNp: 'सुरक्षित भल्ट र नागरिकता',
        description: 'Store documents locally, track e-Passport & National ID NID status.',
        descriptionNp: 'नागरिकता, राहदानी र NID ट्र्याकर।',
        iconName: 'ShieldCheck',
      },
      {
        id: 'vehicle_license',
        title: 'Vehicle Tax & Bluebook',
        titleNp: 'सवारी कर र ब्लुबुक',
        description: 'Provincial vehicle tax, renewal reminders & license print status.',
        descriptionNp: 'सवारी कर, ब्लुबुक नवीकरण र लाइसेन्स स्थिति।',
        iconName: 'Car',
      },
    ],
  },
  {
    id: 'civic',
    title: 'Govt Services & Careers',
    titleNp: 'सरकारी सेवा तथा रोजगार',
    description: 'Consolidated government portals, laws, constitutional rights, and Lok Sewa jobs.',
    descriptionNp: 'सरकारी पोर्टल, ऐन कानुन, संविधान र लोक सेवा विज्ञापन।',
    iconName: 'Building',
    route: 'services',
    subcategories: [
      {
        id: 'govt_directory',
        title: 'Government Portals & SSF',
        titleNp: 'सरकारी पोर्टल र कोषहरू',
        description: 'Nagarik App, Social Security Fund (SSF), Provident Fund (CIT/EPF) & forms.',
        descriptionNp: 'सरकारी फाराम, नागरिक एप र सामाजिक सुरक्षा।',
        iconName: 'Compass',
      },
      {
        id: 'career_loksewa',
        title: 'Lok Sewa & Career Hub',
        titleNp: 'लोक सेवा तथा वैदेशिक रोजगार',
        description: 'Lok Sewa Aayog, Teacher Service Commission (TSC), DOFE Labor & Scholarships.',
        descriptionNp: 'लोक सेवा विज्ञापन, शिक्षक सेवा र श्रम स्वीकृति।',
        iconName: 'Briefcase',
      },
      {
        id: 'laws_parliament',
        title: 'Laws & Constitutional Rights',
        titleNp: 'संविधान र ऐन कानुन',
        description: 'Constitution 2072 plain text, legal aid, Supreme Court & Parliamentary bills.',
        descriptionNp: 'नेपालको संविधान, ऐन कानुन र कानुनी सहायता।',
        iconName: 'BookOpen',
      },
    ],
  },
  {
    id: 'news',
    title: 'News & Bulletins',
    titleNp: 'समाचार तथा राजपत्र',
    description: 'National news digest, financial market announcements & Nepal Rajpatra notices.',
    descriptionNp: 'नेपाली समाचार, सेयर बजार र नेपाल राजपत्र।',
    iconName: 'Newspaper',
    route: 'news',
    subcategories: [
      {
        id: 'national_news',
        title: 'Nepal News & Rajpatra Digest',
        titleNp: 'समाचार तथा राजपत्र भण्डार',
        description: 'Curated national news, financial updates & official gazette decisions.',
        descriptionNp: 'प्रमुख समाचार, वित्तीय खबर र राजपत्र सूचना।',
        iconName: 'Radio',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Calendar & Utilities',
    titleNp: 'पात्रो, पञ्चाङ्ग र उपयोगिता',
    description: 'BS/AD Calendar, Panchanga, Rashifal, Weather/AQI, and utility calculation tools.',
    descriptionNp: 'नेपाली पात्रो, राशिफल, मौसम र दैनिक उपयोगिता औजारहरू।',
    iconName: 'Calendar',
    route: 'calendar',
    subcategories: [
      {
        id: 'calendar_time',
        title: 'Nepali Calendar, Panchanga & Rashifal',
        titleNp: 'पात्रो, पञ्चाङ्ग र राशिफल',
        description: 'BS/AD date converter, daily Tithi, festivals & horoscope.',
        descriptionNp: 'पात्रो, चाडपर्व, पञ्चाङ्ग र दैनिक राशिफल।',
        iconName: 'CalendarDays',
      },
      {
        id: 'civic_utilities',
        title: 'Utilities, Weather & Public Portals',
        titleNp: 'मौसम, बिजुली तथा नागरिक उपयोगिता',
        description: 'Weather/AQI forecasts, electricity & water utility bill links.',
        descriptionNp: 'मौसम, हावाको गुणस्तर र खानेपानी/विद्युत महसुल।',
        iconName: 'Compass',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Support',
    titleNp: 'खाता तथा सहयोग केन्द्र',
    description: 'Citizen profile settings, support desk, SAARTHI roadmap, and donation section.',
    descriptionNp: 'व्यक्तिगत खाता, सहायता केन्द्र र परियोजना सहयोग।',
    iconName: 'User',
    route: 'support',
    subcategories: [
      {
        id: 'user_profile',
        title: 'Profile, Help & Support Project',
        titleNp: 'खाता, सहयोग र जानकारी',
        description: 'User settings, help desk, SAARTHI vision, and QR payment details.',
        descriptionNp: 'प्रयोगकर्ता खाता, सहयोग र परियोजना विवरण।',
        iconName: 'UserCheck',
      },
    ],
  },
];

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  // 1. NEPSE & Capital Market Suite
  {
    id: 'nepse-market',
    number: 1,
    title: 'NEPSE & Capital Market Suite',
    titleNp: 'नेप्से तथा सेयर बजार हब',
    parentCategory: 'finance',
    subcategory: 'investments',
    description: 'NEPSE index, stock quotes, portfolio WACC calculator, IPO checker & Meroshare auto-apply.',
    descriptionNp: 'नेप्से परिसूचक, पोर्टफोलियो, नयाँ आइपिओ र मेरोसेयर सुविधा।',
    iconName: 'TrendingUp',
    badge: 'Unified',
    targetTab: 'nepse',
    subViewId: 'nepse-market',
    tags: ['nepse', 'share', 'stock', 'market', 'portfolio', 'wacc', 'ipo', 'meroshare', 'sebon', 'broker', 'floorsheet', 'dividend'],
  },
  // 2. Forex, Bullion & Fuel Rates
  {
    id: 'forex-converter',
    number: 2,
    title: 'Forex, Bullion & Fuel Rates',
    titleNp: 'विदेशी मुद्रा, सुनचाँदी र इन्धन हब',
    parentCategory: 'finance',
    subcategory: 'forex_rates',
    description: 'Nepal Rastra Bank exchange rates, daily gold/silver rates, NOC fuel prices & SWIFT directory.',
    descriptionNp: 'राष्ट्र बैंक विनिमय दर, सुनचाँदीको भाउ, आयल निगम इन्धन दर र स्विफ्ट कोड।',
    iconName: 'Coins',
    badge: 'Unified',
    targetTab: 'forex',
    subViewId: 'forex-converter',
    tags: ['forex', 'nrb', 'currency', 'dollar', 'exchange', 'gold', 'silver', 'bullion', 'fuel', 'petrol', 'diesel', 'lpg', 'swift', 'remittance'],
  },
  // 3. Tax, EMI & Financial Tools
  {
    id: 'tax-calculator',
    number: 3,
    title: 'Tax, EMI & Receipt Tools',
    titleNp: 'कर, बैंक लोन र रसीद औजार',
    parentCategory: 'finance',
    subcategory: 'calculators',
    description: 'Salary & Income Tax FY 2083/84, Bank EMI Calculator, IRD e-PAN & Receipt Scanner.',
    descriptionNp: 'आयकर क्याल्कुलेटर, बैंक EMI, e-PAN र रसीद स्क्यानर।',
    iconName: 'Calculator',
    badge: 'Unified',
    targetTab: 'tax',
    subViewId: 'tax-calc',
    tags: ['tax', 'income', 'salary', 'ird', 'pan', 'emi', 'loan', 'interest', 'receipt', 'expense', 'budget'],
  },
  // 4. Encrypted Digital Vault & Citizen Identity
  {
    id: 'secure-vault',
    number: 4,
    title: 'Encrypted Vault & Identity Suite',
    titleNp: 'सुरक्षित डिजिटल भल्ट र नागरिकता',
    parentCategory: 'documents',
    subcategory: 'digital_vault',
    description: 'Store Citizenship, e-Passport, PAN & Certificates locally. Track e-Passport & National ID (NID).',
    descriptionNp: 'नागरिकता, राहदानी, NID र शैक्षिक प्रमाणपत्रको सुरक्षित डिजिटल भल्ट।',
    iconName: 'Lock',
    badge: 'Vault',
    targetTab: 'vault',
    subViewId: 'secure-vault',
    tags: ['vault', 'documents', 'citizenship', 'passport', 'nid', 'national id', 'pan', 'encryption', 'dao'],
  },
  // 5. DOTM Driving License & Vehicle Hub
  {
    id: 'bluebook-tax',
    number: 5,
    title: 'DOTM Driving License & Vehicle Hub',
    titleNp: 'यातायात व्यवस्था विभाग (DoTM) तथा सवारी हब',
    parentCategory: 'documents',
    subcategory: 'vehicle_license',
    description: 'Apply EDL, Smart Card print status, 70-mark trial rules, written exam questions, 35+ Yatayat offices & provincial vehicle tax.',
    descriptionNp: 'नयाँ लाइसेन्स अनलाइन फाराम, स्मार्ट कार्ड प्रिन्ट स्थिति, ७० अंकको ट्रायल, लिखित परीक्षा ५०० प्रश्न, ३५+ कार्यालय र सवारी कर।',
    iconName: 'Car',
    badge: 'DOTM Suite',
    targetTab: 'bluebook',
    subViewId: 'bluebook-tax',
    tags: ['dotm', 'driving license', 'edl', 'license', 'yatayat', 'trial', 'likhit', 'exam', 'bluebook', 'vehicle', 'bike', 'car', 'tax', 'transport', 'embossed'],
  },
  // 6. Government Services & Public Funds
  {
    id: 'gov-service-directory',
    number: 6,
    title: 'Government Services & Public Funds',
    titleNp: 'सरकारी सेवा र कोषहरू',
    parentCategory: 'civic',
    subcategory: 'govt_directory',
    description: 'Central government service directory, Nagarik App, SSF, Provident Fund (CIT/EPF) & forms.',
    descriptionNp: 'सरकारी सेवा निर्देशिका, फाराम, नागरिक एप, सामाजिक सुरक्षा कोष र नागरिक लगानी कोष।',
    iconName: 'Building',
    badge: 'Unified',
    targetTab: 'devtrack',
    subViewId: 'services-list',
    tags: ['government', 'nagarik app', 'ssf', 'cit', 'epf', 'forms', 'service', 'directory', 'devtrack'],
  },
  // 7. Lok Sewa & Career Vacancies Hub
  {
    id: 'lok-sewa-alerts',
    number: 7,
    title: 'Lok Sewa & Career Vacancies Hub',
    titleNp: 'लोक सेवा तथा रोजगार हब',
    parentCategory: 'civic',
    subcategory: 'career_loksewa',
    description: 'Lok Sewa Aayog, Teacher Service (TSC), DOFE Labor Permits & Scholarship notifications.',
    descriptionNp: 'लोक सेवा विज्ञापन, पाठ्यक्रम, शिक्षक सेवा, वैदेशिक रोजगार श्रम स्वीकृति र छात्रवृत्ति।',
    iconName: 'Briefcase',
    badge: 'Jobs',
    targetTab: 'loksewa',
    subViewId: 'loksewa-list',
    tags: ['loksewa', 'jobs', 'psc', 'tsc', 'vacancy', 'dofe', 'labor permit', 'scholarship', 'moe'],
  },
  // 8. Nepal Laws & Constitutional Rights
  {
    id: 'nepal-laws-constitution',
    number: 8,
    title: 'Nepal Laws & Constitutional Rights',
    titleNp: 'नेपालको संविधान तथा कानुन हब',
    parentCategory: 'civic',
    subcategory: 'laws_parliament',
    description: 'Plain-language Constitution 2072, Supreme Court legal aid, Parliamentary bills & Labor Act.',
    descriptionNp: 'नेपालको संविधान २०७२, सर्वोच्च अदालत, संसदका विधेयक र कानुनी सहायता।',
    iconName: 'BookOpen',
    badge: 'Unified',
    targetTab: 'devtrack',
    subViewId: 'laws-list',
    tags: ['constitution', 'laws', 'act', 'bills', 'parliament', 'court', 'legal aid', 'kanun'],
  },
  // 9. Nepali Calendar, Panchanga & Rashifal
  {
    id: 'public-calendar',
    number: 9,
    title: 'Nepali Calendar, Panchanga & Rashifal',
    titleNp: 'नेपाली पात्रो, पञ्चाङ्ग र राशिफल',
    parentCategory: 'tools',
    subcategory: 'calendar_time',
    description: 'BS ↔ AD date converter, daily Tithi, official public holidays, Panchanga & daily Horoscope.',
    descriptionNp: 'विक्रम संवत् पात्रो, मिति रूपान्तरण, दैनिक पञ्चाङ्ग, सार्वजनिक बिदा र राशिफल।',
    iconName: 'CalendarDays',
    badge: 'Unified',
    targetTab: 'calendar',
    subViewId: 'calendar-main',
    tags: ['calendar', 'patro', 'bs', 'ad', 'converter', 'panchanga', 'tithi', 'holidays', 'rashifal', 'horoscope'],
  },
  // 10. Utilities, AQI & Public Services
  {
    id: 'public-utilities',
    number: 10,
    title: 'Utilities, AQI & Public Services',
    titleNp: 'मौसम, उपयोगिता तथा नागरिक सेवा',
    parentCategory: 'tools',
    subcategory: 'civic_utilities',
    description: 'Civic utilities, Weather/AQI forecasts, electricity & water utility bill links.',
    descriptionNp: 'मौसम, हावाको गुणस्तर र बिजुली/खानेपानी महसुल पोर्टल।',
    iconName: 'Compass',
    badge: 'Utility',
    targetTab: 'calendar',
    subViewId: 'calendar-main',
    tags: ['utility', 'weather', 'aqi', 'electricity', 'water', 'bills', 'services'],
  },
  // 11. Nepal News & Rajpatra Digest
  {
    id: 'nepal-news-digest',
    number: 11,
    title: 'Nepal News & Rajpatra Digest',
    titleNp: 'समाचार तथा राजपत्र भण्डार',
    parentCategory: 'news',
    subcategory: 'national_news',
    description: 'Curated national news from trusted outlets, NEPSE market news & official Nepal Rajpatra notices.',
    descriptionNp: 'प्रमुख अनलाइनका खबर, सेयर समाचार र नेपाल राजपत्रका सरकारी सूचना।',
    iconName: 'Newspaper',
    badge: 'Unified',
    targetTab: 'news',
    subViewId: 'news-main',
    tags: ['news', 'samachar', 'rajpatra', 'gazette', 'market news', 'bulletins', 'press release'],
  },
  // 12. Citizen Profile & Support Desk
  {
    id: 'support-contact',
    number: 12,
    title: 'Citizen Profile & Support Desk',
    titleNp: 'नागरिक खाता, सहायता र सहयोग',
    parentCategory: 'account',
    subcategory: 'user_profile',
    description: 'User settings, platform help desk, contact form, SAARTHI roadmap, and QR donation details.',
    descriptionNp: 'व्यक्तिगत खाता, सहायता केन्द्र, सम्पर्क फाराम र परियोजना सहयोग माध्यम।',
    iconName: 'UserCheck',
    badge: 'Unified',
    targetTab: 'support',
    subViewId: 'support-main',
    tags: ['profile', 'account', 'settings', 'help', 'contact', 'about', 'vision', 'roadmap', 'donate', 'donation'],
  },
  // 13. Public APIs Hub & Interactive Developer Workbench (github.com/public-apis/public-apis)
  {
    id: 'public-apis-hub',
    number: 13,
    title: 'Public APIs Hub & Developer Workbench',
    titleNp: 'सार्वजनिक खुला एपीआई हब तथा परीक्षण उपकरण',
    parentCategory: 'tools',
    subcategory: 'emergency_sos',
    description: 'Vetted public APIs catalog from github.com/public-apis, live micro utilities (Weather, Forex, Geolocation, Dictionary, QR Generator) and universal CORS API sandbox tester.',
    descriptionNp: 'विश्वभरका खुला एपीआईहरूको सूची, प्रत्यक्ष मौसम, मुद्रा, शब्दकोश, QR जेनेरेटर तथा लाइभ एपीआई परीक्षण स्यान्डबक्स।',
    iconName: 'Globe',
    badge: 'Open APIs',
    targetTab: 'public-apis',
    subViewId: 'apis-main',
    tags: ['api', 'apis', 'public-apis', 'weather', 'dictionary', 'forex', 'tools', 'developer', 'sandbox', 'rest', 'json', 'endpoints'],
  },
];

export function getCategoryById(id: PrimaryCategoryId): PrimaryCategory | undefined {
  return PRIMARY_CATEGORIES.find((cat) => cat.id === id);
}

export function getAllServices(): ServiceDefinition[] {
  return SERVICE_DEFINITIONS;
}

export function getServicesByCategory(catId: PrimaryCategoryId): ServiceDefinition[] {
  return SERVICE_DEFINITIONS.filter((service) => service.parentCategory === catId);
}

export function getServiceById(id: string): ServiceDefinition | undefined {
  return SERVICE_DEFINITIONS.find((service) => service.id === id);
}

export function searchServices(query: string): ServiceDefinition[] {
  if (!query || !query.trim()) return SERVICE_DEFINITIONS;
  const q = query.trim().toLowerCase();
  return SERVICE_DEFINITIONS.filter((service) => {
    const titleMatch = service.title.toLowerCase().includes(q) || service.titleNp.includes(q);
    const descMatch = service.description.toLowerCase().includes(q) || service.descriptionNp.includes(q);
    const tagMatch = service.tags.some((tag) => tag.toLowerCase().includes(q));
    const subMatch = service.subcategory.toLowerCase().includes(q);
    return titleMatch || descMatch || tagMatch || subMatch;
  });
}

// Service usage tracking in LocalStorage
const RECENT_SERVICES_KEY = 'saarthi_recent_services_v2';

export function getRecentServiceIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SERVICES_KEY);
    if (!stored) return ['nepse-market', 'tax-calculator', 'secure-vault', 'bluebook-tax'];
    return JSON.parse(stored);
  } catch {
    return ['nepse-market', 'tax-calculator', 'secure-vault', 'bluebook-tax'];
  }
}

export function recordServiceUsage(serviceId: string) {
  if (typeof window === 'undefined') return;
  try {
    const recents = getRecentServiceIds();
    const updated = [serviceId, ...recents.filter((id) => id !== serviceId)].slice(0, 5);
    localStorage.setItem(RECENT_SERVICES_KEY, JSON.stringify(updated));
  } catch {
    // ignore local storage error
  }
}
