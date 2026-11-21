import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { X, Building2, UserPlus, ArrowRight, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';

interface SignUpChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndustrial: () => void;
}

export const SignUpChoiceModal: React.FC<SignUpChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectIndustrial,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!isOpen) return null;

  const handleSelectCandidate = () => {
    if (window.location.pathname === '/register') {
      onClose();
      return;
    }
    // Navigate first while modal is still rendered over the old page
    navigate('/register');
    // Ensure modal closes seamlessly as the register page mounts
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleSelectIndustrial = () => {
    onClose();
    if (onSelectIndustrial) {
      onSelectIndustrial();
    } else {
      navigate('/industrial-training');
    }
  };

  const handleSignIn = () => {
    onClose();
    if (user) {
      if (user.role === 'candidate') navigate('/candidate/dashboard');
      else if (user.role === 'employer') navigate('/employer/dashboard');
      else if (user.role === 'admin' || user.role === 'employee') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="my-auto relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-4 sm:p-7 flex-1">
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-4 sm:mb-6 pr-6 sm:pr-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
              <Sparkles size={12} className="text-blue-600" />
              <span>Choose Your Registration Path</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-snug">
              Please choose the category that fits your current profile to begin registration
            </p>
          </div>

          {/* 2 Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Option 1: CA Professional Registration Form */}
            <div 
              onClick={handleSelectCandidate}
              className="group relative bg-gradient-to-b from-blue-50/60 via-white to-indigo-50/40 rounded-xl sm:rounded-2xl border-2 border-blue-200/90 hover:border-blue-600 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <UserPlus size={18} className="sm:w-[22px] sm:h-[22px] text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full">
                    Placements
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    CA Professional Registration Form
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                    For Qualified CAs, Semi-Qualified, and Freshers seeking full-time corporate campus placements across 500+ top corporates.
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5 text-[10.5px] sm:text-[11px] text-slate-600 font-medium pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                    <span>Upload CV & 1-click auto-fill</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                    <span>Free candidate placement dashboard</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-2.5 sm:mt-3 border-t border-blue-100/80">
                <button
                  type="button"
                  className="w-full py-2 sm:py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Register as CA Professional</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Option 2: CA Industrial Training */}
            <div 
              onClick={handleSelectIndustrial}
              className="group relative bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 rounded-xl sm:rounded-2xl border-2 border-amber-200/90 hover:border-amber-500 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap size={18} className="sm:w-[22px] sm:h-[22px] text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                    ICAI Norms
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    CA Industrial Training
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                    For CA Inter / Articleship students seeking 9–18 months Industrial Training at Big 4s, Top MNCs & Investment Banks.
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5 text-[10.5px] sm:text-[11px] text-slate-600 font-medium pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-600 shrink-0" />
                    <span>Verified ICAI eligibility check</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-600 shrink-0" />
                    <span>Direct referrals to top finance leaders</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-2.5 sm:mt-3 border-t border-amber-100/80">
                <button
                  type="button"
                  className="w-full py-2 sm:py-2.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Fill Industrial Training Form</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer: Already Registered Link */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Already registered?{' '}
              <button
                type="button"
                onClick={handleSignIn}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
              >
                Sign In to your account →
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
