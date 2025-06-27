// eSignatures.com API implementation using official documentation
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
    
    try {
        const { action, documentContent, signerInfo } = req.body;
        
        if (action === 'create_template') {
            // Step 1: Create template with document content
            const templateResponse = await fetch(`https://esignatures.com/api/templates?token=${TOKEN}`, {
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
            
            if (!templateResponse.ok) {
                const errorText = await templateResponse.text();
                throw new Error(`Template creation failed: ${templateResponse.status} - ${errorText}`);
            }
            
            const templateData = await templateResponse.json();
            return res.status(200).json({ 
                success: true, 
                template_id: templateData.template_id,
                message: 'Template created successfully'
            });
            
        } else if (action === 'create_contract') {
            // Step 2: Create contract from template
            const { template_id, signer_name, signer_email } = req.body;
            
            const contractResponse = await fetch(`https://esignatures.com/api/contracts?token=${TOKEN}`, {
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
            
            if (!contractResponse.ok) {
                const errorText = await contractResponse.text();
                throw new Error(`Contract creation failed: ${contractResponse.status} - ${errorText}`);
            }
            
            const contractData = await contractResponse.json();
            return res.status(200).json({ 
                success: true, 
                contract_id: contractData.contract_id,
                signing_url: contractData.signing_url,
                message: 'Contract created successfully'
            });
        }
        
        return res.status(400).json({ error: 'Invalid action specified' });
        
    } catch (error) {
        console.error('eSignatures API Error:', error);
        return res.status(500).json({ 
            error: 'eSignature service error',
            message: error.message
        });
    }
}