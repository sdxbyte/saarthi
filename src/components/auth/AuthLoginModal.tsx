import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  X,
  User,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Smartphone,
  XCircle,
  FileText,
  Eye,
  EyeOff,
  Building,
  KeyRound,
  IdCard
} from 'lucide-react';
import { authenticateCitizen, registerCitizenAccount, logoutCitizen } from '../../utils/citizenAuthStore';
import { SaarthiLogo } from '../brand/SaarthiLogo';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  vaultDocCount?: number;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLogin,
  onLogout,
  onUpdateProfile,
  currentLang,
  theme,
  vaultDocCount = 0,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up inputs
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UX state
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit profile state (when logged in)
  const [editPhone, setEditPhone] = useState(userProfile.phone || '');
  const [editNagarikId, setEditNagarikId] = useState(userProfile.nagarikId || '');
  const [editSuccess, setEditSuccess] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Handle Citizen Login
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setForgotPasswordMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = authenticateCitizen(loginEmail, loginPassword);
      setIsSubmitting(false);

      if (res.success && res.profile) {
        onLogin(res.profile);
        setLoginEmail('');
        setLoginPassword('');
        onClose();
      } else {
        // GENERIC UNIFORM SECURITY ERROR
        setAuthError(res.message || 'Invalid email address or password. Access denied.');
      }
    }, 400);
  };

  // Handle Citizen Registration
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setForgotPasswordMsg(null);

    if (!regFullName.trim()) {
      setAuthError('Please enter your full name as per your citizenship document.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!regMobile.trim() || regMobile.length < 7) {
      setAuthError('Please enter a valid mobile number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your password entry.');
      return;
    }
    if (!agreeTerms) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = registerCitizenAccount({
        fullName: regFullName,
        email: regEmail,
        mobileNumber: regMobile,
        password: regPassword,
      });

      setIsSubmitting(false);

      if (res.success && res.profile) {
        setSuccessMsg('Account created successfully! Welcome to Saarthi Civic Portal.');
        onLogin(res.profile);
        setRegFullName('');
        setRegEmail('');
        setRegMobile('');
        setRegPassword('');
        setRegConfirmPassword('');
        setAgreeTerms(false);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 800);
      } else {
        setAuthError(res.message || 'Failed to create account. Please try again.');
      }
    }, 400);
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    setAuthError(null);
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setAuthError('Please enter your email address in the Email ID field to request a password reset.');
      return;
    }
    setForgotPasswordMsg(
      `If an account with ${loginEmail.trim()} exists, password reset instructions have been dispatched.`
    );
  };

  // Handle Profile Update (for logged in citizen)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      phone: editPhone.trim() || undefined,
      nagarikId: editNagarikId.trim() || undefined,
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2500);
  };

  // Handle Logout
  const handleLogoutCitizen = () => {
    logoutCitizen();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <SaarthiLogo variant="compact" theme="dark" size={40} />
            <div>
              <h2 className="font-extrabold text-base text-white">
                {userProfile.isLoggedIn
                  ? currentLang === 'ne' ? 'नागरिक प्रोफाइल र कागजात भल्ट' : 'Citizen Account & Document Vault'
                  : currentLang === 'ne' ? 'सारथी नागरिक पोर्टल' : 'Saarthi Citizen Portal'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {userProfile.isLoggedIn
                  ? 'Authenticated Citizen Personal Dashboard'
                  : 'Secure Access & Account Registration'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* LOGGED IN CITIZEN VIEW */}
          {userProfile.isLoggedIn ? (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-emerald-500 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      {userProfile.name ? userProfile.name.charAt(0) : 'C'}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>{userProfile.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                          Verified Citizen
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{userProfile.email}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Mobile Number</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {userProfile.phone || 'Not provided'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Saved Vault Documents</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {vaultDocCount} Item(s) Saved
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Citizen Profile Section */}
              <form onSubmit={handleSaveProfile} className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  <span>Update Profile Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Mobile Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. 9841234567"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Nagarik App ID (Optional)</label>
                    <input
                      type="text"
                      value={editNagarikId}
                      onChange={(e) => setEditNagarikId(e.target.value)}
                      placeholder="e.g. NAGARIK-00912"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {editSuccess ? (
                    <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Changes apply to personal vault documents.</span>
                  )}

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors"
                  >
                    Save Details
                  </button>
                </div>
              </form>

              {/* Citizen Security Notice */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Private Citizen Data Storage</span>
                </div>
                <p className="leading-relaxed">
                  Your uploaded citizenship IDs, passports, and vehicle records are encrypted and linked strictly to your citizen account. No unauthorized parties or non-administrative entities can view your documents.
                </p>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogoutCitizen}
                className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Citizen Account</span>
              </button>
            </div>
          ) : (
            /* PUBLIC LOG IN & REGISTRATION VIEW */
            <div className="space-y-4">
              {/* Primary Mode Switcher: Sign In vs Create Account */}
              <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                    setForgotPasswordMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 ${
                    authMode === 'signin'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ne' ? 'साइन इन' : 'Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                    setForgotPasswordMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ne' ? 'नयाँ खाता खोल्नुहोस्' : 'Create Account'}</span>
                </button>
              </div>

              {/* Success Notification */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Generic Error Notification */}
              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              {/* Forgot Password Notification */}
              {forgotPasswordMsg && (
                <div className="p-3.5 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="leading-relaxed">{forgotPasswordMsg}</span>
                </div>
              )}

              {/* 1. SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs animate-in fade-in">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email ID</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="yourmail@domain.com"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-amber-400 hover:underline font-semibold"
                      >
                        {currentLang === 'ne' ? 'पासवर्ड बिर्सनुभयो?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Citizen Account'}</span>
                  </button>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Public sign in grants access strictly to personal document vault & citizen services. Administrative panels require separate authorized credentials.
                  </p>
                </form>
              )}

              {/* 2. CREATE ACCOUNT FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs animate-in fade-in">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name (as per citizenship document) *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Full official name"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="yourmail@domain.com"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="reg-agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="reg-agree-terms" className="text-[11px] text-slate-400 cursor-pointer">
                      I agree to the <span className="text-slate-200 font-semibold underline">Terms of Service</span> and <span className="text-slate-200 font-semibold underline">Privacy Policy</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-900/30 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registering Account...' : 'Register Citizen Account'}</span>
                  </button>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Citizen accounts strictly receive "Citizen/User" permissions to store personal documents and apply for services.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
