import { MicroPanchangData } from '../types/sajiloTypes';

export interface CityPanchangSetting {
  id: string;
  nameNp: string;
  nameEn: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
}

export const NEPAL_CITIES_PANCHANG: CityPanchangSetting[] = [
  { id: 'ktm', nameNp: 'काठमाडौँ (Kathmandu)', nameEn: 'Kathmandu', sunrise: '०५:४२ AM', sunset: '०६:२१ PM', moonrise: '०६:५० PM', moonset: '०६:१२ AM' },
  { id: 'pkr', nameNp: 'पोखरा (Pokhara)', nameEn: 'Pokhara', sunrise: '०५:४६ AM', sunset: '०६:२५ PM', moonrise: '०६:५४ PM', moonset: '०६:१६ AM' },
  { id: 'brt', nameNp: 'विराटनगर (Biratnagar)', nameEn: 'Biratnagar', sunrise: '०५:३३ AM', sunset: '०६:१२ PM', moonrise: '०६:४१ PM', moonset: '०६:०३ AM' },
  { id: 'brg', nameNp: 'वीरगञ्ज (Birgunj)', nameEn: 'Birgunj', sunrise: '०५:४० AM', sunset: '०६:१९ PM', moonrise: '०६:४८ PM', moonset: '०६:१० AM' },
  { id: 'npg', nameNp: 'नेपालगञ्ज (Nepalgunj)', nameEn: 'Nepalgunj', sunrise: '०५:५४ AM', sunset: '०६:३३ PM', moonrise: '०७:०२ PM', moonset: '०६:२४ AM' },
  { id: 'dgd', nameNp: 'धनगढी (Dhangadhi)', nameEn: 'Dhangadhi', sunrise: '०५:५८ AM', sunset: '०६:३७ PM', moonrise: '०७:०६ PM', moonset: '०६:२८ AM' },
  { id: 'btw', nameNp: 'बुटवल (Butwal)', nameEn: 'Butwal', sunrise: '०५:४७ AM', sunset: '०६:२६ PM', moonrise: '०६:५५ PM', moonset: '०६:१७ AM' },
  { id: 'jnk', nameNp: 'जनकपुर (Janakpur)', nameEn: 'Janakpur', sunrise: '०५:३६ AM', sunset: '०६:१५ PM', moonrise: '०६:४४ PM', moonset: '०६:०६ AM' },
];

export function getMicroPanchangForCity(cityId: string, dayOfWeekIndex: number = 5): MicroPanchangData {
  const city = NEPAL_CITIES_PANCHANG.find((c) => c.id === cityId) || NEPAL_CITIES_PANCHANG[0];

  // Authentic Rahu Kaal by day of week (0 = Sunday, 1 = Monday ... 6 = Saturday)
  const rahuKaalTable = [
    '०४:३० PM - ०६:०० PM (आइतबार)', // Sun
    '०७:३० AM - ०९:०० AM (सोमबार)', // Mon
    '०३:०० PM - ०४:३० PM (मंगलबार)', // Tue
    '१२:०० PM - ०१:३० PM (बुधबार)', // Wed
    '०१:३० PM - ०३:०० PM (बिहीबार)', // Thu
    '१०:३० AM - १२:०० PM (शुक्रबार)', // Fri
    '०९:०० AM - १०:३० AM (शनिबार)', // Sat
  ];

  const yamaGhantaTable = [
    '१२:०० PM - ०१:३० PM', // Sun
    '१०:३० AM - १२:०० PM', // Mon
    '०९:०० AM - १०:३० AM', // Tue
    '०७:३० AM - ०९:०० AM', // Wed
    '०६:०० AM - ०७:३० AM', // Thu
    '०३:०० PM - ०४:३० PM', // Fri
    '०१:३० PM - ०३:०० PM', // Sat
  ];

  const gulikaKaalTable = [
    '०३:०० PM - ०४:३० PM',
    '०१:३० PM - ०३:०० PM',
    '१२:०० PM - ०१:३० PM',
    '१०:३० AM - १२:०० PM',
    '०९:०० AM - १०:३० AM',
    '०७:३० AM - ०९:०० AM',
    '०६:०० AM - ०७:३० AM',
  ];

  return {
    city: city.nameEn,
    cityNp: city.nameNp,
    sunrise: city.sunrise,
    sunset: city.sunset,
    moonrise: city.moonrise,
    moonset: city.moonset,
    tithi: 'शुक्लपक्ष सप्तमी तिथि',
    tithiEndsAt: 'राती ०९:४२ सम्म, उप्रान्त अष्टमी',
    nakshatra: 'अनुराधा नक्षत्र',
    nakshatraEndsAt: 'दिउँसो ०२:१५ सम्म, उप्रान्त ज्येष्ठा',
    yoga: 'वैधृति योग',
    karana: 'गर करण (दिउँसो ०१:१० सम्म), वणिज करण',
    chandraRashi: 'वृश्चिक राशि (मङ्गल स्वामी)',
    suryaRashi: 'सिंह राशि (सूर्य स्वामी)',
    rahuKaal: rahuKaalTable[dayOfWeekIndex % 7],
    yamaGhanta: yamaGhantaTable[dayOfWeekIndex % 7],
    gulikaKaal: gulikaKaalTable[dayOfWeekIndex % 7],
    abhijitMuhurat: '११:४८ AM - १२:३८ PM (सर्वश्रेष्ठ शुभ योग)',
    amritKaal: '०८:१० AM - ०९:५२ AM',
    brahmaMuhurat: '०४:१२ AM - ०४:५८ AM',
    ayan: 'दक्षिणायन (Dakshinayana)',
    ritu: 'वर्षा ऋतु (Monsoon)',
  };
}
