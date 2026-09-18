import React, { useState } from 'react';
import { ShieldCheck, Heart, FileText, Globe, Sparkles, Tag } from 'lucide-react';
import { SaarthiLogo } from '../brand/SaarthiLogo';
import { CURRENT_VERSION_INFO } from '../../utils/versionEngine';

interface PublicFooterProps {
  onNavigateTab: (tab: string) => void;
  theme: 'dark' | 'light';
  currentLang: 'en' | 'ne';
  onOpenAdminModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigateTab }) => {
  const [, setActiveModal] = useState<'privacy' | 'terms' | 'accessibility' | 'security' | null>(null);

  return (
    <footer className="mt-12 border-t border-[var(--color-divider)] text-xs font-sans bg-[var(--color-chrome)] text-[var(--color-text-secondary)]">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Brand Card Section */}
        <div className="surface-card p-5 sm:p-6 rounded-[12px] flex flex-col md:flex-row items-center md:items-start gap-5">
          <div className="shrink-0 p-2.5 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)]">
            <SaarthiLogo variant="compact" size={48} altText="SAARTHI Official Brand Logo" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--color-text)]">
                SAARTHI Private Technology Platform
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/30 text-[var(--color-accent-mark)] font-mono text-[10px] font-medium uppercase">
                Private Project
              </span>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              SAARTHI is an independent, privately developed digital application engineered for financial tools, verified NRB & NEPSE metrics, Bikram Sambat calendar, and citizen utilities.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-[var(--color-positive)] bg-[var(--color-positive)]/10 px-2.5 py-0.5 rounded-[5px] border border-[var(--color-positive)]/20 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-accent-mark)] bg-[var(--color-accent-muted)] px-2.5 py-0.5 rounded-[5px] border border-[var(--color-accent-mark)]/20 font-medium">
                <Globe className="w-3 h-3" />
                <span>Nepal Dual AD/BS Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] px-2.5 py-0.5 rounded-[5px] border border-[var(--color-border)] font-medium">
                <Sparkles className="w-3 h-3" />
                <span>High-Availability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Column 1: Core Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[var(--color-accent-mark)] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              <span>Core Navigation</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Home / Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sajilo')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Sajilo (Daily Essentials)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('services')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Services Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('nepse')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  NEPSE & Stock Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('loksewa')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Lok Sewa & Vacancies
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Governance & Vision */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[var(--color-accent-mark)] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>Governance & Vision</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  About SAARTHI Platform
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vision')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Platform Vision Statement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('roadmap')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Official Release Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Feedback & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('support')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Help Desk & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[var(--color-accent-mark)] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span>Legal & Policies</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigateTab('privacy')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('security')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  Data Security Standards
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('accessibility')} className="hover:text-[var(--color-text)] transition-colors text-left cursor-pointer">
                  WCAG Accessibility Statement
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Project */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[var(--color-accent-mark)] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-[var(--color-negative)]" />
              <span>Project Support</span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              SAARTHI is independently maintained. Community contributions help sustain high-availability infrastructure and verified data feeds.
            </p>
            <button
              onClick={() => onNavigateTab('donate')}
              className="w-full py-2 px-3 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-accent-mark)] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Heart className="w-3 h-3 text-[var(--color-negative)]" />
              <span>Support SAARTHI</span>
            </button>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-6 border-t border-[var(--color-divider)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-text-muted)] font-mono">
          <div>
            © {new Date().getFullYear()} SAARTHI Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Version {CURRENT_VERSION_INFO.version}</span>
            <span>•</span>
            <span>Release {CURRENT_VERSION_INFO.releaseDateAd}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
