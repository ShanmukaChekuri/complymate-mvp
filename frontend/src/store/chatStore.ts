import { create } from 'zustand';

type Message = {
  id: string;
  sender: 'user' | 'assistant' | 'error';
  content: string;
  formUrl?: string;
  file_urls?: { form_name: string; url: string }[];
};

type ChatState = {
  messages: Message[];
  input: string;
  session_id: string | null;
  interimTranscript: string;
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  isSpeaking: boolean;
  currentlySpeakingMessageId: string | null;
  isLoading: boolean;

  addMessage: (message: Message) => void;
  setInput: (input: string) => void;
  setInterimTranscript: (transcript: string) => void;
  appendToInput: (text: string) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  startSpeakingMessage: (messageId: string, text: string) => void;
  stopSpeaking: () => void;
  handleSendMessage: () => Promise<void>;
};

const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'init-message',
      sender: 'assistant',
      content:
        "Hello! I'm ComplyMate AI. How can I help you with your OSHA compliance questions today?",
    },
  ],
  input: '',
  session_id: null,
  interimTranscript: '',
  isSidebarOpen: true,
  isDarkMode: false,
  isSpeaking: false,
  currentlySpeakingMessageId: null,
  isLoading: false,

  addMessage: message => {
    set(state => ({
      messages: [...state.messages, message],
    }));
  },

  setInput: input => set({ input }),

  setInterimTranscript: interimTranscript => set({ interimTranscript }),

  appendToInput: text => {
    set(state => ({
      input: state.input + text,
      interimTranscript: '', // Clear interim transcript when appending
    }));
  },

  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleTheme: () => set(state => ({ isDarkMode: !state.isDarkMode })),

  startSpeakingMessage: (messageId, text) => {
    const { stopSpeaking } = get();
    stopSpeaking();

    set({ isSpeaking: true, currentlySpeakingMessageId: messageId });

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => set({ isSpeaking: false, currentlySpeakingMessageId: null });
      utterance.onerror = () => set({ isSpeaking: false, currentlySpeakingMessageId: null });
      speechSynthesis.speak(utterance);
    }
  },

  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    set({ isSpeaking: false, currentlySpeakingMessageId: null });
  },

  handleSendMessage: async () => {
    const { input, addMessage, session_id } = get();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input,
    };
    addMessage(userMessage);
    const currentInput = input;
    set({ input: '' });

    set({ isLoading: true });

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('No access token found');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: currentInput,
          session_id: session_id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.session_id) {
        set({ session_id: data.session_id });
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.message,
        file_urls: data.file_urls,
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'error',
        content: "Sorry, I couldn't connect to the server. Please try again later.",
      };
      addMessage(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
