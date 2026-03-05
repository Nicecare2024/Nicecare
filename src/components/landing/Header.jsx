import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

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

  const scrollToSection = (sectionClass) => {
    closeNav();
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-100 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4 lg:gap-8 py-3.5 px-[3%] md:py-4 md:px-[4%] lg:py-5 lg:px-[5%] bg-white dark:bg-slate-900 backdrop-blur-[20px] border-b border-black/10 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 flex items-center justify-center transition-transform duration-300 hover:scale-105">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="12" stroke="#3b82f6" strokeWidth="8" fill="none"/>
          </svg>
        </div>
        <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-teal-500 dark:text-teal-400 tracking-tight">CounterOne</span>
      </div>
      <nav
        id="landing-nav"
        className={`${navOpen ? 'flex' : 'hidden'} lg:flex absolute lg:static top-[calc(100%+12px)] right-[5%] left-[5%] lg:inset-auto flex-col lg:flex-row gap-0 lg:gap-10 p-6 lg:p-0 bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent border border-slate-200 dark:border-gray-700 lg:border-none rounded-2xl lg:rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:shadow-none z-[999] lg:z-auto justify-center items-center`}
        aria-label="Primary"
      >
        <button
          className="text-slate-600 dark:text-gray-400 font-semibold text-base transition-all duration-300 relative py-4 lg:py-2 bg-transparent border-none cursor-pointer font-[inherit] hover:text-slate-900 dark:hover:text-gray-50 w-full lg:w-auto text-left lg:text-center px-2 lg:px-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-sky-500 after:transition-all after:duration-300 hover:after:w-full"
          onClick={() => scrollToSection('features-section')}
        >
          Features
        </button>
        <button
          className="text-slate-600 dark:text-gray-400 font-semibold text-base transition-all duration-300 relative py-4 lg:py-2 bg-transparent border-none cursor-pointer font-[inherit] hover:text-slate-900 dark:hover:text-gray-50 w-full lg:w-auto text-left lg:text-center px-2 lg:px-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-sky-500 after:transition-all after:duration-300 hover:after:w-full"
          onClick={() => scrollToSection('how-it-works-section')}
        >
          How It Works
        </button>
        <button
          className="text-slate-600 dark:text-gray-400 font-semibold text-base transition-all duration-300 relative py-4 lg:py-2 bg-transparent border-none cursor-pointer font-[inherit] hover:text-slate-900 dark:hover:text-gray-50 w-full lg:w-auto text-left lg:text-center px-2 lg:px-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-sky-500 after:transition-all after:duration-300 hover:after:w-full"
          onClick={() => navigate('/inventory/login')}
        >
          Sign In
        </button>
      </nav>
      <div className="flex items-center gap-4 md:gap-6 lg:gap-8 justify-self-end ml-auto">
        <button
          className="inline-flex lg:hidden w-9 h-9 md:w-10 md:h-10 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 items-center justify-center flex-col gap-[5px] cursor-pointer transition-all duration-300 shrink-0 mr-4 hover:border-blue-500 dark:hover:border-blue-400"
          type="button"
          aria-expanded={navOpen}
          aria-controls="landing-nav"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          <span className="w-4 md:w-[18px] h-0.5 rounded-full bg-current transition-all duration-300" aria-hidden="true"></span>
          <span className="w-4 md:w-[18px] h-0.5 rounded-full bg-current transition-all duration-300" aria-hidden="true"></span>
          <span className="w-4 md:w-[18px] h-0.5 rounded-full bg-current transition-all duration-300" aria-hidden="true"></span>
        </button>
        <button 
          className="w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 hover:bg-gradient-to-br hover:from-blue-500 hover:to-sky-500 hover:text-white hover:border-transparent hover:rotate-[15deg]"
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
