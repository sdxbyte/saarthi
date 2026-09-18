import React, { useState } from 'react';
import {
  Compass,
  Calculator,
  Coins,
  PhoneCall,
  Copy,
  Check,
  Percent,
  Layers,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { EmergencyContact } from '../../types/sajiloTypes';

interface SajiloToolsTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    titleEn: 'Nepal Police Control',
    titleNp: 'नेपाल प्रहरी नियन्त्रण कक्ष',
    number: '100',
    descriptionEn: 'National Police emergency assistance & incident response',
    descriptionNp: 'आपतकालीन प्रहरी सहयोग तथा घटना सम्बोधन',
    category: 'police',
    tollFree: true,
  },
  {
    id: 'em-2',
    titleEn: 'Traffic Police Helpline',
    titleNp: 'ट्राफिक प्रहरी हेल्पलाइन',
    number: '103',
    descriptionEn: 'Traffic assistance, road blockades & accident reporting',
    descriptionNp: 'सवारी दुर्घटना, जाम तथा ट्राफिक सहायता',
    category: 'police',
    tollFree: true,
  },
  {
    id: 'em-3',
    titleEn: 'Fire Brigade (Damkal)',
    titleNp: 'दमकल (वारुणयन्त्र सेवा)',
    number: '101',
    descriptionEn: 'National fire and rescue service',
    descriptionNp: 'आगलागी नियन्त्रण तथा उद्धार',
    category: 'fire',
    tollFree: true,
  },
  {
    id: 'em-4',
    titleEn: 'Ambulance Service (Central)',
    titleNp: 'एम्बुलेन्स सेवा (केन्द्रीय)',
    number: '102',
    descriptionEn: 'Emergency medical assistance and patient transport',
    descriptionNp: 'आपतकालीन स्वास्थ्य सेवा तथा बिरामी ओसारपसार',
    category: 'medical',
    tollFree: true,
  },
  {
    id: 'em-5',
    titleEn: 'Child Helpline Nepal',
    titleNp: 'बाल हेल्पलाइन नेपाल (बालबालिका खोजतलास)',
    number: '1098',
    descriptionEn: 'Emergency child protection and rescue service',
    descriptionNp: 'बालबालिका संरक्षण, खोजतलास तथा उद्धार सेवा',
    category: 'social',
    tollFree: true,
  },
  {
    id: 'em-6',
    titleEn: 'National Women Commission',
    titleNp: 'राष्ट्रिय महिला आयोग (महिला हेल्पलाइन)',
    number: '1145',
    descriptionEn: 'Domestic violence and gender-based grievance helpline',
    descriptionNp: 'घरेलु तथा लैङ्गिक हिंसा सम्बन्धी उजुरी तथा सहयोग',
    category: 'social',
    tollFree: true,
  },
  {
    id: 'em-7',
    titleEn: 'Armed Police Force (APF)',
    titleNp: 'सशस्त्र प्रहरी बल उद्धार समन्वय',
    number: '1114',
    descriptionEn: 'Disaster response and border security emergency',
    descriptionNp: 'विपद् उद्धार तथा सीमा सुरक्षा समन्वय',
    category: 'police',
    tollFree: true,
  },
  {
    id: 'em-8',
    titleEn: 'Nepal Electricity Authority (No-Light)',
    titleNp: 'नेपाल विद्युत प्राधिकरण (नो-लाइट)',
    number: '1149',
    descriptionEn: 'Power outage and electrical hazard complaints',
    descriptionNp: 'विद्युत अवरोध तथा ट्रान्सफर्मर खराबी उजुरी',
    category: 'utility',
    tollFree: true,
  },
  {
    id: 'em-9',
    titleEn: 'Kathmandu Upatyaka Khanepani (KUKL)',
    titleNp: 'काठमाडौँ उपत्यका खानेपानी लिमिटेड',
    number: '1134',
    descriptionEn: 'Water leakage, pipe burst and supply complaints',
    descriptionNp: 'खानेपानी चुहावट तथा वितरण गुनासो',
    category: 'utility',
    tollFree: true,
  },
  {
    id: 'em-10',
    titleEn: 'Nepal Red Cross Central Blood Bank',
    titleNp: 'नेपाल रेडक्रस केन्द्रीय रक्तसञ्चार सेवा',
    number: '01-4288485',
    descriptionEn: 'Emergency blood requisition and transfusion info',
    descriptionNp: 'आपतकालीन रगत आवश्यकता तथा सोधपुछ',
    category: 'medical',
    tollFree: false,
  },
];

export const SajiloToolsTab: React.FC<SajiloToolsTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [activeTool, setActiveTool] = useState<'land' | 'gold' | 'vat' | 'emergency'>('land');

  // Land Calculator State
  const [landMode, setLandMode] = useState<'hill' | 'terai' | 'sqft'>('hill');
  const [ropani, setRopani] = useState<number>(1);
  const [aana, setAana] = useState<number>(0);
  const [paisa, setPaisa] = useState<number>(0);
  const [daam, setDaam] = useState<number>(0);

  const [bigha, setBigha] = useState<number>(0);
  const [kattha, setKattha] = useState<number>(0);
  const [dhur, setDhur] = useState<number>(0);

  const [sqFeetInput, setSqFeetInput] = useState<number>(5476);

  // Gold Weight Calculator State
  const [goldWeightVal, setGoldWeightVal] = useState<number>(1);
  const [goldWeightUnit, setGoldWeightUnit] = useState<'tola' | 'gram' | 'lal' | 'ounce'>('tola');

  // VAT & Interest State
  const [vatAmount, setVatAmount] = useState<number>(10000);
  const [vatRate, setVatRate] = useState<number>(13);
  const [isVatInclusive, setIsVatInclusive] = useState<boolean>(false);

  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(1);

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  // Land calculation math
  // 1 Ropani = 5476 sq ft
  // 1 Aana = 342.25 sq ft
  // 1 Paisa = 85.5625 sq ft
  // 1 Daam = 21.390625 sq ft
  const totalSqFeetFromHill =
    (Number(ropani) || 0) * 5476 +
    (Number(aana) || 0) * 342.25 +
    (Number(paisa) || 0) * 85.5625 +
    (Number(daam) || 0) * 21.390625;

  const totalSqMetersFromHill = totalSqFeetFromHill * 0.092903;

  // 1 Bigha = 72900 sq ft
  // 1 Kattha = 3645 sq ft
  // 1 Dhur = 182.25 sq ft
  const totalSqFeetFromTerai =
    (Number(bigha) || 0) * 72900 +
    (Number(kattha) || 0) * 3645 +
    (Number(dhur) || 0) * 182.25;

  // Derive conversions for hill
  const equivalentBigha = (totalSqFeetFromHill / 72900).toFixed(4);
  const equivalentKattha = (totalSqFeetFromHill / 3645).toFixed(2);
  const equivalentDhur = (totalSqFeetFromHill / 182.25).toFixed(2);

  // Gold Conversions
  // 1 tola = 11.6638 grams = 100 lal = 0.375 troy ounce
  let weightInGrams = 11.6638;
  if (goldWeightUnit === 'tola') weightInGrams = (Number(goldWeightVal) || 0) * 11.6638;
  else if (goldWeightUnit === 'gram') weightInGrams = Number(goldWeightVal) || 0;
  else if (goldWeightUnit === 'lal') weightInGrams = ((Number(goldWeightVal) || 0) * 11.6638) / 100;
  else if (goldWeightUnit === 'ounce') weightInGrams = (Number(goldWeightVal) || 0) * 31.1035;

  const resTola = (weightInGrams / 11.6638).toFixed(4);
  const resLal = ((weightInGrams / 11.6638) * 100).toFixed(2);
  const resGram = weightInGrams.toFixed(4);
  const resMilli = (weightInGrams * 1000).toFixed(1);
  const resOunce = (weightInGrams / 31.1035).toFixed(4);

  // VAT Math
  const netVatAmt = isVatInclusive
    ? (vatAmount * vatRate) / (100 + vatRate)
    : (vatAmount * vatRate) / 100;
  const netBaseAmt = isVatInclusive ? vatAmount - netVatAmt : vatAmount;
  const grossVatAmt = isVatInclusive ? vatAmount : vatAmount + netVatAmt;

  // Simple Interest
  const simpleInterest = (principal * interestRate * tenureYears) / 100;
  const simpleTotal = principal + simpleInterest;

  return (
    <div className="space-y-6">
      {/* Tool Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#262a31] pb-3">
        {[
          { id: 'land', labelEn: 'Land Area Calculator', labelNp: 'जग्गा क्षेत्रफल क्याल्कुलेटर', icon: Compass },
          { id: 'gold', labelEn: 'Gold & Silver Weight', labelNp: 'सुनचाँदी तौल रूपान्तरण', icon: Coins },
          { id: 'vat', labelEn: 'VAT & Interest Math', labelNp: 'भ्याट तथा ब्याज हिसाब', icon: Percent },
          { id: 'emergency', labelEn: 'Emergency Directory', labelNp: 'आपतकालीन सम्पर्क', icon: PhoneCall },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isActive
                  ? 'bg-[#00e599] text-[#0a0b0d] shadow-md'
                  : 'bg-[#14161b] text-[#8b909b] hover:text-[#edeef0] border border-[#262a31]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? t.labelNp : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Land Area Converter */}
      {activeTool === 'land' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
            <h3 className="font-bold text-sm text-[#edeef0]">
              {currentLang === 'ne' ? 'नेपाली जग्गा नाप तथा क्षेत्रफल रूपान्तरण' : 'Nepal Land Area Measuring & Conversion Engine'}
            </h3>
            <p className="text-xs text-[#8b909b] mt-0.5">
              {currentLang === 'ne'
                ? 'पहाडी प्रणाली (रोपनी-आना-पैसा-दाम) तथा तराई प्रणाली (बिघा-कट्ठा-धुर) बीच प्रत्यक्ष रूपान्तरण'
                : 'Bidirectional conversion between Hill (Ropani-Aana-Paisa-Daam) & Terai (Bigha-Kattha-Dhur)'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Card: Hill System */}
            <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
                  {currentLang === 'ne' ? 'पहाडी प्रणाली (Hill System)' : 'Hill System Input'}
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                  १ रोपनी = १६ आना
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#8b909b] block mb-1">Ropani (रोपनी)</label>
                  <input
                    type="number"
                    min="0"
                    value={ropani}
                    onChange={(e) => setRopani(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-sm text-[#edeef0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#8b909b] block mb-1">Aana (आना)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={aana}
                    onChange={(e) => setAana(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-sm text-[#edeef0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#8b909b] block mb-1">Paisa (पैसा)</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={paisa}
                    onChange={(e) => setPaisa(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-sm text-[#edeef0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#8b909b] block mb-1">Daam (दाम)</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={daam}
                    onChange={(e) => setDaam(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-sm text-[#edeef0] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1d24] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8b909b]">Total Square Feet:</span>
                  <span className="font-mono font-bold text-[#edeef0]">
                    {formatDigits(totalSqFeetFromHill.toLocaleString(undefined, { maximumFractionDigits: 2 }))} sq. ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b909b]">Total Square Meters:</span>
                  <span className="font-mono font-bold text-[#00e599]">
                    {formatDigits(totalSqMetersFromHill.toLocaleString(undefined, { maximumFractionDigits: 2 }))} sq. m
                  </span>
                </div>
              </div>
            </div>

            {/* Output Card: Equivalent Terai & Standard Values */}
            <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
                {currentLang === 'ne' ? 'तराई तथा अन्तर्राष्ट्रिय रूपान्तरण' : 'Equivalent Terai & Metric Dimensions'}
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
                  <span className="text-[10px] text-[#8b909b] block">Bigha (बिघा)</span>
                  <span className="text-base font-bold font-mono text-[#edeef0]">{formatDigits(equivalentBigha)}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
                  <span className="text-[10px] text-[#8b909b] block">Kattha (कट्ठा)</span>
                  <span className="text-base font-bold font-mono text-[#edeef0]">{formatDigits(equivalentKattha)}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
                  <span className="text-[10px] text-[#8b909b] block">Dhur (धुर)</span>
                  <span className="text-base font-bold font-mono text-[#00e599]">{formatDigits(equivalentDhur)}</span>
                </div>
              </div>

              {/* Reference Table */}
              <div className="text-[10px] font-mono text-[#8b909b] bg-[#171a21] p-3 rounded-xl space-y-1">
                <div className="font-bold text-[#edeef0] mb-1">Standard Government Units:</div>
                <div>• १ रोपनी = १६ आना = ६४ पैसा = २५६ दाम (५४७६ वर्ग फिट / ५०८.७२ वर्ग मिटर)</div>
                <div>• १ बिघा = २० कट्ठा = ४०० धुर (७२९०० वर्ग फिट / ६७७२.४१ वर्ग मिटर)</div>
                <div>• १ आना = ४ पैसा = १६ दाम (३४२.२५ वर्ग फिट / ३१.८० वर्ग मिटर)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Gold & Silver Weight Converter */}
      {activeTool === 'gold' && (
        <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#edeef0]">
                {currentLang === 'ne' ? 'सुन तथा चाँदी तौल रूपान्तरण' : 'Gold & Bullion Weight Unit Converter'}
              </h3>
              <p className="text-xs text-[#8b909b]">
                {currentLang === 'ne'
                  ? 'तोला, लाल, ग्राम, मिलिग्राम र औंस बीचको आधिकारिक रूपान्तरण'
                  : 'Convert accurately between Tola, Lal, Grams, Milligrams, and Troy Ounce'}
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              १ तोला = ११.६६३८ ग्राम = १०० लाल
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#edeef0] block mb-1">Weight Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={goldWeightVal}
                onChange={(e) => setGoldWeightVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm font-mono text-[#edeef0] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#edeef0] block mb-1">Unit</label>
              <select
                value={goldWeightUnit}
                onChange={(e) => setGoldWeightUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-sm text-[#edeef0] outline-none"
              >
                <option value="tola">Tola (तोला)</option>
                <option value="gram">Grams (ग्राम)</option>
                <option value="lal">Lal (लाल)</option>
                <option value="ounce">Troy Ounce (औंस)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
              <span className="text-[10px] text-[#8b909b] block">Tola (तोला)</span>
              <span className="text-sm font-bold font-mono text-amber-400">{formatDigits(resTola)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
              <span className="text-[10px] text-[#8b909b] block">Lal (लाल)</span>
              <span className="text-sm font-bold font-mono text-[#edeef0]">{formatDigits(resLal)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
              <span className="text-[10px] text-[#8b909b] block">Grams (ग्राम)</span>
              <span className="text-sm font-bold font-mono text-[#00e599]">{formatDigits(resGram)} g</span>
            </div>
            <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
              <span className="text-[10px] text-[#8b909b] block">Milligrams</span>
              <span className="text-sm font-bold font-mono text-[#edeef0]">{formatDigits(resMilli)} mg</span>
            </div>
            <div className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31]">
              <span className="text-[10px] text-[#8b909b] block">Troy Ounce</span>
              <span className="text-sm font-bold font-mono text-[#edeef0]">{formatDigits(resOunce)} oz</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. VAT & Interest Math */}
      {activeTool === 'vat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* VAT Card */}
          <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
                {currentLang === 'ne' ? '१३% मूल्य अभिवृद्धि कर (VAT)' : 'Nepal 13% VAT Calculator'}
              </h4>
              <span className="text-[10px] font-mono text-[#00e599] bg-emerald-500/15 px-2 py-0.5 rounded">
                Standard Nepal Rate 13%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#8b909b] block mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  min="0"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] font-mono text-sm text-[#edeef0] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#edeef0]">
                  <input
                    type="radio"
                    name="vatMode"
                    checked={!isVatInclusive}
                    onChange={() => setIsVatInclusive(false)}
                    className="accent-[#00e599]"
                  />
                  <span>VAT Exclusive (कर बाहेक)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#edeef0]">
                  <input
                    type="radio"
                    name="vatMode"
                    checked={isVatInclusive}
                    onChange={() => setIsVatInclusive(true)}
                    className="accent-[#00e599]"
                  />
                  <span>VAT Inclusive (कर सहित)</span>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1d24] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8b909b]">Base Amount:</span>
                  <span className="font-mono text-[#edeef0]">रू. {formatDigits(netBaseAmt.toFixed(2))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b909b]">VAT 13%:</span>
                  <span className="font-mono text-amber-400">रू. {formatDigits(netVatAmt.toFixed(2))}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#262a31] font-bold">
                  <span className="text-[#edeef0]">Total Amount:</span>
                  <span className="font-mono text-[#00e599]">रू. {formatDigits(grossVatAmt.toFixed(2))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Interest Card */}
          <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-[#edeef0]">
              {currentLang === 'ne' ? 'साधारण ब्याज क्याल्कुलेटर (Interest)' : 'Simple Interest Calculator'}
            </h4>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-[#8b909b] block mb-1">Principal (साँवा)</label>
                <input
                  type="number"
                  min="0"
                  value={principal}
                  onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-xs text-[#edeef0] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8b909b] block mb-1">Rate % (वार्षिक)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-xs text-[#edeef0] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8b909b] block mb-1">Years (वर्ष)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#1a1d24] border border-[#262a31] font-mono text-xs text-[#edeef0] outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1a1d24] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8b909b]">Interest Earned / Due:</span>
                <span className="font-mono text-amber-400">रू. {formatDigits(simpleInterest.toFixed(2))}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#262a31] font-bold">
                <span className="text-[#edeef0]">Maturity Total (साँवा + ब्याज):</span>
                <span className="font-mono text-[#00e599]">रू. {formatDigits(simpleTotal.toFixed(2))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Emergency Directory */}
      {activeTool === 'emergency' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#edeef0]">
                {currentLang === 'ne' ? 'नेपाल आपतकालीन सम्पर्क निर्देशिका' : 'Nepal National Emergency & Helpline Directory'}
              </h3>
              <p className="text-xs text-[#8b909b]">
                {currentLang === 'ne'
                  ? 'चौबिसै घण्टा २४/७ सञ्चालन हुने आपतकालीन हटलाइनहरू'
                  : 'Official 24/7 emergency toll-free short codes and essential services'}
              </p>
            </div>
            <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
              Emergency 24/7 Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EMERGENCY_CONTACTS.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/30 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-[#edeef0]">
                      {currentLang === 'ne' ? item.titleNp : item.titleEn}
                    </h4>
                    {item.tollFree && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 shrink-0">
                        Toll Free
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8b909b] mt-1">
                    {currentLang === 'ne' ? item.descriptionNp : item.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#262a31]/60">
                  <span className="text-lg font-black font-mono text-[#00e599] tracking-wider">
                    {item.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.number, item.id)}
                      className="p-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] text-[#8b909b] hover:text-[#edeef0] transition-colors"
                      title="Copy Number"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#00e599]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`tel:${item.number}`}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
