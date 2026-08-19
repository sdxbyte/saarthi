import { useState, useEffect, useCallback } from 'react';
import NepaliDate from 'nepali-date-converter';

// IANA Time Zone catalog for major global regions
export interface TimeZoneOption {
  iana: string;
  label: string;
  flag: string;
}

export const SUPPORTED_TIMEZONES: TimeZoneOption[] = [
  { iana: 'Asia/Kathmandu', label: 'Nepal (NPT - GMT+5:45)', flag: '🇳🇵' },
  { iana: 'Asia/Kolkata', label: 'India (IST - GMT+5:30)', flag: '🇮🇳' },
  { iana: 'Asia/Dubai', label: 'UAE / Dubai (GST - GMT+4:00)', flag: '🇦🇪' },
  { iana: 'Asia/Qatar', label: 'Qatar / Doha (AST - GMT+3:00)', flag: '🇶🇦' },
  { iana: 'Asia/Riyadh', label: 'Saudi Arabia (AST - GMT+3:00)', flag: '🇸🇦' },
  { iana: 'Asia/Kuala_Lumpur', label: 'Malaysia (MYT - GMT+8:00)', flag: '🇲🇾' },
  { iana: 'Asia/Singapore', label: 'Singapore (SGT - GMT+8:00)', flag: '🇸🇬' },
  { iana: 'Asia/Tokyo', label: 'Japan (JST - GMT+9:00)', flag: '🇯🇵' },
  { iana: 'Asia/Seoul', label: 'South Korea (KST - GMT+9:00)', flag: '🇰🇷' },
  { iana: 'Europe/London', label: 'United Kingdom (GMT/BST)', flag: '🇬🇧' },
  { iana: 'Europe/Paris', label: 'Europe (CET/CEST)', flag: '🇪🇺' },
  { iana: 'America/New_York', label: 'USA Eastern (EST/EDT)', flag: '🇺🇸' },
  { iana: 'America/Los_Angeles', label: 'USA Pacific (PST/PDT)', flag: '🇺🇸' },
  { iana: 'Australia/Sydney', label: 'Australia Sydney (AEST/AEDT)', flag: '🇦🇺' },
  { iana: 'UTC', label: 'Coordinated Universal Time (UTC)', flag: '🌐' },
];

// Nepali Month Names in Nepali & English
export const BS_MONTHS_NP = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 
  'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const BS_MONTHS_EN = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const BS_WEEKDAYS_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
export const BS_WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Nepali Public Holidays & Major Festivals Database
export interface NepaliEvent {
  bsDate: string; // e.g. "2083-06-03"
  adDate: string; // e.g. "2026-09-19"
  nameNp: string;
  nameEn: string;
  type: 'festival' | 'national_holiday' | 'civic_day';
}

export const NEPAL_HOLIDAYS_CATALOG: NepaliEvent[] = [
  { bsDate: '2083-01-01', adDate: '2026-04-14', nameNp: 'नयाँ वर्ष (२०८३)', nameEn: 'Nepali New Year 2083', type: 'national_holiday' },
  { bsDate: '2083-01-18', adDate: '2026-05-01', nameNp: 'अन्तर्राष्ट्रिय मजदुर दिवस', nameEn: 'International Labour Day', type: 'civic_day' },
  { bsDate: '2083-01-28', adDate: '2026-05-11', nameNp: 'बुद्ध जयन्ती', nameEn: 'Buddha Jayanti & Ubhauli', type: 'festival' },
  { bsDate: '2083-02-15', adDate: '2026-05-29', nameNp: 'गणतन्त्र दिवस', nameEn: 'Republic Day of Nepal', type: 'national_holiday' },
  { bsDate: '2083-05-03', adDate: '2026-08-19', nameNp: 'श्री कृष्ण जन्माष्टमी', nameEn: 'Shree Krishna Janmashtami', type: 'festival' },
  { bsDate: '2083-05-18', adDate: '2026-09-03', nameNp: 'हरितालिका तीज', nameEn: 'Haritalika Teej (Women Holiday)', type: 'festival' },
  { bsDate: '2083-06-03', adDate: '2026-09-19', nameNp: 'संविधान दिवस', nameEn: 'Constitution Day of Nepal', type: 'national_holiday' },
  { bsDate: '2083-06-25', adDate: '2026-10-11', nameNp: 'घटस्थापना (दशैं आरम्भ)', nameEn: 'Ghatasthapana (Dashain Begins)', type: 'festival' },
  { bsDate: '2083-06-29', adDate: '2026-10-15', nameNp: 'विजया दशमी (महान दशैं)', nameEn: 'Vijaya Dashami (Main Dashain)', type: 'festival' },
  { bsDate: '2083-07-22', adDate: '2026-11-07', nameNp: 'लक्ष्मी पूजा (तिहार)', nameEn: 'Laxmi Puja (Tihar)', type: 'festival' },
  { bsDate: '2083-07-24', adDate: '2026-11-09', nameNp: 'भाइटीका (तिहार)', nameEn: 'Bhai Tika (Tihar)', type: 'festival' },
  { bsDate: '2083-07-29', adDate: '2026-11-14', nameNp: 'छठ पर्व', nameEn: 'Chhath Parva', type: 'festival' },
  { bsDate: '2083-11-07', adDate: '2027-02-19', nameNp: 'राष्ट्रिय प्रजातन्त्र दिवस', nameEn: 'National Democracy Day', type: 'national_holiday' },
  { bsDate: '2083-11-21', adDate: '2027-03-05', nameNp: 'महाशिवरात्री', nameEn: 'Maha Shivaratri', type: 'festival' },
  { bsDate: '2083-12-08', adDate: '2027-03-22', nameNp: 'फागु पूर्णिमा (होली)', nameEn: 'Fagu Purnima (Holi)', type: 'festival' },
];

// Helper: Convert digits to Nepali
export function toNepaliDigits(numStr: string | number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return numStr
    .toString()
    .split('')
    .map((char) => (char >= '0' && char <= '9' ? nepaliDigits[parseInt(char, 10)] : char))
    .join('');
}

// Bikram Sambat (BS) Date Calculation from AD
export function getBsDateFromAdDate(date: Date = new Date()): {
  year: number;
  monthIndex: number; // 0-11
  monthNameNp: string;
  monthNameEn: string;
  day: number;
  weekdayNp: string;
  weekdayEn: string;
  bsDateStr: string;   // e.g. "2083-04-22"
  bsDateFormattedNp: string; // "वि.सं. २०८३ श्रावण २२"
  bsDateFormattedEn: string; // "BS 2083 Shrawan 22"
} {
  let year = 2083;
  let monthIndex = 3;
  let day = 22;

  try {
    const bs = new NepaliDate(date);
    year = bs.getYear();
    monthIndex = bs.getMonth();
    day = bs.getDate();
  } catch (e) {
    const anchorAd = new Date(2026, 3, 14); // Apr 14, 2026 = BS 2083 Baisakh 01
    const diffDays = Math.floor((date.getTime() - anchorAd.getTime()) / (1000 * 60 * 60 * 24));
    year = 2083;
    let dayCount = diffDays;
    while (dayCount >= 365) {
      year += 1;
      dayCount -= 365;
    }
    while (dayCount < 0) {
      year -= 1;
      dayCount += 365;
    }
    const monthDays = [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31];
    monthIndex = 0;
    while (monthIndex < 12 && dayCount >= monthDays[monthIndex]) {
      dayCount -= monthDays[monthIndex];
      monthIndex++;
    }
    day = Math.max(1, Math.min(32, Math.floor(dayCount) + 1));
  }

  const dayOfWeek = date.getDay();
  const monthNameNp = BS_MONTHS_NP[monthIndex % 12] || 'श्रावण';
  const monthNameEn = BS_MONTHS_EN[monthIndex % 12] || 'Shrawan';
  const weekdayNp = BS_WEEKDAYS_NP[dayOfWeek];
  const weekdayEn = BS_WEEKDAYS_EN[dayOfWeek];

  const mPadded = String(monthIndex + 1).padStart(2, '0');
  const dPadded = String(day).padStart(2, '0');
  const bsDateStr = `${year}-${mPadded}-${dPadded}`;

  const bsDateFormattedNp = `वि.सं. ${toNepaliDigits(year)} ${monthNameNp} ${toNepaliDigits(day)} (${weekdayNp})`;
  const bsDateFormattedEn = `BS ${year} ${monthNameEn} ${day} (${weekdayEn.substring(0, 3)})`;

  return {
    year,
    monthIndex,
    monthNameNp,
    monthNameEn,
    day,
    weekdayNp,
    weekdayEn,
    bsDateStr,
    bsDateFormattedNp,
    bsDateFormattedEn,
  };
}

// Master Global Time & Calendar Snapshot Data Structure
export interface TimeCalendarState {
  timestampMs: number;
  isoString: string;
  utcString: string;
  unixTimestampSec: number;
  
  // AD Date Info
  adYear: number;
  adMonth: number;
  adDay: number;
  adDateIso: string; // YYYY-MM-DD
  adDateFormatted: string; // e.g. "6 Aug 2026 (Thu)"
  adWeekday: string;

  // BS Date Info
  bsYear: number;
  bsMonthNameNp: string;
  bsMonthNameEn: string;
  bsDay: number;
  bsDateIso: string; // e.g. "2083-04-22"
  bsFormattedNp: string;
  bsFormattedEn: string;

  // Time & Zone Info
  time12h: string; // "03:15:42 PM"
  time24h: string; // "15:15:42"
  timeZoneIana: string;
  gmtOffsetStr: string;
  tzAbbrev: string;
  countryName: string;
  flag: string;
  isDstActive: boolean;

  // Nepal Holiday lookup if applicable
  todayFestival?: NepaliEvent | null;

  // Global Time Synchronization Metadata (Rule 1)
  lastSyncTime?: string;
  nextSyncTime?: string;
  syncStatus?: 'synchronized' | 'syncing' | 'error';
  syncErrorText?: string | null;
}

// Helper to extract localized date components for a specific IANA timeZone
export function getLocalizedDateParts(date: Date, timeZone: string = 'Asia/Kathmandu') {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

    const year = parseInt(getPart('year'), 10) || date.getUTCFullYear();
    const month = parseInt(getPart('month'), 10) || (date.getUTCMonth() + 1);
    const day = parseInt(getPart('day'), 10) || date.getUTCDate();
    const hour = parseInt(getPart('hour'), 10) || date.getUTCHours();
    const minute = parseInt(getPart('minute'), 10) || date.getUTCMinutes();
    const second = parseInt(getPart('second'), 10) || date.getUTCSeconds();
    const weekday = getPart('weekday') || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];
    
    const monthsEnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthShort = monthsEnShort[(month - 1) % 12] || 'Aug';

    return { year, month, day, hour, minute, second, weekday, monthShort };
  } catch (e) {
    const monthsEnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      monthShort: monthsEnShort[date.getMonth()],
    };
  }
}

// Accurate Timezone Offset, Abbreviation, Country & Flag details generator
export function getTimezoneOffsetAndDetails(date: Date, timeZone: string) {
  const matchOption = SUPPORTED_TIMEZONES.find((t) => t.iana === timeZone);
  let flag = matchOption?.flag || '🌐';
  let countryName = 'Nepal';
  if (matchOption) {
    countryName = matchOption.label.split('(')[0].trim().replace(/\s*\/.*$/, '');
  } else {
    const parts = timeZone.split('/');
    countryName = (parts[1] || parts[0]).replace(/_/g, ' ');
  }

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
      hour12: false,
    }).formatToParts(date);
    
    let tzAbbrev = parts.find((p) => p.type === 'timeZoneName')?.value || '';
    if (timeZone === 'Asia/Kathmandu') tzAbbrev = 'NPT';
    else if (timeZone === 'Asia/Qatar' || timeZone === 'Asia/Riyadh') tzAbbrev = 'AST';
    else if (timeZone === 'Asia/Kolkata') tzAbbrev = 'IST';
    else if (timeZone === 'Asia/Dubai') tzAbbrev = 'GST';
    else if (timeZone === 'Asia/Kuala_Lumpur' || timeZone === 'Asia/Singapore') tzAbbrev = 'SGT';
    else if (timeZone === 'Asia/Tokyo') tzAbbrev = 'JST';

    const utcFormat = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const tzFormat = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });

    const getValues = (formatter: Intl.DateTimeFormat) => {
      const p = formatter.formatToParts(date);
      const val = (type: string) => parseInt(p.find((x) => x.type === type)?.value || '0', 10);
      return {
        year: val('year'),
        month: val('month'),
        day: val('day'),
        hour: val('hour') % 24,
        minute: val('minute'),
        second: val('second')
      };
    };

    const utc = getValues(utcFormat);
    const tz = getValues(tzFormat);

    const utcUtcMs = Date.UTC(utc.year, utc.month - 1, utc.day, utc.hour, utc.minute, utc.second);
    const tzUtcMs = Date.UTC(tz.year, tz.month - 1, tz.day, tz.hour, tz.minute, tz.second);

    const diffMinutes = Math.round((tzUtcMs - utcUtcMs) / (60 * 1000));
    const sign = diffMinutes >= 0 ? '+' : '-';
    const absMin = Math.abs(diffMinutes);
    const hrs = String(Math.floor(absMin / 60)).padStart(2, '0');
    const mins = String(absMin % 60).padStart(2, '0');
    const gmtOffsetStr = `GMT${sign}${hrs}:${mins}`;

    return { gmtOffsetStr, tzAbbrev, countryName, flag };
  } catch (e) {
    return { gmtOffsetStr: 'GMT+05:45', tzAbbrev: 'NPT', countryName: 'Nepal', flag: '🇳🇵' };
  }
}

// Canonical UTC ISO 8601 formatting for backend/database/audit storage
export function formatToCanonicalUtc(input?: Date | string | number): string {
  if (!input) return new Date().toISOString();
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// Primary Generator Function for Centralized Time & Calendar State
export function getCurrentTimeCalendarState(
  customDate?: Date,
  timeZone: string = 'Asia/Kathmandu',
  use24HourClock: boolean = false,
  syncMeta?: { lastSyncTime?: string; nextSyncTime?: string; syncStatus?: 'synchronized' | 'syncing' | 'error'; syncErrorText?: string | null }
): TimeCalendarState {
  const date = customDate || new Date();
  const timestampMs = date.getTime();
  const isoString = date.toISOString(); // Internal UTC canonical format!
  const utcString = date.toUTCString();  // Internal UTC string!
  const unixTimestampSec = Math.floor(timestampMs / 1000);

  // Localized AD Calculation based on target timeZone
  const localParts = getLocalizedDateParts(date, timeZone);
  const adYear = localParts.year;
  const adMonth = localParts.month;
  const adDay = localParts.day;
  const adWeekday = localParts.weekday;
  const adMonthStr = localParts.monthShort;
  const adDateIso = `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
  const adDateFormatted = `${adDay} ${adMonthStr} ${adYear} (${adWeekday})`;

  // BS Calculation derived from localized AD date
  const localizedAdDateObj = new Date(adYear, adMonth - 1, adDay);
  const bsInfo = getBsDateFromAdDate(localizedAdDateObj);

  // Timezone & Clock formatting
  let time12h = '';
  let time24h = '';
  const { gmtOffsetStr, tzAbbrev, countryName, flag } = getTimezoneOffsetAndDetails(date, timeZone);

  try {
    const timeFormatter12 = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const timeFormatter24 = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    time12h = timeFormatter12.format(date);
    time24h = timeFormatter24.format(date);
  } catch (e) {
    time12h = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    time24h = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  // Check if today matches any festival or holiday
  const todayFestival = NEPAL_HOLIDAYS_CATALOG.find(
    (h) => h.bsDate === bsInfo.bsDateStr || h.adDate === adDateIso
  ) || null;

  return {
    timestampMs,
    isoString,
    utcString,
    unixTimestampSec,
    adYear,
    adMonth,
    adDay,
    adDateIso,
    adDateFormatted,
    adWeekday,
    bsYear: bsInfo.year,
    bsMonthNameNp: bsInfo.monthNameNp,
    bsMonthNameEn: bsInfo.monthNameEn,
    bsDay: bsInfo.day,
    bsDateIso: bsInfo.bsDateStr,
    bsFormattedNp: bsInfo.bsDateFormattedNp,
    bsFormattedEn: bsInfo.bsDateFormattedEn,
    time12h,
    time24h,
    timeZoneIana: timeZone,
    gmtOffsetStr,
    tzAbbrev,
    countryName,
    flag,
    isDstActive: false,
    todayFestival,
    lastSyncTime: syncMeta?.lastSyncTime || date.toISOString(),
    nextSyncTime: syncMeta?.nextSyncTime || new Date(date.getTime() + 30000).toISOString(),
    syncStatus: syncMeta?.syncStatus || 'synchronized',
    syncErrorText: syncMeta?.syncErrorText || null,
  };
}

// Relative Time Helper ("Updated x minutes ago")
export function getRelativeTimeString(timestampInput: string | number | Date): string {
  const dateObj = new Date(timestampInput);
  if (isNaN(dateObj.getTime())) return 'Recently';

  const now = new Date();
  const diffSec = Math.max(0, Math.floor((now.getTime() - dateObj.getTime()) / 1000));

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;

  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

// Dual Date Formatter Result for Audit Logs & Cards
export interface DualDatePayload {
  adDateStr: string;   // "2026-08-06 A.D."
  bsDateStr: string;   // "2083-04-22 B.S."
  combined: string;    // "2083-04-22 B.S. | 2026-08-06 A.D."
  timeStr: string;     // "03:15 PM"
  timeZone: string;    // "Asia/Kathmandu"
  isoString: string;   // Canonical UTC ISO 8601 string
  relativeTime: string;
}

export function formatCentralDualDate(dateInput?: string | Date | number, timeZone: string = 'Asia/Kathmandu'): DualDatePayload {
  const dateObj = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  
  const localParts = getLocalizedDateParts(validDate, timeZone);
  const localizedAdObj = new Date(localParts.year, localParts.month - 1, localParts.day);

  const bsInfo = getBsDateFromAdDate(localizedAdObj);
  const mPadded = String(bsInfo.monthIndex + 1).padStart(2, '0');
  const dPadded = String(bsInfo.day).padStart(2, '0');
  const bsDateStr = `${bsInfo.year}-${mPadded}-${dPadded} B.S.`;

  const adYear = localParts.year;
  const adMonthPadded = String(localParts.month).padStart(2, '0');
  const adDayPadded = String(localParts.day).padStart(2, '0');
  const adDateStr = `${adYear}-${adMonthPadded}-${adDayPadded} A.D.`;

  let timeStr = '';
  try {
    timeStr = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(validDate);
  } catch (e) {
    timeStr = validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return {
    adDateStr,
    bsDateStr,
    combined: `${bsDateStr} | ${adDateStr}`,
    timeStr,
    timeZone,
    isoString: validDate.toISOString(), // Always maintain internal canonical UTC
    relativeTime: getRelativeTimeString(validDate),
  };
}

// React Hook for Continuous Real-Time Clock & Calendar Awareness
export function useTimeCalendar(selectedTimeZone: string = 'Asia/Kathmandu') {
  const [syncMeta, setSyncMeta] = useState<{
    lastSyncTime?: string;
    nextSyncTime?: string;
    syncStatus?: 'synchronized' | 'syncing' | 'error';
    syncErrorText?: string | null;
  }>({
    syncStatus: 'syncing',
    syncErrorText: null,
  });

  const [state, setState] = useState<TimeCalendarState>(() =>
    getCurrentTimeCalendarState(new Date(), selectedTimeZone, false, syncMeta)
  );

  const fetchServerTimeSync = useCallback(async () => {
    try {
      const res = await fetch('/api/time');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSyncMeta({
        lastSyncTime: json.lastSyncTime || new Date().toISOString(),
        nextSyncTime: json.nextSyncTime || new Date(Date.now() + 30000).toISOString(),
        syncStatus: 'synchronized',
        syncErrorText: null,
      });
    } catch (err: any) {
      setSyncMeta({
        syncStatus: 'error',
        syncErrorText: 'Unable to synchronize date and time.',
      });
    }
  }, []);

  useEffect(() => {
    fetchServerTimeSync();
    const syncInterval = setInterval(fetchServerTimeSync, 30000); // Sync every 30 seconds
    return () => clearInterval(syncInterval);
  }, [fetchServerTimeSync]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(getCurrentTimeCalendarState(new Date(), selectedTimeZone, false, syncMeta));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedTimeZone, syncMeta]);

  return state;
}
