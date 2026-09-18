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
  ArrowRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  Info,
  Compass,
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

export const ServicesCentralDirectory: React.FC<ServicesCentralDirectoryProps> = React.memo(({
  currentLang,
  onSelectService,
}) => {
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
    <div className="space-y-4 pt-1 max-w-7xl mx-auto w-full">
      {/* Header Banner - Sajilo Surface Card Style */}
      <div className="surface-card p-5 sm:p-6 rounded-[12px] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/30 text-[var(--color-accent-mark)] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h1 className="font-bold text-lg sm:text-xl text-[var(--color-text)] tracking-tight">
                {currentLang === 'ne' ? 'केन्द्रीय नागरिक सेवा निर्देशिका' : 'Central Services Directory'}
              </h1>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border border-[var(--color-accent-mark)]/30">
                Unified Civic Directory
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              {currentLang === 'ne'
                ? 'सरल र प्रभावकारी पहुँचका लागि सबै प्रमुख नागरिक सेवा तथा वित्तीय सुविधाहरू एउटै मञ्चमा एकीकृत।'
                : 'Comprehensive public services, financial portals, and civic tools organized for intuitive access.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-canvas)] px-2.5 py-1.5 rounded-[6px] border border-[var(--color-border)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0" />
            <span>
              {currentLang === 'ne' ? 'प्रमाणित स्रोत & प्रत्यक्ष लिङ्क' : 'Verified Data & Direct Links'}
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'सेवा खोज्नुहोस् (उदा: IPO, PAN, ब्लूबुक, राहदानी, कर, राशिफल)...'
                : 'Search any service (e.g. IPO, PAN, Bluebook, Passport, Tax, Rashifal)...'
            }
            className="w-full border border-[var(--color-border)] rounded-[8px] pl-10 pr-16 py-2.5 text-xs font-medium outline-none bg-[var(--color-canvas)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-mark)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-2 py-0.5 rounded-[4px] bg-[var(--color-surface)] border border-[var(--color-border)] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Breadcrumb Navigation when filtered */}
      {(activeCategoryId !== 'all' || searchQuery || selectedSubcategory !== 'all') && (
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-2.5 rounded-[8px] border border-[var(--color-border)]">
          <span
            onClick={() => {
              setActiveCategoryId('all');
              setSelectedSubcategory('all');
              setSearchQuery('');
            }}
            className="hover:text-[var(--color-accent-mark)] cursor-pointer text-[var(--color-text)] font-semibold"
          >
            Services
          </span>
          {activeCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-border)]" />
              <span
                onClick={() => setSelectedSubcategory('all')}
                className="hover:text-[var(--color-accent-mark)] cursor-pointer text-[var(--color-text)] font-semibold"
              >
                {currentLang === 'ne' ? activeCategory.titleNp : activeCategory.title}
              </span>
            </>
          )}
          {selectedSubcategory !== 'all' && activeCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-border)]" />
              <span className="text-[var(--color-accent-mark)] font-semibold">
                {activeCategory.subcategories.find((sc) => sc.id === selectedSubcategory)?.title || selectedSubcategory}
              </span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-border)]" />
              <span className="text-[var(--color-accent-mark)] font-semibold">
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
            className="ml-auto text-xs text-[var(--color-accent-mark)] hover:underline flex items-center gap-1 font-sans cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Parent Category Selector Cards (Shown when not searching) */}
      {!searchQuery && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-mono">
              {currentLang === 'ne' ? 'मुख्य सेवा समूहहरू' : 'Primary Service Categories'}
            </h2>
            {activeCategoryId !== 'all' && (
              <button
                onClick={() => {
                  setActiveCategoryId('all');
                  setSelectedSubcategory('all');
                }}
                className="text-xs text-[var(--color-accent-mark)] hover:underline cursor-pointer"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
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
                  className={`p-3 rounded-[8px] border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent-mark)] text-[var(--color-text)] shadow-xs'
                      : 'surface-card hover:bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${
                        isSelected
                          ? 'bg-[var(--color-accent-mark)] text-[var(--color-accent-ink)]'
                          : 'bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-accent-mark)]'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {count}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs leading-snug line-clamp-1 text-[var(--color-text)]">
                      {currentLang === 'ne' ? cat.titleNp : cat.title}
                    </h3>
                  </div>

                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
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
        <div className="p-3 rounded-[8px] surface-card space-y-2">
          <div className="text-[11px] font-mono font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {currentLang === 'ne' ? `${activeCategory.titleNp} का उप-समूहहरू` : `Subcategories in ${activeCategory.title}`}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent-mark)] text-[var(--color-accent-mark)] font-semibold'
                  : 'bg-[var(--color-canvas)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              All Subcategories
            </button>
            {activeCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-2.5 py-1 rounded-[6px] text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  selectedSubcategory === sub.id
                    ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent-mark)] text-[var(--color-accent-mark)] font-semibold'
                    : 'bg-[var(--color-canvas)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
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
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
            <Clock className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span>{currentLang === 'ne' ? 'हालसालै प्रयोग गरिएका सेवाहरू' : 'Recently Used Services'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {recentServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="p-2.5 rounded-[8px] surface-card hover:bg-[var(--color-surface-hover)] text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate mr-1.5">
                  <div className="text-xs font-semibold truncate text-[var(--color-text)]">
                    {currentLang === 'ne' ? service.titleNp : service.title}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase">
                    #{service.number < 10 ? `0${service.number}` : service.number}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">
            <span>
              {filteredServices.length} {currentLang === 'ne' ? 'सेवाहरू फेला परे' : 'Services Displayed'}
            </span>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-8 rounded-[12px] surface-card text-center space-y-3">
            <Compass className="w-8 h-8 text-[var(--color-text-muted)] mx-auto" />
            <p className="text-sm text-[var(--color-text)] font-medium">
              {currentLang === 'ne' ? 'कुनै पनि सेवा भेटिएन' : 'No matching services found'}
            </p>
            <button
              onClick={() => {
                setActiveCategoryId('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] font-medium text-xs cursor-pointer shadow-xs"
            >
              {currentLang === 'ne' ? 'सबै नागरिक सेवाहरू देखाउनुहोस्' : 'Show All Civic Services'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="surface-card group relative p-4 rounded-[10px] hover:bg-[var(--color-surface-hover)] cursor-pointer flex flex-col justify-between space-y-2.5 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded-[4px] border text-[var(--color-accent-mark)] bg-[var(--color-accent-muted)] border-[var(--color-accent-mark)]/30">
                      #{service.number < 10 ? `0${service.number}` : service.number}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {service.isExternal && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border border-[var(--color-border)] flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" />
                          Gov Portal
                        </span>
                      )}
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] border bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border)] capitalize">
                        {service.parentCategory}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-xs sm:text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors">
                    {currentLang === 'ne' ? service.titleNp : service.title}
                  </h3>

                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1 line-clamp-2">
                    {currentLang === 'ne' ? service.descriptionNp : service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--color-divider)] flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)]">
                  <span className="text-[11px] font-mono flex items-center gap-1">
                    {service.isExternal ? 'Open Official External Site' : 'Launch Module'}
                  </span>
                  {service.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-accent-mark)] group-hover:translate-x-0.5 transition-all" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-mark)] group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Government Disclaimer Box */}
      <div className="p-3.5 rounded-[8px] surface-card text-xs text-[var(--color-text-secondary)] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[var(--color-accent-mark)] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[var(--color-text)]">SAARTHI Navigation Standard: </span>
          {currentLang === 'ne'
            ? 'SAARTHI एक निजी नागरिक प्रविधि प्लेटफर्म हो। सरकारी पोर्टल लिङ्कहरू आधिकारिक बाह्य वेबसाइटमा जान्छन्।'
            : 'SAARTHI is an independent civic portal. Official government service cards route directly to official public department portals with full transparency.'}
        </div>
      </div>
    </div>
  );
});
