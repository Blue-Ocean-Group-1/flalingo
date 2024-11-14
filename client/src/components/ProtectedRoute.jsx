import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  // TODO: This can be uncommented to enable route protection
  // if (!isAuthenticated && !isLoading) {
  //   return <Navigate to="/" />;
  // }

  return children;
}
