import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { isNativeAndroidShell } from '../../utils/apiClient';

interface UpdateInfo {
  latestBuild: number | null;
  latestCommitShort: string;
  tagName: string;
  downloadUrl: string;
  publishedAt: string;
}

const GITHUB_LATEST_RELEASE_URL = 'https://api.github.com/repos/sdxbyte/saarthi/releases/latest';
const DIRECT_APK_DOWNLOAD_URL = 'https://github.com/sdxbyte/saarthi/releases/latest/download/saarthi-latest.apk';

export const AppUpdateChecker: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isNativeAndroidShell()) return;

    let cancelled = false;
    const currentBuildNum = Number.parseInt(
      typeof __SAARTHI_BUILD_NUMBER__ !== 'undefined' ? __SAARTHI_BUILD_NUMBER__ : '0',
      10
    ) || 0;
    const currentShaShort = (typeof __SAARTHI_BUILD_SHA__ !== 'undefined' ? __SAARTHI_BUILD_SHA__ : '').slice(0, 7);
    const currentBuildMs = Date.parse(typeof __SAARTHI_BUILD_TIME__ !== 'undefined' ? __SAARTHI_BUILD_TIME__ : '') || 0;

    async function checkRelease() {
      try {
        const res = await fetch(GITHUB_LATEST_RELEASE_URL, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (!res.ok) return;
        const release = await res.json();
        if (cancelled || !release) return;

        const bodyText = typeof release.body === 'string' ? release.body : '';
        const buildMatch = bodyText.match(/CI Build\s*#(\d+)/i);
        const commitMatch = bodyText.match(/Commit:\s*([0-9a-f]{7,40})/i);

        const remoteBuildNum = buildMatch ? Number.parseInt(buildMatch[1], 10) : null;
        const remoteCommitShort = commitMatch ? commitMatch[1].slice(0, 7) : '';
        const remotePublishedMs = Date.parse(release.published_at || '') || 0;

        let hasNewer = false;
        if (remoteBuildNum !== null && currentBuildNum > 0) {
          hasNewer = remoteBuildNum > currentBuildNum;
        } else if (remoteCommitShort && currentShaShort && remoteCommitShort !== currentShaShort) {
          hasNewer = remotePublishedMs > currentBuildMs + 10 * 60 * 1000;
        }

        if (!hasNewer) return;

        const apkAsset = Array.isArray(release.assets)
          ? release.assets.find((a: any) => a?.name === 'saarthi-latest.apk' || (typeof a?.name === 'string' && a.name.endsWith('.apk')))
          : null;

        setUpdateAvailable({
          latestBuild: remoteBuildNum,
          latestCommitShort: remoteCommitShort,
          tagName: release.tag_name || 'latest',
          downloadUrl: apkAsset?.browser_download_url || DIRECT_APK_DOWNLOAD_URL,
          publishedAt: release.published_at || '',
        });
      } catch {
        // Silent fallback when offline or rate-limited
      }
    }

    const timer = setTimeout(checkRelease, 3500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!updateAvailable || dismissed) return null;

  return (
    <div
      className="fixed top-[calc(env(safe-area-inset-top)+4.25rem)] left-1/2 -translate-x-1/2 z-50 w-[min(94vw,460px)] rounded-xl border border-emerald-500/40 bg-[#0d1424]/95 backdrop-blur-md px-3.5 py-2.5 shadow-2xl flex items-center justify-between gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
          <RefreshCw className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            New SAARTHI APK Update Ready
            {updateAvailable.latestBuild ? ` (#${updateAvailable.latestBuild})` : ''}
          </p>
          <p className="text-[11px] text-slate-300 truncate">
            Synced with GitHub main
            {updateAvailable.latestCommitShort ? ` • ${updateAvailable.latestCommitShort}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href={updateAvailable.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-2.5 py-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Update
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss update notification"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
