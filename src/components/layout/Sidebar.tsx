import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Calculator,
  Lock,
  Coins,
  Calendar,
  Briefcase,
  Sparkles,
  X,
  FileCheck,
  HelpCircle,
  Heart,
  Layers,
  Code2,
  Car,
  Key,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { PushNotificationWidget } from '../common/PushNotificationWidget';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLang: 'en' | 'ne';
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  activeTab,
  setActiveTab,
  currentLang,
  isOpen,
  setIsOpen,
  theme,
  onOpenAdminModal,
}) => {
  const navGroups = [
    {
      groupTitle: currentLang === 'ne' ? 'मुख्य नेभिगेसन' : 'Core Navigation',
      items: [
        {
          id: 'dashboard',
          label: currentLang === 'ne' ? 'गृह पृष्ठ (Home)' : 'Home Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'services',
          label: currentLang === 'ne' ? 'एकीकृत नागरिक सेवाहरू' : 'Services Directory',
          icon: Layers,
          badge: 'Popular',
        },
        {
          id: 'sajilo',
          label: currentLang === 'ne' ? 'सजिलो (दैनिक जीवन)' : 'Sajilo (Daily Essentials)',
          icon: Sparkles,
          badge: 'New',
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'वित्त, सेयर तथा कर' : 'Finance & Money',
      items: [
        {
          id: 'nepse',
          label: currentLang === 'ne' ? 'सेयर बजार र नयाँ आइपिओ' : 'NEPSE & Live IPOs',
          icon: TrendingUp,
          badge: 'Live',
        },
        {
          id: 'forex',
          label: currentLang === 'ne' ? 'विदेशी मुद्रा र सुनचाँदी' : 'Forex, Gold & Fuel',
          icon: Coins,
        },
        {
          id: 'tax',
          label: currentLang === 'ne' ? 'कर, इ-पान र क्याल्कुलेटर' : 'Tax & EMI Calculator',
          icon: Calculator,
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'कागजात र सवारी' : 'Documents & Records',
      items: [
        {
          id: 'vault',
          label: currentLang === 'ne' ? 'डिजिटल कागजात भल्ट' : 'Encrypted Vault',
          icon: Lock,
          badge: 'Vault',
        },
        {
          id: 'bluebook',
          label: currentLang === 'ne' ? 'DoTM र सवारी कर' : 'DOTM & Vehicle Tax',
          icon: Car,
          badge: 'DOTM',
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'सरकारी र रोजगार' : 'Civic & Employment',
      items: [
        {
          id: 'ird',
          label: currentLang === 'ne' ? 'आन्तरिक राजस्व (IRD)' : 'IRD e-PAN & Tax',
          icon: FileCheck,
          badge: 'IRD',
        },
        {
          id: 'loksewa',
          label: currentLang === 'ne' ? 'लोक सेवा तथा रोजगार' : 'Lok Sewa Vacancies',
          icon: Briefcase,
          badge: 'Alerts',
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'पात्रो तथा औजारहरू' : 'Tools & Utilities',
      items: [
        {
          id: 'public-apis',
          label: currentLang === 'ne' ? 'खुला एपीआई हब' : 'Public APIs Hub',
          icon: Code2,
          badge: 'Open',
        },
        {
          id: 'calendar',
          label: currentLang === 'ne' ? 'नेपाली पात्रो र पञ्चाङ्ग' : 'Nepali Patro & Panchanga',
          icon: Calendar,
          badge: 'BS 2083',
        },
        {
          id: 'rashifal',
          label: currentLang === 'ne' ? 'दैनिक राशिफल' : 'Daily Rashifal',
          icon: Sparkles,
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'सहायता तथा परियोजना' : 'Support & Project',
      items: [
        {
          id: 'support',
          label: currentLang === 'ne' ? 'सहायता केन्द्र' : 'Help Desk & Contact',
          icon: HelpCircle,
        },
        {
          id: 'donate',
          label: currentLang === 'ne' ? 'परियोजना सहयोग' : 'Support Project (Donate)',
          icon: Heart,
          highlight: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 border-r border-[var(--color-divider)] flex flex-col justify-between transition-transform duration-200 ease-in-out bg-[var(--color-canvas)] text-[var(--color-text)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-2.5 overflow-y-auto flex-1 space-y-4">
          <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center justify-between text-[var(--color-text-muted)]">
            <span>{currentLang === 'ne' ? 'नेभिगेसन' : 'NAVIGATION'}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  {group.groupTitle}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-[var(--color-accent-mark)]' : 'text-[var(--color-text-muted)]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-[4px] border ${
                              isActive
                                ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border-[var(--color-accent-mark)]/30'
                                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-2.5 border-t border-[var(--color-divider)] bg-[var(--color-chrome)] space-y-2">
          <PushNotificationWidget
            currentLang={currentLang}
            theme={theme}
            setActiveTab={setActiveTab}
            onCloseMobileSidebar={() => setIsOpen(false)}
          />
          
          <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-mono px-1 pt-1">
            <span>SAARTHI Core v1.7.0</span>
            <button
              onClick={() => onOpenAdminModal && onOpenAdminModal()}
              className="hover:text-[var(--color-accent-mark)] transition-colors cursor-pointer flex items-center gap-1"
              title="Super Admin Gateway"
            >
              <Key className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});
