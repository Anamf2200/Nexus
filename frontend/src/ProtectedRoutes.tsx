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

  if (!token) return <Navigate to={redirectPath} replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
