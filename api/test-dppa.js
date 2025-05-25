const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'DPPA API Test - Working! Fixed syntax error.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    hasGroqKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    version: '1.1'
  });
};

export default handler;