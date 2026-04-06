import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component for admin pages
 * Only allows ADMIN role to access
 */
export default function AdminProtectedRoute({ element: Element }) {
  const authContext = useContext(AuthContext);

  // Loading state
  if (!authContext || authContext.loading) {
    return <LoadingSpinner fullPage />;
  }

  // Not authenticated
  if (!authContext.user) {
    return <Navigate to="/login" replace />;
  }

  // Not admin
  if (authContext.user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Admin can access
  return Element;
}
