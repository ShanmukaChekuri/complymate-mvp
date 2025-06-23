import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      description: 'Overview and analytics'
    },
    {
      name: 'AI Assistant',
      href: '/chat',
      icon: '🤖',
      description: 'Chat with AI compliance expert'
    },
    {
      name: 'Forms',
      href: '/forms',
      icon: '📋',
      description: 'OSHA compliance forms'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '⚙️',
      description: 'Account and preferences'
    }
  ];

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.href === location.pathname);
    return currentNav?.name || 'Dashboard';
  };

  const getPageDescription = () => {
    const currentNav = navigation.find(nav => nav.href === location.pathname);
    return currentNav?.description || 'Overview and analytics';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center gap-3 p-6 border-b border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ComplyMate</h1>
            <p className="text-xs text-slate-400">AI Compliance</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user?.email || 'test@gmail.com'}
              </div>
              <div className="text-xs text-slate-400">Compliance Officer</div>
            </div>
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {getPageTitle()}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {getPageDescription()}
                  </p>
                </div>
              </div>

              {/* Theme Toggle & Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-slate-700 text-yellow-400 hover:bg-slate-600 transition-all"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </button>
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm">🔔</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 