import React from 'react';
import { motion } from 'motion/react';
import { Compass, CheckCircle2, Clock, Sparkles, Layers, Shield, Cpu, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentLang, theme = 'dark' }) => {
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
      status: 'Completed',
      period: 'Q2 2026 - Q3 2026',
      items: [
        'Role-Based Access Control & Immutable Audit Trails',
        'Real-time Live Data Engine with NRB, NEPSE & FENEGOSIDA Verification',
        'Automated Vercel Build & Release Note Tracking',
        'Multilingual English & Nepali Search Assistance',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Public APIs & Transparent Support Portal',
      status: 'Completed',
      period: 'Q4 2026',
      items: [
        'Public API Directory & Live Utility Sandbox',
        'Transparent Campaign Donation Channel Controls',
        'Dual AD/BS Time & Calendar Synchronization Engine',
        'Play Store Data Compliance & Account Deletion Portal',
      ],
    },
    {
      phase: 'Phase 4 (v2.0.0)',
      title: 'Unified Account, Cross-Device Offline Sync & Android APK',
      status: 'Active',
      period: 'Q4 2026 - 2027',
      items: [
        'Firebase Auth + Cloud Firestore Cross-Device Synchronization',
        'IndexedDB Offline Outbox & Conflict Resolution Engine',
        'Hybrid Material Design 3 Light/Dark Interface Across Web & Mobile',
        'Signed Capacitor Android APK Build & OTA Release Notifications',
      ],
    },
  ];

  return (
    <div className={`space-y-6 max-w-7xl mx-auto pb-12 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header Bento Tile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-6 sm:p-10 rounded-2xl border overflow-hidden ${
          isDark
            ? 'bg-[#0B0F17]/90 border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200 shadow-lg'
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'विकास रणनीति' : 'Platform Roadmap'}</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentLang === 'ne' ? 'सारथी रणनीतिक विकास खाका' : 'Strategic Roadmap & Release Phases'}
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed font-sans max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {currentLang === 'ne'
              ? 'SAARTHI का प्रत्येक चरण दीर्घकालीन स्थायित्व, सुरक्षा र प्रयोगकर्ताको आवश्यकतालाई ध्यानमा राखेर निर्माण गरिएको छ।'
              : 'Explore the phased development timeline powering SAARTHI’s growth as a resilient, cross-platform technology platform.'}
          </p>
        </div>
      </motion.div>

      {/* Roadmap Timeline Bento Stack */}
      <div className="space-y-4">
        {phases.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-7 rounded-2xl border space-y-4 relative overflow-hidden transition-all group ${
              isDark
                ? 'bg-[#0B0F17]/90 border-slate-800 shadow-lg hover:border-slate-700/80'
                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />

            <div className={`flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b relative z-10 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs font-bold">
                  {item.phase}
                </span>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.period}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : item.status === 'Active'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : isDark
                      ? 'bg-slate-900 text-slate-400 border-slate-800'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.items.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.status === 'Completed'
                        ? 'text-emerald-500'
                        : item.status === 'Active'
                        ? 'text-amber-500'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
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
