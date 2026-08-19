import React, { useState, useMemo } from 'react';
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
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
  BadgeAlert,
  Compass
} from 'lucide-react';
import {
  PRIMARY_CATEGORIES,
  getAllServices,
  getServicesByCategory,
  searchServices,
  getRecentServiceIds,
  recordServiceUsage
} from '../../services/serviceRegistry';
import { PrimaryCategoryId, PrimaryCategory, ServiceDefinition } from '../../types/serviceRegistry';

interface ServicesCentralDirectoryProps {
  currentLang: 'en' | 'ne';
  onSelectService: (service: ServiceDefinition) => void;
  theme?: 'dark' | 'light';
}

export const ServicesCentralDirectory: React.FC<ServicesCentralDirectoryProps> = React.memo(({
  currentLang,
  onSelectService,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [activeCategoryId, setActiveCategoryId] = useState<PrimaryCategoryId | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    if (searchQuery.trim()) {
      return searchServices(searchQuery);
    }
    let list = allServices;
    if (activeCategoryId !== 'all') {
      list = list.filter((s) => s.parentCategory === activeCategoryId);
    }
    if (selectedSubcategory !== 'all') {
      list = list.filter((s) => s.subcategory === selectedSubcategory);
    }
    return list;
  }, [searchQuery, activeCategoryId, selectedSubcategory, allServices]);

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

  return (
    <div className="space-y-6 pt-2">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        isDark
          ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#14161b] border-slate-800'
          : 'bg-gradient-to-r from-slate-50 via-white to-slate-100 border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <Layers className="w-5 h-5" />
              </div>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">
                {currentLang === 'ne' ? 'केन्द्रीय नागरिक सेवा निर्देशिका' : 'Central Services Directory'}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                Unified Civic Directory
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {currentLang === 'ne'
                ? 'सरल र प्रभावकारी पहुँचका लागि सबै प्रमुख नागरिक सेवा तथा वित्तीय सुविधाहरू एउटै मञ्चमा एकीकृत।'
                : 'Comprehensive public services, financial portals, and civic tools organized for intuitive access.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {currentLang === 'ne' ? 'प्रमाणित स्रोत & प्रत्यक्ष लिङ्क' : 'Verified Data & Direct Links'}
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'सेवा खोज्नुहोस् (उदा: IPO, PAN, ब्लूबुक, राहदानी, कर, राशिफल)...'
                : 'Search any service (e.g. IPO, PAN, Bluebook, Passport, Tax, Rashifal)...'
            }
            className={`w-full border rounded-2xl pl-12 pr-10 py-3.5 text-sm font-medium outline-none transition-all ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Breadcrumb Navigation when filtered */}
      {(activeCategoryId !== 'all' || searchQuery || selectedSubcategory !== 'all') && (
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span
            onClick={() => {
              setActiveCategoryId('all');
              setSelectedSubcategory('all');
              setSearchQuery('');
            }}
            className="hover:text-red-400 cursor-pointer text-slate-300 font-bold"
          >
            Services
          </span>
          {activeCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span
                onClick={() => setSelectedSubcategory('all')}
                className="hover:text-red-400 cursor-pointer text-slate-300 font-bold"
              >
                {currentLang === 'ne' ? activeCategory.titleNp : activeCategory.title}
              </span>
            </>
          )}
          {selectedSubcategory !== 'all' && activeCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-red-400 font-bold">
                {activeCategory.subcategories.find((sc) => sc.id === selectedSubcategory)?.title || selectedSubcategory}
              </span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold">
                Search: "{searchQuery}"
              </span>
            </>
          )}
          <button
            onClick={() => {
              setActiveCategoryId('all');
              setSelectedSubcategory('all');
              setSearchQuery('');
            }}
            className="ml-auto text-[11px] text-red-400 hover:underline flex items-center gap-1 font-sans"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Parent Category Selector Cards (Shown when not searching) */}
      {!searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm sm:text-base text-slate-200 uppercase tracking-wider font-mono">
              {currentLang === 'ne' ? 'मुख्य सेवा समूहहरू (Parent Groups)' : 'Primary Service Categories'}
            </h2>
            {activeCategoryId !== 'all' && (
              <button
                onClick={() => {
                  setActiveCategoryId('all');
                  setSelectedSubcategory('all');
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRIMARY_CATEGORIES.filter((cat) => cat.id !== 'home' && cat.id !== 'services').map((cat) => {
              const IconComponent = getCategoryIcon(cat.iconName);
              const isSelected = activeCategoryId === cat.id;
              const count = getServicesByCategory(cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(isSelected ? 'all' : cat.id);
                    setSelectedSubcategory('all');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-b from-red-900/50 to-slate-900 border-red-500 shadow-lg shadow-red-950/40 text-white'
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                        {count}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-1">
                      {currentLang === 'ne' ? cat.titleNp : cat.title}
                    </h3>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {currentLang === 'ne' ? cat.descriptionNp : cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subcategory Filter Tabs if Category Selected */}
      {activeCategory && activeCategory.subcategories.length > 0 && !searchQuery && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            {currentLang === 'ne' ? `${activeCategory.titleNp} का उप-समूहहरू` : `Subcategories in ${activeCategory.title}`}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedSubcategory === 'all'
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              All Subcategories
            </button>
            {activeCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSubcategory === sub.id
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? sub.titleNp : sub.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recently Used Shortcuts (Shown when on All view) */}
      {activeCategoryId === 'all' && !searchQuery && recentServices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLang === 'ne' ? 'हालसालै प्रयोग गरिएका सेवाहरू' : 'Recently Used Services'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {recentServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`p-3 rounded-xl border text-left transition-all hover:-translate-y-0.5 flex items-center justify-between group ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 hover:border-amber-400 text-slate-900 shadow-xs'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-bold truncate">
                    {currentLang === 'ne' ? service.titleNp : service.title}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    #{service.number < 10 ? `0${service.number}` : service.number}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>
              {filteredServices.length} {currentLang === 'ne' ? 'सेवाहरू फेला परे' : 'Services Displayed'}
            </span>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Compass className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              {currentLang === 'ne' ? 'कुनै पनि सेवा भेटिएन' : 'No matching services found'}
            </p>
            <button
              onClick={() => {
                setActiveCategoryId('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              {currentLang === 'ne' ? 'सबै नागरिक सेवाहरू देखाउनुहोस्' : 'Show All Civic Services'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800/90 hover:border-red-500/60 hover:bg-slate-800/80 text-white shadow-md hover:shadow-xl hover:shadow-red-950/20'
                    : 'bg-white border-slate-200 hover:border-red-500/80 hover:bg-slate-50 text-slate-900 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded border text-red-400 bg-red-950/60 border-red-800/60">
                      #{service.number < 10 ? `0${service.number}` : service.number}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {service.isExternal && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" />
                          Gov Portal
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700 capitalize">
                        {service.parentCategory}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-red-400 transition-colors">
                    {currentLang === 'ne' ? service.titleNp : service.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                    {currentLang === 'ne' ? service.descriptionNp : service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span className="text-[11px] font-mono flex items-center gap-1 text-slate-400">
                    {service.isExternal ? 'Open Official External Site' : 'Launch Module'}
                  </span>
                  {service.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-all" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Government Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">SAARTHI Navigation Standard: </span>
          {currentLang === 'ne'
            ? 'SAARTHI एक निजी नागरिक प्रविधि प्लेटफर्म हो। सरकारी पोर्टल लिङ्कहरू आधिकारिक बाह्य वेबसाइटमा जान्छन्।'
            : 'SAARTHI is an independent civic portal. Official government service cards route directly to official public department portals with full transparency.'}
        </div>
      </div>
    </div>
  );
});
