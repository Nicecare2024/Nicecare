import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// WirelessPOS Landing Page
import WirelessPOSLanding from './pages/WirelessPOSLanding';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<WirelessPOSLanding />} />
        
        {/* WirelessPOS Landing Page */}
        <Route path="/wireless" element={<WirelessPOSLanding />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/demo-requests" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
