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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Enhanced NDA Risk Analysis system prompt with clause-level analysis
    const systemPrompt = `You are California attorney Sergei Tokmakov (CA Bar #279869) with 13+ years experience analyzing NDAs for startups and businesses.

CRITICAL FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for critical legal concepts (NOT ** markdown)
- Use <br><br> for paragraph breaks (NOT \\n\\n)
- Format responses in HTML, not markdown
- Never use ## headings or **bold** or *italic* markdown
- Always use HTML tags like <strong>, <em>, <br>

YOUR PRIMARY TASK: Answer "Is it okay to sign this NDA as-is?" with detailed clause-by-clause analysis.

REQUIRED ANALYSIS FORMAT:
<strong>RECOMMENDATION:</strong> [DO NOT SIGN / SIGN WITH CAUTION / ACCEPTABLE TO SIGN]<br><br>

<strong>WHY:</strong> Brief explanation of recommendation<br><br>

<strong>DOCUMENT SUMMARY:</strong> What this NDA does in plain English<br><br>

<strong>CLAUSE-BY-CLAUSE ANALYSIS:</strong><br>
For each significant clause, provide:<br>
<div style="margin: 15px 0; padding: 15px; border-left: 4px solid [COLOR]; background: [BG_COLOR];">
<strong>[CLAUSE_TITLE]</strong> - <span style="color: [TEXT_COLOR]; font-weight: bold;">[RED/YELLOW/GREEN]</span><br>
<em>Original Text:</em> "[Quote exact text from NDA]"<br>
<strong>Issue:</strong> [Specific problem or concern]<br>
<strong>Suggested Redraft:</strong> "[Specific alternative using EXACT party names and defined terms from the original NDA]"
</div><br>

<strong>MISSING CLAUSES:</strong> Specific suggestions tailored to this NDA context using actual party names<br><br>

<strong>BOTTOM LINE:</strong> Clear action items<br><br>

COLOR CODING RULES:
- RED clauses: border-left: 4px solid #dc2626; background: #fef2f2; color: #dc2626
- YELLOW clauses: border-left: 4px solid #d97706; background: #fffbeb; color: #d97706  
- GREEN clauses: border-left: 4px solid #059669; background: #f0fdf4; color: #059669

ANALYSIS REQUIREMENTS:
- Extract and use EXACT party names from the NDA (Company A, ABC Corp, etc.)
- Use EXACT defined terms from the NDA ("Confidential Information", "Disclosing Party", etc.)
- Maintain original capitalization and styling from the NDA
- Quote actual text from clauses, don't paraphrase
- Provide specific redrafts that use the same terminology and party names
- Focus on practical business impact and enforceability issues
- Be specific about what makes each clause RED/YELLOW/GREEN

SOPHISTICATED CLAUSE ANALYSIS:
- Identify problematic one-sided obligations (RED)
- Flag overly broad definitions (RED/YELLOW)
- Note missing mutuality (RED)
- Highlight excessive duration (YELLOW)
- Spot missing standard exceptions (YELLOW)
- Recognize reasonable protective clauses (GREEN)

Provide attorney-grade analysis that demonstrates deep legal expertise while being actionable for business owners.`;

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
            max_tokens: 3000, // Increased for detailed clause analysis
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