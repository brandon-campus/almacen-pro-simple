import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useGlobalContext();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};
