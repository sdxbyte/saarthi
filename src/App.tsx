import React, { useState, useEffect, lazy, Suspense } from 'react';
import { EditorialHeader } from './components/layout/EditorialHeader';
import { EditorialFooter } from './components/layout/EditorialFooter';
import { DetailViewWrapper } from './components/layout/DetailViewWrapper';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { BENTO_GRID_CONFIG } from './components/dashboard/ModuleGrid';
export { BENTO_GRID_CONFIG };

import { AuthLoginModal } from './components/auth/AuthLoginModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { UserProfile, AdminUser } from './types';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { getActiveCitizenSession, setActiveCitizenSession } from './utils/citizenAuthStore';
import { logoutAdminAsync } from './utils/superAdminAuth';

// Editorial Primary Views
const EditorialHomeView = lazy(() => import('./components/home/EditorialHomeView').then(m => ({ default: m.EditorialHomeView })));
const ExploreIndexView = lazy(() => import('./components/explore/ExploreIndexView').then(m => ({ default: m.ExploreIndexView })));
const FinanceHubView = lazy(() => import('./components/finance/FinanceHubView').then(m => ({ default: m.FinanceHubView })));
const ToolsHubView = lazy(() => import('./components/tools/ToolsHubView').then(m => ({ default: m.ToolsHubView })));

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
const GovServicesView = lazy(() => import('./components/government/GovServicesView').then(m => ({ default: m.GovServicesView })));
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

import { RadioAudioProvider } from './context/RadioAudioContext';
import { RadioMiniPlayer } from './components/sajilo/RadioMiniPlayer';
import { SajiloTrayPopover } from './components/sajilo/SajiloTrayPopover';
import { getTabFromPath, syncUrlWithTab, AppTabRoute } from './utils/routingEngine';

export function App() {
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname, window.location.search);
    }
    return 'home';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    syncUrlWithTab(tab as AppTabRoute);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync active tab with browser history Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const routeTab = getTabFromPath(window.location.pathname, window.location.search);
        setActiveTabState(routeTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentLang, setCurrentLang] = useState<'en' | 'ne'>('en');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSajiloTrayOpen, setIsSajiloTrayOpen] = useState<boolean>(false);

  // Devanagari numerals preference
  const [devanagariNumerals, setDevanagariNumerals] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('sajilo_devanagari_numerals') === 'true';
      }
    } catch {}
    return false;
  });

  const handleToggleDevanagariNumerals = () => {
    const nextVal = !devanagariNumerals;
    setDevanagariNumerals(nextVal);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('sajilo_devanagari_numerals', String(nextVal));
      }
    } catch {}
  };

  // Global keyboard shortcuts:
  // 1. Cmd+K / Ctrl+K opens Search
  // 2. Alt+S or Cmd+J toggles Sajilo Tray
  // 3. Alt+Shift+A opens Private Admin Gateway
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

  // Hidden Isolated Administration Portal State (Rule 11 & 12)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminLoginModalOpen(true);
      }
    }
  }, []);

  // User Profile Local Storage State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const active = getActiveCitizenSession();
      if (active) return active;
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('saarthi_user_profile') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLoggedIn === 'boolean') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read saved user profile:', e);
    }
    return {
      name: '',
      email: '',
      isLoggedIn: false,
    };
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('saarthi_user_profile', JSON.stringify(userProfile));
      }
      setActiveCitizenSession(userProfile.isLoggedIn ? userProfile : null);
    } catch {}
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

  // If logged into the Restricted Administration Portal, render protected Admin Layout
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
            void logoutAdminAsync();
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
    <RadioAudioProvider>
      <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans bg-[#090A0F] text-[#edeef0] selection:bg-white/20 selection:text-white antialiased">
        {/* Editorial Top Header */}
        <EditorialHeader
          currentLang={currentLang}
          onToggleLang={toggleLanguage}
          onOpenSearch={() => setIsSearchOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSajiloTray={() => setIsSajiloTrayOpen(true)}
        />

        {/* Main Content Body */}
        <main id="main-content" role="main" aria-label="Main Content Area" className="flex-1 min-w-0 w-full flex flex-col justify-between">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner label="Loading SAARTHI..." />}>
              {/* 1. Home Page */}
              {(activeTab === 'home' || activeTab === 'dashboard') && (
                <EditorialHomeView
                  currentLang={currentLang}
                  onNavigateTab={setActiveTab}
                  onOpenSearch={() => setIsSearchOpen(true)}
                />
              )}

              {/* 2. Explore Main Index */}
              {(activeTab === 'explore' || activeTab === 'modules') && (
                <ExploreIndexView
                  currentLang={currentLang}
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* 3. Finance Dedicated Experience */}
              {activeTab === 'finance' && (
                <FinanceHubView
                  currentLang={currentLang}
                  activeSubSection="overview"
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* 4. Tools Dedicated Experience */}
              {activeTab === 'tools' && (
                <ToolsHubView
                  currentLang={currentLang}
                  activeSubSection="overview"
                  onNavigateTab={setActiveTab}
                  userProfile={userProfile}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  devanagariNumerals={devanagariNumerals}
                  onToggleDevanagariNumerals={handleToggleDevanagariNumerals}
                  onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                />
              )}

              {/* Dedicated Detail Views */}
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
                  title="Receipt & Expense Scanner"
                  subtitle="Private, client-side expense document scanning and OCR budgeting assistant."
                  category="Finance"
                  sourceName="Local Encrypted Storage"
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
                  subtitle="Kalimati wholesale vegetable prices, 18+ live Nepal FM radio stations, quick reminders, and emergency helplines."
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
                    onToggleDevanagariNumerals={handleToggleDevanagariNumerals}
                    onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                  />
                </DetailViewWrapper>
              )}

              {activeTab === 'vault' && (
                <DetailViewWrapper
                  title="Encrypted Document Vault"
                  subtitle="Private, offline-first client storage for Citizenship, e-Passport, National ID, and educational records."
                  category="Tools"
                  sourceName="Client-Side 256-bit AES"
                  backTab="tools"
                  backLabel="Back to Tools"
                  onNavigateTab={setActiveTab}
                  relatedLinks={[
                    { label: 'Bluebook Tax', tab: 'bluebook' },
                    { label: 'Citizen Account', tab: 'about' },
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
                  <PublicApisHubView currentLang={currentLang} theme="dark" />
                </DetailViewWrapper>
              )}

              {/* Civic Services Views */}
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
                    theme="dark"
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
                  subtitle="Authentic Vedic astrological readings for all 12 zodiac signs with auspicious tithi timings."
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
                  subtitle="Curated web portal and verified streaming directory inspired by allsitehub.site."
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
                  subtitle="Curated open-source intelligence directory modeled after osint4all.com across DNS, surface, email, social, geolocation, and verification vectors."
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
                  subtitle="Curated open source resources, developer bookmarks, and tools from Sajilo and FreeMediaHeckYeah."
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
                    onToggleDevanagariNumerals={handleToggleDevanagariNumerals}
                    onOpenTrayModal={() => setIsSajiloTrayOpen(true)}
                    initialTab="links"
                  />
                </DetailViewWrapper>
              )}

              {/* Static About & Project Pages */}
              {activeTab === 'about' && (
                <AboutView
                  currentLang={currentLang}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  theme="dark"
                />
              )}

              {activeTab === 'vision' && (
                <VisionView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'contact' && (
                <ContactView currentLang={currentLang} theme="dark" />
              )}

              {activeTab === 'terms' && (
                <TermsView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacyView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'account-deletion' && (
                <AccountDeletionView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'support' && (
                <SupportHelpView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'donate' && (
                <SupportProjectView
                  currentLang={currentLang}
                  theme="dark"
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Minimal Editorial Footer */}
        <EditorialFooter
          currentLang={currentLang}
          onNavigateTab={setActiveTab}
          onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
        />

        {/* Global Search Modal (Cmd+K) */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          currentLang={currentLang}
          onSelectModule={(id) => {
            setIsSearchOpen(false);
            handleSelectModule(id);
          }}
        />

        {/* Citizen Account & Login Modal */}
        <AuthLoginModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          userProfile={userProfile}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpdateProfile={(updatedProfile) => setUserProfile(updatedProfile)}
          onOpenAccountDeletion={() => {
            setIsAuthModalOpen(false);
            setActiveTab('account-deletion');
          }}
          currentLang={currentLang}
          theme="dark"
        />

        {/* Restricted Admin Gateway Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          onLoginSuccess={(admin) => {
            setCurrentAdmin(admin);
            setIsAdminLoggedIn(true);
          }}
        />

        {/* Floating Persistent Live FM Radio Mini Player */}
        <RadioMiniPlayer onOpenFullRadio={() => setActiveTab('sajilo')} />

        {/* Offline Connectivity Indicator */}
        <OfflineIndicator />

        {/* Sajilo Tray Popover */}
        <SajiloTrayPopover
          isOpen={isSajiloTrayOpen}
          onClose={() => setIsSajiloTrayOpen(false)}
          onOpenFullView={() => setActiveTab('sajilo')}
          currentLang={currentLang}
          devanagariNumerals={devanagariNumerals}
        />
      </div>
    </RadioAudioProvider>
  );
}

export default App;
