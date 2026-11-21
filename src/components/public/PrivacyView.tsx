import React from 'react';
import { ShieldCheck, Lock, Eye, Server, UserCheck, Globe, ArrowLeft } from 'lucide-react';

interface PrivacyViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ theme, onNavigateTab }) => {
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
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-500">Data Protection Policy</span>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy Policy</h1>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
          Effective Date: August 2026 • Operator: SAARTHI Private Technology Platform (<code className="font-mono">saarthi.dpdns.org</code>). SAARTHI is designed for adult users (18+) and protects user privacy with minimal data collection and strict transport security.
        </p>
      </div>

      {/* Content */}
      <div
        className={`p-8 rounded-3xl border shadow-xl space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>1. Information We Collect &amp; Purpose</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            Browsing the Bikram Sambat calendar, NRB forex viewer, financial calculators, and public directories requires NO account registration and collects NO personally identifiable information. Data is only processed when you explicitly use interactive features:
          </p>
          <ul className={`list-disc list-inside text-xs space-y-1.5 pl-2 ${bodyText}`}>
            <li>
              <strong>Issue Reports &amp; Support Tickets (<code className="font-mono">/api/support/tickets</code>):</strong> Full name, email address, optional phone number, category, and message submitted through the Contact / Report Issue or Account Deletion forms. Stored in SAARTHI&apos;s server database and dispatched to the platform administrator to resolve your request.
            </li>
            <li>
              <strong>Local Citizen Account &amp; Document Vault:</strong> Profile details and saved document metadata created in the optional Citizen Account modal are stored strictly locally on your device (<code className="font-mono">localStorage</code>) with salted SHA-256 credential hashing.
            </li>
            <li>
              <strong>Server Diagnostics &amp; Security Logs:</strong> Transient server request metadata (IP address, route, status code, AD/BS timestamps) used solely for rate-limiting, abuse prevention, and immutable audit compliance.
            </li>
            <li>
              <strong>Analytics &amp; Advertising:</strong> SAARTHI runs zero third-party ad SDKs, zero cross-app tracking pixels, and no behavioral analytics cookies.
            </li>
          </ul>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>2. Zero Data Sale &amp; Third-Party Services</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            Your personal data is NEVER sold, rented, or shared with advertisers or data brokers. Issue reports may be transmitted over encrypted TLS (SMTP) solely to notify the SAARTHI platform owner (<code className="font-mono">sudipadhikari8107@gmail.com</code>) for resolution.
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>3. External Directories (OSINT4ALL, Government &amp; Financial Portals)</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            SAARTHI provides curated directory links to third-party websites (including OSINT4ALL resources, NEPSE, NRB, CDSC, IRD, DoTM, and FM radio streams). Clicking external links opens third-party domains governed by their own privacy policies; SAARTHI does not control or assume responsibility for external websites.
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>4. Security, Encryption &amp; Retention</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            All network traffic is enforced over HTTPS/TLS with HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), and HttpOnly/SameSite session cookies for administrative access. Support tickets are retained only as long as necessary to resolve inquiries or comply with audit logs, unless deletion is requested.
          </p>
        </section>

        <section className={`space-y-2 border-t pt-4 ${sectionBorder}`}>
          <h2 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>5. User Rights, Age Target (18+) &amp; Account Deletion</span>
          </h2>
          <p className={`text-xs leading-relaxed ${bodyText}`}>
            SAARTHI is intended for adults aged 18 and older and is not directed to children under 13. Users may permanently clear local account/vault data and request server ticket/record deletion in-app or via the public web URL at{' '}
            <button
              onClick={() => onNavigateTab('account-deletion')}
              className="text-emerald-500 font-bold underline hover:text-emerald-400"
            >
              https://saarthi.dpdns.org/account-deletion
            </button>
            . Contact: <code className="font-mono">sudipadhikari8107@gmail.com</code>.
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
          className="text-emerald-500 hover:underline font-bold text-xs"
        >
          View Terms &amp; Conditions →
        </button>
      </div>
    </div>
  );
};
