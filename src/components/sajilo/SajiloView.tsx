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
    <div className="max-w-7xl mx-auto space-y-4 pb-16">
      {/* 1. Refined Header Banner */}
      <div className="surface-card p-4 sm:p-5 rounded-[12px] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border border-[var(--color-accent-mark)]/30">
                {currentLang === 'ne' ? 'सजिलो दैनिक आवश्यकताहरू' : 'SAJILO DAILY ESSENTIALS'}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                BS 2083 • Powered by SAARTHI & Sajilo Core
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight flex items-center gap-2">
              <span>{currentLang === 'ne' ? 'सजिलो (Sajilo)' : 'Sajilo'}</span>
              <span className="text-[var(--color-text-secondary)] font-normal text-sm sm:text-base">
                — {currentLang === 'ne' ? 'नेपाली दैनिक जीवनका सम्पूर्ण आवश्यकताहरू' : 'Daily Life Essentials'}
              </span>
            </h1>

            <p className="text-xs text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              {currentLang === 'ne'
                ? 'कालिमाटी तरकारी तथा फलफूल, सुनचाँदी, पेट्रोल, नेप्से, अनलाइन रेडियो, व्यक्तिगत किपर रिमाइन्डर, जग्गा क्षेत्रफल र आपतकालीन सेवाहरू एकै ठाउँमा।'
                : 'Kalimati daily produce wholesale, Gold & Fuel rates, NEPSE stocks, Live FM radio, offline Keeper reminders, Land area calculators, and emergency hotlines.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Toggle Devanagari numerals */}
            <button
              onClick={onToggleDevanagariNumerals}
              className="px-2.5 py-1.5 rounded-[6px] bg-[var(--color-canvas)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Devanagari (१२३) or English (123) numbers"
            >
              <span>{devanagariNumerals ? 'अंक: १२३' : 'Digits: 123'}</span>
            </button>

            {/* Quick Menu-Bar Popover Button */}
            {onOpenTrayModal && (
              <button
                onClick={onOpenTrayModal}
                className="px-3 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Launch macOS / Windows style menu-bar tray popover"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'ट्रे पपओभर (Quick Tray)' : 'Quick Tray'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 border-t border-[var(--color-divider)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]/60'
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
