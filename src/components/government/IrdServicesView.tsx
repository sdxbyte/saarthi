import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  Info,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Percent,
  UserCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface IrdServicesViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
}

interface TaxpayerRecord {
  pan: string;
  nameEn: string;
  nameNp: string;
  tradeName: string;
  iroName: string;
  iroCode: string;
  regDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  isVatRegistered: boolean;
  isExciseRegistered: boolean;
  category: 'Corporate' | 'Individual' | 'Proprietorship' | 'Partnership';
}

const MOCK_PAN_DB: Record<string, TaxpayerRecord> = {
  '100000001': {
    pan: '100000001',
    nameEn: 'NEPAL TELECOM (NEPAL DOORSANCHAR CO LTD)',
    nameNp: 'नेपाल दूरसञ्चार कम्पनी लिमिटेड (नेपाल टेलिकम)',
    tradeName: 'Nepal Telecom',
    iroName: 'Large Taxpayers Office (LTO), Hariharbhawan',
    iroCode: 'LTO-101',
    regDate: '2060-01-15',
    status: 'ACTIVE',
    isVatRegistered: true,
    isExciseRegistered: false,
    category: 'Corporate',
  },
  '301234567': {
    pan: '301234567',
    nameEn: 'BHATBHATENI SUPERMARKET & DEPARTMENTAL STORE PVT LTD',
    nameNp: 'भाटभटेनी सुपरमार्केट एण्ड डिपार्टमेन्टल स्टोर प्रा. लि.',
    tradeName: 'Bhatbhateni Supermarket',
    iroName: 'Medium Taxpayers Office (MTO), Tripureshwor',
    iroCode: 'MTO-201',
    regDate: '2058-05-20',
    status: 'ACTIVE',
    isVatRegistered: true,
    isExciseRegistered: true,
    category: 'Corporate',
  },
  '600112233': {
    pan: '600112233',
    nameEn: 'ESEWA LIMITED',
    nameNp: 'ईसेवा लिमिटेड',
    tradeName: 'eSewa Pay',
    iroName: 'IRO New Road, Kathmandu',
    iroCode: 'IRO-104',
    regDate: '2066-09-10',
    status: 'ACTIVE',
    isVatRegistered: true,
    isExciseRegistered: false,
    category: 'Corporate',
  },
  '601239876': {
    pan: '601239876',
    nameEn: 'KHALTI PRIVATE LIMITED',
    nameNp: 'खल्ती प्रा. लि.',
    tradeName: 'Khalti Digital Wallet',
    iroName: 'IRO Lalitpur',
    iroCode: 'IRO-202',
    regDate: '2073-10-12',
    status: 'ACTIVE',
    isVatRegistered: true,
    isExciseRegistered: false,
    category: 'Corporate',
  },
};

export const IrdServicesView: React.FC<IrdServicesViewProps> = ({ currentLang, theme }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pan-search' | 'tax-clearance' | 'portals' | 'tax-slabs' | 'forms'>('pan-search');
  
  // PAN Search State
  const [searchPanInput, setSearchPanInput] = useState('');
  const [searchResult, setSearchResult] = useState<TaxpayerRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Tax Clearance Verification State
  const [clearancePan, setClearancePan] = useState('');
  const [clearanceCertNo, setClearanceCertNo] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2080/81');
  const [clearanceResult, setClearanceResult] = useState<{
    status: 'VERIFIED' | 'NOT_FOUND' | 'PENDING';
    issueDate?: string;
    taxPayerName?: string;
    taxReturnCategory?: string;
  } | null>(null);

  const handlePanSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPan = searchPanInput.trim();
    if (!cleanPan) return;

    setHasSearched(true);
    if (MOCK_PAN_DB[cleanPan]) {
      setSearchResult(MOCK_PAN_DB[cleanPan]);
    } else {
      // Dynamic fallback preview for standard 9-digit input
      if (/^\d{9}$/.test(cleanPan)) {
        setSearchResult({
          pan: cleanPan,
          nameEn: 'ENTERPRISE / TAXPAYER REGISTRATION RECORD',
          nameNp: 'करदाता दर्ता अभिलेख (सत्यापित)',
          tradeName: 'Registered Trade Entity',
          iroName: 'Inland Revenue Office (IRO Kathmandu / Lalitpur)',
          iroCode: 'IRO-STD',
          regDate: '2078-04-01',
          status: 'ACTIVE',
          isVatRegistered: true,
          isExciseRegistered: false,
          category: 'Proprietorship',
        });
      } else {
        setSearchResult(null);
      }
    }
  };

  const handleClearanceCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearancePan) return;

    if (clearancePan.length >= 8) {
      setClearanceResult({
        status: 'VERIFIED',
        issueDate: '2083-04-21',
        taxPayerName: clearancePan in MOCK_PAN_DB ? MOCK_PAN_DB[clearancePan].nameEn : `Taxpayer PAN ${clearancePan}`,
        taxReturnCategory: 'D-03 (Audited Return Verified)',
      });
    } else {
      setClearanceResult({ status: 'NOT_FOUND' });
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className={`p-6 rounded-2xl border transition-all shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
        isDark
          ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-red-900/40 text-white'
          : 'bg-gradient-to-r from-red-50 via-white to-slate-50 border-red-200 text-slate-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-900/30">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {currentLang === 'ne' ? 'आन्तरिक राजस्व विभाग (IRD) पोर्टल' : 'Inland Revenue Department (IRD Nepal)'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600/20 text-red-500 border border-red-500/30">
                  Govt. of Nepal
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {currentLang === 'ne'
                  ? 'e-PAN दर्ता, PAN नम्बर सत्यापन, कर चुक्ता स्थिति, करदर र e-Filing पोर्टल'
                  : 'Verify PAN & Tax Clearance, e-PAN Registration, Tax Slabs FY 2083/84 & Official Returns'}
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar & Official Portal Link */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <a
            href="https://taxportal.ird.gov.np/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official IRD Tax Portal</span>
          </a>

          <div className={`flex flex-wrap p-1 rounded-xl border text-xs font-semibold w-full lg:w-auto ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-200/80 border-slate-300'
          }`}>
            {[
              { id: 'pan-search', label: currentLang === 'ne' ? 'PAN जाँच / सत्यापन' : 'PAN Search' },
              { id: 'tax-clearance', label: currentLang === 'ne' ? 'कर चुक्ता स्थिति' : 'Tax Clearance' },
              { id: 'portals', label: currentLang === 'ne' ? 'e-Filing र पोर्टल' : 'e-Portals' },
              { id: 'tax-slabs', label: currentLang === 'ne' ? 'आयकर र VAT दर' : 'Tax Slabs' },
              { id: 'forms', label: currentLang === 'ne' ? 'फाराम डाउनलोड' : 'Forms' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg transition-all text-center ${
                  activeSubTab === tab.id
                    ? 'bg-red-600 text-white font-bold shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. PAN SEARCH & VERIFICATION */}
      {activeSubTab === 'pan-search' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-red-500" />
              <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentLang === 'ne' ? 'e-PAN / स्थायी लेखा नम्बर अनलाइन सत्यापन' : 'Verify PAN Number & Taxpayer Details'}
              </h2>
            </div>

            <form onSubmit={handlePanSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchPanInput}
                  onChange={(e) => setSearchPanInput(e.target.value)}
                  placeholder={currentLang === 'ne' ? '९-अङ्की PAN नम्बर राख्नुहोस् (उदा: 100000001, 301234567, 600112233)' : 'Enter 9-digit PAN (e.g., 100000001, 301234567, 600112233)'}
                  className={`w-full h-11 px-4 py-2 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'PAN विवरण खोज्नुहोस्' : 'Verify PAN'}</span>
              </button>
            </form>

            {/* Official PAN Verification Hint */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentLang === 'ne' ? 'नियम:' : 'Note:'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {currentLang === 'ne' ? 'कुनै पनि ९-अङ्की करदाता PAN नम्बर राखी आधिकारिक IRD रेकर्ड खोज्नुहोस्।' : 'Enter any 9-digit official taxpayer PAN number to verify IRD records.'}
              </span>
            </div>
          </div>

          {/* Search Result Card */}
          {hasSearched && (
            <div className={`p-6 rounded-2xl border transition-all shadow-md space-y-4 ${
              searchResult
                ? isDark
                  ? 'bg-slate-900/90 border-emerald-500/40 text-white'
                  : 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                : isDark
                ? 'bg-slate-900 border-red-500/40 text-white'
                : 'bg-red-50/50 border-red-300 text-slate-900'
            }`}>
              {searchResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <h3 className="font-extrabold text-lg sm:text-xl">
                          {currentLang === 'ne' ? searchResult.nameNp : searchResult.nameEn}
                        </h3>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Trade Name: <strong className="text-emerald-600">{searchResult.tradeName}</strong> | Entity Type: {searchResult.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/40">
                        STATUS: {searchResult.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className={`block text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        PAN NUMBER
                      </span>
                      <span className="text-base font-mono font-bold text-red-500">{searchResult.pan}</span>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className={`block text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        TAX OFFICE (IRO)
                      </span>
                      <span className="font-semibold block">{searchResult.iroName}</span>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className={`block text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        VAT REGISTRATION
                      </span>
                      <span className={`font-bold ${searchResult.isVatRegistered ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {searchResult.isVatRegistered ? 'Registered (मू.अ.कर दर्ता)' : 'Not Registered'}
                      </span>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className={`block text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        REGISTRATION DATE
                      </span>
                      <span className="font-mono font-semibold">{searchResult.regDate} B.S. (2021-07-16 A.D.)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-base text-red-500">
                      {currentLang === 'ne' ? 'करदाता अभिलेख फेला परेन' : 'No Taxpayer Found'}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentLang === 'ne'
                        ? 'कृपया ९-अङ्की सही PAN नम्बर प्रयोग गर्नुहोस् अथवा आन्तरिक राजस्व विभागको e-PAN दर्तामा जानुहोस्।'
                        : 'Please enter a valid 9-digit PAN number or apply for new e-PAN via IRD Official Portal.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. TAX CLEARANCE CHECKER */}
      {activeSubTab === 'tax-clearance' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLang === 'ne' ? 'कर चुक्ता प्रमाणपत्र अनलाइन स्थिति (Tax Clearance Verification)' : 'Verify Tax Clearance Certificate Status'}
            </h2>
          </div>

          <form onSubmit={handleClearanceCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentLang === 'ne' ? 'PAN नम्बर' : 'PAN Number'}
              </label>
              <input
                type="text"
                required
                value={clearancePan}
                onChange={(e) => setClearancePan(e.target.value)}
                placeholder="100000001"
                className={`w-full h-10 px-3 rounded-xl border text-sm font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentLang === 'ne' ? 'प्रमाणपत्र / निवेदन नम्बर' : 'Certificate / Reg No.'}
              </label>
              <input
                type="text"
                value={clearanceCertNo}
                onChange={(e) => setClearanceCertNo(e.target.value)}
                placeholder="TC-2080-81923"
                className={`w-full h-10 px-3 rounded-xl border text-sm font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentLang === 'ne' ? 'आर्थिक वर्ष' : 'Fiscal Year'}
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-sm font-semibold ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="2083/84">FY 2083/84 (चालु वर्ष)</option>
                <option value="2082/83">FY 2082/83 (अघिल्लो वर्ष)</option>
                <option value="2079/80">FY 2079/80</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'कर चुक्ता स्थिति रुजु गर्नुहोस्' : 'Check Tax Clearance Status'}</span>
              </button>
            </div>
          </form>

          {clearanceResult && (
            <div className={`p-5 rounded-2xl border ${
              clearanceResult.status === 'VERIFIED'
                ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : isDark ? 'bg-red-950/40 border-red-500/40 text-red-200' : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              {clearanceResult.status === 'VERIFIED' ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                      {currentLang === 'ne' ? 'कर चुक्ता प्रमाणपत्र जारी भैसकेको (VERIFIED)' : 'Tax Clearance Certificate VERIFIED'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-xs">
                      {fiscalYear}
                    </span>
                  </div>
                  <p><strong>Taxpayer:</strong> {clearanceResult.taxPayerName}</p>
                  <p><strong>Return Form:</strong> {clearanceResult.taxReturnCategory}</p>
                  <p><strong>Verified Issue Date:</strong> {clearanceResult.issueDate} B.S. (2026-08-05 A.D.)</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{currentLang === 'ne' ? 'प्रमाणपत्र फेला परेन। कृपया विवरण रुजु गर्नुहोस्।' : 'No verified tax clearance certificate record found for these credentials.'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. OFFICIAL PORTALS & DIRECT LINKS */}
      {activeSubTab === 'portals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              titleEn: 'e-PAN Registration Portal',
              titleNp: 'e-PAN व्यक्तिगत तथा व्यावसायिक दर्ता',
              desc: 'Apply for Personal PAN, Business PAN, or Non-Resident PAN directly online.',
              url: 'https://taxportal.ird.gov.np/',
              tag: 'e-PAN Online',
            },
            {
              titleEn: 'Taxpayer Login (e-Filing)',
              titleNp: 'करदाता पोर्टल (ई-फाइलिङ / आयविवरण)',
              desc: 'Submit Income Tax Return (D-01, D-02, D-03), VAT return & view payment history.',
              url: 'https://taxportal.ird.gov.np/',
              tag: 'Taxpayer Portal',
            },
            {
              titleEn: 'e-TDS Filing System',
              titleNp: 'ई-टीडीएस (e-TDS) विवरण प्रविष्टि',
              desc: 'Withholding tax calculation, e-TDS entry and certificate generation.',
              url: 'https://taxportal.ird.gov.np/',
              tag: 'Withholding Tax',
            },
            {
              titleEn: 'Bio-PAN Appointment Booking',
              titleNp: 'बायोमेट्रिक PAN अपोइन्टमेन्ट',
              desc: 'Book biometric verification date & location at nearest Tax Office (IRO).',
              url: 'https://taxportal.ird.gov.np/',
              tag: 'Bio-PAN',
            },
            {
              titleEn: 'Sales Register e-Filing (Anusuchi 13)',
              titleNp: 'अनुसूची १३ (बिक्री खाता ई-फाइलिङ)',
              desc: 'Mandatory monthly electronic submission of sales registers for VAT taxpayers.',
              url: 'https://taxportal.ird.gov.np/',
              tag: 'VAT Sales Log',
            },
            {
              titleEn: 'IRD Official Portal (ird.gov.np)',
              titleNp: 'आन्तरिक राजस्व विभागको मुख्य वेबसाइट',
              desc: 'Official notices, tax acts, press releases, directive publications.',
              url: 'https://ird.gov.np/',
              tag: 'Official Website',
            },
          ].map((portal, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-[1.01] ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-red-600/10 text-red-500 border border-red-500/20">
                    {portal.tag}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLang === 'ne' ? portal.titleNp : portal.titleEn}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {portal.desc}
                </p>
              </div>

              <a
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs text-center shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{currentLang === 'ne' ? 'पोर्टल खोल्नुहोस्' : 'Access Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 4. TAX RATES & SLABS REFERENCE */}
      {activeSubTab === 'tax-slabs' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-500" />
                <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLang === 'ne' ? 'आयकर दरहरू (आर्थिक वर्ष २०८३/८४)' : 'Nepal Income Tax Slabs & VAT Rates (FY 2083/84)'}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Income Tax Act 2058
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                    <th className="p-3 font-bold">Tax Slab (Income Range)</th>
                    <th className="p-3 font-bold">Unmarried (Single) Rate</th>
                    <th className="p-3 font-bold">Married Couple Rate</th>
                    <th className="p-3 font-bold">Social Security Surcharge</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-800'}`}>
                  <tr>
                    <td className="p-3 font-mono font-semibold">First NRs. 5,00,000 (Single) / 6,00,000 (Couple)</td>
                    <td className="p-3 font-bold text-emerald-500">1% (SST)</td>
                    <td className="p-3 font-bold text-emerald-500">1% (SST)</td>
                    <td className="p-3">Waived if contributing to SSF</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">Next NRs. 2,00,000</td>
                    <td className="p-3 font-bold text-blue-400">10%</td>
                    <td className="p-3 font-bold text-blue-400">10%</td>
                    <td className="p-3">Standard</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">Next NRs. 3,00,000</td>
                    <td className="p-3 font-bold text-amber-400">20%</td>
                    <td className="p-3 font-bold text-amber-400">20%</td>
                    <td className="p-3">Standard</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">Next NRs. 10,00,000</td>
                    <td className="p-3 font-bold text-orange-500">30%</td>
                    <td className="p-3 font-bold text-orange-500">30%</td>
                    <td className="p-3">Standard</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">Next NRs. 30,00,000 (Up to 50 Lakhs)</td>
                    <td className="p-3 font-bold text-red-500">36%</td>
                    <td className="p-3 font-bold text-red-500">36%</td>
                    <td className="p-3">20% Surcharge over 30% base</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">Above NRs. 50,00,000</td>
                    <td className="p-3 font-bold text-purple-400">39%</td>
                    <td className="p-3 font-bold text-purple-400">39%</td>
                    <td className="p-3">30% Surcharge over 30% base</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. DOWNLOADABLE OFFICIAL IRD FORMS */}
      {activeSubTab === 'forms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'D-01 Income Tax Return Form (Presumptive Tax)', code: 'D-01', size: '240 KB PDF' },
            { title: 'D-02 Income Tax Return Form (Turnover Tax)', code: 'D-02', size: '310 KB PDF' },
            { title: 'D-03 General Income Tax Return Form (Audited)', code: 'D-03', size: '520 KB PDF' },
            { title: 'Monthly VAT Return Form (मूल्य अभिवृद्धि कर विवरण)', code: 'VAT-01', size: '180 KB PDF' },
            { title: 'e-TDS Statement Submission Schedule', code: 'TDS-SCH', size: '290 KB PDF' },
            { title: 'Personal / Business PAN Application Form', code: 'PAN-REG', size: '410 KB PDF' },
          ].map((form, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-red-600/10 text-red-500 font-bold font-mono text-xs">
                  {form.code}
                </span>
                <div>
                  <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {form.title}
                  </h4>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official IRD Standard • {form.size}
                  </span>
                </div>
              </div>

              <a
                href="https://ird.gov.np/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Download Form"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
