const steps = [
  {
    number: '1',
    title: 'Sign Up',
    description: 'Create your master account in under 2 minutes.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
  {
    number: '2',
    title: 'Set Up',
    description: 'Add stores, products, and invite your team.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    number: '3',
    title: 'Start Selling',
    description: 'Process sales, track inventory, and grow.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  }
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-32 bg-gradient-to-br from-blue-500/[0.03] to-indigo-500/[0.03] -mx-[5%] px-[5%]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-center md:text-left items-start max-w-[1100px] mx-auto mb-10 md:mb-16">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="inline-block px-5 py-2.5 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 rounded-full text-xs sm:text-sm text-indigo-500 font-bold uppercase tracking-widest w-fit">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[3rem] font-black text-slate-900 dark:text-gray-50 tracking-tight leading-tight">
            Get Started in 3 Simple Steps
          </h2>
        </div>
        <div className="flex items-start md:pt-2">
          <p className="text-base lg:text-xl text-slate-600 dark:text-gray-400 leading-relaxed mx-auto md:mx-0">
            Set up your complete retail management system in under 10 minutes.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 max-w-[1100px] mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-2xl p-7 sm:p-8 lg:p-10 text-center relative transition-all duration-400 hover:-translate-y-2.5 hover:shadow-2xl hover:border-blue-500/30"
          >
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white flex items-center justify-center font-extrabold text-sm lg:text-lg shadow-lg shadow-blue-500/40">
              {step.number}
            </div>
            <div className="w-14 sm:w-[60px] lg:w-[70px] h-14 sm:h-[60px] lg:h-[70px] rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-6 lg:mb-8 text-blue-500 transition-all duration-300">
              {step.icon}
            </div>
            <h3 className="text-lg sm:text-xl lg:text-[1.4rem] font-extrabold text-slate-900 dark:text-gray-50 mb-4">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
