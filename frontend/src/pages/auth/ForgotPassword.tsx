import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Reset your password</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send Reset Link
      </button>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        Remember your password?{' '}
        <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Sign in
        </Link>
      </p>
    </form>
  );
} 