const AuditHeroSection = ({ onStartAudit, onJoinWaitlist }) => (
  <section className="min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 60%, #0d1117 100%)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
            WirelessCEO AI Operating System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Run Your Wireless Store on Autopilot
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
            All your sales, repairs, inventory, activations, and customer data — unified into one system that tells you what to do next and does it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onStartAudit}
              className="px-8 py-4 font-bold rounded-xl text-white text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
              Get Your Free Store Profit Audit
            </button>
            <button onClick={onJoinWaitlist}
              className="px-8 py-4 font-bold rounded-xl text-base transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
              Join Early Access
            </button>
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/images/system-diagram2.jpeg" alt="WirelessCEO System Diagram"
              className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AuditHeroSection;
