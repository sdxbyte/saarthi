import React, { useState, useMemo } from 'react';
import { ArrowRight, Search, LayoutGrid } from 'lucide-react';
import { ModuleItem, ModuleCategory } from '../../types';
import { ALL_45_MODULES } from '../../data/modulesList';

interface ModuleGridProps {
  currentLang: 'en' | 'ne';
  onSelectModule: (moduleId: string) => void;
  theme?: 'dark' | 'light';
}

export const ModuleGrid: React.FC<ModuleGridProps> = React.memo(({ currentLang, onSelectModule, theme = 'dark' }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const categories = useMemo<{ labelEn: string; labelNp: string; value: ModuleCategory | 'All' }[]>(() => [
    { labelEn: 'All Services', labelNp: 'सबै सेवाहरू', value: 'All' },
    { labelEn: 'Finance & Investment', labelNp: 'वित्त तथा सेयर', value: 'finance' },
    { labelEn: 'Government & Civic', labelNp: 'सरकारी तथा कानुन', value: 'government' },
    { labelEn: 'Identity & Documents', labelNp: 'नागरिकता र कागजात', value: 'documents' },
    { labelEn: 'Employment & Skills', labelNp: 'रोजगार र लोक सेवा', value: 'employment' },
    { labelEn: 'Banking & Utilities', labelNp: 'बैंक र उपयोगिता', value: 'banking' },
    { labelEn: 'Daily Utilities', labelNp: 'दैनिक सेवा', value: 'utilities' },
    { labelEn: 'Community & Culture', labelNp: 'पात्रो र संस्कृति', value: 'community' },
  ], []);

  const filteredModules = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return ALL_45_MODULES.filter((mod) => {
      const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        mod.title.toLowerCase().includes(query) ||
        mod.titleNp.includes(query) ||
        mod.description.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pt-2">
      {/* Section Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
              {currentLang === 'ne' ? 'नागरिक सेवा मञ्च' : 'Civic Service Directory'}
            </h2>
            <p className="text-xs text-slate-400">
              {currentLang === 'ne'
                ? 'सरकारी सेवा, सेयर बजार, कर र वित्तीय औजारहरू'
                : 'Access public services, financial tools, tax calculators, and registries'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-auto">
          {filteredModules.length} {currentLang === 'ne' ? 'सेवाहरू उपलब्ध' : 'Modules Showing'}
        </span>
      </div>

      {/* Search & Category Filter Pills Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'ne'
                  ? 'नागरिक सेवाहरू खोज्नुहोस् (उदा: नेप्से, कर, ब्लुबुक, लोक सेवा)...'
                  : 'Search civic services (e.g. NEPSE, Tax, Bluebook, Passport)...'
              }
              className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 shadow-inner'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-md shadow-red-900/30'
                  : isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {currentLang === 'ne' ? cat.labelNp : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex flex-col justify-between space-y-3 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800/90 hover:border-red-500/60 hover:bg-slate-800/70 text-white shadow-md hover:shadow-xl hover:shadow-red-950/20'
                : 'bg-white border-slate-200 hover:border-red-500/80 hover:bg-slate-50/80 text-slate-900 shadow-sm hover:shadow-md hover:shadow-red-900/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-red-400 bg-red-950/60 border-red-800/60'
                    : 'text-red-600 bg-red-50 border-red-200'
                }`}>
                  #{module.number < 10 ? `0${module.number}` : module.number}
                </span>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700/80'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {module.category}
                </span>
              </div>

              <h3 className={`font-display font-bold text-sm transition-colors ${
                isDark ? 'text-white group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
              }`}>
                {currentLang === 'ne' ? module.titleNp : module.title}
              </h3>

              <p className={`text-xs leading-relaxed mt-1 line-clamp-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {currentLang === 'ne' ? module.descriptionNp : module.description}
              </p>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-xs font-medium ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span className="text-[11px] font-mono">Open Module</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

