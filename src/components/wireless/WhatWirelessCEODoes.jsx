const features = [
  { icon: '💰', title: 'Profit Tracking', desc: 'See daily revenue, COGS, warranty margin, unlock margin, and trade-in profit — all in one view.', accent: '#00d4aa' },
  { icon: '📊', title: 'Raise Prices Recommendations', desc: 'WirelessCEO spots underpriced repairs and tells you exactly which prices to raise and by how much.', accent: '#0ea5e9' },
  { icon: '📦', title: 'Inventory Reorder Alerts', desc: 'Know what to reorder before you run out. 30/60/90 day views with suggested quantities.', accent: '#f59e0b' },
  { icon: '👥', title: 'Employee Insights', desc: 'Revenue per employee, warranty attach rate, repair completion time, and rework tracking.', accent: '#10b981' },
  { icon: '🏪', title: 'Multi-Store Intelligence', desc: 'Compare performance across all locations. Spot which store is leaking and which is thriving.', accent: '#ea580c' },
];

const WhatWirelessCEODoes = ({ onStartAudit }) => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-2 px-4 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
            style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: '#00a88a' }}>
            AI Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0d1117' }}>
            What WirelessCEO Does
            <br />
            <span style={{ background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              For Your Store
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#64748b' }}>
            Stop guessing. WirelessCEO analyzes your store data and tells you exactly what actions will grow your profit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTopColor: f.accent, borderTopWidth: 3 }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-extrabold mb-2" style={{ color: '#0d1117' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
            </div>
          ))}

          {/* CTA card */}
          <div className="rounded-2xl p-6 md:p-7 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #0d1117, #1a2332)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>Free Audit</p>
              <h3 className="text-lg font-extrabold text-white mb-2">See What Your Store Is Missing</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Get a personalized store profit audit in 2 minutes.
              </p>
            </div>
            <button onClick={onStartAudit}
              className="w-full py-3 font-bold rounded-xl text-white text-sm transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
              Get Free Audit →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWirelessCEODoes;
