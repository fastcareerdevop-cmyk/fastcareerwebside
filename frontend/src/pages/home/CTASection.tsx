import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  UserPlus
} from 'lucide-react';
import { ExecutiveLeadershipCards } from '../../components/ExecutiveLeadershipCards';

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#EDF5FF]/60 via-[#F8FAFC] to-[#F1F5F9] border-t border-slate-200/80 relative overflow-hidden" id="contact-leaders">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Executive Leadership Cards */}
        <ExecutiveLeadershipCards className="mb-8 sm:mb-10" />

        {/* Bottom Centered CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 text-center">
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus size={16} />
              <span>Register as CA Candidate</span>
              <ArrowRight size={15} />
            </motion.button>
          </Link>
          <Link to="/placement-drive">
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#2563EB] border border-[#2563EB] font-bold rounded-full shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Building2 size={16} className="text-[#2563EB]" />
              <span>Corporate Recruitment Registration</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
};
