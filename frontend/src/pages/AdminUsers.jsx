import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/admin/users', {
        params: { search, role: roleFilter, sortField, sortOrder }
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/admin/users', formData);
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>User & Store Management</h1>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New'}
          </button>
        </div>

        {showAddForm && (
          <form className="glass-card" onSubmit={handleAddSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="form-input" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input className="form-input" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input className="form-input" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <input className="form-input" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <select className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store / Store Owner</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>
              <button className="btn-primary" type="submit">Create</button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input className="form-input" placeholder="Search by name, email or address" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-input" style={{ width: '200px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="NORMAL_USER">Normal Users</option>
            <option value="STORE_OWNER">Stores</option>
            <option value="SYSTEM_ADMIN">Admins</option>
          </select>
        </div>

        <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('email')}>Email {sortField === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ padding: '1rem' }}>Address</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{u.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>{u.address}</td>
                  <td style={{ padding: '1rem' }}><span style={{ background: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{u.role}</span></td>
                  <td style={{ padding: '1rem', color: '#eab308' }}>{u.rating || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
