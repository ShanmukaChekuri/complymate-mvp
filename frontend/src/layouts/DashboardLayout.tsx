import { Outlet, NavLink } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">ComplyMate</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Add user menu, notifications, etc. here */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 mt-16 w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/forms"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  Forms
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  AI Chat
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content is now a flex container that grows */}
        <main className="flex flex-col flex-1 pl-64 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 