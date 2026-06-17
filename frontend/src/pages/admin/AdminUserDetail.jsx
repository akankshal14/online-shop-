import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(r => setUser(r.data)).catch(() => toast.error('Failed to load user'));
  }, [id]);

  if (!user) return <div className="text-muted">Loading…</div>;

  const roleBadge = user.role === 'admin' ? 'admin' : user.role === 'store_owner' ? 'owner' : 'user';

  return (
    <div style={{ maxWidth: 540 }}>
      <div className="page-header">
        <h1 className="page-title">User Detail</h1>
        <Link to="/admin/users" className="btn btn-ghost btn-sm"><ArrowLeft size={13} /> Back</Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 56, height: 56, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</div>
            <span className={`badge badge-${roleBadge}`} style={{ marginTop: 4, display: 'inline-block' }}>
              {user.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <div className="form-label">Email Address</div>
            <div style={{ marginTop: 4 }}>{user.email}</div>
          </div>
          <div>
            <div className="form-label">Address</div>
            <div style={{ marginTop: 4 }}>{user.address || '—'}</div>
          </div>
          {user.role === 'store_owner' && user.avg_rating != null && (
            <div>
              <div className="form-label">Store Rating</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <StarRating value={Math.round(user.avg_rating)} readonly />
                <span style={{ fontWeight: 700 }}>{parseFloat(user.avg_rating).toFixed(1)}</span>
                {user.store_name && <span className="text-muted text-sm">· {user.store_name}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
