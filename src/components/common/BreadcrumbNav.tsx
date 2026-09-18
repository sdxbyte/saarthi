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
  sajilo: 'sajilo-essentials',
};

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
}) => {
  if (activeTab === 'dashboard') {
    return (
      <div className="mb-3 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent-mark)] text-[11px] font-semibold">
            <Home className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span>{currentLang === 'ne' ? 'गृह (Home Overview)' : 'Home Overview'}</span>
          </div>
          <span className="text-[var(--color-text-muted)] font-mono text-[10px] hidden sm:inline">
            / {currentLang === 'ne' ? 'नागरिक सेवा प्रणाली' : 'Civic Services Directory'}
          </span>
        </div>
      </div>
    );
  }

  const serviceId = TAB_SERVICE_MAP[activeTab];
  const service = serviceId ? SERVICE_DEFINITIONS[serviceId] : null;
  const category = service ? getCategoryById(service.primaryCategory) : null;

  return (
    <nav className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] overflow-x-auto py-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <ChevronRight className="w-3 h-3 text-[var(--color-border)] shrink-0" />

        {category && (
          <>
            <button
              onClick={() => setActiveTab('services')}
              className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            >
              <Folder className="w-3 h-3 text-[var(--color-accent-mark)]" />
              <span>{currentLang === 'ne' ? category.titleNp : category.title}</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)] shrink-0" />
          </>
        )}

        <span className="font-semibold text-[var(--color-text)] truncate">
          {service ? (currentLang === 'ne' ? service.nameNp : service.name) : activeTab}
        </span>
      </div>

      <button
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-xs font-medium transition-colors cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
        <span>{currentLang === 'ne' ? 'फर्कनुहोस्' : 'Back to Home'}</span>
      </button>
    </nav>
  );
};
