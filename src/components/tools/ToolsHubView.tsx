import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Car,
  Radio,
  Lock,
  Globe,
  Film,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CalendarBsAdView } from '../utilities/CalendarBsAdView';
import { BluebookTaxView } from '../documents/BluebookTaxView';
import { SajiloView } from '../sajilo/SajiloView';
import { DocumentVaultView } from '../documents/DocumentVaultView';
import { PublicApisHubView } from '../public-apis/PublicApisHubView';
import { AllSiteHubView } from '../sitehub/AllSiteHubView';
import { Osint4AllView } from '../osint/Osint4AllView';
import { UserProfile } from '../../types';

interface ToolsHubViewProps {
  currentLang: 'en' | 'ne';
  activeSubSection?: string;
  initialSection?: string;
  onNavigateTab?: (tab: string) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  devanagariNumerals?: boolean;
  onToggleDevanagariNumerals?: () => void;
  onOpenTrayModal?: () => void;
  onOpenSajiloTray?: () => void;
}

type ToolTab = 'overview' | 'calendar' | 'bluebook' | 'sajilo' | 'vault' | 'public-apis' | 'sitehub' | 'osint4all';

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({
  currentLang,
  activeSubSection,
  initialSection,
  onNavigateTab,
  userProfile,
  onOpenAuthModal,
  devanagariNumerals = false,
  onToggleDevanagariNumerals,
  onOpenTrayModal,
  onOpenSajiloTray,
}) => {
  const effectiveTrayModal = onOpenTrayModal || onOpenSajiloTray;
  const [currentTab, setCurrentTab] = useState<ToolTab>(() => {
    const raw = initialSection || activeSubSection;
    if (raw && ['calendar', 'bluebook', 'sajilo', 'vault', 'public-apis', 'sitehub', 'apis', 'osint4all'].includes(raw)) {
      return (raw === 'apis' ? 'public-apis' : raw) as ToolTab;
    }
    return 'overview';
  });

  useEffect(() => {
    const raw = initialSection || activeSubSection;
    if (raw && ['calendar', 'bluebook', 'sajilo', 'vault', 'public-apis', 'sitehub', 'apis', 'osint4all'].includes(raw)) {
      setCurrentTab((raw === 'apis' ? 'public-apis' : raw) as ToolTab);
    }
  }, [initialSection, activeSubSection]);

  const handleTabChange = (tab: ToolTab) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      onNavigateTab('tools');
    } else {
      onNavigateTab(tab);
    }
  };

  const toolTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'calendar', label: 'Calendar & Converter' },
    { id: 'bluebook', label: 'Bluebook Vehicle Tax' },
    { id: 'sajilo', label: 'Sajilo Daily' },
    { id: 'vault', label: 'Document Vault' },
    { id: 'public-apis', label: 'Public APIs' },
    { id: 'sitehub', label: 'Media Directory' },
    { id: 'osint4all', label: 'OSINT4ALL' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8 animate-fadeIn font-sans">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono block">
            Offline-First Utilities
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-sans">
            {currentLang === 'ne' ? 'दैनिक औजार तथा उपयोगिता' : 'Tools & Utilities'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'नेपाली क्यालेन्डर, सवारी कर क्याल्कुलेटर, सुरक्षित डिजिटल भल्ट, प्रत्यक्ष एफएम रेडियो र दैनिक बजार दर।'
              : 'Fast, client-side digital utilities designed for daily life, transport compliance, and productivity in Nepal.'}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {toolTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as ToolTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Hub Screen */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tool 1: Calendar & Converter */}
            <div
              onClick={() => handleTabChange('calendar')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>01. Calendar & Tithi</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                Bikram Sambat Calendar & Date Converter
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Dual AD/BS date conversion, official government public holidays, daily Tithi, and Panchanga timings.
              </p>
            </div>

            {/* Tool 2: Bluebook Vehicle Tax */}
            <div
              onClick={() => handleTabChange('bluebook')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>02. Transport & License</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                Bluebook Vehicle Tax & DoTM Trial
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Provincial road tax rates for two-wheelers and cars, penalty formulas, renewal deadlines, and 70-mark trial guides.
              </p>
            </div>

            {/* Tool 3: Sajilo Essentials */}
            <div
              onClick={() => handleTabChange('sajilo')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>03. Daily Living</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                Sajilo Essentials (Kalimati, Radio & Notes)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Daily Kalimati wholesale vegetable & fruit rates, streaming Nepali FM stations, and scratchpad note keeper.
              </p>
            </div>

            {/* Tool 4: Document Vault */}
            <div
              onClick={() => handleTabChange('vault')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>04. Private Security</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                Encrypted Citizen Document Vault
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                AES-256 client-side encrypted storage for Citizenship, e-Passport, PAN, and certificates. 100% private to your device.
              </p>
            </div>

            {/* Tool 5: Public APIs Hub */}
            <div
              onClick={() => handleTabChange('public-apis')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>05. Open Developer Tools</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                Public APIs & Sandbox Workbench
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Explore verified public APIs, test REST endpoints with CORS bypass, and utilize live micro utilities.
              </p>
            </div>

            {/* Tool 6: Media Directory */}
            <div
              onClick={() => handleTabChange('sitehub')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>06. Web Directory</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                AllSiteHub Media & Resources Directory
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Curated index of streaming platforms, anime, sports broadcasts, and open web repositories inspired by allsitehub.site.
              </p>
            </div>

            {/* Tool 7: OSINT4ALL Directory */}
            <div
              onClick={() => handleTabChange('osint4all')}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>07. OSINT & Research</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors">Launch →</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                OSINT4ALL Intelligence Directory
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Open-source intelligence toolkit modeled after osint4all.com: DNS, Shodan, breach lookup, geolocation, and verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tool Views */}
      {currentTab === 'calendar' && <CalendarBsAdView currentLang={currentLang} />}
      {currentTab === 'bluebook' && <BluebookTaxView currentLang={currentLang} />}
      {currentTab === 'sajilo' && (
        <SajiloView
          currentLang={currentLang}
          devanagariNumerals={devanagariNumerals}
          onToggleDevanagariNumerals={onToggleDevanagariNumerals}
          onOpenTrayModal={effectiveTrayModal}
        />
      )}
      {currentTab === 'vault' && (
        <DocumentVaultView
          currentLang={currentLang}
          userProfile={userProfile}
          onOpenAuthModal={onOpenAuthModal}
        />
      )}
      {currentTab === 'public-apis' && <PublicApisHubView currentLang={currentLang} />}
      {currentTab === 'sitehub' && <AllSiteHubView currentLang={currentLang} />}
      {currentTab === 'osint4all' && <Osint4AllView currentLang={currentLang} />}
    </div>
  );
};
