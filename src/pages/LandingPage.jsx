// Modular Landing Page - Clean & Professional Design v3
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import WhoIsThisFor from '../components/landing/WhoIsThisFor';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      
      <Header />
      
      <main className="landing-main" id="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <WhoIsThisFor />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
