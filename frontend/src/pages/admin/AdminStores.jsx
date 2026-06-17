import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  const fetchStores = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/admin/stores', { params }).then(r => setStores(r.data)).catch(() => toast.error('Failed to load stores'));
  };

  useEffect(() => { fetchStores(); }, []);

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true, render: v => v || '—' },
    { key: 'owner_name', label: 'Owner', sortable: true, render: v => v || '—' },
    { key: 'avg_rating', label: 'Rating', sortable: true, render: (v, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StarRating value={Math.round(v)} readonly size="0.95rem" />
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{parseFloat(v).toFixed(1)}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({row.total_ratings})</span>
      </span>
    )},
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stores <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({stores.length})</span></h1>
        <Link to="/admin/stores/new" className="btn btn-primary btn-sm"><Plus size={13} /> Add Store</Link>
      </div>

      <div className="search-bar">
        {[['name','Name'], ['email','Email'], ['address','Address']].map(([key, ph]) => (
          <input key={key} className="form-input" placeholder={`Filter by ${ph}…`}
            value={filters[key]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && fetchStores()} />
        ))}
        <button className="btn btn-dark" onClick={fetchStores}><Search size={13} /> Search</button>
      </div>

      <SortableTable columns={columns} data={stores} emptyMessage="No stores found" />
    </div>
  );
}
