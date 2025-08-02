import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Commander Erwin', text: 'Soldier! Are you ready to dedicate your heart to achieving your goals!' },
    { id: 2, sender: 'L', text: 'Interesting... I calculate a 97.3% probability that you\'re here to improve yourself. What\'s your strategy?' },
    { id: 3, sender: 'Levi', text: 'Tch. Another person who talks about goals. Show me results, not words.' }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Available characters
  const characters = ['Commander Erwin', 'L', 'Levi'];

  // Function to call our backend API
  const getAIResponse = async (userMessage) => {
    try {
      // Pick a random character to respond
      const character = characters[Math.floor(Math.random() * characters.length)];
      
      // Get recent conversation history for context
      const conversationHistory = messages.slice(-10);
      
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          character: character,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return {
        character: data.character,
        response: data.response
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to hardcoded response if API fails
      return {
        character: 'Commander Erwin',
        response: 'Something went wrong, but don\'t give up! My soldiers do not buckle or yield when faced with the cruelty of this world!'
      };
    }
  };

  // Function to add user message and get AI response
  const addMessage = async () => {
    if (inputText.trim()) {
      const userMessage = {
        id: Date.now(),
        sender: 'You',
        text: inputText
      };
      
      // Add user message immediately
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Store the input and clear it
      const currentInput = inputText;
      setInputText('');
      setIsLoading(true);
      
      try {
        // Get AI response
        const aiData = await getAIResponse(currentInput);
        
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          sender: aiData.character,
          text: aiData.response
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      addMessage();
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1>The Group Chat</h1>
        <div className="ai-info">
          <span className="ai-commander-erwin">Commander Erwin 🐴</span>
          <span className="ai-l">L 🍰</span>
          <span className="ai-levi">Levi ⚔️</span>
          {isLoading && <span className="loading">🤔 Thinking...</span>}
        </div>
        
        {/* Messages Display */}
        <div className="messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'You' ? 'user-message' : 'ai-message'}`}
            >
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="message ai-message loading-message">
              <strong>AI:</strong> <span className="typing-indicator">●●●</span>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your goals, progress, or challenges..."
            disabled={isLoading}
          />
          <button 
            onClick={addMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;