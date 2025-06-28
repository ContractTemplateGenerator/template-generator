// eSignatures.com API implementation using official documentation
module.exports = async function handler(req, res) {
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
        const { action, documentContent, signer_name, signer_email, template_id } = req.body;
        
        if (action === 'create_template') {
            // Convert document content to document_elements format
            const lines = documentContent.split('\n');
            const document_elements = [];
            
            for (const line of lines) {
                if (line.trim()) {
                    if (line.startsWith('Re:') || line.includes('Dear') || line.includes('Sincerely')) {
                        document_elements.push({
                            type: 'text_header_two',
                            text: line.trim()
                        });
                    } else {
                        document_elements.push({
                            type: 'text_normal',
                            text: line.trim()
                        });
                    }
                }
            }
            
            // Add signature field at the end
            document_elements.push({
                type: 'signer_field_text',
                text: 'Tenant Signature',
                signer_field_assigned_to: 'first_signer',
                signer_field_id: 'tenant_signature',
                signer_field_required: 'yes'
            });
            
            const templateResponse = await fetch(`https://esignatures.com/api/templates?token=${TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Security Deposit Demand Letter",
                    document_elements: document_elements
                })
            });
            
            if (!templateResponse.ok) {
                const errorText = await templateResponse.text();
                throw new Error(`Template creation failed: ${templateResponse.status} - ${errorText}`);
            }
            
            const templateData = await templateResponse.json();
            return res.status(200).json({ 
                success: true, 
                template_id: templateData.data[0].template_id,
                message: 'Template created successfully'
            });
            
        } else if (action === 'create_contract') {
            // Step 2: Create contract from template
            const contractResponse = await fetch(`https://esignatures.com/api/contracts?token=${TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    template_id: template_id,
                    test: "yes", // Set to "no" for production
                    signers: [
                        {
                            name: signer_name,
                            email: signer_email,
                            signature_request_delivery_methods: ["email"]
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
                contract_id: contractData.data.contract.id,
                signing_url: contractData.data.contract.signers[0].sign_page_url,
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
};