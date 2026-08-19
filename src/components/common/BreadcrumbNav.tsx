import React from 'react';
import { Home, ChevronRight, Folder, ArrowLeft, Layers } from 'lucide-react';
import { SERVICE_DEFINITIONS, PRIMARY_CATEGORIES, getCategoryById } from '../../services/serviceRegistry';

interface BreadcrumbNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
}

const TAB_SERVICE_MAP: Record<string, string> = {
  nepse: 'nepse-market',
  tax: 'tax-calculator',
  ird: 'ird-services',
  emi: 'loan-emi-calc',
  receipt: 'receipt-scanner',
  vault: 'secure-vault',
  bluebook: 'bluebook-tax',
  devtrack: 'gov-service-directory',
  loksewa: 'lok-sewa-alerts',
  calendar: 'public-calendar',
  forex: 'forex-converter',
  rashifal: 'rashifal',
  support: 'support-contact',
  donate: 'support-project',
  services: 'central-directory',
  modules: 'central-directory',
  'public-apis': 'public-apis-hub',
  apis: 'public-apis-hub',
};

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
  theme,
}) => {
  const isDark = theme === 'dark';

  if (activeTab === 'dashboard') {
    return (
      <div className="mb-4 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-red-400'
              : 'bg-white border-slate-200 text-red-600 shadow-sm'
          }`}>
            <Home className="w-3.5 h-3.5 text-red-500" />
            <span>{currentLang === 'ne' ? 'गृह (Home Overview)' : 'Home Overview'}</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
            / {currentLang === 'ne' ? 'नागरिक सेवा प्रणाली' : 'Civic Services Directory'}
          </span>
        </div>
      </div>
    );
  }

  const serviceId = TAB_SERVICE_MAP[activeTab] || activeTab;
  const currentService = SERVICE_DEFINITIONS.find((s) => s.id === serviceId);

  let categoryLabel = '';
  let subcategoryLabel = '';
  let itemTitle = '';

  if (currentService) {
    const pCat = getCategoryById(currentService.parentCategory);
    categoryLabel = pCat ? (currentLang === 'ne' ? pCat.titleNp : pCat.title) : currentService.parentCategory;
    subcategoryLabel = currentService.subcategory;
    itemTitle = currentLang === 'ne' ? currentService.titleNp : currentService.title;
  } else {
    categoryLabel = currentLang === 'ne' ? 'नागरिक सेवाहरू' : 'Civic Services';
    itemTitle = activeTab.toUpperCase();
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-4 p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-slate-300 shadow-lg shadow-black/20'
          : 'bg-white border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0 font-medium">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
          title={currentLang === 'ne' ? 'गृहमा फर्किनुहोस्' : 'Back to Home'}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all shrink-0 font-semibold ${
            isDark
              ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-red-500" />
          <span className="hidden sm:inline">{currentLang === 'ne' ? 'गृह' : 'Home'}</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all shrink-0 text-xs font-semibold ${
            isDark
              ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[130px] sm:max-w-none">{categoryLabel}</span>
        </button>

        {subcategoryLabel && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-400 font-mono text-[11px] uppercase shrink-0 hidden md:inline">
              {subcategoryLabel}
            </span>
          </>
        )}

        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-sm truncate shrink-0">
          <span className="truncate max-w-[180px] sm:max-w-[280px]">{itemTitle}</span>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('services')}
        className={`hidden md:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-xl transition-colors shrink-0 ${
          isDark
            ? 'text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-800'
            : 'text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <Layers className="w-3 h-3 text-red-500" />
        <span>{currentLang === 'ne' ? 'एकीकृत नागरिक सेवाहरू' : 'Unified Civic Services'}</span>
      </button>
    </nav>
  );
};
