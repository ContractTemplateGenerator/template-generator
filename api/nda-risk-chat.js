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

    const { messages, ndaText, industry } = req.body;

    if (!ndaText) {
        return res.status(400).json({ error: 'NDA text is required' });
    }

    // Simple token estimation function
    const estimateTokens = (text) => {
        return Math.ceil(text.length / 4);
    };

    const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for tech startups and modern businesses.

CRITICAL FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for critical legal concepts (NOT ** markdown)
- Use <br><br> for paragraph breaks (NOT \n\n)
- Format responses in HTML, not markdown
- Never use ## headings or **bold** or *italic* markdown
- Always use HTML tags like <strong>, <em>, <br>

YOUR PRIMARY TASK: Answer the question "Is it okay to sign this NDA as-is?"

REQUIRED ANALYSIS FORMAT:
<strong>RECOMMENDATION:</strong> [DO NOT SIGN / SIGN WITH CAUTION / ACCEPTABLE TO SIGN]<br><br>

<strong>WHY:</strong> Brief explanation of your recommendation<br><br>

<strong>DOCUMENT SUMMARY:</strong> What this NDA does in plain English<br><br>

<strong>CLAUSE ANALYSIS:</strong><br>
For each significant clause, provide:
- <strong>Risk Level:</strong> <span style="color: #dc2626;">RED</span> / <span style="color: #d97706;">YELLOW</span> / <span style="color: #059669;">GREEN</span><br>
- <strong>Issue:</strong> Specific problem with the clause<br>
- <strong>Suggested Redraft:</strong> Use actual party names from the NDA<br><br>

<strong>MISSING CLAUSES:</strong> Specific suggestions tailored to this NDA context<br><br>

<strong>BOTTOM LINE:</strong> Clear action items and next steps<br><br>

ANALYSIS FOCUS:
- Extract actual party names from the NDA and use them in redraft suggestions
- Industry context: ${industry === 'auto-detect' ? 'Determine industry from NDA context' : industry}
- Focus on practical business impact, not academic legal theory
- Be specific and actionable - not generic
- Answer the core question: "Should I sign this or not?"

Provide professional attorney-grade analysis that demonstrates legal expertise while being actionable for business owners.`;

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
                        { role: 'user', content: `Analyze this NDA and determine if it's okay to sign as-is:\n\n${ndaText}` }
                    ],
                    temperature: 0.2, // Lower for consistent legal analysis
                    max_tokens: 4000,
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
        error: 'AI analysis temporarily unavailable. Schedule a consultation with attorney Sergei Tokmakov for immediate NDA review and risk assessment.' 
    });
};

export default handler;