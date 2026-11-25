import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, FileText, UserPlus, Briefcase, CheckCircle2 } from 'lucide-react';

const candidateHighlights = [
  {
    title: '100% Free for CAs',
    desc: 'Zero registration or placement fee at any stage.',
    icon: CheckCircle2
  },
  {
    title: 'Rankers & Freshers',
    desc: '5,000+ candidates enroll after every ICAI result.',
    icon: Award
  },
  {
    title: 'Direct Campus Access',
    desc: 'Interview with 60+ corporates across 9 cities & online.',
    icon: Briefcase
  },
  {
    title: 'Pre-Screened Shortlists',
    desc: 'HR-verified profiles for faster interview calls.',
    icon: FileText
  }
];

export const CandidateSection = () => {
  return (
    <section className="py-10 sm:py-14 bg-white overflow-hidden relative border-b border-slate-200" id="candidates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs mb-2.5 block">
              For CA Candidates (Freshers &amp; Experienced)
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-[-0.03em]">
              Start Your Finance Career with <br />
              <span className="text-blue-700">India’s Top Corporates</span>
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed font-normal max-w-xl">
              Join <strong className="font-semibold text-slate-900">125,000+ Chartered Accountants</strong> on FAST Careers for campus placements and lateral opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#191C1F] hover:bg-slate-800 text-white font-medium rounded-full shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>Register Free</span>
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
              <Link to="/candidate/current-openings">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#F3F4F6] hover:bg-slate-200 text-[#191C1F] font-medium rounded-full transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Briefcase size={16} />
                  <span>Current Openings</span>
                </motion.button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500">
              Next FAST CA Campus Drive: <strong className="text-slate-700 font-semibold">Jan–Feb</strong> &amp; <strong className="text-slate-700 font-semibold">Aug–Sep</strong>
            </p>
          </motion.div>

          {/* Right Cards */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4">
            {candidateHighlights.map((feat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-100/70 text-blue-700 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <feat.icon size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1 group-hover:text-blue-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
