import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  IdCard,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';
import { UserProfile, VaultDocument } from '../../types';
import { formatDualDate } from '../../utils/bsAdConverter';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { SyncStatusBadge } from '../common/SyncStatusBadge';

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
  const {
    vaultDocs,
    upsertVaultDoc,
    deleteVaultDoc,
    syncStatus,
    pendingCount,
    conflicts,
    triggerManualSync,
  } = useSyncAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<VaultDocument['documentType']>('Citizenship');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuer, setIssuer] = useState('');

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !docNumber.trim()) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now().toString(36)}`,
      title: title.trim(),
      documentType,
      docNumber: docNumber.trim(),
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || undefined,
      issuer: issuer.trim() || 'Government Authority',
      createdAt: new Date().toISOString().split('T')[0],
    };

    await upsertVaultDoc(newDoc);
    setIsAdding(false);
    setTitle('');
    setDocNumber('');
    setIssueDate('');
    setExpiryDate('');
    setIssuer('');
  };

  const handleDelete = async (id: string) => {
    await deleteVaultDoc(id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getExpiryStatus = (expDateStr?: string) => {
    if (!expDateStr) {
      return {
        status: 'no_expiry',
        label: 'Lifetime Valid',
        color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      };
    }

    const today = new Date();
    const expDate = new Date(expDateStr);
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'expired',
        label: 'Expired — Renewal Needed',
        color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 font-semibold',
      };
    }
    if (diffDays <= 90) {
      return {
        status: 'urgent',
        label: `Expires in ${diffDays} days`,
        color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 font-semibold',
      };
    }
    return {
      status: 'valid',
      label: `Valid (${diffDays} days left)`,
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    };
  };

  const expiringDocs = vaultDocs.filter((d) => {
    if (!d.expiryDate) return false;
    const exp = getExpiryStatus(d.expiryDate);
    return exp.status === 'urgent' || exp.status === 'expired';
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-[#0B1F3A] dark:text-white">
              {currentLang === 'ne' ? 'सुरक्षित नागरिक डिजिटल भल्ट' : 'Citizen Digital Document Vault'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentLang === 'ne'
              ? 'नागरिकता, राहदानी, लाइसेन्स र ब्लुबुक विवरण IndexedDB र क्लाउड सिङ्क सहित।'
              : 'Offline-first document registry & expiry tracking synced across Website and Android APK.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <SyncStatusBadge
            status={syncStatus}
            pendingCount={pendingCount}
            conflictCount={conflicts.length}
            onClick={() => void triggerManualSync()}
          />

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              {userProfile?.isLoggedIn
                ? userProfile.email || userProfile.name
                : 'Sign In to Cloud Sync'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'कागजात थप्नुहोस्' : 'Add Document'}</span>
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <IdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Total Saved Docs
          </span>
          <span className="font-mono font-bold text-sm tabular-nums text-[#0B1F3A] dark:text-white">
            {vaultDocs.length}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Expiring Within 90 Days
          </span>
          <span className="font-mono font-bold text-sm tabular-nums text-amber-600 dark:text-amber-400">
            {expiringDocs.length}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Storage Layer
          </span>
          <span className="font-mono font-semibold text-xs text-slate-700 dark:text-slate-200">
            {userProfile?.isLoggedIn ? 'IndexedDB + Cloud' : 'IndexedDB Local'}
          </span>
        </div>
      </div>

      {/* Add Document Form */}
      {isAdding && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
          <h2 className="font-semibold text-base text-[#0B1F3A] dark:text-white">
            {currentLang === 'ne' ? 'नयाँ डिजिटल कागजात प्रविष्टि' : 'Add New Document to Vault'}
          </h2>

          <form onSubmit={(e) => void handleAddDoc(e)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Driving License"
                required
                className="w-full control-field"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as VaultDocument['documentType'])}
                className="w-full control-field"
              >
                <option value="Citizenship">Citizenship</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Bluebook">Vehicle Bluebook</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Academic">Academic Certificate</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Document Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="Document reference number"
                required
                className="w-full control-field font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full control-field font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Expiry Date (Optional)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full control-field font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Issuing Authority</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. DAO Kathmandu / DoTM"
                className="w-full control-field"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold cursor-pointer"
              >
                Save Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Grid or Empty State */}
      {vaultDocs.length === 0 ? (
        <div className="p-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-center space-y-3">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
          <h3 className="text-base font-semibold text-[#0B1F3A] dark:text-white">
            Your Document Vault is Empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Add your Citizenship, Passport, PAN, Driving License, or Bluebook metadata to track expiry dates offline and sync across your devices.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaultDocs.map((doc) => {
            const expInfo = getExpiryStatus(doc.expiryDate);
            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-600 transition-colors space-y-3 relative group shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      {doc.documentType}
                    </span>
                    <span className="font-semibold text-sm text-[#0B1F3A] dark:text-white block truncate">
                      {doc.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(doc.id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Delete Document"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 font-mono text-xs flex items-center justify-between">
                  <span className="font-semibold tracking-wide truncate">{doc.docNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(doc.id, doc.docNumber)}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 cursor-pointer"
                    title="Copy Number"
                  >
                    {copiedId === doc.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${expInfo.color}`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{expInfo.label}</span>
                  </div>
                  {doc.expiryDate && (
                    <span className="font-mono text-[10px] tabular-nums shrink-0">
                      {formatDualDate(doc.expiryDate).combined}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex justify-between gap-2">
                    <span>Issuer</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      {doc.issuer}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Issued</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                      {formatDualDate(doc.issueDate).combined}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
