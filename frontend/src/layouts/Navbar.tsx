import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, LogIn, ArrowRight, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { logout, reset } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { IndustrialTrainingModal } from '../components/IndustrialTrainingModal';
import { SignUpChoiceModal } from '../components/SignUpChoiceModal';

interface MenuColumn {
  heading: string;
  items: { label: string; path: string }[];
}

interface NavItem {
  name: string;
  path: string;
  columns?: MenuColumn[];
  footerLabel?: string;
  footerPath?: string;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'About',
    path: '/about',
    columns: [
      {
        heading: 'Company',
        items: [
          { label: 'About FAST Careers', path: '/about' },
          { label: 'Our Team & Leadership', path: '/our-team' },
          { label: 'Core Expertise', path: '/expertise' },
        ],
      },
      {
        heading: 'Connect',
        items: [
          { label: 'For Employers', path: '/employers' },
          { label: 'Contact Us', path: '/contact' },
        ],
      },
    ],
    footerLabel: 'About FAST Careers',
    footerPath: '/about',
  },
  {
    name: 'CA Placements',
    path: '/placement-results',
    columns: [
      {
        heading: 'For CA Candidates',
        items: [
          { label: 'Placement Results', path: '/placement-results' },
          { label: 'Current Job Openings', path: '/jobs' },
          { label: 'Register Free on Portal', path: '/register' },
          { label: 'Industrial Training (CA-IT)', path: '/industrial-training' },
        ],
      },
      {
        heading: 'Portal & Assessments',
        items: [
          { label: 'Fast Selection Test', path: '/candidate/fast-selection' },
          { label: 'Job Fair', path: '/candidate/job-fair' },
          { label: 'Candidate Sign In', path: '/login' },
        ],
      },
    ],
    footerLabel: 'All CA Placements',
    footerPath: '/placement-results',
  },
  {
    name: 'CA Campus',
    path: '/ca-campus',
    columns: [
      {
        heading: 'National Campus Drives',
        items: [
          { label: 'Campus Glimpses & Events', path: '/ca-campus' },
          { label: 'Enlist for Campus Drive', path: '/placement-drive' },
          { label: 'Registered Companies', path: '/candidate/companies' },
        ],
      },
      {
        heading: 'Campus Tracks',
        items: [
          { label: 'CA Fresher Placements', path: '/placement-results' },
          { label: 'Industrial Training Drive', path: '/industrial-training' },
        ],
      },
    ],
    footerLabel: 'Explore CA Campus',
    footerPath: '/ca-campus',
  },
  {
    name: 'Services',
    path: '/services',
    columns: [
      {
        heading: 'Recruitment Solutions',
        items: [
          { label: 'All Services Overview', path: '/services' },
          { label: 'Employer Solutions', path: '/employers' },
          { label: 'Book a Corporate Drive', path: '/placement-drive' },
        ],
      },
      {
        heading: 'Specializations',
        items: [
          { label: 'Domain Expertise', path: '/expertise' },
          { label: 'Industrial Training Hiring', path: '/industrial-training' },
        ],
      },
    ],
    footerLabel: 'All Services',
    footerPath: '/services',
  },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [industrialModalOpen, setIndustrialModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setSignUpModalOpen(false);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mega menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const currentMenu = navItems.find((item) => item.name === activeDropdown);

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setActiveDropdown(null)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white border-b border-slate-200/90 ${
        isScrolled ? 'shadow-sm py-2.5' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/fast_logo_new.png" alt="FAST CAREERS" className="h-10 sm:h-11 w-auto object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] sm:text-[19px] font-bold text-[#1a3a5c] tracking-[-0.02em]">
                FAST <span className="text-blue-600">CAREERS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
                Since 2008
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Revolut / FAST.edu.in Pill + Mega Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((link) => {
              const isRouteActive =
                location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              const isMenuOpen = activeDropdown === link.name;
              const hasMenu = Boolean(link.columns && link.columns.length > 0);

              if (!hasMenu) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onMouseEnter={() => setActiveDropdown(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isRouteActive
                        ? 'bg-[#191C1F] text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }

              return (
                <button
                  key={link.name}
                  type="button"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onClick={() => setActiveDropdown(isMenuOpen ? null : link.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isMenuOpen || isRouteActive
                      ? 'bg-[#191C1F] text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Desktop Auth/Actions */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={user.role === 'candidate' ? '/candidate/dashboard' : `/${user.role}/dashboard`}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors px-3.5 py-1.5 rounded-full hover:bg-slate-100"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-rose-600 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-full transition-all"
                >
                  Log in
                </Link>

                <button
                  type="button"
                  onClick={() => setSignUpModalOpen(true)}
                  className="text-sm font-medium text-white bg-[#191C1F] hover:bg-slate-800 px-5 py-2 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Sign up
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
                className="text-xs font-medium text-white bg-[#191C1F] hover:bg-slate-800 px-3.5 py-1.5 rounded-full cursor-pointer"
              >
                Sign up
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Desktop Mega Menu Dropdown (Revolut & FAST.edu.in Style) */}
      <AnimatePresence>
        {currentMenu && currentMenu.columns && (
          <motion.div
            key={currentMenu.name}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-xl z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-3 gap-10 max-w-3xl">
                {currentMenu.columns.map((col) => (
                  <div key={col.heading}>
                    <h4 className="text-xs font-bold text-slate-900 mb-3.5 tracking-tight">
                      {col.heading}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className="text-sm font-normal text-slate-600 hover:text-slate-950 transition-colors block"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {currentMenu.footerPath && (
                <div className="mt-7 pt-4 border-t border-slate-200">
                  <Link
                    to={currentMenu.footerPath}
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center justify-between w-full text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors group"
                  >
                    <span>{currentMenu.footerLabel}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl absolute w-full left-0 top-full flex flex-col px-5 py-5 space-y-2 z-50 max-h-[80vh] overflow-y-auto">
          {navItems.map((link) => {
            const isExpanded = expandedMobileItem === link.name;
            const hasMenu = Boolean(link.columns && link.columns.length > 0);

            if (!hasMenu) {
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              );
            }

            return (
              <div key={link.name} className="border-b border-slate-100 pb-1">
                <button
                  type="button"
                  onClick={() => setExpandedMobileItem(isExpanded ? null : link.name)}
                  className="w-full flex items-center justify-between text-sm font-medium px-3 py-2.5 rounded-lg text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && link.columns && (
                  <div className="pl-5 pr-2 py-2 space-y-3 bg-slate-50/70 rounded-xl mt-1">
                    {link.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {col.heading}
                        </p>
                        <div className="space-y-1.5">
                          {col.items.map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-sm text-slate-700 hover:text-blue-700 py-1"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'candidate' ? '/candidate/dashboard' : `/${user.role}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-full py-2.5"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-rose-600 border border-rose-200 bg-rose-50 rounded-full py-2.5 cursor-pointer"
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
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-full py-2.5"
                >
                  <LogIn size={15} />
                  <span>Log in</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-[#191C1F] hover:bg-slate-800 rounded-full py-2.5 cursor-pointer"
                >
                  <span>Sign up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign Up Choice Modal */}
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
