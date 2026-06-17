import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import UserStores from './pages/user/UserStores';
import UserPassword from './pages/user/UserPassword';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerPassword from './pages/owner/OwnerPassword';
import AppLayout from './components/AppLayout';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1d27', color: '#e8eaf6', border: '1px solid #2e3348' }
        }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminAddUser />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="stores/new" element={<AdminAddStore />} />
          </Route>

          {/* Normal User */}
          <Route path="/stores" element={<ProtectedRoute roles={['normal_user']}><AppLayout /></ProtectedRoute>}>
            <Route index element={<UserStores />} />
          </Route>
          <Route path="/password" element={<ProtectedRoute roles={['normal_user']}><AppLayout /></ProtectedRoute>}>
            <Route index element={<UserPassword />} />
          </Route>

          {/* Store Owner */}
          <Route path="/owner" element={<ProtectedRoute roles={['store_owner']}><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="password" element={<OwnerPassword />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
