const STATS = [
  { value: '500+', label: 'Wireless Stores' },
  { value: '23%', label: 'Avg Profit Lift' },
  { value: '2 min', label: 'Audit Time' },
];

const AuditHeroSection = ({ onStartAudit, onJoinWaitlist }) => (
  <section className="min-h-screen flex items-center pt-16"
    style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 60%, #0d1117 100%)' }}>
    {/* Grid overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
      style={{ backgroundImage: 'linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    {/* Glow blobs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px]"
        style={{ background: 'rgba(0,212,170,0.07)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: 'rgba(14,165,233,0.06)' }} />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left — copy */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4aa' }} />
            WirelessCEO AI Operating System
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5 tracking-tight">
            Run Your Wireless Store on{' '}
            <span style={{ background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Autopilot
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Sales, repairs, inventory, activations, and customer data — unified into one AI system that tells you what to do next and does it for you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button onClick={onStartAudit}
              className="px-7 py-4 font-bold rounded-xl text-white text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', boxShadow: '0 8px 30px rgba(0,212,170,0.25)' }}>
              👉 Get Your Free Store Profit Audit
            </button>
            <button onClick={onJoinWaitlist}
              className="px-7 py-4 font-bold rounded-xl text-base transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)' }}>
              Join Early Access
            </button>
          </div>

          {/* Social proof stats */}
          <div className="flex flex-wrap gap-6">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — system diagram */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            {/* Glow ring */}
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }} />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="/images/system-diagram2.jpeg" alt="WirelessCEO System Diagram"
                className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AuditHeroSection;
