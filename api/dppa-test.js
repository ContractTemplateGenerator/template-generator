// Simple test API for DPPA - matches working pattern exactly
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
    message: 'DPPA Test API - Working with simplified naming!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    hasGroqKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    version: '4.0-SIMPLIFIED'
  });
};

export default handler;