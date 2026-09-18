import React from 'react';
import { ShieldCheck, Compass, Target, Sparkles, Lock, Eye, Users, Cpu, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tab: string) => void;
  theme: 'dark' | 'light';
}

export const AboutView: React.FC<AboutViewProps> = ({ currentLang, onNavigateTab, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 px-4 font-sans text-slate-100">
      {/* Hero Banner */}
      <div className={`p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800' : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 border-slate-800'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Private Technology Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Independent Technology Platform for Financial Tools & Public Utilities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            SAARTHI is a private, independent technology application built to provide access to financial tools, public utility directories, external service references, and issue report management with transparency and high-availability design.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateTab('gov-services')}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all"
            >
              <span>Explore Public Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('contact')}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className={`p-8 rounded-3xl border space-y-4 relative overflow-hidden transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Deliver secure, simple, and accessible digital civic services that connect citizens with essential public services efficiently, eliminating bureaucratic friction and physical queuing.
          </p>
        </div>

        {/* Vision */}
        <div className={`p-8 rounded-3xl border space-y-4 relative overflow-hidden transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Vision</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Build a trusted digital platform that improves transparency, accessibility, and public engagement through modern, privacy-respecting technology.
          </p>
        </div>
      </div>

      {/* What Saarthi Offers */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Core Platform Capabilities
          </span>
          <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>What Saarthi Offers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Centralized Civic Services',
              desc: 'Single-window access to government schemes, tax utilities, municipal portals, and official forms.',
              icon: FileText,
              color: 'amber',
            },
            {
              title: 'Grievance Redressal',
              desc: 'Submit and track infrastructure complaints or public grievances directly to municipal authorities.',
              icon: ShieldCheck,
              color: 'emerald',
            },
            {
              title: 'Application Tracking',
              desc: 'Real-time progress monitoring for citizenship applications, license renewals, and official documents.',
              icon: Eye,
              color: 'sky',
            },
            {
              title: 'Emergency Contacts',
              desc: 'Instant access to emergency dispatch, police helpline, fire service, and disaster response teams.',
              icon: Users,
              color: 'rose',
            },
            {
              title: 'Government Announcements',
              desc: 'Verified public circulars, tender notices, and official government press releases in real time.',
              icon: Sparkles,
              color: 'violet',
            },
            {
              title: 'Grounded Platform Guidance',
              desc: 'Interactive digital portal providing verified information on tax procedures, documents, and civic rights.',
              icon: Cpu,
              color: 'yellow',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border space-y-3 transition-all hover:scale-[1.01] ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className={`p-8 sm:p-10 rounded-3xl border space-y-6 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl'
      }`}>
        <div className="text-left space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Principles
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Core Values</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {[
            { label: 'Transparency', desc: 'Open data and public tracking' },
            { label: 'Security', desc: 'Enterprise data protection' },
            { label: 'Accessibility', desc: 'Inclusive for all citizens' },
            { label: 'Reliability', desc: 'High availability & verified info' },
            { label: 'Innovation', desc: 'Modern digital web standards' },
            { label: 'Citizen-Centered Design', desc: 'Intuitive and fast user flows' },
          ].map((val, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{val.label}</span>
              </div>
              <p className="text-[11px] text-slate-400">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security Commitment */}
      <div className={`p-8 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy & Security Commitment</h2>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Saarthi follows modern security practices to protect user information and continuously improves its security posture. Public visitors can browse all government resources without sharing personal credentials. When authentication is required for personal services, credentials are encrypted and stored securely with strict role-based authorization controls.
        </p>
      </div>

      {/* Future Roadmap */}
      <div className={`p-8 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Future Roadmap</h2>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Planned platform enhancements include multi-language voice search, automated SMS notifications for complaint resolution milestones, direct integration with provincial tax gateways, and enhanced offline form support for remote municipal wards.
        </p>
      </div>
    </div>
  );
};
