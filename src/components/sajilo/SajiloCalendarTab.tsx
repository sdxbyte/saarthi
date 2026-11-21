import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ArrowRightLeft,
  Sparkles,
  Clock,
  CheckCircle2,
  Sun,
  Moon,
  Compass,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { convertBsToAd, convertAdToBs } from '../../utils/bsAdConverter';
import { NEPAL_CITIES_PANCHANG, getMicroPanchangForCity } from '../../data/sajiloPanchangData';

interface SajiloCalendarTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
  onNavigateToSaait?: () => void;
  onNavigateToKundali?: () => void;
}

export const SajiloCalendarTab: React.FC<SajiloCalendarTabProps> = ({
  currentLang,
  devanagariNumerals,
  onNavigateToSaait,
  onNavigateToKundali,
}) => {
  const { timeState } = useGlobalTime();

  // Selected City for Panchang
  const [selectedCityId, setSelectedCityId] = useState<string>('ktm');
  const microPanchang = getMicroPanchangForCity(selectedCityId, 5);

  // Converter State
  const [convMode, setConvMode] = useState<'bsToAd' | 'adToBs'>('bsToAd');
  const [bsYear, setBsYear] = useState<number>(2083);
  const [bsMonth, setBsMonth] = useState<number>(5); // Bhadra
  const [bsDay, setBsDay] = useState<number>(1);
  const [adDateInput, setAdDateInput] = useState<string>('2026-08-17');

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const convertedAd = convertBsToAd(bsYear, bsMonth, bsDay);
  const convertedBs = convertAdToBs(adDateInput);

  const monthNamesNp = [
    'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत',
  ];

  const holidaysList = [
    { nameNp: 'हरितालिका तीज', nameEn: 'Haritalika Teej', bsDate: '२०८३ भदौ २०', adDate: '4 Sep 2026', type: 'Public Holiday' },
    { nameNp: 'इन्द्रजात्रा (काठमाडौँ उपत्यका)', nameEn: 'Indra Jatra (Valley)', bsDate: '२०८३ असोज ०८', adDate: '24 Sep 2026', type: 'Valley Holiday' },
    { nameNp: 'घटस्थापना (दशैं आरम्भ)', nameEn: 'Ghatasthapana (Dashain Starts)', bsDate: '२०८३ असोज २४', adDate: '10 Oct 2026', type: 'Festival' },
    { nameNp: 'विजया दशमी (दशैं टीका)', nameEn: 'Vijaya Dashami (Tika)', bsDate: '२०८३ कार्तिक ०३', adDate: '19 Oct 2026', type: 'National Public Holiday' },
    { nameNp: 'लक्ष्मीपूजा (दीपावली/तिहार)', nameEn: 'Laxmi Puja (Deepawali)', bsDate: '२०८३ कार्तिक २२', adDate: '7 Nov 2026', type: 'National Public Holiday' },
    { nameNp: 'भाइटीका (तिहार)', nameEn: 'Bhai Tika (Tihar)', bsDate: '२०८३ कार्तिक २४', adDate: '9 Nov 2026', type: 'National Public Holiday' },
    { nameNp: 'छठ पर्व', nameEn: 'Chhath Parva', bsDate: '२०८३ कार्तिक ३०', adDate: '15 Nov 2026', type: 'Public Holiday' },
    { nameNp: 'माघे संक्रान्ति', nameEn: 'Maghe Sankranti', bsDate: '२०८३ माघ ०१', adDate: '15 Jan 2027', type: 'Public Holiday' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Micro-Panchang & Multi-City Solar Telemetry Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a31]">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne'
                  ? 'दैनिक विस्तृत पञ्चाङ्ग तथा कालवेला (Micro-Panchang)'
                  : 'Daily Deep Vedic Panchang & City Telemetry'}
              </h3>
            </div>
            <p className="text-xs text-[#8c92a4] mt-1">
              नेपालका मुख्य शहरहरूको सूर्योदय, सूर्यास्त, राहुकाल, यमघण्ट तथा शुभ अभिजित मुहूर्त।
            </p>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8c92a4]">{currentLang === 'ne' ? 'शहर:' : 'City:'}</span>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0d0e12] border border-[#262a31] text-xs font-semibold text-[#edeef0] focus:border-[#00e599] outline-none"
            >
              {NEPAL_CITIES_PANCHANG.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nameNp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sun & Moon Timings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center gap-3">
            <Sun className="w-5 h-5 text-[#f59e0b] shrink-0" />
            <div>
              <div className="text-[10px] text-[#8c92a4] font-medium">सूर्योदय (Sunrise)</div>
              <div className="text-xs sm:text-sm font-bold text-[#edeef0]">{microPanchang.sunrise}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center gap-3">
            <Sun className="w-5 h-5 text-[#f97316] shrink-0" />
            <div>
              <div className="text-[10px] text-[#8c92a4] font-medium">सूर्यास्त (Sunset)</div>
              <div className="text-xs sm:text-sm font-bold text-[#edeef0]">{microPanchang.sunset}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center gap-3">
            <Moon className="w-5 h-5 text-[#38bdf8] shrink-0" />
            <div>
              <div className="text-[10px] text-[#8c92a4] font-medium">चन्द्रोदय (Moonrise)</div>
              <div className="text-xs sm:text-sm font-bold text-[#edeef0]">{microPanchang.moonrise}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center gap-3">
            <Moon className="w-5 h-5 text-[#a78bfa] shrink-0" />
            <div>
              <div className="text-[10px] text-[#8c92a4] font-medium">चन्द्रास्त (Moonset)</div>
              <div className="text-xs sm:text-sm font-bold text-[#edeef0]">{microPanchang.moonset}</div>
            </div>
          </div>
        </div>

        {/* Panchang 5 Core Elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">तिथि (Tithi)</span>
            <span className="font-bold text-[#edeef0] text-xs sm:text-sm mt-0.5 block">{microPanchang.tithi}</span>
            <span className="text-[10px] text-[#8c92a4]">{microPanchang.tithiEndsAt}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">नक्षत्र (Nakshatra)</span>
            <span className="font-bold text-[#f59e0b] text-xs sm:text-sm mt-0.5 block">{microPanchang.nakshatra}</span>
            <span className="text-[10px] text-[#8c92a4]">{microPanchang.nakshatraEndsAt}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">योग र करण (Yoga & Karana)</span>
            <span className="font-bold text-[#edeef0] mt-0.5 block">{microPanchang.yoga}</span>
            <span className="text-[10px] text-[#8c92a4]">{microPanchang.karana}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">चन्द्र / सूर्य राशि</span>
            <span className="font-bold text-[#00e599] mt-0.5 block">{microPanchang.chandraRashi}</span>
            <span className="text-[10px] text-[#8c92a4]">{microPanchang.suryaRashi}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">अयन र ऋतु (Ayan & Ritu)</span>
            <span className="font-bold text-[#edeef0] mt-0.5 block">{microPanchang.ayan}</span>
            <span className="text-[10px] text-[#8c92a4]">{microPanchang.ritu}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31]">
            <span className="text-[#8c92a4] block text-[10px] uppercase font-semibold">ब्रह्म मुहूर्त</span>
            <span className="font-bold text-[#38bdf8] mt-0.5 block">{microPanchang.brahmaMuhurat}</span>
            <span className="text-[10px] text-[#8c92a4]">ध्यान तथा मन्त्र साधना काल</span>
          </div>
        </div>

        {/* Inauspicious & Auspicious Kaalvela Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Rahu Kaal & Yama Ghanta */}
          <div className="p-3.5 rounded-xl bg-[#ff4d6d]/5 border border-[#ff4d6d]/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#ff4d6d]">
              <AlertTriangle className="w-4 h-4" />
              <span>अशुभ कालवेला (वर्ज्य समय)</span>
            </div>
            <div className="flex justify-between text-[#8c92a4]">
              <span>राहुकाल (Rahu Kaal):</span>
              <span className="font-bold text-[#edeef0]">{microPanchang.rahuKaal}</span>
            </div>
            <div className="flex justify-between text-[#8c92a4]">
              <span>यमघण्ट (Yama Ghanta):</span>
              <span className="font-bold text-[#edeef0]">{microPanchang.yamaGhanta}</span>
            </div>
            <div className="flex justify-between text-[#8c92a4]">
              <span>गुलिक काल (Gulika Kaal):</span>
              <span className="font-bold text-[#edeef0]">{microPanchang.gulikaKaal}</span>
            </div>
          </div>

          {/* Abhijit Muhurat & Amrit Kaal */}
          <div className="p-3.5 rounded-xl bg-[#00e599]/5 border border-[#00e599]/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#00e599]">
              <Sparkles className="w-4 h-4" />
              <span>शुभ अमृत तथा विजय मुहूर्त</span>
            </div>
            <div className="flex justify-between text-[#8c92a4]">
              <span>अभिजित मुहूर्त (सर्वकार्य सिद्ध):</span>
              <span className="font-bold text-[#00e599]">{microPanchang.abhijitMuhurat}</span>
            </div>
            <div className="flex justify-between text-[#8c92a4]">
              <span>अमृत काल (Amrit Kaal):</span>
              <span className="font-bold text-[#edeef0]">{microPanchang.amritKaal}</span>
            </div>
            <div className="text-[10px] text-[#8c92a4] pt-1">
              💡 अभिजित मुहूर्तमा थालिएको कुनै पनि कार्य शुभ तथा फलदायी मानिन्छ।
            </div>
          </div>
        </div>
      </div>

      {/* 2. Converter Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a31]">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne' ? 'नेपाली मिति रूपान्तरण (BS ↔ AD Converter)' : 'Nepali Date Engine (BS ↔ AD)'}
              </h3>
            </div>
            <p className="text-xs text-[#8b909b] mt-1">
              Bikram Sambat (वि.सं.) र Gregorian Calendar (AD) बीचको वास्तविक रूपान्तरण
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#1a1d24] p-1 rounded-xl border border-[#262a31] self-start sm:self-auto">
            <button
              onClick={() => setConvMode('bsToAd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                convMode === 'bsToAd'
                  ? 'bg-[#00e599] text-black shadow-md'
                  : 'text-[#8b909b] hover:text-[#edeef0]'
              }`}
            >
              BS → AD
            </button>
            <button
              onClick={() => setConvMode('adToBs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                convMode === 'adToBs'
                  ? 'bg-[#00e599] text-black shadow-md'
                  : 'text-[#8b909b] hover:text-[#edeef0]'
              }`}
            >
              AD → BS
            </button>
          </div>
        </div>

        {convMode === 'bsToAd' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#8b909b] block mb-1">वर्ष (BS Year)</label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={bsYear}
                  onChange={(e) => setBsYear(parseInt(e.target.value, 10) || 2083)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d0e12] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b909b] block mb-1">महिना (BS Month)</label>
                <select
                  value={bsMonth}
                  onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d0e12] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
                >
                  {monthNamesNp.map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}. {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b909b] block mb-1">गते (BS Day)</label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={bsDay}
                  onChange={(e) => setBsDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d0e12] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center justify-between">
              <span className="text-xs text-[#8b909b]">Equivalent Gregorian Date (AD):</span>
              <span className="text-base sm:text-lg font-bold font-mono text-[#00e599]">
                {convertedAd}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#8b909b] block mb-1">Select Gregorian Date (AD)</label>
              <input
                type="date"
                value={adDateInput}
                onChange={(e) => setAdDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d0e12] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center justify-between">
              <span className="text-xs text-[#8b909b]">Equivalent Bikram Sambat Date (वि.सं.):</span>
              <span className="text-base sm:text-lg font-bold font-mono text-[#00e599]">
                वि.सं. {convertedBs}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Upcoming Major Festivals & Holidays List */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262a31]">
          <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
            {currentLang === 'ne' ? 'आगामी प्रमुख चाडपर्व तथा सार्वजनिक बिदाहरू (BS 2083)' : 'Upcoming National Holidays & Major Festivals'}
          </h4>
          <span className="text-[10px] font-mono text-[#8b909b]">Nepal Rajpatra Official Calendar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {holidaysList.map((h, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0d0e12] border border-[#262a31] flex items-center justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-[#edeef0]">
                  {currentLang === 'ne' ? h.nameNp : h.nameEn}
                </h5>
                <div className="text-[10px] text-[#8b909b] mt-0.5 flex items-center gap-2">
                  <span className="text-[#00e599] font-mono">{h.bsDate}</span>
                  <span>•</span>
                  <span>AD: {h.adDate}</span>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 shrink-0">
                {h.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
