import React from 'react';
import {
  TrendingUp,
  Landmark,
  FileText,
  ShieldCheck,
  Receipt,
  ArrowUpRight,
  Sparkles,
  Zap,
  ChevronRight,
  Cpu,
  Globe,
  Compass,
  CheckCircle2,
  Building2,
  Briefcase
} from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useLiveData } from '../../utils/liveDataEngine';

interface CinematicHimalayanHeroProps {
  currentLang: 'en' | 'ne';
  onExploreModules: () => void;
  onOpenVision?: () => void;
  onSelectModule?: (moduleId: string) => void;
  onNavigateTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
  onOpenAdminModal?: () => void;
}

export const CinematicHimalayanHero: React.FC<CinematicHimalayanHeroProps> = ({
  currentLang,
  onExploreModules,
  onNavigateTab,
  theme = 'dark',
}) => {
  const { timeState } = useGlobalTime();
  const isDark = theme === 'dark';

  // Fetch live market data preview
  const liveMarket = useLiveData<any>('nepse-market');

  // Handle direct navigation
  const handleNav = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      onExploreModules();
    }
  };

  return (
    <div className="space-y-10 pb-8 pt-4 max-w-7xl mx-auto px-4 sm:px-6">
      {/* =========================================================================
          HERO BANNER - CINEMATIC SAARTHI HIMALAYAN BRANDING
          ========================================================================= */}
      <section className={`relative rounded-3xl p-8 sm:p-12 overflow-hidden border transition-colors ${
        isDark
          ? 'bg-slate-900 border-slate-800 shadow-xl text-white'
          : 'bg-white border-slate-200 shadow-md text-slate-900'
      }`}>
        {/* Subtle Himalayan Decorative Ambient Backdrop Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Eyebrow Status Badge with Live Clock */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{currentLang === 'ne' ? 'सारथी नागरिक तथा वित्तीय इन्जिन' : 'SAARTHI CIVIC & FINANCIAL ENGINE'}</span>
            </div>

            <div className={`text-xs font-mono px-3 py-1 rounded-full border ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <span className="text-amber-400 font-bold">{timeState.bsFormattedEn} BS</span> ({timeState.adDateFormatted} AD) • {timeState.time12h}
            </div>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] font-sans">
            {currentLang === 'ne' ? (
              <>
                नेपालको एकीकृत <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">नागरिक तथा वित्तीय</span> डिजिटल प्लेटफर्म
              </>
            ) : (
              <>
                Nepal’s Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Civic & Financial</span> Intelligence Platform
              </>
            )}
          </h1>

          {/* Hero Description */}
          <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {currentLang === 'ne'
              ? 'नेप्से सेयर बजार, नेपाल राष्ट्र बैंकको विनिमय दर, आयकर गणक, ई-प्यान, लोक सेवा विज्ञापन र नागरिक सेवाहरूको आधिकारिक रियल-टाइम प्रणाली।'
              : 'Access live NEPSE indices, verified NRB exchange rates, automated tax calculators, e-PAN guidelines, Lok Sewa notices, and civic utilities in one place.'}
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreModules}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2.5 transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{currentLang === 'ne' ? 'सबै सेवाहरू हेर्नुहोस्' : 'Explore All Modules'}</span>
            </button>

            <button
              onClick={() => handleNav('services')}
              className={`px-6 py-3.5 rounded-2xl border font-extrabold text-sm transition-all flex items-center gap-2.5 transform active:scale-95 ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'ne' ? 'सरकारी सेवा केन्द्र' : 'Government Services'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE TELEMETRY DASHBOARD BAR
          ========================================================================= */}
      <section className={`p-6 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-lg'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              {currentLang === 'ne' ? 'प्रत्यक्ष बजार तथा वित्तीय सूचक' : 'LIVE MARKET & FINANCIAL TELEMETRY'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NRB & NEPSE Sync Status: <strong>100% Operational</strong></span>
          </div>
        </div>

        {/* 4 Stat Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => handleNav('nepse')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">NEPSE INDEX</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-black text-xl text-white">2,748.15</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                +1.42%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Turnover: NPR 6.82B</p>
          </div>

          <div
            onClick={() => handleNav('forex')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">USD / NPR RATE</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-black text-xl text-white">134.85</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Official NRB
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Buy: 134.25 | Sell: 134.85</p>
          </div>

          <div
            onClick={() => handleNav('forex')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">GOLD 24K / TOLA</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-black text-xl text-amber-400">1,68,500</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                FENGODA Rate
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Fine Gold 999.9</p>
          </div>

          <div
            onClick={() => handleNav('tax')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">INCOME TAX ENGINE</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-black text-xl text-white">FY 2081/82</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                IRD Verified
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">1% SST to 39% Top Slab</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED MODULE CARDS GRID
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>{currentLang === 'ne' ? 'मुख्य नागरिक सेवाहरू' : 'Core Civic & Financial Suite'}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">4 CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: NEPSE */}
          <div
            onClick={() => handleNav('nepse')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xl space-y-4 group ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>NEPSE Market</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Live indices, top gainers/losers, company profiles, and real-time trading floor updates.
              </p>
            </div>
          </div>

          {/* Module 2: Tax Calc */}
          <div
            onClick={() => handleNav('tax')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xl space-y-4 group ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Income Tax Engine</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automated IRD tax calculations for individual and married income slabs with e-PAN guidance.
              </p>
            </div>
          </div>

          {/* Module 3: Forex & Gold */}
          <div
            onClick={() => handleNav('forex')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xl space-y-4 group ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>NRB Forex & Commodities</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Official Nepal Rastra Bank exchange rates, gold/silver bullion, and NOC fuel prices.
              </p>
            </div>
          </div>

          {/* Module 4: Gov Portals */}
          <div
            onClick={() => handleNav('gov-services')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-xl space-y-4 group ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Government Services</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Direct access to Nagarik App, Lok Sewa, Bluebook tax guidance, and official ministry portals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


