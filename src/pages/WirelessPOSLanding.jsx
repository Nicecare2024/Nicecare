import { useState } from 'react';
import AuditHeroSection from '../components/wireless/AuditHeroSection';
import WirelessHeroSection from '../components/wireless/WirelessHeroSection';
import WirelessProblemSection from '../components/wireless/WirelessProblemSection';
import WhatWirelessCEODoes from '../components/wireless/WhatWirelessCEODoes';
import HowItWorksSection from '../components/wireless/HowItWorksSection';
import ProductScreenshot from '../components/wireless/ProductScreenshot';
import WirelessFinalCTA from '../components/wireless/WirelessFinalCTA';
import DemoBookingModal from '../components/wireless/DemoBookingModal';
import AuditFunnel from '../components/wireless/AuditFunnel';

const WirelessPOSLanding = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. NEW Hero — Autopilot + diagram */}
      <AuditHeroSection onStartAudit={() => setShowAudit(true)} />

      {/* 2. OLD Hero repositioned — "Run Your Store Like a System" */}
      <WirelessHeroSection onJoinWaitlist={() => setShowWaitlist(true)} />

      {/* 3. Problem — tightened */}
      <WirelessProblemSection />

      {/* 4. What WirelessCEO Does — merged benefits */}
      <WhatWirelessCEODoes onStartAudit={() => setShowAudit(true)} />

      {/* 5. How It Works — 3 steps */}
      <HowItWorksSection />

      {/* 6. Dashboard — "See Your Store Like Never Before" */}
      <ProductScreenshot />

      {/* 7. Final CTA — "See What Your Store Is Missing" */}
      <WirelessFinalCTA onJoinWaitlist={() => setShowAudit(true)} />

      {/* Modals */}
      <DemoBookingModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
      <AuditFunnel isOpen={showAudit} onClose={() => setShowAudit(false)} />
    </div>
  );
};

export default WirelessPOSLanding;
