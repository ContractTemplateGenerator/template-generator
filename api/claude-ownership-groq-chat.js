export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      response: "I can help you understand Claude AI output ownership. You generally own the outputs you create, but there are important considerations about third-party rights and copyright protection. What specific aspect would you like to know more about?",
      timestamp: new Date().toISOString(),
      model: "test-response"
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}