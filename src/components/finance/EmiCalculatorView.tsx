import React, { useState } from 'react';
import { Landmark, PieChart, Info } from 'lucide-react';
import { calculateEmi } from '../../utils/emiCalculator';

interface EmiCalculatorViewProps {
  currentLang: 'en' | 'ne';
}

export const EmiCalculatorView: React.FC<EmiCalculatorViewProps> = ({ currentLang }) => {
  const [loanAmount, setLoanAmount] = useState<number>(3500000); // 35 Lakhs Home Loan
  const [interestRate, setInterestRate] = useState<number>(10.5); // 10.5% p.a.
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years

  const emiResult = calculateEmi(loanAmount, interestRate, tenureYears);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">
              {currentLang === 'ne' ? 'ऋण तथा EMI क्याल्कुलेटर' : 'Loan & EMI Calculator'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {currentLang === 'ne'
              ? 'घर, सवारी, व्यक्तिगत र वैदेशिक रोजगार ऋणको किस्ता गणना'
              : 'Calculate monthly instalments & interest schedules for Home, Auto & Personal Loans'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <h2 className="font-bold text-white text-base border-b border-slate-800 pb-3">
            {currentLang === 'ne' ? 'ऋण विवरण' : 'Loan Parameters'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {currentLang === 'ne' ? 'ऋण रकम (NPR)' : 'Loan Principal Amount (NPR)'}
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {currentLang === 'ne' ? 'वार्षिक ब्याजदर (%)' : 'Interest Rate (% per annum)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {currentLang === 'ne' ? 'अवधि (वर्ष)' : 'Loan Tenure (Years)'}
            </label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">
                {currentLang === 'ne' ? 'मासिक किस्ता (EMI)' : 'Monthly EMI'}
              </div>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                Rs. {emiResult.monthlyEmi.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">
                {currentLang === 'ne' ? 'कुल ब्याज रकम' : 'Total Interest Payable'}
              </div>
              <div className="text-xl font-black text-rose-400 font-mono mt-1">
                Rs. {emiResult.totalInterest.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">
                {currentLang === 'ne' ? 'कुल भुक्तानी' : 'Total Payable Amount'}
              </div>
              <div className="text-xl font-black text-white font-mono mt-1">
                Rs. {emiResult.totalPayment.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">
              {currentLang === 'ne' ? 'मूलधन र ब्याजको प्रतिशत अनुपात' : 'Principal vs Interest Split'}
            </h3>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(loanAmount / emiResult.totalPayment) * 100}%` }}
                className="bg-blue-600 h-full"
                title="Principal"
              />
              <div
                style={{ width: `${(emiResult.totalInterest / emiResult.totalPayment) * 100}%` }}
                className="bg-rose-600 h-full"
                title="Interest"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                Principal ({Math.round((loanAmount / emiResult.totalPayment) * 100)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-600" />
                Interest ({Math.round((emiResult.totalInterest / emiResult.totalPayment) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
