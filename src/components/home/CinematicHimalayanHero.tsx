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
  Building2,
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
          HERO BANNER - REFINED SOLID SURFACE (SAJILO SPEC)
          ========================================================================= */}
      <section className="surface-card p-6 sm:p-8 rounded-[12px] space-y-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/30 text-[var(--color-accent-mark)] font-mono text-[11px] font-semibold uppercase tracking-wider">
            <span className="live-status-dot" />
            <span>{currentLang === 'ne' ? 'सारथी नागरिक तथा वित्तीय इन्जिन' : 'SAARTHI CIVIC & FINANCIAL ENGINE'}</span>
          </div>

          <div className="text-[11px] font-mono px-2.5 py-1 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-accent-mark)] font-semibold">{timeState.bsFormattedEn} BS</span> ({timeState.adDateFormatted} AD) • {timeState.time12h}
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-[var(--color-text)]">
            {currentLang === 'ne' ? (
              <>नेपालको एकीकृत नागरिक तथा वित्तीय डिजिटल प्लेटफर्म</>
            ) : (
              <>Nepal’s Unified Civic & Financial Intelligence Platform</>
            )}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {currentLang === 'ne'
              ? 'नेप्से सेयर बजार, नेपाल राष्ट्र बैंकको विनिमय दर, आयकर गणक, ई-प्यान, लोक सेवा विज्ञापन र नागरिक सेवाहरूको आधिकारिक रियल-टाइम प्रणाली।'
              : 'Authentic NEPSE stock market metrics, verified NRB exchange rates, IRD tax calculations, Bikram Sambat calendar, and citizen utilities in one clean, reliable workspace.'}
          </p>
        </div>

        {/* Primary Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => handleNav('sajilo')}
            className="px-3.5 py-2 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 active:scale-[0.99] font-medium text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'सजिलो (दैनिक जीवन)' : 'Sajilo (Daily Essentials)'}</span>
          </button>

          <button
            onClick={onExploreModules}
            className="px-3.5 py-2 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span>{currentLang === 'ne' ? 'सबै सेवाहरू हेर्नुहोस्' : 'Explore All Services'}</span>
          </button>

          <button
            onClick={() => handleNav('services')}
            className="px-3.5 py-2 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)] text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>{currentLang === 'ne' ? 'सरकारी सेवाहरू' : 'Civic Portals'}</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          LIVE TELEMETRY DASHBOARD BAR
          ========================================================================= */}
      <section className="surface-card p-4 sm:p-5 rounded-[12px] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-divider)] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="live-status-dot" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              {currentLang === 'ne' ? 'प्रत्यक्ष बजार तथा वित्तीय सूचक' : 'LIVE FINANCIAL & MARKET TELEMETRY'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-positive)]" />
            <span>NRB & NEPSE Sync: <strong className="text-[var(--color-positive)]">100% Operational</strong></span>
          </div>
        </div>

        {/* 4 Stat Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div
            onClick={() => handleNav('nepse')}
            className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <p className="text-[var(--color-text-muted)] text-[10px] font-mono uppercase tracking-wider">NEPSE INDEX</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-semibold text-base sm:text-lg text-[var(--color-text)]">2,748.15</span>
              <span className="text-[10px] font-mono font-medium text-[var(--color-positive)] bg-[var(--color-positive)]/10 px-1.5 py-0.2 rounded border border-[var(--color-positive)]/20">
                +1.42%
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">Turnover: NPR 6.82B</p>
          </div>

          <div
            onClick={() => handleNav('forex')}
            className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <p className="text-[var(--color-text-muted)] text-[10px] font-mono uppercase tracking-wider">USD / NPR RATE</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-semibold text-base sm:text-lg text-[var(--color-text)]">134.85</span>
              <span className="text-[10px] font-mono font-medium text-[var(--color-positive)] bg-[var(--color-positive)]/10 px-1.5 py-0.2 rounded border border-[var(--color-positive)]/20">
                Official NRB
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">Buy: 134.25 | Sell: 134.85</p>
          </div>

          <div
            onClick={() => handleNav('forex')}
            className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <p className="text-[var(--color-text-muted)] text-[10px] font-mono uppercase tracking-wider">GOLD 24K / TOLA</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-semibold text-base sm:text-lg text-[var(--color-accent-mark)]">1,68,500</span>
              <span className="text-[10px] font-mono font-medium text-[var(--color-accent-mark)] bg-[var(--color-accent-muted)] px-1.5 py-0.2 rounded border border-[var(--color-accent-mark)]/30">
                FENEGOSIDA
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">Fine Gold 999.9</p>
          </div>

          <div
            onClick={() => handleNav('tax')}
            className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <p className="text-[var(--color-text-muted)] text-[10px] font-mono uppercase tracking-wider">INCOME TAX ENGINE</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-semibold text-base sm:text-lg text-[var(--color-text)]">FY 2081/82</span>
              <span className="text-[10px] font-mono font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-1.5 py-0.2 rounded border border-[var(--color-border)]">
                IRD Verified
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">1% SST to 39% Top Slab</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED MODULE CARDS GRID
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--color-divider)] pb-2">
          <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
            <span>{currentLang === 'ne' ? 'मुख्य नागरिक सेवाहरू' : 'Core Civic & Financial Modules'}</span>
          </h2>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">4 CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Module 1: NEPSE */}
          <div
            onClick={() => handleNav('nepse')}
            className="surface-card p-4 rounded-[10px] cursor-pointer hover:bg-[var(--color-surface-hover)] space-y-2.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/25 flex items-center justify-center text-[var(--color-accent-mark)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors flex items-center justify-between">
                <span>NEPSE Market</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)]" />
              </h3>
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                Live indices, top gainers/losers, company profiles, and real-time trading floor updates.
              </p>
            </div>
          </div>

          {/* Module 2: Tax Calc */}
          <div
            onClick={() => handleNav('tax')}
            className="surface-card p-4 rounded-[10px] cursor-pointer hover:bg-[var(--color-surface-hover)] space-y-2.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/25 flex items-center justify-center text-[var(--color-accent-mark)]">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors flex items-center justify-between">
                <span>Income Tax Engine</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)]" />
              </h3>
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                Automated IRD tax calculations for individual and married income slabs with e-PAN guidance.
              </p>
            </div>
          </div>

          {/* Module 3: Forex & Gold */}
          <div
            onClick={() => handleNav('forex')}
            className="surface-card p-4 rounded-[10px] cursor-pointer hover:bg-[var(--color-surface-hover)] space-y-2.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/25 flex items-center justify-center text-[var(--color-accent-mark)]">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors flex items-center justify-between">
                <span>NRB Forex & Commodities</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)]" />
              </h3>
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                Official Nepal Rastra Bank exchange rates, gold/silver bullion, and NOC fuel prices.
              </p>
            </div>
          </div>

          {/* Module 4: Gov Portals */}
          <div
            onClick={() => handleNav('services')}
            className="surface-card p-4 rounded-[10px] cursor-pointer hover:bg-[var(--color-surface-hover)] space-y-2.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/25 flex items-center justify-center text-[var(--color-accent-mark)]">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors flex items-center justify-between">
                <span>Government Services</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)]" />
              </h3>
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                Direct access to Nagarik App, Lok Sewa, Bluebook tax guidance, and official ministry portals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
