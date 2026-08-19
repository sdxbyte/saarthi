import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Calendar, Sun, Moon, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Star, Clock, Flame, Heart, Globe, Award } from 'lucide-react';

interface RashifalViewProps {
  currentLang: 'en' | 'ne';
}

export const RashifalView: React.FC<RashifalViewProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'horoscope' | 'muhurat' | 'panchanga' | 'festivals' | 'planets'>('horoscope');
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesh');
  const [rashifalData, setRashifalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRashifal = async (selectedPeriod: 'daily' | 'monthly' | 'yearly') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/live/rashifal?period=${selectedPeriod}`);
      if (!res.ok) throw new Error('Failed to load Rashifal data');
      const json = await res.json();
      setRashifalData(json);
    } catch (err: any) {
      setError(err.message || 'Error fetching Rashifal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRashifal(period);
  }, [period]);

  const rashis = rashifalData?.data?.rashis || [];
  const activeRashi = rashis.find((r: any) => r.id === selectedRashiId) || rashis[0];

  const subhaMuhurats = rashifalData?.data?.subhaMuhurats || [];
  const panchangaDetail = rashifalData?.data?.panchangaDetail || {};
  const festivals = rashifalData?.data?.festivals || [];
  const planetaryPositions = rashifalData?.data?.planetaryPositions || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'आधिकारिक राशिफल एवं पञ्चाङ्ग' : 'Official Rashifal & Panchanga Engine'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentLang === 'ne' ? 'नेपाली पञ्चाङ्ग र राशिफल केन्द्र' : 'Nepali Rashifal & Complete Panchanga Suite'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {currentLang === 'ne'
                ? 'हाम्रो पात्रो र नेपाली पञ्चाङ्गद्वारा प्रमाणित १२ राशिको राशिफल, शुभ मुहूर्त, राहुकाल, पर्व र ग्रह गोचर'
                : 'Authentic 12 Rashi predictions, Subha Muhurat, Rahu Kaal window, festival calendar, and planetary transits.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'horoscope', labelNp: 'राशिफल', labelEn: 'Horoscope' },
              { id: 'muhurat', labelNp: 'शुभ मुहूर्त', labelEn: 'Subha Muhurat' },
              { id: 'panchanga', labelNp: 'विस्तृत पञ्चाङ्ग', labelEn: 'Full Panchanga' },
              { id: 'festivals', labelNp: 'पर्व र एकादशी', labelEn: 'Festivals' },
              { id: 'planets', labelNp: 'ग्रह स्थिति', labelEn: 'Planetary Transits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {currentLang === 'ne' ? tab.labelNp : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Panchanga Bar */}
        {rashifalData && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>{currentLang === 'ne' ? 'मिति:' : 'Date:'}</strong> {rashifalData.data?.publishedBs}</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>{currentLang === 'ne' ? 'तिथि/नक्षत्र:' : 'Tithi:'}</strong> {rashifalData.data?.tithiNp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>{currentLang === 'ne' ? 'राहुकाल / समय:' : 'Timing:'}</strong> {panchangaDetail?.rahuKaalNp || rashifalData.data?.panchangaSummaryNp}</span>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: HOROSCOPE PREDICTIONS */}
      {activeTab === 'horoscope' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{currentLang === 'ne' ? '१२ राशिको विववरण' : 'Zodiac Horoscope'}</span>
            </h2>

            <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {(['daily', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'daily'
                    ? currentLang === 'ne' ? 'दैनिक' : 'Daily'
                    : p === 'monthly'
                    ? currentLang === 'ne' ? 'मासिक' : 'Monthly'
                    : currentLang === 'ne' ? 'वार्षिक' : 'Yearly'}
                </button>
              ))}
            </div>
          </div>

          {/* Rashi Selector Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {rashis.map((rashi: any) => {
              const isSelected = rashi.id === selectedRashiId;
              return (
                <button
                  key={rashi.id}
                  onClick={() => setSelectedRashiId(rashi.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 scale-105 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1">{rashi.symbolEmoji}</span>
                  <span className="text-xs font-bold">{currentLang === 'ne' ? rashi.rashiNp : rashi.rashiEn}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Rashi Detail */}
          {activeRashi && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                    {activeRashi.symbolEmoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <span>{currentLang === 'ne' ? activeRashi.rashiNp : activeRashi.rashiEn}</span>
                      <span className="text-sm font-normal text-slate-400">({activeRashi.rashiEn})</span>
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Element: <strong className="text-amber-400">{activeRashi.element}</strong></span>
                      <span>•</span>
                      <span>Planet: <strong className="text-indigo-400">{activeRashi.rulingPlanet}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                    {currentLang === 'ne' ? 'शुभ अङ्क:' : 'Lucky No:'} <strong className="text-amber-400">{activeRashi.luckyNumber}</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                    {currentLang === 'ne' ? 'शुभ रङ्ग:' : 'Lucky Color:'} <strong className="text-emerald-400">{currentLang === 'ne' ? activeRashi.luckyColorNp : activeRashi.luckyColorEn}</strong>
                  </span>
                </div>
              </div>

              {/* Prediction Text */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {period === 'daily'
                      ? currentLang === 'ne' ? 'आजको राशिफल' : 'Daily Horoscope Prediction'
                      : period === 'monthly'
                      ? currentLang === 'ne' ? 'मासिक राशिफल' : 'Monthly Horoscope Prediction'
                      : currentLang === 'ne' ? 'वार्षिक राशिफल' : 'Yearly Horoscope Prediction'}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
                  {currentLang === 'ne'
                    ? (period === 'daily' ? activeRashi.dailyPredictionNp : period === 'monthly' ? (activeRashi.monthlyPredictionNp || activeRashi.dailyPredictionNp) : (activeRashi.yearlyPredictionNp || activeRashi.dailyPredictionNp))
                    : (period === 'daily' ? activeRashi.dailyPredictionEn : period === 'monthly' ? (activeRashi.monthlyPredictionEn || activeRashi.dailyPredictionEn) : (activeRashi.yearlyPredictionEn || activeRashi.dailyPredictionEn))}
                </p>
              </div>

              {/* Timing & Compatibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-3">
                  <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400">{currentLang === 'ne' ? 'उत्तम समय / समय सीमा' : 'Auspicious Timing'}</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5">{activeRashi.auspiciousTime}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-3">
                  <Star className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400">{currentLang === 'ne' ? 'अनुकूल राशि (इष्ट)' : 'Compatible Zodiacs'}</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5">
                      {currentLang === 'ne' ? activeRashi.compatibilityRashiNp : activeRashi.compatibilityRashiEn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBHA MUHURAT */}
      {activeTab === 'muhurat' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'शुभ मुहूर्त तथा विवाह साइत' : 'Subha Muhurat & Marriage Calendar'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? 'नेपाल पञ्चाङ्ग निर्णायक विकास समितिद्वारा स्वीकृत विवाह, व्रतबन्ध, पास्नी र गृहप्रवेशका शुभ दिनहरू'
                  : 'Official auspicious dates for marriage, sacred thread ceremonies, weaning, and housewarming.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subhaMuhurats.map((m: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-sm font-extrabold text-amber-400 flex items-center justify-between">
                  <span>{currentLang === 'ne' ? m.categoryNp : m.categoryEn}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                    {currentLang === 'ne' ? 'शुभ साइत' : 'Auspicious'}
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-white pt-1">
                  {m.datesNp}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {m.descriptionNp}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FULL PANCHANGA & RAHU KAAL */}
      {activeTab === 'panchanga' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'विस्तृत दैनिक पञ्चाङ्ग र राहुकाल' : 'Detailed Panchanga & Rahu Kaal Clock'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त र राहुकाल/अभिजित मुहूर्तको प्रत्यक्ष तालिका'
                  : 'Complete astronomical timing including Tithi, Nakshatra, Sunrise, Sunset, and Rahu Kaal forbidden window.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase block">सूर्योदय र सूर्यास्त</span>
              <div className="text-sm font-bold font-mono text-amber-300 mt-1">
                सूर्योदय: {panchangaDetail.sunriseNp} | सूर्यास्त: {panchangaDetail.sunsetNp}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-xs font-semibold text-rose-300 uppercase block">राहुकाल (वर्जित समय)</span>
              <div className="text-sm font-bold font-mono text-rose-400 mt-1">
                {panchangaDetail.rahuKaalNp}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs font-semibold text-emerald-300 uppercase block">अभिजित मुहूर्त (उत्तम साइत)</span>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                {panchangaDetail.abhijitMuhuratNp}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase block">यमागण्‍ड र गुलिक काल</span>
              <div className="text-xs font-mono text-slate-200 mt-1">
                यमागण्‍ड: {panchangaDetail.yamagandaNp}<br />
                गुलिक: {panchangaDetail.gulikaKaalNp}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase block">तिथि र नक्षत्र</span>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {panchangaDetail.tithiFullNp}<br />
                {panchangaDetail.nakshatraNp}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase block">योग र करण</span>
              <div className="text-xs font-bold text-slate-200 mt-1">
                योग: {panchangaDetail.yogaNp}<br />
                करण: {panchangaDetail.karanaNp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FESTIVALS & FASTING */}
      {activeTab === 'festivals' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'नेपाली पर्व, एकादशी र व्रत तिथि' : 'Nepali Festival & Ekadashi Calendar'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? 'मुख्य चाडपर्व, सरकारी बिदा तथा धार्मिक एकादशी र व्रतहरूको सूची'
                  : 'Upcoming major festivals, public holidays, and sacred fasting dates in Nepal.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {festivals.map((f: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{currentLang === 'ne' ? f.titleNp : f.titleEn}</span>
                    {f.isGovernmentHoliday && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                        {currentLang === 'ne' ? 'सरकारी बिदा' : 'Public Holiday'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{f.descriptionNp}</p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-sm font-bold text-amber-400">{f.dateBs}</div>
                  <div className="text-xs text-slate-500">{f.dateAd}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PLANETARY TRANSITS */}
      {activeTab === 'planets' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span>{currentLang === 'ne' ? 'नवग्रह स्थिति र गोचर चक्र' : 'Navagraha Transits & Planetary Positions'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? 'हाल आकाशमा नवग्रहहरूको स्थिति र तिनको गोचर प्रभाव'
                  : 'Current positions of Sun, Moon, Mars, Jupiter, Saturn and nodes across the 12 zodiac houses.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {planetaryPositions.map((p: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{p.planetNp}</div>
                  <div className="text-xs text-slate-400">{p.planetEn}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-indigo-300">{p.currentSignNp}</div>
                  <div className="text-[10px] font-mono text-emerald-400">{p.statusNp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{rashifalData?.dataSource || 'Nepali Panchanga & Official Hamro Patro Feed'}</span>
        </div>
        <a
          href="https://github.com/milancodess/hamro-patro-scraper"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-amber-400 hover:underline font-bold"
        >
          <span>{currentLang === 'ne' ? 'प्रत्यक्ष इन्जिन' : 'Live Engine Source'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
