const testimonials = [
  {
    quote: "CounterOne transformed how we manage our mobile repair shop. Customer tracking is seamless and the POS system is lightning fast!",
    author: "Rahul Sharma",
    role: "Owner, TechFix Solutions"
  },
  {
    quote: "Managing 3 stores was a nightmare before. Now I can see everything from one dashboard. The inventory alerts saved us thousands!",
    author: "Priya Patel",
    role: "Manager, RetailMart Electronics"
  },
  {
    quote: "Finally, a platform that understands small business needs. My employees love how simple the POS is to use.",
    author: "Amit Kumar",
    role: "Founder, ServicePro Mobile"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="text-center mb-10 md:mb-16">
        <span className="inline-block px-5 py-2.5 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 rounded-full text-sm text-indigo-500 font-bold uppercase tracking-wider mb-6">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-gray-50 tracking-tight mb-6">
          Loved by Business Owners
        </h2>
        <p className="text-base md:text-xl text-slate-600 dark:text-gray-400 max-w-[650px] mx-auto leading-relaxed">
          See what our customers have to say about their experience with CounterOne.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto px-[5%] lg:px-0">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="text-indigo-500/30 dark:text-indigo-400/30 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-6 text-sm md:text-base">{testimonial.quote}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {testimonial.author.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 dark:text-gray-50 font-semibold text-sm">{testimonial.author}</span>
                <span className="text-slate-400 dark:text-gray-500 text-xs md:text-sm">{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
