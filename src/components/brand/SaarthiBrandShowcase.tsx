import React, { useState } from 'react';
import { SaarthiLogo } from './SaarthiLogo';
import { ShieldCheck, Copy, Check, Sparkles } from 'lucide-react';

export const SaarthiBrandShowcase: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8 p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl">
      {/* Brand Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              OFFICIAL BRAND IDENTITY
            </span>
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              EXACT NAME: SAARTHI
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>SAARTHI Brand & Logo System</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A clean, modern, and memorable product identity designed for a private digital platform and technology ecosystem.
          </p>
        </div>

        <button
          onClick={() => handleCopy('SAARTHI')}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          {copiedText === 'SAARTHI' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
          <span>Copy Official Name: SAARTHI</span>
        </button>
      </div>

      {/* Grid of 4 Required Logo System Variations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Main Logo (Icon + SAARTHI Text) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="text-sm font-bold text-white">1. Main Logo (Icon + SAARTHI Text)</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Header & Web</span>
          </div>

          <div className="p-8 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center min-h-[140px] shadow-inner">
            <SaarthiLogo variant="main" theme="dark" size="lg" showTagline={true} />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Combines the bespoke geometric dual-apex emblem with crisp SAARTHI typography. Used on web headers, application entrypoints, and portal footers.
          </p>
        </div>

        {/* 2. Compact App Icon Version */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="text-sm font-bold text-white">2. Compact App Icon Version</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Mobile App / Favicon</span>
          </div>

          <div className="p-8 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center gap-6 min-h-[140px] shadow-inner">
            <div className="flex flex-col items-center gap-2">
              <SaarthiLogo variant="compact" theme="dark" size={64} />
              <span className="text-[10px] font-mono text-slate-400">64px App Launcher</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SaarthiLogo variant="compact" theme="dark" size={40} />
              <span className="text-[10px] font-mono text-slate-400">40px Header Icon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SaarthiLogo variant="compact" theme="dark" size={28} />
              <span className="text-[10px] font-mono text-slate-400">28px Favicon</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Precision squircle app icon vector geometry with smooth continuous curves. Scalable down to favicon dimensions while retaining strong visual recognition.
          </p>
        </div>

        {/* 3. Dark Background Version */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <h3 className="text-sm font-bold text-white">3. Dark Background Version</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Dark Mode / Slate Canvas</span>
          </div>

          <div className="p-8 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center min-h-[140px] shadow-inner">
            <SaarthiLogo variant="main" theme="dark" size="md" showTagline={true} />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            High-contrast luminescent white typography with deep sapphire and emerald gradients optimized for dark interfaces and night usage.
          </p>
        </div>

        {/* 4. Light Background Version */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="text-sm font-bold text-white">4. Light Background Version</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Light Mode / White Canvas</span>
          </div>

          <div className="p-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center min-h-[140px] shadow-inner">
            <SaarthiLogo variant="main" theme="light" size="md" showTagline={true} />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Deep slate-900 typography with rich gradient emblem accents for maximum legibility on light mode backgrounds and documentation.
          </p>
        </div>
      </div>

      {/* Brand Identity Standards */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SAARTHI Identity Specifications</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 font-mono text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Official Name</span>
            <span className="font-extrabold text-amber-300">SAARTHI</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Accent Palette</span>
            <span className="font-extrabold text-cyan-300">Cobalt Indigo & Emerald Cyan</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Product Positioning</span>
            <span className="font-extrabold text-emerald-300">Digital Platform & Civic Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
