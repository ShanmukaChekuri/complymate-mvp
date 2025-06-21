import { useState, useEffect, useRef, useCallback } from 'react';

// Polyfill for browsers that don't support it yet
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface UseAudioInputProps {
  onTranscript: (transcript: string) => void;
  onTranscriptChange: (transcript: string) => void;
}

export const useAudioInput = ({ onTranscript, onTranscriptChange }: UseAudioInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      onTranscriptChange(interimTranscript);
      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onTranscript, onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, startListening, stopListening };
};
