import React from 'react';
import { motion } from 'motion/react';
import { Compass, CheckCircle2, Clock, Sparkles, Layers, Shield, Cpu, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentLang }) => {
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bento Tile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 sm:p-10 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'विकास रणनीति' : 'Platform Roadmap'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {currentLang === 'ne' ? 'सारथी रणनीतिक विकास खाका' : 'Strategic Roadmap & Release Phases'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
            {currentLang === 'ne'
              ? 'SAARTHI का प्रत्येक चरण दीर्घकालीन स्थायित्व, सुरक्षा र प्रयोगकर्ताको आवश्यकतालाई ध्यानमा राखेर निर्माण गरिएको छ।'
              : 'Explore the phased development timeline powering SAARTHI’s growth as a resilient, enterprise-grade technology platform.'}
          </p>
        </div>
      </motion.div>

      {/* Roadmap Timeline Bento Stack */}
      <div className="space-y-4">
        {phases.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-4 relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80 relative z-10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                  {item.phase}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{item.period}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : item.status === 'Active'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-300 relative z-10">
              {item.items.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.status === 'Completed' ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
