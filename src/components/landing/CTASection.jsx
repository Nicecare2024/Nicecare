import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-32">
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-3xl py-10 px-6 sm:py-16 sm:px-8 lg:py-20 lg:px-12 text-center max-w-[900px] mx-auto relative overflow-hidden shadow-xl shadow-blue-500/15">
        <h2 className="text-2xl sm:text-3xl lg:text-[3rem] font-black text-slate-900 dark:text-gray-50 mb-6 relative tracking-tight leading-tight">
          Start managing your store smarter today
        </h2>
        <p className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-gray-400 mb-8 sm:mb-10 relative leading-relaxed">
          Join store owners who've ditched spreadsheets for good.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 relative">
          <button
            className="inline-flex items-center justify-center gap-2.5 py-4 px-6 sm:py-5 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-500 to-sky-500 text-white font-bold text-sm sm:text-base lg:text-lg border-none rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/35 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/45 min-h-[50px] w-full sm:w-auto"
            onClick={() => navigate('/inventory/signup')}
          >
            Create Free Account
          </button>
          <button
            className="inline-flex items-center justify-center gap-2.5 py-4 px-6 sm:py-5 sm:px-8 lg:px-12 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-50 font-bold text-sm sm:text-base lg:text-lg border-2 border-slate-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-300 min-h-[50px] hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto"
            onClick={() => navigate('/inventory/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
