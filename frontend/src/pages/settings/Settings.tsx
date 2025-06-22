import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Profile Settings</h3>
              <form className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input mt-1"
                    defaultValue={user?.name}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input mt-1"
                    defaultValue={user?.email}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="input mt-1"
                    defaultValue={user?.company}
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-destructive"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="card">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Preferences</h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="notifications" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email Notifications
                    </label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Receive email updates about your compliance status
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      notifications ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                    }`}
                    role="switch"
                    aria-checked={notifications}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="dark-mode" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Dark Mode
                    </label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      theme === 'dark' ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                    }`}
                    role="switch"
                    aria-checked={theme === 'dark'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 