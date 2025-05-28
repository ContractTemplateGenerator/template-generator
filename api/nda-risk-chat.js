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
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // NDA Risk Analysis system prompt
    const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

CRITICAL FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for critical legal concepts (NOT ** markdown)
- Use <br><br> for paragraph breaks (NOT \\n\\n)
- Format responses in HTML, not markdown
- Never use ## headings or **bold** or *italic* markdown
- Always use HTML tags like <strong>, <em>, <br>

YOUR PRIMARY TASK: Answer "Is it okay to sign this NDA as-is?"

REQUIRED ANALYSIS FORMAT:
<strong>RECOMMENDATION:</strong> [DO NOT SIGN / SIGN WITH CAUTION / ACCEPTABLE TO SIGN]<br><br>

<strong>WHY:</strong> Brief explanation of recommendation<br><br>

<strong>DOCUMENT SUMMARY:</strong> What this NDA does in plain English<br><br>

<strong>KEY ISSUES:</strong><br>
List the main problems with specific clause references<br><br>

<strong>SUGGESTED CHANGES:</strong><br>
Specific redraft suggestions using actual party names from the NDA<br><br>

<strong>BOTTOM LINE:</strong> Clear action items<br><br>

ANALYSIS FOCUS:
- Extract actual party names from NDA and use them in suggestions
- Focus on practical business impact, not academic theory
- Be specific and actionable
- Answer: "Should I sign this or not?"

Provide attorney-grade analysis that's actionable for business owners.`;

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
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
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
      console.error('All models failed');
      return res.status(500).json({ 
        error: 'All available models failed',
        details: 'Please try again later'
      });
    }

    console.log('Successful analysis response generated');
    return res.status(200).json({ 
      response: assistantMessage,
      model: modelUsed
    });

  } catch (error) {
    console.error('Error in NDA risk analysis API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;