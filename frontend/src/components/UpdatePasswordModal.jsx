import { useState } from 'react';
import axios from 'axios';

export default function UpdatePasswordModal({ onClose }) {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const pwRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    if (!pwRegex.test(formData.newPassword)) {
      return 'New password must be 8-16 characters long, contain at least one uppercase letter and one special character.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.put('http://localhost:5001/auth/password', formData);
      setSuccess('Password updated successfully');
      setFormData({ oldPassword: '', newPassword: '' });
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
      <div className="glass-card fade-in" style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1.5rem' }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Update Password</h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.oldPassword} 
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.newPassword} 
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
