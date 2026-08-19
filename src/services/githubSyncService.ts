import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { formatDualDate } from '../utils/bsAdConverter';

export type SyncState =
  | 'IDLE'
  | 'PREPARING'
  | 'VALIDATING'
  | 'SCANNING'
  | 'SYNCING'
  | 'VERIFYING'
  | 'SUCCESS'
  | 'FAILED'
  | 'RETRYING';

export interface GitHubSyncConfig {
  githubToken: string;
  githubUser: string;
  repoName: string;
  repoUrl: string;
  branch: string;
  ownerEmail: string;
  lastConnectedAt?: string;
}

export interface SyncLockStatus {
  locked: boolean;
  state: SyncState;
  syncId?: string;
  startedAt?: string;
  message?: string;
}

export interface SecretScanResult {
  passed: boolean;
  detectedSecrets: { path: string; reason: string }[];
}

export interface RemoteVerificationResult {
  verified: boolean;
  commitExists: boolean;
  commitShaMatched: boolean;
  remoteStructureOk: boolean;
  details: string;
}

export interface FullSyncResult {
  success: boolean;
  syncId: string;
  state: SyncState;
  commitSha?: string;
  repoUrl: string;
  branch: string;
  message: string;
  remoteVerification?: RemoteVerificationResult;
  filesCount?: number;
  retryCount: number;
}

const CREDENTIALS_FILE = path.join(process.cwd(), 'docs', 'github-credentials.json');

// Global Atomic Lock
let currentSyncLock: SyncLockStatus = {
  locked: false,
  state: 'IDLE',
};

export function getSyncLockStatus(): SyncLockStatus {
  return { ...currentSyncLock };
}

export function loadServerGitHubConfig(): GitHubSyncConfig | null {
  // Precedence 1: Environment Variables / Secret Manager (Primary Authoritative Source)
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 5) {
    return {
      githubToken: token.trim(),
      githubUser: process.env.GITHUB_OWNER || 'sdxbyte',
      repoName: process.env.GITHUB_REPOSITORY || 'saarthi',
      repoUrl: `https://github.com/${process.env.GITHUB_OWNER || 'sdxbyte'}/${process.env.GITHUB_REPOSITORY || 'saarthi'}`,
      branch: process.env.GITHUB_BRANCH || 'main',
      ownerEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'sudipadhikari8107@gmail.com',
      lastConnectedAt: new Date().toISOString(),
    };
  }

  // Precedence 2: Server-side JSON persistent file (Local/Docker fallback)
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
      if (data && data.githubToken && typeof data.githubToken === 'string' && data.githubToken.trim().length > 5) {
        return {
          githubToken: data.githubToken.trim(),
          githubUser: data.githubUser || 'sdxbyte',
          repoName: data.repoName || 'saarthi',
          repoUrl: data.repoUrl || 'https://github.com/sdxbyte/saarthi',
          branch: data.branch || 'main',
          ownerEmail: data.ownerEmail || 'sudipadhikari8107@gmail.com',
          lastConnectedAt: data.lastConnectedAt || new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    console.warn('[GitHub Sync Service] Failed to read credentials file:', e);
  }

  return null;
}

export function saveServerGitHubConfig(config: GitHubSyncConfig): void {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getMaskedGitHubConfig(): {
  configured: boolean;
  githubUser?: string;
  repoUrl?: string;
  repoName?: string;
  branch?: string;
  maskedToken?: string;
  ownerEmail?: string;
  lastConnectedAt?: string;
} {
  const config = loadServerGitHubConfig();
  if (!config) {
    return { configured: false };
  }
  const token = config.githubToken;
  const maskedToken = token.length > 8 ? `${token.slice(0, 4)}****${token.slice(-4)}` : '****';
  return {
    configured: true,
    githubUser: config.githubUser,
    repoUrl: config.repoUrl,
    repoName: config.repoName,
    branch: config.branch,
    maskedToken,
    ownerEmail: config.ownerEmail,
    lastConnectedAt: config.lastConnectedAt,
  };
}

// -------------------------------------------------------------
// Secret Scanner
// -------------------------------------------------------------
export function runSecretScan(): SecretScanResult {
  const detectedSecrets: { path: string; reason: string }[] = [];
  const forbiddenFiles = ['.env', '.env.local', '.env.production', '.env.development'];

  // Check root files
  for (const f of forbiddenFiles) {
    const fullPath = path.join(process.cwd(), f);
    if (fs.existsSync(fullPath)) {
      detectedSecrets.push({ path: f, reason: 'Environment credentials file must never be committed to Git.' });
    }
  }

  // Scan files staged or in git tree for hardcoded secrets
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
    const lines = gitStatus.split('\n').filter(Boolean);
    for (const line of lines) {
      const filePath = line.trim().split(/\s+/).pop();
      if (!filePath) continue;

      if (filePath.endsWith('.pem') || filePath.endsWith('.key') || filePath.includes('private_key')) {
        detectedSecrets.push({ path: filePath, reason: 'Private key file detected.' });
      }
    }
  } catch (e) {
    // Non-git or fallback
  }

  return {
    passed: detectedSecrets.length === 0,
    detectedSecrets,
  };
}

// -------------------------------------------------------------
// Read-Only Verification
// -------------------------------------------------------------
export async function verifyGitHubConnection(overrideConfig?: Partial<GitHubSyncConfig>): Promise<{
  success: boolean;
  message: string;
  user?: string;
  repoAccess?: boolean;
  latestCommitSha?: string;
}> {
  const base = loadServerGitHubConfig();
  const token = overrideConfig?.githubToken || base?.githubToken;
  const owner = overrideConfig?.githubUser || base?.githubUser || 'sdxbyte';
  const repo = overrideConfig?.repoName || base?.repoName || 'saarthi';
  const branch = overrideConfig?.branch || base?.branch || 'main';

  if (!token) {
    return {
      success: false,
      message: 'Service authentication is not configured on the server.',
    };
  }

  try {
    // 1. Verify token / user API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!userRes.ok) {
      return {
        success: false,
        message: `GitHub Authentication Failed (HTTP ${userRes.status}). Invalid or expired token.`,
      };
    }

    const userData = await userRes.json();

    // 2. Verify repository access & branch
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!repoRes.ok) {
      return {
        success: false,
        message: `Repository 'https://github.com/${owner}/${repo}' or branch '${branch}' not accessible (HTTP ${repoRes.status}).`,
        user: userData.login,
        repoAccess: false,
      };
    }

    const branchData = await repoRes.json();
    const latestCommitSha = branchData.commit?.sha;

    return {
      success: true,
      message: `GITHUB VERIFIED: Connected as @${userData.login} to ${owner}/${repo} (${branch})`,
      user: userData.login,
      repoAccess: true,
      latestCommitSha,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `GitHub verification exception: ${err.message || err}`,
    };
  }
}

// -------------------------------------------------------------
// Additional GitHub REST APIs
// -------------------------------------------------------------

// 1. GitHub Actions Workflow Runs
export async function getGitHubActionsRuns(limit = 10): Promise<{
  success: boolean;
  runs: Array<{
    id: number;
    name: string;
    headBranch: string;
    headSha: string;
    shortSha: string;
    event: string;
    status: string;
    conclusion: string;
    workflowId: number;
    createdAt: string;
    updatedAt: string;
    htmlUrl: string;
    commitMessage: string;
    actorName: string;
    actorAvatar: string;
  }>;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, runs: [], message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/actions/runs?per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!res.ok) {
      return { success: false, runs: [], message: `GitHub Actions API returned HTTP ${res.status}` };
    }

    const data = await res.json();
    const runs = (data.workflow_runs || []).map((run: any) => ({
      id: run.id,
      name: run.name || 'CI/CD Pipeline',
      headBranch: run.head_branch || 'main',
      headSha: run.head_sha || '',
      shortSha: run.head_sha ? run.head_sha.slice(0, 7) : '',
      event: run.event || 'push',
      status: run.status || 'completed',
      conclusion: run.conclusion || 'success',
      workflowId: run.workflow_id,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
      htmlUrl: run.html_url,
      commitMessage: run.head_commit?.message?.split('\n')[0] || 'Build & Sync',
      actorName: run.actor?.login || 'SAARTHI Automations',
      actorAvatar: run.actor?.avatar_url || '',
    }));

    return { success: true, runs };
  } catch (err: any) {
    return { success: false, runs: [], message: `Actions API error: ${err.message}` };
  }
}

// 2. GitHub Official Releases (List & Create)
export async function getGitHubReleases(limit = 10): Promise<{
  success: boolean;
  releases: Array<{
    id: number;
    tagName: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    createdAt: string;
    publishedAt: string;
    htmlUrl: string;
    tarballUrl: string;
    zipballUrl: string;
    authorName: string;
    authorAvatar: string;
  }>;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, releases: [], message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/releases?per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!res.ok) {
      return { success: false, releases: [], message: `GitHub Releases API returned HTTP ${res.status}` };
    }

    const data = await res.json();
    const releases = (Array.isArray(data) ? data : []).map((rel: any) => ({
      id: rel.id,
      tagName: rel.tag_name || 'v1.4.7',
      name: rel.name || rel.tag_name || 'SAARTHI Release',
      body: rel.body || 'Production build and civic platform deployment.',
      draft: rel.draft || false,
      prerelease: rel.prerelease || false,
      createdAt: rel.created_at,
      publishedAt: rel.published_at,
      htmlUrl: rel.html_url,
      tarballUrl: rel.tarball_url,
      zipballUrl: rel.zipball_url,
      authorName: rel.author?.login || 'Sudip Adhikari',
      authorAvatar: rel.author?.avatar_url || '',
    }));

    return { success: true, releases };
  } catch (err: any) {
    return { success: false, releases: [], message: `Releases API error: ${err.message}` };
  }
}

export async function createGitHubRelease(
  tagName: string,
  releaseName: string,
  bodyText: string,
  isDraft = false,
  isPrerelease = false
): Promise<{ success: boolean; releaseUrl?: string; message: string }> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName, branch } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/releases`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'SAARTHI-Platform-ReleaseEngine',
      },
      body: JSON.stringify({
        tag_name: tagName,
        target_commitish: branch,
        name: releaseName,
        body: bodyText,
        draft: isDraft,
        prerelease: isPrerelease,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, message: `Failed to create release: ${errText}` };
    }

    const data = await res.json();
    return {
      success: true,
      releaseUrl: data.html_url,
      message: `Official GitHub Release '${tagName}' created successfully on ${githubUser}/${repoName}`,
    };
  } catch (err: any) {
    return { success: false, message: `Create release error: ${err.message}` };
  }
}

// 3. GitHub Issues Integration (List & Create)
export async function getGitHubIssues(state: 'open' | 'closed' | 'all' = 'open', limit = 10): Promise<{
  success: boolean;
  issues: Array<{
    number: number;
    title: string;
    body: string;
    state: string;
    userLogin: string;
    userAvatar: string;
    labels: string[];
    createdAt: string;
    updatedAt: string;
    htmlUrl: string;
    commentsCount: number;
  }>;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, issues: [], message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/issues?state=${state}&per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!res.ok) {
      return { success: false, issues: [], message: `GitHub Issues API returned HTTP ${res.status}` };
    }

    const data = await res.json();
    const issues = (Array.isArray(data) ? data : [])
      .filter((item: any) => !item.pull_request) // Filter out PRs
      .map((item: any) => ({
        number: item.number,
        title: item.title,
        body: item.body || '',
        state: item.state,
        userLogin: item.user?.login || 'User',
        userAvatar: item.user?.avatar_url || '',
        labels: (item.labels || []).map((l: any) => l.name),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        htmlUrl: item.html_url,
        commentsCount: item.comments || 0,
      }));

    return { success: true, issues };
  } catch (err: any) {
    return { success: false, issues: [], message: `Issues API error: ${err.message}` };
  }
}

export async function createGitHubIssue(
  title: string,
  body: string,
  labels: string[] = ['civic-support', 'saarthi-platform']
): Promise<{ success: boolean; issueUrl?: string; issueNumber?: number; message: string }> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/issues`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'SAARTHI-Platform-SupportSync',
      },
      body: JSON.stringify({
        title,
        body,
        labels,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, message: `Failed to create issue: ${errText}` };
    }

    const data = await res.json();
    return {
      success: true,
      issueUrl: data.html_url,
      issueNumber: data.number,
      message: `GitHub Issue #${data.number} created on ${githubUser}/${repoName}`,
    };
  } catch (err: any) {
    return { success: false, message: `Create issue error: ${err.message}` };
  }
}

// 4. GitHub API Rate Limit & Quota Health Status
export async function getGitHubRateLimit(): Promise<{
  success: boolean;
  rateLimit: {
    limit: number;
    remaining: number;
    resetTimestamp: number;
    resetDateIso: string;
    used: number;
    percentUsed: number;
  } | null;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, rateLimit: null, message: 'GitHub token not configured.' };
  }

  const { githubToken } = config;
  const url = 'https://api.github.com/rate_limit';

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-RateLimit-Checker',
      },
    });

    if (!res.ok) {
      return { success: false, rateLimit: null, message: `Rate Limit API HTTP ${res.status}` };
    }

    const data = await res.json();
    const core = data.rate || data.resources?.core || { limit: 5000, remaining: 5000, reset: Date.now() / 1000 };
    const used = core.limit - core.remaining;
    const percentUsed = Math.round((used / core.limit) * 100);

    return {
      success: true,
      rateLimit: {
        limit: core.limit,
        remaining: core.remaining,
        resetTimestamp: core.reset,
        resetDateIso: new Date(core.reset * 1000).toISOString(),
        used,
        percentUsed,
      },
    };
  } catch (err: any) {
    return { success: false, rateLimit: null, message: `Rate limit check error: ${err.message}` };
  }
}

// 5. Repository Languages Breakdown
export async function getGitHubLanguages(): Promise<{
  success: boolean;
  languages: Array<{ name: string; bytes: number; percentage: number }>;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, languages: [], message: 'GitHub token not configured.' };
  }

  const { githubToken, githubUser, repoName } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/languages`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Lang-Checker',
      },
    });

    if (!res.ok) {
      return { success: false, languages: [], message: `Languages API HTTP ${res.status}` };
    }

    const data = await res.json();
    const totalBytes = Object.values(data).reduce((acc: number, val: any) => acc + (typeof val === 'number' ? val : 0), 0) as number;

    const languages = Object.entries(data).map(([name, bytes]) => ({
      name,
      bytes: bytes as number,
      percentage: totalBytes > 0 ? Math.round(((bytes as number) / totalBytes) * 1000) / 10 : 0,
    }));

    return { success: true, languages };
  } catch (err: any) {
    return { success: false, languages: [], message: `Languages API error: ${err.message}` };
  }
}
export async function getLiveGitHubCommits(limit = 10): Promise<{
  success: boolean;
  commits: Array<{
    sha: string;
    shortSha: string;
    message: string;
    authorName: string;
    authorEmail: string;
    authorAvatarUrl?: string;
    date: string;
    htmlUrl: string;
  }>;
  message?: string;
}> {
  const config = loadServerGitHubConfig();
  if (!config || !config.githubToken) {
    return { success: false, commits: [], message: 'GitHub credentials not configured on server.' };
  }

  const { githubToken, githubUser, repoName, branch } = config;
  const url = `https://api.github.com/repos/${githubUser}/${repoName}/commits?sha=${branch}&per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Platform-Verifier',
      },
    });

    if (!res.ok) {
      return { success: false, commits: [], message: `GitHub API status ${res.status}` };
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return { success: false, commits: [], message: 'Unexpected GitHub API format.' };
    }

    const commits = data.map((item: any) => ({
      sha: item.sha,
      shortSha: item.sha ? item.sha.slice(0, 7) : '',
      message: item.commit?.message || '',
      authorName: item.commit?.author?.name || item.author?.login || 'Developer',
      authorEmail: item.commit?.author?.email || '',
      authorAvatarUrl: item.author?.avatar_url || '',
      date: item.commit?.author?.date || '',
      htmlUrl: item.html_url || `https://github.com/${githubUser}/${repoName}/commit/${item.sha}`,
    }));

    return { success: true, commits };
  } catch (err: any) {
    return { success: false, commits: [], message: `GitHub API fetch error: ${err.message}` };
  }
}

// -------------------------------------------------------------
// Remote Verification via GitHub REST API
// -------------------------------------------------------------
export async function verifyRemoteCommit(
  token: string,
  owner: string,
  repo: string,
  commitSha: string
): Promise<RemoteVerificationResult> {
  try {
    // 1. Check commit endpoint
    const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`;
    const commitRes = await fetch(commitUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Verifier',
      },
    });

    if (!commitRes.ok) {
      return {
        verified: false,
        commitExists: false,
        commitShaMatched: false,
        remoteStructureOk: false,
        details: `Remote commit SHA ${commitSha} was NOT found on GitHub (HTTP ${commitRes.status}).`,
      };
    }

    // 2. Check repository contents endpoint
    const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const contentsRes = await fetch(contentsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SAARTHI-Verifier',
      },
    });

    if (!contentsRes.ok) {
      return {
        verified: false,
        commitExists: true,
        commitShaMatched: true,
        remoteStructureOk: false,
        details: `Remote commit exists, but remote repository structure could not be fetched (HTTP ${contentsRes.status}).`,
      };
    }

    const files = await contentsRes.json();
    const requiredFiles = ['package.json', 'src'];
    const hasRequired = Array.isArray(files) && requiredFiles.every((rf) => files.some((f: any) => f.name === rf));

    if (!hasRequired) {
      return {
        verified: false,
        commitExists: true,
        commitShaMatched: true,
        remoteStructureOk: false,
        details: 'Remote repository missing core SAARTHI structure (package.json or src).',
      };
    }

    return {
      verified: true,
      commitExists: true,
      commitShaMatched: true,
      remoteStructureOk: true,
      details: `Remote commit ${commitSha.slice(0, 7)} and repository structure verified successfully on GitHub.`,
    };
  } catch (err: any) {
    return {
      verified: false,
      commitExists: false,
      commitShaMatched: false,
      remoteStructureOk: false,
      details: `Exception during remote verification: ${err.message}`,
    };
  }
}

// -------------------------------------------------------------
// Core Pipeline: Full SAARTHI Synchronization
// -------------------------------------------------------------
export async function executeFullSaarthiGitHubSync(
  commitMessageTitle: string,
  commitMessageDetails: string,
  versionStr: string
): Promise<FullSyncResult> {
  const syncId = `SRT-SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Atomic Lock Check
  if (currentSyncLock.locked) {
    return {
      success: false,
      syncId,
      state: 'FAILED',
      repoUrl: 'https://github.com/sdxbyte/saarthi',
      branch: 'main',
      message: 'SAARTHI synchronization is already in progress.',
      retryCount: 0,
    };
  }

  // Acquire Lock
  currentSyncLock = {
    locked: true,
    state: 'PREPARING',
    syncId,
    startedAt: new Date().toISOString(),
    message: 'Preparing SAARTHI synchronization pipeline...',
  };

  let maxAttempts = 3;
  let attempt = 0;
  let lastErrorMsg = '';

  try {
    const config = loadServerGitHubConfig();
    if (!config || !config.githubToken) {
      currentSyncLock.state = 'FAILED';
      return {
        success: false,
        syncId,
        state: 'FAILED',
        repoUrl: 'https://github.com/sdxbyte/saarthi',
        branch: 'main',
        message: 'Service authentication is not configured on the server.',
        retryCount: 0,
      };
    }

    const { githubToken, githubUser, repoName, repoUrl, branch } = config;

    // STEP 4: Validate SAARTHI project structure
    currentSyncLock.state = 'VALIDATING';
    const requiredLocalFiles = ['package.json', 'src/App.tsx', 'src/serverApp.ts', 'metadata.json'];
    for (const file of requiredLocalFiles) {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        currentSyncLock.state = 'FAILED';
        return {
          success: false,
          syncId,
          state: 'FAILED',
          repoUrl,
          branch,
          message: `Project validation failed: Missing required file '${file}'.`,
          retryCount: 0,
        };
      }
    }

    // STEP 5: Run secret scan
    currentSyncLock.state = 'SCANNING';
    const scan = runSecretScan();
    if (!scan.passed) {
      currentSyncLock.state = 'FAILED';
      const affected = scan.detectedSecrets.map((s) => `${s.path} (${s.reason})`).join(', ');
      return {
        success: false,
        syncId,
        state: 'FAILED',
        repoUrl,
        branch,
        message: `Security Scan Failed: Forbidden secret files detected: ${affected}`,
        retryCount: 0,
      };
    }

    // STEP 7-9: Verify GitHub auth & repo connection
    const connectionTest = await verifyGitHubConnection(config);
    if (!connectionTest.success) {
      currentSyncLock.state = 'FAILED';
      return {
        success: false,
        syncId,
        state: 'FAILED',
        repoUrl,
        branch,
        message: `GitHub Pre-flight verification failed: ${connectionTest.message}`,
        retryCount: 0,
      };
    }

    // Retry loop for Git push
    let pushedCommitSha: string | null = null;

    while (attempt < maxAttempts) {
      attempt++;
      currentSyncLock.state = attempt > 1 ? 'RETRYING' : 'SYNCING';
      currentSyncLock.message = `Executing Git commit & push (Attempt ${attempt}/${maxAttempts})...`;

      try {
        // Set remote URL with token embedded securely in memory
        const remoteWithToken = `https://${githubUser}:${githubToken}@github.com/${githubUser}/${repoName}.git`;

        // Configure local git user if not present
        try {
          execSync('git config user.name "SAARTHI System Core"', { stdio: 'pipe' });
          execSync(`git config user.email "${config.ownerEmail}"`, { stdio: 'pipe' });
        } catch (e) {}

        // Add changes
        execSync('git add -A', { stdio: 'pipe' });

        const dual = formatDualDate(new Date());
        const fullCommitMsg = `SAARTHI v${versionStr} [Update ${dual.combined}] - ${commitMessageTitle}\n\n${commitMessageDetails}\n\nSync ID: ${syncId}`;

        // Check if there are actual staged changes
        const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
        if (statusOutput.trim().length === 0) {
          // No changes to commit, but check latest commit SHA
          const headSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
          pushedCommitSha = headSha;
        } else {
          // Commit
          execSync(`git commit -m ${JSON.stringify(fullCommitMsg)}`, { stdio: 'pipe' });
          const headSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
          pushedCommitSha = headSha;
        }

        // Push to remote
        execSync(`git push ${remoteWithToken} ${branch} --force`, { stdio: 'pipe' });

        // Push succeeded!
        break;
      } catch (err: any) {
        lastErrorMsg = err.message || String(err);
        console.warn(`[GitHub Sync Service] Push attempt ${attempt} failed:`, lastErrorMsg);
        if (attempt < maxAttempts) {
          // Exponential backoff
          await new Promise((r) => setTimeout(r, 1500 * attempt));
        }
      }
    }

    if (!pushedCommitSha) {
      currentSyncLock.state = 'FAILED';
      return {
        success: false,
        syncId,
        state: 'FAILED',
        repoUrl,
        branch,
        message: `FULL SAARTHI SYNC FAILED after ${maxAttempts} attempts: ${lastErrorMsg}`,
        retryCount: attempt,
      };
    }

    // STEP 15-18: Remote Verification via GitHub REST API
    currentSyncLock.state = 'VERIFYING';
    currentSyncLock.message = 'Verifying remote commit SHA and repository structure on GitHub...';

    const remoteVerification = await verifyRemoteCommit(githubToken, githubUser, repoName, pushedCommitSha);

    if (!remoteVerification.verified) {
      currentSyncLock.state = 'FAILED';
      return {
        success: false,
        syncId,
        state: 'FAILED',
        commitSha: pushedCommitSha,
        repoUrl,
        branch,
        message: `FULL SAARTHI SYNC FAILED Remote Verification: ${remoteVerification.details}`,
        remoteVerification,
        retryCount: attempt,
      };
    }

    // SUCCESS!
    currentSyncLock.state = 'SUCCESS';
    return {
      success: true,
      syncId,
      state: 'SUCCESS',
      commitSha: pushedCommitSha,
      repoUrl,
      branch,
      message: `FULL SAARTHI SYNC VERIFIED: Pushed & Remote Verified Commit ${pushedCommitSha.slice(0, 7)} on ${repoUrl}`,
      remoteVerification,
      retryCount: attempt,
    };
  } finally {
    // Release atomic lock
    currentSyncLock = {
      locked: false,
      state: currentSyncLock.state === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
    };
  }
}
