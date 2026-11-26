import { Capacitor, registerPlugin } from '@capacitor/core';
import { getApiBaseUrl, isNativeAndroidShell } from './apiClient';

export interface AppBuildInfo {
  versionCode?: number;
  versionName?: string;
  packageName?: string;
  canInstallPackages?: boolean;
}

export interface PendingApkUpdateStatus {
  hasDownloadedApk: boolean;
  isNewerThanInstalled: boolean;
  signatureMatches: boolean;
  canInstallPackages: boolean;
  versionCode?: number;
  versionName?: string;
  fileSize?: number;
  filePath?: string;
  buildNumber?: number;
  commitSha?: string;
  tagName?: string;
  apkUrl?: string;
  downloadedAt?: string;
}

export interface SaarthiUpdaterPlugin {
  getAppBuildInfo(): Promise<AppBuildInfo>;
  getPendingUpdateStatus(): Promise<PendingApkUpdateStatus>;
  clearCachedUpdate(): Promise<{ cleared: boolean }>;
  requestInstallPermission(): Promise<{ opened: boolean }>;
  installDownloadedApk(): Promise<{
    started?: boolean;
    needsPermission?: boolean;
    signatureMatches?: boolean;
    filePath?: string;
  }>;
  setSystemBarsTheme(options: { dark: boolean }): Promise<{ updated: boolean }>;
  downloadAndInstallApk(options: {
    url: string;
    buildNumber?: number;
    commitSha?: string;
    tagName?: string;
    autoInstall?: boolean;
  }): Promise<{
    downloaded?: boolean;
    readyToInstall?: boolean;
    started?: boolean;
    needsPermission?: boolean;
    signatureMatches?: boolean;
    filePath?: string;
  }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: {
      percent: number;
      downloadedBytes: number;
      totalBytes: number;
      stage: 'downloading' | 'downloaded_ready' | 'installing' | 'permission_required' | 'error';
      message?: string;
      signatureMatches?: boolean;
    }) => void
  ): Promise<{ remove: () => Promise<void> }>;
}

const NativeSaarthiUpdater = registerPlugin<SaarthiUpdaterPlugin>('SaarthiUpdater');

export interface RemoteReleaseInfo {
  buildNumber: number | null;
  commitSha: string;
  tagName: string;
  releaseName: string;
  publishedAt: string;
  apkDownloadUrl: string;
  apkSizeBytes: number | null;
  releaseNotes: string;
}

export interface LiveSyncSnapshot {
  isNativeApk: boolean;
  apiBaseUrl: string;
  connected: boolean;
  latencyMs: number | null;
  serverTimeIso: string | null;
  adDate: string | null;
  bsDate: string | null;
  dataRevision: string | null;
  installedVersion: string;
  installedBuildNumber: number;
  installedCommitShort: string;
  latestRelease: RemoteReleaseInfo | null;
  pendingApkUpdate: PendingApkUpdateStatus | null;
  updateAvailable: boolean;
  autoUpdateEnabled: boolean;
  lastCheckedAt: string | null;
  checking: boolean;
  error: string | null;
}

const AUTO_UPDATE_STORAGE_KEY = 'saarthi_auto_update_apk_v1';
const DIRECT_APK_DOWNLOAD_URL = 'https://github.com/sdxbyte/saarthi/releases/latest/download/saarthi-latest.apk';
const GITHUB_LATEST_RELEASE_URL = 'https://api.github.com/repos/sdxbyte/saarthi/releases/latest';

function getStoredAutoUpdatePreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(AUTO_UPDATE_STORAGE_KEY);
    if (raw === null) return true; // Auto-update enabled by default in standalone APK
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setStoredAutoUpdatePreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTO_UPDATE_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage restriction errors
  }
}

export function getInstalledBuildMetadata() {
  const version =
    typeof __SAARTHI_APP_VERSION__ !== 'undefined' ? __SAARTHI_APP_VERSION__ : '1.0.0';
  const buildNumber =
    Number.parseInt(
      typeof __SAARTHI_BUILD_NUMBER__ !== 'undefined' ? __SAARTHI_BUILD_NUMBER__ : '0',
      10
    ) || 0;
  const commitSha =
    typeof __SAARTHI_BUILD_SHA__ !== 'undefined' ? __SAARTHI_BUILD_SHA__ : '';
  const buildTime =
    typeof __SAARTHI_BUILD_TIME__ !== 'undefined' ? __SAARTHI_BUILD_TIME__ : '';

  return {
    version,
    buildNumber,
    commitSha,
    commitShort: commitSha.slice(0, 7),
    buildMs: Date.parse(buildTime) || 0,
  };
}

function parseGitHubReleasePayload(release: any): RemoteReleaseInfo | null {
  if (!release || typeof release !== 'object') return null;
  const bodyText = typeof release.body === 'string' ? release.body : '';
  const buildMatch = bodyText.match(/CI Build\s*#(\d+)/i);
  const commitMatch = bodyText.match(/Commit\**:\s*`?([0-9a-f]{7,40})`?/i);
  const apkAsset = Array.isArray(release.assets)
    ? release.assets.find(
        (a: any) =>
          a?.name === 'saarthi-latest.apk' ||
          (typeof a?.name === 'string' && a.name.endsWith('.apk'))
      )
    : null;

  return {
    buildNumber: buildMatch ? Number.parseInt(buildMatch[1], 10) : null,
    commitSha: commitMatch ? commitMatch[1].slice(0, 7) : '',
    tagName: release.tag_name || 'latest',
    releaseName: release.name || 'SAARTHI Latest APK',
    publishedAt: release.published_at || '',
    apkDownloadUrl: apkAsset?.browser_download_url || DIRECT_APK_DOWNLOAD_URL,
    apkSizeBytes: typeof apkAsset?.size === 'number' ? apkAsset.size : null,
    releaseNotes: bodyText.slice(0, 500),
  };
}

export function hasNewerRelease(remote: RemoteReleaseInfo | null): boolean {
  if (!remote) return false;
  const local = getInstalledBuildMetadata();

  if (remote.buildNumber !== null && local.buildNumber > 0) {
    return remote.buildNumber > local.buildNumber;
  }

  if (remote.commitSha && local.commitShort && remote.commitSha !== local.commitShort) {
    const remoteMs = Date.parse(remote.publishedAt || '') || 0;
    if (local.buildMs === 0 || remoteMs > local.buildMs + 2 * 60 * 1000) {
      return true;
    }
  }

  return false;
}

class LiveSyncCoordinator {
  private snapshot: LiveSyncSnapshot;
  private listeners = new Set<(snap: LiveSyncSnapshot) => void>();
  private started = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastRevision: string | null = null;

  constructor() {
    const meta = getInstalledBuildMetadata();
    this.snapshot = {
      isNativeApk: isNativeAndroidShell(),
      apiBaseUrl: getApiBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : ''),
      connected: false,
      latencyMs: null,
      serverTimeIso: null,
      adDate: null,
      bsDate: null,
      dataRevision: null,
      installedVersion: meta.version,
      installedBuildNumber: meta.buildNumber,
      installedCommitShort: meta.commitShort,
      latestRelease: null,
      pendingApkUpdate: null,
      updateAvailable: false,
      autoUpdateEnabled: getStoredAutoUpdatePreference(),
      lastCheckedAt: null,
      checking: false,
      error: null,
    };
  }

  public getSnapshot(): LiveSyncSnapshot {
    return this.snapshot;
  }

  public subscribe(listener: (snap: LiveSyncSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(partial: Partial<LiveSyncSnapshot>) {
    this.snapshot = { ...this.snapshot, ...partial };
    for (const cb of this.listeners) {
      cb(this.snapshot);
    }
  }

  public setAutoUpdateEnabled(enabled: boolean) {
    setStoredAutoUpdatePreference(enabled);
    this.emit({ autoUpdateEnabled: enabled });
  }

  public async refreshPendingStatus(): Promise<PendingApkUpdateStatus | null> {
    if (!this.isNativeUpdaterAvailable()) return null;
    try {
      const pending = await this.getNativeUpdaterPlugin().getPendingUpdateStatus();
      this.emit({ pendingApkUpdate: pending });
      return pending;
    } catch {
      return null;
    }
  }

  public start() {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;

    void this.refreshPendingStatus();

    setTimeout(() => {
      void this.syncNow();
    }, 800);

    this.intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void this.syncNow();
      }
    }, 45_000);

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.refreshPendingStatus();
        void this.syncNow();
      }
    });

    window.addEventListener('online', () => {
      void this.syncNow();
    });
  }

  public async syncNow(force = false): Promise<LiveSyncSnapshot> {
    if (this.snapshot.checking) return this.snapshot;
    this.emit({ checking: true, error: null });

    const startMs = Date.now();
    let latestRelease: RemoteReleaseInfo | null = this.snapshot.latestRelease;
    let connected = false;
    let latencyMs: number | null = null;
    let serverTimeIso: string | null = null;
    let adDate: string | null = null;
    let bsDate: string | null = null;
    let dataRevision: string | null = null;
    let errorMsg: string | null = null;

    try {
      const endpoint = force ? '/api/app/sync-info?force=1' : '/api/app/sync-info';
      const apiRes = await fetch(endpoint, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      latencyMs = Math.max(1, Date.now() - startMs);

      if (apiRes.ok) {
        const data = await apiRes.json();
        connected = true;
        serverTimeIso = data.serverTimeIso || new Date().toISOString();
        adDate = data.adDate || null;
        bsDate = data.bsDate || null;
        dataRevision = data.dataRevision || null;

        if (data.latestRelease && typeof data.latestRelease === 'object') {
          latestRelease = {
            buildNumber:
              typeof data.latestRelease.buildNumber === 'number'
                ? data.latestRelease.buildNumber
                : null,
            commitSha: data.latestRelease.commitSha || '',
            tagName: data.latestRelease.tag_name || data.latestRelease.tagName || 'latest',
            releaseName: data.latestRelease.releaseName || 'SAARTHI Latest APK',
            publishedAt: data.latestRelease.publishedAt || '',
            apkDownloadUrl: data.latestRelease.apkDownloadUrl || data.apkDownloadUrl || DIRECT_APK_DOWNLOAD_URL,
            apkSizeBytes:
              typeof data.latestRelease.apkSizeBytes === 'number'
                ? data.latestRelease.apkSizeBytes
                : null,
            releaseNotes: data.latestRelease.releaseNotes || '',
          };
        }
      } else {
        errorMsg = `Server sync returned HTTP ${apiRes.status}`;
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Unable to reach SAARTHI live server';
    }

    // Connect directly to GitHub Releases inside native APK (silently in background) or when forced/missing
    if (this.snapshot.isNativeApk || force || !latestRelease || latestRelease.buildNumber === null) {
      try {
        const ghRes = await fetch(GITHUB_LATEST_RELEASE_URL, {
          cache: 'no-store',
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (ghRes.ok) {
          const parsed = parseGitHubReleasePayload(await ghRes.json());
          if (parsed) {
            const currentBuild = latestRelease?.buildNumber ?? -1;
            const ghBuild = parsed.buildNumber ?? -1;
            if (!latestRelease || ghBuild >= currentBuild) {
              latestRelease = parsed;
            }
          }
        }
      } catch {
        // Silent fallback if release feed is unreachable
      }
    }

    let pendingApkUpdate = this.snapshot.pendingApkUpdate;
    if (this.isNativeUpdaterAvailable()) {
      try {
        pendingApkUpdate = await this.getNativeUpdaterPlugin().getPendingUpdateStatus();
      } catch {
        // Keep prior pending status
      }
    }

    const updateAvailable = hasNewerRelease(latestRelease) || Boolean(pendingApkUpdate?.hasDownloadedApk && pendingApkUpdate?.isNewerThanInstalled);
    const revisionChanged =
      Boolean(dataRevision) && this.lastRevision !== null && this.lastRevision !== dataRevision;
    if (dataRevision) {
      this.lastRevision = dataRevision;
    }

    this.emit({
      isNativeApk: isNativeAndroidShell(),
      apiBaseUrl: getApiBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : ''),
      connected,
      latencyMs,
      serverTimeIso,
      adDate,
      bsDate,
      dataRevision,
      latestRelease,
      pendingApkUpdate,
      updateAvailable,
      lastCheckedAt: new Date().toISOString(),
      checking: false,
      error: connected ? null : errorMsg,
    });

    if (connected && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('saarthi:server-sync', {
          detail: {
            revisionChanged,
            dataRevision,
            serverTimeIso,
            updateAvailable,
          },
        })
      );
    }

    return this.snapshot;
  }

  public isNativeUpdaterAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('SaarthiUpdater');
    } catch {
      return false;
    }
  }

  public getNativeUpdaterPlugin(): SaarthiUpdaterPlugin {
    return NativeSaarthiUpdater;
  }
}

export const liveSyncEngine = new LiveSyncCoordinator();

export function openAppSyncModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('saarthi:open-app-sync'));
  }
}
