import { useState } from 'react';
import WirelessNav from '../components/wireless/WirelessNav';
import AuditHeroSection from '../components/wireless/AuditHeroSection';
import WirelessProblemSection from '../components/wireless/WirelessProblemSection';
import WhatWirelessCEODoes from '../components/wireless/WhatWirelessCEODoes';
import HowItWorksSection from '../components/wireless/HowItWorksSection';

import WirelessFinalCTA from '../components/wireless/WirelessFinalCTA';
import DemoBookingModal from '../components/wireless/DemoBookingModal';
import AuditFunnel from '../components/wireless/AuditFunnel';

const WirelessPOSLanding = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky nav */}
      <WirelessNav onStartAudit={() => setShowAudit(true)} onJoinWaitlist={() => setShowWaitlist(true)} />

      {/* 1. New Hero — Autopilot + system diagram */}
      <AuditHeroSection onStartAudit={() => setShowAudit(true)} onJoinWaitlist={() => setShowWaitlist(true)} />

      {/* 2. Problem — with dollar amounts */}
      <WirelessProblemSection />

      {/* 4. What WirelessCEO Does */}
      <WhatWirelessCEODoes onStartAudit={() => setShowAudit(true)} />

      {/* 5. How It Works */}
      <HowItWorksSection />

      {/* 7. Final CTA */}
      <WirelessFinalCTA onJoinWaitlist={() => setShowAudit(true)} />

      <DemoBookingModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
      <AuditFunnel isOpen={showAudit} onClose={() => setShowAudit(false)} />
    </div>
  );
};

export default WirelessPOSLanding;
