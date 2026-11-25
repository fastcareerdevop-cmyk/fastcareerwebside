import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    quote:
      'FAST CA Campus gave us pre-screened freshers and rankers across multiple panels, saving weeks of hiring effort.',
    author: 'Head of Talent Acquisition',
    role: 'Leading Indian FMCG Conglomerate',
    tag: 'Corporate Recruiter',
  },
  {
    quote:
      'Zero fees and direct Big 4 interviews. FAST Careers helped me land my statutory audit role in Mumbai.',
    author: 'CA Ananya Sharma',
    role: 'Placed at Big 4 Assurance',
    tag: 'CA Freshers',
  },
  {
    quote:
      'Their structured Excel shortlists and verified attempt screening make lateral finance hiring effortless and fast.',
    author: 'VP Finance & HR',
    role: 'Fortune 500 Manufacturing Group',
    tag: 'Lateral Partner',
  },
];

export const TestimonialSection = () => {
  return (
    <section className="bg-white py-20 sm:py-24 border-b border-[#E5E5E5]" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-[28px] sm:text-[48px] font-bold text-[#171717] leading-[1.1] tracking-tight mb-4">
            Trusted Across India
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#525252] font-normal leading-[1.5]">
            Hear from corporate hiring leaders and placed Chartered Accountants.
          </p>
        </div>

        {/* 3-Column Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E5E5] rounded-2xl p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold">
                    {item.tag}
                  </span>
                </div>

                <p className="text-[16px] text-[#171717] font-normal leading-[1.6] mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 border-t border-[#E5E5E5]">
                <h3 className="text-[18px] font-semibold text-[#171717]">
                  {item.author}
                </h3>
                <p className="text-sm text-[#525252] font-normal mt-0.5">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
