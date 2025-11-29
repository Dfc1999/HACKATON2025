import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { sendMessageToAI } from '../services/ChatService.js';
import './Chat.css';

function Chat({ isLoggedIn, user }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickMessages = [
    '¿Qué citas agendamos hoy?',
    '¿Qué necesitas saber?',
    '¿Tienes alguna queja o sugerencia?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    const textToSend = messageText || inputMessage.trim();
    
    if (!textToSend) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(textToSend, user);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMessage = (message) => {
    handleSendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="chat-section">
      <div className="chat-header">
        <Bot size={32} className="chat-icon" />
        <div>
          <h2>Asistente Virtual Nexus</h2>
          <p>¿En qué podemos ayudarte hoy?</p>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="quick-messages">
          <p className="quick-messages-title">Preguntas frecuentes:</p>
          <div className="quick-messages-grid">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                className="quick-message-btn"
                onClick={() => handleQuickMessage(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-icon">
              {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('es-BO', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai-message">
            <div className="message-icon">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje aquí..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </section>
  );
}

export default Chat;