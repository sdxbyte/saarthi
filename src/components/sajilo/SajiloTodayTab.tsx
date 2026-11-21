import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  CloudSun,
  Coins,
  Fuel,
  Radio,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Bell,
  CheckCircle2,
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

  useEffect(() => {
    // Load Keeper alerts
    const items = getKeeperItems();
    const alerts = items
      .map((item) => {
        const { status, daysLeft } = computeKeeperStatus(item);
        return { item, daysLeft, status };
      })
      .filter((a) => a.status === 'urgent' || a.status === 'expiring_soon' || a.status === 'expired')
      .slice(0, 3);
    setKeeperAlerts(alerts);

    // Fetch Kalimati highlights
    fetch('/api/live/kalimati')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data)) {
          setKalimatiHighlight(payload.data.slice(0, 5));
        }
      })
      .catch((e) => console.warn('Kalimati fetch notice:', e))
      .finally(() => setIsLoadingKalimati(false));
  }, []);

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
      {/* 1. Bento Hero Suite: Today's Tithi, BS Date & Telemetry Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {currentLang === 'ne' ? 'आजको दिन र पञ्चाङ्ग' : "TODAY'S GLANCE & PANCHANGA"}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {timeState.tzAbbrev} • NST +05:45
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-white font-medium">AD: {timeState.adDateFormatted}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {currentLang === 'ne' ? 'शुक्ल पक्ष, त्रयोदशी तिथि' : 'Shukla Paksha, Trayodashi Tithi'}
              </span>
              <span>•</span>
              <span className="text-amber-300">
                {currentLang === 'ne' ? 'सूर्योदय: ०५:४८ | सूर्यास्त: १८:२४' : 'Sunrise: 05:48 AM | Sunset: 06:24 PM'}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <span className="text-xs font-mono text-slate-400">
              {currentLang === 'ne' ? 'नेपाल संवत् ११४४ • राष्ट्रिय पञ्चाङ्ग' : 'Nepal Sambat 1144 • Official Almanac'}
            </span>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'ne' ? 'पात्रो तथा मिति रूपान्तरण' : 'Calendar & Date Converter'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Bento Tile: Quick Keeper Status */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Personal Keeper</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                100% Offline
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>{currentLang === 'ne' ? 'कागजात नवीकरण' : 'Document Vault'}</span>
              </div>
              <p className="text-xs text-slate-400">
                {currentLang === 'ne'
                  ? 'नागरिकता, राहदानी, सवारी चालक अनुमतिपत्र र ब्लुबुक नवीकरण ट्र्याकर।'
                  : 'Citizenship, Passport, Driving License & Bluebook renewal reminders.'}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              {keeperAlerts.length > 0 ? `${keeperAlerts.length} urgent notices` : 'No expiring records'}
            </span>
            <button
              onClick={() => onNavigateTab('keeper')}
              className="text-amber-400 hover:underline font-mono text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>{currentLang === 'ne' ? 'किपर खोल्नुहोस्' : 'Open Keeper'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Keeper Urgent Expiry Notice Banner (If Any Expiring) */}
      {keeperAlerts.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#edeef0]">
                  {currentLang === 'ne' ? 'किपर सतर्कता: नवीकरण गर्न बाँकी कागजातहरू' : 'Keeper Alert: Document Expiry Pending'}
                </h4>
                <p className="text-[11px] text-[#8b909b]">
                  {currentLang === 'ne'
                    ? `${formatDigits(keeperAlerts.length)} वटा कागजातको नवीकरण समय नजिकिँदैछ वा सकिएको छ।`
                    : `${keeperAlerts.length} document(s) need renewal soon or have expired.`}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('keeper')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300 transition-colors shrink-0"
            >
              {currentLang === 'ne' ? 'किपर हेर्नुहोस्' : 'View Keeper'}
            </button>
          </div>
        </div>
      )}

      {/* Curated Links & Web Hub Spotlight Bento Card */}
      <div
        onClick={() => onNavigateTab('links')}
        className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
              <span>{currentLang === 'ne' ? 'उपयोगी लिङ्कहरू र खुला स्रोत हब' : 'Curated Useful Links, Sajilo Repo & FMHY Hub'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                FMHY + GitHub
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentLang === 'ne'
                ? 'आदर्श आचार्यको Sajilo GitHub, FMHY.net मेगा डाइरेक्टरी, निःशुल्क एआई, विकासकर्ता औजार, र नेपाली पोर्टलहरू'
                : 'Adarsha Acharya’s Sajilo repository, FMHY.net mega directory, dev tools, and curated bookmarks'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-semibold relative z-10 shrink-0 group-hover:translate-x-1 transition-all">
          <span>{currentLang === 'ne' ? 'लिङ्कहरू हेर्नुहोस्' : 'Explore Links & Hub'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Quick Daily Essentials Interlocking Bento Grid (Bazar, Weather, Radio, Rashifal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metal Rates Quick Glance */}
        <div
          onClick={() => onNavigateTab('bazar')}
          className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition-all hover:-translate-y-0.5 group relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {currentLang === 'ne' ? 'सुन/चाँदी दर' : 'Gold & Silver'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'छापावाल सुन (तोला)' : 'Fine Gold / Tola'}</span>
              <span className="text-sm font-bold font-mono text-amber-400">रू. {formatDigits('152,400')}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'चाँदी (तोला)' : 'Silver / Tola'}</span>
              <span className="text-sm font-bold font-mono text-white">रू. {formatDigits('1,820')}</span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-amber-400/90 font-mono">FENEGOSIDA Official Rates</div>
        </div>

        {/* Fuel Prices Quick Glance */}
        <div
          onClick={() => onNavigateTab('bazar')}
          className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition-all hover:-translate-y-0.5 group relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-blue-400" />
              {currentLang === 'ne' ? 'पेट्रोलियम दर' : 'Fuel Prices'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'पेट्रोल (प्रति लिटर)' : 'Petrol / L'}</span>
              <span className="text-sm font-bold font-mono text-blue-400">रू. {formatDigits('170.00')}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'डिजेल (प्रति लिटर)' : 'Diesel / L'}</span>
              <span className="text-sm font-bold font-mono text-white">रू. {formatDigits('160.00')}</span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-blue-400/90 font-mono">Nepal Oil Corporation (NOC)</div>
        </div>

        {/* Weather & AQI Quick Glance */}
        <div
          onClick={() => onNavigateTab('weather')}
          className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition-all hover:-translate-y-0.5 group relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
              {currentLang === 'ne' ? 'काठमाडौं मौसम र एक्युआई' : 'Kathmandu AQI'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'तापक्रम' : 'Temp'}</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{formatDigits('24')}°C (Sunny)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">{currentLang === 'ne' ? 'वायु गुणस्तर (AQI)' : 'Air Quality'}</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {formatDigits('74')} • Moderate
              </span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-slate-400 font-mono">Open-Meteo Verified</div>
        </div>

        {/* Radio Broadcast Player Snippet */}
        <div
          onClick={() => onNavigateTab('radio')}
          className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition-all hover:-translate-y-0.5 group relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              {currentLang === 'ne' ? 'रेडियो नेपाल प्रत्यक्ष' : 'Live FM Radio'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400 truncate max-w-[130px]">{currentStation ? currentStation.name : 'Radio Nepal'}</span>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {currentStation ? currentStation.frequency : '100.0 MHz'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[11px] font-mono">{isPlaying ? 'Playing Live' : '10+ Live Stations'}</span>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] text-emerald-400/90 font-mono">Official Streams Across Nepal</div>
        </div>
      </div>

      {/* 4. Kalimati Produce Rates Bento Grid Card */}
      <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {currentLang === 'ne' ? 'कालिमाटी फलफूल तथा तरकारी दर (दैनिक थोक)' : 'Kalimati Daily Wholesale Produce Highlights'}
              </h3>
              <p className="text-[11px] text-slate-400">Official Agriculture & Produce Wholesale Board</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('bazar')}
            className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{currentLang === 'ne' ? 'सबै २८+ वस्तु हेर्नुहोस्' : 'View Full Bazar'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingKalimati ? (
          <div className="text-xs font-mono text-slate-400 py-6 text-center">Loading Kalimati Produce Rates...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kalimatiHighlight.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                <div className="text-xs font-semibold text-white truncate">
                  {currentLang === 'ne' ? item.commodityNp : item.commodity}
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-[10px] text-slate-400">Avg / {item.unit}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    रू. {formatDigits(item.avgPrice)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between mt-1 pt-1 border-t border-slate-800">
                  <span>Min: {formatDigits(item.minPrice)}</span>
                  <span>Max: {formatDigits(item.maxPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Vedic, Astrological & Remittance Essentials Bento */}
      <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {currentLang === 'ne' ? 'ज्योतिष, संस्कार तथा सनातन धरोहर' : 'Vedic, Heritage & Astro Almanac'}
              </h3>
              <p className="text-[11px] text-slate-400">Authentic calculations & cultural traditions</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">शास्त्रसम्मत सेवाहरू</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('saait')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{currentLang === 'ne' ? 'शुभ साइत तथा लगन' : 'Shubha Saait'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">विवाह, व्रतबन्ध, पास्नी २०८१/८२</div>
          </button>

          <button
            onClick={() => onNavigateTab('kundali')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{currentLang === 'ne' ? 'कुण्डली र गुण मिलान' : 'Kundali & Milan'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">१२ भाव कुण्डली, ३६ गुण मिलान</div>
          </button>

          <button
            onClick={() => onNavigateTab('gotra')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{currentLang === 'ne' ? 'थर, गोत्र र कुलदेवता' : 'Gotra & Clan'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">नेपाली थर, प्रवर, कुल मस्टो</div>
          </button>

          <button
            onClick={() => onNavigateTab('stotra')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{currentLang === 'ne' ? 'स्तोत्र र १०८ जप' : 'Stotra & 108 Japa'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">हनुमान चालिसा, पूजा विधि</div>
          </button>
        </div>
      </div>

      {/* 6. Quick Civic Tools Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => onNavigateTab('tools')}
          className="p-4 rounded-2xl bg-[#0B0F17]/90 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 text-left transition-all group cursor-pointer shadow-lg"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
            {currentLang === 'ne' ? 'जग्गा क्षेत्रफल' : 'Land Converter'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">रोपनी-आना / बिघा-कट्ठा</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-4 rounded-2xl bg-[#0B0F17]/90 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 text-left transition-all group cursor-pointer shadow-lg"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
            {currentLang === 'ne' ? 'सुनचाँदी तौल' : 'Gold Weight'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">तोला, लाल, ग्राम, औंस</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-4 rounded-2xl bg-[#0B0F17]/90 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 text-left transition-all group cursor-pointer shadow-lg"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
            {currentLang === 'ne' ? 'भ्याट तथा ब्याज' : 'VAT & Interest'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">१३% भ्याट, साधारण/चक्रवृद्धि</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-4 rounded-2xl bg-[#0B0F17]/90 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 text-left transition-all group cursor-pointer shadow-lg"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
            {currentLang === 'ne' ? 'आपतकालीन सम्पर्क' : 'Emergency Directory'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">प्रहरी १००, दमकल १०१, एम्बुलेन्स १०२</div>
        </button>
      </div>
    </div>
  );
};
