import { InputBar } from '../../components/chat/InputBar';
import { ChatWindow } from '../../components/chat/ChatWindow';

const ChatUI = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <ChatWindow />
      <InputBar />
    </div>
  );
};

export default ChatUI;
