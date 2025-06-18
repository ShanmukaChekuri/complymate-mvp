import { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Form {
  id: string;
  title: string;
  created_at: string;
}

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

  const sendMessage = async () => {
    if (!input.trim() || !selectedFormId) return;
    const userMessage = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput('');
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
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.response }]);
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
      style={{ height: '100vh', width: '100vw', margin: 0, borderRadius: 0 }}
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
      <div className="chatgpt-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatgpt-message chatgpt-${msg.role}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatgpt-input-bar">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your OSHA compliance question..."
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || !selectedFormId}
          className="chatgpt-send-btn"
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
