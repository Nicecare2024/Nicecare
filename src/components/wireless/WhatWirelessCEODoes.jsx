const FEATURES = [
  { icon: '📈', title: 'Raise Prices Recommendations', desc: 'AI analyzes your repair pricing vs market rates and tells you exactly where you can charge more without losing customers.' },
  { icon: '📦', title: 'Inventory Reorder Alerts', desc: 'Never run out of fast-moving stock. Get automated alerts before you hit zero, with suggested reorder quantities.' },
  { icon: '👥', title: 'Employee Insights', desc: 'See revenue per employee, conversion rates, and upsell performance. Know who is driving profit and who needs coaching.' },
  { icon: '💰', title: 'Profit Tracking', desc: 'Real-time margin tracking across every service, product, and store. Know your actual profit, not just revenue.' },
  { icon: '🏪', title: 'Multi-Store Intelligence', desc: 'Compare performance across all your locations. Spot which store is underperforming and why, instantly.' },
];

const WhatWirelessCEODoes = ({ onStartAudit }) => (
  <section className="py-20" style={{ background: '#f8fafc' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>Capabilities</p>
        <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: '#0d1117' }}>What WirelessCEO Does For Your Store</h2>
        <p className="text-gray-500 max-w-xl mx-auto">One AI system that replaces guesswork with data-driven decisions across every part of your business.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {FEATURES.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-base mb-2" style={{ color: '#0d1117' }}>{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={onStartAudit}
          className="px-8 py-4 font-bold rounded-xl text-white text-base hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
          Get Your Free Store Profit Audit
        </button>
      </div>
    </div>
  </section>
);

export default WhatWirelessCEODoes;
