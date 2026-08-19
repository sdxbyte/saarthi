import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Search, Filter, Plus, CheckCircle, Lock, AlertCircle, Trash2, UserPlus, ShieldAlert, KeyRound } from 'lucide-react';
import { AdminUser, AdminRole } from '../../types/admin';
import {
  getDelegatedAdmins,
  addDelegatedAdmin,
  revokeDelegatedAdmin,
  DelegatedAdminAccount,
} from '../../utils/superAdminAuth';

const INITIAL_PRIMARY_OWNER: AdminUser = {
  id: 'ADM-SUPER-01',
  name: 'Sudip Adhikari (Platform Owner)',
  email: 'sudipadhikari8107@gmail.com',
  role: 'Super Admin',
  department: 'Platform Owner & Command Center',
  lastLogin: 'Active Session',
  status: 'Active',
  permissions: ['all_access', 'manage_roles', 'audit_logs', 'system_config', 'approve_documents', 'developer_command_center'],
};

export const UserManagementView: React.FC = () => {
  const [delegatedAccounts, setDelegatedAccounts] = useState<DelegatedAdminAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  // New Provision Form state
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Moderator' | 'Support'>('Admin');
  const [newDepartment, setNewDepartment] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    setDelegatedAccounts(getDelegatedAdmins());
  }, []);

  const handleCreateDelegatedAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUsername.trim()) {
      setFormError('Username or email is required.');
      return;
    }
    if (!newName.trim()) {
      setFormError('Officer full name is required.');
      return;
    }
    if (!newDepartment.trim()) {
      setFormError('Department is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const created = addDelegatedAdmin({
      usernameOrEmail: newUsername.trim(),
      name: newName.trim(),
      role: newRole,
      department: newDepartment.trim(),
      passwordHashOrPlain: newPassword,
      status: 'Active',
    });

    setDelegatedAccounts(getDelegatedAdmins());
    setFormSuccess(`Successfully provisioned delegated ${newRole} account for ${newName.trim()}!`);
    setNewUsername('');
    setNewName('');
    setNewDepartment('');
    setNewPassword('');
    setTimeout(() => {
      setIsProvisionModalOpen(false);
      setFormSuccess('');
    }, 1500);
  };

  const handleRevokeAccount = (id: string, name: string) => {
    if (confirm(`Are you sure you want to REVOKE administrative access for ${name}? They will no longer be able to log in.`)) {
      revokeDelegatedAdmin(id);
      setDelegatedAccounts(getDelegatedAdmins());
    }
  };

  const filteredDelegated = delegatedAccounts.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usernameOrEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Access Control Gateway</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
              Owner Mode: Verified
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Super Admin Access Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin Console. Provision or immediately revoke administrative access for secondary officers below.
          </p>
        </div>

        <button
          onClick={() => setIsProvisionModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-400/40 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Delegated Officer</span>
        </button>
      </div>

      {/* Primary Platform Owner Display Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Sole Platform Super Admin</span>
              <h2 className="text-base font-black text-white">{INITIAL_PRIMARY_OWNER.name}</h2>
              <div className="text-xs text-slate-400 font-mono">{INITIAL_PRIMARY_OWNER.email}</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            Full Access (Unrevokable Owner)
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search delegated officers by name or username..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Delegated Roles</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Support">Support</option>
          </select>
        </div>
      </div>

      {/* Delegated Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase font-mono">
            Authorized Delegated Personnel ({filteredDelegated.length})
          </h3>
          <span className="text-[11px] text-slate-500">Only listed active accounts can access admin portal</span>
        </div>

        {filteredDelegated.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-2">
            <Lock className="w-8 h-8 mx-auto text-slate-600" />
            <p className="font-bold text-slate-400">No delegated administrative accounts present.</p>
            <p className="text-[11px]">Primary Super Admin has current system access. Use "Provision Delegated Officer" to authorize team members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Officer Name</th>
                  <th className="p-3.5">Username / Email</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Date Authorized</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDelegated.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white text-xs">{u.name}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-300">{u.usernameOrEmail}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Shield className="w-3 h-3" /> {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{u.department}</td>
                    <td className="p-3.5 text-slate-400 text-[11px] font-mono">{u.dateAdded}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.status === 'Active' ? (
                        <button
                          onClick={() => handleRevokeAccount(u.id, u.name)}
                          className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Revoke Access</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Access Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Provision Delegated Officer</h3>
                  <p className="text-xs text-slate-400">Grant authorized system credentials under Super Admin Authorization</p>
                </div>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateDelegatedAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username or Email</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. officer.shrestha"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Officer Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Shrestha"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role Permission</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'Admin' | 'Moderator' | 'Support')}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Tax & IRD Ops"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign Initial Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40"
                >
                  Authorize Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
