import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Building,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Info,
  Layers,
  LayoutGrid,
  List,
  Lock,
  Newspaper,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  PRIMARY_CATEGORIES,
  getAllServices,
  getRecentServiceIds,
  getServicesByCategory,
  recordServiceUsage,
  searchServices,
} from '../../services/serviceRegistry';
import { PrimaryCategoryId, ServiceDefinition } from '../../types/serviceRegistry';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { Card, EmptyState } from '../ui';

interface ServicesCentralDirectoryProps {
  currentLang: 'en' | 'ne';
  onSelectService: (service: ServiceDefinition) => void;
  theme?: 'dark' | 'light';
}

const POPULAR_SEARCH_TAGS = [
  { label: 'NEPSE IPO', query: 'IPO' },
  { label: 'Bluebook Tax', query: 'Bluebook' },
  { label: 'E-Passport', query: 'Passport' },
  { label: 'NRB Forex', query: 'Forex' },
  { label: 'Lok Sewa', query: 'Lok Sewa' },
  { label: 'Patro / Calendar', query: 'Calendar' },
];

export const ServicesCentralDirectory: React.FC<ServicesCentralDirectoryProps> = React.memo(
  ({ currentLang, onSelectService }) => {
    const isNe = currentLang === 'ne';
    const { savedItems, toggleSavedItem } = useSyncAuth();

    const [activeCategoryId, setActiveCategoryId] = useState<PrimaryCategoryId | 'all'>('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'builtin' | 'external'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
    const [onlySaved, setOnlySaved] = useState<boolean>(false);

    const getCategoryIcon = (iconName: string) => {
      switch (iconName) {
        case 'TrendingUp':
          return TrendingUp;
        case 'Lock':
          return Lock;
        case 'Building':
          return Building;
        case 'Newspaper':
          return Newspaper;
        case 'Calendar':
          return Calendar;
        case 'User':
          return User;
        default:
          return Layers;
      }
    };

    const recentServiceIds = useMemo(() => getRecentServiceIds(), []);
    const allServices = useMemo(() => getAllServices(), []);

    const recentServices = useMemo(() => {
      return recentServiceIds
        .map((id) => allServices.find((s) => s.id === id))
        .filter((s): s is ServiceDefinition => s !== undefined);
    }, [recentServiceIds, allServices]);

    const savedIdSet = useMemo(
      () => new Set(savedItems.map((item) => item.targetId)),
      [savedItems]
    );

    const filteredServices = useMemo(() => {
      let list = allServices;

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

      if (serviceTypeFilter === 'builtin') {
        list = list.filter((s) => !s.isExternal);
      } else if (serviceTypeFilter === 'external') {
        list = list.filter((s) => s.isExternal);
      }

      if (onlySaved) {
        list = list.filter((s) => savedIdSet.has(s.id));
      }

      return list;
    }, [searchQuery, activeCategoryId, selectedSubcategory, serviceTypeFilter, allServices, onlySaved, savedIdSet]);

    const activeCategory = useMemo(() => {
      if (activeCategoryId === 'all') return null;
      return PRIMARY_CATEGORIES.find((c) => c.id === activeCategoryId);
    }, [activeCategoryId]);

    const handleServiceClick = (service: ServiceDefinition) => {
      recordServiceUsage(service.id);
      if (service.isExternal && service.externalUrl) {
        const a = document.createElement('a');
        a.href = service.externalUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        onSelectService(service);
      }
    };

    const handleToggleBookmark = (e: React.MouseEvent, service: ServiceDefinition) => {
      e.stopPropagation();
      const isSaved = savedIdSet.has(service.id);
      void toggleSavedItem({
        id: `svc-${service.id}`,
        kind: 'saved_service',
        targetId: service.id,
        title: isNe ? service.titleNp : service.title,
        subtitle: service.parentCategory,
        pinned: !isSaved,
      });
    };

    const handleResetFilters = () => {
      setActiveCategoryId('all');
      setSelectedSubcategory('all');
      setSearchQuery('');
      setServiceTypeFilter('all');
      setOnlySaved(false);
    };

    return (
      <div className="space-y-6 max-w-6xl mx-auto w-full pb-12">
        {/* 1. Directory Header & Unified Search */}
        <section className="p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {isNe ? 'केन्द्रीय नागरिक निर्देशिका' : 'Unified Civic Directory'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {allServices.length} {isNe ? 'सेवाहरू उपलब्ध' : 'Services Listed'}
                </span>
              </div>

              <h1 className="font-semibold text-2xl sm:text-3xl text-[#0B1F3A] dark:text-white tracking-tight">
                {isNe ? 'नागरिक सेवा तथा सुविधा निर्देशिका' : 'Central Civic & Financial Directory'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {isNe
                  ? 'नेपाल सरकारका आधिकारिक पोर्टलहरू, कर, राहदानी, सवारीसाधन, बैंकिङ र क्यालकुलेटरहरू एउटै स्थानबाट प्रयोग गर्नुहोस्।'
                  : 'Direct access to official Nepal ministries, tax utilities, vehicle services, banking tools, and citizen calculators.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#0B1220] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{isNe ? 'प्रमाणित सरकारी तथा सार्वजनिक लिङ्क' : 'Verified Official Portals'}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isNe
                    ? 'सेवा खोज्नुहोस् (उदा: IPO, PAN, ब्लूबुक कर, राहदानी, राशिफल, लोक सेवा)...'
                    : 'Search services or tools (e.g. IPO, PAN Card, Bluebook, E-Passport, Forex, Lok Sewa)...'
                }
                className="w-full min-h-[44px] border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-20 py-2.5 text-xs sm:text-sm outline-none bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {isNe ? 'हटाउनुहोस्' : 'Clear'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1">
                {isNe ? 'प्रचलित:' : 'Quick filters:'}
              </span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag.query}
                  type="button"
                  onClick={() => setSearchQuery(tag.query)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Primary Service Sectors */}
        {!searchQuery && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isNe ? 'मुख्य सेवा समूहहरू' : 'Primary Service Sectors'}</span>
              </h2>

              {activeCategoryId !== 'all' && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-mono flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isNe ? 'सबै समूह देखाउनुहोस्' : 'View All Categories'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PRIMARY_CATEGORIES.filter((cat) => cat.id !== 'home' && cat.id !== 'services').map(
                (cat) => {
                  const IconComponent = getCategoryIcon(cat.iconName);
                  const isSelected = activeCategoryId === cat.id;
                  const count = getServicesByCategory(cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategoryId(isSelected ? 'all' : cat.id);
                        setSelectedSubcategory('all');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-[#0B1F3A] dark:bg-blue-600 border-[#0B1F3A] dark:border-blue-500 text-white shadow-sm'
                          : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[11px] font-mono font-semibold tabular-nums ${
                              isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                        </div>

                        <div>
                          <h3
                            className={`font-semibold text-xs sm:text-sm line-clamp-1 ${
                              isSelected ? 'text-white' : 'text-[#0B1F3A] dark:text-white'
                            }`}
                          >
                            {isNe ? cat.titleNp : cat.title}
                          </h3>
                          <p
                            className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                              isSelected ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {isNe ? cat.descriptionNp : cat.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                          isSelected
                            ? 'border-white/20 text-blue-100'
                            : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span>{isSelected ? (isNe ? 'चयन गरिएको' : 'Selected') : isNe ? 'खोल्नुहोस्' : 'Explore'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* 3. Filter & View Controls */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {activeCategory && activeCategory.subcategories.length > 0 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedSubcategory === 'all'
                      ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isNe ? 'सबै' : 'All'}
                </button>
                {activeCategory.subcategories.map((sub) => {
                  const isSubActive = selectedSubcategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                        isSubActive
                          ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isNe ? sub.titleNp : sub.title}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {isNe
                    ? `${filteredServices.length} सेवाहरू उपलब्ध`
                    : `Showing ${filteredServices.length} civic & financial services`}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs">
                {(
                  [
                    { id: 'all', label: isNe ? 'सबै' : 'All' },
                    { id: 'builtin', label: isNe ? 'इन-एप' : 'In-App' },
                    { id: 'external', label: isNe ? 'सरकारी पोर्टल' : 'Gov Portals' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setServiceTypeFilter(item.id)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      serviceTypeFilter === item.id
                        ? 'bg-white dark:bg-slate-800 text-[#0B1F3A] dark:text-white font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOnlySaved((p) => !p)}
                className={`min-h-[38px] px-3 py-1 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  onlySaved
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-[#0B1220] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isNe ? 'बचत' : 'Saved'}</span>
              </button>

              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  aria-label="Compact list view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {(activeCategoryId !== 'all' ||
            searchQuery ||
            selectedSubcategory !== 'all' ||
            serviceTypeFilter !== 'all' ||
            onlySaved) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#0B1F3A] dark:text-white font-semibold hover:text-blue-600 cursor-pointer"
              >
                {isNe ? 'सेवाहरू' : 'Services'}
              </button>
              {activeCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#0B1F3A] dark:text-white font-semibold">
                    {isNe ? activeCategory.titleNp : activeCategory.title}
                  </span>
                </>
              )}
              {searchQuery && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                </>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isNe ? 'रिसेट' : 'Reset All'}</span>
              </button>
            </div>
          )}
        </Card>

        {/* 4. Recently Used Services */}
        {activeCategoryId === 'all' && !searchQuery && recentServices.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isNe ? 'भर्खरै प्रयोग गरिएका सेवाहरू' : 'Recently Used Services'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {recentServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceClick(service)}
                  className="p-3 rounded-xl bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-600 border border-slate-200 dark:border-slate-800 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate mr-2">
                    <div className="text-xs font-semibold truncate text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {isNe ? service.titleNp : service.title}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      #{service.number < 10 ? `0${service.number}` : service.number}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Results Grid or Compact List */}
        {filteredServices.length === 0 ? (
          <EmptyState
            title={isNe ? 'कुनै सेवा भेटिएन' : 'No matching services found'}
            description={
              isNe
                ? 'अर्को शब्द खोज्नुहोस् वा फिल्टर रिसेट गर्नुहोस्।'
                : 'Try different keywords or reset filters to browse all civic and financial tools.'
            }
            actionLabel={isNe ? 'सबै देखाउनुहोस्' : 'Reset & Show All Services'}
            onAction={handleResetFilters}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => {
              const isSaved = savedIdSet.has(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer flex flex-col justify-between space-y-3.5 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                        #{service.number < 10 ? `0${service.number}` : service.number} · {service.parentCategory}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(e, service)}
                        className={`min-h-[32px] min-w-[32px] rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={isSaved ? 'Remove from shortcuts' : 'Pin to shortcuts'}
                        aria-label={isSaved ? `Remove ${service.title}` : `Save ${service.title}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {isNe ? service.titleNp : service.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-[2.4rem]">
                      {isNe ? service.descriptionNp : service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      {service.isExternal ? (
                        <>
                          <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{isNe ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{isNe ? 'इन-एप औजार' : 'Built-in Tool'}</span>
                        </>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                      <span>{isNe ? 'खोल्नुहोस्' : 'Open'}</span>
                      {service.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
            {filteredServices.map((service) => {
              const isSaved = savedIdSet.has(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                      #{service.number < 10 ? `0${service.number}` : service.number}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {isNe ? service.titleNp : service.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {isNe ? service.descriptionNp : service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, service)}
                      className={`p-2 rounded-lg cursor-pointer ${
                        isSaved
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                      aria-label={isSaved ? `Remove ${service.title}` : `Save ${service.title}`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#0B1F3A] dark:text-white inline-flex items-center gap-1">
                      <span>{isNe ? 'खोल्नुहोस्' : 'Open'}</span>
                      {service.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Civic Standard Note */}
        <Card className="p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#0B1F3A] dark:text-white">
              {isNe ? 'सारथी सेवा मानक: ' : 'SAARTHI Civic Directory Standard: '}
            </span>
            {isNe
              ? 'SAARTHI एक स्वतन्त्र नागरिक प्रविधि प्लेटफर्म हो। सरकारी सेवाहरूमा क्लिक गर्दा सीधा आधिकारिक मन्त्रालय र विभागका वेबसाइटहरू सुरक्षित रूपमा खुल्छन्।'
              : 'Official government links route directly to authentic department portals with zero intermediaries.'}
          </div>
        </Card>
      </div>
    );
  }
);
