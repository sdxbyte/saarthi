import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Calculator,
  Shield,
  ScanLine,
  Building,
  Coins,
  Calendar,
  Briefcase,
  Sparkles,
  Compass,
  X,
  Lock,
  Landmark,
  Sun,
  Moon,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Globe,
  User,
  ShieldCheck,
  Info,
  Activity,
  Mail,
  Megaphone,
  PhoneCall,
  FileText,
  Heart,
  HelpCircle,
  Scale,
  Layers,
  ShieldAlert,
  Key,
  Code2,
  Car,
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
  onToggleTheme,
  userProfile,
  onOpenAuthModal,
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
          label: currentLang === 'ne' ? 'एकीकृत नागरिक सेवाहरू' : 'Unified Services Directory',
          icon: Layers,
          badge: 'Popular',
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'वित्त, सेयर तथा कर' : 'Finance & Money',
      items: [
        {
          id: 'nepse',
          label: currentLang === 'ne' ? 'सेयर बजार र नयाँ आइपिओ' : 'NEPSE, Stocks & IPO',
          icon: TrendingUp,
          badge: 'Live',
        },
        {
          id: 'forex',
          label: currentLang === 'ne' ? 'विदेशी मुद्रा, सुनचाँदी र इन्धन' : 'Forex, Gold & Fuel Rates',
          icon: Coins,
        },
        {
          id: 'tax',
          label: currentLang === 'ne' ? 'कर, इ-पान र ऋण क्याल्कुलेटर' : 'Tax, EMI & Receipt Scanner',
          icon: Calculator,
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'कागजात र सवारी' : 'Documents & Records',
      items: [
        {
          id: 'vault',
          label: currentLang === 'ne' ? 'डिजिटल कागजात भल्ट' : 'Encrypted Document Vault',
          icon: Lock,
          badge: 'Vault',
        },
        {
          id: 'bluebook',
          label: currentLang === 'ne' ? 'DoTM, लाइसेन्स र सवारी कर' : 'DOTM & Driving License Hub',
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
          label: currentLang === 'ne' ? 'आन्तरिक राजस्व (IRD) & PAN' : 'IRD e-PAN & Tax Clearance',
          icon: FileCheck,
          badge: 'IRD',
        },
        {
          id: 'loksewa',
          label: currentLang === 'ne' ? 'लोक सेवा तथा रोजगार' : 'Lok Sewa & Job Vacancies',
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
          label: currentLang === 'ne' ? 'सार्वजनिक खुला एपीआई हब' : 'Public APIs & Workbench',
          icon: Code2,
          badge: 'Open APIs',
        },
        {
          id: 'calendar',
          label: currentLang === 'ne' ? 'नेपाली पात्रो, पञ्चाङ्ग र शुभ मुहूर्त' : 'Nepali Calendar, Panchanga & Muhurats',
          icon: Calendar,
          badge: 'BS 2083',
        },
        {
          id: 'rashifal',
          label: currentLang === 'ne' ? 'दैनिक तथा मासिक राशिफल' : 'Daily Rashifal & Horoscope',
          icon: Sparkles,
          badge: 'Daily',
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'खाता तथा सहायता' : 'Account & Support',
      items: [
        {
          id: 'support',
          label: currentLang === 'ne' ? 'सहायता तथा सहायता केन्द्र' : 'Help Desk & Contact',
          icon: HelpCircle,
        },
        {
          id: 'donate',
          label: currentLang === 'ne' ? 'परियोजना सहयोग (Donate)' : 'Support SAARTHI Project',
          icon: Heart,
          highlight: true,
        },
      ],
    },
    {
      groupTitle: currentLang === 'ne' ? 'प्रशासन पोर्टल' : 'Administration Portal',
      items: [
        {
          id: 'admin_portal_gateway',
          label: currentLang === 'ne' ? 'प्रशासक पोर्टल (Admin Gateway)' : 'Super Admin Gateway',
          icon: Key,
          isAdminLink: true,
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
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r flex flex-col justify-between transition-transform duration-200 ease-in-out bg-[#14161b] border-[#262a31] text-[#edeef0] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-between text-[#8b909b]">
            <span>{currentLang === 'ne' ? 'मुख्य सेवाहरू' : 'Civic Navigation'}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-4 mt-1">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8b909b]">
                  {group.groupTitle}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.isAdminLink) {
                          if (onOpenAdminModal) onOpenAdminModal();
                        } else {
                          setActiveTab(item.id);
                        }
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-900/30'
                          : item.isAdminLink
                          ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 font-bold'
                          : item.highlight
                          ? theme === 'dark'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 font-semibold'
                          : theme === 'dark'
                          ? 'hover:bg-[#1b1e24] hover:text-white text-[#cbd5e1]'
                          : 'hover:bg-slate-100 hover:text-slate-900 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive
                              ? 'text-white'
                              : item.isAdminLink
                              ? 'text-amber-500 animate-pulse'
                              : item.highlight
                              ? 'text-amber-500 animate-pulse'
                              : theme === 'dark'
                              ? 'text-slate-400 group-hover:text-red-400'
                              : 'text-slate-600 group-hover:text-red-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : theme === 'dark'
                              ? 'bg-slate-800 text-red-400 border border-red-500/30'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Simulated Push Notification Widget for Deadlines */}
          <PushNotificationWidget
            currentLang={currentLang}
            theme={theme}
            setActiveTab={setActiveTab}
            onCloseMobileSidebar={() => setIsOpen(false)}
          />
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-3 border-t border-[#262a31] bg-[#14161b] space-y-2">
          {/* User Account / Login Toggle Card */}
          <button
            onClick={onOpenAuthModal}
            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
              userProfile?.isLoggedIn
                ? 'bg-[#1b1e24] border-emerald-500/40 hover:border-emerald-500 text-white'
                : 'bg-[#1b1e24] border-[#262a31] hover:border-red-500/50 text-[#edeef0]'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                userProfile?.isLoggedIn ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {userProfile?.isLoggedIn ? userProfile.name.charAt(0) : <User className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs truncate flex items-center gap-1 text-[#edeef0]">
                  <span>{userProfile?.isLoggedIn ? userProfile.name : (currentLang === 'ne' ? 'साइन इन / खाता' : 'Sign In / Account')}</span>
                  {userProfile?.isLoggedIn && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />}
                </div>
                <p className="text-[10px] text-[#8b909b] truncate">
                  {userProfile?.isLoggedIn
                    ? userProfile.email
                    : (currentLang === 'ne' ? 'कागजात म्याद सेभ गर्न' : 'Save & track vault expiry')}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
              userProfile?.isLoggedIn
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-600/20 text-red-400 border border-red-500/30'
            }`}>
              {userProfile?.isLoggedIn ? (currentLang === 'ne' ? 'प्रोफाइल' : 'Profile') : (currentLang === 'ne' ? 'लगइन' : 'Login')}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
});
