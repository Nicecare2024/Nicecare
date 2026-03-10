import { useNavigate } from 'react-router-dom';

export default function GetStartedSection() {
  const navigate = useNavigate();

  const platformOption = {
    title: 'CounterOne',
    subtitle: 'Inventory, POS & CRM',
    description: 'One platform for stores, employees, products, point-of-sale, and customer relationship management. Create your master account and get started.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    features: ['Store Management', 'POS & Sales', 'Customer CRM', 'Employee Roles'],
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accentColor: '#6366f1',
    signupPath: '/inventory/signup',
  };

  return (
    <section id="get-started" className="py-20 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-center md:text-left items-start max-w-[1100px] mx-auto mb-10 md:mb-16">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="inline-block px-5 py-2.5 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 rounded-full text-sm md:text-base text-indigo-500 font-bold uppercase tracking-wider w-fit">
            Get Started
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-gray-50 tracking-tight">
            Ready to Transform Your Business?
          </h2>
        </div>
        <div className="flex items-start pt-0 md:pt-2">
          <p className="text-base md:text-xl text-slate-600 dark:text-gray-400 leading-relaxed mx-auto md:mx-0">
            Create your master account to manage stores, employees, products, POS, and CRM in one place.
          </p>
        </div>
      </div>
      <div className="max-w-[700px] mx-auto">
        <div
          className="group relative bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-400 hover:-translate-y-4 hover:scale-[1.02] hover:border-indigo-500/50 hover:shadow-2xl overflow-hidden"
          onClick={() => navigate(platformOption.signupPath)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(platformOption.signupPath)}
        >
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 group-hover:opacity-15 transition-opacity duration-400 blur-[100px]" style={{ background: platformOption.gradient }}></div>
          <div
            className="w-16 h-16 md:w-[90px] md:h-[90px] rounded-2xl flex items-center justify-center text-white mb-8 transition-all duration-400 shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:-rotate-[5deg] group-hover:shadow-xl group-hover:shadow-indigo-500/40"
            style={{ background: platformOption.gradient }}
          >
            {platformOption.icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-gray-50 mb-2">{platformOption.title}</h2>
          <p className="text-base md:text-lg font-bold mb-6" style={{ color: platformOption.accentColor }}>{platformOption.subtitle}</p>
          <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8 text-sm md:text-base">{platformOption.description}</p>
          <ul className="list-none p-0 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {platformOption.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-sm md:text-base text-slate-600 dark:text-gray-400 font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={platformOption.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center gap-2.5 py-4 md:py-5 px-6 md:px-8 rounded-xl text-white font-bold text-sm md:text-base transition-all duration-300 shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/40" style={{ background: platformOption.gradient }}>
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
