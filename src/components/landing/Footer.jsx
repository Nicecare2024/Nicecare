export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white py-12 px-[5%] border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr] gap-8 lg:gap-12 max-w-[1200px] mx-auto items-center text-center md:text-left">
        <div>
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <div className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="10" width="80" height="80" rx="12" stroke="#3b82f6" strokeWidth="8" fill="none"/>
              </svg>
            </div>
            <span className="text-2xl md:text-xl font-extrabold text-teal-500 tracking-tight">CounterOne</span>
          </div>
          <p className="text-white/70 text-base leading-relaxed max-w-[300px] mx-auto md:mx-0">
            Smarter Inventory. Stronger Relationships.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-center flex-wrap">
          <a href="#features" className="text-white/80 no-underline text-base font-medium transition-all duration-300 hover:text-blue-500 hover:-translate-y-0.5">Features</a>
          <a href="#how-it-works" className="text-white/80 no-underline text-base font-medium transition-all duration-300 hover:text-blue-500 hover:-translate-y-0.5">How It Works</a>
          <a href="/inventory/login" className="text-white/80 no-underline text-base font-medium transition-all duration-300 hover:text-blue-500 hover:-translate-y-0.5">Sign In</a>
          <a href="/inventory/signup" className="text-white/80 no-underline text-base font-medium transition-all duration-300 hover:text-blue-500 hover:-translate-y-0.5">Create Account</a>
        </div>

        <div className="text-center md:col-span-2 lg:col-span-1 lg:text-right">
          <p className="text-white/60 text-sm">© 2025 CounterOne. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
