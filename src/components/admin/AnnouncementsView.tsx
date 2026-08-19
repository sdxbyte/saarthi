import React, { useState } from 'react';
import { Megaphone, Send, Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Emergency Alert');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Citizens');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setPublishedSuccess(true);
    setTimeout(() => {
      setTitle('');
      setMessage('');
      setPublishedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">Civic Broadcast Center</span>
          <h1 className="text-2xl font-black text-white">Public Announcements & Emergency Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch national civic notices, tax deadline alerts, road maintenance updates, and emergency push notifications to citizens.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          <span>Active Broadcast Channel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleBroadcast} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Send className="w-4 h-4 text-rose-400" />
            <span>Compose Broadcast Alert</span>
          </h3>

          {publishedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Announcement published successfully to public citizen dashboards!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Emergency Alert">Emergency Alert</option>
                <option value="Tax Deadline Notice">Tax Deadline Notice</option>
                <option value="Road & Transport Notice">Road & Transport Notice</option>
                <option value="General Public Notice">General Public Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Audience Scope</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
              >
                <option value="All Citizens">All Registered Citizens (National)</option>
                <option value="Bagmati Province">Bagmati Province Only</option>
                <option value="Gandaki Province">Gandaki Province Only</option>
                <option value="Tax Payers">Tax Payers Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">Announcement Headline (Nepali / English)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DoTM Bluebook Tax Exemption Grace Period Extension Announced"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">Broadcast Message Content</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detailed notification content for citizens..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-950/50"
          >
            <Megaphone className="w-4 h-4" />
            <span>Publish National Broadcast Alert</span>
          </button>
        </form>

        {/* Live Broadcast Feed Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Active Broadcast History</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                Emergency Alert
              </span>
              <h4 className="font-bold text-white mt-1">Monsoon Highway Alert: Nagdhunga Bypass</h4>
              <p className="text-slate-400 text-[11px]">Drive cautiously; single-lane traffic in effect due to road maintenance.</p>
              <span className="text-[10px] text-slate-500 block">Issued: Today 18:00 BS</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                Tax Deadline Notice
              </span>
              <h4 className="font-bold text-white mt-1">Income Tax Return Filing Extension</h4>
              <p className="text-slate-400 text-[11px]">IRD extends Ashwin quarter return filing deadline without penalty.</p>
              <span className="text-[10px] text-slate-500 block">Issued: Yesterday 12:30 BS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
