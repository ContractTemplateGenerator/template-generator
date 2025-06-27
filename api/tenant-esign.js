// Simple eSignatures.com proxy specifically for tenant generator
const ESIGNATURES_API_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
const ESIGNATURES_API_BASE = 'https://api.esignatures.io';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        console.log('Tenant eSign request received:', req.body);
        
        const { step, data } = req.body;
        
        if (step === 'create_template') {
            // Step 1: Create template
            console.log('Creating template:', data);
            
            const response = await fetch(`${ESIGNATURES_API_BASE}/templates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ESIGNATURES_API_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    content: data.content,
                    content_type: 'html'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Template creation failed:', errorText);
                return res.status(response.status).json({
                    error: `Template creation failed: ${response.status}`,
                    details: errorText
                });
            }

            const result = await response.json();
            console.log('Template created successfully:', result);
            
            res.status(200).json({
                success: true,
                data: result
            });
            
        } else if (step === 'create_contract') {
            // Step 2: Create contract
            console.log('Creating contract:', data);
            
            const response = await fetch(`${ESIGNATURES_API_BASE}/contracts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ESIGNATURES_API_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    template_id: data.template_id,
                    test: "no", // Production mode
                    signers: [{
                        email: data.signer_email,
                        name: data.signer_name,
                        redirect_url: data.redirect_url || 'https://template.terms.law/Tenant-Security-Deposit-Generator/',
                        role: 'signer'
                    }],
                    embedded: true
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Contract creation failed:', errorText);
                return res.status(response.status).json({
                    error: `Contract creation failed: ${response.status}`,
                    details: errorText
                });
            }

            const result = await response.json();
            console.log('Contract created successfully:', result);
            
            res.status(200).json({
                success: true,
                data: result
            });
            
        } else {
            res.status(400).json({ error: 'Invalid step. Use create_template or create_contract' });
        }

    } catch (error) {
        console.error('Tenant eSign API error:', error);
        res.status(500).json({
            error: 'Server error processing eSignature request',
            details: error.message
        });
    }
}