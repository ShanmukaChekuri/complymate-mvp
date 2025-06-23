import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* LEFT SIDE - FORM SECTION */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col min-h-screen">
        {/* TOP SECTION - LOGO */}
        <div className="pt-12 pl-12 lg:pt-16 lg:pl-16">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ComplyMate</h1>
              <p className="text-sm text-gray-500">AI Compliance Platform</p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION - FORM CONTENT */}
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-20 py-8">
          <div className="w-full max-w-sm">
            {/* HEADER */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600 mb-8">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Get ComplyMate Now
              </Link>
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ERROR */}
              {error && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:shadow-sm text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:shadow-sm text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
              </div>

              {/* REMEMBER & FORGOT */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                </label>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot Your Password?
                </Link>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION - FOOTER */}
        <div className="pb-8 px-12 lg:px-16 text-center">
          <p className="text-xs text-gray-500">
            Copyright © 2024 ComplyMate, LLC. ComplyMate™ is a trademark of ComplyMate, LLC.
          </p>
          <div className="mt-2">
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>
            <span className="text-gray-400 mx-2">|</span>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - PROMOTIONAL SECTION */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 items-center justify-center relative overflow-hidden min-h-screen">
        {/* BACKGROUND EFFECTS */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* CONTENT CARD */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center max-w-md mx-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Get the Best Compliance & Safety Platform for Your Business
          </h3>
          <p className="text-blue-100 mb-4">Built by the folks behind ComplyMate.</p>
          <p className="text-blue-200 mb-8">Automate OSHA Compliance and Workplace Safety Management.</p>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105">
            Get ComplyMate Now
          </button>
        </div>
      </div>
    </div>
  );
} 