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
  const [showSignUpHint, setShowSignUpHint] = useState(true);
  
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
  
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast('Please sign in to access your dashboard', {
        icon: '🔒',
        duration: 4000,
      });
      navigate('/login?redirect=dashboard');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'CA Placements', path: '/placement-results' },
    { name: 'CA Campus', path: '/ca-campus' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white border-b border-slate-200/90 ${
        isScrolled ? 'shadow-sm py-2.5' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="FAST CAREERS" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    isActive 
                      ? 'text-blue-600 font-bold' 
                      : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth/Actions: Dashboard, Sign In, Sign Up */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={user.role === 'candidate' ? '/candidate/dashboard' : `/${user.role}/dashboard`} 
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50"
                >
                  <LayoutDashboard size={17} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-2xs cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Dashboard: If logged in opens directly, if not prompts sign in */}
                <button 
                  type="button"
                  onClick={handleDashboardClick}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                  title="Access your dashboard"
                >
                  <LayoutDashboard size={17} className="text-blue-600" />
                  <span>Dashboard</span>
                </button>

                {/* Sign In */}
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-blue-700 px-4 py-2 rounded-xl border border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 transition-all shadow-2xs"
                >
                  <LogIn size={14} className="text-blue-600" />
                  <span>Sign In</span>
                </Link>

                {/* Sign Up with Blinking Live Hint */}
                <div className="relative">
                  {showSignUpHint && (
                    <div className="absolute -top-11 right-0 z-30 flex items-center">
                      <div 
                        onClick={() => setSignUpModalOpen(true)}
                        className="cursor-pointer group flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-blue-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all whitespace-nowrap animate-bounce"
                        title="Click here to register for CA Jobs & Training"
                      >
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span>Register for CA Jobs &amp; Training</span>
                        <span className="text-amber-300 text-xs font-black group-hover:translate-x-0.5 transition-transform">👇</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSignUpHint(false);
                        }}
                        className="ml-1 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 rounded-full p-1 cursor-pointer transition-colors"
                        title="Dismiss"
                        aria-label="Dismiss message"
                      >
                        <X size={10} />
                      </button>
                      {/* Speech bubble pointer arrow */}
                      <div className="absolute -bottom-1 right-8 w-2 h-2 bg-indigo-700 rotate-45 transform origin-center"></div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSignUpModalOpen(true)}
                    className="relative flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group ring-2 ring-blue-400/50 hover:ring-blue-500"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <UserPlus size={14} className="text-white" />
                    <span>Sign Up</span>
                    <span className="text-[10px] text-blue-200 group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {!user && (
              <button
                type="button"
                onClick={() => setSignUpModalOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 px-3 py-1.5 rounded-lg shadow-xs cursor-pointer ring-1 ring-blue-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <UserPlus size={13} />
                <span>Sign Up</span>
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
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
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
              <>
                <button 
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleDashboardClick(e);
                  }}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2.5 cursor-pointer"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </button>

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
              </>
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
