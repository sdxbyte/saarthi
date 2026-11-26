import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRightLeft,
  ArrowUpDown,
  Calculator,
  Coins,
  Download,
  ExternalLink,
  Filter,
  Fuel,
  Gem,
  Info,
  Layers,
  RefreshCw,
  Scale,
  Search,
} from 'lucide-react';
import { ForexRate } from '../../types';
import { useLiveData } from '../../utils/liveDataEngine';
import { BullionRateItem, calculateJewelleryCost } from '../../services/goldData';
import { ForexCurrencyRate, getFallbackNrbForexRates } from '../../services/forexData';
import { NocFuelTariff, NocRegionalTariffs } from '../../services/nocFuelService';

interface ForexGoldFuelViewProps {
  currentLang: 'en' | 'ne';
  initialSubTab?: 'forex' | 'gold' | 'fuel';
}

export const ForexGoldFuelView: React.FC<ForexGoldFuelViewProps> = ({
  currentLang,
  initialSubTab = 'forex',
}) => {
  const isNe = currentLang === 'ne';
  const [activeTab, setActiveTab] = useState<'forex' | 'gold' | 'fuel'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const forexStream = useLiveData<ForexRate[]>('forex-nrb');
  const metalsStream = useLiveData<BullionRateItem[]>('metals-negosida');
  const fuelStream = useLiveData<any[]>('fuel-noc');

  // Forex Converter State
  const [convertMode, setConvertMode] = useState<'foreignToNpr' | 'nprToForeign' | 'cross'>('foreignToNpr');
  const [foreignAmount, setForeignAmount] = useState<number>(100);
  const [nprAmount, setNprAmount] = useState<number>(10000);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const [targetCurrencyCode, setTargetCurrencyCode] = useState<string>('EUR');

  // Forex Registry State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUnitMultiplier, setCustomUnitMultiplier] = useState<number>(1);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');

  // Jewellery Calculator State
  const [calcGoldType, setCalcGoldType] = useState<'chhapawal' | 'tejabi' | '18k'>('chhapawal');
  const [calcWeightTola, setCalcWeightTola] = useState<number>(1);
  const [calcJartiPct, setCalcJartiPct] = useState<number>(5);
  const [calcJyalaPerTola, setCalcJyalaPerTola] = useState<number>(2500);
  const [convertTolaInput, setConvertTolaInput] = useState<number>(1);

  // Fuel Filter
  const [selectedFuelCategory, setSelectedFuelCategory] = useState<'ALL' | 'PETROLEUM' | 'LPG' | 'AVIATION' | 'AUTO_GAS'>('ALL');

  const fallbackForex = useMemo(() => getFallbackNrbForexRates(), []);
  const forexRates: (ForexRate | ForexCurrencyRate)[] =
    forexStream.data && forexStream.data.length > 0 ? forexStream.data : fallbackForex;

  const bullionItems: BullionRateItem[] = Array.isArray(metalsStream.data) ? metalsStream.data : [];

  const fuelPayload: any = fuelStream.payload || {};
  const nocTariffs: NocFuelTariff[] = useMemo(() => {
    if (Array.isArray(fuelPayload.tariffs) && fuelPayload.tariffs.length > 0) {
      return fuelPayload.tariffs;
    }
    if (Array.isArray(fuelStream.data)) {
      return fuelStream.data.map((row: any, idx: number) => ({
        id: row.id || `fuel-${idx}`,
        itemEn: row.item || row.itemEn || 'Fuel Item',
        itemNp: row.itemNp || row.item || 'इन्धन',
        category: /lpg|gas/i.test(String(row.item || ''))
          ? /auto/i.test(String(row.item || ''))
            ? 'AUTO_GAS'
            : 'LPG'
          : /aviation/i.test(String(row.item || ''))
          ? 'AVIATION'
          : 'PETROLEUM',
        priceNpr: Number(row.priceNpr || 0),
        unitEn: row.unit || row.unitEn || 'Litre',
        unitNp: row.unitNp || row.unit || 'लिटर',
        changeNpr: Number(row.change ?? row.changeNpr ?? 0),
        effectiveDateAd: fuelStream.lastUpdatedAd,
        effectiveDateBs: fuelStream.lastUpdatedBs,
        notesEn: row.notesEn,
        notesNp: row.notesNp,
      }));
    }
    return [];
  }, [fuelPayload.tariffs, fuelStream.data, fuelStream.lastUpdatedAd, fuelStream.lastUpdatedBs]);

  const regionalTariffs: NocRegionalTariffs[] = Array.isArray(fuelPayload.regionalTariffs)
    ? fuelPayload.regionalTariffs
    : [];

  // Active stream metadata based on selected tab
  const activeStream =
    activeTab === 'forex' ? forexStream : activeTab === 'gold' ? metalsStream : fuelStream;

  const handleRefreshAll = async () => {
    await Promise.all([forexStream.refresh(), metalsStream.refresh(), fuelStream.refresh()]);
  };

  // Active currencies for converter
  const activeForex = (forexRates.find((f) => f.code === selectedCurrencyCode) ||
    forexRates[0]) as ForexCurrencyRate;
  const targetForex = (forexRates.find((f) => f.code === targetCurrencyCode) ||
    forexRates[1] ||
    forexRates[0]) as ForexCurrencyRate;

  const unitFactor = activeForex?.unit || 1;
  const targetUnitFactor = targetForex?.unit || 1;
  const buyRate = activeForex?.buy || 0;
  const sellRate = activeForex?.sell || 0;
  const targetSellRate = targetForex?.sell || 0;

  const convertedToNpr = Math.round((foreignAmount / unitFactor) * buyRate);
  const convertedFromNpr =
    sellRate > 0 ? parseFloat(((nprAmount / sellRate) * unitFactor).toFixed(2)) : 0;
  const crossNprEquivalent = (foreignAmount / unitFactor) * buyRate;
  const convertedCrossAmount =
    targetSellRate > 0
      ? parseFloat(((crossNprEquivalent / targetSellRate) * targetUnitFactor).toFixed(2))
      : 0;
  const oneNprToForeign = sellRate > 0 ? (unitFactor / sellRate).toFixed(4) : '0';

  const filteredForexRates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return forexRates.filter((f) => {
      const rateItem = f as ForexCurrencyRate;
      const matchesSearch =
        query === '' ||
        f.code.toLowerCase().includes(query) ||
        f.name.toLowerCase().includes(query) ||
        (rateItem.country && rateItem.country.toLowerCase().includes(query)) ||
        (rateItem.nameNp && rateItem.nameNp.toLowerCase().includes(query)) ||
        (rateItem.countryNp && rateItem.countryNp.toLowerCase().includes(query)) ||
        (rateItem.initials && rateItem.initials.some((init) => init.toLowerCase().includes(query))) ||
        (rateItem.aliases && rateItem.aliases.some((alias) => alias.toLowerCase().includes(query)));

      if (!matchesSearch) return false;
      if (regionFilter === 'all') return true;
      if (regionFilter === 'nrb') return !!f.isNrbOfficial;
      if (regionFilter === 'gulf') return rateItem.region === 'Middle East';
      if (regionFilter === 'saarc') return rateItem.region === 'SAARC' || rateItem.region === 'Asia Pacific';
      if (regionFilter === 'europe') return rateItem.region === 'Europe';
      if (regionFilter === 'americas') return rateItem.region === 'Americas';
      if (regionFilter === 'africa') return rateItem.region === 'Africa';
      if (regionFilter === 'oceania') return rateItem.region === 'Oceania';
      return true;
    });
  }, [forexRates, searchQuery, regionFilter]);

  const fineGoldRate = bullionItems.find((b) => b.id === 'fine-gold-24k')?.nprPerTola || 0;
  const tejabiGoldRate = bullionItems.find((b) => b.id === 'tejabi-gold-22k')?.nprPerTola || 0;
  const jewellery18KRate =
    bullionItems.find((b) => b.id === 'jewellery-gold-18k')?.nprPerTola ||
    (fineGoldRate > 0 ? Math.round(fineGoldRate * 0.75) : 0);

  const activeSelectedGoldRate =
    calcGoldType === 'chhapawal'
      ? fineGoldRate
      : calcGoldType === 'tejabi'
      ? tejabiGoldRate
      : jewellery18KRate;

  const jewelleryEstimate =
    activeSelectedGoldRate > 0
      ? calculateJewelleryCost(activeSelectedGoldRate, calcWeightTola, calcJartiPct, calcJyalaPerTola)
      : null;

  const gramsEquivalent = (convertTolaInput * 11.6638125).toFixed(3);
  const lalEquivalent = Math.round(convertTolaInput * 100);
  const masaEquivalent = (convertTolaInput * 12).toFixed(2);
  const troyOunceEquivalent = (convertTolaInput / 2.665).toFixed(3);

  const filteredFuelList = useMemo(() => {
    if (selectedFuelCategory === 'ALL') return nocTariffs;
    return nocTariffs.filter((f) => f.category === selectedFuelCategory);
  }, [nocTariffs, selectedFuelCategory]);

  const handleExportCsv = () => {
    const headers = [
      'Currency Code',
      'Country',
      'Currency Name',
      'Unit',
      'Buy Rate (NPR)',
      'Sell Rate (NPR)',
      'Mid Rate (NPR)',
      'Source Type',
    ];
    const rows = filteredForexRates.map((r) => {
      const item = r as ForexCurrencyRate;
      return [
        item.code,
        `"${item.country || 'Global'}"`,
        `"${item.name}"`,
        item.unit,
        item.buy,
        item.sell,
        item.midRate || ((item.buy + item.sell) / 2).toFixed(2),
        item.isNrbOfficial ? 'NRB Official' : 'Interbank Reference',
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAARTHI_Forex_Rates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              {isNe ? 'विदेशी मुद्रा, सुनचाँदी भाउ र इन्धन दर' : 'Forex, Bullion & Fuel Tariffs'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isNe
              ? 'नेपाल राष्ट्र बैंक (NRB), नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) र नेपाल आयल निगम (NOC)'
              : 'Nepal Rastra Bank (NRB) forex rates, FENEGOSIDA bullion pricing, and NOC fuel tariffs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleRefreshAll()}
            disabled={activeStream.isRefreshing}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB] text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${activeStream.isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span>{isNe ? 'ताजा गर्नुहोस्' : 'Refresh Feeds'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('forex')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'forex'
                  ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{isNe ? 'विदेशी मुद्रा' : 'Forex (NRB)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gold')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'gold'
                  ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              <span>{isNe ? 'सुन र चाँदी' : 'Gold & Silver'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fuel')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'fuel'
                  ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>{isNe ? 'इन्धन दर (NOC)' : 'NOC Fuel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Provenance & Verification Metadata Bar */}
      <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              activeStream.isLive && !activeStream.isCached
                ? 'bg-emerald-500'
                : activeStream.isCached
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
          <span className="truncate">
            Source: <strong className="text-[#0B1F3A] dark:text-slate-200">{activeStream.dataSource}</strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] tabular-nums">
          <span>
            Status:{' '}
            <strong
              className={
                activeStream.isLive && !activeStream.isCached
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {activeStream.isLoading
                ? 'Loading...'
                : activeStream.isLive && !activeStream.isCached
                ? 'Verified Live Feed'
                : activeStream.isCached
                ? 'Cached / Reference'
                : 'Unavailable'}
            </strong>
          </span>
          <span>
            AD: {activeStream.lastUpdatedAd} | BS: {activeStream.lastUpdatedBs}
          </span>
        </div>
      </div>

      <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
        <strong>{isNe ? 'सन्दर्भ सूचना:' : 'Reference Notice:'}</strong>{' '}
        {isNe
          ? 'विनिमय दर, गरगहना लागत अनुमान र इन्धन दर जानकारी तुलना प्रयोजनका लागि मात्र हुन्। कारोबारअघि सम्बन्धित बैंक वा डिलरसँग दर पुष्टि गर्नुहोस्।'
          : 'Exchange rates, jewellery estimates, and petroleum tariffs are provided strictly for informational comparison and do not constitute financial, trading, or commercial advice.'}
      </div>

      {/* =================================================================== */}
      {/* TAB 1: FOREX */}
      {/* =================================================================== */}
      {activeTab === 'forex' && (
        <div className="space-y-6">
          {/* Converter Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                  <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base sm:text-lg">
                    {isNe ? 'विश्वव्यापी मुद्रा रूपान्तरण क्याल्कुलेटर' : 'Multi-Currency Converter'}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isNe
                    ? 'नेपाल राष्ट्र बैंकको खरिद तथा बिक्री दरमा आधारित'
                    : 'Based on NRB official buy/sell spread and cross-currency rates'}
                </p>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setConvertMode('foreignToNpr')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    convertMode === 'foreignToNpr'
                      ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Foreign → NPR
                </button>
                <button
                  type="button"
                  onClick={() => setConvertMode('nprToForeign')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    convertMode === 'nprToForeign'
                      ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  NPR → Foreign
                </button>
                <button
                  type="button"
                  onClick={() => setConvertMode('cross')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    convertMode === 'cross'
                      ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cross Rate
                </button>
              </div>
            </div>

            {/* Popular quick buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 shrink-0 mr-1">
                {isNe ? 'प्रमुख मुद्रा:' : 'Popular:'}
              </span>
              {['USD', 'QAR', 'AED', 'SAR', 'MYR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'INR', 'KWD', 'KRW'].map(
                (code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCurrencyCode(code)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-colors shrink-0 border cursor-pointer ${
                      selectedCurrencyCode === code
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] text-[#0B1F3A] dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-[#0B1220] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                )
              )}
            </div>

            {/* Converter Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {convertMode === 'nprToForeign'
                    ? isNe
                      ? 'स्रोत रकम (NPR)'
                      : 'Source Amount in NPR'
                    : isNe
                    ? 'स्रोत मुद्रा र रकम'
                    : 'Source Currency & Amount'}
                </label>

                {convertMode !== 'nprToForeign' ? (
                  <div className="space-y-2">
                    <select
                      value={selectedCurrencyCode}
                      onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                      className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-semibold outline-none text-sm focus:border-[#2563EB]"
                    >
                      {forexRates.map((f) => {
                        const item = f as ForexCurrencyRate;
                        return (
                          <option key={f.code} value={f.code}>
                            {f.flag || ''} {f.code} - {f.name} ({item.country || 'Global'})
                          </option>
                        );
                      })}
                    </select>

                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                        {activeForex?.symbol || activeForex?.code}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={foreignAmount}
                        onChange={(e) => setForeignAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl pl-12 pr-4 py-2 text-slate-900 dark:text-white font-mono font-bold text-lg outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                      NPR
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={nprAmount}
                      onChange={(e) => setNprAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl pl-14 pr-4 py-2 text-slate-900 dark:text-white font-mono font-bold text-lg outline-none focus:border-[#2563EB]"
                    />
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2 py-2">
                <div className="p-2.5 rounded-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-[#2563EB] dark:text-[#60A5FA]">
                  <ArrowUpDown className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 text-center tabular-nums">
                  {convertMode === 'foreignToNpr' && `Unit: ${unitFactor} ${activeForex?.code}`}
                  {convertMode === 'nprToForeign' && `Sell: Rs ${sellRate}`}
                  {convertMode === 'cross' && `${activeForex?.code} → ${targetForex?.code}`}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {convertMode === 'cross' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isNe ? 'लक्षित मुद्रा' : 'Target Currency'}
                    </label>
                    <select
                      value={targetCurrencyCode}
                      onChange={(e) => setTargetCurrencyCode(e.target.value)}
                      className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-semibold outline-none text-sm focus:border-[#2563EB]"
                    >
                      {forexRates.map((f) => {
                        const item = f as ForexCurrencyRate;
                        return (
                          <option key={f.code} value={f.code}>
                            {f.flag || ''} {f.code} - {f.name} ({item.country || 'Global'})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {convertMode === 'foreignToNpr'
                    ? isNe
                      ? 'कुल नेपाली रूपैयाँ (NPR)'
                      : 'Converted Total (NPR)'
                    : convertMode === 'nprToForeign'
                    ? `${isNe ? 'कुल रकम' : 'Converted Total'} (${activeForex?.code})`
                    : `${isNe ? 'कुल रकम' : 'Converted Total'} (${targetForex?.code})`}
                </label>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-[#60A5FA]">
                    {convertMode === 'foreignToNpr' && `Rs. ${convertedToNpr.toLocaleString()}`}
                    {convertMode === 'nprToForeign' &&
                      `${activeForex?.symbol || ''} ${convertedFromNpr.toLocaleString()} ${activeForex?.code}`}
                    {convertMode === 'cross' &&
                      `${targetForex?.symbol || ''} ${convertedCrossAmount.toLocaleString()} ${targetForex?.code}`}
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 pt-2 font-mono tabular-nums">
                    <span>
                      {convertMode === 'foreignToNpr' &&
                        `1 ${activeForex?.code} = NPR ${(buyRate / unitFactor).toFixed(4)}`}
                      {convertMode === 'nprToForeign' && `1 NPR = ${oneNprToForeign} ${activeForex?.code}`}
                      {convertMode === 'cross' &&
                        targetSellRate > 0 &&
                        `1 ${activeForex?.code} ≈ ${((buyRate / unitFactor) / (targetSellRate / targetUnitFactor)).toFixed(4)} ${targetForex?.code}`}
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {activeForex?.isNrbOfficial ? 'NRB Official Spread' : 'Interbank Reference'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Multiplier & Registry */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F172A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={
                    isNe
                      ? 'देश, मुद्रा वा कोड खोज्नुहोस् (जस्तै USD, AED, SAR, GBP, INR...)'
                      : 'Search country, currency, or code (e.g. USD, UAE, KSA, UK, India)...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-16 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-[#2563EB]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewLayout(viewLayout === 'table' ? 'cards' : 'table')}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{viewLayout === 'table' ? 'Cards View' : 'Table View'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B1F3A] dark:bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Custom Multiplier */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#0B1F3A] dark:text-white">
                    {isNe ? 'एकाइ / परिमाण गुणक:' : 'Quantity / Unit Multiplier:'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-40">
                    <span className="absolute left-3 top-2 text-xs font-mono font-semibold text-slate-500">
                      Qty:
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={customUnitMultiplier}
                      onChange={(e) => setCustomUnitMultiplier(Math.max(0.001, Number(e.target.value) || 1))}
                      className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl pl-12 pr-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-[#0B1F3A] dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  {customUnitMultiplier !== 1 && (
                    <button
                      type="button"
                      onClick={() => setCustomUnitMultiplier(1)}
                      className="min-h-[34px] px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
                  Presets:
                </span>
                {[1, 10, 50, 100, 500, 1000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setCustomUnitMultiplier(preset);
                      setForeignAmount(preset);
                    }}
                    className={`min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold shrink-0 border cursor-pointer ${
                      customUnitMultiplier === preset
                        ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white border-[#0B1F3A] dark:border-[#2563EB]'
                        : 'bg-slate-50 dark:bg-[#0B1220] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#2563EB]" />
                {isNe ? 'क्षेत्र:' : 'Region:'}
              </span>
              {[
                { id: 'all', label: isNe ? 'सबै' : 'All' },
                { id: 'nrb', label: isNe ? 'राष्ट्र बैंक आधिकारिक' : 'NRB Official' },
                { id: 'gulf', label: isNe ? 'खाडी देश' : 'Middle East' },
                { id: 'saarc', label: isNe ? 'सार्क र एसिया' : 'SAARC & Asia' },
                { id: 'europe', label: isNe ? 'युरोप' : 'Europe' },
                { id: 'americas', label: isNe ? 'अमेरिका' : 'Americas' },
                { id: 'oceania', label: isNe ? 'ओशिनिया' : 'Oceania' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setRegionFilter(rf.id)}
                  className={`min-h-[34px] px-3 py-1.5 rounded-xl font-semibold shrink-0 border text-xs cursor-pointer whitespace-nowrap ${
                    regionFilter === rf.id
                      ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white border-[#0B1F3A] dark:border-[#2563EB]'
                      : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Data Table or Cards */}
            {viewLayout === 'table' ? (
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                        <th className="py-3 px-4">Currency / Country</th>
                        <th className="py-3 px-3">Code</th>
                        <th className="py-3 px-3 text-center">Unit</th>
                        <th className="py-3 px-4 text-right">Buy (खरिद)</th>
                        <th className="py-3 px-4 text-right">Sell (बिक्री)</th>
                        <th className="py-3 px-4 text-right">Mid</th>
                        <th className="py-3 px-3 text-center">Source</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredForexRates.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                            No matching currency found.
                          </td>
                        </tr>
                      ) : (
                        filteredForexRates.map((f) => {
                          const item = f as ForexCurrencyRate;
                          const baseUnit = f.unit || 1;
                          const midRate = item.midRate || (f.buy + f.sell) / 2;
                          const scaledBuy = (customUnitMultiplier / baseUnit) * f.buy;
                          const scaledSell = (customUnitMultiplier / baseUnit) * f.sell;
                          const scaledMid = (customUnitMultiplier / baseUnit) * midRate;

                          return (
                            <tr
                              key={f.code}
                              className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                                selectedCurrencyCode === f.code ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xl shrink-0">{f.flag || '🌐'}</span>
                                  <div>
                                    <div className="font-semibold text-[#0B1F3A] dark:text-white text-xs sm:text-sm">
                                      {item.country || 'Global Interbank'}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {f.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#0B1F3A] dark:text-blue-300">
                                {f.code}
                              </td>
                              <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                {customUnitMultiplier.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                                Rs. {scaledBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                                Rs. {scaledSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                                Rs. {scaledMid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-[10px]">
                                <span
                                  className={`px-2 py-0.5 rounded-md border ${
                                    f.isNrbOfficial
                                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  {f.isNrbOfficial ? 'NRB Official' : 'Interbank'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCurrencyCode(f.code);
                                    setForeignAmount(customUnitMultiplier);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#2563EB] text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                  Convert
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredForexRates.map((f) => {
                  const item = f as ForexCurrencyRate;
                  const baseUnit = f.unit || 1;
                  const scaledBuy = (customUnitMultiplier / baseUnit) * f.buy;
                  const scaledSell = (customUnitMultiplier / baseUnit) * f.sell;
                  return (
                    <button
                      key={f.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrencyCode(f.code);
                        setForeignAmount(customUnitMultiplier);
                      }}
                      className={`p-4 rounded-xl bg-white dark:bg-[#0F172A] border text-left space-y-2.5 transition-colors cursor-pointer ${
                        selectedCurrencyCode === f.code
                          ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{f.flag || '🌐'}</span>
                          <div>
                            <div className="font-bold text-[#0B1F3A] dark:text-white text-sm">{f.code}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.country || 'Global'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {f.isNrbOfficial ? 'NRB' : item.region || 'Global'}
                        </span>
                      </div>
                      <div className="text-xs font-mono tabular-nums space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Buy:</span>
                          <strong className="text-emerald-700 dark:text-emerald-400">
                            Rs. {scaledBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Sell:</span>
                          <strong className="text-[#0B1F3A] dark:text-white">
                            Rs. {scaledSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: GOLD & SILVER */}
      {/* =================================================================== */}
      {activeTab === 'gold' && (
        <div className="space-y-6">
          {bullionItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                {metalsStream.isLoading ? 'Loading FENEGOSIDA bullion rates...' : 'Official data is currently unavailable.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bullionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0B1F3A] dark:text-white">
                      {isNe ? item.categoryNp : item.categoryEn}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                        item.direction === 'UP'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : item.direction === 'DOWN'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.direction === 'UP'
                        ? `+${item.pointChange}`
                        : item.direction === 'DOWN'
                        ? `-${Math.abs(item.pointChange)}`
                        : '0'}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.purity}</div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-[#60A5FA] mt-1">
                      NPR {Number(item.nprPerTola).toLocaleString()}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans ml-1">
                        / Tola (11.66g)
                      </span>
                    </div>
                    <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 mt-1">
                      10 Grams: <strong className="text-slate-900 dark:text-white">NPR {Number(item.nprPerTenGram).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {item.conversionNotice}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Jewellery Calculator & Weight Converter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                  <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                    {isNe ? 'गहना ज्याला तथा जर्ती क्याल्कुलेटर' : 'Jewellery Making Charge & Jarti Calculator'}
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Nepal Standard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isNe ? 'सुनको प्रकार' : 'Gold Type'}
                  </label>
                  <select
                    value={calcGoldType}
                    onChange={(e) => setCalcGoldType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold outline-none focus:border-[#2563EB]"
                  >
                    <option value="chhapawal">24K Fine Gold (Rs. {fineGoldRate.toLocaleString()})</option>
                    <option value="tejabi">22K Tejabi (Rs. {tejabiGoldRate.toLocaleString()})</option>
                    <option value="18k">18K Jewellery (Rs. {jewellery18KRate.toLocaleString()})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isNe ? 'तौल (तोला)' : 'Weight (Tola)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={calcWeightTola}
                    onChange={(e) => setCalcWeightTola(Math.max(0.01, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-[#2563EB]"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block font-mono tabular-nums">
                    {(calcWeightTola * 11.6638125).toFixed(2)} Grams
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isNe ? 'जर्ती (%)' : 'Wastage / Jarti (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={calcJartiPct}
                    onChange={(e) => setCalcJartiPct(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isNe ? 'ज्याला प्रति तोला (NPR)' : 'Making Charge / Jyala per Tola'}
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={calcJyalaPerTola}
                    onChange={(e) => setCalcJyalaPerTola(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {jewelleryEstimate ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Net Gold Cost:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">
                      NPR {jewelleryEstimate.baseGoldCostNpr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Wastage ({calcJartiPct}% Jarti):</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      + NPR {jewelleryEstimate.wastageJartiNpr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Making Charge (Jyala):</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      + NPR {jewelleryEstimate.makingChargeJyalaNpr.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
                    <span className="text-[#0B1F3A] dark:text-white">Estimated Total:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-lg">
                      NPR {jewelleryEstimate.totalEstimatedCostNpr.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Official data is currently unavailable.</p>
              )}
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Scale className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                  {isNe ? 'नेपाली तौल रूपान्तरण' : 'Nepalese Bullion Weight Units'}
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isNe ? 'तौल (तोला)' : 'Weight (Tolas)'}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.1"
                    value={convertTolaInput}
                    onChange={(e) => setConvertTolaInput(Math.max(0.01, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold outline-none text-base focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-2 font-mono tabular-nums">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Grams:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">{gramsEquivalent} g</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Lal / Ratti:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">{lalEquivalent} Lal</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Masa:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">{masaEquivalent} Masa</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Troy Ounces:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">{troyOunceEquivalent} oz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: NOC FUEL TARIFFS */}
      {/* =================================================================== */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                <div>
                  <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base sm:text-lg">
                    {isNe ? 'नेपाल आयल निगम (NOC) इन्धन खुद्रा दर' : 'NOC Retail Petroleum Tariffs'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isNe ? 'नेपाल आयल निगमद्वारा प्रकाशित आधिकारिक खुद्रा मूल्य' : 'Official retail tariff schedule from Nepal Oil Corporation'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                {(['ALL', 'PETROLEUM', 'LPG', 'AVIATION', 'AUTO_GAS'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedFuelCategory(cat)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                      selectedFuelCategory === cat
                        ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? (isNe ? 'सबै' : 'All') : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredFuelList.length === 0 ? (
              <p className="text-xs text-slate-500">
                {fuelStream.isLoading ? 'Loading NOC tariffs...' : 'Official data is currently unavailable.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFuelList.map((fuel) => (
                  <div
                    key={fuel.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#0B1F3A] dark:text-white text-xs">
                        {isNe ? fuel.itemNp : fuel.itemEn}
                      </span>
                      <span className="text-[10px] font-mono text-[#2563EB] dark:text-[#60A5FA]">
                        {fuel.category}
                      </span>
                    </div>

                    <div className="font-mono font-bold text-[#0B1F3A] dark:text-white text-2xl tabular-nums">
                      NPR {Number(fuel.priceNpr).toLocaleString()}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-normal ml-1">
                        / {isNe ? fuel.unitNp : fuel.unitEn}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between gap-2">
                      <span className="truncate">{isNe ? fuel.notesNp || fuel.notesEn : fuel.notesEn}</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 shrink-0 tabular-nums">
                        {fuel.changeNpr > 0 ? `+${fuel.changeNpr}` : fuel.changeNpr < 0 ? `${fuel.changeNpr}` : 'Unchanged'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {regionalTariffs.length > 0 && (
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                  {isNe ? 'क्षेत्रीय डिपो अनुसार इन्धन दर' : 'Regional Depot Retail Tariffs'}
                </h3>
                <a
                  href="https://nepaloil.com.np/notices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline inline-flex items-center gap-1"
                >
                  <span>{isNe ? 'NOC आधिकारिक सूचना' : 'Official NOC Notices'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {regionalTariffs.map((reg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="font-semibold text-[#0B1F3A] dark:text-white">
                      {isNe ? reg.categoryNameNp : reg.categoryName}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {reg.locationGroup}
                    </p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 font-mono tabular-nums space-y-1">
                      <div className="flex justify-between">
                        <span>Petrol:</span>
                        <strong>NPR {reg.petrolPriceNpr.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Diesel / Kerosene:</span>
                        <strong>NPR {reg.dieselPriceNpr.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
            <span>
              {isNe
                ? 'आधिकारिक प्रेस विज्ञप्ति र डिपो मूल्य परिवर्तनका लागि नेपाल आयल निगमको वेबसाइट (nepaloil.com.np) मा जाँच गर्नुहोस्।'
                : 'For official press releases, IOC import cost revisions, and depot bulletins, verify directly at nepaloil.com.np.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
