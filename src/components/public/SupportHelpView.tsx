import React, { useState } from 'react';
import { HelpCircle, MessageSquare, AlertCircle, CheckCircle2, Search, Send, LifeBuoy, FileQuestion, PhoneCall, Mail, Hash } from 'lucide-react';
import { addContactEnquiry, ContactEnquiry } from '../../utils/enquiryStore';

interface SupportHelpViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const SupportHelpView: React.FC<SupportHelpViewProps> = ({ currentLang, theme, onNavigateTab }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'complaints' | 'tax' | 'vault' | 'account'>('all');

  // Help desk submission form
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'question' | 'problem' | 'feedback' | 'assistance'>('question');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<ContactEnquiry | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addContactEnquiry({
        fullName: email.trim() ? email.split('@')[0] : 'Citizen User',
        email: email.trim() || 'support@citizen.np',
        phone: 'N/A',
        category: `Support Ticket (${type.toUpperCase()})`,
        message: `Subject: ${subject.trim()}\n\n${message.trim()}`,
      });

      setIsSubmitting(false);
      setSubmittedTicket(created);
      setSubject('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  const FAQS = [
    {
      q: 'Do I need to log in or create an account to browse civic services?',
      a: 'No. Browsing public service guidelines, tax calculators, NEPSE stock tables, forex rates, and government directories is 100% free and does not require logging in.',
      cat: 'account',
    },
    {
      q: 'How do I submit and track an issue report or inquiry?',
      a: 'Log into your account, click on "Report an Issue", describe the problem or feedback, submit details, and track the investigation status directly from your SAARTHI dashboard.',
      cat: 'complaints',
    },
    {
      q: 'Is my Citizenship/Passport data safe in the Document Vault?',
      a: 'Yes. All vault records are protected with client-side encryption. Credentials are stored securely on your browser device and never exposed publicly.',
      cat: 'vault',
    },
    {
      q: 'How accurate are the Tax & EMI Calculators?',
      a: 'Our tax formulas strictly adhere to official Inland Revenue Department (IRD) Finance Act slabs (FY 2083/84).',
      cat: 'tax',
    },
    {
      q: 'How can I support platform server maintenance?',
      a: 'Visit our "Support the Project / Coffee" page where you can voluntarily contribute via bank transfer or digital wallets (eSewa, Khalti, ConnectIPS).',
      cat: 'account',
    },
  ];

  const filteredFaqs = FAQS.filter((item) => {
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.cat === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 font-sans text-slate-100">
      {/* Banner */}
      <div className={`p-8 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <LifeBuoy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-sky-400">Citizen Assistance Center</span>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Help & Support Portal</h1>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Have questions, encountered an issue, or need guidance? Search our knowledge base or send a ticket directly to our support desk.
        </p>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics (e.g., tax calculator, complaint tracking, vault security)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main Grid: FAQ & Submit Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <FileQuestion className="w-5 h-5 text-sky-400" />
              <span>Frequently Asked Questions</span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto text-[11px]">
              {(['all', 'complaints', 'tax', 'vault', 'account'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-sky-500 text-slate-950 shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                <h3 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-amber-300' : 'text-slate-900'} mb-1.5`}>
                  {faq.q}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Ticket Box (1 col) */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Request Support</h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Submit a query or report a problem directly to our technical support team.
          </p>

          {submittedTicket && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">Support Ticket Submitted Successfully!</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between font-mono">
                <span className="text-[10px] text-slate-400">Unique Ticket Number:</span>
                <span className="text-amber-400 font-black text-sm">{submittedTicket.id}</span>
              </div>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="text-[10px] text-slate-400 underline hover:text-white pt-1 block"
              >
                Submit another request
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Ticket Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="question">Ask a Question</option>
                <option value="problem">Report a Technical Problem</option>
                <option value="feedback">Send Platform Feedback</option>
                <option value="assistance">Request Direct Assistance</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue or question"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Contact Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@domain.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Detailed Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
