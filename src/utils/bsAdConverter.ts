import { rawBsToJsDate, rawJsDateToBs } from '../services/nepaliCalendarFullData';

// Simplified accurate BS/AD converter and live timezone/clock helper
export interface LiveClockInfo {
  bsDateNp: string;        // e.g. "वि.सं. २०८३ श्रावण १७"
  bsDateEn: string;        // e.g. "BS 2083 Shrawan 17"
  adDateStr: string;       // e.g. "1 Aug 2026 (Sat)"
  adDateIso: string;       // e.g. "2026-08-01"
  timeStr: string;         // e.g. "11:15:42 PM"
  timeZoneName: string;    // e.g. "Asia/Kathmandu" or "America/New_York"
  gmtOffsetStr: string;    // e.g. "GMT+05:45"
  countryOrRegion: string; // e.g. "Nepal 🇳🇵" or region derived from timezone
}

export function toNepaliDigits(numStr: string | number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return numStr
    .toString()
    .split('')
    .map((char) => (char >= '0' && char <= '9' ? nepaliDigits[parseInt(char, 10)] : char))
    .join('');
}

export function convertBsToAd(bsYear: number, bsMonth: number, bsDay: number): string {
  try {
    const adObj = rawBsToJsDate(bsYear, bsMonth, bsDay);
    const y = adObj.getFullYear();
    const m = String(adObj.getMonth() + 1).padStart(2, '0');
    const d = String(adObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch (e) {
    const baseBsYear = 2083;
    const baseAdYear = 2026;
    const diffYears = bsYear - baseBsYear;
    const adYear = baseAdYear + diffYears;
    const mStr = bsMonth < 10 ? `0${bsMonth}` : `${bsMonth}`;
    const dStr = bsDay < 10 ? `0${bsDay}` : `${bsDay}`;
    return `${adYear}-${mStr}-${dStr}`;
  }
}

export function convertAdToBs(adDateStr: string): string {
  const monthNamesNp = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
  if (!adDateStr) {
    const bs = rawJsDateToBs(new Date());
    return `${bs.year} ${monthNamesNp[bs.month - 1]} ${bs.day}`;
  }
  try {
    const parts = adDateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month - 1, day);
    const bsDate = rawJsDateToBs(dateObj);
    return `${bsDate.year} ${monthNamesNp[bsDate.month - 1]} ${bsDate.day}`;
  } catch (e) {
    const parts = adDateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const bsYear = year + 56;
    const monthName = monthNamesNp[(month - 1) % 12];
    return `${bsYear} ${monthName} ${day}`;
  }
}

// Convert AD Date object to accurate Bikram Sambat (BS) date using 136-year master data engine
export function getBsDateFromAdDate(date: Date = new Date()): {
  year: number;
  monthIndex: number;
  monthNameNp: string;
  monthNameEn: string;
  day: number;
} {
  const monthNamesNp = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
  const monthNamesEn = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

  try {
    const bs = rawJsDateToBs(date);
    const year = bs.year;
    const monthIndex = bs.month - 1;
    const day = bs.day;
    return {
      year,
      monthIndex,
      monthNameNp: monthNamesNp[monthIndex % 12] || 'श्रावण',
      monthNameEn: monthNamesEn[monthIndex % 12] || 'Shrawan',
      day,
    };
  } catch (e) {
    const year = date.getFullYear() + 57;
    const monthIndex = date.getMonth();
    return {
      year,
      monthIndex,
      monthNameNp: monthNamesNp[monthIndex % 12] || 'श्रावण',
      monthNameEn: monthNamesEn[monthIndex % 12] || 'Shrawan',
      day: date.getDate(),
    };
  }
}

export function getLiveClockData(date: Date = new Date()): LiveClockInfo {
  const bsInfo = getBsDateFromAdDate(date);
  
  const bsDateNp = `वि.सं. ${toNepaliDigits(bsInfo.year)} ${bsInfo.monthNameNp} ${toNepaliDigits(bsInfo.day)}`;
  const bsDateEn = `BS ${bsInfo.year} ${bsInfo.monthNameEn} ${bsInfo.day}`;

  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = daysEn[date.getDay()];
  const monthName = monthsEn[date.getMonth()];
  const adDateStr = `${date.getDate()} ${monthName} ${date.getFullYear()} (${dayName})`;
  const adDateIso = date.toISOString().split('T')[0];

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffsetMin = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffsetMin / 60);
  const offsetMins = absOffsetMin % 60;
  const gmtOffsetStr = `GMT${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

  let countryOrRegion = timeZoneName.split('/')[1] || timeZoneName;
  countryOrRegion = countryOrRegion.replace(/_/g, ' ');
  if (timeZoneName === 'Asia/Kathmandu') {
    countryOrRegion = 'Nepal 🇳🇵';
  }

  return {
    bsDateNp,
    bsDateEn,
    adDateStr,
    adDateIso,
    timeStr,
    timeZoneName,
    gmtOffsetStr,
    countryOrRegion,
  };
}

import { formatCentralDualDate } from './timeCalendarEngine';

export interface DualDateResult {
  bsDateStr: string;   // e.g. "2083-04-20 B.S."
  adDateStr: string;   // e.g. "2026-08-04 A.D."
  combined: string;    // e.g. "2083-04-20 B.S. | 2026-08-04 A.D."
  timeStr?: string;    // e.g. "01:56 PM"
}

export function formatDualDate(dateInput?: string | Date | number, timeZone: string = 'Asia/Kathmandu'): DualDateResult {
  const central = formatCentralDualDate(dateInput, timeZone);
  return {
    bsDateStr: central.bsDateStr,
    adDateStr: central.adDateStr,
    combined: central.combined,
    timeStr: central.timeStr,
  };
}


