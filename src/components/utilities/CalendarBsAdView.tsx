import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRightLeft,
  Award,
  Baby,
  BellPlus,
  Bookmark,
  Calendar as CalendarIcon,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Home,
  Hourglass,
  MoonStar,
  Printer,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import {
  BS_DAYS_EN,
  BS_DAYS_NP,
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  CalendarDayDetail,
  CalendarMonthData,
  PublicHolidayItem,
  SubhaMuhuratItem,
  calculateNepaliAge,
  convertAdToBsDetailed,
  convertBsToAdDetailed,
  generateBsMonthData,
  getAvailableBsDecades,
  getGovernmentHolidays,
  getSubhaMuhurats,
  toNepaliDigits,
} from '../../services/nepaliCalendarService';
import { getBsDateFromAdDate, getLiveClockData } from '../../utils/bsAdConverter';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { Card } from '../ui';

interface CalendarBsAdViewProps {
  currentLang: 'en' | 'ne';
}

export const CalendarBsAdView: React.FC<CalendarBsAdViewProps> = ({ currentLang }) => {
  const isNe = currentLang === 'ne';
  const liveClock = getLiveClockData(new Date());
  const liveBs = getBsDateFromAdDate(new Date());
  const { upsertKeeperItem } = useSyncAuth();

  const [activeTab, setActiveTab] = useState<
    'calendar' | 'muhurats' | 'holidays' | 'panchanga' | 'converter' | 'festivals'
  >('calendar');

  const [selectedYear, setSelectedYear] = useState<number>(liveBs.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(liveBs.monthIndex + 1);
  const [selectedDayDetail, setSelectedDayDetail] = useState<CalendarDayDetail | null>(null);
  const [reminderTitleInput, setReminderTitleInput] = useState('');
  const [reminderSavedBanner, setReminderSavedBanner] = useState(false);

  const [muhuratFilter, setMuhuratFilter] = useState<
    'ALL' | 'MARRIAGE' | 'BRATABANDHA' | 'GRIHA_PRAVESH' | 'PASNI'
  >('ALL');
  const [holidayCategory, setHolidayCategory] = useState<
    'ALL' | 'National' | 'Festival' | 'Women' | 'Regional' | 'Special'
  >('ALL');
  const [holidaySearchQuery, setHolidaySearchQuery] = useState<string>('');

  const [convBsYear, setConvBsYear] = useState<number>(liveBs.year);
  const [convBsMonth, setConvBsMonth] = useState<number>(liveBs.monthIndex + 1);
  const [convBsDay, setConvBsDay] = useState<number>(liveBs.day);
  const [convAdDateInput, setConvAdDateInput] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [birthYear, setBirthYear] = useState<number>(2055);
  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(15);

  const [diffFromYear, setDiffFromYear] = useState<number>(liveBs.year);
  const [diffFromMonth, setDiffFromMonth] = useState<number>(1);
  const [diffFromDay, setDiffFromDay] = useState<number>(1);
  const [diffToYear, setDiffToYear] = useState<number>(liveBs.year);
  const [diffToMonth, setDiffToMonth] = useState<number>(liveBs.monthIndex + 1);
  const [diffToDay, setDiffToDay] = useState<number>(liveBs.day);

  const [panchangaDateBs, setPanchangaDateBs] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: liveBs.year,
    month: liveBs.monthIndex + 1,
    day: liveBs.day,
  });

  const monthData: CalendarMonthData = useMemo(
    () => generateBsMonthData(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const availableDecades = useMemo(() => getAvailableBsDecades(), []);
  const allMuhurats: SubhaMuhuratItem[] = useMemo(
    () => getSubhaMuhurats(selectedYear),
    [selectedYear]
  );

  const filteredMuhurats = useMemo(() => {
    if (muhuratFilter === 'ALL') return allMuhurats;
    return allMuhurats.filter((m) => m.type === muhuratFilter);
  }, [allMuhurats, muhuratFilter]);

  const allHolidays: PublicHolidayItem[] = useMemo(
    () => getGovernmentHolidays(selectedYear),
    [selectedYear]
  );

  const filteredHolidays = useMemo(() => {
    return allHolidays.filter((h) => {
      const matchCat = holidayCategory === 'ALL' || h.category === holidayCategory;
      const q = holidaySearchQuery.toLowerCase();
      const matchSearch =
        !q ||
        h.nameNp.toLowerCase().includes(q) ||
        h.nameEn.toLowerCase().includes(q) ||
        h.descriptionNp.toLowerCase().includes(q) ||
        h.bsDate.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allHolidays, holidayCategory, holidaySearchQuery]);

  const bsToAdResult = useMemo(
    () => convertBsToAdDetailed(convBsYear, convBsMonth, convBsDay),
    [convBsYear, convBsMonth, convBsDay]
  );

  const adToBsResult = useMemo(
    () => convertAdToBsDetailed(convAdDateInput),
    [convAdDateInput]
  );

  const ageResult = useMemo(
    () => calculateNepaliAge(birthYear, birthMonth, birthDay),
    [birthYear, birthMonth, birthDay]
  );

  const dateDiffResult = useMemo(() => {
    const fromAd = convertBsToAdDetailed(diffFromYear, diffFromMonth, diffFromDay);
    const toAd = convertBsToAdDetailed(diffToYear, diffToMonth, diffToDay);
    const d1 = new Date(fromAd.adDateIso).getTime();
    const d2 = new Date(toAd.adDateIso).getTime();
    const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    return {
      diffDays,
      weeks: Math.floor(diffDays / 7),
      remDays: diffDays % 7,
    };
  }, [diffFromYear, diffFromMonth, diffFromDay, diffToYear, diffToMonth, diffToDay]);

  const selectedPanchangaDay = useMemo(() => {
    const mData = generateBsMonthData(panchangaDateBs.year, panchangaDateBs.month);
    return mData.days.find((d) => d.bsDay === panchangaDateBs.day) || mData.days[0];
  }, [panchangaDateBs]);

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

  const handleSaveDayReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayDetail) return;
    const title =
      reminderTitleInput.trim() ||
      selectedDayDetail.festivalNp ||
      `${selectedDayDetail.bsYear}-${selectedDayDetail.bsMonth}-${selectedDayDetail.bsDay} BS Event`;
    const nowIso = new Date().toISOString();
    await upsertKeeperItem({
      id: `cal-${selectedDayDetail.bsYear}-${selectedDayDetail.bsMonth}-${selectedDayDetail.bsDay}-${Date.now().toString(36)}`,
      title,
      category: 'custom',
      expiryDateAd: selectedDayDetail.adDateStr,
      expiryDateBs: `${selectedDayDetail.bsYear}-${String(selectedDayDetail.bsMonth).padStart(2, '0')}-${String(selectedDayDetail.bsDay).padStart(2, '0')}`,
      remindDaysBefore: 7,
      notes: `Tithi: ${selectedDayDetail.tithiNp}`,
      createdAt: nowIso.slice(0, 10),
      updatedAt: nowIso,
    });
    setReminderTitleInput('');
    setReminderSavedBanner(true);
    setTimeout(() => setReminderSavedBanner(false), 3000);
  };

  const selectCls =
    'bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500';
  const inputCls =
    'w-full bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-500';

  return (
    <div className="space-y-6 pb-12">
      {/* Navy Editorial Hero Header */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#0B1F3A] text-white border border-[#1E3A5F] shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-200 shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight flex flex-wrap items-center gap-2">
                  <span>
                    {isNe
                      ? `नेपाली आधिकारिक पात्रो (वि.सं. ${toNepaliDigits(selectedYear)})`
                      : `Nepali Official Calendar (${selectedYear} BS)`}
                  </span>
                  <span className="text-xs font-mono font-normal text-blue-200">
                    1970–2105 BS
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
                  {isNe
                    ? 'नेपाल पञ्चाङ्ग निर्णायक समिति र गृह मन्त्रालयको राजपत्रित सार्वजनिक बिदा, शुभ मुहूर्त तथा दैनिक पञ्चाङ्ग'
                    : 'Panchanga calendar, gazetted public holidays, Subha Muhurats & 136-year BS/AD converter'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Dual Clock & Actions */}
          <div className="flex flex-wrap items-center gap-3 bg-[#102A4C] border border-blue-800/60 p-3 rounded-xl">
            <div className="text-left sm:text-right">
              <div className="text-sm font-semibold text-white font-mono">
                {liveClock.bsDateNp}
              </div>
              <div className="text-[11px] text-blue-200 font-mono">
                {liveClock.adDateStr} · {liveClock.gmtOffsetStr}
              </div>
            </div>
            <div className="h-7 w-px bg-blue-800 hidden sm:block" />
            <button
              type="button"
              onClick={handleToday}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{isNe ? 'आज' : 'Today'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[38px] min-w-[38px] p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer"
              title="Print Calendar"
              aria-label="Print Calendar"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/15">
          {[
            { id: 'calendar', icon: CalendarIcon, label: isNe ? 'मासिक पात्रो' : 'Monthly Calendar' },
            { id: 'muhurats', icon: Sparkles, label: isNe ? 'शुभ मुहूर्त' : 'Subha Muhurats' },
            { id: 'holidays', icon: Award, label: isNe ? 'सार्वजनिक बिदा' : 'Government Holidays' },
            { id: 'panchanga', icon: MoonStar, label: isNe ? 'दैनिक पञ्चाङ्ग' : 'Daily Panchanga' },
            { id: 'converter', icon: ArrowRightLeft, label: isNe ? 'मिति रूपान्तरण र उमेर' : 'Date Converter & Age' },
            { id: 'festivals', icon: Flame, label: isNe ? 'वार्षिक चाडपर्व' : 'Yearly Festivals' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-white text-[#0B1F3A] shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MONTHLY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-center">
                  <div className="text-base sm:text-lg font-bold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                    <span>{monthData.bsMonthNameNp}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">
                      {toNepaliDigits(monthData.bsYear)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {monthData.bsMonthNameEn} ({monthData.adMonthRange})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-medium text-[#0B1F3A] dark:text-blue-200">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{monthData.rituNp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={selectCls}
                aria-label="Select BS Year"
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)} (${dec.labelEn})`}>
                    {dec.years.map((y) => (
                      <option key={y} value={y}>
                        वि.सं. {toNepaliDigits(y)} ({y})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className={selectCls}
                aria-label="Select BS Month"
              >
                {BS_MONTHS_NP.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {m} ({BS_MONTHS_EN[idx]})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] text-center">
              {BS_DAYS_NP.map((dayName, idx) => {
                const isSat = idx === 6;
                return (
                  <div
                    key={idx}
                    className={`py-3 px-1 text-xs font-semibold ${
                      isSat
                        ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/20'
                        : 'text-[#0B1F3A] dark:text-slate-200'
                    }`}
                  >
                    <div>{dayName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {BS_DAYS_EN[idx]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr">
              {Array.from({ length: monthData.startDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[86px] sm:min-h-[110px] border-b border-r border-slate-200/70 dark:border-slate-800/60 bg-slate-50/70 dark:bg-[#0B1220]/40"
                />
              ))}

              {monthData.days.map((day) => {
                const isToday =
                  day.bsYear === liveBs.year &&
                  day.bsMonth === liveBs.monthIndex + 1 &&
                  day.bsDay === liveBs.day;
                const isSat = day.isSaturday;
                const isHoliday = day.isHoliday;

                return (
                  <button
                    key={day.bsDay}
                    type="button"
                    onClick={() => setSelectedDayDetail(day)}
                    className={`min-h-[86px] sm:min-h-[112px] p-2 border-b border-r border-slate-200/80 dark:border-slate-800/70 cursor-pointer transition-colors text-left flex flex-col justify-between hover:bg-blue-50/60 dark:hover:bg-slate-800/60 relative ${
                      isToday
                        ? 'bg-blue-50 dark:bg-blue-950/40 ring-2 ring-inset ring-blue-600 dark:ring-blue-400 z-10'
                        : isHoliday
                        ? 'bg-rose-50/50 dark:bg-rose-950/15'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span
                        className={`text-base sm:text-xl font-bold font-mono leading-none ${
                          isHoliday || isSat
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-[#0B1F3A] dark:text-white'
                        }`}
                      >
                        {toNepaliDigits(day.bsDay)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {day.adDay} {day.adMonth}
                      </span>
                    </div>

                    <div className="mt-1">
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">
                        {day.tithiNp}
                      </div>
                    </div>

                    <div className="mt-auto space-y-0.5 w-full">
                      {day.festivalNp && (
                        <div
                          className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded leading-tight line-clamp-2 ${
                            day.isHoliday
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {day.festivalNp}
                        </div>
                      )}

                      {isToday && (
                        <div className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white text-center">
                          {isNe ? 'आज' : 'Today'}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isNe ? 'कुल दिन संख्या' : 'Total Days'}
                </div>
                <div className="text-base font-bold text-[#0B1F3A] dark:text-white font-mono">
                  {toNepaliDigits(monthData.totalDays)} दिन ({monthData.totalDays})
                </div>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isNe ? 'सार्वजनिक बिदा (शनिबार सहित)' : 'Holidays (incl. Sat)'}
                </div>
                <div className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
                  {toNepaliDigits(monthData.days.filter((d) => d.isHoliday).length)} दिन
                </div>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isNe ? 'चाडपर्व तथा विशेष दिन' : 'Festivals & Observances'}
                </div>
                <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {toNepaliDigits(monthData.days.filter((d) => d.festivalNp).length)} वटा
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SUBHA MUHURATS */}
      {activeTab === 'muhurats' && (
        <div className="space-y-5">
          <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>
                  {isNe
                    ? `शुभ मुहूर्त तथा लगन सूची (वि.सं. ${toNepaliDigits(selectedYear)})`
                    : `Auspicious Muhurats (${selectedYear} BS)`}
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {isNe
                  ? 'विवाह, ब्रतबन्ध, गृह प्रवेश तथा पास्नीका शुभ साइतहरू'
                  : 'Vedic Muhurat timings for Vivaha, Bratabandha, Griha Pravesh & Pasni'}
              </p>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={selectCls}
            >
              {availableDecades.map((dec) => (
                <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)}`}>
                  {dec.years.map((y) => (
                    <option key={y} value={y}>
                      वि.सं. {toNepaliDigits(y)} ({y})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 w-full pt-3 border-t border-slate-200 dark:border-slate-800">
              {[
                { id: 'ALL', label: `सबै साइत (${allMuhurats.length})`, icon: Sparkles },
                { id: 'MARRIAGE', label: 'विवाह लगन', icon: Heart },
                { id: 'BRATABANDHA', label: 'ब्रतबन्ध', icon: Bookmark },
                { id: 'GRIHA_PRAVESH', label: 'गृह प्रवेश', icon: Home },
                { id: 'PASNI', label: 'पास्नी', icon: Baby },
              ].map((btn) => {
                const Icon = btn.icon;
                const active = muhuratFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setMuhuratFilter(btn.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMuhurats.map((m) => (
              <Card key={m.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{m.typeNameNp}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{m.dayNameNp}</span>
                </div>
                <div>
                  <div className="text-base font-bold text-[#0B1F3A] dark:text-white">
                    वि.सं. {toNepaliDigits(m.bsYear)} {m.bsMonthNameNp} {toNepaliDigits(m.bsDay)}
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    A.D. {m.adDateStr}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">तिथि / नक्षत्र:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-slate-200">
                      {m.tithiNp} · {m.nakshatraNp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">शुभ समय:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {m.timeWindowNp}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{m.descriptionNp}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC HOLIDAYS */}
      {activeTab === 'holidays' && (
        <div className="space-y-5">
          <Card className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>
                  {isNe
                    ? `आधिकारिक सार्वजनिक बिदाहरू (वि.सं. ${toNepaliDigits(selectedYear)})`
                    : `Nepal Gazetted Public Holidays (${selectedYear} BS)`}
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isNe
                  ? 'नेपाल राजपत्र अनुसार राष्ट्रिय, चाडपर्व, प्रादेशिक तथा महिला बिदाहरू'
                  : 'Official Ministry of Home Affairs gazetted holiday calendar'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={selectCls}
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)}`}>
                    {dec.years.map((y) => (
                      <option key={y} value={y}>
                        वि.सं. {toNepaliDigits(y)} ({y})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={holidaySearchQuery}
                  onChange={(e) => setHolidaySearchQuery(e.target.value)}
                  placeholder={isNe ? 'बिदा खोज्नुहोस्...' : 'Search holiday...'}
                  className={`${inputCls} pl-8 py-2`}
                />
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: isNe ? 'सबै' : 'All' },
              { id: 'National', label: isNe ? 'राष्ट्रिय' : 'National' },
              { id: 'Festival', label: isNe ? 'चाडपर्व' : 'Festival' },
              { id: 'Women', label: isNe ? 'महिला' : 'Women' },
              { id: 'Regional', label: isNe ? 'प्रादेशिक' : 'Regional' },
              { id: 'Special', label: isNe ? 'समुदाय विशेष' : 'Special' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setHolidayCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  holidayCategory === cat.id
                    ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white'
                    : 'bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredHolidays.map((h) => (
              <Card
                key={h.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-semibold text-[#0B1F3A] dark:text-white">
                      {h.nameNp}
                    </span>
                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                      · {h.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{h.descriptionNp}</div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {h.applicableToNp}
                  </div>
                </div>
                <div className="sm:text-right shrink-0 bg-slate-50 dark:bg-[#0B1220] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">
                    {h.bsDate}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {h.adDate} ({h.dayOfWeekNp})
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PANCHANGA */}
      {activeTab === 'panchanga' && (
        <div className="space-y-5">
          <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                <MoonStar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{isNe ? 'दैनिक पञ्चाङ्ग विवरण' : 'Daily Panchanga & Timing Guide'}</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isNe
                  ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त र राहु काल'
                  : '5-limb Panchanga timings computed for Kathmandu, Nepal'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={panchangaDateBs.year}
                onChange={(e) =>
                  setPanchangaDateBs((prev) => ({ ...prev, year: Number(e.target.value) }))
                }
                className={selectCls}
              >
                {availableDecades.map((dec) => (
                  <optgroup key={dec.decade} label={`वि.सं. ${toNepaliDigits(dec.decade)}`}>
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
                className={selectCls}
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
                className={selectCls}
              >
                {Array.from({ length: 32 }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {toNepaliDigits(idx + 1)} गते
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#0B1F3A] dark:text-white">
                  वि.सं. {toNepaliDigits(selectedPanchangaDay.bsYear)}{' '}
                  {BS_MONTHS_NP[selectedPanchangaDay.bsMonth - 1]}{' '}
                  {toNepaliDigits(selectedPanchangaDay.bsDay)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPanchangaDay.adDateFormatted} ({selectedPanchangaDay.dayNameNp} /{' '}
                  {selectedPanchangaDay.dayNameEn})
                </div>
              </div>
              {selectedPanchangaDay.festivalNp && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  {selectedPanchangaDay.festivalNp}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: '१. तिथि', val: selectedPanchangaDay.tithiNp, sub: selectedPanchangaDay.pakshaNp },
                { label: '२. नक्षत्र', val: selectedPanchangaDay.nakshatraNp, sub: 'नक्षत्र चरण' },
                { label: '३. योग', val: selectedPanchangaDay.yogaNp, sub: 'दैनिक योग' },
                { label: '४. करण', val: selectedPanchangaDay.karanaNp, sub: 'दैनिक करण' },
                {
                  label: '५. राशि',
                  val: `चन्द्र: ${selectedPanchangaDay.chandrarashiNp.split(' ')[0]}`,
                  sub: `सूर्य: ${selectedPanchangaDay.suryarashiNp.split(' ')[0]}`,
                },
              ].map((limb) => (
                <div
                  key={limb.label}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                    {limb.label}
                  </span>
                  <div className="text-sm font-bold text-[#0B1F3A] dark:text-white">{limb.val}</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400">{limb.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>सूर्योदय / सूर्यास्त</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">सूर्योदय:</span>
                  <span className="font-mono font-semibold text-[#0B1F3A] dark:text-white">
                    {selectedPanchangaDay.sunriseTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">सूर्यास्त:</span>
                  <span className="font-mono font-semibold text-[#0B1F3A] dark:text-white">
                    {selectedPanchangaDay.sunsetTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">चन्द्रोदय:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedPanchangaDay.moonriseTime}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>शुभ समय</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">अभिजीत मुहूर्त:</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedPanchangaDay.abhijitMuhurat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ब्रह्म मुहूर्त:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedPanchangaDay.brahmaMuhurat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">अमृत काल:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedPanchangaDay.amritKaal}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>वर्जित समय</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">राहु काल:</span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                    {selectedPanchangaDay.rahuKaal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">यमघण्ट काल:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedPanchangaDay.yamaghantaKaal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">दिशाशूल:</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    {selectedPanchangaDay.dishashoolNp}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: BS <-> AD CONVERTER & AGE CALCULATOR */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isNe ? '१. वि.सं. (BS) बाट ई.सं. (AD)' : '1. Bikram Sambat (BS) to AD'}</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">
                    {isNe ? 'वर्ष' : 'BS Year'}
                  </label>
                  <input
                    type="number"
                    value={convBsYear}
                    onChange={(e) => setConvBsYear(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">
                    {isNe ? 'महिना' : 'Month'}
                  </label>
                  <select
                    value={convBsMonth}
                    onChange={(e) => setConvBsMonth(Number(e.target.value))}
                    className={inputCls}
                  >
                    {BS_MONTHS_NP.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">
                    {isNe ? 'गते' : 'Day'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={convBsDay}
                    onChange={(e) => setConvBsDay(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNe ? 'रूपान्तरित अङ्ग्रेजी मिति:' : 'Converted AD Date:'}
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {bsToAdResult.adDateFormatted}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {bsToAdResult.dayOfWeekNp} ({bsToAdResult.dayOfWeekEn}) · ISO: {bsToAdResult.adDateIso}
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isNe ? '२. ई.सं. (AD) बाट वि.सं. (BS)' : '2. Gregorian (AD) to BS'}</span>
              </h3>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">
                  {isNe ? 'अङ्ग्रेजी मिति छान्नुहोस्' : 'Select AD Date'}
                </label>
                <input
                  type="date"
                  value={convAdDateInput}
                  onChange={(e) => setConvAdDateInput(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNe ? 'रूपान्तरित नेपाली मिति:' : 'Converted BS Date:'}
                </div>
                <div className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                  {adToBsResult.bsDateNp}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  {adToBsResult.dayOfWeekNp} ({adToBsResult.dayOfWeekEn}) · {adToBsResult.bsDateEn}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Hourglass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isNe ? '३. नेपाली उमेर क्याल्कुलेटर' : '3. Nepali Age Calculator'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  {isNe ? 'जन्म वर्ष (BS)' : 'Birth BS Year'}
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  {isNe ? 'जन्म महिना' : 'Birth Month'}
                </label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className={inputCls}
                >
                  {BS_MONTHS_NP.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  {isNe ? 'जन्म गते' : 'Birth Day'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNe ? 'यकिन उमेर' : 'Current Age'}
                </div>
                <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {ageResult.ageStringNp}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {ageResult.ageStringEn}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNe ? 'कुल दिन' : 'Total Days'}
                </div>
                <div className="text-base font-bold text-[#0B1F3A] dark:text-white font-mono mt-1">
                  ~{toNepaliDigits(ageResult.approxTotalDays)} दिन
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Approx {ageResult.approxTotalDays} Days
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNe ? 'आगामी जन्मदिन' : 'Next Birthday'}
                </div>
                <div className="text-sm font-bold text-[#0B1F3A] dark:text-white mt-1">
                  {ageResult.nextBirthdayBs}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {ageResult.nextBirthdayAd} ({ageResult.nextBirthdayDayOfWeek})
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isNe ? '४. दुई मिति बिचको अन्तर' : '4. BS Date Difference Calculator'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isNe ? 'सुरुको मिति (BS)' : 'From Date (BS)'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={diffFromYear}
                    onChange={(e) => setDiffFromYear(Number(e.target.value))}
                    className={inputCls}
                  />
                  <select
                    value={diffFromMonth}
                    onChange={(e) => setDiffFromMonth(Number(e.target.value))}
                    className={inputCls}
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
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isNe ? 'अन्तिम मिति (BS)' : 'To Date (BS)'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={diffToYear}
                    onChange={(e) => setDiffToYear(Number(e.target.value))}
                    className={inputCls}
                  />
                  <select
                    value={diffToMonth}
                    onChange={(e) => setDiffToMonth(Number(e.target.value))}
                    className={inputCls}
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
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs flex flex-wrap items-center justify-between gap-2 text-[#0B1F3A] dark:text-blue-200 font-semibold">
              <span>
                {isNe ? 'कुल अन्तर:' : 'Total Difference:'}{' '}
                <strong className="font-mono text-base">{dateDiffResult.diffDays} Days</strong> (
                {toNepaliDigits(dateDiffResult.diffDays)} दिन)
              </span>
              <span className="font-mono">
                {dateDiffResult.weeks}w {dateDiffResult.remDays}d
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: FESTIVALS */}
      {activeTab === 'festivals' && (
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>
                {isNe ? 'प्रमुख वार्षिक चाडपर्व निर्देशिका (२०८३)' : 'Major Yearly Festivals Guide (2083 BS)'}
              </span>
            </h2>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'बडा दशैं (विजयादशमी)',
                titleEn: 'Bada Dashain (Vijaya Dashami)',
                bsDate: '२०८३ असोज १७ – असोज २६',
                adDate: '3 Oct – 12 Oct 2026',
                holidayStatus: 'National Holiday',
                desc: 'नेपालको प्रमुख राष्ट्रिय पर्व — घटस्थापना, फूलपाती, महाअष्टमी, महानवमी र विजयादशमी।',
              },
              {
                title: 'तिहार तथा दीपावली',
                titleEn: 'Tihar & Deepawali',
                bsDate: '२०८३ कार्तिक १५ – कार्तिक १९',
                adDate: '31 Oct – 4 Nov 2026',
                holidayStatus: 'National Holiday',
                desc: 'काग तिहार, कुकुर तिहार, लक्ष्मी पूजा, गोवर्धन/म्ह पूजा र भाइटीका।',
              },
              {
                title: 'छठ महापर्व',
                titleEn: 'Chhath Parva',
                bsDate: '२०८३ कार्तिक २३ – २४',
                adDate: '8 Nov – 9 Nov 2026',
                holidayStatus: 'Public Holiday',
                desc: 'सूर्यदेव तथा छठी माताको उपासना र अर्घ्य समर्पणको पवित्र पर्व।',
              },
              {
                title: 'महाशिवरात्रि',
                titleEn: 'Maha Shivaratri',
                bsDate: '२०८३ फागुन १३',
                adDate: '25 Feb 2027',
                holidayStatus: 'National Holiday',
                desc: 'पशुपतिनाथ लगायत देशभरका शिवालयमा मनाइने महापर्व।',
              },
            ].map((f, idx) => (
              <Card key={idx} className="p-5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white">{f.title}</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{f.titleEn}</div>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 shrink-0">
                    {f.holidayStatus}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs font-mono text-[#0B1F3A] dark:text-slate-200">
                  {f.bsDate} ({f.adDate})
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* DAY DETAIL MODAL + SYNCED REMINDER ACTION */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                  वि.सं. {toNepaliDigits(selectedDayDetail.bsYear)}{' '}
                  {BS_MONTHS_NP[selectedDayDetail.bsMonth - 1]}{' '}
                  {toNepaliDigits(selectedDayDetail.bsDay)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDayDetail.adDateFormatted} ({selectedDayDetail.dayNameNp} /{' '}
                  {selectedDayDetail.dayNameEn})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayDetail(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close day detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDayDetail.festivalNp && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold ${
                  selectedDayDetail.isHoliday
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300'
                }`}
              >
                {selectedDayDetail.festivalNp}
                {selectedDayDetail.holidayReasonNp && (
                  <div className="text-[11px] font-normal mt-0.5 opacity-90">
                    {selectedDayDetail.holidayReasonNp}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">तिथि:</span>
                <span className="font-semibold text-[#0B1F3A] dark:text-white">
                  {selectedDayDetail.tithiNp}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">नक्षत्र:</span>
                <span className="font-semibold text-[#0B1F3A] dark:text-white">
                  {selectedDayDetail.nakshatraNp}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">सूर्योदय / सूर्यास्त:</span>
                <span className="font-mono text-[#0B1F3A] dark:text-white">
                  {selectedDayDetail.sunriseTime} / {selectedDayDetail.sunsetTime}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">राहु काल:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {selectedDayDetail.rahuKaal}
                </span>
              </div>
            </div>

            {/* Save Synced Reminder Form */}
            <form
              onSubmit={(e) => void handleSaveDayReminder(e)}
              className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2.5"
            >
              <label className="text-xs font-semibold text-[#0B1F3A] dark:text-blue-200 flex items-center gap-1.5">
                <BellPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isNe ? 'यस मितिका लागि रिमाइन्डर सुरक्षित गर्नुहोस्' : 'Add Synced Personal Reminder'}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reminderTitleInput}
                  onChange={(e) => setReminderTitleInput(e.target.value)}
                  placeholder={
                    isNe ? 'रिमाइन्डर शीर्षक लेख्नुहोस्...' : 'e.g. Bluebook renewal / Family event'
                  }
                  className={inputCls}
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 hover:bg-[#132f57] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  {isNe ? 'सुरक्षित' : 'Save'}
                </button>
              </div>
              {reminderSavedBanner && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isNe
                      ? 'रिमाइन्डर तपाईँको सिङ्क सूचीमा सुरक्षित भयो।'
                      : 'Saved to your offline + cloud-synced reminders.'}
                  </span>
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
