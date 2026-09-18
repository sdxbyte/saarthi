import React, { useState } from 'react';
import { Building, BookOpen, FileSpreadsheet, ExternalLink, Download, CheckCircle, Search, Activity, ArrowRight } from 'lucide-react';
import { MOCK_GOV_SERVICES, MOCK_GOV_FORMS, MOCK_LAWS } from '../../data/governmentData';

interface GovServicesViewProps {
  currentLang: 'en' | 'ne';
}

export const GovServicesView: React.FC<GovServicesViewProps> = ({ currentLang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'forms' | 'laws'>('services');
  const [searchTerm, setSearchTerm] = useState('');

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
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'services' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'सरकारी सेवाहरू' : 'Services'}
          </button>
          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'forms' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'फाराम सङ्ग्रह' : 'Forms'}
          </button>
          <button
            onClick={() => setActiveSubTab('laws')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'laws' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'संविधान र ऐन' : 'Laws'}
          </button>
        </div>
      </div>

      {/* Sub-view: Services */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-bold text-white text-base">
                      {currentLang === 'ne' ? service.titleNp : service.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {service.department} ({service.category})
                    </p>
                  </div>
                  <a
                    href={service.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>{currentLang === 'ne' ? 'बाह्य पोर्टल' : 'External Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="font-bold text-amber-400 block mb-1">
                      {currentLang === 'ne' ? 'आवश्यक कागजातहरू:' : 'Required Documents:'}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      {service.reqDocuments.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="font-bold text-emerald-400 block mb-1">
                      {currentLang === 'ne' ? 'चरणबद्ध प्रक्रिया:' : 'Step-by-Step Procedure:'}
                    </span>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                      {service.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-1 font-mono">
                  <span>Fee: {service.fee}</span>
                  <span>Processing Time: {service.processingDays}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Forms */}
      {activeSubTab === 'forms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_GOV_FORMS.map((form) => (
            <div
              key={form.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{form.title}</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  {form.format}
                </span>
              </div>
              <p className="text-xs text-slate-400">{form.department}</p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-slate-200 block">Instructions:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {form.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => alert(`Downloading template for ${form.title}...`)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-red-400" />
                <span>{currentLang === 'ne' ? 'फाराम डाउनलोड गर्नुहोस्' : 'Download Form Template'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view: Laws */}
      {activeSubTab === 'laws' && (
        <div className="space-y-4">
          {MOCK_LAWS.map((law) => (
            <div
              key={law.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="font-bold text-white text-base">
                  {currentLang === 'ne' ? law.titleNp : law.title}
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {law.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentLang === 'ne' ? law.summaryNp : law.summary}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400">Key Sections & Articles:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {law.keyArticles.map((art, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="font-bold text-red-400 block">{art.article}</span>
                      <span className="text-slate-300 text-[11px]">{art.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
