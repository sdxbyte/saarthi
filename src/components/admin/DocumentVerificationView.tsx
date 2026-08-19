import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, Clock, Eye, Filter, AlertCircle, ShieldCheck } from 'lucide-react';
import { VerificationDocument } from '../../types/admin';

const INITIAL_DOCS: VerificationDocument[] = [];

export const DocumentVerificationView: React.FC = () => {
  const [docs, setDocs] = useState<VerificationDocument[]>(INITIAL_DOCS);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null);

  const filteredDocs = docs.filter(
    (d) => filterStatus === 'All' || d.status === filterStatus
  );

  const handleUpdateStatus = (id: string, newStatus: 'Verified' | 'Rejected') => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc({ ...selectedDoc, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Civic Verification Engine</span>
          <h1 className="text-2xl font-black text-white">Document & Identity Verification Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and validate citizen applications for Bluebook Renewal, Driving License, NID, & Passports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Queue</option>
            <option value="In Review">In Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedDoc?.id === doc.id
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{doc.citizenName}</span>
                    <span className="text-[10px] font-mono text-slate-400">({doc.citizenNID})</span>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold block mt-0.5">{doc.documentType}</span>
                  <p className="text-[11px] text-slate-400 mt-1">{doc.notes}</p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : doc.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : doc.status === 'In Review'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">{doc.submittedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Inspector Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md h-fit">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Document Inspector & Decision</span>
          </h3>

          {selectedDoc ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Citizen Full Name</span>
                <span className="font-bold text-white text-sm">{selectedDoc.citizenName}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">National ID (NID)</span>
                <span className="font-mono text-amber-400 font-bold">{selectedDoc.citizenNID}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Document Type</span>
                <span className="text-white font-semibold">{selectedDoc.documentType}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Province / DAO Office</span>
                <span className="text-white">{selectedDoc.province}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold">Submission Notes:</span>
                <p className="text-slate-300">{selectedDoc.notes}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedDoc.id, 'Verified')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedDoc.id, 'Rejected')}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Select a document record from the queue to inspect details & cast approval decisions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
