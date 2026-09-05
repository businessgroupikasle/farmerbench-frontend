import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  Leaf,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Search,
  Sprout,
  ShoppingBag,
} from 'lucide-react';
import { chatService, ChatMessage } from '../../services/chat.service';
import { ChatProductCard } from './ChatProductCard';
import './ChatWidget.css';

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `வணக்கம்! நான் உங்கள் **AgriEra AI** உதவியாளர் 🌿
Welcome! I'm your AgriEra agricultural & product assistant.

உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?
• **பொருட்கள் / Products**: உரங்கள், பூச்சி மருந்து, விதைகள் (Fertilizers, Bio-pesticides, Seeds)
• **பயிர் பராமரிப்பு / Crop Guidance**: தக்காளி, நெல், பருத்தி மற்றும் காய்கறி பயிர்கள்
• **ஆர்டர் உதவி / Website Help**: How to place an order, delivery & farm services

You can ask in **English, தமிழ், or Tanglish** (e.g. *"Tomato fertilizer venum"* or *"500 kulla fertilizer kaatu"*).`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const QUICK_ACTIONS = [
  { label: 'Find a Product', icon: <Search size={13} />, prompt: 'Show me best-selling fertilizers and boosters' },
  { label: 'Product Help', icon: <ShoppingBag size={13} />, prompt: '500 rupees kulla bio fertilizer iruka?' },
  { label: 'Crop Help', icon: <Sprout size={13} />, prompt: 'Tomato crop-ku enna nutrient and booster use panlam?' },
  { label: 'Website Help', icon: <HelpCircle size={13} />, prompt: 'Order epdi place panradhu?' },
];

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input on desktop only
      if (window.innerWidth > 768) {
        setTimeout(() => textareaRef.current?.focus(), 150);
      }
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(true);

    try {
      const historyPayload = updatedMessages
        .filter((m) => m.id !== 'welcome-msg' && !m.isError)
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await chatService.sendMessage(text, historyPayload);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.reply || 'மன்னிக்கவும், தகவல் பெற முடியவில்லை (No reply received).',
        products: response.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const friendlyError =
        err?.message && !err.message.includes('status code')
          ? err.message
          : 'Unable to connect to AgriEra AI. Please check your connection or try again.';

      setErrorMessage(friendlyError);

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'மன்னிக்கவும், தற்காலிகமாக பதிலளிக்க முடியவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.\n(Sorry, could not process your question right now. Please try again).',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    setErrorMessage(null);
    setInputMessage('');
  };

  const handleQuickAction = (promptText: string) => {
    if (isLoading) return;
    handleSendMessage(promptText);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lIdx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fb-chat-widget-container" aria-label="AgriEra AI Assistant">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          className="fb-chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AgriEra AI Chat"
          title="Chat with AgriEra AI Assistant"
        >
          <div className="fb-chat-toggle-icon-wrap">
            <Leaf size={20} className="fb-chat-leaf-icon" />
            <Sparkles size={11} className="fb-chat-sparkle-icon" />
          </div>
          <span className="fb-chat-toggle-label">AgriEra AI</span>
          <span className="fb-chat-pulse-indicator" />
        </button>
      )}

      {/* Floating Chat Panel with Mobile Backdrop */}
      {isOpen && (
        <>
          <div
            className="fb-chat-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fb-chat-window" role="dialog" aria-modal="true" aria-labelledby="fb-chat-title">
            {/* Mobile Drag Handle */}
            <div
              className="fb-chat-mobile-handle"
              onClick={() => setIsOpen(false)}
              aria-label="Swipe or click to close"
              title="Close"
            >
              <span className="fb-chat-handle-bar" />
            </div>

            {/* Header */}
            <div className="fb-chat-header">
              <div className="fb-chat-header-info">
                <div className="fb-chat-avatar">
                  <Leaf size={16} color="#ffffff" />
                  <span className="fb-chat-avatar-status" />
                </div>
                <div className="fb-chat-header-text">
                  <h3 id="fb-chat-title" className="fb-chat-title">
                    AgriEra AI
                  </h3>
                  <span className="fb-chat-status-text">விவசாயி AI • Online</span>
                </div>
              </div>

              <div className="fb-chat-header-actions">
                <button
                  type="button"
                  className="fb-chat-header-btn"
                  onClick={handleResetChat}
                  title="Clear & Restart Chat"
                  aria-label="Clear chat"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  className="fb-chat-header-btn fb-chat-close-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <ChevronDown size={17} className="fb-chat-desktop-hide" />
                  <X size={16} className="fb-chat-mobile-hide" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="fb-chat-quick-actions" aria-label="Quick suggestions">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="fb-chat-chip"
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={isLoading}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Messages Stream */}
            <div className="fb-chat-messages" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`fb-chat-message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'} ${
                    msg.isError ? 'error-row' : ''
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="fb-chat-msg-avatar" aria-hidden="true">
                      <Leaf size={13} color="#ffffff" />
                    </div>
                  )}

                  <div className="fb-chat-bubble-container">
                    <div className={`fb-chat-bubble ${msg.role}`}>
                      {msg.isError && <AlertCircle size={13} className="fb-chat-error-icon" />}
                      <div className="fb-chat-text-content">{renderFormattedText(msg.content)}</div>

                      {/* Associated Verified Product Cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="fb-chat-products-list">
                          <div className="fb-chat-products-label">
                            <Leaf size={11} />
                            <span>Recommended Products ({msg.products.length}):</span>
                          </div>
                          {msg.products.map((product) => (
                            <ChatProductCard
                              key={product.id}
                              product={product}
                              onNavigate={() => {
                                if (window.innerWidth < 768) {
                                  setIsOpen(false);
                                }
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="fb-chat-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="fb-chat-message-row assistant-row">
                  <div className="fb-chat-msg-avatar" aria-hidden="true">
                    <Leaf size={13} color="#ffffff" />
                  </div>
                  <div className="fb-chat-bubble-container">
                    <div className="fb-chat-bubble assistant fb-chat-typing-bubble">
                      <span className="fb-chat-dot" />
                      <span className="fb-chat-dot" />
                      <span className="fb-chat-dot" />
                    </div>
                    <span className="fb-chat-typing-label">Searching products & answering...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="fb-chat-footer">
              {errorMessage && (
                <div className="fb-chat-error-banner">
                  <span>{errorMessage}</span>
                  <button type="button" onClick={() => setErrorMessage(null)}>
                    Dismiss
                  </button>
                </div>
              )}

              <form
                className="fb-chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <textarea
                  ref={textareaRef}
                  className="fb-chat-textarea"
                  rows={1}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask in English, தமிழ் or Tanglish..."
                  maxLength={1000}
                  aria-label="Ask AgriEra AI a question"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  className="fb-chat-send-btn"
                  disabled={!inputMessage.trim() || isLoading}
                  aria-label="Send message"
                  title="Send (Enter)"
                >
                  <Send size={15} />
                </button>
              </form>

              <div className="fb-chat-footer-note">
                <span>🌾 AgriEra AI verified database catalog & agro guide.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
