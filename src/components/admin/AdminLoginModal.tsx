import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, X, KeyRound, ArrowRight } from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { authenticateAdminAsync } from '../../utils/superAdminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowForgotMsg(false);

    const cleanInput = email.trim();

    if (!cleanInput) {
      setError('Username or Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const authResult = await authenticateAdminAsync(cleanInput, password);
      setIsLoading(false);

      if (authResult.authenticated && authResult.userProfile) {
        const loggedInUser: AdminUser = {
          id: authResult.userProfile.id,
          name: authResult.userProfile.name,
          email: authResult.userProfile.email,
          role: authResult.userProfile.role,
          department: authResult.userProfile.department,
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Active',
          permissions: authResult.userProfile.permissions,
        };
        onLoginSuccess(loggedInUser);
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError(authResult.errorMessage || 'Access Denied: Account not authorized.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('An error occurred during authentication. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Administrator Gateway</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Please enter your credentials.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {showForgotMsg && (
          <div className="p-3 mb-4 rounded-xl bg-sky-950/60 border border-sky-800/80 text-sky-300 text-xs">
            Password reset link will be sent to verified administrator emails. Contact system security lead if required.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Username or Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@domain.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotMsg(true)}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/40 border border-amber-400/30 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating Credentials...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            SAARTHI Admin Gateway • Secure End-to-End Encrypted Access
          </p>
        </div>
      </div>
    </div>
  );
};
