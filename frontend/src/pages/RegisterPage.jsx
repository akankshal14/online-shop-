import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
  if (form.address.length > 400) errs.address = 'Address max 400 characters';
  if (form.password.length < 8 || form.password.length > 16) errs.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include one uppercase letter';
  else if (!/[^A-Za-z0-9]/.test(form.password)) errs.password = 'Must include one special character';
  return errs;
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/stores');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped = {};
        apiErrors.forEach(e => { mapped[e.path] = e.msg; });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-left-logo">Rate<span>Hub</span></div>
          <div className="auth-left-tagline">Join the Community of Store Reviewers</div>
          <div className="auth-left-sub">
            Create your free account and start discovering and rating stores in your area today.
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['✦ Free to Join', '✦ Rate Any Store', '✦ Help Your Community'].map(t => (
              <div key={t} style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-logo">Rate<span style={{ color: 'var(--accent)' }}>Hub</span></div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Min 20 characters required' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { name: 'address', label: 'Address', type: 'text', placeholder: 'Your address (optional)' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '8–16 chars, uppercase + special char' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" name={f.name} type={f.type}
                  value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
                {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
              </div>
            ))}
            <button className="btn btn-primary w-full" style={{ marginTop: '0.5rem', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
