import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { askAI } from '../../services/api';
import './AIChat.css';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I'm your portfolio AI assistant. Ask me about your holdings, orders, stocks, or today's market trends."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    // Clear input & error
    setInput('');
    setError(null);

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);

    // Set loading state
    setLoading(true);

    try {
      const data = await askAI(query);
      if (data && data.response) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.response }]);
      } else {
        setError("Sorry, I couldn't connect to the AI service. Please try again.");
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError("Sorry, I couldn't connect to the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat-global-container">
      {isOpen && (
        <div className="ai-chat-panel neo-card">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="ai-sparkle">✦</span> Portfolio AI
            </div>
            <button 
              className="ai-chat-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`ai-message-bubble ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="ai-message-sender-label">
                  {msg.sender === 'user' ? 'You' : '✦ AI'}
                </div>
                <div className="ai-message-text">
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message-bubble ai-message ai-loading-bubble">
                <div className="ai-message-sender-label">✦ AI</div>
                <div className="ai-typing-indicator">
                  <span>AI is thinking</span>
                  <span className="dots">...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="ai-error-banner">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chat-input-area" onSubmit={handleSend}>
            <textarea
              className="ai-chat-textarea"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button 
              type="submit" 
              className="neo-btn neo-btn-yellow ai-send-btn"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button 
        className="ai-floating-trigger-btn neo-btn neo-btn-yellow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <span className="ai-sparkle">✦</span> AI Assistant
      </button>
    </div>
  );
};

export default AIChat;
