import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="bg-white pt-28 pb-16 sm:pt-32 sm:pb-24 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold tracking-wider uppercase mb-6">
              QUALIFY. CONNECT. GET PLACED.
            </div>

            {/* 64px Headline */}
            <h1 className="text-[32px] sm:text-[48px] lg:text-[64px] font-bold text-[#171717] leading-[1.06] tracking-tight mb-5">
              Become the <span className="text-[#1D64F2]">CA Talent</span> Companies Want to Hire
            </h1>

            {/* 1-Line Subtitle */}
            <p className="text-[16px] sm:text-[18px] font-normal text-[#525252] leading-[1.5] max-w-xl mb-8">
              India's premier placement gateway connecting Chartered Accountants with top corporates.
            </p>

            {/* 2 CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#1D64F2] hover:bg-[#2563EB] text-white text-[16px] font-semibold transition-colors"
              >
                <span>Start Journey</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/placement-drive"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white hover:bg-[#F9F9F9] text-[#171717] border border-[#E5E5E5] hover:border-[#1D64F2] text-[16px] font-semibold transition-colors"
              >
                <Building2 size={18} className="text-[#1D64F2]" />
                <span>Hire CAs</span>
              </Link>
            </div>

            {/* 3-Stat Proof Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E5E5E5] max-w-lg">
              <div>
                <div className="text-[24px] sm:text-[32px] font-bold text-[#1D64F2] leading-none mb-1.5">
                  125K+
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#525252]">
                  Registered CAs
                </div>
              </div>

              <div>
                <div className="text-[24px] sm:text-[32px] font-bold text-[#1D64F2] leading-none mb-1.5">
                  60+
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#525252]">
                  Top Corporates
                </div>
              </div>

              <div>
                <div className="text-[24px] sm:text-[32px] font-bold text-[#1D64F2] leading-none mb-1.5">
                  9
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#525252]">
                  Cities
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Corporate Campus Photo */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#E5E5E5] bg-[#F9F9F9] shadow-sm">
              <img
                src="/team_photos/team_photo_10.jpg"
                alt="FAST Careers Corporate Campus Drive"
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
