import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ALLSITEHUB_SITES, ALLSITEHUB_CATEGORIES, ALLSITEHUB_REGIONS, AllSiteHubSite } from '../data/allSiteHubData';
import { recordAuditEventAsync } from './audit';
import NepaliDate from 'nepali-date-converter';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'allSiteHubLiveCache.json');
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export interface AllSiteHubSyncStatus {
  lastSyncIso: string;
  lastSyncAd: string;
  lastSyncBs: string;
  lastSyncTime: string;
  totalSites: number;
  newSitesCount: number;
  status: 'synced' | 'syncing' | 'error' | 'ready';
  lastError: string | null;
  triggerType: 'startup' | 'scheduled' | 'manual' | 'init';
  nextScheduledSyncIso: string;
  sourceUrl: string;
}

class AllSiteHubSyncEngine {
  private currentSites: AllSiteHubSite[] = [...ALLSITEHUB_SITES];
  private syncStatus: AllSiteHubSyncStatus = {
    lastSyncIso: new Date().toISOString(),
    lastSyncAd: new Date().toISOString().split('T')[0],
    lastSyncBs: '',
    lastSyncTime: new Date().toLocaleTimeString(),
    totalSites: ALLSITEHUB_SITES.length,
    newSitesCount: 0,
    status: 'ready',
    lastError: null,
    triggerType: 'init',
    nextScheduledSyncIso: new Date(Date.now() + SYNC_INTERVAL_MS).toISOString(),
    sourceUrl: 'https://www.allsitehub.site/',
  };
  private syncTimer: NodeJS.Timeout | null = null;
  private isSyncing = false;

  constructor() {
    this.computeBsDate();
    this.loadFromCache();
  }

  private computeBsDate() {
    try {
      const now = new Date();
      const nep = new NepaliDate(now);
      this.syncStatus.lastSyncBs = `${nep.getYear()}-${String(nep.getMonth() + 1).padStart(2, '0')}-${String(nep.getDate()).padStart(2, '0')}`;
    } catch {
      this.syncStatus.lastSyncBs = '2083-06-07';
    }
  }

  private loadFromCache() {
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.sites) && parsed.sites.length > 0) {
          this.currentSites = parsed.sites;
          if (parsed.status) {
            this.syncStatus = { ...this.syncStatus, ...parsed.status };
          }
          this.syncStatus.totalSites = this.currentSites.length;
          console.log(`[AllSiteHub Sync Engine] Loaded ${this.currentSites.length} cached sites from disk.`);
        }
      }
    } catch (e: any) {
      console.warn('[AllSiteHub Sync Engine] Cache load warning:', e.message);
    }
  }

  private saveToCache() {
    try {
      const payload = {
        sites: this.currentSites,
        status: this.syncStatus,
        savedAt: new Date().toISOString(),
      };
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e: any) {
      console.error('[AllSiteHub Sync Engine] Error saving cache to disk:', e.message);
    }
  }

  public getStatus(): AllSiteHubSyncStatus {
    return { ...this.syncStatus };
  }

  public getSites(): AllSiteHubSite[] {
    return [...this.currentSites];
  }

  public startPeriodicScheduler() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    // Run first sync shortly after startup
    setTimeout(() => {
      this.syncLiveData('startup').catch((e) =>
        console.warn('[AllSiteHub Sync Engine] Startup sync notice:', e.message)
      );
    }, 6000);

    // Run periodic sync every 6 hours
    this.syncTimer = setInterval(() => {
      console.log('[AllSiteHub Sync Engine] ⏰ Executing scheduled periodic directory check...');
      this.syncLiveData('scheduled').catch((e) =>
        console.warn('[AllSiteHub Sync Engine] Periodic check error:', e.message)
      );
    }, SYNC_INTERVAL_MS);

    console.log(`[AllSiteHub Sync Engine] ✅ Automated periodic check active (every ${SYNC_INTERVAL_MS / 3600000} hours).`);
  }

  public async syncLiveData(trigger: 'startup' | 'scheduled' | 'manual' = 'manual'): Promise<{
    success: boolean;
    totalSites: number;
    newSitesCount: number;
    message: string;
  }> {
    if (this.isSyncing) {
      return {
        success: false,
        totalSites: this.currentSites.length,
        newSitesCount: 0,
        message: 'Sync already in progress. Please wait.',
      };
    }

    this.isSyncing = true;
    this.syncStatus.status = 'syncing';
    this.syncStatus.triggerType = trigger;

    try {
      console.log(`[AllSiteHub Sync Engine] 📡 Fetching latest verified platforms from ${this.syncStatus.sourceUrl} (${trigger})...`);
      const html = await this.fetchRemoteHtml(this.syncStatus.sourceUrl);
      const parsedRemote = this.extractSitesFromHtml(html);

      let newCount = 0;
      let updatedCount = 0;

      if (parsedRemote.length > 0) {
        const existingMap = new Map<string, AllSiteHubSite>();
        this.currentSites.forEach((s) => existingMap.set(s.id, s));

        for (const remoteSite of parsedRemote) {
          if (!existingMap.has(remoteSite.id)) {
            existingMap.set(remoteSite.id, remoteSite);
            newCount++;
          } else {
            const existing = existingMap.get(remoteSite.id)!;
            if (existing.url !== remoteSite.url || existing.domain !== remoteSite.domain) {
              existingMap.set(remoteSite.id, { ...existing, ...remoteSite });
              updatedCount++;
            }
          }
        }

        // Preserve custom and Nepali broadcast channels
        ALLSITEHUB_SITES.filter((s) => s.id.startsWith('np_')).forEach((npSite) => {
          if (!existingMap.has(npSite.id)) {
            existingMap.set(npSite.id, npSite);
          }
        });

        this.currentSites = Array.from(existingMap.values());
      }

      const now = new Date();
      this.computeBsDate();
      this.syncStatus.lastSyncIso = now.toISOString();
      this.syncStatus.lastSyncAd = now.toISOString().split('T')[0];
      this.syncStatus.lastSyncTime = now.toLocaleTimeString();
      this.syncStatus.totalSites = this.currentSites.length;
      this.syncStatus.newSitesCount = newCount;
      this.syncStatus.status = 'synced';
      this.syncStatus.lastError = null;
      this.syncStatus.nextScheduledSyncIso = new Date(now.getTime() + SYNC_INTERVAL_MS).toISOString();

      this.saveToCache();

      // Record immutable audit event
      await recordAuditEventAsync(
        'SYSTEM_EVENT',
        'ALLSITEHUB_DIRECTORY_AUTO_SYNC',
        {
          trigger,
          totalSites: this.currentSites.length,
          newSitesFound: newCount,
          updatedSitesCount: updatedCount,
          source: this.syncStatus.sourceUrl,
          lastSyncAd: this.syncStatus.lastSyncAd,
          lastSyncBs: this.syncStatus.lastSyncBs,
        },
        'ALLSITEHUB_SYNC_ENGINE',
        'allsitehub.site',
        'LOW'
      );

      console.log(`[AllSiteHub Sync Engine] ✅ Successfully synced directory! Total sites: ${this.currentSites.length} (+${newCount} new, ${updatedCount} updated).`);

      return {
        success: true,
        totalSites: this.currentSites.length,
        newSitesCount: newCount,
        message: `Successfully verified and synced ${this.currentSites.length} platforms (${newCount} new, ${updatedCount} updated).`,
      };
    } catch (err: any) {
      console.error('[AllSiteHub Sync Engine] ❌ Sync error:', err.message);
      this.syncStatus.status = 'error';
      this.syncStatus.lastError = err.message || 'Unknown network error during sitehub sync';

      return {
        success: false,
        totalSites: this.currentSites.length,
        newSitesCount: 0,
        message: `Sync failed: ${this.syncStatus.lastError}. Using verified cached directory.`,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  private fetchRemoteHtml(targetUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(targetUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      };

      const req = https.request(options, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return this.fetchRemoteHtml(res.headers.location).then(resolve).catch(reject);
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timeout while reaching allsitehub.site'));
      });

      req.end();
    });
  }

  private extractSitesFromHtml(html: string): AllSiteHubSite[] {
    const sites: AllSiteHubSite[] = [];
    try {
      const regex = /self\.__next_f\.push\(\[1,\"(.*?)\"\]\)/gs;
      let match;
      let fullDecoded = '';

      while ((match = regex.exec(html)) !== null) {
        try {
          const chunk = match[1];
          // Basic JSON unescaping
          const unescaped = chunk
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
          fullDecoded += unescaped;
        } catch {
          // ignore chunk
        }
      }

      const sitesMatch = fullDecoded.match(/\"sites\":\[(.*?)\]\,\"categories\"/);
      if (sitesMatch && sitesMatch[1]) {
        const rawJson = '[' + sitesMatch[1] + ']';
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e: any) {
      console.warn('[AllSiteHub Sync Engine] Stream parsing fallback notice:', e.message);
    }
    return sites;
  }
}

export const allSiteHubSyncEngine = new AllSiteHubSyncEngine();
