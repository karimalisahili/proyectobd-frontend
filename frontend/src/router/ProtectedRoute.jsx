import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {

    const { user } = useAuth();

  if (!user) {
    // Usuario no autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;