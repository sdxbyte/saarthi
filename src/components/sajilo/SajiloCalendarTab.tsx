import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowRightLeft, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { convertBsToAd, convertAdToBs } from '../../utils/bsAdConverter';

interface SajiloCalendarTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloCalendarTab: React.FC<SajiloCalendarTabProps> = ({ currentLang, devanagariNumerals }) => {
  const { timeState } = useGlobalTime();

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
      {/* 1. Converter Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a31]">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne' ? 'नेपाली मिति रूपान्तरण (BS ↔ AD Converter)' : 'Nepali Date Engine (BS ↔ AD)'}
              </h3>
            </div>
            <p className="text-xs text-[#8b909b] mt-0.5">
              {currentLang === 'ne' ? 'विक्रम संवत् तथा इस्वी संवत् बीच उच्च परिशुद्धता रूपान्तरण' : 'High-precision dual calendar calculation for official legal & civic use'}
            </p>
          </div>

          <button
            onClick={() => setConvMode(convMode === 'bsToAd' ? 'adToBs' : 'bsToAd')}
            className="px-3 py-1.5 rounded-xl bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#00e599] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{convMode === 'bsToAd' ? 'Switch to AD → BS' : 'Switch to BS → AD'}</span>
          </button>
        </div>

        {/* Inputs */}
        {convMode === 'bsToAd' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#8b909b] block mb-1">BS Year (वर्ष)</label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={bsYear}
                  onChange={(e) => setBsYear(parseInt(e.target.value, 10) || 2083)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b909b] block mb-1">BS Month (महिना)</label>
                <select
                  value={bsMonth}
                  onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm text-[#edeef0] outline-none"
                >
                  {monthNamesNp.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b909b] block mb-1">BS Day (गते)</label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={bsDay}
                  onChange={(e) => setBsDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between">
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
                className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between">
              <span className="text-xs text-[#8b909b]">Equivalent Bikram Sambat Date (वि.सं.):</span>
              <span className="text-base sm:text-lg font-bold font-mono text-[#00e599]">
                वि.सं. {convertedBs}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Upcoming Major Festivals & Holidays List */}
      <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
            {currentLang === 'ne' ? 'आगामी प्रमुख चाडपर्व तथा सार्वजनिक बिदाहरू (BS 2083)' : 'Upcoming National Holidays & Major Festivals'}
          </h4>
          <span className="text-[10px] font-mono text-[#8b909b]">Nepal Rajpatra Official Calendar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {holidaysList.map((h, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#1a1d24] border border-[#262a31] flex items-center justify-between gap-2">
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
