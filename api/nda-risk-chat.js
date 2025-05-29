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
    const { messages, useClaudeAI, extractedData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Choose AI provider based on user selection
    if (useClaudeAI) {
      return await handleClaudeRequest(req, res, messages, extractedData);
    } else {
      return await handleGroqRequest(req, res, messages, extractedData);
    }

  } catch (error) {
    console.error('Error in NDA risk analysis API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};
// Handle Claude AI requests with personalization
const handleClaudeRequest = async (req, res, messages, extractedData) => {
  // Check for Claude API key
  const claudeApiKey = process.env.ANTHROPIC_API_KEY;
  if (!claudeApiKey) {
    console.error('No Claude API key found');
    return res.status(500).json({ error: 'Claude API not configured' });
  }

  // Enhanced system prompt for personalized analysis
  const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

PERSONALIZATION CONTEXT:
${extractedData ? `
- Detected Parties: ${extractedData.parties?.join(' and ') || 'Not specified'}
- Business Purpose: ${extractedData.businessPurpose || 'Not specified'}
- Jurisdiction: ${extractedData.jurisdiction || 'Not specified'}
- Key Terms: ${Object.keys(extractedData.terms || {}).join(', ') || 'None detected'}
- Duration Terms: ${Object.values(extractedData.durations || {}).join(', ') || 'None detected'}
- Sections Found: ${extractedData.sections?.join(', ') || 'None detected'}
` : 'No extracted data available'}

FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for important concepts 
- Use <br><br> for paragraph breaks
- Format in HTML, not markdown
- Provide clear, actionable advice
- ALWAYS use the actual party names extracted from the agreement when referring to the parties

PERSONALIZED ANALYSIS APPROACH:
Provide hyper-personalized analysis that uses the EXACT party names, specific terms, and contextual details from this particular agreement.

REQUIRED FORMAT:
<strong>PERSONALIZED DOCUMENT OVERVIEW:</strong> Brief summary using actual party names and business context<br><br>

<strong>ANALYSIS FOR ${extractedData?.parties?.[0] || 'DISCLOSING PARTY'} (Information Sharer):</strong><br>
• Specific risk assessment for this party<br>
• Adequacy of confidentiality protections<br>
• Enforcement considerations<br><br>

<strong>ANALYSIS FOR ${extractedData?.parties?.[1] || 'RECEIVING PARTY'} (Information Recipient):</strong><br>
• Burden and restrictions imposed on this specific party<br>
• Scope of confidentiality obligations<br>
• Duration and practical impact<br><br>

<strong>PERSONALIZED REDRAFT SUGGESTIONS:</strong><br>
• Specific improvements favoring ${extractedData?.parties?.[0] || 'first party'}<br>
• Neutral/mutual improvements<br>
• Specific improvements favoring ${extractedData?.parties?.[1] || 'second party'}<br><br>

Focus on actionable advice using the specific party names, terms, and context from this exact agreement.`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (response.ok) {
      const data = await response.json();
      const assistantMessage = data.content[0].text;
      
      console.log('Successful personalized Claude analysis response generated');
      return res.status(200).json({ 
        response: assistantMessage,
        model: 'claude-sonnet-4',
        provider: 'Anthropic Claude 4.0',
        personalizedContext: extractedData
      });
    } else {
      const errorText = await response.text();
      console.error('Claude API Error:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Claude request failed:', error);
    // Fall back to Groq if Claude fails
    console.log('Falling back to Groq...');
    return await handleGroqRequest(req, res, messages, extractedData);
  }
};
// Handle Groq/Llama requests with personalization
const handleGroqRequest = async (req, res, messages, extractedData) => {
  // Check for Groq API key
  const groqApiKey = process.env.GROQ_API_KEY_NEW || process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error('No Groq API key found');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Enhanced system prompt for personalized analysis (Groq)
  const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

PERSONALIZATION CONTEXT:
${extractedData ? `
- Detected Parties: ${extractedData.parties?.join(' and ') || 'Not specified'}
- Business Purpose: ${extractedData.businessPurpose || 'Not specified'}
- Jurisdiction: ${extractedData.jurisdiction || 'Not specified'}
- Key Terms: ${Object.keys(extractedData.terms || {}).join(', ') || 'None detected'}
- Duration Terms: ${Object.values(extractedData.durations || {}).join(', ') || 'None detected'}
` : 'No extracted data available'}

FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for important concepts 
- Use <br><br> for paragraph breaks
- Format in HTML, not markdown
- Provide clear, actionable advice
- ALWAYS use the actual party names when referring to the parties

PERSONALIZED ANALYSIS APPROACH:
Provide hyper-personalized analysis using the EXACT party names and contextual details from this agreement.

Focus on practical, actionable advice with specific clause improvements using the actual party names and terms from this agreement.`;

  // Try different models in order of preference
  const models = [
    'llama-3.3-70b-versatile',
    'llama3-70b-8192',
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'gemma2-9b-it'
  ];
  
  let assistantMessage = null;
  let modelUsed = null;
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages
          ],
          max_tokens: 2000,
          temperature: 0.2
        })
      });
      if (response.ok) {
        const data = await response.json();
        assistantMessage = data.choices[0].message.content;
        modelUsed = model;
        console.log(`Success with model: ${model}`);
        break;
      } else {
        const errorText = await response.text();
        console.log(`Model ${model} failed:`, errorText);
        continue;
      }
    } catch (error) {
      console.log(`Model ${model} error:`, error.message);
      continue;
    }
  }
  
  if (!assistantMessage) {
    console.error('All Groq models failed');
    return res.status(500).json({ 
      error: 'All available models failed',
      details: 'Please try again later'
    });
  }

  console.log('Successful personalized Groq analysis response generated');
  return res.status(200).json({ 
    response: assistantMessage,
    model: modelUsed,
    provider: 'Groq Llama',
    personalizedContext: extractedData
  });
};

export default handler;