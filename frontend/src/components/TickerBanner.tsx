import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Horizontal ticker banner with scrolling announcement text and a CTA button.
 */
export const TickerBanner: React.FC = () => {
  const text = `Looking for CA‑IT? We have opportunities with India's leading corporates for CA‑Industrial Trainings. Apply here... Past Recruiters: top companies. Who can apply? ICAI. Are you a corporate looking for CA‑ITs? Contact us via WhatsApp / Email / Call.`;

  return (
    <div className="relative bg-[#2563EB] text-white py-2 overflow-hidden">
      {/* Scrolling marquee */}
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      >
        <span className="mx-4 text-sm font-medium tracking-wide">{text}</span>
      </motion.div>
      {/* CTA button – anchored to the right side */}
      <Link
        to="/ca-it"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-[#2563EB] rounded-full px-4 py-1 text-xs font-semibold hover:bg-gray-100"
      >
        Know More!
      </Link>
    </div>
  );
};
