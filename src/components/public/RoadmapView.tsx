import React from 'react';
import { motion } from 'motion/react';
import { Compass, CheckCircle2, Clock, Sparkles, Layers, Shield, Cpu, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentLang, theme = 'dark', onNavigateTab }) => {
  const isDark = theme === 'dark';

  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation & Core Civic Engine',
      status: 'Completed',
      period: '2025 - Q1 2026',
      items: [
        'Unified Civic & FinTech Platform (NEPSE, Tax, Bluebook, Lok Sewa, e-PAN)',
        'SAARTHI Smart Digital Guidance & Rules Engine',
        'Secure Vault & Document Verification System',
        'Developer Command Center & GitHub Automated Backups',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Digital Identity & Enterprise Auditing',
      status: 'Active',
      period: 'Q2 2026 - Q4 2026',
      items: [
        'Multi-factor Authentication & Role-Based Access Control',
        'Real-time Audit Logs & Security Center Controls',
        'Automated Vercel Build & Cloud Synchronization',
        'Enhanced Multilingual Voice & Search Assistance',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Public API & Transparent Donation Engine',
      status: 'Upcoming',
      period: '2027',
      items: [
        'Public API Access for Civic Developers & Researchers',
        'Transparent Campaign Donation & QR Verification Engine (Disabled until official launch)',
        'Emergency Coordination Network & Offline Sync',
        'Native Mobile Applications (iOS & Android)',
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden shadow-2xl ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border-slate-800'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Layers className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'विकास रणनीति' : 'Platform Roadmap'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight">
          {currentLang === 'ne' ? 'सारथी रणनीतिक विकास खाका' : 'Strategic Roadmap & Release Phases'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mt-2">
          {currentLang === 'ne'
            ? 'SAARTHI का प्रत्येक चरण दीर्घकालीन स्थायित्व, सुरक्षा र प्रयोगकर्ताको आवश्यकतालाई ध्यानमा राखेर निर्माण गरिएको छ।'
            : 'Explore the phased development timeline powering SAARTHI’s growth as a resilient, enterprise-grade technology platform.'}
        </p>
      </motion.div>

      {/* Roadmap Timeline */}
      <div className="space-y-6">
        {phases.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 relative overflow-hidden transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-extrabold">
                  {item.phase}
                </span>
                <h3 className="text-lg font-extrabold">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{item.period}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : item.status === 'Active'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              {item.items.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.status === 'Completed' ? 'text-emerald-400' : 'text-indigo-400'
                    }`}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
