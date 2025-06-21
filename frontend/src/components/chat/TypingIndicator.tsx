import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => (
  <motion.div
    className="flex items-center gap-3 p-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white">
      <Bot size={18} />
    </div>
    <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-800 p-3 rounded-2xl">
      <motion.div
        className="h-2 w-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </div>
  </motion.div>
);

export default TypingIndicator;
