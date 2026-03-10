const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Transactions' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' }
];

export default function StatsSection() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto py-12 md:py-16 px-[5%] lg:px-0">
      {stats.map((stat, index) => (
        <div key={index} className="text-center flex flex-col gap-2">
          <span className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 dark:text-blue-400">{stat.value}</span>
          <span className="text-slate-600 dark:text-gray-400 text-sm md:text-base font-medium">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
