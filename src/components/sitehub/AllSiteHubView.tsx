import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Trash2,
  Bookmark,
  Share2,
  Tv,
  Film,
  BookOpen,
  Gamepad2,
  Download,
  Smartphone,
  CreditCard,
  Sparkles,
  Info,
  SlidersHorizontal,
  X,
  RefreshCw,
  LayoutGrid,
  List,
  Flame,
  Heart,
  TrendingUp,
  Compass,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  ALLSITEHUB_CATEGORIES,
  ALLSITEHUB_REGIONS,
  ALLSITEHUB_SITES,
  AllSiteHubSite,
} from '../../data/allSiteHubData';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface AllSiteHubViewProps {
  currentLang?: 'en' | 'ne';
}

const STORAGE_FAVORITES_KEY = 'saarthi_sitehub_favorites';
const STORAGE_CUSTOM_SITES_KEY = 'saarthi_sitehub_custom_sites';

// Vibrant category visual styling
const CATEGORY_STYLES: Record<string, {
  color: string;
  badge: string;
  borderHover: string;
  gradient: string;
  iconBg: string;
}> = {
  'Movies & Shows': {
    color: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    borderHover: 'hover:border-rose-500/50',
    gradient: 'from-rose-500/15 via-violet-500/5 to-transparent',
    iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  'Anime': {
    color: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderHover: 'hover:border-amber-500/50',
    gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  'Manga': {
    color: 'text-pink-400',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    borderHover: 'hover:border-pink-500/50',
    gradient: 'from-pink-500/15 via-rose-500/5 to-transparent',
    iconBg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  },
  'Live TV & Sports': {
    color: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
    gradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
  'Paid': {
    color: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50',
    gradient: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  'Apps': {
    color: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    borderHover: 'hover:border-blue-500/50',
    gradient: 'from-blue-500/15 via-sky-500/5 to-transparent',
    iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  'Download': {
    color: 'text-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    borderHover: 'hover:border-yellow-500/50',
    gradient: 'from-yellow-500/15 via-amber-500/5 to-transparent',
    iconBg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  },
  'Games': {
    color: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/50',
    gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
};

const POPULAR_SEARCH_CHIPS = [
  { label: '🍿 Cinezo', query: 'cinezo' },
  { label: '🎌 HiAnime', query: 'hianime' },
  { label: '⚽ Live Sports', query: 'sports' },
  { label: '📺 Nepal Live TV', query: 'tv' },
  { label: '📖 MangaDex', query: 'mangadex' },
  { label: '🎮 Web Games', query: 'game' },
];

export const AllSiteHubView: React.FC<AllSiteHubViewProps> = ({ currentLang = 'en' }) => {
  const { adDateFormatted, bsFormattedNp, bsFormattedEn } = useGlobalTime();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'trusted' | 'new' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom user-submitted sites
  const [customSites, setCustomSites] = useState<AllSiteHubSite[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_SITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Live synced directory state from server
  const [liveSites, setLiveSites] = useState<AllSiteHubSite[]>(ALLSITEHUB_SITES);
  const [syncStatus, setSyncStatus] = useState<{
    lastSyncAd: string;
    lastSyncBs: string;
    lastSyncTime: string;
    status: string;
    totalSites: number;
    newSitesCount: number;
  }>({
    lastSyncAd: new Date().toISOString().split('T')[0],
    lastSyncBs: '2083-06-07',
    lastSyncTime: new Date().toLocaleTimeString(),
    status: 'synced',
    totalSites: ALLSITEHUB_SITES.length,
    newSitesCount: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newSiteForm, setNewSiteForm] = useState({
    name: '',
    url: '',
    category: 'Movies & Shows',
    region: 'Global',
    description: '',
  });
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(false);

  // Fetch dynamically verified platforms from server API on mount
  useEffect(() => {
    let isMounted = true;
    const loadSites = async () => {
      try {
        const res = await fetch('/api/sitehub/sites');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.sites) && data.sites.length > 0) {
            setLiveSites(data.sites);
            if (data.status) {
              setSyncStatus({
                lastSyncAd: data.status.lastSyncAd || new Date().toISOString().split('T')[0],
                lastSyncBs: data.status.lastSyncBs || '2083-06-07',
                lastSyncTime: data.status.lastSyncTime || new Date().toLocaleTimeString(),
                status: data.status.status || 'synced',
                totalSites: data.count || data.sites.length,
                newSitesCount: data.status.newSitesCount || 0,
              });
            }
          }
        }
      } catch {
        // Fall back gracefully
      }
    };
    loadSites();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTriggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncNotice(currentLang === 'ne' ? 'allsitehub.site बाट नयाँ प्लेटफर्महरू जाँच तथा सिङ्क हुँदैछ...' : 'Connecting to allsitehub.site to verify and sync latest platforms...');
    try {
      const res = await fetch('/api/sitehub/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.sites)) {
        setLiveSites(data.sites);
        if (data.status) {
          setSyncStatus({
            lastSyncAd: data.status.lastSyncAd,
            lastSyncBs: data.status.lastSyncBs,
            lastSyncTime: data.status.lastSyncTime,
            status: data.status.status,
            totalSites: data.totalSites || data.sites.length,
            newSitesCount: data.newSitesCount || 0,
          });
        }
        setSyncNotice(data.message || (currentLang === 'ne' ? 'डाइरेक्टरी सफलतापूर्वक अपडेट भयो!' : 'Directory successfully verified and updated!'));
      } else {
        setSyncNotice(data.message || 'Sync completed with cached state.');
      }
    } catch {
      setSyncNotice(currentLang === 'ne' ? 'अहिले नेटवर्क अपडेट हुन सकेन। क्यास डाइरेक्टरी प्रयोग भइरहेको छ।' : 'Network update unavailable. Using verified cached directory.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Sync custom sites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_SITES_KEY, JSON.stringify(customSites));
    } catch {
      // ignore
    }
  }, [customSites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyUrl = (site: AllSiteHubSite, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url);
    setCopiedId(site.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCustomSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteForm.name.trim() || !newSiteForm.url.trim()) return;

    let cleanUrl = newSiteForm.url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    let parsedDomain = cleanUrl;
    try {
      parsedDomain = new URL(cleanUrl).hostname;
    } catch {
      // fallback
    }

    const createdSite: AllSiteHubSite = {
      id: `custom_${Date.now()}`,
      name: newSiteForm.name.trim(),
      url: cleanUrl,
      domain: parsedDomain,
      category: newSiteForm.category,
      regions: [newSiteForm.region],
      tags: ['custom', 'personal'],
      isTrusted: true,
      isNew: true,
      isFeatured: false,
      description: newSiteForm.description.trim() || 'User submitted resource.',
    };

    setCustomSites((prev) => [createdSite, ...prev]);
    setNewSiteForm({
      name: '',
      url: '',
      category: 'Movies & Shows',
      region: 'Global',
      description: '',
    });
    setSubmitSuccessMsg(true);
    setTimeout(() => {
      setSubmitSuccessMsg(false);
      setIsSubmitModalOpen(false);
    }, 1200);
  };

  const handleDeleteCustomSite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomSites((prev) => prev.filter((s) => s.id !== id));
  };

  // Merge dynamically synced and custom user sites
  const allAvailableSites = useMemo(() => {
    return [...customSites, ...liveSites];
  }, [customSites, liveSites]);

  // Filtered sites
  const filteredSites = useMemo(() => {
    return allAvailableSites.filter((site) => {
      // 1. Text search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = site.name.toLowerCase().includes(query);
        const matchesDomain = site.domain.toLowerCase().includes(query);
        const matchesDesc = site.description.toLowerCase().includes(query);
        const matchesCategory = site.category.toLowerCase().includes(query);
        const matchesTags = site.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDomain && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && site.category !== selectedCategory) {
        return false;
      }

      // 3. Region filter
      if (selectedRegion !== 'all' && !site.regions.includes(selectedRegion) && !site.regions.includes('Global')) {
        return false;
      }

      // 4. Special filter type
      if (filterType === 'featured' && !site.isFeatured) return false;
      if (filterType === 'trusted' && !site.isTrusted) return false;
      if (filterType === 'new' && !site.isNew) return false;
      if (filterType === 'favorites' && !favorites.includes(site.id)) return false;

      return true;
    });
  }, [allAvailableSites, searchQuery, selectedCategory, selectedRegion, filterType, favorites]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allAvailableSites.length };
    ALLSITEHUB_CATEGORIES.forEach((cat) => {
      counts[cat.name] = allAvailableSites.filter((s) => s.category === cat.name).length;
    });
    return counts;
  }, [allAvailableSites]);

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Movies & Shows':
        return <Film className="w-4 h-4 text-rose-400" />;
      case 'Anime':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Manga':
        return <BookOpen className="w-4 h-4 text-pink-400" />;
      case 'Live TV & Sports':
        return <Tv className="w-4 h-4 text-cyan-400" />;
      case 'Paid':
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'Apps':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'Download':
        return <Download className="w-4 h-4 text-yellow-400" />;
      case 'Games':
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setFilterType('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14 w-full">
      {/* =========================================================================
          1. HERO SHOWCASE DECK (ENGAGING & MODERN)
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-[#0B0F17]/90 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ALL SITES DIRECTORY</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {allAvailableSites.length} {currentLang === 'ne' ? 'साइटहरू सूचीकृत' : 'Handpicked Platforms'}
                </span>
              </div>

              <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {currentLang === 'ne' ? 'अल साइट हब: वेब तथा स्ट्रिमिङ डाइरेक्टरी' : 'All Sites Hub & Web Directory'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {currentLang === 'ne'
                  ? 'चलचित्र, एनिमे, प्रत्यक्ष टिभी, खेलकुद, मङ्गा, एप्स र गेमहरूका लागि विश्वभरका सुरक्षित तथा प्रमाणित साइटहरू।'
                  : 'Fast, verified directory of free movies, anime, manga, live sports channels, streaming portals, and online tools.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSyncing
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-wait'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                }`}
                title="Polls allsitehub.site to verify domains and discover fresh platforms"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Latest'}</span>
              </button>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'साइट थप्नुहोस्' : 'Submit Site'}</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  currentLang === 'ne'
                    ? 'कुनै पनि साइट वा विधा खोज्नुहोस् (उदा: Cinezo, HiAnime, Football, TV, Games)...'
                    : 'Search 240+ sites by name, domain, tags (e.g. Cinezo, HiAnime, Football, Nepal TV, Games)...'
                }
                className="w-full border border-slate-700/80 rounded-2xl pl-11 pr-24 py-3.5 text-xs sm:text-sm font-medium outline-none bg-slate-950/80 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Trending Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'प्रचलित खोज:' : 'Trending:'}</span>
              </span>
              {POPULAR_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip.query}
                  onClick={() => setSearchQuery(chip.query)}
                  className="text-xs px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150 shadow-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* =========================================================================
          2. UNIFIED CATEGORY & FILTER TABS (HIGH USER DELIGHT)
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-md space-y-3.5">
        {/* Row 1: Category Carousel Tabs with Spring Gliders */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {/* All Sites Tab */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setFilterType('all');
            }}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'all' && filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Sites ({allAvailableSites.length})</span>
          </button>

          {/* Categories */}
          {ALLSITEHUB_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.name && filterType !== 'favorites';
            const count = categoryCounts[cat.name] || 0;
            const style = CATEGORY_STYLES[cat.name] || CATEGORY_STYLES['Movies & Shows'];

            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  if (filterType === 'favorites') setFilterType('all');
                }}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isCatActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{currentLang === 'ne' ? cat.nameNp : cat.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isCatActive ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Favorites Tab */}
          <button
            onClick={() => setFilterType(filterType === 'favorites' ? 'all' : 'favorites')}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              filterType === 'favorites'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterType === 'favorites' ? 'fill-current' : ''}`} />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>

        {/* Row 2: Secondary Quick Filters, Region Selector & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Quick Badge Filters */}
            <button
              onClick={() => setFilterType(filterType === 'featured' ? 'all' : 'featured')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === 'featured'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Featured Gems</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'trusted' ? 'all' : 'trusted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === 'trusted'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified CDN Only</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'new' ? 'all' : 'new')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === 'new'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-xs'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Newly Added</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Region Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Regions</option>
                {ALLSITEHUB_REGIONS.map((reg) => (
                  <option key={reg} value={reg} className="bg-slate-900 text-slate-200">
                    {reg === 'Global' ? '🌐 Global' : reg === 'NP' ? '🇳🇵 Nepal' : reg === 'IN' ? '🇮🇳 India' : reg === 'US' ? '🇺🇸 USA' : reg}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Bento Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'compact' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Compact Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Breadcrumb Bar */}
        {(selectedCategory !== 'all' || selectedRegion !== 'all' || filterType !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <span onClick={handleResetFilters} className="hover:text-emerald-400 cursor-pointer text-white font-semibold">
              Directory
            </span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-white font-semibold">{selectedCategory}</span>
              </>
            )}
            {selectedRegion !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-cyan-400 font-semibold">Region: {selectedRegion}</span>
              </>
            )}
            {filterType !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-amber-400 font-semibold capitalize">{filterType}</span>
              </>
            )}
            {searchQuery && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-emerald-400 font-semibold">"{searchQuery}"</span>
              </>
            )}
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. DIRECTORY RESULTS: BENTO GRID OR COMPACT LIST
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <span>
            Showing <strong className="text-white font-bold">{filteredSites.length}</strong> verified web platforms
          </span>
          {favorites.length > 0 && (
            <span className="text-rose-400 font-bold">
              ❤️ {favorites.length} saved in your bookmarks
            </span>
          )}
        </div>

        {filteredSites.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B0F17]/90 border border-slate-800 space-y-4 shadow-xl">
            <Globe className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">
                {currentLang === 'ne' ? 'कुनै साइट भेटिएन' : 'No platforms match your criteria'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {currentLang === 'ne'
                  ? 'कृपया फरक शब्द खोज्नुहोस् वा फिल्टर्स रिसेट गर्नुहोस्।'
                  : 'Try adjusting your search keywords, clearing regional filters, or switching category tabs.'}
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md hover:bg-emerald-400 transition-all inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* BENTO GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.map((site) => {
              const isFav = favorites.includes(site.id);
              const isCopied = copiedId === site.id;
              const isCustom = site.tags?.includes('custom');
              const style = CATEGORY_STYLES[site.category] || CATEGORY_STYLES['Movies & Shows'];

              return (
                <div
                  key={site.id}
                  className={`p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 ${style.borderHover} hover:-translate-y-1 transition-all flex flex-col justify-between group space-y-3.5 shadow-lg relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${style.gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />

                  {/* Top Header */}
                  <div className="space-y-2.5 relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${style.iconBg}`}>
                          {getCategoryIcon(site.category)}
                        </div>

                        <div className="overflow-hidden">
                          <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                            {site.name}
                          </h3>
                          <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                            <span>{site.domain}</span>
                            <span>·</span>
                            <span className="text-slate-500">{site.regions.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark & Delete Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustomSite(site.id, e)}
                            title="Remove personal site"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => toggleFavorite(site.id, e)}
                          title={isFav ? 'Remove from saved' : 'Save to favorites'}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isFav
                              ? 'text-rose-400 bg-rose-500/10 shadow-sm'
                              : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${style.badge}`}>
                        {site.category}
                      </span>

                      {site.isTrusted && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Verified
                        </span>
                      )}

                      {site.isFeatured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                          <Star className="w-3 h-3 fill-current text-amber-400" />
                          Featured
                        </span>
                      )}

                      {site.isNew && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                          New
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                      {site.description || 'Curated high-speed streaming platform with fast playback and zero login.'}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 relative z-10">
                    <button
                      onClick={(e) => handleCopyUrl(site, e)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Open Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT TABLE/LIST VIEW */
          <div className="rounded-2xl bg-[#0B0F17]/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-lg">
            {filteredSites.map((site) => {
              const isFav = favorites.includes(site.id);
              const isCopied = copiedId === site.id;
              const style = CATEGORY_STYLES[site.category] || CATEGORY_STYLES['Movies & Shows'];

              return (
                <div
                  key={site.id}
                  className="p-4 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${style.iconBg}`}>
                      {getCategoryIcon(site.category)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                          {site.name}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-bold shrink-0 ${style.badge}`}>
                          {site.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {site.regions.join(', ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {site.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={(e) => toggleFavorite(site.id, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleCopyUrl(site, e)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>

                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. SAFETY & AD-BLOCK ADVISORY
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 shadow-md">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">Safe Browsing Advice: </span>
          {currentLang === 'ne'
            ? 'अनलाइन स्ट्रिमिङ साइटहरू चलाउँदा अनावश्यक पप-अप विज्ञापनहरू रोक्न Brave Browser वा uBlock Origin एक्सटेन्सन प्रयोग गर्न सिफारिस गरिन्छ। कहिल्यै पनि अज्ञात फाइल डाउनलोड नगर्नुहोस्।'
            : 'For the smoothest streaming experience without pop-up redirects, we recommend browsing with Brave Browser or uBlock Origin. Never download executable files from third-party media platforms.'}
        </div>
      </div>

      {/* =========================================================================
          5. SUBMIT CUSTOM SITE MODAL
          ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  {currentLang === 'ne' ? 'नयाँ साइट वा स्रोत थप्नुहोस्' : 'Submit / Add a Web Platform'}
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Add your favorite streaming site, manga portal, sports channel, or utility. Saved entries will be stored in your personal directory list instantly.
            </p>

            <form onSubmit={handleAddCustomSite} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Site Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSiteForm.name}
                  onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                  placeholder="e.g. FreeAnimeHub, CineStream, LiveFootball"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Website URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSiteForm.url}
                  onChange={(e) => setNewSiteForm({ ...newSiteForm, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newSiteForm.category}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ALLSITEHUB_CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name} className="bg-slate-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Region
                  </label>
                  <select
                    value={newSiteForm.region}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ALLSITEHUB_REGIONS.map((reg) => (
                      <option key={reg} value={reg} className="bg-slate-900 text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Features
                </label>
                <textarea
                  rows={2}
                  value={newSiteForm.description}
                  onChange={(e) => setNewSiteForm({ ...newSiteForm, description: e.target.value })}
                  placeholder="Ad-free player, subtitles, multiple servers, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {submitSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                  ✓ Platform saved to your personal directory!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Save Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
