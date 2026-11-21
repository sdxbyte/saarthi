import express from 'express';
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

  // Periodic continuous GitHub connectivity and sync pulse every 15 minutes
  setInterval(async () => {
    try {
      const pulse = await verifyGitHubConnection();
      if (pulse.success) {
        console.log(`[SAARTHI Continuous Sync] ✅ PAT Active (${pulse.user}) | SHA: ${pulse.latestCommitSha?.slice(0, 7) || 'HEAD'}`);
      }
    } catch {}
  }, 15 * 60 * 1000);

  // Initialize automated periodic check & update for AllSiteHub Directory
  allSiteHubSyncEngine.startPeriodicScheduler();

  // Vite Middleware for Dev / Static Files for Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saarthi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
