// Stripe Demand Letter Generator - React Component
const { useState, useRef, useEffect } = React;

// Icon component
const Icon = ({ name, style = {} }) => React.createElement('i', {
    'data-feather': name,
    style: style
});

// All 50 US States
const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

// Main Generator Component
const StripeDemandGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const previewRef = useRef(null);
    
    // Form data state
    const [formData, setFormData] = useState({
        // Tab 1: Account & Situation Details
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'CA',
        zipCode: '',
        stripeAccountId: '',
        withheldAmount: '',
        terminationDate: '', // Optional - only if account was terminated
        promisedReleaseDate: '',
        businessType: '',
        processingHistory: '',
        historicalDisputeRate: '',
        
        // Tab 2: Stripe's Stated Reasons (from article analysis)
        highRisk: false,
        elevatedDispute: false,
        policyViolation: false,
        riskAssessment: false,
        chargebackLiability: false,
        accountReview: false,
        businessModelIssue: false,
        indefiniteHold: false,
        shiftingTimelines: false,
        retroactiveRisk: false,
        communicationBlackout: false,
        chargebackLoop: false,
        specificViolationsIdentified: false, // New field
        customReason: false,
        customReasonText: '',
        
        // Tab 4: Supporting Evidence
        lowChargebacks: false,
        compliantPractices: false,
        customerSatisfaction: false,
        fullDisclosure: false,
        shiftingDeadlines: false,
        businessDamages: false,
        customEvidence: false,
        customEvidenceText: '',
        
        // Tab 5: Risk Assessment Recommendations (checkboxes)
        gatherMoreEvidence: false,
        consultAttorney: false,
        documentCommunications: false,
        prepareForArbitration: false,
        considerSettlement: false,
        strengthenCase: false,
        
        // Tab 5: Legal Strategy & Timeline
        responseDeadline: 14,
        includeArbitrationDraft: true,
        expeditedProcedures: false
    });

    // Tab configuration
    const tabs = [
        { id: 'account', label: 'Account Details' },
        { id: 'reasons', label: 'Stripe\'s Reasons' },
        { id: 'violations', label: 'SSA Violations' },
        { id: 'evidence', label: 'Evidence' },
        { id: 'assessment', label: 'Risk Assessment' }
    ];
    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Record what field was changed for highlighting
        setLastChanged(name);
        
        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Calculate auto-selected legal claims based on user's situation
    const getAutoSelectedClaims = () => {
        const claims = [
            {
                name: 'Breach of Contract',
                explanation: 'This is your primary claim when Stripe fails to follow their own contract terms regarding fund processing, release timelines, or promised actions.',
                tooltip: 'Stripe failed to follow SSA provisions regarding fund processing and release timelines. This is your strongest claim when Stripe doesn\'t follow their own contract terms.'
            },
            {
                name: 'Conversion (wrongful retention of funds)',
                explanation: 'This treats your withheld funds as stolen property. It\'s powerful because it can lead to punitive damages in egregious cases.',
                tooltip: 'Wrongful retention of your property (the withheld funds) beyond reasonable business necessity. This treats your funds as stolen property.'
            },
            {
                name: 'Breach of Implied Covenant of Good Faith and Fair Dealing',
                explanation: 'This prevents Stripe from exercising their discretionary powers arbitrarily or in bad faith, even when their contract gives them broad authority.',
                tooltip: 'Even when contracts give discretion, it must be exercised reasonably. This prevents Stripe from using their power arbitrarily.'
            },
            {
                name: 'Violation of California Business & Professions Code § 17200',
                explanation: 'California\'s "Unfair Competition Law" allows you to recover profits Stripe earned from improperly holding your funds, including interest earned.',
                tooltip: 'California\'s Unfair Competition Law prohibits unfair business practices. This allows recovery of profits Stripe earned from wrongfully holding your funds.'
            }
        ];
        
        const violations = [];
        
        // Determine specific SSA violations based on user inputs
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            violations.push('Withholding beyond promised release date violates Section 5.4');
        }
        
        if (formData.highRisk && !formData.historicalDisputeRate) {
            violations.push('Arbitrary "high risk" designation without evidence violates Section 6.2');
        }
        
        if (formData.shiftingDeadlines || formData.shiftingTimelines) {
            violations.push('Continuously extending hold periods without justification');
        }
        
        if (formData.communicationBlackout) {
            violations.push('Failure to provide reasonable communication violates good faith obligations');
        }
        
        return { claims, violations };
    };

    // Calculate dates for legal strategy
    const calculateDates = () => {
        const today = new Date();
        const responseDate = new Date(today);
        responseDate.setDate(responseDate.getDate() + formData.responseDeadline);
        
        const arbitrationDate = new Date(today);
        arbitrationDate.setDate(arbitrationDate.getDate() + 30); // 30-day notice requirement
        
        return {
            letterDate: today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            responseDate: responseDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            arbitrationDate: arbitrationDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    };

    // Generate the demand letter document
    const generateDemandLetter = () => {
        const dates = calculateDates();
        const { claims, violations } = getAutoSelectedClaims();
        
        // Build reasons list from article categories
        const reasons = [];
        if (formData.highRisk) reasons.push('designated as "high risk" without specific evidence');
        if (formData.elevatedDispute) reasons.push('claimed elevated dispute rate without providing actual metrics');
        if (formData.policyViolation) reasons.push('alleged policy violations without identifying specific violations');
        if (formData.riskAssessment) reasons.push('ongoing risk assessment without timeline or completion criteria');
        if (formData.chargebackLiability) reasons.push('ongoing chargeback liability concerns beyond reasonable windows');
        if (formData.accountReview) reasons.push('account review in progress without specific timeline');
        if (formData.businessModelIssue) reasons.push('retroactive business model concerns despite initial approval');
        if (formData.indefiniteHold) reasons.push('indefinite fund holding without clear resolution criteria');
        if (formData.shiftingTimelines) reasons.push('continuously shifting payout timelines without explanation');
        if (formData.retroactiveRisk) reasons.push('retroactive risk designation after processing payments');
        if (formData.communicationBlackout) reasons.push('communication blackout and unresponsive support');
        if (formData.chargebackLoop) reasons.push('creating chargeback loops that worsen dispute metrics');
        if (formData.customReason && formData.customReasonText) reasons.push(formData.customReasonText);
        
        // Build evidence list
        const evidence = [];
        if (formData.lowChargebacks) evidence.push('low historical chargeback rate (below industry standards)');
        if (formData.compliantPractices) evidence.push('documented compliant business practices and clear terms');
        if (formData.customerSatisfaction) evidence.push('customer satisfaction metrics and positive reviews');
        if (formData.fullDisclosure) evidence.push('full business model disclosure during Stripe onboarding');
        if (formData.shiftingDeadlines) evidence.push('documentation of Stripe\'s shifting payout deadlines');
        if (formData.businessDamages) evidence.push('documented business damages from fund withholding');
        if (formData.customEvidence && formData.customEvidenceText) evidence.push(formData.customEvidenceText);

        // Build recommendation actions from checkboxes
        const recommendationActions = [];
        if (formData.gatherMoreEvidence) recommendationActions.push('provide additional documentation of business compliance');
        if (formData.consultAttorney) recommendationActions.push('legal consultation regarding arbitration strategy');
        if (formData.documentCommunications) recommendationActions.push('comprehensive documentation of all Stripe communications');
        if (formData.prepareForArbitration) recommendationActions.push('preparation for AAA arbitration proceedings');
        if (formData.considerSettlement) recommendationActions.push('consideration of settlement discussions during 30-day notice period');
        if (formData.strengthenCase) recommendationActions.push('additional case strengthening measures');

        const daysSinceTermination = formData.terminationDate ? 
            Math.ceil((new Date() - new Date(formData.terminationDate)) / (1000 * 60 * 60 * 24)) : null;

        // Generate letter content
        let letter = `${formData.companyName || '[COMPANY NAME]'}
${formData.address || '[ADDRESS]'}
${formData.city || '[CITY]'}, ${formData.state} ${formData.zipCode || '[ZIP]'}
${formData.phone || '[PHONE]'}
${formData.email || '[EMAIL]'}

${dates.letterDate}

VIA CERTIFIED MAIL & EMAIL
complaints@stripe.com

Legal Department
Stripe, Inc.
354 Oyster Point Boulevard
South San Francisco, CA 94080

Re: ${formData.companyName || '[COMPANY NAME]'} - Demand for Release of Withheld Funds
    Account ID: ${formData.stripeAccountId || '[ACCOUNT ID]'}
    Amount at Issue: $${formData.withheldAmount || '[AMOUNT]'}

To Whom It May Concern:

This letter serves as formal notice pursuant to Section 13.3(a) of the Stripe Services Agreement ("SSA") of my intent to commence arbitration proceedings against Stripe, Inc. and Stripe Payments Company. I intend to file an arbitration demand with the American Arbitration Association on or after ${dates.arbitrationDate} unless this matter is resolved before that date.

I am writing regarding Stripe's continued withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments belonging to ${formData.companyName || '[COMPANY NAME]'}. Despite ${formData.promisedReleaseDate ? `your promise to release funds by ${formData.promisedReleaseDate}` : 'the passage of significant time since the fund hold began'}, your company continues to hold these funds without providing any reasonable timeline for release.

FACTUAL BACKGROUND

${formData.terminationDate ? 
    `On ${formData.terminationDate}, Stripe terminated my merchant account, citing only ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'}${!formData.specificViolationsIdentified ? ' without identifying any specific violations of your Services Agreement' : ''}.` :
    `Stripe initiated a hold on my merchant funds, citing ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'}${!formData.specificViolationsIdentified ? ' without identifying any specific violations of your Services Agreement or providing clear justification for the withholding' : ''}.`
} ${formData.promisedReleaseDate ? `At the time, Stripe promised to release the withheld funds by ${formData.promisedReleaseDate}.` : ''}

${formData.companyName || '[COMPANY NAME]'} operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[PROCESSING HISTORY]'} with Stripe, maintaining ${formData.historicalDisputeRate ? `a dispute rate of ${formData.historicalDisputeRate}%` : 'a clean processing history'} throughout our relationship.

${daysSinceTermination ? 
    `In the ${daysSinceTermination} days since termination, ` : 
    'Since the fund hold began, '
}Stripe has failed to:
- Provide specific justification for the continued withholding beyond general references to "risk"
- Establish any concrete timeline for releasing the held funds
- Identify any specific Service Agreement violations that would justify indefinite withholding
${violations.length > 0 ? violations.map(v => `- ${v}`).join('\n') : ''}

LEGAL CLAIMS

Stripe's actions constitute multiple breaches of the SSA, including but not limited to:

1. BREACH OF CONTRACT: Stripe has materially breached the SSA by withholding funds for an unreasonable period without contractual authority and by failing to process promised payment releases within stated timeframes.

2. CONVERSION: Stripe has wrongfully exercised dominion over $${formData.withheldAmount || '[AMOUNT]'} belonging to ${formData.companyName || '[COMPANY NAME]'}, depriving us of our rightful property beyond any reasonable period necessary for risk management.

3. BREACH OF IMPLIED COVENANT OF GOOD FAITH AND FAIR DEALING: Even where the SSA grants Stripe discretion, it must be exercised in good faith. Stripe's arbitrary withholding of funds without substantial justification violates this fundamental contractual obligation.

4. VIOLATION OF CALIFORNIA BUSINESS & PROFESSIONS CODE § 17200: Stripe's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice under California law, allowing for restitution of profits earned on improperly withheld funds.

SUPPORTING EVIDENCE

${evidence.length > 0 ? `Our position is supported by the following evidence:
${evidence.map(item => `- ${item}`).join('\n')}` : 'We have documented evidence supporting our position, including our clean processing history and Stripe\'s failure to provide specific justification for the continued hold.'}

${recommendationActions.length > 0 ? `
RECOMMENDED ACTIONS

Based on this analysis, we are prepared to take the following additional steps to strengthen our position:
${recommendationActions.map(action => `- ${action}`).join('\n')}` : ''}

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount || '[AMOUNT]'} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${dates.responseDate}, I intend to file an arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}`;

        return letter;
    };
    // Get current document text
    const documentText = generateDemandLetter();

    // Copy to clipboard function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(documentText).then(() => {
            alert('Demand letter copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try selecting and copying manually.');
        });
    };

    // Download as Word document
    const downloadAsWord = () => {
        try {
            console.log("Download MS Word button clicked");
            
            if (!documentText) {
                console.error("Document text is empty");
                alert("Cannot generate document - text is empty. Please check the form data.");
                return;
            }
            
            window.generateWordDoc(documentText, {
                documentTitle: "Stripe Demand Letter",
                fileName: `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Demand-Letter`
            });
        } catch (error) {
            console.error("Error in downloadAsWord:", error);
            alert("Error generating Word document. Please try again or use the copy option.");
        }
    };

    // Navigation functions
    const nextTab = () => {
        if (currentTab < tabs.length - 1) {
            setCurrentTab(currentTab + 1);
        }
    };

    const prevTab = () => {
        if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
        }
    };

    const goToTab = (index) => {
        setCurrentTab(index);
    };

    // Highlighting functionality - More granular highlighting
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        switch (currentTab) {
            case 0: // Account Details
                if (['companyName', 'contactName', 'stripeAccountId', 'withheldAmount'].includes(lastChanged)) {
                    return 'header-info';
                }
                if (['terminationDate', 'promisedReleaseDate'].includes(lastChanged)) {
                    return 'background-dates';
                }
                return null;
            case 1: // Stripe's Reasons
                if (lastChanged && formData[lastChanged]) {
                    return 'stripe-reasons';
                }
                return null;
            case 3: // Evidence
                if (lastChanged && formData[lastChanged]) {
                    return 'evidence-section';
                }
                return null;
            case 4: // Risk Assessment
                if (lastChanged && ['gatherMoreEvidence', 'consultAttorney', 'documentCommunications', 'prepareForArbitration'].includes(lastChanged)) {
                    return 'recommended-actions';
                }
                return null;
            default:
                return null;
        }
    };

    // Create highlighted version of the text - More specific targeting
    const createHighlightedText = () => {
        const sectionToHighlight = getSectionToHighlight();
        if (!sectionToHighlight) return documentText;
        
        let highlightedText = documentText;
        
        // Define more specific regex patterns for granular highlighting
        const sections = {
            'header-info': /Re:.*?Amount at Issue: \$\[AMOUNT\]/s,
            'background-dates': /On \[DATE\].*?(?=\n\n[A-Z])/s,
            'stripe-reasons': /citing (?:only )?[^.]*?(?=without identifying|\.)/,
            'evidence-section': /SUPPORTING EVIDENCE.*?(?=DEMAND FOR RESOLUTION|RECOMMENDED ACTIONS)/s,
            'recommended-actions': /RECOMMENDED ACTIONS.*?(?=DEMAND FOR RESOLUTION)/s
        };
        
        if (sections[sectionToHighlight]) {
            highlightedText = documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }
        
        return highlightedText;
    };

    // Scroll to highlighted text
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlighted-text');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            
            // Clear highlighting after 8 seconds (longer duration)
            setTimeout(() => setLastChanged(null), 8000);
        }
    }, [lastChanged]);

    const highlightedText = createHighlightedText();

    // Risk Assessment (Fixed to 0-100 scale)
    const getRiskAssessment = () => {
        let score = 30; // Base score
        let factors = [];
        
        // Positive factors (add points)
        if (formData.historicalDisputeRate && parseFloat(formData.historicalDisputeRate) < 1.0) {
            score += 20;
            factors.push('✅ Low historical dispute rate strengthens your position significantly');
        }
        
        if (formData.lowChargebacks && formData.compliantPractices) {
            score += 15;
            factors.push('✅ Documented compliance history supports good faith claims');
        }
        
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            score += 25;
            factors.push('✅ Missed promised release date creates strong breach of contract claim');
        }
        
        if (formData.shiftingDeadlines || formData.shiftingTimelines) {
            score += 15;
            factors.push('✅ Pattern of shifting deadlines supports bad faith argument');
        }
        
        if (formData.withheldAmount && parseFloat(formData.withheldAmount.replace(/[^\d.]/g, '')) < 25000) {
            score += 10;
            factors.push('✅ Amount qualifies for AAA expedited procedures (lower cost)');
        }
        
        if (formData.communicationBlackout) {
            score += 10;
            factors.push('✅ Communication blackout supports bad faith claims');
        }
        
        if (formData.processingHistory && formData.processingHistory.includes('year')) {
            score += 10;
            factors.push('✅ Long processing history shows established relationship');
        }
        
        // Negative factors (reduce points but keep minimum 5)
        if (formData.highRisk && !formData.lowChargebacks) {
            score -= 15;
            factors.push('⚠️ High-risk designation without counter-evidence weakens position');
        }
        
        if (!formData.processingHistory || formData.processingHistory.includes('month')) {
            score -= 10;
            factors.push('⚠️ Short processing history may support Stripe\'s risk concerns');
        }
        
        // Check if user has selected any Stripe reasons
        const selectedReasons = [
            formData.highRisk, formData.elevatedDispute, formData.policyViolation,
            formData.riskAssessment, formData.chargebackLiability, formData.accountReview,
            formData.businessModelIssue, formData.indefiniteHold, formData.shiftingTimelines,
            formData.retroactiveRisk, formData.communicationBlackout, formData.chargebackLoop,
            formData.customReason
        ].some(reason => reason);
        
        if (!selectedReasons) {
            score -= 10;
            factors.push('⚠️ No specific Stripe reasons identified weakens response strategy');
        }
        
        if (!formData.terminationDate && !formData.promisedReleaseDate) {
            score -= 8;
            factors.push('⚠️ Lack of specific dates makes timeline arguments more difficult');
        }
        
        // Ensure score stays within 0-100 range
        score = Math.max(5, Math.min(100, score));
        
        // Determine risk level and recommendations
        let riskLevel, riskClass, recommendations;
        
        if (score >= 70) {
            riskLevel = 'Strong Case';
            riskClass = 'risk-strong';
            recommendations = [
                'High probability of successful fund recovery',
                'Send demand letter immediately',
                'Prepare for expedited arbitration if under $25K',
                'Document all future Stripe communications',
                'Consider filing within 30-day window if no response'
            ];
        } else if (score >= 45) {
            riskLevel = 'Moderate Case';
            riskClass = 'risk-moderate';
            recommendations = [
                'Reasonable chance of recovery with proper strategy',
                'Strengthen evidence before sending demand letter',
                'Consider attorney consultation for arbitration strategy',
                'Prepare for standard arbitration timeline (6-12 months)',
                'Focus on Stripe\'s procedural failures in arguments'
            ];
        } else {
            riskLevel = 'Challenging Case';
            riskClass = 'risk-weak';
            recommendations = [
                'Difficult case but still winnable with right approach',
                'Strongly recommend attorney representation',
                'Focus heavily on Stripe\'s bad faith conduct',
                'Prepare comprehensive evidence package',
                'Consider all procedural arguments available'
            ];
        }
        
        return { riskLevel, riskClass, factors, recommendations, score };
    };

    // Calculate AAA filing fees based on actual 2025 fee schedule
    const calculateAAAfees = () => {
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        
        if (amount < 75000) {
            return {
                initial: 950,
                final: 825,
                total: 1775,
                expedited: amount < 25000,
                schedule: 'Standard'
            };
        } else if (amount < 150000) {
            return {
                initial: 1975,
                final: 1425,
                total: 3400,
                expedited: false,
                schedule: 'Standard'
            };
        } else if (amount < 300000) {
            return {
                initial: 2975,
                final: 2275,
                total: 5250,
                expedited: false,
                schedule: 'Standard'
            };
        } else if (amount < 500000) {
            return {
                initial: 4525,
                final: 3975,
                total: 8500,
                expedited: false,
                schedule: 'Standard'
            };
        } else {
            return {
                initial: 5650,
                final: 7025,
                total: 12675,
                expedited: false,
                schedule: 'Standard'
            };
        }
    };

    // Analyze case complexity
    const analyzeCaseComplexity = () => {
        let complexityScore = 0;
        const complexityFactors = [];
        
        // Simple factors (reduce complexity)
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            complexityScore -= 2;
            complexityFactors.push('✅ Clear broken promise simplifies case');
        }
        
        if (formData.lowChargebacks) {
            complexityScore -= 1;
            complexityFactors.push('✅ Clean payment history reduces complexity');
        }
        
        // Complex factors (increase complexity)
        if (formData.chargebackLoop) {
            complexityScore += 3;
            complexityFactors.push('⚠️ Chargeback loops create complex factual disputes');
        }
        
        if (formData.businessModelIssue) {
            complexityScore += 2;
            complexityFactors.push('⚠️ Business model disputes require extensive documentation');
        }
        
        if (!formData.terminationDate && !formData.promisedReleaseDate) {
            complexityScore += 2;
            complexityFactors.push('⚠️ Lack of clear timelines complicates legal arguments');
        }
        
        const selectedReasons = [
            formData.highRisk, formData.elevatedDispute, formData.policyViolation,
            formData.riskAssessment, formData.chargebackLiability, formData.accountReview,
            formData.businessModelIssue, formData.indefiniteHold, formData.shiftingTimelines,
            formData.retroactiveRisk, formData.communicationBlackout, formData.chargebackLoop
        ].filter(Boolean).length;
        
        if (selectedReasons > 4) {
            complexityScore += 1;
            complexityFactors.push('⚠️ Multiple Stripe reasons require comprehensive response');
        }
        
        // Amount-based complexity
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        if (amount > 100000) {
            complexityScore += 1;
            complexityFactors.push('⚠️ High-value disputes often involve more extensive proceedings');
        }
        
        // Determine complexity level
        let isComplex, timeline, procedures;
        
        if (complexityScore <= -1) {
            isComplex = false;
            timeline = amount < 25000 ? '60-90 days (expedited)' : '4-6 months (standard)';
            procedures = 'Likely document-only resolution';
        } else if (complexityScore <= 2) {
            isComplex = false;
            timeline = amount < 25000 ? '90-120 days' : '6-9 months';
            procedures = 'May require hearing but straightforward';
        } else {
            isComplex = true;
            timeline = '9-18 months';
            procedures = 'Likely requires extensive discovery and hearings';
        }
        
        return { isComplex, timeline, procedures, complexityFactors, complexityScore };
    };
    // Render function
    return React.createElement('div', { className: 'app-container' }, [
        React.createElement('div', { key: 'header', className: 'header' }, [
            React.createElement('h1', { key: 'title' }, 'Stripe Demand Letter Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Generate a professional demand letter with 30-day arbitration notice')
        ]),
        
        React.createElement('div', { key: 'main', className: 'main-content' }, [
            // Form Panel
            React.createElement('div', { key: 'form', className: 'form-panel' }, [
                // Tab Navigation
                React.createElement('div', { key: 'tabs', className: 'tab-navigation' },
                    tabs.map((tab, index) => 
                        React.createElement('button', {
                            key: tab.id,
                            className: `tab-button ${currentTab === index ? 'active' : ''}`,
                            onClick: () => goToTab(index)
                        }, `${index + 1}. ${tab.label}`)
                    )
                ),
                
                // Form Content
                React.createElement('div', { key: 'content', className: 'form-content' }, [
                    // Tab 1: Account Details
                    currentTab === 0 && React.createElement('div', { key: 'tab1' }, [
                        React.createElement('h2', { key: 'h2' }, 'Account & Situation Details'),
                        React.createElement('p', { key: 'p' }, 'Provide your business information and Stripe account details.'),
                        
                        React.createElement('div', { key: 'row1', className: 'form-row' }, [
                            React.createElement('div', { key: 'company', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Company Name *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'companyName',
                                    value: formData.companyName,
                                    onChange: handleChange,
                                    placeholder: 'Your Business Name'
                                })
                            ]),
                            React.createElement('div', { key: 'contact', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Contact Person *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'contactName',
                                    value: formData.contactName,
                                    onChange: handleChange,
                                    placeholder: 'Your Name'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row2', className: 'form-row' }, [
                            React.createElement('div', { key: 'email', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Email Address *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'email',
                                    name: 'email',
                                    value: formData.email,
                                    onChange: handleChange,
                                    placeholder: 'your@email.com'
                                })
                            ]),
                            React.createElement('div', { key: 'phone', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Phone Number'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'tel',
                                    name: 'phone',
                                    value: formData.phone,
                                    onChange: handleChange,
                                    placeholder: '(555) 123-4567'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'address', className: 'form-group' }, [
                            React.createElement('label', { key: 'label' }, 'Business Address'),
                            React.createElement('input', {
                                key: 'input',
                                type: 'text',
                                name: 'address',
                                value: formData.address,
                                onChange: handleChange,
                                placeholder: 'Street Address (optional)'
                            })
                        ]),
                        
                        React.createElement('div', { key: 'row3', className: 'form-row' }, [
                            React.createElement('div', { key: 'city', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'City'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'city',
                                    value: formData.city,
                                    onChange: handleChange,
                                    placeholder: 'City'
                                })
                            ]),
                            React.createElement('div', { key: 'state', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'State'),
                                React.createElement('select', {
                                    key: 'select',
                                    name: 'state',
                                    value: formData.state,
                                    onChange: handleChange
                                }, US_STATES.map(state => 
                                    React.createElement('option', { 
                                        key: state.value, 
                                        value: state.value 
                                    }, state.label)
                                ))
                            ]),
                            React.createElement('div', { key: 'zip', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'ZIP Code'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'zipCode',
                                    value: formData.zipCode,
                                    onChange: handleChange,
                                    placeholder: '12345'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row4', className: 'form-row' }, [
                            React.createElement('div', { key: 'account', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Stripe Account ID *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'stripeAccountId',
                                    value: formData.stripeAccountId,
                                    onChange: handleChange,
                                    placeholder: 'acct_1234567890'
                                })
                            ]),
                            React.createElement('div', { key: 'amount', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Amount Withheld *'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'withheldAmount',
                                    value: formData.withheldAmount,
                                    onChange: handleChange,
                                    placeholder: '25,000'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row5', className: 'form-row' }, [
                            React.createElement('div', { key: 'term', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Account Termination Date (only if terminated)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'date',
                                    name: 'terminationDate',
                                    value: formData.terminationDate,
                                    onChange: handleChange
                                })
                            ]),
                            React.createElement('div', { key: 'promised', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Promised Release Date (if any)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'date',
                                    name: 'promisedReleaseDate',
                                    value: formData.promisedReleaseDate,
                                    onChange: handleChange
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'tip', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Important Note'),
                            React.createElement('p', { key: 'text' }, 'Only fill in "Account Termination Date" if Stripe actually terminated your account. Many merchants have funds held without termination.')
                        ])
                    ]),
                    // Tab 2: Stripe's Stated Reasons (Updated with all article reasons)
                    currentTab === 1 && React.createElement('div', { key: 'tab2' }, [
                        React.createElement('h2', { key: 'h2' }, 'Stripe\'s Stated Reasons'),
                        React.createElement('p', { key: 'p' }, 'Select the reasons Stripe has given for withholding your funds. Based on the most common patterns from merchant complaints.'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'highrisk',
                                className: `checkbox-item ${formData.highRisk ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'highRisk', type: 'checkbox', checked: !formData.highRisk }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'highRisk',
                                    checked: formData.highRisk,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, '"High Risk" Business Designation'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Retroactive "high risk" designation after processing payments, often without specific evidence.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'dispute',
                                className: `checkbox-item ${formData.elevatedDispute ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'elevatedDispute', type: 'checkbox', checked: !formData.elevatedDispute }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'elevatedDispute',
                                    checked: formData.elevatedDispute,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Elevated Dispute Rate'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Claimed your chargeback rate was too high without providing actual numbers or industry comparisons.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'indefinite',
                                className: `checkbox-item ${formData.indefiniteHold ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'indefiniteHold', type: 'checkbox', checked: !formData.indefiniteHold }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'indefiniteHold',
                                    checked: formData.indefiniteHold,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Indefinite Fund Hold'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Abrupt termination with indefinite fund holding, continuously extending promised release dates.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'shifting',
                                className: `checkbox-item ${formData.shiftingTimelines ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'shiftingTimelines', type: 'checkbox', checked: !formData.shiftingTimelines }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'shiftingTimelines',
                                    checked: formData.shiftingTimelines,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Shifting Payout Timelines'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Continuously changing release dates with vague explanations - "90 days" becomes "additional 90 days" repeatedly.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'communication',
                                className: `checkbox-item ${formData.communicationBlackout ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'communicationBlackout', type: 'checkbox', checked: !formData.communicationBlackout }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'communicationBlackout',
                                    checked: formData.communicationBlackout,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Communication Blackout'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Support becomes unresponsive after fund hold, canned responses or complete silence to inquiries.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'chargeback',
                                className: `checkbox-item ${formData.chargebackLoop ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'chargebackLoop', type: 'checkbox', checked: !formData.chargebackLoop }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'chargebackLoop',
                                    checked: formData.chargebackLoop,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Chargeback Loop Creation'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Fund holds prevent order fulfillment, causing customer disputes that worsen your metrics - a vicious cycle.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'policy',
                                className: `checkbox-item ${formData.policyViolation ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'policyViolation', type: 'checkbox', checked: !formData.policyViolation }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'policyViolation',
                                    checked: formData.policyViolation,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Unspecified Policy Violations'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Referenced policy violations without identifying specific policies or providing concrete examples.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'custom',
                                className: `checkbox-item ${formData.customReason ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'customReason', type: 'checkbox', checked: !formData.customReason }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'customReason',
                                    checked: formData.customReason,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Other Reason'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Stripe provided a different reason not listed above.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'specific-violations',
                                className: `checkbox-item ${formData.specificViolationsIdentified ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'specificViolationsIdentified', type: 'checkbox', checked: !formData.specificViolationsIdentified }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'specificViolationsIdentified',
                                    checked: formData.specificViolationsIdentified,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Stripe Identified Specific Violations'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Check this if Stripe actually provided specific policy violations or SSA breaches (rather than vague "risk" language).')
                                ])
                            ])
                        ]),
                        
                        formData.customReason && React.createElement('div', { key: 'custom-text', className: 'form-group' }, [
                            React.createElement('label', { key: 'label' }, 'Describe Stripe\'s Reason'),
                            React.createElement('textarea', {
                                key: 'textarea',
                                name: 'customReasonText',
                                value: formData.customReasonText,
                                onChange: handleChange,
                                placeholder: 'Describe the specific reason Stripe gave for withholding your funds...',
                                rows: 3
                            })
                        ])
                    ]),
                    // Tab 3: SSA Violations with Explanations
                    currentTab === 2 && React.createElement('div', { key: 'tab3' }, [
                        React.createElement('h2', { key: 'h2' }, 'SSA Violations (Auto-Selected)'),
                        React.createElement('p', { key: 'p' }, 'These legal claims will be automatically included based on your situation:'),
                        
                        React.createElement('div', { key: 'claims' }, 
                            getAutoSelectedClaims().claims.map((claim, index) => 
                                React.createElement('div', { key: index, className: 'legal-claim' }, [
                                    React.createElement('h4', { key: 'title' }, [
                                        claim.name,
                                        createTooltip(claim.tooltip)
                                    ]),
                                    React.createElement('p', { key: 'desc' }, claim.explanation)
                                ])
                            )
                        ),
                        
                        getAutoSelectedClaims().violations.length > 0 && React.createElement('div', { key: 'violations', className: 'risk-card risk-moderate' }, [
                            React.createElement('h3', { key: 'h3' }, 'Specific SSA Violations Based on Your Situation'),
                            React.createElement('ul', { key: 'ul' }, 
                                getAutoSelectedClaims().violations.map((violation, index) => 
                                    React.createElement('li', { key: index }, violation)
                                )
                            )
                        ])
                    ]),
                    
                    // Tab 4: Evidence with Custom Input
                    currentTab === 3 && React.createElement('div', { key: 'tab4' }, [
                        React.createElement('h2', { key: 'h2' }, 'Supporting Evidence'),
                        React.createElement('p', { key: 'p' }, 'Select evidence you have to support your position:'),
                        
                        React.createElement('div', { key: 'checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'lowcb',
                                className: `checkbox-item ${formData.lowChargebacks ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'lowChargebacks', type: 'checkbox', checked: !formData.lowChargebacks }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'lowChargebacks',
                                    checked: formData.lowChargebacks,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Low Historical Chargeback Rate'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'You can document chargeback rate below industry standards (typically under 0.75%).')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'compliant',
                                className: `checkbox-item ${formData.compliantPractices ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'compliantPractices', type: 'checkbox', checked: !formData.compliantPractices }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'compliantPractices',
                                    checked: formData.compliantPractices,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Documented Compliant Practices'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Clear terms of service, proper product descriptions, compliance documentation.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'satisfaction',
                                className: `checkbox-item ${formData.customerSatisfaction ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'customerSatisfaction', type: 'checkbox', checked: !formData.customerSatisfaction }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'customerSatisfaction',
                                    checked: formData.customerSatisfaction,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Customer Satisfaction Evidence'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Positive reviews, testimonials, low complaint rates demonstrating customer satisfaction.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'disclosure',
                                className: `checkbox-item ${formData.fullDisclosure ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'fullDisclosure', type: 'checkbox', checked: !formData.fullDisclosure }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'fullDisclosure',
                                    checked: formData.fullDisclosure,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Full Business Model Disclosure'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Fully disclosed business model during onboarding, making retroactive concerns unjustified.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'shifting',
                                className: `checkbox-item ${formData.shiftingDeadlines ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'shiftingDeadlines', type: 'checkbox', checked: !formData.shiftingDeadlines }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'shiftingDeadlines',
                                    checked: formData.shiftingDeadlines,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Documentation of Shifting Deadlines'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Emails showing Stripe repeatedly extending promised payout dates without justification.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'damages',
                                className: `checkbox-item ${formData.businessDamages ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'businessDamages', type: 'checkbox', checked: !formData.businessDamages }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'businessDamages',
                                    checked: formData.businessDamages,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Documented Business Damages'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Specific harm from fund withholding: inability to fulfill orders, emergency financing costs, etc.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'custom-evidence',
                                className: `checkbox-item ${formData.customEvidence ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'customEvidence', type: 'checkbox', checked: !formData.customEvidence }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'customEvidence',
                                    checked: formData.customEvidence,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Additional Evidence'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Other evidence not listed above that supports your position.')
                                ])
                            ])
                        ]),
                        
                        formData.customEvidence && React.createElement('div', { key: 'custom-evidence-text', className: 'form-group' }, [
                            React.createElement('label', { key: 'label' }, 'Describe Your Additional Evidence'),
                            React.createElement('textarea', {
                                key: 'textarea',
                                name: 'customEvidenceText',
                                value: formData.customEvidenceText,
                                onChange: handleChange,
                                placeholder: 'Describe additional evidence you have that supports your position...',
                                rows: 3
                            })
                        ])
                    ]),
                    // Tab 5: Risk Assessment with Actionable Recommendations
                    currentTab === 4 && React.createElement('div', { key: 'tab5' }, [
                        React.createElement('h2', { key: 'h2' }, 'Risk Assessment & Strategy'),
                        React.createElement('p', { key: 'p' }, 'Analysis of your case strength and recommended actions:'),
                        
                        (() => {
                            const assessment = getRiskAssessment();
                            const complexity = analyzeCaseComplexity();
                            return React.createElement('div', { key: 'assessment' }, [
                                React.createElement('div', { key: 'score-card', className: `risk-card ${assessment.riskClass}` }, [
                                    React.createElement('h3', { key: 'h3' }, `${assessment.riskLevel} (Score: ${assessment.score}/100)`),
                                    React.createElement('ul', { key: 'factors' }, 
                                        assessment.factors.map((factor, index) => 
                                            React.createElement('li', { key: index }, factor)
                                        )
                                    )
                                ]),
                                
                                React.createElement('div', { key: 'complexity-card', className: `risk-card ${complexity.isComplex ? 'risk-moderate' : 'risk-strong'}` }, [
                                    React.createElement('h3', { key: 'h3' }, `Case Complexity: ${complexity.isComplex ? 'Complex' : 'Straightforward'}`),
                                    React.createElement('ul', { key: 'complexity-factors' }, 
                                        complexity.complexityFactors.map((factor, index) => 
                                            React.createElement('li', { key: index }, factor)
                                        )
                                    )
                                ]),
                                
                                React.createElement('div', { key: 'recommendations', className: 'risk-card risk-strong' }, [
                                    React.createElement('h3', { key: 'h3' }, 'Recommended Strategy'),
                                    React.createElement('ul', { key: 'recs' }, 
                                        assessment.recommendations.map((rec, index) => 
                                            React.createElement('li', { key: index }, rec)
                                        )
                                    )
                                ]),
                                
                                React.createElement('div', { key: 'actions', className: 'form-group' }, [
                                    React.createElement('h3', { key: 'h3' }, 'Check Actions to Include in Demand Letter:'),
                                    React.createElement('div', { key: 'action-checkboxes', className: 'checkbox-grid' }, [
                                        React.createElement('div', { 
                                            key: 'gather',
                                            className: `checkbox-item ${formData.gatherMoreEvidence ? 'selected' : ''}`,
                                            onClick: () => handleChange({ target: { name: 'gatherMoreEvidence', type: 'checkbox', checked: !formData.gatherMoreEvidence }})
                                        }, [
                                            React.createElement('input', {
                                                key: 'input',
                                                type: 'checkbox',
                                                name: 'gatherMoreEvidence',
                                                checked: formData.gatherMoreEvidence,
                                                onChange: handleChange
                                            }),
                                            React.createElement('div', { key: 'content' }, [
                                                React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Gather Additional Evidence'),
                                                React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Commit to providing additional documentation of business compliance.')
                                            ])
                                        ]),
                                        
                                        React.createElement('div', { 
                                            key: 'consult',
                                            className: `checkbox-item ${formData.consultAttorney ? 'selected' : ''}`,
                                            onClick: () => handleChange({ target: { name: 'consultAttorney', type: 'checkbox', checked: !formData.consultAttorney }})
                                        }, [
                                            React.createElement('input', {
                                                key: 'input',
                                                type: 'checkbox',
                                                name: 'consultAttorney',
                                                checked: formData.consultAttorney,
                                                onChange: handleChange
                                            }),
                                            React.createElement('div', { key: 'content' }, [
                                                React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Legal Consultation'),
                                                React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Mention legal consultation regarding arbitration strategy.')
                                            ])
                                        ]),
                                        
                                        React.createElement('div', { 
                                            key: 'document',
                                            className: `checkbox-item ${formData.documentCommunications ? 'selected' : ''}`,
                                            onClick: () => handleChange({ target: { name: 'documentCommunications', type: 'checkbox', checked: !formData.documentCommunications }})
                                        }, [
                                            React.createElement('input', {
                                                key: 'input',
                                                type: 'checkbox',
                                                name: 'documentCommunications',
                                                checked: formData.documentCommunications,
                                                onChange: handleChange
                                            }),
                                            React.createElement('div', { key: 'content' }, [
                                                React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Document Communications'),
                                                React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Comprehensive documentation of all Stripe communications.')
                                            ])
                                        ]),
                                        
                                        React.createElement('div', { 
                                            key: 'prepare',
                                            className: `checkbox-item ${formData.prepareForArbitration ? 'selected' : ''}`,
                                            onClick: () => handleChange({ target: { name: 'prepareForArbitration', type: 'checkbox', checked: !formData.prepareForArbitration }})
                                        }, [
                                            React.createElement('input', {
                                                key: 'input',
                                                type: 'checkbox',
                                                name: 'prepareForArbitration',
                                                checked: formData.prepareForArbitration,
                                                onChange: handleChange
                                            }),
                                            React.createElement('div', { key: 'content' }, [
                                                React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Prepare for Arbitration'),
                                                React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Active preparation for AAA arbitration proceedings.')
                                            ])
                                        ])
                                    ])
                                ])
                            ]);
                        })(),
                        
                        React.createElement('div', { key: 'timeline', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Timeline & Costs (2025 AAA Fee Schedule)'),
                            React.createElement('p', { key: 'notice' }, React.createElement('strong', { key: 'notice-label' }, '30-Day Notice Period: '), 'Required before filing arbitration (automatically calculated in your letter)'),
                            (() => {
                                const fees = calculateAAAfees();
                                const complexity = analyzeCaseComplexity();
                                return [
                                    React.createElement('p', { key: 'fees' }, [
                                        React.createElement('strong', { key: 'fees-label' }, 'AAA Filing Fees: '),
                                        `$${fees.initial.toLocaleString()} initial + $${fees.final.toLocaleString()} final = $${fees.total.toLocaleString()} total`,
                                        fees.expedited ? ' (Expedited procedures available)' : ''
                                    ]),
                                    React.createElement('p', { key: 'timeline' }, [
                                        React.createElement('strong', { key: 'timeline-label' }, 'Expected Timeline: '), 
                                        complexity.timeline
                                    ]),
                                    React.createElement('p', { key: 'procedures' }, [
                                        React.createElement('strong', { key: 'procedures-label' }, 'Likely Process: '), 
                                        complexity.procedures
                                    ]),
                                    fees.expedited && React.createElement('p', { key: 'expedited-tip' }, [
                                        React.createElement('strong', { key: 'expedited-label' }, 'Expedited Tip: '), 
                                        'Claims under $25K qualify for streamlined, document-only procedures that are faster and cheaper.'
                                    ])
                                ];
                            })()
                        ])
                    ])
                ]),
                
                // Navigation Buttons
                React.createElement('div', { key: 'nav', className: 'navigation-buttons' }, [
                    React.createElement('button', {
                        key: 'prev',
                        onClick: prevTab,
                        className: `nav-button ${currentTab === 0 ? 'disabled' : ''}`,
                        disabled: currentTab === 0
                    }, 'Previous'),
                    
                    React.createElement('div', { key: 'middle', style: { display: 'flex', gap: '10px' } }, [
                        React.createElement('button', {
                            key: 'copy',
                            onClick: copyToClipboard,
                            className: 'nav-button',
                            style: { backgroundColor: "#4f46e5", color: "white", border: "none" }
                        }, 'Copy to Clipboard'),
                        
                        React.createElement('button', {
                            key: 'download',
                            onClick: downloadAsWord,
                            className: 'nav-button',
                            style: { backgroundColor: "#2563eb", color: "white", border: "none" }
                        }, 'Download MS Word'),
                        
                        React.createElement('a', {
                            key: 'consult',
                            href: 'https://terms.law/call/',
                            target: '_blank',
                            className: 'nav-button consultation-button',
                            style: { backgroundColor: "#28a745", color: "white", border: "none", textDecoration: 'none' }
                        }, 'Schedule Consultation')
                    ]),
                    
                    React.createElement('button', {
                        key: 'next',
                        onClick: nextTab,
                        className: `nav-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`,
                        disabled: currentTab === tabs.length - 1
                    }, 'Next')
                ])
            ]),
            
            // Preview Panel
            React.createElement('div', { key: 'preview', className: 'preview-panel' }, [
                React.createElement('div', { key: 'content', className: 'preview-content' }, [
                    React.createElement('div', { key: 'header', className: 'preview-header' }, [
                        React.createElement('h2', { key: 'title' }, 'Live Preview'),
                        React.createElement('p', { key: 'subtitle', className: 'preview-text' }, 'Your demand letter with 30-day arbitration notice')
                    ]),
                    React.createElement('div', { 
                        key: 'document',
                        ref: previewRef,
                        className: 'document-preview',
                        dangerouslySetInnerHTML: { 
                            __html: highlightedText.replace(/\n/g, '<br>') 
                        }
                    })
                ])
            ])
        ])
    ]);
};

// Render the component
console.log('Starting to render StripeDemandGenerator...');
console.log('React available:', typeof React);
console.log('ReactDOM available:', typeof ReactDOM);

try {
    ReactDOM.render(React.createElement(StripeDemandGenerator), document.getElementById('root'));
    console.log('Component rendered successfully');
} catch (error) {
    console.error('Error rendering component:', error);
    document.getElementById('root').innerHTML = '<h1>Error Loading Generator</h1><p>Please check the console for details.</p>';
}
    // Helper function to create tooltip
    const createTooltip = (text) => {
        return React.createElement('span', { 
            key: 'tooltip',
            className: 'hint-tooltip' 
        }, [
            React.createElement('span', { 
                key: 'icon',
                className: 'tooltip-icon' 
            }, '?'),
            React.createElement('span', { 
                key: 'text',
                className: 'tooltip-text' 
            }, text)
        ]);
    };