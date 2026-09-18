import fs from 'fs';
import path from 'path';
import { loadGitHubCredentials, executeGitPushWithFallback } from '../src/lib/releaseEngine';

async function runAutoSync() {
  // Skip execution inside CI/CD / GitHub Actions environment to prevent infinite recursive triggers
  if (process.env.GITHUB_ACTIONS || process.env.CI) {
    console.log('ℹ️ [CI/CD] Running inside GitHub Actions environment. Skipping post-build GitHub push.');
    return;
  }

  console.log('🚀 [CI/CD] Triggering post-build automatic GitHub repository synchronization...');

  try {
    const creds = loadGitHubCredentials();
    if (!creds || !creds.githubToken) {
      console.warn('⚠️ [CI/CD] No GitHub credentials configured in /docs/github-credentials.json or process.env. Skipping auto-push.');
      return;
    }

    const token = creds.githubToken;
    const user = creds.githubUser || 'sdxbyte';
    const repo = creds.repoName || 'saarthi';
    const branch = creds.branch || 'main';

    let version = '1.4.7';
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
      version = pkg.version || version;
    } catch (e) {}

    const commitMessage = `Auto-Sync Build: SAARTHI v${version} - ${new Date().toISOString()}`;
    const changelogDetails = 'Automated post-build synchronization from AI Studio container runtime to main branch.';

    console.log(`📡 [CI/CD] Syncing changes to https://github.com/${user}/${repo} (branch: ${branch})...`);

    const result = await executeGitPushWithFallback(
      token,
      user,
      repo,
      branch,
      commitMessage,
      changelogDetails
    );

    if (result.success) {
      console.log(`✅ [CI/CD Success] ${result.message}`);
    } else {
      console.error(`❌ [CI/CD Failed] ${result.message}`);
    }
  } catch (err: any) {
    console.error('❌ [CI/CD Exception]', err?.message || err);
  }
}

runAutoSync();
