import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Top announcement ticker bar rendered above the Navbar.
 * Uses pure CSS GPU-accelerated marquee animation for zero lag.
 */
export const TickerBanner: React.FC = () => {
  const tickerText = "Looking for CA-IT? Know More...!";
  const repeatCount = 8;

  const renderGroup = (isDuplicate = false) => (
    <div className="flex items-center shrink-0" aria-hidden={isDuplicate || undefined}>
      {Array.from({ length: repeatCount }).map((_, idx) => (
        <span key={idx} className="inline-flex items-center gap-2 pr-10">
          <Sparkles size={13} className="text-amber-300 shrink-0" />
          {tickerText}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full text-white overflow-hidden border-b border-white/15 select-none"
      style={{ backgroundColor: '#02436A' }}
    >
      <div className="flex items-center h-9 pr-28 sm:pr-36">
        <Link to="/ca-it" className="flex-1 overflow-hidden block">
          <div className="animate-marquee whitespace-nowrap flex items-center text-xs sm:text-[13px] font-medium tracking-wide">
            {renderGroup(false)}
            {renderGroup(true)}
          </div>
        </Link>

        {/* Right-anchored CTA */}
        <Link
          to="/ca-it"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white text-[#02436A] hover:bg-amber-300 hover:text-[#02436A] rounded-full px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm transition-colors z-10"
        >
          <span>Know More!</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};
