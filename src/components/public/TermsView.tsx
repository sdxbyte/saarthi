import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Lock, ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ currentLang, theme, onNavigateTab }) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 font-sans text-slate-100">
      {/* Header */}
      <div className={`p-8 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-amber-400">Legal Governance</span>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Terms & Conditions</h1>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Effective Date: January 1, 2026. Please read these Terms and Conditions carefully before accessing or using the Saarthi Civic Gateway platform.
        </p>
      </div>

      {/* Content Sections */}
      <div className={`p-8 rounded-3xl border shadow-xl space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Platform Purpose & Non-Governmental Disclaimer</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Saarthi is an independent digital civic gateway designed to aggregate public information, tax tools, and civic service directories. Saarthi is not owned by or directly affiliated with any government ministry or municipality. It serves purely as a transparent civic access portal for public convenience.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>2. Acceptable Use Policy</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Users agree to use the platform solely for lawful civic purposes. Users are strictly prohibited from:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-2">
            <li>Submitting false, fraudulent, or malicious grievance complaints.</li>
            <li>Attempting to probe, scan, or breach system authentication gateways.</li>
            <li>Scraping platform data using unauthorized automated bots or DDoS tools.</li>
            <li>Impersonating government officials or public authorities.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>3. Account Responsibilities & Privacy</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Users creating personal accounts for complaint tracking or document vaults are responsible for maintaining confidentiality of their account credentials. Saarthi enforces strict data protection, password encryption, and zero-plaintext storage policies.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            While Saarthi strives to maintain 100% accuracy in financial calculators, NEPSE updates, and tax slabs, all figures are provided for informational and planning purposes. Official tax clearance and legal filings should be verified with respective government departments (IRD, DOTM, etc.).
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>5. Service Updates & Modifications</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Saarthi reserves the right to update, modify, or enhance features, API integrations, and security rules without prior notice to preserve system integrity and public reliability.
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
          className="text-amber-400 hover:underline font-bold text-xs"
        >
          View Privacy Policy →
        </button>
      </div>
    </div>
  );
};
