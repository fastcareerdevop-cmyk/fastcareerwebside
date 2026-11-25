import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Users, Lightbulb, ArrowRight, CheckCircle2, Building2, UserCheck, CalendarCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: GraduationCap,
    title: 'Campus Recruitment',
    description: 'Nationwide campus drives for fresh CAs and rankers.',
    badge: 'Freshers',
    link: '/placement-drive'
  },
  {
    icon: Briefcase,
    title: 'Lateral Recruitment',
    description: 'Experienced CA hiring (1–15+ yrs) for audit, tax & finance.',
    badge: 'Experienced',
    link: '/placement-drive'
  },
  {
    icon: Users,
    title: 'Recruitment Consultancy',
    description: 'End-to-end profiling, screening, and interview coordination.',
    badge: 'Full Cycle',
    link: '/services'
  },
  {
    icon: Lightbulb,
    title: 'Training & Mentorship',
    description: 'Technical tax/audit prep and corporate interview grooming.',
    badge: 'Masterclasses',
    link: '/ca-campus'
  }
];

const deliveryModes = [
  {
    modeNumber: 'MODE 01',
    badge: 'Flagship Program',
    badgeColor: 'bg-blue-700 text-white',
    icon: Building2,
    title: 'FAST CA CAMPUS',
    subtitle: 'Off-Campus Drives for CA Freshers',
    description: 'Private CA Campus drives held physically across 9+ cities and virtually across India.',
    points: [
      'Held twice a year: Jan–Feb & Aug–Sep',
      '5,000+ candidates register per cycle',
      '20–30 corporates participate each cycle'
    ],
    highlight: 'Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Pune & more',
    cta: 'Register for Campus Drive',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 02',
    badge: 'Experienced Hiring',
    badgeColor: 'bg-slate-900 text-white',
    icon: UserCheck,
    title: 'LATERAL RECRUITMENTS',
    subtitle: '1-on-1 Executive Hiring',
    description: 'Dedicated shortlisting and 1-on-1 interviews (virtual or in-person) for experienced CA roles.',
    points: [
      'Screened from 125,000+ CA database',
      'HR recruiters match candidates to your JD',
      'Best for experienced CAs (1–15+ yrs)'
    ],
    highlight: 'Mid to Senior CA & Finance Leadership',
    cta: 'Submit Lateral Requirement',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 03',
    badge: 'Customized',
    badgeColor: 'bg-emerald-700 text-white',
    icon: CalendarCheck,
    title: 'COMPANY SPECIFIC DRIVE',
    subtitle: 'Dedicated Corporate Drives',
    description: 'Pre-screened candidate pool lined up at your preferred date, city, or virtual venue.',
    points: [
      'Exclusive drive on your preferred dates',
      'Any city or virtual / blended format',
      'Best for high-volume fresher & ranker hiring'
    ],
    highlight: 'Dedicated hiring in any city of choice',
    cta: 'Plan Dedicated Drive',
    link: '/placement-drive'
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mb-3">
            Recruitment Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Focused hiring services for finance teams and Chartered Accountants.
          </p>
        </div>

        {/* 4 Cards in 1 Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 overflow-hidden">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all">
                    <service.icon size={20} />
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {service.badge}
                  </span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 font-normal">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link 
                  to={service.link}
                  className="flex items-center text-blue-700 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform"
                >
                  <span>Learn more</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Core Service Delivery Modes Section */}
        <div className="pt-2">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-700 block mb-2">
              Service Delivery Modes
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-[-0.03em] mb-2">
              3 Ways to Hire with FAST Careers
            </h3>
            <p className="text-sm text-slate-600 font-normal">
              Choose campus drives, lateral hiring, or dedicated company drives.
            </p>
          </motion.div>

          {/* Delivery Mode Cards */}
          <div className="space-y-5 max-w-5xl mx-auto pb-8 relative">
            {deliveryModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35 }}
                style={{ top: `calc(90px + ${index * 16}px)` }}
                className="sticky bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-blue-400 shadow-lg transition-all duration-200 group"
              >
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="text-xs font-bold text-blue-700 tracking-wider">
                        {mode.modeNumber}
                      </span>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${mode.badgeColor}`}>
                        {mode.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                        <mode.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 leading-tight">
                          {mode.title}
                        </h4>
                        <p className="text-xs font-medium text-blue-700">
                          {mode.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-3">
                      {mode.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={13} className="text-blue-600 shrink-0" />
                      <span>{mode.highlight}</span>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      {mode.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={mode.link}>
                      <button className="w-full py-2.5 bg-slate-900 hover:bg-blue-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <span>{mode.cta}</span>
                        <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
