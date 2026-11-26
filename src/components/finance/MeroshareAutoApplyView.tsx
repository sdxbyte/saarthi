import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Users,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Building2,
  FileCheck2,
  Send,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  Sparkles,
  Hash,
} from 'lucide-react';
import {
  MeroshareCapital,
  MeroshareAccount,
  MeroshareApplicableIssue,
  MeroshareApplyResult,
} from '../../services/meroshareAutoService';
import {
  NEPAL_CAPITALS_DIRECTORY,
  splitBoid,
  composeBoid,
  maskBoidSecurely,
  getCapitalByDpId,
} from '../../services/nepalCapitalsRegistry';

interface MeroshareAutoApplyViewProps {
  currentLang?: 'en' | 'ne';
}

const LOCAL_STORAGE_KEY = 'saarthi_meroshare_accounts_v1';

export const MeroshareAutoApplyView: React.FC<MeroshareAutoApplyViewProps> = ({ currentLang = 'en' }) => {
  const [capitals, setCapitals] = useState<MeroshareCapital[]>([]);
  const [issues, setIssues] = useState<MeroshareApplicableIssue[]>([]);
  const [accounts, setAccounts] = useState<MeroshareAccount[]>([]);
  const [isLoadingCapitals, setIsLoadingCapitals] = useState(true);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  // New Account Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // New Account Form
  const [accountLabel, setAccountLabel] = useState('');
  const [selectedCapitalDpId, setSelectedCapitalDpId] = useState<string>('13012600');
  const [clientId, setClientId] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [crnNumber, setCrnNumber] = useState('');
  const [pin, setPin] = useState('');
  const [applyKitta, setApplyKitta] = useState<number>(10);

  // Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<MeroshareApplyResult[]>([]);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Active assembled demat
  const activeDematNumber = composeBoid(selectedCapitalDpId, clientId);

  // 1. Load user-saved accounts from localStorage (no dummy credentials pre-seeded)
  const [meroshareSessionToken, setMeroshareSessionToken] = useState<string>('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAccounts(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load MeroShare accounts from storage:', e);
    }
  }, []);

  // Save accounts to storage whenever changed
  const saveAccountsToStorage = (updated: MeroshareAccount[]) => {
    setAccounts(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save MeroShare accounts:', e);
    }
  };

  // 2. Fetch CDSC Capitals and Applicable Issues
  const loadData = async () => {
    setIsLoadingCapitals(true);
    setIsLoadingIssues(true);

    try {
      const [capRes, issueRes] = await Promise.all([
        fetch('/api/meroshare/capitals').then((r) => r.json()),
        fetch('/api/meroshare/applicable-issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: '' }),
        }).then((r) => r.json()),
      ]);

      if (capRes.capitals) {
        setCapitals(capRes.capitals);
      }

      if (issueRes.issues) {
        setIssues(issueRes.issues);
        const openItem = issueRes.issues.find((i: any) => i.status === 'OPEN');
        if (openItem) {
          setSelectedIssueId(openItem.companyShareId);
        } else if (issueRes.issues[0]) {
          setSelectedIssueId(issueRes.issues[0].companyShareId);
        }
      }
    } catch (err) {
      console.error('Error fetching MeroShare data:', err);
    } finally {
      setIsLoadingCapitals(false);
      setIsLoadingIssues(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle Add New Account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountLabel || !username || !activeDematNumber || activeDematNumber.length !== 16 || !crnNumber || !pin) {
      setFormError('Please fill in all required fields (Label, Username, 8-Digit Client Demat ID, CRN, and PIN).');
      return;
    }

    const matchedCapital = getCapitalByDpId(selectedCapitalDpId);
    const newAcc: MeroshareAccount = {
      id: `acc-${Date.now()}`,
      label: accountLabel,
      dpId: Number(selectedCapitalDpId.slice(0, 5)) || 1287,
      dpName: matchedCapital?.name || 'Global IME Capital Limited',
      username,
      dematNumber: activeDematNumber,
      crnNumber,
      pin,
      autoApplyEnabled: true,
      lastAppliedStatus: 'NEVER',
    };

    const updated = [...accounts, newAcc];
    saveAccountsToStorage(updated);

    setAccountLabel('');
    setUsername('');
    setPassword('');
    setClientId('');
    setCrnNumber('');
    setPin('');
    setFormError(null);
    setShowAddModal(false);
  };

  const handleDeleteAccount = (id: string) => {
    const updated = accounts.filter((a) => a.id !== id);
    saveAccountsToStorage(updated);
    setConfirmDeleteId(null);
  };

  const toggleAutoApply = (id: string) => {
    const updated = accounts.map((a) => (a.id === id ? { ...a, autoApplyEnabled: !a.autoApplyEnabled } : a));
    saveAccountsToStorage(updated);
  };

  const handleExecuteAutoApply = async () => {
    if (!selectedIssueId) {
      setExecutionMessage('Select an open IPO issue before submitting.');
      return;
    }

    const targetAccounts = accounts.filter((a) => a.autoApplyEnabled);
    if (targetAccounts.length === 0) {
      setExecutionMessage('Enable at least one MeroShare profile for C-ASBA application.');
      return;
    }

    const targetIssue = issues.find((i) => i.companyShareId === selectedIssueId);
    if (!targetIssue) return;

    if (!meroshareSessionToken.trim()) {
      setExecutionMessage('Enter a valid CDSC MeroShare session token (or sign in via /api/meroshare/login) before submitting.');
      return;
    }

    setIsExecuting(true);
    setExecutionResults([]);
    setExecutionMessage(`Submitting C-ASBA batch application for ${targetIssue.companyName} (${targetIssue.scrip})...`);

    try {
      const requests = targetAccounts.map((acc) => ({
        accountId: acc.id,
        companyShareId: targetIssue.companyShareId,
        kitta: applyKitta || targetIssue.minKitta || 10,
        dematNumber: acc.dematNumber,
        crnNumber: acc.crnNumber,
        pin: acc.pin,
      }));

      const res = await fetch('/api/meroshare/auto-apply-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Meroshare-Token': meroshareSessionToken.trim(),
        },
        body: JSON.stringify({ requests, meroshareToken: meroshareSessionToken.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setExecutionMessage(data.message || 'CDSC MeroShare rejected batch submission.');
        return;
      }
      if (data.results) {
        setExecutionResults(data.results);
        setExecutionMessage(`Batch C-ASBA Completed: ${data.totalApplied} succeeded, ${data.totalFailed} failed.`);

        const updatedAccounts = accounts.map((acc) => {
          const matchResult = data.results.find((r: any) => r.accountId === acc.id);
          if (matchResult) {
            return {
              ...acc,
              lastAppliedStatus: matchResult.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
            } as MeroshareAccount;
          }
          return acc;
        });
        saveAccountsToStorage(updatedAccounts);
      }
    } catch (err: any) {
      setExecutionMessage(`Execution Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const selectedIssue = issues.find((i) => i.companyShareId === selectedIssueId);
  const isNe = currentLang === 'ne';

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
              CDSC MeroShare C-ASBA
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] dark:text-white">
              {isNe ? 'मेरोसेयर बहु-खाता C-ASBA प्रणाली' : 'MeroShare Batch Application Engine'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {isNe
                ? 'CDSC मेरोसेयर सँग एकीकृत बहु-खाता आइपिओ तथा हकप्रद आवेदन र सुरक्षित BOID भण्डारण।'
                : 'Submit C-ASBA IPO and right-share applications using your authorized CDSC session token and locally encrypted BOID profiles.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoadingIssues || isLoadingCapitals}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIssues ? 'animate-spin' : ''}`} />
              <span>{isNe ? 'ताजा गर्नुहोस्' : 'Sync CDSC'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setShowAddModal(true);
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isNe ? 'खाता थप्नुहोस्' : 'Add Account'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-[#0B1220] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Saved Profiles</div>
            <div className="text-lg font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
              {accounts.length}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-[#0B1220] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Enabled</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
              {accounts.filter((a) => a.autoApplyEnabled).length}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-[#0B1220] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Open C-ASBA Issues</div>
            <div className="text-lg font-bold text-[#2563EB] dark:text-[#60A5FA] font-mono tabular-nums mt-0.5">
              {issues.filter((i) => i.status === 'OPEN').length}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-[#0B1220] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">DP Registry</div>
            <div className="text-lg font-bold text-[#0B1F3A] dark:text-white font-mono tabular-nums mt-0.5">
              {capitals.length || NEPAL_CAPITALS_DIRECTORY.length} DPs
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
              <h3 className="font-semibold text-base text-[#0B1F3A] dark:text-white">
                {isNe ? 'खुला C-ASBA निष्कासनहरू' : 'Applicable Public Issues'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">CDSC Feed</span>
          </div>

          {isLoadingIssues ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#2563EB]" />
              <p className="text-xs">Loading public issues from CDSC...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              No active public issues currently available.
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {issues.map((issue) => {
                const isSelected = selectedIssueId === issue.companyShareId;
                return (
                  <button
                    key={issue.companyShareId}
                    type="button"
                    onClick={() => setSelectedIssueId(issue.companyShareId)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors space-y-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-[#2563EB]'
                        : 'bg-slate-50 dark:bg-[#0B1220] border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-[#0B1F3A] dark:text-white flex items-center gap-2">
                          <span>{issue.companyName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-[#0B1F3A] dark:text-blue-300">
                            {issue.scrip}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {issue.shareTypeName} • {issue.shareGroupName}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          issue.status === 'OPEN'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-200 dark:border-slate-800 font-mono tabular-nums">
                      <div>
                        <div className="text-[10px] text-slate-500">Price</div>
                        <div className="text-[#0B1F3A] dark:text-white font-semibold">NPR {issue.pricePerShare}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Min Kitta</div>
                        <div className="text-[#0B1F3A] dark:text-white font-semibold">{issue.minKitta}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Close Date</div>
                        <div className="text-[#0B1F3A] dark:text-blue-300 font-semibold text-[11px]">
                          {issue.issueCloseDateBs || issue.issueCloseDateAd || '—'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <a
            href="https://iporesult.cdsc.com.np/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#0B1F3A] dark:text-slate-200 flex items-center justify-center gap-2 hover:border-[#2563EB]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Open CDSC Allotment Result Portal</span>
          </a>
        </div>

        {/* Right: Configured Accounts & Submit */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
              <h3 className="font-semibold text-base text-[#0B1F3A] dark:text-white">
                Configured Profiles ({accounts.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Profile</span>
            </button>
          </div>

          {selectedIssue && (
            <div className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Selected Issue</span>
                <span className="font-mono font-bold text-[#0B1F3A] dark:text-white">
                  {selectedIssue.companyName} ({selectedIssue.scrip})
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  CDSC MeroShare Session Authorization Token *
                </label>
                <input
                  type="password"
                  placeholder="Paste active CDSC Authorization token"
                  value={meroshareSessionToken}
                  onChange={(e) => setMeroshareSessionToken(e.target.value)}
                  className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Kitta:</span>
                  <input
                    type="number"
                    min={selectedIssue.minKitta || 10}
                    step={10}
                    value={applyKitta}
                    onChange={(e) => setApplyKitta(Number(e.target.value))}
                    className="w-20 bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-[#0B1F3A] dark:text-white text-xs"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                    = NPR {(applyKitta * (selectedIssue.pricePerShare || 100)).toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteAutoApply}
                  disabled={isExecuting || accounts.filter((a) => a.autoApplyEnabled).length === 0}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit C-ASBA ({accounts.filter((a) => a.autoApplyEnabled).length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {accounts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-3">
              <p>No MeroShare profiles configured yet.</p>
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-[#0B1F3A] dark:bg-[#2563EB] text-white rounded-xl font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Profile</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0B1F3A] dark:text-white">{acc.label}</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                        BOID: {maskBoidSecurely(acc.dematNumber)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span>{acc.dpName}</span>
                      <span>· CRN: {acc.crnNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAutoApply(acc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        acc.autoApplyEnabled
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{acc.autoApplyEnabled ? 'Active' : 'Paused'}</span>
                    </button>

                    {confirmDeleteId === acc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(acc.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 cursor-pointer"
                        title="Remove Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {executionMessage && (
            <div className="bg-slate-50 dark:bg-[#0B1220] border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#0B1F3A] dark:text-blue-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>{executionMessage}</span>
              </div>
              {executionResults.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
                  {executionResults.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#0F172A] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2 font-mono"
                    >
                      <div>
                        <span className="font-semibold text-[#0B1F3A] dark:text-white">{r.accountLabel}</span>
                        <span className="text-slate-500 ml-2">({r.appliedKitta} Kitta)</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{r.message}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.status === 'SUCCESS'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-semibold text-base text-[#0B1F3A] dark:text-white">
                  Add MeroShare Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Account Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Personal Demat"
                  value={accountLabel}
                  onChange={(e) => setAccountLabel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 flex justify-between">
                  <span>Capital / DP *</span>
                  <span className="font-mono text-slate-500">{selectedCapitalDpId}</span>
                </label>
                <select
                  value={selectedCapitalDpId}
                  onChange={(e) => setSelectedCapitalDpId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  required
                >
                  {NEPAL_CAPITALS_DIRECTORY.map((cap) => (
                    <option key={cap.dpId} value={cap.dpId}>
                      {cap.name} ({cap.dpId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  8-Digit Client Demat ID (or 16-Digit BOID) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="01024035"
                  value={clientId}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length === 16) {
                      const { dpId: detectedDp, clientId: detectedClient } = splitBoid(val);
                      if (NEPAL_CAPITALS_DIRECTORY.some((c) => c.dpId === detectedDp)) {
                        setSelectedCapitalDpId(detectedDp);
                      }
                      setClientId(detectedClient);
                    } else {
                      setClientId(val.slice(0, 8));
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Password (Optional)
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Bank CRN Number *
                  </label>
                  <input
                    type="text"
                    value={crnNumber}
                    onChange={(e) => setCrnNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    4-Digit PIN *
                  </label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0B1F3A] dark:bg-[#2563EB] text-white font-semibold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

