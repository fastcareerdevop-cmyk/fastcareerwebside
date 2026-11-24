import React from 'react';
import { Hero } from './home/Hero';
import { TrustStats } from './home/TrustStats';
import { ServicesSection } from './home/ServicesSection';
import { JourneyTimelineSection } from './home/JourneyTimelineSection';
import { ExpertiseSection } from './home/ExpertiseSection';
import { ProcessSection } from './home/ProcessSection';
import { CandidateSection } from './home/CandidateSection';
import { EmployerSection } from './home/EmployerSection';
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

      {/* 3. In-Depth Service Offerings */}
      <JourneyTimelineSection />
      <ServicesSection />
      <ExpertiseSection />
      <ProcessSection />
      <CandidateSection />
      <EmployerSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
