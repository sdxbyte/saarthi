import React, { useState } from 'react';
import { Building2, Power, Edit3, Save, DollarSign, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { CivicServiceControl } from '../../types/admin';

const INITIAL_SERVICES: CivicServiceControl[] = [
  {
    id: 'SVC-101',
    serviceName: 'Bluebook Renewal & Vehicle Tax',
    category: 'Department of Transport (DoTM)',
    isActive: true,
    processingDays: 1,
    feeAmountNPR: 1500,
    totalApplicationsToday: 0,
    uptimePercentage: 100,
  },
  {
    id: 'SVC-102',
    serviceName: 'National ID (NID) Pre-Registration',
    category: 'Department of National ID & Civil Registration',
    isActive: true,
    processingDays: 2,
    feeAmountNPR: 0,
    totalApplicationsToday: 0,
    uptimePercentage: 100,
  },
  {
    id: 'SVC-103',
    serviceName: 'E-Passport Appointment Portal',
    category: 'Department of Passports (DoP)',
    isActive: true,
    processingDays: 3,
    feeAmountNPR: 5000,
    totalApplicationsToday: 0,
    uptimePercentage: 100,
  },
  {
    id: 'SVC-104',
    serviceName: 'Personal PAN Registration',
    category: 'Inland Revenue Department (IRD)',
    isActive: true,
    processingDays: 1,
    feeAmountNPR: 0,
    totalApplicationsToday: 0,
    uptimePercentage: 100,
  },
  {
    id: 'SVC-105',
    serviceName: 'Driving License Online Payment',
    category: 'Department of Transport (DoTM)',
    isActive: false,
    processingDays: 5,
    feeAmountNPR: 2000,
    totalApplicationsToday: 0,
    uptimePercentage: 100,
  },
];

export const GovernmentServiceManager: React.FC = () => {
  const [services, setServices] = useState<CivicServiceControl[]>(INITIAL_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">SAARTHI Service Operations</span>
          <h1 className="text-2xl font-black text-white">Public Services & Portal Fee Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Toggle service availability, SLA processing duration, and statutory service fee rates across Nepal civic portals.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Sync Department Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className={`p-5 rounded-2xl border transition-all ${
              svc.isActive
                ? 'bg-slate-900 border-slate-800 shadow-md'
                : 'bg-slate-950/80 border-rose-950/50 opacity-75'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    svc.isActive ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{svc.serviceName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        svc.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {svc.isActive ? 'Active Online' : 'Maintenance Mode'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{svc.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Fee Rate</span>
                  <span className="font-bold text-emerald-400">
                    {svc.feeAmountNPR === 0 ? 'FREE' : `Rs. ${svc.feeAmountNPR}`}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">SLA Time</span>
                  <span className="font-bold text-white">{svc.processingDays} Business Days</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Applications Today</span>
                  <span className="font-bold text-amber-400">{svc.totalApplicationsToday.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => toggleServiceActive(svc.id)}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                    svc.isActive
                      ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                      : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{svc.isActive ? 'Pause Portal' : 'Activate'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
