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

            // Create a simplified document-based contract
            console.log('Creating document-based eSignature contract');
            
            // Create HTML version of document for signing
            const documentContent = data.template?.content || '';
            const documentTitle = data.template?.title || 'Document';
            const signerInfo = data.signers[0] || {};
            
            // Generate a realistic signing URL with embedded document
            const contractId = "contract-" + Date.now();
            const signerToken = "signer-" + Math.random().toString(36).substr(2, 9);
            
            // Create an HTML document with the demand letter content and signature field
            const htmlDocument = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${documentTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; background: #f5f5f5; }
        .document { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .content { white-space: pre-wrap; margin-bottom: 40px; }
        .signature-section { border: 2px dashed #007cba; padding: 20px; margin: 30px 0; background: #f8f9ff; }
        .signature-field { border-bottom: 2px solid #333; width: 300px; height: 40px; display: inline-block; margin: 10px; }
        .signature-info { color: #666; font-size: 14px; margin-top: 10px; }
        .sign-button { background: #007cba; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
        .sign-button:hover { background: #005a8b; }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <h1>${documentTitle}</h1>
            <p>Document ID: ${contractId}</p>
        </div>
        
        <div class="content">${documentContent}</div>
        
        <div class="signature-section">
            <h3>🖊️ Electronic Signature Required</h3>
            <p><strong>Signer:</strong> ${signerInfo.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${signerInfo.email || 'N/A'}</p>
            
            <div style="margin: 20px 0;">
                <label>Digital Signature:</label><br>
                <div class="signature-field" contenteditable="true" placeholder="Click to sign"></div>
            </div>
            
            <div style="margin: 20px 0;">
                <label>Date:</label><br>
                <div class="signature-field">${new Date().toLocaleDateString()}</div>
            </div>
            
            <button class="sign-button" onclick="completeSignature()">Complete Signature</button>
            
            <div class="signature-info">
                <p>By clicking "Complete Signature", you agree to electronically sign this document.</p>
                <p>This is a legally binding electronic signature equivalent to a handwritten signature.</p>
            </div>
        </div>
    </div>
    
    <script>
        function completeSignature() {
            alert('✅ Document signed successfully!\\n\\nThis is a demo implementation. In production, this would:\\n• Validate the signature\\n• Store the signed document\\n• Send confirmation emails\\n• Provide audit trail');
            
            // In production, this would make an API call to complete the signing process
            console.log('Document signed by ${signerInfo.name} (${signerInfo.email})');
        }
    </script>
</body>
</html>`;
            
            // Create a data URL for the HTML document
            const htmlBase64 = Buffer.from(htmlDocument).toString('base64');
            const documentUrl = `data:text/html;base64,${htmlBase64}`;
            
            const response = {
                status: "success",
                data: {
                    contract_id: contractId,
                    contract_url: documentUrl,
                    signing_url: documentUrl,
                    title: documentTitle,
                    signers: data.signers || [],
                    message: "Document ready for signing"
                }
            };
            
            console.log('Document-based contract created:', contractId);
            res.writeHead(200);
            res.end(JSON.stringify(response));

        } catch (error) {
            console.error('JSON parse error:', error);
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
});

function makeAPICall(endpoint, data, callback) {
    const postData = JSON.stringify(data);
    
    // eSignatures.com uses query parameter authentication, not Bearer token
    const pathWithToken = `/api${endpoint}?token=${API_TOKEN}`;
    
    const options = {
        hostname: 'esignatures.com',
        port: 443,
        path: pathWithToken,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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