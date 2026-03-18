import React from 'react';

const benefits = [
  { emoji: '💰', title: 'See Real Profit', accent: '#00d4aa', bg: 'rgba(0,212,170,0.05)', border: 'rgba(0,212,170,0.2)', features: ['Track daily revenue and daily profit', 'COGS tracking', 'Warranty margin', 'Unlock margin', 'Trade-in profit visibility'] },
  { emoji: '📈', title: 'Make More Per Customer', accent: '#0ea5e9', bg: 'rgba(14,165,233,0.05)', border: 'rgba(14,165,233,0.2)', features: ['Warranty upsells', 'Loyalty rewards', 'Trade-in offers', 'Unlock margins', 'SMS follow-ups'] },
  { emoji: '📦', title: 'Inventory Control', accent: '#f59e0b', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.2)', features: ['Monthly average sold', '30 / 60 / 90 day views', 'Suggested reorder quantities', 'Aging inventory alerts'] },
  { emoji: '⭐', title: 'Reputation Protection', accent: '#ea580c', bg: 'rgba(234,88,12,0.05)', border: 'rgba(234,88,12,0.2)', features: ['4–5 star customers redirected to Google', '1–3 star customers captured privately'] },
  { emoji: '👥', title: 'Staff Accountability', accent: '#10b981', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)', features: ['Revenue per employee', 'Warranty attach rate', 'Repair completion time', 'Rework tracking'] },
];

const WirelessBenefitsSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-2 px-4 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
            style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: '#00a88a' }}>
            Transform Your Business
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0d1117' }}>
            Stop Guessing.{' '}
            <span style={{ background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Start Knowing.
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#64748b' }}>
            Get the insights you need to maximize every opportunity in your store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group rounded-3xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: b.bg, border: `2px solid ${b.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{ background: b.accent }}>
                {b.emoji}
              </div>
              <h3 className="text-xl font-extrabold mb-4" style={{ color: '#0d1117' }}>{b.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {b.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: b.accent }}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium leading-relaxed" style={{ color: '#374151' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WirelessBenefitsSection;
