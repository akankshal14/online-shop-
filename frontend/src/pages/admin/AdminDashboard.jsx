import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Star, Plus, TrendingUp } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => toast.error('Failed to load stats'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/users/new" className="btn btn-dark btn-sm"><Plus size={13} /> Add User</Link>
          <Link to="/admin/stores/new" className="btn btn-primary btn-sm"><Plus size={13} /> Add Store</Link>
        </div>
      </div>

      <div className="grid-3">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: <Users size={32} />, },
          { label: 'Total Stores', value: stats?.totalStores, icon: <Store size={32} />, },
          { label: 'Total Ratings', value: stats?.totalRatings, icon: <Star size={32} />, },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value ?? '—'}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: '#111' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/admin/users" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <Users size={14} /> Manage Users
            </Link>
            <Link to="/admin/stores" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <Store size={14} /> Manage Stores
            </Link>
            <Link to="/admin/users/new" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <Plus size={14} /> Add New User
            </Link>
            <Link to="/admin/stores/new" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <Plus size={14} /> Add New Store
            </Link>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: '#111' }}>
            Platform Overview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Avg ratings per store', value: stats ? (stats.totalStores ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0') : '—' },
              { label: 'Active users', value: stats?.totalUsers ?? '—' },
              { label: 'Listed stores', value: stats?.totalStores ?? '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
