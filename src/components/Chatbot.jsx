import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaTrash } from 'react-icons/fa';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm the ESDC Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm the ESDC Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  };

  const getAIResponse = async (userMessage) => {
    // Simulate AI response - Replace this with actual AI API call
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! Welcome to ESDC. How can I assist you today?";
    } else if (lowerMessage.includes('event')) {
      response = "We organize various tech events, workshops, and hackathons. Visit our Events page to see upcoming activities!";
    } else if (lowerMessage.includes('challenge')) {
      response = "Check out our Challenges section to participate in coding competitions and improve your skills!";
    } else if (lowerMessage.includes('resource')) {
      response = "We provide learning resources including tutorials, documentation, and study materials. Visit the Resources page for more details.";
    } else if (lowerMessage.includes('leaderboard')) {
      response = "The leaderboard showcases top performers based on challenge completions and event participation. Keep participating to climb up!";
    } else if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
      response = "You can register by clicking the 'Register' button in the navigation bar. Join us to access all features!";
    } else if (lowerMessage.includes('login')) {
      response = "Click the 'Login' button in the navigation bar to access your account.";
    } else if (lowerMessage.includes('profile')) {
      response = "After logging in, you can view and edit your profile from the Dashboard or by clicking on your profile icon.";
    } else if (lowerMessage.includes('contact')) {
      response = "You can reach us through the Contact section on our website, or join our community channels!";
    } else if (lowerMessage.includes('about') || lowerMessage.includes('esdc')) {
      response = "ESDC (Engineering Students Development Club) is a community-driven platform for students to learn, collaborate, and grow in tech. We organize events, challenges, and provide resources for skill development.";
    } else if (lowerMessage.includes('join') || lowerMessage.includes('member')) {
      response = "To become a member, register on our platform and start participating in events and challenges. Everyone is welcome!";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      response = "I can help you with information about:\n• Events and workshops\n• Challenges and competitions\n• Learning resources\n• Registration and login\n• Leaderboard system\n• General ESDC information\n\nWhat would you like to know more about?";
    } else {
      response = "I'm here to help! You can ask me about events, challenges, resources, registration, leaderboard, or general information about ESDC. What would you like to know?";
    }
    
    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = await getAIResponse(inputMessage);
      
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickActions = [
    { label: 'Events', message: 'Tell me about events' },
    { label: 'Challenges', message: 'What challenges are available?' },
    { label: 'Resources', message: 'Show me learning resources' },
    { label: 'How to join?', message: 'How can I join ESDC?' },
  ];

  const handleQuickAction = (message) => {
    setInputMessage(message);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label="Toggle chatbot"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <FaRobot className="chatbot-header-icon" />
              <div>
                <h3>ESDC Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                onClick={clearChat}
                className="chatbot-header-btn"
                aria-label="Clear chat"
              >
                <FaTrash />
              </button>
              <button
                onClick={toggleChat}
                className="chatbot-header-btn"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chatbot-message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && !isTyping && (
            <div className="chatbot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.message)}
                  className="quick-action-btn"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input-container" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
