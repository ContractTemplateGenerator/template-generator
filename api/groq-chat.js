// API endpoint for Groq chatbox - Strategic NDA Assistant
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
    const { message, contractType = 'Strategic NDA', formData = {}, documentText = '' } = req.body;

    console.log('Received Groq request:', { message, contractType });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Strategic NDA-specific system prompt
    const systemPrompt = `You are a specialized legal assistant for Strategic Non-Disclosure Agreements (NDAs). 

Your expertise includes:
- Explaining NDA clauses in plain English
- Identifying potential risks and protections
- Suggesting improvements for better legal protection
- Advising on negotiation points
- Clarifying mutual vs. unilateral NDAs
- Duration and termination provisions
- Remedies for breach

Current context:
- Contract type: ${contractType}
- User form data: ${JSON.stringify(formData, null, 2)}
- Document preview: ${documentText.substring(0, 500)}...

Guidelines:
- Provide clear, practical legal explanations
- Focus specifically on NDA-related concepts
- Suggest specific improvements when appropriate
- Always remind users that complex situations require attorney review
- Be concise but comprehensive
- Use examples when helpful
- Avoid giving specific legal advice - provide general education

If asked about non-NDA topics, politely redirect to NDA-related questions.`;

    // Make request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Currently supported Llama 3 model
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
        temperature: 0.3 // Lower temperature for more consistent legal advice
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      if (response.status === 401) {
        console.error('Groq authentication failed - check API key');
        return res.status(500).json({ 
          error: 'authentication_error',
          type: 'error',
          message: 'Groq API authentication failed'
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to get response from legal assistant',
        details: errorText
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Successful Groq response generated');

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: 'llama3-8b-8192'
    });

  } catch (error) {
    console.error('Error in Groq chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;// Force redeploy Mon May 19 01:23:23 PDT 2025
// Force redeploy Mon May 19 05:58:33 PDT 2025
