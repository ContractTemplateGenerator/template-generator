// eSignatures.com API Proxy to bypass CORS restrictions
// This endpoint handles API calls server-side to avoid browser CORS issues

const ESIGNATURES_API_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
const ESIGNATURES_API_BASE = 'https://api.esignatures.io';

export default async function handler(req, res) {
    // Enable CORS for client requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { action, data } = req.body;

        let response;
        let apiUrl;
        let requestBody;

        switch (action) {
            case 'create_template':
                apiUrl = `${ESIGNATURES_API_BASE}/templates`;
                requestBody = {
                    name: data.name,
                    content: data.content,
                    content_type: 'html'
                };
                break;

            case 'create_contract':
                apiUrl = `${ESIGNATURES_API_BASE}/contracts`;
                requestBody = {
                    template_id: data.template_id,
                    signers: [{
                        email: data.signer_email,
                        name: data.signer_name,
                        redirect_url: data.redirect_url || 'https://template.terms.law/stripe-demand-letter-generator/',
                        role: 'signer'
                    }],
                    embedded: true,
                    custom_data: {
                        email_to_stripe: data.email_to_stripe || false,
                        return_email: data.signer_email
                    }
                };
                break;

            default:
                res.status(400).json({ error: 'Invalid action' });
                return;
        }

        console.log('Making API request to:', apiUrl);
        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        // Make the API call to eSignatures.com
        response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ESIGNATURES_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            
            // Return a structured error response
            res.status(response.status).json({
                error: `eSignatures.com API error: ${response.status}`,
                details: errorText,
                action: action
            });
            return;
        }

        const result = await response.json();
        console.log('API response success:', result);

        // Return successful response
        res.status(200).json({
            success: true,
            data: result,
            action: action
        });

    } catch (error) {
        console.error('Server error in eSignature API:', error);
        
        // Return error response
        res.status(500).json({
            error: 'Server error processing eSignature request',
            details: error.message,
            action: req.body?.action || 'unknown'
        });
    }
}