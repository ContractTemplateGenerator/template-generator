// API endpoint for Groq chatbox - Claude AI Output Ownership Assistant
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
    const { 
      message, 
      articleContext = '',
      conversationHistory = [],
      isFollowUpQuestion = false
    } = req.body;

    console.log('Received Claude AI ownership request:', { 
      message,
      hasArticleContext: articleContext.length > 0,
      historyLength: conversationHistory.length,
      isFollowUp: isFollowUpQuestion
    });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Claude AI Output Ownership specific system prompt
    const systemPrompt = `You are a specialized legal assistant focused on AI-generated content ownership, specifically regarding Claude AI and similar language models. Your expertise is based on the article "Who Owns Claude's Outputs (and How Can They Be Used)?" from terms.law.

Your expertise includes:
- Explaining ownership rights of AI-generated content
- Clarifying Claude's Terms of Service regarding output ownership
- Discussing copyright implications of AI outputs
- Explaining fair use and transformative use concepts
- Advising on commercial use of AI-generated content
- Discussing attribution requirements
- Explaining the difference between AI tools as services vs. ownership claims

KEY LEGAL PRINCIPLES YOU SHOULD EXPLAIN:

1. **Service Provider Model**: Anthropic (Claude's creator) operates as a service provider, not claiming ownership of outputs generated through normal use.

2. **User Ownership**: Users generally own the outputs they generate, subject to:
   - Input ownership (you must have rights to any content you provide)
   - Third-party rights (outputs may still infringe existing copyrights)
   - Terms of Service compliance

3. **Copyright Complexity**: 
   - AI outputs may not always qualify for copyright protection
   - Human authorship requirement in many jurisdictions
   - Sufficient human creative input may establish copyright

4. **Commercial Use**: Generally permitted but users must:
   - Ensure no infringement of third-party rights
   - Comply with applicable laws
   - Consider industry-specific regulations

5. **Attribution**: Not legally required by Claude's terms but may be:
   - Ethically appropriate
   - Required by specific use cases
   - Good practice for transparency

IMPORTANT CAVEATS TO ALWAYS MENTION:
- This is general information, not legal advice
- Laws vary by jurisdiction
- Consult an attorney for specific situations
- Technology and law are rapidly evolving in this area

RESPONSE STYLE:
- Provide clear, practical explanations
- Use examples to illustrate complex concepts
- Reference specific sections of terms when relevant
- Acknowledge areas of legal uncertainty
- Suggest best practices for risk mitigation

${!isFollowUpQuestion && articleContext ? `Article context for reference: ${articleContext}` : ''}
${isFollowUpQuestion ? '(Continuing from previous conversation about AI output ownership)' : ''}

Remember to:
- Focus specifically on AI output ownership issues
- Avoid discussing unrelated legal topics like NDAs, contracts, or business formation
- Provide practical guidance while noting legal complexities
- Emphasize that laws are still developing in this area
- Recommend consulting an attorney for specific use cases
- NEVER reference or discuss NDAs, confidentiality agreements, or contract terms`;

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
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 1000,
            temperature: 0.3
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

    console.log('Successful Claude AI ownership response generated');

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: modelUsed
    });

  } catch (error) {
    console.error('Error in Claude AI ownership chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;