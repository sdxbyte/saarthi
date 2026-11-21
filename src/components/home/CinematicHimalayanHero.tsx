import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Landmark,
  FileText,
  ShieldCheck,
  Receipt,
  ArrowUpRight,
  Sparkles,
  Zap,
  Building2,
  Globe,
  ShoppingBag,
  Film,
  LayoutDashboard,
  Calendar,
} from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

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
}) => {
  const { timeState } = useGlobalTime();

  const handleNav = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      onExploreModules();
    }
  };

  return (
    <div className="space-y-6 pb-6 pt-2 max-w-7xl mx-auto w-full">
      {/* =========================================================================
          AI2.DESIGN INSPIRED HERO BENTO GRID
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Bento Tile 1: Main Platform Console (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between relative overflow-hidden group shadow-xl">
          {/* Ambient Radial Sheen */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/15 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{currentLang === 'ne' ? 'सारथी नागरिक तथा वित्तीय इन्जिन' : 'SAARTHI CIVIC & FINANCIAL ENGINE'}</span>
              </div>

              <div className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-800 bg-slate-900/80 text-slate-400">
                <span className="text-red-400 font-bold">{timeState.bsFormattedEn} BS</span> ({timeState.adDateFormatted} AD)
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                {currentLang === 'ne' ? (
                  <>नेपालको एकीकृत नागरिक तथा वित्तीय डिजिटल प्लेटफर्म</>
                ) : (
                  <>Nepal’s Unified Civic & Financial Intelligence Platform</>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                {currentLang === 'ne'
                  ? 'नेप्से सेयर बजार, नेपाल राष्ट्र बैंकको विनिमय दर, आयकर गणक, ई-प्यान, लोक सेवा विज्ञापन र नागरिक सेवाहरूको आधिकारिक रियल-टाइम प्रणाली।'
                  : 'Authentic NEPSE stock market metrics, verified NRB exchange rates, IRD tax calculations, Bikram Sambat calendar, and citizen utilities in one clean, reliable workspace.'}
              </p>
            </div>
          </div>

          {/* Primary Action Controls Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-4 border-t border-slate-800/80 relative z-10">
            <button
              onClick={() => handleNav('sitehub')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'AllSiteHub मिडिया हब' : 'AllSiteHub Directory'}</span>
            </button>

            <button
              onClick={() => handleNav('links')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentLang === 'ne' ? 'उपयोगी लिङ्कहरू' : 'Useful Links & FMHY'}</span>
            </button>

            <button
              onClick={() => handleNav('sajilo')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'ne' ? 'सजिलो (दैनिक जीवन)' : 'Sajilo (Daily Essentials)'}</span>
            </button>

            <button
              onClick={onExploreModules}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>{currentLang === 'ne' ? 'सबै सेवाहरू' : 'All 45 Services'}</span>
            </button>

            <button
              onClick={() => handleNav('services')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLang === 'ne' ? 'सरकारी सेवाहरू' : 'Civic Portals'}</span>
            </button>
          </div>
        </div>

        {/* Bento Tile 2: Operational Telemetry Radar (4 Cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                System Radar
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Sync 100%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeState.time12h}</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Kathmandu ({timeState.tzAbbrev})</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">45+</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Verified Services</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">2083 BS</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Official Calendar</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">NRB / NOC</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Direct Feeds</div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Immutable Audit Active</span>
            </span>
            <span className="text-slate-300 font-bold">v1.8.2</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE TELEMETRY BENTO BAR (4 INTERLOCKING TILES)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              {currentLang === 'ne' ? 'प्रत्यक्ष बजार तथा वित्तीय सूचक' : 'LIVE FINANCIAL & MARKET TELEMETRY'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NRB & NEPSE Sync: <strong className="text-emerald-400">100% Operational</strong></span>
          </div>
        </div>

        {/* 4 Interlocking Bento Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Bento Tile 1: NEPSE Index */}
          <div
            onClick={() => handleNav('nepse')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">NEPSE INDEX</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +1.42%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-mono font-black text-2xl text-white group-hover:text-emerald-300 transition-colors">2,748.15</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                <span>Turnover: NPR 6.82B</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>

          {/* Bento Tile 2: USD / NPR Forex */}
          <div
            onClick={() => handleNav('forex')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">USD / NPR FOREX</span>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Official NRB
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-mono font-black text-2xl text-white group-hover:text-cyan-300 transition-colors">134.85</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                <span>Buy: 134.25 | Sell: 134.85</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>

          {/* Bento Tile 3: Bullion Gold */}
          <div
            onClick={() => handleNav('forex')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">GOLD 24K / TOLA</span>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                FENEGOSIDA
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-mono font-black text-2xl text-amber-400 group-hover:text-amber-300 transition-colors">1,68,500</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                <span>Fine Gold 999.9</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>

          {/* Bento Tile 4: Income Tax IRD */}
          <div
            onClick={() => handleNav('tax')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">INCOME TAX ENGINE</span>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                IRD Verified
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-mono font-black text-2xl text-white group-hover:text-purple-300 transition-colors">FY 2081/82</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                <span>1% SST to 39% Top Slab</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ASYMMETRICAL CONSOLE BENTO SUITE (AI2.DESIGN INSPIRED)
          ========================================================================= */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-red-500" />
            <span>{currentLang === 'ne' ? 'सारथी एकीकृत कन्सोल बेन्टो' : 'SAARTHI Unified Console Bento'}</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">7 INTERLOCKING MODULES</span>
        </div>

        {/* Row 1: Asymmetrical 8 + 4 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Card 1 (Span 8): FMHY & Curated Useful Links Mega Hub */}
          <div
            onClick={() => handleNav('links')}
            className="lg:col-span-8 p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">Free Media & Dev Index</div>
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {currentLang === 'ne' ? 'उपयोगी लिङ्कहरू र खुला स्रोत हब (FMHY र Sajilo)' : 'Curated Useful Links & FMHY Web Index'}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  10,000+ Curated Links
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                {currentLang === 'ne'
                  ? 'आदर्श आचार्यको Sajilo रिपोजिटरी, FMHY.net मेगा डाइरेक्टरी, निःशुल्क एआई, विकासकर्ता औजार, र व्यक्तिगत बुकमार्कहरू।'
                  : 'Direct access to Adarsha Acharya’s Sajilo repository, FMHY.net free media & software mega-index, dev tools, and personal bookmarks.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <span className="text-slate-300">FMHY.net</span>
                <span>·</span>
                <span className="text-cyan-400">GitHub Open Source</span>
                <span>·</span>
                <span>Adarsha Acharya Sajilo</span>
                <span>·</span>
                <span className="text-emerald-400">Ad-Free Guides</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-400 font-mono text-[11px]">Free, Open-Source & Community Curated</span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold group-hover:translate-x-1 transition-all">
                <span>Explore Links Hub</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2 (Span 4): AllSiteHub Streaming Directory */}
          <div
            onClick={() => handleNav('sitehub')}
            className="lg:col-span-4 p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Film className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  97+ Platforms
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Streaming Console</div>
                <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                  {currentLang === 'ne' ? 'AllSiteHub मिडिया डाइरेक्टरी' : 'AllSiteHub Directory'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentLang === 'ne'
                    ? 'चलचित्र, एनिमे, माङ्गा, लाइभ टिभी, खेलकुद तथा नेपाली स्ट्रिमिङ हब।'
                    : 'Curated streaming platforms for movies, anime, manga, live sports & Nepali channels.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="text-slate-300">1080p HD</span>
                <span>·</span>
                <span className="text-emerald-400">Auto-Sync 6h</span>
                <span>·</span>
                <span>No Downloads</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-400 font-mono text-[11px]">Web Native</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold group-hover:translate-x-1 transition-all">
                <span>Open AllSiteHub</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Triple 4-Column Bento Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 3: Sajilo Daily Life Hub */}
          <div
            onClick={() => handleNav('sajilo')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">14 Tools Active</span>
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                {currentLang === 'ne' ? 'सजिलो दैनिक हब' : 'Sajilo Daily Essentials'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === 'ne'
                  ? 'कालिमाटी तरकारी बजार, सुनचाँदी, पेट्रोल, अनलाइन रेडियो, राशिफल, र व्यक्तिगत किपर।'
                  : 'Kalimati daily wholesale produce, gold bullion, live radio streams, and daily keeper.'}
              </p>
            </div>

            <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="text-slate-400 text-[11px] font-mono">Bazar & Audio</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Card 4: Civic Portals & Lok Sewa Engine */}
          <div
            onClick={() => handleNav('services')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">45 Services</span>
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-red-300 transition-colors">
                {currentLang === 'ne' ? 'नागरिक सेवा तथा लोक सेवा' : 'Civic Portals & Lok Sewa'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === 'ne'
                  ? 'नागरिक एप, लोक सेवा आयोग विज्ञापन, सवारी चालक अनुमतिपत्र र राजस्व भुक्तानी।'
                  : 'Nagarik app access, Lok Sewa jobs, driving license tracking, and bluebook tax.'}
              </p>
            </div>

            <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-red-400 font-medium">
              <span className="text-slate-400 text-[11px] font-mono">Official Ministries</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Card 5: Financial Intelligence & NEPSE Floor */}
          <div
            onClick={() => handleNav('nepse')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Live NEPSE</span>
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                {currentLang === 'ne' ? 'नेप्से सेयर बजार इन्जिन' : 'NEPSE Market & IPO Engine'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === 'ne'
                  ? 'लाइभ इन्डेक्स, टप गेनर्स, कम्पनी प्रोफाइल, र आगामी आईपीओ निष्कासन विवरण।'
                  : 'Live indices, top gainers, company profiles, and verified upcoming IPO filings.'}
              </p>
            </div>

            <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span className="text-slate-400 text-[11px] font-mono">Stock Exchange</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* Row 3: Dual 6-Column Bento Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 6: Bikram Sambat Calendar & Tithi */}
          <div
            onClick={() => handleNav('calendar')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-purple-400">Official Panchanga & Tithi</div>
                <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Bikram Sambat 2083 Calendar & Shubha Saait
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Accurate dual AD/BS conversion, Nepali festival dates, and auspicious marriage times.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 shrink-0 ml-2" />
          </div>

          {/* Card 7: Immutable Audit & Sovereign Transparency */}
          <div
            onClick={() => handleNav('vision')}
            className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">Integrity Architecture</div>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                  Immutable Audit & Verified Financial Sources
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% verified NRB, NEPSE, and IRD data with permanent audit trail and zero mock estimations.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
          </div>
        </div>
      </section>
    </div>
  );
};
