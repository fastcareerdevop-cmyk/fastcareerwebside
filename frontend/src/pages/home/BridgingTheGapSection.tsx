import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Building2,
  Award,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const bridgeSteps = [
  {
    title: '125,000+ CA Pool',
    desc: 'Direct access to All India Rankers, fresh qualifieds & experienced finance leaders.',
    icon: Users,
  },
  {
    title: 'Pre-Screened Profiles',
    desc: 'Verified attempts, articleship exposure, and custom JD shortlisting.',
    icon: ShieldCheck,
  },
  {
    title: 'Pan-India Campuses',
    desc: 'Physical drives across 9 major cities + Centralized Virtual Campus.',
    icon: Building2,
  },
  {
    title: 'Direct Corporate Offers',
    desc: 'Fast-track interviews with Big 4s, Fortune 500s & 60+ top corporates.',
    icon: Award,
  },
];

export const BridgingTheGapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked animation: hands continuously come closer as the user scrolls down
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const leftHandX = useTransform(scrollYProgress, [0, 1], [-240, 0]);
  const rightHandX = useTransform(scrollYProgress, [0, 1], [240, 0]);
  const handsOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.25, 0.8, 1]);
  const centerGlowScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.2]);
  const centerGlowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.6, 1]);

  return (
    <section
      ref={sectionRef}
      id="bridging-the-gap"
      className="relative bg-[#020817] text-white py-16 sm:py-24 overflow-hidden border-y border-blue-950/60"
    >
      {/* Ambient Radial Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Heading (Sheryians Style) */}
        <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white leading-[1.12]">
            Bridging the Gap Between{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              CA Talent &amp; Top Opportunities
            </span>
          </h2>
        </div>

        {/* ── Scroll-Driven Hands Stage (Sheryians Bootcamp Style) ── */}
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] flex items-center justify-center overflow-hidden">
          {/* Center Spark / Energy Glow between the two hands */}
          <motion.div
            style={{ scale: centerGlowScale, opacity: centerGlowOpacity }}
            className="relative z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-cyan-400/25 blur-2xl" />
            <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-sky-300/40 blur-md" />
          </motion.div>

          {/* Left Hand: CA Student / Graduate — comes closer on scroll */}
          <motion.div
            style={{ x: leftHandX, opacity: handsOpacity }}
            className="absolute left-0 sm:left-[2%] md:left-[6%] lg:left-[10%] inset-y-0 flex items-center z-10 pointer-events-none select-none"
          >
            <img
              src="/hand_student_feathered.png"
              alt="CA Talent Hand"
              className="h-44 sm:h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]"
            />
          </motion.div>

          {/* Right Hand: Corporate Recruiter — comes closer on scroll */}
          <motion.div
            style={{ x: rightHandX, opacity: handsOpacity }}
            className="absolute right-0 sm:right-[2%] md:right-[6%] lg:right-[10%] inset-y-0 flex items-center z-10 pointer-events-none select-none"
          >
            <img
              src="/hand_corporate_feathered.png"
              alt="Corporate Opportunity Hand"
              className="h-44 sm:h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]"
            />
          </motion.div>
        </div>

        {/* ── 4-Step Connected Icon Row (Sheryians Bootcamp Layout) ── */}
        <div className="relative mt-4 sm:mt-8 max-w-5xl mx-auto">
          {/* Horizontal Glowing Line connecting the 4 icons */}
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-blue-600/40 via-cyan-400 to-blue-600/40 shadow-[0_0_12px_rgba(34,211,238,0.6)] z-0" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {bridgeSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  {/* Glowing Square Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0b1f3d] to-[#061124] border border-cyan-400/50 group-hover:border-cyan-300 shadow-[0_0_22px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] flex items-center justify-center text-cyan-300 mb-4 transition-all duration-300 group-hover:scale-110">
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[220px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap size={17} />
              <span>Register as CA Candidate</span>
              <ArrowRight size={15} />
            </motion.button>
          </Link>

          <Link to="/placement-drive">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3 bg-slate-900/80 hover:bg-slate-800 text-white border border-cyan-500/40 hover:border-cyan-400 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Building2 size={17} className="text-cyan-400" />
              <span>Enlist for Corporate Campus</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};
