import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, FileText, ArrowRight, CornerDownLeft, Star, ChevronRight, Layers } from 'lucide-react';
import { searchServices, getCategoryById } from '../../services/serviceRegistry';
import { MOCK_STOCKS } from '../../data/nepseData';
import { MOCK_GOV_SERVICES } from '../../data/governmentData';
import { ServiceDefinition } from '../../types/serviceRegistry';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
  currentLang: 'en' | 'ne';
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  currentLang,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Bluebook Tax',
    'NABIL Stock Price',
    'Income Tax Calculator 2083',
    'e-Passport Form',
    'IPO Allotment Result',
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSelect = (moduleId: string, term?: string) => {
    if (term && !recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
    onSelectModule(moduleId);
    onClose();
  };

  const cleanQuery = query.trim().toLowerCase();

  const searchResults: ServiceDefinition[] = searchServices(query).filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.parentCategory === selectedCategory;
  });

  const matchingStocks = cleanQuery
    ? MOCK_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(cleanQuery) ||
          s.companyName.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingGov = cleanQuery
    ? MOCK_GOV_SERVICES.filter(
        (g) =>
          g.title.toLowerCase().includes(cleanQuery) ||
          g.titleNp.includes(cleanQuery)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-12 sm:pt-20">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'सेयर, कर, ब्लुबुक, राहदानी वा १२ एकीकृत नागरिक सेवा हबहरू खोज्नुहोस्...'
                : 'Search unified services, stocks, taxes, bluebook, laws...'
            }
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-md bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
          >
            Esc
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
          {[
            { id: 'all', label: currentLang === 'ne' ? 'सबै' : 'All Categories' },
            { id: 'finance', label: currentLang === 'ne' ? 'वित्त तथा सेयर' : 'Finance & Money' },
            { id: 'documents', label: currentLang === 'ne' ? 'कागजात' : 'Documents & Records' },
            { id: 'civic', label: currentLang === 'ne' ? 'सरकारी सेवा' : 'Civic Services' },
            { id: 'news', label: currentLang === 'ne' ? 'समाचार' : 'News & Updates' },
            { id: 'tools', label: currentLang === 'ne' ? 'पात्रो र औजार' : 'Tools & Utilities' },
            { id: 'account', label: currentLang === 'ne' ? 'खाता' : 'Account & Support' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          {/* Quick Recent Searches if Query Empty */}
          {!cleanQuery && recentSearches.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLang === 'ne' ? 'हालै खोजिएका' : 'Recent Searches'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Stock Hits */}
          {matchingStocks.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang === 'ne' ? 'सेयर बजार परिणाम' : 'NEPSE Stocks'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingStocks.slice(0, 4).map((s) => (
                  <div
                    key={s.symbol}
                    onClick={() => handleSearchSelect('nepse-market', s.symbol)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between transition-all hover:border-red-500/50"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{s.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {s.companyName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white text-xs">Rs. {s.ltp}</div>
                      <div
                        className={`text-[10px] font-bold ${
                          s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {s.change >= 0 ? '+' : ''}
                        {s.pChange}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Gov Services Hits */}
          {matchingGov.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentLang === 'ne' ? 'सरकारी सेवाहरू' : 'Gov Services'}</span>
              </div>
              <div className="space-y-1.5">
                {matchingGov.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => handleSearchSelect('gov-service-directory', g.title)}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-medium text-slate-200 text-xs sm:text-sm">
                        {currentLang === 'ne' ? g.titleNp : g.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{g.department}</div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Results with Breadcrumbs */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>
                {currentLang === 'ne' ? 'नागरिक सेवा परिणाम' : 'Services Catalogue'} ({searchResults.length})
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                {currentLang === 'ne'
                  ? 'कुनै सेवा भेटिएन। खोज शब्द परिवर्तन गर्नुहोस्।'
                  : 'No services found matching your query.'}
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((service) => {
                  const parentCat = getCategoryById(service.parentCategory);
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSearchSelect(service.id, service.title)}
                      className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-red-500/50 cursor-pointer flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                          #{service.number < 10 ? `0${service.number}` : service.number}
                        </div>
                        <div>
                          {/* Breadcrumb path */}
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <span>{parentCat ? (currentLang === 'ne' ? parentCat.titleNp : parentCat.title) : service.parentCategory}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                            <span className="text-slate-300 font-bold capitalize">{service.subcategory}</span>
                          </div>

                          <div className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">
                            {currentLang === 'ne' ? service.titleNp : service.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {currentLang === 'ne' ? service.descriptionNp : service.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {service.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-600/20 text-red-400 border border-red-500/30">
                            {service.badge}
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>
            {currentLang === 'ne' ? 'सारथी नेपाल - ४५ एकीकृत नागरिक सेवाहरू' : 'SAARTHI Nepal - Unified Service Directory'}
          </span>
          <span className="text-[11px] text-slate-500">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
