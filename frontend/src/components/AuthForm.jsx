import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AuthForm({ type }) {
  const isLogin = type === 'login';
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');

  const validate = () => {
    if (!isLogin) {
      if (formData.name.length < 20 || formData.name.length > 60) {
        return 'Name must be between 20 and 60 characters.';
      }
      if (formData.address && formData.address.length > 400) {
        return 'Address must be at most 400 characters.';
      }
      const pwRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
      if (!pwRegex.test(formData.password)) {
        return 'Password must be 8-16 characters long, contain at least one uppercase letter and one special character.';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(`http://localhost:5001${endpoint}`, payload);
      login(res.data.user, res.data.token);
      
      const role = res.data.user.role;
      if (role === 'SYSTEM_ADMIN') navigate('/admin/dashboard');
      else if (role === 'STORE_OWNER') navigate('/store/dashboard');
      else navigate('/user/stores');
      
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '400px', width: '100%' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {isLogin ? 'Welcome Back' : 'Create an Account'}
      </h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-input" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-input" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            name="password" 
            className="form-input" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea 
              name="address" 
              className="form-input" 
              value={formData.address} 
              onChange={handleChange} 
              rows="3"
            />
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        {isLogin ? (
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        ) : (
          <p>Already have an account? <a href="/login">Log in</a></p>
        )}
      </div>
    </div>
  );
}
