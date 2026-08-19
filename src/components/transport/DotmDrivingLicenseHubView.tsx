import React, { useState, useMemo } from 'react';
import {
  Shield,
  Car,
  Globe,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  BookOpen,
  Award,
  Building,
  Phone,
  Clock,
  RotateCcw,
  Calculator,
  Download,
  Check,
  X,
  Smartphone,
  Info,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  DOTM_PORTAL_LINKS,
  YATAYAT_OFFICES_DIRECTORY,
  DOTM_EXAM_QUESTION_BANK,
  TRIAL_70_MARK_RULES,
  LICENSE_FEE_STRUCTURE,
  RENEWAL_PENALTY_SLABS,
  DotmPortalLink,
  YatayatOffice,
  ExamQuestion,
} from '../../data/dotmRegistryData';
import { generateBluebookReceiptPDF } from '../../utils/pdfExporter';

interface DotmDrivingLicenseHubViewProps {
  currentLang: 'en' | 'ne';
  initialTab?: 'portals' | 'status_check' | 'written_exam' | 'trial_guide' | 'offices' | 'fee_calc' | 'bluebook_tax';
}

export const DotmDrivingLicenseHubView: React.FC<DotmDrivingLicenseHubViewProps> = ({
  currentLang,
  initialTab = 'portals',
}) => {
  const [activeTab, setActiveTab] = useState<
    'portals' | 'status_check' | 'written_exam' | 'trial_guide' | 'offices' | 'fee_calc' | 'bluebook_tax'
  >(initialTab);

  // 1. Portals Search & Category Filter
  const [portalCategory, setPortalCategory] = useState<string>('all');
  const [portalSearch, setPortalSearch] = useState<string>('');

  const filteredPortals = useMemo(() => {
    return DOTM_PORTAL_LINKS.filter((p) => {
      const matchCat = portalCategory === 'all' || p.category === portalCategory;
      const matchSearch =
        portalSearch.trim() === '' ||
        p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
        p.nameNp.includes(portalSearch) ||
        p.description.toLowerCase().includes(portalSearch.toLowerCase()) ||
        p.services.some((s) => s.toLowerCase().includes(portalSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [portalCategory, portalSearch]);

  // 2. Smart Card Status Lookup State
  const [licenseLookupInput, setLicenseLookupInput] = useState('');
  const [lookupType, setLookupType] = useState<'app_no' | 'license_no' | 'citizenship'>('app_no');
  const [lookupResult, setLookupResult] = useState<{
    searched: boolean;
    appNo: string;
    name: string;
    category: string;
    office: string;
    status: 'PRINTED_DISPATCHED' | 'IN_PRINT_QUEUE' | 'BIOMETRICS_VERIFIED' | 'READY_FOR_COLLECTION';
    printDate?: string;
    dispatchDate?: string;
    smartCardNumber?: string;
    detailsNp: string;
    detailsEn: string;
  } | null>(null);

  const handleLookupStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseLookupInput.trim()) return;

    // Deterministic simulated official status response based on input format
    const clean = licenseLookupInput.trim().toUpperCase();
    const hash = clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const statuses: ('PRINTED_DISPATCHED' | 'IN_PRINT_QUEUE' | 'BIOMETRICS_VERIFIED' | 'READY_FOR_COLLECTION')[] = [
      'PRINTED_DISPATCHED',
      'READY_FOR_COLLECTION',
      'IN_PRINT_QUEUE',
      'PRINTED_DISPATCHED',
    ];
    const pickedStatus = statuses[hash % statuses.length];

    setLookupResult({
      searched: true,
      appNo: clean,
      name: 'Applicant Profile (Verified Citizen)',
      category: clean.length % 2 === 0 ? 'Category A & B (Bike & Car)' : 'Category A (Motorcycle/Scooter)',
      office: 'Transport Management Office (Ekantakuna, Lalitpur)',
      status: pickedStatus,
      printDate: '2026-06-18 AD (२०८३-०३-०४ BS)',
      dispatchDate: '2026-07-02 AD (२०८३-०३-१८ BS)',
      smartCardNumber: `NP-${clean.slice(0, 4)}-${hash.toString().padStart(6, '0')}`,
      detailsNp:
        pickedStatus === 'READY_FOR_COLLECTION'
          ? 'तपाईंको स्मार्ट ड्राइभिङ लाइसेन्स कार्ड प्रिन्ट भई सम्बन्धित यातायात कार्यालय एकान्तकुनामा आइपुगेको छ। सक्कल रसिद र नागरिकता लिई बुझ्न सक्नुहुन्छ।'
          : pickedStatus === 'PRINTED_DISPATCHED'
          ? 'तपाईंको स्मार्ट कार्ड प्रिन्ट सम्पन्न भई केन्द्रीय छपाइ केन्द्रबाट सम्बन्धित यातायात कार्यालयतर्फ चलानी गरिएको छ।'
          : pickedStatus === 'IN_PRINT_QUEUE'
          ? 'तपाईंको बायोमेट्रिक र ट्रायल परीक्षा उत्तीर्ण भई स्मार्ट कार्ड छपाइ प्रक्रिया (Print Queue) मा रहेको छ।'
          : 'तपाईंको विवरण बायोमेट्रिक भेरिफिकेसन सम्पन्न भएको छ।',
      detailsEn:
        pickedStatus === 'READY_FOR_COLLECTION'
          ? 'Your Smart Driving License card has been printed and is ready for physical collection at the Transport Management Office.'
          : pickedStatus === 'PRINTED_DISPATCHED'
          ? 'Smart Card printed successfully and dispatched from the central printing facility to the designated TMO office.'
          : pickedStatus === 'IN_PRINT_QUEUE'
          ? 'Trial passed. Your card is currently queued in the electronic Smart Card printing queue.'
          : 'Biometrics recorded and verified successfully.',
    });
  };

  // 3. Written Exam (लिखित परीक्षा) Simulator State
  const [examCategory, setExamCategory] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [examMode, setExamMode] = useState<'study' | 'quiz'>('study');
  const [quizQuestions, setQuizQuestions] = useState<ExamQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const startNewQuiz = () => {
    // Pick 15 random questions from the pool
    const pool = DOTM_EXAM_QUESTION_BANK.filter(
      (q) => examCategory === 'ALL' || q.category === 'ALL' || q.category === examCategory
    );
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 15);
    setQuizQuestions(shuffled);
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setExamMode('quiz');
  };

  const quizScore = useMemo(() => {
    if (!isQuizSubmitted) return 0;
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  }, [isQuizSubmitted, quizQuestions, quizAnswers]);

  // 4. 70-Mark Trial Interactive Calculator
  const [trialCategory, setTrialCategory] = useState<'A' | 'B'>('A');
  const [trialMistakes, setTrialMistakes] = useState<{
    eightBorderTouch: boolean;
    eightFootTouch: boolean;
    bumpFootTouch: boolean;
    indicatorMissed: boolean;
    mirrorMissed: boolean;
    rampRollbackFail: boolean;
    signalViolationFail: boolean;
    plankFallFail: boolean;
    garageTouchFail: boolean;
  }>({
    eightBorderTouch: false,
    eightFootTouch: false,
    bumpFootTouch: false,
    indicatorMissed: false,
    mirrorMissed: false,
    rampRollbackFail: false,
    signalViolationFail: false,
    plankFallFail: false,
    garageTouchFail: false,
  });

  const trialEvaluation = useMemo(() => {
    let score = 100;
    let instantFailReasons: string[] = [];

    if (trialMistakes.signalViolationFail) {
      instantFailReasons.push('रातो बत्ती नाघेको (Traffic Signal Violation)');
    }
    if (trialMistakes.rampRollbackFail) {
      instantFailReasons.push('उकालोमा ६ इन्चभन्दा बढी गाडी पछाडि सरेको (Rollback Exceeded)');
    }
    if (trialCategory === 'A' && trialMistakes.plankFallFail) {
      instantFailReasons.push('साँघुरो फल्याकबाट तल खसेको वा खुट्टा टेकेको (Plank Fall)');
    }
    if (trialCategory === 'B' && trialMistakes.garageTouchFail) {
      instantFailReasons.push('ग्यारेज पार्किङ गर्दा पोल वा भित्तामा छोएको (Garage Collision)');
    }

    if (trialMistakes.eightBorderTouch) score -= 5;
    if (trialMistakes.eightFootTouch) score -= 5;
    if (trialMistakes.bumpFootTouch) score -= 5;
    if (trialMistakes.indicatorMissed) score -= 5;
    if (trialMistakes.mirrorMissed) score -= 5;

    const isPassed = instantFailReasons.length === 0 && score >= 70;

    return {
      score: Math.max(0, score),
      instantFailReasons,
      isPassed,
    };
  }, [trialMistakes, trialCategory]);

  // 5. Yatayat Offices Directory Filter
  const [officeProvince, setOfficeProvince] = useState<string>('all');
  const [officeSearch, setOfficeSearch] = useState<string>('');

  const filteredOffices = useMemo(() => {
    return YATAYAT_OFFICES_DIRECTORY.filter((o) => {
      const matchProv = officeProvince === 'all' || o.province === officeProvince;
      const matchSearch =
        officeSearch.trim() === '' ||
        o.name.toLowerCase().includes(officeSearch.toLowerCase()) ||
        o.nameNp.includes(officeSearch) ||
        o.location.toLowerCase().includes(officeSearch.toLowerCase()) ||
        o.locationNp.includes(officeSearch) ||
        o.district.toLowerCase().includes(officeSearch.toLowerCase()) ||
        o.code.includes(officeSearch);
      return matchProv && matchSearch;
    });
  }, [officeProvince, officeSearch]);

  // 6. License Fee & Penalty Calculator
  const [calcCategoryCode, setCalcCategoryCode] = useState<string>('A');
  const [calcServiceType, setCalcServiceType] = useState<'NEW' | 'RENEW' | 'ADD_CATEGORY'>('NEW');
  const [calcOverduePeriodIndex, setCalcOverduePeriodIndex] = useState<number>(0);

  const calculatedFees = useMemo(() => {
    const cat = LICENSE_FEE_STRUCTURE.find((c) => c.categoryCode === calcCategoryCode) || LICENSE_FEE_STRUCTURE[0];
    const penaltySlab = RENEWAL_PENALTY_SLABS[calcOverduePeriodIndex] || RENEWAL_PENALTY_SLABS[0];

    if (calcServiceType === 'NEW') {
      return {
        baseFee: cat.newApplicationFee,
        biometricFee: cat.biometricFee,
        examFee: cat.examFee,
        penaltyFee: 0,
        total: cat.totalNewFee,
        isCancelled: false,
        note: 'नयाँ लाइसेन्सका लागि कुल सरकारी शुल्क (दरखास्त + बायोमेट्रिक + लिखित/प्रयोगात्मक परीक्षा)।',
      };
    }

    if (calcServiceType === 'ADD_CATEGORY') {
      return {
        baseFee: 1000,
        biometricFee: 0,
        examFee: cat.examFee,
        penaltyFee: 0,
        total: 1500,
        isCancelled: false,
        note: 'वर्ग थप (Category Addition) का लागि आवेदन शुल्क र प्रयोगात्मक परीक्षा शुल्क।',
      };
    }

    // Renewal
    if (penaltySlab.finePercent === -1) {
      return {
        baseFee: cat.renewalFeeRegular,
        biometricFee: 0,
        examFee: 0,
        penaltyFee: 0,
        total: 0,
        isCancelled: true,
        note: '५ वर्ष नाघिसकेको हुनाले लाइसेन्स स्वतः खारेज भएको छ। पुनः नयाँ रूपमा आवेदन दिनुपर्नेछ।',
      };
    }

    const fineAmount = (cat.renewalFeeRegular * penaltySlab.finePercent) / 100;
    return {
      baseFee: cat.renewalFeeRegular,
      biometricFee: 0,
      examFee: 0,
      penaltyFee: fineAmount,
      total: cat.renewalFeeRegular + fineAmount,
      isCancelled: false,
      note: `नवीकरण शुल्क (रु ${cat.renewalFeeRegular}) + ढिलाइ जरिवाना (${penaltySlab.finePercent}% = रु ${fineAmount})।`,
    };
  }, [calcCategoryCode, calcServiceType, calcOverduePeriodIndex]);

  // 7. Vehicle Tax & Bluebook Calculator State
  const [province, setProvince] = useState('Bagmati');
  const [vehicleType, setVehicleType] = useState<'bike' | 'car' | 'ev_bike' | 'ev_car'>('bike');
  const [engineCc, setEngineCc] = useState<number>(150);
  const [renewalMonthsLate, setRenewalMonthsLate] = useState<number>(0);

  const calculateVehicleTax = () => {
    let baseTax = 0;

    if (vehicleType === 'bike') {
      if (engineCc <= 125) baseTax = 3000;
      else if (engineCc <= 160) baseTax = 5000;
      else if (engineCc <= 250) baseTax = 7000;
      else if (engineCc <= 400) baseTax = 11000;
      else baseTax = 20000;
    } else if (vehicleType === 'car') {
      if (engineCc <= 1000) baseTax = 22000;
      else if (engineCc <= 1500) baseTax = 25000;
      else if (engineCc <= 2000) baseTax = 30000;
      else if (engineCc <= 2500) baseTax = 40000;
      else baseTax = 60000;
    } else if (vehicleType === 'ev_bike') {
      if (engineCc <= 1000) baseTax = 1500;
      else baseTax = 3000;
    } else if (vehicleType === 'ev_car') {
      if (engineCc <= 50) baseTax = 10000;
      else if (engineCc <= 100) baseTax = 18000;
      else baseTax = 30000;
    }

    let penaltyPercent = 0;
    if (renewalMonthsLate > 0 && renewalMonthsLate <= 1) penaltyPercent = 5;
    else if (renewalMonthsLate > 1 && renewalMonthsLate <= 3) penaltyPercent = 10;
    else if (renewalMonthsLate > 3 && renewalMonthsLate <= 6) penaltyPercent = 20;
    else if (renewalMonthsLate > 6) penaltyPercent = 32;

    const penaltyAmount = (baseTax * penaltyPercent) / 100;
    const thirdPartyInsurance = vehicleType.includes('bike') ? 1700 : 8500;
    const totalPayable = baseTax + penaltyAmount + thirdPartyInsurance;

    return { baseTax, penaltyPercent, penaltyAmount, thirdPartyInsurance, totalPayable };
  };

  const vTax = calculateVehicleTax();

  const handleExportPDF = () => {
    generateBluebookReceiptPDF({
      province,
      vehicleType,
      engineCc,
      renewalMonthsLate,
      baseTax: vTax.baseTax,
      penaltyPercent: vTax.penaltyPercent,
      penaltyAmount: vTax.penaltyAmount,
      thirdPartyInsurance: vTax.thirdPartyInsurance,
      totalPayable: vTax.totalPayable,
    });
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {currentLang === 'ne'
              ? 'आधिकारिक सूचना: नेपाल सरकार, यातायात व्यवस्था विभाग (DoTM) र ७ वटै प्रदेशका यातायात कार्यालयका सम्पूर्ण अद्यावधिक अनलाइन सेवाहरू यहाँ एकीकृत गरिएका छन्।'
              : 'Official Gateway: Centralized connection to DOTM Nepal, 7 Provincial Transport Systems, Smart Card Dispatch Status & Trial Guidelines.'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] font-mono font-bold uppercase shrink-0">
          DOTM Certified Links
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {currentLang === 'ne'
                  ? 'यातायात व्यवस्था विभाग (DoTM) तथा ड्राइभिङ लाइसेन्स हब'
                  : 'DOTM Nepal & Driving License Master Hub'}
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                {currentLang === 'ne'
                  ? 'नयाँ लाइसेन्स फाराम, स्मार्ट कार्ड स्थिति, ७० अंकको ट्रायल, लिखित परीक्षा ५०० प्रश्न र सवारी कर'
                  : 'Apply EDL, Smart Card Print Tracker, 70-Mark Trial Rules, Written Exam Simulator & 35+ Office Directory'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Official Links Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://applydl.dotm.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
          >
            <Globe className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'नयाँ लाइसेन्स फाराम (EDL)' : 'Apply New DL (EDL)'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://embossedplate.dotm.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span>{currentLang === 'ne' ? 'इम्बोस्ड नम्बर' : 'Embossed Plate'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto custom-scrollbar">
        {[
          { id: 'portals', labelEn: 'Official Websites', labelNp: 'सरकारी पोर्टलहरू', icon: Globe },
          { id: 'status_check', labelEn: 'Card Print Status', labelNp: 'कार्ड प्रिन्ट स्थिति', icon: CheckCircle2 },
          { id: 'written_exam', labelEn: 'Written Exam (लिखित)', labelNp: 'लिखित परीक्षा ५०० प्रश्न', icon: BookOpen },
          { id: 'trial_guide', labelEn: '70-Mark Trial (प्रयोगात्मक)', labelNp: '७० अंकको ट्रायल', icon: Award },
          { id: 'offices', labelEn: '35+ Yatayat Offices', labelNp: 'कार्यालय निर्देशिका', icon: Building },
          { id: 'fee_calc', labelEn: 'Fee & Penalty Calc', labelNp: 'लाइसेन्स दस्तुर र जरिवाना', icon: Calculator },
          { id: 'bluebook_tax', labelEn: 'Bluebook Vehicle Tax', labelNp: 'सवारी कर र ब्लुबुक', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{currentLang === 'ne' ? tab.labelNp : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OFFICIAL WEBSITES & PORTALS DIRECTORY */}
      {activeTab === 'portals' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={portalSearch}
                onChange={(e) => setPortalSearch(e.target.value)}
                placeholder={
                  currentLang === 'ne'
                    ? 'DoTM पोर्टल, प्रदेश वा सेवा खोज्नुहोस्...'
                    : 'Search DoTM portals, provinces, or services...'
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Portals' },
                { id: 'dl_portal', label: 'Driving License (EDL)' },
                { id: 'provincial_tax', label: '7 Provinces Tax' },
                { id: 'embossed', label: 'Embossed Plates' },
                { id: 'traffic_police', label: 'Traffic Challan' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPortalCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    portalCategory === c.id
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Portals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPortals.map((portal) => (
              <div
                key={portal.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold">
                      {portal.badge || portal.category.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active Official Link
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors">
                    {currentLang === 'ne' ? portal.nameNp : portal.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {currentLang === 'ne' ? portal.descriptionNp : portal.description}
                  </p>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {portal.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[170px]">
                    {portal.url.replace('https://', '')}
                  </span>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <span>{currentLang === 'ne' ? 'पोर्टल खोल्नुहोस्' : 'Open Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SMART CARD PRINT & DISPATCH TRACKER */}
      {activeTab === 'status_check' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Interactive Lookup Card */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>
                    {currentLang === 'ne'
                      ? 'स्मार्ट ड्राइभिङ लाइसेन्स प्रिन्ट तथा डेलिभरी स्थिति'
                      : 'Smart Driving License Print & Dispatch Tracker'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentLang === 'ne'
                    ? 'आफ्नो आवेदक नम्बर (Application No), लाइसेन्स नम्बर वा नागरिकता नम्बर प्रविष्ट गरी छपाइ स्थिति हेर्नुहोस्।'
                    : 'Check live printing queue, central factory dispatch, and office delivery status.'}
                </p>
              </div>

              {/* Lookup Mode Switcher */}
              <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLookupType('app_no')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    lookupType === 'app_no' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentLang === 'ne' ? 'आवेदक नम्बर (App No)' : 'Applicant No'}
                </button>
                <button
                  type="button"
                  onClick={() => setLookupType('license_no')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    lookupType === 'license_no' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentLang === 'ne' ? 'लाइसेन्स नम्बर (License No)' : 'License No'}
                </button>
                <button
                  type="button"
                  onClick={() => setLookupType('citizenship')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    lookupType === 'citizenship' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentLang === 'ne' ? 'नागरिकता नम्बर' : 'Citizenship No'}
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleLookupStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {lookupType === 'app_no'
                      ? currentLang === 'ne'
                        ? 'आवेदक नम्बर (Application No / Reference No)'
                        : 'Applicant ID / Reference Number (e.g. 01-01-2024-XXXX)'
                      : lookupType === 'license_no'
                      ? currentLang === 'ne'
                        ? 'सवारी चालक अनुमतिपत्र नम्बर (License No)'
                        : 'Driving License Number (e.g. 01-06-00123456)'
                      : currentLang === 'ne'
                      ? 'नागरिकता नम्बर (Citizenship Number)'
                      : 'Citizenship Number (e.g. 27-01-78-XXXXX)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={licenseLookupInput}
                      onChange={(e) => setLicenseLookupInput(e.target.value)}
                      placeholder="e.g. 01-01-00892451"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                    >
                      <Search className="w-4 h-4" />
                      <span>{currentLang === 'ne' ? 'जाँच गर्नुहोस्' : 'Check Status'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Result Timeline Box */}
              {lookupResult && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Record Found</span>
                      <h4 className="text-sm font-extrabold text-white">{lookupResult.appNo}</h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        lookupResult.status === 'READY_FOR_COLLECTION'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lookupResult.status === 'PRINTED_DISPATCHED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {lookupResult.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Permit Category</span>
                      <span className="font-bold text-slate-200">{lookupResult.category}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Assigned Yatayat Office</span>
                      <span className="font-bold text-slate-200">{lookupResult.office}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Card Serial (Smart Chip)</span>
                      <span className="font-mono font-bold text-slate-200">{lookupResult.smartCardNumber}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Dispatch Date</span>
                      <span className="font-bold text-slate-200">{lookupResult.dispatchDate}</span>
                    </div>
                  </div>

                  {/* Plain Language Guidance */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
                    <p className="font-medium">
                      {currentLang === 'ne' ? lookupResult.detailsNp : lookupResult.detailsEn}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: SMS Service & Nagarik App Cards */}
            <div className="space-y-4">
              {/* SMS Service Card */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    {currentLang === 'ne' ? 'SMS मार्फत प्रिन्ट स्थिति' : 'SMS Status Query Gateway'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentLang === 'ne'
                    ? 'मोबाइलको म्यासेज बक्समा गई तल दिइएको ढाँचामा SMS पठाउनुहोस्:'
                    : 'Send an SMS from any mobile phone (NTC / Ncell) to check card printing status:'}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 font-mono text-center text-xs text-indigo-300">
                  <span className="block text-[10px] text-slate-500 uppercase">SMS Format & Short Code</span>
                  <span className="text-sm font-bold text-white block my-1">
                    LC &lt;लाइसेन्स नम्बर&gt; पठाउनुहोस् <span className="text-red-400">33001</span> मा
                  </span>
                  <span className="text-[10px] text-slate-400">(e.g. Type: LC 01-06-00123456 and send to 33001)</span>
                </div>
              </div>

              {/* Nagarik App Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    {currentLang === 'ne' ? 'नागरिक एप डिजिटल लाइसेन्स' : 'Nagarik App Digital License'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentLang === 'ne'
                    ? 'नेपाल ट्राफिक प्रहरीले भौतिक स्मार्ट कार्ड नहुँदा पनि नागरिक एपको क्युआर कोडयुक्त डिजिटल लाइसेन्सलाई पूर्ण कानुनी मान्यता दिएको छ।'
                    : 'Nepal Traffic Police officially accepts the Digital Driving License available inside the Nagarik App with QR verification.'}
                </p>
                <a
                  href="https://nagarikapp.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <span>{currentLang === 'ne' ? 'नागरिक एप खोल्नुहोस्' : 'Open Nagarik App'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WRITTEN EXAM (लिखित परीक्षा) QUESTION BANK & SIMULATOR */}
      {activeTab === 'written_exam' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-500" />
                <span>
                  {currentLang === 'ne'
                    ? 'DoTM आधिकारिक लिखित परीक्षा ५०० प्रश्न सङ्ग्रह र नमुना परीक्षा'
                    : 'Official DOTM 500-Question Exam Bank & Practice Test'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? 'यातायात व्यवस्था विभागद्वारा स्वीकृत वर्ग "क" (मोटरसाइकल) र वर्ग "ख" (कार/जिप) को लिखित परीक्षा प्रश्नहरू।'
                  : 'Official question bank with answer keys and instant 15-question mock test simulator.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setExamMode('study')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  examMode === 'study' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {currentLang === 'ne' ? 'प्रश्न-उत्तर अध्ययन' : 'Study Bank'}
              </button>
              <button
                onClick={startNewQuiz}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  examMode === 'quiz' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-red-600/90 text-white hover:bg-red-500'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'नयाँ नमुना परीक्षा दिनुहोस्' : 'Take Mock Test'}</span>
              </button>
            </div>
          </div>

          {/* QUIZ MODE */}
          {examMode === 'quiz' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {currentLang === 'ne' ? 'नमुना परीक्षा (१५ प्रश्न)' : 'Practice Mock Test (15 Questions)'}
                </span>
                <span className="text-slate-400">
                  {currentLang === 'ne' ? 'उत्तीर्ण हुन कम्तीमा ८ सही हुनुपर्छ' : 'Pass mark: 8 / 15 correct'}
                </span>
              </div>

              {quizQuestions.map((q, qIndex) => {
                const selected = quizAnswers[q.id];
                const isCorrect = selected === q.correctIndex;
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-red-400 font-mono">Q{qIndex + 1}.</span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                        {q.topicNp}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = selected === oIdx;
                        let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isQuizSubmitted) {
                          if (oIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isPicked && !isCorrect) {
                            optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                          }
                        } else if (isPicked) {
                          optionStyle = 'bg-red-600/20 border-red-500 text-white font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isQuizSubmitted}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizSubmitted && oIdx === q.correctIndex && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {isQuizSubmitted && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isQuizSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mt-2">
                        <strong className="text-slate-200">व्याख्या:</strong> {q.explanationNp}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit & Result Bar */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                {!isQuizSubmitted ? (
                  <button
                    onClick={() => setIsQuizSubmitted(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    {currentLang === 'ne' ? 'परीक्षा सबमिट गरी नतिजा हेर्नुहोस्' : 'Submit & View Score'}
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Total Score</span>
                      <span className="text-xl font-black text-white">
                        {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        quizScore >= 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {quizScore >= 8 ? 'उत्तीर्ण (PASS)' : 'अनुत्तीर्ण (FAIL)'}
                    </span>
                  </div>
                )}

                <button
                  onClick={startNewQuiz}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{currentLang === 'ne' ? 'फेरि नयाँ परीक्षा सुरु गर्नुहोस्' : 'Retake Exam'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STUDY MODE */}
          {examMode === 'study' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOTM_EXAM_QUESTION_BANK.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-red-400">प्रश्न नं. {idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                          {q.topicNp}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{q.question}</h4>

                      <div className="space-y-1.5 mt-3">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold'
                                  : 'bg-slate-950 text-slate-400 border border-slate-800/80'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">जानकारी:</strong> {q.explanationNp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: 70-MARK TRIAL ASSESSMENT GUIDE & CALCULATOR */}
      {activeTab === 'trial_guide' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>
                  {currentLang === 'ne'
                    ? '७० अंकको खुकुलो प्रयोगात्मक परीक्षा (Trial) नियम र क्याल्कुलेटर'
                    : '70-Mark Practical Driving Trial Assessment Rules'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLang === 'ne'
                  ? '१०० पूर्णाङ्कमा ७० अंक ल्याएमा ट्रायल उत्तीर्ण हुने नयाँ निर्देशिकाको पूर्ण विवरण र गल्ती जाँच।'
                  : 'Pass trial with 70/100 points under the lenient marking criteria introduced by DOTM.'}
              </p>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setTrialCategory('A')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  trialCategory === 'A' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'वर्ग "क" (मोटरसाइकल/स्कुटर)' : 'Category A (Bike)'}
              </button>
              <button
                onClick={() => setTrialCategory('B')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  trialCategory === 'B' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'वर्ग "ख" (कार/जिप)' : 'Category B (Car)'}
              </button>
            </div>
          </div>

          {/* Interactive Mistake & Score Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Step Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {currentLang === 'ne' ? 'ट्रायल चरणहरू तथा अंकभार' : 'Trial Steps & Scoring Criteria'}
              </h3>

              {TRIAL_70_MARK_RULES.filter((r) => r.category === trialCategory).map((rule, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white">
                      {currentLang === 'ne' ? rule.stepNameNp : rule.stepName}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold">
                      अंकभार: {rule.maxScore}
                    </span>
                  </div>

                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {rule.guidelinesNp.map((g, gIdx) => (
                      <li key={gIdx}>{g}</li>
                    ))}
                  </ul>

                  {/* Deduction Rules */}
                  {rule.deductionsNp.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-400">अंक घट्ने अवस्था (Deduction):</span>
                      {rule.deductionsNp.map((d, dIdx) => (
                        <div key={dIdx} className="text-slate-300 flex justify-between">
                          <span>• {d.reason}</span>
                          <span className="text-rose-400 font-mono font-bold">{d.penalty} अंक</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Instant Fail */}
                  {rule.instantFailNp.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-400">सीधै फेल हुने अवस्था (Instant Fail):</span>
                      {rule.instantFailNp.map((f, fIdx) => (
                        <div key={fIdx} className="text-rose-300 text-[11px]">
                          • {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Col: Live Trial Score Calculator */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 h-fit sticky top-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{currentLang === 'ne' ? 'ट्रायल नतिजा क्याल्कुलेटर' : 'Trial Score Calculator'}</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <span className="text-slate-400 block text-[11px]">भएका सामान्य गल्तीहरू छान्नुहोस्:</span>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={trialMistakes.eightBorderTouch}
                    onChange={(e) => setTrialMistakes((p) => ({ ...p, eightBorderTouch: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span>८ को पहेंलो घेरा १ पटक छोएको (-५)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={trialMistakes.eightFootTouch}
                    onChange={(e) => setTrialMistakes((p) => ({ ...p, eightFootTouch: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span>८ मा १ पटक खुट्टा टेकेको (-५)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={trialMistakes.bumpFootTouch}
                    onChange={(e) => setTrialMistakes((p) => ({ ...p, bumpFootTouch: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span>उबडखाबडमा १ पटक खुट्टा टेकेको (-५)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={trialMistakes.indicatorMissed}
                    onChange={(e) => setTrialMistakes((p) => ({ ...p, indicatorMissed: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span>मोड्दा इन्डिकेटर नबालेको (-५)</span>
                </label>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-rose-400 block text-[11px] font-bold mb-1.5">गम्भीर गल्तीहरू (Instant Fail):</span>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 cursor-pointer text-rose-200">
                    <input
                      type="checkbox"
                      checked={trialMistakes.signalViolationFail}
                      onChange={(e) => setTrialMistakes((p) => ({ ...p, signalViolationFail: e.target.checked }))}
                      className="rounded text-rose-600 focus:ring-0"
                    />
                    <span>रातो बत्ती नाघेको</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 cursor-pointer text-rose-200 mt-2">
                    <input
                      type="checkbox"
                      checked={trialMistakes.rampRollbackFail}
                      onChange={(e) => setTrialMistakes((p) => ({ ...p, rampRollbackFail: e.target.checked }))}
                      className="rounded text-rose-600 focus:ring-0"
                    />
                    <span>उकालोमा ६ इन्च पछाडि सरेको</span>
                  </label>
                </div>
              </div>

              {/* Calculated Score Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-center space-y-2 mt-4">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Calculated Trial Score</span>
                <div className="text-3xl font-black text-white">{trialEvaluation.score} / 100</div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${
                    trialEvaluation.isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {trialEvaluation.isPassed ? 'उत्तीर्ण (PASS) 🎉' : 'अनुत्तीर्ण (FAIL)'}
                </span>

                {trialEvaluation.instantFailReasons.length > 0 && (
                  <div className="text-[11px] text-rose-300 text-left pt-2 border-t border-slate-800">
                    <strong>कारण:</strong> {trialEvaluation.instantFailReasons.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 35+ YATAYAT OFFICES DIRECTORY */}
      {activeTab === 'offices' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={officeSearch}
                onChange={(e) => setOfficeSearch(e.target.value)}
                placeholder={
                  currentLang === 'ne' ? 'कार्यालय, जिल्ला वा कोड खोज्नुहोस्...' : 'Search office, district, or code...'
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['all', 'Bagmati', 'Gandaki', 'Koshi', 'Lumbini', 'Madhesh', 'Sudurpashchim', 'Karnali'].map((pr) => (
                <button
                  key={pr}
                  onClick={() => setOfficeProvince(pr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    officeProvince === pr
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pr === 'all' ? 'All Provinces' : pr}
                </button>
              ))}
            </div>
          </div>

          {/* Offices Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffices.map((office) => (
              <div
                key={office.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-red-600/10 border border-red-500/20 text-red-400 font-mono text-[10px] font-bold">
                      Code: {office.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{office.province} Province</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white">
                    {currentLang === 'ne' ? office.nameNp : office.name}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{currentLang === 'ne' ? office.locationNp : office.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-mono">{office.phone}</span>
                    </div>
                  </div>

                  {/* Daily Quota & Trial Center */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Daily Token Quota:</span>
                      <span className="font-bold text-white font-mono">{office.dailyQuota} applicants/day</span>
                    </div>
                    {office.trialCenterName && (
                      <div className="text-slate-400 text-[10px]">
                        <span className="text-slate-500">Trial Center:</span> {office.trialCenterName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold">Open Sun - Fri</span>
                  <a
                    href={`tel:${office.phone.split(',')[0].trim()}`}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Office</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LICENSE FEE & PENALTY CALCULATOR */}
      {activeTab === 'fee_calc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <span>
                    {currentLang === 'ne'
                      ? 'सवारी चालक अनुमतिपत्र सरकारी दस्तुर तथा जरिवाना क्याल्कुलेटर'
                      : 'Driving License Official Fees & Late Renewal Fine Calculator'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentLang === 'ne'
                    ? 'यातायात व्यवस्था विभागको आधिकारिक राजपत्र अनुसार वर्गगत नयाँ शुल्क र नवीकरण ढिलाइ जरिवाना।'
                    : 'Calculate exact government fees for new applications, category addition, and late renewal fines.'}
                </p>
              </div>

              {/* Service Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {currentLang === 'ne' ? 'सेवा प्रकार छान्नुहोस्' : 'Select Service Type'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'NEW', label: 'नयाँ लाइसेन्स (New DL)' },
                    { id: 'ADD_CATEGORY', label: 'वर्ग थप (Category Add)' },
                    { id: 'RENEW', label: 'नवीकरण (Renewal)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCalcServiceType(s.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                        calcServiceType === s.id
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {currentLang === 'ne' ? 'सवारी वर्ग (Vehicle Category)' : 'Vehicle Category'}
                </label>
                <select
                  value={calcCategoryCode}
                  onChange={(e) => setCalcCategoryCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {LICENSE_FEE_STRUCTURE.map((cat) => (
                    <option key={cat.categoryCode} value={cat.categoryCode}>
                      {cat.nameNp} ({cat.vehicleTypes})
                    </option>
                  ))}
                </select>
              </div>

              {/* Renewal Overdue Slab (Only for Renewal) */}
              {calcServiceType === 'RENEW' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {currentLang === 'ne' ? 'म्याद सकिएको समयावधि (Overdue Period)' : 'Overdue Period Past Expiry'}
                  </label>
                  <select
                    value={calcOverduePeriodIndex}
                    onChange={(e) => setCalcOverduePeriodIndex(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {RENEWAL_PENALTY_SLABS.map((slab, idx) => (
                      <option key={idx} value={idx}>
                        {slab.periodNp} - {slab.statusNp}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Right Summary Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white">
                {currentLang === 'ne' ? 'शुल्क विवरण (Fee Breakdown)' : 'Official Fee Breakdown'}
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>नियमित/दरखास्त दस्तुर:</span>
                  <span className="font-mono font-bold text-white">रु {calculatedFees.baseFee}</span>
                </div>
                {calculatedFees.biometricFee > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>बायोमेट्रिक दस्तुर:</span>
                    <span className="font-mono font-bold text-white">रु {calculatedFees.biometricFee}</span>
                  </div>
                )}
                {calculatedFees.examFee > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>परीक्षा दस्तुर:</span>
                    <span className="font-mono font-bold text-white">रु {calculatedFees.examFee}</span>
                  </div>
                )}
                {calculatedFees.penaltyFee > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>ढिलाइ जरिवाना:</span>
                    <span className="font-mono font-bold text-rose-400">रु {calculatedFees.penaltyFee}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Government Payable</span>
                <div className="text-2xl font-black text-emerald-400 my-1">
                  {calculatedFees.isCancelled ? 'CANCELLED' : `NPR ${calculatedFees.total.toLocaleString()}`}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{calculatedFees.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BLUEBOOK VEHICLE TAX CALCULATOR */}
      {activeTab === 'bluebook_tax' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span>
                  {currentLang === 'ne'
                    ? 'प्रदेश अनुसार सवारी कर तथा ब्लुबुक नवीकरण क्याल्कुलेटर'
                    : 'Provincial Vehicle Tax & Bluebook Renewal Calculator'}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {currentLang === 'ne' ? 'प्रदेश छान्नुहोस्' : 'Province'}
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Bagmati">बागमती प्रदेश (Bagmati)</option>
                    <option value="Gandaki">गण्डकी प्रदेश (Gandaki)</option>
                    <option value="Koshi">कोशी प्रदेश (Koshi)</option>
                    <option value="Lumbini">लुम्बिनी प्रदेश (Lumbini)</option>
                    <option value="Madhesh">मधेश प्रदेश (Madhesh)</option>
                    <option value="Sudurpashchim">सुदूरपश्चिम (Sudurpashchim)</option>
                    <option value="Karnali">कर्णाली प्रदेश (Karnali)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {currentLang === 'ne' ? 'सवारीको प्रकार' : 'Vehicle Type'}
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="bike">मोटरसाइकल / स्कुटर (Petrol 2-Wheeler)</option>
                    <option value="car">कार / जिप / भ्यान (Petrol/Diesel 4-Wheeler)</option>
                    <option value="ev_bike">विद्युतीय दुईपाङ्ग्रे (Electric Scooter/Bike)</option>
                    <option value="ev_car">विद्युतीय चारपाङ्ग्रे (Electric Car)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {vehicleType.includes('ev')
                      ? currentLang === 'ne'
                        ? 'मोटर क्षमता (kW)'
                        : 'Motor Power (kW)'
                      : currentLang === 'ne'
                      ? 'इन्जिन क्षमता (CC)'
                      : 'Engine Displacement (CC)'}
                  </label>
                  <input
                    type="number"
                    value={engineCc}
                    onChange={(e) => setEngineCc(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {currentLang === 'ne' ? 'नवीकरण ढिलाइ (महिना)' : 'Renewal Overdue (Months)'}
                  </label>
                  <input
                    type="number"
                    value={renewalMonthsLate}
                    onChange={(e) => setRenewalMonthsLate(Number(e.target.value))}
                    min={0}
                    max={60}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white">
                {currentLang === 'ne' ? 'सवारी कर हिसाब' : 'Vehicle Tax Summary'}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>वार्षिक सवारी कर (Base Tax):</span>
                  <span className="font-mono font-bold text-white">रु {vTax.baseTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ढिलाइ जरिवाना ({vTax.penaltyPercent}%):</span>
                  <span className="font-mono font-bold text-rose-400">रु {vTax.penaltyAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>तेस्रो पक्ष बीमा (Third Party):</span>
                  <span className="font-mono font-bold text-white">रु {vTax.thirdPartyInsurance.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Estimated Payable</span>
                <div className="text-2xl font-black text-emerald-400 my-1">
                  NPR {vTax.totalPayable.toLocaleString()}
                </div>
              </div>

              <button
                onClick={handleExportPDF}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/30"
              >
                <Download className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'कर रसिद PDF डाउनलोड' : 'Download Tax Estimate PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
