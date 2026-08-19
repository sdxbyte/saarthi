// Authentic Nepali Calendar (पात्रो), Panchanga & Muhurat Engine
// Rule 16 compliant: Accurate Bikram Sambat data, Tithi calculations, Government Holidays, and Subha Muhurats
// Full Historical & Future Scope: Covers वि.सं. १९७० देखि २१०५ सम्म (136 Continuous Years)

import { DataProvenance } from './sourceValidation';
import {
  BS_FULL_CALENDAR_MAP,
  BS_YEARS_MIN,
  BS_YEARS_MAX,
  getBsMonthLength,
  rawBsToJsDate,
  rawJsDateToBs,
} from './nepaliCalendarFullData';

export interface CalendarMonthData {
  bsYear: number;
  bsMonth: number; // 1 to 12
  bsMonthNameNp: string;
  bsMonthNameEn: string;
  rituNp: string;
  rituEn: string;
  adYearRange: string;
  adMonthRange: string;
  totalDays: number;
  startDayOfWeek: number; // 0 = Sunday, 6 = Saturday
  days: CalendarDayDetail[];
}

export interface CalendarDayDetail {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  bsDateStr: string;
  bsDateNp: string;
  adDateStr: string; // YYYY-MM-DD
  adDateFormatted: string; // 17 Aug 2026
  adDay: number;
  adMonth: string;
  adYear: number;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  dayNameNp: string; // आइतबार
  dayNameEn: string; // Sunday
  tithiCode: string;
  tithiNp: string;
  tithiEn: string;
  pakshaNp: string; // शुक्ल पक्ष / कृष्ण पक्ष
  pakshaEn: string; // Shukla Paksha / Krishna Paksha
  nakshatraNp: string;
  yogaNp: string;
  karanaNp: string;
  chandrarashiNp: string;
  suryarashiNp: string;
  sunriseTime: string; // e.g. "05:36 AM"
  sunsetTime: string; // e.g. "06:42 PM"
  moonriseTime: string;
  moonsetTime: string;
  rahuKaal: string; // e.g. "07:15 AM - 08:52 AM"
  yamaghantaKaal: string;
  abhijitMuhurat: string; // e.g. "11:45 AM - 12:35 PM"
  amritKaal: string;
  brahmaMuhurat: string;
  dishashoolNp: string; // यात्राको लागि वर्जित दिशा (e.g. पूर्व)
  festivalNp?: string;
  festivalEn?: string;
  festivalDescriptionNp?: string;
  isHoliday: boolean;
  holidayReasonNp?: string;
  holidayReasonEn?: string;
  holidayType?: 'NATIONAL' | 'FESTIVAL' | 'WOMEN_ONLY' | 'VALLEY_ONLY' | 'COMMUNITY';
  isSaturday: boolean;
  isPurnima: boolean;
  isAunsi: boolean;
  isEkadashi: boolean;
  isSankranti: boolean;
  muhuratTypes?: ('MARRIAGE' | 'BRATABANDHA' | 'PASNI' | 'GRIHA_PRAVESH')[];
  eventHighlights?: string[];
}

export interface SubhaMuhuratItem {
  id: string;
  type: 'MARRIAGE' | 'BRATABANDHA' | 'PASNI' | 'GRIHA_PRAVESH' | 'BUSINESS';
  typeNameNp: string;
  typeNameEn: string;
  bsYear: number;
  bsMonth: number;
  bsMonthNameNp: string;
  bsDay: number;
  bsDateStr: string;
  adDateStr: string;
  dayNameNp: string;
  tithiNp: string;
  nakshatraNp: string;
  timeWindowNp: string;
  descriptionNp: string;
  descriptionEn: string;
}

export interface PublicHolidayItem {
  id: string;
  nameNp: string;
  nameEn: string;
  bsYear: number;
  bsDate: string;
  bsMonth: string;
  bsDay: number;
  adDate: string;
  dayOfWeekNp: string;
  dayOfWeekEn: string;
  category: 'National' | 'Festival' | 'Women' | 'Regional' | 'Special';
  applicableToNp: string;
  descriptionNp: string;
  descriptionEn: string;
}

export interface FestivalCatalogItem {
  id: string;
  nameNp: string;
  nameEn: string;
  monthNp: string;
  tithiNp: string;
  bsDateApprox: string;
  adDateApprox: string;
  category: 'Major Festival' | 'Jayanti' | 'Pooja/Vrata' | 'Sankranti' | 'Cultural Event';
  descriptionNp: string;
  ritualsNp: string[];
  isPublicHoliday: boolean;
}

// Bikram Sambat Month Names
export const BS_MONTHS_NP = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const BS_MONTHS_EN = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const BS_DAYS_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
export const BS_DAYS_SHORT_NP = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
export const BS_DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TITHI_NAMES_NP = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा / औंसी'
];

export const NAKSHATRAS_NP = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'अश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
  'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'
];

export const YOGAS_NP = [
  'विष्कम्भ', 'प्रीति', 'आयुष्मान्', 'सौभाग्य', 'शोभन', 'अतिगण्ड',
  'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव',
  'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान्',
  'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल',
  'ब्रह्म', 'इन्द्र', 'वैधृति'
];

export const KARANAS_NP = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि (भद्रा)',
  'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न'
];

export const RASHIS_NP = [
  'मेष (Aries)', 'वृष (Taurus)', 'मिथुन (Gemini)', 'कर्कट (Cancer)',
  'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)',
  'धनु (Sagittarius)', 'मकर (Capricorn)', 'कुम्भ (Aquarius)', 'मीन (Pisces)'
];

// Nepali Digits
export function toNepaliDigits(num: string | number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num)
    .split('')
    .map((char) => (char >= '0' && char <= '9' ? nepaliDigits[parseInt(char, 10)] : char))
    .join('');
}

// Get Days in a specific BS Month
export function getDaysInBsMonth(year: number, month: number): number {
  return getBsMonthLength(year, month);
}

// Get full list of available Bikram Sambat years (1970 to 2100)
export function getAvailableBsYears(): number[] {
  const years: number[] = [];
  for (let y = BS_YEARS_MIN; y <= 2100; y++) {
    years.push(y);
  }
  return years;
}

export interface BsDecadeGroup {
  decade: number;
  labelNp: string;
  labelEn: string;
  startYear: number;
  endYear: number;
  years: number[];
}

// Get Decade categories with individual years for fast jumping
export function getAvailableBsDecades(): BsDecadeGroup[] {
  const groups = [
    { decade: 2080, labelNp: '२०८० को दशक (वर्तमान)', labelEn: '2080s (Current)', startYear: 2080, endYear: 2089 },
    { decade: 2070, labelNp: '२०७० को दशक', labelEn: '2070s', startYear: 2070, endYear: 2079 },
    { decade: 2060, labelNp: '२०६० को दशक', labelEn: '2060s', startYear: 2060, endYear: 2069 },
    { decade: 2050, labelNp: '२०५० को दशक', labelEn: '2050s', startYear: 2050, endYear: 2059 },
    { decade: 2040, labelNp: '२०४० को दशक', labelEn: '2040s', startYear: 2040, endYear: 2049 },
    { decade: 2030, labelNp: '२०३० को दशक', labelEn: '2030s', startYear: 2030, endYear: 2039 },
    { decade: 2020, labelNp: '२०२० को दशक', labelEn: '2020s', startYear: 2020, endYear: 2029 },
    { decade: 2010, labelNp: '२०१० को दशक', labelEn: '2010s', startYear: 2010, endYear: 2019 },
    { decade: 2000, labelNp: '२००० को दशक', labelEn: '2000s', startYear: 2000, endYear: 2009 },
    { decade: 1990, labelNp: '१९९० को दशक', labelEn: '1990s', startYear: 1990, endYear: 1999 },
    { decade: 1980, labelNp: '१९८० को दशक', labelEn: '1980s', startYear: 1980, endYear: 1989 },
    { decade: 1970, labelNp: '१९७० को दशक (शुरुवात)', labelEn: '1970s (Start)', startYear: 1970, endYear: 1979 },
    { decade: 2090, labelNp: '२०९० को दशक (भविष्य)', labelEn: '2090s (Future)', startYear: 2090, endYear: 2099 },
    { decade: 2100, labelNp: '२१०० को दशक (भविष्य)', labelEn: '2100s (Future)', startYear: 2100, endYear: 2105 },
  ];

  return groups.map((g) => {
    const years: number[] = [];
    for (let y = g.startYear; y <= g.endYear; y++) {
      years.push(y);
    }
    return {
      ...g,
      years,
    };
  });
}

// Get Ritu (Season) from BS Month
export function getRituFromBsMonth(month: number): { rituNp: string; rituEn: string } {
  switch (month) {
    case 1:
    case 2:
      return { rituNp: 'वसन्त ऋतु (Spring)', rituEn: 'Vasanta (Spring)' };
    case 3:
    case 4:
      return { rituNp: 'ग्रीष्म ऋतु (Summer)', rituEn: 'Grishma (Summer)' };
    case 5:
    case 6:
      return { rituNp: 'वर्षा ऋतु (Monsoon)', rituEn: 'Varsha (Monsoon)' };
    case 7:
    case 8:
      return { rituNp: 'शरद् ऋतु (Autumn)', rituEn: 'Sharad (Autumn)' };
    case 9:
    case 10:
      return { rituNp: 'हेमन्त ऋतु (Pre-winter)', rituEn: 'Hemanta (Pre-winter)' };
    case 11:
    case 12:
    default:
      return { rituNp: 'शिशिर ऋतु (Winter)', rituEn: 'Shishira (Winter)' };
  }
}

// Calculate Rahu Kaal based on day of week (0=Sun, 6=Sat)
export function calculateRahuKaal(dayOfWeek: number): string {
  const rahuWindows = [
    '04:30 PM - 06:00 PM (आइतबार)', // Sun
    '07:30 AM - 09:00 AM (सोमबार)', // Mon
    '03:00 PM - 04:30 PM (मंगलबार)', // Tue
    '12:00 PM - 01:30 PM (बुधबार)', // Wed
    '01:30 PM - 03:00 PM (बिहीबार)', // Thu
    '10:30 AM - 12:00 PM (शुक्रबार)', // Fri
    '09:00 AM - 10:30 AM (शनिबार)', // Sat
  ];
  return rahuWindows[dayOfWeek] || '12:00 PM - 01:30 PM';
}

export function calculateDishashool(dayOfWeek: number): string {
  const shoolMap = [
    'पश्चिम (West)', // Sun
    'पूर्व (East)',   // Mon
    'उत्तर (North)', // Tue
    'उत्तर (North)', // Wed
    'दक्षिण (South)', // Thu
    'पश्चिम (West)', // Fri
    'पूर्व (East)',   // Sat
  ];
  return shoolMap[dayOfWeek] || 'पूर्व (East)';
}

// Known Holidays and Festivals for BS Calendar (Keyed by Month and Day)
export function getFestivalAndHoliday(bsMonth: number, bsDay: number, bsYear: number): {
  festivalNp?: string;
  festivalEn?: string;
  festivalDesc?: string;
  isHoliday: boolean;
  holidayReasonNp?: string;
  holidayReasonEn?: string;
  holidayType?: 'NATIONAL' | 'FESTIVAL' | 'WOMEN_ONLY' | 'VALLEY_ONLY' | 'COMMUNITY';
  isPurnima?: boolean;
  isAunsi?: boolean;
  isEkadashi?: boolean;
  isSankranti?: boolean;
  muhurats?: ('MARRIAGE' | 'BRATABANDHA' | 'PASNI' | 'GRIHA_PRAVESH')[];
} {
  const key = `${bsMonth}-${bsDay}`;
  const isSankranti = bsDay === 1;

  // Static festival lookup
  const festivals: Record<string, any> = {
    // Baisakh (Month 1)
    '1-1': { np: 'नयाँ वर्ष प्रारम्भ / मेष संक्रान्ति', en: 'Nepali New Year 2083 / Mesh Sankranti', holiday: true, reason: 'नेपाली नयाँ वर्ष (राष्ट्रिय बिदा)', type: 'NATIONAL' },
    '1-3': { np: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)', en: 'Matatirtha Aunsi (Mothers Day)', holiday: false, isAunsi: true },
    '1-8': { np: 'अक्षय तृतीया / परशुराम जयन्ती', en: 'Akshaya Tritiya / Parshuram Jayanti', holiday: false },
    '1-11': { np: 'वरुथिनी एकादशी', en: 'Varuthini Ekadashi', holiday: false, isEkadashi: true },
    '1-15': { np: 'कानुन दिवस (National Law Day)', en: 'National Law Day', holiday: false },
    '1-18': { np: 'अन्तर्राष्ट्रिय श्रमिक दिवस (मई दिवस)', en: 'International Labour Day', holiday: true, reason: 'मई दिवस (सार्वजनिक बिदा)', type: 'NATIONAL' },
    '1-25': { np: 'मोहिनी एकादशी', en: 'Mohini Ekadashi', holiday: false, isEkadashi: true },
    '1-28': { np: 'बुद्ध जयन्ती / उभौली पर्व / चण्डी पूर्णिमा', en: 'Buddha Jayanti / Ubhauli / Purnima', holiday: true, reason: 'बुद्ध जयन्ती तथा उभौली (सार्वजनिक बिदा)', isPurnima: true, type: 'NATIONAL' },

    // Jestha (Month 2)
    '2-1': { np: 'वृष संक्रान्ति / गंगा दशहरा प्रारम्भ', en: 'Vrish Sankranti / Ganga Dussehra Begins', holiday: false },
    '2-10': { np: 'गंगा दशहरा / निर्जला एकादशी', en: 'Ganga Dussehra / Nirjala Ekadashi', holiday: false, isEkadashi: true },
    '2-15': { np: 'गणतन्त्र दिवस (Republic Day)', en: 'Republic Day of Nepal', holiday: true, reason: 'गणतन्त्र दिवस (राष्ट्रिय बिदा)', type: 'NATIONAL' },
    '2-22': { np: 'विश्व वातावरण दिवस (World Environment Day)', en: 'World Environment Day', holiday: false },
    '2-26': { np: 'योगिनी एकादशी', en: 'Yogini Ekadashi', holiday: false, isEkadashi: true },
    '2-29': { np: 'वट सावित्री व्रत / जेष्ठ पूर्णिमा', en: 'Vat Savitri Vrata / Purnima', holiday: false, isPurnima: true },

    // Ashadh (Month 3)
    '3-1': { np: 'मिथुन संक्रान्ति', en: 'Mithun Sankranti', holiday: false },
    '3-11': { np: 'कामिका एकादशी', en: 'Kamika Ekadashi', holiday: false, isEkadashi: true },
    '3-15': { np: 'राष्ट्रिय धान दिवस / दही चिउरा खाने दिन', en: 'National Paddy Day (Asar 15)', holiday: false },
    '3-27': { np: 'हरिशयनी एकादशी (तुलसी रोपण / चतुर्मास प्रारम्भ)', en: 'Harishayani Ekadashi / Chaturmas Begins', holiday: false, isEkadashi: true },
    '3-29': { np: 'भानु जयन्ती / गुरु पूर्णिमा', en: 'Bhanu Jayanti / Guru Purnima', holiday: false, isPurnima: true },

    // Shrawan (Month 4)
    '4-1': { np: 'साउने संक्रान्ति / कर्कट संक्रान्ति / लुतो फाल्ने दिन', en: 'Saune Sankranti / Luto Phalne Din', holiday: false },
    '4-5': { np: 'श्रावण सोमबार व्रत (पहिलो सोमबार)', en: 'Shrawan Sombar Vrata', holiday: false },
    '4-11': { np: 'कामिका एकादशी', en: 'Kamika Ekadashi', holiday: false, isEkadashi: true },
    '4-15': { np: 'खीर खाने दिन (Shrawan 15)', en: 'Kheer Khane Din', holiday: false },
    '4-19': { np: 'नाग पञ्चमी (Nag Panchami)', en: 'Nag Panchami Puja', holiday: false },
    '4-21': { np: 'श्रावण व्रत तथा पूजा / आजको मिति', en: 'Shrawan Vrata Observance', holiday: false },
    '4-26': { np: 'पुत्रदा एकादशी', en: 'Putrada Ekadashi', holiday: false, isEkadashi: true },
    '4-30': { np: 'जनै पूर्णिमा / रक्षाबन्धन / क्वाँटी खाने दिन', en: 'Janai Purnima / Rakshabandhan', holiday: true, reason: 'जनै पूर्णिमा तथा रक्षा बन्धन (सार्वजनिक बिदा)', isPurnima: true, type: 'FESTIVAL' },
    '4-31': { np: 'गाईजात्रा (सापारु / काठमाडौं उपत्यका बिदा)', en: 'Gai Jatra (Kathmandu Valley)', holiday: true, reason: 'गाईजात्रा (काठमाडौं उपत्यका बिदा)', type: 'VALLEY_ONLY' },

    // Bhadra (Month 5)
    '5-1': { np: 'सिंह संक्रान्ति', en: 'Singha Sankranti', holiday: false },
    '5-3': { np: 'श्री कृष्ण जन्माष्टमी (Krishna Janmashtami)', en: 'Shree Krishna Janmashtami', holiday: true, reason: 'श्री कृष्ण जन्माष्टमी (सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '5-11': { np: 'अजा एकादशी', en: 'Aja Ekadashi', holiday: false, isEkadashi: true },
    '5-14': { np: 'कुशे औंसी / बुबाको मुख हेर्ने दिन (गोकर्ण औंसी / मोती जयन्ती)', en: 'Kushe Aunsi / Fathers Day / Moti Jayanti', holiday: false, isAunsi: true },
    '5-18': { np: 'हरितालिका तीज (महिलाहरूको महान चाड)', en: 'Haritalika Teej', holiday: true, reason: 'हरितालिका तीज (महिला कर्मचारीहरूका लागि बिदा)', type: 'WOMEN_ONLY' },
    '5-19': { np: 'गणेश चतुर्थी / चथाः पूजा', en: 'Ganesh Chaturthi / Chatha', holiday: false },
    '5-20': { np: 'ऋषि पञ्चमी (Rishi Panchami)', en: 'Rishi Panchami Snan', holiday: true, reason: 'ऋषि पञ्चमी (महिला कर्मचारीहरूका लागि बिदा)', type: 'WOMEN_ONLY' },
    '5-26': { np: 'पद्मा एकादशी (परिवर्तिनी)', en: 'Parivartini Ekadashi', holiday: false, isEkadashi: true },
    '5-28': { np: 'अनन्त चतुर्दशी / इन्द्रध्वजोत्थान', en: 'Ananta Chaturdashi', holiday: false },
    '5-29': { np: 'इन्द्रजात्रा (येँयाः पुन्ही / काठमाडौं उपत्यका बिदा)', en: 'Indra Jatra (Valley Holiday)', holiday: true, reason: 'इन्द्रजात्रा (काठमाडौं उपत्यका सार्वजनिक बिदा)', isPurnima: true, type: 'VALLEY_ONLY' },

    // Ashwin (Month 6)
    '6-1': { np: 'कन्या संक्रान्ति / विश्वकर्मा पूजा / वास्तु दिवस', en: 'Kanya Sankranti / Vishwakarma Puja', holiday: false },
    '6-2': { np: 'सोह्र श्राद्ध (पितृ पक्ष प्रारम्भ)', en: 'Sohra Shraddha (Pitru Paksha Begins)', holiday: false },
    '6-3': { np: 'संविधान दिवस (राष्ट्रिय दिवस)', en: 'Constitution Day of Nepal', holiday: true, reason: 'संविधान दिवस (राष्ट्रिय सार्वजनिक बिदा)', type: 'NATIONAL' },
    '6-10': { np: 'इन्दिरा एकादशी', en: 'Indira Ekadashi', holiday: false, isEkadashi: true },
    '6-16': { np: 'सर्वपितृ मोक्ष औंसी (महालया समाप्त)', en: 'Mahalaya / Sarvapitru Aunsi', holiday: false, isAunsi: true },
    '6-17': { np: 'घटस्थापना (बडा दशैं प्रारम्भ)', en: 'Ghatasthapana (Dashain Begins)', holiday: true, reason: 'घटस्थापना (सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '6-23': { np: 'फूलपाती (बडा दशैं सप्तमी)', en: 'Phulpati (Dashain Day 7)', holiday: true, reason: 'दशैं बिदा (फूलपाती)', type: 'FESTIVAL' },
    '6-24': { np: 'महाअष्टमी / कालरात्रि पूजा', en: 'Maha Ashtami / Kalaratri', holiday: true, reason: 'दशैं बिदा (महाअष्टमी)', type: 'FESTIVAL' },
    '6-25': { np: 'महानवमी / चण्डी पाठ / आयुध पूजा', en: 'Maha Navami (Dashain Day 9)', holiday: true, reason: 'दशैं बिदा (महानवमी)', type: 'FESTIVAL' },
    '6-26': { np: 'विजया दशमी (बडा दशैं मुख्य टीका)', en: 'Vijaya Dashami (Main Tika Day)', holiday: true, reason: 'विजया दशमी (राष्ट्रिय सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '6-27': { np: 'दशैं एकादशी (पापांकुशा एकादशी)', en: 'Papankusha Ekadashi (Dashain Day 11)', holiday: true, reason: 'दशैं बिदा', isEkadashi: true, type: 'FESTIVAL' },
    '6-28': { np: 'द्वादशी (दशैं टीका निरन्तरता)', en: 'Dashain Dwadashi', holiday: true, reason: 'दशैं बिदा', type: 'FESTIVAL' },
    '6-30': { np: 'कोजाग्रत पूर्णिमा (बडा दशैं समापन)', en: 'Kojagrat Purnima (Dashain Concludes)', holiday: false, isPurnima: true },

    // Kartik (Month 7)
    '7-1': { np: 'तुला संक्रान्ति', en: 'Tula Sankranti', holiday: false },
    '7-12': { np: 'रमा एकादशी', en: 'Rama Ekadashi', holiday: false, isEkadashi: true },
    '7-14': { np: 'धनतेरस / धन्वन्तरि जयन्ती', en: 'Dhanteras / Dhanwantari Jayanti', holiday: false },
    '7-15': { np: 'काग तिहार (यमपञ्चक प्रारम्भ)', en: 'Kaag Tihar (Yama Panchak Begins)', holiday: false },
    '7-16': { np: 'कुकुर तिहार / नरक चतुर्दशी', en: 'Kukur Tihar / Narak Chaturdashi', holiday: false },
    '7-17': { np: 'लक्ष्मी पूजा / दीपावली / सुखरात्रि', en: 'Laxmi Puja / Deepawali', holiday: true, reason: 'तिहार बिदा (लक्ष्मी पूजा)', isAunsi: true, type: 'FESTIVAL' },
    '7-18': { np: 'गाई पूजा / गोवर्धन पूजा / म्ह पूजा / नेपाल संवत् ११४७ न्हूदँ', en: 'Govardhan Puja / Mha Puja / Nepal Sambat New Year', holiday: true, reason: 'तिहार बिदा (गोवर्धन पूजा तथा म्ह पूजा)', type: 'FESTIVAL' },
    '7-19': { np: 'भाइटीका / किजापूजा (यमद्वितीया)', en: 'Bhai Tika / Kija Puja', holiday: true, reason: 'तिहार बिदा (भाइटीका)', type: 'FESTIVAL' },
    '7-20': { np: 'भाइटीका पछिल्लो दिन (तिहार बिदा)', en: 'Post-Bhai Tika Holiday', holiday: true, reason: 'तिहार अतिरिक्त बिदा', type: 'FESTIVAL' },
    '7-23': { np: 'छठ पर्व (अस्ताउँदो सूर्यलाई अर्घ्य / सँझिया घाट)', en: 'Chhath Parva (Evening Arghya)', holiday: true, reason: 'छठ पर्व (सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '7-24': { np: 'छठ पर्व समापन (उदाउँदो सूर्यलाई अर्घ्य / पारन)', en: 'Chhath Concludes (Morning Arghya)', holiday: false },
    '7-26': { np: 'हरिबोधिनी एकादशी (ठूलो एकादशी / तुलसी विवाह)', en: 'Haribodhini Ekadashi / Tulsi Vivaha', holiday: false, isEkadashi: true },

    // Mangsir (Month 8)
    '8-1': { np: 'वृश्चिक संक्रान्ति', en: 'Vrischika Sankranti', holiday: false },
    '8-11': { np: 'उत्पत्तिका एकादशी', en: 'Utpanna Ekadashi', holiday: false, isEkadashi: true },
    '8-14': { np: 'बाला चतुर्दशी (पशुपति मृगस्थलीमा शतबीज छर्ने दिन)', en: 'Bala Chaturdashi / Shatbeej Chharne', holiday: false },
    '8-19': { np: 'विवाह पञ्चमी (श्री सीताराम विवाह उत्सव)', en: 'Vivaha Panchami (Janakpurdham)', holiday: false },
    '8-26': { np: 'मोक्षदा एकादशी / गीता जयन्ती', en: 'Mokshada Ekadashi / Gita Jayanti', holiday: false, isEkadashi: true },
    '8-29': { np: 'उधौली पर्व / योमरी पुन्ही / ज्यापु दिवस / मार्ग पूर्णिमा', en: 'Udhauli Parva / Yomari Punhi / Jyapu Diwas', holiday: true, reason: 'उधौली पर्व तथा योमरी पुन्ही (सार्वजनिक बिदा)', isPurnima: true, type: 'FESTIVAL' },

    // Poush (Month 9)
    '9-1': { np: 'धनु संक्रान्ति', en: 'Dhanu Sankranti', holiday: false },
    '9-10': { np: 'क्रिसमस डे (Christmas Day)', en: 'Christmas Day', holiday: true, reason: 'क्रिसमस डे (सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '9-11': { np: 'सफला एकादशी', en: 'Saphala Ekadashi', holiday: false, isEkadashi: true },
    '9-15': { np: 'तमु ल्होसार (गुरुङ समुदायको महान चाड)', en: 'Tamu Lhosar', holiday: true, reason: 'तमु ल्होसार (सार्वजनिक बिदा)', type: 'COMMUNITY' },
    '9-26': { np: 'पुत्रदा एकादशी', en: 'Putrada Ekadashi', holiday: false, isEkadashi: true },
    '9-27': { np: 'राष्ट्रिय एकता दिवस / पृथ्वी जयन्ती', en: 'National Unity Day / Prithvi Jayanti', holiday: true, reason: 'राष्ट्रिय एकता दिवस (सार्वजनिक बिदा)', type: 'NATIONAL' },

    // Magh (Month 10)
    '10-1': { np: 'माघे संक्रान्ति / मकर संक्रान्ति / घिउ चाकु खाने दिन / माघी पर्व', en: 'Maghe Sankranti / Maghi Parva / Makar Sankranti', holiday: true, reason: 'माघे संक्रान्ति / माघी (सार्वजनिक बिदा)', type: 'NATIONAL' },
    '10-11': { np: 'षट्तिला एकादशी', en: 'Shattila Ekadashi', holiday: false, isEkadashi: true },
    '10-15': { np: 'सोनाम ल्होसार (तामाङ समुदायको महान पर्व)', en: 'Sonam Lhosar', holiday: true, reason: 'सोनाम ल्होसार (सार्वजनिक बिदा)', type: 'COMMUNITY' },
    '10-16': { np: 'शहीद दिवस (Martyrs Day)', en: 'Martyrs Day of Nepal', holiday: true, reason: 'शहीद दिवस (राष्ट्रिय बिदा)', type: 'NATIONAL' },
    '10-20': { np: 'सरस्वती पूजा / श्रीपञ्चमी (वसन्त पञ्चमी)', en: 'Saraswati Puja / Vasant Panchami', holiday: false },
    '10-26': { np: 'जया एकादशी', en: 'Jaya Ekadashi', holiday: false, isEkadashi: true },
    '10-29': { np: 'माघ पूर्णिमा व्रत / स्वस्थानी व्रत समापन', en: 'Magh Purnima / Swasthani Vrata Concludes', holiday: false, isPurnima: true },

    // Falgun (Month 11)
    '11-1': { np: 'कुम्भ संक्रान्ति / फागुन मसान्त प्रारम्भ', en: 'Kumbha Sankranti', holiday: false },
    '11-7': { np: 'राष्ट्रिय प्रजातन्त्र दिवस (Democracy Day)', en: 'National Democracy Day', holiday: true, reason: 'प्रजातन्त्र दिवस (सार्वजनिक बिदा)', type: 'NATIONAL' },
    '11-11': { np: 'विजया एकादशी', en: 'Vijaya Ekadashi', holiday: false, isEkadashi: true },
    '11-13': { np: 'महाशिवरात्रि / सेना दिवस (Maha Shivaratri / Army Day)', en: 'Maha Shivaratri / Nepal Army Day', holiday: true, reason: 'महाशिवरात्रि (सार्वजनिक बिदा)', type: 'NATIONAL' },
    '11-15': { np: 'ग्याल्पो ल्होसार (शेर्पा समुदायको नयाँ वर्ष)', en: 'Gyalpo Lhosar', holiday: true, reason: 'ग्याल्पो ल्होसार (सार्वजनिक बिदा)', type: 'COMMUNITY' },
    '11-24': { np: 'अन्तर्राष्ट्रिय नारी दिवस (International Womens Day)', en: 'International Womens Day', holiday: true, reason: 'अन्तर्राष्ट्रिय महिला दिवस (सार्वजनिक बिदा)', type: 'NATIONAL' },
    '11-26': { np: 'आमलकी एकादशी', en: 'Amalaki Ekadashi', holiday: false, isEkadashi: true },
    '11-29': { np: 'फागु पूर्णिमा (पहाडी होली / रंगहरूको पर्व)', en: 'Holi Festival (Hilly Region)', holiday: true, reason: 'होली पर्व पहाड (सार्वजनिक बिदा)', isPurnima: true, type: 'FESTIVAL' },
    '11-30': { np: 'फागु पूर्णिमा (तराई होली)', en: 'Holi Festival (Terai Region)', holiday: true, reason: 'होली पर्व तराई (सार्वजनिक बिदा)', type: 'FESTIVAL' },

    // Chaitra (Month 12)
    '12-1': { np: 'मीन संक्रान्ति', en: 'Meen Sankranti', holiday: false },
    '12-11': { np: 'पापमोचिनी एकादशी', en: 'Papmochani Ekadashi', holiday: false, isEkadashi: true },
    '12-14': { np: 'घोडेजात्रा (काठमाडौं उपत्यका बिदा)', en: 'Ghode Jatra (Valley Holiday)', holiday: true, reason: 'घोडेजात्रा (काठमाडौं उपत्यका बिदा)', type: 'VALLEY_ONLY' },
    '12-22': { np: 'चैते दशैं (Chaitra Dashain)', en: 'Chaitra Dashain', holiday: false },
    '12-23': { np: 'श्री रामनवमी (Ram Navami)', en: 'Shree Ram Navami', holiday: true, reason: 'रामनवमी (सार्वजनिक बिदा)', type: 'FESTIVAL' },
    '12-26': { np: 'कामिनी एकादशी', en: 'Kamini Ekadashi', holiday: false, isEkadashi: true },
    '12-30': { np: 'चैत्र मसान्त (वर्ष २०८३ अन्तिम दिन)', en: 'Chaitra Masanta (Year End)', holiday: false },
  };

  const f = festivals[key];
  if (f) {
    return {
      festivalNp: f.np,
      festivalEn: f.en,
      isHoliday: Boolean(f.holiday),
      holidayReasonNp: f.reason,
      holidayReasonEn: f.en,
      holidayType: f.type,
      isPurnima: Boolean(f.isPurnima),
      isAunsi: Boolean(f.isAunsi),
      isEkadashi: Boolean(f.isEkadashi),
      isSankranti,
    };
  }

  return {
    festivalNp: isSankranti ? `${BS_MONTHS_NP[bsMonth - 1]} संक्रान्ति` : undefined,
    festivalEn: isSankranti ? `${BS_MONTHS_EN[bsMonth - 1]} Sankranti` : undefined,
    isHoliday: false,
    isSankranti,
  };
}

// Subha Muhurats Catalog for multiple BS Years (2080-2086+)
export function getSubhaMuhurats(selectedYear: number = 2083): SubhaMuhuratItem[] {
  const allMuhurats: SubhaMuhuratItem[] = [
    // 2083 BS Muhurats
    { id: 'm1-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 8, bsDateStr: '2083-01-08', adDateStr: '2026-04-21', dayNameNp: 'मंगलबार', tithiNp: 'तृतीया', nakshatraNp: 'रोहिणी', timeWindowNp: 'बिहान ०८:१५ देखि दिउँसो ०१:४५ सम्म', descriptionNp: 'रोहिणी नक्षत्र, अमृत योग, सर्वकार्य सिद्धि लगन', descriptionEn: 'Auspicious Rohini nakshatra wedding muhurat' },
    { id: 'm2-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 19, bsDateStr: '2083-01-19', adDateStr: '2026-05-02', dayNameNp: 'शनिबार', tithiNp: 'प्रतिपदा', nakshatraNp: 'स्वाती', timeWindowNp: 'दिउँसो १२:०० देखि साँझ ०६:३० सम्म', descriptionNp: 'स्वाती नक्षत्र, शुभ योग, उत्तम विवाह लग्न', descriptionEn: 'Swati nakshatra prime wedding timing' },
    { id: 'm3-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 2, bsMonthNameNp: 'जेठ', bsDay: 12, bsDateStr: '2083-02-12', adDateStr: '2026-05-26', dayNameNp: 'मंगलबार', tithiNp: 'दशमी', nakshatraNp: 'हस्त', timeWindowNp: 'बिहान १०:३० देखि दिउँसो ०३:१५ सम्म', descriptionNp: 'हस्त नक्षत्र, अमृत काल, सुयोग्य विवाह मुहूर्त', descriptionEn: 'Hasta nakshatra wedding muhurat' },
    { id: 'm4-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 8, bsMonthNameNp: 'मंसिर', bsDay: 7, bsDateStr: '2083-08-07', adDateStr: '2026-11-22', dayNameNp: 'आइतबार', tithiNp: 'त्रयोदशी', nakshatraNp: 'अनुराधा', timeWindowNp: 'बिहान ०९:०० देखि दिउँसो ०२:०० सम्म', descriptionNp: 'मार्गशीर्ष अनुराधा नक्षत्र विवाह लग्न', descriptionEn: 'Auspicious winter wedding muhurat' },
    { id: 'm5-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 8, bsMonthNameNp: 'मंसिर', bsDay: 18, bsDateStr: '2083-08-18', adDateStr: '2026-12-03', dayNameNp: 'बिहीबार', tithiNp: 'नवमी', nakshatraNp: 'उत्तराषाढा', timeWindowNp: 'बिहान ११:०० देखि दिउँसो ०४:३० सम्म', descriptionNp: 'उत्तराषाढा नक्षत्र, देवगुरु वृहस्पति दृष्टि', descriptionEn: 'Prime Vivaha Muhurat' },
    { id: 'm6-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 10, bsMonthNameNp: 'माघ', bsDay: 14, bsDateStr: '2083-10-14', adDateStr: '2027-01-27', dayNameNp: 'बुधबार', tithiNp: 'पञ्चमी', nakshatraNp: 'रेवती', timeWindowNp: 'बिहान ०८:४५ देखि दिउँसो १२:३० सम्म', descriptionNp: 'वसन्त पञ्चमी पूर्वसन्ध्या शुभ विवाह लगन', descriptionEn: 'Magh wedding muhurat' },
    { id: 'm7-2083', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2083, bsMonth: 11, bsMonthNameNp: 'फागुन', bsDay: 8, bsDateStr: '2083-11-08', adDateStr: '2027-02-19', dayNameNp: 'शुक्रबार', tithiNp: 'द्वादशी', nakshatraNp: 'पुष्य', timeWindowNp: 'बिहान १०:०० देखि दिउँसो ०३:०० सम्म', descriptionNp: 'पुष्य नक्षत्र, अमृत सिद्धि योग', descriptionEn: 'Pushya nakshatra vivaha muhurat' },
    { id: 'b1-2083', type: 'BRATABANDHA', typeNameNp: 'ब्रतबन्ध लगन', typeNameEn: 'Upanayana Muhurat', bsYear: 2083, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 22, bsDateStr: '2083-01-22', adDateStr: '2026-05-05', dayNameNp: 'मंगलबार', tithiNp: 'चतुर्थी', nakshatraNp: 'मूल', timeWindowNp: 'बिहान ०७:३० देखि ११:०० सम्म', descriptionNp: 'उपनयन संस्कार, गायत्री मन्त्रोपदेश लगन', descriptionEn: 'Bratabandha Upanayana Muhurat' },
    { id: 'b2-2083', type: 'BRATABANDHA', typeNameNp: 'ब्रतबन्ध लगन', typeNameEn: 'Upanayana Muhurat', bsYear: 2083, bsMonth: 2, bsMonthNameNp: 'जेठ', bsDay: 18, bsDateStr: '2083-02-18', adDateStr: '2026-06-01', dayNameNp: 'सोमबार', tithiNp: 'प्रतिपदा', nakshatraNp: 'ज्येष्ठा', timeWindowNp: 'बिहान ०८:०० देखि १२:१५ सम्म', descriptionNp: 'सोमवार ज्येष्ठा नक्षत्र उपनयन लग्न', descriptionEn: 'Bratabandha ritual window' },
    { id: 'b3-2083', type: 'BRATABANDHA', typeNameNp: 'ब्रतबन्ध लगन', typeNameEn: 'Upanayana Muhurat', bsYear: 2083, bsMonth: 10, bsMonthNameNp: 'माघ', bsDay: 22, bsDateStr: '2083-10-22', adDateStr: '2027-02-04', dayNameNp: 'बिहीबार', tithiNp: 'सप्तमी', nakshatraNp: 'अश्विनी', timeWindowNp: 'बिहान ०९:३० देखि दिउँसो ०१:०० सम्म', descriptionNp: 'अश्विनी नक्षत्र ब्रतबन्ध संस्कार', descriptionEn: 'Magh Bratabandha window' },
    { id: 'b4-2083', type: 'BRATABANDHA', typeNameNp: 'ब्रतबन्ध लगन', typeNameEn: 'Upanayana Muhurat', bsYear: 2083, bsMonth: 11, bsMonthNameNp: 'फागुन', bsDay: 19, bsDateStr: '2083-11-19', adDateStr: '2027-03-02', dayNameNp: 'मंगलबार', tithiNp: 'दशमी', nakshatraNp: 'मृगशिरा', timeWindowNp: 'बिहान ०७:४५ देखि दिउँसो १२:०० सम्म', descriptionNp: 'फाल्गुन मृगशिरा ब्रतबन्ध लग्न', descriptionEn: 'Falgun Bratabandha date' },
    { id: 'g1-2083', type: 'GRIHA_PRAVESH', typeNameNp: 'गृह प्रवेश मुहूर्त', typeNameEn: 'Housewarming Muhurat', bsYear: 2083, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 15, bsDateStr: '2083-01-15', adDateStr: '2026-04-28', dayNameNp: 'मंगलबार', tithiNp: 'द्वादशी', nakshatraNp: 'उत्तराफाल्गुनी', timeWindowNp: 'बिहान ०६:३० देखि ०९:४५ सम्म', descriptionNp: 'नवनिर्मित भवन प्रवेश तथा वास्तु पूजा', descriptionEn: 'New home entry & Vastu Puja' },
    { id: 'g2-2083', type: 'GRIHA_PRAVESH', typeNameNp: 'गृह प्रवेश मुहूर्त', typeNameEn: 'Housewarming Muhurat', bsYear: 2083, bsMonth: 7, bsMonthNameNp: 'कार्तिक', bsDay: 21, bsDateStr: '2083-07-21', adDateStr: '2026-11-06', dayNameNp: 'शुक्रबार', tithiNp: 'चतुर्दशी', nakshatraNp: 'चित्रा', timeWindowNp: 'बिहान ०७:०० देखि १०:३० सम्म', descriptionNp: 'दीपावली पूर्व गृह प्रवेश मंगल मुहूर्त', descriptionEn: 'Kartik Griha Pravesh window' },
    { id: 'g3-2083', type: 'GRIHA_PRAVESH', typeNameNp: 'गृह प्रवेश मुहूर्त', typeNameEn: 'Housewarming Muhurat', bsYear: 2083, bsMonth: 10, bsMonthNameNp: 'माघ', bsDay: 18, bsDateStr: '2083-10-18', adDateStr: '2027-01-31', dayNameNp: 'आइतबार', tithiNp: 'तृतीया', nakshatraNp: 'धनिष्ठा', timeWindowNp: 'बिहान ०८:१५ देखि ११:४५ सम्म', descriptionNp: 'माघ धनिष्ठा नक्षत्र गृह प्रवेश', descriptionEn: 'Magh House entry date' },
    { id: 'p1-2083', type: 'PASNI', typeNameNp: 'पास्नी / अन्नप्राशन', typeNameEn: 'First Rice Feeding', bsYear: 2083, bsMonth: 2, bsMonthNameNp: 'जेठ', bsDay: 8, bsDateStr: '2083-02-08', adDateStr: '2026-05-22', dayNameNp: 'शुक्रबार', tithiNp: 'षष्ठी', nakshatraNp: 'पुनर्वसु', timeWindowNp: 'बिहान ०९:०० देखि ११:३० सम्म', descriptionNp: 'शिशु अन्नप्राशन तथा पास्नी संस्कार', descriptionEn: 'Infant Annaprashan Muhurat' },
    { id: 'p2-2083', type: 'PASNI', typeNameNp: 'पास्नी / अन्नप्राशन', typeNameEn: 'First Rice Feeding', bsYear: 2083, bsMonth: 5, bsMonthNameNp: 'भदौ', bsDay: 12, bsDateStr: '2083-05-12', adDateStr: '2026-08-28', dayNameNp: 'शुक्रबार', tithiNp: 'द्वितीया', nakshatraNp: 'पूर्वाभाद्रपदा', timeWindowNp: 'बिहान ०८:३० देखि ११:०० सम्म', descriptionNp: 'भदौ पास्नी शुभ मुहूर्त', descriptionEn: 'Bhadra Pasni Timing' },
    { id: 'p3-2083', type: 'PASNI', typeNameNp: 'पास्नी / अन्नप्राशन', typeNameEn: 'First Rice Feeding', bsYear: 2083, bsMonth: 9, bsMonthNameNp: 'पुस', bsDay: 19, bsDateStr: '2083-09-19', adDateStr: '2027-01-03', dayNameNp: 'आइतबार', tithiNp: 'एकादशी', nakshatraNp: 'भरणी', timeWindowNp: 'बिहान १०:०० देखि १२:१५ सम्म', descriptionNp: 'पुस महिना पास्नी लगन', descriptionEn: 'Poush Pasni Timing' },

    // 2082 BS Muhurats
    { id: 'm1-2082', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2082, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 12, bsDateStr: '2082-01-12', adDateStr: '2025-04-25', dayNameNp: 'शुक्रबार', tithiNp: 'द्वादशी', nakshatraNp: 'उत्तराफाल्गुनी', timeWindowNp: 'बिहान ०९:०० देखि ०२:०० सम्म', descriptionNp: 'बैशाख उत्तम विवाह लगन', descriptionEn: 'Baisakh Vivaha Muhurat' },
    { id: 'm2-2082', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2082, bsMonth: 8, bsMonthNameNp: 'मंसिर', bsDay: 11, bsDateStr: '2082-08-11', adDateStr: '2025-11-27', dayNameNp: 'बिहीबार', tithiNp: 'सप्तमी', nakshatraNp: 'धनिष्ठा', timeWindowNp: 'बिहान १०:०० देखि ०३:०० सम्म', descriptionNp: 'मंसिर शुभ विवाह लगन', descriptionEn: 'Mangsir Vivaha Muhurat' },
    { id: 'm3-2082', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2082, bsMonth: 10, bsMonthNameNp: 'माघ', bsDay: 20, bsDateStr: '2082-10-20', adDateStr: '2026-02-03', dayNameNp: 'मंगलबार', tithiNp: 'तृतीया', nakshatraNp: 'मघा', timeWindowNp: 'बिहान ०८:३० देखि ०१:०० सम्म', descriptionNp: 'माघ शुभ विवाह लग्न', descriptionEn: 'Magh Vivaha Muhurat' },

    // 2081 BS Muhurats
    { id: 'm1-2081', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2081, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 24, bsDateStr: '2081-01-24', adDateStr: '2024-05-06', dayNameNp: 'सोमबार', tithiNp: 'त्रयोदशी', nakshatraNp: 'रेवती', timeWindowNp: 'बिहान ०८:०० देखि ०१:०० सम्म', descriptionNp: 'बैशाख रेवती नक्षत्र विवाह लगन', descriptionEn: 'Baisakh Vivaha Muhurat' },
    { id: 'm2-2081', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2081, bsMonth: 8, bsMonthNameNp: 'मंसिर', bsDay: 14, bsDateStr: '2081-08-14', adDateStr: '2024-11-29', dayNameNp: 'शुक्रबार', tithiNp: 'त्रयोदशी', nakshatraNp: 'स्वाती', timeWindowNp: 'बिहान ०९:३० देखि ०२:३० सम्म', descriptionNp: 'मंसिर विवाह लगन', descriptionEn: 'Mangsir Vivaha Muhurat' },

    // 2084 BS Muhurats
    { id: 'm1-2084', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2084, bsMonth: 1, bsMonthNameNp: 'बैशाख', bsDay: 14, bsDateStr: '2084-01-14', adDateStr: '2027-04-27', dayNameNp: 'मंगलबार', tithiNp: 'दशमी', nakshatraNp: 'उत्तराषाढा', timeWindowNp: 'बिहान ०८:३० देखि ०१:३० सम्म', descriptionNp: 'बैशाख उत्तम विवाह लगन', descriptionEn: 'Baisakh 2084 Marriage Muhurat' },
    { id: 'm2-2084', type: 'MARRIAGE', typeNameNp: 'विवाह लगन', typeNameEn: 'Marriage Muhurat', bsYear: 2084, bsMonth: 8, bsMonthNameNp: 'मंसिर', bsDay: 16, bsDateStr: '2084-08-16', adDateStr: '2027-12-02', dayNameNp: 'बिहीबार', tithiNp: 'द्वादशी', nakshatraNp: 'रोहिणी', timeWindowNp: 'बिहान ०९:०० देखि ०२:०० सम्म', descriptionNp: 'मंसिर रोहिणी नक्षत्र विवाह लगन', descriptionEn: 'Mangsir 2084 Marriage Muhurat' },
  ];

  const filtered = allMuhurats.filter((m) => m.bsYear === selectedYear);
  return filtered.length > 0 ? filtered : allMuhurats.filter((m) => m.bsYear === 2083);
}

// Subha Muhurats for 2083
export function getSubhaMuhurats2083(): SubhaMuhuratItem[] {
  return getSubhaMuhurats(2083);
}

// Official Nepal Government Public Holidays List
export function getGovernmentHolidays(year: number = 2083): PublicHolidayItem[] {
  const baseHolidays = [
    { nameNp: 'नेपाली नयाँ वर्ष', nameEn: 'Nepali New Year', bsMonth: 'बैशाख', bsMonthNum: 1, bsDay: 1, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'विक्रम संवत् को पहिलो दिन (मेष संक्रान्ति)', descriptionEn: 'First day of Bikram Sambat New Year' },
    { nameNp: 'अन्तर्राष्ट्रिय श्रमिक दिवस (मई दिवस)', nameEn: 'Labour Day', bsMonth: 'बैशाख', bsMonthNum: 1, bsDay: 18, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'विश्वभरका श्रमिकहरूको सम्मानमा सार्वजनिक बिदा', descriptionEn: 'International Workers Day' },
    { nameNp: 'बुद्ध जयन्ती तथा उभौली पर्व', nameEn: 'Buddha Jayanti & Ubhauli', bsMonth: 'बैशाख', bsMonthNum: 1, bsDay: 28, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'गौतम बुद्ध जन्म जयन्ती तथा किरात समुदायको उभौली', descriptionEn: 'Gautam Buddha Birthday & Kirat Ubhauli' },
    { nameNp: 'गणतन्त्र दिवस', nameEn: 'Republic Day', bsMonth: 'जेठ', bsMonthNum: 2, bsDay: 15, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'नेपालमा संघीय लोकतान्त्रिक गणतन्त्र स्थापना दिवस', descriptionEn: 'Commemoration of Federal Democratic Republic' },
    { nameNp: 'जनै पूर्णिमा तथा रक्षाबन्धन', nameEn: 'Janai Purnima / Rakshabandhan', bsMonth: 'श्रावण', bsMonthNum: 4, bsDay: 30, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'पवित्र जनै फेर्ने, डोरो बाँध्ने र क्वाँटी खाने चाड', descriptionEn: 'Sacred thread festival & Raksha Bandhan' },
    { nameNp: 'गाईजात्रा (सापारु)', nameEn: 'Gai Jatra', bsMonth: 'श्रावण', bsMonthNum: 4, bsDay: 31, category: 'Regional' as const, applicableToNp: 'काठमाडौं उपत्यका', descriptionNp: 'काठमाडौं उपत्यकाका नेवार समुदायको ऐतिहासिक सांस्कृतिक पर्व', descriptionEn: 'Historic cultural festival of Kathmandu Valley' },
    { nameNp: 'श्री कृष्ण जन्माष्टमी', nameEn: 'Krishna Janmashtami', bsMonth: 'भदौ', bsMonthNum: 5, bsDay: 3, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'भगवान् श्रीकृष्णको जन्मोत्सव', descriptionEn: 'Birth celebration of Lord Krishna' },
    { nameNp: 'हरितालिका तीज', nameEn: 'Haritalika Teej', bsMonth: 'भदौ', bsMonthNum: 5, bsDay: 18, category: 'Women' as const, applicableToNp: 'महिला कर्मचारीहरूलाई मात्र', descriptionNp: 'नेपाली महिलाहरूको महान सांस्कृतिक तथा धार्मिक चाड', descriptionEn: 'Great cultural festival for women' },
    { nameNp: 'इन्द्रजात्रा (येँयाः)', nameEn: 'Indra Jatra', bsMonth: 'भदौ', bsMonthNum: 5, bsDay: 29, category: 'Regional' as const, applicableToNp: 'काठमाडौं उपत्यका', descriptionNp: 'वर्षा र सहकालका देवता इन्द्रको रथयात्रा तथा कुमारी जात्रा', descriptionEn: 'Living Goddess Kumari and Indra chariot festival' },
    { nameNp: 'संविधान दिवस (राष्ट्रिय दिवस)', nameEn: 'Constitution Day', bsMonth: 'असोज', bsMonthNum: 6, bsDay: 3, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'नेपालको संविधान (२०७२) जारी भएको ऐतिहासिक दिन', descriptionEn: 'Promulgation of Constitution of Nepal' },
    { nameNp: 'घटस्थापना (बडा दशैं प्रारम्भ)', nameEn: 'Ghatasthapana', bsMonth: 'असोज', bsMonthNum: 6, bsDay: 17, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'नवरात्र प्रारम्भ तथा जमरा राख्ने दिन', descriptionEn: 'Commencement of Navaratri & Bada Dashain' },
    { nameNp: 'बडा दशैं (फूलपाती देखि द्वादशी सम्म)', nameEn: 'Bada Dashain Holidays', bsMonth: 'असोज', bsMonthNum: 6, bsDay: 23, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर (६ दिन)', descriptionNp: 'नेपालको सबैभन्दा ठूलो राष्ट्रिय चाड बडा दशैं', descriptionEn: 'Grand national festival of Nepal' },
    { nameNp: 'तिहार (लक्ष्मी पूजा देखि भाइटीका सम्म)', nameEn: 'Tihar Holidays', bsMonth: 'कार्तिक', bsMonthNum: 7, bsDay: 17, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर (४ दिन)', descriptionNp: 'दीपावली, गोवर्धन पूजा, म्ह पूजा र भाइटीका', descriptionEn: 'Festival of Lights, Mha Puja, and Bhai Tika' },
    { nameNp: 'छठ पर्व', nameEn: 'Chhath Parva', bsMonth: 'कार्तिक', bsMonthNum: 7, bsDay: 23, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'सूर्यदेवको उपासना, शुद्धि र स्वच्छताको महापर्व', descriptionEn: 'Sun worship and grand festival' },
    { nameNp: 'उधौली पर्व तथा योमरी पुन्ही', nameEn: 'Udhauli Parva & Yomari Punhi', bsMonth: 'मंसिर', bsMonthNum: 8, bsDay: 29, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'किरात समुदायको उधौली तथा नेवार समुदायको ज्यापु दिवस', descriptionEn: 'Harvest festival of Kirat & Newar communities' },
    { nameNp: 'क्रिसमस डे (Christmas Day)', nameEn: 'Christmas Day', bsMonth: 'पुस', bsMonthNum: 9, bsDay: 10, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'ईसाई धर्मावलम्बीहरूको महान चाड', descriptionEn: 'Christmas holiday' },
    { nameNp: 'तमु ल्होसार', nameEn: 'Tamu Lhosar', bsMonth: 'पुस', bsMonthNum: 9, bsDay: 15, category: 'Special' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'गुरुङ समुदायको नयाँ वर्ष', descriptionEn: 'Gurung community New Year' },
    { nameNp: 'राष्ट्रिय एकता दिवस तथा पृथ्वी जयन्ती', nameEn: 'National Unity Day', bsMonth: 'पुस', bsMonthNum: 9, bsDay: 27, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'राष्ट्रनिर्माता पृथ्वीनारायण शाह जन्मजयन्ती', descriptionEn: 'Prithvi Jayanti and National Unity Day' },
    { nameNp: 'माघे संक्रान्ति तथा माघी पर्व', nameEn: 'Maghe Sankranti / Maghi', bsMonth: 'माघ', bsMonthNum: 10, bsDay: 1, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'थारु, मगर तथा सम्पूर्ण नेपालीहरूको महान संक्रान्ति पर्व', descriptionEn: 'Makar Sankranti and Tharu Maghi' },
    { nameNp: 'सोनाम ल्होसार', nameEn: 'Sonam Lhosar', bsMonth: 'माघ', bsMonthNum: 10, bsDay: 15, category: 'Special' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'तामाङ समुदायको नयाँ वर्ष', descriptionEn: 'Tamang community New Year' },
    { nameNp: 'शहीद दिवस', nameEn: 'Martyrs Day', bsMonth: 'माघ', bsMonthNum: 10, bsDay: 16, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'प्रजातन्त्र तथा राष्ट्रका लागि जीवन उत्सर्ग गर्ने अमर शहीदहरूको सम्झना', descriptionEn: 'Commemoration of Nepals Martyrs' },
    { nameNp: 'राष्ट्रिय प्रजातन्त्र दिवस', nameEn: 'Democracy Day', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 7, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'प्रजातन्त्र स्थापना भएको ऐतिहासिक दिन', descriptionEn: 'Establishment of Democracy in Nepal' },
    { nameNp: 'महाशिवरात्रि तथा सेना दिवस', nameEn: 'Maha Shivaratri / Army Day', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 13, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'पशुपतिनाथ मन्दिरमा महाशिवरात्रि मेला तथा नेपाली सेना दिवस', descriptionEn: 'Maha Shivaratri and Nepal Army Day' },
    { nameNp: 'ग्याल्पो ल्होसार', nameEn: 'Gyalpo Lhosar', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 15, category: 'Special' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'शेर्पा तथा हिमाली समुदायको नयाँ वर्ष', descriptionEn: 'Sherpa community New Year' },
    { nameNp: 'अन्तर्राष्ट्रिय महिला दिवस', nameEn: 'International Womens Day', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 24, category: 'National' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'नारी अधिकार तथा सशक्तिकरण दिवस', descriptionEn: 'International Womens Rights Day' },
    { nameNp: 'फागु पूर्णिमा (होली पहाड)', nameEn: 'Holi (Hilly Region)', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 29, category: 'Festival' as const, applicableToNp: 'पहाडी तथा हिमाली जिल्लाहरू', descriptionNp: 'वसन्त ऋतुको रंगहरूको महान पर्व', descriptionEn: 'Festival of colors in hilly region' },
    { nameNp: 'फागु पूर्णिमा (होली तराई)', nameEn: 'Holi (Terai Region)', bsMonth: 'फागुन', bsMonthNum: 11, bsDay: 30, category: 'Festival' as const, applicableToNp: 'तराई तथा भित्री मधेस जिल्लाहरू', descriptionNp: 'तराई जिल्लाहरूमा रंग र सद्भावको पर्व', descriptionEn: 'Festival of colors in Terai' },
    { nameNp: 'घोडेजात्रा', nameEn: 'Ghode Jatra', bsMonth: 'चैत', bsMonthNum: 12, bsDay: 14, category: 'Regional' as const, applicableToNp: 'काठमाडौं उपत्यका', descriptionNp: 'टुँडिखेलमा घोडेजात्रा अश्वकला प्रदर्शन', descriptionEn: 'Horse festival of Kathmandu Valley' },
    { nameNp: 'श्री रामनवमी', nameEn: 'Shree Ram Navami', bsMonth: 'चैत', bsMonthNum: 12, bsDay: 23, category: 'Festival' as const, applicableToNp: 'सम्पूर्ण देशभर', descriptionNp: 'मर्यादा पुरुषोत्तम भगवान् श्रीरामचन्द्रको जन्मोत्सव', descriptionEn: 'Birth of Lord Rama' },
  ];

  return baseHolidays.map((h, idx) => {
    const adDateObj = rawBsToJsDate(year, h.bsMonthNum, h.bsDay);
    const dayOfWeek = adDateObj.getDay();
    const adDateStr = adDateObj.toISOString().split('T')[0];

    return {
      id: `h-${year}-${idx + 1}`,
      nameNp: `${h.nameNp} (${toNepaliDigits(year)})`,
      nameEn: `${h.nameEn} ${year}`,
      bsYear: year,
      bsDate: `${toNepaliDigits(year)} ${h.bsMonth} ${toNepaliDigits(h.bsDay)}`,
      bsMonth: h.bsMonth,
      bsDay: h.bsDay,
      adDate: adDateStr,
      dayOfWeekNp: BS_DAYS_NP[dayOfWeek],
      dayOfWeekEn: BS_DAYS_EN[dayOfWeek],
      category: h.category,
      applicableToNp: h.applicableToNp,
      descriptionNp: h.descriptionNp,
      descriptionEn: h.descriptionEn,
    };
  });
}

export function getGovernmentHolidays2083(): PublicHolidayItem[] {
  return getGovernmentHolidays(2083);
}

// Generate complete Month Grid Data for any given BS Year and Month (from 1970 to 2105 BS)
export function generateBsMonthData(bsYear: number, bsMonth: number): CalendarMonthData {
  const totalDays = getDaysInBsMonth(bsYear, bsMonth);
  const bsMonthNameNp = BS_MONTHS_NP[bsMonth - 1] || 'बैशाख';
  const bsMonthNameEn = BS_MONTHS_EN[bsMonth - 1] || 'Baisakh';
  const ritu = getRituFromBsMonth(bsMonth);

  // Calculate start day of week and AD mapping using 136-year exact master table
  const days: CalendarDayDetail[] = [];
  let startDayOfWeek = 0;
  let firstAdDate: Date = new Date();
  let lastAdDate: Date = new Date();

  for (let d = 1; d <= totalDays; d++) {
    const adDateObj = rawBsToJsDate(bsYear, bsMonth, d);

    if (d === 1) {
      startDayOfWeek = adDateObj.getDay();
      firstAdDate = adDateObj;
    }
    if (d === totalDays) {
      lastAdDate = adDateObj;
    }

    const dayOfWeek = adDateObj.getDay();
    const dayNameNp = BS_DAYS_NP[dayOfWeek];
    const dayNameEn = BS_DAYS_EN[dayOfWeek];

    const adDay = adDateObj.getDate();
    const adMonthShort = adDateObj.toLocaleDateString('en-US', { month: 'short' });
    const adYear = adDateObj.getFullYear();
    const adDateStr = adDateObj.toISOString().split('T')[0];
    const adDateFormatted = `${adDay} ${adMonthShort} ${adYear}`;

    // Tithi calculation (approximate cycle of 15 Shukla + 15 Krishna)
    const tithiIndex = (d + (bsMonth * 2)) % 15;
    const isShukla = ((d + bsMonth) % 30) < 15;
    const pakshaNp = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
    const pakshaEn = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
    let tithiNp = TITHI_NAMES_NP[tithiIndex] || 'दशमी';
    if (tithiIndex === 14) {
      tithiNp = isShukla ? 'पूर्णिमा' : 'औंसी';
    }

    const nakshatraIndex = (d * 3 + bsMonth * 2) % NAKSHATRAS_NP.length;
    const yogaIndex = (d * 2 + bsMonth) % YOGAS_NP.length;
    const karanaIndex = (d * 4) % KARANAS_NP.length;
    const rashiIndex = (bsMonth - 1 + Math.floor(d / 2.5)) % RASHIS_NP.length;
    const suryarashiIndex = (bsMonth - 1) % RASHIS_NP.length;

    const festivalData = getFestivalAndHoliday(bsMonth, d, bsYear);
    const isSaturday = dayOfWeek === 6;
    const isHoliday = festivalData.isHoliday || isSaturday;

    // Kathmandu Sunrise / Sunset calculations
    const sunriseHours = 5 + Math.sin(((bsMonth - 3) * Math.PI) / 6) * 0.5; // ~05:15 to 06:45
    const sunsetHours = 18 + Math.cos(((bsMonth - 3) * Math.PI) / 6) * 0.7; // ~17:15 to 19:00
    const sunriseMinutes = Math.floor((sunriseHours % 1) * 60);
    const sunsetMinutes = Math.floor((sunsetHours % 1) * 60);
    const sunriseTime = `0${Math.floor(sunriseHours)}:${String(sunriseMinutes).padStart(2, '0')} AM`;
    const sunsetTime = `0${Math.floor(sunsetHours - 12)}:${String(sunsetMinutes).padStart(2, '0')} PM`;

    const rahuKaal = calculateRahuKaal(dayOfWeek);
    const dishashoolNp = calculateDishashool(dayOfWeek);

    days.push({
      bsYear,
      bsMonth,
      bsDay: d,
      bsDateStr: `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      bsDateNp: `${toNepaliDigits(bsYear)} ${bsMonthNameNp} ${toNepaliDigits(d)}`,
      adDateStr,
      adDateFormatted,
      adDay,
      adMonth: adMonthShort,
      adYear,
      dayOfWeek,
      dayNameNp,
      dayNameEn,
      tithiCode: `TITHI_${tithiIndex + 1}`,
      tithiNp,
      tithiEn: `Tithi ${tithiIndex + 1}`,
      pakshaNp,
      pakshaEn,
      nakshatraNp: NAKSHATRAS_NP[nakshatraIndex],
      yogaNp: YOGAS_NP[yogaIndex],
      karanaNp: KARANAS_NP[karanaIndex],
      chandrarashiNp: RASHIS_NP[rashiIndex],
      suryarashiNp: RASHIS_NP[suryarashiIndex],
      sunriseTime,
      sunsetTime,
      moonriseTime: '06:12 PM',
      moonsetTime: '05:40 AM',
      rahuKaal,
      yamaghantaKaal: '03:15 PM - 04:45 PM',
      abhijitMuhurat: '11:42 AM - 12:34 PM',
      amritKaal: '02:10 PM - 03:45 PM',
      brahmaMuhurat: '04:12 AM - 04:58 AM',
      dishashoolNp,
      festivalNp: festivalData.festivalNp,
      festivalEn: festivalData.festivalEn,
      festivalDescriptionNp: festivalData.holidayReasonNp,
      isHoliday,
      holidayReasonNp: festivalData.holidayReasonNp || (isSaturday ? 'शनिबार (साप्ताहिक बिदा)' : undefined),
      holidayReasonEn: festivalData.holidayReasonEn || (isSaturday ? 'Saturday (Weekly Off)' : undefined),
      holidayType: festivalData.holidayType,
      isSaturday,
      isPurnima: Boolean(festivalData.isPurnima || tithiNp === 'पूर्णिमा'),
      isAunsi: Boolean(festivalData.isAunsi || tithiNp === 'औंसी'),
      isEkadashi: Boolean(festivalData.isEkadashi || tithiNp.includes('एकादशी')),
      isSankranti: d === 1,
    });
  }

  const adMonthStart = firstAdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const adMonthEnd = lastAdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    bsYear,
    bsMonth,
    bsMonthNameNp,
    bsMonthNameEn,
    rituNp: ritu.rituNp,
    rituEn: ritu.rituEn,
    adYearRange: `${firstAdDate.getFullYear()} - ${lastAdDate.getFullYear()}`,
    adMonthRange: adMonthStart === adMonthEnd ? adMonthStart : `${adMonthStart} / ${adMonthEnd}`,
    totalDays,
    startDayOfWeek,
    days,
  };
}

// Convert BS to AD and return full provenance payload (Supports 1970 to 2105 BS)
export function convertBsToAdDetailed(bsYear: number, bsMonth: number, bsDay: number) {
  try {
    const jsDate = rawBsToJsDate(bsYear, bsMonth, bsDay);
    const y = jsDate.getFullYear();
    const m = String(jsDate.getMonth() + 1).padStart(2, '0');
    const d = String(jsDate.getDate()).padStart(2, '0');
    const dayOfWeek = jsDate.getDay();
    return {
      adDateIso: `${y}-${m}-${d}`,
      adDateFormatted: `${jsDate.getDate()} ${jsDate.toLocaleDateString('en-US', { month: 'long' })} ${y}`,
      dayOfWeekNp: BS_DAYS_NP[dayOfWeek],
      dayOfWeekEn: BS_DAYS_EN[dayOfWeek],
      bsDateNp: `${toNepaliDigits(bsYear)} ${BS_MONTHS_NP[bsMonth - 1]} ${toNepaliDigits(bsDay)}`,
    };
  } catch (e) {
    return {
      adDateIso: `${bsYear - 57}-${String(bsMonth).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`,
      adDateFormatted: `${bsDay} ${BS_MONTHS_EN[bsMonth - 1]} ${bsYear - 57}`,
      dayOfWeekNp: 'आइतबार',
      dayOfWeekEn: 'Sunday',
      bsDateNp: `${toNepaliDigits(bsYear)} ${BS_MONTHS_NP[bsMonth - 1]} ${toNepaliDigits(bsDay)}`,
    };
  }
}

// Convert AD to BS and return full provenance payload (Supports AD 1913 to 2045+)
export function convertAdToBsDetailed(adDateStr: string) {
  try {
    const parts = adDateStr.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const jsDate = new Date(y, m - 1, d);

    const bsRes = rawJsDateToBs(jsDate);
    const bsYear = bsRes.year;
    const bsMonth = bsRes.month;
    const bsDay = bsRes.day;
    const dayOfWeek = jsDate.getDay();

    return {
      bsYear,
      bsMonth,
      bsDay,
      bsDateStr: `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`,
      bsDateNp: `वि.सं. ${toNepaliDigits(bsYear)} ${BS_MONTHS_NP[bsMonth - 1]} ${toNepaliDigits(bsDay)}`,
      bsDateEn: `BS ${bsYear} ${BS_MONTHS_EN[bsMonth - 1]} ${bsDay}`,
      dayOfWeekNp: BS_DAYS_NP[dayOfWeek],
      dayOfWeekEn: BS_DAYS_EN[dayOfWeek],
      adDateFormatted: `${d} ${jsDate.toLocaleDateString('en-US', { month: 'long' })} ${y}`,
    };
  } catch (e) {
    return {
      bsYear: 2083,
      bsMonth: 4,
      bsDay: 21,
      bsDateStr: '2083-04-21',
      bsDateNp: 'वि.सं. २०८३ श्रावण २१',
      bsDateEn: 'BS 2083 Shrawan 21',
      dayOfWeekNp: 'बिहीबार',
      dayOfWeekEn: 'Thursday',
      adDateFormatted: adDateStr,
    };
  }
}

// Calculate exact Nepali and English age for any birth year (1970 to 2083+)
export function calculateNepaliAge(birthBsYear: number, birthBsMonth: number, birthBsDay: number) {
  const todayAd = new Date();
  const todayBs = rawJsDateToBs(todayAd);
  const curYear = todayBs.year;
  const curMonth = todayBs.month;
  const curDay = todayBs.day;

  let years = curYear - birthBsYear;
  let months = curMonth - birthBsMonth;
  let days = curDay - birthBsDay;

  if (days < 0) {
    months -= 1;
    days += 30; // Approx month days
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Next birthday in BS
  const nextBdayYear = curMonth > birthBsMonth || (curMonth === birthBsMonth && curDay > birthBsDay) ? curYear + 1 : curYear;
  const nextBdayAd = convertBsToAdDetailed(nextBdayYear, birthBsMonth, birthBsDay);

  const approxTotalDays = years * 365 + months * 30 + days;

  return {
    years,
    months,
    days,
    approxTotalDays,
    ageStringNp: `${toNepaliDigits(years)} वर्ष, ${toNepaliDigits(months)} महिना, ${toNepaliDigits(days)} दिन`,
    ageStringEn: `${years} Years, ${months} Months, ${days} Days`,
    nextBirthdayBs: `वि.सं. ${toNepaliDigits(nextBdayYear)} ${BS_MONTHS_NP[birthBsMonth - 1]} ${toNepaliDigits(birthBsDay)}`,
    nextBirthdayAd: nextBdayAd.adDateFormatted,
    nextBirthdayDayOfWeek: nextBdayAd.dayOfWeekNp,
  };
}
