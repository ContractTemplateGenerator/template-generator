const { useState, useRef, useEffect } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStatus, setAnalysisStatus] = useState('');
    const [useClaudeAI, setUseClaudeAI] = useState(false);
    const [ndaUrl, setNdaUrl] = useState('');
    const [extractedData, setExtractedData] = useState({ parties: [], businessPurpose: '', jurisdiction: '' });
    const [selectedChanges, setSelectedChanges] = useState({});
    const [suggestions, setSuggestions] = useState({
        quickFixes: [],
        party1: [],
        party2: [],
        neutral: []
    });
    const [activeTab, setActiveTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const fileInputRef = useRef(null);
    const previewRef = useRef(null);

    // Tab configuration
    const tabs = [
        { id: 'quickFixes', label: 'Quick Fixes', icon: '⚡' },
        { id: 'party1', label: 'Disclosing Party', icon: '🔒' },
        { id: 'party2', label: 'Receiving Party', icon: '🔓' },
        { id: 'neutral', label: 'Neutral Changes', icon: '⚖️' }
    ];

    const extractNDAData = (text) => {
        const data = { parties: [], businessPurpose: '', jurisdiction: '' };
        const partyMatches = text.match(/\b([A-Z][A-Za-z\s]+(?:Inc|LLC|Corp|Ltd|Company)\.?)\b/g);
        if (partyMatches) data.parties = [...new Set(partyMatches.map(p => p.trim()))].slice(0, 2);
        const purposeMatch = text.match(/(?:purpose of|in connection with|relating to)\s+([^.\n]{10,100})/i);
        if (purposeMatch) data.businessPurpose = purposeMatch[1].trim();
        const jurisdictionMatch = text.match(/(?:governed by|jurisdiction of|laws of)\s+(?:the\s+)?([^,.\n]+)/i);
        if (jurisdictionMatch) data.jurisdiction = jurisdictionMatch[1].trim();
        return data;
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            let text = '';
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                text = await file.text();
            } else {
                alert('Please upload .txt files or paste text directly.');
                return;
            }
            setNdaText(text);
            setExtractedData(extractNDAData(text));
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please paste text directly.');
        }
    };

    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        setIsAnalyzing(true);
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const data = await response.json();
                let content = data.contents;
                
                content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
                content = content.replace(/<br\s*\/?>/gi, '\n');
                content = content.replace(/<\/p>/gi, '\n\n');
                content = content.replace(/<[^>]*>/g, ' ');
                content = content.replace(/&[a-zA-Z0-9#]+;/g, ' ');
                content = content.replace(/\s+/g, ' ').replace(/\n\s+/g, '\n').trim();
                
                if (content.length > 50) {
                    setNdaText(content);
                    setExtractedData(extractNDAData(content));
                } else {
                    throw new Error('No meaningful content found');
                }
            } else {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
        } catch (error) {
            console.error('URL fetch error:', error);
            alert('Could not fetch URL content. Please check URL or paste text directly.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTextChange = (text) => {
        setNdaText(text);
        if (text.trim().length > 100) {
            setExtractedData(extractNDAData(text));
        }
    };

    const analyzeSuggestionsFromText = (aiResponse) => {
        const party1 = extractedData.parties[0] || 'Disclosing Party';
        const party2 = extractedData.parties[1] || 'Receiving Party';
        
        // Clean HTML formatting from response
        let cleanResponse = aiResponse.replace(/<\/?[^>]+(>|$)/g, "");
        cleanResponse = cleanResponse.replace(/&[a-zA-Z0-9#]+;/g, ' ');
        cleanResponse = cleanResponse.replace(/\*\*/g, '');
        
        // Parse suggestions from AI response
        const suggestions = {
            quickFixes: [],
            party1: [],
            party2: [],
            neutral: []
        };

        // Split by clear section headers
        const quickFixSection = cleanResponse.match(/QUICK FIXES.*?(?=ANALYSIS FOR|IMPROVEMENTS FOR|$)/is)?.[0] || '';
        const party1Section = cleanResponse.match(/(?:ANALYSIS FOR|IMPROVEMENTS FOR).*?(?:DISCLOSING|PARTY 1).*?(?=ANALYSIS FOR|IMPROVEMENTS FOR|$)/is)?.[0] || '';
        const party2Section = cleanResponse.match(/(?:ANALYSIS FOR|IMPROVEMENTS FOR).*?(?:RECEIVING|PARTY 2).*?(?=ANALYSIS FOR|IMPROVEMENTS FOR|NEUTRAL|$)/is)?.[0] || '';
        const neutralSection = cleanResponse.match(/(?:NEUTRAL|MUTUAL).*?IMPROVEMENTS.*?(?=$)/is)?.[0] || '';
        
        // Extract suggestions from each section
        suggestions.quickFixes = extractSuggestionsFromSection(quickFixSection, 'quickFixes');
        suggestions.party1 = extractSuggestionsFromSection(party1Section, 'party1');
        suggestions.party2 = extractSuggestionsFromSection(party2Section, 'party2');
        suggestions.neutral = extractSuggestionsFromSection(neutralSection, 'neutral');

        // Add fallback suggestions if sections are empty
        if (suggestions.quickFixes.length === 0) {
            suggestions.quickFixes = createFallbackQuickFixes(party1, party2);
        }
        if (suggestions.party1.length === 0) {
            suggestions.party1 = createFallbackParty1Suggestions(party1);
        }
        if (suggestions.party2.length === 0) {
            suggestions.party2 = createFallbackParty2Suggestions(party2);
        }
        if (suggestions.neutral.length === 0) {
            suggestions.neutral = createFallbackNeutralSuggestions();
        }

        return suggestions;
    };

    const extractSuggestionsFromSection = (sectionText, category) => {
        const suggestions = [];
        
        // Extract individual suggestions with Original/Improved pattern
        const suggestionMatches = sectionText.match(/([^.!?\n]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/gi) || [];
        
        suggestionMatches.forEach((match, index) => {
            const parts = match.match(/([^.!?\n]+)[:.]\s*Original:\s*"([^"]+)"\s*Improved:\s*"([^"]+)"/i);
            if (parts && parts.length >= 4) {
                const suggestion = {
                    id: `${category}_${index}`,
                    title: parts[1].trim().substring(0, 80),
                    description: parts[1].trim(),
                    originalText: parts[2].trim(),
                    improvedText: parts[3].trim(),
                    impact: determineImpact(parts[1]),
                    riskLevel: determineRiskLevel(parts[1])
                };
                suggestions.push(suggestion);
            }
        });
        
        return suggestions;
    };

    const determineImpact = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('critical') || titleLower.includes('termination') || titleLower.includes('liability')) {
            return 'high';
        }
        if (titleLower.includes('definition') || titleLower.includes('scope') || titleLower.includes('return')) {
            return 'medium';
        }
        return 'low';
    };

    const determineRiskLevel = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('critical') || titleLower.includes('indefinite') || titleLower.includes('one-sided')) {
            return 'red';
        }
        if (titleLower.includes('broad') || titleLower.includes('unclear') || titleLower.includes('excessive')) {
            return 'yellow';
        }
        return 'green';
    };

    const createFallbackQuickFixes = (party1, party2) => {
        const fixes = [];
        const text = ndaText.toLowerCase();
        
        // Check for overly broad confidentiality definition
        if (text.includes('all information') || text.includes('any information')) {
            fixes.push({
                id: 'quick_broad_def',
                title: '🚨 Overly Broad Confidentiality Definition',
                description: 'Current definition of "all information" is excessively broad and unenforceable',
                originalText: 'all information furnished by the Disclosing Party',
                improvedText: 'information that is marked as confidential or disclosed under circumstances indicating its confidential nature',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Check for excessive term length
        const termMatch = text.match(/(\d+)\s*year/);
        if (termMatch && parseInt(termMatch[1]) > 3) {
            fixes.push({
                id: 'quick_term_length',
                title: '⚠️ Excessive Confidentiality Term',
                description: `${termMatch[1]} years is unreasonably long for confidentiality obligations`,
                originalText: `shall remain in effect for ${termMatch[1]} year(s)`,
                improvedText: 'shall remain in effect for 2 years with confidentiality obligations lasting 3 years maximum',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Check for missing termination rights
        if (!text.includes('terminate') || !text.includes('thirty') && !text.includes('30')) {
            fixes.push({
                id: 'quick_termination',
                title: '⚠️ Add Mutual Termination Rights',
                description: 'Either party should be able to terminate with reasonable notice period',
                originalText: 'This Agreement takes effect on the Effective Date',
                improvedText: 'Either party may terminate this Agreement upon thirty (30) days written notice',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Check for problematic IP assignment
        if (text.includes('all work product') || text.includes('sole and exclusive property')) {
            fixes.push({
                id: 'quick_ip_assignment',
                title: '🚨 Excessive IP Assignment Clause',
                description: 'Current IP assignment heavily favors one party - should be scope-limited',
                originalText: 'all Work Product is and will be the sole and exclusive property',
                improvedText: 'Work Product specifically created for and relating to Disclosing Party\'s business',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Check for missing standard exclusions
        if (!text.includes('public domain') || !text.includes('independently developed')) {
            fixes.push({
                id: 'quick_exclusions',
                title: '⚠️ Add Standard Confidentiality Exclusions',
                description: 'Missing critical exclusions for public domain and independently developed information',
                originalText: 'The above restrictions on the use or disclosure',
                improvedText: 'Confidentiality obligations do not apply to information that: (a) is public domain, (b) independently developed, (c) rightfully received from third parties, (d) required by law',
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        // Check for unlimited indemnification
        if (text.includes('fully indemnify') || text.includes('any and all')) {
            fixes.push({
                id: 'quick_indemnification',
                title: '🚨 Unlimited Indemnification Exposure',
                description: 'Indemnification creates unlimited liability - should be capped and mutual',
                originalText: 'Each Party shall fully indemnify the other against any and all actions, claims, liability',
                improvedText: 'Indemnification limited to direct damages up to $50,000, excluding consequential damages',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        return fixes;
    };

    const createFallbackParty1Suggestions = (party1) => {
        const suggestions = [];
        const text = ndaText.toLowerCase();
        
        // Add liquidated damages clause
        if (!text.includes('liquidated damages') && !text.includes('$')) {
            suggestions.push({
                id: 'party1_liquidated_damages',
                title: 'Add Liquidated Damages Clause',
                description: `Strengthen ${party1}'s position by adding specific monetary penalties for breaches`,
                originalText: 'any breach or threatened breach of this Agreement will cause not only financial harm',
                improvedText: `any breach will result in liquidated damages of $10,000 per incident, plus injunctive relief`,
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        // Strengthen return obligations
        if (!text.includes('certification') || !text.includes('10 days')) {
            suggestions.push({
                id: 'party1_return_obligations',
                title: 'Strengthen Return Obligations',
                description: `Enhance ${party1}'s ability to ensure complete return of confidential materials`,
                originalText: 'Return to the Disclosing Party all Confidential Information provided',
                improvedText: 'Return all Confidential Information and provide written certification of destruction of all copies within 10 days',
                impact: 'medium',
                riskLevel: 'green'
            });
        }
        
        // Add survival clause
        if (!text.includes('survive') && !text.includes('survival')) {
            suggestions.push({
                id: 'party1_survival',
                title: 'Add Survival Clause for Key Provisions',
                description: `Ensure ${party1}'s protections continue after agreement termination`,
                originalText: 'This Agreement takes effect on the Effective Date',
                improvedText: 'Confidentiality, IP assignment, and indemnification obligations shall survive termination for 5 years',
                impact: 'medium',
                riskLevel: 'green'
            });
        }
        
        // Add employee non-solicitation
        if (!text.includes('solicit') && !text.includes('recruit') && !text.includes('hire')) {
            suggestions.push({
                id: 'party1_non_solicitation',
                title: 'Add Employee Non-Solicitation Clause',
                description: `Protect ${party1} against employee poaching during sensitive business discussions`,
                originalText: 'The Receiving Party: (a) shall take all reasonable steps',
                improvedText: 'The Receiving Party: (a) agrees not to directly or indirectly solicit, recruit, or hire any employees of Disclosing Party during the term and for 12 months thereafter; (b) shall take all reasonable steps',
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        // Strengthen confidentiality definition
        if (!text.includes('regardless of marking') || text.includes('all information')) {
            suggestions.push({
                id: 'party1_broader_definition',
                title: 'Expand Confidentiality Definition',
                description: `Broaden protection to include information that ${party1} considers confidential`,
                originalText: 'information that is marked, accompanied or supported by documents clearly and conspicuously designating',
                improvedText: 'all information disclosed regardless of marking, including information that a reasonable person would understand to be confidential',
                impact: 'high',
                riskLevel: 'yellow'
            });
        }
        
        // Add stronger enforcement rights
        if (!text.includes('without bond') || !text.includes('attorney')) {
            suggestions.push({
                id: 'party1_enforcement',
                title: 'Strengthen Enforcement Mechanisms',
                description: `Give ${party1} stronger legal remedies and cost recovery rights`,
                originalText: 'Therefore, Disclosing Party shall be entitled, in addition to any other legal or equitable remedies',
                improvedText: 'Disclosing Party shall be entitled to immediate injunctive relief without posting bond, plus attorney\'s fees and costs for successful enforcement',
                impact: 'medium',
                riskLevel: 'green'
            });
        }
        
        return suggestions;
    };

    const createFallbackParty2Suggestions = (party2) => {
        const suggestions = [];
        const text = ndaText.toLowerCase();
        
        // Limit confidentiality scope - marking requirement
        if (text.includes('all information') || !text.includes('marked')) {
            suggestions.push({
                id: 'party2_narrow_definition',
                title: '🚨 Limit Confidentiality Scope - Add Marking Requirement',
                description: `Reduce ${party2}'s compliance burden by requiring clear marking of confidential information`,
                originalText: 'all information furnished by the Disclosing Party',
                improvedText: 'information specifically marked "CONFIDENTIAL" or identified as confidential in writing within 30 days',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Add residual knowledge exception
        if (!text.includes('residual') && !text.includes('general knowledge')) {
            suggestions.push({
                id: 'party2_residual_knowledge',
                title: 'Add Residual Knowledge Exception',
                description: `Protect ${party2}'s ability to use general knowledge gained during relationship`,
                originalText: 'shall not use Confidential Information for any purpose other than in connection with the Purpose',
                improvedText: 'may retain and use general knowledge, skills, and experience gained, provided no specific confidential information is disclosed',
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        // Limit excessive term
        const termMatch = text.match(/(\d+)\s*year/);
        if (termMatch && parseInt(termMatch[1]) > 3) {
            suggestions.push({
                id: 'party2_limit_term',
                title: '⚠️ Reduce Excessive Confidentiality Term',
                description: `${termMatch[1]} years creates unreasonable long-term compliance burden for ${party2}`,
                originalText: `shall remain in effect for ${termMatch[1]} year(s)`,
                improvedText: 'shall remain in effect for 2 years with confidentiality obligations ending 3 years from disclosure',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Limit indemnification exposure
        if (text.includes('fully indemnify') || text.includes('any and all')) {
            suggestions.push({
                id: 'party2_limit_indemnification',
                title: '🚨 Cap Indemnification Exposure',
                description: `Reduce ${party2}'s financial risk by limiting indemnification obligations`,
                originalText: 'Each Party shall fully indemnify the other against any and all actions, claims, liability',
                improvedText: 'Indemnification shall be limited to direct damages up to the compensation received, excluding consequential damages',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Limit IP assignment scope
        if (text.includes('all work product') || text.includes('sole and exclusive')) {
            suggestions.push({
                id: 'party2_limit_ip_assignment',
                title: '🚨 Limit Scope of IP Assignment',
                description: `Prevent ${party2} from losing rights to all intellectual property and improvements`,
                originalText: 'all Work Product is and will be the sole and exclusive property',
                improvedText: 'Work Product directly created for Disclosing Party\'s specific project, excluding pre-existing IP and general improvements',
                impact: 'high',
                riskLevel: 'red'
            });
        }
        
        // Add permitted disclosures
        if (!text.includes('legal counsel') && !text.includes('advisors')) {
            suggestions.push({
                id: 'party2_permitted_disclosures',
                title: 'Add Permitted Disclosure to Advisors',
                description: `Allow ${party2} to share information with legal and financial advisors`,
                originalText: 'shall not disclose or reveal any Confidential Information to any person',
                improvedText: 'may disclose Confidential Information to legal counsel, accountants, and financial advisors under confidentiality obligations',
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        // Add backup/compliance retention exception
        if (!text.includes('backup') && !text.includes('compliance')) {
            suggestions.push({
                id: 'party2_backup_retention',
                title: 'Add Backup and Compliance Retention Exception',
                description: `Allow ${party2} to retain information in standard business systems`,
                originalText: 'Destroy all copies it made of Confidential Information',
                improvedText: 'Destroy all copies except those retained in automated backup systems or for legal compliance purposes',
                impact: 'low',
                riskLevel: 'green'
            });
        }
        
        // Limit "reasonable steps" definition
        if (text.includes('reasonable steps') && !text.includes('ordinary care')) {
            suggestions.push({
                id: 'party2_reasonable_steps',
                title: 'Clarify "Reasonable Steps" Standard',
                description: `Define reasonable care standard to prevent excessive security requirements for ${party2}`,
                originalText: 'reasonable steps means those steps the Receiving Party takes to protect its own similar proprietary',
                improvedText: 'reasonable steps means ordinary care, which shall not require extraordinary security measures',
                impact: 'medium',
                riskLevel: 'yellow'
            });
        }
        
        return suggestions;
    };

    const createFallbackNeutralSuggestions = () => {
        const suggestions = [];
        const text = ndaText.toLowerCase();
        
        // Add dispute resolution mechanism
        if (!text.includes('arbitration') && !text.includes('mediation')) {
            suggestions.push({
                id: 'neutral_dispute_resolution',
                title: 'Add Dispute Resolution Mechanism',
                description: 'Include mediation/arbitration process to resolve conflicts efficiently and cost-effectively',
                originalText: 'All disputes arising out of this Agreement shall be resolved by courts',
                improvedText: 'Disputes shall first be subject to mediation, then binding arbitration under AAA Commercial Rules',
                impact: 'medium',
                riskLevel: 'green'
            });
        }
        
        // Clarify notice requirements
        if (!text.includes('30 days') && text.includes('identified as confidential')) {
            suggestions.push({
                id: 'neutral_notice_requirements',
                title: 'Clarify Confidentiality Marking Timeline',
                description: 'Specify timeframe for marking oral disclosures to avoid future disputes',
                originalText: 'identified as confidential or proprietary at the time of disclosure',
                improvedText: 'clearly marked "CONFIDENTIAL" or identified as confidential in writing within 30 days of disclosure',
                impact: 'low',
                riskLevel: 'green'
            });
        }
        
        // Add mutual warranty disclaimers
        if (!text.includes('as is') || !text.includes('accuracy')) {
            suggestions.push({
                id: 'neutral_warranty_disclaimers',
                title: 'Add Balanced Warranty Disclaimers',
                description: 'Include mutual disclaimers while maintaining basic authority representations',
                originalText: 'All Confidential Information is provided "AS IS" and without warranty',
                improvedText: 'Each party represents authority to enter this agreement and warrants no known inaccuracies in disclosed information',
                impact: 'low',
                riskLevel: 'green'
            });
        }
        
        // Add force majeure clause
        if (!text.includes('force majeure') && !text.includes('acts of god')) {
            suggestions.push({
                id: 'neutral_force_majeure',
                title: 'Add Force Majeure Protection',
                description: 'Protect both parties from liability due to unforeseeable circumstances',
                originalText: 'Each Party acknowledges and confirms that a breach of its obligations',
                improvedText: 'Neither party shall be liable for delays or failures due to circumstances beyond reasonable control, including force majeure events. Each Party acknowledges and confirms that a breach of its obligations',
                impact: 'low',
                riskLevel: 'green'
            });
        }
        
        // Improve governing law clarity
        if (text.includes('laws of') && !text.includes('venue')) {
            suggestions.push({
                id: 'neutral_jurisdiction_clarity',
                title: 'Clarify Jurisdiction and Venue',
                description: 'Specify both governing law and court jurisdiction for dispute resolution',
                originalText: 'This Agreement and any action related thereto will be governed and interpreted by and under the laws',
                improvedText: 'This Agreement shall be governed by [State] law, with exclusive jurisdiction in [State] courts, or as specified in dispute resolution provisions',
                impact: 'low',
                riskLevel: 'green'
            });
        }
        
        // Add assignment restrictions
        if (!text.includes('assign') && !text.includes('transfer')) {
            suggestions.push({
                id: 'neutral_assignment_restrictions',
                title: 'Add Assignment Restrictions',
                description: 'Prevent unauthorized transfer of agreement obligations to third parties',
                originalText: 'Each Party must deliver all notices or other communications',
                improvedText: 'Neither party may assign this Agreement without written consent, except to affiliates or successors. Each Party must deliver all notices or other communications',
                impact: 'medium',
                riskLevel: 'green'
            });
        }
        
        return suggestions;
    };

    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }
        
        // Initialize progress tracking
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setAnalysisStatus('Initializing analysis...');
        
        const party1 = extractedData.parties[0] || 'Disclosing Party';
        const party2 = extractedData.parties[1] || 'Receiving Party';
        
        // Progress update
        setTimeout(() => {
            setAnalysisProgress(20);
            setAnalysisStatus('Extracting contract clauses...');
        }, 500);
        
        const analysisPrompt = `Analyze this NDA from multiple perspectives focusing on standard NDA concerns. Each party wants to know: How restrictive is it? How well protected am I? What am I giving up?

PARTIES: ${party1} (Disclosing Party) and ${party2} (Receiving Party)
BUSINESS PURPOSE: ${extractedData.businessPurpose || 'Not specified'}
JURISDICTION: ${extractedData.jurisdiction || 'Not specified'}

ANALYSIS REQUIREMENTS:

1. OVERALL RISK ASSESSMENT: Is this safe to sign? (ACCEPTABLE / SIGN WITH CAUTION / DO NOT SIGN)

2. QUICK FIXES - Most Critical Issues (3-4 items):
Focus on: Overly broad definitions, missing termination rights, one-sided clauses, unenforceable terms

3. ANALYSIS FOR ${party1.toUpperCase()} (DISCLOSING PARTY):
Key concerns: Is my confidential info well protected? Can I enforce this? Do I have adequate remedies?
Issues to check: Weak confidentiality definitions, insufficient return obligations, lack of liquidated damages, poor enforcement mechanisms

4. ANALYSIS FOR ${party2.toUpperCase()} (RECEIVING PARTY):
Key concerns: How restrictive is this? What am I giving up? What's my liability exposure?
Issues to check: Overly broad confidentiality scope, excessive compliance burdens, one-sided IP assignment, unlimited indemnification, no residual knowledge rights

5. NEUTRAL IMPROVEMENTS:
Changes benefiting both parties: Clearer terms, better dispute resolution, mutual protections

STANDARD NDA ISSUES TO EVALUATE:
- Confidentiality definition scope (too broad "all information" vs. properly marked)
- Purpose/permitted use (narrow specific purpose vs. broad business relationship)
- Term length and termination rights (excessive 5+ year terms vs. reasonable 2-3 years)
- IP ownership and work product assignment (excessive "all work product" vs. scope-limited)
- Indemnification and liability exposure (unlimited vs. capped with exclusions)
- Return/destruction obligations (immediate vs. reasonable timeframes with exceptions)
- Standard exclusions (public domain, independently developed, rightfully received, required by law)
- Marking requirements (no marking requirement vs. clear marking obligations)
- Residual knowledge exceptions (missing vs. included to protect general learning)
- Employee/third party obligations (excessive liability vs. reasonable care standards)
- Survival clauses (unclear vs. specific provisions that survive termination)
- Enforcement mechanisms and remedies (one-sided vs. balanced with proper limitations)
- Disclosure to third parties (overly restrictive vs. reasonable exceptions for advisors)
- Reverse engineering prohibitions (absolute vs. qualified for publicly available info)
- Compliance with law disclosures (no notice requirement vs. advance notice and cooperation)

RED FLAGS TO IDENTIFY:
- "All information" without marking requirements
- Terms longer than 3 years
- "Sole and exclusive property" for all work product  
- "Fully indemnify...any and all" unlimited liability
- No termination rights or difficult termination
- Missing standard confidentiality exclusions
- No residual knowledge protection
- Automatic injunctive relief without showing harm
- One-way confidentiality or IP assignment

YELLOW FLAGS TO HIGHLIGHT:
- Vague "business relationship" purpose without specificity
- Missing destruction certification requirements
- Unclear "reasonable steps" standards
- No survival clause for key provisions
- Missing employee non-solicitation (if relevant)
- Broad indemnification without caps

FORMAT EACH SUGGESTION AS:
[Clear title]: [Description]. Original: "[exact text from agreement]" Improved: "[specific replacement text]"

NDA TEXT:
${ndaText}`;
        
        // Progress update
        setTimeout(() => {
            setAnalysisProgress(40);
            setAnalysisStatus('Analyzing legal provisions...');
        }, 1000);
        
        try {
            // Progress update
            setTimeout(() => {
                setAnalysisProgress(60);
                setAnalysisStatus('Generating recommendations...');
            }, 2000);
            
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: analysisPrompt }],
                    useClaudeAI: useClaudeAI,
                    extractedData: extractedData
                })
            });
            
            // Progress update
            setAnalysisProgress(80);
            setAnalysisStatus('Processing results...');
            
            if (response.ok) {
                const data = await response.json();
                
                // Extract risk assessment
                const riskMatch = data.response.match(/(ACCEPTABLE|SIGN WITH CAUTION|DO NOT SIGN)/i);
                const riskLevel = riskMatch ? riskMatch[1].toUpperCase() : 'SIGN WITH CAUTION';
                
                // Parse suggestions
                const parsedSuggestions = analyzeSuggestionsFromText(data.response);
                setSuggestions(parsedSuggestions);
                
                setAnalysisResult({
                    recommendation: riskLevel,
                    summary: extractSummary(data.response),
                    model: data.model,
                    provider: data.provider
                });
                
                // Complete progress
                setAnalysisProgress(100);
                setAnalysisStatus('Analysis complete!');
                
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            
            setAnalysisProgress(80);
            setAnalysisStatus('Using backup analysis...');
            
            // Fallback analysis
            const fallbackSuggestions = {
                quickFixes: createFallbackQuickFixes(party1, party2),
                party1: createFallbackParty1Suggestions(party1),
                party2: createFallbackParty2Suggestions(party2),
                neutral: createFallbackNeutralSuggestions()
            };
            setSuggestions(fallbackSuggestions);
            
            setAnalysisResult({
                recommendation: 'PROFESSIONAL REVIEW NEEDED',
                summary: `Analysis of agreement between ${party1} and ${party2} requires professional legal review.`,
                model: 'Fallback Analysis',
                provider: 'Terms.law'
            });
            
            setAnalysisProgress(100);
            setAnalysisStatus('Backup analysis complete!');
        } finally {
            // Clear progress after a short delay
            setTimeout(() => {
                setIsAnalyzing(false);
                setAnalysisProgress(0);
                setAnalysisStatus('');
            }, 1500);
        }
    };

    const extractSummary = (response) => {
        // Clean HTML formatting
        let cleanResponse = response.replace(/<\/?[^>]+(>|$)/g, "");
        cleanResponse = cleanResponse.replace(/&[a-zA-Z0-9#]+;/g, ' ');
        cleanResponse = cleanResponse.replace(/\*\*/g, '');
        cleanResponse = cleanResponse.replace(/<br\s*\/?>/gi, ' ');
        
        const party1 = extractedData.parties[0] || 'Disclosing Party';
        const party2 = extractedData.parties[1] || 'Receiving Party';
        
        // Try to extract specific summary sections
        const riskMatch = cleanResponse.match(/OVERALL RISK ASSESSMENT:([^.]*\.)/i);
        const party1Analysis = cleanResponse.match(/ANALYSIS FOR.*?DISCLOSING.*?:(.*?)(?=ANALYSIS FOR|$)/is);
        const party2Analysis = cleanResponse.match(/ANALYSIS FOR.*?RECEIVING.*?:(.*?)(?=QUICK FIXES|NEUTRAL|$)/is);
        
        let summary = '';
        
        if (riskMatch) {
            summary += riskMatch[1].trim() + ' ';
        }
        
        // Add party-specific insights
        summary += `FOR ${party1.toUpperCase()}: `;
        if (party1Analysis) {
            const party1Text = party1Analysis[1].trim().split(/[.!?]/)[0];
            summary += party1Text + '. ';
        } else {
            summary += 'This agreement provides standard protections but may benefit from stronger enforcement mechanisms. ';
        }
        
        summary += `FOR ${party2.toUpperCase()}: `;
        if (party2Analysis) {
            const party2Text = party2Analysis[1].trim().split(/[.!?]/)[0];
            summary += party2Text + '. ';
        } else {
            summary += 'This agreement imposes significant obligations and should be carefully reviewed for compliance burden. ';
        }
        
        // Add general assessment
        summary += 'Professional review recommended to optimize terms for both parties.';
        
        return summary;
    };

    const handleSuggestionChange = (suggestionId, isSelected) => {
        setSelectedChanges(prev => ({
            ...prev,
            [suggestionId]: isSelected
        }));
        setLastChanged(suggestionId);
    };

    const generatePreviewText = () => {
        let previewText = ndaText;
        const allSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral];
        
        console.log("Generating preview with", Object.keys(selectedChanges).filter(key => selectedChanges[key]).length, "selected changes");
        
        // Apply selected changes in order
        allSuggestions.forEach(suggestion => {
            if (selectedChanges[suggestion.id] && suggestion.originalText && suggestion.improvedText) {
                const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                
                console.log("Applying change:", cleanOriginal, "->", cleanImproved);
                
                // Try multiple replacement strategies
                if (previewText.includes(cleanOriginal)) {
                    previewText = previewText.replace(cleanOriginal, cleanImproved);
                    console.log("Applied exact match replacement");
                } else {
                    // Try case-insensitive replacement
                    const regex = new RegExp(cleanOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    if (regex.test(previewText)) {
                        previewText = previewText.replace(regex, cleanImproved);
                        console.log("Applied case-insensitive replacement");
                    } else {
                        console.log("No match found for:", cleanOriginal);
                    }
                }
            }
        });
        
        return previewText;
    };

    const generateHighlightedPreview = () => {
        let highlightedText = generatePreviewText();
        const allSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral];
        
        console.log("=== HIGHLIGHTED PREVIEW GENERATION ===");
        console.log("Preview text length:", highlightedText.length);
        console.log("Last changed:", lastChanged);
        
        // Highlight recently changed text
        if (lastChanged) {
            const changedSuggestion = allSuggestions.find(s => s.id === lastChanged);
            if (changedSuggestion && selectedChanges[lastChanged] && changedSuggestion.improvedText) {
                const cleanImproved = changedSuggestion.improvedText.replace(/['"]/g, '').trim();
                console.log("Highlighting text:", cleanImproved);
                
                // Create a more robust highlighting pattern
                const improvedTextEscaped = cleanImproved.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const improvedPattern = new RegExp(`(${improvedTextEscaped})`, 'gi');
                
                if (improvedPattern.test(highlightedText)) {
                    highlightedText = highlightedText.replace(improvedPattern, '<mark class="highlight-change">$1</mark>');
                    console.log("✓ Applied highlighting");
                } else {
                    console.log("✗ No text found to highlight");
                }
            }
        }

        // Format document with proper legal structure
        const lines = highlightedText.split('\n').filter(line => line.trim().length > 0);
        let formattedHtml = '';
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Document title
            if (trimmedLine.match(/^(\[)?CONFIDENTIALITY AGREEMENT/i)) {
                formattedHtml += `<h1 class="document-title">CONFIDENTIALITY AGREEMENT</h1>`;
                return;
            }
            
            // Main opening paragraph
            if (trimmedLine.startsWith('This Confidentiality Agreement') || trimmedLine.startsWith('This Nondisclosure Agreement')) {
                formattedHtml += `<p class="opening-paragraph">${trimmedLine}</p>`;
                return;
            }
            
            // Section headers (numbered)
            const sectionMatch = trimmedLine.match(/^(\d+)\.?\s*(.+)/);
            if (sectionMatch) {
                const sectionNum = sectionMatch[1];
                const sectionTitle = sectionMatch[2].replace(/\.$/, '');
                formattedHtml += `<h2 class="section-header">${sectionNum}. ${sectionTitle}</h2>`;
                return;
            }
            
            // Subsections (lettered)
            const subsectionMatch = trimmedLine.match(/^([a-z])\)\s*(.+)/i);
            if (subsectionMatch) {
                formattedHtml += `<p class="subsection"><strong>${subsectionMatch[1].toLowerCase()})</strong> ${subsectionMatch[2]}</p>`;
                return;
            }
            
            // Special handling for signature section
            if (trimmedLine.includes('IN WITNESS WHEREOF') || trimmedLine.includes('Disclosing Party') || trimmedLine.includes('Receiving Party')) {
                formattedHtml += `<div class="signature-section"><p class="signature-paragraph"><strong>${trimmedLine}</strong></p></div>`;
                return;
            }
            
            // Signature lines and names
            if (trimmedLine.includes('By:') || trimmedLine.includes('Printed Name:') || trimmedLine.includes('Title:') || trimmedLine.includes('Dated:')) {
                formattedHtml += `<p class="signature-line">${trimmedLine}</p>`;
                return;
            }
            
            // Regular paragraphs
            if (trimmedLine.length > 10) {
                formattedHtml += `<p class="legal-paragraph">${trimmedLine}</p>`;
            }
        });
        
        console.log("Final formatted HTML length:", formattedHtml.length);
        return formattedHtml;
    };

    // Auto-scroll to highlighted changes with improved reliability
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            // Increased delay to ensure DOM is fully updated
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlight-change');
                if (highlightedElement) {
                    // First check if element is visible
                    const rect = highlightedElement.getBoundingClientRect();
                    const container = previewRef.current;
                    const containerRect = container.getBoundingClientRect();
                    
                    // Only scroll if element is not fully visible
                    if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
                        highlightedElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                    
                    // Add enhanced highlighting effect
                    highlightedElement.style.animation = 'highlight-pulse 3s ease-in-out';
                    highlightedElement.style.backgroundColor = '#ffeb3b';
                    
                    // Clear highlighting after 4 seconds
                    setTimeout(() => {
                        if (highlightedElement) {
                            highlightedElement.style.animation = '';
                            highlightedElement.style.backgroundColor = '#fff9c4';
                        }
                        setLastChanged(null);
                    }, 4000);
                } else {
                    // If no highlighted element found, clear the lastChanged state
                    setTimeout(() => setLastChanged(null), 1000);
                }
            }, 500); // Increased from 200ms to 500ms
        }
    }, [lastChanged, selectedChanges]);

    const copyToClipboard = async () => {
        const text = generatePreviewText();
        try {
            await navigator.clipboard.writeText(text);
            alert('Agreement copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Copy failed. Please try selecting and copying manually.');
        }
    };

    const downloadAsWord = () => {
        const selectedSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral]
            .filter(s => selectedChanges[s.id]);
        
        if (selectedSuggestions.length === 0) {
            alert('Please select at least one improvement to download.');
            return;
        }

        try {
            console.log("Starting RTF Word document generation...");
            
            // Start with original text and apply changes with RTF redlining
            let processedText = ndaText;
            
            // Apply changes with RTF-compatible redlining
            selectedSuggestions.forEach((suggestion, index) => {
                if (suggestion.originalText && suggestion.improvedText) {
                    const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                    const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                    
                    console.log(`Processing RTF change ${index + 1}:`, cleanOriginal.substring(0, 30), "->", cleanImproved.substring(0, 30));
                    
                    if (processedText.includes(cleanOriginal)) {
                        // Escape RTF special characters
                        const escapedOriginal = cleanOriginal
                            .replace(/\\/g, '\\\\')
                            .replace(/\{/g, '\\{')
                            .replace(/\}/g, '\\}');
                        const escapedImproved = cleanImproved
                            .replace(/\\/g, '\\\\')
                            .replace(/\{/g, '\\{')
                            .replace(/\}/g, '\\}');
                        
                        // Create working RTF redlined replacement
                        const redlinedReplacement = `{\\strike\\cf2 ${escapedOriginal}} {\\cf3\\chcbpat4 ${escapedImproved}}`;
                        processedText = processedText.replace(cleanOriginal, redlinedReplacement);
                        console.log("✓ Applied RTF redlining");
                    } else {
                        console.log("✗ Text not found in document");
                    }
                }
            });

            // Create RTF content with proper color table for redlining
            let rtfContent = `{\\rtf1\\ansi\\deff0 
{\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red255\\green0\\blue0;\\red0\\green150\\blue0;\\red255\\green255\\blue0;}
\\f0\\fs24
\\qc\\b\\ul CONFIDENTIALITY AGREEMENT\\b0\\ul0\\par
\\pard\\par
`;

            // Parse and format the document
            const lines = processedText.split('\n').filter(line => line.trim().length > 0);
            
            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                
                // Skip title line since we already added it
                if (trimmedLine.match(/^(\[)?CONFIDENTIALITY AGREEMENT/i)) {
                    return;
                }
                
                // Opening paragraph
                if (trimmedLine.startsWith('This Confidentiality Agreement')) {
                    rtfContent += `${trimmedLine}\\par\\par\n`;
                    return;
                }
                
                // Section headers
                const sectionMatch = trimmedLine.match(/^(\d+)\)\s*(.+)/);
                if (sectionMatch) {
                    const sectionNum = sectionMatch[1];
                    const sectionTitle = sectionMatch[2].replace(/\.$/, '');
                    rtfContent += `\\b ${sectionNum}. ${sectionTitle}\\b0\\par\n`;
                    return;
                }
                
                // Subsections
                const subsectionMatch = trimmedLine.match(/^([a-z])\)\s*(.+)/i);
                if (subsectionMatch) {
                    rtfContent += `\\li360 \\b ${subsectionMatch[1].toLowerCase()})\\b0 ${subsectionMatch[2]}\\par\n`;
                    return;
                }
                
                // Signature section
                if (trimmedLine.includes('IN WITNESS WHEREOF')) {
                    rtfContent += `\\par\\b ${trimmedLine}\\b0\\par\n`;
                    return;
                }
                
                // Regular paragraphs
                if (trimmedLine.length > 10) {
                    // Escape RTF special characters
                    const escapedLine = trimmedLine
                        .replace(/\\/g, '\\\\')
                        .replace(/\{/g, '\\{')
                        .replace(/\}/g, '\\}');
                    rtfContent += `${escapedLine}\\par\\par\n`;
                }
            });
            
            // Add page break and change summary
            rtfContent += `\\page\n`;
            rtfContent += `\\qc\\b\\fs28 SUMMARY OF CHANGES\\b0\\fs24\\par\\par\n`;
            rtfContent += `\\pard\\b Total Changes Applied:\\b0 ${selectedSuggestions.length}\\par\n`;
            rtfContent += `\\b Review Date:\\b0 ${new Date().toLocaleDateString()}\\par\n`;
            rtfContent += `\\b Analyzed by:\\b0 NDA Legal Risk Analyzer\\par\\par\n`;
            
            selectedSuggestions.forEach((suggestion, index) => {
                rtfContent += `\\b Change ${index + 1}:\\b0 ${suggestion.title}\\par\n`;
                rtfContent += `\\b Risk Level:\\b0 ${suggestion.riskLevel} - ${suggestion.impact} impact\\par\n`;
                rtfContent += `\\b Original:\\b0 {\\strike ${suggestion.originalText}}\\par\n`;
                rtfContent += `\\b Revised:\\b0 {\\highlight3 ${suggestion.improvedText}}\\par\n`;
                rtfContent += `\\b Rationale:\\b0 ${suggestion.description}\\par\\par\n`;
            });
            
            // Close RTF document
            rtfContent += `}`;
            
            // Create and download the file
            const blob = new Blob([rtfContent], { 
                type: 'application/rtf'
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `NDA_Redlined_${new Date().toISOString().split('T')[0]}.rtf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("RTF Word document generated successfully");
            
        } catch (error) {
            console.error("Error generating RTF document:", error);
            alert("Error generating Word document. Please try the copy option or contact support.");
        }
    };

    const downloadCleanVersion = () => {
        const text = generatePreviewText();
        try {
            console.log("Starting clean RTF document generation...");
            
            // Create RTF content for clean document
            let rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24
\\qc\\b\\ul CONFIDENTIALITY AGREEMENT\\b0\\ul0\\par
\\pard\\par
`;

            // Parse and format the clean document
            const lines = text.split('\n').filter(line => line.trim().length > 0);
            
            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                
                // Skip title line since we already added it
                if (trimmedLine.match(/^(\[)?CONFIDENTIALITY AGREEMENT/i)) {
                    return;
                }
                
                // Main opening paragraph
                if (trimmedLine.startsWith('This Confidentiality Agreement')) {
                    const escapedLine = trimmedLine
                        .replace(/\\/g, '\\\\')
                        .replace(/\{/g, '\\{')
                        .replace(/\}/g, '\\}');
                    rtfContent += `${escapedLine}\\par\\par\n`;
                    return;
                }
                
                // Section headers (numbered)
                const sectionMatch = trimmedLine.match(/^(\d+)\)\s*(.+)/);
                if (sectionMatch) {
                    const sectionNum = sectionMatch[1];
                    const sectionTitle = sectionMatch[2].replace(/\.$/, '');
                    rtfContent += `\\b ${sectionNum}. ${sectionTitle}\\b0\\par\n`;
                    return;
                }
                
                // Subsections (lettered)
                const subsectionMatch = trimmedLine.match(/^([a-z])\)\s*(.+)/i);
                if (subsectionMatch) {
                    const escapedSubsection = subsectionMatch[2]
                        .replace(/\\/g, '\\\\')
                        .replace(/\{/g, '\\{')
                        .replace(/\}/g, '\\}');
                    rtfContent += `\\li360 \\b ${subsectionMatch[1].toLowerCase()})\\b0 ${escapedSubsection}\\par\n`;
                    return;
                }
                
                // Special handling for signature section
                if (trimmedLine.includes('IN WITNESS WHEREOF')) {
                    rtfContent += `\\par\\b ${trimmedLine}\\b0\\par\n`;
                    return;
                }
                
                // Signature lines
                if (trimmedLine.includes('X:') || trimmedLine.match(/^[A-Z][a-z]+ [A-Z]/) || trimmedLine.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
                    rtfContent += `${trimmedLine}\\par\n`;
                    return;
                }
                
                // Regular paragraphs
                if (trimmedLine.length > 10) {
                    const escapedLine = trimmedLine
                        .replace(/\\/g, '\\\\')
                        .replace(/\{/g, '\\{')
                        .replace(/\}/g, '\\}');
                    rtfContent += `${escapedLine}\\par\\par\n`;
                }
            });
            
            // Close RTF document
            rtfContent += `}`;
            
            // Create and download the file
            const blob = new Blob([rtfContent], { 
                type: 'application/rtf'
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `NDA_Clean_Final_${new Date().toISOString().split('T')[0]}.rtf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("Clean RTF document generated successfully");
            
        } catch (error) {
            console.error("Error generating clean RTF document:", error);
            alert("Error generating Word document. Please try the copy option.");
        }
    };

    const scheduleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({ 
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1' 
            });
        } else {
            window.open('https://terms.law/call/', '_blank');
        }
    };

    const getTotalSelectedChanges = () => {
        return Object.values(selectedChanges).filter(Boolean).length;
    };

    const getCurrentTabSuggestions = () => {
        const tabId = tabs[activeTab].id;
        return suggestions[tabId] || [];
    };

    const getRiskBadgeClass = (riskLevel) => {
        switch(riskLevel) {
            case 'red': return 'risk-badge-red';
            case 'yellow': return 'risk-badge-yellow';
            case 'green': return 'risk-badge-green';
            default: return 'risk-badge-yellow';
        }
    };

    return (
        <div className="nda-analyzer">
            {/* Header */}
            <div className="header">
                <h1>🛡️ NDA Risk Analyzer</h1>
                <p>Professional Legal Analysis & Smart Redrafting System</p>
                <div className="attorney-info">Sergei Tokmakov, Esq. • CA Bar #279869 • 13+ Years Experience</div>
                {extractedData.parties.length > 0 && (
                    <div className="extracted-info">
                        Analyzing Agreement Between: <strong>{extractedData.parties.join(' and ')}</strong>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="input-section">
                <h2><i data-feather="upload-cloud"></i> Upload or Paste Your NDA</h2>
                
                <div className="upload-options">
                    <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">📄</div>
                        <div className="upload-text">Drop files here or click to browse</div>
                        <div className="upload-subtext">Supports .txt files</div>
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".txt,.pdf,.doc,.docx,text/plain" 
                            onChange={(e) => handleFileUpload(e.target.files[0])} 
                            style={{ display: 'none' }} 
                        />
                    </div>
                    
                    <div className="url-input-section">
                        <div className="url-input-header">Or fetch from URL:</div>
                        <div className="url-input-group">
                            <input 
                                type="url" 
                                className="url-input" 
                                placeholder="https://example.com/nda.html" 
                                value={ndaUrl} 
                                onChange={(e) => setNdaUrl(e.target.value)} 
                            />
                            <button 
                                className="url-submit-btn" 
                                onClick={handleUrlSubmit} 
                                disabled={!ndaUrl.trim() || isAnalyzing}
                            >
                                Fetch
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-input-section">
                    <textarea 
                        className="nda-textarea" 
                        placeholder="Paste your NDA text here for professional analysis..." 
                        value={ndaText} 
                        onChange={(e) => handleTextChange(e.target.value)} 
                    />
                </div>

                <div className="analysis-options">
                    <div className="ai-toggle-group">
                        <label>AI Provider:</label>
                        <div className="ai-toggle-container">
                            <div className="ai-toggle-switch">
                                <input 
                                    type="checkbox" 
                                    id="ai-toggle" 
                                    checked={useClaudeAI} 
                                    onChange={(e) => setUseClaudeAI(e.target.checked)} 
                                />
                                <label htmlFor="ai-toggle" className="toggle-label">
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="ai-provider-labels">
                                <span className={`provider-label ${!useClaudeAI ? 'active' : ''}`}>
                                    🚀 Llama
                                </span>
                                <span className={`provider-label ${useClaudeAI ? 'active' : ''}`}>
                                    🧠 Claude 4.0
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="analyze-button" 
                        onClick={analyzeNDA} 
                        disabled={!ndaText.trim() || isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="loading-spinner"></div>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${analysisProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-text">
                                        {analysisStatus || 'Analyzing NDA...'}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <i data-feather="shield"></i>
                                Analyze NDA
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Analysis Results */}
            {analysisResult && (
                <div className="two-pane-layout">
                    {/* Full-Width Risk Summary */}
                    <div className="analysis-summary-section">
                        <div className={`risk-summary-card ${analysisResult.recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="risk-icon">
                                {analysisResult.recommendation === 'ACCEPTABLE' ? '✅' :
                                 analysisResult.recommendation === 'DO NOT SIGN' ? '❌' : '⚠️'}
                            </div>
                            <div className="risk-content">
                                <div className="risk-recommendation">{analysisResult.recommendation}</div>
                                <div className="risk-summary">{analysisResult.summary}</div>
                            </div>
                        </div>
                    </div>

                    {/* Two-Pane Container */}
                    <div className="panes-container">
                        {/* Left Pane - Suggestions (45%) */}
                        <div className="left-pane">
                            {/* Tab Navigation */}
                            <div className="tab-navigation">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        <span className="tab-icon">{tab.icon}</span>
                                        <span className="tab-label">{tab.label}</span>
                                        <span className="tab-count">({suggestions[tab.id]?.length || 0})</span>
                                    </button>
                                ))}
                            </div>

                            {/* Suggestions List */}
                            <div className="suggestions-container">
                                {getCurrentTabSuggestions().map((suggestion) => (
                                    <div key={suggestion.id} className="suggestion-card">
                                        <div className="suggestion-header">
                                            <input
                                                type="checkbox"
                                                id={suggestion.id}
                                                checked={selectedChanges[suggestion.id] || false}
                                                onChange={(e) => handleSuggestionChange(suggestion.id, e.target.checked)}
                                            />
                                            <div className="suggestion-meta">
                                                <span className={`risk-badge ${getRiskBadgeClass(suggestion.riskLevel)}`}>
                                                    {suggestion.riskLevel === 'red' ? 'Critical' :
                                                     suggestion.riskLevel === 'yellow' ? 'Important' : 'Recommended'}
                                                </span>
                                                <span className={`impact-badge impact-${suggestion.impact}`}>
                                                    {suggestion.impact} impact
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="suggestion-content">
                                            <div className="suggestion-title">{suggestion.title}</div>
                                            <div className="suggestion-description">{suggestion.description}</div>
                                            
                                            <div className="suggestion-comparison">
                                                <div className="original-text">
                                                    <strong>Current:</strong> "{suggestion.originalText}"
                                                </div>
                                                <div className="improved-text">
                                                    <strong>Improved:</strong> "{suggestion.improvedText}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {getCurrentTabSuggestions().length === 0 && (
                                    <div className="no-suggestions">
                                        <div className="no-suggestions-icon">📝</div>
                                        <div className="no-suggestions-text">No suggestions in this category</div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons">
                                <button 
                                    className="action-btn copy-btn" 
                                    onClick={copyToClipboard}
                                    disabled={getTotalSelectedChanges() === 0}
                                >
                                    <i data-feather="copy"></i> Copy Agreement
                                </button>
                                <button 
                                    className="action-btn download-btn" 
                                    onClick={downloadCleanVersion}
                                    disabled={getTotalSelectedChanges() === 0}
                                >
                                    <i data-feather="download"></i> Clean Word
                                </button>
                                <button 
                                    className="action-btn download-btn" 
                                    onClick={downloadAsWord}
                                    disabled={getTotalSelectedChanges() === 0}
                                    style={{backgroundColor: "#dc2626"}}
                                >
                                    <i data-feather="file-text"></i> Redlined Word
                                </button>
                                <button 
                                    className="action-btn consult-btn" 
                                    onClick={scheduleConsultation}
                                >
                                    <i data-feather="calendar"></i> Schedule Consultation
                                </button>
                            </div>

                            <div className="selection-summary">
                                <strong>{getTotalSelectedChanges()}</strong> improvement(s) selected
                            </div>
                        </div>

                        {/* Right Pane - Live Preview (55%) */}
                        <div className="right-pane">
                            <div className="preview-header">
                                <h3><i data-feather="eye"></i> Live Document Preview</h3>
                                <div className="preview-info">
                                    Changes highlight automatically • Scroll to view updates
                                </div>
                            </div>
                            
                            <div className="preview-content" ref={previewRef}>
                                {getTotalSelectedChanges() > 0 ? (
                                    <div 
                                        className="document-preview"
                                        dangerouslySetInnerHTML={{ __html: generateHighlightedPreview() }}
                                    />
                                ) : (
                                    <div className="preview-placeholder">
                                        <div className="placeholder-icon">📄</div>
                                        <div className="placeholder-text">
                                            Select improvements to see live preview with changes
                                        </div>
                                        <div className="original-preview">
                                            <h4>Original Document:</h4>
                                            <pre className="original-text-preview">{ndaText}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Waiting State */}
            {!analysisResult && (
                <div className="waiting-state">
                    <div className="waiting-icon">⚖️</div>
                    <div className="waiting-text">Ready for Professional Analysis</div>
                    <div className="waiting-subtext">
                        Upload your NDA to get detailed analysis from each party's perspective
                    </div>
                    {extractedData.parties.length > 0 && (
                        <div className="extraction-preview">
                            <h4>📋 Detected Information:</h4>
                            <p><strong>Parties:</strong> {extractedData.parties.join(' and ')}</p>
                            {extractedData.businessPurpose && (
                                <p><strong>Purpose:</strong> {extractedData.businessPurpose}</p>
                            )}
                            {extractedData.jurisdiction && (
                                <p><strong>Jurisdiction:</strong> {extractedData.jurisdiction}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <div className="disclaimer">
                <small>
                    <strong>Disclaimer:</strong> This analysis does not constitute legal advice. 
                    For binding legal guidance, consult with a qualified attorney. 
                    Analysis by Sergei Tokmakov, Esq., CA Bar #279869.
                    {analysisResult?.provider && (
                        <span style={{opacity: 0.7}}> • Powered by {analysisResult.provider}</span>
                    )}
                </small>
            </div>
        </div>
    );
};

ReactDOM.render(<NDAAnalyzer />, document.getElementById('root'));