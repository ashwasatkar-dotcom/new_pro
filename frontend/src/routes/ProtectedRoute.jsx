import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If student tries to visit warden area, send to student dashboard; or vice versa
    if (user?.role === 'ROLE_STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/warden/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
