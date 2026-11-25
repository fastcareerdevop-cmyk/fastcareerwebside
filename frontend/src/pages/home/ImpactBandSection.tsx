import React from 'react';
import { MapPin, Globe, Building2 } from 'lucide-react';

const impactCards = [
  {
    title: '9-City Physical Drives',
    desc: 'Face-to-face corporate interviews hosted across India’s top metro business hubs.',
    icon: MapPin,
    stat: '9 Cities',
  },
  {
    title: 'All-India Virtual Campus',
    desc: 'Centralized online hiring drives connecting talent from all 28 states seamlessly.',
    icon: Globe,
    stat: 'Pan-India',
  },
  {
    title: 'Big 4 & Fortune 500 Desk',
    desc: 'Dedicated shortlisting and campus coordination for leading global finance enterprises.',
    icon: Building2,
    stat: '60+ Corporates',
  },
];

export const ImpactBandSection = () => {
  return (
    <section className="bg-[#0F172A] text-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#93C5FD] text-xs font-semibold tracking-wider uppercase mb-4">
            National Footprint
          </span>
          <h2 className="text-[28px] sm:text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-4">
            Built for Scale &amp; Precision
          </h2>
          <p className="text-[16px] sm:text-[18px] text-slate-300 font-normal leading-[1.5]">
            Connecting verified Chartered Accountants with leading employers through structured campus and lateral channels.
          </p>
        </div>

        {/* 3 Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {impactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-[#2563EB] rounded-2xl p-7 sm:p-8 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1D64F2]/20 text-[#60A5FA] flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-200">
                      {card.stat}
                    </span>
                  </div>

                  <h3 className="text-[20px] sm:text-[24px] font-semibold text-white leading-snug mb-3">
                    {card.title}
                  </h3>

                  <p className="text-[16px] font-normal text-slate-300 leading-[1.5]">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
