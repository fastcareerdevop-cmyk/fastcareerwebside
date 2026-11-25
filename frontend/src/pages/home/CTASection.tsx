import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="bg-[#1D64F2] text-white py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[28px] sm:text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-6">
          Transform Your CA Qualification into a Career Breakthrough
        </h2>
        <p className="text-[16px] sm:text-[18px] text-blue-100 font-normal leading-[1.5] max-w-2xl mx-auto mb-10">
          Join 125,000+ Chartered Accountants connecting directly with India&apos;s top 60+ corporates.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#1D64F2] text-[16px] font-semibold transition-colors shadow-lg"
        >
          <span>Register Free Today</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};
