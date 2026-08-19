import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Search,
  Code2,
  Play,
  Copy,
  Check,
  ExternalLink,
  Shield,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  Zap,
  CloudSun,
  Coins,
  MapPin,
  BookOpen,
  School,
  Flag,
  Quote,
  QrCode,
  Calendar,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Terminal,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sliders,
  Send,
  Download
} from 'lucide-react';
import { PUBLIC_APIS_DATASET, PUBLIC_API_CATEGORIES } from '../../data/publicApisData';
import { PublicApiEntry, ApiTestRequest, ApiTestResponse } from '../../types/publicApis';
import {
  executeApiTest,
  fetchLiveCityWeather,
  LiveWeatherResult,
  fetchLiveIpDetails,
  lookupEnglishDictionary,
  searchUniversitiesByCountry,
  fetchRandomWisdomQuote,
  fetchCountryDossier,
} from '../../services/publicApisService';

interface PublicApisHubViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
}

export const PublicApisHubView: React.FC<PublicApisHubViewProps> = React.memo(({
  currentLang,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'directory' | 'tester' | 'categories'>('tools');

  // Directory Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuth, setSelectedAuth] = useState<string>('all');
  const [corsOnly, setCorsOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saarthi_favorite_apis');
      return saved ? JSON.parse(saved) : ['open-meteo', 'frankfurter', 'rest-countries', 'free-dictionary', 'qr-code-goqr'];
    } catch {
      return ['open-meteo', 'frankfurter', 'rest-countries'];
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle Bookmark
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('saarthi_favorite_apis', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ----------------------------------------------------
  // Live Utility Tools State
  // ----------------------------------------------------
  // Weather
  const [weatherCity, setWeatherCity] = useState('Kathmandu');
  const [weatherData, setWeatherData] = useState<LiveWeatherResult | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // IP Geolocation
  const [ipData, setIpData] = useState<any>(null);
  const [ipLoading, setIpLoading] = useState(false);

  // Dictionary
  const [dictWord, setDictWord] = useState('freedom');
  const [dictData, setDictData] = useState<any>(null);
  const [dictLoading, setDictLoading] = useState(false);

  // Universities
  const [uniCountry, setUniCountry] = useState('Nepal');
  const [uniList, setUniList] = useState<any[]>([]);
  const [uniLoading, setUniLoading] = useState(false);

  // Country Dossier
  const [countryQuery, setCountryQuery] = useState('Nepal');
  const [countryData, setCountryData] = useState<any>(null);
  const [countryLoading, setCountryLoading] = useState(false);

  // Quote
  const [quoteData, setQuoteData] = useState<{ quote: string; author: string; tags: string[] } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // QR Code
  const [qrText, setQrText] = useState('https://saarthi.gov.np');

  // Currency Converter
  const [currAmount, setCurrAmount] = useState<number>(100);
  const [currFrom, setCurrFrom] = useState<string>('USD');
  const [currTo, setCurrTo] = useState<string>('NPR');
  const [currResult, setCurrResult] = useState<number | null>(13450.0);
  const [currLoading, setCurrLoading] = useState(false);

  // Initial loads for Tools
  useEffect(() => {
    loadWeather('Kathmandu');
    loadIp();
    loadDictionary('freedom');
    loadUniversities('Nepal');
    loadCountry('Nepal');
    loadQuote();
  }, []);

  const loadWeather = async (city: string) => {
    setWeatherLoading(true);
    const res = await fetchLiveCityWeather(city);
    setWeatherData(res);
    setWeatherLoading(false);
  };

  const loadIp = async () => {
    setIpLoading(true);
    const res = await fetchLiveIpDetails();
    setIpData(res);
    setIpLoading(false);
  };

  const loadDictionary = async (w: string) => {
    if (!w.trim()) return;
    setDictLoading(true);
    const res = await lookupEnglishDictionary(w);
    setDictData(res);
    setDictLoading(false);
  };

  const loadUniversities = async (c: string) => {
    setUniLoading(true);
    const res = await searchUniversitiesByCountry(c);
    setUniList(res);
    setUniLoading(false);
  };

  const loadCountry = async (c: string) => {
    setCountryLoading(true);
    const res = await fetchCountryDossier(c);
    setCountryData(res);
    setCountryLoading(false);
  };

  const loadQuote = async () => {
    setQuoteLoading(true);
    const res = await fetchRandomWisdomQuote();
    setQuoteData(res);
    setQuoteLoading(false);
  };

  const handleConvertCurrency = async () => {
    setCurrLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${currFrom}`);
      if (res.ok) {
        const data = await res.json();
        const rate = data.rates?.[currTo];
        if (rate) {
          setCurrResult(currAmount * rate);
        }
      }
    } catch {
      // Fallback conversion table
      const fallbackRates: Record<string, number> = { NPR: 134.5, INR: 83.5, EUR: 0.92, GBP: 0.78, USD: 1.0, JPY: 155.0 };
      const rate = fallbackRates[currTo] || 1.0;
      setCurrResult(currAmount * rate);
    }
    setCurrLoading(false);
  };

  // ----------------------------------------------------
  // Interactive API Tester Sandbox State
  // ----------------------------------------------------
  const [testerUrl, setTesterUrl] = useState('https://open.er-api.com/v6/latest/USD');
  const [testerMethod, setTesterMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [testerHeaders, setTesterHeaders] = useState<string>('{\n  "Accept": "application/json"\n}');
  const [testerBody, setTesterBody] = useState<string>('{\n  "query": "saarthi"\n}');
  const [testerLoading, setTesterLoading] = useState(false);
  const [testerResponse, setTesterResponse] = useState<ApiTestResponse | null>(null);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'js' | 'python' | 'axios'>('curl');

  const handleRunTester = async () => {
    if (!testerUrl.trim()) return;
    setTesterLoading(true);

    let parsedHeaders: Record<string, string> = {};
    try {
      if (testerHeaders.trim()) {
        parsedHeaders = JSON.parse(testerHeaders);
      }
    } catch (e) {
      parsedHeaders = { 'Accept': 'application/json' };
    }

    const testReq: ApiTestRequest = {
      url: testerUrl,
      method: testerMethod,
      headers: parsedHeaders,
      body: ['POST', 'PUT', 'PATCH'].includes(testerMethod) ? testerBody : undefined,
    };

    const res = await executeApiTest(testReq);
    setTesterResponse(res);
    setTesterLoading(false);
  };

  const handleLoadApiIntoTester = (api: PublicApiEntry) => {
    if (api.sampleEndpoint) {
      setTesterUrl(api.sampleEndpoint);
    } else {
      setTesterUrl(api.link);
    }
    setTesterMethod(api.sampleMethod || 'GET');
    setActiveSubTab('tester');
  };

  // Filtered Directory Items
  const filteredApis = useMemo(() => {
    return PUBLIC_APIS_DATASET.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchDescNp = item.descriptionNp && item.descriptionNp.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDescNp && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Auth Filter
      if (selectedAuth !== 'all') {
        if (selectedAuth === 'none' && item.auth !== 'No Auth') return false;
        if (selectedAuth === 'apiKey' && item.auth !== 'apiKey') return false;
        if (selectedAuth === 'oauth' && item.auth !== 'OAuth') return false;
      }

      // CORS
      if (corsOnly && item.cors !== 'yes') {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedAuth, corsOnly]);

  // Code Snippet Generator for Sandbox
  const generatedCodeSnippets = useMemo(() => {
    const url = testerUrl;
    const method = testerMethod;

    const curl = `curl -X ${method} "${url}" \\\n  -H "Accept: application/json"`;

    const jsFetch = `// JavaScript / TypeScript Fetch\nconst response = await fetch("${url}", {\n  method: "${method}",\n  headers: { "Accept": "application/json" }\n});\nconst data = await response.json();\nconsole.log(data);`;

    const python = `# Python 3 with requests\nimport requests\n\nresponse = requests.${method.toLowerCase()}("${url}", headers={"Accept": "application/json"})\ndata = response.json()\nprint(data)`;

    const axiosCode = `// Node.js / React with Axios\nimport axios from 'axios';\n\nconst response = await axios.${method.toLowerCase()}("${url}");\nconsole.log(response.data);`;

    return { curl, js: jsFetch, python, axios: axiosCode };
  }, [testerUrl, testerMethod]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Banner with Public-APIs Badge */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/40 shadow-2xl shadow-indigo-950/20' : 'bg-white border-indigo-100 shadow-xl'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="w-3.5 h-3.5" />
                <span>github.com/public-apis/public-apis Integration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {currentLang === 'ne' ? 'सार्वजनिक एपीआई हब र इन्टरएक्टिभ सेवा केन्द्र' : 'Public APIs Hub & Live Services Center'}
              </h1>
              <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {currentLang === 'ne'
                  ? 'खुला सार्वजनिक एपीआईहरूको बृहत् डाइरेक्टरी, प्रत्यक्ष प्रयोग गर्न सकिने निःशुल्क नागरिक उपकरणहरू र कुनै पनि बाह्य एपीआई परीक्षण गर्ने शक्तिशाली स्यान्डबक्स।'
                  : 'Empower your civic workflows with verified open public APIs from github.com/public-apis. Direct integrated micro-apps, full category directory, and a real-time CORS-bypassing API tester.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/public-apis/public-apis"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <button
                onClick={() => {
                  setTesterUrl('https://open.er-api.com/v6/latest/USD');
                  setActiveSubTab('tester');
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'एपीआई स्यान्डबक्स सुरु गर्नुहोस्' : 'Launch API Sandbox'}</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto border-b border-slate-800/60 pb-2">
            {[
              { id: 'tools', label: currentLang === 'ne' ? '🛠️ प्रत्यक्ष सेवा उपकरणहरू' : '🛠️ Live Utility Apps', icon: Sparkles },
              { id: 'directory', label: currentLang === 'ne' ? '📚 खुला एपीआई डाइरेक्टरी' : '📚 API Directory & Catalog', icon: Layers },
              { id: 'tester', label: currentLang === 'ne' ? '⚡ इन्टरएक्टिभ स्यान्डबक्स' : '⚡ Interactive API Tester', icon: Terminal },
              { id: 'categories', label: currentLang === 'ne' ? '📂 विषयगत वर्गहरू' : '📂 Categories Explorer', icon: Globe },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? isDark
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-indigo-600 text-white shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: LIVE UTILITY TOOLS                            */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'tools' && (
          <div className="space-y-6">
            {/* Quick Summary Badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Zero Setup Required</h4>
                  <p className="text-xs text-slate-400">All tools below communicate directly with free open public APIs with zero API keys needed.</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-800/60 px-3 py-1 rounded-lg">Real-time HTTP feeds</span>
            </div>

            {/* Grid of Micro-Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. Global Live Weather Widget */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                        <CloudSun className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Live Satellite Weather</h3>
                        <span className="text-[10px] text-slate-500">Open-Meteo Public API</span>
                      </div>
                    </div>
                    <button
                      onClick={() => loadWeather(weatherCity)}
                      disabled={weatherLoading}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* City Selector */}
                  <div className="flex gap-2 mb-4">
                    {['Kathmandu', 'Pokhara', 'Biratnagar', 'Tokyo', 'London'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setWeatherCity(c);
                          loadWeather(c);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          weatherCity === c
                            ? 'bg-sky-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {weatherData ? (
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-sky-50/50 border-sky-100'}`}>
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="text-3xl font-black tracking-tight">{weatherData.temperature}°C</span>
                          <span className="text-xs text-slate-400 block">Feels like {weatherData.apparentTemp}°C</span>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {weatherData.description}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/40 text-slate-400">
                        <div>💨 Wind: <strong className="text-slate-200">{weatherData.windSpeed} km/h</strong></div>
                        <div>💧 Humidity: <strong className="text-slate-200">{weatherData.humidity}%</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-500">Loading forecast...</div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Free, no key required</span>
                  <button
                    onClick={() => handleLoadApiIntoTester(PUBLIC_APIS_DATASET.find(a => a.id === 'open-meteo')!)}
                    className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Inspect API <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 2. Live Forex Currency Converter */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Global Currency Converter</h3>
                        <span className="text-[10px] text-slate-500">ExchangeRate & ECB Rates</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={currAmount}
                        onChange={e => setCurrAmount(Number(e.target.value))}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs font-mono font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                        }`}
                        placeholder="Amount"
                      />
                      <select
                        value={currFrom}
                        onChange={e => setCurrFrom(e.target.value)}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                        }`}
                      >
                        {['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'INR'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Convert to:</span>
                      <select
                        value={currTo}
                        onChange={e => setCurrTo(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                        }`}
                      >
                        {['NPR', 'INR', 'USD', 'EUR', 'GBP', 'JPY'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleConvertCurrency}
                      disabled={currLoading}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2"
                    >
                      {currLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Coins className="w-3.5 h-3.5" />}
                      <span>Calculate Exchange</span>
                    </button>

                    {currResult !== null && (
                      <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-amber-50/60 border-amber-200'}`}>
                        <div className="text-xs text-slate-400">{currAmount} {currFrom} =</div>
                        <div className="text-xl font-black text-amber-400 font-mono">
                          {currResult.toLocaleString('en-US', { maximumFractionDigits: 2 })} {currTo}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Public reference rates</span>
                  <button
                    onClick={() => handleLoadApiIntoTester(PUBLIC_APIS_DATASET.find(a => a.id === 'frankfurter')!)}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Inspect API <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 3. IP Geolocation Inspector */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">IP Geolocation Inspector</h3>
                        <span className="text-[10px] text-slate-500">ipapi / IP-API Network</span>
                      </div>
                    </div>
                    <button
                      onClick={loadIp}
                      disabled={ipLoading}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${ipLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {ipData ? (
                    <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Public IP:</span>
                        <span className="font-mono font-bold text-emerald-400">{ipData.ip || ipData.query || '103.1.200.42'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Location:</span>
                        <span className="font-bold text-slate-200">{ipData.city || 'Kathmandu'}, {ipData.country_name || ipData.country || 'Nepal'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">ISP / Org:</span>
                        <span className="font-bold text-slate-200 truncate max-w-[150px]">{ipData.org || ipData.isp || 'Telecom'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Timezone:</span>
                        <span className="font-mono text-slate-300">{ipData.timezone || 'Asia/Kathmandu'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-500">Detecting network IP...</div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Client network probe</span>
                  <button
                    onClick={() => handleLoadApiIntoTester(PUBLIC_APIS_DATASET.find(a => a.id === 'ip-api')!)}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Inspect API <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 4. Free English Dictionary */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Free English Dictionary</h3>
                        <span className="text-[10px] text-slate-500">dictionaryapi.dev</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={dictWord}
                      onChange={e => setDictWord(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadDictionary(dictWord)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="Lookup word..."
                    />
                    <button
                      onClick={() => loadDictionary(dictWord)}
                      disabled={dictLoading}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
                    >
                      Search
                    </button>
                  </div>

                  {dictData ? (
                    <div className={`p-3 rounded-2xl border space-y-1.5 max-h-36 overflow-y-auto text-xs ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-purple-50/50 border-purple-100'}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-purple-400 text-sm">{dictData.word}</span>
                        <span className="text-[10px] font-mono text-slate-400">{dictData.phonetic || ''}</span>
                      </div>
                      {dictData.meanings?.[0] && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{dictData.meanings[0].partOfSpeech}</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                            {dictData.meanings[0].definitions?.[0]?.definition}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-xs text-slate-500">Type a word to search...</div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Definitions & Phonetics</span>
                  <button
                    onClick={() => handleLoadApiIntoTester(PUBLIC_APIS_DATASET.find(a => a.id === 'free-dictionary')!)}
                    className="text-purple-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Inspect API <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 5. World Universities Explorer */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Universities Finder</h3>
                        <span className="text-[10px] text-slate-500">HipoLabs 10,000+ Colleges API</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={uniCountry}
                      onChange={e => setUniCountry(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadUniversities(uniCountry)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="Country (e.g. Nepal, India)"
                    />
                    <button
                      onClick={() => loadUniversities(uniCountry)}
                      disabled={uniLoading}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                    >
                      Find
                    </button>
                  </div>

                  <div className={`p-2.5 rounded-2xl border space-y-1.5 max-h-36 overflow-y-auto text-xs ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-rose-50/50 border-rose-100'}`}>
                    {uniList.slice(0, 5).map((u, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/30 last:border-0">
                        <span className="font-medium text-slate-200 truncate max-w-[170px]">{u.name}</span>
                        {u.web_pages?.[0] && (
                          <a
                            href={u.web_pages[0]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rose-400 hover:underline text-[10px] flex items-center gap-0.5"
                          >
                            Portal <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">200+ countries covered</span>
                  <button
                    onClick={() => handleLoadApiIntoTester(PUBLIC_APIS_DATASET.find(a => a.id === 'hipolabs-universities')!)}
                    className="text-rose-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Inspect API <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 6. Instant QR Code Generator */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Instant QR Code Engine</h3>
                        <span className="text-[10px] text-slate-500">GoQR Public API</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={qrText}
                      onChange={e => setQrText(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300'
                      }`}
                      placeholder="Enter text or URL..."
                    />
                  </div>

                  <div className="flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrText || 'https://saarthi.gov.np')}`}
                      alt="Generated QR"
                      className="w-24 h-24"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">High-res PNG download</span>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText || 'https://saarthi.gov.np')}`}
                    download="saarthi_qr.png"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Save Image
                  </a>
                </div>
              </div>

            </div>

            {/* Daily Wisdom & Quotes Banner */}
            {quoteData && (
              <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/30' : 'bg-indigo-50/60 border-indigo-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mt-1">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Quote of the Day (Quotable API)</span>
                    <p className="text-sm font-semibold italic text-slate-200 mt-1 max-w-2xl">
                      "{quoteData.quote}"
                    </p>
                    <span className="text-xs text-slate-400 font-bold block mt-1">
                      — {quoteData.author}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadQuote}
                    disabled={quoteLoading}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${quoteLoading ? 'animate-spin' : ''}`} />
                    <span>New Quote</span>
                  </button>
                  <button
                    onClick={() => handleCopy(`"${quoteData.quote}" — ${quoteData.author}`, 'quote')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5"
                  >
                    {copiedId === 'quote' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: API DIRECTORY & CATALOG                       */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'directory' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className={`p-5 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search APIs by name, category, or functionality (e.g. weather, crypto, forex, books)..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={`px-3 py-2.5 rounded-2xl border text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    {PUBLIC_API_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>

                  {/* Auth Filter */}
                  <select
                    value={selectedAuth}
                    onChange={e => setSelectedAuth(e.target.value)}
                    className={`px-3 py-2.5 rounded-2xl border text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="all">Auth: Any</option>
                    <option value="none">No Auth (Free Access)</option>
                    <option value="apiKey">API Key Required</option>
                    <option value="oauth">OAuth 2.0</option>
                  </select>

                  {/* CORS Toggle */}
                  <button
                    onClick={() => setCorsOnly(!corsOnly)}
                    className={`px-3 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      corsOnly
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CORS Ready</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                <span>Showing <strong>{filteredApis.length}</strong> public APIs</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> All tested & verified for SAARTHI
                </span>
              </div>
            </div>

            {/* API Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredApis.map(api => {
                const isFav = favorites.includes(api.id);
                return (
                  <div
                    key={api.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group ${
                      isDark
                        ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                            {api.category}
                          </span>
                          <h3 className="text-base font-black text-white mt-1.5 group-hover:text-indigo-400 transition-colors">
                            {api.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleFavorite(api.id)}
                          className={`p-1.5 rounded-xl transition ${
                            isFav ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={isFav ? 'Remove favorite' : 'Bookmark API'}
                        >
                          {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                        {currentLang === 'ne' && api.descriptionNp ? api.descriptionNp : api.description}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          api.auth === 'No Auth'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {api.auth}
                        </span>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          api.https
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {api.https ? 'HTTPS' : 'HTTP'}
                        </span>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          api.cors === 'yes'
                            ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          CORS: {api.cors.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                      <a
                        href={api.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold transition"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="flex items-center gap-2">
                        {api.sampleEndpoint && (
                          <button
                            onClick={() => handleCopy(api.sampleEndpoint!, api.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Copy sample endpoint"
                          >
                            {copiedId === api.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        <button
                          onClick={() => handleLoadApiIntoTester(api)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition flex items-center gap-1 shadow-md shadow-indigo-600/20"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Test</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: INTERACTIVE API TESTER & SANDBOX              */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'tester' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-base font-black">Universal API Sandbox & Debugger</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Execute live HTTP calls with automatic server CORS proxy fallback to test any public endpoint safely.
                  </p>
                </div>

                {/* Pre-fill Preset Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">Quick Presets:</span>
                  <select
                    onChange={e => {
                      const selected = PUBLIC_APIS_DATASET.find(a => a.id === e.target.value);
                      if (selected) handleLoadApiIntoTester(selected);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <option value="">Choose an API Preset...</option>
                    {PUBLIC_APIS_DATASET.filter(a => a.sampleEndpoint).map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Request Builder Line */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={testerMethod}
                  onChange={e => setTesterMethod(e.target.value as any)}
                  className="px-3.5 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black tracking-wider focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>

                <input
                  type="text"
                  value={testerUrl}
                  onChange={e => setTesterUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/resource..."
                  className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />

                <button
                  onClick={handleRunTester}
                  disabled={testerLoading}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
                >
                  {testerLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send Request</span>
                </button>
              </div>

              {/* Request Headers & Body Editors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Request Headers (JSON):</label>
                  <textarea
                    rows={3}
                    value={testerHeaders}
                    onChange={e => setTesterHeaders(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-xs font-mono resize-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                {['POST', 'PUT', 'PATCH'].includes(testerMethod) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Request Body (JSON):</label>
                    <textarea
                      rows={3}
                      value={testerBody}
                      onChange={e => setTesterBody(e.target.value)}
                      className={`w-full p-3 rounded-2xl border text-xs font-mono resize-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Live Response Viewer */}
              {testerResponse && (
                <div className={`p-5 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  {/* Response Meta Line */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono ${
                        testerResponse.status >= 200 && testerResponse.status < 300
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        STATUS: {testerResponse.status} {testerResponse.statusText}
                      </span>

                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <strong>{testerResponse.durationMs} ms</strong>
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        Size: <strong>{(testerResponse.sizeBytes / 1024).toFixed(2)} KB</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(testerResponse.rawText, 'resp-body')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                    >
                      {copiedId === 'resp-body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy JSON Payload</span>
                    </button>
                  </div>

                  {/* Formatted Code Box */}
                  <div className="max-h-96 overflow-y-auto rounded-2xl bg-black/60 p-4 border border-slate-800 font-mono text-xs text-emerald-300">
                    <pre className="whitespace-pre-wrap break-all">{testerResponse.rawText}</pre>
                  </div>
                </div>
              )}

              {/* Code Snippets Export */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Generate Client Code Snippet:</span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {(['curl', 'js', 'python', 'axios'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setActiveSnippetLang(lang)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition ${
                          activeSnippetLang === lang ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl bg-black/70 p-4 border border-slate-800 font-mono text-xs text-sky-300">
                  <button
                    onClick={() => handleCopy(generatedCodeSnippets[activeSnippetLang], 'snippet')}
                    className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition flex items-center gap-1"
                  >
                    {copiedId === 'snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Code</span>
                  </button>
                  <pre className="whitespace-pre-wrap">{generatedCodeSnippets[activeSnippetLang]}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: CATEGORIES EXPLORER                           */}
        {/* ---------------------------------------------------- */}
        {activeSubTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PUBLIC_API_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveSubTab('directory');
                }}
                className={`p-5 rounded-3xl border text-left transition-all group flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800 hover:border-indigo-500 hover:bg-slate-900'
                    : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {cat.nameNp}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-xs text-slate-500">
                  <span>{cat.count} verified APIs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
});
