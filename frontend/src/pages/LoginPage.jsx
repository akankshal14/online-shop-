import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-left-logo">Rate<span>Hub</span></div>
          <div className="auth-left-tagline">Discover & Rate the Best Stores Near You</div>
          <div className="auth-left-sub">
            Join thousands of users sharing honest reviews. Help others find the best stores in town.
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['✦ Verified Store Listings', '✦ Real Customer Ratings', '✦ Easy 1–5 Star Reviews'].map(t => (
              <div key={t} style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-logo">Rate<span style={{ color: 'var(--accent)' }}>Hub</span></div>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-sub">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Enter your password" required />
            </div>
            {error && <p className="form-error mt-1" style={{ marginBottom: '0.75rem' }}>{error}</p>}
            <button className="btn btn-primary w-full" style={{ marginTop: '0.5rem', padding: '0.85rem', fontSize: '0.8rem' }} disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            New to RateHub? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create Account</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f7f7', border: '1px solid #e8e8e8', fontSize: '0.78rem' }}>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Demo Credentials</div>
            <div style={{ color: 'var(--text-muted)' }}>admin@storerating.com / Admin@1234</div>
          </div>
        </div>
      </div>
    </div>
  );
}
