const STEPS = [
  { n: '01', title: 'All your store data flows into WirelessPOS', desc: 'Sales, repairs, inventory, activations, and customer records — all captured automatically in one place.' },
  { n: '02', title: 'WirelessCEO analyzes everything', desc: 'The AI engine processes your data in real-time, identifying patterns, inefficiencies, and opportunities you would never see manually.' },
  { n: '03', title: 'You get decisions + automated actions', desc: 'Reorder alerts, pricing recommendations, employee performance insights, and automated workflows — delivered before you even ask.' },
];

const HowItWorksSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>The System</p>
        <h2 className="text-3xl sm:text-4xl font-black" style={{ color: '#0d1117' }}>How It Works</h2>
      </div>
      <div className="flex flex-col gap-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', color: '#fff' }}>
              {s.n}
            </div>
            <div className="pt-1">
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d1117' }}>{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
