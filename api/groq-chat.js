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

    // Try different models in order of preference (based on current Groq availability)
    const models = [
      'llama-3.1-8b-instant',  // Best balance of speed and capability
      'llama3-70b-8192',       // Most powerful for complex legal reasoning
      'llama3-8b-8192',        // Backup option
      'gemma2-9b-it'           // Alternative if Llama models fail
    ];
    
    let assistantMessage = null;
    let modelUsed = null;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
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
          console.log(`Success with model: ${model}`);
          break;
        } else {
          const errorText = await response.text();
          console.log(`Model ${model} failed:`, errorText);
          continue;
        }
      } catch (error) {
        console.log(`Model ${model} error:`, error.message);
        continue;
      }
    }
    
    if (!assistantMessage) {
      console.error('All models failed');
      return res.status(500).json({ 
        error: 'All available models failed',
        details: 'Please try again later'
      });
    }

    console.log('Successful Groq response generated');

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: modelUsed
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
