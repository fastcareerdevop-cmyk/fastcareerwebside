import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout, reset } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { IndustrialTrainingModal } from '../components/IndustrialTrainingModal';
import { SignUpChoiceModal } from '../components/SignUpChoiceModal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industrialModalOpen, setIndustrialModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically close sign up modal whenever route changes so background page is never flashed
  useEffect(() => {
    setSignUpModalOpen(false);
  }, [location.pathname]);
  
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'CA Placements', path: '/placement-results' },
    { name: 'CA Campus', path: '/ca-campus' },
    { name: 'Why FAST', path: '/#why-fast' },
    { name: 'Reviews', path: '/#reviews' },
    { name: 'FAQs', path: '/#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-200 bg-white border-b border-[#E5E5E5] ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/fast_logo_new.png" alt="FAST CAREERS" className="h-10 w-auto object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-[18px] font-bold text-[#171717] tracking-tight">FAST <span className="text-[#1D64F2]">CAREERS</span></span>
              <span className="text-[10px] font-medium text-[#525252] tracking-widest uppercase">Since 2008</span>
            </div>
          </Link>

          {/* Desktop Navigation Links (16px) */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith('/#');
              const isActive = !isHash && (location.pathname === link.path || location.pathname.startsWith(link.path));
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-[16px] font-medium text-[#525252] hover:text-[#1D64F2] transition-colors py-1"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-[16px] transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#1D64F2] font-semibold' 
                      : 'text-[#525252] font-medium hover:text-[#1D64F2]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D64F2] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth/Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={user.role === 'candidate' ? '/candidate/dashboard' : `/${user.role}/dashboard`} 
                  className="flex items-center gap-1.5 text-[15px] font-semibold text-[#171717] hover:text-[#1D64F2] transition-colors px-3 py-2 rounded-lg hover:bg-[#EAF3FF]"
                >
                  <LayoutDashboard size={17} className="text-[#1D64F2]" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#525252] hover:text-rose-600 px-3.5 py-2 rounded-lg border border-[#E5E5E5] hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Sign In */}
                <Link 
                  to="/login"
                  className="text-[15px] font-medium text-[#171717] hover:text-[#1D64F2] px-4 py-2 rounded-lg border border-[#E5E5E5] hover:border-[#1D64F2] transition-all"
                >
                  Sign In
                </Link>

                {/* Register */}
                <button
                  type="button"
                  onClick={() => setSignUpModalOpen(true)}
                  className="text-[15px] font-semibold text-white bg-[#1D64F2] hover:bg-[#2563EB] px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {!user && (
              <button
                type="button"
                onClick={() => setSignUpModalOpen(true)}
                className="text-xs font-semibold text-white bg-[#1D64F2] hover:bg-[#2563EB] px-3.5 py-2 rounded-lg cursor-pointer"
              >
                Register
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl absolute w-full left-0 top-full flex flex-col px-5 py-5 space-y-3 z-50">
          
          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            const isActive = !isHash && location.pathname === link.path;
            if (isHash) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium px-3 py-2 rounded-lg text-[#525252] hover:bg-[#EAF3FF] hover:text-[#1D64F2] transition-colors"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-[#EAF3FF] text-[#1D64F2] font-semibold' : 'font-medium text-[#525252] hover:bg-[#EAF3FF]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-slate-200 pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <Link 
                  to={user.role === 'candidate' ? '/candidate/dashboard' : `/${user.role}/dashboard`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2.5"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl py-2.5 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:border-blue-500 rounded-xl py-2.5 shadow-2xs"
                >
                  <LogIn size={15} className="text-blue-600" />
                  <span>Sign In</span>
                </Link>

                <button 
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-2.5 shadow-sm cursor-pointer"
                >
                  <UserPlus size={15} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign Up Choice Modal (Industrial Training vs Register Candidate) */}
      <SignUpChoiceModal
        isOpen={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSelectIndustrial={() => setIndustrialModalOpen(true)}
      />

      {/* Industrial Training Form Modal */}
      <IndustrialTrainingModal 
        isOpen={industrialModalOpen} 
        onClose={() => setIndustrialModalOpen(false)} 
      />
    </header>
  );
};
