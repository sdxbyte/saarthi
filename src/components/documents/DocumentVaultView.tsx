import React, { useState, useEffect } from 'react';
import { Lock, Plus, ShieldCheck, Trash2, Calendar, IdCard, Copy, Check, AlertTriangle, Clock, User, BellRing, Sparkles } from 'lucide-react';
import { VaultDocument, UserProfile } from '../../types';
import { getUserDocuments, saveUserDocuments } from '../../utils/citizenAuthStore';
import { formatDualDate } from '../../utils/bsAdConverter';

interface DocumentVaultViewProps {
  currentLang: 'en' | 'ne';
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  currentLang,
  userProfile,
  onOpenAuthModal,
}) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    if (userProfile?.isLoggedIn && userProfile.email) {
      const userDocs = getUserDocuments(userProfile.email);
      if (userDocs && userDocs.length > 0) return userDocs;
    }
    const saved = localStorage.getItem('saarthi_vault_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'v1',
        title: 'Citizenship Certificate',
        documentType: 'Citizenship',
        docNumber: '27-01-75-01234',
        issueDate: '2075-02-14',
        issuer: 'District Administration Office, Kathmandu',
        createdAt: '2026-01-10',
      },
      {
        id: 'v2',
        title: 'Nepali e-Passport',
        documentType: 'Passport',
        docNumber: 'PA0987654',
        issueDate: '2022-06-10',
        expiryDate: '2032-06-09',
        issuer: 'Department of Passports, Kathmandu',
        createdAt: '2026-01-10',
      },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Doc Form
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<VaultDocument['documentType']>('Citizenship');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuer, setIssuer] = useState('');

  // Reload user documents whenever active user email changes
  useEffect(() => {
    if (userProfile?.isLoggedIn && userProfile.email) {
      const docs = getUserDocuments(userProfile.email);
      if (docs && docs.length > 0) {
        setDocuments(docs);
      }
    }
  }, [userProfile?.email, userProfile?.isLoggedIn]);

  // Persist documents whenever documents list or userProfile changes
  useEffect(() => {
    if (userProfile?.isLoggedIn && userProfile.email) {
      saveUserDocuments(userProfile.email, documents);
    } else {
      localStorage.setItem('saarthi_vault_docs', JSON.stringify(documents));
    }
  }, [documents, userProfile?.email, userProfile?.isLoggedIn]);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !docNumber) return;

    const newDoc: VaultDocument = {
      id: Date.now().toString(),
      title,
      documentType,
      docNumber,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || undefined,
      issuer: issuer || 'Government Authority',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    if (userProfile?.isLoggedIn && userProfile.email) {
      saveUserDocuments(userProfile.email, updated);
    }
    setIsAdding(false);
    setTitle('');
    setDocNumber('');
    setIssueDate('');
    setExpiryDate('');
    setIssuer('');
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    if (userProfile?.isLoggedIn && userProfile.email) {
      saveUserDocuments(userProfile.email, updated);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Expiry calculation helper
  const getExpiryStatus = (expDateStr?: string) => {
    if (!expDateStr) return { status: 'no_expiry', label: 'Lifetime Valid', color: 'text-slate-400 bg-slate-800 border-slate-700' };

    const today = new Date();
    const expDate = new Date(expDateStr);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'EXPIRED (Action Required)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold', days: diffDays };
    } else if (diffDays <= 90) {
      return { status: 'urgent', label: `Expires in ${diffDays} days!`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold', days: diffDays };
    } else if (diffDays <= 180) {
      return { status: 'warning', label: `Expires in ${diffDays} days`, color: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30', days: diffDays };
    } else {
      return { status: 'valid', label: `Valid (${diffDays} days left)`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', days: diffDays };
    }
  };

  const expiringDocs = documents.filter((d) => {
    if (!d.expiryDate) return false;
    const exp = getExpiryStatus(d.expiryDate);
    return exp.status === 'urgent' || exp.status === 'warning' || exp.status === 'expired';
  });

  return (
    <div className="space-y-6">
      {/* Title & Login Account Sync Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-extrabold text-white">
              {currentLang === 'ne' ? 'सुरक्षित नागरिक डिजिटल भल्ट र म्याद ट्र्याकर' : 'Secure Citizen Digital Vault & Expiry Tracker'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {currentLang === 'ne'
              ? 'नागरिकता, राहदानी, सवारी लाइसेन्स र ब्लुबुक नवीकरण म्याद स्वचालित सेभ र अलर्ट'
              : 'Encrypted storage & automated expiration tracking for Passport, License & Bluebook'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* User Account Login Status Pill */}
          <button
            onClick={onOpenAuthModal}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              userProfile?.isLoggedIn
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/50'
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>
              {userProfile?.isLoggedIn
                ? (currentLang === 'ne' ? `खाता जोडिएको: ${userProfile.name.split(' ')[0]}` : `Saved to: ${userProfile.email}`)
                : (currentLang === 'ne' ? 'विवरण सेभ गर्न लगइन गर्नुहोस्' : 'Login to Sync Details')}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-red-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'नयाँ कागजात थप्नुहोस्' : 'Add Document'}</span>
          </button>
        </div>
      </div>

      {/* Document Expiry Tracker Dashboard Alert Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-bold text-white text-sm sm:text-base">
              {currentLang === 'ne' ? 'कागजात म्याद समाप्त हुने अलर्ट (Document Expiry Radar)' : 'Document Expiry Radar & Renewal Alerts'}
            </h2>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
            {expiringDocs.length} Action(s) Needed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IdCard className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 font-medium">Total Saved Docs</span>
            </div>
            <span className="font-mono font-bold text-white text-sm">{documents.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">Expiring Soon (&lt; 90 Days)</span>
            </div>
            <span className="font-mono font-bold text-amber-400 text-sm">{expiringDocs.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Synced Cloud Status</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {userProfile?.isLoggedIn ? 'Active Sync' : 'Local Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Add Document Form Modal / Drawer */}
      {isAdding && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
          <h2 className="font-bold text-white text-base">
            {currentLang === 'ne' ? 'नयाँ डिजिटल कागजात प्रविष्टि' : 'Add New Document to Vault'}
          </h2>

          <form onSubmit={handleAddDoc} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Driving License"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
              >
                <option value="Citizenship">Citizenship (नागरिकता)</option>
                <option value="Passport">Passport (राहदानी)</option>
                <option value="Driving License">Driving License (लाइसेन्स)</option>
                <option value="Bluebook">Vehicle Bluebook (नीलो किताब)</option>
                <option value="PAN Card">PAN Card (स्थायी लेखा नम्बर)</option>
                <option value="Academic">Academic Certificate</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Document Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="27-01-75-01234"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Expiry Date (If applicable)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Issuing Authority</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="DAO Kathmandu / DoTM"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Save Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const expInfo = getExpiryStatus(doc.expiryDate);
          return (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdCard className="w-5 h-5 text-red-400" />
                  <div>
                    <span className="font-bold text-white text-sm block">{doc.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.documentType}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Document Number */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-white flex items-center justify-between">
                <span className="font-semibold tracking-wider">{doc.docNumber}</span>
                <button
                  onClick={() => handleCopy(doc.id, doc.docNumber)}
                  className="text-slate-400 hover:text-white p-1"
                  title="Copy Number"
                >
                  {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expiry Status Badge */}
              <div className={`p-2 rounded-xl border text-[11px] flex items-center justify-between ${expInfo.color}`}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{expInfo.label}</span>
                </div>
                {doc.expiryDate && (
                  <span className="font-mono text-[10px]" title="Expiry Date (B.S. / A.D.)">
                    {formatDualDate(doc.expiryDate).combined}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Issuer:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[150px]">{doc.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued Date:</span>
                  <span className="text-slate-300 font-mono">
                    {formatDualDate(doc.issueDate).combined}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
