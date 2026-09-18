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

  // 1. Load saved accounts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setAccounts(JSON.parse(saved));
      } else {
        // Default sample demo profiles
        const defaultProfiles: MeroshareAccount[] = [
          {
            id: 'acc-self-01',
            label: 'Personal Account (Self)',
            dpId: 102,
            dpName: 'GLOBAL IME CAPITAL LIMITED',
            username: '9841XXXXXX',
            dematNumber: '1301020001234567',
            crnNumber: 'C-ASBA-GICL-9821',
            pin: '1234',
            autoApplyEnabled: true,
            lastAppliedStatus: 'NEVER',
          },
          {
            id: 'acc-father-02',
            label: "Father's Profile",
            dpId: 105,
            dpName: 'NIBL ACE CAPITAL LIMITED',
            username: '9851XXXXXX',
            dematNumber: '1301050009876543',
            crnNumber: 'C-ASBA-NIBL-4410',
            pin: '5678',
            autoApplyEnabled: true,
            lastAppliedStatus: 'NEVER',
          },
        ];
        setAccounts(defaultProfiles);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfiles));
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

  // Handle Add New Account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountLabel || !username || !activeDematNumber || activeDematNumber.length !== 16 || !crnNumber || !pin) {
      alert('Please fill in all required fields (Label, Username, 8-Digit Client Demat ID, CRN, and PIN)');
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

    // Reset Form
    setAccountLabel('');
    setUsername('');
    setPassword('');
    setClientId('');
    setCrnNumber('');
    setPin('');
    setShowAddModal(false);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this MeroShare profile?')) {
      const updated = accounts.filter((a) => a.id !== id);
      saveAccountsToStorage(updated);
    }
  };

  const toggleAutoApply = (id: string) => {
    const updated = accounts.map((a) => (a.id === id ? { ...a, autoApplyEnabled: !a.autoApplyEnabled } : a));
    saveAccountsToStorage(updated);
  };

  // Execute Batch Auto-Apply
  const handleExecuteAutoApply = async () => {
    if (!selectedIssueId) {
      alert('Please select an open IPO issue to auto-apply.');
      return;
    }

    const targetAccounts = accounts.filter((a) => a.autoApplyEnabled);
    if (targetAccounts.length === 0) {
      alert('No accounts have "Auto-Apply" enabled. Please toggle auto-apply for at least 1 account.');
      return;
    }

    const targetIssue = issues.find((i) => i.companyShareId === selectedIssueId);
    if (!targetIssue) return;

    setIsExecuting(true);
    setExecutionResults([]);
    setExecutionMessage(`Executing C-ASBA MeroShare batch application for ${targetIssue.companyName} (${targetIssue.scrip}) across ${targetAccounts.length} profiles...`);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      });

      const data = await res.json();
      if (data.results) {
        setExecutionResults(data.results);
        setExecutionMessage(`Batch Auto-Apply Completed! ${data.totalApplied} application(s) processed with CDSC MeroShare C-ASBA verification numbers.`);

        // Update last applied status on accounts
        const updatedAccounts = accounts.map((acc) => {
          const matchResult = data.results.find((r: any) => r.accountId === acc.id);
          if (matchResult) {
            return {
              ...acc,
              lastAppliedStatus: matchResult.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
              lastAppliedAtBs: '2083-04-26 B.S.',
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

  return (
    <div className="space-y-6 pb-12 text-slate-100 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>OFFICIAL CDSC MEROSHARE C-ASBA ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-3">
              <span>MeroShare Auto-Apply Suite</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automated multi-account C-ASBA IPO, Right Share, and FPO application system. Integrated directly with CDSC MeroShare backend (133 DP Capitals). Never miss a public share allotment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoadingIssues || isLoadingCapitals}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIssues ? 'animate-spin' : ''}`} />
              <span>Sync CDSC MeroShare</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add MeroShare Account</span>
            </button>
          </div>
        </div>

        {/* System Stats Band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Configured Profiles</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{accounts.length} Accounts</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Auto-Apply Enabled</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {accounts.filter((a) => a.autoApplyEnabled).length} Active
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Open C-ASBA Issues</div>
            <div className="text-xl font-black text-cyan-400 mt-0.5">
              {issues.filter((i) => i.status === 'OPEN').length} Open IPOs
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">CDSC Capital Registry</div>
            <div className="text-xl font-black text-slate-200 mt-0.5">{capitals.length || 133} DPs Loaded</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Open Issues & Multi-Account Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Select Open IPO Issue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-white">Active C-ASBA Public Issues</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">CDSC Live Feed</span>
            </div>

            {isLoadingIssues ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                <p className="text-xs">Fetching active public issues from CDSC...</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl">
                No active public issues currently open on MeroShare.
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {issues.map((issue) => {
                  const isSelected = selectedIssueId === issue.companyShareId;
                  return (
                    <div
                      key={issue.companyShareId}
                      onClick={() => setSelectedIssueId(issue.companyShareId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <span>{issue.companyName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-semibold text-amber-300">
                              {issue.scrip}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {issue.shareTypeName} • {issue.shareGroupName}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            issue.status === 'OPEN'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-400'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-800/60 font-mono">
                        <div>
                          <div className="text-[10px] text-slate-500">Price</div>
                          <div className="text-slate-200 font-semibold">NPR {issue.pricePerShare}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Min Kitta</div>
                          <div className="text-slate-200 font-semibold">{issue.minKitta} Units</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Close Date (BS & AD Dual)</div>
                          <div className="text-amber-300 font-semibold text-[11px]">{issue.issueCloseDateBs} B.S.</div>
                          <div className="text-cyan-400 text-[10px]">{issue.issueCloseDateAd || '2026-06-22'} A.D.</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Allotment Check Button */}
            <div className="pt-2">
              <a
                href="https://iporesult.cdsc.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Check IPO Allotment Result (CDSC Official)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Multi-Account Vault & Execute Engine */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-base text-white">Configured MeroShare Accounts ({accounts.length})</h2>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Account</span>
              </button>
            </div>

            {/* Application Configuration Bar */}
            {selectedIssue && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Target Issue for Auto-Apply</span>
                  <span className="text-xs font-mono text-white font-bold">{selectedIssue.companyName} ({selectedIssue.scrip})</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Application Kitta:</span>
                    <input
                      type="number"
                      min={selectedIssue.minKitta || 10}
                      step={10}
                      value={applyKitta}
                      onChange={(e) => setApplyKitta(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-amber-500/40 rounded px-2 py-1 text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-slate-400">Units = NPR {(applyKitta * (selectedIssue.pricePerShare || 100)).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleExecuteAutoApply}
                    disabled={isExecuting || accounts.filter((a) => a.autoApplyEnabled).length === 0}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing C-ASBA...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Execute Multi-Account Auto-Apply ({accounts.filter((a) => a.autoApplyEnabled).length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Account Profile List */}
            {accounts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl space-y-3">
                <p>No MeroShare accounts configured yet.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Configure First MeroShare Account</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{acc.label}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          BOID: {maskBoidSecurely(acc.dematNumber)}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>DP: {acc.dpName}</span>
                        <span>•</span>
                        <span>CRN: {acc.crnNumber}</span>
                        <span>•</span>
                        <span>User: {acc.username}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <button
                        onClick={() => toggleAutoApply(acc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          acc.autoApplyEnabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{acc.autoApplyEnabled ? 'Auto-Apply ON' : 'Disabled'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Execution Result Modal / Notification Banner */}
            {executionMessage && (
              <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>{executionMessage}</span>
                </div>

                {executionResults.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Batch Application Receipts</div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {executionResults.map((r, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                          <div>
                            <span className="text-white font-bold">{r.accountLabel}</span>
                            <span className="text-slate-400 ml-2">({r.appliedKitta} Kitta = NPR {r.appliedAmountNpr})</span>
                            <div className="text-[11px] text-slate-400 mt-0.5">{r.message}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {r.casbaRefNo && <span className="text-emerald-400 font-bold">{r.casbaRefNo}</span>}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add MeroShare Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Add MeroShare Account Profile</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Account Label / Holder Name *</label>
                <input
                  type="text"
                  placeholder="e.g. My Personal Account, Father's MeroShare"
                  value={accountLabel}
                  onChange={(e) => setAccountLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Capital / Depository Participant (DP) *</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    DP ID: {selectedCapitalDpId}
                  </span>
                </label>
                <select
                  value={selectedCapitalDpId}
                  onChange={(e) => setSelectedCapitalDpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">
                    8-Digit Client Demat ID (or Full 16-Digit BOID) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {clientId.length > 8 ? `${clientId.length}/16` : `${clientId.length}/8 digits`}
                  </span>
                </div>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                  required
                />
                {activeDematNumber && (
                  <div className="mt-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Full BOID: <strong className="text-amber-300">{maskBoidSecurely(activeDematNumber)}</strong></span>
                    {activeDematNumber.length === 16 && (
                      <span className="text-emerald-400 text-[10px] font-sans font-bold">✓ 16-Digit Ready</span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">MeroShare Username *</label>
                  <input
                    type="text"
                    placeholder="e.g. 9841234567 or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">MeroShare Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="MeroShare password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">C-ASBA Bank CRN Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. C-ASBA-CRN-1002"
                    value={crnNumber}
                    onChange={(e) => setCrnNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">4-Digit Transaction PIN *</label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    placeholder="e.g. 1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-lg"
                >
                  Save Profile to MeroShare Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
