export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    const response = {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyStart: apiKey ? apiKey.substring(0, 8) + '...' : 'Not found',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}