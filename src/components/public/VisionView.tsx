import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Compass, Eye, Cpu, Database, ArrowRight, Lock, CheckCircle2, Layers } from 'lucide-react';

interface VisionViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const VisionView: React.FC<VisionViewProps> = ({ currentLang, onNavigateTab }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 sm:p-10 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0B1F3A]/5 dark:bg-blue-500/10 border border-[#0B1F3A]/15 dark:border-blue-500/30 text-[#0B1F3A] dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
            <span>{currentLang === 'ne' ? 'दीर्घकालीन १०-वर्षीय खाका' : 'SAARTHI 10-Year Master Vision'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] dark:text-white tracking-tight leading-tight">
            {currentLang === 'ne'
              ? 'प्रविधि, सुरक्षा र मार्गदर्शनको एकीकृत भविष्य'
              : 'Empowering Citizens through Intelligent, Secure & Scalable Technology'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'ne'
              ? 'SAARTHI कुनै एक सीमित वेबसाइट होइन। यो दीर्घकालीन १०-वर्षे प्रविधि इकोसिस्टम हो जसले नागरिकहरूलाई सशक्त, सुरक्षित र पारदर्शी सेवा प्रदान गर्दछ।'
              : 'SAARTHI is designed as a long-term technology platform built on guidance, trust, intelligence, uncompromised security, and continuous innovation.'}
          </p>
        </div>
      </motion.div>

      {/* Core Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? '१. डिजिटल प्लेटफर्म मार्गदर्शन' : '1. Digital Platform Guidance'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Integrating automated legal rules reasoning to assist citizens with tax calculations, legal rights, documentation, and official procedures.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? '२. सुरक्षा र गोपनीयता' : '2. Security & Privacy'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Zero-trust architecture, permanent Owner/Super Admin privilege protection, encrypted vault storage, and strict data isolation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? '३. मोड्युलर स्केलेबिलिटी' : '3. Modular Scalability'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Extensible architecture supporting digital identity, automated audit logs, transparent donation tracking, and verified public feeds.
          </p>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? 'प्लेटफर्म विकास क्रम हेर्नुहोस्' : 'Explore Platform Evolution'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Review the official multi-phase deployment roadmap and feature timeline.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132F56] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
        >
          <span>{currentLang === 'ne' ? 'रोडम्याप हेर्नुहोस्' : 'View Platform Roadmap'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
