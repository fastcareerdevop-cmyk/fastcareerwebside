import React from 'react';
import { Hero } from './home/Hero';
import { TrustStats } from './home/TrustStats';
import { EmployerSection } from './home/EmployerSection';
import { ServicesSection } from './home/ServicesSection';
import { ExpertiseSection } from './home/ExpertiseSection';
import { ProcessSection } from './home/ProcessSection';
import { CandidateSection } from './home/CandidateSection';
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

      {/* 3. Are You a Corporate? / Why FAST Careers */}
      <EmployerSection />

      {/* 4. In-Depth Service Offerings */}
      <ServicesSection />
      <ExpertiseSection />
      <ProcessSection />
      <CandidateSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
