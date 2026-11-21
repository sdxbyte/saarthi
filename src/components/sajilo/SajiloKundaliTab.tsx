import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  NAKSHATRAS,
  RASHIS,
  calculateGunaMilan,
  generateVedicKundali,
  KundaliChartData,
  GunaMilanResult,
} from '../../data/sajiloJyotishData';

interface SajiloKundaliTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloKundaliTab: React.FC<SajiloKundaliTabProps> = ({
  currentLang,
  devanagariNumerals,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kundali' | 'milan'>('kundali');

  // Kundali Generator Form State
  const [personName, setPersonName] = useState('राम प्रसाद शर्मा');
  const [birthYearBs, setBirthYearBs] = useState(2058);
  const [birthMonthBs, setBirthMonthBs] = useState(6);
  const [birthDayBs, setBirthDayBs] = useState(15);
  const [birthHour, setBirthHour] = useState(14);
  const [birthMinute, setBirthMinute] = useState(30);
  const [birthPlace, setBirthPlace] = useState('काठमाडौँ');

  const [generatedChart, setGeneratedChart] = useState<KundaliChartData>(() =>
    generateVedicKundali(personName, birthYearBs, birthMonthBs, birthDayBs, birthHour, birthMinute, birthPlace)
  );

  // Matchmaking State
  const [boyNakshatraId, setBoyNakshatraId] = useState(1); // Ashwini
  const [girlNakshatraId, setGirlNakshatraId] = useState(4); // Rohini
  const [milanResult, setMilanResult] = useState<GunaMilanResult>(() =>
    calculateGunaMilan(1, 4)
  );

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const handleGenerateKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const chart = generateVedicKundali(
      personName,
      Number(birthYearBs),
      Number(birthMonthBs),
      Number(birthDayBs),
      Number(birthHour),
      Number(birthMinute),
      birthPlace
    );
    setGeneratedChart(chart);
  };

  const handleCalculateMilan = () => {
    const res = calculateGunaMilan(boyNakshatraId, girlNakshatraId);
    setMilanResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-[#14161b] border border-[#262a31] rounded-xl w-full sm:w-auto self-start">
        <button
          onClick={() => setActiveSubTab('kundali')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'kundali'
              ? 'bg-[#00e599] text-black shadow-lg shadow-[#00e599]/20'
              : 'text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'जन्मकुण्डली निर्माण (Vedic Chart)' : 'Birth Chart (Kundali)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('milan')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeSubTab === 'milan'
              ? 'bg-[#ff4d6d] text-white shadow-lg shadow-[#ff4d6d]/20'
              : 'text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{currentLang === 'ne' ? '३६ गुण मिलान (Matchmaking)' : '36 Guna Milan'}</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 1: KUNDALI BIRTH CHART GENERATOR */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'kundali' && (
        <div className="space-y-6">
          {/* Input Form Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#262a31]">
              <Sparkles className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne' ? 'वैदिक जन्मकुण्डली विवरण प्रविष्टि' : 'Vedic Kundali Birth Entry Form'}
              </h3>
            </div>

            <form onSubmit={handleGenerateKundali} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8c92a4] mb-1.5">
                  {currentLang === 'ne' ? 'नाम (Full Name)' : 'Name'}
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-[#262a31] rounded-xl text-sm text-[#edeef0] focus:border-[#00e599] outline-none transition-colors"
                  placeholder="उदा: सुदिप अधिकारी"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c92a4] mb-1.5">
                  {currentLang === 'ne' ? 'जन्म मिति (वि.सं.)' : 'Birth Date (BS)'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    value={birthYearBs}
                    onChange={(e) => setBirthYearBs(Number(e.target.value))}
                    min={2000}
                    max={2100}
                    className="w-full px-2 py-2 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs text-center text-[#edeef0] focus:border-[#00e599] outline-none"
                    placeholder="२०५८"
                  />
                  <select
                    value={birthMonthBs}
                    onChange={(e) => setBirthMonthBs(Number(e.target.value))}
                    className="w-full px-1 py-2 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs text-[#edeef0] focus:border-[#00e599] outline-none"
                  >
                    {['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'].map(
                      (m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      )
                    )}
                  </select>
                  <input
                    type="number"
                    value={birthDayBs}
                    onChange={(e) => setBirthDayBs(Number(e.target.value))}
                    min={1}
                    max={32}
                    className="w-full px-2 py-2 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs text-center text-[#edeef0] focus:border-[#00e599] outline-none"
                    placeholder="१५"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c92a4] mb-1.5">
                  {currentLang === 'ne' ? 'जन्म समय (२४ घण्टा)' : 'Birth Time (24h)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={birthHour}
                    onChange={(e) => setBirthHour(Number(e.target.value))}
                    min={0}
                    max={23}
                    className="w-1/2 px-3 py-2 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs text-center text-[#edeef0] focus:border-[#00e599] outline-none"
                    placeholder="घण्टा (१४)"
                  />
                  <span className="text-[#8c92a4]">:</span>
                  <input
                    type="number"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(Number(e.target.value))}
                    min={0}
                    max={59}
                    className="w-1/2 px-3 py-2 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs text-center text-[#edeef0] focus:border-[#00e599] outline-none"
                    placeholder="मिनेट (३०)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c92a4] mb-1.5">
                  {currentLang === 'ne' ? 'जन्मस्थान (जिल्ला/स्थान)' : 'Birthplace'}
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-[#262a31] rounded-xl text-sm text-[#edeef0] focus:border-[#00e599] outline-none transition-colors"
                  placeholder="काठमाडौँ / पोखरा"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#00e599] hover:bg-[#00c985] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#00e599]/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{currentLang === 'ne' ? 'कुण्डली बनाउनुहोस् (Generate Kundali)' : 'Generate Kundali'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Kundali Visualization & Planetary Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: North Indian Diamond Chart SVG Visualizer */}
            <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#262a31]">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#edeef0]">
                    {currentLang === 'ne' ? 'लग्न कुण्डली (प्रथम चक्र)' : 'Lagna Kundali Chart'}
                  </h4>
                  <p className="text-xs text-[#8c92a4]">
                    {generatedChart.personName} | वि.सं. {formatDigits(generatedChart.birthDateBs)} | {formatDigits(generatedChart.birthTime)} | {generatedChart.birthPlace}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#00e599]/10 text-[#00e599] text-xs font-semibold border border-[#00e599]/30">
                  {currentLang === 'ne' ? 'वैदिक पद्धति' : 'Vedic North-Indian'}
                </span>
              </div>

              {/* Diamond Chart SVG Container */}
              <div className="w-full max-w-[420px] aspect-square relative bg-[#0d0e12] border-2 border-[#00e599]/40 rounded-2xl p-2 shadow-2xl">
                <svg viewBox="0 0 400 400" className="w-full h-full stroke-[#00e599]/50 fill-none stroke-[1.5]">
                  {/* Outer Border */}
                  <rect x="10" y="10" width="380" height="380" className="stroke-[#00e599] stroke-2" />
                  {/* Diagonals */}
                  <line x1="10" y1="10" x2="390" y2="390" />
                  <line x1="390" y1="10" x2="10" y2="390" />
                  {/* Inner Diamond */}
                  <polygon points="200,10 390,200 200,390 10,200" className="stroke-[#00e599] stroke-2" />
                </svg>

                {/* 12 House Labels & Planets Overlay */}
                {/* House 1 (Top Center Diamond - Lagna) */}
                <div className="absolute top-[18%] left-[50%] -translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[11px] font-black text-[#00e599] block">
                    १ ({generatedChart.houses[0].rashi.nameNp})
                  </span>
                  <div className="text-[10px] text-[#edeef0] font-semibold flex flex-wrap justify-center gap-1 mt-0.5">
                    {generatedChart.houses[0].planets.map((p, i) => (
                      <span key={i} className="bg-[#1f242d] px-1 rounded text-[#00e599]">{p.nameNp}</span>
                    ))}
                  </div>
                </div>

                {/* House 2 (Top Left Triangle) */}
                <div className="absolute top-[8%] left-[26%] -translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[10px] font-bold text-[#8c92a4] block">२ ({generatedChart.houses[1].rashi.nameNp})</span>
                  <div className="text-[9px] text-[#edeef0]">
                    {generatedChart.houses[1].planets.map((p, i) => (
                      <span key={i} className="text-[#f59e0b] block">{p.nameNp}</span>
                    ))}
                  </div>
                </div>

                {/* House 12 (Top Right Triangle) */}
                <div className="absolute top-[8%] right-[26%] translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[10px] font-bold text-[#8c92a4] block">१२ ({generatedChart.houses[11].rashi.nameNp})</span>
                  <div className="text-[9px] text-[#edeef0]">
                    {generatedChart.houses[11].planets.map((p, i) => (
                      <span key={i} className="text-[#f59e0b] block">{p.nameNp}</span>
                    ))}
                  </div>
                </div>

                {/* House 4 (Center Left Diamond) */}
                <div className="absolute top-[50%] left-[20%] -translate-y-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[10px] font-black text-[#38bdf8] block">४ ({generatedChart.houses[3].rashi.nameNp})</span>
                  <div className="text-[9px] text-[#edeef0]">
                    {generatedChart.houses[3].planets.map((p, i) => (
                      <span key={i} className="bg-[#1f242d] px-1 rounded text-[#38bdf8] block">{p.nameNp}</span>
                    ))}
                  </div>
                </div>

                {/* House 7 (Bottom Center Diamond - Kalatra) */}
                <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[11px] font-black text-[#ff4d6d] block">
                    ७ ({generatedChart.houses[6].rashi.nameNp})
                  </span>
                  <div className="text-[10px] text-[#edeef0] font-semibold flex flex-wrap justify-center gap-1 mt-0.5">
                    {generatedChart.houses[6].planets.map((p, i) => (
                      <span key={i} className="bg-[#1f242d] px-1 rounded text-[#ff4d6d]">{p.nameNp}</span>
                    ))}
                  </div>
                </div>

                {/* House 10 (Center Right Diamond - Karma) */}
                <div className="absolute top-[50%] right-[20%] -translate-y-1/2 translate-x-1/2 text-center pointer-events-none">
                  <span className="text-[10px] font-black text-[#a78bfa] block">१० ({generatedChart.houses[9].rashi.nameNp})</span>
                  <div className="text-[9px] text-[#edeef0]">
                    {generatedChart.houses[9].planets.map((p, i) => (
                      <span key={i} className="bg-[#1f242d] px-1 rounded text-[#a78bfa] block">{p.nameNp}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Key Astrological Coordinates & Dasha Table */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-3 shadow-xl">
                <h4 className="font-bold text-sm text-[#edeef0] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#00e599]" />
                  <span>{currentLang === 'ne' ? 'मुख्य ज्योतिषी विवरण (Astrological Profile)' : 'Astrological Profile'}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'लग्न राशि (Ascendant):' : 'Lagna Rashi:'}</span>
                    <span className="font-bold text-[#00e599]">{generatedChart.lagnaRashi.nameNp} ({generatedChart.lagnaRashi.lordNp} स्वामी)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'चन्द्र राशि (Moon Sign):' : 'Moon Sign:'}</span>
                    <span className="font-bold text-[#edeef0]">{generatedChart.chandraRashi.nameNp} ({generatedChart.chandraRashi.lordNp} स्वामी)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'जन्म नक्षत्र (Nakshatra):' : 'Birth Nakshatra:'}</span>
                    <span className="font-bold text-[#f59e0b]">{generatedChart.janmaNakshatra.nameNp} (चरण: {formatDigits(generatedChart.charan)})</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'गण (Gana):' : 'Gana:'}</span>
                    <span className="font-semibold text-[#edeef0]">{generatedChart.janmaNakshatra.ganaNp} गण</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'नाडी (Nadi):' : 'Nadi:'}</span>
                    <span className="font-semibold text-[#edeef0]">{generatedChart.janmaNakshatra.nadiNp} नाडी</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'योनि (Yoni):' : 'Yoni:'}</span>
                    <span className="font-semibold text-[#edeef0]">{generatedChart.janmaNakshatra.yoniNp}</span>
                  </div>
                </div>
              </div>

              {/* Vimshottari Mahadasha */}
              <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-3 shadow-xl">
                <h4 className="font-bold text-sm text-[#edeef0] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#f59e0b]" />
                  <span>{currentLang === 'ne' ? 'विंशोत्तरी महादशा स्थिति' : 'Vimshottari Mahadasha'}</span>
                </h4>

                <div className="p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'वर्तमान महादशा स्वामी:' : 'Current Ruler:'}</span>
                    <span className="font-bold text-[#f59e0b]">{generatedChart.mahadasha.currentPlanetNp} दशा</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'समाप्त मिति (अनुमानित):' : 'Ends In:'}</span>
                    <span className="font-semibold text-[#edeef0]">वि.सं. {formatDigits(generatedChart.mahadasha.endsYearBs)} सम्म</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'अवशिष्ट अवधि:' : 'Remaining:'}</span>
                    <span className="text-[#00e599] font-bold">~ {formatDigits(generatedChart.mahadasha.remainingYears)} वर्ष</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 2: 36 GUNA MILAN (MATCHMAKING) */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'milan' && (
        <div className="space-y-6">
          {/* Matchmaking Selection Form */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#262a31]">
              <Heart className="w-5 h-5 text-[#ff4d6d]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne' ? 'वर-कन्या ३६ गुण मिलान क्याल्कुलेटर' : '36 Guna Ashtakoot Matchmaking Calculator'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boy Details */}
              <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-[#38bdf8] flex items-center gap-2">
                  <span>👨 वरको विवरण (Groom)</span>
                </h4>
                <div>
                  <label className="block text-xs text-[#8c92a4] mb-1">
                    {currentLang === 'ne' ? 'वरको जन्म नक्षत्र:' : 'Groom Nakshatra:'}
                  </label>
                  <select
                    value={boyNakshatraId}
                    onChange={(e) => setBoyNakshatraId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#14161b] border border-[#262a31] rounded-xl text-xs sm:text-sm text-[#edeef0] focus:border-[#38bdf8] outline-none"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nameNp} ({n.nameEn}) - {RASHIS.find((r) => r.id === n.rashiId)?.nameNp} राशि
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Girl Details */}
              <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-[#ff4d6d] flex items-center gap-2">
                  <span>👰 कन्याको विवरण (Bride)</span>
                </h4>
                <div>
                  <label className="block text-xs text-[#8c92a4] mb-1">
                    {currentLang === 'ne' ? 'कन्याको जन्म नक्षत्र:' : 'Bride Nakshatra:'}
                  </label>
                  <select
                    value={girlNakshatraId}
                    onChange={(e) => setGirlNakshatraId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#14161b] border border-[#262a31] rounded-xl text-xs sm:text-sm text-[#edeef0] focus:border-[#ff4d6d] outline-none"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nameNp} ({n.nameEn}) - {RASHIS.find((r) => r.id === n.rashiId)?.nameNp} राशि
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={handleCalculateMilan}
                className="px-8 py-2.5 bg-[#ff4d6d] hover:bg-[#e03a58] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#ff4d6d]/20 flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'गुण मिलान गणना गर्नुहोस्' : 'Calculate Compatibility Score'}</span>
              </button>
            </div>
          </div>

          {/* Results Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0d0e12] border border-[#262a31]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-[#ff4d6d] flex items-center justify-center font-black text-lg text-[#ff4d6d] bg-[#ff4d6d]/10">
                  {formatDigits(milanResult.totalScore)}/३६
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#8c92a4]">
                    {currentLang === 'ne' ? 'प्राप्त कुल गुण अङ्क (Score)' : 'Total Guna Score'}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#edeef0]">{milanResult.verdictNp}</h4>
                  <p className="text-xs text-[#8c92a4]">
                    {currentLang === 'ne'
                      ? `सफलता प्रतिशत: ${formatDigits(milanResult.percentage)}% (१८ भन्दा माथि शुभ मानिन्छ)`
                      : `Compatibility: ${milanResult.percentage}% (≥18 is auspicious)`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {milanResult.isFavorable ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00e599]/10 text-[#00e599] text-xs font-bold border border-[#00e599]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentLang === 'ne' ? 'विवाहका लागि अनुकूल' : 'Favorable Match'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold border border-[#f59e0b]/30">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{currentLang === 'ne' ? 'विशेष शान्ति आवश्यक' : 'Consult Astrologer'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 8 Kootas Detailed Table */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#edeef0] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00e599]" />
                <span>{currentLang === 'ne' ? 'अष्टकूट विस्तृत अंक विभाजन (8 Kootas Breakdown)' : '8 Kootas Detailed Score'}</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-[#262a31]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#1a1d24] text-[#8c92a4] font-semibold border-b border-[#262a31]">
                    <tr>
                      <th className="p-3">{currentLang === 'ne' ? 'कुट नाम' : 'Koota'}</th>
                      <th className="p-3 text-center">{currentLang === 'ne' ? 'पूर्णाङ्क' : 'Max'}</th>
                      <th className="p-3 text-center">{currentLang === 'ne' ? 'प्राप्ताङ्क' : 'Obtained'}</th>
                      <th className="p-3">{currentLang === 'ne' ? 'फल तथा व्याख्या' : 'Significance'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262a31] text-[#edeef0]">
                    {milanResult.kootas.map((k, idx) => (
                      <tr key={idx} className="hover:bg-[#14161b]/50">
                        <td className="p-3 font-semibold text-[#edeef0]">{k.nameNp}</td>
                        <td className="p-3 text-center text-[#8c92a4]">{formatDigits(k.maximum)}</td>
                        <td className="p-3 text-center font-bold text-[#00e599]">{formatDigits(k.obtained)}</td>
                        <td className="p-3 text-[#8c92a4]">{k.descriptionNp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manglik Analysis Note */}
            <div className="p-3.5 rounded-xl bg-[#0d0e12] border border-[#262a31] text-xs text-[#8c92a4] space-y-1">
              <span className="font-bold text-[#edeef0] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>{currentLang === 'ne' ? 'मांगलिक दोष टिप्पणी:' : 'Manglik Analysis:'}</span>
              </span>
              <p>{milanResult.manglikStatus.noteNp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
