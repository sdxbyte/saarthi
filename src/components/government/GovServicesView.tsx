import React, { useState } from 'react';
import { Building, BookOpen, FileSpreadsheet, ExternalLink, Download, CheckCircle, Search, Activity, ArrowRight, ShieldCheck, Clock, FileText } from 'lucide-react';
import { MOCK_GOV_SERVICES, MOCK_GOV_FORMS, MOCK_LAWS } from '../../data/governmentData';

interface GovServicesViewProps {
  currentLang: 'en' | 'ne';
}

export const GovServicesView: React.FC<GovServicesViewProps> = ({ currentLang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'forms' | 'laws'>('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredServices = MOCK_GOV_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.titleNp.includes(searchTerm) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
        <span>
          {currentLang === 'ne'
            ? 'सूचना: सारथि एक स्वतन्त्र, निजी नागरिक प्लेटफर्म हो (सार्वजनिक पहुँचको लागि)। सबै बाह्य लिङ्कहरूले सम्बन्धित सरकारी पोर्टलहरूमा लैजान्छन्।'
            : 'Disclaimer: SAARTHI is an independent, privately operated platform for public access. All links direct to official portals.'}
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] font-mono font-bold uppercase shrink-0">
          Private Platform
        </span>
      </div>

      {/* DevTrack Project Tracker Highlight Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {currentLang === 'ne' ? 'काठमाडौँ महानगर तथा सरकारी विकास योजना अनुगमन (DevTrack)' : 'Municipal Project & Budget Tracker (DevTrack)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                Incubate Nepal
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              {currentLang === 'ne'
                ? 'काठमाडौँ महानगरपालिकाका सडक, ढल, स्मार्ट सिटी तथा खानेपानी आयोजनाहरूको भौतिक/वित्तीय प्रगति, ठेकेदार र बजेट हेर्नुहोस्।'
                : 'Track budget allocations, contractor performance, physical completion %, and citizen quality reports across KMC wards.'}
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
          Public Telemetry Active
        </div>
      </div>

      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-extrabold text-white">
              {currentLang === 'ne' ? 'सरकारी सेवा निर्देशिका र कानुन' : 'Government Services, Forms & Laws'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {currentLang === 'ne'
              ? 'राहदानी, PAN, मालपोत, नागरिकता प्रक्रिया, फाराम र संविधान ऐनको सरल व्याख्या'
              : 'Direct procedure guides, downloadable forms & plain-language Nepal Constitution & Laws'}
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'services' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'सरकारी सेवाहरू' : 'Services'}
          </button>
          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'forms' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'फाराम सङ्ग्रह' : 'Forms'}
          </button>
          <button
            onClick={() => setActiveSubTab('laws')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'laws' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'संविधान र ऐन' : 'Laws'}
          </button>
        </div>
      </div>

      {/* Sub-view: Services (Bento Grid) */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredServices.map((service, index) => {
              const isSpotlight = index === 0;
              return (
                <div
                  key={service.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-[#0B0F17]/95 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group ${
                    isSpotlight ? 'lg:col-span-2 bg-gradient-to-br from-slate-900/90 via-[#0B0F17] to-blue-950/20' : ''
                  }`}
                >
                  <div className="space-y-3 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                            {service.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {service.department}
                          </span>
                        </div>
                        <h2 className="font-bold text-white text-base sm:text-lg mt-1 group-hover:text-blue-300 transition-colors">
                          {currentLang === 'ne' ? service.titleNp : service.title}
                        </h2>
                      </div>

                      <a
                        href={service.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <span>{currentLang === 'ne' ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="font-bold text-amber-400 block mb-1.5 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{currentLang === 'ne' ? 'आवश्यक कागजातहरू:' : 'Required Documents:'}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {service.reqDocuments.map((doc, idx) => (
                            <li key={idx} className="leading-snug">{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="font-bold text-emerald-400 block mb-1.5 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{currentLang === 'ne' ? 'चरणबद्ध प्रक्रिया:' : 'Step-by-Step Procedure:'}</span>
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-slate-300">
                          {service.steps.map((step, idx) => (
                            <li key={idx} className="leading-snug">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 mt-4 border-t border-slate-800/80 font-mono">
                    <div className="flex items-center gap-3">
                      <span>Fee: <strong className="text-slate-200">{service.fee}</strong></span>
                      <span>•</span>
                      <span>Processing: <strong className="text-slate-200">{service.processingDays}</strong></span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Gov Verified</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-view: Forms (Bento Grid) */}
      {activeSubTab === 'forms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_GOV_FORMS.map((form) => (
            <div
              key={form.id}
              className="p-5 rounded-2xl bg-[#0B0F17]/95 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/20">
                    {form.format}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{form.department}</span>
                </div>

                <h3 className="font-bold text-white text-sm">{form.title}</h3>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider font-mono">Instructions:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    {form.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setDownloadingId(form.id);
                    setTimeout(() => setDownloadingId(null), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-red-400" />
                  <span>
                    {downloadingId === form.id
                      ? (currentLang === 'ne' ? 'टेम्प्लेट डाउनलोड भयो ✓' : 'Template Downloaded ✓')
                      : (currentLang === 'ne' ? 'फाराम डाउनलोड गर्नुहोस्' : 'Download Form Template')}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view: Laws (Bento Grid) */}
      {activeSubTab === 'laws' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_LAWS.map((law) => (
            <div
              key={law.id}
              className="p-5 rounded-2xl bg-[#0B0F17]/95 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="font-bold text-white text-base">
                    {currentLang === 'ne' ? law.titleNp : law.title}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {law.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentLang === 'ne' ? law.summaryNp : law.summary}
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-amber-400 font-mono">Key Sections & Articles:</span>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {law.keyArticles.map((art, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="font-bold text-red-400 block font-mono text-[11px]">{art.article}</span>
                        <span className="text-slate-300 text-[11px]">{art.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Constitution 2072 Reference</span>
                </span>
                <span className="text-emerald-400">Verified Legal Text</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
