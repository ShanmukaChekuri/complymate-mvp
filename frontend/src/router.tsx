import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Loading component
const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
  </div>
);

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Forms = lazy(() => import('./pages/forms/Forms'));
const Chat = lazy(() => import('./pages/chat/Chat'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const ComplianceCheck = lazy(() => import('./pages/ComplianceCheck'));

// Wrap lazy-loaded components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: withSuspense(Login),
          },
          {
            path: 'register',
            element: withSuspense(Register),
          },
          {
            path: 'forgot-password',
            element: withSuspense(ForgotPassword),
          },
        ],
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: withSuspense(Dashboard),
          },
          {
            path: 'forms',
            element: withSuspense(Forms),
          },
          {
            path: 'chat',
            element: withSuspense(Chat),
          },
          {
            path: 'settings',
            element: withSuspense(Settings),
          },
          {
            path: 'compliance/check',
            element: withSuspense(ComplianceCheck),
          },
        ],
      },
    ],
  },
]); 