import React from 'react';
import { Hero } from './home/Hero';
import { TrustStats } from './home/TrustStats';
import { EmployerSection } from './home/EmployerSection';
import { CandidateSection } from './home/CandidateSection';
import { CoreExpertiseSection, CampusVenuesSection } from './home/ExpertiseSection';
import { ServicesSection } from './home/ServicesSection';
import { ProcessSection } from './home/ProcessSection';
import { TestimonialSection } from './home/TestimonialSection';
import { FAQSection } from './home/FAQSection';
import { CTASection } from './home/CTASection';

export const Home = () => {
  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Stats & Placement Metrics */}
      <TrustStats />

      {/* 3. Image 2: Are You a Corporate? / Why FAST Careers? */}
      <EmployerSection />

      {/* 4. Image 1: Start Your Finance Career with India's Top Corporates (For CA Candidates) */}
      <CandidateSection />

      {/* 5. Image 3: Our Core Expertise (Dark Section) */}
      <CoreExpertiseSection />

      {/* 7. Image 4: End-to-End Talent Solutions & 3 Specialized Delivery Frameworks */}
      <ServicesSection />

      {/* 8. Image 5: Venues across 9 Cities & How Does FAST CA CAMPUS Work? */}
      <CampusVenuesSection />
      <ProcessSection />

      {/* 9. Image 6: Testimonials, FAQ & Leadership CTA */}
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
