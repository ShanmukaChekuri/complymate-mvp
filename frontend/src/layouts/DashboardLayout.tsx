import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Forms', href: '/forms', icon: FileText },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-black/50 backdrop-blur-lg">
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">ComplyMate</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="pl-64 flex-1 flex flex-col h-screen">
        {/* Sticky header */}
        <header className="flex-shrink-0 sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/50 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          {/* Header content can go here, like user menu */}
        </header>
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
