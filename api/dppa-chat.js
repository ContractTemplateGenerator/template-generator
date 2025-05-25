// API endpoint for Groq chatbox - DPPA Legal Assistant  
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    const systemPrompt = `You are a specialized legal assistant working with attorney Sergei Tokmakov (CA Bar #279869), who has 13+ years of experience and specializes in technology law, privacy compliance, and business regulatory matters. Provide expert legal analysis on Driver's Privacy Protection Act (DPPA) issues.

RESPONSE REQUIREMENTS:
- Provide consultation-quality legal analysis
- Jump straight into answering the user's specific question
- Reference exact USC sections (18 U.S.C. § 2721-2725) when relevant
- Cite recent case law and enforcement trends when applicable
- Give practical, actionable advice
- Use **bold text** for critical legal concepts
- 600-1000 word comprehensive responses
- Acknowledge legal uncertainties and state law variations

KEY DPPA INFORMATION:
- Minimum $2,500 statutory damages per violation (no actual damages required)
- 14 permissible uses under 18 U.S.C. § 2722
- Recent major enforcement against extended warranty companies, parking enforcement
- Private right of action with attorney fees recovery
- Kehoe v. Fidelity Federal Bank: No actual damages required for statutory damages`;

    // Available models in priority order
    const models = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'gemma2-9b-it'
    ];

    let response;
    let lastError;

    // Try each model until one works
    for (const model of models) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages
            ],
            max_tokens: 1500,
            temperature: 0.3,
            top_p: 0.9,
            stream: false
          }),
        });

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text();
          lastError = new Error(`HTTP ${groqResponse.status}: ${errorText}`);
          continue;
        }

        const data = await groqResponse.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          lastError = new Error('Invalid response structure from API');
          continue;
        }

        response = data.choices[0].message.content;
        break;
        
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    if (!response) {
      return res.status(500).json({ 
        error: 'Unable to generate response. Please try again or schedule a consultation.'
      });
    }

    return res.status(200).json({ response });

  } catch (error) {
    console.error('Error in DPPA chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;