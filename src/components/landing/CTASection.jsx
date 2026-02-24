import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Start managing your store smarter today</h2>
        <p>Join store owners who've ditched spreadsheets for good.</p>
        <div className="cta-buttons">
          <button className="btn-primary btn-lg" onClick={() => navigate('/inventory/signup')}>
            Create Free Account
          </button>
          <button className="btn-secondary btn-lg" onClick={() => navigate('/inventory/login')}>
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
