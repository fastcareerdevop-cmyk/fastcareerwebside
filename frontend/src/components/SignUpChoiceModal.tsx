import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (!isOpen) return null;

  const handleSelectCandidate = () => {
    onClose();
    navigate('/register');
  };

  const handleSelectIndustrial = () => {
    onClose();
    onSelectIndustrial();
  };

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-2.5">
              <Sparkles size={13} className="text-blue-600" />
              <span>Choose Your Registration Path</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Please choose the category that fits your current profile to begin registration
            </p>
          </div>

          {/* 2 Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option 1: CA Industrial Training */}
            <div 
              onClick={handleSelectIndustrial}
              className="group relative bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 rounded-2xl border-2 border-amber-200/90 hover:border-amber-500 p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap size={22} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                    ICAI Norms
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    CA Industrial Training
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For CA Inter / Articleship students seeking 9–18 months Industrial Training at Big 4s, Top MNCs & Investment Banks.
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 font-medium pt-1">
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

              <div className="pt-4 mt-3 border-t border-amber-100/80">
                <button
                  type="button"
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Fill Industrial Training Form</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Option 2: Register Candidate (Full Job Placement) */}
            <div 
              onClick={handleSelectCandidate}
              className="group relative bg-gradient-to-b from-blue-50/60 via-white to-indigo-50/40 rounded-2xl border-2 border-blue-200/90 hover:border-blue-600 p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <UserPlus size={22} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full">
                    Placements
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Register Candidate
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For Qualified CAs, Semi-Qualified, and Freshers seeking full-time corporate campus placements across 500+ top corporates.
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 font-medium pt-1">
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

              <div className="pt-4 mt-3 border-t border-blue-100/80">
                <button
                  type="button"
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Register as Candidate</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer: Already Registered Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
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
