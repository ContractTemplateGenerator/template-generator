// Simple test endpoint to verify API is working
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

  console.log('Test API called with method:', req.method);
  console.log('Request body:', req.body);
  console.log('Groq API Key exists:', !!process.env.GROQ_API_KEY);

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Test API is working',
      timestamp: new Date().toISOString(),
      hasGroqKey: !!process.env.GROQ_API_KEY
    });
  }

  if (req.method === 'POST') {
    const { ndaText } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'No Groq API key configured' });
    }

    // Try a simple Groq API call
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: 'Say "API test successful" if you can read this.'
            }
          ],
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ 
          success: true,
          groqResponse: data.choices[0].message.content,
          ndaTextLength: ndaText ? ndaText.length : 0
        });
      } else {
        const errorText = await response.text();
        return res.status(500).json({ 
          error: 'Groq API failed',
          details: errorText
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        error: 'Groq API error',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler;