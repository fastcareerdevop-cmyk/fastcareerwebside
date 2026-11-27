import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  UserPlus, 
  Sparkles, 
  ArrowUpRight,
  MapPin,
  Users,
  Award
} from 'lucide-react';
import { ExecutiveLeadershipCards } from '../../components/ExecutiveLeadershipCards';

export const CampusGalleryGrid = () => {
  return (
    <div className="mb-14 sm:mb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles size={14} className="text-blue-600" />
          <span>FAST Campus Moments & Drives</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mb-2">
          Glimpses of Our <span className="text-blue-600">Pan-India Campuses</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal">
          Campus drives and corporate moments across 9 cities.
        </p>
      </motion.div>

      {/* Bento Collage Container - Styled like the reference */}
      <div className="bg-[#FAF8F5] p-3 sm:p-5 md:p-6 rounded-3xl border border-stone-200/90 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Item 1 (Left Tall Card - spans 4 cols on desktop, row-span-2) */}
          <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs min-h-[300px] md:min-h-[440px]">
            <img 
              src="/team_photos/team_photo_1.jpg" 
              alt="Campus Drive Interaction" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Badge */}
            <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CA CAMPUS DRIVE MOMENT</span>
            </div>
            {/* Corner arrow button */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow-sm">
              <ArrowUpRight size={16} />
            </div>
            {/* Bottom Caption */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <p className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-400" /> Physical Venue Drive
              </p>
              <h4 className="text-sm font-extrabold text-white mt-0.5">Premier Corporates & CA Freshers</h4>
            </div>
          </div>

          {/* Item 2 (Top Middle Wide Card - spans 5 cols) */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs h-52 sm:h-56">
            <img 
              src="/team_photos/team_photo_2.jpg" 
              alt="Team and Candidates" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow-sm">
              <ArrowUpRight size={16} />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
              Placement Selection Celebrations
            </div>
          </div>

          {/* Item 3 (Top Right Card - spans 3 cols) */}
          <div className="md:col-span-3 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs h-52 sm:h-56">
            <img 
              src="/team_photos/team_photo_3.jpg" 
              alt="Corporate Recruiters" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow-sm">
              <ArrowUpRight size={16} />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
              Corporate HR Panel
            </div>
          </div>

          {/* Item 4 (Middle Orange/Coral Accent Stat Card - spans 3 cols) - Exactly like "01 Million" card in reference */}
          <div className="md:col-span-3 bg-gradient-to-br from-[#E85D3B] to-[#D94824] p-5 rounded-2xl text-white flex flex-col justify-between shadow-2xs min-h-[170px] relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-3xl sm:text-4xl font-black tracking-tight block">
                18+ Yrs
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide mt-1 block">
                Placement Heritage
              </span>
            </div>
            <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-white/80 font-medium border-t border-white/20">
              <span>Since 2008</span>
              <Award size={18} className="text-amber-200" />
            </div>
            {/* Subtle background circle decoration */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Item 5 (Middle Photo Card next to orange card - spans 2 cols) */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs min-h-[170px]">
            <img 
              src="/team_photos/team_photo_4.jpg" 
              alt="Candidate Interactions" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all shadow-sm">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Item 6 (Middle Right Photo Card - spans 3 cols) */}
          <div className="md:col-span-3 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs min-h-[170px]">
            <img 
              src="/team_photos/team_photo_5.jpg" 
              alt="Panel Discussions" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow-sm">
              <ArrowUpRight size={16} />
            </div>
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              Face-2-Face Drives
            </div>
          </div>

          {/* Item 7 (Bottom Wide Panoramic Card - spans full 12 cols) */}
          <div className="md:col-span-12 relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xs h-56 sm:h-64">
            <img 
              src="/team_photos/team_photo_10.jpg" 
              alt="All India FAST Campus Batch" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 object-center"
            />
            <div className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-2">
              <Users size={14} className="text-emerald-400" />
              <span>FAST Pan-India Campus Community</span>
            </div>
            <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow-sm">
              <ArrowUpRight size={16} />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80 font-medium">Over 5,000+ candidates participated in recent physical & virtual drives</p>
                <p className="text-sm font-black text-white">Connecting Chartered Accountants with 60+ Elite Corporates</p>
              </div>
              <Link 
                to="/ca-campus" 
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <span>View Campus Details</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#EDF5FF]/60 via-[#F8FAFC] to-[#F1F5F9] border-t border-slate-200/80 relative overflow-hidden" id="contact-leaders">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

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

        {/* Executive leadership contact cards */}
        <ExecutiveLeadershipCards className="mt-10 mb-0 max-w-xs auto-rows-fr md:max-w-[41rem]" />

      </div>
    </section>
  );
};
