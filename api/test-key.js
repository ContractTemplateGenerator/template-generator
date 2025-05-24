// Simple API key test endpoint
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hasKey = !!process.env.GROQ_API_KEY;
    const keyPrefix = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + '...' : 'Not found';
    
    return res.status(200).json({
      hasApiKey: hasKey,
      keyPrefix: keyPrefix,
      timestamp: new Date().toISOString(),
      message: hasKey ? 'API key is configured' : 'API key is missing'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
}