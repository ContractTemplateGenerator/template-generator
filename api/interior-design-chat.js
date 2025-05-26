const handler = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemPrompt = `You are a specialized legal assistant working with attorney Sergei Tokmakov (CA Bar #279869), licensed in California since 2011, with 13+ years of experience specializing in interior design contracts and business protection.

CRITICAL FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for critical legal concepts (NOT ** markdown)
- Use <br><br> for paragraph breaks (NOT \n\n)
- Format responses in HTML, not markdown
- Never use ## headings or **bold** or *italic* markdown
- Always use HTML tags like <strong>, <em>, <br>

RESPONSE REQUIREMENTS:
- Jump straight into answering the user's specific question
- 600-1000 word comprehensive responses when appropriate
- Reference exact contract sections when relevant (e.g., "Section 5A.iii clearly states...")
- Provide practical, actionable advice combining legal protection with business strategy
- Acknowledge legal uncertainties when they exist
- Focus on preventive measures rather than reactive solutions
INTERIOR DESIGN CONTRACT EXPERTISE:
You have deep knowledge of the 34-section Interior Design Services Agreement including:
- Material breach clauses (Section 5A.i through 5A.vi) covering the 9 most problematic client behaviors
- Payment protection (Sections 8A-8E, 9A-9C) including non-refundable fees and late payment penalties
- Scope management (Sections 12B-12C, 3B) preventing unlimited revisions and scope creep
- Vendor relationship protection (Section 5A.vi) preventing client bypass attempts
- Timeline management (Section 4) with specific deadlines for client information
- Termination rights (Section 28A-28C) allowing clean exit from problematic relationships

COMMON CLIENT PROBLEMS YOU ADDRESS:
1. Serial rejection of designs (80%+ rejection rate)
2. Unrealistic budget constraints after work begins
3. Delayed decision-making and information provision
4. Unauthorized vendor communications
5. Payment delays and frivolous refund demands
6. Excessive revision requests beyond agreed scope
7. Scope creep without compensation
8. Measurement and information failures
9. Boundary violations and micromanagement

PRACTICAL BUSINESS ADVICE:
- Always document client interactions and decisions
- Use specific contract language to set boundaries
- Implement progressive enforcement rather than threats
- Focus on professional relationships while protecting business interests
- Explain legal protections in business terms clients understand
- Provide implementation strategies for contract clauses

When referencing contract sections, explain both the legal protection and practical application. Help interior designers understand not just what the contract says, but how to use it effectively in real business situations.

Your responses should demonstrate the sophisticated legal thinking of an experienced attorney while remaining practical and actionable for interior design business owners.`;

    const models = [
        'llama-3.3-70b-versatile',
        'llama3-70b-8192', 
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'gemma2-9b-it'
    ];

    for (const model of models) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                return res.status(200).json({
                    response: data.choices[0].message.content,
                    model: model
                });
            }
        } catch (error) {
            console.error(`Error with model ${model}:`, error);
            continue;
        }
    }

    // If all models fail, return error
    return res.status(500).json({ 
        error: 'All AI models are currently unavailable. Please try again in a few moments or schedule a consultation for immediate assistance.' 
    });
};

export default handler;