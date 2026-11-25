import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is registration completely free for CA candidates?',
    a: 'Yes, candidate registration, profile screening, and campus drive participation are 100% free with zero placement commission.',
  },
  {
    q: 'Can both CA freshers and experienced CAs apply?',
    a: 'Yes, we run dedicated bi-annual FAST CA Campus drives for freshers and year-round lateral mandates for experienced CAs.',
  },
  {
    q: 'Which cities host physical FAST CA Campus drives?',
    a: 'We conduct face-to-face drives across 9 major cities including Mumbai, Delhi NCR, Bengaluru, Chennai, Kolkata, Pune, Ahmedabad, Hyderabad, and Indore.',
  },
  {
    q: 'How do corporate recruiters enlist for a hiring drive?',
    a: 'Corporates can fill out the quick enlistment form, share their JD, and receive verified Excel shortlists from our HR team.',
  },
  {
    q: 'Are All India Rankers (AIRs) given priority fast-track interviews?',
    a: 'Yes, rankers and first-attempt CAs get priority shortlisting for exclusive Big 4 and Fortune 500 interview panels.',
  },
];

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#F9F9F9] py-20 sm:py-24" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF3FF] text-[#1E40AF] text-xs font-semibold tracking-wider uppercase mb-4">
            FAQs
          </span>
          <h2 className="text-[28px] sm:text-[48px] font-bold text-[#171717] leading-[1.1] tracking-tight mb-3">
            Common Questions
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#525252] font-normal leading-[1.5]">
            Quick answers for CA candidates and corporate hiring partners.
          </p>
        </div>

        {/* Collapsible Accordion */}
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-[16px] sm:text-[18px] font-semibold text-[#171717]">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#525252] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1D64F2]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-[16px] text-[#525252] font-normal leading-[1.5] border-t border-[#E5E5E5] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
