import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-0 lg:min-h-[calc(100vh-90px)] flex flex-col items-center justify-center text-center py-10 md:py-12 lg:py-20 gap-6 lg:gap-8 relative">
      <div className="inline-flex items-center gap-2 py-[0.45rem] px-3.5 sm:py-2 sm:px-4 md:py-2.5 md:px-5 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-500/30 rounded-full text-[0.7rem] sm:text-xs md:text-sm text-blue-500 font-semibold animate-fade-in-up shadow-[0_4px_15px_rgba(59,130,246,0.2)]">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-opacity shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
        Smarter Inventory | Stronger Customer Relationships.
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-[clamp(1.75rem,8vw,2.5rem)] lg:text-[clamp(2.5rem,6vw,4rem)] font-black leading-tight lg:leading-[1.15] max-w-[900px] text-slate-900 dark:text-gray-50 animate-fade-in-up-delay-1 tracking-tight">
        One Unified Platform for
        <span className="bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift"> Inventory and Customer Management</span>
      </h1>
      <p className="text-sm sm:text-base md:text-[clamp(1.1rem,2vw,1.25rem)] text-slate-600 dark:text-gray-400 max-w-[700px] leading-relaxed lg:leading-[1.8] animate-fade-in-up-delay-2">
        Streamline your operations with our powerful Inventory Management solutions and CRM. 
        Built for repair shops, retail stores, and service businesses of small to medium sizes.
      </p>
      <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center md:justify-center gap-3 md:gap-8 mt-4 animate-fade-in-up-delay-3 w-full md:w-auto">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-gray-400 text-sm md:text-base font-medium py-2 px-4 bg-white dark:bg-gray-900 rounded-full border border-slate-200 dark:border-gray-700 transition-all duration-300 w-full md:w-auto justify-start hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(59,130,246,0.2)] [&_svg]:text-blue-500 [&_svg]:shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Multi-Store Management</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-gray-400 text-sm md:text-base font-medium py-2 px-4 bg-white dark:bg-gray-900 rounded-full border border-slate-200 dark:border-gray-700 transition-all duration-300 w-full md:w-auto justify-start hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(59,130,246,0.2)] [&_svg]:text-blue-500 [&_svg]:shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Fast POS Checkout</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-gray-400 text-sm md:text-base font-medium py-2 px-4 bg-white dark:bg-gray-900 rounded-full border border-slate-200 dark:border-gray-700 transition-all duration-300 w-full md:w-auto justify-start hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(59,130,246,0.2)] [&_svg]:text-blue-500 [&_svg]:shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Real-Time Inventory</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-gray-400 text-sm md:text-base font-medium py-2 px-4 bg-white dark:bg-gray-900 rounded-full border border-slate-200 dark:border-gray-700 transition-all duration-300 w-full md:w-auto justify-start hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(59,130,246,0.2)] [&_svg]:text-blue-500 [&_svg]:shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>24/7 Support</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-[400px] md:max-w-none md:w-auto gap-3 md:gap-4 mt-6 animate-fade-in-up-delay-4">
        <button
          className="inline-flex items-center justify-center gap-2.5 py-4 px-7 md:py-[1.1rem] md:px-10 bg-gradient-to-br from-blue-500 to-sky-500 text-white font-bold text-[0.95rem] md:text-[1.05rem] border-none rounded-xl cursor-pointer transition-all duration-300 shadow-[0_8px_25px_rgba(59,130,246,0.35)] min-h-[50px] relative overflow-hidden w-full md:w-auto hover:-translate-y-[3px] hover:shadow-[0_12px_35px_rgba(59,130,246,0.45)] active:-translate-y-[1px]"
          onClick={() => navigate('/inventory/signup')}
        >
          Get Started Free
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button className="inline-flex items-center justify-center gap-2.5 py-4 px-7 md:py-[1.1rem] md:px-10 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 font-bold text-[0.95rem] md:text-[1.05rem] border-2 border-slate-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-300 min-h-[50px] w-full md:w-auto hover:border-blue-500 hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Watch Demo
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-gray-400 mt-2 animate-fade-in-up-delay-5">No credit card required • Free forever • Cancel anytime</p>
      
      <div className="w-full max-w-full md:max-w-[1200px] mt-8 md:mx-auto lg:mt-12 animate-fade-in-up-delay-6 relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl aspect-video bg-white dark:bg-gray-900 group">
        <img 
          src="/images/desktop dashboard .jpeg" 
          alt="CounterOne Dashboard - Desktop View" 
          className="absolute inset-0 w-full h-full object-contain rounded-xl md:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-gray-700 transition-all duration-500 opacity-100 z-[2] group-hover:opacity-0"
        />
        <img 
          src="/images/Mockup ai dashboard .jpeg" 
          alt="CounterOne Dashboard - Mobile View" 
          className="absolute inset-0 w-full h-full object-contain rounded-xl md:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-gray-700 transition-all duration-500 opacity-0 z-[1] group-hover:opacity-100"
        />
      </div>
    </section>
  );
}
