import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Compass,
  CloudSun,
  Coins,
  Fuel,
  Radio,
  ArrowUpRight,
  ShieldAlert,
  Bell,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { getKeeperItems, computeKeeperStatus } from '../../utils/sajiloKeeperStore';
import { KeeperItem, KalimatiProduceItem } from '../../types/sajiloTypes';
import { useRadioAudio } from '../../context/RadioAudioContext';

interface SajiloTodayTabProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tabId: string) => void;
  devanagariNumerals: boolean;
}

export const SajiloTodayTab: React.FC<SajiloTodayTabProps> = ({
  currentLang,
  onNavigateTab,
  devanagariNumerals,
}) => {
  const { timeState } = useGlobalTime();
  const { currentStation, isPlaying } = useRadioAudio();
  const [keeperAlerts, setKeeperAlerts] = useState<{ item: KeeperItem; daysLeft: number; status: string }[]>([]);
  const [kalimatiHighlight, setKalimatiHighlight] = useState<KalimatiProduceItem[]>([]);
  const [isLoadingKalimati, setIsLoadingKalimati] = useState(true);

  const [goldPerTola, setGoldPerTola] = useState<string | null>(null);
  const [silverPerTola, setSilverPerTola] = useState<string | null>(null);
  const [petrolPrice, setPetrolPrice] = useState<string | null>(null);
  const [dieselPrice, setDieselPrice] = useState<string | null>(null);
  const [ktmTemp, setKtmTemp] = useState<string | null>(null);
  const [ktmCondition, setKtmCondition] = useState<string | null>(null);
  const [ktmAqi, setKtmAqi] = useState<string | null>(null);
  const [ktmAqiCat, setKtmAqiCat] = useState<string | null>(null);

  useEffect(() => {
    const items = getKeeperItems();
    const alerts = items
      .map((item) => {
        const { status, daysLeft } = computeKeeperStatus(item);
        return { item, daysLeft, status };
      })
      .filter((a) => a.status === 'urgent' || a.status === 'expiring_soon' || a.status === 'expired')
      .slice(0, 3);
    setKeeperAlerts(alerts);

    fetch('/api/live/kalimati')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data)) {
          setKalimatiHighlight(payload.data.slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingKalimati(false));

    fetch('/api/live/metals')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const gold = list.find((m: any) => m.id === 'fine-gold-24k' || /fine/i.test(m.categoryEn || ''));
        const silver = list.find((m: any) => m.id === 'silver' || /silver/i.test(m.categoryEn || ''));
        if (typeof gold?.nprPerTola === 'number') setGoldPerTola(gold.nprPerTola.toLocaleString('en-IN'));
        if (typeof silver?.nprPerTola === 'number') setSilverPerTola(silver.nprPerTola.toLocaleString('en-IN'));
      })
      .catch(() => {});

    fetch('/api/live/fuel')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const tariffs = Array.isArray(payload?.tariffs)
          ? payload.tariffs
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        const petrol = tariffs.find((f: any) => /petrol/i.test(f.productEn || f.name || ''));
        const diesel = tariffs.find((f: any) => /diesel/i.test(f.productEn || f.name || ''));
        if (typeof petrol?.priceNpr === 'number') setPetrolPrice(petrol.priceNpr.toFixed(2));
        if (typeof diesel?.priceNpr === 'number') setDieselPrice(diesel.priceNpr.toFixed(2));
      })
      .catch(() => {});

    fetch('/api/live/weather')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const ktm = list.find((c: any) => /kathmandu/i.test(c.city || '')) || list[0];
        if (ktm) {
          if (typeof ktm.temperature === 'number') setKtmTemp(String(Math.round(ktm.temperature)));
          if (ktm.condition || ktm.conditionNp) {
            setKtmCondition(currentLang === 'ne' ? ktm.conditionNp || ktm.condition : ktm.condition);
          }
          if (typeof ktm.aqiUs === 'number') setKtmAqi(String(ktm.aqiUs));
          if (ktm.aqiCategory) setKtmAqiCat(ktm.aqiCategory);
        }
      })
      .catch(() => {});
  }, [currentLang]);

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  return (
    <div className="space-y-4">
      {/* 1. Today Dual Date & Keeper Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {currentLang === 'ne' ? 'आजको मिति तथा समय' : 'NEPAL STANDARD DATE & TIME'}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {timeState.tzAbbrev} · UTC +05:45
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <span className="font-semibold text-[#0B1F3A] dark:text-white">
                AD: {timeState.adDateFormatted}
              </span>
              <span aria-hidden="true">·</span>
              <span>{timeState.time12h}</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentLang === 'ne' ? 'आधिकारिक विक्रम संवत् / ई.सं. रूपान्तरण' : 'Dual Bikram Sambat & Gregorian Engine'}
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-[#0B1F3A] dark:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{currentLang === 'ne' ? 'पात्रो तथा मिति रूपान्तरण' : 'Calendar & Date Converter'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Keeper Status Tile */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Personal Keeper
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                Offline-First
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-bold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{currentLang === 'ne' ? 'कागजात नवीकरण' : 'Renewal Keeper'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {currentLang === 'ne'
                  ? 'नागरिकता, राहदानी, सवारी चालक अनुमतिपत्र र ब्लुबुक नवीकरण ट्र्याकर।'
                  : 'Track Citizenship, Passport, Driving License & Bluebook renewal deadlines.'}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] tabular-nums">
              {keeperAlerts.length > 0 ? `${keeperAlerts.length} urgent notices` : 'No expiring records'}
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('keeper')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{currentLang === 'ne' ? 'किपर खोल्नुहोस्' : 'Open Keeper'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Keeper Banner */}
      {keeperAlerts.length > 0 && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#0B1F3A] dark:text-white">
                  {currentLang === 'ne' ? 'किपर सतर्कता: नवीकरण गर्न बाँकी कागजातहरू' : 'Keeper Alert: Document Expiry Pending'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {currentLang === 'ne'
                    ? `${formatDigits(keeperAlerts.length)} वटा कागजातको नवीकरण समय नजिकिँदैछ वा सकिएको छ।`
                    : `${keeperAlerts.length} document(s) need renewal soon or have expired.`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('keeper')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              {currentLang === 'ne' ? 'किपर हेर्नुहोस्' : 'View Keeper'}
            </button>
          </div>
        </div>
      )}

      {/* Curated Links Spotlight */}
      <button
        type="button"
        onClick={() => onNavigateTab('links')}
        className="w-full text-left p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex flex-wrap items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span>{currentLang === 'ne' ? 'उपयोगी लिङ्कहरू र खुला स्रोत हब' : 'Curated Useful Links, Sajilo & FMHY Hub'}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                FMHY + Portals
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentLang === 'ne'
                ? 'उपयोगी नेपाली पोर्टल, खुला सफ्टवेयर र विकासकर्ता उपकरणहरूको निर्देशिका'
                : 'Verified bookmarks, open web utilities, and official Nepal portal links'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold shrink-0">
          <span>{currentLang === 'ne' ? 'लिङ्कहरू हेर्नुहोस्' : 'Explore Links'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </button>

      {/* 3. Live Market & Weather Glance Grid (Strict Rule 16: Real API data or 'Unavailable') */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => onNavigateTab('bazar')}
          className="text-left p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              {currentLang === 'ne' ? 'सुन/चाँदी दर' : 'Gold & Silver'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'छापावाल सुन (तोला)' : 'Fine Gold / Tola'}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                {goldPerTola ? `रू. ${formatDigits(goldPerTola)}` : '—'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'चाँदी (तोला)' : 'Silver / Tola'}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                {silverPerTola ? `रू. ${formatDigits(silverPerTola)}` : '—'}
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {goldPerTola ? 'FENEGOSIDA Feed' : 'Official data is currently unavailable.'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('bazar')}
          className="text-left p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {currentLang === 'ne' ? 'पेट्रोलियम दर' : 'Fuel Prices'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'पेट्रोल (प्रति लिटर)' : 'Petrol / L'}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                {petrolPrice ? `रू. ${formatDigits(petrolPrice)}` : '—'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'डिजेल (प्रति लिटर)' : 'Diesel / L'}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                {dieselPrice ? `रू. ${formatDigits(dieselPrice)}` : '—'}
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {petrolPrice ? 'Nepal Oil Corporation (NOC)' : 'Official data is currently unavailable.'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('weather')}
          className="text-left p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {currentLang === 'ne' ? 'काठमाडौं मौसम र एक्युआई' : 'Kathmandu Weather'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentLang === 'ne' ? 'तापक्रम' : 'Temp'}</span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                {ktmTemp ? `${formatDigits(ktmTemp)}°C${ktmCondition ? ` (${ktmCondition})` : ''}` : '—'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'वायु गुणस्तर (AQI)' : 'Air Quality'}
              </span>
              <span className="text-xs font-semibold font-mono tabular-nums px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {ktmAqi ? `${formatDigits(ktmAqi)}${ktmAqiCat ? ` · ${ktmAqiCat}` : ''}` : '—'}
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {ktmTemp ? 'Open-Meteo Feed' : 'Weather feed unavailable'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('radio')}
          className="text-left p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {currentLang === 'ne' ? 'रेडियो नेपाल प्रत्यक्ष' : 'Nepal FM Radio'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate max-w-[130px]">
                {currentStation ? currentStation.name : 'Radio Nepal'}
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                {currentStation ? currentStation.frequency : '100.0 MHz'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[11px] font-mono">{isPlaying ? 'Playing Stream' : '10+ Broadcast Stations'}</span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Public Radio Broadcasters
          </div>
        </button>
      </div>

      {/* 4. Kalimati Produce Rates */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white">
                {currentLang === 'ne' ? 'कालिमाटी फलफूल तथा तरकारी दर (दैनिक थोक)' : 'Kalimati Wholesale Produce Highlights'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kalimati Fruits and Vegetable Market Development Board
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('bazar')}
            className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{currentLang === 'ne' ? 'सबै दर हेर्नुहोस्' : 'View Full Bazar'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingKalimati ? (
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 py-6 text-center">
            Loading Kalimati Produce Rates...
          </div>
        ) : kalimatiHighlight.length === 0 ? (
          <div className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
            {currentLang === 'ne' ? 'आधिकारिक तथ्याङ्क हाल उपलब्ध छैन।' : 'Official data is currently unavailable.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kalimatiHighlight.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800"
              >
                <div className="text-xs font-semibold text-[#0B1F3A] dark:text-white truncate">
                  {currentLang === 'ne' ? item.commodityNp : item.commodity}
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Avg / {item.unit}</span>
                  <span className="text-xs font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    रू. {formatDigits(item.avgPrice)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between mt-1 pt-1 border-t border-slate-200 dark:border-slate-800 tabular-nums">
                  <span>Min: {formatDigits(item.minPrice)}</span>
                  <span>Max: {formatDigits(item.maxPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Cultural & Vedic Heritage Shortcuts */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white">
                {currentLang === 'ne' ? 'ज्योतिष, संस्कार तथा सनातन धरोहर' : 'Vedic, Heritage & Astro Almanac'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cultural calendars, auspicious dates & reference guides
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'saait', labelNp: 'शुभ साइत तथा लगन', labelEn: 'Shubha Saait', sub: 'विवाह, व्रतबन्ध, पास्नी' },
            { id: 'kundali', labelNp: 'कुण्डली र गुण मिलान', labelEn: 'Kundali & Milan', sub: '१२ भाव कुण्डली, ३६ गुण' },
            { id: 'gotra', labelNp: 'थर, गोत्र र कुलदेवता', labelEn: 'Gotra & Clan', sub: 'नेपाली थर, प्रवर' },
            { id: 'stotra', labelNp: 'स्तोत्र र १०८ जप', labelEn: 'Stotra & 108 Japa', sub: 'हनुमान चालिसा, पूजा विधि' },
          ].map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => onNavigateTab(tile.id)}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-colors group cursor-pointer"
            >
              <div className="text-xs font-semibold text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                <span>{currentLang === 'ne' ? tile.labelNp : tile.labelEn}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tile.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Quick Civic Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { labelNp: 'जग्गा क्षेत्रफल', labelEn: 'Land Converter', sub: 'रोपनी-आना / बिघा-कट्ठा' },
          { labelNp: 'सुनचाँदी तौल', labelEn: 'Gold Weight', sub: 'तोला, लाल, ग्राम, औंस' },
          { labelNp: 'भ्याट तथा ब्याज', labelEn: 'VAT & Interest', sub: '१३% भ्याट, साधारण/चक्रवृद्धि' },
          { labelNp: 'आपतकालीन सम्पर्क', labelEn: 'Emergency Directory', sub: 'प्रहरी १००, दमकल १०१, एम्बुलेन्स १०२' },
        ].map((tool, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onNavigateTab('tools')}
            className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] hover:border-blue-400 border border-slate-200 dark:border-slate-800 text-left transition-colors group cursor-pointer shadow-xs"
          >
            <div className="text-xs font-semibold text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {currentLang === 'ne' ? tool.labelNp : tool.labelEn}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tool.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
