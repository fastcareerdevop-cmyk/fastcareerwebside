import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';

const fastFeatures = [
  '100% free registration and zero placement fees for CA candidates',
  'Pre-screened profiles verified on attempts, articleship, and technical fit',
  'Direct interview access to 60+ Big 4s and Fortune 500 corporates',
  'Dedicated campus day coordination across 9 cities and virtual drives',
  'Custom Excel shortlists and resume dossiers tailored to corporate JDs',
];

const genericFeatures = [
  'Paid boosts or hidden subscription tiers for visibility',
  'Unverified mass applications with zero attempt or domain screening',
  'Middlemen agencies and slow, unresponsive application black holes',
  'No structured physical campus drives or ranker fast-track rooms',
  'Generic keyword matching that misses specialized CA qualifications',
];

export const ComparisonSection = () => {
  return (
    <section className="bg-[#F9F9F9] py-20 sm:py-24 border-b border-[#E5E5E5]" id="why-fast">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold tracking-wider uppercase mb-4">
            Why FAST Careers
          </span>
          <h2 className="text-[28px] sm:text-[48px] font-bold text-[#171717] leading-[1.1] tracking-tight mb-4">
            The FAST Advantage
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#525252] font-normal leading-[1.5]">
            Built exclusively for Chartered Accountants and elite finance recruiters.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Left: FAST Careers */}
          <div className="bg-white border-2 border-[#1D64F2] rounded-2xl p-7 sm:p-9 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#E5E5E5]">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold mb-2">
                    Recommended
                  </span>
                  <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#171717]">
                    FAST Careers
                  </h3>
                </div>
                <span className="text-sm font-semibold text-[#1D64F2]">100% Free</span>
              </div>

              <ul className="space-y-4 mb-8">
                {fastFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#EAF3FF] text-[#1D64F2] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span className="text-[16px] text-[#171717] leading-[1.5]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-[#1D64F2] hover:bg-[#2563EB] text-white text-[16px] font-semibold transition-colors"
            >
              <span>Register Free Now</span>
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Right: Generic Job Portals */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-7 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#E5E5E5]">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F9F9F9] text-[#525252] text-xs font-semibold border border-[#E5E5E5] mb-2">
                    Traditional
                  </span>
                  <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#525252]">
                    Generic Job Portals
                  </h3>
                </div>
              </div>

              <ul className="space-y-4">
                {genericFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X size={14} strokeWidth={2.5} />
                    </span>
                    <span className="text-[16px] text-[#525252] leading-[1.5]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
