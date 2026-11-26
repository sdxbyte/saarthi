import React, { useEffect, useState } from 'react';
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

type ToolTab =
  | 'overview'
  | 'calendar'
  | 'bluebook'
  | 'sajilo'
  | 'vault'
  | 'public-apis'
  | 'sitehub'
  | 'osint4all';

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
  const isNe = currentLang === 'ne';
  const effectiveTrayModal = onOpenTrayModal || onOpenSajiloTray;
  const [currentTab, setCurrentTab] = useState<ToolTab>(() => {
    const raw = initialSection || activeSubSection;
    if (
      raw &&
      ['calendar', 'bluebook', 'sajilo', 'vault', 'public-apis', 'sitehub', 'apis', 'osint4all'].includes(
        raw
      )
    ) {
      return (raw === 'apis' ? 'public-apis' : raw) as ToolTab;
    }
    return 'overview';
  });

  useEffect(() => {
    const raw = initialSection || activeSubSection;
    if (
      raw &&
      ['calendar', 'bluebook', 'sajilo', 'vault', 'public-apis', 'sitehub', 'apis', 'osint4all'].includes(
        raw
      )
    ) {
      setCurrentTab((raw === 'apis' ? 'public-apis' : raw) as ToolTab);
    }
  }, [initialSection, activeSubSection]);

  const handleTabChange = (tab: ToolTab) => {
    setCurrentTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab === 'overview' ? 'tools' : tab);
    }
  };

  const toolTabs = [
    { id: 'overview', label: isNe ? 'सारांश' : 'Overview' },
    { id: 'calendar', label: isNe ? 'पात्रो र मिति रूपान्तरण' : 'Calendar & Converter' },
    { id: 'bluebook', label: isNe ? 'ब्लुबुक र सवारी कर' : 'Bluebook Vehicle Tax' },
    { id: 'sajilo', label: isNe ? 'सजिलो दैनिक' : 'Sajilo Daily' },
    { id: 'vault', label: isNe ? 'डिजिटल भल्ट' : 'Document Vault' },
    { id: 'public-apis', label: isNe ? 'पब्लिक ए.पी.आई.' : 'Public APIs' },
    { id: 'sitehub', label: isNe ? 'मिडिया निर्देशिका' : 'Media Directory' },
    { id: 'osint4all', label: 'OSINT4ALL' },
  ] as const;

  const toolCards: Array<{
    tab: ToolTab;
    num: string;
    category: string;
    title: string;
    desc: string;
  }> = [
    {
      tab: 'calendar',
      num: '01',
      category: isNe ? 'पात्रो र तिथि' : 'Calendar & Tithi',
      title: isNe ? 'विक्रम संवत् पात्रो र मिति रूपान्तरण' : 'Bikram Sambat Calendar & Date Converter',
      desc: isNe
        ? '१३६ वर्षको वि.सं./ई.सं. मिति रूपान्तरण, सार्वजनिक बिदा, तिथि र पञ्चाङ्ग।'
        : 'Dual AD/BS date conversion (1970–2105 BS), official government public holidays, daily Tithi, and Panchanga.',
    },
    {
      tab: 'bluebook',
      num: '02',
      category: isNe ? 'यातायात र लाइसेन्स' : 'Transport & License',
      title: isNe ? 'ब्लुबुक सवारी कर र यातायात गाइड' : 'Bluebook Vehicle Tax & DoTM Trial',
      desc: isNe
        ? 'प्रदेश अनुसार दुई पाङ्ग्रे र चार पाङ्ग्रे सवारी कर, जरिवाना हिसाब र ७०-अङ्क ट्रायल गाइड।'
        : 'Provincial road tax rates for two-wheelers and cars, penalty formulas, renewal deadlines, and 70-mark trial guides.',
    },
    {
      tab: 'sajilo',
      num: '03',
      category: isNe ? 'दैनिक जीवन' : 'Daily Living',
      title: isNe ? 'सजिलो दैनिक (कालिमाटी, रेडियो र नोट्स)' : 'Sajilo Essentials (Kalimati, Radio & Notes)',
      desc: isNe
        ? 'कालिमाटी तरकारी तथा फलफूल दर, नेपाली एफएम रेडियो र सिङ्क हुने रिमाइन्डर।'
        : 'Kalimati wholesale produce rates, streaming Nepali FM stations, and cross-device synced reminders.',
    },
    {
      tab: 'vault',
      num: '04',
      category: isNe ? 'व्यक्तिगत भल्ट' : 'Cloud & Offline Vault',
      title: isNe ? 'नागरिक डिजिटल कागजात भल्ट' : 'Citizen Digital Document Vault',
      desc: isNe
        ? 'नागरिकता, राहदानी, प्यान र लाइसेन्स विवरण अफलाइन IndexedDB र क्लाउड सिङ्क सहित।'
        : 'Offline-first IndexedDB and cloud-synced registry for Citizenship, Passport, PAN, and Driving License expiry tracking.',
    },
    {
      tab: 'public-apis',
      num: '05',
      category: isNe ? 'विकासकर्ता औजार' : 'Open Developer Tools',
      title: isNe ? 'पब्लिक ए.पी.आई. र स्यान्डबक्स' : 'Public APIs & Sandbox Workbench',
      desc: isNe
        ? 'सार्वजनिक रेस्ट ए.पी.आई. परीक्षण र खुला स्रोत औजारहरू।'
        : 'Explore verified public APIs, inspect JSON endpoints, and use browser utilities.',
    },
    {
      tab: 'sitehub',
      num: '06',
      category: isNe ? 'वेब निर्देशिका' : 'Web Directory',
      title: isNe ? 'मिडिया र स्रोत निर्देशिका' : 'AllSiteHub Media & Resources Directory',
      desc: isNe
        ? 'स्रोत र प्रसारण पोर्टलहरूको व्यवस्थित सूची।'
        : 'Curated index of streaming platforms, broadcasts, and open web repositories.',
    },
    {
      tab: 'osint4all',
      num: '07',
      category: isNe ? 'अनुसन्धान र सुरक्षा' : 'OSINT & Research',
      title: isNe ? 'OSINT4ALL अनुसन्धान निर्देशिका' : 'OSINT4ALL Intelligence Directory',
      desc: isNe
        ? 'डी.एन.एस., प्रमाणीकरण र खुला स्रोत अनुसन्धान उपकरण।'
        : 'Open-source intelligence toolkit across DNS, verification, and public surface lookup.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono font-semibold block">
            {isNe ? 'अफलाइन-प्रथम औजारहरू' : 'Offline-First Utilities'}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0B1F3A] dark:text-white">
            {isNe ? 'दैनिक औजार तथा उपयोगिता' : 'Tools & Utilities'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {isNe
              ? 'नेपाली पात्रो, सवारी कर क्यालकुलेटर, सुरक्षित डिजिटल भल्ट, प्रत्यक्ष एफएम रेडियो र दैनिक औजारहरू।'
              : 'Fast, client-side digital utilities designed for daily life, transport compliance, and personal records in Nepal.'}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {toolTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as ToolTab)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F3A] dark:bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toolCards.map((card) => (
            <button
              key={card.tab}
              type="button"
              onClick={() => handleTabChange(card.tab)}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group text-left space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>
                  {card.num}. {card.category}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {isNe ? 'खोल्नुहोस् →' : 'Launch →'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#0B1F3A] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </button>
          ))}
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
