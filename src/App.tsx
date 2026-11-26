import React, { useState, useEffect, lazy, Suspense } from 'react';
import { EditorialHeader } from './components/layout/EditorialHeader';
import { EditorialFooter } from './components/layout/EditorialFooter';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DetailViewWrapper } from './components/layout/DetailViewWrapper';
import { BENTO_GRID_CONFIG } from './components/dashboard/ModuleGrid';
export { BENTO_GRID_CONFIG };

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ConflictResolutionModal } from './components/common/ConflictResolutionModal';
import { AdminUser } from './types';
import { logoutAdminAsync } from './utils/superAdminAuth';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SyncAuthProvider, useSyncAuth } from './context/SyncAuthContext';
import { RadioAudioProvider } from './context/RadioAudioContext';
import { RadioMiniPlayer } from './components/sajilo/RadioMiniPlayer';
import { getTabFromPath, syncUrlWithTab, AppTabRoute } from './utils/routingEngine';
import { recordRecentModule } from './services/dashboardPrefsService';

// Lazy-loaded Modals & Heavy Shells (reduces initial bundle weight)
const GlobalSearchModal = lazy(() => import('./components/search/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const AuthLoginModal = lazy(() => import('./components/auth/AuthLoginModal').then(m => ({ default: m.AuthLoginModal })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLoginModal = lazy(() => import('./components/admin/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));
const SajiloTrayPopover = lazy(() => import('./components/sajilo/SajiloTrayPopover').then(m => ({ default: m.SajiloTrayPopover })));
const AppUpdateChecker = lazy(() => import('./components/common/AppUpdateChecker').then(m => ({ default: m.AppUpdateChecker })));

// Editorial Primary Views
const EditorialHomeView = lazy(() => import('./components/home/EditorialHomeView').then(m => ({ default: m.EditorialHomeView })));
const ExploreIndexView = lazy(() => import('./components/explore/ExploreIndexView').then(m => ({ default: m.ExploreIndexView })));
const FinanceHubView = lazy(() => import('./components/finance/FinanceHubView').then(m => ({ default: m.FinanceHubView })));
const ToolsHubView = lazy(() => import('./components/tools/ToolsHubView').then(m => ({ default: m.ToolsHubView })));
const AccountView = lazy(() => import('./components/account/AccountView').then(m => ({ default: m.AccountView })));

// Specialized Functional Sub-Views
const NepseMarketView = lazy(() => import('./components/finance/NepseMarketView').then(m => ({ default: m.NepseMarketView })));
const ForexGoldFuelView = lazy(() => import('./components/banking/ForexGoldFuelView').then(m => ({ default: m.ForexGoldFuelView })));
const TaxCalculatorView = lazy(() => import('./components/finance/TaxCalculatorView').then(m => ({ default: m.TaxCalculatorView })));
const EmiCalculatorView = lazy(() => import('./components/finance/EmiCalculatorView').then(m => ({ default: m.EmiCalculatorView })));
const ReceiptScannerView = lazy(() => import('./components/finance/ReceiptScannerView').then(m => ({ default: m.ReceiptScannerView })));
const CalendarBsAdView = lazy(() => import('./components/utilities/CalendarBsAdView').then(m => ({ default: m.CalendarBsAdView })));
const BluebookTaxView = lazy(() => import('./components/documents/BluebookTaxView').then(m => ({ default: m.BluebookTaxView })));
const DocumentVaultView = lazy(() => import('./components/documents/DocumentVaultView').then(m => ({ default: m.DocumentVaultView })));
const SajiloView = lazy(() => import('./components/sajilo/SajiloView').then(m => ({ default: m.SajiloView })));
const ServicesCentralDirectory = lazy(() => import('./components/services/ServicesCentralDirectory').then(m => ({ default: m.ServicesCentralDirectory })));
const LokSewaJobsView = lazy(() => import('./components/employment/LokSewaJobsView').then(m => ({ default: m.LokSewaJobsView })));
const DevTrackProjectTrackerView = lazy(() => import('./components/government/DevTrackProjectTrackerView').then(m => ({ default: m.DevTrackProjectTrackerView })));
const RashifalView = lazy(() => import('./components/lifestyle/RashifalView').then(m => ({ default: m.RashifalView })));
const PublicApisHubView = lazy(() => import('./components/public-apis/PublicApisHubView').then(m => ({ default: m.PublicApisHubView })));
const AllSiteHubView = lazy(() => import('./components/sitehub/AllSiteHubView').then(m => ({ default: m.AllSiteHubView })));
const Osint4AllView = lazy(() => import('./components/osint/Osint4AllView').then(m => ({ default: m.Osint4AllView })));

// Editorial Static Info Views
const AboutView = lazy(() => import('./components/public/AboutView').then(m => ({ default: m.AboutView })));
const VisionView = lazy(() => import('./components/public/VisionView').then(m => ({ default: m.VisionView })));
const RoadmapView = lazy(() => import('./components/public/RoadmapView').then(m => ({ default: m.RoadmapView })));
const ContactView = lazy(() => import('./components/public/ContactView').then(m => ({ default: m.ContactView })));
const TermsView = lazy(() => import('./components/public/TermsView').then(m => ({ default: m.TermsView })));
const PrivacyView = lazy(() => import('./components/public/PrivacyView').then(m => ({ default: m.PrivacyView })));
const AccountDeletionView = lazy(() => import('./components/public/AccountDeletionView').then(m => ({ default: m.AccountDeletionView })));
const SupportHelpView = lazy(() => import('./components/public/SupportHelpView').then(m => ({ default: m.SupportHelpView })));
const SupportProjectView = lazy(() => import('./components/public/SupportProjectView').then(m => ({ default: m.SupportProjectView })));

function SaarthiAppShell({
  currentLang,
  toggleLanguage,
  devanagariNumerals,
  onToggleDevanagariNumerals,
}: {
  currentLang: 'en' | 'ne';
  toggleLanguage: () => void;
  devanagariNumerals: boolean;
  onToggleDevanagariNumerals: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const {
    userProfile,
    setLocalUserProfile,
    signOutAll,
    conflicts,
    resolveSyncConflict,
    vaultDocs,
  } = useSyncAuth();

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname, window.location.search);
    }
    return 'home';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    recordRecentModule(tab);
    syncUrlWithTab(tab as AppTabRoute);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setActiveTabState(getTabFromPath(window.location.pathname, window.location.search));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSajiloTrayOpen, setIsSajiloTrayOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminLoginModalOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        (e.altKey && e.key.toLowerCase() === 's') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j')
      ) {
        e.preventDefault();
        setIsSajiloTrayOpen((prev) => !prev);
      } else if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);
    return () => window.removeEventListener('keydown', handleKeyShortcut);
  }, []);

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
      case 'loan-emi-calc':
        setActiveTab('emi');
        break;
      case 'receipt-scanner':
        setActiveTab('receipt');
        break;
      case 'forex-converter':
      case 'remittance-tracker':
        setActiveTab('forex');
        break;
      case 'gold-silver-price':
        setActiveTab('gold');
        break;
      case 'fuel-price':
        setActiveTab('fuel');
        break;
      case 'secure-vault':
      case 'citizenship-passport':
      case 'nid-tracker':
        setActiveTab('vault');
        break;
      case 'bluebook-tax':
      case 'driving-license':
        setActiveTab('bluebook');
        break;
      case 'gov-service-directory':
      case 'gov-form-library':
      case 'gov-updates':
        setActiveTab('services');
        break;
      case 'lok-sewa-alerts':
      case 'job-listings':
      case 'foreign-employment':
        setActiveTab('loksewa');
        break;
      case 'devtrack':
      case 'infrastructure':
        setActiveTab('devtrack');
        break;
      case 'public-calendar':
      case 'tithi-festival':
        setActiveTab('calendar');
        break;
      case 'rashifal':
      case 'rashifal-panchanga':
      case 'horoscope':
        setActiveTab('rashifal');
        break;
      case 'useful-links':
      case 'links':
      case 'fmhy':
      case 'resources':
        setActiveTab('links');
        break;
      case 'sitehub':
      case 'allsitehub':
      case 'streaming':
        setActiveTab('sitehub');
        break;
      case 'sajilo':
      case 'sajilo-essentials':
      case 'kalimati':
      case 'radio':
        setActiveTab('sajilo');
        break;
      case 'public-apis':
      case 'apis':
        setActiveTab('public-apis');
        break;
      case 'osint4all':
      case 'osint':
        setActiveTab('osint4all');
        break;
      default:
        setActiveTab('explore');
        break;
    }
  };

  if (isAdminLoggedIn && currentAdmin) {
    return (
      <Suspense fallback={<LoadingSpinner label="Loading Admin Portal..." />}>
        <ProtectedRoute
          currentAdmin={currentAdmin}
          isAdminLoggedIn={isAdminLoggedIn}
          requiredRole="ADMIN"
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        >
          <AdminLayout
            currentAdmin={currentAdmin}
            onLogoutAdmin={() => {
              void logoutAdminAsync();
              setIsAdminLoggedIn(false);
              setCurrentAdmin(null);
            }}
            onReturnToPublicApp={() => setIsAdminLoggedIn(false)}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          />
        </ProtectedRoute>
      </Suspense>
    );
  }

  return (
    <RadioAudioProvider>
      <div className="min-h-screen min-h-[100dvh] flex flex-col md:flex-row font-sans bg-[#F6F8FB] dark:bg-[#080D18] text-slate-900 dark:text-slate-100 selection:bg-blue-600/20 selection:text-[#0B1F3A] dark:selection:text-blue-100 antialiased">
        <DesktopSidebar
          activeTab={activeTab}
          currentLang={currentLang}
          onToggleLang={toggleLanguage}
          onSelectTab={setActiveTab}
          onOpenAccount={() => setActiveTab('account')}
          isLoggedIn={userProfile.isLoggedIn}
          userName={userProfile.name}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <EditorialHeader
            currentLang={currentLang}
            onToggleLang={toggleLanguage}
            onOpenSearch={() => setIsSearchOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userProfile={userProfile}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenSajiloTray={() => setIsSajiloTrayOpen(true)}
            onOpenConflicts={() => setIsConflictModalOpen(true)}
          />

          <main
            id="main-content"
            role="main"
            aria-label="Main Content Area"
            className="flex-1 min-w-0 w-full flex flex-col justify-between"
          >
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner label="Loading SAARTHI..." />}>
              {(activeTab === 'home' || activeTab === 'dashboard') && (
                <EditorialHomeView
                  currentLang={currentLang}
                  onNavigateTab={setActiveTab}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenAccount={() => setActiveTab('account')}
                />
              )}

              {(activeTab === 'explore' || activeTab === 'modules') && (
                <ExploreIndexView currentLang={currentLang} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'finance' && (
                <FinanceHubView
                  currentLang={currentLang}
                  activeSubSection="overview"
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'tools' && (
                <ToolsHubView
                  currentLang={currentLang}
                  activeSubSection="overview"
                  onNavigateTab={setActiveTab}
                  userProfile={userProfile}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  devanagariNumerals={devanagariNumerals}
                  onToggleDevanagariNumerals={onToggleDevanagariNumerals}
                  onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                />
              )}

              {activeTab === 'account' && (
                <AccountView
                  currentLang={currentLang}
                  onToggleLang={toggleLanguage}
                  devanagariNumerals={devanagariNumerals}
                  onToggleDevanagariNumerals={onToggleDevanagariNumerals}
                  onNavigateTab={setActiveTab}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onOpenConflicts={() => setIsConflictModalOpen(true)}
                />
              )}

              {activeTab === 'nepse' && (
                <DetailViewWrapper
                  title="NEPSE Market & IPO Suite"
                  subtitle="Live Nepal Stock Exchange index, market capitalization, top gainers, losers, and Meroshare IPO pipelines."
                  category="Finance"
                  sourceName="Nepal Stock Exchange & CDSC"
                  sourceUrl="https://nepalstock.com.np"
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Foreign Exchange', tab: 'forex' },
                    { label: 'Gold & Silver', tab: 'gold' },
                    { label: 'Income Tax', tab: 'tax' },
                  ]}
                >
                  <NepseMarketView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'forex' && (
                <DetailViewWrapper
                  title="Nepal Forex & Foreign Currency"
                  subtitle="Official foreign exchange rates for convertible currencies published daily by Nepal Rastra Bank."
                  category="Finance"
                  sourceName="Nepal Rastra Bank"
                  sourceUrl="https://www.nrb.org.np"
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Gold & Silver Rates', tab: 'gold' },
                    { label: 'Fuel Prices', tab: 'fuel' },
                    { label: 'NEPSE Market', tab: 'nepse' },
                  ]}
                >
                  <ForexGoldFuelView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {(activeTab === 'gold' || activeTab === 'fuel') && (
                <DetailViewWrapper
                  title={activeTab === 'gold' ? 'Gold & Silver Bullion Rates' : 'Nepal Petroleum Fuel Prices'}
                  subtitle={
                    activeTab === 'gold'
                      ? 'Official daily buying and selling rates per tola and 10 grams in Nepal from FENEGOSIDA.'
                      : 'Nepal Oil Corporation official retail rates for Petrol, Diesel, Kerosene, and LPG Cylinders.'
                  }
                  category="Finance"
                  sourceName={activeTab === 'gold' ? 'FENEGOSIDA' : 'Nepal Oil Corporation'}
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'NRB Forex Rates', tab: 'forex' },
                    { label: 'NEPSE Market', tab: 'nepse' },
                  ]}
                >
                  <ForexGoldFuelView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'tax' && (
                <DetailViewWrapper
                  title="Nepal Income Tax Calculator"
                  subtitle="Individual and married salary tax computation conforming to Inland Revenue Department (IRD) Fiscal Year 2083/84 slabs."
                  category="Finance"
                  sourceName="Inland Revenue Department"
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Loan EMI Calculator', tab: 'emi' },
                    { label: 'NEPSE Market', tab: 'nepse' },
                  ]}
                >
                  <TaxCalculatorView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'emi' && (
                <DetailViewWrapper
                  title="Loan EMI & Amortization Calculator"
                  subtitle="Standard bank loan monthly installment estimation, interest distribution, and payment schedules."
                  category="Finance"
                  sourceName="Banking Standards"
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Income Tax Calculator', tab: 'tax' },
                    { label: 'Forex Rates', tab: 'forex' },
                  ]}
                >
                  <EmiCalculatorView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'receipt' && (
                <DetailViewWrapper
                  title="Receipt & Expense Ledger"
                  subtitle="Record, structure, and export expense receipts into clean PDF statements."
                  category="Finance"
                  sourceName="Local Storage & PDF Export"
                  backTab="finance"
                  backLabel="Back to Finance"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Income Tax Calculator', tab: 'tax' },
                    { label: 'Loan EMI Calculator', tab: 'emi' },
                  ]}
                >
                  <ReceiptScannerView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'calendar' && (
                <DetailViewWrapper
                  title="Bikram Sambat Calendar & Converter"
                  subtitle="Official Nepali Patro, bidirectional BS ↔ AD date converter, daily Tithi, and government public holidays."
                  category="Tools"
                  sourceName="Nepal Panchanga Nirnayak Samiti"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Daily Rashifal', tab: 'rashifal' },
                    { label: 'Sajilo Daily', tab: 'sajilo' },
                  ]}
                >
                  <CalendarBsAdView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'bluebook' && (
                <DetailViewWrapper
                  title="Bluebook Vehicle Tax Estimator"
                  subtitle="Department of Transport Management (DoTM) annual road tax rates, renewal calculations, and license trial guide."
                  category="Tools"
                  sourceName="DoTM Nepal"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Document Vault', tab: 'vault' },
                    { label: 'Bikram Sambat Calendar', tab: 'calendar' },
                  ]}
                >
                  <BluebookTaxView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'sajilo' && (
                <DetailViewWrapper
                  title="Sajilo Everyday Essentials"
                  subtitle="Kalimati produce reference rates, live streaming Nepal FM radio stations, quick reminders, and emergency helplines."
                  category="Tools"
                  sourceName="Kalimati Board & Broadcasters"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Nepali Calendar', tab: 'calendar' },
                    { label: 'Gold & Bullion Rates', tab: 'gold' },
                  ]}
                >
                  <SajiloView
                    currentLang={currentLang}
                    devanagariNumerals={devanagariNumerals}
                    onToggleDevanagariNumerals={onToggleDevanagariNumerals}
                    onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                  />
                </DetailViewWrapper>
              )}

              {activeTab === 'vault' && (
                <DetailViewWrapper
                  title="Citizen Digital Document Vault"
                  subtitle="Offline-first personal storage synced with your unified SAARTHI cloud account."
                  category="Tools"
                  sourceName="IndexedDB + Cloud Firestore"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Bluebook Tax', tab: 'bluebook' },
                    { label: 'About SAARTHI', tab: 'about' },
                  ]}
                >
                  <DocumentVaultView
                    currentLang={currentLang}
                    userProfile={userProfile}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  />
                </DetailViewWrapper>
              )}

              {activeTab === 'public-apis' && (
                <DetailViewWrapper
                  title="Public APIs Hub & Developer Workbench"
                  subtitle="Curated collection of vetted public APIs and interactive browser workbench for developers."
                  category="Tools"
                  sourceName="github.com/public-apis"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Useful Links', tab: 'links' },
                    { label: 'AllSite Hub', tab: 'sitehub' },
                  ]}
                >
                  <PublicApisHubView currentLang={currentLang} theme={resolvedTheme} />
                </DetailViewWrapper>
              )}

              {activeTab === 'services' && (
                <DetailViewWrapper
                  title="Government Services Directory"
                  subtitle="Consolidated citizen charters, ministry links, Social Security Fund (SSF), and public portals."
                  category="Services"
                  sourceName="Government of Nepal"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Lok Sewa Aayog', tab: 'loksewa' },
                    { label: 'DevTrack Projects', tab: 'devtrack' },
                  ]}
                >
                  <ServicesCentralDirectory
                    currentLang={currentLang}
                    theme={resolvedTheme}
                    onSelectService={(service) => handleSelectModule(service.id)}
                  />
                </DetailViewWrapper>
              )}

              {activeTab === 'loksewa' && (
                <DetailViewWrapper
                  title="Lok Sewa & Career Notifications"
                  subtitle="Public Service Commission (PSC), TSC teacher exam schedules, vacancy notices, and labor permits."
                  category="Services"
                  sourceName="Lok Sewa Aayog"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Government Directory', tab: 'services' },
                    { label: 'DevTrack Projects', tab: 'devtrack' },
                  ]}
                >
                  <LokSewaJobsView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'devtrack' && (
                <DetailViewWrapper
                  title="DevTrack National Projects Tracker"
                  subtitle="Civic monitoring of national pride infrastructure projects and developmental milestones in Nepal."
                  category="Services"
                  sourceName="National Planning Commission"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Government Directory', tab: 'services' },
                    { label: 'Lok Sewa Aayog', tab: 'loksewa' },
                  ]}
                >
                  <DevTrackProjectTrackerView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'rashifal' && (
                <DetailViewWrapper
                  title="Daily Rashifal & Panchanga"
                  subtitle="Astrological readings for all 12 zodiac signs with tithi timings."
                  category="Resources"
                  sourceName="Vedic Astrology"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Bikram Sambat Calendar', tab: 'calendar' },
                    { label: 'Sajilo Daily', tab: 'sajilo' },
                  ]}
                >
                  <RashifalView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'sitehub' && (
                <DetailViewWrapper
                  title="AllSite Hub Directory"
                  subtitle="Curated web portal directory."
                  category="Resources"
                  sourceName="AllSiteHub"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Useful Links', tab: 'links' },
                    { label: 'Public APIs Hub', tab: 'public-apis' },
                  ]}
                >
                  <AllSiteHubView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'osint4all' && (
                <DetailViewWrapper
                  title="OSINT4ALL Intelligence Directory"
                  subtitle="Curated open-source intelligence directory across DNS, surface, email, social, geolocation, and verification vectors."
                  category="Tools"
                  sourceName="osint4all.com"
                  sourceUrl="https://osint4all.com/"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Public APIs Hub', tab: 'public-apis' },
                    { label: 'Useful Links & FMHY', tab: 'links' },
                    { label: 'AllSite Hub', tab: 'sitehub' },
                  ]}
                >
                  <Osint4AllView currentLang={currentLang} />
                </DetailViewWrapper>
              )}

              {activeTab === 'links' && (
                <DetailViewWrapper
                  title="Useful Links & FMHY Directory"
                  subtitle="Curated open source resources, developer bookmarks, and tools."
                  category="Resources"
                  sourceName="Sajilo & FMHY"
                  backTab="explore"
                  backLabel="Back to Explore"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'AllSite Hub', tab: 'sitehub' },
                    { label: 'Public APIs', tab: 'public-apis' },
                  ]}
                >
                  <SajiloView
                    currentLang={currentLang}
                    devanagariNumerals={devanagariNumerals}
                    onToggleDevanagariNumerals={onToggleDevanagariNumerals}
                    onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                    initialTab="links"
                  />
                </DetailViewWrapper>
              )}

              {activeTab === 'about' && (
                <AboutView currentLang={currentLang} onNavigateTab={setActiveTab} theme={resolvedTheme} />
              )}

              {activeTab === 'vision' && (
                <VisionView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'contact' && (
                <ContactView currentLang={currentLang} theme={resolvedTheme} />
              )}

              {activeTab === 'terms' && (
                <TermsView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'privacy' && (
                <PrivacyView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'account-deletion' && (
                <AccountDeletionView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'support' && (
                <SupportHelpView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'donate' && (
                <SupportProjectView currentLang={currentLang} theme={resolvedTheme} onNavigateTab={setActiveTab} />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

        <EditorialFooter
          currentLang={currentLang}
          onNavigateTab={setActiveTab}
          onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
        />
        </div>

        <MobileBottomNav
          activeTab={activeTab}
          currentLang={currentLang}
          isLoggedIn={userProfile.isLoggedIn}
          onSelectTab={setActiveTab}
          onOpenAccount={() => setActiveTab('account')}
        />

        <Suspense fallback={null}>
          {isSearchOpen && (
            <GlobalSearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              currentLang={currentLang}
              onSelectModule={(id) => {
                setIsSearchOpen(false);
                handleSelectModule(id);
              }}
            />
          )}

          {isAuthModalOpen && (
            <AuthLoginModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              userProfile={userProfile}
              onLogin={(user) => {
                setLocalUserProfile(user);
                setIsAuthModalOpen(false);
              }}
              onLogout={() => {
                void signOutAll();
                setIsAuthModalOpen(false);
              }}
              onUpdateProfile={(updatedProfile) => setLocalUserProfile(updatedProfile)}
              onOpenAccountDeletion={() => {
                setIsAuthModalOpen(false);
                setActiveTab('account-deletion');
              }}
              currentLang={currentLang}
              theme={resolvedTheme}
              vaultDocCount={vaultDocs.length}
            />
          )}

          {isAdminLoginModalOpen && (
            <AdminLoginModal
              isOpen={isAdminLoginModalOpen}
              onClose={() => setIsAdminLoginModalOpen(false)}
              onLoginSuccess={(admin) => {
                setCurrentAdmin(admin);
                setIsAdminLoggedIn(true);
              }}
            />
          )}

          {isSajiloTrayOpen && (
            <SajiloTrayPopover
              isOpen={isSajiloTrayOpen}
              onClose={() => setIsSajiloTrayOpen(false)}
              onOpenFullView={() => setActiveTab('sajilo')}
              currentLang={currentLang}
              devanagariNumerals={devanagariNumerals}
            />
          )}

          <AppUpdateChecker />
        </Suspense>

        <ConflictResolutionModal
          conflicts={isConflictModalOpen ? conflicts : []}
          onResolve={resolveSyncConflict}
          onClose={() => setIsConflictModalOpen(false)}
        />

        <RadioMiniPlayer onOpenFullRadio={() => setActiveTab('sajilo')} />
        <OfflineIndicator />
      </div>
    </RadioAudioProvider>
  );
}

function AppWithSyncBridge() {
  const { themePreference } = useTheme();
  const { lang: currentLang, toggleLang } = useLanguage();
  const [devanagariNumerals, setDevanagariNumerals] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('sajilo_devanagari_numerals') === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  const handleToggleDevanagariNumerals = () => {
    const nextVal = !devanagariNumerals;
    setDevanagariNumerals(nextVal);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('sajilo_devanagari_numerals', String(nextVal));
      }
    } catch {
      // ignore
    }
  };

  return (
    <SyncAuthProvider
      preferredTheme={themePreference}
      preferredLang={currentLang}
      devanagariNumerals={devanagariNumerals}
    >
      <SaarthiAppShell
        currentLang={currentLang}
        toggleLanguage={toggleLang}
        devanagariNumerals={devanagariNumerals}
        onToggleDevanagariNumerals={handleToggleDevanagariNumerals}
      />
    </SyncAuthProvider>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppWithSyncBridge />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
