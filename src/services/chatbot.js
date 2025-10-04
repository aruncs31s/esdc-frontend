// Chatbot Service - Handle AI API calls
// This file can be extended to integrate with actual AI services like OpenAI, Google AI, etc.

const API_BASE_URL = 'https://esdc-backend.onrender.com';

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages for context (unused in mock, but kept for API compatibility)
 * @returns {Promise<string>} - AI response
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    // TODO: Replace with actual AI API endpoint
    // Example: OpenAI, Google Gemini, or custom backend endpoint
    
    // For now, using a mock response system
    // conversationHistory will be used when implementing actual AI API
    console.log('Conversation history available:', conversationHistory.length, 'messages');
    return getMockResponse(message);
    
    // Uncomment and modify when implementing actual AI API:
    /*
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from chatbot');
    }

    const data = await response.json();
    return data.response;
    */
  } catch (error) {
    console.error('Error in chatbot service:', error);
    throw error;
  }
};

/**
 * Mock response system - Replace with actual AI integration
 */
const getMockResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    greeting: [
      "Hello! Welcome to ESDC. How can I assist you today?",
      "Hi there! I'm here to help you with anything related to ESDC.",
      "Hey! Great to see you here. What can I help you with?"
    ],
    events: [
      "We organize various tech events, workshops, and hackathons throughout the year. Visit our Events page to see upcoming activities and register!",
      "Our events include coding competitions, tech talks, workshops, and networking sessions. Check the Events section for more details.",
    ],
    challenges: [
      "Check out our Challenges section to participate in coding competitions and improve your skills! We have challenges for all skill levels.",
      "Our challenges range from beginner-friendly problems to advanced algorithmic tasks. Participate to earn points and climb the leaderboard!",
    ],
    resources: [
      "We provide comprehensive learning resources including tutorials, documentation, study materials, and curated learning paths. Visit the Resources page for more details.",
      "Our resource library includes programming guides, project templates, video tutorials, and recommended courses. All free for members!",
    ],
    leaderboard: [
      "The leaderboard showcases top performers based on challenge completions and event participation. Keep participating to climb up the ranks!",
      "Points are awarded for completing challenges, attending events, and contributing to the community. Check the leaderboard to see where you stand!",
    ],
    registration: [
      "You can register by clicking the 'Register' button in the navigation bar. Join us to access all features including events, challenges, and resources!",
      "Registration is quick and easy! Just click 'Register' at the top of the page, fill in your details, and you're ready to go!",
    ],
    login: [
      "Click the 'Login' button in the navigation bar to access your account. If you don't have an account yet, you can register first.",
      "To log in, use the Login button at the top of the page. Make sure you've registered before attempting to log in.",
    ],
    profile: [
      "After logging in, you can view and edit your profile from the Dashboard or by clicking on your profile icon in the navigation bar.",
      "Your profile shows your achievements, completed challenges, event participation, and allows you to update your personal information.",
    ],
    contact: [
      "You can reach us through the Contact section on our website, or join our community channels on Discord, WhatsApp, or email us directly.",
      "For any queries, visit our Contact page or send us a message through our social media channels. We're always happy to help!",
    ],
    about: [
      "ESDC (Engineering Students Development Club) is a community-driven platform for students to learn, collaborate, and grow in tech. We organize events, challenges, and provide resources for skill development.",
      "We're a community of passionate tech enthusiasts helping each other grow. Join us to learn, collaborate on projects, and participate in exciting tech events!",
    ],
    join: [
      "To become a member, simply register on our platform and start participating in events and challenges. Everyone is welcome, regardless of skill level!",
      "Joining is free and open to all students! Register, complete your profile, and dive into our events and challenges.",
    ],
    help: [
      "I can help you with information about:\n• Events and workshops\n• Challenges and competitions\n• Learning resources\n• Registration and login\n• Leaderboard system\n• Profile management\n• General ESDC information\n\nWhat would you like to know more about?",
    ],
    default: [
      "I'm here to help! You can ask me about events, challenges, resources, registration, leaderboard, profile, or general information about ESDC. What would you like to know?",
      "That's an interesting question! For specific information, try asking about our events, challenges, resources, or how to get started with ESDC.",
      "I'd love to help you with that! You can ask me about joining ESDC, upcoming events, coding challenges, learning resources, or anything else related to our platform.",
    ]
  };

  // Match message to appropriate response category
  let category = 'default';
  
  if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
    category = 'greeting';
  } else if (lowerMessage.includes('event') || lowerMessage.includes('workshop') || lowerMessage.includes('hackathon')) {
    category = 'events';
  } else if (lowerMessage.includes('challenge') || lowerMessage.includes('competition') || lowerMessage.includes('coding')) {
    category = 'challenges';
  } else if (lowerMessage.includes('resource') || lowerMessage.includes('tutorial') || lowerMessage.includes('learn')) {
    category = 'resources';
  } else if (lowerMessage.includes('leaderboard') || lowerMessage.includes('ranking') || lowerMessage.includes('point')) {
    category = 'leaderboard';
  } else if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('signup')) {
    category = 'registration';
  } else if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('signin')) {
    category = 'login';
  } else if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
    category = 'profile';
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
    category = 'contact';
  } else if (lowerMessage.includes('about') || lowerMessage.includes('esdc') || lowerMessage.includes('what is')) {
    category = 'about';
  } else if (lowerMessage.includes('join') || lowerMessage.includes('member')) {
    category = 'join';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    category = 'help';
  }

  // Return random response from selected category
  const categoryResponses = responses[category];
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};

/**
 * Get quick action suggestions based on context
 */
export const getQuickActions = () => {
  return [
    { label: 'Events', message: 'Tell me about upcoming events' },
    { label: 'Challenges', message: 'What challenges are available?' },
    { label: 'Resources', message: 'Show me learning resources' },
    { label: 'How to join?', message: 'How can I join ESDC?' },
    { label: 'Leaderboard', message: 'How does the leaderboard work?' },
    { label: 'Contact', message: 'How can I contact ESDC?' },
  ];
};

/**
 * Save chat history to local storage
 */
export const saveChatHistory = (messages) => {
  try {
    localStorage.setItem('chatbot_history', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

/**
 * Load chat history from local storage
 */
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem('chatbot_history');
    return history ? JSON.parse(history) : null;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return null;
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem('chatbot_history');
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

export default {
  sendChatMessage,
  getQuickActions,
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
};
