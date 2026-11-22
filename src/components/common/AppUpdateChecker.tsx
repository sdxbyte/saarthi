import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
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

const AUTO_TRIGGERED_BUILD_KEY = 'saarthi_auto_triggered_build_v1';

export const AppUpdateChecker: React.FC = () => {
  const [sync, setSync] = useState<LiveSyncSnapshot>(() => liveSyncEngine.getSnapshot());
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState<number>(0);
  const [installStage, setInstallStage] = useState<
    'idle' | 'downloading' | 'installing' | 'permission_required' | 'error'
  >('idle');
  const [installMessage, setInstallMessage] = useState<string>('');

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
          if (ev.message) setInstallMessage(ev.message);
          if (ev.stage === 'installing' || ev.stage === 'permission_required' || ev.stage === 'error') {
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

  const triggerApkInstall = async (isAuto = false) => {
    const apkUrl =
      sync.latestRelease?.apkDownloadUrl ||
      'https://github.com/sdxbyte/saarthi/releases/latest/download/saarthi-latest.apk';

    if (liveSyncEngine.isNativeUpdaterAvailable()) {
      try {
        setDismissed(false);
        setDownloading(true);
        setDownloadPercent(0);
        setInstallStage('downloading');
        setInstallMessage(
          isAuto
            ? 'Auto-downloading latest SAARTHI APK update...'
            : 'Downloading latest SAARTHI APK...'
        );

        const plugin = liveSyncEngine.getNativeUpdaterPlugin();
        const result = await plugin.downloadAndInstallApk({ url: apkUrl });
        if (result?.needsPermission) {
          setDownloading(false);
          setInstallStage('permission_required');
          setInstallMessage(
            'Allow "Install unknown apps" for SAARTHI in Android Settings, then tap Install Update again.'
          );
        } else {
          setDownloading(false);
          setInstallStage('installing');
          setInstallMessage('APK ready. Confirm Android installation prompt to finish updating.');
        }
      } catch (err: any) {
        setDownloading(false);
        setInstallStage('error');
        setInstallMessage(err?.message || 'In-app update failed. Try direct APK download.');
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

  // Auto-update trigger inside standalone Android APK when enabled
  useEffect(() => {
    if (!sync.isNativeApk || !sync.updateAvailable || !sync.autoUpdateEnabled) return;
    if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
    if (downloading) return;

    const remoteKey = String(
      sync.latestRelease?.buildNumber || sync.latestRelease?.commitSha || ''
    );
    if (!remoteKey) return;

    try {
      const alreadyTriggered = window.localStorage.getItem(AUTO_TRIGGERED_BUILD_KEY);
      if (alreadyTriggered === remoteKey) return;
      window.localStorage.setItem(AUTO_TRIGGERED_BUILD_KEY, remoteKey);
    } catch {
      return;
    }

    void triggerApkInstall(true);
  }, [sync.isNativeApk, sync.updateAvailable, sync.autoUpdateEnabled, sync.latestRelease]);

  const handleToggleAutoUpdate = () => {
    liveSyncEngine.setAutoUpdateEnabled(!sync.autoUpdateEnabled);
  };

  const handleOpenUnknownPermission = async () => {
    if (!liveSyncEngine.isNativeUpdaterAvailable()) return;
    try {
      await liveSyncEngine.getNativeUpdaterPlugin().requestInstallPermission();
    } catch {
      // Ignore if Android settings screen could not be opened
    }
  };

  const formatBytes = (bytes: number | null | undefined) => {
    if (!bytes || bytes <= 0) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <>
      {/* In-APK Floating Update Notification Banner */}
      {sync.isNativeApk && sync.updateAvailable && !dismissed && (
        <div
          className="fixed top-[calc(env(safe-area-inset-top)+4.25rem)] left-1/2 -translate-x-1/2 z-50 w-[min(94vw,480px)] rounded-xl border border-emerald-500/40 bg-[#0d1424]/95 backdrop-blur-md px-3.5 py-3 shadow-2xl space-y-2.5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <RefreshCw className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  New SAARTHI APK Update Ready
                  {sync.latestRelease?.buildNumber ? ` (#${sync.latestRelease.buildNumber})` : ''}
                </p>
                <p className="text-[11px] text-slate-300 truncate">
                  GitHub main synced
                  {sync.latestRelease?.commitSha ? ` • ${sync.latestRelease.commitSha}` : ''}
                  {sync.latestRelease?.apkSizeBytes
                    ? ` • ${formatBytes(sync.latestRelease.apkSizeBytes)}`
                    : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {installStage === 'permission_required' ? (
                <button
                  type="button"
                  onClick={handleOpenUnknownPermission}
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Allow Install
                </button>
              ) : (
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void triggerApkInstall(false)}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-semibold text-xs px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? `${downloadPercent}%` : 'Update'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label="App Sync and Auto-Update Settings"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss update notification"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {(downloading || installMessage) && (
            <div className="space-y-1">
              {downloading && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-200"
                    style={{ width: `${Math.max(4, downloadPercent)}%` }}
                  />
                </div>
              )}
              {installMessage && (
                <p className="text-[11px] text-slate-300 leading-snug">{installMessage}</p>
              )}
            </div>
          )}
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
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] text-white shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 id="saarthi-sync-modal-title" className="text-sm font-semibold text-white">
                    SAARTHI App Sync &amp; Auto-Update
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    {sync.isNativeApk
                      ? 'Standalone Android App (Local UI + Live Server Sync)'
                      : 'Web Platform + Android APK Distribution'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Server Real-Time Sync Block */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Live Server Endpoint</span>
                  <span className="font-mono text-emerald-400">
                    {sync.apiBaseUrl || 'https://saarthi.dpdns.org'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Sync State</span>
                  <span className="font-mono text-zinc-200">
                    {sync.connected
                      ? `Synced (${sync.latencyMs ?? 0}ms)`
                      : sync.checking
                      ? 'Syncing...'
                      : sync.error || 'Standby'}
                  </span>
                </div>
                {sync.bsDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Server Dual Date</span>
                    <span className="font-mono text-zinc-300">
                      {sync.bsDate} · {sync.adDate} AD
                    </span>
                  </div>
                )}
              </div>

              {/* Build & GitHub Release Block */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Installed App Build</span>
                  <span className="font-mono text-white">
                    v{sync.installedVersion}
                    {sync.installedBuildNumber > 0 ? ` (#${sync.installedBuildNumber})` : ''}
                    {sync.installedCommitShort ? ` · ${sync.installedCommitShort}` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Latest GitHub Release</span>
                  <span className="font-mono text-zinc-200">
                    {sync.latestRelease
                      ? `Build #${sync.latestRelease.buildNumber ?? 'latest'}${
                          sync.latestRelease.commitSha
                            ? ` · ${sync.latestRelease.commitSha}`
                            : ''
                        }`
                      : 'Checking...'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-400">Update Status</span>
                  {sync.updateAvailable ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <Download className="w-3.5 h-3.5" />
                      New APK Update Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Up to Date
                    </span>
                  )}
                </div>
              </div>

              {/* Auto-Update Toggle (Especially for Non-Play Store Sideloaded APK) */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="pr-3">
                  <p className="font-medium text-white">Auto-Update App Inside APK</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Automatically downloads and prompts Android installer whenever GitHub builds a newer APK.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sync.autoUpdateEnabled}
                  onClick={handleToggleAutoUpdate}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    sync.autoUpdateEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
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
                  <div className="flex justify-between text-[11px] text-zinc-300">
                    <span>Downloading APK update...</span>
                    <span className="font-mono">{downloadPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-200"
                      style={{ width: `${Math.max(4, downloadPercent)}%` }}
                    />
                  </div>
                </div>
              )}

              {installMessage && (
                <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  {installMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  disabled={sync.checking}
                  onClick={() => void liveSyncEngine.syncNow()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium py-2.5 px-3 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${sync.checking ? 'animate-spin' : ''}`} />
                  {sync.checking ? 'Syncing...' : 'Sync & Check Now'}
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void triggerApkInstall(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 px-3 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  {sync.isNativeApk ? 'Download & Install APK' : 'Download Latest APK'}
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
