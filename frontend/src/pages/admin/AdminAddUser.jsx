import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
  if (form.address.length > 400) errs.address = 'Max 400 characters';
  if (form.password.length < 8 || form.password.length > 16) errs.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include one uppercase letter';
  else if (!/[^A-Za-z0-9]/.test(form.password)) errs.password = 'Must include one special character';
  if (!form.role) errs.role = 'Role is required';
  return errs;
};

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'normal_user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 580 }}>
      <div className="page-header">
        <h1 className="page-title">Add New User</h1>
        <Link to="/admin/users" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '0 1rem' }}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Min 20, max 60 characters', full: true },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '8–16 chars, uppercase + special' },
              { name: 'address', label: 'Address', type: 'text', placeholder: 'Max 400 characters', full: true },
            ].map(f => (
              <div className="form-group" key={f.name} style={f.full ? { gridColumn: '1/-1' } : {}}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" name={f.name} type={f.type}
                  value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
                {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="normal_user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Link to="/admin/users" className="btn btn-ghost">Cancel</Link>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
