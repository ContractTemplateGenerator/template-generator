export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    // Simple test API call to Groq
    if (apiKey) {
      try {
        const testResponse = await fetch('https://api.groq.com/openai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        const testData = await testResponse.json();
        
        return res.status(200).json({
          status: 'SUCCESS',
          hasApiKey: true,
          apiKeyLength: apiKey.length,
          apiKeyStart: apiKey.substring(0, 12) + '...',
          apiWorking: testResponse.ok,
          modelsAvailable: testResponse.ok ? testData.data?.length || 0 : 0,
          environment: process.env.NODE_ENV || 'production',
          timestamp: new Date().toISOString(),
          vercelRegion: process.env.VERCEL_REGION || 'unknown'
        });
      } catch (apiError) {
        return res.status(200).json({
          status: 'API_ERROR',
          hasApiKey: true,
          apiKeyLength: apiKey.length,
          apiKeyStart: apiKey.substring(0, 12) + '...',
          apiWorking: false,
          error: apiError.message,
          environment: process.env.NODE_ENV || 'production',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      return res.status(200).json({
        status: 'NO_API_KEY',
        hasApiKey: false,
        apiKeyLength: 0,
        apiKeyStart: 'Not found',
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString(),
        allEnvVars: Object.keys(process.env).filter(key => key.includes('GROQ') || key.includes('API'))
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}