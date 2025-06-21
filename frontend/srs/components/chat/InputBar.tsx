import { Send, Mic, Paperclip } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import useChatStore from '../../store/chatStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useEffect } from 'react';

export const InputBar = () => {
    const { input, setInput, handleSendMessage } = useChatStore();

    const onTranscript = (transcript: string) => {
        setInput(input + transcript);
    };

    const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition(onTranscript);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
// ... existing code ...
                    <button 
                        onClick={handleMicClick}
                        disabled={!isSupported}
                        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 ${isListening ? 'bg-red-500/20 text-red-500' : ''}`}
                    >
                        <Mic size={20} />
                    </button>
                    <button onClick={() => handleSendMessage()} className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 shadow-md">
// ... existing code ...

} 