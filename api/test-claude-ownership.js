// Simple test endpoint to verify API is working
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Claude Ownership API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      hasApiKey: !!process.env.GROQ_API_KEY,
      keyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + '...' : 'Not found'
    });
  }

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      return res.status(200).json({
        message: 'POST request received successfully!',
        receivedMessage: message || 'No message provided',
        timestamp: new Date().toISOString(),
        hasApiKey: !!process.env.GROQ_API_KEY,
        keyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + '...' : 'Not found'
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error processing POST request',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}