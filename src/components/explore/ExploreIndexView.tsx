import React, { useState, useMemo } from 'react';
import { Search, ArrowUpRight, Filter, ShieldCheck, Tag } from 'lucide-react';
import { getAllServices, SERVICE_DEFINITIONS } from '../../services/serviceRegistry';
import { ServiceDefinition } from '../../types/serviceRegistry';

interface ExploreIndexViewProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tab: string) => void;
}

type FilterDomain = 'all' | 'finance' | 'tools' | 'civic' | 'resources';

interface MasterDirectoryEntry {
  id: string;
  title: string;
  titleNp: string;
  domain: FilterDomain;
  categoryLabel: string;
  description: string;
  descriptionNp: string;
  source: string;
  targetTab: string;
  tags: string[];
}

export const ExploreIndexView: React.FC<ExploreIndexViewProps> = ({
  currentLang,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<FilterDomain>('all');

  const entries: MasterDirectoryEntry[] = useMemo(() => [
    // Finance Group
    {
      id: 'gold-rates',
      title: 'Gold & Silver Rates',
      titleNp: 'सुन चाँदी दर',
      domain: 'finance',
      categoryLabel: 'Finance · Bullion',
      description: 'Official daily bullion rates for fine gold (Chhapawal), hallmark gold (Tejabi), and silver per tola and gram.',
      descriptionNp: 'दैनिक छापावाल, तेजाबी सुन र चाँदीको आधिकारिक बजार भाउ।',
      source: 'FENEGOSIDA Official',
      targetTab: 'gold',
      tags: ['gold', 'silver', 'bullion', 'tola', 'gram', 'fenegosida'],
    },
    {
      id: 'nrb-forex',
      title: 'Nepal Forex Exchange Rates',
      titleNp: 'विदेशी मुद्रा विनिमय दर',
      domain: 'finance',
      categoryLabel: 'Finance · Currency',
      description: 'Daily exchange rates for foreign currencies directly published by Nepal Rastra Bank with live interactive currency converter.',
      descriptionNp: 'नेपाल राष्ट्र बैंकको आधिकारिक दैनिक विनिमय दर तथा रूपान्तरक।',
      source: 'Nepal Rastra Bank (NRB)',
      targetTab: 'forex',
      tags: ['forex', 'currency', 'exchange', 'usd', 'nrb', 'remittance', 'inr'],
    },
    {
      id: 'nepse-market',
      title: 'NEPSE Live Market & Turnover',
      titleNp: 'नेप्से सेयर बजार तथा कारोबार',
      domain: 'finance',
      categoryLabel: 'Finance · Equities',
      description: 'Live NEPSE index, market turnover, sector indices, top gainers/losers, company financial statements, and floor sheet.',
      descriptionNp: 'नेप्से प्रत्यक्ष परिसूचक, उप-सूचकहरू, टप गेनर्स र वित्तीय विवरण।',
      source: 'Nepal Stock Exchange (NEPSE)',
      targetTab: 'nepse',
      tags: ['nepse', 'share', 'stock', 'turnover', 'market', 'wacc', 'gainers'],
    },
    {
      id: 'ipo-pipeline',
      title: 'Meroshare IPO Suite & Allotment',
      titleNp: 'मेरोसेयर आइपिओ तथा नतिजा',
      domain: 'finance',
      categoryLabel: 'Finance · Capital Market',
      description: 'Current, upcoming, and closed IPO/FPO/Debenture offerings with issue dates, units, and CDSC allotment checking.',
      descriptionNp: 'नयाँ निष्कासन हुने आइपिओ, हकप्रद सेयर र नतिजा हेर्ने सुविधा।',
      source: 'SEBON & CDSC Nepal',
      targetTab: 'nepse',
      tags: ['ipo', 'meroshare', 'cdsc', 'allotment', 'sebon', 'debenture'],
    },
    {
      id: 'fuel-rates',
      title: 'Nepal Oil Fuel Price Index',
      titleNp: 'नेपाल आयल निगम इन्धन दर',
      domain: 'finance',
      categoryLabel: 'Finance · Energy',
      description: 'Official Nepal Oil Corporation retail prices for Petrol, Diesel, Kerosene, and Aviation Turbine Fuel across Tier 1, 2, and 3 depots.',
      descriptionNp: 'नेपाल आयल निगमको पेट्रोल, डिजेल, मट्टितेल र एलपीजी ग्यासको आधिकारिक दर।',
      source: 'Nepal Oil Corporation (NOC)',
      targetTab: 'fuel',
      tags: ['fuel', 'petrol', 'diesel', 'noc', 'lpg', 'gas', 'kerosene'],
    },
    {
      id: 'income-tax',
      title: 'Salary & Income Tax Calculator',
      titleNp: 'आयकर क्याल्कुलेटर (FY २०८३/८४)',
      domain: 'finance',
      categoryLabel: 'Finance · Taxation',
      description: 'Fiscal Year 2083/84 income tax slabs for individual, married, SSF, PF, insurance deductions, and effective tax rates.',
      descriptionNp: 'व्यक्तिगत तथा दम्पतीका लागि नयाँ बजेट अनुसारको आयकर हिसाब।',
      source: 'Inland Revenue Department (IRD)',
      targetTab: 'tax',
      tags: ['tax', 'salary', 'income', 'ird', 'pan', 'ssf', 'cit'],
    },
    {
      id: 'bank-emi',
      title: 'Loan EMI & Amortization Calculator',
      titleNp: 'बैंक ऋण ईएमआई क्याल्कुलेटर',
      domain: 'finance',
      categoryLabel: 'Finance · Banking',
      description: 'Calculate monthly home, auto, or personal loan installment schedules, total interest breakdown, and repayment curves.',
      descriptionNp: 'घर, गाडी तथा व्यक्तिगत कर्जाको मासिक किस्ता तथा ब्याज हिसाब।',
      source: 'Standard Banking Formula',
      targetTab: 'emi',
      tags: ['emi', 'loan', 'interest', 'bank', 'mortgage', 'installment'],
    },
    {
      id: 'receipt-scanner',
      title: 'Receipt Scanner & Expense Tracker',
      titleNp: 'रसीद स्क्यानर तथा खर्च ट्र्याकर',
      domain: 'finance',
      categoryLabel: 'Finance · Utility',
      description: 'Scan physical bills and tax invoices locally, extract PAN and total amounts, and export monthly business expense statements.',
      descriptionNp: 'बिल तथा इनभ्वाइस स्क्यान गरी खर्च विवरण ट्र्याक गर्ने सुविधा।',
      source: 'Client-Side OCR Engine',
      targetTab: 'receipt',
      tags: ['receipt', 'scanner', 'expense', 'ocr', 'invoice', 'budget'],
    },

    // Tools Group
    {
      id: 'bs-ad-calendar',
      title: 'Bikram Sambat Calendar & Converter',
      titleNp: 'नेपाली पात्रो तथा मिति रूपान्तरक',
      domain: 'tools',
      categoryLabel: 'Tools · Calendar',
      description: 'Comprehensive dual Bikram Sambat (BS) and Anno Domini (AD) calendar with official public holidays, daily Tithi, and festivals.',
      descriptionNp: 'सार्वजनिक बिदा, तिथि, पञ्चाङ्ग तथा AD/BS मिति रूपान्तरण सहितको पूर्ण पात्रो।',
      source: 'Nepal Panchanga Nirnayak Samiti',
      targetTab: 'calendar',
      tags: ['calendar', 'patro', 'bs', 'ad', 'converter', 'tithi', 'holidays', 'panchanga'],
    },
    {
      id: 'bluebook-tax',
      title: 'Bluebook Vehicle Tax Estimator',
      titleNp: 'ब्लुबुक सवारी साधन कर क्याल्कुलेटर',
      domain: 'tools',
      categoryLabel: 'Tools · Transport',
      description: 'Provincial transport management road tax calculator, renewal deadlines, penalty formulas, and DoTM license status.',
      descriptionNp: 'बागमती र अन्य प्रदेशका सवारी साधन कर दर, ब्लुबुक नवीकरण र लाइसेन्स स्थिति।',
      source: 'Department of Transport (DoTM)',
      targetTab: 'bluebook',
      tags: ['bluebook', 'vehicle', 'tax', 'bike', 'car', 'dotm', 'license', 'yatayat'],
    },
    {
      id: 'sajilo-essentials',
      title: 'Sajilo Daily Essentials Hub',
      titleNp: 'सजिलो दैनिक आवश्यकताहरू',
      domain: 'tools',
      categoryLabel: 'Tools · Everyday Life',
      description: 'Daily Kalimati wholesale vegetable & fruit rates, live streaming Nepal FM radio, scratchpad keeper, and land area converter.',
      descriptionNp: 'कालिमाटी तरकारी तथा फलफूल बजार, प्रत्यक्ष एफएम रेडियो, रिमाइन्डर र जग्गा नाप।',
      source: 'Kalimati Board & Broadcasters',
      targetTab: 'sajilo',
      tags: ['sajilo', 'kalimati', 'vegetables', 'radio', 'fm', 'keeper', 'land', 'ropani', 'bigha'],
    },
    {
      id: 'document-vault',
      title: 'Encrypted Citizen Document Vault',
      titleNp: 'सुरक्षित नागरिक डिजिटल भल्ट',
      domain: 'tools',
      categoryLabel: 'Tools · Security & Identity',
      description: 'Client-side AES-256 encrypted storage for Citizenship, Passport, PAN, and National ID copies with zero server storage.',
      descriptionNp: 'नागरिकता, राहदानी र व्यक्तिगत कागजातको सुरक्षित अफलाइन डिजिटल भल्ट।',
      source: 'Browser Local Cryptography',
      targetTab: 'vault',
      tags: ['vault', 'documents', 'citizenship', 'passport', 'nid', 'security', 'encryption'],
    },
    {
      id: 'public-apis',
      title: 'Public APIs Hub & Developer Workbench',
      domain: 'tools',
      titleNp: 'सार्वजनिक खुला एपीआई हब',
      categoryLabel: 'Tools · Developer',
      description: 'Vetted public APIs catalog, live utility tools (Weather, Dictionary, QR Generator), and CORS API sandbox testing.',
      descriptionNp: 'विश्वभरका खुला एपीआई, प्रत्यक्ष मौसम, शब्दकोश तथा एपीआई परीक्षण औजार।',
      source: 'Open Source Community APIs',
      targetTab: 'public-apis',
      tags: ['api', 'public-apis', 'developer', 'json', 'sandbox', 'rest', 'tools'],
    },

    // Civic & Governance Group
    {
      id: 'gov-directory',
      title: 'Government Services & Citizen Charter',
      titleNp: 'सरकारी सेवा निर्देशिका तथा नागरिक बडापत्र',
      domain: 'civic',
      categoryLabel: 'Civic · Public Administration',
      description: 'Consolidated directory of official Nepal government portals, citizen charter procedures, Nagarik App links, and downloadable forms.',
      descriptionNp: 'सरकारी मन्त्रालय, विभाग, नागरिक एप र आधिकारिक फारामहरूको निर्देशिका।',
      source: 'Government of Nepal Ministries',
      targetTab: 'services',
      tags: ['government', 'services', 'nagarik app', 'forms', 'charter', 'ministry'],
    },
    {
      id: 'loksewa-vacancies',
      title: 'Lok Sewa Aayog & Career Notices',
      titleNp: 'लोक सेवा आयोग तथा रोजगारी सूचना',
      domain: 'civic',
      categoryLabel: 'Civic · Employment',
      description: 'Official Public Service Commission (Lok Sewa) exam calendars, vacancy notices, Teacher Service Commission (TSC), and DOFE labor permits.',
      descriptionNp: 'लोक सेवा विज्ञापन, पाठ्यक्रम, परीक्षा तालिका, शिक्षक सेवा र वैदेशिक रोजगार।',
      source: 'Public Service Commission (PSC)',
      targetTab: 'loksewa',
      tags: ['loksewa', 'jobs', 'vacancy', 'psc', 'tsc', 'exam', 'dofe', 'employment'],
    },
    {
      id: 'devtrack-projects',
      title: 'DevTrack National Project Tracker',
      titleNp: 'राष्ट्रिय विकास आयोजना ट्र्याकर',
      domain: 'civic',
      categoryLabel: 'Civic · Public Works',
      description: 'Track budget allocation, physical progress, and contractor status of national pride infrastructure projects across Nepal.',
      descriptionNp: 'नेपालका राष्ट्रिय गौरवका आयोजना, बजेट र भौतिक प्रगतिको विवरण।',
      source: 'National Planning Commission',
      targetTab: 'devtrack',
      tags: ['devtrack', 'projects', 'infrastructure', 'budget', 'development', 'roads'],
    },
    {
      id: 'ird-portal',
      title: 'IRD e-Services & PAN Verification',
      titleNp: 'आन्तरिक राजस्व विभाग e-Services',
      domain: 'civic',
      categoryLabel: 'Civic · Revenue',
      description: 'Verify Personal & Business PAN status, check tax clearance certificates, and access official IRD taxpayer portals.',
      descriptionNp: 'व्यक्तिगत तथा व्यावसायिक प्यान जाँच, कर चुक्ता प्रमाणपत्र र राजस्व पोर्टल।',
      source: 'Inland Revenue Department (IRD)',
      targetTab: 'ird',
      tags: ['ird', 'pan', 'tax clearance', 'revenue', 'taxpayer'],
    },

    // Resources & Lifestyle Group
    {
      id: 'rashifal-panchanga',
      title: 'Daily Rashifal & Astrological Panchanga',
      titleNp: 'दैनिक राशिफल तथा पञ्चाङ्ग',
      domain: 'resources',
      categoryLabel: 'Resources · Astrology',
      description: 'Daily astrological forecast for all 12 Rashi signs, Shubha Muhurat, Sunrise/Sunset timings, and planetary transits.',
      descriptionNp: '१२ वटै राशिको दैनिक राशिफल, शुभ साइत, सूर्योदय र पञ्चाङ्ग विवरण।',
      source: 'Traditional Vedic Ephemeris',
      targetTab: 'rashifal',
      tags: ['rashifal', 'horoscope', 'panchanga', 'astrology', 'rashi', 'muhurat'],
    },
    {
      id: 'allsite-hub',
      title: 'AllSiteHub Web & Streaming Directory',
      titleNp: 'AllSiteHub वेब तथा मिडिया डाइरेक्टरी',
      domain: 'resources',
      categoryLabel: 'Resources · Web Directory',
      description: 'Carefully categorized directory of verified streaming platforms, anime, open tools, and web resources inspired by allsitehub.site.',
      descriptionNp: 'नेपाली तथा अन्तर्राष्ट्रिय खुला वेब स्रोत, स्ट्रिमिङ तथा मिडिया पोर्टल।',
      source: 'Curated Open Web Hub',
      targetTab: 'sitehub',
      tags: ['sitehub', 'allsitehub', 'streaming', 'media', 'anime', 'web', 'directory'],
    },
    {
      id: 'fmhy-links',
      title: 'Useful Links & FMHY Web Index',
      titleNp: 'उपयोगी इन्टरनेट लिङ्क तथा FMHY',
      domain: 'resources',
      categoryLabel: 'Resources · Open Index',
      description: 'FreeMediaHeckYeah (FMHY) archive, developer references, privacy extensions, and citizen bookmarks.',
      descriptionNp: 'खुला इन्टरनेट स्रोत, उपयोगी सफ्टवेयर, गोपनियता औजार र बुकमार्कहरू।',
      source: 'FMHY & Open Web Community',
      targetTab: 'links',
      tags: ['links', 'fmhy', 'bookmarks', 'software', 'resources', 'devtools'],
    },
    {
      id: 'osint4all-directory',
      title: 'OSINT4ALL Intelligence Directory',
      titleNp: 'OSINT4ALL खुला स्रोत गुप्तचर निर्देशिका',
      domain: 'tools',
      categoryLabel: 'Tools · OSINT Research',
      description: 'Open-source intelligence resource directory modeled after osint4all.com covering DNS, attack surface, email breaches, geolocation, and media verification.',
      descriptionNp: 'osint4all.com मा आधारित डोमेन, DNS, नेटवर्क, इमेल, भू-स्थान तथा मिडिया प्रमाणीकरण औजार निर्देशिका।',
      source: 'osint4all.com',
      targetTab: 'osint4all',
      tags: ['osint', 'osint4all', 'whois', 'shodan', 'dns', 'breach', 'geolocation', 'verification'],
    },
  ], []);

  // Filter and Search Logic
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesDomain = activeDomain === 'all' || entry.domain === activeDomain;
      if (!matchesDomain) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = entry.title.toLowerCase().includes(q) || entry.titleNp.includes(q);
      const descMatch = entry.description.toLowerCase().includes(q) || entry.descriptionNp.includes(q);
      const catMatch = entry.categoryLabel.toLowerCase().includes(q);
      const tagMatch = entry.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || catMatch || tagMatch;
    });
  }, [entries, activeDomain, searchQuery]);

  const domainCounts = useMemo(() => {
    return {
      all: entries.length,
      finance: entries.filter((e) => e.domain === 'finance').length,
      tools: entries.filter((e) => e.domain === 'tools').length,
      civic: entries.filter((e) => e.domain === 'civic').length,
      resources: entries.filter((e) => e.domain === 'resources').length,
    };
  }, [entries]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono font-semibold block">
            {currentLang === 'ne' ? 'केन्द्रीय निर्देशिका' : 'Central Index'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? 'अन्वेषण (सारथी निर्देशिका)' : 'Explore SAARTHI'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'नेपालका लागि उपलब्ध सबै वित्तीय औजार, क्याल्कुलेटर, सरकारी सेवा र दैनिक उपयोगिताहरूको संगठित सूची।'
              : 'Complete directory of financial instruments, civic calculators, official registries, and daily utilities.'}
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="pt-1">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'ne' ? 'औजार वा सेवा खोज्नुहोस्...' : 'Search tools, forex, NEPSE, tax, calendar...'}
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-sm text-[#0B1F3A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-[#0B1F3A] dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                {currentLang === 'ne' ? 'हटाउनुहोस्' : 'Clear'}
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: currentLang === 'ne' ? 'सबै' : 'All Items', count: domainCounts.all },
              { id: 'finance', label: currentLang === 'ne' ? 'वित्त' : 'Finance', count: domainCounts.finance },
              { id: 'tools', label: currentLang === 'ne' ? 'औजार' : 'Tools', count: domainCounts.tools },
              { id: 'civic', label: currentLang === 'ne' ? 'नागरिक तथा सरकारी' : 'Civic & Govt', count: domainCounts.civic },
              { id: 'resources', label: currentLang === 'ne' ? 'स्रोतहरू' : 'Resources', count: domainCounts.resources },
            ] as const
          ).map((tab) => {
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDomain(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white dark:bg-blue-600 shadow-xs font-semibold'
                    : 'bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white hover:border-blue-400'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] font-mono tabular-nums ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span className="tabular-nums">
          {currentLang === 'ne'
            ? `${entries.length} मध्ये ${filteredEntries.length} सेवा देखाइँदै`
            : `Showing ${filteredEntries.length} of ${entries.length} available utilities`}
        </span>
        {searchQuery && (
          <span>
            Filtered by &quot;{searchQuery}&quot;
          </span>
        )}
      </div>

      {/* Directory Index List */}
      {filteredEntries.length === 0 ? (
        <div className="py-14 text-center space-y-3 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-medium text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? 'तपाईँको खोजीसँग मिल्ने सेवा भेटिएन।' : 'No tools or services match your search.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'ne'
              ? 'विदेशी मुद्रा, सुनचाँदी, ब्लुबुक, पात्रो वा कर खोज्नुहोस्।'
              : 'Try searching for forex, gold, bluebook, calendar, tax, or loksewa.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveDomain('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            {currentLang === 'ne' ? 'फिल्टर रिसेट गर्नुहोस्' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          {filteredEntries.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateTab(item.targetTab)}
              className="w-full text-left p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1.5 flex-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="tabular-nums font-semibold text-blue-600 dark:text-blue-400">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span>{item.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.source}</span>
                </div>

                <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>{currentLang === 'ne' ? item.titleNp : item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentLang === 'ne' ? item.descriptionNp : item.description}
                </p>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-0.5">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:inline">
                  {currentLang === 'ne' ? 'प्रमाणित स्रोत' : 'Verified Source'}
                </span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 font-mono">
                  <span>{currentLang === 'ne' ? 'खोल्नुहोस्' : 'Open'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
