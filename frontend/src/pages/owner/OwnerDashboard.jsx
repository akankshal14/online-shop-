import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import SortableTable from '../../components/SortableTable';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/stores/owner/dashboard').then(r => setData(r.data)).catch(() => toast.error('Failed to load dashboard'));
  }, []);

  const columns = [
    { key: 'name', label: 'Customer', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: v => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StarRating value={v} readonly size="0.95rem" />
        <span style={{ fontWeight: 700 }}>{v}.0</span>
      </span>
    )},
    { key: 'updated_at', label: 'Date', sortable: true, render: v => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
  ];

  if (!data) return <div className="text-muted">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{data.store.name}</h1>
      </div>

      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-value">{data.store.avg_rating}</div>
          <div className="stat-label">Average Rating</div>
          <div style={{ marginTop: 8 }}><StarRating value={Math.round(parseFloat(data.store.avg_rating))} readonly /></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.raters.length}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.5rem' }}>{data.store.address || '—'}</div>
          <div className="stat-label">Location</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111' }}>
        Customer Reviews
      </h2>
      <SortableTable columns={columns} data={data.raters} emptyMessage="No reviews yet" />
    </div>
  );
}
