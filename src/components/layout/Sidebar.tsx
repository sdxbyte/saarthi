import React from 'react';
import { motion } from 'motion/react';
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
  Globe,
  Film,
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
          id: 'sitehub',
          label: currentLang === 'ne' ? 'AllSiteHub मिडिया हब' : 'AllSiteHub Directory',
          icon: Film,
          badge: 'Streaming',
        },
        {
          id: 'sajilo',
          label: currentLang === 'ne' ? 'सजिलो (दैनिक जीवन)' : 'Sajilo (Daily Essentials)',
          icon: Sparkles,
          badge: 'Daily',
        },
        {
          id: 'links',
          label: currentLang === 'ne' ? 'उपयोगी लिङ्कहरू (FMHY र Sajilo)' : 'Useful Links & FMHY Hub',
          icon: Globe,
          badge: 'Web Hub',
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
          id: 'links',
          label: currentLang === 'ne' ? 'उपयोगी लिङ्कहरू (FMHY र Sajilo)' : 'Useful Links & Web Hub',
          icon: Globe,
          badge: 'New',
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
        className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-200 ease-in-out bg-[#0B0F17]/95 backdrop-blur-xl text-slate-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-2.5 overflow-y-auto flex-1 space-y-4">
          <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-between text-slate-400">
            <span>{currentLang === 'ne' ? 'नेभिगेसन' : 'NAVIGATION'}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
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
                        className="relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebarNavGlider"
                            className="absolute inset-0 bg-slate-800/90 border border-slate-700/80 rounded-xl shadow-xs"
                            transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          />
                          <span className={`truncate ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}>
                            {item.label}
                          </span>
                        </div>
                        {item.badge && (
                          <span
                            className={`relative z-10 text-[9px] font-mono px-1.5 py-0.2 rounded-md border ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
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
        <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
          <PushNotificationWidget
            currentLang={currentLang}
            theme={theme}
            setActiveTab={setActiveTab}
            onCloseMobileSidebar={() => setIsOpen(false)}
          />
          
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1 pt-1">
            <span>SAARTHI Core v1.9.1</span>
            <button
              onClick={() => onOpenAdminModal && onOpenAdminModal()}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono"
              title="Super Admin Gateway"
            >
              <Key className="w-3 h-3 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});
