const AuditHeroSection = ({ onStartAudit }) => {
  return (
    <section className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1f2d 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(0,212,170,0.08)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(14,165,233,0.07)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Text */}
          <div>
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold mb-6 border"
              style={{ background: 'rgba(0,212,170,0.1)', borderColor: 'rgba(0,212,170,0.3)', color: '#00d4aa' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00d4aa' }} />
              WirelessPOS + WirelessCEO
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
              Run Your Wireless Store
              <br />
              <span style={{ background: 'linear-gradient(90deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                on Autopilot
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              All your sales, repairs, inventory, activations, and customer data — unified into one system that tells you what to do next and does it for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartAudit}
                className="group w-full sm:w-auto px-7 py-4 font-bold rounded-xl text-white text-base flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', boxShadow: '0 8px 30px rgba(0,212,170,0.3)' }}
              >
                👉 Get Your Free Store Profit Audit
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={onStartAudit}
                className="w-full sm:w-auto px-7 py-4 font-bold rounded-xl border-2 text-white text-base transition-all duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,170,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                👉 Join Early Access
              </button>
            </div>
          </div>

          {/* RIGHT — Diagram */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <img
                src="/images/system-diagram.jpeg"
                alt="WirelessPOS + WirelessCEO system diagram"
                className="w-full h-auto"
                onError={(e) => {
                  // Fallback diagram if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback diagram */}
              <div className="hidden p-6 flex-col gap-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['Carrier Activations', 'Bill Payments', 'Unlock APIs', 'Supplier Feeds', 'Online Orders', 'Customer CRM'].map(item => (
                    <div key={item} className="text-center py-2 px-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#7dd3fc' }}>{item}</div>
                  ))}
                </div>
                <div className="rounded-xl p-4 border" style={{ background: 'rgba(0,212,170,0.06)', borderColor: 'rgba(0,212,170,0.3)' }}>
                  <p className="text-xs font-bold text-center mb-3" style={{ color: '#00d4aa' }}>WirelessPOS Operating System</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['Sales', 'Repairs', 'Inventory', 'Activations', 'Unlocks', 'Bill Pay', 'Customers', 'Employees'].map(item => (
                      <div key={item} className="text-center py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>{item}</div>
                    ))}
                  </div>
                </div>
                <div className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>↓ WirelessCEO AI Operator ↓</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(14,165,233,0.06)', borderColor: 'rgba(14,165,233,0.2)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#0ea5e9' }}>Owner Command Center</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Pricing · Employees · Profit</p>
                  </div>
                  <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#f59e0b' }}>Automated Actions</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Reorders · Alerts · Recs</p>
                  </div>
                </div>
                <p className="text-center text-xs italic" style={{ color: 'rgba(255,255,255,0.35)' }}>From every transaction to automated decisions — in one system.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 sm:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
};

export default AuditHeroSection;
