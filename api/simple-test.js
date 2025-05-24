export default function handler(req, res) {
  return res.status(200).json({ 
    message: 'Simple test API works!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}