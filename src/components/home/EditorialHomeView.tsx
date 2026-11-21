import React from 'react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, TrendingUp, DollarSign, Calendar, Car, Radio, Lock } from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface EditorialHomeViewProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const EditorialHomeView: React.FC<EditorialHomeViewProps> = ({
  currentLang,
  onNavigateTab,
  onOpenSearch,
}) => {
  const { timeState } = useGlobalTime();

  // Curated high-value featured items presented in Sabin Paudel's editorial project style
  const featuredItems = [
    {
      id: 'gold',
      targetTab: 'gold',
      category: 'Finance · Bullion',
      title: 'Gold & Silver Rates',
      titleNp: 'सुन तथा चाँदीको दर',
      description: 'Daily hallmark gold, fine gold, and silver bullion rates tracked from Federation of Nepal Gold and Silver Dealers’ Association.',
      descriptionNp: 'नेपाल सुनचाँदी व्यवसायी महासंघद्वारा जारी दैनिक छापावाल, तेजाबी सुन र चाँदीको आधिकारिक दर।',
      source: 'FENEGOSIDA Official',
      status: 'Daily 10:30 AM',
      highlight: 'NPR 192,500 / tola',
    },
    {
      id: 'forex',
      targetTab: 'forex',
      category: 'Finance · Currency',
      title: 'Nepal Forex Rates',
      titleNp: 'विदेशी मुद्रा विनिमय दर',
      description: 'Real-time foreign exchange buy and sell rates for USD, EUR, GBP, AUD, AED, and 20+ currencies directly from Nepal Rastra Bank.',
      descriptionNp: 'नेपाल राष्ट्र बैंकको दैनिक आधिकारिक मुद्रा विनिमय दर तथा रूपान्तरण औजार।',
      source: 'Nepal Rastra Bank (NRB)',
      status: 'Daily Sync',
      highlight: 'USD 134.82 buy / 135.42 sell',
    },
    {
      id: 'nepse',
      targetTab: 'nepse',
      category: 'Finance · Capital Market',
      title: 'NEPSE & IPO Pipeline',
      titleNp: 'नेप्से परिसूचक तथा आइपिओ',
      description: 'Live Nepal Stock Exchange index, turnover, top gainers/losers, company profiles, and Meroshare IPO announcements.',
      descriptionNp: 'नेप्से प्रत्यक्ष परिसूचक, दैनिक कारोबार, उत्कृष्ट कम्पनीहरू र नयाँ आइपिओ निष्कासन।',
      source: 'Nepal Stock Exchange (NEPSE)',
      status: 'Floor Trading',
      highlight: 'Index 2,748.15 (+1.42%)',
    },
    {
      id: 'calendar',
      targetTab: 'calendar',
      category: 'Tools · Calendar',
      title: 'Bikram Sambat Calendar & Converter',
      titleNp: 'विक्रम संवत् पात्रो तथा रूपान्तरक',
      description: 'Dual Bikram Sambat (BS) and Anno Domini (AD) calendar with official public holidays, daily Tithi, and Gregorian date conversion.',
      descriptionNp: 'सार्वजनिक बिदा, तिथि, पञ्चाङ्ग तथा AD/BS मिति रूपान्तरण सहितको पूर्ण नेपाली पात्रो।',
      source: 'Nepal Panchanga Nirnayak Samiti',
      status: 'Real-time',
      highlight: timeState.bsFormattedEn,
    },
    {
      id: 'bluebook',
      targetTab: 'bluebook',
      category: 'Tools · Transport',
      title: 'Bluebook & Vehicle Tax',
      titleNp: 'ब्लुबुक तथा सवारी साधन कर',
      description: 'Provincial motor vehicle road tax calculator, renewal deadlines, penalty formulas, and DoTM license verification status.',
      descriptionNp: 'बागमती र अन्य प्रदेशका सवारी साधन कर दर, ब्लुबुक नवीकरण र लाइसेन्स जानकारी।',
      source: 'Dept. of Transport Management (DoTM)',
      status: 'FY 2083/84 Slabs',
      highlight: 'Two & Four Wheelers',
    },
    {
      id: 'sajilo',
      targetTab: 'sajilo',
      category: 'Tools · Daily Life',
      title: 'Sajilo Daily Essentials',
      titleNp: 'सजिलो दैनिक आवश्यकताहरू',
      description: 'Real-time Kalimati wholesale vegetable and fruit prices, live streaming Nepal FM radio channels, and quick citizen scratchpad.',
      descriptionNp: 'कालिमाटी फलफूल तथा तरकारी थोक दर, प्रत्यक्ष नेपाली एफएम रेडियो र दैनिक टिपनोट।',
      source: 'Kalimati Development Board & Radio Feed',
      status: 'Live Updates',
      highlight: 'Daily Market & 24/7 Radio',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-14 space-y-16 animate-fadeIn">
      {/* Editorial Statement / Hero */}
      <section className="space-y-6 pt-2 sm:pt-6">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono block">
            Digital Utility & Information Platform
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white font-sans max-w-3xl leading-[1.15]">
            {currentLang === 'ne'
              ? 'नेपालका लागि उपयोगी डिजिटल औजार तथा आधिकारिक जानकारी।'
              : 'Useful digital tools and information for Nepal.'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-sans">
            {currentLang === 'ne'
              ? 'नेपाल राष्ट्र बैंक, नेप्से, भन्सार तथा सरकारी निकायका आधिकारिक तथ्याङ्क, दैनिक जीवनका औजार र नागरिक सेवाहरू एकै ठाउँमा।'
              : 'SAARTHI is a minimal, independent platform providing authentic financial data from Nepal Rastra Bank and NEPSE, daily civic utilities, vehicle tax calculators, and public directories.'}
          </p>
        </div>

        {/* Minimal Live Status Strip (Dual Date System) */}
        <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400 font-mono border-t border-zinc-800/80 pt-4">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational</span>
          </span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span className="text-zinc-300">BS: {timeState.bsFormattedEn}</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span>AD: {timeState.adDateFormatted}</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span>{timeState.time12h} NST (+05:45)</span>
        </div>
      </section>

      {/* Small Index / Categories Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
            Platform Index
          </span>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 group"
          >
            <span>View all in Explore</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-2">
          <button
            onClick={() => onNavigateTab('finance')}
            className="text-left space-y-1 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-mono text-zinc-400 block">01 / FINANCE</span>
            <span className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors block">
              Capital & Currency
            </span>
            <span className="text-xs text-zinc-400 block">
              7 instruments (Forex, NEPSE, Gold, Tax)
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('tools')}
            className="text-left space-y-1 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-mono text-zinc-400 block">02 / TOOLS</span>
            <span className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors block">
              Daily Utilities
            </span>
            <span className="text-xs text-zinc-400 block">
              6 tools (Calendar, Bluebook, Radio)
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="text-left space-y-1 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-mono text-zinc-400 block">03 / CIVIC</span>
            <span className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors block">
              Public Directories
            </span>
            <span className="text-xs text-zinc-400 block">
              Gov services, Loksewa, Projects
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('explore')}
            className="text-left space-y-1 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-mono text-zinc-400 block">04 / RESOURCES</span>
            <span className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors block">
              Public Hubs
            </span>
            <span className="text-xs text-zinc-400 block">
              Open APIs, Media directory & Links
            </span>
          </button>
        </div>
      </section>

      {/* Featured / Selected (Sabin Paudel Projects Style) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight font-sans">
              Selected Digital Tools
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Frequently accessed financial indices, utility converters, and civic records.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            06 Curated
          </span>
        </div>

        {/* Clean Editorial List Items */}
        <div className="divide-y divide-zinc-850">
          {featuredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.targetTab)}
              className="py-6 sm:py-7 flex flex-col md:flex-row md:items-start justify-between gap-4 group cursor-pointer hover:bg-zinc-900/30 -mx-3 px-3 rounded-xl transition-all"
            >
              {/* Left Column: Number & Metadata & Titles */}
              <div className="space-y-2 flex-1 max-w-2xl">
                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>0{idx + 1}.</span>
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-400">{item.source}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors flex items-center gap-2">
                  <span>{currentLang === 'ne' ? item.titleNp : item.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-zinc-400 group-hover:text-white" />
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {currentLang === 'ne' ? item.descriptionNp : item.description}
                </p>
              </div>

              {/* Right Column: Key Highlight Metric & Open Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-1">
                <span className="text-xs sm:text-sm font-mono text-zinc-300 tabular-nums">
                  {item.highlight}
                </span>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
                  <span>View</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore SAARTHI Callout Link */}
      <section className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Explore All Tools & Civic Directories
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Browse the complete index of 24+ calculators, authentic financial feeds, transport utilities, government services, and public web archives.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('explore')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
        >
          <span>Open Complete Index</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Core Principles & Transparency Teaser */}
      <section className="border-t border-zinc-800/80 pt-10 space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
          Principles & Standards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-zinc-400 leading-relaxed font-sans">
          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-200 block text-sm">Authentic Data Only</span>
            <p>Every exchange rate, bullion quote, and stock metric comes directly from verified public authorities (NRB, NEPSE, FENEGOSIDA). No estimates or mock data.</p>
          </div>
          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-200 block text-sm">Local Storage Privacy</span>
            <p>Calculations, scratchpad notes, and encrypted document vault files remain exclusively within your browser’s local storage. Zero telemetry trackers.</p>
          </div>
          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-200 block text-sm">Dual Calendar Engine</span>
            <p>Full support for Nepal’s official Bikram Sambat (BS) calendar and Gregorian (AD) dates across every timestamp, audit record, and calculator.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
