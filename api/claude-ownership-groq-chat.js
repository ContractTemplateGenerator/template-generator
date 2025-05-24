export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'GET works!' });
  }
  
  if (req.method === 'POST') {
    return res.status(200).json({ message: 'POST works!' });
  }
  
  return res.status(200).json({ message: 'Any method works!' });
}