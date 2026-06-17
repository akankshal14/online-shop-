import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Store name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
  if (form.address.length > 400) errs.address = 'Max 400 characters';
  return errs;
};

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(r => setOwners(r.data)).catch(() => {});
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, owner_id: form.owner_id || null });
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 580 }}>
      <div className="page-header">
        <h1 className="page-title">Add New Store</h1>
        <Link to="/admin/stores" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Store Name', type: 'text', placeholder: 'Min 20, max 60 characters' },
            { name: 'email', label: 'Store Email', type: 'email', placeholder: 'store@example.com' },
            { name: 'address', label: 'Address', type: 'text', placeholder: 'Max 400 characters' },
          ].map(f => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" name={f.name} type={f.type}
                value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
              {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Assign Owner <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <select className="form-select" name="owner_id" value={form.owner_id} onChange={handleChange}>
              <option value="">— No owner assigned —</option>
              {owners.map(u => <option key={u.id} value={u.id}>{u.name} · {u.email}</option>)}
            </select>
            <span className="text-sm text-muted" style={{ marginTop: 4 }}>
              Assigning a user will update their role to Store Owner
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Link to="/admin/stores" className="btn btn-ghost">Cancel</Link>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Store'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
