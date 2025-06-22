import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Settings: React.FC = () => {
  // const { user, logout } = useAuth();
  // const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'integrations' | 'billing'>('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Safety Manager',
      avatar: ''
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyReports: false,
      complianceUpdates: true,
      systemMaintenance: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      loginAlerts: true,
      apiAccess: false
    },
    theme: 'light' as 'light' | 'dark' | 'auto'
  });

  // Removed handleLogout function as it's not used in the new design

  const sections = [
    {
      key: 'profile',
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      key: 'security',
      label: 'Security',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 22S8 18 8 12V7L12 5L16 7V12C16 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      key: 'integrations',
      label: 'Integrations',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3C15.09 5.9 15.67 5.9 16.06 6.3L17.66 7.9C18.05 8.29 18.05 8.87 17.66 9.26L9.26 17.66C8.87 18.05 8.29 18.05 7.9 17.66L6.3 16.06C5.91 15.67 5.91 15.09 6.3 14.7L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 7V4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2H18C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V7M4 7H20M4 7V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, any>),
        [key]: value
      }
    }));
  };

  const renderProfileSection = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2 className="section-title">Profile Settings</h2>
        <p className="section-description">Manage your personal information and account preferences.</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card glass">
          <div className="setting-icon gradient-apple">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="17" fill="currentColor" r="1"/>
            </svg>
          </div>
          <div className="setting-content">
            <h3 className="setting-title">Avatar</h3>
            <p className="setting-description">Upload a profile picture to personalize your account.</p>
            <div className="avatar-section">
              <div className="avatar-preview gradient-tesla">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button className="upload-btn">Change Photo</button>
            </div>
          </div>
        </div>

        <div className="setting-card glass">
          <div className="setting-content">
            <h3 className="setting-title">Personal Information</h3>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Role</label>
              <select
                value={settings.profile.role}
                onChange={(e) => updateSetting('profile', 'role', e.target.value)}
                className="setting-select"
              >
                <option value="Safety Manager">Safety Manager</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2 className="section-title">Notification Preferences</h2>
        <p className="section-description">Customize how and when you receive notifications.</p>
      </div>

      <div className="settings-grid">
        {[
          { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications in your browser' },
          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly compliance summary reports' },
          { key: 'complianceUpdates', label: 'Compliance Updates', description: 'Get notified about regulation changes' },
          { key: 'systemMaintenance', label: 'System Maintenance', description: 'Alerts about system updates and maintenance' }
        ].map((item) => (
          <div key={item.key} className="setting-card glass">
            <div className="setting-content">
              <div className="setting-header-row">
                <div>
                  <h3 className="setting-title">{item.label}</h3>
                  <p className="setting-description">{item.description}</p>
                </div>
                <div className="toggle-container">
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                    onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                    className="toggle-input"
                  />
                  <label htmlFor={item.key} className="toggle-label">
                    <span className="toggle-switch"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2 className="section-title">Security Settings</h2>
        <p className="section-description">Manage your account security and access controls.</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card glass">
          <div className="setting-content">
            <div className="setting-header-row">
              <div>
                <h3 className="setting-title">Two-Factor Authentication</h3>
                <p className="setting-description">Add an extra layer of security to your account</p>
              </div>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="twoFactorAuth" className="toggle-label">
                  <span className="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="setting-card glass">
          <div className="setting-content">
            <h3 className="setting-title">Session Timeout</h3>
            <p className="setting-description">Automatically log out after inactivity</p>
            <div className="input-group">
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                className="setting-select"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="0">Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="setting-card glass">
          <div className="setting-content">
            <div className="setting-header-row">
              <div>
                <h3 className="setting-title">Login Alerts</h3>
                <p className="setting-description">Get notified when someone logs into your account</p>
              </div>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="loginAlerts"
                  checked={settings.security.loginAlerts}
                  onChange={(e) => updateSetting('security', 'loginAlerts', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="loginAlerts" className="toggle-label">
                  <span className="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'integrations':
        return (
          <div className="settings-content">
            <div className="settings-header">
              <h2 className="section-title">Integrations</h2>
              <p className="section-description">Connect with third-party services and tools.</p>
            </div>
            <div className="coming-soon glass">
              <div className="coming-soon-icon gradient-neural">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M14.7 6.3C15.09 5.9 15.67 5.9 16.06 6.3L17.66 7.9C18.05 8.29 18.05 8.87 17.66 9.26L9.26 17.66C8.87 18.05 8.29 18.05 7.9 17.66L6.3 16.06C5.91 15.67 5.91 15.09 6.3 14.7L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Coming Soon</h3>
              <p>Integration features will be available in the next update.</p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="settings-content">
            <div className="settings-header">
              <h2 className="section-title">Billing & Subscription</h2>
              <p className="section-description">Manage your subscription and billing information.</p>
            </div>
            <div className="coming-soon glass">
              <div className="coming-soon-icon gradient-tesla">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 7V4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2H18C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V7M4 7H20M4 7V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Coming Soon</h3>
              <p>Billing features will be available in the next update.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      {/* Sidebar Navigation */}
      <div className="settings-nav glass">
        <div className="nav-header">
          <h1 className="nav-title">Settings</h1>
          <p className="nav-subtitle">Customize your experience</p>
        </div>
        <nav className="nav-menu">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`nav-item ${activeSection === section.key ? 'nav-item-active' : ''}`}
              onClick={() => setActiveSection(section.key as any)}
            >
              <div className="nav-icon">
                {section.icon}
              </div>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        {renderSection()}
        
        {/* Save Button */}
        <div className="settings-footer">
          <button className="save-btn gradient-tesla">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 600px;
        }

        /* Settings Navigation */
        .settings-nav {
          width: 280px;
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          height: fit-content;
          position: sticky;
          top: 32px;
        }

        [data-theme="dark"] .settings-nav {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .nav-header {
          margin-bottom: 24px;
        }

        .nav-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .nav-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .nav-menu {
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
          background: transparent;
          border: none;
          color: var(--text-secondary);
          text-align: left;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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

        .nav-label {
          flex: 1;
        }

        /* Settings Main */
        .settings-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-header {
          margin-bottom: 8px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .section-description {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-card {
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-theme="dark"] .setting-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .setting-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .setting-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .setting-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
        }

        .setting-icon svg {
          width: 24px;
          height: 24px;
        }

        .setting-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .setting-description {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        /* Form Elements */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .setting-input,
        .setting-select {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.5);
          background: rgba(248, 250, 252, 0.8);
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-theme="dark"] .setting-input,
        [data-theme="dark"] .setting-select {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .setting-input:focus,
        .setting-select:focus {
          outline: none;
          border: 1px solid var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Toggle Switch */
        .toggle-container {
          position: relative;
        }

        .toggle-input {
          display: none;
        }

        .toggle-label {
          display: block;
          width: 48px;
          height: 28px;
          background: rgba(148, 163, 184, 0.3);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .toggle-switch {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .toggle-input:checked + .toggle-label {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .toggle-input:checked + .toggle-label .toggle-switch {
          transform: translateX(20px);
        }

        /* Avatar Section */
        .avatar-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar-preview {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .avatar-preview svg {
          width: 32px;
          height: 32px;
        }

        .upload-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--accent-primary);
          background: transparent;
          color: var(--accent-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .upload-btn:hover {
          background: var(--accent-primary);
          color: white;
        }

        /* Coming Soon */
        .coming-soon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        [data-theme="dark"] .coming-soon {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .coming-soon-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
        }

        .coming-soon-icon svg {
          width: 32px;
          height: 32px;
        }

        .coming-soon h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .coming-soon p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Settings Footer */
        .settings-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.3);
        }

        [data-theme="dark"] .settings-footer {
          border-top: 1px solid rgba(51, 65, 85, 0.3);
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .save-btn svg {
          width: 16px;
          height: 16px;
        }

        /* Gradients */
        .gradient-apple {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }

        .gradient-tesla {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-neural {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .settings-page {
            flex-direction: column;
            gap: 24px;
          }

          .settings-nav {
            width: 100%;
            position: static;
          }

          .nav-menu {
            flex-direction: row;
            overflow-x: auto;
            gap: 8px;
            padding-bottom: 8px;
          }

          .nav-item {
            flex-shrink: 0;
            min-width: 120px;
            justify-content: center;
          }

          .nav-label {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            gap: 20px;
          }

          .settings-nav {
            padding: 20px;
          }

          .nav-title {
            font-size: 20px;
          }

          .section-title {
            font-size: 24px;
          }

          .setting-card {
            padding: 20px;
          }

          .setting-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .avatar-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .settings-nav {
            padding: 16px;
          }

          .setting-card {
            padding: 16px;
          }

          .coming-soon {
            padding: 60px 20px;
          }

          .nav-item {
            min-width: 80px;
            padding: 8px 12px;
          }

          .nav-icon {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings; 