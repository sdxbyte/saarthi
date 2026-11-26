import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  PackageCheck,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import {
  liveSyncEngine,
  LiveSyncSnapshot,
  openAppSyncModal,
} from '../../utils/liveSyncEngine';
import { triggerHaptic } from '../../utils/appFeedback';

const AUTO_DOWNLOADED_BUILD_KEY = 'saarthi_auto_downloaded_build_v2';

type InstallStage =
  | 'idle'
  | 'downloading'
  | 'downloaded_ready'
  | 'installing'
  | 'permission_required'
  | 'error';

export const AppUpdateChecker: React.FC = () => {
  const [sync, setSync] = useState<LiveSyncSnapshot>(() => liveSyncEngine.getSnapshot());
  const [minimized, setMinimized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState<number>(0);
  const [installStage, setInstallStage] = useState<InstallStage>('idle');
  const [installMessage, setInstallMessage] = useState<string>('');
  const [signatureMismatch, setSignatureMismatch] = useState<boolean>(false);

  const pendingPermissionReturnRef = useRef<boolean>(false);
  const autoInstallPromptedBuildRef = useRef<string>('');

  const remoteBuildKey = String(
    sync.latestRelease?.buildNumber ||
      sync.latestRelease?.commitSha ||
      sync.pendingApkUpdate?.buildNumber ||
      sync.pendingApkUpdate?.versionCode ||
      ''
  );

  useEffect(() => {
    liveSyncEngine.start();
    const unsub = liveSyncEngine.subscribe(setSync);

    const onOpenModal = () => setModalOpen(true);
    window.addEventListener('saarthi:open-app-sync', onOpenModal);

    let progressHandle: { remove: () => Promise<void> } | null = null;
    if (liveSyncEngine.isNativeUpdaterAvailable()) {
      void liveSyncEngine
        .getNativeUpdaterPlugin()
        .addListener('downloadProgress', (ev) => {
          setDownloadPercent(Math.max(0, Math.min(100, ev.percent || 0)));
          setInstallStage(ev.stage || 'downloading');
          if (typeof ev.signatureMatches === 'boolean') {
            setSignatureMismatch(!ev.signatureMatches);
          }
          if (ev.message) setInstallMessage(ev.message);
          if (ev.stage === 'downloaded_ready') {
            setMinimized(false);
            setDownloading(false);
          } else if (
            ev.stage === 'installing' ||
            ev.stage === 'permission_required' ||
            ev.stage === 'error'
          ) {
            setDownloading(false);
          }
        })
        .then((handle) => {
          progressHandle = handle;
        })
        .catch(() => {
          // Ignore listener registration error outside native shell
        });
    }

    return () => {
      unsub();
      window.removeEventListener('saarthi:open-app-sync', onOpenModal);
      if (progressHandle) {
        void progressHandle.remove();
      }
    };
  }, []);

  // Re-sync pre-downloaded state from native cache whenever snapshot updates
  useEffect(() => {
    const pending = sync.pendingApkUpdate;
    if (pending?.hasDownloadedApk && pending.isNewerThanInstalled && !downloading) {
      setSignatureMismatch(!pending.signatureMatches);
      if (!pending.canInstallPackages) {
        setInstallStage('permission_required');
        setInstallMessage(
          'Update APK is downloaded and ready. Allow "Install unknown apps" once to install.'
        );
      } else if (installStage === 'idle' || installStage === 'downloading' || installStage === 'permission_required') {
        setInstallStage('downloaded_ready');
        setDownloadPercent(100);
        setInstallMessage(
          pending.signatureMatches
            ? 'New SAARTHI update is downloaded and waiting — tap Install Update.'
            : 'Update APK is downloaded and ready. Tap Install Update (note: different release key may prompt reinstall).'
        );
      }
    }
  }, [sync.pendingApkUpdate, downloading, installStage]);

  // If user returned from Android's "Allow from this source" screen, immediately launch the installer
  useEffect(() => {
    if (!sync.isNativeApk || !liveSyncEngine.isNativeUpdaterAvailable()) return;

    const handleResumeCheck = async () => {
      if (document.visibilityState === 'hidden') return;
      const pending = await liveSyncEngine.refreshPendingStatus();
      if (
        pendingPermissionReturnRef.current &&
        pending?.hasDownloadedApk &&
        pending.isNewerThanInstalled &&
        pending.canInstallPackages
      ) {
        pendingPermissionReturnRef.current = false;
        void launchCachedInstaller();
      }
    };

    const onVisibility = () => {
      void handleResumeCheck();
    };
    const onFocus = () => {
      void handleResumeCheck();
    };

    window.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [sync.isNativeApk]);

  const launchCachedInstaller = async () => {
    if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
    triggerHaptic('medium');
    try {
      const plugin = liveSyncEngine.getNativeUpdaterPlugin();
      const res = await plugin.installDownloadedApk();
      if (typeof res?.signatureMatches === 'boolean') {
        setSignatureMismatch(!res.signatureMatches);
      }
      if (res?.needsPermission) {
        pendingPermissionReturnRef.current = true;
        setInstallStage('permission_required');
        setInstallMessage(
          'Enable "Allow from this source" for SAARTHI in Android Settings, then return here to install immediately.'
        );
      } else {
        setInstallStage('installing');
        setInstallMessage('Android installer opened — tap Update/Install to complete.');
      }
    } catch {
      // Cache may have been cleared by OS — re-download smoothly
      await triggerApkDownloadOrInstall(false, true);
    }
  };

  const triggerApkDownloadOrInstall = async (isAuto = false, forceDownload = false) => {
    const apkUrl =
      sync.latestRelease?.apkDownloadUrl ||
      'https://github.com/sdxbyte/saarthi/releases/latest/download/saarthi-latest.apk';

    if (liveSyncEngine.isNativeUpdaterAvailable()) {
      // Fast path: if already pre-downloaded & valid on disk and user tapped Install, launch installer immediately!
      if (
        !forceDownload &&
        !isAuto &&
        sync.pendingApkUpdate?.hasDownloadedApk &&
        sync.pendingApkUpdate.isNewerThanInstalled
      ) {
        await launchCachedInstaller();
        return;
      }

      try {
        setMinimized(false);
        setDownloading(true);
        setDownloadPercent(0);
        setInstallStage('downloading');
        setInstallMessage(
          isAuto
            ? 'Downloading new SAARTHI update in the background...'
            : 'Downloading latest SAARTHI APK...'
        );

        const plugin = liveSyncEngine.getNativeUpdaterPlugin();
        const shouldAutoLaunch =
          !isAuto || autoInstallPromptedBuildRef.current !== remoteBuildKey;
        if (isAuto && remoteBuildKey) {
          autoInstallPromptedBuildRef.current = remoteBuildKey;
        }

        const result = await plugin.downloadAndInstallApk({
          url: apkUrl,
          buildNumber: sync.latestRelease?.buildNumber ?? undefined,
          commitSha: sync.latestRelease?.commitSha || undefined,
          tagName: sync.latestRelease?.tagName || undefined,
          autoInstall: shouldAutoLaunch,
        });

        await liveSyncEngine.refreshPendingStatus();

        if (typeof result?.signatureMatches === 'boolean') {
          setSignatureMismatch(!result.signatureMatches);
        }

        setDownloading(false);
        setDownloadPercent(100);

        if (result?.needsPermission) {
          setInstallStage('permission_required');
          setInstallMessage(
            'Update downloaded & ready! Tap "Allow & Install" to enable app installs once.'
          );
        } else if (result?.started) {
          setInstallStage('installing');
          setInstallMessage(
            'Update downloaded & installer launched. Tap Install/Update when prompted (or tap Install Update below anytime).'
          );
        } else {
          setInstallStage('downloaded_ready');
          setInstallMessage('Update downloaded and ready! Tap Install Update whenever you are ready.');
        }
      } catch (err: any) {
        setDownloading(false);
        setInstallStage('error');
        setInstallMessage(err?.message || 'In-app download failed. Tap Retry to download APK.');
      }
      return;
    }

    // Browser / fallback direct download without leaving blank popups
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'saarthi-latest.apk';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Automatically download every new release in the background inside standalone Android APK
  useEffect(() => {
    if (!sync.isNativeApk || !sync.updateAvailable || !sync.autoUpdateEnabled) return;
    if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
    if (downloading) return;
    if (!remoteBuildKey) return;

    // If native cache already holds this downloaded update, do NOT re-download
    const pending = sync.pendingApkUpdate;
    if (
      pending?.hasDownloadedApk &&
      pending.isNewerThanInstalled &&
      ((sync.latestRelease?.buildNumber && pending.buildNumber === sync.latestRelease.buildNumber) ||
        (sync.latestRelease?.commitSha && pending.commitSha === sync.latestRelease.commitSha))
    ) {
      return;
    }

    try {
      const alreadyAttempted = window.localStorage.getItem(AUTO_DOWNLOADED_BUILD_KEY);
      if (alreadyAttempted === remoteBuildKey) return;
      window.localStorage.setItem(AUTO_DOWNLOADED_BUILD_KEY, remoteBuildKey);
    } catch {
      return;
    }

    void triggerApkDownloadOrInstall(true);
  }, [
    sync.isNativeApk,
    sync.updateAvailable,
    sync.autoUpdateEnabled,
    sync.latestRelease,
    sync.pendingApkUpdate,
    remoteBuildKey,
    downloading,
  ]);

  const handleToggleAutoUpdate = () => {
    triggerHaptic('light');
    liveSyncEngine.setAutoUpdateEnabled(!sync.autoUpdateEnabled);
  };

  const handleOpenUnknownPermission = async () => {
    if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
    triggerHaptic('medium');
    pendingPermissionReturnRef.current = true;
    try {
      await liveSyncEngine.getNativeUpdaterPlugin().requestInstallPermission();
    } catch {
      pendingPermissionReturnRef.current = false;
    }
  };

  const formatBytes = (bytes: number | null | undefined) => {
    if (!bytes || bytes <= 0) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const hasReadyApk = Boolean(
    sync.pendingApkUpdate?.hasDownloadedApk && sync.pendingApkUpdate.isNewerThanInstalled
  );
  const displayBytes =
    sync.pendingApkUpdate?.fileSize || sync.latestRelease?.apkSizeBytes || null;

  return (
    <>
      {/* Thumb-First In-APK Update Sheet (Sits cleanly above MobileBottomNav) */}
      {sync.isNativeApk && (sync.updateAvailable || hasReadyApk) && !minimized && (
        <div
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-50 w-[min(94vw,460px)] rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md p-3.5 shadow-2xl space-y-2.5 text-slate-900 dark:text-white"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <span
                className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl ${
                  hasReadyApk
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {hasReadyApk ? (
                  <PackageCheck className="w-5 h-5" />
                ) : (
                  <RefreshCw className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} />
                )}
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0B1F3A] dark:text-white truncate">
                  {hasReadyApk
                    ? 'SAARTHI Update Downloaded & Ready'
                    : downloading
                    ? 'Downloading SAARTHI Update...'
                    : 'New SAARTHI Update Available'}
                  {sync.latestRelease?.buildNumber ? ` (#${sync.latestRelease.buildNumber})` : ''}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                  {sync.latestRelease?.tagName || 'latest'}
                  {sync.latestRelease?.commitSha ? ` · ${sync.latestRelease.commitSha}` : ''}
                  {displayBytes ? ` · ${formatBytes(displayBytes)}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label="App Sync and Auto-Update Settings"
                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Hide update prompt until later"
                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {downloading && (
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="w-full h-full block">
                  <rect
                    x="0"
                    y="0"
                    width={Math.max(4, Math.min(100, downloadPercent))}
                    height="6"
                    className="fill-blue-600 dark:fill-blue-400"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{installMessage || 'Downloading package...'}</span>
                <span>{downloadPercent}%</span>
              </div>
            </div>
          )}

          {!downloading && installMessage && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              {installMessage}
            </p>
          )}

          {signatureMismatch && hasReadyApk && (
            <div className="flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Signing key changed on CI; if Android rejects in-place update, uninstall old APK once before tapping Install.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            {installStage === 'permission_required' && !sync.pendingApkUpdate?.canInstallPackages ? (
              <button
                type="button"
                onClick={handleOpenUnknownPermission}
                className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs px-3 transition-transform active:scale-[0.98] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Allow &amp; Install Update</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={downloading}
                onClick={() => void triggerApkDownloadOrInstall(false)}
                className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-xs px-3 transition-transform active:scale-[0.98] cursor-pointer"
              >
                {hasReadyApk ? <PackageCheck className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>
                  {downloading
                    ? `Downloading ${downloadPercent}%`
                    : hasReadyApk
                    ? 'Install Downloaded Update'
                    : 'Download & Install'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* App Sync & In-APK Auto-Update Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saarthi-sync-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 id="saarthi-sync-modal-title" className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                    SAARTHI App Sync &amp; Auto-Update
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {sync.isNativeApk
                      ? 'Native Android App (Local Bundle + Live Server Sync)'
                      : 'Web Platform + Android APK Distribution'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Server Real-Time Sync Block */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Live Server Endpoint</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 truncate">
                    {sync.apiBaseUrl || 'https://saarthi.dpdns.org'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Sync State</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {sync.connected
                      ? `Synced (${sync.latencyMs ?? 0}ms)`
                      : sync.checking
                      ? 'Syncing...'
                      : sync.error || 'Standby'}
                  </span>
                </div>
                {sync.bsDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Server Dual Date</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {sync.bsDate} · {sync.adDate} AD
                    </span>
                  </div>
                )}
              </div>

              {/* Build & GitHub Release Block */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Installed App Build</span>
                  <span className="font-mono text-[#0B1F3A] dark:text-white font-semibold">
                    v{sync.installedVersion}
                    {sync.installedBuildNumber > 0 ? ` (#${sync.installedBuildNumber})` : ''}
                    {sync.installedCommitShort ? ` · ${sync.installedCommitShort}` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Latest GitHub Release</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {sync.latestRelease
                      ? `Build #${sync.latestRelease.buildNumber ?? 'latest'}${
                          sync.latestRelease.commitSha ? ` · ${sync.latestRelease.commitSha}` : ''
                        }`
                      : 'Checking...'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Update Status</span>
                  {hasReadyApk ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <PackageCheck className="w-3.5 h-3.5" />
                      Downloaded &amp; Ready
                    </span>
                  ) : sync.updateAvailable ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                      <Download className="w-3.5 h-3.5" />
                      New APK Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Up to Date
                    </span>
                  )}
                </div>
              </div>

              {/* Auto-Update Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] p-3.5">
                <div className="pr-3">
                  <p className="font-medium text-[#0B1F3A] dark:text-white">
                    Auto-Download Updates in Background
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pre-downloads new APK releases automatically and prompts Android Installer when ready.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sync.autoUpdateEnabled}
                  onClick={handleToggleAutoUpdate}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    sync.autoUpdateEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sync.autoUpdateEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {downloading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span>Downloading APK update...</span>
                    <span className="font-mono">{downloadPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-full block">
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(4, Math.min(100, downloadPercent))}
                        height="8"
                        className="fill-emerald-500"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {installMessage && (
                <p className="text-[11px] text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  {installMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  disabled={sync.checking}
                  onClick={() => void liveSyncEngine.syncNow(true)}
                  className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0B1F3A] dark:text-white font-medium py-2.5 px-3 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${sync.checking ? 'animate-spin' : ''}`} />
                  {sync.checking ? 'Checking...' : 'Check for Updates'}
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void triggerApkDownloadOrInstall(false)}
                  className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {hasReadyApk ? <PackageCheck className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  {hasReadyApk
                    ? 'Install Ready APK'
                    : sync.isNativeApk
                    ? 'Download & Install'
                    : 'Download Latest APK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { openAppSyncModal };
