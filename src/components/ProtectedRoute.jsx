import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/crm/login" replace />;
  }

  if (!currentUser.emailVerified) {
    return <Navigate to="/crm/verify-email" replace />;
  }

  return children;
}
