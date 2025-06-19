import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/session';

/**
 * RequireUnauth component prevents access to authentication pages
 * (e.g., login/register) when the user is already authenticated.
 *
 * - If the user is authenticated, redirects to the home page.
 * - If not authenticated, renders the nested route via <Outlet />.
 *
 * @component
 * @returns {JSX.Element} The rendered route or a redirect to home.
 */
const RequireUnauth = () => {
  const { session } = useSession();

  if (session.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireUnauth;
