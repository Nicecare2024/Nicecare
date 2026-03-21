const WirelessFooter = ({ onStartAudit, onJoinWaitlist }) => (
  <footer style={{ background: '#080c10', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="font-black text-white text-lg">WirelessPOS</span>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            The AI operating system for wireless and repair stores. Built by operators, for operators.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00d4aa' }}></span>
            <span className="text-xs font-medium" style={{ color: '#00d4aa' }}>Early Access Open</span>
          </div>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Product</p>
          <div className="flex flex-col gap-2">
            {['WirelessCEO AI','Inventory Management','Repair Tracking','Employee Insights','Multi-Store Dashboard'].map(item=>(
              <span key={item} className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Get Started</p>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Take the free 2-minute store profit audit and see exactly where you're losing money.
          </p>
          <button onClick={onStartAudit}
            className="w-full py-3 font-bold rounded-xl text-white text-sm hover:opacity-90 transition-all mb-3"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)' }}>
            Get Free Store Audit
          </button>
          <button onClick={onJoinWaitlist}
            className="w-full py-3 font-semibold rounded-xl text-sm transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
            Join Waitlist
          </button>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © 2025 WirelessPOS · WirelessCEO. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Built for wireless &amp; repair operators across the USA
        </p>
      </div>
    </div>
  </footer>
);

export default WirelessFooter;
