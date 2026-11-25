import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: 'What services does FAST Careers provide?',
    answer: 'We specialize in CA Campus drives, lateral CA hiring (1–15+ yrs), Industrial Training placements, and dedicated corporate recruitment drives.'
  },
  {
    id: 2,
    question: 'Is registration free for candidates?',
    answer: 'Yes, 100% free. We never charge any registration or placement fee from candidates at any stage.'
  },
  {
    id: 3,
    question: 'What roles and CTC packages are offered?',
    answer: 'Roles span Statutory & Internal Audit, Taxation, Corporate Finance, FP&A, Banking, and CFO/Leadership mandates across ₹10 LPA to ₹1+ Crore packages.'
  },
  {
    id: 4,
    question: 'Can Fresher CAs and multiple-attempt candidates apply?',
    answer: 'Yes. We run mandates for First-Attempt Rankers as well as multiple-attempt CAs and industrial trainees.'
  },
  {
    id: 5,
    question: 'How do corporate employers partner with FAST Careers?',
    answer: 'Corporates can register via our Employers / Placement Drive page or Contact page to receive pre-screened shortlists within 24–48 hours.'
  },
  {
    id: 6,
    question: 'How can I reach FAST Careers support on WhatsApp?',
    answer: 'Use the WhatsApp button below or message +91 8839250427 for quick candidate and recruiter support.'
  }
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden border-b border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <HelpCircle size={15} />
            <span>FAQs</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.03em] mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Quick answers on CA placements, campus drives, and corporate hiring.
          </p>
        </motion.div>

        {/* Clean FAQ Accordion */}
        <div className="space-y-3 mb-8">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-blue-200 shadow-sm ring-1 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 text-slate-600 p-1"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                        <p className="pt-2.5">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Help CTA Box */}
        <div className="bg-[#0F2B48] rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Need more details?
            </h3>
            <p className="text-blue-200 text-sm mt-0.5 font-normal">
              Reach our team directly on phone or WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact">
              <button className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-xl text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer">
                <PhoneCall size={14} />
                <span>Contact Us</span>
              </button>
            </Link>
            <a
              href="https://wa.me/918839250427"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
