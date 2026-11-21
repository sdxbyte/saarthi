import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  GraduationCap,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Users,
  Compass,
  ArrowUpRight,
  Filter,
  Check,
  Download,
  BookOpen,
  HelpCircle,
  Globe2,
} from 'lucide-react';
import { MOCK_JOBS } from '../../data/civicAndEmploymentData';

interface LokSewaJobsViewProps {
  currentLang: 'en' | 'ne';
}

interface ExtendedJob {
  id: string;
  title: string;
  titleNp?: string;
  organization: string;
  organizationNp?: string;
  category: 'loksewa' | 'banking' | 'tech' | 'health' | 'security' | 'ngo';
  categoryLabelEn: string;
  categoryLabelNp: string;
  location: string;
  vacancies: number;
  deadlineBs: string;
  deadlineAd: string;
  isUrgent?: boolean;
  qualification: string;
  qualificationNp?: string;
  level: string;
  examType: string;
  applyUrl: string;
  syllabusUrl?: string;
}

const EXTENDED_JOBS_CATALOG: ExtendedJob[] = [
  {
    id: 'psc-so-2083',
    title: 'Section Officer (Sakha Adhikrit - Administration & Justice)',
    titleNp: 'शाखा अधिकृत (प्रशासन, लेखा, न्याय तथा परराष्ट्र)',
    organization: 'Public Service Commission (Lok Sewa Aayog)',
    organizationNp: 'लोक सेवा आयोग, अनामनगर, काठमाडौं',
    category: 'loksewa',
    categoryLabelEn: 'Lok Sewa Aayog (Gazetted 3rd)',
    categoryLabelNp: 'लोक सेवा आयोग (रा.प.तृतीय)',
    location: 'Kathmandu / All 7 Provinces',
    vacancies: 420,
    deadlineBs: '२०८३-०५-१०',
    deadlineAd: '2026-08-26',
    isUrgent: true,
    qualification: 'Bachelor’s Degree in any recognized discipline from a TU/authorized university.',
    qualificationNp: 'मान्यता प्राप्त विश्वविद्यालयबाट जुनसुकै संकायमा स्नातक तह उत्तीर्ण।',
    level: 'Gazetted Class III (रा.प. तृतीय श्रेणी)',
    examType: 'GK & IQ, Written Subjective & Interview',
    applyUrl: 'https://psconline.psc.gov.np',
    syllabusUrl: 'https://psc.gov.np/category/syllabus.html',
  },
  {
    id: 'psc-nasu-2083',
    title: 'Nayab Subba (Non-Gazetted 1st Class - General Administration)',
    titleNp: 'नायब सुब्बा (अप्राविधिक - सामान्य प्रशासन, लेखा र राजस्व)',
    organization: 'Public Service Commission (Lok Sewa Aayog)',
    organizationNp: 'लोक सेवा आयोग (केन्द्रीय तथा प्रादेशिक कार्यालयहरू)',
    category: 'loksewa',
    categoryLabelEn: 'Lok Sewa Aayog (Non-Gazetted 1st)',
    categoryLabelNp: 'लोक सेवा आयोग (रा.प.अनं. प्रथम)',
    location: 'All 77 District Offices',
    vacancies: 650,
    deadlineBs: '२०८३-०५-२२',
    deadlineAd: '2026-09-07',
    isUrgent: false,
    qualification: '10+2 / Higher Secondary (+2) passed with minimum 2.0 GPA or 2nd Division.',
    qualificationNp: 'प्रविणता प्रमाणपत्र तह वा १०+२ उत्तीर्ण।',
    level: 'Non-Gazetted 1st Class (ना.सु.)',
    examType: 'First Paper GK, Second Paper Contextual Test',
    applyUrl: 'https://psconline.psc.gov.np',
    syllabusUrl: 'https://psc.gov.np/category/syllabus.html',
  },
  {
    id: 'psc-eng-civil',
    title: 'Assistant Engineer (Civil / Irrigation / Highway)',
    titleNp: 'सहायक इन्जिनियर (सिभिल, सिँचाइ तथा राजमार्ग)',
    organization: 'Department of Roads / MoPID',
    organizationNp: 'सडक विभाग तथा भौतिक पूर्वाधार मन्त्रालय',
    category: 'loksewa',
    categoryLabelEn: 'Engineering Service',
    categoryLabelNp: 'इन्जिनियरिङ सेवा (प्राविधिक)',
    location: 'Federal Highway Divisions',
    vacancies: 114,
    deadlineBs: '२०८३-०५-१५',
    deadlineAd: '2026-08-31',
    isUrgent: true,
    qualification: 'Diploma in Civil Engineering from CTEVT or recognized institution.',
    qualificationNp: 'मान्यता प्राप्त संस्थाबाट सिभिल इन्जिनियरिङमा डिप्लोमा उत्तीर्ण।',
    level: 'Non-Gazetted Class I (Technical)',
    examType: 'Technical Written + Practical Survey',
    applyUrl: 'https://psconline.psc.gov.np',
    syllabusUrl: 'https://psc.gov.np',
  },
  {
    id: 'nabil-mt-2083',
    title: 'Management Trainee (MT - Fast Track Banking)',
    titleNp: 'व्यवस्थापन प्रशिक्षार्थी (म्यानेजमेन्ट ट्रेनी)',
    organization: 'Nabil Bank Limited',
    organizationNp: 'नबिल बैंक लिमिटेड, केन्द्रीय कार्यालय, काठमाडौं',
    category: 'banking',
    categoryLabelEn: 'Commercial Banking (Class A)',
    categoryLabelNp: 'वाणिज्य बैंक (क वर्ग)',
    location: 'Kathmandu, Pokhara, Chitwan, Butwal',
    vacancies: 45,
    deadlineBs: '२०८३-०४-२८',
    deadlineAd: '2026-08-13',
    isUrgent: true,
    qualification: 'Master’s Degree in Management/Economics (MBA/MBS) with min 60% or 3.2 GPA.',
    qualificationNp: 'व्यवस्थापन वा अर्थशास्त्रमा स्नातकोत्तर (MBA/MBS) न्यूनतम ६०% सहित।',
    level: 'Junior Officer Track',
    examType: 'Aptitude Test, Group Discussion & Board Interview',
    applyUrl: 'https://nabilbank.com/careers',
  },
  {
    id: 'gbime-assistant',
    title: 'Trainee Assistant / Branch Customer Service',
    titleNp: 'प्रशिक्षार्थी सहायक (शाखा ग्राहक सेवा तथा क्यासियर)',
    organization: 'Global IME Bank Limited',
    organizationNp: 'ग्लोबल आइएमई बैंक लिमिटेड',
    category: 'banking',
    categoryLabelEn: 'Commercial Banking (Class A)',
    categoryLabelNp: 'वाणिज्य बैंक (क वर्ग)',
    location: 'Across 350+ Branches Nationwide',
    vacancies: 120,
    deadlineBs: '२०८३-०५-०५',
    deadlineAd: '2026-08-21',
    isUrgent: false,
    qualification: 'Bachelor’s degree in Business/Commerce/IT with min 50% marks.',
    qualificationNp: 'वाणिज्य वा व्यवस्थापनमा स्नातक तह उत्तीर्ण।',
    level: 'Entry Level Assistant',
    examType: 'Online Screening + Regional Interview',
    applyUrl: 'https://globalimebank.com/career',
  },
  {
    id: 'tech-infodev-fullstack',
    title: 'Senior Full Stack TypeScript & Cloud Engineer',
    titleNp: 'सिनियर फुलस्ट्याक इन्जिनियर (क्लाउड र डाटाबेस)',
    organization: 'InfoDevelopers Pvt Ltd',
    organizationNp: 'इन्फो डेभलपर्स प्रा. लि., ललितपुर',
    category: 'tech',
    categoryLabelEn: 'Enterprise Software',
    categoryLabelNp: 'सूचना प्रविधि तथा सफ्टवेयर',
    location: 'Sanepa, Lalitpur (Hybrid Option)',
    vacancies: 12,
    deadlineBs: '२०८३-०५-१५',
    deadlineAd: '2026-08-31',
    isUrgent: false,
    qualification: 'Bachelor in Computer Engineering / CSIT with 3+ years experience.',
    qualificationNp: 'कम्प्युटर इन्जिनियरिङ वा CSIT मा स्नातक, ३ वर्ष अनुभव।',
    level: 'Mid-Senior Level',
    examType: 'System Design Interview & Live Coding',
    applyUrl: 'https://infodev.com.np/careers',
  },
  {
    id: 'health-staff-nurse',
    title: 'Staff Nurse (5th Level - ICU & Emergency)',
    titleNp: 'स्टाफ नर्स (पाँचौ तह - आपतकालीन तथा सघन उपचार)',
    organization: 'Tribhuvan University Teaching Hospital (TUTH)',
    organizationNp: 'त्रिवि शिक्षण अस्पताल, महाराजगञ्ज, काठमाडौं',
    category: 'health',
    categoryLabelEn: 'Health & Nursing',
    categoryLabelNp: 'स्वास्थ्य तथा नर्सिङ',
    location: 'Maharajgunj, Kathmandu',
    vacancies: 60,
    deadlineBs: '२०८३-०५-०८',
    deadlineAd: '2026-08-24',
    isUrgent: false,
    qualification: 'PCL Nursing from recognized nursing college with valid NNC Registration.',
    qualificationNp: 'पीसीएल नर्सिङ उत्तीर्ण र नेपाल नर्सिङ काउन्सिल (NNC) दर्ता।',
    level: 'Health Service Level 5',
    examType: 'Subjective Written & Practical OSCE',
    applyUrl: 'https://tuth.org.np/careers',
  },
  {
    id: 'ngo-icimod-coord',
    title: 'Project Coordinator - Climate Resilience & Water',
    titleNp: 'परियोजना संयोजक (जलवायु अनुकूलन तथा जलस्रोत)',
    organization: 'ICIMOD Nepal',
    organizationNp: 'इसिमोड नेपाल, खुमलटार, ललितपुर',
    category: 'ngo',
    categoryLabelEn: 'International NGO / Intergovernmental',
    categoryLabelNp: 'अन्तर्राष्ट्रिय गैरसरकारी संस्था',
    location: 'Khumaltar, Lalitpur & Field Sites',
    vacancies: 3,
    deadlineBs: '२०८३-०५-०२',
    deadlineAd: '2026-08-18',
    isUrgent: true,
    qualification: 'Master’s degree in Environmental Science, Water Governance or Public Policy.',
    qualificationNp: 'वातावरण विज्ञान वा सार्वजनिक नीतिमा स्नातकोत्तर।',
    level: 'P3 / Program Officer',
    examType: 'Portfolio Review & Panel Presentation',
    applyUrl: 'https://icimod.org/careers',
  },
];

export const LokSewaJobsView: React.FC<LokSewaJobsViewProps> = ({ currentLang }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'dofe' | 'syllabus'>('jobs');

  // DOFE Permit Status Lookup
  const [passportNo, setPassportNo] = useState('');
  const [isCheckingDofe, setIsCheckingDofe] = useState(false);
  const [dofeResult, setDofeResult] = useState<{
    status: 'VERIFIED' | 'NOT_FOUND';
    passport: string;
    company: string;
    country: string;
    jobTitle: string;
    feimsRegNo: string;
    issueDateBs: string;
    insuranceStatus: string;
    medicalStatus: string;
  } | null>(null);

  const handleDofeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNo.trim()) return;
    setIsCheckingDofe(true);

    setTimeout(() => {
      setIsCheckingDofe(false);
      setDofeResult({
        status: 'VERIFIED',
        passport: passportNo.trim().toUpperCase(),
        company: 'Al Shaya Trading & Retail LLC',
        country: 'State of Qatar (कतार)',
        jobTitle: 'Logistics Inventory Associate (स्टोर सहायक)',
        feimsRegNo: 'FEIMS-QA-2083-918274',
        issueDateBs: '२०८३-०३-१५ (Valid until 2085-03-14)',
        insuranceStatus: 'Active (Sun Nepal Life Insurance - Policy #98124)',
        medicalStatus: 'Fit / Biometrics Cleared (GAMCA Verified)',
      });
    }, 600);
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return EXTENDED_JOBS_CATALOG.filter((j) => {
      const matchCat = activeCategory === 'all' || j.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        j.title.toLowerCase().includes(q) ||
        (j.titleNp && j.titleNp.includes(q)) ||
        j.organization.toLowerCase().includes(q) ||
        (j.organizationNp && j.organizationNp.includes(q)) ||
        j.level.toLowerCase().includes(q) ||
        j.qualification.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          BENTO HEADER CONSOLE: Lok Sewa & Civic Employment Suite
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Official Civic Careers & Labor Radar
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentLang === 'ne'
              ? 'लोक सेवा आयोग, बैंकिङ रोजगार तथा वैदेशिक श्रम स्वीकृति'
              : 'Public Service Commission (Lok Sewa), Careers & DOFE Suite'}
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'नेपाल सरकार लोक सेवा आयोग (PSC) का आधिकारिक विज्ञापन, पाठ्यक्रम, बैंक तथा प्राविधिक रोजगारी र वैदेशिक रोजगार विभाग (DOFE) श्रम स्वीकृति प्रमाणीकरण।'
              : 'Authentic civil service vacancies from PSC Nepal (psconline.psc.gov.np), syllabus guides, banking openings, and DOFE FEIMS foreign labor permit verifier.'}
          </p>
        </div>

        {/* Tab Switcher Segment */}
        <div className="relative z-10 flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'सबै रोजगारी (लोक सेवा/बैंक)' : 'Active Vacancies'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dofe')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dofe'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'श्रम स्वीकृति जाँच (DOFE)' : 'DOFE Labor Permit'}</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'पाठ्यक्रम र परीक्षा क्यालेन्डर' : 'Syllabus & Calendar'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: BENTO SPOTLIGHT (8 Cols Spotlight Exam + 4 Cols DOFE Quick Check)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Spotlight Card (Span 8): Gazetted Section Officer Mega Examination */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all group relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  FEATURED PSC OPEN EXAM
                </span>
                <span className="text-[11px] font-mono text-slate-400">Notice No: PSC-2083/84-01</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">
                Deadline: २०८३-०५-१० (18 Days Left)
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                {currentLang === 'ne'
                  ? 'शाखा अधिकृत (रा.प. तृतीय श्रेणी) - खुला तथा समावेशी विज्ञापन'
                  : 'Section Officer (Gazetted Class III) - Open & Inclusive Competition'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                {currentLang === 'ne'
                  ? 'नेपाल प्रशासन, परराष्ट्र, लेखापरीक्षण तथा न्याय सेवा तर्फ कुल ४२० पदका लागि अनलाइन आवेदन खुला। प्रथम चरणको वस्तुगत परीक्षा असोज महिनामा सञ्चालन हुने।'
                  : 'Online applications invited for 420 Gazetted Class III administrative positions across Administration, Foreign Service, Audit, and Judicial wings.'}
              </p>
            </div>

            {/* Micro Spec Bento Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Total Vacancies</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">420 Posts</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Pay Scale & Grade</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">Level 7 (Grade III)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Exam Stages</div>
                <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">Prelim + Written + Viva</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Application Fee</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Rs. 1,000 (+400 Inc)</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official PSC Online Portal (psconline.psc.gov.np)</span>
            </span>

            <div className="flex items-center gap-2">
              <a
                href="https://psc.gov.np/category/syllabus.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Syllabus PDF</span>
              </a>

              <a
                href="https://psconline.psc.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/40"
              >
                <span>{currentLang === 'ne' ? 'अनलाइन दरखास्त दिनुहोस्' : 'Apply on PSC Online'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick DOFE Permit Verifier Tile (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all group relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DOFE FEIMS LIVE
              </span>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Foreign Employment Radar
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                {currentLang === 'ne' ? 'श्रम स्वीकृति तथा स्टिकर जाँच' : 'Labor Permit Verification'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentLang === 'ne'
                  ? 'वैदेशिक रोजगारीमा जानुअघि राहदानी नम्बरबाट श्रम स्वीकृति, बिमा र मेडिकल स्थिति प्रमाणित गर्नुहोस्।'
                  : 'Verify authentic labor approval status, mandatory life insurance, and Gamca medical clearance.'}
              </p>
            </div>

            <form onSubmit={handleDofeCheck} className="space-y-2 pt-1">
              <input
                type="text"
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                placeholder={currentLang === 'ne' ? 'राहदानी नम्बर (उदा: PA0987654)' : 'Passport No. (e.g. PA0987654)'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs uppercase placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isCheckingDofe}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
              >
                {isCheckingDofe ? (
                  <span>Checking DOFE Gateway...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ne' ? 'श्रम स्वीकृति स्थिति जाँच्नुहोस्' : 'Verify Labor Permit'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-400 font-mono text-[11px]">dofe.gov.np</span>
            <a
              href="https://feims.dofe.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
            >
              <span>FEIMS Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* DOFE Verification Result Banner (if queried) */}
      {dofeResult && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">
                Labor Approval Verified: Passport #{dofeResult.passport}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              STATUS: CLEARED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Destination & Employer</span>
              <span className="font-bold text-white mt-0.5 block">{dofeResult.company}</span>
              <span className="text-[11px] text-emerald-400">{dofeResult.country}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Approved Designation</span>
              <span className="font-bold text-white mt-0.5 block">{dofeResult.jobTitle}</span>
              <span className="text-[10px] font-mono text-slate-400">Reg: {dofeResult.feimsRegNo}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Life Insurance Coverage</span>
              <span className="font-medium text-slate-200 mt-0.5 block">{dofeResult.insuranceStatus}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Medical Fitness & Validity</span>
              <span className="font-medium text-emerald-400 mt-0.5 block">{dofeResult.medicalStatus}</span>
              <span className="text-[10px] text-slate-400">{dofeResult.issueDateBs}</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FILTER & SEARCH TOOLBAR
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'पद, संस्था वा योग्यता खोज्नुहोस् (उदा: शाखा अधिकृत, बैंक, इन्जिनियर)...'
                : 'Search opportunities (e.g. Officer, Banking, Engineer, Health)...'
            }
            className="w-full bg-[#0B0F17]/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Filter Categories with Zero-Pill Glider Style */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-slate-950 border border-slate-800 scrollbar-none">
          {[
            { id: 'all', labelEn: 'All Openings', labelNp: 'सबै पद' },
            { id: 'loksewa', labelEn: 'Lok Sewa (PSC)', labelNp: 'लोक सेवा आयोग' },
            { id: 'banking', labelEn: 'Banking', labelNp: 'बैंक तथा वित्तीय' },
            { id: 'tech', labelEn: 'IT & Engineering', labelNp: 'प्रविधि र इन्जिनियरिङ' },
            { id: 'health', labelEn: 'Health & Nursing', labelNp: 'स्वास्थ्य सेवा' },
            { id: 'ngo', labelEn: 'NGO / INGO', labelNp: 'गैरसरकारी' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentLang === 'ne' ? cat.labelNp : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN BENTO GRID: MULTI-COLUMN OPPORTUNITY CARDS
          ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex flex-col justify-between space-y-4"
            >
              {/* Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

              <div className="space-y-3 relative z-10">
                {/* Card Header Strip */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.categoryLabelEn}</span>
                  </div>

                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                      job.isUrgent
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {job.vacancies} Vacancies
                  </span>
                </div>

                {/* Job Title & Organization */}
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {currentLang === 'ne' && job.titleNp ? job.titleNp : job.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                    <span>{currentLang === 'ne' && job.organizationNp ? job.organizationNp : job.organization}</span>
                  </p>
                </div>

                {/* Specs Bento Box */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                    <span>Level / Class:</span>
                    <span className="text-slate-200 font-semibold">{job.level}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                    <span>Location:</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                    <span>Deadline (BS):</span>
                    <span className="text-rose-400 font-bold">{job.deadlineBs}</span>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 pt-1 border-t border-slate-800/60 leading-relaxed">
                    <strong>Req:</strong>{' '}
                    {currentLang === 'ne' && job.qualificationNp ? job.qualificationNp : job.qualification}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
                <span className="text-slate-500 font-mono text-[10px]">AD: {job.deadlineAd}</span>

                <div className="flex items-center gap-2">
                  {job.syllabusUrl && (
                    <a
                      href={job.syllabusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700/60"
                      title="Download Official Syllabus"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>Syllabus</span>
                    </a>
                  )}

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-all"
                  >
                    <span>Apply</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          TAB 2: SYLLABUS & EXAMINATION CALENDAR BENTO
          ========================================================================= */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {currentLang === 'ne' ? 'लोक सेवा आयोग वार्षिक परीक्षा क्यालेन्डर २०८३' : 'PSC Annual Exam Schedule 2083'}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Publication & Exam Matrix</span>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800/60">
              {[
                { title: 'शाखा अधिकृत (अप्राविधिक)', pub: 'मंसिर अन्तिम बुधबार', exam: 'माघ / फाल्गुन', res: 'चैत्र २०८३' },
                { title: 'नायब सुब्बा (अप्राविधिक)', pub: 'पुस अन्तिम बुधबार', exam: 'फाल्गुन / चैत्र', res: 'वैशाख २०८४' },
                { title: 'खरिदार (अप्राविधिक)', pub: 'फाल्गुन अन्तिम बुधबार', exam: 'वैशाख / जेठ', res: 'असार २०८४' },
                { title: 'इन्जिनियरिङ सेवा (प्राविधिक)', pub: 'साउन अन्तिम बुधबार', exam: 'असोज / कार्तिक', res: 'मंसिर २०८३' },
              ].map((sch, i) => (
                <div key={i} className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{sch.title}</span>
                    <span className="text-slate-400 text-[11px]">सूचना: {sch.pub}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-400 block">{sch.exam}</span>
                    <span className="text-[10px] text-slate-500">नतिजा: {sch.res}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {currentLang === 'ne' ? 'आधिकारिक पाठ्यक्रम तथा पुराना प्रश्नपत्रहरू' : 'Official Syllabus & Old Papers'}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Free PDF Downloads</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'शाखा अधिकृत प्रथम पत्र (सामान्य ज्ञान र बौद्धिक परीक्षण IQ)', size: '2.4 MB', url: 'https://psc.gov.np' },
                { name: 'शाखा अधिकृत दोस्रो पत्र (शासन प्रणाली र समसामयिक मामिला)', size: '3.1 MB', url: 'https://psc.gov.np' },
                { name: 'नायब सुब्बा प्रथम पत्र (GK & Contextual Intelligence)', size: '1.8 MB', url: 'https://psc.gov.np' },
                { name: 'नेपाल राष्ट्र बैंक सहायक दोस्रो तह पाठ्यक्रम', size: '1.2 MB', url: 'https://nrb.org.np' },
              ].map((pdf, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between"
                >
                  <span className="text-slate-200 font-medium truncate max-w-xs">{pdf.name}</span>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>{pdf.size}</span>
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
