import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Form {
  id: string;
  title: string;
  created_at: string;
}

// Voice recognition setup
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Add these variables for continuous listening
let isManuallyStopped = false;
let accumulatedTranscript = '';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are chatting with your OSHA compliance AI assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);

  // Fetch forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/forms/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Order by created_at descending (latest first)
      const sorted = data.sort(
        (a: Form, b: Form) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setForms(sorted);
      if (sorted.length > 0) setSelectedFormId(sorted[0].id);
    };
    fetchForms();
  }, []);

  // Voice input handler (continuous, robust)
  const startListening = () => {
    if (!recognition) return;
    if (listening) {
      stopListening();
      return;
    }
    setListening(true);
    isManuallyStopped = false;
    accumulatedTranscript = '';
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          accumulatedTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      setInput((accumulatedTranscript + interim).trim());
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      if (!isManuallyStopped) {
        recognition.start(); // Restart automatically for long-form input
      } else {
        setListening(false);
      }
    };
  };

  // Stop listening function for manual stop
  const stopListening = () => {
    isManuallyStopped = true;
    recognition && recognition.stop();
    setListening(false);
  };

  // Voice output handler
  const speak = (text: string) => {
    if (muted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speech immediately when muted is toggled ON
  useEffect(() => {
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [muted]);

  // Speak AI responses automatically
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      speak(messages[messages.length - 1].content);
    }
    // eslint-disable-next-line
  }, [messages, muted]);

  // Waveform animation (simple CSS pulse)
  const Waveform = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 12 + Math.sin(Date.now() / 200 + i) * 8,
            background: '#2563eb',
            margin: '0 2px',
            borderRadius: 2,
            transition: 'height 0.2s',
            animation: 'wave 1s infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );

  // Dynamically resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  }, [input]);

  // Clear input handler
  const clearInput = () => setInput('');

  // Ensure input is cleared after sending
  const sendMessage = async () => {
    if (!input.trim() || !selectedFormId) return;
    stopListening();
    const userMessage = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput(''); // Clear input immediately after sending
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/forms/${selectedFormId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(msgs => {
        if (msgs.length === 1 && msgs[0].role === 'system') {
          return [msgs[0], userMessage, { role: 'assistant', content: data.response }];
        }
        // Remove repeated greetings from assistant
        const cleaned = data.response.replace(/^hi siva chekuri[!,. ]*/i, '').trim();
        return [...msgs, { role: 'assistant', content: cleaned }];
      });
      if (data.response && data.response.toLowerCase().includes('have a great day')) {
        setShowDownload(true);
      }
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { role: 'assistant', content: 'Error: Failed to get response.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/v1/forms/${selectedFormId}/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osha_form_${selectedFormId}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="chatgpt-ui"
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div style={{ padding: '16px 16px 0 16px' }}>
        <label htmlFor="form-select" style={{ fontWeight: 500, marginRight: 8 }}>
          Select a Form to Chat About:
        </label>
        <select
          id="form-select"
          value={selectedFormId}
          onChange={e => {
            setSelectedFormId(e.target.value);
            setMessages([
              {
                role: 'system',
                content: 'You are chatting with your OSHA compliance AI assistant.',
              },
            ]);
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            minWidth: 200,
          }}
        >
          {forms.map(form => (
            <option key={form.id} value={form.id}>
              {form.title} (Uploaded: {new Date(form.created_at).toLocaleString()})
            </option>
          ))}
        </select>
      </div>
      <div
        className="chatgpt-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '24px 16px 16px 16px',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`chatgpt-message chatgpt-${msg.role}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        className="chatgpt-input-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          zIndex: 10,
          borderTop: '1px solid #e5e7eb',
          padding: '12px 16px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or speak your OSHA compliance question..."
            rows={1}
            style={{
              resize: 'none',
              overflow: 'auto',
              minHeight: 40,
              maxHeight: 300,
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '10px 36px 10px 12px',
              fontSize: '1rem',
              background: '#f1f5f9',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border 0.2s',
            }}
          />
          {input && (
            <button
              onClick={clearInput}
              aria-label="Clear input"
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: 18,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={startListening}
          style={{
            marginLeft: 8,
            background: listening ? '#2563eb' : '#e5e7eb',
            color: listening ? '#fff' : '#222',
            border: 'none',
            borderRadius: 6,
            padding: '8px 12px',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label={listening ? 'Stop Listening' : 'Start Listening'}
          title={listening ? 'Stop Listening' : 'Start Listening'}
        >
          {listening ? '🛑 Stop' : '🎤 Speak'}
        </button>
        {listening && <Waveform />}
        <button
          onClick={() => setMuted(m => !m)}
          style={{
            marginLeft: 8,
            background: muted ? '#f87171' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 12px',
            cursor: 'pointer',
          }}
          aria-label={muted ? 'Unmute AI voice' : 'Mute AI voice'}
          title={muted ? 'Unmute AI voice' : 'Mute AI voice'}
        >
          {muted ? '🔇 Mute' : '🔊 Unmute'}
        </button>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || !selectedFormId}
          className="chatgpt-send-btn"
          style={{ marginLeft: 8 }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
      {showDownload && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button className="chatgpt-send-btn" onClick={handleDownload}>
            Download Completed OSHA Form
          </button>
        </div>
      )}
    </div>
  );
}
