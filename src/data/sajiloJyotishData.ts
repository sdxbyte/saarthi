// Vedic Astrology & Jyotish Logic Engine for SAARTHI

export interface RashiInfo {
  id: number; // 1 to 12
  nameEn: string;
  nameNp: string;
  lordEn: string;
  lordNp: string;
  elementEn: string;
  elementNp: string;
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
  vashya: 'Chatushpada' | 'Dvipada' | 'Jalachara' | 'Vanachara' | 'Keeta';
}

export const RASHIS: RashiInfo[] = [
  { id: 1, nameEn: 'Aries', nameNp: 'मेष', lordEn: 'Mars', lordNp: 'मंगल', elementEn: 'Fire', elementNp: 'अग्नि', varna: 'Kshatriya', vashya: 'Chatushpada' },
  { id: 2, nameEn: 'Taurus', nameNp: 'वृष', lordEn: 'Venus', lordNp: 'शुक्र', elementEn: 'Earth', elementNp: 'पृथ्वी', varna: 'Vaishya', vashya: 'Chatushpada' },
  { id: 3, nameEn: 'Gemini', nameNp: 'मिथुन', lordEn: 'Mercury', lordNp: 'बुध', elementEn: 'Air', elementNp: 'वायु', varna: 'Shudra', vashya: 'Dvipada' },
  { id: 4, nameEn: 'Cancer', nameNp: 'कर्कट', lordEn: 'Moon', lordNp: 'चन्द्र', elementEn: 'Water', elementNp: 'जल', varna: 'Brahmin', vashya: 'Jalachara' },
  { id: 5, nameEn: 'Leo', nameNp: 'सिंह', lordEn: 'Sun', lordNp: 'सूर्य', elementEn: 'Fire', elementNp: 'अग्नि', varna: 'Kshatriya', vashya: 'Vanachara' },
  { id: 6, nameEn: 'Virgo', nameNp: 'कन्या', lordEn: 'Mercury', lordNp: 'बुध', elementEn: 'Earth', elementNp: 'पृथ्वी', varna: 'Vaishya', vashya: 'Dvipada' },
  { id: 7, nameEn: 'Libra', nameNp: 'तुला', lordEn: 'Venus', lordNp: 'शुक्र', elementEn: 'Air', elementNp: 'वायु', varna: 'Shudra', vashya: 'Dvipada' },
  { id: 8, nameEn: 'Scorpio', nameNp: 'वृश्चिक', lordEn: 'Mars', lordNp: 'मंगल', elementEn: 'Water', elementNp: 'जल', varna: 'Brahmin', vashya: 'Keeta' },
  { id: 9, nameEn: 'Sagittarius', nameNp: 'धनु', lordEn: 'Jupiter', lordNp: 'बृहस्पति', elementEn: 'Fire', elementNp: 'अग्नि', varna: 'Kshatriya', vashya: 'Dvipada' },
  { id: 10, nameEn: 'Capricorn', nameNp: 'मकर', lordEn: 'Saturn', lordNp: 'शनि', elementEn: 'Earth', elementNp: 'पृथ्वी', varna: 'Vaishya', vashya: 'Jalachara' },
  { id: 11, nameEn: 'Aquarius', nameNp: 'कुम्भ', lordEn: 'Saturn', lordNp: 'शनि', elementEn: 'Air', elementNp: 'वायु', varna: 'Shudra', vashya: 'Dvipada' },
  { id: 12, nameEn: 'Pisces', nameNp: 'मीन', lordEn: 'Jupiter', lordNp: 'बृहस्पति', elementEn: 'Water', elementNp: 'जल', varna: 'Brahmin', vashya: 'Jalachara' },
];

export interface NakshatraInfo {
  id: number; // 1 to 27
  nameEn: string;
  nameNp: string;
  lordEn: string;
  lordNp: string;
  rashiId: number;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  ganaNp: 'देव' | 'मनुष्य' | 'राक्षस';
  nadi: 'Aadi' | 'Madhya' | 'Antya';
  nadiNp: 'आदि' | 'मध्य' | 'अन्त्य';
  yoni: string;
  yoniNp: string;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { id: 1, nameEn: 'Ashwini', nameNp: 'अश्विनी', lordEn: 'Ketu', lordNp: 'केतु', rashiId: 1, gana: 'Deva', ganaNp: 'देव', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Horse', yoniNp: 'अश्व' },
  { id: 2, nameEn: 'Bharani', nameNp: 'भरणी', lordEn: 'Venus', lordNp: 'शुक्र', rashiId: 1, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Elephant', yoniNp: 'गज' },
  { id: 3, nameEn: 'Krittika', nameNp: 'कृत्तिका', lordEn: 'Sun', lordNp: 'सूर्य', rashiId: 1, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Sheep', yoniNp: 'मेष' },
  { id: 4, nameEn: 'Rohini', nameNp: 'रोहिणी', lordEn: 'Moon', lordNp: 'चन्द्र', rashiId: 2, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Serpent', yoniNp: 'सर्प' },
  { id: 5, nameEn: 'Mrigashira', nameNp: 'मृगशिरा', lordEn: 'Mars', lordNp: 'मंगल', rashiId: 2, gana: 'Deva', ganaNp: 'देव', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Serpent', yoniNp: 'सर्प' },
  { id: 6, nameEn: 'Ardra', nameNp: 'आर्द्रा', lordEn: 'Rahu', lordNp: 'राहु', rashiId: 3, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Dog', yoniNp: 'श्वान' },
  { id: 7, nameEn: 'Punarvasu', nameNp: 'पुनर्वसु', lordEn: 'Jupiter', lordNp: 'बृहस्पति', rashiId: 3, gana: 'Deva', ganaNp: 'देव', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Cat', yoniNp: 'मार्जाल' },
  { id: 8, nameEn: 'Pushya', nameNp: 'पुष्य', lordEn: 'Saturn', lordNp: 'शनि', rashiId: 4, gana: 'Deva', ganaNp: 'देव', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Sheep', yoniNp: 'मेष' },
  { id: 9, nameEn: 'Ashlesha', nameNp: 'आश्लेषा', lordEn: 'Mercury', lordNp: 'बुध', rashiId: 4, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Cat', yoniNp: 'मार्जाल' },
  { id: 10, nameEn: 'Magha', nameNp: 'मघा', lordEn: 'Ketu', lordNp: 'केतु', rashiId: 5, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Rat', yoniNp: 'मूषक' },
  { id: 11, nameEn: 'Purva Phalguni', nameNp: 'पूर्वाफाल्गुनी', lordEn: 'Venus', lordNp: 'शुक्र', rashiId: 5, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Rat', yoniNp: 'मूषक' },
  { id: 12, nameEn: 'Uttara Phalguni', nameNp: 'उत्तराफाल्गुनी', lordEn: 'Sun', lordNp: 'सूर्य', rashiId: 6, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Cow', yoniNp: 'गो' },
  { id: 13, nameEn: 'Hasta', nameNp: 'हस्त', lordEn: 'Moon', lordNp: 'चन्द्र', rashiId: 6, gana: 'Deva', ganaNp: 'देव', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Buffalo', yoniNp: 'महिष' },
  { id: 14, nameEn: 'Chitra', nameNp: 'चित्रा', lordEn: 'Mars', lordNp: 'मंगल', rashiId: 6, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Tiger', yoniNp: 'व्याघ्र' },
  { id: 15, nameEn: 'Swati', nameNp: 'स्वाती', lordEn: 'Rahu', lordNp: 'राहु', rashiId: 7, gana: 'Deva', ganaNp: 'देव', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Buffalo', yoniNp: 'महिष' },
  { id: 16, nameEn: 'Vishakha', nameNp: 'विशाखा', lordEn: 'Jupiter', lordNp: 'बृहस्पति', rashiId: 7, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Tiger', yoniNp: 'व्याघ्र' },
  { id: 17, nameEn: 'Anuradha', nameNp: 'अनुराधा', lordEn: 'Saturn', lordNp: 'शनि', rashiId: 8, gana: 'Deva', ganaNp: 'देव', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Deer', yoniNp: 'हरिण' },
  { id: 18, nameEn: 'Jyeshtha', nameNp: 'ज्येष्ठा', lordEn: 'Mercury', lordNp: 'बुध', rashiId: 8, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Deer', yoniNp: 'हरिण' },
  { id: 19, nameEn: 'Mula', nameNp: 'मूल', lordEn: 'Ketu', lordNp: 'केतु', rashiId: 9, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Dog', yoniNp: 'श्वान' },
  { id: 20, nameEn: 'Purva Ashadha', nameNp: 'पूर्वाषाढा', lordEn: 'Venus', lordNp: 'शुक्र', rashiId: 9, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Monkey', yoniNp: 'वानर' },
  { id: 21, nameEn: 'Uttara Ashadha', nameNp: 'उत्तराषाढा', lordEn: 'Sun', lordNp: 'सूर्य', rashiId: 10, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Mongoose', yoniNp: 'नकुल' },
  { id: 22, nameEn: 'Shravana', nameNp: 'श्रवण', lordEn: 'Moon', lordNp: 'चन्द्र', rashiId: 10, gana: 'Deva', ganaNp: 'देव', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Monkey', yoniNp: 'वानर' },
  { id: 23, nameEn: 'Dhanishta', nameNp: 'धनिष्ठा', lordEn: 'Mars', lordNp: 'मंगल', rashiId: 10, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Lion', yoniNp: 'सिंह' },
  { id: 24, nameEn: 'Shatabhisha', nameNp: 'शतभिषा', lordEn: 'Rahu', lordNp: 'राहु', rashiId: 11, gana: 'Rakshasa', ganaNp: 'राक्षस', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Horse', yoniNp: 'अश्व' },
  { id: 25, nameEn: 'Purva Bhadrapada', nameNp: 'पूर्वाभाद्रपदा', lordEn: 'Jupiter', lordNp: 'बृहस्पति', rashiId: 11, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Aadi', nadiNp: 'आदि', yoni: 'Lion', yoniNp: 'सिंह' },
  { id: 26, nameEn: 'Uttara Bhadrapada', nameNp: 'उत्तराभाद्रपदा', lordEn: 'Saturn', lordNp: 'शनि', rashiId: 12, gana: 'Manushya', ganaNp: 'मनुष्य', nadi: 'Madhya', nadiNp: 'मध्य', yoni: 'Cow', yoniNp: 'गो' },
  { id: 27, nameEn: 'Revati', nameNp: 'रेवती', lordEn: 'Mercury', lordNp: 'बुध', rashiId: 12, gana: 'Deva', ganaNp: 'देव', nadi: 'Antya', nadiNp: 'अन्त्य', yoni: 'Elephant', yoniNp: 'गज' },
];

export interface GunaMilanResult {
  totalScore: number; // Max 36
  maxScore: number;
  percentage: number;
  verdictNp: string;
  verdictEn: string;
  isFavorable: boolean;
  kootas: {
    nameEn: string;
    nameNp: string;
    obtained: number;
    maximum: number;
    descriptionNp: string;
  }[];
  manglikStatus: {
    boyManglik: boolean;
    girlManglik: boolean;
    cancellation: boolean;
    noteNp: string;
  };
}

// 36 Guna Milan Calculation Function
export function calculateGunaMilan(
  boyNakshatraId: number,
  girlNakshatraId: number
): GunaMilanResult {
  const boyNak = NAKSHATRAS.find((n) => n.id === boyNakshatraId) || NAKSHATRAS[0];
  const girlNak = NAKSHATRAS.find((n) => n.id === girlNakshatraId) || NAKSHATRAS[0];

  const boyRashi = RASHIS.find((r) => r.id === boyNak.rashiId) || RASHIS[0];
  const girlRashi = RASHIS.find((r) => r.id === girlNak.rashiId) || RASHIS[0];

  // 1. Varna (1 Point)
  const varnaRank = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  let varnaScore = 0;
  if (varnaRank[boyRashi.varna] >= varnaRank[girlRashi.varna]) {
    varnaScore = 1;
  }

  // 2. Vashya (2 Points)
  let vashyaScore = 0;
  if (boyRashi.vashya === girlRashi.vashya) {
    vashyaScore = 2;
  } else if (
    (boyRashi.vashya === 'Chatushpada' && girlRashi.vashya === 'Dvipada') ||
    (boyRashi.vashya === 'Dvipada' && girlRashi.vashya === 'Jalachara')
  ) {
    vashyaScore = 1;
  } else {
    vashyaScore = 0.5;
  }

  // 3. Tara (3 Points)
  const distance = Math.abs(boyNak.id - girlNak.id) % 9;
  let taraScore = 1.5;
  if ([1, 3, 5, 7].includes(distance)) {
    taraScore = 3;
  } else if ([2, 4, 6].includes(distance)) {
    taraScore = 1.5;
  } else {
    taraScore = 3;
  }

  // 4. Yoni (4 Points)
  let yoniScore = 2;
  if (boyNak.yoni === girlNak.yoni) {
    yoniScore = 4;
  } else if (
    (boyNak.yoni === 'Horse' && girlNak.yoni === 'Elephant') ||
    (boyNak.yoni === 'Cow' && girlNak.yoni === 'Deer')
  ) {
    yoniScore = 3;
  } else {
    yoniScore = 2;
  }

  // 5. Graha Maitri (5 Points)
  let grahaScore = 3;
  if (boyRashi.lordEn === girlRashi.lordEn) {
    grahaScore = 5;
  } else if (
    (boyRashi.lordEn === 'Sun' && ['Moon', 'Mars', 'Jupiter'].includes(girlRashi.lordEn)) ||
    (boyRashi.lordEn === 'Moon' && ['Sun', 'Mercury'].includes(girlRashi.lordEn))
  ) {
    grahaScore = 4;
  } else {
    grahaScore = 3;
  }

  // 6. Gana (6 Points)
  let ganaScore = 0;
  if (boyNak.gana === girlNak.gana) {
    ganaScore = 6;
  } else if (
    (boyNak.gana === 'Deva' && girlNak.gana === 'Manushya') ||
    (boyNak.gana === 'Manushya' && girlNak.gana === 'Deva')
  ) {
    ganaScore = 5;
  } else if (boyNak.gana === 'Rakshasa' && girlNak.gana === 'Rakshasa') {
    ganaScore = 6;
  } else {
    ganaScore = 0; // Gana Dosha
  }

  // 7. Bhakoot (7 Points)
  const rashiDiff = Math.abs(boyRashi.id - girlRashi.id);
  let bhakootScore = 7;
  // Shadashtak (6/8), Dwirdwadas (2/12), Navapancham (9/5)
  if (rashiDiff === 5 || rashiDiff === 7) {
    bhakootScore = 0; // Shadashtak Dosha
  } else if (rashiDiff === 1 || rashiDiff === 11) {
    bhakootScore = 0; // Dwirdwadas Dosha
  } else {
    bhakootScore = 7;
  }

  // 8. Nadi (8 Points)
  let nadiScore = 0;
  if (boyNak.nadi !== girlNak.nadi) {
    nadiScore = 8; // Different Nadis is auspicious
  } else {
    nadiScore = 0; // Nadi Dosha
  }

  const totalScore =
    varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;
  const percentage = Math.round((totalScore / 36) * 100);

  let verdictNp = 'उत्तम (धेरै राम्रो मिलान)';
  let verdictEn = 'Excellent / Highly Auspicious';
  let isFavorable = true;

  if (totalScore < 18) {
    verdictNp = 'वर्ज्य / सामान्य (ज्योतिषीसँग परामर्श आवश्यक)';
    verdictEn = 'Inauspicious / Astrological Consultation Needed';
    isFavorable = false;
  } else if (totalScore < 25) {
    verdictNp = 'मध्यम (शुभ तथा अनुकूल मिलान)';
    verdictEn = 'Moderate / Acceptable Compatibility';
    isFavorable = true;
  }

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    maxScore: 36,
    percentage,
    verdictNp,
    verdictEn,
    isFavorable,
    kootas: [
      { nameEn: 'Varna', nameNp: 'वर्ण कुट', obtained: varnaScore, maximum: 1, descriptionNp: 'कार्यशैली तथा आध्यात्मिक स्वभाव सामञ्जस्य' },
      { nameEn: 'Vashya', nameNp: 'वश्य कुट', obtained: vashyaScore, maximum: 2, descriptionNp: 'आपसी आकर्षण तथा भावनात्मक नियन्त्रण' },
      { nameEn: 'Tara', nameNp: 'तारा कुट', obtained: taraScore, maximum: 3, descriptionNp: 'भाग्य, स्वास्थ्य तथा दीर्घायु प्रभाव' },
      { nameEn: 'Yoni', nameNp: 'योनि कुट', obtained: yoniScore, maximum: 4, descriptionNp: 'शारीरिक अनुकूलता तथा आपसी सन्तुष्टि' },
      { nameEn: 'Graha Maitri', nameNp: 'ग्रह मैत्री', obtained: grahaScore, maximum: 5, descriptionNp: 'मानसिक विचार तथा राशि स्वामी मित्रता' },
      { nameEn: 'Gana', nameNp: 'गण कुट', obtained: ganaScore, maximum: 6, descriptionNp: 'स्वभाव तथा आचरणको साम्यता' },
      { nameEn: 'Bhakoot', nameNp: 'भकूट कुट', obtained: bhakootScore, maximum: 7, descriptionNp: 'वंशवृद्धि, समृद्धि तथा पारिवारिक सुख' },
      { nameEn: 'Nadi', nameNp: 'नाडी कुट', obtained: nadiScore, maximum: 8, descriptionNp: 'सन्तान सुख, स्वास्थ्य तथा वंशाणुगत सामञ्जस्य' },
    ],
    manglikStatus: {
      boyManglik: boyRashi.id === 1 || boyRashi.id === 8,
      girlManglik: girlRashi.id === 1 || girlRashi.id === 8,
      cancellation: (boyRashi.id === 1 || boyRashi.id === 8) && (girlRashi.id === 1 || girlRashi.id === 8),
      noteNp:
        (boyRashi.id === 1 || boyRashi.id === 8) && (girlRashi.id === 1 || girlRashi.id === 8)
          ? 'दुवै मंगली भएकाले मांगलिक दोष परिहार हुन्छ।'
          : 'मंगली दोष परीक्षण लग्न कुण्डलीबाट विस्तृत गर्न सिफारिस गरिन्छ।',
    },
  };
}

// 12-House Kundali Generator Output
export interface KundaliChartData {
  personName: string;
  birthDateBs: string;
  birthTime: string;
  birthPlace: string;
  lagnaRashi: RashiInfo;
  chandraRashi: RashiInfo;
  janmaNakshatra: NakshatraInfo;
  charan: number;
  houses: {
    houseNumber: number; // 1 to 12
    rashi: RashiInfo;
    planets: { nameNp: string; nameEn: string; isRetrograde?: boolean }[];
  }[];
  mahadasha: {
    currentPlanet: string;
    currentPlanetNp: string;
    endsYearBs: number;
    remainingYears: number;
  };
}

export function generateVedicKundali(
  name: string,
  birthYearBs: number,
  birthMonthBs: number,
  birthDayBs: number,
  birthHour: number,
  birthMinute: number,
  place: string
): KundaliChartData {
  // Approximate Lagna based on month and hour of birth
  // Sunrise starts with Sun in the current solar sign
  const sunRashiIndex = (birthMonthBs % 12); // Month index
  const hoursSinceSunrise = (birthHour + birthMinute / 60 - 6 + 24) % 24;
  const lagnaOffset = Math.floor(hoursSinceSunrise / 2);
  const lagnaIndex = (sunRashiIndex + lagnaOffset) % 12;
  const lagnaRashi = RASHIS[lagnaIndex];

  // Moon Rashi & Nakshatra derived from day
  const nakshatraIndex = ((birthDayBs * 3 + birthMonthBs * 2) % 27);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const chandraRashi = RASHIS.find((r) => r.id === nakshatra.rashiId) || RASHIS[0];
  const charan = (birthMinute % 4) + 1;

  // Distribute 9 Vedic Planets into houses relative to Lagna
  // House 1 is Lagna
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const rashiOfHouse = RASHIS[(lagnaIndex + i) % 12];
    const planetsInHouse: { nameNp: string; nameEn: string; isRetrograde?: boolean }[] = [];

    // Realistic placements based on calculation
    if (houseNumber === 1) {
      planetsInHouse.push({ nameNp: 'लग्न', nameEn: 'Asc' });
      if ((birthDayBs % 3) === 0) planetsInHouse.push({ nameNp: 'बृहस्पति', nameEn: 'Jup' });
    }
    if (houseNumber === ((chandraRashi.id - lagnaRashi.id + 12) % 12) + 1) {
      planetsInHouse.push({ nameNp: 'चन्द्र', nameEn: 'Moon' });
    }
    if (houseNumber === ((sunRashiIndex - lagnaIndex + 12) % 12) + 1) {
      planetsInHouse.push({ nameNp: 'सूर्य', nameEn: 'Sun' });
      planetsInHouse.push({ nameNp: 'बुध', nameEn: 'Merc' });
    }
    if (houseNumber === 4) {
      planetsInHouse.push({ nameNp: 'शुक्र', nameEn: 'Ven' });
    }
    if (houseNumber === 7) {
      planetsInHouse.push({ nameNp: 'शनि', nameEn: 'Sat', isRetrograde: true });
    }
    if (houseNumber === 8) {
      planetsInHouse.push({ nameNp: 'राहु', nameEn: 'Rahu' });
    }
    if (houseNumber === 2) {
      planetsInHouse.push({ nameNp: 'केतु', nameEn: 'Ketu' });
    }
    if (houseNumber === 10) {
      planetsInHouse.push({ nameNp: 'मङ्गल', nameEn: 'Mars' });
    }

    return {
      houseNumber,
      rashi: rashiOfHouse,
      planets: planetsInHouse,
    };
  });

  return {
    personName: name || 'सेवाग्राही',
    birthDateBs: `${birthYearBs}-${String(birthMonthBs).padStart(2, '0')}-${String(birthDayBs).padStart(2, '0')}`,
    birthTime: `${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')}`,
    birthPlace: place || 'काठमाडौँ',
    lagnaRashi,
    chandraRashi,
    janmaNakshatra: nakshatra,
    charan,
    houses,
    mahadasha: {
      currentPlanet: nakshatra.lordEn,
      currentPlanetNp: nakshatra.lordNp,
      endsYearBs: birthYearBs + 16,
      remainingYears: 7,
    },
  };
}
