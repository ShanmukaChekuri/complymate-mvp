import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      name: 'AI Assistant',
      href: '/chat',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      name: 'Forms',
      href: '/forms',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="dashboard-layout">
      {/* Background Pattern */}
      <div className="dashboard-bg-pattern" />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content glass">
          {/* Logo */}
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon gradient-tesla">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className="logo-text">ComplyMate</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="nav-icon">
                  {item.icon}
                </div>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="sidebar-footer">
            <div className="user-profile glass-strong">
              <div className="user-avatar gradient-apple">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="user-info">
                <p className="user-name">{user?.email || 'User'}</p>
                <p className="user-role">Compliance Officer</p>
              </div>
              <button
                onClick={logout}
                className="logout-btn"
                title="Sign out"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header glass">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="header-title">
            <h2 className="page-title">
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h2>
            <p className="page-subtitle">
              {isActive('/dashboard') && 'Compliance overview and insights'}
              {isActive('/chat') && 'AI-powered compliance assistance'}
              {isActive('/forms') && 'Manage compliance forms and documents'}
              {isActive('/settings') && 'Configure your workspace'}
            </p>
          </div>

          <div className="header-actions">
            <button className="header-action-btn" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            
            <button className="header-action-btn" title="Help">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="17" fill="currentColor" r="1"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={`page-content ${isChatPage ? 'page-content-chat' : ''}`}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
        }

        [data-theme="dark"] .dashboard-layout {
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
        }

        .dashboard-bg-pattern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 40;
          width: 280px;
          height: 100vh;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 24px;
        }

        .sidebar-open {
          transform: translateX(0);
        }

        .sidebar-content {
          height: 100%;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        [data-theme="dark"] .sidebar-content {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .sidebar-header {
          margin-bottom: 32px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-icon svg {
          width: 20px;
          height: 20px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-primary);
        }

        .nav-item-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
          color: var(--accent-primary);
          font-weight: 600;
        }

        .nav-item-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 0 2px 2px 0;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-icon svg {
          width: 100%;
          height: 100%;
        }

        .nav-text {
          font-size: 15px;
        }

        /* User Profile */
        .sidebar-footer {
          margin-top: 24px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .user-avatar svg {
          width: 18px;
          height: 18px;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }

        .logout-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #ef4444;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .logout-btn svg {
          width: 16px;
          height: 16px;
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 30;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .main-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        [data-theme="dark"] .main-header {
          background: rgba(15, 23, 42, 0.8);
          border-bottom: 1px solid rgba(51, 65, 85, 0.3);
        }

        .mobile-menu-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-secondary);
        }

        [data-theme="dark"] .mobile-menu-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        [data-theme="dark"] .mobile-menu-btn:hover {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .mobile-menu-btn svg {
          width: 18px;
          height: 18px;
        }

        .header-title {
          flex: 1;
          margin: 0 24px;
          min-width: 0;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-secondary);
          position: relative;
        }

        [data-theme="dark"] .header-action-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .header-action-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: var(--accent-primary);
        }

        [data-theme="dark"] .header-action-btn:hover {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .header-action-btn svg {
          width: 18px;
          height: 18px;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 10px;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        /* Page Content */
        .page-content {
          flex: 1;
          padding: 32px 24px;
          overflow-y: auto;
        }

        .page-content-chat {
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        /* Responsive Design */
        @media (min-width: 1024px) {
          .sidebar {
            position: fixed;
            transform: translateX(0);
            padding: 24px 24px 24px 0;
          }

          .mobile-menu-btn {
            display: none;
          }

          .main-content {
            margin-left: 280px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 260px;
            padding: 20px;
          }

          .main-header {
            padding: 16px 20px;
          }

          .header-title {
            margin: 0 16px;
          }

          .page-title {
            font-size: 20px;
          }

          .page-subtitle {
            font-size: 13px;
          }

          .page-content {
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 240px;
            padding: 16px;
          }

          .sidebar-content {
            padding: 20px;
          }

          .logo-icon {
            width: 36px;
            height: 36px;
          }

          .logo-text {
            font-size: 18px;
          }

          .main-header {
            padding: 12px 16px;
          }

          .header-title {
            margin: 0 12px;
          }

          .page-title {
            font-size: 18px;
          }

          .page-content {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 