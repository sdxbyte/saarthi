import React, { useState } from 'react';
import { ShieldCheck, Heart, FileText, Globe, Sparkles, Tag, ArrowUpRight, Cpu } from 'lucide-react';
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
    <footer className="mt-16 border-t border-slate-800/90 bg-[#06080D] text-slate-400 font-sans">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
        {/* Brand Bento Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />

          <div className="shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner relative z-10">
            <SaarthiLogo variant="compact" size={48} altText="SAARTHI Official Brand Logo" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2.5 relative z-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                SAARTHI Sovereign Technology Platform
              </h3>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                Private Civic Core
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-sans">
              SAARTHI is an independent, sovereign digital ecosystem engineered for financial clarity, verified Nepal Rastra Bank exchange metrics, NEPSE live capital analytics, Bikram Sambat dual-calendar intelligence, and verified public service utilities.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Cryptographic Vault</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30 font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>Nepal Dual AD/BS Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/30 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Zero-Third-Party Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Bento Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Column 1: Core Navigation Bento Tile */}
          <div className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Tag className="w-3.5 h-3.5" />
              <span>Core Navigation</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Home / Overview</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sajilo')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Sajilo Daily Hub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('services')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Central Directory</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('nepse')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>NEPSE & IPO Analytics</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('loksewa')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Lok Sewa & Vacancies</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Governance & Vision Bento Tile */}
          <div className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
            <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Governance & Vision</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>About SAARTHI</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-cyan-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vision')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>10-Year Master Vision</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-cyan-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('roadmap')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Release Roadmap</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-cyan-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Contact & Feedback</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-cyan-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('support')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Help Desk & FAQ</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-cyan-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies Bento Tile */}
          <div className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal & Privacy</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('privacy')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-amber-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('terms')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Terms of Service</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-amber-400" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('security')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>Data Security Standards</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-amber-400" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('accessibility')} className="hover:text-white text-slate-400 transition-colors text-left cursor-pointer flex items-center justify-between w-full group/link">
                  <span>WCAG Accessibility</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-amber-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Project Bento Tile */}
          <div className="p-5 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Project Support</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                SAARTHI is independently maintained. Community contributions sustain high-availability cloud infrastructure and verified financial feeds.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('donate')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 group/btn"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current group-hover/btn:scale-110 transition-transform" />
              <span>Support SAARTHI</span>
            </button>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} SAARTHI Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-emerald-400 font-bold">Version {CURRENT_VERSION_INFO.version}</span>
            <span>•</span>
            <span>Release {CURRENT_VERSION_INFO.releaseDateAd}</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{CURRENT_VERSION_INFO.releaseDateBs}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
