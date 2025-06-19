import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">ComplyMate</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Your Compliance Assistant</p>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 