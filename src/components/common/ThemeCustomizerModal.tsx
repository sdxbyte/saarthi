import React from 'react';
import { X, Check, Palette, Moon, Sun, Sparkles, Monitor } from 'lucide-react';

export type ThemeMode = 'dark' | 'light';
export type ThemePreset = 'crimson' | 'emerald' | 'sapphire' | 'pearl' | 'obsidian';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
  currentPreset: ThemePreset;
  onSelectPreset: (preset: ThemePreset) => void;
  currentLang: 'en' | 'ne';
}

interface ThemeOption {
  id: ThemePreset;
  nameEn: string;
  nameNe: string;
  descEn: string;
  descNe: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
    border: string;
  };
  recommendedMode: ThemeMode;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'crimson',
    nameEn: 'National Crimson & Gold',
    nameNe: 'राष्ट्रिय रातो तथा सुनौलो',
    descEn: 'Official Nepal citizen & government platform theme with rich crimson and gold accents.',
    descNe: 'नेपाल सरकार नागरिक पोर्टलको आधिकारिक रातो र सुनौलो थिम।',
    colors: {
      bg: '#0F172A',
      card: '#1E293B',
      accent: '#DC2626',
      border: '#EF4444',
    },
    recommendedMode: 'dark',
  },
  {
    id: 'emerald',
    nameEn: 'Emerald FinTech & Banking',
    nameNe: 'एमराल्ड फिनटेक तथा बैंकिङ',
    descEn: 'Modern banking and stock market aesthetic with vibrant mint green and gold highlights.',
    descNe: 'नेप्से सेयर र बैंकिङको लागि हरियो र सुनौलो आधुनिक फिनटेक शैली।',
    colors: {
      bg: '#022C22',
      card: '#064E3B',
      accent: '#10B981',
      border: '#34D399',
    },
    recommendedMode: 'dark',
  },
  {
    id: 'sapphire',
    nameEn: 'Royal Sapphire & Navy',
    nameNe: 'रॉयल नीलो तथा नेभी',
    descEn: 'Executive deep royal blue theme inspired by modern digital government and tech apps.',
    descNe: 'डिजिटल सुशासनको गहिरो शाही नीलो र आधुनिक प्रविधि थिम।',
    colors: {
      bg: '#0B132B',
      card: '#1C2541',
      accent: '#3B82F6',
      border: '#60A5FA',
    },
    recommendedMode: 'dark',
  },
  {
    id: 'pearl',
    nameEn: 'Eye-Care Slate Paper (Soft Light)',
    nameNe: 'आँखा-मैत्री मखमली उज्यालो (सफ्ट लाइट)',
    descEn: 'Muted slate paper canvas calibrated for eye comfort with zero glare and high contrast typography.',
    descNe: 'आँखालाई नबिझाउने, उज्यालो प्रकाशको चमक घटाइएको शान्त र स्पष्ट लाइट मोड।',
    colors: {
      bg: '#E9EDF2',
      card: '#F7F9FC',
      accent: '#047857',
      border: '#BAC6D5',
    },
    recommendedMode: 'light',
  },
  {
    id: 'obsidian',
    nameEn: 'Midnight Obsidian OLED',
    nameNe: 'मिडनाइट अक्सिडियन (OLED डार्क)',
    descEn: 'Pure dark aesthetic with glowing neon accents and high contrast elements.',
    descNe: 'गहिरो कालो क्यानभास र चम्किलो रङको अत्याधुनिक डार्क मोड।',
    colors: {
      bg: '#030712',
      card: '#111827',
      accent: '#8B5CF6',
      border: '#A78BFA',
    },
    recommendedMode: 'dark',
  },
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onToggleTheme,
  currentPreset,
  onSelectPreset,
  currentLang,
}) => {
  if (!isOpen) return null;

  const isDark = currentTheme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white shadow-red-950/20'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg leading-tight">
                {currentLang === 'ne' ? 'थिम र रङ अनुकूलन' : 'Theme & Palette Customizer'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'ne'
                  ? 'तपाईंको रोजाइ अनुसार एपको रङ र लाइट/डार्क मोड रोज्नुहोस्'
                  : 'Customize display appearance and accent color palettes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Mode Switcher (Dark vs Light) */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
            {currentLang === 'ne' ? '१. डिस्प्ले मोड (Light / Dark)' : '1. Appearance Mode'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onToggleTheme('light')}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all ${
                currentTheme === 'light'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'ne' ? 'लाइट मोड (उज्यालो)' : 'Crisp Light Mode'}</span>
            </button>

            <button
              onClick={() => onToggleTheme('dark')}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all ${
                currentTheme === 'dark'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md ring-2 ring-red-500/30'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>{currentLang === 'ne' ? 'डार्क मोड (अध्यारो)' : 'Sovereign Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Color Palette Presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
            {currentLang === 'ne' ? '२. रङको शैली र थिम (Palettes)' : '2. Accent Color Palette'}
          </label>

          <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = currentPreset === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onSelectPreset(opt.id);
                    if (opt.recommendedMode !== currentTheme) {
                      onToggleTheme(opt.recommendedMode);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-blue-950/40 border-red-500 ring-2 ring-red-500/40 shadow-lg'
                      : isDark
                      ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Color Swatch Circle */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow border border-white/20 relative overflow-hidden"
                      style={{ backgroundColor: opt.colors.bg }}
                    >
                      <div
                        className="w-4 h-4 rounded-full absolute bottom-1 right-1 shadow"
                        style={{ backgroundColor: opt.colors.accent }}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs flex items-center gap-2">
                        <span>{currentLang === 'ne' ? opt.nameNe : opt.nameEn}</span>
                        {isSelected && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-extrabold bg-red-600 text-white">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {currentLang === 'ne' ? opt.descNe : opt.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-600/60" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & button */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Auto-saved to preferences</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
          >
            {currentLang === 'ne' ? 'लागू गर्नुहोस्' : 'Apply & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
