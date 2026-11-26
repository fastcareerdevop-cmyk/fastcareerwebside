import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, GraduationCap, Phone, Mail, MessageCircle,
  CheckCircle2, ArrowRight, Sparkles, Users, Briefcase, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IndustrialTrainingModal } from '../components/IndustrialTrainingModal';

// ─── Past Recruiter Companies ─────────────────────────────────────────────────
const PAST_RECRUITERS = [
  { name: 'Deloitte', badge: 'Big 4' },
  { name: 'EY', badge: 'Big 4' },
  { name: 'KPMG', badge: 'Big 4' },
  { name: 'PwC', badge: 'Big 4' },
  { name: 'Grant Thornton', badge: 'Advisory' },
  { name: 'BDO India', badge: 'Advisory' },
  { name: 'ICICI Bank', badge: 'Banking' },
  { name: 'Kotak Mahindra', badge: 'Banking' },
  { name: 'Vedanta', badge: 'Conglomerate' },
  { name: 'Aditya Birla Group', badge: 'Conglomerate' },
  { name: 'ITC Limited', badge: 'FMCG' },
  { name: 'NSE India', badge: 'Stock Exchange' },
  { name: 'Genpact', badge: 'Services' },
  { name: 'Motilal Oswal', badge: 'Securities' },
  { name: 'JM Financial', badge: 'Investment Bank' },
];

// ─── Who Can Apply ─────────────────────────────────────────────────────────────
const ELIGIBILITY = [
  'CA Inter (IPCC) passed – Group 1, Group 2 or Both Groups',
  'Registered with ICAI for CA Final',
  'Looking for Industrial Training (IT) with top corporates',
  'Fresh or experienced – all ICAI-registered candidates welcome',
  'Students across all 28 states & UTs via Virtual Campus',
];

// ─── Fade‑up animation helper ─────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export const CaIt: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1d64f2] text-white pt-32 pb-16 sm:pt-36 sm:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles size={14} className="text-yellow-300" />
              CA Industrial Training Opportunities
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
              Looking for <span className="text-yellow-300">CA‑IT?</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
              We have opportunities with <strong className="text-white">India's Leading Corporates</strong> for CA – Industrial Trainings.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3.5 rounded-full text-sm shadow-xl transition-all cursor-pointer"
            >
              Apply Here <ArrowRight size={16} />
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Building2 size={22} className="text-[#2563EB]" />, value: '60+', label: 'Leading Corporates' },
            { icon: <Users size={22} className="text-[#2563EB]" />, value: '125K+', label: 'CA Pool' },
            { icon: <Award size={22} className="text-[#2563EB]" />, value: '18+ Yrs', label: 'Placement Heritage' },
            { icon: <GraduationCap size={22} className="text-[#2563EB]" />, value: 'Pan‑India', label: 'Campus Reach' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-50 border border-blue-100">
                {s.icon}
                <span className="text-xl font-black text-slate-900">{s.value}</span>
                <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ── Who Can Apply ───────────────────────────────────────────────────── */}
        <section>
          <FadeUp>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap size={22} className="text-[#2563EB]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Who Can Apply?</h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">ICAI Registered</span>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-3">
            {ELIGIBILITY.map((item, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700 leading-snug">{item}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Past Recruiters ─────────────────────────────────────────────────── */}
        <section>
          <FadeUp>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase size={22} className="text-[#2563EB]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Past Recruiters</h2>
            </div>
          </FadeUp>
          <div className="flex flex-wrap gap-3">
            {PAST_RECRUITERS.map((r, i) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{r.badge}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Apply Form (Full Industrial Training Form inline) ──────────── */}
        <section id="apply">
          <FadeUp>
            <div className="flex items-center gap-2 mb-6">
              <ArrowRight size={22} className="text-[#2563EB]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Apply Here</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <IndustrialTrainingModal isOpen={true} onClose={() => {}} inline={true} />
          </FadeUp>
        </section>

        {/* ── Corporate Contact Section ───────────────────────────────────────── */}
        <section>
          <FadeUp>
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h3 className="text-xl sm:text-2xl font-black mb-1">Are you a Corporate looking for CA‑ITs?</h3>
                <p className="text-blue-200 text-sm max-w-md">
                  Contact us to hire CA Industrial Training students from India's largest CA pool — across 125K+ registered CAs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://wa.me/919829023534?text=Hi%2C%20I%20am%20looking%20for%20CA%20Industrial%20Training%20candidates."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-md"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a
                  href="mailto:esarthak@gmail.com?subject=CA-IT%20Enquiry"
                  className="flex items-center gap-2 bg-white text-[#1E3A5F] hover:bg-blue-50 font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-md"
                >
                  <Mail size={16} /> Email Us
                </a>
                <a
                  href="tel:+919829023534"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-full text-sm border border-white/20 transition-all"
                >
                  <Phone size={16} /> Call Us
                </a>
              </div>
            </div>
          </FadeUp>
        </section>

      </div>

      {/* Industrial Training Modal (popup from hero Apply Here button) */}
      <IndustrialTrainingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
