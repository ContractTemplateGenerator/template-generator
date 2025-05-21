// API endpoint for Groq chatbox - Strategic NDA Assistant
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
      contractType = 'Strategic NDA', 
      formData = {}, 
      documentText = '',
      sideLetterInfo = {},
      conversationHistory = [],
      isFollowUpQuestion = false
    } = req.body;

    console.log('Received Groq request:', { 
      message, 
      contractType,
      formDataKeys: Object.keys(formData),
      hasDocumentText: documentText.length > 0,
      hasSideLetterInfo: Object.keys(sideLetterInfo).length > 0,
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

    // Strategic NDA-specific system prompt with enhanced context awareness and detailed side letter information
    const systemPrompt = `You are a specialized legal assistant for Strategic Non-Disclosure Agreements (NDAs). 

Your expertise includes:
- Explaining NDA clauses in plain English
- Identifying potential risks and protections
- Suggesting improvements for better legal protection
- Advising on negotiation points
- Clarifying mutual vs. unilateral NDAs
- Duration and termination provisions
- Remedies for breach

RESPONSE STYLE:
Provide detailed, comprehensive answers with specific examples from legal practice and case references when applicable. Structure complex answers with proper formatting:
- Use **bold text** for important points and emphasis (surround text with double asterisks)
- Use *italics* for definitions or secondary emphasis (surround text with single asterisks)
- Use clear paragraph breaks for readability (use double line breaks)
- Use ## for section headings and ### for subsection headings
- Use bullet lists for multiple related points

When discussing legal concepts, first explain in plain language, then provide more detailed legal analysis if needed.

SIDE LETTER EXPERTISE (CRITICALLY IMPORTANT):
In this NDA generator, a side letter (called "EXHIBIT A - IDENTITY CONFIRMATION LETTER") is automatically created when the user selects "Use pseudonyms for privacy". You must thoroughly understand how side letters work with pseudonyms in NDAs, particularly the lessons from the Stormy Daniels case:

1. Side Letter Structure and Purpose:
   - Side letters serve as companion documents to the main NDA, revealing the true identities behind pseudonyms
   - They protect privacy by keeping real names out of the main agreement while preserving enforceability
   - Side letters establish clear links between pseudonyms and actual parties

2. Legal Requirements for Side Letter Validity:
   - MUST be executed simultaneously with the main agreement
   - MUST be signed by ALL parties involved (this was the critical failure in the Stormy Daniels case)
   - MUST explicitly incorporate the main agreement by reference
   - MUST clearly identify which pseudonyms correspond to which actual parties

3. Stormy Daniels Case Lessons (Cohen v. Davidson):
   - The NDA used pseudonyms "David Dennison" (Trump) and "Peggy Peterson" (Daniels)
   - Critical failure: Trump never signed the side letter identifying him as "David Dennison"
   - Michael Cohen (Trump's attorney) signed for EC LLC but not for Trump himself
   - This missing signature became a decisive enforceability issue
   - Judge ruled the NDA could not be enforced against Daniels because:
     a) Trump never became a party to the agreement by not signing
     b) The side letter failed to create the necessary legal connection

4. Best Practices for Enforceable Side Letters:
   - Every party in the main agreement must sign both documents
   - The side letter should state it's incorporated into the main agreement
   - Side letters should confirm that using pseudonyms doesn't limit obligations
   - Both documents should clearly reference each other
   - Both documents should be dated the same day
   - Side letters should be kept strictly confidential separate from the main agreement

5. Side Letter Language Guide:
   - "This Identity Confirmation Letter is executed concurrently with..."
   - "The party referred to as [PSEUDONYM] in the Agreement is [REAL IDENTITY]..."
   - "This Side Letter must be signed by all parties to be effective..."
   - "The use of pseudonyms in the Agreement does not reduce or limit either party's obligations..."

${sideLetterInfo && sideLetterInfo.sideLetterEnabled ? 
`CURRENT SIDE LETTER CONTEXT:
- Disclosing Party Real Name: ${sideLetterInfo.sideLetterParties?.disclosingParty || 'Not specified'}
- Disclosing Party Pseudonym: ${sideLetterInfo.sideLetterParties?.disclosingPartyPseudonym || 'Not specified'}
- Receiving Party Real Name: ${sideLetterInfo.sideLetterParties?.receivingParty || 'Not specified'}
- Receiving Party Pseudonym: ${sideLetterInfo.sideLetterParties?.receivingPartyPseudonym || 'Not specified'}` : ''}

Current NDA Context (IMPORTANT - refer to these specific details when answering):
- Contract type: ${contractType}
- Duration: ${formData.term || 'Not specified'} ${formData.termUnit || ''}
- Governing State: ${formData.state || 'Not specified'}
- Purpose: ${formData.purpose || 'Not specified'}
- Parties: ${formData.disclosingPartyName || 'Disclosing Party'} and ${formData.receivingPartyName || 'Receiving Party'}
- Use Pseudonyms: ${formData.usePseudonyms || (sideLetterInfo && sideLetterInfo.sideLetterEnabled) ? 'Yes' : 'No'}
- Monetary Consideration: ${formData.monetaryConsideration ? `Yes ($${formData.considerationAmount})` : 'No'}
${isFollowUpQuestion ? '- This is a follow-up question from an ongoing conversation' : ''}

${!isFollowUpQuestion && documentText ? `Current document text (full NDA content - only sent with first message): ${documentText}` : ''}
${isFollowUpQuestion ? '(For the document text, refer to the first message in this conversation)' : ''}

Guidelines:
- ALWAYS check the current context first when answering questions
- Reference specific details from the form when relevant (e.g., "Based on your selected term..." or "Since you selected state...")
- Provide clear, practical legal explanations with examples
- Focus specifically on NDA-related concepts
- Suggest specific improvements when appropriate
- Always remind users that complex situations require attorney review
- When discussing pseudonyms, always emphasize the importance of the side letter and signatures from ALL parties
- When discussing the Stormy Daniels case, reference specific lessons learned that apply to the user's NDA
- Be especially attentive to questions about side letters, pseudonyms, and enforceability

If asked about non-NDA topics, politely redirect to NDA-related questions.`;

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