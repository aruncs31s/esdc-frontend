import { useState, useRef, useEffect } from 'react';
import { askChatBot } from '../services/chatbot';

export interface ChatbotResponse {
  response: string;
}

// SVG Icons as components
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-white block border-gray-200 align-middle">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200"></path>
  </svg>
);

const AIIcon = () => (
  <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
  </svg>
);

const UserIcon = () => (
  <svg stroke="none" fill="black" strokeWidth="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, how can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    console.log('Toggle chat clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send message clicked, input:', inputMessage);

    if (!inputMessage.trim()) {
      console.log('Input is empty, returning');
      return;
    }

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
      // Call the actual backend API
      const result = await askChatBot(inputMessage);
      const aiResponse = result.data.response;
      console.log('AI Response:', aiResponse);
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse || "Sorry, I couldn't find any information about that.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 p-0 normal-case leading-5 hover:text-gray-900"
        style={{ zIndex: 10000 }}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={toggleChat}
      >
        <ChatIcon />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)', zIndex: 9999 }}
          className="fixed bottom-0 right-0 bg-white rounded-lg border border-[#e5e7eb] 
                     w-full h-full sm:bottom-[calc(4rem+1.5rem)] sm:right-4 sm:mr-0 sm:w-[440px] sm:h-[634px] sm:rounded-lg
                     p-4 sm:p-6"
        >
          {/* Heading */}
          <div className="flex flex-col space-y-1.5 pb-4 sm:pb-6">
            <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
            <p className="text-sm text-[#6b7280] leading-3">Powered by ESDC</p>
          </div>

          {/* Chat Container */}
          <div className="pr-2 sm:pr-4 overflow-y-auto flex-1" style={{ height: 'calc(100% - 140px)' }}>
            {messages.map((message) => (
              <div key={message.id} className="flex gap-2 sm:gap-3 my-3 sm:my-4 text-gray-600 text-sm">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-7 h-7 sm:w-8 sm:h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    {message.sender === 'bot' ? <AIIcon /> : <UserIcon />}
                  </div>
                </span>
                <p className="leading-relaxed break-words flex-1">
                  <span className="block font-bold text-gray-700">
                    {message.sender === 'bot' ? 'AI' : 'You'}
                  </span>
                  {message.text}
                </p>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <AIIcon />
                  </div>
                </span>
                <p className="leading-relaxed">
                  <span className="block font-bold text-gray-700">AI</span>
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </span>
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div className="flex items-center pt-0 mt-2 sm:mt-0">
            <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
              <input
                ref={inputRef}
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-3 sm:px-4 py-2 flex-shrink-0"
                disabled={!inputMessage.trim() || isTyping}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
