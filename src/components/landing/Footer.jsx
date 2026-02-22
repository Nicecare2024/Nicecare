export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="landing-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="url(#brandGradient3)"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="url(#brandGradient3)"/>
                <line x1="9" y1="21" x2="9" y2="9" stroke="url(#brandGradient3)"/>
                <defs>
                  <linearGradient id="brandGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-text">CounterOne</span>
          </div>
          <p className="footer-tagline">
            Smarter Inventory. Stronger Relationships.
          </p>
        </div>
        
        <div className="footer-middle">
          <a href="#features" className="footer-link">Features</a>
          <a href="#how-it-works" className="footer-link">How It Works</a>
          <a href="/inventory/login" className="footer-link">Sign In</a>
          <a href="/inventory/signup" className="footer-link">Create Account</a>
        </div>
        
        <div className="footer-right">
          <p className="footer-copyright">© 2025 CounterOne. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
