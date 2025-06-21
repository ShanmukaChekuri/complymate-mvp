import { MessageBubble } from './MessageBubble';
import useChatStore from '../../store/chatStore';
import { useEffect, useRef } from 'react';
import TypingIndicator from './TypingIndicator';

export const ChatWindow = () => {
  const { messages, isLoading } = useChatStore(state => ({
    messages: state.messages,
    isLoading: state.isLoading,
  }));
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            id={msg.id}
            sender={msg.sender}
            content={msg.content}
            formUrl={msg.formUrl}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
