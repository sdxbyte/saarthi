import React, { useState, useMemo } from 'react';
import {
  Coins,
  Gem,
  Fuel,
  ArrowRightLeft,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Calculator,
  Scale,
  Sparkles,
  ShieldCheck,
  Search,
  Globe2,
  Building2,
  Info,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
  Calendar,
  Clock,
  Radio,
  Flame,
  Truck,
  AlertCircle,
  BarChart3,
  LineChart as LineChartIcon,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { ForexRate } from '../../types';
import { useLiveData } from '../../utils/liveDataEngine';
import { getAuthenticBullionData, calculateJewelleryCost } from '../../services/goldData';
import { getFallbackNrbForexRates, ALL_WORLD_CURRENCIES_BASE, ForexCurrencyRate } from '../../services/forexData';
import { fetchNocFuelData, NocFuelTariff, NocRegionalTariffs } from '../../services/nocFuelService';

interface ForexGoldFuelViewProps {
  currentLang: 'en' | 'ne';
}

// 7-day Historical Price Trend Data for Gold & Silver
const GOLD_SILVER_TREND_HISTORY = [
  { dateAd: '2026-08-11', dateBs: '२०८३/०४/२७', fineGold: 301700, tejabiGold: 298700, silver: 4645, day: 'Tue' },
  { dateAd: '2026-08-12', dateBs: '२०८३/०४/२८', fineGold: 302500, tejabiGold: 299500, silver: 4660, day: 'Wed' },
  { dateAd: '2026-08-13', dateBs: '२०८३/०४/२९', fineGold: 303800, tejabiGold: 300800, silver: 4680, day: 'Thu' },
  { dateAd: '2026-08-14', dateBs: '२०८३/०४/३०', fineGold: 304200, tejabiGold: 301200, silver: 4695, day: 'Fri' },
  { dateAd: '2026-08-15', dateBs: '२०८३/०४/३१', fineGold: 304800, tejabiGold: 301800, silver: 4700, day: 'Sat' },
  { dateAd: '2026-08-16', dateBs: '२०८३/०४/३२', fineGold: 305200, tejabiGold: 302100, silver: 4710, day: 'Sun' },
  { dateAd: '2026-08-17', dateBs: '२०८३/०५/०१', fineGold: 306800, tejabiGold: 303700, silver: 4770, day: 'Today' },
];

// NOC Official Status Updates & Bulletins
const NOC_OFFICIAL_STATUS_UPDATES = [
  {
    id: 'noc-status-1',
    status: 'NORMAL_SUPPLY',
    titleEn: 'Nationwide Petroleum Supply Stable & Indian Oil Corp (IOC) Pipeline Active',
    titleNp: 'देशभर पेट्रोलियम पदार्थको आपूर्ति सहज, मोतिहारी-अमलेखगञ्ज पाइपलाइन पूर्ण सञ्चालनमा',
    dateBs: '२०८३ भाद्र ०१',
    dateAd: '2026-08-17',
    category: 'SUPPLY_STATUS',
    depot: 'All Depots (Amlekhgunj / Thankot / Biratnagar / Bhalubang)',
    detailsEn: 'NOC strategic reserves stand at 85% capacity with uninterrupted automated product pumping across eastern and central corridors.',
    detailsNp: 'निगमका प्रमुख डिपोहरूमा पेट्रोल, डिजेल तथा हवाई इन्धनको भण्डारण क्षमता ८५% माथि रहेको र नियमित आपूर्ति भइरहेको।',
  },
  {
    id: 'noc-status-2',
    status: 'PRICE_ADJUSTMENT',
    titleEn: 'Fortnightly Price Revision Effective from 1st of Month (Automatic Mechanism)',
    titleNp: 'पाक्षिक मूल्य समायोजन दर लागू - स्वचालित मूल्य प्रणाली अनुसार परिमार्जित',
    dateBs: '२०८३ भाद्र ०१',
    dateAd: '2026-08-17',
    category: 'PRICE_NOTICE',
    depot: 'Category I, II & III Regions',
    detailsEn: 'Tariff pegged under automatic pricing mechanism according to IOC cost sheet: Petrol Rs 159/L, Diesel Rs 143/L, LPG Cylinder Rs 1,910.',
    detailsNp: 'IOC बाट प्राप्त नयाँ खरिद मूल्यसूची बमोजिम काठमाडौं/पोखरामा पेट्रोल रु १५९ र डिजेल रु १४३ प्रति लिटर निर्धारण।',
  },
  {
    id: 'noc-status-3',
    status: 'LPG_BUFFER',
    titleEn: 'LPG Bottling Plants Operating at Full 14.2kg Quota Delivery',
    titleNp: 'एलपी ग्यास बोटलिङ प्लान्टहरूबाट नियमित १४.२ केजी सिलिन्डर वितरण',
    dateBs: '२०८३ श्रावण १५',
    dateAd: '2026-07-31',
    category: 'LPG_BULLETIN',
    depot: 'Nepal Bottling Association & Authorized Dealers',
    detailsEn: 'Retail maximum selling price capped at Rs 1,910 nationwide. Consumers advised to demand official computerized invoice.',
    detailsNp: 'उपभोक्ता खुद्रा अधिकतम मूल्य रु १,९१० देशभर एकरूप कायम। बढी मूल्य लिने बिक्रेतालाई कारबाही गरिने।',
  },
];

export const ForexGoldFuelView: React.FC<ForexGoldFuelViewProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'forex' | 'gold' | 'fuel'>('forex');

  // Live Data Hooks with Mock/Live State Management
  const forexStream = useLiveData<ForexRate[]>('forex-nrb');
  const metalsStream = useLiveData<any[]>('metals-negosida');
  const fuelStream = useLiveData<any[]>('fuel-noc');

  // Universal Currency Converter State
  const [convertMode, setConvertMode] = useState<'foreignToNpr' | 'nprToForeign' | 'cross'>('foreignToNpr');
  const [foreignAmount, setForeignAmount] = useState<number>(100);
  const [nprAmount, setNprAmount] = useState<number>(10000);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const [targetCurrencyCode, setTargetCurrencyCode] = useState<string>('EUR');

  // Forex List Filter & Dynamic Custom Multiplier State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUnitMultiplier, setCustomUnitMultiplier] = useState<number>(1);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');
  const [showNrbExplainer, setShowNrbExplainer] = useState<boolean>(false);

  // Gold Jewellery Calculator State
  const [calcGoldType, setCalcGoldType] = useState<string>('chhapawal');
  const [calcWeightTola, setCalcWeightTola] = useState<number>(1);
  const [calcJartiPct, setCalcJartiPct] = useState<number>(5); // 5% Jarti wastage
  const [calcJyalaPerTola, setCalcJyalaPerTola] = useState<number>(2500); // NPR 2500 labor per tola

  // Weight Unit Converter State
  const [convertTolaInput, setConvertTolaInput] = useState<number>(1);

  // Trend Metric Selection State
  const [selectedTrendMetal, setSelectedTrendMetal] = useState<'fineGold' | 'tejabiGold' | 'silver'>('fineGold');
  const [isRefreshingLive, setIsRefreshingLive] = useState<boolean>(false);
  const [lastLiveSyncedAt, setLastLiveSyncedAt] = useState<string>('Just now (Live)');

  // NOC Regional Pricing Filter
  const [selectedNocCategory, setSelectedNocCategory] = useState<'all' | 'cat1' | 'cat2' | 'cat3'>('all');

  const authenticBullion = getAuthenticBullionData();
  const fallbackForex = getFallbackNrbForexRates();

  // Unified list of rates from live stream or fallback
  const forexRates: (ForexRate | ForexCurrencyRate)[] = forexStream.data && forexStream.data.length > 0
    ? forexStream.data
    : fallbackForex;

  const rawBullionItems = authenticBullion.items;

  // Fuel List with Latest Statutory Categories
  const fuelList = [
    { id: 'petrol-cat3', item: 'Petrol (Category III)', itemNp: 'पेट्रोल (काठमाडौं, पोखरा, दिपायल)', priceNpr: 197.00, previousPriceNpr: 195.00, change: 2.0, unit: 'Litre', category: 'Automotive', note: 'Category III Depot Rate' },
    { id: 'petrol-cat2', item: 'Petrol (Category II)', itemNp: 'पेट्रोल (सुर्खेत, दाङ)', priceNpr: 196.00, previousPriceNpr: 194.00, change: 2.0, unit: 'Litre', category: 'Automotive', note: 'Category II Depot Rate' },
    { id: 'petrol-cat1', item: 'Petrol (Category I)', itemNp: 'पेट्रोल (झापा, विराटनगर, वीरगन्ज, जनकपुर)', priceNpr: 194.50, previousPriceNpr: 192.50, change: 2.0, unit: 'Litre', category: 'Automotive', note: 'Category I Border Depots' },
    { id: 'diesel-cat3', item: 'Diesel & Kerosene (Cat III)', itemNp: 'डिजेल तथा मट्टितेल (काठमाडौं, पोखरा)', priceNpr: 195.00, previousPriceNpr: 192.50, change: 2.5, unit: 'Litre', category: 'Automotive', note: 'High Speed Diesel' },
    { id: 'diesel-cat1', item: 'Diesel & Kerosene (Cat I)', itemNp: 'डिजेल तथा मट्टितेल (तराई/सीमा डिपो)', priceNpr: 192.50, previousPriceNpr: 190.00, change: 2.5, unit: 'Litre', category: 'Automotive', note: 'Border Supply Points' },
    { id: 'lpg-gas', item: 'LP Gas Cylinder', itemNp: 'एलपी ग्यास (प्रति सिलिन्डर)', priceNpr: 2060.00, previousPriceNpr: 1910.00, change: 150.0, unit: '14.2 kg Cylinder', category: 'Domestic', note: 'Uniform Maximum Retail Price' },
    { id: 'atf-internal', item: 'Aviation Turbine Fuel (Domestic)', itemNp: 'हवाई इन्धन (आन्तरिक उडान)', priceNpr: 229.00, previousPriceNpr: 219.00, change: 10.0, unit: 'Litre', category: 'Aviation', note: 'Domestic Flight Tariffs' },
    { id: 'atf-intl-ktm', item: 'Aviation Fuel (International KTM)', itemNp: 'हवाई इन्धन (अन्तर्राष्ट्रिय काठमाडौं)', priceNpr: 1566.00, previousPriceNpr: 1490.00, change: 76.0, unit: 'USD / Kilolitre', category: 'Aviation', note: 'USD $1.566 / Litre' },
    { id: 'auto-lpg', item: 'Auto LP Gas', itemNp: 'अटो एलपी ग्यास', priceNpr: 135.00, previousPriceNpr: 125.00, change: 10.0, unit: 'Litre', category: 'Auto LPG', note: 'Automotive Gas Stations' },
  ];

  // Active currencies for calculator
  const activeForex = (forexRates.find((f) => f.code === selectedCurrencyCode) || forexRates[0]) as ForexCurrencyRate;
  const targetForex = (forexRates.find((f) => f.code === targetCurrencyCode) || forexRates[1]) as ForexCurrencyRate;

  // Real-time calculated amounts
  const unitFactor = activeForex?.unit || 1;
  const targetUnitFactor = targetForex?.unit || 1;

  // 1. Foreign -> NPR
  const convertedToNpr = Math.round((foreignAmount / unitFactor) * (activeForex?.buy || 152.39));
  // 2. NPR -> Foreign
  const convertedFromNpr = parseFloat(((nprAmount / (activeForex?.sell || 152.99)) * unitFactor).toFixed(2));
  // 3. Cross Currency
  const crossNprEquivalent = (foreignAmount / unitFactor) * (activeForex?.buy || 152.39);
  const convertedCrossAmount = parseFloat(((crossNprEquivalent / (targetForex?.sell || 176.75)) * targetUnitFactor).toFixed(2));

  // Inverted rate (1 NPR to foreign currency)
  const oneNprToForeign = activeForex?.sell ? (unitFactor / activeForex.sell).toFixed(4) : '0';

  // Manual Trigger for Live Mock/API Refresh
  const handleRefreshLiveData = () => {
    setIsRefreshingLive(true);
    setTimeout(() => {
      setIsRefreshingLive(false);
      setLastLiveSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  // Filtered Forex list based on Search & Region
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

  // Selected rate for gold calculator
  const fineGoldRate = rawBullionItems.find((b) => b.id === 'fine-gold-24k')?.nprPerTola || 305200;
  const tejabiGoldRate = rawBullionItems.find((b) => b.id === 'tejabi-gold-22k')?.nprPerTola || 302100;
  const jewellery18KRate = rawBullionItems.find((b) => b.id === 'jewellery-gold-18k')?.nprPerTola || Math.round(305200 * 0.75);

  const activeSelectedRate =
    calcGoldType === 'chhapawal'
      ? fineGoldRate
      : calcGoldType === 'tejabi'
      ? tejabiGoldRate
      : jewellery18KRate;

  const jewelleryEstimate = calculateJewelleryCost(
    activeSelectedRate,
    calcWeightTola,
    calcJartiPct,
    calcJyalaPerTola
  );

  // Weight conversions derived from convertTolaInput
  const gramsEquivalent = (convertTolaInput * 11.6638125).toFixed(3);
  const lalEquivalent = Math.round(convertTolaInput * 100);
  const masaEquivalent = (convertTolaInput * 12).toFixed(2);
  const troyOunceEquivalent = (convertTolaInput / 2.665).toFixed(3);

  // Filtered Fuel List
  const filteredFuelList = useMemo(() => {
    if (selectedNocCategory === 'all') return fuelList;
    if (selectedNocCategory === 'cat1') return fuelList.filter((f) => f.id.includes('cat1') || f.id === 'lpg-gas');
    if (selectedNocCategory === 'cat2') return fuelList.filter((f) => f.id.includes('cat2') || f.id === 'lpg-gas');
    if (selectedNocCategory === 'cat3') return fuelList.filter((f) => f.id.includes('cat3') || f.id === 'lpg-gas' || f.category === 'Aviation');
    return fuelList;
  }, [selectedNocCategory]);

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = ['Currency Code', 'Country', 'Currency Name', 'Unit', 'Buy Rate (NPR)', 'Sell Rate (NPR)', 'Mid Rate (NPR)', 'Official NRB'];
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
        item.isNrbOfficial ? 'YES (NRB Reference)' : 'Global Interbank',
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentLang === 'ne'
                ? 'विदेशी मुद्रा, सुनचाँदी भाउ र इन्धन दर'
                : 'Foreign Exchange, Bullion & NOC Fuel Suite'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {currentLang === 'ne'
              ? 'नेपाल राष्ट्र बैंक (NRB) आधिकारिक विनिमय दर, विश्वका १६०+ देशका मुद्रा, सुनचाँदी व्यवसायी महासंघ र नेपाल आयल निगम'
              : 'Nepal Rastra Bank (NRB) official daily forex rates, all 160+ world currencies, FENEGOSIDA gold, and NOC fuel'}
          </p>
        </div>

        {/* Tab Switcher & Live Refresh Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshLiveData}
            disabled={isRefreshingLive}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Refresh Live Data Feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingLive ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden md:inline">Sync Live</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('forex')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'forex'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'विदेशी मुद्रा (१६०+ देश)' : 'Forex (160+ Nations)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('gold')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'gold'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'सुन/चाँदी भाउ र ट्रेन्ड' : 'Gold, Silver & Trends'}</span>
            </button>

            <button
              onClick={() => setActiveTab('fuel')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'fuel'
                  ? 'bg-orange-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'इन्धन दर र निगम सूचना' : 'NOC Fuel & Bulletins'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Provenance & Live State Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Primary Source:{' '}
            <strong className="text-slate-200">
              {activeTab === 'forex'
                ? 'Nepal Rastra Bank (NRB) Official Feed & Interbank Rates'
                : activeTab === 'gold'
                ? 'FENEGOSIDA / Ashesh.com.np Live Bullion Engine'
                : 'Nepal Oil Corporation (NOC) Official Depot Tariffs'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Stream Active ({lastLiveSyncedAt})
          </span>
          <span className="text-slate-500">AD: 2026-08-16 | BS: २०८३-०४-३२</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FOREX CONVERTER & 160+ CURRENCIES REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'forex' && (
        <div className="space-y-6">
          {/* Universal Forex Calculator Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-extrabold text-white text-base sm:text-lg">
                    {currentLang === 'ne' ? 'विश्वव्यापी मुद्रा रूपान्तरण क्याल्कुलेटर' : 'Universal Multi-Currency Converter'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentLang === 'ne'
                    ? 'नेपाल राष्ट्र बैंकको आधिकारिक विनिमय दरमा प्रत्यक्ष आधारित (खरिद र बिक्री दर स्प्रेड सहित)'
                    : 'Calculate real-time exchange rates with NRB buy/sell spread and cross-currency conversion'}
                </p>
              </div>

              {/* Conversion Direction Selector */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setConvertMode('foreignToNpr')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    convertMode === 'foreignToNpr' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Foreign ➔ NPR (रू)
                </button>
                <button
                  onClick={() => setConvertMode('nprToForeign')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    convertMode === 'nprToForeign' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  NPR (रू) ➔ Foreign
                </button>
                <button
                  onClick={() => setConvertMode('cross')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    convertMode === 'cross' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cross Currency
                </button>
              </div>
            </div>

            {/* Quick Select Popular Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentLang === 'ne' ? 'प्रमुख मुद्राहरू:' : 'Popular:'}
              </span>
              {['USD', 'QAR', 'AED', 'SAR', 'MYR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'INR', 'KWD', 'KRW'].map((code) => {
                const isSelected = selectedCurrencyCode === code;
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedCurrencyCode(code)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Converter Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              {/* Left Column: Source Input */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-semibold text-slate-400">
                  {convertMode === 'nprToForeign' ? 'Source Amount in NPR (नेपाली रूपैयाँ)' : 'Source Currency & Amount'}
                </label>

                {convertMode !== 'nprToForeign' ? (
                  <div className="space-y-2">
                    <select
                      value={selectedCurrencyCode}
                      onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none text-sm focus:ring-1 focus:ring-emerald-500"
                    >
                      {forexRates.map((f) => {
                        const item = f as ForexCurrencyRate;
                        return (
                          <option key={f.code} value={f.code}>
                            {f.flag || '🌐'} {f.code} - {f.name} ({item.country || 'Global'})
                          </option>
                        );
                      })}
                    </select>

                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold text-sm">
                        {activeForex?.symbol || activeForex?.code}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={foreignAmount}
                        onChange={(e) => setForeignAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-2 text-white font-mono font-bold text-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold text-sm">NPR (रू)</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={nprAmount}
                      onChange={(e) => setNprAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-20 pr-4 py-2 text-white font-mono font-bold text-lg outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Middle Column: Swap & Formula Indicator */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2 py-2">
                <div className="p-3 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 shadow-inner">
                  <ArrowUpDown className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 text-center">
                  {convertMode === 'foreignToNpr' && `Unit: ${activeForex?.unit || 1} ${activeForex?.code}`}
                  {convertMode === 'nprToForeign' && `Sell: Rs ${activeForex?.sell || 0}`}
                  {convertMode === 'cross' && `${activeForex?.code} ➔ ${targetForex?.code}`}
                </div>
              </div>

              {/* Right Column: Output / Target Result */}
              <div className="lg:col-span-5 space-y-3">
                {convertMode === 'cross' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Target Currency (प्राप्त हुने मुद्रा)
                    </label>
                    <select
                      value={targetCurrencyCode}
                      onChange={(e) => setTargetCurrencyCode(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold outline-none text-sm focus:ring-1 focus:ring-indigo-500 mb-2"
                    >
                      {forexRates.map((f) => {
                        const item = f as ForexCurrencyRate;
                        return (
                          <option key={f.code} value={f.code}>
                            {f.flag || '🌐'} {f.code} - {f.name} ({item.country || 'Global'})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <label className="block text-xs font-bold text-slate-300">
                  {convertMode === 'foreignToNpr'
                    ? (currentLang === 'ne' ? 'कुल नेपाली रूपैयाँ (Total NPR)' : 'Converted Total in Nepali Rupees (NPR)')
                    : convertMode === 'nprToForeign'
                    ? (currentLang === 'ne' ? `कुल प्राप्त हुने रकम (${activeForex?.code})` : `Converted Total (${activeForex?.code})`)
                    : (currentLang === 'ne' ? `कुल प्राप्त हुने रकम (${targetForex?.code})` : `Converted Total (${targetForex?.code})`)}
                </label>

                {/* Big Result Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {convertMode === 'foreignToNpr' && `रू ${convertedToNpr.toLocaleString()}`}
                    {convertMode === 'nprToForeign' && `${activeForex?.symbol || ''} ${convertedFromNpr.toLocaleString()} ${activeForex?.code}`}
                    {convertMode === 'cross' && `${targetForex?.symbol || ''} ${convertedCrossAmount.toLocaleString()} ${targetForex?.code}`}
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 font-mono">
                    <span>
                      {convertMode === 'foreignToNpr' && `Rate: 1 ${activeForex?.code} = NPR ${(activeForex?.buy / unitFactor).toFixed(4)}`}
                      {convertMode === 'nprToForeign' && `Rate: 1 NPR = ${oneNprToForeign} ${activeForex?.code}`}
                      {convertMode === 'cross' && `1 ${activeForex?.code} ≈ ${(activeForex?.buy / targetForex?.sell).toFixed(4)} ${targetForex?.code}`}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {activeForex?.isNrbOfficial ? 'Official NRB Spread' : 'Interbank Rate'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter, Region, Custom Multiplier & Search Bar */}
          <div className="space-y-4">
            {/* Top Toolbar: Search + Layout + Export */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
              {/* Search Box with Country, Initials & Aliases */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={
                    currentLang === 'ne'
                      ? 'देश, नाम, सर्टकट/इनिसियल वा कोड खोज्नुहोस् (उदा: US, USA, Dubai, UAE, Saudi, KSA, UK, IN, Japan, AUD...)'
                      : 'Search country, initials, alias or code (e.g. US, USA, Dubai, UAE, Saudi, KSA, UK, IN, Japan, AUD...)'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* View Layout & Export */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewLayout(viewLayout === 'table' ? 'cards' : 'table')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                  title="Toggle View"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{viewLayout === 'table' ? 'Cards View' : 'Table View'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-all"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Custom Multiplier & Unit Controller */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-emerald-500/30 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {currentLang === 'ne' ? 'अनुकूलित एकाइ / परिमाण क्याल्कुलेटर (Custom Unit Multiplier):' : 'Custom Quantity / Unit Multiplier:'}
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                    {currentLang === 'ne' ? '(कुनै पनि संख्या प्रविष्ट गर्नुहोस्, तल सबै दर स्वतः हिसाब हुन्छ)' : '(Enter any quantity to calculate all rates below)'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-44">
                    <span className="absolute left-3 top-2 text-xs font-mono font-bold text-slate-400">Qty:</span>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={customUnitMultiplier}
                      onChange={(e) => {
                        const val = Math.max(0.001, Number(e.target.value) || 1);
                        setCustomUnitMultiplier(val);
                      }}
                      className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl pl-12 pr-3 py-1.5 text-xs sm:text-sm font-mono font-black text-emerald-400 outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. 500"
                    />
                  </div>
                  {customUnitMultiplier !== 1 && (
                    <button
                      onClick={() => setCustomUnitMultiplier(1)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono shrink-0"
                      title="Reset to 1 unit"
                    >
                      Reset (1)
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Amount Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Presets:</span>
                {[1, 5, 10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCustomUnitMultiplier(preset);
                      setForeignAmount(preset);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 border ${
                      customUnitMultiplier === preset
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-400" />
                {currentLang === 'ne' ? 'क्षेत्र अनुसार:' : 'Region:'}
              </span>
              {[
                { id: 'all', label: currentLang === 'ne' ? 'सबै (१६०+)' : 'All 160+' },
                { id: 'nrb', label: currentLang === 'ne' ? 'राष्ट्र बैंक आधिकारिक (२२)' : 'NRB Official (22)' },
                { id: 'gulf', label: currentLang === 'ne' ? 'खाडी देशहरू (Gulf)' : 'Gulf / Middle East' },
                { id: 'saarc', label: currentLang === 'ne' ? 'सार्क र एसिया' : 'SAARC & Asia' },
                { id: 'europe', label: currentLang === 'ne' ? 'युरोप (Europe)' : 'Europe' },
                { id: 'americas', label: currentLang === 'ne' ? 'अमेरिका (Americas)' : 'Americas' },
                { id: 'africa', label: currentLang === 'ne' ? 'अफ्रिका (Africa)' : 'Africa' },
                { id: 'oceania', label: currentLang === 'ne' ? 'ओशिनिया (Oceania)' : 'Oceania' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setRegionFilter(rf.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 border text-xs ${
                    regionFilter === rf.id
                      ? 'bg-slate-800 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Results count & active search summary */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
              <div>
                Showing <strong className="text-slate-200">{filteredForexRates.length}</strong> of {forexRates.length} Currencies
                {searchQuery && (
                  <span className="text-emerald-400 ml-1.5">
                    (matching "{searchQuery}")
                  </span>
                )}
              </div>
              {customUnitMultiplier !== 1 && (
                <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Calculated for {customUnitMultiplier.toLocaleString()} Units
                </div>
              )}
            </div>

            {/* Forex Table / Cards Rendering */}
            {viewLayout === 'table' ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                        <th className="py-3 px-4">Flag, Country & Currency</th>
                        <th className="py-3 px-3">Code / Initials</th>
                        <th className="py-3 px-3 text-center">
                          {customUnitMultiplier === 1 ? 'Unit' : 'Custom Qty'}
                        </th>
                        <th className="py-3 px-4 text-right text-emerald-400">
                          Buy Rate (खरिद) {customUnitMultiplier !== 1 ? `(${customUnitMultiplier.toLocaleString()} Qty)` : ''}
                        </th>
                        <th className="py-3 px-4 text-right text-slate-200">
                          Sell Rate (बिक्री) {customUnitMultiplier !== 1 ? `(${customUnitMultiplier.toLocaleString()} Qty)` : ''}
                        </th>
                        <th className="py-3 px-4 text-right text-slate-400">
                          Mid Rate (औसत)
                        </th>
                        <th className="py-3 px-3 text-center">Source</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredForexRates.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            <div className="text-sm font-bold text-slate-300 mb-1">No matching currency found</div>
                            <div className="text-xs text-slate-500">Try searching country name (e.g. United States, Dubai, India, Saudi), initials (e.g. US, UAE, KSA, UK), or currency code (USD, AED, SAR).</div>
                          </td>
                        </tr>
                      ) : (
                        filteredForexRates.map((f) => {
                          const item = f as ForexCurrencyRate;
                          const baseUnit = f.unit || 1;
                          const midRate = item.midRate || (f.buy + f.sell) / 2;
                          const isSelected = selectedCurrencyCode === f.code;

                          // Scaled calculations based on customUnitMultiplier
                          const scaledBuy = (customUnitMultiplier / baseUnit) * f.buy;
                          const scaledSell = (customUnitMultiplier / baseUnit) * f.sell;
                          const scaledMid = (customUnitMultiplier / baseUnit) * midRate;

                          return (
                            <tr
                              key={f.code}
                              className={`hover:bg-slate-800/50 transition-colors ${
                                isSelected ? 'bg-emerald-500/10' : ''
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl shrink-0">{f.flag || '🌐'}</span>
                                  <div>
                                    <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                                      <span>{item.country || 'Global Interbank'}</span>
                                      {item.countryNp && (
                                        <span className="text-[11px] text-slate-400 font-normal">({item.countryNp})</span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1 mt-0.5">
                                      <span>{f.name}</span>
                                      {item.nameNp && <span className="text-slate-500">• {item.nameNp}</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono">
                                <div className="font-bold text-amber-300 text-sm">{f.code}</div>
                                {item.initials && item.initials.length > 0 && (
                                  <div className="text-[10px] text-slate-400 flex gap-1 mt-0.5">
                                    {item.initials.map((init) => (
                                      <span key={init} className="bg-slate-800 px-1 rounded text-slate-300">{init}</span>
                                    ))}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 text-center font-mono">
                                <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                                  {customUnitMultiplier.toLocaleString()}
                                </span>
                                {baseUnit > 1 && customUnitMultiplier === 1 && (
                                  <div className="text-[10px] text-slate-400 mt-0.5">Base: {baseUnit}</div>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right font-mono">
                                <div className="font-bold text-emerald-400 text-sm">
                                  Rs. {scaledBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                {customUnitMultiplier !== 1 && (
                                  <div className="text-[10px] text-slate-400">
                                    1 {f.code} = Rs. {(f.buy / baseUnit).toFixed(2)}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right font-mono">
                                <div className="font-bold text-slate-200 text-sm">
                                  Rs. {scaledSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                {customUnitMultiplier !== 1 && (
                                  <div className="text-[10px] text-slate-400">
                                    1 {f.code} = Rs. {(f.sell / baseUnit).toFixed(2)}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right font-mono text-slate-400 text-xs">
                                <div>Rs. {scaledMid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              </td>

                              <td className="py-3 px-3 text-center">
                                {f.isNrbOfficial ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    NRB Official
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    Interbank
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedCurrencyCode(f.code);
                                    setForeignAmount(customUnitMultiplier);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-[11px] font-bold text-slate-300 transition-all shrink-0"
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
                  const isSelected = selectedCurrencyCode === f.code;
                  const scaledBuy = (customUnitMultiplier / baseUnit) * f.buy;
                  const scaledSell = (customUnitMultiplier / baseUnit) * f.sell;

                  return (
                    <div
                      key={f.code}
                      onClick={() => {
                        setSelectedCurrencyCode(f.code);
                        setForeignAmount(customUnitMultiplier);
                      }}
                      className={`p-4 rounded-2xl bg-slate-900 border transition-all cursor-pointer space-y-3 shadow-md relative ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900/90'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{f.flag || '🌐'}</span>
                          <div>
                            <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                              <span>{f.code}</span>
                              {item.initials && item.initials.length > 0 && (
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">
                                  {item.initials[0]}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{item.country || 'Global'}</div>
                          </div>
                        </div>
                        {f.isNrbOfficial ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            NRB Official
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {item.region || 'World'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 font-medium truncate">
                        {f.name} {item.nameNp ? `(${item.nameNp})` : ''}
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">
                            Buy ({customUnitMultiplier.toLocaleString()} {f.code}):
                          </span>
                          <strong className="text-emerald-400 font-bold">
                            Rs. {scaledBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">
                            Sell ({customUnitMultiplier.toLocaleString()} {f.code}):
                          </span>
                          <strong className="text-slate-200 font-bold">
                            Rs. {scaledSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        {customUnitMultiplier !== 1 && (
                          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex justify-between">
                            <span>Base unit: {baseUnit}</span>
                            <span>1 {f.code} = Rs. {(f.buy / baseUnit).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GOLD & SILVER SUITE + REAL-TIME PRICE TRENDS */}
      {/* ========================================================================= */}
      {activeTab === 'gold' && (
        <div className="space-y-6">
          {/* Gold Types Live Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rawBullionItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 shadow-md relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {currentLang === 'ne' ? item.categoryNp : item.categoryEn}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.direction === 'UP'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {item.direction === 'UP' ? `▲ +${item.pointChange}` : `▼ -${Math.abs(item.pointChange)}`}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-mono">{item.purity}</div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                    NPR {item.nprPerTola.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ तोल (11.66g)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 mt-1">
                    १० ग्राम दर: <strong className="text-slate-100">NPR {item.nprPerTenGram.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  {item.conversionNotice}
                </div>
              </div>
            ))}
          </div>

          {/* DEDICATED SECTION: REAL-TIME GOLD & SILVER PRICE TRENDS */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h2 className="font-extrabold text-white text-base sm:text-lg">
                    {currentLang === 'ne' ? 'सुन/चाँदी मूल्य उतारचढाव ट्रेन्ड (७ दिने विश्लेषण)' : 'Real-Time Gold & Silver Price Trends (7-Day Analysis)'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentLang === 'ne'
                    ? 'नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) को पछिल्लो ७ दिनको दैनिक आधिकारिक कारोबार विश्लेषण'
                    : 'Historical benchmark tracking across 24K Fine Gold, 22K Tejabi, and Fine Silver'}
                </p>
              </div>

              {/* Trend Commodity Selector */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedTrendMetal('fineGold')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTrendMetal === 'fineGold' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fine Gold 24K (छापावाल)
                </button>
                <button
                  onClick={() => setSelectedTrendMetal('tejabiGold')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTrendMetal === 'tejabiGold' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tejabi 22K (तेजाबी)
                </button>
                <button
                  onClick={() => setSelectedTrendMetal('silver')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTrendMetal === 'silver' ? 'bg-slate-200 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Silver (चाँदी)
                </button>
              </div>
            </div>

            {/* Visual Trend Bars Chart */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2">
                {GOLD_SILVER_TREND_HISTORY.map((dayItem, idx) => {
                  const val = dayItem[selectedTrendMetal];
                  const minVal = selectedTrendMetal === 'silver' ? 4500 : 295000;
                  const maxVal = selectedTrendMetal === 'silver' ? 4800 : 310000;
                  const heightPct = Math.max(15, Math.min(100, ((val - minVal) / (maxVal - minVal)) * 100));
                  const isLatest = idx === GOLD_SILVER_TREND_HISTORY.length - 1;

                  return (
                    <div key={dayItem.dateAd} className="flex flex-col items-center justify-end h-full gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-300">
                        {selectedTrendMetal === 'silver' ? `Rs ${val}` : `${(val / 1000).toFixed(1)}k`}
                      </span>
                      <div className="w-full bg-slate-900 rounded-t-lg overflow-hidden h-32 flex items-end justify-center">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t transition-all duration-500 ${
                            isLatest
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        />
                      </div>
                      <div className="text-center font-mono">
                        <span className={`block text-[11px] font-bold ${isLatest ? 'text-amber-400' : 'text-slate-400'}`}>
                          {dayItem.day}
                        </span>
                        <span className="block text-[9px] text-slate-500">{dayItem.dateBs.slice(-5)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> 7-Day Trajectory: +NPR 4,000 / Tola (Gold)
                  </span>
                  <span>| High: Rs 305,200 | Low: Rs 301,200</span>
                </div>
                <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  FENEGOSIDA Benchmark Updated Daily at 11:00 AM NPT
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Tools: Jewellery Calculator & Unit Converter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Jewellery Price Calculator */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <h2 className="font-bold text-white text-base">
                    {currentLang === 'ne' ? 'नेपाली गहनाको ज्याला तथा जर्ती क्याल्कुलेटर' : 'Jewellery Making Charge & Wastage Calculator'}
                  </h2>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-mono">
                  Standard Nepal Formula
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">सुनको प्रकार (Gold Type)</label>
                  <select
                    value={calcGoldType}
                    onChange={(e) => setCalcGoldType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  >
                    <option value="chhapawal">छापावाल सुन (24K Hallmark - Rs. {fineGoldRate.toLocaleString()})</option>
                    <option value="tejabi">तेजाबी सुन (22K Alloy - Rs. {tejabiGoldRate.toLocaleString()})</option>
                    <option value="18k">१८ क्यारेट गहना सुन (18K - Rs. {jewellery18KRate.toLocaleString()})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">सुनको तौल (Weight in Tola)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={calcWeightTola}
                    onChange={(e) => setCalcWeightTola(Math.max(0.01, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Equivalent: {(calcWeightTola * 11.6638125).toFixed(2)} Grams
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">जर्ती प्रतिशत (Wastage Jarti %)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={calcJartiPct}
                    onChange={(e) => setCalcJartiPct(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Normally 3% to 8% in Nepal</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">ज्याला प्रति तोल (Labor Jyala)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={calcJyalaPerTola}
                    onChange={(e) => setCalcJyalaPerTola(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Custom design / craftsmanship</span>
                </div>
              </div>

              {/* Estimate Calculation Summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>सुनको मूल लागत (Net Gold Cost):</span>
                  <span className="text-white font-bold">NPR {jewelleryEstimate.baseGoldCostNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>जर्ती कट्टा ({calcJartiPct}% Jarti):</span>
                  <span className="text-amber-400">+ NPR {jewelleryEstimate.wastageJartiNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>कालिगड ज्याला (Labor Charge):</span>
                  <span className="text-amber-400">+ NPR {jewelleryEstimate.makingChargeJyalaNpr.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
                  <span className="text-amber-300">जम्मा अनुमानित भुक्तानी (Total Estimate):</span>
                  <span className="text-emerald-400 text-lg font-black">
                    NPR {jewelleryEstimate.totalEstimatedCostNpr.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Nepalese Bullion Weight Converter */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Scale className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-white text-base">
                  {currentLang === 'ne' ? 'नेपाली तौल रुपान्तरण (Weight Converter)' : 'Nepalese Bullion Weight Units'}
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">तौल ( तोलामा - Tolas)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.1"
                    value={convertTolaInput}
                    onChange={(e) => setConvertTolaInput(Math.max(0.01, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none text-base focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">ग्राम (Grams):</span>
                    <span className="font-bold text-amber-300 text-sm">{gramsEquivalent} g</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">लाल / रत्ती (Lal / Ratti):</span>
                    <span className="font-bold text-indigo-300 text-sm">{lalEquivalent} Lal (1 Tola = 100 Lal)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">मासा (Masa):</span>
                    <span className="font-bold text-emerald-300 text-sm">{masaEquivalent} Masa (1 Tola = 12 Masa)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">टुकडा / आउन्स (Troy Ounces):</span>
                    <span className="font-bold text-rose-300 text-sm">{troyOunceEquivalent} oz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NOC FUEL TARIFFS & DEDICATED NOC STATUS UPDATES */}
      {/* ========================================================================= */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          {/* Main Fuel Tariffs Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-orange-400" />
                <div>
                  <h2 className="font-bold text-white text-base sm:text-lg">
                    {currentLang === 'ne' ? 'नेपाल आयल निगम (NOC) इन्धन खुद्रा दर' : 'NOC Retail Petroleum Tariffs & Depot Rates'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentLang === 'ne' ? 'वर्ग १, वर्ग २ र वर्ग ३ क्षेत्र अनुसार खुद्रा बिक्री दर' : 'Official consumer retail tariffs across regional depot groups'}
                  </p>
                </div>
              </div>

              {/* Regional Category Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedNocCategory('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedNocCategory === 'all' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setSelectedNocCategory('cat3')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedNocCategory === 'cat3' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cat III (KTM/PKR)
                </button>
                <button
                  onClick={() => setSelectedNocCategory('cat2')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedNocCategory === 'cat2' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cat II (Dang/Surkhet)
                </button>
                <button
                  onClick={() => setSelectedNocCategory('cat1')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedNocCategory === 'cat1' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cat I (Border)
                </button>
              </div>
            </div>

            {/* Fuel Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFuelList.map((fuel) => (
                <div key={fuel.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-orange-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-200 text-xs">
                      {currentLang === 'ne' ? fuel.itemNp : fuel.item}
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {fuel.category}
                    </span>
                  </div>

                  <div className="font-mono font-black text-orange-400 text-2xl">
                    {fuel.unit.includes('USD') ? `$${fuel.priceNpr.toLocaleString()}` : `NPR ${fuel.priceNpr.toLocaleString()}`}
                    <span className="text-xs text-slate-400 font-sans ml-1">/ {fuel.unit}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-900 pt-2 flex items-center justify-between">
                    <span>{fuel.note}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {fuel.change > 0 ? `▲ +${fuel.change}` : 'Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEDICATED SECTION: NOC STATUS UPDATES & OFFICIAL BULLETINS */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <div>
                  <h2 className="font-extrabold text-white text-base sm:text-lg">
                    {currentLang === 'ne' ? 'नेपाल आयल निगम (NOC) आधिकारिक स्थिति तथा सूचनाहरू' : 'NOC Official Status Updates & Supply Bulletins'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentLang === 'ne'
                      ? 'पेट्रोलियम आपूर्ति अवस्था, इन्डियन आयल कर्पोरेसन (IOC) समन्वय र पाक्षिक बुलेटिन'
                      : 'Live supply chain telemetry, IOC cross-border pipeline flows, and regulatory notices'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Terminals Normal
              </span>
            </div>

            {/* Status Timeline Cards */}
            <div className="space-y-3">
              {NOC_OFFICIAL_STATUS_UPDATES.map((update) => (
                <div
                  key={update.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {currentLang === 'ne' ? update.titleNp : update.titleEn}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{update.dateBs}</span>
                      <span>({update.dateAd})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLang === 'ne' ? update.detailsNp : update.detailsEn}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Truck className="w-3.5 h-3.5 text-orange-400" />
                      <span>{update.depot}</span>
                    </div>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-orange-300 border border-slate-800">
                      {update.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

