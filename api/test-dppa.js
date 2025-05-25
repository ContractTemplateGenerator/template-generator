// Simple test API for DPPA endpoints
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

  return res.status(200).json({
    message: 'DPPA API TEST - EXACT STRUCTURE MATCH!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    hasGroqKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    version: '3.0-EXACT-MATCH',
    deployTime: 'May 24 8:25 PM'
  });
};

export default handler;