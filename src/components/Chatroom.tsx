import { useState, useEffect, useRef } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import '../styles/chatroom.css';

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface ChatroomProps {
  onClose: () => void;
}

export function Chatroom({ onClose }: ChatroomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [useMock, setUseMock] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:9090/ws/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log('📨 Received message:', event.data);
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setUseMock(true);
      setMessages([
        {
          id: '1',
          userId: '1',
          username: 'Alice',
          text: 'Hey everyone! Welcome to the chat!',
          timestamp: new Date(Date.now() - 10 * 60000)
        },
        {
          id: '2',
          userId: '2',
          username: 'Bob',
          text: 'Thanks! Excited to be here.',
          timestamp: new Date(Date.now() - 8 * 60000)
        }
      ]);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const message = {
      userId: user?.id || 'anonymous',
      username: user?.name || 'Anonymous',
      text: inputText.trim()
    };

    if (useMock) {
      setMessages(prev => [...prev, {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date()
      }]);
    } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('❌ WebSocket not connected');
    }
    
    setInputText('');
  };

  return (
    <div className="chatroom-overlay" onClick={onClose}>
      <div className="chatroom-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatroom-header">
          <div>
            <h3>Community Chat</h3>
            <span style={{ fontSize: '0.75rem', color: connected ? 'var(--green)' : 'var(--yellow)' }}>
              {connected ? '• Connected' : useMock ? '• Mock Mode' : '• Connecting...'}
            </span>
          </div>
          <button onClick={onClose} className="close-btn">
            <FiX size={20} />
          </button>
        </div>

        <div className="chatroom-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.userId === user?.id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-username">{msg.username}</span>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatroom-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
          />
          <button type="submit" disabled={!inputText.trim()}>
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatroom;
