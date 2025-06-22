import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Chat.css';

// --- Modern SVG Icons ---
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

// --- Type Definitions ---
interface Form { id: string; title: string; created_at: string; }
interface Message { role: 'user' | 'assistant'; content: string; }

// Voice recognition setup
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Add these variables for continuous listening
let isManuallyStopped = false;
let accumulatedTranscript = '';

// Modern SVG Icons
const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1A3 3 0 0 0 9 4V10A3 3 0 0 0 12 13A3 3 0 0 0 15 10V4A3 3 0 0 0 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10V9A7 7 0 0 0 5 9V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MicOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9V4A3 3 0 0 1 12 1A3 3 0 0 1 15 4V10A3 3 0 0 1 12 13A3 3 0 0 1 9 10V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10V9A7 7 0 0 0 5 9V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.54 8.46A5 5 0 0 1 17 12A5 5 0 0 1 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.07 4.93A10 10 0 0 1 22 12A10 10 0 0 1 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VolumeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Main Chat Component ---
export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your ComplyMate AI assistant. How can I help you with your OSHA compliance tasks today?" },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState<Form[]>([]);
    const [templates, setTemplates] = useState<string[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    const fetchForms = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }
        try {
            const res = await fetch('/api/v1/forms/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch forms.');
            const data = await res.json();
            setForms(data.sort((a: Form, b: Form) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            if (data.length > 0) {
                setSelectedFormId(data[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/v1/templates');
            if (!res.ok) throw new Error('Failed to fetch templates.');
            const data = await res.json();
            setTemplates(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching templates.');
        }
    };

    useEffect(() => {
        fetchForms();
        fetchTemplates();
    }, [fetchForms]);

    const createNewForm = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/forms/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: `OSHA Form ${new Date().toLocaleDateString()}`,
                    description: 'New OSHA compliance form'
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create form');
            }

            const newForm = await res.json();
            setForms(prev => [newForm, ...prev]);
            setSelectedFormId(newForm.id);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `✅ New form "${newForm.title}" created! You can now upload a PDF or start asking questions.` }
            ]);
        } catch (err) {
            console.error('Create form error:', err);
            setError('Failed to create new form. Please try again.');
        }
    };
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedFormId) return;

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`/api/v1/forms/${selectedFormId}/analyze`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await res.json();
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `✅ File "${file.name}" uploaded and analyzed successfully! I can now help you with questions about this OSHA form.` }
            ]);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        setError('');

        try {
            if (!selectedFormId) {
                throw new Error("Please select a form to start the conversation.");
            }

            let url = '';
            const body: { message: string; template_name?: string } = { message: input };

            if (selectedFormId.startsWith('template:')) {
                url = `/api/v1/chat/template`;
                body.template_name = selectedFormId.replace('template:', '');
            } else {
                url = `/api/v1/forms/${selectedFormId}/chat`;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
            const data = await res.json();
            setMessages([...newMessages, { role: 'assistant', content: data.response }]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get a response.';
            setError(errorMessage);
            setMessages([...newMessages, { role: 'assistant', content: `Error: ${errorMessage}` }]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow flex justify-center items-start p-4 overflow-hidden">
                <div className="chat-container">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="flex-1">
                            <h1 className="chat-title">ComplyMate AI</h1>
                            <p className="chat-subtitle">OSHA Compliance Co-Pilot</p>
                        </div>
                        <div className="form-selector">
                             <select value={selectedFormId} onChange={e => setSelectedFormId(e.target.value)} className="form-select">
                                <option value="">Select a Form...</option>
                                <optgroup label="My Forms">
                                    {forms.map(form => <option key={form.id} value={form.id}>{form.title}</option>)}
                                </optgroup>
                                <optgroup label="OSHA Templates">
                                    {templates.map(template => <option key={template} value={`template:${template}`}>{template.replace('.pdf', '')}</option>)}
                                </optgroup>
                            </select>
                            <button className="new-form-btn" title="Create New Form" onClick={createNewForm}><PlusIcon /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="message assistant">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-area">
                        {error && <p className="error-message">{error}</p>}
                        <div className="chat-input-wrapper">
                            <button className="attach-btn" title="Attach File"><UploadIcon /></button>
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask ComplyMate about OSHA compliance..."
                                rows={1}
                                className="chat-textarea"
                            />
                            <button onClick={handleSendMessage} disabled={!input.trim() || loading} className="send-btn" title="Send Message">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
