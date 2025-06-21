import { useState, useEffect, useRef } from 'react';

// Fallback for browsers that don't support the Web Speech API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = (
  onFinalTranscript: (transcript: string) => void,
  onInterimTranscript?: (transcript: string) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef<string>('');

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update interim transcript for real-time feedback
      if (interimTranscript) {
        interimTranscriptRef.current = interimTranscript;
        onInterimTranscript?.(interimTranscript);
      }

      // Send final transcript when complete
      if (finalTranscript) {
        onFinalTranscript(finalTranscript);
        interimTranscriptRef.current = '';
        onInterimTranscript?.('');
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clear any remaining interim transcript
      if (interimTranscriptRef.current) {
        onInterimTranscript?.('');
        interimTranscriptRef.current = '';
      }
    };

    recognitionRef.current = recognition;
  }, [onFinalTranscript, onInterimTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
        interimTranscriptRef.current = '';
      } catch (err) {
        setError('Speech recognition could not be started.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    error,
    startListening,
    stopListening,
    isSupported: !!SpeechRecognition,
  };
};
