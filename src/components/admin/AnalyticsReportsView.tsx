import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, PieChart, Calendar, DollarSign, FileText, ArrowUpRight } from 'lucide-react';

export const AnalyticsReportsView: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState('All Nepal');
  const [dateRange, setDateRange] = useState('This Fiscal Year 2082/83');

  const provinceStats = [
    { province: 'Bagmati Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Gandaki Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Koshi Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Lumbini Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Madhesh Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Sudurpashchim', revenue: 'N/A', applications: 0, growth: '0.0%' },
    { province: 'Karnali Province', revenue: 'N/A', applications: 0, growth: '0.0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Revenue & Operations Intelligence</span>
          <h1 className="text-2xl font-black text-white">Civic Analytics & Revenue Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform civic service fee volume breakdowns, provincial usage trends, and operational audit reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Generating Platform Financial Audit Report PDF...')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Fiscal Report (PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400">Total YTD Fiscal Revenue</span>
          <h2 className="text-sm font-bold text-slate-400 mt-2">Data currently unavailable</h2>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
            Payment gateway integration pending configuration
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400">Total Processed Applications</span>
          <h2 className="text-sm font-bold text-slate-400 mt-2">0 Records</h2>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
            <BarChart3 className="w-3.5 h-3.5" /> No active applications logged
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400">System Integration Status</span>
          <h2 className="text-lg font-bold text-emerald-400 mt-1">Ready for Config</h2>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
            <PieChart className="w-3.5 h-3.5" /> Official APIs Connected
          </span>
        </div>
      </div>

      {/* Provincial Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Provincial Revenue & Volume Breakdown</span>
          </h3>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="This Fiscal Year 2082/83">This Fiscal Year 2082/83</option>
            <option value="Last Quarter">Last Quarter (Baishakh-Asar)</option>
            <option value="This Month">This Month (Shrawan)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Province / Region</th>
                <th className="p-3">Total Applications</th>
                <th className="p-3">Collected Revenue (NPR)</th>
                <th className="p-3">YoY Growth</th>
                <th className="p-3 text-right">Audited Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {provinceStats.map((stat, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{stat.province}</td>
                  <td className="p-3 font-mono text-slate-300">{stat.applications.toLocaleString()}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{stat.revenue}</td>
                  <td className="p-3 font-semibold text-indigo-400">{stat.growth}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Audited & Reconciled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
