// Quick environment debug endpoint
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check environment variables (safely)
    const groqApiKey = process.env.GROQ_API_KEY_NEW || process.env.GROQ_API_KEY;
    const hasGroqKey = !!groqApiKey;
    const keyPrefix = groqApiKey ? groqApiKey.substring(0, 8) + '...' : 'NOT_SET';
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasGroqApiKey: hasGroqKey,
      keyPrefix: keyPrefix,
      nodeEnv: process.env.NODE_ENV || 'not_set',
      vercelEnv: process.env.VERCEL_ENV || 'not_set',
      // Test a simple Groq API call
      testGroqConnection: false
    };

    // If we have the key, test connectivity
    if (hasGroqKey) {
      try {
        const testResponse = await fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`
          }
        });
        
        debugInfo.testGroqConnection = testResponse.ok;
        debugInfo.groqResponseStatus = testResponse.status;
        
        if (testResponse.ok) {
          const models = await testResponse.json();
          debugInfo.availableModels = models.data ? models.data.length : 0;
        } else {
          debugInfo.groqError = await testResponse.text();
        }
      } catch (error) {
        debugInfo.groqConnectionError = error.message;
      }
    }

    return res.status(200).json(debugInfo);
  } catch (error) {
    return res.status(500).json({
      error: 'Debug endpoint error',
      message: error.message
    });
  }
};

export default handler;