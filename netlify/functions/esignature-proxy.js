// Netlify Functions proxy for eSignatures.com API
exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    const TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
    
    try {
        const { action, documentContent, template_id, signer_name, signer_email } = JSON.parse(event.body);
        
        if (action === 'create_template') {
            // Step 1: Create template
            const response = await fetch(`https://esignatures.com/api/templates?token=${TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: "Security Deposit Demand Letter",
                    content: documentContent,
                    roles: [
                        {
                            name: "Tenant",
                            order: 1
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Template creation failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    template_id: data.template_id,
                    message: 'Template created successfully'
                })
            };
            
        } else if (action === 'create_contract') {
            // Step 2: Create contract
            const response = await fetch(`https://esignatures.com/api/contracts?token=${TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    template_id: template_id,
                    signers: [
                        {
                            name: signer_name,
                            email: signer_email
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Contract creation failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    contract_id: data.contract_id,
                    signing_url: data.signing_url,
                    message: 'Contract created successfully'
                })
            };
        }
        
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action specified' })
        };
        
    } catch (error) {
        console.error('eSignatures API Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'eSignature service error',
                message: error.message
            })
        };
    }
};