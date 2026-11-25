import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck, Users, PhoneCall, Award } from 'lucide-react';

const corporateReasons = [
  {
    step: '01',
    title: 'Largest CA Pool in India',
    desc: '125,000+ registered CAs, including All India Rankers and 5,000+ freshers every attempt.',
    icon: Users,
    tag: '125K+ CAs'
  },
  {
    step: '02',
    title: 'Pre-Screened Shortlists',
    desc: 'Verified on attempts and articleship exposure. Custom Excel shortlists shared for your JD.',
    icon: ShieldCheck,
    tag: 'Verified'
  },
  {
    step: '03',
    title: '100% Finance Focus',
    desc: 'Dedicated CA & finance hiring with cost-effective campus and lateral models.',
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
            {corporateReasons.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.28, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                      Reason {item.step}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-base sm:text-lg text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-4">
              <Building2 size={15} className="text-blue-700" />
              <span>Are You a Corporate?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-[-0.03em]">
              Why <span className="text-blue-700">FAST Careers?</span>
            </h2>

            <p className="text-slate-600 text-base mb-7 leading-relaxed font-normal">
              Join <strong className="text-slate-900 font-semibold">60+ corporate employers</strong> hiring CA talent through FAST CA Campus, lateral mandates, and dedicated corporate drives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5">
              <Link to="/placement-drive">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Building2 size={17} />
                  <span>Enlist for Campus Drive</span>
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <PhoneCall size={17} className="text-blue-700" />
                  <span>Talk to Our Directors</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
