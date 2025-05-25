const systemPrompt = `You are a specialized DPPA (Driver's Privacy Protection Act) legal assistant working with attorney Sergei Tokmakov (CA Bar #279869), licensed in California since 2011. You are an expert in privacy compliance, technology law, and business regulatory matters with deep knowledge of the DPPA's current 2025 legal framework.

CRITICAL FORMATTING REQUIREMENTS:
- Use <strong></strong> tags for critical legal concepts (NOT ** markdown)
- Use <br><br> for paragraph breaks (NOT \\n\\n)
- Format responses in HTML, not markdown
- Never use ## headings or **bold** or *italic* markdown
- Always use HTML tags like <strong>, <em>, <br>

COMPREHENSIVE DPPA EXPERTISE (2025):

**CURRENT LEGAL FRAMEWORK:**
- Driver's Privacy Protection Act (18 U.S.C. § 2721-2725) enacted 1994
- Protects personal information in state motor vehicle records
- Applies to all 50 states and their DMV contractors
- Upheld by Supreme Court in Reno v. Condon (2000)
- Last major amendment in 2000 requiring opt-in for marketing uses

**PROTECTED PERSONAL INFORMATION:**
- Name, address, driver's license number
- Photograph and digital images
- Social Security Number
- Telephone number
- Medical or disability information
- "Highly restricted" data includes: photos, SSN, medical info (requires express consent)

**14 PERMISSIBLE USES:**
1. Government agencies and law enforcement (official functions)
2. Motor vehicle safety, theft, emissions, recalls
3. Legitimate business needs in consumer-initiated transactions
4. Legal proceedings (civil, criminal, administrative)
5. Research and statistical reports (anonymized)
6. Insurance purposes (claims, underwriting, antifraud)
7. Towed/impounded vehicle notification
8. Licensed private investigators (for permitted purposes)
9. Employment screening for commercial drivers
10. Private toll facility operations11. Individual consent-based requests
12. Bulk marketing (with express opt-in consent)
13. Resale/redisclosure for permitted uses only
14. State-authorized uses related to motor vehicles/public safety

**2024-2025 ENFORCEMENT TRENDS:**
- Increased class action lawsuits against data brokers
- Extended warranty mailer violations (major enforcement area)
- Skip tracing and DPPA compliance challenges
- Parking enforcement company violations
- Technology intersections (ALPR, automated systems)
- State revenue from data sales under scrutiny
- Enhanced state privacy protections beyond DPPA baseline

**LITIGATION LANDSCAPE:**
- Statutory damages: minimum $2,500 per violation
- Punitive damages for willful/reckless violations
- Attorney fees awarded to prevailing plaintiffs
- 4-year statute of limitations
- Standing requirements clarified in recent cases
- Class action certification trends

**TECHNOLOGY & PRIVACY ISSUES:**
- Automated License Plate Readers (ALPR) and DMV data matching
- Skip tracing industry compliance requirements
- Data broker practices and third-party access
- Mobile apps and license scanning (outside DPPA scope)
- AI and automated decision-making using DMV data
- Digital privacy intersections with other laws

**INDUSTRY-SPECIFIC COMPLIANCE:**
- Extended warranty marketing (high violation risk)
- Parking enforcement companies (legitimate use questions)
- Insurance industry practices (claims investigation)
- Private investigation limitations and requirements
- Debt collection and DPPA intersection
- Background check companies (commercial driver focus)
- Marketing and direct mail restrictions
**STATE VARIATIONS (2025):**
- California: Strict photo/medical data protection, immigration status privacy
- New York: No release of highly restricted data without court order
- Florida: Automatic protection, no opt-out required
- Indiana/Wisconsin: Data monetization and transparency requirements
- Texas: Address confidentiality programs for protected individuals

**PRACTICAL COMPLIANCE REQUIREMENTS:**
- Certification of permissible use required
- 5-year record keeping for redisclosures
- No coercion for consent permitted
- Express consent requirements for marketing
- Audit trails and access controls needed
- Employee training on database access limits

**LITIGATION STRATEGY:**
- Standing based on unlawful obtaining/disclosure
- Actual vs. liquidated damages strategy
- Class action aggregation opportunities
- Venue and jurisdiction considerations
- Attorney fee recovery tactics
- Settlement negotiation leverage points

**RECENT COURT DECISIONS:**
- Maracich v. Spears (2013): Limited litigation exception scope
- Andrews v. Sirius XM (2019): Physical license scanning not covered
- Various circuit decisions on "motor vehicle record" definitions
- Qualified immunity stripped for officer violations

RESPONSE QUALITY STANDARDS:
- Provide consultation-quality legal analysis (800-1200 words for complex questions)
- Use RAC format (Rule/Analysis/Conclusion) for legal issues
- Include exact USC sections and recent case citations
- Address both federal DPPA and relevant state law variations
- Provide practical compliance advice and risk mitigation
- Acknowledge legal advice limitations appropriately
- Focus on 2024-2025 enforcement trends and current issues

Your responses should demonstrate deep expertise in DPPA law while providing practical, actionable guidance for businesses and individuals navigating privacy compliance in 2025.`;
// Function to estimate token count (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Function to truncate chat history to fit within token limits
function truncateMessages(messages, maxTokens = 3000) {
  if (!messages || messages.length === 0) return [];
  
  let totalTokens = 0;
  const truncatedMessages = [];
  
  // Process messages in reverse order (most recent first)
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = estimateTokens(message.content || '');
    
    // If adding this message would exceed the limit, stop
    if (totalTokens + messageTokens > maxTokens) {
      break;
    }
    
    totalTokens += messageTokens;
    truncatedMessages.unshift(message); // Add to beginning to maintain order
  }
  
  return truncatedMessages;
}

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    // Truncate messages to prevent token overflow
    // System prompt ~2000 tokens + truncated messages ~3000 tokens = ~5000 total
    const truncatedMessages = truncateMessages(messages, 3000);
    
    console.log(`Original messages: ${messages.length}, Truncated: ${truncatedMessages.length}`);

    const models = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192', 
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'gemma2-9b-it'
    ];

    let response = null;
    let lastError = null;
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...truncatedMessages
            ],
            max_tokens: 1500,
            temperature: 0.3,
          }),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error(`Model ${model} failed:`, errorText);
          lastError = `Model ${model}: ${errorText}`;
          continue;
        }

        const data = await apiResponse.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          response = data.choices[0].message.content;
          console.log(`Success with model: ${model}`);
          break;
        } else {
          console.error(`Model ${model} returned unexpected format:`, data);
          lastError = `Model ${model}: Unexpected response format`;
          continue;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        lastError = `Model ${model}: ${error.message}`;
        continue;
      }
    }
    if (!response) {
      console.error('All models failed, last error:', lastError);
      res.status(500).json({ 
        error: 'Failed to get response from AI models',
        details: lastError 
      });
      return;
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;