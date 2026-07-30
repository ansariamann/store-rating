import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

export default function StoreDashboard() {
  const [data, setData] = useState({ averageRating: '0', raters: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5001/store/dashboard');
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="fade-in">
        <h1 style={{ marginBottom: '2rem' }}>Store Dashboard</h1>
        
        <div className="glass-card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Average Store Rating</h3>
          <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#eab308' }}>
            {data.averageRating} <span style={{ fontSize: '2rem' }}>⭐</span>
          </p>
        </div>

        <h2>Recent Ratings Received</h2>
        <div className="glass-card" style={{ padding: 0, marginTop: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem' }}>User Name</th>
                <th style={{ padding: '1rem' }}>User Email</th>
                <th style={{ padding: '1rem' }}>Rating Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No ratings yet.</td>
                </tr>
              ) : (
                data.raters.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{r.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{r.email}</td>
                    <td style={{ padding: '1rem', color: '#eab308', fontWeight: 'bold' }}>{r.score} ⭐</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
