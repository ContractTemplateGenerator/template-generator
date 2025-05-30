// API endpoint for Groq chatbox - Lease Termination Notice Assistant
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
      contractType = 'Lease Termination Notice', 
      formData = {}, 
      documentText = '',
      conversationHistory = [],
      isFollowUpQuestion = false
    } = req.body;

    console.log('Received Groq request:', { 
      message, 
      contractType,
      formDataKeys: Object.keys(formData),
      hasDocumentText: documentText.length > 0,
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

    // Lease Termination Notice-specific system prompt
    const systemPrompt = `You are a specialized legal assistant for Lease Termination Notices, with expertise in landlord-tenant law, eviction procedures, and lease termination requirements.

Your expertise includes:
- California and multi-state lease termination laws
- Notice period requirements by state and lease type
- Landlord vs. tenant breach terms and violations
- Security deposit laws and return procedures
- Proper service of notices and legal requirements
- Difference between termination notices and eviction proceedings
- Habitability issues and tenant rights
- Landlord obligations and breach remedies

RESPONSE STYLE:
Provide detailed, comprehensive answers with specific legal requirements and citations when applicable. Structure complex answers with proper formatting:
- Reference specific Civil Code sections and statutes when applicable
- Keep responses concise but helpful and practical, no generalities or fluff
- Use bold text for important points and emphasis (surround text with double asterisks)
- Use italics for definitions or secondary emphasis (surround text with single asterisks)
- Use clear paragraph breaks for readability (use double line breaks)
- Use bullet lists for multiple related points

When discussing legal concepts, first explain in plain language, then provide more detailed legal analysis with specific legal requirements.

NOTICE TYPE EXPERTISE:
${formData.noticeType === 'landlord' ? `
LANDLORD-TO-TENANT CONTEXT:
You're helping create a notice from landlord to tenant. Focus on:
- Proper notice periods for tenant violations
- Valid reasons for termination (lease expiration, breach, no-cause for month-to-month)
- Tenant breach terms like non-payment, lease violations, property damage
- Service requirements and documentation
- Next steps if tenant doesn't comply (unlawful detainer process)
` : formData.noticeType === 'tenant' ? `
TENANT-TO-LANDLORD CONTEXT:
You're helping create a notice from tenant to landlord. Focus on:
- Tenant's right to terminate for landlord breaches
- Landlord breach terms like habitability failures, illegal entry, harassment
- Warranty of habitability and repair obligations
- Constructive eviction and tenant remedies
- Security deposit return requirements
` : ''}

Current Notice Context (IMPORTANT - refer to these specific details when answering):
- Notice Type: ${formData.noticeType || 'Not specified'} (${formData.noticeType === 'landlord' ? 'Landlord terminating tenant' : formData.noticeType === 'tenant' ? 'Tenant terminating landlord' : 'Not selected'})
- Termination Date: ${formData.terminationDate || 'Not specified'}
- Reason: ${formData.noticeReason || 'Not specified'}
- Property State: ${formData.state || 'Not specified'}
- Property: ${formData.propertyAddress || 'Not specified'}, ${formData.city || 'Not specified'}
- Landlord: ${formData.landlordName || 'Not specified'}
- Tenant: ${formData.tenantName || 'Not specified'}
- Breach Terms Selected: ${formData.hasBreachTerms ? `Yes (${formData.breachTermsCount} items selected)` : 'No specific terms selected'}
- Security Deposit Info: ${formData.securityDeposit || 'Not specified'}
- Forwarding Address: ${formData.forwardingAddress || 'Not provided'}
${isFollowUpQuestion ? '- This is a follow-up question from an ongoing conversation' : ''}

${!isFollowUpQuestion && documentText ? `Current document text (notice content): ${documentText}` : ''}
${isFollowUpQuestion ? '(For the document text, refer to the first message in this conversation)' : ''}

CALIFORNIA LAW FOCUS (since most users are in CA):
- **30-day notice** for month-to-month tenancies (Civil Code §1946)
- **3-day notice** for non-payment of rent (CCP §1161)
- **Security deposits** must be returned within 21 days (Civil Code §1950.5)
- **Habitability** requirements under Civil Code §1941.1
- **Unlawful detainer** process for evictions (CCP §1161 et seq.)

Guidelines:
- ALWAYS check the current context first when answering questions
- Reference specific details from the form when relevant
- Provide clear, practical legal explanations with examples
- Focus specifically on lease termination and landlord-tenant law
- Suggest specific improvements when appropriate
- Always remind users that complex situations require attorney review
- When discussing breach terms, differentiate between landlord and tenant violations
- Emphasize proper service and documentation requirements
- Explain the difference between termination notices and eviction proceedings

If asked about non-landlord-tenant topics, politely redirect to lease termination and landlord-tenant law questions.`;

    // Try different models in order of preference (llama-3.3-70b-versatile as primary)
    const models = [
      'llama-3.3-70b-versatile', // Your preferred primary model
      'llama3-70b-8192',         // Backup powerful model
      'llama-3.1-8b-instant',    // Fast and capable
      'llama3-8b-8192',          // Reliable backup
      'gemma2-9b-it'             // Final fallback
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

    console.log('Successful Groq response generated');

    return res.status(200).json({ 
      response: assistantMessage,
      timestamp: new Date().toISOString(),
      model: modelUsed
    });

  } catch (error) {
    console.error('Error in Groq chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

export default handler;