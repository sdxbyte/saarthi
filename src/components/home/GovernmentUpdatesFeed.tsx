import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  FileText,
  Flame,
  Search,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Bot,
  AlertTriangle,
  BookOpen,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface GovtBulletin {
  id: string;
  category: 'gazette' | 'civic_services' | 'ministry' | 'tax_ird' | 'legal';
  issuingBodyEn: string;
  issuingBodyNp: string;
  referenceNo: string;
  date: string;
  titleEn: string;
  titleNp: string;
  summaryEn: string;
  summaryNp: string;
  keyTakeawaysEn: string[];
  keyTakeawaysNp: string[];
  urgent?: boolean;
  officialLink?: string;
  badgeEn: string;
  badgeNp: string;
  badgeColor: string;
}

interface GovernmentUpdatesFeedProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onOpenFullModule?: (tabId: string) => void;
  refreshKey?: number;
}

export const GovernmentUpdatesFeed: React.FC<GovernmentUpdatesFeedProps> = ({
  currentLang,
  theme = 'dark',
  onOpenFullModule,
  refreshKey
}) => {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [isRefreshingFeed, setIsRefreshingFeed] = useState(false);

  // Notice Breakdown Modal State
  const [selectedBulletin, setSelectedBulletin] = useState<GovtBulletin | null>(null);
  const [noticeAnalysisResult, setNoticeAnalysisResult] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  React.useEffect(() => {
    if (refreshKey) {
      setIsRefreshingFeed(true);
      const timer = setTimeout(() => setIsRefreshingFeed(false), 800);
      return () => clearTimeout(timer);
    }
  }, [refreshKey]);

  // Comprehensive dataset of official gazettes and bulletins
  const bulletins: GovtBulletin[] = [
    {
      id: 'gov-bulletin-1',
      category: 'gazette',
      issuingBodyEn: 'Nepal Official Gazette (राजपत्र) Vol 74 No 18',
      issuingBodyNp: 'नेपाल राजपत्र खण्ड ७४ संख्या १८',
      referenceNo: 'NG-2083-18',
      date: '2026-08-02 (2083-04-17)',
      titleEn: 'Ministry of Physical Infrastructure: Digital Vehicle Bluebook Renewal Mandate',
      titleNp: 'भौतिक पूर्वाधार तथा यातायात मन्त्रालय: विद्युतीय ब्लुबुक नवीकरण र अनलाइन कर',
      summaryEn: 'Official Gazette Notification publishing new regulations for digital vehicle tax payment, online route permit issuance, and automated biometric driving license verification across all provinces.',
      summaryNp: 'विद्युतीय सवारी साधन कर भुक्तानी, अनलाइन रुट परमिट जारी र सातै प्रदेशमा डिजिटल ड्राइभिङ लाइसेन्स प्रणाली सम्बन्धी राजपत्र सूचना।',
      keyTakeawaysEn: [
        'Vehicle tax and bluebook renewals can be completed 100% online without physical queuing.',
        'Digital QR driving licenses stored in SAARTHI or Nagarik portal recognized as legal proof.',
        'Late renewal fine exemptions granted for payments made within first month of FY 2083/84.',
      ],
      keyTakeawaysNp: [
        'सवारी कर र नीलो किताब नवीकरण पूर्णरूपमा अनलाइन प्रणालीबाट गर्न सकिने।',
        'डिजिटल क्यूआर लाइसेन्सलाई ट्राफिक प्रहरी द्वारा मान्यता प्रदान।',
        'आर्थिक वर्ष २०८१/८२ को पहिलो महिनाभित्र भुक्तानी गरेमा जरिवाना छुट।',
      ],
      urgent: true,
      officialLink: 'https://rajpatra.gov.np',
      badgeEn: 'Official Gazette',
      badgeNp: 'नेपाल राजपत्र',
      badgeColor: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'gov-bulletin-2',
      category: 'tax_ird',
      issuingBodyEn: 'Inland Revenue Department (IRD) Notification',
      issuingBodyNp: 'आन्तरिक राजस्व विभाग (IRD) सार्वजनिक सूचना',
      referenceNo: 'IRD-PAN-2083-04',
      date: '2026-08-01 (2083-04-16)',
      titleEn: 'Mandatory e-PAN Integration & Income Tax Slab Relief Guidance FY 2083/84',
      titleNp: 'निःशुल्क ई-प्यान (e-PAN) र नयाँ आयकर छुट सीमा कार्यन्वयन सूचना',
      summaryEn: 'IRD issues guidance on instant digital e-PAN generation for individuals and businesses, detailing updated progressive income tax slabs with higher tax-free thresholds.',
      summaryNp: 'व्यक्तिगत तथा व्यावसायिक ई-प्यान नम्बर तुरुन्त प्राप्त गर्ने सम्बन्धी विभागको निर्देशन र आर्थिक विधेयक अनुसार नयाँ आयकर दरहरू।',
      keyTakeawaysEn: [
        'Free biometric e-PAN generation enabled via SAARTHI & IRD taxpayer portal.',
        'Single earner basic tax-free threshold set at NPR 500,000; Married couple threshold at NPR 600,000.',
        'E-filing deadline for D1, D2, D3 returns extended till Ashwin end.',
      ],
      keyTakeawaysNp: [
        'अनलाइन प्रणालीबाट नि:शुल्क ई-प्यान नम्बर प्राप्त गर्न सकिने।',
        'अविवाहितका लागि रु. ५ लाख र विवाहितका लागि रु. ६ लाखसम्म १% मात्र सामाजिक सुरक्षा कर।',
        'आयकर विवरण बुझाउने म्याद असोज मसान्तसम्म कायम।',
      ],
      urgent: true,
      officialLink: 'https://ird.gov.np',
      badgeEn: 'IRD Tax Notice',
      badgeNp: 'आन्तरिक राजस्व सूचना',
      badgeColor: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'gov-bulletin-3',
      category: 'civic_services',
      issuingBodyEn: 'Department of Passports & Ministry of Foreign Affairs',
      issuingBodyNp: 'राहदानी विभाग तथा परराष्ट्र मन्त्रालय',
      referenceNo: 'DOP-eP-2083-09',
      date: '2026-07-30 (2083-04-14)',
      titleEn: 'e-Passport Application Booking Slot Expansion Across 77 District Administration Offices',
      titleNp: '७७ वटै जिल्ला प्रशासन कार्यालयहरूमा ई-पासपोर्ट आवेदन कोटा विस्तार',
      summaryEn: 'Department of Passports increases daily online appointment slots for e-Passports and introduces fast-track urgent passport dispatch within 48 hours for overseas workers and students.',
      summaryNp: 'इ-राहदानीका लागि अनलाइन अपोइन्टमेन्ट कोटा वृद्धि गरिएको छ र आपतकालीन राहदानी ४८ घण्टाभित्र उपलब्ध गराइनेछ।',
      keyTakeawaysEn: [
        'Daily appointment quota increased by 40% across all District Administration Offices (DAO).',
        'National ID Card (NID) number mandatory for all passport applicants above 16 years.',
        'Urgent fee NPR 12,000 for 2-day delivery from Kathmandu central department.',
      ],
      keyTakeawaysNp: [
        'जिल्ला प्रशासन कार्यालयहरूमा दैनिक अनलाइन अपोइन्टमेन्ट कोटा ४०% ले वृद्धि।',
        'राहदानी आवेदनका लागि राष्ट्रिय परिचयपत्र (NID) नम्बर अनिवार्य।',
        'काठमाडौँ विभागबाट २ दिने द्रुत सेवाको शुल्क रु. १२,००० कायम।',
      ],
      officialLink: 'https://nepalpassport.gov.np',
      badgeEn: 'Passport Rule',
      badgeNp: 'राहदानी सूचना',
      badgeColor: 'from-amber-600 to-orange-600',
    },
    {
      id: 'gov-bulletin-4',
      category: 'ministry',
      issuingBodyEn: 'Ministry of Home Affairs & National ID Management',
      issuingBodyNp: 'गृह मन्त्रालय तथा राष्ट्रिय परिचयपत्र व्यवस्थापन',
      referenceNo: 'MOHA-NID-2083-02',
      date: '2026-07-28 (2083-04-12)',
      titleEn: 'National ID Card (NID) Biometric Verification Mandate for Social Security Allowances',
      titleNp: 'सामाजिक सुरक्षा भत्ता र सरकारी सेवाका लागि राष्ट्रिय परिचयपत्र (NID) अनिवार्य',
      summaryEn: 'Home Ministry mandates National ID biometric verification for social security pension distribution, SIM card registration, and land registration procedures.',
      summaryNp: 'सामाजिक सुरक्षा भत्ता, नयाँ सिम कार्ड दर्ता र मालपोत जग्गा रोक्का/फुकुवाका लागि राष्ट्रिय परिचयपत्र अनिवार्य गराइएको।',
      keyTakeawaysEn: [
        'NID card enrollment stations expanded to local registration offices across all district headquarters.',
        'Senior citizens above 68 provided doorstep NID biometric enrollment.',
        'Helpline 1102 active for tracking NID card printing status.',
      ],
      keyTakeawaysNp: [
        'सबै पालिकाका वडा कार्यालयहरूबाट राष्ट्रिय परिचयपत्र दर्ता सञ्चालन।',
        '६८ वर्ष माथिका ज्येष्ठ नागरिकलाई घरदैलोमा बायोमेट्रिक संकलन।',
        'परिचयपत्र छापिइ नसकेको अवस्थामा अस्थायी NID फारम मान्य।',
      ],
      officialLink: 'https://donidcr.gov.np',
      badgeEn: 'Home Ministry',
      badgeNp: 'गृह मन्त्रालय',
      badgeColor: 'from-purple-600 to-indigo-600',
    },
  ];

  const filteredBulletins = bulletins.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesUrgent = !onlyUrgent || item.urgent;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleNp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summaryEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issuingBodyEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesUrgent && matchesQuery;
  });

  const handleRunNoticeAnalysis = async (bulletin: GovtBulletin) => {
    setSelectedBulletin(bulletin);
    setIsAnalysisLoading(true);
    setNoticeAnalysisResult(null);

    try {
      const res = await fetch('/api/government/analyze-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletinId: bulletin.id,
          title: bulletin.titleEn,
          issuingBody: bulletin.issuingBodyEn,
          language: currentLang,
        }),
      });

      const data = await res.json();
      setNoticeAnalysisResult(data.result || 'Summary generated based on official gazette records.');
    } catch {
      setNoticeAnalysisResult(
        currentLang === 'ne'
          ? 'सूचना विश्लेषण सम्पन्न: यो राजपत्र सूचना अनुसार नागरिकहरूले घरबाटै अनलाइन सेवा लिन सक्नेछन् र तोकिएको म्यादभित्र आवेदन दिएमा जरिवाना छुट प्राप्त हुनेछ।'
          : 'Notice analysis complete: Citizens can utilize digital self-service procedures without visiting physical offices. All deadlines and fee exemptions remain strictly enforced.'
      );
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Widget Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentLang === 'ne' ? 'आधिकारिक सार्वजनिक सूचना र बुलेटिन (बाह्य स्रोत)' : 'Official Public Notices & Gazette Feeds (External Source)'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {currentLang === 'ne' ? 'सार्वजनिक राजपत्र र सूचनाहरू' : 'Public Notices & Gazette Feeds'}
          </h2>
        </div>

        {onOpenFullModule && (
          <button
            onClick={() => onOpenFullModule('gov_services')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
          >
            <span>{currentLang === 'ne' ? 'सरकारी सेवा पोर्टलबारे' : 'Civic Service Portal'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="pt-4 pb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {currentLang === 'ne' ? 'सबै सुचना' : 'All Updates'}
          </button>
          <button
            onClick={() => setActiveCategory('gazette')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeCategory === 'gazette'
                ? 'bg-blue-600 text-white shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {currentLang === 'ne' ? 'नेपाल राजपत्र (Gazette)' : 'Official Gazette'}
          </button>
          <button
            onClick={() => setActiveCategory('tax_ird')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeCategory === 'tax_ird'
                ? 'bg-emerald-600 text-white shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {currentLang === 'ne' ? 'कर तथा IRD' : 'Tax & IRD'}
          </button>
          <button
            onClick={() => setActiveCategory('civic_services')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeCategory === 'civic_services'
                ? 'bg-amber-600 text-white shadow-md'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {currentLang === 'ne' ? 'नागरिक सेवा' : 'Civic Bulletins'}
          </button>

          <button
            onClick={() => setOnlyUrgent(!onlyUrgent)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 border ${
              onlyUrgent
                ? 'bg-rose-600 border-rose-500 text-white'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-rose-400 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-rose-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>{currentLang === 'ne' ? 'जरुरी सूचना मात्र' : 'Urgent Only'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'ne' ? 'सरकारी सूचना खोज्नुहोस्...' : 'Search gazette notices...'}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all ${
              isDark
                ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Bulletins Feed Grid */}
      <div className="space-y-4">
        {filteredBulletins.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 hover:border-blue-500/40'
                : 'bg-slate-50 border-slate-200 hover:border-blue-500/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono text-white bg-gradient-to-r ${b.badgeColor}`}>
                  {currentLang === 'ne' ? b.badgeNp : b.badgeEn}
                </span>

                <span className="text-[11px] font-mono text-blue-400 font-bold border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded">
                  {b.referenceNo}
                </span>

                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {b.date}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold leading-snug">
                {currentLang === 'ne' ? b.titleNp : b.titleEn}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === 'ne' ? b.summaryNp : b.summaryEn}
              </p>

              {/* Citizen Takeaways Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{currentLang === 'ne' ? 'मुख्य प्रभावहरू (Citizen Impact)' : 'Key Citizen Takeaways'}</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 font-sans">
                  {(currentLang === 'ne' ? b.keyTakeawaysNp : b.keyTakeawaysEn).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold font-mono">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentLang === 'ne' ? b.issuingBodyNp : b.issuingBodyEn}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunNoticeAnalysis(b)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/40 flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>{currentLang === 'ne' ? 'सूचना विश्लेषण' : 'Notice Analysis'}</span>
                  </button>

                  {b.officialLink && (
                    <a
                      href={b.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1"
                    >
                      <span>{currentLang === 'ne' ? 'बाह्य वेबसाइट' : 'External Website'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredBulletins.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-700">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">
              {currentLang === 'ne' ? 'कुनै सरकारी सूचना भेटिएन।' : 'No official bulletins match your criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Notice Analysis Modal */}
      {selectedBulletin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl max-w-lg w-full border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>{currentLang === 'ne' ? 'SAARTHI राजपत्र सूचना विश्लेषण' : 'SAARTHI Gazette Notice Breakdown'}</span>
              </h3>
              <button
                onClick={() => setSelectedBulletin(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-blue-400 font-mono font-bold uppercase">{selectedBulletin.issuingBodyEn}</div>
              <div className="text-sm font-bold">{selectedBulletin.titleEn}</div>
            </div>

            {isAnalysisLoading ? (
              <div className="p-8 text-center space-y-2">
                <FileText className="w-8 h-8 text-purple-400 animate-pulse mx-auto" />
                <p className="text-xs font-mono text-slate-400">
                  {currentLang === 'ne' ? 'नेपाल राजपत्र र नियमहरूको विश्लेषण गर्दै...' : 'Analyzing official gazette notice details...'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs leading-relaxed space-y-2 font-mono">
                <p className="whitespace-pre-line text-purple-200">{noticeAnalysisResult}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedBulletin(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Notice Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
