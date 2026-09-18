import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Compass, Eye, Cpu, Database, ArrowRight, Lock, CheckCircle2, Layers } from 'lucide-react';

interface VisionViewProps {
  currentLang: 'en' | 'ne';
  theme?: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const VisionView: React.FC<VisionViewProps> = ({ currentLang, theme = 'dark', onNavigateTab }) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden shadow-2xl ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border-slate-800'
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{currentLang === 'ne' ? 'दीर्घकालीन १०-वर्षीय खाका' : 'SAARTHI 10-Year Master Vision'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight">
            {currentLang === 'ne'
              ? 'प्रविधि, सुरक्षा र मार्गदर्शनको एकीकृत भविष्य'
              : 'Empowering Citizens through Intelligent, Secure & Scalable Technology'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {currentLang === 'ne'
              ? 'SAARTHI कुनै एक सीमित वेबसाइट होइन। यो दीर्घकालीन १०-वर्षे प्रविधि इकोसिस्टम हो जसले नागरिकहरूलाई सशक्त, सुरक्षित र पारदर्शी सेवा प्रदान गर्दछ।'
              : 'SAARTHI is designed as a long-term technology platform built on guidance, trust, intelligence, uncompromised security, and continuous innovation.'}
          </p>
        </div>
      </motion.div>

      {/* Core Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">1. Digital Platform Guidance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrating automated legal rules reasoning to assist citizens with tax calculations, legal rights, documentation, and official procedures.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">2. Security & Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero-trust architecture, permanent Owner/Super Admin privilege protection, encrypted vault storage, and strict data isolation.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">3. Modular Scalability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extensible architecture supporting digital identity, automated audit logs, volunteer networks, transparent donation tracking, and public APIs.
          </p>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
      }`}>
        <div>
          <h4 className="font-bold text-sm">Explore Platform Evolution</h4>
          <p className="text-xs text-slate-400">Review the official multi-phase deployment roadmap and feature timeline.</p>
        </div>
        <button
          onClick={() => onNavigateTab('roadmap')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md"
        >
          <span>View Platform Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
