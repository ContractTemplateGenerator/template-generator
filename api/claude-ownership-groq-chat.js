// API endpoint for Groq chatbox - Claude AI Output Ownership Assistant
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      message, 
      articleContext = '',
      conversationHistory = [],
      isFollowUpQuestion = false
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Claude AI Output Ownership specific system prompt
    const systemPrompt = `You are a specialized legal assistant focused on AI-generated content ownership, specifically regarding Claude AI and similar language models.

Your expertise includes:
- Explaining ownership rights of AI-generated content
- Clarifying Claude's Terms of Service regarding output ownership
- Discussing copyright implications of AI outputs
- Explaining fair use and transformative use concepts
- Advising on commercial use of AI-generated content
- Discussing attribution requirements
- Explaining the difference between AI tools as services vs. ownership claims

KEY LEGAL PRINCIPLES:
1. **Service Provider Model**: Anthropic operates as a service provider, users generally own outputs
2. **User Ownership**: Subject to input ownership and third-party rights
3. **Copyright Complexity**: AI outputs may not qualify for copyright protection
4. **Commercial Use**: Generally permitted with proper safeguards
5. **Attribution**: Not legally required but may be ethically appropriate

RESPONSE STYLE:
- Provide clear, practical explanations
- Use examples to illustrate concepts
- Acknowledge legal uncertainties
- Suggest best practices
- Recommend consulting attorneys for specific situations

Current context: ${articleContext}
${isFollowUpQuestion ? 'This is a follow-up question in an ongoing conversation.' : 'This is the start of a new conversation.'}`;

    // Try different models
    const models = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'gemma2-9b-it'
    ];
    
    let assistantMessage = null;
    let modelUsed = null;
    
    for (const model of models) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 1000,
            temperature: 0.3
          })
        });

        if (response.ok) {
          const data = await response.json();
          assistantMessage = data.choices[0].message.content;
          modelUsed = model;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!assistantMessage) {
      return res.status(500).json({ 
        error: 'All available models failed',
        details: 'Please try again later'
      });
    }

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: modelUsed
    });

  } catch (error) {
    console.error('Error in Claude AI ownership chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;