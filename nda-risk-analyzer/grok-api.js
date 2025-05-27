// Production Grok API - llama-3.3-70b-versatile
const GROK_API_CONFIG = {
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    apiKey: 'YOUR_GROK_API_KEY_HERE'
};

async function callGrokAPI(ndaText, industry) {
    const systemPrompt = `You are CA attorney Sergei Tokmakov (Bar #279869). 

ANSWER: "Is it okay to sign this NDA as-is?"

FORMAT:
1. RECOMMENDATION: [DO NOT SIGN/SIGN WITH CAUTION/ACCEPTABLE] + why
2. SUMMARY: What this NDA does
3. CLAUSE ANALYSIS: Risk: RED/YELLOW/GREEN + Issue + Redraft  
4. MISSING CLAUSES: Specific to this NDA
5. BOTTOM LINE: Action items

Industry: ${industry === 'auto-detect' ? 'Determine from context' : industry}`;

    try {
        const response = await fetch(GROK_API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROK_API_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROK_API_CONFIG.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Analyze:\n\n${ndaText}` }
                ],
                temperature: 0.2,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return parseGrokResponse(data.choices[0].message.content);
    } catch (error) {
        console.error('API Failed:', error);
        return createFallbackAnalysis(ndaText);
    }
}
// Parse Grok response into structured format
function parseGrokResponse(grokText) {
    const analysis = {
        recommendation: extractRecommendation(grokText),
        executiveSummary: extractSection(grokText, 'RECOMMENDATION'),
        documentSummary: extractSection(grokText, 'SUMMARY'),
        clauses: extractClauses(grokText),
        missingClauses: extractMissingClauses(grokText),
        bottomLine: extractSection(grokText, 'BOTTOM LINE'),
        overallRisk: calculateRiskFromText(grokText)
    };
    return analysis;
}

function extractRecommendation(text) {
    const match = text.match(/RECOMMENDATION:\s*(DO NOT SIGN|SIGN WITH CAUTION|ACCEPTABLE)/i);
    return match ? match[1] : 'SIGN WITH CAUTION';
}

function extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z ]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
}

function extractClauses(text) {
    const clauseSection = extractSection(text, 'CLAUSE ANALYSIS');
    const clauses = [];
    
    const blocks = clauseSection.split(/(?=Risk:|Clause)/);
    blocks.forEach(block => {
        if (block.includes('RED') || block.includes('YELLOW') || block.includes('GREEN')) {
            const riskMatch = block.match(/(RED|YELLOW|GREEN)/i);
            const riskLevel = riskMatch ? riskMatch[1] : 'MEDIUM';
            
            clauses.push({
                title: extractClauseTitle(block),
                riskLevel: riskLevel.toUpperCase(),
                analysis: block.trim(),
                redraftSuggestion: extractRedraft(block)
            });
        }
    });
    
    return clauses;
}

function extractMissingClauses(text) {
    const section = extractSection(text, 'MISSING CLAUSES');
    return section.split('\n').filter(line => line.trim()).slice(0, 5);
}

function calculateRiskFromText(text) {
    if (text.includes('DO NOT SIGN')) return 9;
    if (text.includes('SIGN WITH CAUTION')) return 6;
    return 3;
}

function createFallbackAnalysis(ndaText) {
    return {
        recommendation: 'SIGN WITH CAUTION',
        executiveSummary: 'API temporarily unavailable. Manual review recommended.',
        documentSummary: 'Standard NDA requiring careful review.',
        clauses: [],
        missingClauses: ['Manual analysis needed'],
        bottomLine: 'Consult with attorney for detailed review.',
        overallRisk: 6
    };
}
function extractClauseTitle(block) {
    const lines = block.split('\n');
    return lines[0].replace(/Risk:|RED|YELLOW|GREEN/gi, '').trim() || 'Contract Clause';
}

function extractRedraft(block) {
    const redraftMatch = block.match(/Redraft:?\s*([^\n]+)/i);
    return redraftMatch ? redraftMatch[1] : 'Review recommended';
}

// Export functions
window.callGrokAPI = callGrokAPI;
window.GROK_API_CONFIG = GROK_API_CONFIG;