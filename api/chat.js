// API endpoint for Claude chatbox
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
    const { message, contractType = 'Legal Document', formData = {}, documentText = '' } = req.body;

    console.log('Received request:', { message, contractType });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('No API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare the system prompt
    const systemPrompt = `You are a legal assistant helping users understand contract generators. 

Current context:
- Contract type: ${contractType}
- User form data: ${JSON.stringify(formData, null, 2)}
- Document preview: ${documentText.substring(0, 500)}...

Guidelines:
- Provide clear, practical legal explanations in plain English
- Explain legal concepts and clauses without giving specific legal advice
- Suggest improvements when appropriate
- Always remind users to have contracts reviewed by a lawyer
- Keep responses concise but helpful`;

    // Make request to Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser question: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Failed to get response from AI assistant',
        details: errorText
      });
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    console.log('Successful response generated');

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;