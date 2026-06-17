import React, { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [ratingStore, setRatingStore] = useState(null);
  const [pendingRating, setPendingRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/stores', { params }).then(r => setStores(r.data)).catch(() => toast.error('Failed to load stores'));
  };

  useEffect(() => { fetchStores(); }, []);

  const openRating = (store) => { setRatingStore(store); setPendingRating(store.user_rating || 0); };

  const submitRating = async () => {
    if (!pendingRating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await api.post(`/stores/${ratingStore.id}/rating`, { rating: pendingRating });
      toast.success('Rating submitted!');
      setRatingStore(null);
      fetchStores();
    } catch { toast.error('Failed to submit rating'); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse Stores <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({stores.length})</span></h1>
      </div>

      <div className="search-bar">
        <input className="form-input" placeholder="Search by store name…"
          value={filters.name} onChange={e => setFilters(p => ({ ...p, name: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && fetchStores()} />
        <input className="form-input" placeholder="Search by address…"
          value={filters.address} onChange={e => setFilters(p => ({ ...p, address: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && fetchStores()} />
        <button className="btn btn-dark" onClick={fetchStores}><Search size={13} /> Search</button>
      </div>

      {stores.length === 0 ? (
        <div className="empty-state">No stores found</div>
      ) : (
        <div className="store-card-grid">
          {stores.map(store => (
            <div className="store-card" key={store.id}>
              <div className="store-card-name">{store.name}</div>
              <div className="store-card-address">
                <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                {store.address || 'No address listed'}
              </div>
              <div className="store-card-rating">
                <span className="store-card-avg">{parseFloat(store.avg_rating).toFixed(1)}</span>
                <div>
                  <StarRating value={Math.round(store.avg_rating)} readonly size="0.85rem" />
                  <div className="store-card-count">{store.total_ratings} review{store.total_ratings !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="store-card-your-rating">
                {store.user_rating ? (
                  <span>Your Rating: <StarRating value={store.user_rating} readonly size="0.9rem" /></span>
                ) : (
                  <span>Not yet rated</span>
                )}
              </div>
              <button className="btn btn-primary w-full" style={{ marginTop: '1rem', justifyContent: 'center' }}
                onClick={() => openRating(store)}>
                {store.user_rating ? 'Update Rating' : 'Rate This Store'}
              </button>
            </div>
          ))}
        </div>
      )}

      {ratingStore && (
        <div className="modal-overlay" onClick={() => setRatingStore(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{ratingStore.name}</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>{ratingStore.address}</p>
            <div style={{ textAlign: 'center', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <StarRating value={pendingRating} onChange={setPendingRating} size="2.2rem" />
              <p className="text-muted text-sm" style={{ marginTop: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {pendingRating ? `${pendingRating} out of 5 stars` : 'Tap a star to rate'}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRatingStore(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitRating} disabled={submitting || !pendingRating}>
                {submitting ? 'Submitting…' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
