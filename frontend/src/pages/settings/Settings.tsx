import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'integrations' | 'billing'>('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Compliance Officer',
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
    theme: 'dark' as 'light' | 'dark' | 'auto'
  });

  const sections = [
    {
      key: 'profile',
      label: 'Profile',
      icon: '👤',
      description: 'Personal information and account details'
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      description: 'Manage alerts and communication preferences'
    },
    {
      key: 'security',
      label: 'Security',
      icon: '🔒',
      description: 'Security settings and access controls'
    },
    {
      key: 'integrations',
      label: 'Integrations',
      icon: '🔧',
      description: 'Connect external tools and services'
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: '💳',
      description: 'Subscription and payment information'
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
    <div className="space-y-6">
      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Avatar
        </h3>
        <p className="text-sm mb-6 text-slate-400">
          Upload a profile picture to personalize your account.
        </p>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
            {settings.profile.name.charAt(0)}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Change Photo
          </button>
        </div>
      </div>

      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 text-white">
          Personal Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Role
            </label>
            <select
              value={settings.profile.role}
              onChange={(e) => updateSetting('profile', 'role', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {[
        { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email', icon: '📧' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications in your browser', icon: '🔔' },
        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly compliance summary reports', icon: '📊' },
        { key: 'complianceUpdates', label: 'Compliance Updates', description: 'Get notified about regulation changes', icon: '⚖️' },
        { key: 'systemMaintenance', label: 'System Maintenance', description: 'Alerts about system updates and maintenance', icon: '🔧' }
      ].map((item) => (
        <div key={item.key} className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {item.label}
                </h3>
                <p className="text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-xl">
              🔐
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-xl">
            ⏱️
          </div>
          <div>
            <h3 className="font-semibold text-white">
              Session Timeout
            </h3>
            <p className="text-sm text-slate-400">
              Automatically log out after period of inactivity
            </p>
          </div>
        </div>
        
        <select
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="240">4 hours</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl">
              🚨
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Login Alerts
              </h3>
              <p className="text-sm text-slate-400">
                Get notified of new login attempts
              </p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.loginAlerts}
              onChange={(e) => updateSetting('security', 'loginAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔧</div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          Integrations Coming Soon
        </h3>
        <p className="text-slate-400 mb-4">
          Connect with popular tools like Slack, Microsoft Teams, and more.
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Request Integration
        </button>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div className="rounded-xl p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
            <p className="text-blue-100">Your current subscription plan</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">$49</div>
            <div className="text-blue-100">per month</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Billing Information
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-300">Next billing date</span>
            <span className="font-medium text-white">January 15, 2024</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-300">Payment method</span>
            <span className="font-medium text-white">•••• 4242</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-slate-300">Billing email</span>
            <span className="font-medium text-white">john.doe@company.com</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Update Payment Method
          </button>
          <button className="px-4 py-2 rounded-lg border transition-colors border-slate-600 text-slate-300 hover:bg-slate-700">
            Download Invoice
          </button>
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
        return renderIntegrationsSection();
      case 'billing':
        return renderBillingSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-slate-800/50 border-slate-700">
          <div className="p-6">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.key
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{section.label}</div>
                    <div className={`text-xs ${
                      activeSection === section.key 
                        ? 'text-blue-100' 
                        : 'text-slate-500'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 