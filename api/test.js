// Simple test endpoint to verify API deployment
module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Return simple test response
    res.status(200).json({
        success: true,
        message: 'API endpoint is working correctly',
        timestamp: new Date().toISOString(),
        method: req.method
    });
};