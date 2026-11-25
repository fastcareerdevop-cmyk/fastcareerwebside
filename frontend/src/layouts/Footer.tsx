import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Globe, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <RouterLink to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/fast_logo_new.png" alt="FAST CAREERS" className="h-10 w-auto object-contain bg-white rounded-lg p-1" />
              <div className="flex flex-col leading-tight">
                <span className="text-[18px] font-bold text-white tracking-tight">FAST <span className="text-[#2563EB]">CAREERS</span></span>
                <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">Since 2008</span>
              </div>
            </RouterLink>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              India's premier CA placement gateway connecting qualified finance talent with top corporates.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-slate-400 hover:text-white transition-colors">
                <Link size={18} />
              </a>
              <a href="https://wa.me/919229113040" target="_blank" rel="noopener noreferrer" title="WhatsApp (+91 92291 13040)" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:info@fastcareers.com" title="Email Us" className="text-slate-400 hover:text-white transition-colors">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><RouterLink to="/about" className="hover:text-white transition-colors">About Us</RouterLink></li>
              <li><RouterLink to="/placement-results" className="hover:text-white transition-colors">CA Placements</RouterLink></li>
              <li><RouterLink to="/ca-campus" className="hover:text-white transition-colors">CA Campus</RouterLink></li>
              <li><RouterLink to="/services" className="hover:text-white transition-colors">Services</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-white transition-colors">Contact</RouterLink></li>
            </ul>
          </div>

          {/* Column 3: Candidates */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Candidates</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><RouterLink to="/jobs" className="hover:text-white transition-colors">Current Openings</RouterLink></li>
              <li><RouterLink to="/register" className="hover:text-white transition-colors">Register Free</RouterLink></li>
              <li><RouterLink to="/login" className="hover:text-white transition-colors">Candidate Sign In</RouterLink></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Corporates */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Corporates</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><RouterLink to="/placement-drive" className="hover:text-white transition-colors">Enlist for Drive</RouterLink></li>
              <li><RouterLink to="/employers/solutions" className="hover:text-white transition-colors">Hiring Solutions</RouterLink></li>
              <li><RouterLink to="/employers/campus" className="hover:text-white transition-colors">Campus Hiring</RouterLink></li>
              <li><RouterLink to="/login" className="hover:text-white transition-colors">Employer Sign In</RouterLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} FAST CAREERS. All rights reserved.</p>
          <div className="flex space-x-6">
            <RouterLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</RouterLink>
            <RouterLink to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
