import { motion } from 'framer-motion';
import {
  Clipboard,
  Check,
  User,
  Bot,
  AlertTriangle,
  Download,
  Volume2,
  StopCircle,
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Or your preferred theme
import useChatStore from '../../store/chatStore';

type MessageSender = 'user' | 'assistant' | 'error';

interface MessageBubbleProps {
  id: string;
  sender: MessageSender;
  content: string;
  formUrl?: string;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-2 rounded-lg bg-gray-900 text-sm overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-700">
        <span className="text-gray-400 text-xs font-sans">{match[1]}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-sans"
        >
          {isCopied ? <Check size={14} /> : <Clipboard size={14} />}
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    </div>
  ) : (
    <code
      className={`${className} bg-gray-100 dark:bg-gray-700/50 px-1 py-0.5 rounded text-sm font-mono`}
      {...props}
    >
      {children}
    </code>
  );
};

export const MessageBubble = ({ id, sender, content, formUrl }: MessageBubbleProps) => {
  const isUser = sender === 'user';
  const isAssistant = sender === 'assistant';
  const isError = sender === 'error';

  const { isSpeaking, currentlySpeakingMessageId, startSpeakingMessage, stopSpeaking } =
    useChatStore();
  const isThisMessageSpeaking = isSpeaking && currentlySpeakingMessageId === id;

  const handlePlayback = () => {
    if (isThisMessageSpeaking) {
      stopSpeaking();
    } else {
      startSpeakingMessage(id, content);
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.1, 0.8, 0.2, 1] },
    },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 w-full items-start ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isAssistant ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {isAssistant ? <Bot size={18} /> : <AlertTriangle size={18} />}
        </div>
      )}
      <div
        className={`p-4 rounded-2xl max-w-full sm:max-w-2xl lg:max-w-3xl prose prose-sm dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1
          ${
            isUser
              ? 'bg-teal-500 text-white order-1 rounded-br-lg'
              : isError
              ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-bl-lg'
              : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-bl-lg'
          }`}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        <div className="break-words">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: CodeBlock,
              p: ({ children }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 last:mb-0 pl-4">{children}</ol>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {(formUrl || isAssistant) && (
          <div className="flex items-center gap-2 mt-4 flex-wrap border-t border-black/10 dark:border-white/10 pt-3 -mb-2">
            {formUrl && isAssistant && (
              <a
                href={`${import.meta.env.VITE_API_URL}${formUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-600/20 text-teal-800 dark:text-teal-300 no-underline hover:bg-teal-600/30 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                <span>Download Form</span>
              </a>
            )}
            {isAssistant && !formUrl && (
              <button
                onClick={handlePlayback}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={isThisMessageSpeaking ? 'Stop speaking' : 'Speak message'}
              >
                {isThisMessageSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
              </button>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-teal-500 text-white order-2">
          <User size={18} />
        </div>
      )}
    </motion.div>
  );
};
