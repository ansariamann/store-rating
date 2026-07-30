import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const RatingStars = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star}
          onClick={() => onChange(star)}
          style={{ 
            cursor: 'pointer', 
            fontSize: '1.5rem',
            color: star <= value ? '#eab308' : 'var(--border-color)',
            transition: 'color 0.2s'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5001/store', {
        params: { search, sortField, sortOrder }
      });
      setStores(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRate = async (storeId, score) => {
    try {
      await axios.post(`http://localhost:5001/store/${storeId}/ratings`, { score });
      fetchStores();
    } catch (error) {
      alert('Error submitting rating');
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <h1 style={{ marginBottom: '2rem' }}>Stores Directory</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            className="form-input" 
            placeholder="Search stores by name or address..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('name')}>Store Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('address')}>Address {sortField === 'address' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ padding: '1rem' }}>Overall Rating</th>
                <th style={{ padding: '1rem' }}>Your Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No stores found.</td></tr>
              ) : (
                stores.map(store => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{store.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{store.address}</td>
                    <td style={{ padding: '1rem', color: '#eab308' }}>{store.overallRating} ⭐</td>
                    <td style={{ padding: '1rem' }}>
                      <RatingStars 
                        value={store.userRating || 0} 
                        onChange={(score) => handleRate(store.id, score)}
                      />
                    </td>
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
