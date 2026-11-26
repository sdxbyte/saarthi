import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { NepseMarketView } from './NepseMarketView';
import { TaxCalculatorView } from './TaxCalculatorView';
import { EmiCalculatorView } from './EmiCalculatorView';
import { ReceiptScannerView } from './ReceiptScannerView';
import { ForexGoldFuelView } from '../banking/ForexGoldFuelView';
import { Card } from '../ui';

interface FinanceHubViewProps {
  currentLang: 'en' | 'ne';
  activeSubSection?: string;
  initialSection?: string;
  onNavigateTab?: (tab: string) => void;
}

type FinanceTab = 'overview' | 'nepse' | 'forex' | 'gold' | 'fuel' | 'tax' | 'emi' | 'receipt';

interface FeedCardState {
  loading: boolean;
  value: string;
  subline: string;
  source: string;
  timestamp: string;
  available: boolean;
}

const UNAVAILABLE = 'Official data is currently unavailable.';

export const FinanceHubView: React.FC<FinanceHubViewProps> = ({
  currentLang,
  activeSubSection,
  initialSection,
  onNavigateTab,
}) => {
  const isNe = currentLang === 'ne';
  const [currentTab, setCurrentTab] = useState<FinanceTab>(() => {
    const raw = initialSection || activeSubSection;
    if (
      raw &&
      ['overview', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'emi', 'receipt'].includes(raw)
    ) {
      return raw as FinanceTab;
    }
    return 'overview';
  });

  const [refreshTick, setRefreshTick] = useState(0);
  const [feeds, setFeeds] = useState<{
    nepse: FeedCardState;
    forex: FeedCardState;
    gold: FeedCardState;
    fuel: FeedCardState;
  }>({
    nepse: {
      loading: true,
      value: 'Loading...',
      subline: 'NEPSE Live Index',
      source: 'Nepal Stock Exchange',
      timestamp: '',
      available: false,
    },
    forex: {
      loading: true,
      value: 'Loading...',
      subline: 'USD / NPR Reference',
      source: 'Nepal Rastra Bank',
      timestamp: '',
      available: false,
    },
    gold: {
      loading: true,
      value: 'Loading...',
      subline: 'Fine Gold (Chhapawal)',
      source: 'FENEGOSIDA',
      timestamp: '',
      available: false,
    },
    fuel: {
      loading: true,
      value: 'Loading...',
      subline: 'Nepal Oil Corporation',
      source: 'NOC Retail Tariff',
      timestamp: '',
      available: false,
    },
  });

  useEffect(() => {
    const raw = initialSection || activeSubSection;
    if (
      raw &&
      ['overview', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'emi', 'receipt'].includes(raw)
    ) {
      setCurrentTab(raw as FinanceTab);
    }
  }, [initialSection, activeSubSection]);

  useEffect(() => {
    let cancelled = false;
    async function loadAuthenticOverview() {
      const [nepseRes, forexRes, metalsRes, fuelRes] = await Promise.allSettled([
        fetch('/api/live/nepse').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/live/forex').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/live/metals').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/live/fuel').then((r) => (r.ok ? r.json() : null)),
      ]);
      if (cancelled) return;

      // 1. NEPSE
      let nepse: FeedCardState = {
        loading: false,
        value: UNAVAILABLE,
        subline: 'Nepal Stock Exchange',
        source: 'NEPSE',
        timestamp: '',
        available: false,
      };
      if (nepseRes.status === 'fulfilled' && nepseRes.value?.data) {
        const idx = nepseRes.value.data?.index || nepseRes.value.data?.indices?.[0];
        if (idx && typeof idx.value === 'number') {
          const sign = (idx.pChange ?? 0) >= 0 ? '+' : '';
          nepse = {
            loading: false,
            value: `${idx.value.toFixed(2)}`,
            subline: `Change: ${sign}${Number(idx.pChange ?? 0).toFixed(2)}%`,
            source: nepseRes.value.sourceName || 'Nepal Stock Exchange',
            timestamp: nepseRes.value.lastUpdated || nepseRes.value.adDate || '',
            available: true,
          };
        }
      }

      // 2. NRB Forex
      let forex: FeedCardState = {
        loading: false,
        value: UNAVAILABLE,
        subline: 'Nepal Rastra Bank',
        source: 'NRB Forex',
        timestamp: '',
        available: false,
      };
      if (forexRes.status === 'fulfilled' && forexRes.value?.data) {
        const rates = Array.isArray(forexRes.value.data)
          ? forexRes.value.data
          : forexRes.value.data?.rates || [];
        const usd = rates.find(
          (r: any) => String(r.code || r.currency?.iso3 || '').toUpperCase() === 'USD'
        );
        if (usd && (usd.buy || usd.sell)) {
          forex = {
            loading: false,
            value: `Rs. ${usd.buy}`,
            subline: `Sell: Rs. ${usd.sell} · USD/NPR`,
            source: forexRes.value.sourceName || 'Nepal Rastra Bank',
            timestamp: forexRes.value.lastUpdated || forexRes.value.adDate || '',
            available: true,
          };
        }
      }

      // 3. FENEGOSIDA Bullion
      let gold: FeedCardState = {
        loading: false,
        value: UNAVAILABLE,
        subline: 'FENEGOSIDA Daily Fixing',
        source: 'FENEGOSIDA',
        timestamp: '',
        available: false,
      };
      if (metalsRes.status === 'fulfilled' && metalsRes.value?.data) {
        const items = Array.isArray(metalsRes.value.data)
          ? metalsRes.value.data
          : metalsRes.value.data?.rates || [];
        const fine = items.find((m: any) =>
          /fine|hallmark|chapawal/i.test(String(m.item || m.name || ''))
        );
        if (fine && fine.perTola) {
          gold = {
            loading: false,
            value: `Rs. ${Number(fine.perTola).toLocaleString()}`,
            subline: 'Fine Gold per Tola (11.66g)',
            source: metalsRes.value.sourceName || 'FENEGOSIDA',
            timestamp: metalsRes.value.lastUpdated || metalsRes.value.adDate || '',
            available: true,
          };
        }
      }

      // 4. NOC Fuel
      let fuel: FeedCardState = {
        loading: false,
        value: UNAVAILABLE,
        subline: 'Nepal Oil Corporation',
        source: 'NOC',
        timestamp: '',
        available: false,
      };
      if (fuelRes.status === 'fulfilled' && fuelRes.value?.data) {
        const items = Array.isArray(fuelRes.value.data)
          ? fuelRes.value.data
          : fuelRes.value.data?.tariffs || [];
        const petrol = items.find((f: any) => /petrol/i.test(String(f.item || f.name || '')));
        if (petrol && (petrol.priceNpr || petrol.price)) {
          const price = petrol.priceNpr ?? petrol.price;
          fuel = {
            loading: false,
            value: `Rs. ${Number(price).toFixed(2)}`,
            subline: 'Petrol Retail Tariff / Litre',
            source: fuelRes.value.sourceName || 'Nepal Oil Corporation',
            timestamp: fuelRes.value.lastUpdated || fuelRes.value.adDate || '',
            available: true,
          };
        }
      }

      setFeeds({ nepse, forex, gold, fuel });
    }
    void loadAuthenticOverview();
    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  const handleTabChange = (tab: FinanceTab) => {
    setCurrentTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab === 'overview' ? 'finance' : tab);
    }
  };

  const financeTabs = [
    { id: 'overview', label: isNe ? 'सारांश' : 'Overview' },
    { id: 'nepse', label: isNe ? 'नेप्से र आइपिओ' : 'NEPSE & IPO' },
    { id: 'forex', label: isNe ? 'विदेशी मुद्रा' : 'NRB Forex' },
    { id: 'gold', label: isNe ? 'सुनचाँदी' : 'Gold & Silver' },
    { id: 'fuel', label: isNe ? 'इन्धन दर' : 'NOC Fuel' },
    { id: 'tax', label: isNe ? 'आयकर' : 'Income Tax' },
    { id: 'emi', label: isNe ? 'ई.एम.आई.' : 'Loan EMI' },
    { id: 'receipt', label: isNe ? 'रसिद' : 'Receipt Ledger' },
  ] as const;

  const overviewCards: Array<{ key: FinanceTab; title: string; feed: FeedCardState; cta: string }> = [
    { key: 'nepse', title: isNe ? 'नेप्से परिसूचक' : 'NEPSE Index', feed: feeds.nepse, cta: isNe ? 'बजार हेर्नुहोस् →' : 'Open →' },
    { key: 'forex', title: isNe ? 'अमेरिकी डलर (NRB)' : 'USD / NPR (NRB)', feed: feeds.forex, cta: isNe ? 'विनिमय दर →' : 'Forex →' },
    { key: 'gold', title: isNe ? 'छापावाल सुन (प्रति तोला)' : 'Fine Gold (Chhapawal)', feed: feeds.gold, cta: isNe ? 'दरभाउ →' : 'Rates →' },
    { key: 'fuel', title: isNe ? 'पेट्रोल खुद्रा मूल्य (NOC)' : 'Petrol Retail (NOC)', feed: feeds.fuel, cta: isNe ? 'इन्धन →' : 'Fuels →' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Unified Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono font-semibold block">
              {isNe ? 'पूँजी बजार तथा बैंकिङ' : 'Capital Markets & Banking'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0B1F3A] dark:text-white">
              {isNe ? 'वित्त तथा सेयर बजार' : 'Finance & Capital Markets'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {isNe
                ? 'नेपाल राष्ट्र बैंकको विनिमय दर, नेप्से परिसूचक, नयाँ आइपिओ र बजेट २०८३/८४ का आयकर औजारहरू।'
                : 'Authentic exchange rates, bullion quotes, NEPSE market feeds, and fiscal calculators for Nepal.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshTick((t) => t + 1)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] hover:border-blue-400 text-xs font-semibold text-[#0B1F3A] dark:text-slate-200 inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isNe ? 'ताजा गर्नुहोस्' : 'Refresh Feeds'}</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {financeTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as FinanceTab)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
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
        <div className="space-y-8">
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>{isNe ? 'जानकारी तथा शैक्षिक प्रयोजनका लागि मात्र:' : 'Informational & Educational Use Only:'}</strong>{' '}
              {isNe
                ? 'यहाँ देखाइएका बजार मूल्य, विनिमय दर र कर हिसाब आधिकारिक स्रोतका आधारमा सन्दर्भका लागि मात्र हुन्; यो वित्तीय वा लगानी सल्लाह होइन।'
                : 'Market quotes, currency rates, and tax/EMI computations are retrieved strictly from public sources for reference only and never estimated when unavailable.'}
            </div>
          </div>

          {/* Authentic Live Feed Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewCards.map(({ key, title, feed, cta }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group text-left space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 gap-2">
                  <span className="truncate">{title}</span>
                  <span className="shrink-0 text-blue-600 dark:text-blue-400">{feed.source}</span>
                </div>
                <div
                  className={`font-semibold tracking-tight font-mono tabular-nums ${
                    feed.available
                      ? 'text-2xl text-[#0B1F3A] dark:text-white'
                      : 'text-xs text-slate-500 dark:text-slate-400 leading-snug'
                  }`}
                >
                  {feed.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                  <span className="truncate">
                    {feed.timestamp ? `${feed.subline} · ${feed.timestamp}` : feed.subline}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold shrink-0 ml-2">
                    {cta}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Financial Modules Index */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#0B1F3A] dark:text-white tracking-tight">
              {isNe ? 'विशेष वित्तीय क्यालकुलेटर तथा पोर्टलहरू' : 'Specialized Financial Calculators & Portals'}
            </h2>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                {
                  tab: 'nepse' as FinanceTab,
                  meta: 'Nepal Stock Exchange · Meroshare · CDSC',
                  title: isNe ? 'नेप्से बजार र आइपिओ नतिजा' : 'NEPSE Market Floor Sheet & IPO Suite',
                  desc: isNe
                    ? 'सेयर बजार परिसूचक, आइपिओ सूची र CDSC नतिजा जाँच।'
                    : 'Live market telemetry, stock quotes, IPO results, and verified disclosures.',
                },
                {
                  tab: 'tax' as FinanceTab,
                  meta: 'Inland Revenue Department · FY 2083/84',
                  title: isNe ? 'तलब तथा आयकर क्यालकुलेटर' : 'Salary & Income Tax Calculator',
                  desc: isNe
                    ? 'एकल र दम्पती करदाताका लागि प्रगतिशील कर स्ल्याब र SSF/CIT कटौती।'
                    : 'Progressive slab breakdown for individual and married resident taxpayers with SSF, PF, and insurance deductions.',
                },
                {
                  tab: 'emi' as FinanceTab,
                  meta: 'Banking Tools · Amortization',
                  title: isNe ? 'ऋण ई.एम.आई. र ब्याज तालिका' : 'Loan EMI & Interest Breakdown',
                  desc: isNe
                    ? 'घर, सवारी र व्यक्तिगत ऋणको मासिक किस्ता र मूलधन/ब्याज विवरण।'
                    : 'Compute precise monthly installments and principal-to-interest schedules for home, vehicle, and personal loans.',
                },
                {
                  tab: 'receipt' as FinanceTab,
                  meta: 'Document Tools · Offline-First',
                  title: isNe ? 'खर्च रसिद र पी.डी.एफ. विवरण' : 'Receipt Scanner & Expense Ledger',
                  desc: isNe
                    ? 'रसिद अभिलेख राख्नुहोस् र सफा पी.डी.एफ. विवरण निर्यात गर्नुहोस्।'
                    : 'Record paper invoices locally, track PAN entries, and export clean monthly statements.',
                },
              ].map((item) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => handleTabChange(item.tab)}
                  className="w-full py-4 sm:py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 -mx-3 px-3 rounded-xl transition-colors text-left"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {item.meta}
                    </div>
                    <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 pt-2 font-mono font-semibold shrink-0">
                    {isNe ? 'खोल्नुहोस् →' : 'Launch →'}
                  </span>
                </button>
              ))}
            </div>
          </Card>
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
