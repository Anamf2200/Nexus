import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from './store/store';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: JSX.Element;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['entrepreneur', 'investor'],
  children,
  redirectPath = '/login',
}) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      setUnauthorized(true);
      alert("You do not have permission to access this page!");
    }
  }, [user, allowedRoles]);

  if (!token) return <Navigate to={redirectPath} replace />;
  if (unauthorized) return <Navigate to="/login" replace />;

  return children;
};
