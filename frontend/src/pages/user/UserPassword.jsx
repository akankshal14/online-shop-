import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function UserPassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Required';
    if (form.newPassword.length < 8 || form.newPassword.length > 16) errs.newPassword = 'Must be 8–16 characters';
    else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must include one uppercase letter';
    else if (!/[^A-Za-z0-9]/.test(form.newPassword)) errs.newPassword = 'Must include one special character';
    if (form.newPassword !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="page-header"><h1 className="page-title">Change Password</h1></div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {[
            { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
            { name: 'newPassword', label: 'New Password', placeholder: '8–16 chars, uppercase + special char' },
            { name: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
          ].map(f => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" name={f.name} type="password"
                value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
              {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
            </div>
          ))}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}
