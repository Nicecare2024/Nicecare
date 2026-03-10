const businesses = [
  {
    title: 'Repair Shops',
    description: 'Perfect for mobile repair, electronics repair, and service businesses.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    color: '#3b82f6'
  },
  {
    title: 'Retail Stores',
    description: 'Ideal for mobile stores, electronics shops, and specialty retail businesses.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    color: '#6366f1'
  },
  {
    title: 'Multi-Location Businesses',
    description: 'Manage multiple stores, franchises, or locations from one central dashboard.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3"/>
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
      </svg>
    ),
    color: '#8b5cf6'
  }
];

export default function WhoIsThisFor() {
  return (
    <section className="py-12 md:py-32 bg-white dark:bg-gray-900 -mx-[5%] px-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-center md:text-left items-start max-w-[1100px] mx-auto mb-10 md:mb-16">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="inline-block px-5 py-2.5 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 rounded-full text-xs sm:text-sm text-indigo-500 font-bold uppercase tracking-widest w-fit">
            Who Is This For
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[3rem] font-black text-slate-900 dark:text-gray-50 tracking-tight leading-tight">
            Built for Your Kind of Business
          </h2>
        </div>
        <div className="flex items-start md:pt-2">
          <p className="text-base lg:text-xl text-slate-600 dark:text-gray-400 leading-relaxed mx-auto md:mx-0">
            Whether you run a single shop or multiple locations, CounterOne adapts to your needs.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-[1100px] mx-auto">
        {businesses.map((business, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-[#0a0f1a] border border-slate-200 dark:border-gray-700 rounded-2xl p-7 sm:p-8 lg:p-10 text-center transition-all duration-400 hover:-translate-y-2.5 hover:shadow-2xl hover:border-blue-500/30"
          >
            <div
              className="w-16 sm:w-[70px] lg:w-20 h-16 sm:h-[70px] lg:h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-6 lg:mb-8 transition-all duration-300"
              style={{ color: business.color }}
            >
              {business.icon}
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-gray-50 mb-4">
              {business.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
              {business.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
