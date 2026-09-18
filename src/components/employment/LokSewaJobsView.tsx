import React, { useState } from 'react';
import { Briefcase, GraduationCap, Search, ExternalLink, ShieldCheck, SearchCode } from 'lucide-react';
import { MOCK_JOBS } from '../../data/civicAndEmploymentData';

interface LokSewaJobsViewProps {
  currentLang: 'en' | 'ne';
}

export const LokSewaJobsView: React.FC<LokSewaJobsViewProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'loksewa' | 'private' | 'dofe'>('loksewa');

  // DOFE Permit Status Lookup
  const [passportNo, setPassportNo] = useState('');
  const [dofeResult, setDofeResult] = useState<string | null>(null);

  const handleDofeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNo) return;
    setDofeResult(
      currentLang === 'ne'
        ? `राहदानी नं. ${passportNo} को वैदेशिक रोजगार श्रम स्वीकृति (Work Permit) प्रमाणीकरण सम्पन्न भएको छ। संस्था: Al Shaya Trading Qatar (DOFE Reg #80123)`
        : `Passport No. ${passportNo}: Foreign Employment Labor Permit Verified. Employer: Al Shaya Trading Qatar (DOFE Reg #80123).`
    );
  };

  const filteredJobs = MOCK_JOBS.filter((j) => {
    if (activeTab === 'loksewa') return j.category === 'Lok Sewa Aayog';
    if (activeTab === 'private') return j.category !== 'Lok Sewa Aayog';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">
              {currentLang === 'ne' ? 'लोक सेवा, रोजगार तथा वैदेशिक श्रम स्वीकृति' : 'Lok Sewa, Jobs & Labor Permits'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {currentLang === 'ne'
              ? 'लोक सेवा आयोगका विज्ञापन, निजी तथा बैंकिङ क्षेत्रका जागिर र श्रम स्वीकृति ट्र्याकर'
              : 'Public Service Commission alerts, private sector vacancies & DOFE labor permit verifier'}
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('loksewa')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'loksewa' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'लोक सेवा आयोग' : 'Lok Sewa'}
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'private' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'निजी/बैंक जागिर' : 'Private Jobs'}
          </button>
          <button
            onClick={() => setActiveTab('dofe')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'dofe' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentLang === 'ne' ? 'श्रम स्वीकृति (DOFE)' : 'DOFE Labor Permit'}
          </button>
        </div>
      </div>

      {activeTab !== 'dofe' ? (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-base">{job.title}</h2>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    {job.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{job.organization}</p>
                <p className="text-xs text-slate-400">
                  Location: {job.location} | Vacancies: {job.vacancies}
                </p>
                <p className="text-xs text-slate-400">Qualification: {job.qualification}</p>
              </div>

              <div className="text-right flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-rose-400 font-mono font-bold">Deadline: {job.deadline}</span>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-md shadow-red-900/30"
                >
                  <span>{currentLang === 'ne' ? 'अनलाइन दरखास्त' : 'Apply Online'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="font-bold text-white text-base">
              {currentLang === 'ne' ? 'वैदेशिक रोजगार श्रम स्वीकृति जाँच' : 'DOFE Labor Permit Status'}
            </h2>
          </div>

          <form onSubmit={handleDofeCheck} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Passport Number (राहदानी नम्बर)
              </label>
              <input
                type="text"
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                placeholder="e.g. PA0987654"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-red-900/30"
            >
              Verify Labor Permit Status
            </button>
          </form>

          {dofeResult && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold leading-relaxed">
              {dofeResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
