import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  Bell,
  Newspaper,
  Radio,
  Compass,
  CloudSun,
  LayoutDashboard,
  Maximize2,
  Heart,
  Landmark,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { SajiloTab } from '../../types/sajiloTypes';
import { SajiloTodayTab } from './SajiloTodayTab';
import { SajiloBazarTab } from './SajiloBazarTab';
import { SajiloCalendarTab } from './SajiloCalendarTab';
import { SajiloKeeperTab } from './SajiloKeeperTab';
import { SajiloNewsTab } from './SajiloNewsTab';
import { SajiloRadioTab } from './SajiloRadioTab';
import { SajiloToolsTab } from './SajiloToolsTab';
import { SajiloRashifalTab } from './SajiloRashifalTab';
import { SajiloWeatherTab } from './SajiloWeatherTab';
import { SajiloKundaliTab } from './SajiloKundaliTab';
import { SajiloGotraTab } from './SajiloGotraTab';
import { SajiloSaaitTab } from './SajiloSaaitTab';
import { SajiloStotraTab } from './SajiloStotraTab';
import { SajiloLinksTab } from './SajiloLinksTab';

interface SajiloViewProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
  onToggleDevanagariNumerals: () => void;
  onOpenTrayModal?: () => void;
  initialTab?: SajiloTab;
}

export const SajiloView: React.FC<SajiloViewProps> = ({
  currentLang,
  devanagariNumerals,
  onToggleDevanagariNumerals,
  onOpenTrayModal,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<SajiloTab>(initialTab || 'today');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: { id: SajiloTab; labelEn: string; labelNp: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', labelEn: 'Today', labelNp: 'आज', icon: LayoutDashboard },
    { id: 'links', labelEn: 'Links & Hub', labelNp: 'उपयोगी लिङ्कहरू', icon: ExternalLink },
    { id: 'bazar', labelEn: 'Bazar', labelNp: 'बजार', icon: ShoppingBag },
    { id: 'calendar', labelEn: 'Calendar', labelNp: 'पात्रो', icon: Calendar },
    { id: 'saait', labelEn: 'Shubha Saait', labelNp: 'शुभ साइत', icon: Calendar },
    { id: 'kundali', labelEn: 'Kundali & Milan', labelNp: 'कुण्डली', icon: Compass },
    { id: 'gotra', labelEn: 'Thar & Gotra', labelNp: 'थर र गोत्र', icon: Landmark },
    { id: 'stotra', labelEn: 'Stotra & Puja', labelNp: 'स्तोत्र र पूजा', icon: BookOpen },
    { id: 'rashifal', labelEn: 'Rashifal', labelNp: 'राशिफल', icon: Sparkles },
    { id: 'tools', labelEn: 'Tools', labelNp: 'औजार', icon: Compass },
    { id: 'keeper', labelEn: 'Keeper', labelNp: 'किपर', icon: Bell },
    { id: 'news', labelEn: 'News', labelNp: 'समाचार', icon: Newspaper },
    { id: 'radio', labelEn: 'Radio', labelNp: 'रेडियो', icon: Radio },
    { id: 'weather', labelEn: 'Weather & AQI', labelNp: 'मौसम', icon: CloudSun },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16">
      {/* Header Banner */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {currentLang === 'ne' ? 'सजिलो दैनिक आवश्यकताहरू' : 'SAJILO DAILY ESSENTIALS'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                SAARTHI Civic &amp; Utility Suite
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>{currentLang === 'ne' ? 'सजिलो (Sajilo)' : 'Sajilo'}</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal text-sm sm:text-base">
                — {currentLang === 'ne' ? 'नेपाली दैनिक जीवनका सम्पूर्ण आवश्यकताहरू' : 'Daily Life Essentials'}
              </span>
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {currentLang === 'ne'
                ? 'कालिमाटी तरकारी तथा फलफूल, सुनचाँदी, पेट्रोल, नेप्से, अनलाइन रेडियो, व्यक्तिगत किपर रिमाइन्डर, जग्गा क्षेत्रफल र आपतकालीन सेवाहरू एकै ठाउँमा।'
                : 'Kalimati daily produce wholesale, Gold & Fuel rates, NEPSE stocks, FM radio, offline Keeper reminders, Land area calculators, and emergency hotlines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={onToggleDevanagariNumerals}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-mono text-[#0B1F3A] dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Devanagari (१२३) or English (123) numbers"
            >
              <span>{devanagariNumerals ? 'अंक: १२३' : 'Digits: 123'}</span>
            </button>

            {onOpenTrayModal && (
              <button
                type="button"
                onClick={onOpenTrayModal}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open Quick Tray popover"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'द्रुत ट्रे (Quick Tray)' : 'Quick Tray'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white dark:bg-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? tab.labelNp : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Tab Content Rendering */}
      <div>
        {activeTab === 'today' && (
          <SajiloTodayTab
            currentLang={currentLang}
            onNavigateTab={(tabId) => setActiveTab(tabId as SajiloTab)}
            devanagariNumerals={devanagariNumerals}
          />
        )}
        {activeTab === 'links' && (
          <SajiloLinksTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'bazar' && (
          <SajiloBazarTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'calendar' && (
          <SajiloCalendarTab
            currentLang={currentLang}
            devanagariNumerals={devanagariNumerals}
            onNavigateToSaait={() => setActiveTab('saait')}
            onNavigateToKundali={() => setActiveTab('kundali')}
          />
        )}
        {activeTab === 'saait' && (
          <SajiloSaaitTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'kundali' && (
          <SajiloKundaliTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'gotra' && (
          <SajiloGotraTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'stotra' && (
          <SajiloStotraTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'keeper' && (
          <SajiloKeeperTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'news' && (
          <SajiloNewsTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'radio' && (
          <SajiloRadioTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'tools' && (
          <SajiloToolsTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'rashifal' && (
          <SajiloRashifalTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'weather' && (
          <SajiloWeatherTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
      </div>
    </div>
  );
};
