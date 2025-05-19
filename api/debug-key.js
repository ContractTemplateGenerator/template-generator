// Debug script to test API key
const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // Return debug info about the API key
    const debugInfo = {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'N/A',
      startsWithCorrectPrefix: apiKey ? apiKey.startsWith('sk-ant-api03-') : false,
      timestamp: new Date().toISOString()
    };

    // Try a simple API call to test the key
    if (apiKey) {
      try {
        const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }]
          })
        });

        debugInfo.apiTest = {
          status: testResponse.status,
          ok: testResponse.ok,
          statusText: testResponse.statusText
        };

        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          debugInfo.apiTest.error = errorText;
        }
      } catch (apiError) {
        debugInfo.apiTest = {
          error: apiError.message
        };
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