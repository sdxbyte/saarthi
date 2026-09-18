import React from 'react';
import { ShieldCheck, Lock, Eye, Server, UserCheck, Key, ArrowLeft } from 'lucide-react';

interface PrivacyViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ currentLang, theme, onNavigateTab }) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 font-sans text-slate-100">
      {/* Header */}
      <div className={`p-8 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">Data Protection Policy</span>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy Policy</h1>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Effective Date: January 1, 2026. Saarthi is committed to safeguarding user privacy, protecting personal data, and maintaining enterprise-grade security standards.
        </p>
      </div>

      {/* Content */}
      <div className={`p-8 rounded-3xl border shadow-xl space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Browsing public service information, tax calculators, NEPSE stocks, and emergency hotlines requires NO registration and collects NO personal data. We only collect information when you explicitly interact with personalized features:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-2">
            <li><strong>Account Creation:</strong> Name, Email Address, and encrypted account credentials.</li>
            <li><strong>Grievance Submission:</strong> Incident description, location details, and optional photo attachments.</li>
            <li><strong>Document Vault:</strong> Citizen credentials stored strictly with client-side local encryption.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>2. Zero Third-Party Data Sharing</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Your personal information is NEVER sold, rented, monetized, or shared with third-party advertisers or data brokers. Data collected during complaint logging is strictly routed to designated municipal department desks for resolution.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>3. Password Security & Cryptography</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            Passwords are never stored in plaintext. We utilize modern salted password hashing (Argon2id/bcrypt) and HTTPS encryption in transit. Administrative systems enforce strict zero-public-exposure rules to protect system credentials.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>4. User Privacy Rights & Google Play Account Deletion</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            You maintain full ownership of your data. Users have the right to request permanent account and associated data deletion at any time without installing the app by visiting our dedicated deletion portal at{' '}
            <button
              onClick={() => onNavigateTab('account-deletion')}
              className="text-emerald-400 font-bold underline hover:text-emerald-300"
            >
              https://saarthi.dpdns.org/?tab=account-deletion
            </button>
            .
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
          onClick={() => onNavigateTab('terms')}
          className="text-emerald-400 hover:underline font-bold text-xs"
        >
          View Terms & Conditions →
        </button>
      </div>
    </div>
  );
};
