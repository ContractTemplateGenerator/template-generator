// eSignatures.com API implementation based on official documentation
// https://esignatures.com/docs/api#esignatures-api

const ESIGNATURES_SECRET_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
const ESIGNATURES_API_BASE = 'https://esignatures.com/api';

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
        const { document_content, signer_name, signer_email } = req.body;
        
        if (!document_content || !signer_name || !signer_email) {
            return res.status(400).json({ 
                error: 'Missing required fields: document_content, signer_name, signer_email' 
            });
        }

        console.log('Creating eSignature contract for:', signer_email);

        // Step 1: Create template with document content
        console.log('Creating template...');
        const templateUrl = `${ESIGNATURES_API_BASE}/templates?token=${ESIGNATURES_SECRET_TOKEN}`;
        
        const templateResponse = await fetch(templateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `Security Deposit Demand Letter - ${new Date().toISOString()}`,
                content: document_content
            })
        });

        if (!templateResponse.ok) {
            const errorText = await templateResponse.text();
            console.error('Template creation failed:', templateResponse.status, errorText);
            return res.status(templateResponse.status).json({
                error: `Template creation failed: ${templateResponse.status}`,
                details: errorText
            });
        }

        const templateResult = await templateResponse.json();
        console.log('Template created successfully:', templateResult.id);

        // Step 2: Create contract using the template
        console.log('Creating contract with template ID:', templateResult.id);
        const contractUrl = `${ESIGNATURES_API_BASE}/contracts?token=${ESIGNATURES_SECRET_TOKEN}`;
        
        const contractResponse = await fetch(contractUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template_id: templateResult.id,
                title: 'Security Deposit Demand Letter',
                signers: [{
                    name: signer_name,
                    email: signer_email
                }]
            })
        });

        if (!contractResponse.ok) {
            const errorText = await contractResponse.text();
            console.error('Contract creation failed:', contractResponse.status, errorText);
            return res.status(contractResponse.status).json({
                error: `Contract creation failed: ${contractResponse.status}`,
                details: errorText
            });
        }

        const contractResult = await contractResponse.json();
        console.log('Contract created successfully:', contractResult);

        // Return success response with signing URL
        res.status(200).json({
            success: true,
            data: {
                contract_id: contractResult.contract_id,
                signing_url: contractResult.signers?.[0]?.sign_page_url,
                status: contractResult.status
            }
        });

    } catch (error) {
        console.error('eSignature API error:', error);
        res.status(500).json({
            error: 'Server error processing eSignature request',
            details: error.message
        });
    }
}