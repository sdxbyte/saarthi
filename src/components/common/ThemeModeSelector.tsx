import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemePreference, useTheme } from '../../context/ThemeContext';
import { useOptionalLanguage } from '../../context/LanguageContext';

interface ThemeModeSelectorProps {
  compact?: boolean;
  className?: string;
}

export const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({
  compact = false,
  className = '',
}) => {
  const { themePreference, resolvedTheme, setThemePreference, toggleTheme } = useTheme();
  const { t } = useOptionalLanguage();

  const modes: Array<{
    id: ThemePreference;
    label: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    { id: 'light', label: t.theme.light, icon: Sun },
    { id: 'dark', label: t.theme.dark, icon: Moon },
    { id: 'system', label: t.theme.system, icon: Monitor },
  ];

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`min-h-[40px] min-w-[40px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0 ${className}`}
        aria-label={resolvedTheme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
        title={`${t.theme.label}: ${themePreference}`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-[#0B1F3A]" />
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t.theme.label}
      className={`grid grid-cols-3 gap-1 p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0B1220] ${className}`}
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = themePreference === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setThemePreference(mode.id)}
            aria-pressed={active}
            className={`min-h-[34px] px-2 py-1.5 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              active
                ? 'bg-white dark:bg-[#102A4C] text-[#0B1F3A] dark:text-white shadow-xs border border-slate-200/80 dark:border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
