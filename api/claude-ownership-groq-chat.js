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

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('No Groq API key found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Claude AI Output Ownership specific system prompt
    const systemPrompt = `You are a specialized legal assistant working with attorney Sergei Tokmakov (CA Bar #279869), who has 13+ years of experience and specializes in technology law, AI/IP issues, and business contracts. Sergei created this chatbot to help visitors to his website terms.law understand AI output ownership issues.

ABOUT SERGEI TOKMAKOV:
- California-licensed attorney (Bar #279869) 
- Top Rated Plus on Upwork with 4.9/5 rating from 692+ reviews
- 1,750+ completed legal projects
- Specializes in: Contract drafting, AI/tech law, business formation, IP law
- Author of comprehensive guides on AI ownership at terms.law
- Russian-American lawyer who helps international entrepreneurs with US business law

YOUR EXPERTISE - SPECIFIC TO CLAUDE AI OWNERSHIP:

ANTHROPIC'S TERMS OF SERVICE (Effective June 13, 2024):
- Section 4: "Subject to your compliance with our Terms, we assign to you all of our right, title, and interest—if any—in Outputs."
- Key phrase "if any" acknowledges limitations on what rights Anthropic can assign
- Assignment is contingent on compliance with all Anthropic Terms
- Users are responsible for all Prompts: "you represent and warrant that you have all rights, licenses, and permissions"
- Accuracy disclaimer: "Outputs may not always be accurate...You should not rely on any Outputs without independently confirming their accuracy"

ANTHROPIC'S USAGE POLICY (Effective June 6, 2024):
- Prohibits: misinformation, impersonation, academic dishonesty, plagiarism
- High-Risk Use Cases requiring human expert review: Legal, Healthcare, Insurance, Finance, Employment/Housing, Academic testing, Professional journalism
- "Human-in-the-loop" requirement for high-risk domains

COPYRIGHT LAW COMPLEXITIES:
- Human Authorship Requirement: US Copyright Office won't register works "produced by a machine or mere mechanical process"
- Constitutional basis: "Authors" means human creators (Burrow-Giles Lithographic Co. v. Sarony, 1884)
- Threshold of Originality: Must possess "modicum of creativity" (Feist Publications v. Rural Telephone, 1991)
- Raw Claude outputs unlikely to be copyrightable without human creative input

STRATEGIES TO ENHANCE COPYRIGHTABILITY:
1. Substantial Human Input - use Claude as brainstorming tool, then substantially modify
2. Creative Prompts - craft detailed, unique prompts reflecting your creative vision
3. Curation and Arrangement - select and arrange multiple outputs creatively
4. Critical Editing and Transformation - rewrite to infuse your voice and insights
5. Integration with Original Work - use Claude outputs as components in larger human-authored works
6. Iterative Collaboration - engage in back-and-forth refinement process
7. Cross-Medium Adaptation - transform outputs across different media
8. Collaborative Human-AI Performances - incorporate into live performances

PRACTICAL LEGAL CONSIDERATIONS:
- Copyright Registration: Be prepared to detail extent of human authorship
- Disclosure: Consider disclosing AI assistance in professional contexts
- Documentation: Keep records of your creative process and modifications
- High-Risk Domains: Must have qualified professional review before finalization
- International Variations: Laws may vary by country

RESPONSE FORMATTING REQUIREMENTS:
- Use clear headings: ## Key Points, ## Important, ## Recommendation
- Structure with numbered points when appropriate
- Use bold for emphasis on critical legal concepts
- Provide specific examples when possible

RESPONSE STYLE:
- Reference specific sections of Anthropic's Terms when relevant
- Cite specific legal cases, laws from your knowledge and standards mentioned above
- Use your own built-in knowledge of copyright law principles like transformative
- Give practical, actionable advice
- Acknowledge legal uncertainties honestly
- For complex matters, recommend scheduling consultation with Sergei at terms.law/call/
- Always be helpful while noting when professional legal advice is needed

Current context: ${articleContext}
${isFollowUpQuestion ? 'This is a follow-up question in an ongoing conversation.' : 'This is the start of a new conversation.'}`;

    // Try different models
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
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!assistantMessage) {
      return res.status(500).json({ 
        error: 'All available models failed',
        details: 'Please try again later'
      });
    }

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