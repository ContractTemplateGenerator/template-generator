// Node.js proxy server for eSignatures.com API
const http = require('http');
const https = require('https');
const url = require('url');

const API_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
const API_BASE_URL = 'https://esignatures.com/api';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Only handle POST requests to /esign-proxy
    if (req.method !== 'POST' || req.url !== '/esign-proxy') {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            console.log('Received request:', data);

            // Try templates endpoint first
            makeAPICall('/templates', data, (success, result) => {
                if (success) {
                    console.log('Templates API success:', result);
                    res.writeHead(200);
                    res.end(JSON.stringify(result));
                } else {
                    console.log('Templates failed, trying contracts...');
                    
                    // Try contracts endpoint with different format
                    const contractData = {
                        test: data.test || 'yes',
                        title: data.template?.title || 'Document',
                        document_content: data.template?.content || '',
                        signers: data.signers || []
                    };

                    makeAPICall('/contracts', contractData, (success2, result2) => {
                        if (success2) {
                            console.log('Contracts API success:', result2);
                            res.writeHead(200);
                            res.end(JSON.stringify(result2));
                        } else {
                            console.log('Both APIs failed:', result2);
                            res.writeHead(400);
                            res.end(JSON.stringify(result2));
                        }
                    });
                }
            });

        } catch (error) {
            console.error('JSON parse error:', error);
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
});

function makeAPICall(endpoint, data, callback) {
    const postData = JSON.stringify(data);
    
    const options = {
        hostname: 'esignatures.com',
        port: 443,
        path: '/api' + endpoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_TOKEN,
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log(`Making API call to ${endpoint}:`, options);

    const req = https.request(options, (res) => {
        let responseBody = '';
        
        res.on('data', (chunk) => {
            responseBody += chunk;
        });
        
        res.on('end', () => {
            try {
                const result = JSON.parse(responseBody);
                callback(res.statusCode >= 200 && res.statusCode < 300, result);
            } catch (error) {
                callback(false, { error: 'Invalid JSON response', raw: responseBody });
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error);
        callback(false, { error: error.message });
    });

    req.write(postData);
    req.end();
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`eSignature proxy server running on http://localhost:${PORT}`);
    console.log('Use /esign-proxy endpoint for API calls');
});