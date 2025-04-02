import React from "react";
import { AboutSection, BenefitsSection, CTASection, FeaturesSection, Footer, HeroSection } from "./components";

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
