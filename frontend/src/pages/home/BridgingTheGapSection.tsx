import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  GraduationCap
} from 'lucide-react';

const bridgeSteps = [
  {
    step: '01',
    title: '125,000+ CA Pool',
    desc: 'Direct access to All India Rankers, fresh qualifieds & experienced finance leaders.',
    icon: Users,
    tag: 'Largest Talent Pool'
  },
  {
    step: '02',
    title: 'Pre-Screened Profiles',
    desc: 'Verified attempts, articleship experience, and custom JD shortlisting with zero hassle.',
    icon: ShieldCheck,
    tag: '100% Verified'
  },
  {
    step: '03',
    title: 'Pan-India Campuses',
    desc: 'Physical drives across 9 major cities + Centralized All-India Virtual Campus.',
    icon: Building2,
    tag: '9+ Metro Cities'
  },
  {
    step: '04',
    title: 'Direct Corporate Offers',
    desc: 'Fast-track interview day coordination with Big 4s, Fortune 500s & premier Indian enterprises.',
    icon: Award,
    tag: 'Top CTC Packages'
  }
];

export const BridgingTheGapSection = () => {
  return (
    <section className="relative bg-[#040814] text-white py-16 sm:py-24 overflow-hidden border-y border-cyan-950/40" id="bridging-the-gap">
      
      {/* Background Ambient Glows & Stars */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/15 via-cyan-500/20 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Centered like Sheryians Bootcamp) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>PAN-INDIA CA RECRUITMENT ECOSYSTEM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] mb-4">
              Bridging the Gap Between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                CA Talent &amp; Top Opportunities
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
              Empowering India's brightest Chartered Accountants with direct career pathways into 60+ leading corporate employers, Big 4s, and global multinationals.
            </p>
          </motion.div>
        </div>

        {/* ── Centerpiece: Interactive Scrolling Hands Animation (Sheryians Style) ── */}
        <div className="relative my-4 sm:my-8 max-w-5xl mx-auto">
          
          {/* Main Visual Stage */}
          <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[420px] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/20 via-slate-950/40 to-blue-950/20 border border-cyan-500/20 shadow-[0_0_50px_rgba(8,145,178,0.1)]">
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 via-blue-950/20 to-transparent pointer-events-none" />

            {/* Cyan Energy Beam across center */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] pointer-events-none" />

            {/* Left Hand: Student / CA Graduate Hand — Slides in from Left */}
            <motion.div
              initial={{ x: -160, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 sm:left-4 md:left-8 bottom-0 top-0 flex items-center z-10 pointer-events-none select-none"
            >
              <div className="relative">
                <img 
                  src="/hand_student_feathered.png" 
                  alt="CA Student Candidate Hand" 
                  className="h-44 sm:h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                />
                {/* Floating Tag */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute bottom-4 left-4 bg-slate-900/90 border border-blue-500/50 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg hidden sm:flex items-center gap-2"
                >
                  <GraduationCap size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">CA Talent &amp; Rankers</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Center: Glowing JOB Neon Briefcase with Pulsing Halo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative z-20 flex flex-col items-center justify-center p-4"
            >
              {/* Rotating Orbital Halo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full border border-cyan-400/30 border-dashed pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full border border-blue-500/20 pointer-events-none"
              />

              {/* Pulsing Core Glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-28 h-28 sm:w-36 sm:h-36 bg-cyan-500/30 rounded-full blur-2xl pointer-events-none"
              />

              {/* The Glowing Briefcase Image Asset */}
              <img 
                src="/center_job_glowing.png" 
                alt="FAST Careers Job Opportunity Hub" 
                className="h-28 sm:h-40 md:h-48 w-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]"
              />
            </motion.div>

            {/* Right Hand: Corporate Recruiter Hand — Slides in from Right */}
            <motion.div
              initial={{ x: 160, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 sm:right-4 md:right-8 bottom-0 top-0 flex items-center z-10 pointer-events-none select-none"
            >
              <div className="relative">
                <img 
                  src="/hand_corporate_feathered.png" 
                  alt="Corporate Recruiter Hand" 
                  className="h-44 sm:h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                />
                {/* Floating Tag */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute bottom-4 right-4 bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg hidden sm:flex items-center gap-2"
                >
                  <Briefcase size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">60+ Elite Corporates</span>
                </motion.div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ── 4-Step Pathway (Exact Sheryians Bootcamp Layout with Connecting Line) ── */}
        <div className="relative mt-12 sm:mt-16">
          
          {/* Horizontal Glowing Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_12px_#22d3ee] z-0" />

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {bridgeSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800 hover:border-cyan-500/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon with glowing pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-black text-slate-500 group-hover:text-cyan-400 transition-colors">
                        STEP {step.step}
                      </span>
                    </div>

                    {/* Step Tag */}
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md mb-2">
                      {step.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <span>Verified Mechanism</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ── Action CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap size={18} />
              <span>Register as CA Candidate</span>
              <ArrowRight size={16} />
            </motion.button>
          </Link>

          <Link to="/placement-drive">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white border-2 border-cyan-500/40 hover:border-cyan-400 font-extrabold rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Building2 size={18} className="text-cyan-400" />
              <span>Enlist for Corporate Campus</span>
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
