// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { IDBFactory } from 'fake-indexeddb';

const hoistedMocks = vi.hoisted(() => {
  return {
    authStateCallback: null as ((user: any) => void) | null,
    snapshotListeners: new Map<string, (snap: any) => void>(),
    signOutFirebaseAccount: vi.fn().mockResolvedValue(undefined),
    currentUserRef: { current: null as any },
    deviceRevokedOnRead: false,
  };
});

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth: any, cb: (user: any) => void) => {
    hoistedMocks.authStateCallback = cb;
    return () => {
      if (hoistedMocks.authStateCallback === cb) {
        hoistedMocks.authStateCallback = null;
      }
    };
  }),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db: any, ...segments: string[]) => ({ path: segments.join('/') })),
  collection: vi.fn((_db: any, ...segments: string[]) => ({ path: segments.join('/') })),
  query: vi.fn((colRef: any) => colRef),
  where: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  setDoc: vi.fn().mockResolvedValue(undefined),
  getDoc: vi.fn(async (ref: any) => {
    const path = String(ref?.path || '');
    if (path.includes('/devices/')) {
      return {
        exists: () => true,
        data: () => ({
          id: path.split('/').pop(),
          ownerId: path.split('/')[1],
          platform: 'web',
          deviceLabel: 'Desktop Browser',
          appVersion: '2.0.0',
          revoked: hoistedMocks.deviceRevokedOnRead,
          lastSyncState: 'synced',
        }),
      };
    }
    return {
      exists: () => true,
      data: () => ({ version: 1, displayName: 'SAARTHI Citizen' }),
    };
  }),
  getDocs: vi.fn(async (ref: any) => {
    const path = String(ref?.path || '');
    if (path.endsWith('/devices')) {
      return {
        docs: [
          {
            id: 'web-test-device',
            data: () => ({
              id: 'web-test-device',
              ownerId: path.split('/')[1],
              platform: 'web',
              deviceLabel: 'Desktop Browser',
              appVersion: '2.0.0',
              revoked: false,
              lastSyncState: 'synced',
            }),
          },
        ],
      };
    }
    return { docs: [] };
  }),
  onSnapshot: vi.fn((ref: any, onNext: (snap: any) => void) => {
    const path = String(ref?.path || '');
    hoistedMocks.snapshotListeners.set(path, onNext);
    return () => {
      hoistedMocks.snapshotListeners.delete(path);
    };
  }),
}));

vi.mock('../src/lib/firebase', () => ({
  OperationType: {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    GET: 'get',
    WRITE: 'write',
  },
  get auth() {
    return { currentUser: hoistedMocks.currentUserRef.current };
  },
  db: {},
  isFirebaseConfigured: () => true,
  checkRedirectAuthResult: vi.fn().mockResolvedValue(null),
  handleFirestoreError: vi.fn((err: unknown) => {
    throw err;
  }),
  reloadCurrentFirebaseUser: vi.fn().mockResolvedValue(null),
  resendVerificationForCurrentUser: vi.fn().mockResolvedValue(undefined),
  sendFirebasePasswordReset: vi.fn().mockResolvedValue(undefined),
  signInWithEmailAccount: vi.fn().mockResolvedValue(undefined),
  signInWithGoogleAccount: vi.fn().mockResolvedValue(undefined),
  signOutFirebaseAccount: hoistedMocks.signOutFirebaseAccount,
  signUpWithEmailAccount: vi.fn().mockResolvedValue(undefined),
}));

import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { SyncAuthProvider, useSyncAuth } from '../src/context/SyncAuthContext';
import { AccountView } from '../src/components/account/AccountView';
import { SajiloBazarTab } from '../src/components/sajilo/SajiloBazarTab';
import { PublicApisHubView } from '../src/components/public-apis/PublicApisHubView';
import {
  offlineDb,
  resetOfflineDbMemoryForTests,
  setIndexedDbFactoryForTests,
} from '../src/services/offlineDb';
import { syncEngine } from '../src/services/syncEngine';

const AccountTestHarness: React.FC<{
  onOpenAuthModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenConflicts?: () => void;
}> = ({ onOpenAuthModal = vi.fn(), onNavigateTab = vi.fn(), onOpenConflicts = vi.fn() }) => {
  const { userProfile, syncError } = useSyncAuth();
  return (
    <div>
      <span data-testid="logged-in-flag">{String(userProfile.isLoggedIn)}</span>
      <span data-testid="sync-error-text">{syncError || ''}</span>
      <AccountView
        currentLang="en"
        onToggleLang={vi.fn()}
        devanagariNumerals={false}
        onToggleDevanagariNumerals={vi.fn()}
        onNavigateTab={onNavigateTab}
        onOpenAuthModal={onOpenAuthModal}
        onOpenConflicts={onOpenConflicts}
      />
    </div>
  );
};

describe('SAARTHI AccountView, Revoked Device Termination & Rule 16 Market Fallbacks', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    hoistedMocks.authStateCallback = null;
    hoistedMocks.snapshotListeners.clear();
    hoistedMocks.currentUserRef.current = null;
    hoistedMocks.deviceRevokedOnRead = false;

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

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    global.fetch = vi.fn().mockRejectedValue(new Error('Network unavailable in test')) as any;
  });

  it('renders AccountView signed-out state, shows queued outbox items, and opens sign-in modal', async () => {
    await syncEngine.queueUpsert(
      'vaultDocs',
      'doc-offline-1',
      {
        title: 'Offline Citizenship Draft',
        documentType: 'Citizenship',
        docNumber: '01-01-01',
        issueDate: '2024-01-01',
        issuer: 'DAO',
      },
      null
    );

    const onOpenAuthModal = vi.fn();
    render(
      <ThemeProvider>
        <LanguageProvider>
          <SyncAuthProvider>
            <AccountTestHarness onOpenAuthModal={onOpenAuthModal} />
          </SyncAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );

    act(() => {
      hoistedMocks.authStateCallback?.(null);
    });

    await waitFor(() => {
      expect(screen.getByText('Sign in to unify your devices')).toBeInTheDocument();
      expect(screen.getByText(/Pending changes \(1\)/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Sign In \/ Create Account/i })[0]);
    expect(onOpenAuthModal).toHaveBeenCalledTimes(1);
  });

  it('registers linked devices in AccountView and immediately terminates session when revoked remotely', async () => {
    const mockUser = {
      uid: 'citizen-uid-rev-1',
      email: 'citizen@saarthi.dpdns.org',
      displayName: 'Aarav Nepal',
      emailVerified: true,
      photoURL: null,
      metadata: { creationTime: '2026-01-01T00:00:00Z' },
    };

    render(
      <ThemeProvider>
        <LanguageProvider>
          <SyncAuthProvider>
            <AccountTestHarness />
          </SyncAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );

    await act(async () => {
      hoistedMocks.currentUserRef.current = mockUser;
      hoistedMocks.authStateCallback?.(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByTestId('logged-in-flag')).toHaveTextContent('true');
      expect(screen.getByText('Aarav Nepal')).toBeInTheDocument();
      expect(screen.getByText(/Desktop Browser · web/i)).toBeInTheDocument();
    });

    const deviceListenerEntry = Array.from(hoistedMocks.snapshotListeners.entries()).find(([path]) =>
      path.includes(`users/${mockUser.uid}/devices/`)
    );
    expect(deviceListenerEntry).toBeDefined();

    await act(async () => {
      deviceListenerEntry?.[1]({
        exists: () => true,
        data: () => ({ revoked: true }),
      });
    });

    await waitFor(() => {
      expect(hoistedMocks.signOutFirebaseAccount).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('logged-in-flag')).toHaveTextContent('false');
      expect(screen.getByTestId('sync-error-text')).toHaveTextContent(
        /This device session was revoked from another device/i
      );
    });
  });

  it('enforces Rule 16 unavailable-data fallback in SajiloBazarTab without fake prices', async () => {
    render(<SajiloBazarTab currentLang="en" devanagariNumerals={false} />);

    await waitFor(() => {
      expect(screen.getByText('Official data is currently unavailable.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Gold & Silver/i }));
    await waitFor(() => {
      expect(screen.getByText('Official data is currently unavailable.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/152,400/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Fuel Prices/i }));
    await waitFor(() => {
      expect(screen.getByText('Official data is currently unavailable.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/170\.0/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /NEPSE & IPO/i }));
    await waitFor(() => {
      expect(screen.getByText('Official data is currently unavailable.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/2,748\.65/)).not.toBeInTheDocument();
  });

  it('enforces Rule 16 unavailable-data fallback in PublicApisHubView currency converter and IP details', async () => {
    render(<PublicApisHubView currentLang="en" theme="light" />);

    expect(screen.queryByText(/13,450/)).not.toBeInTheDocument();
    expect(screen.queryByText(/103\.1\.200\.42/)).not.toBeInTheDocument();

    const convertButtons = screen.getAllByRole('button', { name: /Calculate Exchange/i });
    fireEvent.click(convertButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText('Official exchange rate feed is currently unavailable.')
      ).toBeInTheDocument();
    });
  });
});
