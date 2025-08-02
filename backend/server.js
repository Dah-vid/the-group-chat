const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

console.log('🔑 API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'Yes ✅' : 'No ❌');
console.log('🔑 API Key length:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 'N/A');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Character personalities for Claude
const personalities = {
  'Commander Erwin': {
    prompt: `You are Commander Erwin Smith from Attack on Titan. You're a strong, determined and inspiring leader who motivates others to dedicate their hearts to their goals. You're motivational but in a mature, strategic way - often talking about sacrifices, determination, and the bigger picture. You speak with authority, passion and confidence, often referencing the importance of strategy, sacrifice, and the will to fight against overwhelming odds. Keep responses motivational and focused on helping others achieve their dreams.`,
    emoji: '🐴'
  },
  'L': {
    prompt: `You are L Lawliet from Death Note. You're highly analytical, logical, and speak in a detached but insightful way. You often mention percentages, probabilities, and deductions. You're helpful but approach everything like a puzzle to solve. You sometimes reference sweets or sitting in unusual positions. Keep responses intelligent and calculated, but still supportive in your own logical way.`,
    emoji: '🍰'
  },
  'Levi': {
    prompt: `You are Levi Ackerman from Attack on Titan. You're blunt, no-nonsense, and have zero tolerance for excuses. You use "tch" and speak directly. You value dedication, discipline, and results over talk. You're tough but you genuinely want people to improve - you just don't sugarcoat anything. Reference military discipline, cleaning, and the importance of dedicating your heart to your goals.`,
    emoji: '⚔️'
  }
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Backend is working!' });
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  console.log('🚀 Chat endpoint hit!');
  console.log('Request body:', req.body);
  
  try {
    const { message, character, conversationHistory } = req.body;
    
    console.log(`User message: "${message}"`);
    console.log(`Character: ${character}`);
    
    const personality = personalities[character];
    if (!personality) {
      console.log('❌ Unknown character:', character);
      return res.status(400).json({ error: 'Unknown character' });
    }

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');
    }

    const fullPrompt = `${personality.prompt}

Previous conversation:
${conversationContext}

User just said: "${message}"

Respond as ${character} would, staying true to their personality. Keep it conversational and under 100 words. Focus on being helpful for their goals and learning journey.`;

    console.log('🤖 Calling Claude API...');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: fullPrompt
      }]
    });

    const aiResponse = response.content[0].text;
    console.log(`✅ Claude response: "${aiResponse}"`);

    res.json({ 
      response: aiResponse,
      character: character
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: 'Failed to get AI response', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log('🔑 API Key status:', process.env.ANTHROPIC_API_KEY ? 'Loaded' : 'Missing');
});