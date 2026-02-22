const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Transactions' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' }
];

export default function StatsSection() {
  return (
    <section className="stats-section">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
