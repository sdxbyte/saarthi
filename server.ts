import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './src/serverApp';
import { getSqliteDb, migrateLegacyJsonToDb } from './src/db/persistentStore';
import { loadServerGitHubConfig, verifyGitHubConnection } from './src/services/githubSyncService';
import { allSiteHubSyncEngine } from './src/services/allSiteHubSyncService';

const PORT = 3000;

async function startServer() {
  console.log('[SAARTHI Datastore] Configured Mode: $0-Cost GitHub Repository State Authority (sdxbyte/saarthi)');
  try {
    getSqliteDb();
    const hydrationStats = migrateLegacyJsonToDb();
    console.log('[SAARTHI Datastore] State hydrated from GitHub repository state authority JSONs:', hydrationStats);
  } catch (err) {
    console.error('[SAARTHI Datastore] Hydration initialization notice:', err);
  }

  // Verify persistent GitHub PAT connection on startup (non-blocking optional integration)
  setTimeout(async () => {
    try {
      const cfg = loadServerGitHubConfig();
      if (!cfg) {
        console.log('[SAARTHI GitHub Engine] Standby: No server-side GitHub PAT configured.');
        return;
      }
      const ghCheck = await verifyGitHubConnection();
      if (ghCheck.success) {
        console.log(`[SAARTHI GitHub Engine] Verified Active PAT for user: ${ghCheck.user}, repo access: ${ghCheck.repoAccess}`);
      } else {
        console.log('[SAARTHI GitHub Engine] Standby: Server-side GitHub auto-sync inactive (update PAT in Admin Command Center to enable automatic sync).');
      }
    } catch {
      console.log('[SAARTHI GitHub Engine] Standby: Startup verification skipped.');
    }
  }, 2000);

  // Periodic continuous GitHub connectivity pulse every 15 minutes
  setInterval(async () => {
    try {
      const pulse = await verifyGitHubConnection();
      if (pulse.success) {
        console.log(`[SAARTHI Continuous Sync] ✅ PAT Active (${pulse.user}) | SHA: ${pulse.latestCommitSha?.slice(0, 7) || 'HEAD'}`);
      }
    } catch {}
  }, 15 * 60 * 1000);

  // Daily GitHub Repository & APK Sync Scheduler (runs every 24 hours)
  const runDailyGitHubSync = async () => {
    try {
      const cfg = loadServerGitHubConfig();
      if (!cfg?.githubToken) return;
      const check = await verifyGitHubConnection();
      if (!check.success) return;

      // Trigger daily APK & deployment workflow synchronization via GitHub Actions API
      const owner = cfg.githubUser || 'sdxbyte';
      const repo = cfg.repoName || 'saarthi';
      const branch = cfg.branch || 'main';
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/build-playstore-aab.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfg.githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'SAARTHI-Daily-Scheduler',
          },
          body: JSON.stringify({ ref: branch }),
        }
      ).catch(() => {});

      console.log(`[SAARTHI Daily Sync] 🗓️ Daily GitHub & APK workflow sync pulse completed (${owner}/${repo}@${branch}).`);
    } catch {
      // Keep daily scheduler resilient across transient network drops
    }
  };
  setInterval(runDailyGitHubSync, 24 * 60 * 60 * 1000);

  // Initialize automated periodic check & update for AllSiteHub Directory
  allSiteHubSyncEngine.startPeriodicScheduler();

  const httpServer = http.createServer(app);

  // Vite Middleware for Dev / Static Files for Prod
  if (process.env.NODE_ENV !== 'production') {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    if (hmrDisabled) {
      app.get('/@vite/client', (_req, res) => {
        res.type('application/javascript').send(
          [
            'const sheetsMap = new Map();',
            'export class ErrorOverlay extends HTMLElement {}',
            'export function createHotContext() {',
            '  return { data: {}, accept() {}, prune() {}, dispose() {}, invalidate() {}, decline() {}, on() {}, off() {}, send() {} };',
            '}',
            'export function injectQuery(url) { return url; }',
            'export function updateStyle(id, content) {',
            '  let style = sheetsMap.get(id);',
            '  if (!style) {',
            '    style = document.createElement("style");',
            '    style.setAttribute("type", "text/css");',
            '    style.setAttribute("data-vite-dev-id", id);',
            '    document.head.appendChild(style);',
            '  }',
            '  style.textContent = content;',
            '  sheetsMap.set(id, style);',
            '}',
            'export function removeStyle(id) {',
            '  const style = sheetsMap.get(id);',
            '  if (style) {',
            '    style.remove();',
            '    sheetsMap.delete(id);',
            '  }',
            '}',
          ].join('\n')
        );
      });
    }

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: hmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Saarthi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
