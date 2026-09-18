import React, { useState } from 'react';
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
  Coins,
  Layers,
  ExternalLink,
  ChevronRight,
  Maximize2,
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
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface SajiloViewProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
  onToggleDevanagariNumerals: () => void;
  onOpenTrayModal?: () => void;
}

export const SajiloView: React.FC<SajiloViewProps> = ({
  currentLang,
  devanagariNumerals,
  onToggleDevanagariNumerals,
  onOpenTrayModal,
}) => {
  const [activeTab, setActiveTab] = useState<SajiloTab>('today');
  const { timeState } = useGlobalTime();

  const tabs: { id: SajiloTab; labelEn: string; labelNp: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', labelEn: 'Today', labelNp: 'आज', icon: LayoutDashboard },
    { id: 'bazar', labelEn: 'Bazar', labelNp: 'बजार', icon: ShoppingBag },
    { id: 'calendar', labelEn: 'Calendar', labelNp: 'पात्रो', icon: Calendar },
    { id: 'keeper', labelEn: 'Keeper', labelNp: 'किपर', icon: Bell },
    { id: 'news', labelEn: 'News', labelNp: 'समाचार', icon: Newspaper },
    { id: 'radio', labelEn: 'Radio', labelNp: 'रेडियो', icon: Radio },
    { id: 'tools', labelEn: 'Tools', labelNp: 'औजार', icon: Compass },
    { id: 'rashifal', labelEn: 'Rashifal', labelNp: 'राशिफल', icon: Sparkles },
    { id: 'weather', labelEn: 'Weather & AQI', labelNp: 'मौसम', icon: CloudSun },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14161b] border border-[#262a31] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                {currentLang === 'ne' ? 'सजिलो दैनिक आवश्यकताहरू' : 'SAJILO DAILY ESSENTIALS'}
              </span>
              <span className="text-xs font-mono text-[#8b909b]">
                BS 2083 • Powered by SAARTHI & Sajilo Core
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#edeef0] tracking-tight flex items-center gap-2">
              <span>{currentLang === 'ne' ? 'सजिलो (Sajilo)' : 'Sajilo'}</span>
              <span className="text-[#8b909b] font-normal text-lg sm:text-xl">
                — {currentLang === 'ne' ? 'नेपाली दैनिक जीवनका सम्पूर्ण आवश्यकताहरू' : 'Nepali Daily Essentials'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#8b909b] max-w-3xl">
              {currentLang === 'ne'
                ? 'कालिमाटी तरकारी तथा फलफूल, सुनचाँदी, पेट्रोल, नेप्से, अनलाइन रेडियो, व्यक्तिगत किपर रिमाइन्डर, जग्गा क्षेत्रफल र आपतकालीन सेवाहरू एकै ठाउँमा।'
                : 'Kalimati daily produce wholesale, Gold & Fuel rates, NEPSE stocks, Live FM radio, offline Keeper reminders, Land area calculators, and emergency hotlines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Toggle Devanagari numerals */}
            <button
              onClick={onToggleDevanagariNumerals}
              className="px-3 py-2 rounded-xl bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] flex items-center gap-1.5 transition-colors"
              title="Toggle Devanagari (१२३) or English (123) numbers"
            >
              <span>{devanagariNumerals ? 'अंक: १२३' : 'Digits: 123'}</span>
            </button>

            {/* Quick Menu-Bar Popover Button */}
            {onOpenTrayModal && (
              <button
                onClick={onOpenTrayModal}
                className="px-3.5 py-2 rounded-xl bg-[#00e599] hover:bg-[#00c985] text-[#0a0b0d] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="Launch macOS / Windows style menu-bar tray popover"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'ट्रे पपओभर (Quick Tray)' : 'Quick Tray Popover'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 mt-4 border-t border-[#262a31]/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00e599] text-[#0a0b0d] shadow-lg shadow-[#00e599]/20'
                    : 'bg-[#1a1d24] text-[#8b909b] hover:text-[#edeef0] hover:bg-[#1f232b] border border-[#262a31]'
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
        {activeTab === 'bazar' && (
          <SajiloBazarTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
        )}
        {activeTab === 'calendar' && (
          <SajiloCalendarTab currentLang={currentLang} devanagariNumerals={devanagariNumerals} />
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
