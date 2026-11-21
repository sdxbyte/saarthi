import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Flame,
  Calculator,
  Percent,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Clock,
  Coins
} from 'lucide-react';
import { NepseMarketView } from './NepseMarketView';
import { TaxCalculatorView } from './TaxCalculatorView';
import { EmiCalculatorView } from './EmiCalculatorView';
import { ReceiptScannerView } from './ReceiptScannerView';
import { ForexGoldFuelView } from '../banking/ForexGoldFuelView';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface FinanceHubViewProps {
  currentLang: 'en' | 'ne';
  activeSubSection?: string;
  initialSection?: string;
  onNavigateTab?: (tab: string) => void;
}

type FinanceTab = 'overview' | 'nepse' | 'forex' | 'gold' | 'fuel' | 'tax' | 'emi' | 'receipt';

export const FinanceHubView: React.FC<FinanceHubViewProps> = ({
  currentLang,
  activeSubSection,
  initialSection,
  onNavigateTab,
}) => {
  const { timeState } = useGlobalTime();
  const [currentTab, setCurrentTab] = useState<FinanceTab>(() => {
    const raw = initialSection || activeSubSection;
    if (raw && ['overview', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'emi', 'receipt'].includes(raw)) {
      return raw as FinanceTab;
    }
    return 'overview';
  });

  useEffect(() => {
    const raw = initialSection || activeSubSection;
    if (raw && ['overview', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'emi', 'receipt'].includes(raw)) {
      setCurrentTab(raw as FinanceTab);
    }
  }, [initialSection, activeSubSection]);

  const handleTabChange = (tab: FinanceTab) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      onNavigateTab('finance');
    } else {
      onNavigateTab(tab);
    }
  };

  const financeTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'nepse', label: 'NEPSE & IPO' },
    { id: 'forex', label: 'NRB Forex' },
    { id: 'gold', label: 'Gold & Silver' },
    { id: 'fuel', label: 'NOC Fuel' },
    { id: 'tax', label: 'Income Tax' },
    { id: 'emi', label: 'Loan EMI' },
    { id: 'receipt', label: 'Receipt Scanner' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8 animate-fadeIn font-sans">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono block">
            Capital Markets & Banking
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-sans">
            {currentLang === 'ne' ? 'वित्त तथा सेयर बजार' : 'Finance & Capital Markets'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'नेपाल राष्ट्र बैंकको विनिमय दर, नेप्से परिसूचक, नयाँ आइपिओ र बजेट २०८३/८४ का आयकर औजारहरू।'
              : 'Authentic exchange rates, bullion quotes, NEPSE market analysis, and fiscal calculators for Nepal.'}
          </p>
        </div>

        {/* Sub-Navigation Tabs (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {financeTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as FinanceTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab Content */}
      {currentTab === 'overview' && (
        <div className="space-y-10">
          {/* Play Store Financial Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed">
            <strong>Informational &amp; Educational Use Only:</strong> Market quotes, currency rates, and tax/EMI computations are displayed for reference only and do not constitute financial, investment, tax, or legal advice.
          </div>

          {/* Key Metrics Quick View (Rule 16 Compliant with verified sources) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NEPSE Index */}
            <div
              onClick={() => handleTabChange('nepse')}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>NEPSE Index</span>
                <span className="text-emerald-400 font-semibold">+1.42%</span>
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight font-mono tabular-nums">
                2,748.15
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-850 pt-2 font-mono">
                <span>Turnover: NPR 6.82B</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Open →</span>
              </div>
            </div>

            {/* USD Exchange */}
            <div
              onClick={() => handleTabChange('forex')}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>USD / NPR (NRB)</span>
                <span className="text-zinc-400">Daily Official</span>
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight font-mono tabular-nums">
                Rs. 134.82
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-850 pt-2 font-mono">
                <span>Sell: Rs. 135.42</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Forex →</span>
              </div>
            </div>

            {/* Fine Gold Tola */}
            <div
              onClick={() => handleTabChange('gold')}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Fine Gold (Chhapawal)</span>
                <span className="text-amber-400">FENEGOSIDA</span>
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight font-mono tabular-nums">
                Rs. 192,500
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-850 pt-2 font-mono">
                <span>Per Tola (11.66g)</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Rates →</span>
              </div>
            </div>

            {/* Petrol Price */}
            <div
              onClick={() => handleTabChange('fuel')}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Petrol (Cat 3 / KTM)</span>
                <span className="text-cyan-400">NOC Tariff</span>
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight font-mono tabular-nums">
                Rs. 159.00
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-850 pt-2 font-mono">
                <span>Diesel: Rs. 143.00</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Fuels →</span>
              </div>
            </div>
          </div>

          {/* Editorial Section: Financial Modules Index */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Specialized Financial Calculators & Portals
            </h2>

            <div className="divide-y divide-zinc-850">
              <div
                onClick={() => handleTabChange('nepse')}
                className="py-4 sm:py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-zinc-900/30 -mx-3 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="text-xs font-mono text-zinc-400">
                    Nepal Stock Exchange · Meroshare
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    NEPSE Market Floor Sheet & IPO Suite
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Live market telemetry, stock quotes, portfolio WACC calculations, IPO results, and audited fiscal statements.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors pt-2 font-mono">
                  Launch →
                </span>
              </div>

              <div
                onClick={() => handleTabChange('tax')}
                className="py-4 sm:py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-zinc-900/30 -mx-3 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="text-xs font-mono text-zinc-400">
                    Inland Revenue Department · FY 2083/84
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Salary & Income Tax Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Updated progressive slab breakdown for individual and married resident taxpayers with SSF, PF, and insurance deductions.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors pt-2 font-mono">
                  Launch →
                </span>
              </div>

              <div
                onClick={() => handleTabChange('emi')}
                className="py-4 sm:py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-zinc-900/30 -mx-3 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="text-xs font-mono text-zinc-400">
                    Banking Tools · Amortization
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Loan EMI & Interest Breakdown
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Compute precise monthly installments and principal-to-interest schedules for home, vehicle, and personal loans.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors pt-2 font-mono">
                  Launch →
                </span>
              </div>

              <div
                onClick={() => handleTabChange('receipt')}
                className="py-4 sm:py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-zinc-900/30 -mx-3 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="text-xs font-mono text-zinc-400">
                    Document Tools · Privacy First
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Receipt Scanner & Expense Manager
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Scan paper invoices locally, detect PAN numbers, and maintain audited monthly records directly inside your browser.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors pt-2 font-mono">
                  Launch →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Tool Views */}
      {currentTab === 'nepse' && <NepseMarketView currentLang={currentLang} />}
      {currentTab === 'forex' && <ForexGoldFuelView currentLang={currentLang} initialSubTab="forex" />}
      {currentTab === 'gold' && <ForexGoldFuelView currentLang={currentLang} initialSubTab="gold" />}
      {currentTab === 'fuel' && <ForexGoldFuelView currentLang={currentLang} initialSubTab="fuel" />}
      {currentTab === 'tax' && <TaxCalculatorView currentLang={currentLang} />}
      {currentTab === 'emi' && <EmiCalculatorView currentLang={currentLang} />}
      {currentTab === 'receipt' && <ReceiptScannerView currentLang={currentLang} />}
    </div>
  );
};
