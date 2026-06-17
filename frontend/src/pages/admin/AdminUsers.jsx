import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const navigate = useNavigate();

  const fetchUsers = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/admin/users', { params }).then(r => setUsers(r.data)).catch(() => toast.error('Failed to load users'));
  };

  useEffect(() => { fetchUsers(); }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true, render: v => v || '—' },
    { key: 'role', label: 'Role', sortable: true, render: v => (
      <span className={`badge badge-${v === 'admin' ? 'admin' : v === 'store_owner' ? 'owner' : 'user'}`}>
        {v?.replace('_', ' ')}
      </span>
    )},
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({users.length})</span></h1>
        <Link to="/admin/users/new" className="btn btn-primary btn-sm"><Plus size={13} /> Add User</Link>
      </div>

      <div className="search-bar">
        {[['name','Name'], ['email','Email'], ['address','Address']].map(([key, ph]) => (
          <input key={key} className="form-input" placeholder={`Filter by ${ph}…`}
            value={filters[key]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()} />
        ))}
        <select className="form-select" style={{ flex: '0 0 150px' }}
          value={filters.role} onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button className="btn btn-dark" onClick={fetchUsers}><Search size={13} /> Search</button>
      </div>

      <SortableTable columns={columns} data={users}
        onRowClick={row => navigate(`/admin/users/${row.id}`)}
        emptyMessage="No users found" />
    </div>
  );
}
