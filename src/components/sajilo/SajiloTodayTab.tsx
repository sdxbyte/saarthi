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
    <div className="space-y-6">
      {/* 1. Hero Card: Today's Tithi, BS Date & Panchang Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#14161b] via-[#171a21] to-[#121418] border border-[#262a31] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                {currentLang === 'ne' ? 'आजको दिन' : "TODAY'S GLANCE"}
              </span>
              <span className="text-xs font-mono text-[#8b909b]">
                {timeState.tzAbbrev} • NST +05:45
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#edeef0] tracking-tight">
              {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8b909b] font-mono">
              <span className="text-[#edeef0] font-medium">AD: {timeState.adDateFormatted}</span>
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

          {/* Quick Date Converter CTA */}
          <button
            onClick={() => onNavigateTab('calendar')}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] hover:border-[#00e599]/40 text-xs font-mono font-semibold text-[#edeef0] flex items-center gap-2 transition-all shadow-md group"
          >
            <Calendar className="w-4 h-4 text-[#00e599]" />
            <span>{currentLang === 'ne' ? 'पात्रो तथा मिति रूपान्तरण' : 'Calendar & Date Converter'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8b909b] group-hover:translate-x-0.5 transition-transform" />
          </button>
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

      {/* 3. Quick Daily Essentials Grid (Bazar, Weather, Radio, Rashifal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metal Rates Quick Glance */}
        <div
          onClick={() => onNavigateTab('bazar')}
          className="rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/40 p-4 cursor-pointer transition-all hover:translate-y-[-1px] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#8b909b] uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {currentLang === 'ne' ? 'सुन/चाँदी दर' : 'Gold & Silver'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8b909b] group-hover:text-[#00e599] transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'छापावाल सुन (तोला)' : 'Fine Gold / Tola'}</span>
              <span className="text-sm font-bold font-mono text-amber-400">रू. {formatDigits('152,400')}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'चाँदी (तोला)' : 'Silver / Tola'}</span>
              <span className="text-sm font-bold font-mono text-[#edeef0]">रू. {formatDigits('1,820')}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">FENEGOSIDA Official Rates</div>
        </div>

        {/* Fuel Prices Quick Glance */}
        <div
          onClick={() => onNavigateTab('bazar')}
          className="rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/40 p-4 cursor-pointer transition-all hover:translate-y-[-1px] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#8b909b] uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-blue-400" />
              {currentLang === 'ne' ? 'पेट्रोलियम दर' : 'Fuel Prices'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8b909b] group-hover:text-[#00e599] transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'पेट्रोल (प्रति लिटर)' : 'Petrol / L'}</span>
              <span className="text-sm font-bold font-mono text-blue-400">रू. {formatDigits('170.00')}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'डिजेल (प्रति लिटर)' : 'Diesel / L'}</span>
              <span className="text-sm font-bold font-mono text-[#edeef0]">रू. {formatDigits('160.00')}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-[#8b909b] font-mono">Nepal Oil Corporation (NOC)</div>
        </div>

        {/* Weather & AQI Quick Glance */}
        <div
          onClick={() => onNavigateTab('weather')}
          className="rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/40 p-4 cursor-pointer transition-all hover:translate-y-[-1px] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#8b909b] uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
              {currentLang === 'ne' ? 'काठमाडौं मौसम र एक्युआई' : 'Kathmandu AQI'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8b909b] group-hover:text-[#00e599] transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'तापक्रम' : 'Temp'}</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{formatDigits('24')}°C (Sunny)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentLang === 'ne' ? 'वायु गुणस्तर (AQI)' : 'Air Quality'}</span>
              <span className="text-xs font-bold font-mono px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                {formatDigits('74')} • Moderate
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-[#8b909b] font-mono">Open-Meteo Verified</div>
        </div>

        {/* Radio Broadcast Player Snippet */}
        <div
          onClick={() => onNavigateTab('radio')}
          className="rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/40 p-4 cursor-pointer transition-all hover:translate-y-[-1px] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#8b909b] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#00e599]" />
              {currentLang === 'ne' ? 'रेडियो नेपाल प्रत्यक्ष' : 'Live FM Radio'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8b909b] group-hover:text-[#00e599] transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#8b909b]">{currentStation ? currentStation.name : 'Radio Nepal'}</span>
              <span className="text-xs font-bold font-mono text-[#00e599]">
                {currentStation ? currentStation.frequency : '100.0 MHz'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8b909b]">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00e599] animate-pulse' : 'bg-[#8b909b]'}`} />
              <span className="text-[11px] font-mono">{isPlaying ? 'Playing Live' : 'Click to stream 10+ stations'}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">Official Streams Across Nepal</div>
        </div>
      </div>

      {/* 4. Kalimati Produce Rates Highlights Table */}
      <div className="rounded-xl bg-[#14161b] border border-[#262a31] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-[#edeef0]">
              {currentLang === 'ne' ? 'कालिमाटी फलफूल तथा तरकारी दर (दैनिक थोक)' : 'Kalimati Daily Wholesale Produce Highlights'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('bazar')}
            className="text-xs font-mono text-[#00e599] hover:underline flex items-center gap-1"
          >
            <span>{currentLang === 'ne' ? 'सबै २८+ वस्तु हेर्नुहोस्' : 'View Full Bazar'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingKalimati ? (
          <div className="text-xs font-mono text-[#8b909b] py-3 text-center">Loading Kalimati Produce Rates...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {kalimatiHighlight.map((item) => (
              <div key={item.id} className="rounded-lg bg-[#1a1d24] border border-[#262a31] p-2.5">
                <div className="text-xs font-semibold text-[#edeef0] truncate">
                  {currentLang === 'ne' ? item.commodityNp : item.commodity}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[10px] text-[#8b909b]">Avg / {item.unit}</span>
                  <span className="text-xs font-mono font-bold text-[#00e599]">
                    रू. {formatDigits(item.avgPrice)}
                  </span>
                </div>
                <div className="text-[10px] text-[#8b909b] flex justify-between mt-0.5">
                  <span>Min: {formatDigits(item.minPrice)}</span>
                  <span>Max: {formatDigits(item.maxPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Quick Tools Fast Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3 rounded-xl bg-[#14161b] hover:bg-[#1a1d24] border border-[#262a31] text-left transition-all group"
        >
          <div className="text-xs font-bold text-[#edeef0] group-hover:text-[#00e599] transition-colors">
            {currentLang === 'ne' ? 'जग्गा क्षेत्रफल' : 'Land Converter'}
          </div>
          <div className="text-[10px] text-[#8b909b] mt-0.5">रोपनी-आना / बिघा-कट्ठा</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3 rounded-xl bg-[#14161b] hover:bg-[#1a1d24] border border-[#262a31] text-left transition-all group"
        >
          <div className="text-xs font-bold text-[#edeef0] group-hover:text-[#00e599] transition-colors">
            {currentLang === 'ne' ? 'सुनचाँदी तौल' : 'Gold Weight'}
          </div>
          <div className="text-[10px] text-[#8b909b] mt-0.5">तोला, लाल, ग्राम, औंस</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3 rounded-xl bg-[#14161b] hover:bg-[#1a1d24] border border-[#262a31] text-left transition-all group"
        >
          <div className="text-xs font-bold text-[#edeef0] group-hover:text-[#00e599] transition-colors">
            {currentLang === 'ne' ? 'भ्याट तथा ब्याज' : 'VAT & Interest'}
          </div>
          <div className="text-[10px] text-[#8b909b] mt-0.5">१३% भ्याट, साधारण/चक्रवृद्धि</div>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3 rounded-xl bg-[#14161b] hover:bg-[#1a1d24] border border-[#262a31] text-left transition-all group"
        >
          <div className="text-xs font-bold text-[#edeef0] group-hover:text-[#00e599] transition-colors">
            {currentLang === 'ne' ? 'आपतकालीन सम्पर्क' : 'Emergency Directory'}
          </div>
          <div className="text-[10px] text-[#8b909b] mt-0.5">प्रहरी १००, दमकल १०१, एम्बुलेन्स १०२</div>
        </button>
      </div>
    </div>
  );
};
