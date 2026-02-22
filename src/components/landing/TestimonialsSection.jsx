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
    <section id="testimonials" className="testimonials-section">
      <div className="section-header">
        <span className="section-badge">Testimonials</span>
        <h2 className="section-title">Loved by Business Owners</h2>
        <p className="section-subtitle">
          See what our customers have to say about their experience with CounterOne.
        </p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="quote-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <p className="testimonial-quote">{testimonial.quote}</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                {testimonial.author.charAt(0)}
              </div>
              <div className="author-info">
                <span className="author-name">{testimonial.author}</span>
                <span className="author-role">{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
