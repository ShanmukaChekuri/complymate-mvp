import { motion } from 'framer-motion';
import { Plus, Sun, Moon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import useChatStore from '../../store/chatStore';
import { SettingsPanel } from './SettingsPanel';

const chats = [
  { id: 1, name: 'OSHA Inquiry' },
  { id: 2, name: 'Form 300 Details' },
  { id: 3, name: 'Compliance Check' },
];

export const Sidebar = () => {
  const { isSidebarOpen, isDarkMode, toggleSidebar, toggleTheme } = useChatStore();

  return (
    <motion.div
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 60 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-full"
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={`font-bold text-xl text-teal-500 ${!isSidebarOpen && 'hidden'}`}>
          ComplyMate
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isSidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </button>
      </div>

      <div className="p-2">
        <button className="w-full flex items-center justify-center bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600">
          <Plus size={20} />
          {isSidebarOpen && <span className="ml-2">New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {chats.map(chat => (
          <div key={chat.id} className="p-2">
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isSidebarOpen ? chat.name : 'C'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <SettingsPanel />
        <button
          onClick={toggleTheme}
          className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mt-2"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isSidebarOpen && <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </motion.div>
  );
};
