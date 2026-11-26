import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Coins,
  Fuel,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  ExternalLink,
  Send,
  Globe,
  Building2,
  Wallet,
} from 'lucide-react';
import { KalimatiProduceItem } from '../../types/sajiloTypes';
import { REMITTANCE_CORRIDORS_DATABASE } from '../../data/sajiloRemittanceData';

interface SajiloBazarTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloBazarTab: React.FC<SajiloBazarTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [activeSubTab, setActiveSubTab] = useState<'kalimati' | 'metals' | 'fuel' | 'nepse' | 'remittance'>('kalimati');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-usd');
  const [kalimatiData, setKalimatiData] = useState<KalimatiProduceItem[]>([]);
  const [isLoadingKalimati, setIsLoadingKalimati] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const [metalsPayload, setMetalsPayload] = useState<any>(null);
  const [isLoadingMetals, setIsLoadingMetals] = useState(false);
  const [fuelPayload, setFuelPayload] = useState<any>(null);
  const [isLoadingFuel, setIsLoadingFuel] = useState(false);
  const [nepsePayload, setNepsePayload] = useState<any>(null);
  const [isLoadingNepse, setIsLoadingNepse] = useState(false);

  useEffect(() => {
    fetchKalimatiData();
    fetchMetalsData();
    fetchFuelData();
    fetchNepseData();
  }, []);

  const fetchKalimatiData = () => {
    setIsLoadingKalimati(true);
    fetch('/api/live/kalimati')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data)) {
          setKalimatiData(payload.data);
          setLastSyncTime(payload.timeStr || new Date().toLocaleTimeString());
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingKalimati(false));
  };

  const fetchMetalsData = () => {
    setIsLoadingMetals(true);
    fetch('/api/live/metals')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((payload) => setMetalsPayload(payload))
      .catch(() => setMetalsPayload({ error: 'Official data is currently unavailable.', data: [] }))
      .finally(() => setIsLoadingMetals(false));
  };

  const fetchFuelData = () => {
    setIsLoadingFuel(true);
    fetch('/api/live/fuel')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((payload) => setFuelPayload(payload))
      .catch(() => setFuelPayload({ error: 'Official data is currently unavailable.', data: [] }))
      .finally(() => setIsLoadingFuel(false));
  };

  const fetchNepseData = () => {
    setIsLoadingNepse(true);
    fetch('/api/live/nepse')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((payload) => setNepsePayload(payload))
      .catch(() => setNepsePayload({ error: 'Official data is currently unavailable.', data: null }))
      .finally(() => setIsLoadingNepse(false));
  };

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const filteredProduce = kalimatiData.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commodityNp.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Subtab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a31] pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#14161b] rounded-xl border border-[#262a31]">
          <button
            onClick={() => setActiveSubTab('kalimati')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubTab === 'kalimati'
                ? 'bg-[#00e599] text-[#0a0b0d] shadow'
                : 'text-[#8b909b] hover:text-[#edeef0]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'कालिमाटी तरकारी तथा फलफूल' : 'Kalimati Produce'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('metals')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubTab === 'metals'
                ? 'bg-[#00e599] text-[#0a0b0d] shadow'
                : 'text-[#8b909b] hover:text-[#edeef0]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'सुन तथा चाँदी' : 'Gold & Silver'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fuel')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubTab === 'fuel'
                ? 'bg-[#00e599] text-[#0a0b0d] shadow'
                : 'text-[#8b909b] hover:text-[#edeef0]'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'पेट्रोलियम इन्धन' : 'Fuel Prices'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('nepse')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubTab === 'nepse'
                ? 'bg-[#00e599] text-[#0a0b0d] shadow'
                : 'text-[#8b909b] hover:text-[#edeef0]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'नेप्से तथा सेयर बजार' : 'NEPSE & IPO'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('remittance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubTab === 'remittance'
                ? 'bg-[#00e599] text-[#0a0b0d] shadow'
                : 'text-[#8b909b] hover:text-[#edeef0]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'रेमिट्यान्स दर तुलना' : 'Remittance'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8b909b]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentLang === 'ne' ? 'प्रत्यक्ष बजार दर' : 'Authentic Market Feeds'}</span>
          {lastSyncTime && <span className="text-[10px] text-[#8b909b]">• {lastSyncTime}</span>}
        </div>
      </div>

      {/* 1. Kalimati Produce Section */}
      {activeSubTab === 'kalimati' && (
        <div className="space-y-4">
          {/* Header & Source Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne'
                    ? 'कालिमाटी फलफूल तथा तरकारी बजार विकास समिति'
                    : 'Kalimati Fruits & Vegetable Market Development Board (KFVMDB)'}
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Government Official
                </span>
              </div>
              <p className="text-xs text-[#8b909b]">
                {currentLang === 'ne'
                  ? 'काठमाडौँ उपत्यकाको दैनिक थोक तथा खुद्रा कृषि उपज मूल्य'
                  : 'Daily official wholesale agricultural produce prices in Kathmandu Valley'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchKalimatiData}
                disabled={isLoadingKalimati}
                className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingKalimati ? 'animate-spin' : ''}`} />
                <span>{currentLang === 'ne' ? 'ताजा बनाउनुहोस्' : 'Refresh'}</span>
              </button>
              <a
                href="https://kalimatimarket.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#8b909b] hover:text-[#00e599] flex items-center gap-1.5 transition-colors"
              >
                <span>kalimatimarket.gov.np</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Search and Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b909b]" />
              <input
                type="text"
                placeholder={currentLang === 'ne' ? 'तरकारी वा फलफूल खोज्नुहोस् (उदा: आलु, Onion)...' : 'Search commodity (e.g. Potato, Onion)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14161b] border border-[#262a31] focus:border-[#00e599] text-xs text-[#edeef0] placeholder-[#8b909b] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', labelEn: 'All Commodities', labelNp: 'सबै' },
                { id: 'vegetables', labelEn: 'Vegetables', labelNp: 'तरकारी' },
                { id: 'fruits', labelEn: 'Fruits', labelNp: 'फलफूल' },
                { id: 'spices', labelEn: 'Spices & Herbs', labelNp: 'मसला' },
                { id: 'fish', labelEn: 'Fish', labelNp: 'माछा' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                    categoryFilter === cat.id
                      ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-bold'
                      : 'bg-[#14161b] text-[#8b909b] hover:text-[#edeef0] border border-[#262a31]'
                  }`}
                >
                  {currentLang === 'ne' ? cat.labelNp : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Produce Table */}
          <div className="rounded-xl border border-[#262a31] bg-[#14161b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#262a31] bg-[#171a21] text-[11px] font-mono text-[#8b909b] uppercase tracking-wider">
                    <th className="py-3 px-4">{currentLang === 'ne' ? 'कृषि उपज' : 'Commodity'}</th>
                    <th className="py-3 px-4">{currentLang === 'ne' ? 'इकाइ' : 'Unit'}</th>
                    <th className="py-3 px-4">{currentLang === 'ne' ? 'न्यूनतम दर (रू.)' : 'Min (NPR)'}</th>
                    <th className="py-3 px-4">{currentLang === 'ne' ? 'अधिकतम दर (रू.)' : 'Max (NPR)'}</th>
                    <th className="py-3 px-4">{currentLang === 'ne' ? 'औसत दर (रू.)' : 'Avg (NPR)'}</th>
                    <th className="py-3 px-4 text-center">{currentLang === 'ne' ? 'रुझान' : 'Trend'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a31] text-xs">
                  {filteredProduce.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#8b909b] font-mono">
                        {isLoadingKalimati
                          ? 'Loading produce prices...'
                          : kalimatiData.length === 0
                          ? 'Official data is currently unavailable.'
                          : 'No commodities matching your search filter.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProduce.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1a1d24] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#edeef0]">
                            {currentLang === 'ne' ? item.commodityNp : item.commodity}
                          </div>
                          <div className="text-[10px] text-[#8b909b]">
                            {currentLang === 'ne' ? item.commodity : item.commodityNp}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#8b909b]">{item.unit}</td>
                        <td className="py-3 px-4 font-mono text-[#edeef0]">रू. {formatDigits(item.minPrice)}</td>
                        <td className="py-3 px-4 font-mono text-[#edeef0]">रू. {formatDigits(item.maxPrice)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#00e599]">
                          रू. {formatDigits(item.avgPrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.trend === 'up' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                              <ArrowUp className="w-3 h-3" /> Up
                            </span>
                          ) : item.trend === 'down' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <ArrowDown className="w-3 h-3" /> Down
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8b909b] bg-[#262a31]/40 px-2 py-0.5 rounded">
                              <Minus className="w-3 h-3" /> Stable
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Gold & Silver Section */}
      {activeSubTab === 'metals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne'
                    ? 'नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA)'
                    : "Federation of Nepal Gold & Silver Dealers' Association"}
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {metalsPayload?.isLive ? 'Live Official Feed' : 'Official Source'}
                </span>
              </div>
              <p className="text-xs text-[#8b909b]">
                {metalsPayload?.dataSource
                  ? `${metalsPayload.dataSource} • AD: ${metalsPayload.lastUpdatedAd || 'N/A'} | BS: ${metalsPayload.lastUpdatedBs || 'N/A'}`
                  : currentLang === 'ne'
                  ? 'काठमाडौँ बजारको आधिकारिक दैनिक सुन तथा चाँदी कारोबार दर'
                  : 'Official daily bullion rates in Nepal'}
              </p>
            </div>
            <button
              onClick={fetchMetalsData}
              disabled={isLoadingMetals}
              className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] flex items-center gap-1.5 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetals ? 'animate-spin' : ''}`} />
              <span>{currentLang === 'ne' ? 'ताजा बनाउनुहोस्' : 'Refresh'}</span>
            </button>
          </div>

          {!metalsPayload?.data || !Array.isArray(metalsPayload.data) || metalsPayload.data.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#14161b] border border-[#262a31] text-center text-xs font-mono text-[#8b909b]">
              {isLoadingMetals ? 'Loading official bullion rates...' : 'Official data is currently unavailable.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metalsPayload.data.slice(0, 6).map((m: any) => (
                <div key={m.id || m.categoryEn} className="p-5 rounded-xl bg-[#14161b] border border-amber-500/25 hover:border-amber-500/50 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase truncate">
                      {currentLang === 'ne' ? m.categoryNp || m.categoryEn : m.categoryEn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 shrink-0">
                      {m.purity || m.statusLabel || 'Official'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[10px] text-[#8b909b]">{m.unitTolaLabel || 'Rate per Tola (11.664g)'}</div>
                      <div className="text-2xl font-black font-mono text-amber-400">
                        रू. {formatDigits(Number(m.nprPerTola || 0).toLocaleString())}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#262a31]">
                      <div className="text-[10px] text-[#8b909b]">{m.unitGramLabel || 'Rate per 10 Grams'}</div>
                      <div className="text-sm font-bold font-mono text-[#edeef0]">
                        रू. {formatDigits(Number(m.nprPerTenGram || 0).toLocaleString())}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Fuel Prices Section */}
      {activeSubTab === 'fuel' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne' ? 'नेपाल आयल निगम (NOC)' : 'Nepal Oil Corporation (NOC)'}
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  State Oil Authority
                </span>
              </div>
              <p className="text-xs text-[#8b909b]">
                {fuelPayload?.dataSource
                  ? `${fuelPayload.dataSource} • AD: ${fuelPayload.lastUpdatedAd || 'N/A'} | BS: ${fuelPayload.lastUpdatedBs || 'N/A'}`
                  : currentLang === 'ne'
                  ? 'पेट्रोल, डिजेल, मट्टितेल र एल.पी. ग्यासको आधिकारिक खुद्रा मूल्य'
                  : 'Official retail tariff published by Nepal Oil Corporation'}
              </p>
            </div>
            <button
              onClick={fetchFuelData}
              disabled={isLoadingFuel}
              className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] flex items-center gap-1.5 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFuel ? 'animate-spin' : ''}`} />
              <span>{currentLang === 'ne' ? 'ताजा बनाउनुहोस्' : 'Refresh'}</span>
            </button>
          </div>

          {!fuelPayload?.data || !Array.isArray(fuelPayload.data) || fuelPayload.data.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#14161b] border border-[#262a31] text-center text-xs font-mono text-[#8b909b]">
              {isLoadingFuel ? 'Loading official NOC fuel tariff...' : 'Official data is currently unavailable.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fuelPayload.data.map((f: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#edeef0]">
                      {currentLang === 'ne' ? f.itemNp || f.item : f.item}
                    </span>
                    <span className="text-[10px] font-mono text-[#8b909b]">
                      {currentLang === 'ne' ? f.unitNp || f.unit : f.unit}
                    </span>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#edeef0] mt-2">
                    रू. {formatDigits(Number(f.priceNpr || 0).toLocaleString())}
                  </div>
                  <div className="text-[10px] text-[#8b909b] font-mono mt-1 truncate">
                    {f.notesEn || 'Kathmandu / Pokhara Official Category'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. NEPSE & IPO Market Section */}
      {activeSubTab === 'nepse' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne' ? 'नेपाल स्टक एक्सचेन्ज (NEPSE)' : 'Nepal Stock Exchange (NEPSE)'}
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-[#00e599] border border-emerald-500/30">
                  {nepsePayload?.marketStatus || 'Market Feed'}
                </span>
              </div>
              <p className="text-xs text-[#8b909b]">
                {nepsePayload?.dataSource
                  ? `${nepsePayload.dataSource} • AD: ${nepsePayload.lastUpdatedAd || 'N/A'} | BS: ${nepsePayload.lastUpdatedBs || 'N/A'}`
                  : currentLang === 'ne'
                  ? 'दैनिक परिसूचक, कुल कारोबार रकम र नयाँ प्राथमिक सेयर (IPO)'
                  : 'Daily indices, aggregate turnover and active public offerings'}
              </p>
            </div>
            <button
              onClick={fetchNepseData}
              disabled={isLoadingNepse}
              className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] flex items-center gap-1.5 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNepse ? 'animate-spin' : ''}`} />
              <span>{currentLang === 'ne' ? 'ताजा बनाउनुहोस्' : 'Refresh'}</span>
            </button>
          </div>

          {!nepsePayload?.data ? (
            <div className="p-8 rounded-xl bg-[#14161b] border border-[#262a31] text-center text-xs font-mono text-[#8b909b]">
              {isLoadingNepse ? 'Loading official NEPSE & CDSC market feed...' : 'Official data is currently unavailable.'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(nepsePayload.data.indices || []).slice(0, 2).map((idxItem: any) => (
                  <div key={idxItem.name} className="p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
                    <div className="text-xs text-[#8b909b]">{idxItem.name}</div>
                    <div className="text-2xl font-black font-mono text-[#00e599] mt-1">
                      {formatDigits(Number(idxItem.value || 0).toLocaleString())}
                    </div>
                    <div
                      className={`text-[11px] font-mono mt-0.5 flex items-center gap-1 ${
                        Number(idxItem.change) >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {Number(idxItem.change) >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Number(idxItem.change) >= 0 ? '+' : ''}
                      {formatDigits(idxItem.change)} ({formatDigits(idxItem.pChange)}%)
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
                  <div className="text-xs text-[#8b909b]">Daily Turnover</div>
                  <div className="text-2xl font-black font-mono text-[#edeef0] mt-1">
                    {nepsePayload.data.turnoverNpr
                      ? `रू. ${formatDigits(Number(nepsePayload.data.turnoverNpr).toLocaleString())}`
                      : 'Official data is currently unavailable.'}
                  </div>
                  <div className="text-[11px] font-mono text-[#8b909b] mt-0.5">
                    Total Traded Shares: {formatDigits(Number(nepsePayload.data.totalSharesTraded || 0).toLocaleString())}
                  </div>
                </div>
              </div>

              {/* Active IPOs */}
              <div className="rounded-xl border border-[#262a31] bg-[#14161b] p-4">
                <h4 className="text-xs font-mono font-bold text-[#edeef0] uppercase tracking-wider mb-3">
                  {currentLang === 'ne' ? 'जारी तथा निष्कासित नयाँ आइपिओ (Active IPOs)' : 'Current & Upcoming IPOs (CDSC)'}
                </h4>
                {!nepsePayload.data.ipos || nepsePayload.data.ipos.length === 0 ? (
                  <p className="text-xs font-mono text-[#8b909b] py-3">Official data is currently unavailable.</p>
                ) : (
                  <div className="space-y-2">
                    {nepsePayload.data.ipos.slice(0, 6).map((ipo: any) => (
                      <div
                        key={ipo.id || ipo.companyName}
                        className="p-3 rounded-lg bg-[#1a1d24] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-xs text-[#edeef0]">{ipo.companyName}</div>
                          <div className="text-[10px] text-[#8b909b]">
                            Type: {ipo.type} | Issue Manager: {ipo.issueManager} | Units: {formatDigits(Number(ipo.units || 0).toLocaleString())}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-[#00e599] border border-emerald-500/30">
                            {ipo.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. Remittance Corridor & Provider Comparison */}
      {activeSubTab === 'remittance' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#14161b] border border-[#262a31]">
            <div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00e599]" />
                <h3 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne' ? 'विदेशबाट नेपाल पैसा पठाउने रेमिट्यान्स दर तुलना' : 'Nepal Inward Remittance Exchange Rate Comparison'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  NRB Benchmark
                </span>
              </div>
              <p className="text-xs text-[#8b909b] mt-0.5">
                {currentLang === 'ne'
                  ? 'नेपाल राष्ट्र बैंकको आधिकारिक सन्दर्भ दर तथा प्रमुख रेमिट्यान्स कम्पनीहरूको प्रत्यक्ष विनिमय दर।'
                  : 'Official NRB reference rates compared against top money transfer operators (MTOs) and wallets.'}
              </p>
            </div>
          </div>

          {/* Corridor Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#14161b] border border-[#262a31]">
            {REMITTANCE_CORRIDORS_DATABASE.map((corridor) => (
              <button
                key={corridor.id}
                onClick={() => setSelectedCorridorId(corridor.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCorridorId === corridor.id
                    ? 'bg-[#00e599] text-black shadow-md'
                    : 'bg-[#0d0e12] text-[#8b909b] hover:text-[#edeef0] border border-[#262a31]'
                }`}
              >
                <span>{corridor.flagEmoji}</span>
                <span>{corridor.corridor}</span>
                <span className="text-[10px] opacity-75">({corridor.currencySymbol})</span>
              </button>
            ))}
          </div>

          {/* Active Corridor Card & Table */}
          {(() => {
            const activeCorridor =
              REMITTANCE_CORRIDORS_DATABASE.find((c) => c.id === selectedCorridorId) ||
              REMITTANCE_CORRIDORS_DATABASE[0];

            return (
              <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-5">
                {/* Official NRB Benchmark Box */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0d0e12] border border-[#262a31]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeCorridor.flagEmoji}</span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#edeef0]">
                        १ {activeCorridor.currencyName} ({activeCorridor.corridor})
                      </h4>
                      <p className="text-[11px] text-[#8b909b]">
                        अन्तिम अपडेट: {activeCorridor.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#14161b] border border-[#262a31] text-center">
                      <span className="text-[#8b909b] block text-[10px]">NRB Buy (खरिद)</span>
                      <span className="font-bold text-[#edeef0]">NPR {activeCorridor.officialNrbBuy}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#14161b] border border-[#262a31] text-center">
                      <span className="text-[#8b909b] block text-[10px]">NRB Sell (बिक्री)</span>
                      <span className="font-bold text-[#edeef0]">NPR {activeCorridor.officialNrbSell}</span>
                    </div>
                  </div>
                </div>

                {/* Providers Comparison Table */}
                <div className="overflow-x-auto rounded-xl border border-[#262a31]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#1a1d24] text-[#8b909b] font-semibold border-b border-[#262a31]">
                      <tr>
                        <th className="p-3">रेमिट कम्पनी (Provider)</th>
                        <th className="p-3">भुक्तानी माध्यम (Channel)</th>
                        <th className="p-3 text-right">विनिमय दर (Rate NPR)</th>
                        <th className="p-3 text-center">शुल्क (Fee)</th>
                        <th className="p-3">भुक्तानी गति (Delivery)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a31] text-[#edeef0]">
                      {activeCorridor.providers.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#181a20]">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#edeef0]">{p.nameNp}</span>
                              {p.isBestRate && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                                  BEST RATE
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8b909b]">{p.name}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#0d0e12] border border-[#262a31] text-[#8b909b]">
                              {p.channel}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-sm text-[#00e599]">
                            {activeCorridor.currencySymbol}१ = रु {p.rate}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {p.feeNpr === 0 ? (
                              <span className="text-[#00e599] font-bold">FREE (रु ०)</span>
                            ) : (
                              <span className="text-[#8b909b]">रु {p.feeNpr}</span>
                            )}
                          </td>
                          <td className="p-3 text-[#8b909b]">
                            {currentLang === 'ne' ? p.deliverySpeedNp : p.deliverySpeed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
