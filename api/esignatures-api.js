// eSignatures.com API implementation - production ready
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
        // Get the request body
        const body = req.body;
        console.log('Received request body:', body);
        
        if (!body) {
            return res.status(400).json({ 
                error: 'No request body provided',
                message: 'A JSON formatted HTTP body must be added.'
            });
        }
        
        const { documentContent, signer_name, signer_email } = body;
        
        // Step 1: Create template using the working format
        console.log('Creating template...');
        const templateResponse = await fetch(`https://esignatures.com/api/templates?token=${TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Security Deposit Demand Letter",
                document_elements: [
                    {
                        type: "text_normal",
                        text: documentContent
                    }
                ]
            })
        });
        
        if (!templateResponse.ok) {
            const errorText = await templateResponse.text();
            console.error('Template creation failed:', templateResponse.status, errorText);
            throw new Error(`Template creation failed: ${templateResponse.status} - ${errorText}`);
        }
        
        const templateData = await templateResponse.json();
        console.log('Template created:', templateData);
        
        // Step 2: Create contract from template - PRODUCTION MODE (no test flag)
        console.log('Creating contract...');
        const contractResponse = await fetch(`https://esignatures.com/api/contracts?token=${TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template_id: templateData.data[0].template_id,
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
            console.error('Contract creation failed:', contractResponse.status, errorText);
            throw new Error(`Contract creation failed: ${contractResponse.status} - ${errorText}`);
        }
        
        const contractData = await contractResponse.json();
        console.log('Contract created:', contractData);
        
        return res.status(200).json({ 
            success: true, 
            contract_id: contractData.data.contract.id,
            signing_url: contractData.data.contract.signers[0].sign_page_url,
            message: 'eSignature sent successfully - production mode'
        });
        
    } catch (error) {
        console.error('eSignatures API Error:', error);
        return res.status(500).json({ 
            error: 'eSignature service error',
            message: error.message
        });
    }
};