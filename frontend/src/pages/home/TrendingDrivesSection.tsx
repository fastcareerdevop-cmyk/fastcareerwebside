import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Award, Briefcase, Building2 } from 'lucide-react';

interface DriveItem {
  id: string;
  title: string;
  category: 'CA Campus' | 'Lateral';
  desc: string;
  badge: string;
  link: string;
  icon: React.ElementType;
}

const drives: DriveItem[] = [
  {
    id: 'fast-ca-campus',
    title: 'FAST CA Campus',
    category: 'CA Campus',
    desc: 'Bi-annual pan-India campus drives for newly qualified CAs across 9 major cities.',
    badge: '100% Free',
    link: '/ca-campus',
    icon: GraduationCap,
  },
  {
    id: 'air-fast-track',
    title: 'AIR Fast-Track',
    category: 'CA Campus',
    desc: 'Priority interview tracks with Big 4s and top corporates for All India Rankers.',
    badge: '100% Free',
    link: '/placement-results',
    icon: Award,
  },
  {
    id: 'lateral-finance',
    title: 'Lateral Finance',
    category: 'Lateral',
    desc: 'Direct senior finance, audit, and taxation mandates for experienced Chartered Accountants.',
    badge: '100% Free',
    link: '/jobs',
    icon: Briefcase,
  },
  {
    id: 'corporate-drive',
    title: 'Corporate Drive',
    category: 'Lateral',
    desc: 'Dedicated single-company recruitment events tailored to your exact finance hiring criteria.',
    badge: '100% Free',
    link: '/placement-drive',
    icon: Building2,
  },
];

const categories = ['All', 'CA Campus', 'Lateral'] as const;

export const TrendingDrivesSection = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'CA Campus' | 'Lateral'>('All');

  const filteredDrives =
    activeTab === 'All' ? drives : drives.filter((d) => d.category === activeTab);

  return (
    <section className="bg-white py-20 sm:py-24 border-b border-[#E5E5E5]" id="drives">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-[28px] sm:text-[48px] font-bold text-[#171717] leading-[1.1] tracking-tight mb-3">
              Trending Placement Drives
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#525252] font-normal leading-[1.5]">
              Explore active hiring tracks for freshers, rankers, and experienced CAs.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="inline-flex items-center gap-2 bg-[#F9F9F9] p-1.5 rounded-xl border border-[#E5E5E5] self-start">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1D64F2] text-white'
                      : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDrives.map((drive) => {
            const Icon = drive.icon;
            return (
              <div
                key={drive.id}
                className="bg-white border border-[#E5E5E5] hover:border-[#1D64F2] rounded-2xl p-6 flex flex-col justify-between transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF3FF] text-[#1D64F2] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold">
                      {drive.badge}
                    </span>
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#171717] mb-2.5">
                    {drive.title}
                  </h3>

                  <p className="text-[16px] font-normal text-[#525252] leading-[1.5] mb-6">
                    {drive.desc}
                  </p>
                </div>

                <Link
                  to={drive.link}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1D64F2] group-hover:text-[#2563EB] transition-colors pt-4 border-t border-[#E5E5E5]"
                >
                  <span>View</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
