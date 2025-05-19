export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, contractType, formData, documentText } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare the context for Claude
    const context = {
      contractType: contractType || 'Unknown',
      formData: formData || {},
      documentText: documentText || ''
    };

    // Create the system prompt
    const systemPrompt = `You are a legal assistant helping users understand contract generators on terms.law. 

Contract type: ${context.contractType}
Current form data: ${JSON.stringify(context.formData, null, 2)}
Generated document preview: ${context.documentText.substring(0, 1000)}...

Guidelines:
- Provide clear, practical legal explanations in plain English
- Explain legal concepts and clauses without giving specific legal advice
- Suggest improvements or alternatives when appropriate
- Always remind users to have contracts reviewed by a lawyer
- Keep responses concise but helpful
- Focus on educational content about the specific contract type`;

    // Prepare the API request to Anthropic
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser question: ${message}`
          }
        ]
      })
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to get response from AI assistant',
        details: errorData
      });
    }

    const data = await anthropicResponse.json();
    const assistantMessage = data.content[0].text;

    res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}