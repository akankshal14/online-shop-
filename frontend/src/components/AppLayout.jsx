import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, LogOut, Star, Lock, BarChart3 } from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/stores', label: 'Stores', icon: Store },
];
const userLinks = [
  { to: '/stores', label: 'Browse Stores', icon: Star },
  { to: '/password', label: 'Change Password', icon: Lock },
];
const ownerLinks = [
  { to: '/owner/dashboard', label: 'My Store', icon: BarChart3 },
  { to: '/owner/password', label: 'Change Password', icon: Lock },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'store_owner' ? ownerLinks : userLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel = user?.role === 'admin' ? 'Administrator'
    : user?.role === 'store_owner' ? 'Store Owner' : 'Member';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Rate<span>Hub</span></div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ').slice(0, 2).join(' ')}
            </div>
            <div style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{roleLabel}</div>
          </div>
          <button className="btn btn-ghost btn-sm w-full"
            style={{ borderColor: '#333', color: '#888', justifyContent: 'center' }}
            onClick={handleLogout}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
