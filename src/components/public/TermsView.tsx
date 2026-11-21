import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Lock, ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ theme, onNavigateTab }) => {
  const isDark = theme === 'dark';
  const bodyText = isDark ? 'text-slate-300' : 'text-slate-700';
  const sectionBorder = isDark ? 'border-slate-800' : 'border-slate-200';

  return (
    <div className={`max-w-4xl mx-auto space-y-8 py-6 px-4 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div
        className={`p-8 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-amber-500">Legal Governance</span>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Terms &amp; Conditions</h1>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
          Effective Date: August 2026. Please read these Terms and Conditions carefully before using SAARTHI (<code className="font-mono">saarthi.dpdns.org</code> or the Android TWA package <code className="font-mono">com.sdxbyte.saarthi</code>).
        </p>
      </div>

      {/* Content Sections */}
      <div
        className={`p-8 rounded-3xl border shadow-xl space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Independent Platform &amp; Non-Governmental Disclaimer</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            SAARTHI is a private, independent technology platform aggregating public utilities, financial calculators, open-source intelligence links, and issue-report workflows. SAARTHI is NOT affiliated with, endorsed by, or an official service of the Government of Nepal, NRB, NEPSE, IRD, or DoTM.
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>2. Not Financial, Tax, Investment, or Legal Advice</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            All income tax estimates, loan EMI schedules, foreign exchange viewers, bullion tariffs, and NEPSE market snapshots in SAARTHI are provided strictly for informational and educational reference. SAARTHI does NOT provide licensed financial, investment, tax, or legal advice, and does not facilitate financial transactions, lending, or securities trading. Always verify official filings and rates directly with licensed institutions or government authorities.
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>3. Acceptable Use Policy &amp; Eligibility (18+)</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            SAARTHI is intended for users aged 18 years and older. You agree to use external utilities, public APIs, and OSINT research directories strictly for lawful, defensive, and educational verification purposes. You must NOT:
          </p>
          <ul className={`list-disc list-inside text-xs space-y-1 pl-2 ${bodyText}`}>
            <li>Submit spam, abusive content, or falsified issue reports.</li>
            <li>Probe, bypass authentication, or automate bulk scraping against platform endpoints.</li>
            <li>Use external OSINT or developer utilities for harassment, doxxing, or unauthorized access.</li>
          </ul>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>4. Accounts, Issue Reports &amp; Data Deletion</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            Local citizen profiles and vault entries remain under your control on your device. Issue reports submitted to <code className="font-mono">/api/support/tickets</code> are rate-limited to prevent abuse. You may purge local data and request ticket deletion anytime at{' '}
            <button
              onClick={() => onNavigateTab('account-deletion')}
              className="text-amber-500 font-bold underline hover:text-amber-400"
            >
              https://saarthi.dpdns.org/account-deletion
            </button>
            .
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>5. Limitation of Liability &amp; Contact</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            SAARTHI is provided &quot;as is&quot; without warranties of uninterrupted availability. For questions or legal notices, use the Contact &amp; Issue Portal or write to <code className="font-mono">sudipadhikari8107@gmail.com</code>.
          </p>
        </section>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={() => onNavigateTab('privacy')}
          className="text-amber-500 hover:underline font-bold text-xs"
        >
          View Privacy Policy →
        </button>
      </div>
    </div>
  );
};
