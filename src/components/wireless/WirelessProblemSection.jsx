const PROBLEMS = [
  { icon: '🔧', title: 'Repairs tracked on paper', stat: '$2K–$8K lost/mo', desc: 'Jobs fall through the cracks. No follow-up. No upsell. Pure revenue leak.' },
  { icon: '📦', title: 'Inventory you can\'t see', stat: '$10K–$25K tied up', desc: 'Dead stock aging on shelves while fast-movers run out. Capital stuck in the wrong products.' },
  { icon: '💸', title: 'Guessing on margins', stat: '12–18% left on table', desc: 'No cost-plus pricing. No market benchmarks. You\'re charging less than you should.' },
  { icon: '👤', title: 'Staff performance invisible', stat: '23–35% underperformance', desc: 'No tracking means no accountability. Your best rep and worst rep look the same to you.' },
  { icon: '📊', title: 'Flying blind on profit', stat: 'No real P&L', desc: 'Revenue looks fine. But after parts, labor, and overhead — where\'s the actual profit?' },
];

const WirelessProblemSection = () => (
  <section id="problem-section" className="py-20 sm:py-24" style={{ background: '#f8fafc' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}>
          The Problem
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0d1117' }}>
          Wireless stores run in <span style={{ color: '#dc2626' }}>chaos</span>.
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748b' }}>
          Most stores operate reactively — leaking thousands every month from problems they can't even see.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {PROBLEMS.map((p, i) => (
          <div key={i} className="group bg-white rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
            style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
                {p.stat}
              </span>
            </div>
            <h3 className="font-bold text-sm mb-1.5" style={{ color: '#0d1117' }}>{p.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{p.desc}</p>
          </div>
        ))}

        {/* Summary card */}
        <div className="sm:col-span-2 lg:col-span-3 rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.03))', border: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-3xl flex-shrink-0">📉</span>
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: '#0d1117' }}>
              The average wireless store loses $3,000–$15,000/month from invisible inefficiencies.
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              Most owners don't know it's happening because they have no system to see it.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WirelessProblemSection;
