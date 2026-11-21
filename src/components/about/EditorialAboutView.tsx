import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe, FileText, Heart, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { VisionView } from '../public/VisionView';
import { RoadmapView } from '../public/RoadmapView';
import { ContactView } from '../public/ContactView';
import { TermsView } from '../public/TermsView';
import { PrivacyView } from '../public/PrivacyView';
import { AccountDeletionView } from '../public/AccountDeletionView';
import { SupportHelpView } from '../public/SupportHelpView';
import { SupportProjectView } from '../public/SupportProjectView';

interface EditorialAboutViewProps {
  currentLang: 'en' | 'ne';
  activeSection?: string;
  onNavigateTab: (tab: string) => void;
}

type AboutTab = 'overview' | 'vision' | 'roadmap' | 'contact' | 'terms' | 'privacy' | 'support' | 'donate' | 'account-deletion';

export const EditorialAboutView: React.FC<EditorialAboutViewProps> = ({
  currentLang,
  activeSection = 'overview',
  onNavigateTab,
}) => {
  const [currentTab, setCurrentTab] = useState<AboutTab>(() => {
    if (['vision', 'roadmap', 'contact', 'terms', 'privacy', 'support', 'donate', 'account-deletion'].includes(activeSection)) {
      return activeSection as AboutTab;
    }
    return 'overview';
  });

  const handleTabClick = (tab: AboutTab) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      onNavigateTab('about');
    } else {
      onNavigateTab(tab);
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vision', label: 'Vision & Architecture' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'contact', label: 'Contact' },
    { id: 'support', label: 'Help Desk' },
    { id: 'donate', label: 'Support Project' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'terms', label: 'Terms' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-fadeIn font-sans">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono block">
            Independent Digital Platform
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-sans">
            {currentLang === 'ne' ? 'सार्ती परियोजनाको बारेमा' : 'About SAARTHI'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'नेपालका लागि स्वच्छ, विज्ञापनरहित र वास्तविक तथ्याङ्कमा आधारित डिजिटल औजारहरूको खुला प्लेटफर्म।'
              : 'A minimal, ad-free digital product engineered to provide reliable capital market metrics, civic calculators, and official directories for citizens of Nepal.'}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as AboutTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {currentTab === 'overview' && (
        <div className="space-y-12">
          {/* Statement of Purpose */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Purpose & Design Philosophy
            </h2>
            <div className="prose prose-invert max-w-3xl text-sm sm:text-base text-zinc-300 space-y-4 leading-relaxed font-sans">
              <p>
                SAARTHI is built to solve a simple problem: finding reliable, verified public information and calculation tools in Nepal usually requires navigating cluttered portals, intrusive advertisements, or unreliable aggregators.
              </p>
              <p>
                We believe public digital infrastructure should be fast, quiet, respectful of user attention, and completely honest with data. Every price quote, exchange rate, and tax slab is verified against primary sources like the Nepal Rastra Bank, SEBON, DoTM, and Inland Revenue Department.
              </p>
            </div>
          </section>

          {/* 3 Core Commitments */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/80">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">COMMITMENT 01</span>
              <h3 className="text-base font-semibold text-white">Authentic Financial Data</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                We never estimate market prices or invent stock predictions. If an official exchange rate or NEPSE index is unavailable from the regulator, we clearly state that data is unavailable.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">COMMITMENT 02</span>
              <h3 className="text-base font-semibold text-white">Local-First Privacy</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Your bluebook calculations, tax income entries, document vault uploads, and quick notes never touch external trackers or servers. Everything remains encrypted in your local browser.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">COMMITMENT 03</span>
              <h3 className="text-base font-semibold text-white">Dual Date Engine</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Full integration of Nepal’s official Bikram Sambat (BS) calendar alongside Gregorian (AD) dates across all services, audit histories, and timestamps.
              </p>
            </div>
          </section>

          {/* Quick Links to Sub-pages */}
          <section className="border-t border-zinc-800/80 pt-8 space-y-4">
            <h2 className="text-base font-semibold text-white">Project Governance & Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleTabClick('vision')}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white group-hover:text-zinc-200">Vision & Architecture</span>
                  <span className="text-xs text-zinc-400 group-hover:text-white font-mono">Read →</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Read about the sovereign technology blueprint and design principles.</p>
              </button>

              <button
                onClick={() => handleTabClick('support')}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white group-hover:text-zinc-200">Citizen Help Desk</span>
                  <span className="text-xs text-zinc-400 group-hover:text-white font-mono">Open →</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Frequently asked questions and guides for using SAARTHI utilities.</p>
              </button>

              <button
                onClick={() => handleTabClick('contact')}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white group-hover:text-zinc-200">Contact the Project</span>
                  <span className="text-xs text-zinc-400 group-hover:text-white font-mono">Send →</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Submit inquiries, data discrepancies, or feedback directly.</p>
              </button>

              <button
                onClick={() => handleTabClick('donate')}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white group-hover:text-zinc-200">Support the Project</span>
                  <span className="text-xs text-zinc-400 group-hover:text-white font-mono">View →</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Donation channels and project contribution details.</p>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Embedded Sub-views */}
      {currentTab === 'vision' && <VisionView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'roadmap' && <RoadmapView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'contact' && <ContactView currentLang={currentLang} theme="dark" />}
      {currentTab === 'support' && <SupportHelpView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'donate' && <SupportProjectView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'privacy' && <PrivacyView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'terms' && <TermsView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
      {currentTab === 'account-deletion' && <AccountDeletionView currentLang={currentLang} theme="dark" onNavigateTab={onNavigateTab} />}
    </div>
  );
};
