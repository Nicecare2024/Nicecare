const leakPoints = [
  'Discount abuse by employees',
  'Aging inventory sitting unsold',
  'Slow technicians hurting throughput',
  'Missed accessory attach opportunities',
  'Incorrect pricing on repairs',
];

const ticketPoints = [
  'Warranty upsells at point of sale',
  'Accessory bundles with every device',
  'Trade-in offers during checkout',
  'SMS follow-ups for repeat business',
  'Loyalty rewards to drive return visits',
];

const TwoWaysProfitSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24" style={{ background: '#0d1117' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-2 px-4 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
            style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
            Store Profit
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Two Ways WirelessPOS Increases Store Profit
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            WirelessPOS and WirelessCEO work together to improve store performance in two ways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Column 1 */}
          <div className="rounded-2xl p-7 md:p-8" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Detect Profit Leaks</h3>
            </div>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              WirelessCEO analyzes store data to find hidden issues hurting your margins.
            </p>
            <ul className="flex flex-col gap-3">
              {leakPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div className="rounded-2xl p-7 md:p-8" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,170,0.15)' }}>
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Increase Ticket Size</h3>
            </div>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              WirelessPOS helps employees capture more revenue during every sale.
            </p>
            <ul className="flex flex-col gap-3">
              {ticketPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Fix what is leaking.{' '}
            <span style={{ color: '#00d4aa' }}>Increase what is selling.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysProfitSection;
