import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, Info, FileSpreadsheet, Download, FileText } from 'lucide-react';
import { calculateNepalTax } from '../../utils/taxCalculator';
import { generateTaxReportPDF } from '../../utils/pdfExporter';

interface TaxCalculatorViewProps {
  currentLang: 'en' | 'ne';
}

export const TaxCalculatorView: React.FC<TaxCalculatorViewProps> = ({ currentLang }) => {
  const [annualSalary, setAnnualSalary] = useState<number>(900000);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [isSsf, setIsSsf] = useState<boolean>(true);
  const [lifeInsurance, setLifeInsurance] = useState<number>(40000); // max 40,000 deduction
  const [healthInsurance, setHealthInsurance] = useState<number>(20000); // max 20,000 deduction

  const taxResult = calculateNepalTax({
    annualSalary,
    maritalStatus,
    isSsf,
    lifeInsurance,
    healthInsurance,
  });

  const handleExportPDF = () => {
    generateTaxReportPDF({
      annualSalary,
      maritalStatus,
      isSsf,
      lifeInsurance,
      healthInsurance,
      annualTax: taxResult.annualTax,
      monthlyTax: taxResult.monthlyTax,
      monthlyInhand: taxResult.monthlyInhand,
      effectiveRate: taxResult.effectiveRate,
      slabs: taxResult.slabs,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {currentLang === 'ne' ? 'नेपाल आयकर क्याल्कुलेटर (आ.व. २०८३/८४)' : 'Nepal Income Tax Calculator (FY 2083/84)'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentLang === 'ne'
              ? 'सामाजिक सुरक्षा कोष (SSF), जीवन बीमा र स्वास्थ्य बीमा छुट सहित'
              : 'Includes Social Security Fund (SSF) exemptions, Life Insurance & Medical rebates.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-900/40"
          >
            <Download className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'कर रिपोर्ट PDF डाउनलोड' : 'Download as PDF'}</span>
          </button>
          <div className="hidden sm:block px-3 py-1.5 rounded-xl bg-red-600/10 dark:bg-red-600/20 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
            IRD Standard
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-md">
          <h2 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-200 dark:border-slate-800 pb-3">
            {currentLang === 'ne' ? 'आम्दानी तथा विवरण प्रविष्टि' : 'Income & Deduction Inputs'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {currentLang === 'ne' ? 'वार्षिक आम्दानी (NPR)' : 'Annual Gross Salary (NPR)'}
            </label>
            <input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:border-red-500 outline-none"
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {currentLang === 'ne' ? 'मासिक सरदर:' : 'Monthly Approx:'} Rs.{' '}
              {Math.round(annualSalary / 12).toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {currentLang === 'ne' ? 'पारिवारिक स्थिति' : 'Marital Status'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMaritalStatus('single')}
                className={`py-2 px-3 rounded-xl font-medium text-xs transition-colors ${
                  maritalStatus === 'single'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'अविवाहित (Single)' : 'Single'}
              </button>
              <button
                type="button"
                onClick={() => setMaritalStatus('married')}
                className={`py-2 px-3 rounded-xl font-medium text-xs transition-colors ${
                  maritalStatus === 'married'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'ne' ? 'विवाहित (Couple)' : 'Couple / Married'}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSsf}
                onChange={(e) => setIsSsf(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-0 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
              <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {currentLang === 'ne'
                  ? 'सामाजिक सुरक्षा कोष (SSF) मा आबद्ध (1% Social Security tax waived for 1st slab)'
                  : 'Enrolled in Social Security Fund (SSF)'}
              </span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ne' ? 'जीवन बीमा प्रिमियम छुट (Max Rs. 40,000)' : 'Life Insurance Premium (Max 40,000)'}
              </label>
              <input
                type="number"
                value={lifeInsurance}
                onChange={(e) => setLifeInsurance(Math.min(40000, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ne' ? 'स्वास्थ्य बीमा प्रिमियम (Max Rs. 20,000)' : 'Health Insurance Premium (Max 20,000)'}
              </label>
              <input
                type="number"
                value={healthInsurance}
                onChange={(e) => setHealthInsurance(Math.min(20000, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Analytics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'वार्षिक कुल कर' : 'Annual Total Tax'}
              </div>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                Rs. {taxResult.annualTax.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                {currentLang === 'ne' ? 'प्रभावी दर:' : 'Effective Tax Rate:'} {taxResult.effectiveRate}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'मासिक कर कटौती (TDS)' : 'Monthly Tax TDS'}
              </div>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                Rs. {taxResult.monthlyTax.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                {currentLang === 'ne' ? 'प्रति महिना' : 'per month'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'मासिक खुद तलब (In-hand)' : 'Monthly In-Hand Salary'}
              </div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                Rs. {taxResult.monthlyInhand.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                {currentLang === 'ne' ? 'सबै कर कटाएर' : 'after tax deductions'}
              </div>
            </div>
          </div>

          {/* Detailed Tax Slab Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm dark:shadow-md">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-red-500" />
              <span>{currentLang === 'ne' ? 'स्ल्याब अनुसार कर विभाजन विवरण' : 'Tax Bracket & Slab Breakdown'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">
                    <th className="pb-2">Slab Bracket</th>
                    <th className="pb-2">Rate</th>
                    <th className="pb-2 text-right">Taxable Amount</th>
                    <th className="pb-2 text-right">Tax Liabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {taxResult.slabs.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-medium text-slate-900 dark:text-slate-200">{s.range}</td>
                      <td className="py-2.5 font-bold text-amber-600 dark:text-amber-400">{s.rate}%</td>
                      <td className="py-2.5 text-right font-mono">Rs. {s.taxableAmount.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        Rs. {s.taxAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                {currentLang === 'ne'
                  ? 'नोट: महिला करदाताको हकमा कुल आयकरमा १०% थप छुट प्राप्त हुन्छ।'
                  : 'Note: Female tax payers receive an additional 10% rebate on total calculated income tax.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
