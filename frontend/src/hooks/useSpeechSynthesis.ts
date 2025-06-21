import { useState, useEffect } from 'react';
import useChatStore from '../store/chatStore';

export const useSpeechSynthesis = (onEnd: () => void = () => {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { selectedVoiceURI, setSelectedVoiceURI } = useChatStore();

  const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      const synth = window.speechSynthesis;

      const updateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);

        if (!selectedVoiceURI) {
          // Heuristic to find a natural, high-quality English voice
          const preferredVoice =
            availableVoices.find(
              v => v.lang.startsWith('en') && v.name.includes('Google') && v.name.includes('US')
            ) ||
            availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
            availableVoices.find(v => v.lang.startsWith('en-US'));

          if (preferredVoice) {
            setSelectedVoiceURI(preferredVoice.voiceURI);
          }
        }
      };

      updateVoices();
      synth.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI, setSelectedVoiceURI]);

  const speak = (text: string) => {
    if (!isSupported || !text || !selectedVoice) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, speak, cancel, isSupported, voices };
};
