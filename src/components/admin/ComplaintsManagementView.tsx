import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Filter, MessageSquare, ShieldAlert, UserCheck } from 'lucide-react';
import { CivicComplaint } from '../../types/admin';

const INITIAL_COMPLAINTS: CivicComplaint[] = [];

export const ComplaintsManagementView: React.FC = () => {
  const [tickets, setTickets] = useState<CivicComplaint[]>(INITIAL_COMPLAINTS);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<CivicComplaint | null>(tickets[0]);

  const filteredTickets = tickets.filter(
    (t) => filterStatus === 'All' || t.status === filterStatus
  );

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Public Grievance Redressal</span>
          <h1 className="text-2xl font-black text-white">Citizen Complaints & Service Tickets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, assign, investigate, and resolve citizen grievances submitted across municipal wards and federal departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Ticket Statuses</option>
            <option value="Open">Open Tickets</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedTicket?.id === ticket.id
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ticket.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400">
                      {ticket.ticketNo}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Filed by <span className="text-slate-200 font-semibold">{ticket.citizenName}</span> ({ticket.municipality})
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    ticket.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : ticket.status === 'Under Investigation'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md h-fit">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Ticket Resolution Workflow</span>
          </h3>

          {selectedTicket ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Ticket Number</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{selectedTicket.ticketNo}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Subject</span>
                <span className="font-bold text-white text-sm">{selectedTicket.subject}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Category & Municipality</span>
                <span className="text-slate-200">{selectedTicket.category} • {selectedTicket.municipality}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Assigned Officer</span>
                <span className="text-emerald-400 font-semibold">{selectedTicket.assignedOfficer || 'Unassigned'}</span>
              </div>

              {selectedTicket.status !== 'Resolved' && (
                <button
                  onClick={() => handleResolve(selectedTicket.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Grievance Resolved</span>
                </button>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Select a ticket from the list to view grievance history and assign officers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
