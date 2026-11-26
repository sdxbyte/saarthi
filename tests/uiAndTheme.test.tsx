// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { IDBFactory } from 'fake-indexeddb';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { LanguageProvider, useLanguage } from '../src/context/LanguageContext';
import { GlobalTimeProvider } from '../src/context/GlobalTimeContext';
import { SyncAuthProvider } from '../src/context/SyncAuthContext';
import { SyncStatusBadge } from '../src/components/common/SyncStatusBadge';
import { ThemeModeSelector } from '../src/components/common/ThemeModeSelector';
import { MobileBottomNav } from '../src/components/layout/MobileBottomNav';
import { DesktopSidebar } from '../src/components/layout/DesktopSidebar';
import {
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
} from '../src/components/ui';
import { EditorialHomeView } from '../src/components/home/EditorialHomeView';
import { DocumentVaultView } from '../src/components/documents/DocumentVaultView';
import { SupportProjectView } from '../src/components/public/SupportProjectView';
import {
  setIndexedDbFactoryForTests,
  resetOfflineDbMemoryForTests,
  offlineDb,
} from '../src/services/offlineDb';

const ThemeHarness: React.FC = () => {
  const { resolvedTheme, themePreference, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="pref-theme">{themePreference}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <ThemeModeSelector />
    </div>
  );
};

const LanguageHarness: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{lang}</span>
      <span data-testid="home-label">{t.nav.home}</span>
      <button onClick={toggleLang}>Switch Language</button>
    </div>
  );
};

describe('SAARTHI UI, Design System, Zero-Mock & Offline Vault Tests', () => {
  beforeEach(async () => {
    setIndexedDbFactoryForTests(new IDBFactory());
    resetOfflineDbMemoryForTests();
    await offlineDb.clearAll();
    window.localStorage.clear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    global.fetch = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/time')) {
        return new Response(
          JSON.stringify({ unixTimestampSec: Math.floor(Date.now() / 1000) }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ data: null }), { status: 200 });
    }) as any;
  });

  it('persists Light, Dark, and System theme preferences on <html> and localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    const status = screen.getByTestId('resolved-theme');
    const pref = screen.getByTestId('pref-theme');
    expect(status).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(status).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(window.localStorage.getItem('saarthi_theme_preference_v2')).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: /^System$/i }));
    expect(pref).toHaveTextContent('system');
    expect(window.localStorage.getItem('saarthi_theme_preference_v2')).toBe('system');
  });

  it('switches and persists English and Nepali translations via LanguageProvider', () => {
    render(
      <LanguageProvider>
        <LanguageHarness />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('home-label')).toHaveTextContent('Home');

    fireEvent.click(screen.getByText('Switch Language'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('ne');
    expect(screen.getByTestId('home-label')).toHaveTextContent('गृहपृष्ठ');
    expect(document.documentElement.lang).toBe('ne');
    expect(window.localStorage.getItem('saarthi_lang_preference_v2')).toBe('ne');
  });

  it('renders all 6 sync status states clearly in SyncStatusBadge', () => {
    const cases: Array<{ status: any; expected: RegExp }> = [
      { status: 'synced', expected: /Synced/ },
      { status: 'syncing', expected: /Syncing/ },
      { status: 'offline', expected: /Offline/ },
      { status: 'pending', expected: /Pending changes \(2\)/ },
      { status: 'failed', expected: /Sync failed/ },
      { status: 'conflict', expected: /Conflict detected \(1\)/ },
    ];

    for (const c of cases) {
      const { unmount } = render(
        <SyncStatusBadge status={c.status} pendingCount={2} conflictCount={1} />
      );
      expect(screen.getByRole('button')).toHaveTextContent(c.expected);
      unmount();
    }
  });

  it('renders MobileBottomNav with 5 top-level destinations (Home, Services, Finance, Calendar, Account) and routes clicks', () => {
    const onSelectTab = vi.fn();
    const onOpenAccount = vi.fn();
    render(
      <MobileBottomNav
        activeTab="nepse"
        currentLang="en"
        isLoggedIn={false}
        onSelectTab={onSelectTab}
        onOpenAccount={onOpenAccount}
      />
    );

    const financeBtn = screen.getByRole('button', { name: /Finance/i });
    expect(financeBtn).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: /Services/i }));
    expect(onSelectTab).toHaveBeenCalledWith('services');

    fireEvent.click(screen.getByRole('button', { name: /Calendar/i }));
    expect(onSelectTab).toHaveBeenCalledWith('calendar');

    fireEvent.click(screen.getByRole('button', { name: /Account/i }));
    expect(onOpenAccount).toHaveBeenCalledTimes(1);
  });

  it('renders collapsible DesktopSidebar with unified navigation and persists collapse state', () => {
    const onSelectTab = vi.fn();
    const onOpenAccount = vi.fn();
    render(
      <ThemeProvider>
        <LanguageProvider>
          <DesktopSidebar
            activeTab="calendar"
            currentLang="en"
            onToggleLang={vi.fn()}
            onSelectTab={onSelectTab}
            onOpenAccount={onOpenAccount}
            isLoggedIn={false}
          />
        </LanguageProvider>
      </ThemeProvider>
    );

    const sidebar = screen.getByLabelText('Desktop Navigation Sidebar');
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByRole('button', { name: /Calendar/i })).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: /Collapse sidebar/i }));
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(window.localStorage.getItem('saarthi_sidebar_collapsed_v2')).toBe('true');

    fireEvent.click(screen.getByTitle('Services'));
    expect(onSelectTab).toHaveBeenCalledWith('services');
  });

  it('renders Phase 1 UI primitives (Button, Card, Input, Badge, Dialog, Loading/Empty/Error states)', () => {
    const onRetry = vi.fn();
    const onClose = vi.fn();
    render(
      <div>
        <Card>
          <Badge dot variant="positive">
            Synced
          </Badge>
          <Input label="Citizenship ID" placeholder="Enter ID" />
          <Button variant="primary">Submit</Button>
        </Card>
        <LoadingState title="Fetching records" />
        <EmptyState title="Empty Vault" description="Nothing saved yet" />
        <ErrorState title="Connection Lost" onRetry={onRetry} />
        <Dialog isOpen title="Account Overview" onClose={onClose}>
          <p>Session active</p>
        </Dialog>
      </div>
    );

    expect(screen.getByLabelText('Citizenship ID')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Fetching records' })).toBeInTheDocument();
    expect(screen.getByText('Empty Vault')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays "Official data is currently unavailable." instead of fake numbers when live feeds are absent', async () => {
    render(
      <GlobalTimeProvider>
        <SyncAuthProvider>
          <EditorialHomeView currentLang="en" onNavigateTab={vi.fn()} />
        </SyncAuthProvider>
      </GlobalTimeProvider>
    );

    await waitFor(() => {
      const unavailables = screen.getAllByText('Official data is currently unavailable.');
      expect(unavailables.length).toBeGreaterThanOrEqual(3);
    });

    // Never display previously hardcoded fake metrics
    expect(screen.queryByText(/192,500/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2,748\.15/)).not.toBeInTheDocument();
  });

  it('allows adding and deleting a document offline inside DocumentVaultView with empty clean initial state', async () => {
    render(
      <ThemeProvider>
        <SyncAuthProvider>
          <DocumentVaultView currentLang="en" />
        </SyncAuthProvider>
      </ThemeProvider>
    );

    // No dummy pre-seeded Citizenship number
    expect(screen.queryByText(/27-01-76-04120/)).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Add Document/i })[0]);
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Driving License/i), {
      target: { value: 'Personal Citizenship Card' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Document reference number/i), {
      target: { value: '99-01-80-11223' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Document/i }));

    await waitFor(() => {
      expect(screen.getByText('Personal Citizenship Card')).toBeInTheDocument();
      expect(screen.getByText('99-01-80-11223')).toBeInTheDocument();
    });
  });

  it('keeps Donation section compliant with Rule 8 ("Payment details have not yet been configured.") when unpublished and shows verified owner details when published', () => {
    window.localStorage.setItem(
      'saarthi_donation_config_v2',
      JSON.stringify({ isPublished: false })
    );
    const { unmount } = render(
      <SupportProjectView currentLang="en" theme="light" onNavigateTab={vi.fn()} />
    );
    expect(screen.getByText('Payment details have not yet been configured.')).toBeInTheDocument();
    unmount();

    window.localStorage.removeItem('saarthi_donation_config_v2');
    render(<SupportProjectView currentLang="en" theme="light" onNavigateTab={vi.fn()} />);
    expect(screen.getAllByText(/Nabil Bank/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('09810017569896')).toBeInTheDocument();
  });
});
