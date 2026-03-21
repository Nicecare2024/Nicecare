const FEATURES = [
  {
    icon: '📈',
    title: 'Raise Prices Recommendations',
    desc: 'AI analyzes your repair pricing vs market rates and tells you exactly where you can charge more without losing customers.',
    stat: '+$800/mo avg',
    color: '#00d4aa',
  },
  {
    icon: '📦',
    title: 'Inventory Reorder Alerts',
    desc: 'Never run out of fast-moving stock. Automated alerts before you hit zero, with suggested reorder quantities.',
    stat: '0 stockouts',
    color: '#0ea5e9',
  },
  {
    icon: '👥',
    title: 'Employee Insights',
    desc: 'Revenue per employee, conversion rates, upsell performance. Know who\'s driving profit and who needs coaching.',
    stat: '35% more output',
    color: '#f59e0b',
  },
  {
    icon: '💰',
    title: 'Profit Tracking',
    desc: 'Real-time margin tracking across every service, product, and store. Know your actual profit — not just revenue.',
    stat: 'Real-time P&L',
    color: '#00d4aa',
  },
  {
    icon: '🏪',
    title: 'Multi-Store Intelligence',
    desc: 'Compare performance across all your locations. Spot which store is underperforming and why, instantly.',
    stat: 'All stores, 1 view',
    color: '#0ea5e9',
  },
  {
    icon: '🤖',
    title: 'Automated Actions',
    desc: 'WirelessCEO doesn\'t just report — it acts. Auto-reorders, customer follow-ups, and pricing updates on autopilot.',
    stat: 'Saves 8hrs/week',
    color: '#f59e0b',
  },
];

const WhatWirelessCEODoes = ({ onStartAudit }) => (
  <section id="features-section" className="py-20 sm:py-24" style={{ background: '#f8fafc' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>Capabilities</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0d1117' }}>
          What WirelessCEO Does For Your Store
        </h2>
        <p className="text-lg max-w-xl mx-auto" style={{ color: '#64748b' }}>
          One AI system that replaces guesswork with data-driven decisions across every part of your business.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {FEATURES.map((f, i) => (
          <div key={i} className="group bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                {f.icon}
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${f.color}10`, color: f.color, border: `1px solid ${f.color}20` }}>
                {f.stat}
              </span>
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: '#0d1117' }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button onClick={onStartAudit}
          className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-white text-base hover:opacity-90 hover:scale-[1.02] transition-all"
          style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', boxShadow: '0 8px 30px rgba(0,212,170,0.2)' }}>
          Get Your Free Store Profit Audit
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
        <p className="text-xs mt-3" style={{ color: '#94a3b8' }}>Free. 2 minutes. No credit card.</p>
      </div>
    </div>
  </section>
);

export default WhatWirelessCEODoes;
