import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Users, PhoneCall, Award } from 'lucide-react';

const corporateReasons = [
  {
    step: '01',
    title: 'Largest CA Pool in India',
    desc: 'Access 125,000+ registered Chartered Accountants, including All India Rankers (AIRs) and 5,000+ fresh candidates enrolling post-ICAI results.',
    icon: Users,
    tag: '125K+ CAs'
  },
  {
    step: '02',
    title: 'Pre-Screened Talent & Shortlisting Support',
    desc: 'Candidates verified on attempt count, articleship exposure, and technical fitment. Custom Excel shortlists and dossiers delivered for your exact JD.',
    icon: ShieldCheck,
    tag: 'Zero Hassle'
  },
  {
    step: '03',
    title: '100% Finance Focus & Best ROI Commercials',
    desc: 'Exclusively dedicated to CA & finance recruitments with cost-effective campus & lateral models, transparent terms, and dedicated account support.',
    icon: Award,
    tag: 'Best ROI'
  }
];

export const EmployerSection = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200 relative overflow-hidden" id="employers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left: 3 Reasons Cards */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            {corporateReasons.map((item, i) => {
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.28, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="bg-slate-50 hover:bg-white border-2 border-slate-200/80 hover:border-blue-400 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-lg transition-all duration-200 flex items-start gap-4 group cursor-pointer relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs group-hover:scale-105">
                    <item.icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                        Reason {item.step}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-800 transition-colors">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            {/* Badge: Are You a Corporate? */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
              <Building2 size={16} className="text-blue-700" />
              <span>Are You a Corporate?</span>
            </div>

            {/* Heading: Why FAST Careers? */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
              Why <span className="text-blue-700">FAST Careers?</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed font-normal">
              Join <strong className="text-slate-900">60+ leading corporate employers</strong> who trust FAST Careers for their CA talent requirements. Whether participating in our bi-annual FAST CA Campus, lateral hiring, or hosting a dedicated corporate drive — we make CA recruitment seamless.
            </p>

            {/* 3 Key Highlights Checklist */}
            <div className="space-y-2.5 mb-8 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                <span><strong>125,000+ Registered CAs:</strong> Direct access to All India Rankers & Freshers.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                <span><strong>100% Pre-Screened:</strong> Verified attempts & custom shortlists for your JD.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                <span><strong>Full Campus Day Support:</strong> Zero hassle logistics with industry-best ROI.</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link to="/placement-drive">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Building2 size={18} />
                  <span>Enlist for Campus / Hiring Drive</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <PhoneCall size={18} className="text-blue-700" />
                  <span>Talk to Our Directors</span>
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Participate by filling a simple confirmation form & sharing your JD.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
