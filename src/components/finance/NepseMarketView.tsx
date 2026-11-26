import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Hash,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useLiveData } from '../../utils/liveDataEngine';
import { CdscIpoCheckResult } from '../../services/cdscIpoResultService';
import {
  NEPAL_CAPITALS_DIRECTORY,
  composeBoid,
  getCapitalByDpId,
  maskBoidSecurely,
  splitBoid,
} from '../../services/nepalCapitalsRegistry';
import { MeroshareAutoApplyView } from './MeroshareAutoApplyView';

interface NepseMarketViewProps {
  currentLang: 'en' | 'ne';
}

export const NepseMarketView: React.FC<NepseMarketViewProps> = ({ currentLang }) => {
  const isNe = currentLang === 'ne';
  const nepseStream = useLiveData<any>('nepse-market');
  const [liveIpos, setLiveIpos] = useState<any[]>([]);
  const [cdscCompanies, setCdscCompanies] = useState<any[]>([]);
  const [liveDividends, setLiveDividends] = useState<any[]>([]);
  const [liveDisclosures, setLiveDisclosures] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'market' | 'ipos' | 'meroshare'>('market');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Open' | 'Upcoming' | 'Closed'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const [marketSubTab, setMarketSubTab] = useState<
    'all' | 'gainers' | 'losers' | 'turnover' | 'dividends' | 'disclosures'
  >('all');
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [stockPage, setStockPage] = useState<number>(1);
  const STOCKS_PER_PAGE = 25;

  // BOID & Capital states
  const [inputMode, setInputMode] = useState<'capital_client' | 'full_boid'>('capital_client');
  const [selectedCapitalDpId, setSelectedCapitalDpId] = useState<string>('13012600');
  const [clientId, setClientId] = useState<string>('');
  const [fullBoid, setFullBoid] = useState<string>('');
  const [maskPrivateBoid, setMaskPrivateBoid] = useState<boolean>(true);

  const [selectedIpo, setSelectedIpo] = useState('');
  const [isCheckingResult, setIsCheckingResult] = useState(false);
  const [checkResult, setCheckResult] = useState<CdscIpoCheckResult | null>(null);
  const [copiedBoid, setCopiedBoid] = useState(false);

  useEffect(() => {
    fetch('/api/live/nepse/ipo')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setLiveIpos(json.data);
        }
      })
      .catch(() => undefined);

    fetch('/api/iporesult/companies')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.companies && Array.isArray(json.companies) && json.companies.length > 0) {
          setCdscCompanies(json.companies);
          setSelectedIpo(String(json.companies[0].id));
        }
      })
      .catch(() => undefined);

    fetch('/api/live/nepse/dividends')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setLiveDividends(json.data);
        }
      })
      .catch(() => undefined);

    fetch('/api/live/nepse/disclosures')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setLiveDisclosures(json.data);
        }
      })
      .catch(() => undefined);
  }, []);

  const effectiveBoid =
    inputMode === 'capital_client'
      ? selectedCapitalDpId && clientId
        ? composeBoid(selectedCapitalDpId, clientId)
        : ''
      : fullBoid.trim().replace(/\D/g, '');

  const handleClientIdChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 16) {
      const split = splitBoid(clean);
      if (split.dpId) setSelectedCapitalDpId(split.dpId);
      setClientId(split.clientId);
    } else {
      setClientId(clean.slice(0, 8));
    }
    if (checkResult) setCheckResult(null);
  };

  const handleFullBoidChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    setFullBoid(clean);
    if (clean.length >= 8) {
      const dpPrefix = clean.slice(0, 8);
      if (NEPAL_CAPITALS_DIRECTORY.some((c) => c.dpId === dpPrefix)) {
        setSelectedCapitalDpId(dpPrefix);
      }
    }
    if (checkResult) setCheckResult(null);
  };

  const marketIndices: any[] = Array.isArray(nepseStream.data?.indices) ? nepseStream.data.indices : [];
  const stocksList: any[] = Array.isArray(nepseStream.data?.stocks) ? nepseStream.data.stocks : [];
  const turnoverNpr = typeof nepseStream.data?.turnoverNpr === 'number' ? nepseStream.data.turnoverNpr : null;
  const totalSharesTraded =
    typeof nepseStream.data?.totalSharesTraded === 'number' ? nepseStream.data.totalSharesTraded : null;
  const totalTransactions =
    typeof nepseStream.data?.totalTransactions === 'number' ? nepseStream.data.totalTransactions : null;
  const marketStatusText = nepseStream.payload?.marketStatus || nepseStream.data?.marketStatus || 'Unavailable';

  const iposList = liveIpos.map((ipo) => ({
    id: ipo.id,
    companyName: ipo.companyNameEn || ipo.companyName,
    type: ipo.type || 'IPO',
    units: ipo.units,
    pricePerShare: ipo.pricePerShare || 100,
    issueManager: ipo.issueManagerEn || ipo.issueManager,
    status: ipo.status === 'OPEN' ? 'Open' : ipo.status === 'UPCOMING' ? 'Upcoming' : 'Closed',
    openDateBs: ipo.openDateBs,
    openDateAd: ipo.openDateAd,
    closeDateBs: ipo.closeDateBs,
    closeDateAd: ipo.closeDateAd,
    minUnits: ipo.minUnits || 10,
    sourceUrl: ipo.sourceUrl || ipo.officialNoticeUrl,
  }));

  const filteredIposList = iposList.filter((ipo) => {
    const matchesStatus = statusFilter === 'ALL' || ipo.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || String(ipo.type).toLowerCase() === typeFilter.toLowerCase();
    return matchesStatus && matchesType;
  });

  const handleCheckIpoResult = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBoid = effectiveBoid.trim().replace(/\D/g, '');
    if (!cleanBoid || cleanBoid.length !== 16) {
      setCheckResult({
        success: false,
        status: 'INVALID_BOID',
        isAllotted: false,
        message: 'Please enter a valid 16-digit BOID or 8-digit Client Demat ID.',
        messageNp: 'कृपया वैध १६ अंकको BOID वा ८ अंकको डिम्याट आइडी प्रविष्ट गर्नुहोस्।',
        dataSource: 'CDS & Clearing Limited (CDSC)',
        verifiedAtIso: new Date().toISOString(),
        adDate: new Date().toISOString().slice(0, 10),
        bsDate: '',
        officialPortalUrl: 'https://iporesult.cdsc.com.np',
      });
      return;
    }

    setIsCheckingResult(true);
    setCheckResult(null);

    const activeCompanyObj = cdscCompanies.find((c) => String(c.id) === String(selectedIpo));
    const companyName = activeCompanyObj?.name || 'Selected IPO';

    try {
      const response = await fetch('/api/iporesult/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyShareId: selectedIpo,
          boid: cleanBoid,
          companyName,
        }),
      });

      const data: CdscIpoCheckResult = await response.json();
      setCheckResult(data);
    } catch (err: any) {
      setCheckResult({
        success: false,
        status: 'UNAVAILABLE',
        isAllotted: false,
        message: `CDSC Gateway connection error: ${err.message}. Official data is currently unavailable.`,
        messageNp: 'सीडीएससी सर्भर जडान त्रुटि: आधिकारिक तथ्याङ्क हाल उपलब्ध छैन।',
        dataSource: 'CDS & Clearing Limited (CDSC)',
        verifiedAtIso: new Date().toISOString(),
        adDate: new Date().toISOString().slice(0, 10),
        bsDate: '',
        officialPortalUrl: 'https://iporesult.cdsc.com.np',
        error: err.message,
      });
    } finally {
      setIsCheckingResult(false);
    }
  };

  const copyBoidToClipboard = () => {
    if (effectiveBoid) {
      navigator.clipboard?.writeText(effectiveBoid).catch(() => undefined);
      setCopiedBoid(true);
      setTimeout(() => setCopiedBoid(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              {isNe ? 'नेप्से सेयर बजार तथा आइपिओ' : 'NEPSE Market & IPO Suite'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isNe
              ? 'नेपाल स्टक एक्सचेन्ज (NEPSE) परिसूचक, सेयर दर र CDSC MeroShare नतिजा'
              : 'NEPSE market indices, listed securities, corporate disclosures & official CDSC IPO allotment'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => nepseStream.refresh()}
            disabled={nepseStream.isRefreshing}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${nepseStream.isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span>{nepseStream.isRefreshing ? (isNe ? 'सिङ्क हुँदै...' : 'Syncing...') : isNe ? 'ताजा गर्नुहोस्' : 'Refresh Feed'}</span>
          </button>

          <a
            href="https://iporesult.cdsc.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#0B1F3A] dark:bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>CDSC IPO Result</span>
          </a>

          <a
            href="https://www.nepalstock.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>NEPSE Official</span>
          </a>
        </div>
      </div>

      {/* Provenance Bar */}
      <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              nepseStream.isLive && !nepseStream.isCached ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="truncate">
            Source: <strong className="text-[#0B1F3A] dark:text-slate-200">{nepseStream.dataSource}</strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] tabular-nums">
          <span>
            Feed:{' '}
            <strong className={nepseStream.isLive && !nepseStream.isCached ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
              {nepseStream.isLoading
                ? 'Loading'
                : nepseStream.isLive && !nepseStream.isCached
                ? 'Verified Live'
                : nepseStream.isCached
                ? 'Cached'
                : 'Unavailable'}
            </strong>
          </span>
          <span>
            {nepseStream.lastUpdatedAd} ({nepseStream.lastUpdatedBs})
          </span>
        </div>
      </div>

      <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
        <strong>{isNe ? 'बजार सूचना:' : 'Market Disclaimer:'}</strong>{' '}
        {isNe
          ? 'नेप्से सूचक, सेयर मूल्य र आइपिओ जानकारी सन्दर्भका लागि मात्र हुन् — लगानी सल्लाह होइनन्। कारोबार गर्नुअघि SEBON इजाजतप्राप्त ब्रोकर वा CDSC पोर्टलमा पुष्टि गर्नुहोस्।'
          : 'NEPSE index, scrip prices, and IPO disclosures are displayed strictly for informational reference and do not constitute investment advice.'}
      </div>

      {/* Primary Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'market'
                ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isNe ? 'नेप्से बजार' : 'Market Data'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ipos')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ipos'
                ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isNe ? 'आइपिओ र नतिजा' : 'IPO & Allotment'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meroshare')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'meroshare'
                ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isNe ? 'मेरोसेयर सी-आस्वा' : 'MeroShare C-ASBA'}</span>
          </button>
        </div>
      </div>

      {/* Indices Ticker Strip */}
      {marketIndices.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {marketIndices.slice(0, 6).map((idx: any, i: number) => (
            <div
              key={i}
              className="p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
            >
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {idx.name}
              </div>
              <div className="text-base font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
                {idx.value}
              </div>
              <div
                className={`text-[11px] font-semibold font-mono tabular-nums mt-0.5 flex items-center gap-0.5 ${
                  idx.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {idx.change >= 0 ? '+' : ''}
                  {idx.change} ({idx.pChange}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 1: MARKET */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Total Turnover
              </div>
              <div className="text-sm font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
                {turnoverNpr !== null ? `Rs. ${(turnoverNpr / 1000000000).toFixed(2)} Arba` : '—'}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Traded Shares
              </div>
              <div className="text-sm font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
                {totalSharesTraded !== null ? `${totalSharesTraded.toLocaleString()} units` : '—'}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Transactions
              </div>
              <div className="text-sm font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
                {totalTransactions !== null ? totalTransactions.toLocaleString() : '—'}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Market Session
              </div>
              <div className="text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] font-mono mt-0.5">
                {marketStatusText}
              </div>
            </div>
          </div>

          {/* Sub-Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              {[
                { id: 'all', label: isNe ? 'सबै सेयर' : 'All Scrips' },
                { id: 'gainers', label: isNe ? 'शीर्ष बढ्ने' : 'Top Gainers' },
                { id: 'losers', label: isNe ? 'शीर्ष घट्ने' : 'Top Losers' },
                { id: 'turnover', label: isNe ? 'उच्च कारोबार' : 'Top Turnover' },
                { id: 'dividends', label: isNe ? 'लाभांश घोषणा' : 'Dividends' },
                { id: 'disclosures', label: isNe ? 'कम्पनी सूचना' : 'Disclosures' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setMarketSubTab(sub.id as any);
                    setStockPage(1);
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    marketSubTab === sub.id
                      ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {marketSubTab === 'all' && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder={isNe ? 'प्रतीक वा कम्पनी खोज्नुहोस्...' : 'Search symbol or company...'}
                  value={stockSearchQuery}
                  onChange={(e) => {
                    setStockSearchQuery(e.target.value);
                    setStockPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#2563EB] w-48 sm:w-56"
                />

                <select
                  value={selectedSectorFilter}
                  onChange={(e) => {
                    setSelectedSectorFilter(e.target.value);
                    setStockPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                >
                  <option value="ALL">{isNe ? 'सबै क्षेत्रहरू' : 'All Sectors'}</option>
                  <option value="Commercial Banks">Commercial Banks</option>
                  <option value="Hydro">HydroPower</option>
                  <option value="Microfinance">Microfinance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Non Life Insurance">Non Life Insurance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Development Bank">Development Banks</option>
                  <option value="Finance">Finance</option>
                  <option value="Hotels">Hotels & Tourism</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
            )}
          </div>

          {(marketSubTab === 'all' ||
            marketSubTab === 'gainers' ||
            marketSubTab === 'losers' ||
            marketSubTab === 'turnover') &&
            (() => {
              let activeDataset = stocksList;
              if (marketSubTab === 'gainers') {
                activeDataset =
                  nepseStream.data?.topGainers ||
                  [...stocksList].sort((a: any, b: any) => (b.pChange ?? 0) - (a.pChange ?? 0)).slice(0, 15);
              } else if (marketSubTab === 'losers') {
                activeDataset =
                  nepseStream.data?.topLosers ||
                  [...stocksList].sort((a: any, b: any) => (a.pChange ?? 0) - (b.pChange ?? 0)).slice(0, 15);
              } else if (marketSubTab === 'turnover') {
                activeDataset =
                  nepseStream.data?.topTurnover ||
                  [...stocksList].sort((a: any, b: any) => (b.turnover ?? 0) - (a.turnover ?? 0)).slice(0, 15);
              }

              const filtered = activeDataset.filter((s: any) => {
                const matchesSearch =
                  !stockSearchQuery.trim() ||
                  s.symbol?.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                  s.companyName?.toLowerCase().includes(stockSearchQuery.toLowerCase());
                const matchesSector =
                  selectedSectorFilter === 'ALL' ||
                  (s.sector && s.sector.toLowerCase().includes(selectedSectorFilter.toLowerCase()));
                return matchesSearch && matchesSector;
              });

              const totalPages = Math.ceil(filtered.length / STOCKS_PER_PAGE) || 1;
              const displayed =
                marketSubTab === 'all'
                  ? filtered.slice((stockPage - 1) * STOCKS_PER_PAGE, stockPage * STOCKS_PER_PAGE)
                  : filtered;

              return (
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                        {marketSubTab === 'all' && (isNe ? 'सूचीकृत कम्पनीहरू' : 'Traded Securities')}
                        {marketSubTab === 'gainers' && (isNe ? 'शीर्ष बढ्ने सेयरहरू' : 'Top Gainers')}
                        {marketSubTab === 'losers' && (isNe ? 'शीर्ष घट्ने सेयरहरू' : 'Top Losers')}
                        {marketSubTab === 'turnover' && (isNe ? 'उच्च कारोबार भएका सेयरहरू' : 'Highest Turnover')}{' '}
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          ({filtered.length})
                        </span>
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {nepseStream.lastUpdatedAd} ({nepseStream.lastUpdatedBs})
                    </span>
                  </div>

                  {displayed.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      {nepseStream.isLoading
                        ? 'Loading NEPSE market feed...'
                        : stocksList.length === 0
                        ? 'Official data is currently unavailable.'
                        : `No matching securities found for "${stockSearchQuery}".`}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                            <th className="pb-2.5">Symbol</th>
                            <th className="pb-2.5">Company</th>
                            <th className="pb-2.5">Sector</th>
                            <th className="pb-2.5 text-right">LTP (Rs)</th>
                            <th className="pb-2.5 text-right">Change</th>
                            <th className="pb-2.5 text-right">% Change</th>
                            <th className="pb-2.5 text-right">Volume</th>
                            <th className="pb-2.5 text-right">Turnover</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-800 dark:text-slate-200">
                          {displayed.map((s: any) => (
                            <tr key={s.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 font-bold text-[#0B1F3A] dark:text-[#60A5FA] font-mono">
                                {s.symbol}
                              </td>
                              <td className="py-2.5 font-medium max-w-[200px] truncate">{s.companyName || s.symbol}</td>
                              <td className="py-2.5 text-slate-500 dark:text-slate-400 text-[11px]">{s.sector || '—'}</td>
                              <td className="py-2.5 text-right font-mono font-semibold tabular-nums">
                                Rs. {typeof s.ltp === 'number' ? s.ltp.toFixed(1) : s.ltp ?? '—'}
                              </td>
                              <td
                                className={`py-2.5 text-right font-mono font-semibold tabular-nums ${
                                  s.change > 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : s.change < 0
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-slate-500'
                                }`}
                              >
                                {s.change > 0 ? '+' : ''}
                                {typeof s.change === 'number' ? s.change.toFixed(2) : s.change ?? '—'}
                              </td>
                              <td
                                className={`py-2.5 text-right font-mono font-semibold tabular-nums ${
                                  s.pChange > 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : s.pChange < 0
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-slate-500'
                                }`}
                              >
                                {s.pChange > 0 ? '+' : ''}
                                {typeof s.pChange === 'number' ? s.pChange.toFixed(2) : s.pChange ?? '0'}%
                              </td>
                              <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                                {s.volume ? Number(s.volume).toLocaleString() : '—'}
                              </td>
                              <td className="py-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                                {s.turnover ? `Rs. ${Number(s.turnover).toLocaleString()}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {marketSubTab === 'all' && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Showing {(stockPage - 1) * STOCKS_PER_PAGE + 1}–{Math.min(stockPage * STOCKS_PER_PAGE, filtered.length)} of {filtered.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStockPage((p) => Math.max(1, p - 1))}
                          disabled={stockPage === 1}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                        >
                          Previous
                        </button>
                        <span className="px-2 font-mono">
                          {stockPage} / {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStockPage((p) => Math.min(totalPages, p + 1))}
                          disabled={stockPage === totalPages}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          {marketSubTab === 'dividends' && (
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                  {isNe ? 'कम्पनी लाभांश घोषणा' : 'Corporate Proposed Dividends'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  NEPSE corporate disclosure feed (/api/live/nepse/dividends)
                </p>
              </div>
              {liveDividends.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Official data is currently unavailable.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                        <th className="pb-2">Symbol</th>
                        <th className="pb-2">Company</th>
                        <th className="pb-2 text-right">Bonus %</th>
                        <th className="pb-2 text-right">Cash %</th>
                        <th className="pb-2 text-right">Total %</th>
                        <th className="pb-2 text-right">Fiscal Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                      {liveDividends.map((d: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-bold text-[#0B1F3A] dark:text-[#60A5FA]">{d.symbol}</td>
                          <td className="py-2.5 font-sans font-medium">{d.companyName || d.company}</td>
                          <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400">{d.bonus || d.bonusPercent || '—'}</td>
                          <td className="py-2.5 text-right">{d.cash || d.cashPercent || '—'}</td>
                          <td className="py-2.5 text-right font-semibold">{d.total || d.totalDividend || '—'}</td>
                          <td className="py-2.5 text-right text-slate-500">{d.fiscalYear || d.fy || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {marketSubTab === 'disclosures' && (
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                  {isNe ? 'कम्पनी खुलास र सार्वजनिक सूचना' : 'NEPSE Corporate Disclosures'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official corporate filings & announcements (/api/live/nepse/disclosures)
                </p>
              </div>
              {liveDisclosures.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Official data is currently unavailable.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {liveDisclosures.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#0B1F3A] dark:text-white">
                          {item.title || item.subject || item.companyName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                          {item.publishedDate || item.date || ''}
                        </span>
                      </div>
                      {item.summary && (
                        <p className="text-slate-600 dark:text-slate-400">{item.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IPO & ALLOTMENT */}
      {activeTab === 'ipos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                {isNe ? 'आइपिओ तथा सार्वजनिक निष्कासन' : 'Current & Upcoming Public Issues'}
              </h2>
              <div className="flex flex-wrap items-center gap-1">
                {(['ALL', 'Open', 'Upcoming', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                        : 'bg-slate-100 dark:bg-[#0B1220] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {st === 'ALL' ? (isNe ? 'सबै' : 'All') : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {['ALL', 'IPO', 'FPO', 'Right Share', 'Mutual Fund'].map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setTypeFilter(tp)}
                  className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer ${
                    typeFilter === tp
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/50 text-[#0B1F3A] dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tp === 'ALL' ? (isNe ? 'सबै प्रकार' : 'All Types') : tp}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredIposList.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  {iposList.length === 0
                    ? 'Official data is currently unavailable.'
                    : isNe
                    ? 'चयन गरिएको फिल्टरमा कुनै निष्कासन फेला परेन।'
                    : 'No public issues match the selected filter.'}
                </p>
              ) : (
                filteredIposList.map((ipo: any) => (
                  <div
                    key={ipo.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0B1F3A] dark:text-white text-sm">
                          {ipo.companyName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            ipo.status === 'Open'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : ipo.status === 'Upcoming'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {ipo.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {ipo.type} • {ipo.units} @ Rs. {ipo.pricePerShare} | Issue Mgr: {ipo.issueManager}
                      </div>
                    </div>

                    <div className="sm:text-right text-xs font-mono">
                      <div className="text-[#0B1F3A] dark:text-blue-300 text-[11px] font-semibold">
                        BS: {ipo.openDateBs || '—'} to {ipo.closeDateBs || '—'}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                        AD: {ipo.openDateAd || '—'} to {ipo.closeDateAd || '—'}
                      </div>
                      {ipo.sourceUrl && (
                        <a
                          href={ipo.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline font-sans font-semibold mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Official Notice</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CDSC Allotment Checker */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base">
                {isNe ? 'आइपिओ नतिजा जाँच (CDSC)' : 'IPO Allotment Checker'}
              </h2>
              <a
                href="https://iporesult.cdsc.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>iporesult.cdsc.com.np</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-[#0B1220] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('capital_client')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  inputMode === 'capital_client'
                    ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isNe ? 'क्यापिटल + आइडी' : 'Capital + Client ID'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('full_boid')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  inputMode === 'full_boid'
                    ? 'bg-[#0B1F3A] dark:bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>{isNe ? '१६-अंक BOID' : '16-Digit BOID'}</span>
              </button>
            </div>

            <form onSubmit={handleCheckIpoResult} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isNe ? 'कम्पनी छान्नुहोस्' : 'Select Company (CDSC)'}
                </label>
                <select
                  value={selectedIpo}
                  onChange={(e) => {
                    setSelectedIpo(e.target.value);
                    setCheckResult(null);
                  }}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs outline-none focus:border-[#2563EB]"
                >
                  {cdscCompanies.length === 0 ? (
                    <option value="">No CDSC result companies loaded</option>
                  ) : (
                    cdscCompanies.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {inputMode === 'capital_client' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>{isNe ? 'क्यापिटल / डिपी' : 'Select Capital / DP'}</span>
                      <span className="text-[10px] font-mono text-slate-500">DP: {selectedCapitalDpId}</span>
                    </label>
                    <select
                      value={selectedCapitalDpId}
                      onChange={(e) => {
                        setSelectedCapitalDpId(e.target.value);
                        if (checkResult) setCheckResult(null);
                      }}
                      className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs outline-none focus:border-[#2563EB]"
                    >
                      {NEPAL_CAPITALS_DIRECTORY.map((c) => (
                        <option key={c.dpId} value={c.dpId}>
                          {c.name} ({c.dpId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isNe ? '८ अंकको क्लाइन्ट आइडी' : '8-Digit Client Demat ID'}
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">{clientId.length}/8</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={16}
                        value={clientId}
                        onChange={(e) => handleClientIdChange(e.target.value)}
                        placeholder="01024035"
                        className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-[#2563EB]"
                      />
                      {clientId.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMaskPrivateBoid(!maskPrivateBoid)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                        >
                          {maskPrivateBoid ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isNe ? '१६ अंकको BOID' : '16-Digit Full BOID'}
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">{fullBoid.length}/16</span>
                  </div>
                  <input
                    type="text"
                    maxLength={16}
                    value={fullBoid}
                    onChange={(e) => handleFullBoidChange(e.target.value)}
                    placeholder="1301260001024035"
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}

              {effectiveBoid.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 mr-1.5">BOID:</span>
                    <span className="font-semibold text-[#0B1F3A] dark:text-white">
                      {maskPrivateBoid ? maskBoidSecurely(effectiveBoid) : effectiveBoid}
                    </span>
                  </div>
                  {effectiveBoid.length === 16 && (
                    <button type="button" onClick={copyBoidToClipboard} className="p-1 text-slate-500 hover:text-[#2563EB]">
                      {copiedBoid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckingResult || effectiveBoid.length !== 16 || !selectedIpo}
                className="w-full min-h-[42px] py-2.5 bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCheckingResult ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isNe ? 'सीडीएससी जाँच हुँदै...' : 'Querying CDSC Gateway...'}</span>
                  </>
                ) : (
                  <span>{isNe ? 'नतिजा खोज्नुहोस्' : 'Check Allotment Result'}</span>
                )}
              </button>
            </form>

            {checkResult && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[#0B1F3A] dark:text-white">
                  {checkResult.status === 'ALLOTTED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#2563EB]" />
                  )}
                  <span>
                    {checkResult.status === 'ALLOTTED'
                      ? `Allotted (${checkResult.allotedQuantity || ''} Kitta)`
                      : checkResult.status === 'NOT_ALLOTTED'
                      ? 'Not Allotted'
                      : checkResult.status === 'INVALID_BOID'
                      ? 'Invalid BOID'
                      : 'CDSC Verification'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {isNe && checkResult.messageNp ? checkResult.messageNp : checkResult.message}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {checkResult.dataSource}
                  </span>
                  <a
                    href={checkResult.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] dark:text-[#60A5FA] font-semibold hover:underline"
                  >
                    CDSC Portal →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MEROSHARE C-ASBA */}
      {activeTab === 'meroshare' && <MeroshareAutoApplyView currentLang={currentLang} />}
    </div>
  );
};
