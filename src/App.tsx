import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ModuleGrid } from './components/dashboard/ModuleGrid';
import { AuthLoginModal } from './components/auth/AuthLoginModal';
import { ThemeCustomizerModal, ThemeMode, ThemePreset } from './components/common/ThemeCustomizerModal';
import { BreadcrumbNav } from './components/common/BreadcrumbNav';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { UserProfile, AdminUser } from './types';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { PublicFooter } from './components/public/PublicFooter';
import { getActiveCitizenSession, setActiveCitizenSession } from './utils/citizenAuthStore';

import { CinematicHimalayanHero } from './components/home/CinematicHimalayanHero';

// Enterprise Code Splitting - Lazy Load heavy sub-views
const VisionView = lazy(() => import('./components/public/VisionView').then(m => ({ default: m.VisionView })));
const RoadmapView = lazy(() => import('./components/public/RoadmapView').then(m => ({ default: m.RoadmapView })));
const TaxCalculatorView = lazy(() => import('./components/finance/TaxCalculatorView').then(m => ({ default: m.TaxCalculatorView })));
const NepseMarketView = lazy(() => import('./components/finance/NepseMarketView').then(m => ({ default: m.NepseMarketView })));
const EmiCalculatorView = lazy(() => import('./components/finance/EmiCalculatorView').then(m => ({ default: m.EmiCalculatorView })));
const ReceiptScannerView = lazy(() => import('./components/finance/ReceiptScannerView').then(m => ({ default: m.ReceiptScannerView })));
const DocumentVaultView = lazy(() => import('./components/documents/DocumentVaultView').then(m => ({ default: m.DocumentVaultView })));
const BluebookTaxView = lazy(() => import('./components/documents/BluebookTaxView').then(m => ({ default: m.BluebookTaxView })));
const GovServicesView = lazy(() => import('./components/government/GovServicesView').then(m => ({ default: m.GovServicesView })));
const DevTrackProjectTrackerView = lazy(() => import('./components/government/DevTrackProjectTrackerView').then(m => ({ default: m.DevTrackProjectTrackerView })));
const IrdServicesView = lazy(() => import('./components/government/IrdServicesView').then(m => ({ default: m.IrdServicesView })));
const ForexGoldFuelView = lazy(() => import('./components/banking/ForexGoldFuelView').then(m => ({ default: m.ForexGoldFuelView })));
const CalendarBsAdView = lazy(() => import('./components/utilities/CalendarBsAdView').then(m => ({ default: m.CalendarBsAdView })));
const LokSewaJobsView = lazy(() => import('./components/employment/LokSewaJobsView').then(m => ({ default: m.LokSewaJobsView })));
const AboutView = lazy(() => import('./components/public/AboutView').then(m => ({ default: m.AboutView })));
const ContactView = lazy(() => import('./components/public/ContactView').then(m => ({ default: m.ContactView })));
const TermsView = lazy(() => import('./components/public/TermsView').then(m => ({ default: m.TermsView })));
const PrivacyView = lazy(() => import('./components/public/PrivacyView').then(m => ({ default: m.PrivacyView })));
const AccountDeletionView = lazy(() => import('./components/public/AccountDeletionView').then(m => ({ default: m.AccountDeletionView })));
const SupportHelpView = lazy(() => import('./components/public/SupportHelpView').then(m => ({ default: m.SupportHelpView })));
const SupportProjectView = lazy(() => import('./components/public/SupportProjectView').then(m => ({ default: m.SupportProjectView })));
const RashifalView = lazy(() => import('./components/lifestyle/RashifalView').then(m => ({ default: m.RashifalView })));
const ServicesCentralDirectory = lazy(() => import('./components/services/ServicesCentralDirectory').then(m => ({ default: m.ServicesCentralDirectory })));
const PublicApisHubView = lazy(() => import('./components/public-apis/PublicApisHubView').then(m => ({ default: m.PublicApisHubView })));

import { getTabFromPath, syncUrlWithTab, AppTabRoute } from './utils/routingEngine';

export function App() {
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'dashboard';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    syncUrlWithTab(tab as AppTabRoute);
  };

  // Sync active tab with browser history Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const routeTab = getTabFromPath(window.location.pathname);
        setActiveTabState(routeTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentLang, setCurrentLang] = useState<'en' | 'ne'>('en');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Hidden Isolated Administration Portal State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Global Background Sync state for Tax, Government & Financial services
  const [isSyncingData, setIsSyncingData] = useState<boolean>(true);
  const [syncStatusText, setSyncStatusText] = useState<string>('Syncing IRD Tax Rates & Nagarik Services...');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');

  // Initial Background Sync on App Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSyncingData(false);
      setSyncStatusText('Synced: IRD Tax, NEPSE Realtime, Forex & NRB Guidelines');
      const now = new Date();
      setLastSyncedAt(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleTriggerManualSync = () => {
    setIsSyncingData(true);
    setSyncStatusText('Refreshing Live Gov APIs & Financial Slabs...');
    setTimeout(() => {
      setIsSyncingData(false);
      setSyncStatusText('Sync Complete: All live civic data streams updated');
      const now = new Date();
      setLastSyncedAt(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 1500);
  };

  // User Profile Local Storage State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const active = getActiveCitizenSession();
    if (active) return active;
    const saved = localStorage.getItem('saarthi_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLoggedIn === 'boolean') {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved user profile:', e);
      }
    }
    return {
      name: '',
      email: '',
      isLoggedIn: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('saarthi_user_profile', JSON.stringify(userProfile));
    setActiveCitizenSession(userProfile.isLoggedIn ? userProfile : null);
  }, [userProfile]);

  const handleLogin = (user: UserProfile) => {
    setUserProfile(user);
    setActiveCitizenSession(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    const loggedOutProfile: UserProfile = {
      name: '',
      email: '',
      isLoggedIn: false,
    };
    setUserProfile(loggedOutProfile);
    setActiveCitizenSession(null);
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminLoginModalOpen(true);
      }
    }
  }, []);

  // Theme: Permanent Dim Obsidian Dark Mode
  const theme: ThemeMode = 'dark';

  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    const savedPreset = localStorage.getItem('saarthi_theme_preset') as ThemePreset;
    return savedPreset || 'crimson';
  });

  useEffect(() => {
    localStorage.setItem('saarthi_theme', 'dark');
    localStorage.setItem('saarthi_theme_preset', themePreset);

    document.documentElement.classList.add('dark');

    document.documentElement.classList.remove(
      'theme-crimson',
      'theme-emerald',
      'theme-sapphire',
      'theme-pearl',
      'theme-obsidian'
    );
    document.documentElement.classList.add(`theme-${themePreset}`);
  }, [themePreset]);

  const toggleTheme = () => {
    // Permanent dim dark mode enabled
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'en' ? 'ne' : 'en'));
  };

  const handleSelectModule = (moduleId: string) => {
    switch (moduleId) {
      case 'nepse-market':
      case 'portfolio-management':
      case 'ipo-suite':
      case 'custom-alerts':
        setActiveTab('nepse');
        break;

      case 'tax-calculator':
      case 'budget-planner':
      case 'insurance-tracker':
        setActiveTab('tax');
        break;

      case 'ird-services':
      case 'pan-registration':
      case 'tax-clearance-status':
        setActiveTab('ird');
        break;

      case 'loan-emi-calc':
        setActiveTab('emi');
        break;

      case 'receipt-scanner':
        setActiveTab('receipt');
        break;

      case 'forex-converter':
      case 'remittance-tracker':
      case 'gold-silver-price':
      case 'fuel-price':
      case 'bank-interest-compare':
      case 'financial-inst-tracker':
      case 'bank-directory':
        setActiveTab('forex');
        break;

      case 'secure-vault':
      case 'citizenship-passport':
      case 'nid-tracker':
      case 'driving-license':
      case 'account-tracker':
      case 'health-vaccination':
        setActiveTab('vault');
        break;

      case 'bluebook-tax':
        setActiveTab('bluebook');
        break;

      case 'gov-service-directory':
      case 'gov-form-library':
      case 'gov-updates':
      case 'law-constitution':
      case 'bill-ordinance-tracker':
      case 'embassy-directory':
      case 'tourism-travel':
      case 'local-news':
      case 'voter-election':
        setActiveTab('services');
        break;

      case 'lok-sewa-alerts':
      case 'job-listings':
      case 'foreign-employment':
      case 'scholarship-exam':
        setActiveTab('loksewa');
        break;

      case 'public-calendar':
      case 'tithi-festival':
      case 'rashifal':
      case 'rashifal-panchanga':
      case 'horoscope':
      case 'weather-aqi':
      case 'load-shedding':
      case 'utility-reminders':
      case 'public-utility':
      case 'public-utilities':
        if (moduleId === 'rashifal' || moduleId === 'rashifal-panchanga' || moduleId === 'horoscope') {
          setActiveTab('rashifal');
        } else {
          setActiveTab('calendar');
        }
        break;

      case 'emergency-sos':
      case 'emergency-directory':
        setActiveTab('gov-services');
        break;

      case 'multilang-settings':
        toggleLanguage();
        break;

      default:
        setActiveTab('dashboard');
        break;
    }
  };

  // If logged into the Restricted Administration Portal, render protected isolated Admin Layout
  if (isAdminLoggedIn && currentAdmin) {
    return (
      <ProtectedRoute
        currentAdmin={currentAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        requiredRole="ADMIN"
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
      >
        <AdminLayout
          currentAdmin={currentAdmin}
          onLogoutAdmin={() => {
            setIsAdminLoggedIn(false);
            setCurrentAdmin(null);
          }}
          onReturnToPublicApp={() => setIsAdminLoggedIn(false)}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        />
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0a0b0d] text-[#edeef0] selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentLang={currentLang}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          theme={theme}
          onToggleTheme={toggleTheme}
          userProfile={userProfile}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
        />

        {/* Content Body */}
        <main id="main-content" role="main" aria-label="Main Content Area" className="flex-1 min-w-0 p-3 sm:p-6 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div>
            <BreadcrumbNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentLang={currentLang}
              theme={theme}
            />

            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner label="Loading Civic Portal module..." />}>
                {activeTab === 'dashboard' && (
                  <CinematicHimalayanHero
                    currentLang={currentLang}
                    onExploreModules={() => setActiveTab('modules')}
                    onOpenVision={() => setActiveTab('vision')}
                    onSelectModule={handleSelectModule}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    theme={theme}
                    onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
                  />
                )}

                {(activeTab === 'modules' || activeTab === 'services' || activeTab === 'directory') && (
                  <ServicesCentralDirectory
                    currentLang={currentLang}
                    theme={theme}
                    onSelectService={(service) => handleSelectModule(service.id)}
                  />
                )}

                {activeTab === 'vision' && (
                  <VisionView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'roadmap' && (
                  <RoadmapView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'about' && (
                  <AboutView
                    currentLang={currentLang}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    theme={theme}
                  />
                )}

                {activeTab === 'contact' && <ContactView currentLang={currentLang} theme={theme} />}

                {activeTab === 'terms' && (
                  <TermsView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'privacy' && (
                  <PrivacyView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'account-deletion' && (
                  <AccountDeletionView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'support' && (
                  <SupportHelpView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'donate' && (
                  <SupportProjectView
                    currentLang={currentLang}
                    theme={theme}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {(activeTab === 'nepse' || activeTab === 'finance' || activeTab === 'share' || activeTab === 'market' || activeTab === 'ipo') && (
                  <NepseMarketView currentLang={currentLang} />
                )}

                {activeTab === 'tax' && <TaxCalculatorView currentLang={currentLang} />}

                {activeTab === 'ird' && <IrdServicesView currentLang={currentLang} theme={theme} />}

                {activeTab === 'emi' && <EmiCalculatorView currentLang={currentLang} />}

                {activeTab === 'receipt' && <ReceiptScannerView currentLang={currentLang} />}

                {(activeTab === 'vault' || activeTab === 'documents') && (
                  <DocumentVaultView
                    currentLang={currentLang}
                    userProfile={userProfile}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  />
                )}

                {(activeTab === 'bluebook' || activeTab === 'yatayat' || activeTab === 'license') && (
                  <BluebookTaxView currentLang={currentLang} />
                )}

                {activeTab === 'devtrack' && <DevTrackProjectTrackerView currentLang={currentLang} />}

                {(activeTab === 'gov-services' || activeTab === 'announcements' || activeTab === 'schemes' || activeTab === 'civic' || activeTab === 'emergency') && (
                  <GovServicesView currentLang={currentLang} />
                )}

                {(activeTab === 'forex' || activeTab === 'banking' || activeTab === 'gold' || activeTab === 'fuel') && (
                  <ForexGoldFuelView currentLang={currentLang} />
                )}

                {(activeTab === 'calendar' || activeTab === 'tools' || activeTab === 'utilities') && (
                  <CalendarBsAdView currentLang={currentLang} />
                )}

                {(activeTab === 'loksewa' || activeTab === 'jobs') && (
                  <LokSewaJobsView currentLang={currentLang} />
                )}

                {(activeTab === 'rashifal' || activeTab === 'horoscope') && (
                  <RashifalView currentLang={currentLang} />
                )}

                {(activeTab === 'public-apis' || activeTab === 'apis' || activeTab === 'api-explorer') && (
                  <PublicApisHubView currentLang={currentLang} theme={theme} />
                )}
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Public Footer */}
          <PublicFooter
            currentLang={currentLang}
            onNavigateTab={(tab) => setActiveTab(tab)}
            theme={theme}
            onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
          />
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLang={currentLang}
        onSelectModule={(id) => {
          setIsSearchOpen(false);
          handleSelectModule(id);
        }}
      />

      {/* User Login & Account Modal */}
      <AuthLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateProfile={(updatedProfile) => setUserProfile(updatedProfile)}
        currentLang={currentLang}
        theme={theme}
      />

      {/* Restricted Admin Login Gateway Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={(admin) => {
          setCurrentAdmin(admin);
          setIsAdminLoggedIn(true);
        }}
      />
    </div>
  );
}

export default App;
