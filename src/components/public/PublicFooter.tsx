import React, { useState } from 'react';
import { ShieldCheck, Heart, FileText, Lock, Globe, MessageSquare, Mail, Phone, ExternalLink, Sparkles, Tag } from 'lucide-react';
import { SaarthiLogo } from '../brand/SaarthiLogo';
import { CURRENT_VERSION_INFO } from '../../utils/versionEngine';

interface PublicFooterProps {
  onNavigateTab: (tab: string) => void;
  theme: 'dark' | 'light';
  currentLang: 'en' | 'ne';
  onOpenAdminModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigateTab, theme, currentLang, onOpenAdminModal }) => {
  const isDark = theme === 'dark';
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'accessibility' | 'security' | null>(null);

  return (
    <footer className={`mt-16 border-t transition-all text-xs font-sans ${
      isDark ? 'bg-[#0a0b0d] border-[#262a31] text-[#8b909b]' : 'bg-slate-100 border-slate-200 text-slate-700 shadow-inner'
    }`}>
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        
        {/* Prominent Big Logo Brand Header Section */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 ${
          isDark ? 'bg-[#14161b] border-[#262a31]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Big Logo on Left Side */}
          <div className={`shrink-0 flex items-center justify-center p-3 sm:p-4 rounded-2xl border shadow-md ring-2 ring-amber-500/20 group hover:ring-amber-500/40 transition-all ${
            isDark ? 'bg-[#0a0b0d] border-[#262a31]' : 'bg-slate-50 border-slate-200'
          }`}>
            <SaarthiLogo
              variant="compact"
              theme={isDark ? 'dark' : 'light'}
              size={88}
              altText="SAARTHI Official Brand Logo"
            />
          </div>

          {/* Text Information Next to Big Logo */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                SAARTHI Private Technology Platform
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Private Project
              </span>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-3xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              SAARTHI is an independent, privately developed digital application engineered for financial tools, utilities, external public service links, and issue report management. SAARTHI is not an official government entity or portal.
            </p>

            {/* Badges Row */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20 font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>Nepal Dual AD/BS Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>High-Availability Live Architecture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
          {/* Column 1: Core Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Core Navigation</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Home / Citizen Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('gov-services')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Civic & Public Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('schemes')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Public Schemes Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('announcements')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Official Public Notices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('loksewa')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Lok Sewa & Civic Vacancies
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Governance & Vision */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Governance & Vision</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  About SAARTHI Platform
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vision')} className="hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold text-left">
                  Platform Vision Statement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('roadmap')} className="hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold text-left">
                  Official Release Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Grievance & Public Feedback
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('support')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Help Desk & User Manual
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal & Policies</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigateTab('privacy')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Citizen Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Terms of Service & Usage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('account-deletion')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Account Deletion Request
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('accessibility')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Accessibility Standards
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('security')} className="hover:text-amber-600 dark:hover:text-amber-300 transition-all text-left font-medium">
                  Security & Data Encryption
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('donate')} className="hover:text-amber-600 dark:hover:text-amber-400 font-bold flex items-center gap-1.5 text-left">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" />
                  <span>Support Project (Donate)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Gateway & Location */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Support Gateway</span>
            </h4>
            <div className={`space-y-2.5 text-[11px] ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-medium">Contact via Help Desk Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">24/7 Citizen Emergency Desk</span>
              </div>
              <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Kathmandu, Federal Democratic Republic of Nepal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Version Banner & Bottom Bar */}
      <div className={`border-t py-4 px-4 sm:px-6 ${
        isDark ? 'border-[#262a31] bg-[#0a0b0d]' : 'border-slate-200 bg-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} SAARTHI Private Application. All Rights Reserved.</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className={`px-3 py-1 rounded-xl border font-mono text-[11px] font-semibold flex items-center gap-2 ${
              isDark ? 'bg-[#14161b] border-[#262a31] text-slate-300' : 'bg-white border-slate-300 text-slate-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{CURRENT_VERSION_INFO.footerText}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button onClick={() => onNavigateTab('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-all">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigateTab('terms')} className="hover:text-slate-900 dark:hover:text-white transition-all">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => onNavigateTab('donate')} className="text-amber-700 dark:text-amber-400 hover:underline font-bold transition-all flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
              <span>Support Project</span>
            </button>
            {onOpenAdminModal && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdminModal}
                  className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all font-mono text-[10px]"
                >
                  Official Admin Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Policy Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-white">
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'accessibility' && 'Accessibility Statement'}
                {activeModal === 'security' && 'Security & Data Protection'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 max-h-80 overflow-y-auto leading-relaxed text-slate-300">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    Saarthi respects citizen privacy. Personal details collected during optional user registration are encrypted and strictly used for authentication and grievance resolution tracking.
                  </p>
                  <p>
                    Public browsing is unauthenticated and does not track personal identifying information. We store no sensitive passwords in plaintext.
                  </p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>
                    By utilizing the Saarthi platform, citizens agree to provide truthful information when submitting public grievances and official service applications.
                  </p>
                  <p>
                    Misuse or spamming of civic forms is prohibited and subject to automated security blocking.
                  </p>
                </>
              )}
              {activeModal === 'accessibility' && (
                <>
                  <p>
                    Saarthi is committed to digital accessibility. We adhere to WCAG 2.1 AA standards including high-contrast color themes, keyboard navigation, semantic HTML, and screen reader compatibility.
                  </p>
                </>
              )}
              {activeModal === 'security' && (
                <>
                  <p>
                    Saarthi implements modern DevSecOps security headers, rate limiting, CSRF defense, and server-side role authorization to safeguard all public and municipal administrative data.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

