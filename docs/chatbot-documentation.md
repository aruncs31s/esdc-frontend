# AI Chatbot Documentation

## Overview
The ESDC AI Chatbot is an intelligent assistant that helps users navigate the platform, answer questions, and provide information about events, challenges, resources, and more.

## Features

### ✨ Key Features
- **Real-time Chat Interface**: Modern, responsive chat UI with smooth animations
- **Smart Responses**: Context-aware responses to user queries
- **Quick Actions**: Pre-defined quick action buttons for common questions
- **Message History**: Persistent chat history during the session
- **Typing Indicators**: Visual feedback when the bot is processing
- **Dark Mode Support**: Seamlessly adapts to light/dark theme
- **Mobile Responsive**: Optimized for all screen sizes

### 🤖 Bot Capabilities
The chatbot can answer questions about:
- Events and workshops
- Coding challenges and competitions
- Learning resources and tutorials
- Registration and login process
- Leaderboard system
- Profile management
- General ESDC information
- Contact and support

## File Structure

```
src/
├── components/
│   └── Chatbot.jsx          # Main chatbot component
├── services/
│   └── chatbot.js           # Chatbot service and API logic
└── styles/
    └── chatbot.css          # Chatbot styles
```

## Usage

### Basic Implementation
The chatbot is already integrated into your app and appears as a floating button on all pages.

```jsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div>
      <Chatbot />
      {/* Rest of your app */}
    </div>
  );
}
```

### User Interaction
1. Click the floating robot icon in the bottom-right corner
2. Type a question or click a quick action button
3. Receive instant responses from the AI assistant
4. Continue the conversation naturally

## Customization

### Modifying Responses
Edit the `getAIResponse` function in `Chatbot.jsx` or the `getMockResponse` function in `services/chatbot.js`:

```javascript
// In src/services/chatbot.js
const getMockResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Add your custom logic here
  if (lowerMessage.includes('your_keyword')) {
    return 'Your custom response';
  }
  
  // ...existing logic
};
```

### Adding Quick Actions
Modify the `quickActions` array in `Chatbot.jsx`:

```jsx
const quickActions = [
  { label: 'Events', message: 'Tell me about events' },
  { label: 'New Action', message: 'Your prompt message' },
  // Add more quick actions
];
```

### Styling Customization
Edit `src/styles/chatbot.css` to customize colors, sizes, and animations:

```css
/* Change chatbot theme colors */
.chatbot-toggle {
  background: linear-gradient(135deg, #your-color 0%, #another-color 100%);
}
```

## Integration with AI Services

### OpenAI Integration
To integrate with OpenAI's GPT:

1. Install the OpenAI package:
```bash
npm install openai
```

2. Update `src/services/chatbot.js`:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for ESDC platform..."
        },
        ...conversationHistory,
        { role: "user", content: message }
      ],
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
};
```

3. Add your API key to `.env`:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Google Gemini Integration
To integrate with Google Gemini:

1. Install the Google Generative AI package:
```bash
npm install @google/generative-ai
```

2. Update `src/services/chatbot.js`:
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    throw error;
  }
};
```

### Backend Integration
To use your own backend:

```javascript
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Backend Error:', error);
    throw error;
  }
};
```

## Advanced Features

### Context-Aware Responses
The chatbot can be enhanced to provide context-aware responses based on:
- Current user's role (student, admin, etc.)
- Current page location
- User's activity history
- Time-based information (upcoming events, deadlines)

### Multi-language Support
Add translation capabilities:

```javascript
import i18n from 'i18next';

const getLocalizedResponse = (key) => {
  return i18n.t(`chatbot.responses.${key}`);
};
```

### Analytics Integration
Track chatbot usage:

```javascript
const trackChatbotEvent = (eventName, data) => {
  // Google Analytics
  gtag('event', eventName, data);
  
  // Or custom analytics
  analytics.track(eventName, data);
};
```

## Performance Optimization

### Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const Chatbot = lazy(() => import('./components/Chatbot'));

function App() {
  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
}
```

### Debouncing
For API calls, implement debouncing to reduce server load:

```javascript
import { debounce } from 'lodash';

const debouncedSendMessage = debounce(async (message) => {
  return await sendChatMessage(message);
}, 500);
```

## Troubleshooting

### Chatbot Not Appearing
- Check if `Chatbot` component is imported in `App.jsx`
- Verify CSS is properly imported
- Check z-index conflicts with other elements

### Responses Not Working
- Check console for errors
- Verify API endpoints are correct
- Check network tab for failed requests

### Styling Issues
- Clear browser cache
- Check if dark mode classes are properly applied
- Verify CSS variables are defined

## Security Best Practices

1. **Never expose API keys in frontend code**
   - Use environment variables
   - Implement server-side proxy for API calls

2. **Sanitize user input**
   ```javascript
   const sanitizeInput = (input) => {
     return input.trim().replace(/[<>]/g, '');
   };
   ```

3. **Rate limiting**
   - Implement rate limiting on backend
   - Add client-side throttling

4. **Content filtering**
   - Filter inappropriate content
   - Implement moderation system

## Future Enhancements

- [ ] Voice input/output support
- [ ] File sharing capability
- [ ] Integration with knowledge base
- [ ] Advanced NLP for better understanding
- [ ] Multilingual support
- [ ] Analytics dashboard
- [ ] User feedback system
- [ ] Bot training interface

## Support

For issues or questions:
- Check the documentation
- Review example code
- Contact ESDC development team

## License

This chatbot implementation is part of the ESDC platform and follows the same license.
