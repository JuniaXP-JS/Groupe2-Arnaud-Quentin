// src/router/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RequireAuth from '@/auth/RequireAuth';
import RequireUnauth from '@/auth/RequireUnauth';

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> }
        ]
      },
    ],
  },
  {
    path: '/auth',
    element: <RequireUnauth />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ]
      }
    ]
  }
]);

export default router;
