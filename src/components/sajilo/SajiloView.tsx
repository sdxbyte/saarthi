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
      {/* 1. Refined Obsidian Bento Header Banner */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-xl space-y-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {currentLang === 'ne' ? 'सजिलो दैनिक आवश्यकताहरू' : 'SAJILO DAILY ESSENTIALS'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                BS 2083 • Powered by SAARTHI & Sajilo Core
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{currentLang === 'ne' ? 'सजिलो (Sajilo)' : 'Sajilo'}</span>
              <span className="text-slate-400 font-normal text-sm sm:text-base">
                — {currentLang === 'ne' ? 'नेपाली दैनिक जीवनका सम्पूर्ण आवश्यकताहरू' : 'Daily Life Essentials'}
              </span>
            </h1>

            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              {currentLang === 'ne'
                ? 'कालिमाटी तरकारी तथा फलफूल, सुनचाँदी, पेट्रोल, नेप्से, अनलाइन रेडियो, व्यक्तिगत किपर रिमाइन्डर, जग्गा क्षेत्रफल र आपतकालीन सेवाहरू एकै ठाउँमा।'
                : 'Kalimati daily produce wholesale, Gold & Fuel rates, NEPSE stocks, Live FM radio, offline Keeper reminders, Land area calculators, and emergency hotlines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Toggle Devanagari numerals */}
            <button
              onClick={onToggleDevanagariNumerals}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Devanagari (१२३) or English (123) numbers"
            >
              <span>{devanagariNumerals ? 'अंक: १२३' : 'Digits: 123'}</span>
            </button>

            {/* Quick Menu-Bar Popover Button */}
            {onOpenTrayModal && (
              <button
                onClick={onOpenTrayModal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="Launch macOS / Windows style menu-bar tray popover"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'ट्रे पपओभर (Quick Tray)' : 'Quick Tray'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Segmented Bar with ai2.design Spring Glider */}
        <div className="flex items-center gap-1 overflow-x-auto p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="sajiloTabGlider"
                    className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-lg shadow-xs"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-1.5 transition-colors ${
                    isActive ? 'text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ne' ? tab.labelNp : tab.labelEn}</span>
                </span>
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
