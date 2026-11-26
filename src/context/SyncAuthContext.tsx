import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc as fsDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  auth,
  checkRedirectAuthResult,
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
  reloadCurrentFirebaseUser,
  resendVerificationForCurrentUser,
  sendFirebasePasswordReset,
  signInWithEmailAccount,
  signInWithGoogleAccount,
  signOutFirebaseAccount,
  signUpWithEmailAccount,
} from '../lib/firebase';
import {
  offlineDb,
  SixStateSyncStatus,
  SyncConflictRecord,
} from '../services/offlineDb';
import {
  createPreMigrationBackupJson,
  detectLegacyLocalData,
  ensureUserRootDocument,
  getOrCreateDeviceId,
  listUserDevicesFromCloud,
  migrateLegacyLocalDataToCloud,
  registerCurrentDeviceSession,
  subscribeToCurrentDeviceRevocation,
  syncEngine,
} from '../services/syncEngine';
import { UserProfile, VaultDocument } from '../types';
import { KeeperItem } from '../types/sajiloTypes';
import {
  getActiveCitizenSession,
  logoutCitizen,
  setActiveCitizenSession,
} from '../utils/citizenAuthStore';
import { convertAdToBs } from '../utils/bsAdConverter';

export interface SavedItem {
  id: string;
  kind: 'shortcut' | 'saved_service' | 'watchlist' | 'note';
  targetId: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  pinned: boolean;
}

export interface LinkedDeviceInfo {
  id: string;
  platform: 'web' | 'pwa' | 'android-apk';
  deviceLabel: string;
  appVersion: string;
  revoked: boolean;
  lastSyncState: SixStateSyncStatus;
}

interface SyncAuthContextValue {
  firebaseUser: User | null;
  authReady: boolean;
  isOnline: boolean;
  isCloudSyncVerified: boolean;
  userProfile: UserProfile;
  setLocalUserProfile: (profile: UserProfile) => void;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  signOutAll: () => Promise<void>;
  syncStatus: SixStateSyncStatus;
  pendingCount: number;
  conflicts: SyncConflictRecord[];
  lastSyncedAtIso: string | null;
  syncError: string | null;
  vaultDocs: VaultDocument[];
  keeperItems: KeeperItem[];
  savedItems: SavedItem[];
  linkedDevices: LinkedDeviceInfo[];
  hasPendingLegacyMigration: boolean;
  upsertVaultDoc: (docItem: VaultDocument) => Promise<void>;
  deleteVaultDoc: (id: string) => Promise<void>;
  upsertKeeperItem: (item: KeeperItem) => Promise<void>;
  deleteKeeperItem: (id: string) => Promise<void>;
  toggleSavedItem: (item: SavedItem) => Promise<void>;
  upsertSavedItemRecord: (item: SavedItem) => Promise<void>;
  resolveSyncConflict: (
    conflictId: string,
    strategy: 'keep_local' | 'keep_remote' | 'merge_both'
  ) => Promise<void>;
  triggerManualSync: () => Promise<void>;
  runLegacyMigration: () => Promise<{ vaultMigrated: number; keeperMigrated: number }>;
  downloadPreMigrationBackup: () => void;
  exportAllUserDataJson: () => string;
  revokeLinkedDevice: (deviceId: string) => Promise<void>;
}

const SyncAuthContext = createContext<SyncAuthContextValue | undefined>(undefined);

declare const __SAARTHI_APP_VERSION__: string | undefined;

export const SyncAuthProvider: React.FC<{
  children: React.ReactNode;
  preferredTheme?: 'light' | 'dark' | 'system';
  preferredLang?: 'en' | 'ne';
  devanagariNumerals?: boolean;
}> = ({
  children,
  preferredTheme = 'dark',
  preferredLang = 'en',
  devanagariNumerals = false,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const active = getActiveCitizenSession();
      if (active) return active;
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('saarthi_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.isLoggedIn === 'boolean') return parsed;
        }
      }
    } catch {
      // ignore
    }
    return { name: '', email: '', isLoggedIn: false };
  });

  const [syncStatus, setSyncStatus] = useState<SixStateSyncStatus>(
    isOnline ? 'synced' : 'offline'
  );
  const [pendingCount, setPendingCount] = useState(0);
  const [conflicts, setConflicts] = useState<SyncConflictRecord[]>([]);
  const [lastSyncedAtIso, setLastSyncedAtIso] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [keeperItems, setKeeperItems] = useState<KeeperItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [linkedDevices, setLinkedDevices] = useState<LinkedDeviceInfo[]>([]);
  const [hasPendingLegacyMigration, setHasPendingLegacyMigration] = useState<boolean>(() => {
    return detectLegacyLocalData().hasData;
  });

  const refreshFromOfflineDb = useCallback(async () => {
    try {
      const [v, k, s, c, statusSnap] = await Promise.all([
        offlineDb.listEntities<VaultDocument>('vaultDocs'),
        offlineDb.listEntities<KeeperItem>('keeperItems'),
        offlineDb.listEntities<SavedItem>('savedItems'),
        offlineDb.listConflicts(),
        syncEngine.getStatusSnapshot(isOnline),
      ]);
      setVaultDocs(v.map((r) => r.data));
      setKeeperItems(k.map((r) => r.data));
      setSavedItems(s.map((r) => r.data));
      setConflicts(c);
      setSyncStatus(statusSnap.status);
      setPendingCount(statusSnap.pendingCount);
      setLastSyncedAtIso(statusSnap.lastSyncedAtIso);
      setSyncError(statusSnap.lastError);
      setHasPendingLegacyMigration(detectLegacyLocalData().hasData);
    } catch (err: any) {
      setSyncError(err?.message || 'Local offline store warning');
    }
  }, [isOnline]);

  useEffect(() => {
    void refreshFromOfflineDb();
    const unsub = syncEngine.subscribe(() => {
      void refreshFromOfflineDb();
    });
    return unsub;
  }, [refreshFromOfflineDb]);

  // Network online / offline detection + automatic outbox flush on reconnect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (firebaseUser?.uid && firebaseUser.emailVerified) {
        void syncEngine.flushOutbox(firebaseUser.uid).then(() => refreshFromOfflineDb());
      } else {
        void refreshFromOfflineDb();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [firebaseUser?.emailVerified, firebaseUser?.uid, refreshFromOfflineDb]);

  const handleDeviceRevoked = useCallback(async () => {
    const notice = 'This device session was revoked from another device. Please sign in again to re-authorize.';
    await offlineDb.setMeta('lastSyncError', notice);
    setSyncError(notice);
    try {
      if (isFirebaseConfigured() && auth.currentUser) {
        await signOutFirebaseAccount();
      }
    } finally {
      logoutCitizen();
      const empty: UserProfile = { isLoggedIn: false, name: '', email: '' };
      setUserProfile(empty);
      setActiveCitizenSession(null);
      setLinkedDevices([]);
      try {
        window.localStorage.setItem('saarthi_user_profile', JSON.stringify(empty));
      } catch {
        // ignore
      }
    }
  }, []);

  // Firebase Authentication & Cloud Listener Lifecycle
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthReady(true);
      return;
    }

    void checkRedirectAuthResult();

    let detachListeners: (() => void) | null = null;
    let detachDeviceListener: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setAuthReady(true);

      if (detachListeners) {
        detachListeners();
        detachListeners = null;
      }
      if (detachDeviceListener) {
        detachDeviceListener();
        detachDeviceListener = null;
      }

      if (fbUser) {
        const nextProfile: UserProfile = {
          isLoggedIn: true,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'SAARTHI Citizen',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
          memberSince: fbUser.metadata.creationTime || undefined,
        };
        setUserProfile((prev) => ({
          ...prev,
          ...nextProfile,
          phone: prev.phone,
          nagarikId: prev.nagarikId,
        }));
        setActiveCitizenSession(nextProfile);

        // Firestore rules enforce request.auth.token.email_verified == true.
        // Keep edits queued locally in IndexedDB until the account email is verified.
        if (!fbUser.emailVerified) {
          setSyncError('Email verification required before cloud sync activates. Local data remains safe.');
          await refreshFromOfflineDb();
          return;
        }

        try {
          setSyncError(null);
          const appVer =
            typeof __SAARTHI_APP_VERSION__ !== 'undefined' ? __SAARTHI_APP_VERSION__ : '1.0.0';
          const sessionInfo = await registerCurrentDeviceSession(
            fbUser.uid,
            appVer,
            isOnline ? 'synced' : 'offline'
          );
          if (sessionInfo.revoked) {
            await handleDeviceRevoked();
            return;
          }

          await ensureUserRootDocument(fbUser.uid, {
            email: nextProfile.email,
            displayName: nextProfile.name,
            photoUrl: nextProfile.avatarUrl,
            preferredTheme,
            preferredLang,
            devanagariNumerals,
          });
          const devices = await listUserDevicesFromCloud(fbUser.uid);
          setLinkedDevices(devices as LinkedDeviceInfo[]);

          detachDeviceListener = subscribeToCurrentDeviceRevocation(
            fbUser.uid,
            sessionInfo.deviceId,
            () => {
              void handleDeviceRevoked();
            }
          );

          detachListeners = syncEngine.attachCloudListeners(fbUser.uid, () => {
            void refreshFromOfflineDb();
          });

          if (isOnline) {
            await syncEngine.flushOutbox(fbUser.uid);
          }
          await refreshFromOfflineDb();
        } catch (err: any) {
          setSyncError(err?.message || 'Cloud sync initialization warning');
        }
      }
    });

    return () => {
      unsubAuth();
      if (detachListeners) detachListeners();
      if (detachDeviceListener) detachDeviceListener();
    };
  }, [devanagariNumerals, handleDeviceRevoked, isOnline, preferredLang, preferredTheme, refreshFromOfflineDb]);

  const activeCloudUid = firebaseUser?.emailVerified ? firebaseUser.uid : null;

  const setLocalUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('saarthi_user_profile', JSON.stringify(profile));
      }
      setActiveCitizenSession(profile.isLoggedIn ? profile : null);
    } catch {
      // ignore
    }
    if (activeCloudUid && profile.isLoggedIn) {
      void ensureUserRootDocument(activeCloudUid, {
        email: profile.email,
        displayName: profile.name,
        phone: profile.phone,
        nagarikId: profile.nagarikId,
        photoUrl: profile.avatarUrl,
        preferredTheme,
        preferredLang,
        devanagariNumerals,
      });
    }
  }, [activeCloudUid, devanagariNumerals, preferredLang, preferredTheme]);

  const signInGoogle = useCallback(async () => {
    await signInWithGoogleAccount();
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAccount(email, password);
  }, []);

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      await signUpWithEmailAccount(email, password, displayName);
    },
    []
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendFirebasePasswordReset(email);
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    await resendVerificationForCurrentUser();
  }, []);

  const refreshVerificationStatus = useCallback(async () => {
    const updated = await reloadCurrentFirebaseUser();
    if (!updated) return false;
    setFirebaseUser({ ...updated } as User);
    if (updated.emailVerified) {
      setSyncError(null);
      await ensureUserRootDocument(updated.uid, {
        email: updated.email || '',
        displayName: updated.displayName || updated.email?.split('@')[0] || 'SAARTHI Citizen',
        photoUrl: updated.photoURL || undefined,
        preferredTheme,
        preferredLang,
        devanagariNumerals,
      });
      await syncEngine.flushOutbox(updated.uid);
      await refreshFromOfflineDb();
    }
    return Boolean(updated.emailVerified);
  }, [devanagariNumerals, preferredLang, preferredTheme, refreshFromOfflineDb]);

  const signOutAll = useCallback(async () => {
    try {
      if (isFirebaseConfigured() && auth.currentUser) {
        await signOutFirebaseAccount();
      }
    } finally {
      logoutCitizen();
      const empty: UserProfile = { isLoggedIn: false, name: '', email: '' };
      setUserProfile(empty);
      setActiveCitizenSession(null);
      setLinkedDevices([]);
      try {
        window.localStorage.setItem('saarthi_user_profile', JSON.stringify(empty));
      } catch {
        // ignore
      }
    }
  }, []);

  const upsertVaultDoc = useCallback(
    async (docItem: VaultDocument) => {
      await syncEngine.queueUpsert('vaultDocs', docItem.id, docItem, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const deleteVaultDoc = useCallback(
    async (id: string) => {
      await syncEngine.queueDelete('vaultDocs', id, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const upsertKeeperItem = useCallback(
    async (item: KeeperItem) => {
      await syncEngine.queueUpsert('keeperItems', item.id, item, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const deleteKeeperItem = useCallback(
    async (id: string) => {
      await syncEngine.queueDelete('keeperItems', id, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const toggleSavedItem = useCallback(
    async (item: SavedItem) => {
      const existing = savedItems.find((s) => s.id === item.id);
      if (existing) {
        await syncEngine.queueDelete('savedItems', item.id, activeCloudUid);
      } else {
        await syncEngine.queueUpsert('savedItems', item.id, item, activeCloudUid);
      }
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb, savedItems]
  );

  const upsertSavedItemRecord = useCallback(
    async (item: SavedItem) => {
      await syncEngine.queueUpsert('savedItems', item.id, item, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const resolveSyncConflict = useCallback(
    async (conflictId: string, strategy: 'keep_local' | 'keep_remote' | 'merge_both') => {
      await syncEngine.resolveConflict(conflictId, strategy, activeCloudUid);
      await refreshFromOfflineDb();
    },
    [activeCloudUid, refreshFromOfflineDb]
  );

  const triggerManualSync = useCallback(async () => {
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }
    if (!activeCloudUid) {
      await refreshFromOfflineDb();
      return;
    }
    setSyncStatus('syncing');
    const devices = await listUserDevicesFromCloud(activeCloudUid);
    const currentId = await getOrCreateDeviceId();
    const currentDevice = devices.find((d) => d.id === currentId);
    if (currentDevice?.revoked === true) {
      await handleDeviceRevoked();
      return;
    }
    setLinkedDevices(devices as LinkedDeviceInfo[]);
    await syncEngine.flushOutbox(activeCloudUid);
    await refreshFromOfflineDb();
  }, [activeCloudUid, handleDeviceRevoked, isOnline, refreshFromOfflineDb]);

  const runLegacyMigration = useCallback(async () => {
    const res = await migrateLegacyLocalDataToCloud(syncEngine, activeCloudUid);
    await refreshFromOfflineDb();
    return res;
  }, [activeCloudUid, refreshFromOfflineDb]);

  const downloadPreMigrationBackup = useCallback(() => {
    const snap = detectLegacyLocalData();
    const json = createPreMigrationBackupJson(snap);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-local-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportAllUserDataJson = useCallback(() => {
    const adDate = new Date().toISOString().slice(0, 10);
    return JSON.stringify(
      {
        platform: 'SAARTHI',
        exportedAtIso: new Date().toISOString(),
        adDate,
        bsDate: convertAdToBs(adDate),
        account: {
          uid: firebaseUser?.uid || null,
          name: userProfile.name,
          email: userProfile.email,
        },
        vaultDocs,
        keeperItems,
        savedItems,
        linkedDevices,
        conflicts,
      },
      null,
      2
    );
  }, [conflicts, firebaseUser?.uid, keeperItems, linkedDevices, savedItems, userProfile.email, userProfile.name, vaultDocs]);

  const revokeLinkedDevice = useCallback(
    async (deviceId: string) => {
      if (!firebaseUser?.uid) return;
      const path = `users/${firebaseUser.uid}/devices/${deviceId}`;
      try {
        await setDoc(
          fsDoc(db, 'users', firebaseUser.uid, 'devices', deviceId),
          {
            revoked: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        const devices = await listUserDevicesFromCloud(firebaseUser.uid);
        setLinkedDevices(devices as LinkedDeviceInfo[]);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [firebaseUser?.uid]
  );

  const value = useMemo<SyncAuthContextValue>(
    () => ({
      firebaseUser,
      authReady,
      isOnline,
      isCloudSyncVerified: Boolean(firebaseUser?.emailVerified),
      userProfile,
      setLocalUserProfile,
      signInGoogle,
      signInEmail,
      signUpEmail,
      sendPasswordReset,
      resendVerificationEmail,
      refreshVerificationStatus,
      signOutAll,
      syncStatus,
      pendingCount,
      conflicts,
      lastSyncedAtIso,
      syncError,
      vaultDocs,
      keeperItems,
      savedItems,
      linkedDevices,
      hasPendingLegacyMigration,
      upsertVaultDoc,
      deleteVaultDoc,
      upsertKeeperItem,
      deleteKeeperItem,
      toggleSavedItem,
      upsertSavedItemRecord,
      resolveSyncConflict,
      triggerManualSync,
      runLegacyMigration,
      downloadPreMigrationBackup,
      exportAllUserDataJson,
      revokeLinkedDevice,
    }),
    [
      authReady,
      conflicts,
      deleteKeeperItem,
      deleteVaultDoc,
      downloadPreMigrationBackup,
      exportAllUserDataJson,
      firebaseUser,
      hasPendingLegacyMigration,
      isOnline,
      keeperItems,
      lastSyncedAtIso,
      linkedDevices,
      pendingCount,
      refreshVerificationStatus,
      resendVerificationEmail,
      revokeLinkedDevice,
      resolveSyncConflict,
      runLegacyMigration,
      savedItems,
      sendPasswordReset,
      setLocalUserProfile,
      signInEmail,
      signInGoogle,
      signOutAll,
      signUpEmail,
      syncError,
      syncStatus,
      toggleSavedItem,
      triggerManualSync,
      upsertKeeperItem,
      upsertSavedItemRecord,
      upsertVaultDoc,
      userProfile,
      vaultDocs,
    ]
  );

  return <SyncAuthContext.Provider value={value}>{children}</SyncAuthContext.Provider>;
};

export function useSyncAuth(): SyncAuthContextValue {
  const ctx = useContext(SyncAuthContext);
  if (!ctx) {
    throw new Error('useSyncAuth must be used within a SyncAuthProvider');
  }
  return ctx;
}
