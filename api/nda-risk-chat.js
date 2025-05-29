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
    const { messages, useClaudeAI } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Choose AI provider based on user selection
    if (useClaudeAI) {
      return await handleClaudeRequest(req, res, messages);
    } else {
      return await handleGroqRequest(req, res, messages);
    }

  } catch (error) {
    console.error('Error in NDA risk analysis API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Handle Claude AI requests
const handleClaudeRequest = async (req, res, messages) => {
  // Check for Claude API key
  const claudeApiKey = process.env.ANTHROPIC_API_KEY;
  if (!claudeApiKey) {
    console.error('No Claude API key found');
    return res.status(500).json({ error: 'Claude API not configured' });
  }

  // Simplified system prompt
  const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for important concepts 
- Use <br><br> for paragraph breaks
- Format in HTML, not markdown
- Keep responses clear and structured but not overly complex

ANALYSIS APPROACH:
Provide balanced analysis for BOTH parties with specific improvements suggested.

BASIC FORMAT:
<h3><strong>🛡️ Risk Assessment</strong></h3>
<p>Overall risk level and key concerns for both parties.</p>

<h3><strong>📊 Party Analysis</strong></h3>
<p><strong>Disclosing Party:</strong> [risks and benefits]</p>
<p><strong>Receiving Party:</strong> [risks and benefits]</p>

<h3><strong>🔧 Suggested Improvements</strong></h3>
<p>• [Specific clause issues with suggested fixes]</p>

<h3><strong>❓ Context Questions</strong></h3>
<p>Which party do you represent? What's the business context?</p>

Focus on practical, actionable advice with specific clause improvements.`;

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
        max_tokens: 2000,
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
      
      console.log('Successful Claude analysis response generated');
      return res.status(200).json({ 
        response: assistantMessage,
        model: 'claude-sonnet-4',
        provider: 'Anthropic Claude 4.0'
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
    return await handleGroqRequest(req, res, messages);
  }
};

// Handle Groq/Llama requests (existing logic)
const handleGroqRequest = async (req, res, messages) => {
  // Check for Groq API key
  const groqApiKey = process.env.GROQ_API_KEY_NEW || process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error('No Groq API key found');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Simplified system prompt for Groq
  const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for important concepts 
- Use <br><br> for paragraph breaks
- Format in HTML, not markdown
- Keep responses clear and structured but not overly complex

ANALYSIS APPROACH:
Provide balanced analysis for BOTH parties with specific improvements suggested.

BASIC FORMAT:
<h3><strong>🛡️ Risk Assessment</strong></h3>
<p>Overall risk level and key concerns for both parties.</p>

<h3><strong>📊 Party Analysis</strong></h3>
<p><strong>Disclosing Party:</strong> [risks and benefits]</p>
<p><strong>Receiving Party:</strong> [risks and benefits]</p>

<h3><strong>🔧 Suggested Improvements</strong></h3>
<p>• [Specific clause issues with suggested fixes]</p>

<h3><strong>❓ Context Questions</strong></h3>
<p>Which party do you represent? What's the business context?</p>

Focus on practical, actionable advice with specific clause improvements.`;

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

  console.log('Successful Groq analysis response generated');
  return res.status(200).json({ 
    response: assistantMessage,
    model: modelUsed,
    provider: 'Groq Llama'
  });
};

export default handler;