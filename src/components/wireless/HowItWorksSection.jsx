const STEPS = [
  {
    n: '01',
    icon: '🔗',
    title: 'All your store data flows into WirelessPOS',
    desc: 'Sales, repairs, inventory, activations, and customer records — all captured automatically in one place. No manual entry, no spreadsheets.',
    detail: 'Connects to your existing tools or replaces them entirely.',
  },
  {
    n: '02',
    icon: '🧠',
    title: 'WirelessCEO analyzes everything',
    desc: 'The AI engine processes your data in real-time, identifying patterns, inefficiencies, and profit opportunities you\'d never catch manually.',
    detail: 'Benchmarks your store against industry data to surface what matters.',
  },
  {
    n: '03',
    icon: '⚡',
    title: 'You get decisions + automated actions',
    desc: 'Reorder alerts, pricing recommendations, employee performance insights, and automated workflows — delivered before you even ask.',
    detail: 'Less time managing. More time growing.',
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 sm:py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>The System</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#0d1117' }}>
          How It Works
        </h2>
        <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: '#64748b' }}>
          Three steps from chaos to clarity.
        </p>
      </div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-7 top-14 bottom-14 w-0.5 hidden sm:block"
          style={{ background: 'linear-gradient(to bottom, #00d4aa, #0ea5e9, rgba(14,165,233,0))' }} />

        <div className="flex flex-col gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="relative flex gap-6 items-start group">
              {/* Step number circle */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', color: '#fff', boxShadow: '0 4px 16px rgba(0,212,170,0.3)' }}>
                {s.n}
              </div>

              {/* Content card */}
              <div className="flex-1 bg-white rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-0.5"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,212,170,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <h3 className="text-base font-bold" style={{ color: '#0d1117' }}>{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{ color: '#64748b' }}>{s.desc}</p>
                <p className="text-xs font-semibold" style={{ color: '#00d4aa' }}>→ {s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
