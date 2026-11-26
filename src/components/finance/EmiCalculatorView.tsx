import React, { useState } from 'react';
import { Landmark, PieChart, Info } from 'lucide-react';
import { calculateEmi } from '../../utils/emiCalculator';

interface EmiCalculatorViewProps {
  currentLang: 'en' | 'ne';
}

export const EmiCalculatorView: React.FC<EmiCalculatorViewProps> = ({ currentLang }) => {
  const [loanAmount, setLoanAmount] = useState<number>(3500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(15);

  const emiResult = calculateEmi(loanAmount, interestRate, tenureYears);
  const totalPayable = Math.max(1, emiResult.totalPayment);
  const principalPct = Math.round((loanAmount / totalPayable) * 100);
  const interestPct = Math.max(0, 100 - principalPct);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
            <h1 className="text-xl font-bold text-[#0B1F3A] dark:text-white">
              {currentLang === 'ne' ? 'ऋण तथा EMI क्याल्कुलेटर' : 'Loan & EMI Calculator'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentLang === 'ne'
              ? 'घर, सवारी, व्यक्तिगत र वैदेशिक रोजगार ऋणको किस्ता गणना'
              : 'Calculate monthly instalments & interest schedules for Home, Auto & Personal Loans'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="font-semibold text-[#0B1F3A] dark:text-white text-base border-b border-slate-200 dark:border-slate-800 pb-3">
            {currentLang === 'ne' ? 'ऋण विवरण' : 'Loan Parameters'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ne' ? 'ऋण रकम (NPR)' : 'Loan Principal Amount (NPR)'}
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ne' ? 'वार्षिक ब्याजदर (%)' : 'Interest Rate (% per annum)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ne' ? 'अवधि (वर्ष)' : 'Loan Tenure (Years)'}
            </label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'मासिक किस्ता (EMI)' : 'Monthly EMI'}
              </div>
              <div className="text-xl font-bold text-[#2563EB] dark:text-[#60A5FA] font-mono tabular-nums mt-1">
                Rs. {emiResult.monthlyEmi.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'कुल ब्याज रकम' : 'Total Interest Payable'}
              </div>
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums mt-1">
                Rs. {emiResult.totalInterest.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentLang === 'ne' ? 'कुल भुक्तानी' : 'Total Payable Amount'}
              </div>
              <div className="text-xl font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-1">
                Rs. {emiResult.totalPayment.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-semibold text-[#0B1F3A] dark:text-white text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <span>{currentLang === 'ne' ? 'मूलधन र ब्याजको प्रतिशत अनुपात' : 'Principal vs Interest Split'}</span>
            </h3>
            <svg
              viewBox="0 0 100 6"
              preserveAspectRatio="none"
              className="w-full h-3.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800"
              role="img"
              aria-label={`Principal ${principalPct}%, Interest ${interestPct}%`}
            >
              <rect x="0" y="0" width={principalPct} height="6" className="fill-[#2563EB]" />
              <rect x={principalPct} y="0" width={interestPct} height="6" className="fill-rose-500" />
            </svg>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
                {currentLang === 'ne' ? 'मूलधन' : 'Principal'} ({principalPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                {currentLang === 'ne' ? 'ब्याज' : 'Interest'} ({interestPct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
              <span>
                {currentLang === 'ne'
                  ? 'यो गणना जानकारी प्रयोजनका लागि मात्र हो — वित्तीय वा ऋण सल्लाह होइन। वास्तविक ई.एम.आई. बैंकको सर्त अनुसार फरक पर्न सक्छ।'
                  : "Informational estimate only — not financial or lending advice. SAARTHI does not originate loans; actual EMI and fees depend on your bank's sanctioned terms."}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
