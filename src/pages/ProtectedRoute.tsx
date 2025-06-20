import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactElement;
};

function ProtectedRoute({ children }: Props) {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
