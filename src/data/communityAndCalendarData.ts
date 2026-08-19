import { CalendarDay, NewsArticle } from '../types';

export const MOCK_CALENDAR_2083: CalendarDay[] = [
  { bsDate: '2083-04-21', bsDay: 21, bsMonth: 'Shrawan', bsYear: 2083, adDate: '2026-08-06', dayOfWeek: 'Thursday', tithi: 'Navami', tithiNp: 'नवमी', festival: 'Shrawan Sombar Vrata / Current Date', festivalNp: 'श्रावण व्रत / आजको मिति', isHoliday: false },
  { bsDate: '2083-04-22', bsDay: 22, bsMonth: 'Shrawan', bsYear: 2083, adDate: '2026-08-07', dayOfWeek: 'Friday', tithi: 'Dashami', tithiNp: 'दशमी', isHoliday: false },
  { bsDate: '2083-04-26', bsDay: 26, bsMonth: 'Shrawan', bsYear: 2083, adDate: '2026-08-11', dayOfWeek: 'Tuesday', tithi: 'Trayodashi', tithiNp: 'त्रयोदशी', festival: 'Shrawan Sombar Snan', festivalNp: 'श्रावण स्नान', isHoliday: false },
  { bsDate: '2083-05-03', bsDay: 3, bsMonth: 'Bhadra', bsYear: 2083, adDate: '2026-08-19', dayOfWeek: 'Wednesday', tithi: 'Ashtami', tithiNp: 'अष्टमी', festival: 'Shree Krishna Janmashtami', festivalNp: 'श्री कृष्ण जन्माष्टमी', isHoliday: true },
  { bsDate: '2083-05-18', bsDay: 18, bsMonth: 'Bhadra', bsYear: 2083, adDate: '2026-09-03', dayOfWeek: 'Thursday', tithi: 'Tritiya', tithiNp: 'तृतीया', festival: 'Haritalika Teej', festivalNp: 'हरितालिका तीज (महिला बिदा)', isHoliday: true },
  { bsDate: '2083-06-03', bsDay: 3, bsMonth: 'Ashwin', bsYear: 2083, adDate: '2026-09-19', dayOfWeek: 'Saturday', tithi: 'National Day', tithiNp: 'संविधान दिवस', festival: 'Constitution Day of Nepal', festivalNp: 'संविधान दिवस (राष्ट्रिय बिदा)', isHoliday: true },
  { bsDate: '2083-06-25', bsDay: 25, bsMonth: 'Ashwin', bsYear: 2083, adDate: '2026-10-11', dayOfWeek: 'Sunday', tithi: 'Pratipada', tithiNp: 'प्रतिपदा', festival: 'Ghatasthapana (Dashain Begins)', festivalNp: 'घटस्थापना (दशैं आरम्भ)', isHoliday: true },
  { bsDate: '2083-06-29', bsDay: 29, bsMonth: 'Ashwin', bsYear: 2083, adDate: '2026-10-15', dayOfWeek: 'Thursday', tithi: 'Dashami', tithiNp: 'विजया दशमी', festival: 'Vijaya Dashami (Main Dashain Tika)', festivalNp: 'बडा दशैँ मुख्य टिका', isHoliday: true },
  { bsDate: '2083-07-22', bsDay: 22, bsMonth: 'Kartik', bsYear: 2083, adDate: '2026-11-07', dayOfWeek: 'Saturday', tithi: 'Aunsi', tithiNp: 'औंशी', festival: 'Laxmi Puja (Tihar)', festivalNp: 'लक्ष्मी पूजा (तिहार)', isHoliday: true },
  { bsDate: '2083-07-24', bsDay: 24, bsMonth: 'Kartik', bsYear: 2083, adDate: '2026-11-09', dayOfWeek: 'Monday', tithi: 'Dwitiya', tithiNp: 'द्वितीया', festival: 'Bhai Tika (Tihar)', festivalNp: 'भाइटीका (तिहार)', isHoliday: true },
];

export const MOCK_CALENDAR_2081 = MOCK_CALENDAR_2083; // Backward compatibility alias

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'NEPSE Gains 18.45 Points Driven by Hydro and Microfinance Rallies',
    titleNp: 'जलविद्युत् र लघुवित्त समूहको वृद्धिले नेप्से १८.४५ अंकले बढ्यो',
    source: 'Bizshala / ShareSansar',
    category: 'Finance',
    publishedAt: '30 mins ago',
    summary: 'Nepal Stock Exchange benchmark index closed higher today backed by total daily turnover exceeding NPR 4.2 Billion.',
    summaryNp: 'आजको कुल कारोबार रकम ४.२ अर्ब नाघेको छ।',
    url: '#',
  },
  {
    id: 'n2',
    title: 'Inland Revenue Department Extends Personal PAN Lamination Stations',
    titleNp: 'आन्तरिक राजस्व विभागद्वारा वडा तहमा नै स्थायी लेखा नम्बर (PAN) वितरण',
    source: 'Ekantipur',
    category: 'National',
    publishedAt: '2 hours ago',
    summary: 'Taxpayers can now obtain their printed PAN card directly at local IRD tax collection centers under expanded services.',
    summaryNp: 'करदाताहरूले अब स्थानीय राजस्व संकलन केन्द्रबाट नै PAN कार्ड लिन सक्नेछन्।',
    url: '#',
  },
  {
    id: 'n3',
    title: 'Nepal Oil Corporation Reduces Petrol and Diesel Prices by NPR 2 per Litre',
    titleNp: 'नेपाल आयल निगमद्वारा पेटोल र डिजेलको मूल्यमा प्रति लिटर रु २ घटाउने निर्णय',
    source: 'OnlineKhabar',
    category: 'Society',
    publishedAt: '4 hours ago',
    summary: 'Following Indian Oil Corporation price revision, NOC announces immediate reduction across all three petrol distribution tiers.',
    summaryNp: 'भारतीय आयल कर्पोरेसनको नयाँ खरिद मूल्य अनुसार मूल्य समायोजन गरिएको छ।',
    url: '#',
  },
];
