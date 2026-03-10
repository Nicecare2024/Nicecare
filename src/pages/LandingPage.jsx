import { useEffect } from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import WhoIsThisFor from '../components/landing/WhoIsThisFor';
import CounterOneSection from '../components/landing/CounterOneSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      document.documentElement.classList.add('loaded');
    }, 100);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove('loaded');
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0a0f1a] text-slate-900 dark:text-gray-50 overflow-x-hidden relative before:content-[''] before:fixed before:-top-1/2 before:-left-1/2 before:w-[200%] before:h-[200%] before:bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.08)_0%,transparent_50%)] before:animate-float before:pointer-events-none before:z-0">
      <a
        className="absolute -left-[999px] top-2 py-3 px-4 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 border-2 border-blue-600 dark:border-blue-400 rounded-lg z-[999] font-semibold focus-visible:left-4"
        href="#main-content"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main className="relative z-[1] px-[3%] sm:px-[4%] md:px-[5%]" id="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <WhoIsThisFor />
        <CounterOneSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
