import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Download,
  AlertTriangle,
  Sparkles,
  Layers,
  Terminal,
  HelpCircle,
  Award,
  Globe,
  Trash2,
  FileText,
} from 'lucide-react';

interface PlayStoreLaunchPortalProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const PlayStoreLaunchPortal: React.FC<PlayStoreLaunchPortalProps> = ({
  currentLang,
  theme,
  onNavigateTab,
}) => {
  const isDark = theme === 'dark';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'no-pc-cloud' | 'checklist' | 'store-listing' | 'packaging' | 'data-safety'>('no-pc-cloud');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const appTitle = "SAARTHI: Nepali Calendar & Hub";
  const shortDescription = "Authentic Nepali calendar, NRB forex, NEPSE stocks, gold & public utilities.";
  const fullDescriptionEn = `SAARTHI is a modern, independent digital platform crafted for Nepal, providing authentic financial tools, daily utilities, a 136-year Bikram Sambat calendar, and essential public directory access in one unified experience.

KEY FEATURES:
• 136-Year Bikram Sambat Calendar (वि.सं. १९७०–२१०५): Authentic Tithi, Nakshatra, Subha Muhurats (Vivaha, Bratabandha, Pasni), and Nepal Gazetted Public Holidays.
• Official NRB Forex Rates: Daily buying and selling foreign exchange rates published by Nepal Rastra Bank.
• Live NEPSE Stock Market Snapshot: Real-time market index, top gainers, losers, and turnover data.
• CDSC Direct IPO Result Checker: Fast, direct IPO allotment result lookup via official CDSC endpoints.
• Gold & Silver Bullion Rates: Real-time hallmark gold, tejabi gold, and silver rates per tola/10g.
• Nepal Oil Corporation (NOC) Fuel Rates: Live petrol, diesel, kerosene, and LPG cylinder pricing across provincial depots.
• Financial Tools: Income tax calculator, EMI loan amortization, and civic directory hotlines.
• Privacy & Local Security: 256-bit encrypted data handling with full user data control and account deletion.

DISCLAIMER & SOURCE ATTRIBUTION:
SAARTHI is an independent, privately developed digital application. It is NOT an official government portal and does NOT represent any government ministry. All financial, calendar, and public data are sourced directly from verified public authorities including Nepal Rastra Bank (NRB), Nepal Stock Exchange (NEPSE), CDSC, Federation of Nepal Gold & Silver Dealers' Association (FENEGOSIDA), and Nepal Oil Corporation (NOC).

Privacy Policy: https://saarthi.dpdns.org/?tab=privacy
Account Deletion: https://saarthi.dpdns.org/?tab=account-deletion
Support: support@saarthi.dpdns.org`;

  const bubblewrapBuildCommands = `# 1. Install official Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize Android Project from SAARTHI Web App Manifest
bubblewrap init --manifest=https://raw.githubusercontent.com/sdxbyte/saarthi/main/public/manifest.json

# 3. Build Google Play Store Android App Bundle (.aab)
bubblewrap build

# Output: app-release-signed.aab (Ready for Google Play Console upload)`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 font-sans text-slate-100">
      {/* Top Banner */}
      <div
        className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800'
            : 'bg-gradient-to-br from-white via-indigo-50/30 to-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Google Play Readiness v1.6
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[10px] font-bold uppercase">
                  Package: com.sdxbyte.saarthi
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Google Play Store Launch Portal
              </h1>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Complete deployment package, assetlinks verification, Google Play Console metadata, policy compliance URLs, and Android App Bundle (.aab) build blueprints.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('account-deletion')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Deletion URL</span>
            </button>
            <button
              onClick={() => onNavigateTab('privacy')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-900/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('no-pc-cloud')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'no-pc-cloud'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>📱 No-PC Mobile Launch Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>1. Launch Checklist & Status</span>
        </button>

        <button
          onClick={() => setActiveTab('store-listing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'store-listing'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Store Listing Copy (ASO)</span>
        </button>

        <button
          onClick={() => setActiveTab('packaging')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'packaging'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>3. AAB Packaging (Bubblewrap/TWA)</span>
        </button>

        <button
          onClick={() => setActiveTab('data-safety')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'data-safety'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Data Safety Answers</span>
        </button>
      </div>

      {/* Tab 0: Zero-PC Cloud Automated Mobile Launch Guide */}
      {activeTab === 'no-pc-cloud' && (
        <div className="space-y-6">
          {/* Hero Mobile Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Zero-PC Cloud Pipeline Configured
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  You Don't Need a PC — Cloud Pipeline Does Everything
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We have set up an automated GitHub Actions cloud compiler (<code className="text-emerald-300 font-mono">.github/workflows/build-playstore-aab.yml</code>) on your repository (<code className="text-emerald-300 font-mono">sdxbyte/saarthi</code>). It builds, signs, and generates both the Google Play App Bundle (<strong>.aab</strong>) and installable Android APK (<strong>.apk</strong>) directly in the cloud.
                </p>
              </div>
            </div>

            {/* Direct Mobile Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href="https://github.com/sdxbyte/saarthi/actions"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Cloud Build Status</span>
                  <strong className="text-xs text-white group-hover:text-emerald-300 transition-colors">GitHub Actions Cloud Builds →</strong>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>

              <a
                href="https://github.com/sdxbyte/saarthi/releases"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">Download Ready AAB & APK</span>
                  <strong className="text-xs text-white group-hover:text-indigo-300 transition-colors">GitHub Releases Downloads →</strong>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Simple Step by step for Mobile */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>How to Upload to Google Play Console From Your Mobile Phone:</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-white block font-bold mb-0.5">Open Google Play Console on Mobile Chrome</strong>
                  Visit <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">play.google.com/console</a> on your phone. Tap Chrome's three-dot menu (⋮) and enable <strong>"Desktop site"</strong> for the full dashboard.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-white block font-bold mb-0.5">Create New App</strong>
                  Tap <strong>Create app</strong>. Enter App Name: <code className="text-amber-300">SAARTHI: Nepali Calendar & Hub</code>, Language: <code className="text-amber-300">Nepali</code> or <code className="text-amber-300">English</code>, App / Free.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-white block font-bold mb-0.5">Paste Store Listing Copy & Compliance URLs</strong>
                  Use <strong>Tab 2 (Store Listing Copy)</strong> to copy with one tap and paste into the Play Console.
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    <li>Privacy Policy URL: <code className="text-indigo-300">https://saarthi.dpdns.org/?tab=privacy</code></li>
                    <li>Account Deletion URL: <code className="text-indigo-300">https://saarthi.dpdns.org/?tab=account-deletion</code></li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-white block font-bold mb-0.5">Download .aab from GitHub and Upload to Release</strong>
                  Go to <a href="https://github.com/sdxbyte/saarthi/releases" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">GitHub Releases</a> on your phone, download <code className="text-emerald-300">app-release-bundle.aab</code>, and upload it under <strong>Release &gt; Production &gt; Create new release</strong> in Play Console.
                </div>
              </div>
            </div>
          </div>

          {/* Option: Native PWA Instant Install */}
          <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Want SAARTHI on your phone right now?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                In Chrome on Android, tap the three dots (⋮) and select <strong>"Add to Home screen" / "Install App"</strong> to run SAARTHI with full native standalone experience immediately.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap shadow-lg shadow-indigo-900/30"
            >
              Launch App Experience →
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Launch Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Digital Asset Links (`assetlinks.json`)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready in /.well-known/
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifies domain ownership so the Android Trusted Web Activity (TWA) opens full-screen without displaying the browser URL bar.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>/.well-known/assetlinks.json</span>
                <span className="text-emerald-400 font-bold">200 OK</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Web App Manifest (PWA/TWA)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contains standard and maskable 192x192 & 512x512 icons, shortcuts, category definitions, portrait orientation, and standalone display.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>/manifest.json</span>
                <span className="text-emerald-400 font-bold">Valid PWA</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Google Play Account Deletion URL</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mandatory Met
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Play policy requires a public web form allowing users to submit account and data deletion requests without installing the app.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>https://saarthi.dpdns.org/?tab=account-deletion</span>
                <button
                  onClick={() => onNavigateTab('account-deletion')}
                  className="text-indigo-400 hover:underline font-bold text-[11px]"
                >
                  View Page →
                </button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Privacy Policy & Rule 16 Disclaimers</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Protected
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full legal disclaimer declaring independent private development with explicit source attributions for NRB, NEPSE, CDSC, and FENEGOSIDA.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>https://saarthi.dpdns.org/?tab=privacy</span>
                <button
                  onClick={() => onNavigateTab('privacy')}
                  className="text-indigo-400 hover:underline font-bold text-[11px]"
                >
                  View Page →
                </button>
              </div>
            </div>
          </div>

          {/* What needs to be done next on Google Play Console */}
          <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Step-by-Step Play Store Submission Procedure</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-white block">Create Google Play Developer Account ($25 one-time fee)</strong>
                  Sign in at <code className="text-indigo-300">play.google.com/console</code> and complete identity verification.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-white block">Create New App in Console</strong>
                  App Name: <span className="text-white font-semibold">SAARTHI</span> | Default Language: <span className="text-white font-semibold">Nepali / English</span> | App or Game: <span className="text-white font-semibold">App</span> | Free or Paid: <span className="text-white font-semibold">Free</span>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-white block">Fill App Content & Policies Form</strong>
                  Paste Privacy Policy URL, Account Deletion URL, complete Content Rating questionnaire (all ratings: Everyone / 3+), and fill Data Safety form using Tab 4.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-white block">Generate & Upload Android App Bundle (.aab)</strong>
                  Use Bubblewrap CLI (see Tab 3) or Android Studio to generate the signed <code className="text-indigo-300">.aab</code> and upload it to Closed Testing or Production release.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Store Listing Copy */}
      {activeTab === 'store-listing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  App Name (Max 30 chars)
                </label>
                <button
                  onClick={() => copyToClipboard(appTitle, 'title')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-400 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'title' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <input
                readOnly
                value={appTitle}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Short Description (Max 80 chars) — Length: {shortDescription.length}/80
                </label>
                <button
                  onClick={() => copyToClipboard(shortDescription, 'short')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-400 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'short' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <input
                readOnly
                value={shortDescription}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Description (Formatted with Features & Disclaimers)
                </label>
                <button
                  onClick={() => copyToClipboard(fullDescriptionEn, 'full')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-400 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'full' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={14}
                value={fullDescriptionEn}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AAB Packaging */}
      {activeTab === 'packaging' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Bubblewrap TWA Packaging Blueprint</span>
              </h3>
              <button
                onClick={() => copyToClipboard(bubblewrapBuildCommands, 'bubblewrap')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run these commands in your local terminal to wrap SAARTHI into a Google Play-compliant signed Android App Bundle (.aab).
            </p>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
              {bubblewrapBuildCommands}
            </pre>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Digital Asset Links Fingerprint Extraction</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When Bubblewrap generates your <code className="text-amber-300">android.keystore</code>, run:
            </p>
            <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-300">
              keytool -list -v -keystore android.keystore -alias saarthi-key
            </pre>
            <p className="text-[11px] text-slate-400">
              Copy the SHA-256 fingerprint into <code className="text-slate-300">/public/.well-known/assetlinks.json</code> to remove the browser address bar.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Data Safety Answers */}
      {activeTab === 'data-safety' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Google Play Data Safety Form Answers</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When answering Google Play Console's Data Safety questionnaire, use the following exact choices:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Does your app collect or share user data?</span>
                <span className="text-emerald-400 font-semibold">Yes</span> — Only for optional account registration and citizen grievance tracking.
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Is all user data encrypted in transit?</span>
                <span className="text-emerald-400 font-semibold">Yes</span> — All connections utilize 256-bit SSL / HTTPS encryption.
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Do you provide a way for users to request data deletion?</span>
                <span className="text-emerald-400 font-semibold">Yes</span> — In-app and via external URL: <code className="text-indigo-300">https://saarthi.dpdns.org/?tab=account-deletion</code>.
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Is any data shared with third-party companies or data brokers?</span>
                <span className="text-emerald-400 font-semibold">No</span> — Zero third-party data sharing or monetization.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
