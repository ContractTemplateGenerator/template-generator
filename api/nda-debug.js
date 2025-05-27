// Ultra-simple test API to debug the issue
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('=== API CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  console.log('Has Groq Key:', !!process.env.GROQ_API_KEY);

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API is working',
      timestamp: new Date().toISOString(),
      hasGroqKey: !!process.env.GROQ_API_KEY
    });
  }

  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array required' });
      }

      // Test Groq API directly
      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: 'No Groq API key' });
      }

      console.log('Calling Groq API...');
      
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a California attorney analyzing NDAs. Respond in HTML format with <strong> tags.'
            },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.2
        })
      });

      console.log('Groq response status:', groqResponse.status);

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        console.log('Groq success');
        
        return res.status(200).json({
          response: data.choices[0].message.content,
          model: 'llama-3.3-70b-versatile',
          debug: 'Success'
        });
      } else {
        const errorText = await groqResponse.text();
        console.log('Groq error:', errorText);
        
        return res.status(500).json({
          error: 'Groq API failed',
          details: errorText,
          debug: 'Groq API error'
        });
      }
    } catch (error) {
      console.log('Catch error:', error.message);
      
      return res.status(500).json({
        error: 'Server error',
        message: error.message,
        debug: 'Catch block'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler;