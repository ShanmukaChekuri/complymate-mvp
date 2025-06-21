import { useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export const SpeechController = () => {
  const { isSpeaking, currentlySpeakingMessageId, stopSpeaking, messages } = useChatStore();

  const onSpeechEnd = () => {
    stopSpeaking();
  };

  const { speak, cancel } = useSpeechSynthesis(onSpeechEnd);

  useEffect(() => {
    if (isSpeaking && currentlySpeakingMessageId) {
      const messageToSpeak = messages.find(m => m.id === currentlySpeakingMessageId);
      if (messageToSpeak) {
        // Strip markdown for cleaner speech
        const textToSpeak = messageToSpeak.content
          .replace(/```[\s\S]*?```/g, 'Code block')
          .replace(/\[.*?\]\(.*?\)/g, match => match.split('](')[0].substring(1)); // Extract text from markdown links
        speak(textToSpeak);
      }
    } else {
      cancel();
    }
  }, [isSpeaking, currentlySpeakingMessageId]); // Removed dependencies that are now handled in the hook

  return null; // This is a controller component, it doesn't render anything
};
