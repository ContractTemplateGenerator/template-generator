// API endpoint for Document AI Chat - supports Llama (free) and Claude Sonnet (premium)
const handler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      documentText = '',
      documentType = 'Legal Document',
      model = 'llama', // 'llama' (free) or 'sonnet' (premium)
      conversationHistory = []
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Document analysis system prompt
    const systemPrompt = `You are an expert legal document analyst helping users understand contracts and legal agreements. You work for Terms.Law, a legal technology platform.

CAPABILITIES:
- Summarize documents in plain English
- Identify risks and red flags
- Explain specific clauses and legal terminology
- Highlight missing provisions or unusual terms
- Provide negotiation suggestions
- Analyze fairness to each party
- Flag jurisdiction-specific issues

CURRENT DOCUMENT CONTEXT:
Document Type: ${documentType}
${documentText ? `\nDocument Content:\n${documentText.substring(0, 8000)}${documentText.length > 8000 ? '\n...[truncated]' : ''}` : 'No document loaded yet.'}

RESPONSE GUIDELINES:
- Be direct and practical - no fluff or generalities
- Reference specific sections/clauses when discussing the document
- Use **bold** for key terms and warnings
- Use bullet points for lists of risks or suggestions
- If asked "should I sign this?", provide balanced analysis of pros/cons
- Always note that this is AI assistance, not legal advice
- For complex matters, recommend consulting an attorney

QUICK ANALYSIS PATTERNS:
- For "summarize": Provide 3-5 key points, parties, obligations, and important dates
- For "risks": List specific concerning clauses with explanations
- For "explain [X]": Define the term/clause and its practical implications
- For "should I sign": Analyze fairness, risks, and missing protections
- For "negotiate": Suggest specific counter-language or additions`;

    let assistantMessage = null;
    let modelUsed = null;

    if (model === 'sonnet') {
      // Use Claude Sonnet 4 (premium)
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'Claude API not configured' });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            ...conversationHistory.slice(-6).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', response.status, errorText);
        return res.status(500).json({ error: 'Claude API error', details: errorText });
      }

      const data = await response.json();
      assistantMessage = data.content[0].text;
      modelUsed = 'claude-sonnet-4';

    } else {
      // Use Llama via Groq (free)
      const groqApiKey = process.env.GROQ_API_KEY_NEW || process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return res.status(500).json({ error: 'Groq API not configured' });
      }

      const llamaModels = [
        'llama-3.3-70b-versatile',
        'llama3-70b-8192',
        'llama-3.1-8b-instant',
        'gemma2-9b-it'
      ];

      for (const llamaModel of llamaModels) {
        try {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
              model: llamaModel,
              messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-6).map(msg => ({
                  role: msg.role,
                  content: msg.content
                })),
                { role: 'user', content: message }
              ],
              max_tokens: 1500,
              temperature: 0.3
            })
          });

          if (response.ok) {
            const data = await response.json();
            assistantMessage = data.choices[0].message.content;
            modelUsed = llamaModel;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (!assistantMessage) {
      return res.status(500).json({ error: 'Failed to get AI response' });
    }

    return res.status(200).json({
      response: assistantMessage,
      model: modelUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in document chat API:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export default handler;
