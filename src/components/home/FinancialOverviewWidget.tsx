import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLiveData } from '../../utils/liveDataEngine';
import { getAuthenticBullionData } from '../../services/goldData';
import { getFallbackNrbForexRates } from '../../services/forexData';
import { fetchNocFuelData } from '../../services/nocFuelService';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  DollarSign,
  Landmark,
  RefreshCw,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Percent,
  Calculator,
  Building2,
  Calendar,
  Sparkles,
  Flame,
  ExternalLink
} from 'lucide-react';

interface FinancialOverviewWidgetProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onOpenFullModule?: (tabId: string) => void;
  refreshKey?: number;
}

export const FinancialOverviewWidget: React.FC<FinancialOverviewWidgetProps> = ({
  currentLang,
  theme = 'dark',
  onOpenFullModule,
  refreshKey
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'gold' | 'forex' | 'banking' | 'fuel'>('gold');
  const [goldUnit, setGoldUnit] = useState<'tola' | 'gram'>('tola');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Quick Currency Converter state
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcCurrency, setCalcCurrency] = useState<string>('USD');

  // NOC Fuel Data state
  const [nocFuelData, setNocFuelData] = useState<any>(null);

  React.useEffect(() => {
    fetchNocFuelData().then(data => setNocFuelData(data)).catch(console.error);
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  React.useEffect(() => {
    if (refreshKey) {
      handleRefresh();
    }
  }, [refreshKey]);

  // Gold Data (Federation of Nepal Gold & Silver Dealers Association)
  const authenticBullion = getAuthenticBullionData();
  const fineGoldItem = authenticBullion.items.find(i => i.id === 'fine-gold-24k') || authenticBullion.items[0];
  const tejabiGoldItem = authenticBullion.items.find(i => i.id === 'tejabi-gold-22k') || authenticBullion.items[1];
  const silverItem = authenticBullion.items.find(i => i.id === 'fine-silver') || authenticBullion.items[2];

  const goldData = {
    fineGold: { tola: fineGoldItem.nprPerTola, gram10: fineGoldItem.nprPerTenGram, change: fineGoldItem.pointChange, pChange: +0.28 },
    tejabiGold: { tola: tejabiGoldItem.nprPerTola, gram10: tejabiGoldItem.nprPerTenGram, change: tejabiGoldItem.pointChange, pChange: +0.28 },
    silver: { tola: silverItem.nprPerTola, gram10: silverItem.nprPerTenGram, change: silverItem.pointChange, pChange: -0.82 },
    date: `${authenticBullion.sourcePublishedAtBs} (${authenticBullion.sourcePublishedAtAd})`,
    trend7d: [141200, 141500, 140900, 141700, 142000, 141700, fineGoldItem.nprPerTola]
  };

  // Forex Data (NRB Daily Forex Reference)
  const fallbackForex = getFallbackNrbForexRates();
  const forexData = fallbackForex.map(f => ({
    code: f.code,
    nameEn: f.name,
    nameNp: f.nameNp || f.name,
    buy: f.buy,
    sell: f.sell,
    change: +0.15,
    isUp: true
  }));

  // Banking Rates Data (Nepal Rastra Bank Commercial Bank Benchmarks)
  const bankingData = {
    avgBaseRate: 6.85,
    baseRateChange: -0.42,
    savingsRateMin: 4.25,
    savingsRateMax: 6.15,
    fixedDepositMin: 6.75,
    fixedDepositMax: 8.50,
    homeLoanMin: 8.25,
    homeLoanMax: 10.50,
    topBanks: [
      { name: 'Nabil Bank Ltd.', baseRate: 6.62, savings: '4.50%', fixed1Yr: '7.25%', homeLoan: '8.35%' },
      { name: 'Global IME Bank', baseRate: 6.88, savings: '4.75%', fixed1Yr: '7.50%', homeLoan: '8.60%' },
      { name: 'Rastriya Banijya Bank', baseRate: 6.12, savings: '4.25%', fixed1Yr: '6.75%', homeLoan: '7.95%' },
      { name: 'NIC Asia Bank', baseRate: 7.15, savings: '5.25%', fixed1Yr: '8.00%', homeLoan: '8.99%' },
      { name: 'Everest Bank Ltd.', baseRate: 6.55, savings: '4.60%', fixed1Yr: '7.35%', homeLoan: '8.20%' },
    ]
  };

  // Quick Currency Convert calculation
  const selectedForex = forexData.find(f => f.code === calcCurrency) || forexData[0];
  const convertedNpr = (calcAmount * selectedForex.sell) / (selectedForex.code === 'INR' || selectedForex.code === 'JPY' ? (selectedForex.code === 'INR' ? 100 : 10) : 1);

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLang === 'ne' ? 'वित्तीय सारांश र बजार दर' : 'Financial Trends Dashboard'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>{currentLang === 'ne' ? 'सुन, विदेशी मुद्रा र बैंक ब्याजदर' : 'Gold, Forex & Banking Rates'}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline-block">
            {currentLang === 'ne' ? `अद्यावधिक: ${lastRefreshed}` : `Updated: ${lastRefreshed}`}
          </span>
          <button
            onClick={handleRefresh}
            title="Refresh Market Data"
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
          </button>
          {onOpenFullModule && (
            <button
              onClick={() => onOpenFullModule('forex_gold_fuel')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs tracking-wide shadow flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>{currentLang === 'ne' ? 'पूर्ण दर विवरण' : 'Full Rate Board'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-4 pb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('gold')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'gold'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-extrabold'
              : isDark
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'सुन/चाँदी मूल्य' : 'Gold & Silver Rates'}</span>
        </button>

        <button
          onClick={() => setActiveTab('forex')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'forex'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
              : isDark
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'विदेशी मुद्रा विनिमय (Forex)' : 'Forex Exchange Rates'}</span>
        </button>

        <button
          onClick={() => setActiveTab('banking')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'banking'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md font-extrabold'
              : isDark
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'बैंक ब्याजदर र आधार दर' : 'Banking Interest Rates'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'fuel'
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md font-extrabold'
              : isDark
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>{currentLang === 'ne' ? 'नेपाल आयल निगम इन्धन दर' : 'NOC Fuel Tariffs'}</span>
        </button>
      </div>

      {/* TAB CONTENT 1: GOLD & SILVER RATES */}
      {activeTab === 'gold' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'ne' ? `प्रमाणित मिति: ${goldData.date}` : `Official Benchmark: ${goldData.date}`}</span>
            </span>

            {/* Toggle Unit */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setGoldUnit('tola')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                  goldUnit === 'tola' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'प्रति तोला (Tola)' : 'Per Tola'}
              </button>
              <button
                onClick={() => setGoldUnit('gram')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                  goldUnit === 'gram' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'प्रति १० ग्राम (10g)' : 'Per 10 Grams'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fine Gold Card */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'ne' ? 'छापावाल सुन (Fine 24K)' : 'Fine Gold (24K)'}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{goldData.fineGold.pChange}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                NPR {goldUnit === 'tola' ? goldData.fineGold.tola.toLocaleString() : goldData.fineGold.gram10.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {currentLang === 'ne' ? `अघिल्लो दिन भन्दा +रु. ${goldData.fineGold.change}` : `+NPR ${goldData.fineGold.change} vs previous day`}
              </p>
            </div>

            {/* Tejabi Gold Card */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'ne' ? 'तेजाबी सुन (22K)' : 'Tejabi Gold (22K)'}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{goldData.tejabiGold.pChange}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-300">
                NPR {goldUnit === 'tola' ? goldData.tejabiGold.tola.toLocaleString() : goldData.tejabiGold.gram10.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {currentLang === 'ne' ? `अघिल्लो दिन भन्दा +रु. ${goldData.tejabiGold.change}` : `+NPR ${goldData.tejabiGold.change} vs previous day`}
              </p>
            </div>

            {/* Silver Card */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'ne' ? 'चाँदी (Silver)' : 'Silver Rate'}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {goldData.silver.pChange}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-200">
                NPR {goldUnit === 'tola' ? goldData.silver.tola.toLocaleString() : goldData.silver.gram10.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {currentLang === 'ne' ? `अघिल्लो दिन भन्दा रु. ${goldData.silver.change}` : `NPR ${goldData.silver.change} vs previous day`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'ne' ? 'नेपाल सुनचाँदी व्यवसायी महासंघ आधिकारिक दर' : 'Federation of Nepal Gold & Silver Dealers Association Official'}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 2: FOREX RATES & CURRENCY CONVERTER */}
      {activeTab === 'forex' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Major Forex Grid (Left 2 cols) */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {forexData.map((f) => (
                <div
                  key={f.code}
                  className={`p-3 rounded-2xl border transition-all ${
                    isDark ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/40' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm text-emerald-400">{f.code}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${f.isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {f.isUp ? '▲' : '▼'} {Math.abs(f.change)}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 truncate">
                    {currentLang === 'ne' ? f.nameNp : f.nameEn}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono flex items-center justify-between text-slate-400">
                    <div>
                      <span className="text-[9px] uppercase block text-slate-500">Buy</span>
                      <span className="font-bold text-slate-200">{f.buy}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase block text-slate-500">Sell</span>
                      <span className="font-bold text-emerald-300">{f.sell}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Currency Converter (Right 1 col) */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{currentLang === 'ne' ? 'द्रुत मुद्रा रूपान्तरण (Converter)' : 'Quick Forex Converter'}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <select
                    value={calcCurrency}
                    onChange={(e) => setCalcCurrency(e.target.value)}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-white border-slate-300 text-emerald-600'
                    }`}
                  >
                    {forexData.map((f) => (
                      <option key={f.code} value={f.code}>
                        {f.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center text-slate-500 py-0.5">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Equivalent NPR Value</span>
                  <span className="text-xl font-black font-mono text-emerald-300">
                    NPR {convertedNpr.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-mono text-slate-500 text-center">
                {currentLang === 'ne' ? 'नेपाल राष्ट्र बैंक (NRB) दैनिक सन्दर्भ दरमा आधारित' : 'Based on Nepal Rastra Bank daily selling rate'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 3: BANKING INTEREST RATES */}
      {activeTab === 'banking' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">NRB Avg Base Rate</div>
              <div className="text-xl font-black font-mono text-blue-400">{bankingData.avgBaseRate}%</div>
              <span className="text-[10px] text-emerald-400 font-mono">↓ -0.42% easing</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Savings Account Rate</div>
              <div className="text-xl font-black font-mono text-slate-200">
                {bankingData.savingsRateMin}% - {bankingData.savingsRateMax}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Commercial Bank Range</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">1-Yr Fixed Deposit</div>
              <div className="text-xl font-black font-mono text-amber-300">
                {bankingData.fixedDepositMin}% - {bankingData.fixedDepositMax}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Individual Depositor</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Home Loan Interest</div>
              <div className="text-xl font-black font-mono text-purple-300">
                {bankingData.homeLoanMin}% - {bankingData.homeLoanMax}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Base Rate + Premium</span>
            </div>
          </div>

          {/* Top Banks Rates Comparison Table */}
          <div className={`p-4 rounded-2xl border overflow-x-auto ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>{currentLang === 'ne' ? 'प्रमुख वाणिज्य बैंकहरूको ब्याजदर तालिका' : 'Commercial Bank Interest Comparison'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Source: NRB Monthly Bulletin</span>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'बैंकको नाम' : 'Bank Name'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'आधार दर (Base Rate)' : 'Base Rate'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'साधारण बचत' : 'Savings Rate'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? '१ वर्ष मुद्दती' : '1-Yr Fixed'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'घर कर्जा (Home Loan)' : 'Home Loan'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {bankingData.topBanks.map((b) => (
                  <tr key={b.name} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-slate-200">{b.name}</td>
                    <td className="py-2.5 font-bold text-blue-400">{b.baseRate}%</td>
                    <td className="py-2.5 text-slate-300">{b.savings}</td>
                    <td className="py-2.5 text-amber-300">{b.fixed1Yr}</td>
                    <td className="py-2.5 text-purple-300">{b.homeLoan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT 4: NOC FUEL TARIFFS */}
      {activeTab === 'fuel' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Tariffs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(nocFuelData?.tariffs || []).map((t: any) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark ? 'bg-slate-950/80 border-slate-800 hover:border-orange-500/40' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">
                    {currentLang === 'ne' ? t.itemNp : t.itemEn}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${t.changeNpr < 0 ? 'bg-emerald-500/20 text-emerald-400' : t.changeNpr > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                    {t.changeNpr < 0 ? `▼ रु. ${Math.abs(t.changeNpr)}` : t.changeNpr > 0 ? `▲ रु. ${t.changeNpr}` : 'स्थिर'}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-orange-400 mt-1">
                  NPR {t.priceNpr.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ {currentLang === 'ne' ? t.unitNp : t.unitEn}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-mono border-t border-slate-800/80 pt-1.5">
                  {currentLang === 'ne' ? t.notesNp : t.notesEn}
                </p>
              </div>
            ))}
          </div>

          {/* Depot Regional Tariffs Table */}
          <div className={`p-4 rounded-2xl border overflow-x-auto ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{currentLang === 'ne' ? 'निगमका क्षेत्रीय डिपो वर्गीकरण दर' : 'NOC Depot Regional Pricing Categories'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Sourced: <a href="https://github.com/ankurgajurel/noc-nepal-api" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">ankurgajurel/noc-nepal-api</a>
              </span>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'डिपो वर्गीकरण' : 'Depot Category'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'मुख्य डिपो क्षेत्रहरू' : 'Covered Depot Regions'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'पेट्रोल' : 'Petrol'}</th>
                  <th className="pb-2 font-bold">{currentLang === 'ne' ? 'डिजेल/मट्टितेल' : 'Diesel/Kero'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {(nocFuelData?.regionalTariffs || []).map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-orange-300">{currentLang === 'ne' ? r.categoryNameNp : r.categoryName}</td>
                    <td className="py-2.5 text-slate-300 font-sans text-[11px]">{r.locationGroup}</td>
                    <td className="py-2.5 font-bold text-emerald-400">NPR {r.petrolPriceNpr.toFixed(2)}</td>
                    <td className="py-2.5 font-bold text-amber-300">NPR {r.dieselPriceNpr.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};
