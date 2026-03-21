const PROOF = [
  { value: '500+', label: 'Stores Analyzed' },
  { value: '23%', label: 'Avg Profit Lift' },
  { value: '$8K', label: 'Avg Monthly Recovery' },
];

const WirelessFinalCTA = ({ onJoinWaitlist }) => (
  <section className="relative py-20 sm:py-24 text-white overflow-hidden" style={{ background: '#0d1117' }}>
    {/* Grid */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
      style={{ backgroundImage: 'linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
    {/* Glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px]"
        style={{ background: 'rgba(0,212,170,0.07)' }} />
    </div>

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
        style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4aa' }} />
        Free Store Profit Audit
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight tracking-tight">
        See What Your Store Is{' '}
        <span style={{ background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Missing
        </span>
      </h2>

      <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Take the free 2-minute store profit audit. Get a personalized AI report showing exactly where you're losing money — and how to fix it.
      </p>

      {/* Social proof numbers */}
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {PROOF.map(p => (
          <div key={p.label} className="text-center">
            <p className="text-2xl font-black" style={{ color: '#00d4aa' }}>{p.value}</p>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.label}</p>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button onClick={onJoinWaitlist}
        className="group inline-flex items-center gap-3 w-full sm:w-auto px-10 py-5 font-bold rounded-2xl shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg justify-center text-white"
        style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', boxShadow: '0 8px 40px rgba(0,212,170,0.3)' }}>
        Get Your Free Store Profit Audit
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </button>

      <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Free. Takes 2 minutes. No credit card required.
      </p>
    </div>
  </section>
);

export default WirelessFinalCTA;
