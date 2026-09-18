import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Mail,
  User,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  Send,
  Sliders,
  Settings,
  Bell,
  Check,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import {
  ContactEnquiry,
  getContactEnquiries,
  updateEnquiryStatus,
  getEmailConfig,
  saveEmailConfig,
  EmailNotificationConfig,
  sendTestEmailConfirmation
} from '../../utils/enquiryStore';
import { formatDualDate } from '../../utils/bsAdConverter';

export const ContactInboxView: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNoteInput, setNewNoteInput] = useState<string>('');
  const [replyInput, setReplyInput] = useState<string>('');

  // Email notification configuration modal state
  const [isEmailConfigOpen, setIsEmailConfigOpen] = useState<boolean>(false);
  const [emailConfig, setEmailConfig] = useState<EmailNotificationConfig>(getEmailConfig());
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string>('');

  useEffect(() => {
    const list = getContactEnquiries();
    setEnquiries(list);
    if (list.length > 0) {
      setSelectedEnquiry(list[0]);
    }
  }, []);

  const reloadData = () => {
    const list = getContactEnquiries();
    setEnquiries(list);
    if (selectedEnquiry) {
      const updated = list.find((e) => e.id === selectedEnquiry.id);
      if (updated) setSelectedEnquiry(updated);
    }
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: 'New' | 'Reviewing' | 'In Progress' | 'Resolved' | 'Closed' | 'Archived'
  ) => {
    const updated = updateEnquiryStatus(id, newStatus as any, replyInput, newNoteInput);
    setEnquiries(updated);
    const curr = updated.find((e) => e.id === id);
    if (curr) setSelectedEnquiry(curr);
    setNewNoteInput('');
  };

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailConfig(emailConfig);
    setConfigSuccessMsg('Email notification settings updated securely.');
    setTimeout(() => setConfigSuccessMsg(''), 3000);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.id.toLowerCase().includes(q) ||
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ContactEnquiry['status'] | string) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">NEW REPORT</span>;
      case 'Reviewing':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold">REVIEWING</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">IN PROGRESS</span>;
      case 'Resolved':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">RESOLVED</span>;
      case 'Closed':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-700 border border-slate-600 text-slate-300 font-mono text-[10px] font-bold">CLOSED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px] font-bold">ARCHIVED</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Header & Settings Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Inbox className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Support & Contact Tickets Inbox</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              {enquiries.filter((e) => e.status === 'New').length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Centralized citizen support desk. Receives all ticket submissions created through the public Contact Us & Support section. Each ticket is tagged with a unique tracking number.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmailConfigOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Email Notification Settings</span>
          </button>

          <button
            onClick={reloadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Refresh Inbox"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Inbox 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Enquiry List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Controls */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search enquiry ID, name, email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-medium"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400 font-bold">Filter Status:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'New', 'Reviewing', 'In Progress', 'Resolved', 'Closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enquiry Cards Stream */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredEnquiries.map((item) => {
              const isSelected = selectedEnquiry?.id === item.id;
              const dualDate = formatDualDate(item.submittedAtIso);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEnquiry(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 text-xs">{item.id}</span>
                    {getStatusBadge(item.status)}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm truncate">{item.fullName}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{item.category} • {item.email}</p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    "{item.message}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3 h-3" />
                      {dualDate.combined}
                    </span>
                    <span>{dualDate.timeStr}</span>
                  </div>
                </div>
              );
            })}

            {filteredEnquiries.length === 0 && (
              <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-xs font-medium">No citizen enquiries match the current filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Enquiry Detail & Actions (7 cols) */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      #{selectedEnquiry.id}
                    </span>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">{selectedEnquiry.fullName}</h2>
                  <span className="text-xs text-slate-400 font-mono">{selectedEnquiry.category}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'Reviewing')}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs hover:bg-sky-500/30 transition-all"
                  >
                    Reviewing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'In Progress')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-amber-500/30 transition-all"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/30 transition-all"
                  >
                    Resolved
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'Closed')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'Archived')}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                    title="Archive Report"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Citizen Identity & Submission Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Contact Phone & Email</span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedEnquiry.email}</span>
                  </div>
                  <div className="text-slate-300 flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedEnquiry.phone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Submission Date (B.S. & A.D.)</span>
                  <div className="font-mono font-bold text-emerald-400">
                    {formatDualDate(selectedEnquiry.submittedAtIso).combined}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Time: {formatDualDate(selectedEnquiry.submittedAtIso).timeStr}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">User Message Content</span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-200 font-sans">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Internal Administrative Notes & Log</span>
                </span>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedEnquiry.internalNotes && selectedEnquiry.internalNotes.length > 0 ? (
                    selectedEnquiry.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-amber-200 font-mono">
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No internal administrative notes added yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    placeholder="Add an internal note or action update..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, selectedEnquiry.status)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold">Select an enquiry from the list to view full details and administrative actions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Notification Configuration Modal */}
      {isEmailConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Email Notification Settings</h3>
              </div>
              <button
                onClick={() => setIsEmailConfigOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {configSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{configSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEmailConfig} className="space-y-4">
              {/* Enable/Disable Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enable Admin Email Alerts</span>
                  <span className="text-[10px] text-slate-400 block">Dispatch instant email alerts when users submit contact form</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailConfig.enabled}
                  onChange={(e) => setEmailConfig({ ...emailConfig, enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Recipient Email Address */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Recipient Admin Email Address
                </label>
                <input
                  type="email"
                  value={emailConfig.recipientEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, recipientEmail: e.target.value })}
                  placeholder="admin@saarthi.np"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Email is kept strictly confidential and never displayed publicly.
                </span>
              </div>

              {/* Trigger Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Notify on new contact submission</span>
                  <input
                    type="checkbox"
                    checked={emailConfig.notifyOnNewEnquiry}
                    onChange={(e) => setEmailConfig({ ...emailConfig, notifyOnNewEnquiry: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300">Notify on high priority civic grievance</span>
                  <input
                    type="checkbox"
                    checked={emailConfig.notifyOnCriticalGrievance}
                    onChange={(e) => setEmailConfig({ ...emailConfig, notifyOnCriticalGrievance: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/email/test-smtp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ recipientEmail: emailConfig.recipientEmail }),
                      });
                      let data: any = {};
                      try {
                        const rawText = await res.text();
                        data = JSON.parse(rawText);
                      } catch {
                        data = { error: `Server returned non-JSON response (HTTP status ${res.status})` };
                      }
                      if (res.ok && data.success) {
                        setConfigSuccessMsg(`SMTP Verified! Test email dispatched to ${data.recipient} at ${new Date().toLocaleTimeString()}`);
                      } else {
                        setConfigSuccessMsg(`SMTP Test Failed: ${data.details || data.error || 'Check server logs'}`);
                      }
                    } catch (err: any) {
                      setConfigSuccessMsg(`SMTP Connection Error: ${err.message}`);
                    }
                    setTimeout(() => setConfigSuccessMsg(''), 6000);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Test SMTP Connection</span>
                </button>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEmailConfigOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
