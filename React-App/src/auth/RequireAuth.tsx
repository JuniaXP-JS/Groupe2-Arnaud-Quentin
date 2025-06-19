import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '..//contexts/session';

/**
 * RequireAuth component blocks access to protected routes if the user is not authenticated.
 *
 * - If the user is not authenticated, redirects to the login page and preserves the original location.
 * - If authenticated, renders the nested route via <Outlet />.
 *
 * @component
 * @returns {JSX.Element} The rendered protected route or a redirect to login.
 */
const RequireAuth = () => {
  const { session } = useSession();
  const location = useLocation();

  if (!session.user) {
    // Redirect to login, preserving the original page for post-login redirect
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
