import React from 'react';
import { ShieldAlert, Lock, ShieldCheck, AlertCircle, Key, ArrowRight } from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface ProtectedRouteProps {
  currentAdmin: AdminUser | null;
  isAdminLoggedIn: boolean;
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  onOpenAdminLogin: () => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  currentAdmin,
  isAdminLoggedIn,
  requiredRole = 'ADMIN',
  onOpenAdminLogin,
  children,
}) => {
  // 1. Unauthenticated check
  if (!isAdminLoggedIn || !currentAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-950/30 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Restricted Portal Access
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Admin Gateway Protected</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This module requires active administrative authentication. Unauthenticated public access to government controls, database tools, and analytics is strictly prohibited.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-left flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold block text-white">Security Policy Enforced</span>
              <span>All access attempts are monitored and recorded in the audit log.</span>
            </div>
          </div>

          <button
            onClick={onOpenAdminLogin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-950/40 border border-amber-400/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate as SAARTHI Admin</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // Normalize role string
  const normRole = (currentAdmin.role || '').toUpperCase().replace(/\s+/g, '_');
  const isSuperAdmin =
    normRole === 'SUPER_ADMIN' ||
    currentAdmin.email?.toLowerCase() === 'sudipadhikari8107@gmail.com';
  const isAdmin = isSuperAdmin || normRole === 'ADMIN';
  const isModerator = isAdmin || normRole === 'MODERATOR';

  let hasPermission = false;
  if (requiredRole === 'SUPER_ADMIN') {
    hasPermission = isSuperAdmin;
  } else if (requiredRole === 'ADMIN') {
    hasPermission = isAdmin;
  } else {
    hasPermission = isModerator;
  }

  // 2. Insufficient Role Permissions (403 Forbidden)
  if (!hasPermission) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-rose-900/50 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-950/30">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              403 Forbidden
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Insufficient Permission</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your persona (<strong className="text-slate-200">{currentAdmin.role}</strong>) does not have authorization to access <strong className="text-rose-400">{requiredRole}</strong> developer tools or system controls.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold block text-white font-mono">{currentAdmin.email}</span>
              <span>Logged in as {currentAdmin.name} ({currentAdmin.department})</span>
            </div>
          </div>

          <button
            onClick={onOpenAdminLogin}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            Switch to Super Admin Credentials
          </button>
        </div>
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};
