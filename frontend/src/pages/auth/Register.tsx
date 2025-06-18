import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        email,
        password,
        company_name: companyName,
        first_name: firstName,
        last_name: lastName,
        industry,
        employee_count: Number(employeeCount),
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-500 hover:text-primary-600">
          Sign in
        </Link>
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-destructive-50 p-4 text-sm text-destructive-600 dark:bg-destructive-900/50 dark:text-destructive-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            required
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="industry"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Industry
          </label>
          <input
            id="industry"
            type="text"
            required
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="employeeCount"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Employee Count
          </label>
          <input
            id="employeeCount"
            type="number"
            min={1}
            required
            value={employeeCount}
            onChange={e => setEmployeeCount(Number(e.target.value))}
            className="input mt-1"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
