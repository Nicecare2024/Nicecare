import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, CreditCard, Users, UserCheck } from 'lucide-react';

export default function CounterOneSection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-32">
      <div className="max-w-[700px] mx-auto">
        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-2 border-blue-500/20 rounded-3xl py-10 px-6 sm:py-12 sm:px-8 lg:py-16 lg:px-12 text-center transition-all duration-400 shadow-xl shadow-blue-500/10 hover:-translate-y-2.5 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20">
          <div className="w-[70px] sm:w-20 lg:w-[100px] h-[70px] sm:h-20 lg:h-[100px] rounded-3xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center mx-auto mb-6 lg:mb-8 text-white shadow-xl shadow-blue-500/40 transition-all duration-400">
            <ShoppingBag size={48} />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black text-slate-900 dark:text-gray-50 mb-2 tracking-tight">
            CounterOne
          </h2>
          <p className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent mb-8">
            Inventory, POS & CRM
          </p>
          
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-gray-400 leading-relaxed mb-10 max-w-[550px] mx-auto">
            The all-in-one solution for modern retail businesses. Manage inventory, 
            process sales, and build customer relationships from a single platform.
          </p>
          
          <ul className="list-none p-0 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 max-w-[500px] mx-auto">
            <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-gray-50 py-2.5 px-3 sm:py-3 sm:px-4 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 hover:translate-x-1">
              <Store size={20} className="text-blue-500 shrink-0" />
              <span>Store Management</span>
            </li>
            <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-gray-50 py-2.5 px-3 sm:py-3 sm:px-4 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 hover:translate-x-1">
              <CreditCard size={20} className="text-blue-500 shrink-0" />
              <span>POS & Sales</span>
            </li>
            <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-gray-50 py-2.5 px-3 sm:py-3 sm:px-4 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 hover:translate-x-1">
              <Users size={20} className="text-blue-500 shrink-0" />
              <span>Customer CRM</span>
            </li>
            <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-gray-50 py-2.5 px-3 sm:py-3 sm:px-4 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 hover:translate-x-1">
              <UserCheck size={20} className="text-blue-500 shrink-0" />
              <span>Employee Roles</span>
            </li>
          </ul>
          
          <button 
            className="mt-4 inline-flex items-center gap-2.5 py-5 px-8 sm:px-12 bg-gradient-to-br from-blue-500 to-sky-500 text-white font-bold text-base sm:text-lg border-none rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/35 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/45 min-h-[50px]"
            onClick={() => navigate('/inventory/signup')}
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
