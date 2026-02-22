import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = () => setNavOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="landing-header">
      <div className="landing-brand">
        <div className="brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="url(#brandGradient)"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="url(#brandGradient)"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke="url(#brandGradient)"/>
          </svg>
        </div>
        <span className="brand-text">CounterOne</span>
      </div>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={navOpen}
        aria-controls="landing-nav"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle navigation"
      >
        <span className="nav-toggle-bar" aria-hidden="true"></span>
        <span className="nav-toggle-bar" aria-hidden="true"></span>
        <span className="nav-toggle-bar" aria-hidden="true"></span>
      </button>
      <nav
        id="landing-nav"
        className={`landing-nav ${navOpen ? 'open' : ''}`}
        aria-label="Primary"
      >
        <a href="#features" className="nav-link" onClick={closeNav}>Features</a>
        <a href="#how-it-works" className="nav-link" onClick={closeNav}>How It Works</a>
      </nav>
      <div className="header-actions">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
