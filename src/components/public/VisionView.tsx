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
      {/* Hero Bento Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 sm:p-10 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{currentLang === 'ne' ? 'दीर्घकालीन १०-वर्षीय खाका' : 'SAARTHI 10-Year Master Vision'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {currentLang === 'ne'
              ? 'प्रविधि, सुरक्षा र मार्गदर्शनको एकीकृत भविष्य'
              : 'Empowering Citizens through Intelligent, Secure & Scalable Technology'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {currentLang === 'ne'
              ? 'SAARTHI कुनै एक सीमित वेबसाइट होइन। यो दीर्घकालीन १०-वर्षे प्रविधि इकोसिस्टम हो जसले नागरिकहरूलाई सशक्त, सुरक्षित र पारदर्शी सेवा प्रदान गर्दछ।'
              : 'SAARTHI is designed as a long-term technology platform built on guidance, trust, intelligence, uncompromised security, and continuous innovation.'}
          </p>
        </div>
      </motion.div>

      {/* Core Platform Bento Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">1. Digital Platform Guidance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrating automated legal rules reasoning to assist citizens with tax calculations, legal rights, documentation, and official procedures.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 w-fit">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">2. Security & Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero-trust architecture, permanent Owner/Super Admin privilege protection, encrypted vault storage, and strict data isolation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 space-y-3.5 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 w-fit">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">3. Modular Scalability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extensible architecture supporting digital identity, automated audit logs, volunteer networks, transparent donation tracking, and public APIs.
          </p>
        </div>
      </div>

      {/* Navigation Bento CTA */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0B0F17]/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-white">Explore Platform Evolution</h4>
          <p className="text-xs text-slate-400">Review the official multi-phase deployment roadmap and feature timeline.</p>
        </div>
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>View Platform Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
