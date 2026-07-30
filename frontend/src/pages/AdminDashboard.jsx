import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5001/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="fade-in">
        <h1 style={{ marginBottom: '2rem' }}>System Overview</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Normal Users</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalUsers}</p>
          </div>
          
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Stores</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.totalStores}</p>
          </div>
          
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Ratings</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#eab308' }}>{stats.totalRatings}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
