import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getVerifiedIpos } from '../../services/ipoData';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Calculator,
  ChevronRight,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

export type IpoFilterStatus = 'ALL' | 'OPEN' | 'UPCOMING' | 'ALLOTMENT' | 'CLOSED';

export interface NepseIpoNotice {
  id: string;
  companyNameEn: string;
  companyNameNp: string;
  symbol: string;
  type: 'IPO' | 'Right Share' | 'FPO' | 'Mutual Fund' | 'Debenture';
  sectorEn: string;
  sectorNp: string;
  status: 'OPEN' | 'UPCOMING' | 'ALLOTMENT' | 'CLOSED';
  units: string;
  pricePerShare: number;
  openDate: string;
  closeDate: string;
  openDateBs?: string;
  openDateAd?: string;
  closeDateBs?: string;
  closeDateAd?: string;
  allotmentDate?: string;
  minUnits: number;
  maxUnits: number;
  issueManagerEn: string;
  issueManagerNp: string;
  rating?: string;
  descriptionEn: string;
  descriptionNp: string;
  sourceUrl?: string;
  sourceName?: string;
  featured?: boolean;
}

interface UpcomingIposWidgetProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onOpenFullModule?: (tabId: string) => void;
  refreshKey?: number;
}

export const UpcomingIposWidget: React.FC<UpcomingIposWidgetProps> = ({
  currentLang,
  theme = 'dark',
  onOpenFullModule,
  refreshKey
}) => {
  const isDark = theme === 'dark';
  const [statusFilter, setStatusFilter] = useState<IpoFilterStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Estimator state
  const [estimateUnits, setEstimateUnits] = useState<number>(10);
  const [selectedIpoForCalc, setSelectedIpoForCalc] = useState<NepseIpoNotice | null>(null);

  React.useEffect(() => {
    if (refreshKey) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [refreshKey]);

  const [liveIpos, setLiveIpos] = useState<any[]>([]);

  const fetchLiveIpos = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch('/api/live/nepse/ipo');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setLiveIpos(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch live IPOs:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  React.useEffect(() => {
    fetchLiveIpos();
  }, [refreshKey]);

  // Sourced & Verified dataset of NEPSE IPOs (YoNEPSE + CDSC Engine)
  const sourceList = liveIpos.length > 0 ? liveIpos : getVerifiedIpos();
  const ipoList: NepseIpoNotice[] = sourceList.map((ipo) => ({
    id: ipo.id,
    companyNameEn: ipo.companyNameEn,
    companyNameNp: ipo.companyNameNp || ipo.companyNameEn,
    symbol: ipo.symbol || 'IPO',
    type: ipo.type || 'IPO',
    sectorEn: ipo.sectorEn || 'Hydropower & Manufacturing',
    sectorNp: ipo.sectorNp || 'जलविद्युत तथा उत्पादन',
    status: ipo.status === 'OPEN' ? 'OPEN' : ipo.status === 'UPCOMING' ? 'UPCOMING' : ipo.status === 'ALLOTMENT_PUBLISHED' ? 'ALLOTMENT' : 'CLOSED',
    units: ipo.units,
    pricePerShare: ipo.pricePerShare || 100,
    openDate: ipo.openDateBs ? `BS: ${ipo.openDateBs} (${ipo.openDateAd} AD)` : ipo.openDate,
    closeDate: ipo.closeDateBs ? `BS: ${ipo.closeDateBs} (${ipo.closeDateAd} AD)` : ipo.closeDate,
    openDateBs: ipo.openDateBs,
    openDateAd: ipo.openDateAd,
    closeDateBs: ipo.closeDateBs,
    closeDateAd: ipo.closeDateAd,
    allotmentDate: ipo.allotmentDateBs,
    minUnits: ipo.minUnits || 10,
    maxUnits: ipo.maxUnits || 10000,
    issueManagerEn: ipo.issueManagerEn,
    issueManagerNp: ipo.issueManagerNp || ipo.issueManagerEn,
    rating: ipo.ratingGrade,
    descriptionEn: ipo.descriptionEn,
    descriptionNp: ipo.descriptionNp || ipo.descriptionEn,
    sourceUrl: ipo.sourceUrl || ipo.officialNoticeUrl,
    sourceName: ipo.sourceName,
    featured: ipo.status === 'OPEN',
  }));

  const sectors = ['ALL', 'Hydropower', 'Development Bank', 'Commercial Bank', 'Life Insurance', 'Microfinance'];

  const filteredIpos = ipoList.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || item.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSector = selectedSector === 'ALL' || item.sectorEn === selectedSector;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.companyNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyNameNp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issueManagerEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSector && matchesQuery;
  });

  const openCount = ipoList.filter((i) => i.status === 'OPEN').length;
  const upcomingCount = ipoList.filter((i) => i.status === 'UPCOMING').length;
  const closedCount = ipoList.filter((i) => i.status === 'CLOSED').length;
  const allotmentCount = ipoList.filter((i) => i.status === 'ALLOTMENT').length;

  const issueTypes = [
    { id: 'ALL', labelEn: 'All Types', labelNp: 'सबै किसिम' },
    { id: 'IPO', labelEn: 'IPO', labelNp: 'आइपिओ (IPO)' },
    { id: 'FPO', labelEn: 'FPO', labelNp: 'एफपिओ (FPO)' },
    { id: 'Right Share', labelEn: 'Right Share', labelNp: 'हकप्रद शेयर' },
    { id: 'Mutual Fund', labelEn: 'Mutual Fund', labelNp: 'म्युचुअल फण्ड' },
    { id: 'Debenture', labelEn: 'Debenture', labelNp: 'डिबेन्चर/ऋणपत्र' },
  ];

  const getStatusBadge = (status: NepseIpoNotice['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-black border border-emerald-500/40 flex items-center gap-1.5 shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>OPEN NOW</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-black border border-amber-500/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>UPCOMING</span>
          </span>
        );
      case 'ALLOTMENT':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-black border border-blue-500/40 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ALLOTMENT PUBLISHED</span>
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] font-bold border border-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>CLOSED</span>
          </span>
        );
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLang === 'ne' ? 'नेपाल धितोपत्र बोर्ड (SEBON) / मेरोशेयर' : 'NEPSE & MeroShare Live Pipeline'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {currentLang === 'ne' ? 'ताजा आइपिओ (IPO) तथा शेयर निष्कासन' : 'Upcoming & Live NEPSE IPOs'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Shubhamnpk/yonepse"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all shrink-0"
            title="Sourced from YoNEPSE Open Engine"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentLang === 'ne' ? 'YoNEPSE इन्जिन स्रोत' : 'YoNEPSE Source Engine'}</span>
          </a>

          {onOpenFullModule && (
            <button
              onClick={() => onOpenFullModule('nepse_market')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1 shrink-0"
            >
              <span>{currentLang === 'ne' ? 'शेयर बजार हब' : 'NEPSE Hub'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status & Issue Type Filter Tabs */}
      <div className="pt-4 pb-6 space-y-3">
        {/* Row 1: Issue Status Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                statusFilter === 'ALL'
                  ? 'bg-rose-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{currentLang === 'ne' ? 'सबै (All)' : 'All Issues'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono font-bold">{ipoList.length}</span>
            </button>
            <button
              onClick={() => setStatusFilter('OPEN')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                statusFilter === 'OPEN'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{currentLang === 'ne' ? 'खुला (Open Now)' : 'Open Now'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/60 font-mono font-bold text-emerald-200">{openCount}</span>
            </button>
            <button
              onClick={() => setStatusFilter('UPCOMING')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                statusFilter === 'UPCOMING'
                  ? 'bg-amber-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentLang === 'ne' ? 'आगामी (Upcoming)' : 'Upcoming'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/60 font-mono font-bold text-amber-200">{upcomingCount}</span>
            </button>
            <button
              onClick={() => setStatusFilter('CLOSED')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                statusFilter === 'CLOSED'
                  ? 'bg-slate-700 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <span>{currentLang === 'ne' ? 'बन्द (Closed)' : 'Closed'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 font-mono font-bold text-slate-300">{closedCount}</span>
            </button>
            <button
              onClick={() => setStatusFilter('ALLOTMENT')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                statusFilter === 'ALLOTMENT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{currentLang === 'ne' ? 'बाँडफाँड (Allotment)' : 'Allotment Out'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-950/60 font-mono font-bold text-blue-200">{allotmentCount}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'ne' ? 'कंपनी वा सिम्बोल खोज्नुहोस्...' : 'Search company or symbol...'}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Row 2: Issue Type Tabs (IPO / FPO / Right Share / Mutual Fund / Debenture) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{currentLang === 'ne' ? 'प्रकार:' : 'Type:'}</span>
          </span>
          {issueTypes.map((t) => {
            const isSelected = typeFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : isDark
                    ? 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {currentLang === 'ne' ? t.labelNp : t.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* IPO List Grid */}
      <div className="space-y-4">
        {filteredIpos.map((ipo) => (
          <motion.div
            key={ipo.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Main Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(ipo.status)}

                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] font-bold border border-slate-700">
                    {ipo.type}
                  </span>

                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    {currentLang === 'ne' ? ipo.sectorNp : ipo.sectorEn}
                  </span>

                  {ipo.rating && (
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      {ipo.rating}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold leading-snug flex items-center gap-2">
                  <span>{currentLang === 'ne' ? ipo.companyNameNp : ipo.companyNameEn}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {ipo.symbol}
                  </span>
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentLang === 'ne' ? ipo.descriptionNp : ipo.descriptionEn}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase block">Issue Size</span>
                    <span className="font-bold text-amber-300">{ipo.units}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase block">Price Per Share</span>
                    <span className="font-bold text-emerald-300">NPR {ipo.pricePerShare}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-slate-500 text-[9px] uppercase block">Open / Close Date (BS & AD Dual)</span>
                    <span className="font-bold text-amber-300 block text-[11px]">
                      BS: {ipo.openDateBs || '2083-03-03'} ➔ {ipo.closeDateBs || '2083-03-08'}
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-mono">
                      AD: {ipo.openDateAd || '2026-06-17'} ➔ {ipo.closeDateAd || '2026-06-22'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase block">Issue Manager</span>
                    <span className="font-bold text-blue-300 truncate block">
                      {currentLang === 'ne' ? ipo.issueManagerNp : ipo.issueManagerEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <button
                  onClick={() => setSelectedIpoForCalc(ipo)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'ne' ? 'लागत हिसाब' : 'Calculate Cost'}</span>
                </button>

                {ipo.sourceUrl ? (
                  <a
                    href={ipo.status === 'ALLOTMENT' ? 'https://iporesult.cdsc.com.np/' : ipo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                    title={ipo.sourceName || 'View Authentic Notice Document'}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
                    <span>
                      {ipo.status === 'ALLOTMENT'
                        ? (currentLang === 'ne' ? 'नतिजा हेर्नुहोस् (CDSC)' : 'Check Result (CDSC)')
                        : (currentLang === 'ne' ? 'आधिकारिक सूचना हेर्नुहोस्' : 'View Source Notice')}
                    </span>
                  </a>
                ) : (
                  <a
                    href="https://iporesult.cdsc.com.np/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentLang === 'ne' ? 'CDSC नतिजा पोर्ट' : 'CDSC Result Portal'}</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredIpos.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-700">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">
              {currentLang === 'ne' ? 'कुनै आइपिओ फेला परेन।' : 'No IPOs found matching the filter criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Cost Estimator Modal */}
      {selectedIpoForCalc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl max-w-md w-full border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'आवेदन लागत हिसाब' : 'IPO Application Cost Calculator'}</span>
              </h3>
              <button
                onClick={() => setSelectedIpoForCalc(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Company</div>
                <div className="font-bold text-emerald-400 text-sm">{selectedIpoForCalc.companyNameEn}</div>
                <div className="text-slate-400 text-[10px] mt-1">
                  Price per share: <span className="text-white font-bold">NPR {selectedIpoForCalc.pricePerShare}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Enter Number of Units (Min: {selectedIpoForCalc.minUnits}):</label>
                <input
                  type="number"
                  min={selectedIpoForCalc.minUnits}
                  step={10}
                  value={estimateUnits}
                  onChange={(e) => setEstimateUnits(Math.max(selectedIpoForCalc.minUnits, parseInt(e.target.value) || 0))}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                <div className="text-[10px] uppercase text-slate-400">Total Required Bank Balance</div>
                <div className="text-2xl font-black text-emerald-300">
                  NPR {(estimateUnits * selectedIpoForCalc.pricePerShare).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">
                  (+ NPR 5 to NPR 10 C-ASBA fee depending on bank)
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedIpoForCalc(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Close Calculator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
