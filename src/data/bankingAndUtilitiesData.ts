import {
  BankInfo,
  ForexRate,
  GoldSilverRate,
  FuelPrice,
  RemittanceRate,
  EmergencyContact,
  EmbassyItem,
} from '../types';

export const MOCK_BANKS: BankInfo[] = [
  { id: 'b1', name: 'Nabil Bank Ltd.', classType: 'Class A Commercial', swiftCode: 'NARBNPKA', headOffice: 'Kathmandu', phone: '01-4227181', savingsInterestRate: '5.25%', fdInterestRate: '7.75%', branchesCount: 268 },
  { id: 'b2', name: 'Global IME Bank Ltd.', classType: 'Class A Commercial', swiftCode: 'GLBNNPKA', headOffice: 'Kathmandu', phone: '01-5970600', savingsInterestRate: '5.50%', fdInterestRate: '8.00%', branchesCount: 355 },
  { id: 'b3', name: 'NIC Asia Bank Ltd.', classType: 'Class A Commercial', swiftCode: 'NICANPKA', headOffice: 'Kathmandu', phone: '01-5970101', savingsInterestRate: '5.60%', fdInterestRate: '8.10%', branchesCount: 360 },
  { id: 'b4', name: 'Rastriya Banijya Bank (RBB)', classType: 'Class A Commercial', swiftCode: 'RBBANPKA', headOffice: 'Kathmandu', phone: '01-4252555', savingsInterestRate: '5.00%', fdInterestRate: '7.50%', branchesCount: 285 },
  { id: 'b5', name: 'Sanima Bank Ltd.', classType: 'Class A Commercial', swiftCode: 'SANINPKA', headOffice: 'Naxal, Kathmandu', phone: '01-4428979', savingsInterestRate: '5.15%', fdInterestRate: '7.85%', branchesCount: 132 },
  { id: 'b6', name: 'Garima Bikas Bank Ltd.', classType: 'Class B Development', swiftCode: 'GBBLNPKA', headOffice: 'Lazimpat, Kathmandu', phone: '01-4445424', savingsInterestRate: '6.00%', fdInterestRate: '8.75%', branchesCount: 123 },
];

export const MOCK_FOREX: ForexRate[] = [
  { code: 'USD', name: 'US Dollar', unit: 1, buy: 152.39, sell: 152.99, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', unit: 1, buy: 176.06, sell: 176.75, flag: '🇪🇺' },
  { code: 'GBP', name: 'Pound Sterling', unit: 1, buy: 198.40, sell: 199.18, flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', unit: 1, buy: 100.55, sell: 100.96, flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', unit: 1, buy: 106.50, sell: 106.94, flag: '🇨🇦' },
  { code: 'SGD', name: 'Singapore Dollar', unit: 1, buy: 115.40, sell: 115.85, flag: '🇸🇬' },
  { code: 'QAR', name: 'Qatari Riyal', unit: 1, buy: 41.80, sell: 41.97, flag: '🇶🇦' },
  { code: 'AED', name: 'UAE Dirham', unit: 1, buy: 41.48, sell: 41.65, flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', unit: 1, buy: 40.60, sell: 40.76, flag: '🇸🇦' },
  { code: 'MYR', name: 'Malaysian Ringgit', unit: 1, buy: 34.80, sell: 34.94, flag: '🇲🇾' },
  { code: 'INR', name: 'Indian Rupee', unit: 100, buy: 160.00, sell: 160.15, flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', unit: 10, buy: 9.85, sell: 9.90, flag: '🇯🇵' },
];

export const MOCK_GOLD_SILVER: GoldSilverRate[] = [
  { item: 'Fine Gold (Hallmark 9999)', itemNp: 'छापावाल सुन (प्रति तोला)', perTola: 305200, perTenGram: 261660, change: 3500 },
  { item: 'Tejabi Gold', itemNp: 'तेजाबी सुन (प्रति तोला)', perTola: 302100, perTenGram: 259043, change: 3400 },
  { item: 'Silver', itemNp: 'चाँदी (प्रति तोला)', perTola: 4710, perTenGram: 4038, change: 65 },
];

export const MOCK_FUEL: FuelPrice[] = [
  { item: 'Petrol (Category III)', itemNp: 'पेट्रोल (काठमाडौं, पोखरा, दिपायल)', priceNpr: 197.0, unit: 'Litre', change: 2.0 },
  { item: 'Diesel & Kerosene', itemNp: 'डिजेल तथा मट्टितेल (प्रति लिटर)', priceNpr: 195.0, unit: 'Litre', change: 2.5 },
  { item: 'LP Gas Cylinder', itemNp: 'एलपी ग्यास (प्रति १४.२ केजी सिलिन्डर)', priceNpr: 2060.0, unit: '14.2 kg Cylinder', change: 150 },
  { item: 'Aviation Turbine Fuel (Internal)', itemNp: 'हवाई इन्धन (आन्तरिक उडान)', priceNpr: 229.0, unit: 'Litre', change: 10.0 },
];

export const MOCK_REMITTANCE: RemittanceRate[] = [
  { provider: 'IME Pay / IME Remit', sendAmountUSD: 500, payoutNPR: 76150, ratePerUSD: 152.30, transferFeeUSD: 2.99, speed: 'Instant' },
  { provider: 'Prabhu Remit', sendAmountUSD: 500, payoutNPR: 76100, ratePerUSD: 152.20, transferFeeUSD: 3.50, speed: 'Instant to Bank / eSewa' },
  { provider: 'eSewa Remit', sendAmountUSD: 500, payoutNPR: 76200, ratePerUSD: 152.40, transferFeeUSD: 1.99, speed: 'Instant Mobile Wallet' },
  { provider: 'Western Union', sendAmountUSD: 500, payoutNPR: 75750, ratePerUSD: 151.50, transferFeeUSD: 4.99, speed: 'Within 1 Hour' },
  { provider: 'Remitly', sendAmountUSD: 500, payoutNPR: 76250, ratePerUSD: 152.50, transferFeeUSD: 0.00, speed: 'Express (Few Mins)' },
];

export const MOCK_EMERGENCY: EmergencyContact[] = [
  { id: 'e1', name: 'Nepal Police Control', nameNp: 'नेपाल प्रहरी नियन्त्रण कक्ष', category: 'Police', number: '100', location: 'Nationwide', description: 'Immediate emergency police dispatch' },
  { id: 'e2', name: 'Nepal Fire Brigade', nameNp: 'दमकल / वारुणयन्त्र', category: 'Fire', number: '101', location: 'Kathmandu / All Districts', description: 'Fire emergency and rescue' },
  { id: 'e3', name: 'Red Cross Ambulance Service', nameNp: 'रेडक्रस एम्बुलेन्स सेवा', category: 'Emergency', number: '102', location: 'Nationwide', description: '24/7 central medical ambulance hotline' },
  { id: 'e4', name: 'Traffic Police Hotline', nameNp: 'ट्राफिक प्रहरी सूचना केन्द्र', category: 'Police', number: '103', location: 'Kathmandu Valley', description: 'Road accident and traffic emergency' },
  { id: 'e5', name: 'Bir Hospital Emergency', nameNp: 'वीर अस्पताल आकस्मिक कक्ष', category: 'Hospital', number: '01-4221988', location: 'Tundikhel, Kathmandu', description: 'Central public emergency trauma center' },
  { id: 'e6', name: 'Teaching Hospital (TUIOM)', nameNp: 'त्रिवि शिक्षण अस्पताल', category: 'Hospital', number: '01-4412303', location: 'Maharajgunj, Kathmandu', description: '24-hour emergency casualty unit' },
  { id: 'e7', name: 'Nepal Blood Bank Center', nameNp: 'केन्द्रीय रक्तसञ्चार सेवा', category: 'Helpline', number: '01-4225344', location: 'Brikutimandap, Kathmandu', description: 'Emergency blood availability search' },
];

export const MOCK_EMBASSIES: EmbassyItem[] = [
  { country: 'United States Embassy', location: 'Maharajgunj, Kathmandu', phone: '01-4234000', email: 'consktm@state.gov', website: 'np.usembassy.gov', emergencyLine: '01-4234000' },
  { country: 'Embassy of India', location: 'Lainchaur, Kathmandu', phone: '01-4410900', email: 'emb.kathmandu@mea.gov.in', website: 'indembkathmandu.gov.in', emergencyLine: '01-4410900' },
  { country: 'Embassy of Nepal - State of Qatar', location: 'Doha, Qatar', phone: '+974 44675681', email: 'eondoha@mofa.gov.np', website: 'qa.nepalembassy.gov.np', emergencyLine: '+974 55850623' },
  { country: 'Embassy of Nepal - UAE', location: 'Abu Dhabi, UAE', phone: '+971 2 6344767', email: 'eonabudhabi@mofa.gov.np', website: 'ae.nepalembassy.gov.np', emergencyLine: '+971 50 8180903' },
  { country: 'Embassy of Nepal - USA', location: 'Washington D.C., USA', phone: '+1 202 667 4550', email: 'eonwashington@mofa.gov.np', website: 'us.nepalembassy.gov.np', emergencyLine: '+1 202 667 4550' },
];
