import { Send, Mic } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import useChatStore from '../../store/chatStore';
import { useAudioInput } from '../../hooks/useAudioInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const InputBar = () => {
  const { input, setInput, appendToInput, handleSendMessage, isLoading } = useChatStore(state => ({
    input: state.input,
    setInput: state.setInput,
    appendToInput: state.appendToInput,
    handleSendMessage: state.handleSendMessage,
    isLoading: state.isLoading,
  }));

  const [interimTranscript, setInterimTranscript] = useState('');

  const { isListening, startListening, stopListening } = useAudioInput({
    onTranscript: finalTranscript => {
      appendToInput(finalTranscript + ' ');
      setInterimTranscript('');
    },
    onTranscriptChange: newInterimTranscript => {
      setInterimTranscript(newInterimTranscript);
    },
  });

  const handleSend = () => {
    if (input.trim() || interimTranscript.trim()) {
      if (interimTranscript.trim()) {
        appendToInput(interimTranscript + ' ');
      }
      handleSendMessage();
      setInterimTranscript('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayValue = input + interimTranscript;

  return (
    <div className="flex-shrink-0 w-full max-w-4xl mx-auto px-4 pb-4">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '4rem' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Listening...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative flex items-center">
        <TextareaAutosize
          className="w-full p-4 pl-12 pr-14 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow shadow-sm"
          placeholder="Ask ComplyMate anything, or press the mic to talk..."
          minRows={1}
          maxRows={10}
          value={input + interimTranscript}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={isListening ? stopListening : startListening}
          className="absolute left-3 p-2 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <motion.div
              className="w-6 h-6 bg-red-500 rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <Mic size={24} />
          )}
        </button>
        <button
          onClick={handleSend}
          className="absolute right-3 p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md"
          disabled={!displayValue.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
