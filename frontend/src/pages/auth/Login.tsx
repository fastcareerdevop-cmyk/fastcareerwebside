import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Zap,
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react';
import { login, reset } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { IndustrialTrainingModal } from '../../components/IndustrialTrainingModal';
import authService from '../../services/authService';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [industrialModalOpen, setIndustrialModalOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'candidate' | 'employer'>('candidate');
  const [formError, setFormError] = useState<string>('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'password'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetNotice, setResetNotice] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Clear any stale auth messages on mount and unmount
    dispatch(reset());
    setFormError('');
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      // Do not display leftover registration errors on the login page
      if (!message.toLowerCase().includes('already registered')) {
        setFormError(message);
        toast.error(message, { duration: 6000 });
      }
    }

    if (isSuccess || user) {
      if (user?.role === 'candidate') {
        navigate('/candidate/openings');
      } else if (user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (user?.role === 'admin' || user?.role === 'employee') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please fill this field: Email address';
    }
    if (!password) {
      newErrors.password = 'Please fill this field: Password';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    const userData = {
      email: email.trim(),
      password,
    };
    const resultAction = await dispatch(login(userData));
    if (login.rejected.match(resultAction)) {
      const err = (resultAction.payload as string) || 'Invalid email or password';
      setFormError(err);
      toast.error(err, { duration: 6000 });
    }
  };

  const closeForgotPassword = () => {
    setForgotOpen(false);
    setForgotStep('email');
    setForgotEmail('');
    setResetOtp('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetNotice('');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotEmail(email.trim());
    setForgotStep('email');
    setResetError('');
    setResetNotice('');
    setForgotOpen(true);
  };

  const sendPasswordResetCode = async () => {
    const trimmedEmail = forgotEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    try {
      const response: any = await authService.requestPasswordResetOtp(trimmedEmail);
      setForgotEmail(trimmedEmail);
      setForgotStep('otp');
      if (response?.debugOtp) {
        setResetOtp(response.debugOtp);
        setResetNotice(`Verification code: ${response.debugOtp}`);
      } else {
        setResetNotice(response.message);
      }
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setResetError(message || 'Unable to send a verification code. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  const verifyPasswordResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(resetOtp)) {
      setResetError('Enter the 4-digit verification code from your email.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    try {
      const response = await authService.verifyPasswordResetOtp(forgotEmail, resetOtp);
      setResetToken(response.resetToken);
      setForgotStep('password');
      setResetNotice('Code verified. Choose a new password for your account.');
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setResetError(message || 'Unable to verify this code. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    try {
      const response = await authService.resetPassword(forgotEmail, resetToken, newPassword);
      setEmail(forgotEmail);
      setPassword('');
      closeForgotPassword();
      toast.success(response.message);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setResetError(message || 'Unable to reset your password. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-100 flex flex-col justify-between pt-28 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full pt-3 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ─── LEFT COLUMN: Marketing & Value Proposition ─── */}
          <div className="lg:col-span-5 space-y-6 pt-1">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-900 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              India's #1 CA & Finance Career Network
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight">
              Land your dream role at{' '}
              <span className="text-blue-600">Big 4 & Global MNCs</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm leading-relaxed">
              Direct fast-track interviews for Qualified CAs, Semi-Qualified, and Articleship candidates. Get discovered by top partners.
            </p>

            {/* 3 Metrics Row */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-3 divide-x divide-slate-100 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">25,000+</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">CAs Placed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">98%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Call Rate</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">14.5 LPA</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Avg Package</div>
              </div>
            </div>

            {/* 3 Value Proposition Features */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Exclusive Big 4 & MNC Roles</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Statutory Audit, Direct Tax, M&A Advisory, and FP&A suites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">3x Faster Shortlisting</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Verified ICAI registration badge directly prioritizes your CV
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Salary Benchmark Analytics</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Insight on ₹18-35 LPA bands for 1st attempt & rank holders
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="bg-blue-50/70 border border-blue-100/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Priya Sharma"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="flex text-amber-400 text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Rank 14
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-snug">
                  "Placed at EY within 12 days via verified match."
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Priya Sharma • Senior Associate, Assurance
                </p>
              </div>
            </div>

            {/* Hiring Partners Strip */}
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                500+ Top Hiring Partners Including:
              </div>
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs font-semibold text-slate-500">
                <span>Deloitte.</span>
                <span>PwC</span>
                <span>EY</span>
                <span>KPMG</span>
                <span>Grant Thornton</span>
                <span>BDO</span>
                <span className="text-blue-600 font-bold">+500 More</span>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: High-Converting Login Card ─── */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 w-full">
              
              {/* Card Header */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Sign in to your account
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                  Welcome back! Or{' '}
                  <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    create a new account
                  </Link>
                </p>
              </div>

              {/* CA Industrial Training Form Callout Banner */}
              <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/80 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/30">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">CA Industrial Training Form</h4>
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          ICAI Norms
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        If you have or want CA Industrial Training, please fill this form!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIndustrialModalOpen(true)}
                    className="w-full sm:w-auto shrink-0 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Fill Form Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-start gap-3 text-rose-800 text-sm shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-rose-900 text-xs uppercase tracking-wider">Login Issue</div>
                      <div className="text-xs sm:text-sm text-rose-700 mt-0.5 font-medium">{formError}</div>
                    </div>
                  </div>
                )}
                
                {/* Email input */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      autoComplete="username email"
                      required
                      placeholder={activeRole === 'candidate' ? 'e.g. rahul@ca.org.in' : 'e.g. hr@company.com'}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                      }}
                      onBlur={() => {
                        if (!email.trim()) {
                          setFieldErrors(prev => ({ ...prev, email: 'Please fill this field: Email address' }));
                        }
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.email
                          ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 focus:border-rose-600'
                          : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={13} className="shrink-0 text-rose-600" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                      }}
                      onBlur={() => {
                        if (!password) {
                          setFieldErrors(prev => ({ ...prev, password: 'Please fill this field: Password' }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                        fieldErrors.password
                          ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 focus:border-rose-600'
                          : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={13} className="shrink-0 text-rose-600" />
                      <span>{fieldErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:shadow-slate-900/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Footer disclaimer */}
                <div className="pt-3 text-center space-y-2">
                  <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>256-bit encrypted secure session</span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Don't have an account on Fast Careers?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                      Register free
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Page Footer ─── */}
      <footer className="max-w-7xl mx-auto w-full pt-8 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-slate-800 tracking-wider">
          <ShieldCheck size={18} className="text-blue-600" />
          <span>FAST CAREERS</span>
        </div>
        <p className="text-center sm:text-right text-[11px] text-slate-400">
          © {new Date().getFullYear()} Fast Careers Inc. Premier Chartered Accountant & Financial Leadership Network. All rights reserved.
        </p>
      </footer>

      {/* Industrial Training Application Modal */}
      <IndustrialTrainingModal
        isOpen={industrialModalOpen}
        onClose={() => setIndustrialModalOpen(false)}
      />

      {forgotOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeForgotPassword();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <KeyRound size={20} />
                </div>
                <h2 id="forgot-password-title" className="text-xl font-bold text-slate-900">
                  {forgotStep === 'email' && 'Forgot your password?'}
                  {forgotStep === 'otp' && 'Check your email'}
                  {forgotStep === 'password' && 'Set a new password'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {forgotStep === 'email' && 'Enter your registered email to receive a 4-digit code.'}
                  {forgotStep === 'otp' && `Enter the 4-digit code sent to ${forgotEmail}.`}
                  {forgotStep === 'password' && 'Choose a new password for your account.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                aria-label="Close password reset"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {resetNotice && (
              <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{resetNotice}</p>
            )}
            {resetError && (
              <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {resetError}
              </p>
            )}

            {forgotStep === 'email' && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendPasswordResetCode();
                }}
              >
                <label className="block text-sm font-semibold text-slate-700" htmlFor="reset-email">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="you@example.com"
                />
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResetLoading ? 'Sending code...' : 'Send verification code'}
                </button>
              </form>
            )}

            {forgotStep === 'otp' && (
              <form className="space-y-4" onSubmit={verifyPasswordResetCode}>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="reset-otp">
                  4-digit verification code
                </label>
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="0000"
                />
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResetLoading ? 'Verifying code...' : 'Verify code'}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('email');
                      setResetError('');
                      setResetNotice('');
                    }}
                    className="font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    disabled={isResetLoading}
                    onClick={() => void sendPasswordResetCode()}
                    className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'password' && (
              <form className="space-y-4" onSubmit={submitNewPassword}>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="confirm-new-password">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResetLoading ? 'Resetting password...' : 'Reset password'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
