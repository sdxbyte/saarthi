import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  MoonStar,
  ArrowRightLeft,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Heart,
  Home,
  Baby,
  Bookmark,
  Award,
  ChevronLeft,
  ChevronRight,
  Printer,
  Info,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Search,
  Filter,
  Flame,
  Star,
  Users,
  Building,
  RefreshCw,
  X,
  Hourglass,
  CalendarCheck,
  Compass as CompassIcon,
} from 'lucide-react';
import {
  CalendarMonthData,
  CalendarDayDetail,
  SubhaMuhuratItem,
  PublicHolidayItem,
  generateBsMonthData,
  getSubhaMuhurats,
  getGovernmentHolidays,
  convertBsToAdDetailed,
  convertAdToBsDetailed,
  calculateNepaliAge,
  toNepaliDigits,
  getAvailableBsYears,
  getAvailableBsDecades,
  BS_MONTHS_NP,
  BS_MONTHS_EN,
  BS_DAYS_NP,
  BS_DAYS_SHORT_NP,
  BS_DAYS_EN,
} from '../../services/nepaliCalendarService';
import { getLiveClockData, getBsDateFromAdDate } from '../../utils/bsAdConverter';

interface CalendarBsAdViewProps {
  currentLang: 'en' | 'ne';
}

export const CalendarBsAdView: React.FC<CalendarBsAdViewProps> = ({ currentLang }) => {
  const liveClock = getLiveClockData(new Date());
  const liveBs = getBsDateFromAdDate(new Date());

  // Active Main Sub-Tab
  const [activeTab, setActiveTab] = useState<'calendar' | 'muhurats' | 'holidays' | 'panchanga' | 'converter' | 'festivals'>('calendar');

  // Calendar Month View State (Default to current active BS year and month)
  const [selectedYear, setSelectedYear] = useState<number>(liveBs.year); // e.g. 2083
  const [selectedMonth, setSelectedMonth] = useState<number>(liveBs.monthIndex + 1); // 1-12

  // Day Detail Modal State
  const [selectedDayDetail, setSelectedDayDetail] = useState<CalendarDayDetail | null>(null);

  // Muhurat Filter State
  const [muhuratFilter, setMuhuratFilter] = useState<'ALL' | 'MARRIAGE' | 'BRATABANDHA' | 'GRIHA_PRAVESH' | 'PASNI'>('ALL');

  // Holiday Filter State
  const [holidayCategory, setHolidayCategory] = useState<'ALL' | 'National' | 'Festival' | 'Women' | 'Regional' | 'Special'>('ALL');
  const [holidaySearchQuery, setHolidaySearchQuery] = useState<string>('');

  // Converter States
  const [convBsYear, setConvBsYear] = useState<number>(liveBs.year);
  const [convBsMonth, setConvBsMonth] = useState<number>(liveBs.monthIndex + 1);
  const [convBsDay, setConvBsDay] = useState<number>(liveBs.day);
  const [convAdDateInput, setConvAdDateInput] = useState<string>(new Date().toISOString().split('T')[0]);

  // Age Calculator States
  const [birthYear, setBirthYear] = useState<number>(2055);
  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(15);

  // Date Difference Calculator States
  const [diffFromYear, setDiffFromYear] = useState<number>(2083);
  const [diffFromMonth, setDiffFromMonth] = useState<number>(1);
  const [diffFromDay, setDiffFromDay] = useState<number>(1);
  const [diffToYear, setDiffToYear] = useState<number>(2083);
  const [diffToMonth, setDiffToMonth] = useState<number>(selectedMonth);
  const [diffToDay, setDiffToDay] = useState<number>(liveBs.day);

  // Panchanga Selected Date
  const [panchangaDateBs, setPanchangaDateBs] = useState<{ year: number; month: number; day: number }>({
    year: liveBs.year,
    month: liveBs.monthIndex + 1,
    day: liveBs.day,
  });

  // Fetch month data based on selection
  const monthData: CalendarMonthData = useMemo(() => {
    return generateBsMonthData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Available BS Years (1970 to 2105 BS - 136 years)
  const availableYears = useMemo(() => getAvailableBsYears(), []);
  const availableDecades = useMemo(() => getAvailableBsDecades(), []);

  // Muhurats list for selected year
  const allMuhurats: SubhaMuhuratItem[] = useMemo(() => {
    return getSubhaMuhurats(selectedYear);
  }, [selectedYear]);

  const filteredMuhurats = useMemo(() => {
    if (muhuratFilter === 'ALL') return allMuhurats;
    return allMuhurats.filter((m) => m.type === muhuratFilter);
  }, [allMuhurats, muhuratFilter]);

  // Government Holidays list for selected year
  const allHolidays: PublicHolidayItem[] = useMemo(() => {
    return getGovernmentHolidays(selectedYear);
  }, [selectedYear]);

  const filteredHolidays = useMemo(() => {
    return allHolidays.filter((h) => {
      const matchCat = holidayCategory === 'ALL' || h.category === holidayCategory;
      const matchSearch =
        !holidaySearchQuery ||
        h.nameNp.toLowerCase().includes(holidaySearchQuery.toLowerCase()) ||
        h.nameEn.toLowerCase().includes(holidaySearchQuery.toLowerCase()) ||
        h.descriptionNp.toLowerCase().includes(holidaySearchQuery.toLowerCase()) ||
        h.bsDate.toLowerCase().includes(holidaySearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allHolidays, holidayCategory, holidaySearchQuery]);

  // Computed Converted Values
  const bsToAdResult = useMemo(() => {
    return convertBsToAdDetailed(convBsYear, convBsMonth, convBsDay);
  }, [convBsYear, convBsMonth, convBsDay]);

  const adToBsResult = useMemo(() => {
    return convertAdToBsDetailed(convAdDateInput);
  }, [convAdDateInput]);

  const ageResult = useMemo(() => {
    return calculateNepaliAge(birthYear, birthMonth, birthDay);
  }, [birthYear, birthMonth, birthDay]);

  const dateDiffResult = useMemo(() => {
    const fromAd = convertBsToAdDetailed(diffFromYear, diffFromMonth, diffFromDay);
    const toAd = convertBsToAdDetailed(diffToYear, diffToMonth, diffToDay);
    const d1 = new Date(fromAd.adDateIso).getTime();
    const d2 = new Date(toAd.adDateIso).getTime();
    const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const remDays = diffDays % 7;
    return {
      diffDays,
      weeks,
      remDays,
      fromFormatted: fromAd.bsDateNp,
      toFormatted: toAd.bsDateNp,
    };
  }, [diffFromYear, diffFromMonth, diffFromDay, diffToYear, diffToMonth, diffToDay]);

  // Panchanga detail for selected Panchanga date
  const selectedPanchangaDay = useMemo(() => {
    const mData = generateBsMonthData(panchangaDateBs.year, panchangaDateBs.month);
    return mData.days.find((d) => d.bsDay === panchangaDateBs.day) || mData.days[0];
  }, [panchangaDateBs]);

  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear((prev) => prev - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedYear((prev) => prev + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    setSelectedYear(liveBs.year);
    setSelectedMonth(liveBs.monthIndex + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Ribbon */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-red-900/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30">
                <CalendarDays className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{currentLang === 'ne' ? `नेपाली आधिकारिक पात्रो (वि.सं. ${toNepaliDigits(selectedYear)})` : `Nepali Official Calendar (B.S. ${selectedYear})`}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    136 Years (1970–2105 BS)
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {currentLang === 'ne'
                    ? 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति तथा गृह मन्त्रालयको राजपत्रित सार्वजनिक बिदा, शुभ मुहूर्त र दैनिक पञ्चाङ्ग (वि.सं. १९७० देखि २१०५ सम्म)'
                    : 'Panchanga Nirnayak Samiti astronomical calendar, gazetted public holidays & Subha Muhurats (1970–2105 BS)'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Clock & Dual Date Badge */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-inner">
            <div className="text-right">
              <div className="text-sm font-extrabold text-red-400 font-mono">
                {liveClock.bsDateNp}
              </div>
              <div className="text-[11px] text-slate-400">
                {liveClock.adDateStr} • {liveClock.gmtOffsetStr}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <button
              onClick={handleToday}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'आज (Today)' : 'Today'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center justify-center border border-slate-700"
              title="Print Calendar Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Navigation Pills */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calendar'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'मासिक पात्रो' : 'Monthly Calendar'}</span>
          </button>

          <button
            onClick={() => setActiveTab('muhurats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'muhurats'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'शुभ मुहूर्त तथा लगन' : 'Subha Muhurats'}</span>
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'holidays'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'सार्वजनिक बिदाहरू' : 'Government Holidays'}</span>
          </button>

          <button
            onClick={() => setActiveTab('panchanga')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'panchanga'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <MoonStar className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'दैनिक पञ्चाङ्ग' : 'Daily Panchanga'}</span>
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'मिति रूपान्तरण र उमेर' : 'Date Converter & Age'}</span>
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'festivals'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'वार्षिक चाडपर्व गाइड' : 'Yearly Festivals'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MONTHLY CALENDAR GRID VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Month & Year Selector Control Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-3 text-center">
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <span>{monthData.bsMonthNameNp}</span>
                    <span className="text-red-400 font-mono">{toNepaliDigits(monthData.bsYear)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {monthData.bsMonthNameEn} ({monthData.adMonthRange})
                  </div>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Season / Ritu Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{monthData.rituNp}</span>
              </div>
            </div>

            {/* Quick Dropdown Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500 max-h-60"
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)} को दशक (${dec.labelEn})`}>
                    {dec.years.map((y) => (
                      <option key={y} value={y}>
                        वि.सं. {toNepaliDigits(y)} ({y} BS)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
              >
                {BS_MONTHS_NP.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {m} ({BS_MONTHS_EN[idx]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center">
              {BS_DAYS_NP.map((dayName, idx) => {
                const isSat = idx === 6;
                return (
                  <div
                    key={idx}
                    className={`py-3 px-1 text-xs font-bold ${
                      isSat ? 'text-rose-400 bg-rose-950/20' : 'text-slate-300'
                    }`}
                  >
                    <div>{dayName}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{BS_DAYS_EN[idx]}</div>
                  </div>
                );
              })}
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-900/50">
              {/* Empty padding cells before first day */}
              {Array.from({ length: monthData.startDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[90px] sm:min-h-[110px] border-b border-r border-slate-800/40 bg-slate-950/30 opacity-40"
                />
              ))}

              {/* Actual Month Days */}
              {monthData.days.map((day) => {
                const isToday =
                  day.bsYear === liveBs.year &&
                  day.bsMonth === liveBs.monthIndex + 1 &&
                  day.bsDay === liveBs.day;
                const isSat = day.isSaturday;
                const isHoliday = day.isHoliday;

                return (
                  <div
                    key={day.bsDay}
                    onClick={() => setSelectedDayDetail(day)}
                    className={`min-h-[90px] sm:min-h-[115px] p-2 border-b border-r border-slate-800/50 cursor-pointer transition-all hover:bg-slate-800/60 relative group flex flex-col justify-between ${
                      isToday
                        ? 'bg-red-950/30 ring-2 ring-red-500 z-10'
                        : isHoliday
                        ? 'bg-rose-950/15'
                        : 'bg-slate-900/40'
                    }`}
                  >
                    {/* Top Row: BS Day & AD Day */}
                    <div className="flex items-start justify-between gap-1">
                      <span
                        className={`text-base sm:text-xl font-black font-mono leading-none ${
                          isHoliday || isSat ? 'text-rose-400' : 'text-white'
                        }`}
                      >
                        {toNepaliDigits(day.bsDay)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {day.adDay} {day.adMonth}
                      </span>
                    </div>

                    {/* Middle: Tithi */}
                    <div className="mt-1">
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">
                        {day.tithiNp}
                      </div>
                    </div>

                    {/* Bottom: Festival or Holiday Badge */}
                    <div className="mt-auto space-y-0.5">
                      {day.festivalNp && (
                        <div
                          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded leading-tight line-clamp-2 ${
                            day.isHoliday
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {day.festivalNp}
                        </div>
                      )}

                      {/* Ekadashi / Purnima / Aunsi Indicator */}
                      {(day.isEkadashi || day.isPurnima || day.isAunsi) && !day.festivalNp && (
                        <div className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold truncate">
                          {day.tithiNp}
                        </div>
                      )}

                      {/* Today Badge */}
                      {isToday && (
                        <div className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1 py-0.5 rounded bg-red-600 text-white text-center">
                          आज (Today)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">कुल दिन संख्या (Total Days)</div>
                <div className="text-base font-bold text-white">{toNepaliDigits(monthData.totalDays)} दिन ({monthData.totalDays} Days)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">सार्वजनिक बिदाहरू (Holidays)</div>
                <div className="text-base font-bold text-rose-400">
                  {toNepaliDigits(monthData.days.filter((d) => d.isHoliday).length)} बिदा दिनहरू (शनिबार सहित)
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">चाडपर्व तथा विशेष दिनहरू</div>
                <div className="text-base font-bold text-amber-400">
                  {toNepaliDigits(monthData.days.filter((d) => d.festivalNp).length)} वटा चाडपर्व / उत्सव
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUBHA MUHURATS (विवाह, ब्रतबन्ध, गृहप्रवेश, पास्नी) */}
      {/* ========================================================================= */}
      {activeTab === 'muhurats' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{currentLang === 'ne' ? `शुभ मुहूर्त तथा लगन सूची (वि.सं. ${toNepaliDigits(selectedYear)})` : `Auspicious Muhurats (B.S. ${selectedYear})`}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentLang === 'ne'
                  ? 'विवाह, ब्रतबन्ध, गृह प्रवेश तथा पास्नीका वैदिक ज्योतिष अनुसारका शुभ साइतहरू'
                  : 'Authentic Vedic astrological Muhurat timings for Vivaha, Bratabandha, and Griha Pravesh'}
              </p>
            </div>

            {/* Year Selector for Muhurats */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">{currentLang === 'ne' ? 'वर्ष:' : 'Year:'}</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)} दशक`}>
                    {dec.years.map((y) => (
                      <option key={y} value={y}>
                        वि.सं. {toNepaliDigits(y)} ({y})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setMuhuratFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  muhuratFilter === 'ALL'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                सबै साइत ({allMuhurats.length})
              </button>
              <button
                onClick={() => setMuhuratFilter('MARRIAGE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  muhuratFilter === 'MARRIAGE'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>विवाह लगन</span>
              </button>
              <button
                onClick={() => setMuhuratFilter('BRATABANDHA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  muhuratFilter === 'BRATABANDHA'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>ब्रतबन्ध लगन</span>
              </button>
              <button
                onClick={() => setMuhuratFilter('GRIHA_PRAVESH')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  muhuratFilter === 'GRIHA_PRAVESH'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>गृह प्रवेश</span>
              </button>
              <button
                onClick={() => setMuhuratFilter('PASNI')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  muhuratFilter === 'PASNI'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>पास्नी / अन्नप्राशन</span>
              </button>
            </div>
          </div>

          {/* Muhurat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMuhurats.map((m) => {
              const isMarriage = m.type === 'MARRIAGE';
              const isBratabandha = m.type === 'BRATABANDHA';
              const isGriha = m.type === 'GRIHA_PRAVESH';
              const isPasni = m.type === 'PASNI';

              const badgeColor = isMarriage
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : isBratabandha
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                : isGriha
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

              const icon = isMarriage ? (
                <Heart className="w-4 h-4 text-rose-400" />
              ) : isBratabandha ? (
                <Bookmark className="w-4 h-4 text-purple-400" />
              ) : isGriha ? (
                <Home className="w-4 h-4 text-emerald-400" />
              ) : (
                <Baby className="w-4 h-4 text-blue-400" />
              );

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${badgeColor}`}>
                      {icon}
                      <span>{m.typeNameNp}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{m.dayNameNp}</span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-white">
                      वि.सं. {toNepaliDigits(m.bsYear)} {m.bsMonthNameNp} {toNepaliDigits(m.bsDay)}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      A.D. {m.adDateStr}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">तिथि / नक्षत्र:</span>
                      <span className="font-semibold text-amber-300">{m.tithiNp} • {m.nakshatraNp}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">शुभ समय:</span>
                      <span className="font-semibold text-emerald-400">{m.timeWindowNp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">{m.descriptionNp}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GOVERNMENT PUBLIC HOLIDAYS (सार्वजनिक बिदाहरू) */}
      {/* ========================================================================= */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-500" />
                <span>{currentLang === 'ne' ? `नेपाल सरकारका आधिकारिक सार्वजनिक बिदाहरू (वि.सं. ${toNepaliDigits(selectedYear)})` : `Nepal Gazetted Public Holidays (${selectedYear} BS)`}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentLang === 'ne'
                  ? 'नेपाल राजपत्रमा प्रकाशित राष्ट्रिय, चाडपर्व, प्रादेशिक तथा महिला बिदाहरू'
                  : 'Official Ministry of Home Affairs gazetted holiday calendar'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Year Selector for Holidays */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{currentLang === 'ne' ? 'वर्ष:' : 'Year:'}</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                >
                  {availableDecades.map((dec) => (
                    <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)} दशक`}>
                      {dec.years.map((y) => (
                        <option key={y} value={y}>
                          वि.सं. {toNepaliDigits(y)} ({y})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 md:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={holidaySearchQuery}
                  onChange={(e) => setHolidaySearchQuery(e.target.value)}
                  placeholder={currentLang === 'ne' ? 'बिदा वा चाडपर्व खोज्नुहोस्...' : 'Search holiday...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'सबै बिदाहरू' },
              { id: 'National', label: 'राष्ट्रिय बिदा' },
              { id: 'Festival', label: 'चाडपर्व बिदा' },
              { id: 'Women', label: 'महिला बिदा' },
              { id: 'Regional', label: 'उपत्यका / प्रादेशिक' },
              { id: 'Special', label: 'समुदाय विशेष (ल्होसार आदि)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setHolidayCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  holidayCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Holidays Table / List */}
          <div className="space-y-3">
            {filteredHolidays.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{h.nameNp}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.category === 'National'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : h.category === 'Women'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : h.category === 'Regional'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {h.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{h.descriptionNp}</div>
                  <div className="text-[11px] text-slate-500 font-mono">लागू हुने क्षेत्र: {h.applicableToNp}</div>
                </div>

                <div className="sm:text-right shrink-0 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-sm font-black text-rose-400 font-mono">{h.bsDate}</div>
                  <div className="text-xs text-slate-400">
                    {h.adDate} ({h.dayOfWeekNp})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DAILY PANCHANGA (दैनिक पञ्चाङ्ग तथा कुण्डली) */}
      {/* ========================================================================= */}
      {activeTab === 'panchanga' && (
        <div className="space-y-6">
          {/* Panchanga Date Selector Bar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MoonStar className="w-5 h-5 text-purple-400" />
                <span>{currentLang === 'ne' ? 'दैनिक पञ्चाङ्ग तथा साइत विवरण' : 'Daily Panchanga & Astrological Guide'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentLang === 'ne'
                  ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त, चन्द्र राशि र राहु काल'
                  : 'Authentic 5-limb Vedic Panchanga calculation for Kathmandu / Nepal'}
              </p>
            </div>

            {/* Panchanga Date Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={panchangaDateBs.year}
                onChange={(e) =>
                  setPanchangaDateBs((prev) => ({ ...prev, year: Number(e.target.value) }))
                }
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)} दशक`}>
                    {dec.years.map((y) => (
                      <option key={y} value={y}>
                        वि.सं. {toNepaliDigits(y)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <select
                value={panchangaDateBs.month}
                onChange={(e) =>
                  setPanchangaDateBs((prev) => ({ ...prev, month: Number(e.target.value) }))
                }
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              >
                {BS_MONTHS_NP.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={panchangaDateBs.day}
                onChange={(e) =>
                  setPanchangaDateBs((prev) => ({ ...prev, day: Number(e.target.value) }))
                }
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              >
                {Array.from({ length: 32 }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {toNepaliDigits(idx + 1)} गते
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Panchanga Display Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <div className="text-2xl font-black text-white">
                  वि.सं. {toNepaliDigits(selectedPanchangaDay.bsYear)} {BS_MONTHS_NP[selectedPanchangaDay.bsMonth - 1]} {toNepaliDigits(selectedPanchangaDay.bsDay)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedPanchangaDay.adDateFormatted} ({selectedPanchangaDay.dayNameNp} / {selectedPanchangaDay.dayNameEn})
                </div>
              </div>

              {selectedPanchangaDay.festivalNp && (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  {selectedPanchangaDay.festivalNp}
                </div>
              )}
            </div>

            {/* 5 Limbs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">१. तिथि (Tithi)</span>
                <div className="text-base font-bold text-white">{selectedPanchangaDay.tithiNp}</div>
                <div className="text-[11px] text-purple-400">{selectedPanchangaDay.pakshaNp}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">२. नक्षत्र (Nakshatra)</span>
                <div className="text-base font-bold text-white">{selectedPanchangaDay.nakshatraNp}</div>
                <div className="text-[11px] text-slate-400">चरण अनुसार शुभ फल</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">३. योग (Yoga)</span>
                <div className="text-base font-bold text-white">{selectedPanchangaDay.yogaNp}</div>
                <div className="text-[11px] text-emerald-400">शुभ योग</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">४. करण (Karana)</span>
                <div className="text-base font-bold text-white">{selectedPanchangaDay.karanaNp}</div>
                <div className="text-[11px] text-slate-400">स्थिर / चर करण</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">५. राशि (Signs)</span>
                <div className="text-sm font-bold text-white">चन्द्र: {selectedPanchangaDay.chandrarashiNp.split(' ')[0]}</div>
                <div className="text-[11px] text-amber-400">सूर्य: {selectedPanchangaDay.suryarashiNp.split(' ')[0]}</div>
              </div>
            </div>

            {/* Sun, Moon & Forbidden Timings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sun & Moon Times */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>सूर्योदय तथा सूर्यास्त (काठमाडौं)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">सूर्योदय:</span>
                    <span className="font-mono font-bold text-amber-400">{selectedPanchangaDay.sunriseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">सूर्यास्त:</span>
                    <span className="font-mono font-bold text-rose-400">{selectedPanchangaDay.sunsetTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">चन्द्रोदय:</span>
                    <span className="font-mono text-slate-300">{selectedPanchangaDay.moonriseTime}</span>
                  </div>
                </div>
              </div>

              {/* Auspicious Muhurats */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>शुभ समय (Auspicious Muhurats)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">अभिजीत मुहूर्त:</span>
                    <span className="font-mono font-bold text-emerald-400">{selectedPanchangaDay.abhijitMuhurat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ब्रह्म मुहूर्त:</span>
                    <span className="font-mono text-purple-300">{selectedPanchangaDay.brahmaMuhurat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">अमृत काल:</span>
                    <span className="font-mono text-emerald-300">{selectedPanchangaDay.amritKaal}</span>
                  </div>
                </div>
              </div>

              {/* Forbidden & Inauspicious Times */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>वर्जित समय तथा दिशाशूल</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">राहु काल (अशुभ):</span>
                    <span className="font-mono font-bold text-rose-400">{selectedPanchangaDay.rahuKaal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">यमघण्ट काल:</span>
                    <span className="font-mono text-slate-400">{selectedPanchangaDay.yamaghantaKaal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">दिशाशूल (यात्रा वर्जित):</span>
                    <span className="font-bold text-amber-300">{selectedPanchangaDay.dishashoolNp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BS ↔ AD CONVERTER & NEPALI AGE CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. BS to AD Converter */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ArrowRightLeft className="w-5 h-5 text-red-400" />
                <span>१. वि.सं. (BS) बाट ई.सं. (AD) रूपान्तरण</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">वि.सं. वर्ष (BS Year)</label>
                  <input
                    type="number"
                    value={convBsYear}
                    onChange={(e) => setConvBsYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">महिना (Month)</label>
                  <select
                    value={convBsMonth}
                    onChange={(e) => setConvBsMonth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                  >
                    {BS_MONTHS_NP.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">गते (Day)</label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={convBsDay}
                    onChange={(e) => setConvBsDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">रूपान्तरित अङ्ग्रेजी मिति (Converted AD Date):</div>
                <div className="text-lg font-black text-emerald-400 font-mono">{bsToAdResult.adDateFormatted}</div>
                <div className="text-xs text-slate-300">
                  {bsToAdResult.dayOfWeekNp} ({bsToAdResult.dayOfWeekEn}) • ISO: {bsToAdResult.adDateIso}
                </div>
              </div>
            </div>

            {/* 2. AD to BS Converter */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <span>२. ई.सं. (AD) बाट वि.सं. (BS) रूपान्तरण</span>
              </h3>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">अङ्ग्रेजी मिति छान्नुहोस् (Select English Date)</label>
                <input
                  type="date"
                  value={convAdDateInput}
                  onChange={(e) => setConvAdDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">रूपान्तरित नेपाली मिति (Converted BS Date):</div>
                <div className="text-lg font-black text-red-400">{adToBsResult.bsDateNp}</div>
                <div className="text-xs text-slate-300">
                  {adToBsResult.dayOfWeekNp} ({adToBsResult.dayOfWeekEn}) • {adToBsResult.bsDateEn}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Exact Nepali Age Calculator */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Hourglass className="w-5 h-5 text-purple-400" />
              <span>३. आधिकारिक नेपाली उमेर क्याल्कुलेटर (Nepali Age Calculator)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">जन्म वि.सं. वर्ष (Birth BS Year)</label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">जन्म महिना (Birth Month)</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                >
                  {BS_MONTHS_NP.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">जन्म गते (Birth Day)</label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">हालको यकिन उमेर (Current Age):</div>
                <div className="text-lg font-black text-purple-400 mt-1">{ageResult.ageStringNp}</div>
                <div className="text-xs text-slate-400 mt-0.5">{ageResult.ageStringEn}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">कुल बाँचिएको दिन (Total Days Lived):</div>
                <div className="text-lg font-black text-white font-mono mt-1">
                  ~{toNepaliDigits(ageResult.approxTotalDays)} दिन
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Approx {ageResult.approxTotalDays} Days</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">आगामी जन्मोत्सव (Next Birthday):</div>
                <div className="text-sm font-bold text-amber-400 mt-1">{ageResult.nextBirthdayBs}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {ageResult.nextBirthdayAd} ({ageResult.nextBirthdayDayOfWeek})
                </div>
              </div>
            </div>
          </div>

          {/* 4. Date Difference Calculator */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CalendarCheck className="w-5 h-5 text-emerald-400" />
              <span>४. दुई मिति बिचको अन्तर (Date Difference Calculator)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300">सुरुको मिति (From Date):</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <input
                    type="number"
                    value={diffFromYear}
                    onChange={(e) => setDiffFromYear(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="Year"
                  />
                  <select
                    value={diffFromMonth}
                    onChange={(e) => setDiffFromMonth(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                  >
                    {BS_MONTHS_NP.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={diffFromDay}
                    onChange={(e) => setDiffFromDay(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="Day"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300">अन्तिम मिति (To Date):</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <input
                    type="number"
                    value={diffToYear}
                    onChange={(e) => setDiffToYear(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="Year"
                  />
                  <select
                    value={diffToMonth}
                    onChange={(e) => setDiffToMonth(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                  >
                    {BS_MONTHS_NP.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={diffToDay}
                    onChange={(e) => setDiffToDay(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="Day"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                कुल अन्तर: <span className="font-bold text-base text-emerald-400">{toNepaliDigits(dateDiffResult.diffDays)} दिन</span> ({dateDiffResult.diffDays} Days)
              </div>
              <div>
                (~{toNepaliDigits(dateDiffResult.weeks)} हप्ता र {toNepaliDigits(dateDiffResult.remDays)} दिन)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: YEARLY FESTIVALS DIRECTORY (वार्षिक मुख्य चाडपर्वहरू) */}
      {/* ========================================================================= */}
      {activeTab === 'festivals' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>{currentLang === 'ne' ? 'नेपालका प्रमुख वार्षिक चाडपर्व निर्देशिका (२०८३)' : 'Major Yearly Festivals Directory 2083'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentLang === 'ne'
                ? 'बडा दशैं, तिहार, छठ, हरितालिका तीज, महाशिवरात्रि, ल्होसार, बुद्ध जयन्ती र होलीको सम्पूर्ण विवरण'
                : 'Comprehensive cultural guide and authentic dates for national & regional festivals'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'बडा दशैं (विजयादशमी)',
                titleEn: 'Bada Dashain (Vijaya Dashami)',
                bsDate: '२०८३ असोज १७ (घटस्थापना) देखि असोज २६ (टीका) सम्म',
                adDate: '3 Oct - 12 Oct 2026',
                holidayStatus: '६ दिन राष्ट्रिय सार्वजनिक बिदा',
                desc: 'नेपालीहरूको सबैभन्दा ठूलो राष्ट्रिय चाड। दुर्गा भवानीको उपासना, घटस्थापनामा जमरा राख्ने, फूलपाती, महाअष्टमी कालरात्रि, महानवमी र विजयादशमीमा मान्यजनबाट रातो टीका र जमरा लगाई आशीर्वाद ग्रहण गरिन्छ।',
              },
              {
                title: 'तिहार तथा दीपावली (यमपञ्चक)',
                titleEn: 'Tihar & Deepawali (Yamapanchak)',
                bsDate: '२०८३ कार्तिक १५ (काग तिहार) देखि कार्तिक १९ (भाइटीका)',
                adDate: '31 Oct - 4 Nov 2026',
                holidayStatus: '४ दिन राष्ट्रिय सार्वजनिक बिदा',
                desc: 'उज्यालो र प्रकाशको चाड। काग, कुकुर, गाई, गोवर्धन, म्ह पूजा (नेपाल संवत् नयाँ वर्ष) र दिदीबहिनीले दाजुभाइलाई सप्तरङ्गी टीका र मखमली माला लगाई भाइटीका मनाइन्छ।',
              },
              {
                title: 'छठ महापर्व',
                titleEn: 'Chhath Mahaparva',
                bsDate: '२०८३ कार्तिक २३ (सँझिया अर्घ्य) र कार्तिक २४ (बिहानी अर्घ्य)',
                adDate: '8 Nov - 9 Nov 2026',
                holidayStatus: 'सार्वजनिक बिदा',
                desc: 'शुद्धि, स्वच्छता र निष्ठाको महापर्व। अस्ताउँदो र उदाउँदो सूर्यदेव तथा छठी मातालाई ठेकुवा, भुसुवा, फलफूल र अर्घ्य दिएर आरोग्य तथा समृद्धिको कामना गरिन्छ।',
              },
              {
                title: 'हरितालिका तीज तथा ऋषि पञ्चमी',
                titleEn: 'Haritalika Teej & Rishi Panchami',
                bsDate: '२०८३ भदौ १८ (तीज) र भदौ २० (ऋषि पञ्चमी)',
                adDate: '3 Sep - 5 Sep 2026',
                holidayStatus: 'महिला कर्मचारी बिदा',
                desc: 'नेपाली नारीहरूको महान चाड। अघिल्लो रात दर खाने, दिनभर निराहार व्रत बस्ने, भगवान् शिव-पार्वतीको आराधना गर्ने र रातो पहिरनमा तीज गीतमा रम्ने परम्परा छ।',
              },
              {
                title: 'महाशिवरात्रि तथा नेपाली सेना दिवस',
                titleEn: 'Maha Shivaratri & Army Day',
                bsDate: '२०८३ फागुन १३ गते',
                adDate: '25 Feb 2027',
                holidayStatus: 'राष्ट्रिय सार्वजनिक बिदा',
                desc: 'भगवान् पशुपतिनाथ मन्दिर लगायत देशभरका शिवालयमा लाखौं भक्तजनको घुइँचो लाग्ने पवित्र दिन। बेलपत्र, धतुरो, दुध र जलले भगवान् शिवको अभिषेक गरिन्छ।',
              },
              {
                title: 'फागु पूर्णिमा (होली पर्व)',
                titleEn: 'Holi (Festival of Colours)',
                bsDate: '२०८३ फागुन २९ (पहाड) र फागुन ३० (तराई)',
                adDate: '13 Mar - 14 Mar 2027',
                holidayStatus: 'सार्वजनिक बिदा (पहाड र तराई छुट्टाछुट्टै)',
                desc: 'वसन्त ऋतुको आगमनसँगै आपसी सद्भाव, भ्रातृत्व र उमंगका साथ रङ्ग, अबीर र पानी खेलेर मनाइने रंगहरूको महान पर्व।',
              },
              {
                title: 'ल्होसार पर्वहरू (तमु, सोनाम र ग्याल्पो)',
                titleEn: 'Lhosar Festivals (Tamu, Sonam, Gyalpo)',
                bsDate: 'पुस १५ (तमु), माघ १५ (सोनाम), फागुन १५ (ग्याल्पो)',
                adDate: 'Dec 2026 - Feb 2027',
                holidayStatus: 'सम्बन्धित समुदाय तथा राष्ट्रिय बिदा',
                desc: 'गुरुङ, तामाङ र शेर्पा हिमाली समुदायका नयाँ वर्षका महान उत्सवहरू। परम्परागत भेषभूषा, स्याब्रु/स्यालो नृत्य, गुथुक परिकार र लामा पूजाआजा गरिन्छ।',
              },
              {
                title: 'माघे संक्रान्ति तथा माघी पर्व',
                titleEn: 'Maghe Sankranti & Maghi Festival',
                bsDate: '२०८३ माघ १ गते (मकर संक्रान्ति)',
                adDate: '15 Jan 2027',
                holidayStatus: 'राष्ट्रिय सार्वजनिक बिदा',
                desc: 'सूर्य धनु राशिबाट मकर राशिमा प्रवेश गर्ने दिन। घिउ, चाकु, तरुल, तिलको लड्डु, खिचडी खाने र थारु समुदायमा नयाँ वर्ष (माघी) को रूपमा भव्यताका साथ मनाइन्छ।',
              },
            ].map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{f.title}</h3>
                      <div className="text-xs text-slate-400">{f.titleEn}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                      {f.holidayStatus}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400">
                    {f.bsDate} <span className="text-slate-500">({f.adDate})</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAY DETAIL POPUP MODAL (दिनको विस्तृत विवरण) */}
      {/* ========================================================================= */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-white">
                  वि.सं. {toNepaliDigits(selectedDayDetail.bsYear)} {BS_MONTHS_NP[selectedDayDetail.bsMonth - 1]} {toNepaliDigits(selectedDayDetail.bsDay)}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDayDetail.adDateFormatted} ({selectedDayDetail.dayNameNp} / {selectedDayDetail.dayNameEn})
                </p>
              </div>
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Festival / Holiday Alert */}
            {selectedDayDetail.festivalNp && (
              <div
                className={`p-3 rounded-xl border text-xs font-bold ${
                  selectedDayDetail.isHoliday
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                }`}
              >
                🚩 {selectedDayDetail.festivalNp}
                {selectedDayDetail.holidayReasonNp && (
                  <div className="text-[11px] font-normal text-slate-300 mt-0.5">
                    {selectedDayDetail.holidayReasonNp}
                  </div>
                )}
              </div>
            )}

            {/* Panchanga Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">तिथि:</span>
                <span className="font-bold text-white text-sm">{selectedDayDetail.tithiNp}</span>
                <span className="text-[10px] text-purple-400 block">{selectedDayDetail.pakshaNp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">नक्षत्र:</span>
                <span className="font-bold text-white text-sm">{selectedDayDetail.nakshatraNp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">योग:</span>
                <span className="font-bold text-white text-sm">{selectedDayDetail.yogaNp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">करण:</span>
                <span className="font-bold text-white text-sm">{selectedDayDetail.karanaNp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">चन्द्र राशि:</span>
                <span className="font-bold text-amber-300 text-xs">{selectedDayDetail.chandrarashiNp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">दिशाशूल (वर्जित दिशा):</span>
                <span className="font-bold text-rose-300 text-xs">{selectedDayDetail.dishashoolNp}</span>
              </div>
            </div>

            {/* Sun, Moon & Rahu Timings */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">सूर्योदय / सूर्यास्त:</span>
                <span className="font-mono text-amber-400">{selectedDayDetail.sunriseTime} / {selectedDayDetail.sunsetTime}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">अभिजीत मुहूर्त:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedDayDetail.abhijitMuhurat}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">राहु काल (अशुभ):</span>
                <span className="font-mono text-rose-400 font-bold">{selectedDayDetail.rahuKaal}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                बन्द गर्नुहोस् (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
