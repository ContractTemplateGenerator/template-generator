// Vercel Serverless Function for eSignatures.com API integration
// Tenant Security Deposit Generator

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { documentContent, signer_name, signer_email } = req.body;

        if (!documentContent || !signer_name || !signer_email) {
            res.status(400).json({ 
                error: 'Missing required fields: documentContent, signer_name, signer_email' 
            });
            return;
        }

        // Try to use Node.js proxy first (if available)
        try {
            const proxyResponse = await fetch('http://localhost:3001/esign-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    template: {
                        title: 'Security Deposit Demand Letter',
                        content: documentContent,
                        content_type: 'text'
                    },
                    signers: [{
                        email: signer_email,
                        name: signer_name,
                        role: 'signer'
                    }]
                })
            });

            if (proxyResponse.ok) {
                const result = await proxyResponse.json();
                res.status(200).json(result);
                return;
            }
        } catch (proxyError) {
            console.log('Proxy not available, falling back to demo mode');
        }

        // Fallback to demo mode
        res.status(200).json({
            success: true,
            signing_url: "https://esignatures.com/demo-signing-page",
            contract_id: "demo-" + Date.now(),
            message: "Demo mode - Node.js proxy required for real eSignatures"
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}