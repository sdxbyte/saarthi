import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldAlert, PhoneCall, HelpCircle, AlertCircle, RefreshCw, Hash } from 'lucide-react';
import { addContactEnquiry, ContactEnquiry } from '../../utils/enquiryStore';

interface ContactViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
}

export const ContactView: React.FC<ContactViewProps> = ({ currentLang, theme }) => {
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    captchaAnswer: '',
  });

  // Simple anti-spam math verification
  const [captchaMath] = useState(() => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    return { a, b, answer: a + b };
  });

  const [submittedEnquiry, setSubmittedEnquiry] = useState<ContactEnquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    if (parseInt(formData.captchaAnswer.trim(), 10) !== captchaMath.answer) {
      setErrorMessage(`Anti-Spam Verification failed. What is ${captchaMath.a} + ${captchaMath.b}?`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addContactEnquiry({
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        category: formData.subject,
        message: formData.message.trim(),
      });
      setIsSubmitting(false);
      setSubmittedEnquiry(created);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 font-sans text-slate-100">
      {/* Header Banner */}
      <div className={`p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            SAARTHI Issue & Support Portal
          </span>
          <h1 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Report an Issue or Contact Us
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Experience an issue, error, data problem, or have a suggestion regarding SAARTHI? Submit a report below and our administration team will investigate and respond.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form (2 columns) */}
        <div className={`lg:col-span-2 p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <div>
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Send a Message</h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Fill out the form below. Official inquiries receive responses within 24 business hours.
            </p>
          </div>

          {submittedEnquiry ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">Official Submission Recorded</span>
                <h3 className="text-xl font-black text-white">Inquiry Sent Successfully</h3>
              </div>

              {/* Unique Enquiry ID Badge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 max-w-sm mx-auto space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Your Unique Enquiry Tracking ID</span>
                <span className="text-2xl font-black text-amber-400 block tracking-wider">{submittedEnquiry.id}</span>
                <span className="text-[10px] text-emerald-400 block">Notification Email Dispatched to Administration</span>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{submittedEnquiry.fullName}</strong>. Your inquiry has been routed to SAARTHI Administration. Please save your Enquiry ID <strong>#{submittedEnquiry.id}</strong> for future correspondence.
              </p>

              <button
                onClick={() => {
                  setSubmittedEnquiry(null);
                  setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '', captchaAnswer: '' });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. citizen@domain.np"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300">Mobile Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300">Subject Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bug / Error">Bug / Error</option>
                    <option value="Data Issue">Data Issue</option>
                    <option value="Login / Account Problem">Login / Account Problem</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Feature Problem">Feature Problem</option>
                    <option value="Performance Problem">Performance Problem</option>
                    <option value="UI / Display Problem">UI / Display Problem</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-300">
                  Detailed Message / Inquiry <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide clear details regarding your query or requested service assistance..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Anti-Spam Captcha Field */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Anti-Spam Challenge: What is <strong>{captchaMath.a} + {captchaMath.b}</strong>?</span>
                </div>
                <input
                  type="text"
                  value={formData.captchaAnswer}
                  onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                  placeholder="Answer"
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white text-center font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Submit Official Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Info Sidebar (1 column) */}
        <div className="space-y-6">
          {/* Office Address & Info */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
          }`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Platform Support & Contact</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Operations Base</span>
                  <span className="text-slate-400">Kathmandu, Nepal</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block">Support Communication</span>
                  <span className="text-slate-400">Via Contact Form & Support Help Center</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Working Hours</span>
                  <span className="text-slate-400">Sun - Thu: 10:00 AM - 5:00 PM</span>
                  <span className="text-slate-400 block">Fri: 10:00 AM - 3:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Quick Numbers */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border border-rose-900/50 space-y-3 text-white">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-base">Emergency Direct Numbers</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Police Control</span>
                <span className="text-rose-400 font-extrabold text-sm">100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Fire Brigade</span>
                <span className="text-amber-400 font-extrabold text-sm">101</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ambulance Hotline</span>
                <span className="text-emerald-400 font-extrabold text-sm">102</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Traffic Police</span>
                <span className="text-sky-400 font-extrabold text-sm">103</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className={`p-8 rounded-3xl border space-y-6 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-amber-400" />
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              q: 'Do I need an account to browse government services?',
              a: 'No. The entire public portal, government schemes directory, tax guidelines, and emergency numbers are fully browsable without logging in.',
            },
            {
              q: 'When am I asked to sign in?',
              a: 'You only need to sign in when submitting or tracking a personal grievance complaint, tracking official applications, or saving customized profiles.',
            },
            {
              q: 'How are submitted issue reports handled?',
              a: 'Submitted reports are logged into the private SAARTHI Admin desk where system administrators review, investigate, and respond directly to your inquiry.',
            },
            {
              q: 'Is my personal information protected?',
              a: 'Yes. Saarthi utilizes encrypted sessions, secure password hashing, and strict role authorization. Personal data is never disclosed to unauthorized third parties.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <h4 className="font-bold text-amber-300 text-xs">{item.q}</h4>
              <p className="text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
