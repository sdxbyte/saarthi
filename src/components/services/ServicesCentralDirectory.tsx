import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Lock,
  Building,
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  Info,
  Compass,
  Sparkles,
  LayoutGrid,
  List,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  PRIMARY_CATEGORIES,
  getAllServices,
  getServicesByCategory,
  searchServices,
  getRecentServiceIds,
  recordServiceUsage,
} from '../../services/serviceRegistry';
import { PrimaryCategoryId, ServiceDefinition } from '../../types/serviceRegistry';

interface ServicesCentralDirectoryProps {
  currentLang: 'en' | 'ne';
  onSelectService: (service: ServiceDefinition) => void;
  theme?: 'dark' | 'light';
}

const CATEGORY_THEMES: Record<string, {
  color: string;
  badgeBg: string;
  borderHover: string;
  gradient: string;
  iconBg: string;
}> = {
  finance: {
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/50',
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  civic: {
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
  governance: {
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderHover: 'hover:border-amber-500/50',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  employment: {
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
    iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  media: {
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    borderHover: 'hover:border-rose-500/50',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  lifestyle: {
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    borderHover: 'hover:border-blue-500/50',
    gradient: 'from-blue-500/10 via-transparent to-transparent',
    iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
};

const POPULAR_SEARCH_TAGS = [
  { label: '📊 NEPSE IPO', query: 'IPO' },
  { label: '🚗 Bluebook Tax', query: 'Bluebook' },
  { label: '🛂 E-Passport', query: 'Passport' },
  { label: '💵 NRB Forex', query: 'Forex' },
  { label: '💼 Lok Sewa', query: 'Lok Sewa' },
  { label: '📅 Patro / Calendar', query: 'Calendar' },
];

export const ServicesCentralDirectory: React.FC<ServicesCentralDirectoryProps> = React.memo(({
  currentLang,
  onSelectService,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<PrimaryCategoryId | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'builtin' | 'external'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'Lock': return Lock;
      case 'Building': return Building;
      case 'Newspaper': return Newspaper;
      case 'Calendar': return Calendar;
      case 'User': return User;
      default: return Layers;
    }
  };

  // Recent Services
  const recentServiceIds = useMemo(() => getRecentServiceIds(), []);
  const allServices = useMemo(() => getAllServices(), []);

  const recentServices = useMemo(() => {
    return recentServiceIds
      .map((id) => allServices.find((s) => s.id === id))
      .filter((s): s is ServiceDefinition => s !== undefined);
  }, [recentServiceIds, allServices]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    let list = allServices;

    // Search query takes top precedence or filters current scope
    if (searchQuery.trim()) {
      list = searchServices(searchQuery);
    } else {
      if (activeCategoryId !== 'all') {
        list = list.filter((s) => s.parentCategory === activeCategoryId);
      }
      if (selectedSubcategory !== 'all') {
        list = list.filter((s) => s.subcategory === selectedSubcategory);
      }
    }

    // Filter by type (Built-in tool vs Official External portal)
    if (serviceTypeFilter === 'builtin') {
      list = list.filter((s) => !s.isExternal);
    } else if (serviceTypeFilter === 'external') {
      list = list.filter((s) => s.isExternal);
    }

    return list;
  }, [searchQuery, activeCategoryId, selectedSubcategory, serviceTypeFilter, allServices]);

  const activeCategory = useMemo(() => {
    if (activeCategoryId === 'all') return null;
    return PRIMARY_CATEGORIES.find((c) => c.id === activeCategoryId);
  }, [activeCategoryId]);

  const handleServiceClick = (service: ServiceDefinition) => {
    recordServiceUsage(service.id);
    if (service.isExternal && service.externalUrl) {
      window.open(service.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelectService(service);
    }
  };

  const handleResetFilters = () => {
    setActiveCategoryId('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setServiceTypeFilter('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-14">
      {/* 1. Welcoming Hero Deck with Fast Search */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-[#0B0F17]/90 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header text & badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'ne' ? 'केन्द्रीय नागरिक निर्देशिका' : 'Unified Civic Directory'}</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {allServices.length} {currentLang === 'ne' ? 'सेवाहरू उपलब्ध' : 'Verified Services Available'}
                </span>
              </div>

              <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {currentLang === 'ne' ? 'नागरिक सेवा तथा सुविधा निर्देशिका' : 'Central Civic & Financial Directory'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {currentLang === 'ne'
                  ? 'नेपाल सरकारका आधिकारिक पोर्टलहरू, कर, राहदानी, सवारीसाधन, बैंकिङ, र क्यालकुलेटरहरू सबै एकै ठाउँमा सहज रूपमा प्रयोग गर्नुहोस्।'
                  : 'Direct access to official Nepal government ministries, tax utilities, vehicle registration, banking tools, and citizen calculators.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-800 shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {currentLang === 'ne' ? '१००% प्रमाणित सरकारी लिङ्क' : '100% Verified Official Feeds'}
              </span>
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
                    ? 'सेवा खोज्नुहोस् (उदा: IPO, PAN, ब्लूबुक कर, राहदानी, राशिफल, लोक सेवा, सुनचाँदी)...'
                    : 'Search any service or tool (e.g. IPO, PAN Card, Bluebook, E-Passport, Forex, Lok Sewa)...'
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

            {/* Popular quick jump tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'प्रचलित खोज:' : 'Trending:'}</span>
              </span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag.query}
                  onClick={() => setSearchQuery(tag.query)}
                  className="text-xs px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer font-medium"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Category Bento Cards (6 Main Pillars) */}
      {!searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'ne' ? 'मुख्य सेवा समूहहरू' : 'Primary Service Sectors'}</span>
            </h2>

            {activeCategoryId !== 'all' && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-emerald-400 hover:underline cursor-pointer font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{currentLang === 'ne' ? 'सबै समूहहरू देखाउनुहोस्' : 'View All Categories'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {PRIMARY_CATEGORIES.filter((cat) => cat.id !== 'home' && cat.id !== 'services').map((cat) => {
              const IconComponent = getCategoryIcon(cat.iconName);
              const isSelected = activeCategoryId === cat.id;
              const count = getServicesByCategory(cat.id).length;
              const theme = CATEGORY_THEMES[cat.id] || CATEGORY_THEMES.finance;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(isSelected ? 'all' : cat.id);
                    setSelectedSubcategory('all');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group shadow-lg ${
                    isSelected
                      ? `bg-slate-900/95 border-emerald-500 ring-2 ring-emerald-500/30 text-white shadow-emerald-500/10`
                      : `bg-[#0B0F17]/90 border-slate-800/90 ${theme.borderHover} hover:-translate-y-0.5 text-slate-200`
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${theme.gradient} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform`} />

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                          : `${theme.iconBg} group-hover:scale-105`
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-bold ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {count}
                      </span>
                    </div>

                    <div>
                      <h3 className={`font-bold text-xs sm:text-sm line-clamp-1 transition-colors ${
                        isSelected ? 'text-emerald-300' : 'text-white group-hover:text-slate-100'
                      }`}>
                        {currentLang === 'ne' ? cat.titleNp : cat.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {currentLang === 'ne' ? cat.descriptionNp : cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
                    <span>{isSelected ? (currentLang === 'ne' ? 'चयन गरियो' : 'Selected') : (currentLang === 'ne' ? 'हेर्नुहोस्' : 'Explore')}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1 text-emerald-400' : 'group-hover:translate-x-1'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Subcategories & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Subcategory chips if a parent category is selected */}
          {activeCategory && activeCategory.subcategories.length > 0 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                {currentLang === 'ne' ? 'उप-समूह:' : 'Filter:'}
              </span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubcategory === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Subcategories
              </button>
              {activeCategory.subcategories.map((sub) => {
                const isSubActive = selectedSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {currentLang === 'ne' ? sub.titleNp : sub.title}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {currentLang === 'ne'
                  ? `कुल ${filteredServices.length} सेवाहरू सूचीकृत`
                  : `Showing ${filteredServices.length} civic & financial services`}
              </span>
            </div>
          )}

          {/* Right: Service Type Toggle & View Mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Built-in vs External Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setServiceTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  serviceTypeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setServiceTypeFilter('builtin')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  serviceTypeFilter === 'builtin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Only interactive tools built into SAARTHI"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>In-App Tools</span>
              </button>
              <button
                onClick={() => setServiceTypeFilter('external')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  serviceTypeFilter === 'external' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Only official external government portals"
              >
                <ExternalLink className="w-3 h-3 text-cyan-400" />
                <span>Gov Portals</span>
              </button>
            </div>

            {/* View Mode Toggle */}
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
                title="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb if filtered */}
        {(activeCategoryId !== 'all' || searchQuery || selectedSubcategory !== 'all' || serviceTypeFilter !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <span
              onClick={handleResetFilters}
              className="hover:text-emerald-400 cursor-pointer text-white font-semibold"
            >
              Services
            </span>
            {activeCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-white font-semibold">
                  {currentLang === 'ne' ? activeCategory.titleNp : activeCategory.title}
                </span>
              </>
            )}
            {selectedSubcategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-emerald-400 font-semibold">{selectedSubcategory}</span>
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
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Recently Used Shortcuts */}
      {activeCategoryId === 'all' && !searchQuery && recentServices.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLang === 'ne' ? 'हालसालै प्रयोग गरिएका सेवाहरू' : 'Recently Used Shortcuts'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {recentServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="p-3 rounded-xl bg-[#0B0F17]/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-semibold truncate text-white group-hover:text-emerald-300 transition-colors">
                    {currentLang === 'ne' ? service.titleNp : service.title}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    #{service.number < 10 ? `0${service.number}` : service.number}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Directory Results: Bento Grid or Compact List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0B0F17]/90 border border-slate-800 text-center space-y-4 shadow-xl">
            <Compass className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base text-white font-bold">
                {currentLang === 'ne' ? 'कुनै पनि सेवा भेटिएन' : 'No matching services found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {currentLang === 'ne'
                  ? 'कृपया अर्को शब्द खोज्नुहोस् वा फिल्टर्स रिसेट गर्नुहोस्।'
                  : 'Try typing different keywords or reset your filters to browse all available civic tools.'}
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md hover:bg-emerald-400 transition-all inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'सबै नागरिक सेवाहरू देखाउनुहोस्' : 'Reset & Show All Services'}</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* BENTO GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => {
              const theme = CATEGORY_THEMES[service.parentCategory] || CATEGORY_THEMES.finance;

              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className={`p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 ${theme.borderHover} hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group shadow-lg relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${theme.gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />

                  <div className="relative z-10 space-y-2.5">
                    {/* Top tags row */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        #{service.number < 10 ? `0${service.number}` : service.number}
                      </span>

                      <div className="flex items-center gap-1">
                        {service.isExternal ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                            <ExternalLink className="w-2.5 h-2.5" />
                            Official Gov
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                            <Sparkles className="w-2.5 h-2.5" />
                            In-App Engine
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 capitalize">
                          {service.parentCategory}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {currentLang === 'ne' ? service.titleNp : service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {currentLang === 'ne' ? service.descriptionNp : service.description}
                    </p>
                  </div>

                  {/* Bottom launch action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300 relative z-10">
                    <span className="text-[11px] font-mono flex items-center gap-1.5">
                      {service.isExternal ? (
                        <>
                          <Building className="w-3.5 h-3.5 text-cyan-400" />
                          <span>External Portal</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Launch Tool</span>
                        </>
                      )}
                    </span>

                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-400 transition-colors font-bold text-xs">
                      <span>{service.isExternal ? 'Open' : 'Open'}</span>
                      {service.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="rounded-2xl bg-[#0B0F17]/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-lg">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="p-4 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                    #{service.number < 10 ? `0${service.number}` : service.number}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                        {currentLang === 'ne' ? service.titleNp : service.title}
                      </h3>
                      {service.isExternal ? (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0">
                          External
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
                          In-App
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {currentLang === 'ne' ? service.descriptionNp : service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-mono text-slate-400 capitalize">
                    {service.parentCategory}
                  </span>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-emerald-500 group-hover:text-slate-950 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all">
                    <span>Launch</span>
                    {service.isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Friendly Civic Standard Notice */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 shadow-md">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">SAARTHI Civic Directory Standard: </span>
          {currentLang === 'ne'
            ? 'SAARTHI एक स्वतन्त्र नागरिक प्रविधि प्लेटफर्म हो। सरकारी सेवाहरूमा क्लिक गर्दा सिधै आधिकारिक मन्त्रालय र विभागका वेबसाइटहरू सुरक्षित रूपमा खुल्दछन्।'
            : 'SAARTHI is an independent civic platform. Official government links route directly to authentic department portals with full transparency and zero tampering.'}
        </div>
      </div>
    </div>
  );
});
