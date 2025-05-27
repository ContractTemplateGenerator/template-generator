export default async function handler(req, res) {
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

    const { ndaText, industry } = req.body;

    if (!ndaText || ndaText.trim().length < 50) {
        return res.status(400).json({ error: 'Please provide a valid NDA text for analysis' });
    }

    console.log('Received NDA analysis request:', { 
        textLength: ndaText.length, 
        industry,
        apiKeyExists: !!process.env.GROQ_API_KEY 
    });

    const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) analyzing NDAs.

CRITICAL: Format response in HTML (not markdown)
- Use <strong></strong> for emphasis
- Use <br><br> for line breaks
- Use <span style="color: #dc2626;">RED</span> for high risk
- Use <span style="color: #d97706;">YELLOW</span> for medium risk  
- Use <span style="color: #059669;">GREEN</span> for low risk

ANSWER: "Is it okay to sign this NDA as-is?"

FORMAT:
<strong>RECOMMENDATION:</strong> [DO NOT SIGN / SIGN WITH CAUTION / ACCEPTABLE TO SIGN]<br><br>
<strong>WHY:</strong> Brief explanation<br><br>
<strong>DOCUMENT SUMMARY:</strong> What this NDA does<br><br>
<strong>KEY ISSUES:</strong><br>
• Issue 1: <span style="color: #dc2626;">RED</span> - Problem description<br>
• Issue 2: <span style="color: #d97706;">YELLOW</span> - Another issue<br><br>
<strong>SUGGESTED CHANGES:</strong> Specific improvements needed<br><br>
<strong>BOTTOM LINE:</strong> Final recommendation

Industry: ${industry}`;

    const models = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama-3.1-8b-instant'];

    for (const model of models) {
        try {
            console.log(`Trying model: ${model}`);
            
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
                        { role: 'user', content: `Analyze this NDA:\n\n${ndaText.substring(0, 8000)}` }
                    ],
                    temperature: 0.3,
                    max_tokens: 3000,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Success with model: ${model}`);
                return res.status(200).json({
                    response: data.choices[0].message.content,
                    model: model
                });
            } else {
                console.error(`Model ${model} failed:`, response.status, await response.text());
            }
        } catch (error) {
            console.error(`Error with model ${model}:`, error.message);
        }
    }

    console.log('All models failed');
    return res.status(500).json({ 
        error: 'Unable to analyze NDA at this time. Please try again in a few minutes or copy the text to ChatGPT/Claude for a quick review.' 
    });
}