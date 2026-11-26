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
  const [ticketError, setTicketError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<ContactEnquiry | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTicketError('');
    try {
      const fullName = email.trim() ? email.split('@')[0] : 'Citizen User';
      const contactEmail = email.trim() || 'support@saarthi.dpdns.org';
      const category = `Support Ticket (${type.toUpperCase()})`;

      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: contactEmail,
          phone: 'N/A',
          category,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTicketError(
          data.error ||
            data.message ||
            (res.status === 429
              ? 'Too many tickets submitted recently. Please wait a few minutes before retrying.'
              : `Unable to submit ticket (HTTP ${res.status}).`)
        );
        return;
      }

      const created = addContactEnquiry({
        id: data.ticket?.id,
        fullName,
        email: contactEmail,
        phone: 'N/A',
        category,
        message: `Subject: ${subject.trim()}\n\n${message.trim()}`,
        skipNetworkEmail: true,
      });

      setSubmittedTicket(created);
      setSubject('');
      setEmail('');
      setMessage('');
    } catch {
      setTicketError('Network error while submitting ticket. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className={`max-w-5xl mx-auto space-y-8 py-6 px-4 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Banner */}
      <div className={`p-8 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
            <LifeBuoy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-sky-500">Citizen Assistance Center</span>
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
            className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-xs focus:outline-none focus:border-sky-500 ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Main Grid: FAQ & Submit Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <FileQuestion className="w-5 h-5 text-sky-500" />
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
                      : isDark
                      ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
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
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Submit a query or report a problem directly to our technical support team.
          </p>

          {ticketError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{ticketError}</span>
            </div>
          )}

          {submittedTicket && (
            <div className={`p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold">Support Ticket Submitted Successfully!</span>
              </div>
              <div className={`p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-between font-mono ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Unique Ticket Number:</span>
                <span className="text-amber-500 font-black text-sm">{submittedTicket.id}</span>
              </div>
              <button
                onClick={() => setSubmittedTicket(null)}
                className={`text-[10px] underline pt-1 block ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Submit another request
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Ticket Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-sky-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="question">Ask a Question</option>
                <option value="problem">Report a Technical Problem</option>
                <option value="feedback">Send Platform Feedback</option>
                <option value="assistance">Request Direct Assistance</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue or question"
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-sky-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contact Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@domain.com"
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-sky-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Detailed Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-sky-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
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
