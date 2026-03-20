const steps = [
  {
    num: '01',
    title: 'All your store data flows into WirelessPOS',
    desc: 'Sales, repairs, inventory, activations, employees, and customers — every transaction captured in one place.',
    accent: '#00d4aa',
    icon: '🏪',
  },
  {
    num: '02',
    title: 'WirelessCEO analyzes everything',
    desc: 'The AI layer processes your data in real-time — spotting profit leaks, pricing gaps, and performance issues you can\'t see manually.',
    accent: '#0ea5e9',
    icon: '🤖',
  },
  {
    num: '03',
    title: 'You get decisions + automated actions',
    desc: 'WirelessCEO tells you exactly what to fix, what to raise, and what to reorder — then executes the actions for you.',
    accent: '#f59e0b',
    icon: '⚡',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24" style={{ background: '#0d1117' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-2 px-4 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
            style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Three Steps to a Smarter Store
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-2xl p-7 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTopColor: s.accent, borderTopWidth: 3 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-4xl font-black" style={{ color: s.accent, opacity: 0.3 }}>{s.num}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
