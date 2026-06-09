import { NavBar } from './nav-bar';
import { Hero } from './hero';
import { FeaturesSection } from './features-section';
import { AboutSection } from './about-section';
import { Testimonials } from './testimonials';
import { CtaSection } from './cta-section';
import { Footer } from './footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Hero />
      <FeaturesSection />
      <AboutSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
