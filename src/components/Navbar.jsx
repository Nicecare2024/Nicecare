import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  }

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-icon">🛠️</span>
        <span>Remote Shop Support</span>
      </div>
      <div className="navbar-right">
        <span className="user-email">{currentUser?.email}</span>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="btn-outline logout-btn" onClick={handleLogout}>
          <span>↪</span> Logout
        </button>
      </div>
    </header>
  );
}
