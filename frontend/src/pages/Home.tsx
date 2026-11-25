import React from 'react';
import { Hero } from './home/Hero';
import { ImpactBandSection } from './home/ImpactBandSection';
import { TrendingDrivesSection } from './home/TrendingDrivesSection';
import { ComparisonSection } from './home/ComparisonSection';
import { TestimonialSection } from './home/TestimonialSection';
import { FAQSection } from './home/FAQSection';
import { CTASection } from './home/CTASection';

export const Home = () => {
  return (
    <div className="w-full bg-white text-[#171717]">
      {/* 1. Punchy Hero Section */}
      <Hero />

      {/* 2. Deep Navy (#0F172A) Impact Band */}
      <ImpactBandSection />

      {/* 3. FAST Education Style Trending Drives Grid */}
      <TrendingDrivesSection />

      {/* 4. Sheryians Style Comparison Section */}
      <ComparisonSection />

      {/* 5. 3-Column Recruiter & CA Reviews */}
      <TestimonialSection />

      {/* 6. Compact Collapsible FAQ Accordion */}
      <FAQSection />

      {/* 7. Bold Closing Royal Blue (#1D64F2) CTA Banner */}
      <CTASection />
    </div>
  );
};
