// Grok API Integration for NDA Risk Analyzer
// Replace with your actual Grok API endpoint and configuration

const GROK_API_CONFIG = {
    endpoint: 'https://api.x.ai/v1/chat/completions', // Replace with actual Grok API endpoint
    apiKey: 'YOUR_GROK_API_KEY', // Replace with your actual API key
    model: 'grok-beta' // Replace with actual Grok model name
};

// Enhanced API call function for production use
async function callGrokAPIProduction(prompt) {
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
                    {
                        role: 'system',
                        content: `You are a specialized legal AI assistant working with California attorney Sergei Tokmakov (CA Bar #279869). 
                        
You must analyze NDAs with professional-grade legal expertise, considering:
- California Business and Professions Code Section 16600 (non-compete restrictions)
- Uniform Trade Secrets Act provisions
- Industry-specific best practices
- Enforceability standards across different jurisdictions
- Business impact assessment for different company sizes

Always respond with structured JSON containing detailed risk analysis, clause breakdowns, and practical recommendations.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent legal analysis
                max_tokens: 4000,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Grok API Error:', error);
        throw error;
    }
}

// Fallback analysis for when API is unavailable
function getFallbackAnalysis() {
    return {
        overallRisk: 6,
        fairnessScore: 45,
        executiveSummary: "This NDA requires careful review. Several clauses may need modification to better protect your interests while maintaining the confidentiality protections needed by the disclosing party.",
        riskScores: {
            enforceability: 6,
            businessImpact: 7,
            litigationRisk: 5,
            complianceBurden: 6
        },
        clauses: [
            {
                title: "Definition of Confidential Information",
                text: "Sample clause text would appear here...",
                riskLevel: "MEDIUM",
                analysis: "The definition appears broad but may be within acceptable ranges. Consider requesting specific exclusions for information you already possess.",
                suggestions: [
                    "Add exclusion for independently developed information",
                    "Clarify what constitutes 'confidential' information",
                    "Request reciprocal confidentiality obligations"
                ]
            }
        ],
        industryFlags: [
            "Review impact on hiring practices",
            "Consider effects on collaborative development",
            "Evaluate restrictions on open source contributions"
        ],
        jurisdictionIssues: [
            "California law limits enforceability of certain restrictive covenants",
            "Consider alternative dispute resolution clauses",
            "Review injunctive relief provisions"
        ],
        missingProtections: [
            "No mutual confidentiality provisions",
            "Missing standard information exceptions",
            "No clear termination procedures"
        ],
        negotiationPriorities: [
            "HIGH: Request mutual obligations",
            "MEDIUM: Narrow confidentiality definition",
            "LOW: Add standard exceptions"
        ]
    };
}

export { callGrokAPIProduction, getFallbackAnalysis, GROK_API_CONFIG };