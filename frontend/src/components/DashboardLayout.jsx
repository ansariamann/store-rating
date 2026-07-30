import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UpdatePasswordModal from './UpdatePasswordModal';

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'var(--card-bg)',
        borderRight: '1px solid var(--border-color)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)' }}>Store Ratings</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.role}</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {user?.role === 'SYSTEM_ADMIN' && (
            <>
              <a href="/admin/dashboard" className="nav-link">Dashboard</a>
              <a href="/admin/users" className="nav-link">Users</a>
            </>
          )}
          {user?.role === 'STORE_OWNER' && (
            <a href="/store/dashboard" className="nav-link">Store Dashboard</a>
          )}
          {user?.role === 'NORMAL_USER' && (
            <a href="/user/stores" className="nav-link">Stores</a>
          )}
        </nav>

        <button onClick={() => setShowPasswordModal(true)} className="btn-primary" style={{ background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
          Update Password
        </button>
        <button onClick={handleLogout} className="btn-primary" style={{ background: 'var(--danger)' }}>
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </div>

      {showPasswordModal && <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}
