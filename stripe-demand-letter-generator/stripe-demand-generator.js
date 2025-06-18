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
        
        // NEW Account Establishment Fields
        accountStartDate: '', // Optional - when account was first opened
        yearsWithStripe: '', // Calculated or manual input
        totalVolumeProcessed: '', // Optional - lifetime processing volume
        previousAccountIssues: false, // Checkbox - any prior account issues
        industryCompliance: false, // Checkbox - industry-specific compliance (PCI, etc.)
        repeatCustomerBase: false, // Checkbox - established repeat customers
        businessLicenses: false, // Checkbox - proper business licensing
        professionalReferences: false, // Checkbox - bank/business references available
        refundRate: '', // NEW - refund rate percentage
        
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
        customReason: false, // Moved after all main reasons
        customReasonText: '',
        specificViolationsIdentified: false, // Now at bottom
        
        // Tab 4: Supporting Evidence
        lowChargebacks: false,
        compliantPractices: false,
        customerSatisfaction: false,
        fullDisclosure: false,
        shiftingDeadlines: false,
        businessDamages: false,
        customEvidence: false,
        customEvidenceText: '',
        
        // Tab 5: Legal Strategy & Timeline
        responseDeadline: 14,
        
        // NEW Tab 5: Arbitration Demand Options
        includeArbitrationDraft: false, // Moved from previous tab 
        expeditedProcedures: true, // Default to true for most cases
        includeAttorneyFees: true, // Default to true since California allows it
        includeInterestOnFunds: true, // Default to true - always claim this
        specificDamagesAmount: '', // Additional damages beyond withheld amount
        additionalClaims: '' // Custom additional claims
    });

    // Tab configuration
    const tabs = [
        { id: 'account', label: 'Account Details' },
        { id: 'reasons', label: 'Stripe\'s Reasons' },
        { id: 'violations', label: 'SSA Violations' },
        { id: 'evidence', label: 'Evidence' },
        { id: 'arbitration', label: 'Arbitration Demand' },
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

    // Get Account Establishment Benefits
    const getAccountEstablishmentBenefits = () => {
        const benefits = [];
        
        // Account age benefits
        if (formData.accountStartDate) {
            const accountAge = (new Date() - new Date(formData.accountStartDate)) / (1000 * 60 * 60 * 24 * 365);
            if (accountAge > 2) {
                benefits.push(`${formData.companyName || '[COMPANY NAME]'} has maintained this Stripe account for over ${Math.floor(accountAge)} years with ${formData.previousAccountIssues ? 'minimal' : 'no'} prior violations`);
            }
        }
        
        // Volume benefits
        if (formData.totalVolumeProcessed) {
            benefits.push(`Having processed over $${formData.totalVolumeProcessed} through Stripe demonstrates established business relationship`);
        }
        
        // Clean history
        if (!formData.previousAccountIssues) {
            benefits.push('This account has no history of policy violations or compliance issues');
        }
        
        // Industry compliance
        if (formData.industryCompliance) {
            benefits.push('Regulated business compliance reduces perceived risk');
        }
        
        // Business establishment
        if (formData.businessLicenses && formData.professionalReferences) {
            benefits.push('Proper business licensing and professional references demonstrate legitimacy');
        }
        
        return benefits;
    };

    // Evidence Hierarchy System
    const getEvidenceStrategy = () => {
        const recommendations = [];
        
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            recommendations.push({
                priority: 1,
                evidence: "Email/communication showing Stripe's specific promise to release funds by " + formData.promisedReleaseDate,
                impact: "Creates ironclad breach of contract claim",
                action: "Screenshot with full headers, save original email with metadata"
            });
        }
        
        if (formData.lowChargebacks && formData.historicalDisputeRate) {
            recommendations.push({
                priority: 2, 
                evidence: `Stripe dashboard screenshot showing dispute rate of ${formData.historicalDisputeRate}% (below 0.75% threshold)`,
                impact: "Destroys Stripe's 'high risk' justification",
                action: "Monthly statements for past 12 months, comparison to industry averages"
            });
        }
        
        if (formData.shiftingDeadlines || formData.shiftingTimelines) {
            recommendations.push({
                priority: 3,
                evidence: "Email chain showing pattern of extending promised release dates",
                impact: "Demonstrates bad faith and establishes promissory estoppel claim",
                action: "Compile chronological timeline with all date changes documented"
            });
        }
        
        if (formData.communicationBlackout) {
            recommendations.push({
                priority: 4,
                evidence: "Documentation of unresponsive support after fund hold began",
                impact: "Supports breach of implied covenant of good faith",
                action: "Screenshot support tickets, email timestamps, response delays"
            });
        }
        
        if (formData.businessDamages) {
            recommendations.push({
                priority: 5,
                evidence: "Specific monetary damages from inability to fulfill orders",
                impact: "Quantifies actual harm for damages calculation",
                action: "Invoice lost sales, emergency financing costs, vendor payment delays"
            });
        }
        
        return recommendations.sort((a, b) => a.priority - b.priority);
    };

    // Professional Legal Strategy Generator
    const getDynamicLegalStrategy = () => {
        const strategies = [];
        
        // Promissory estoppel strategy
        if (formData.shiftingTimelines && formData.promisedReleaseDate) {
            strategies.push("Focus on promissory estoppel claim - Stripe's broken promises create additional liability beyond contract breach");
        }
        
        // Due process strategy
        if (formData.communicationBlackout && formData.accountReview) {
            strategies.push("Emphasize due process violations - Stripe's communication blackout during 'review' violates implied covenant");
        }
        
        // Causation paradox strategy
        if (formData.chargebackLoop && formData.lowChargebacks) {
            strategies.push("Highlight the causation paradox - Stripe created the problem they claim justifies withholding");
        }
        
        // Bad faith conduct strategy
        if (formData.retroactiveRisk && formData.fullDisclosure) {
            strategies.push("Retroactive risk designation after full disclosure constitutes bad faith conduct");
        }
        
        // Established relationship strategy
        if (formData.accountStartDate && formData.totalVolumeProcessed) {
            strategies.push("Leverage established relationship - long processing history creates reasonable expectations");
        }
        
        return strategies;
    };

    // Generate the arbitration demand document (CORRECTED per Stripe's actual SSA terms)
    const generateArbitrationDemand = () => {
        try {
            const dates = calculateDates();
            const { claims, violations } = getAutoSelectedClaims();
            const establishmentBenefits = getAccountEstablishmentBenefits();
            
            // Calculate total damages
            const withheldAmount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
            const additionalDamages = formData.specificDamagesAmount ? 
                parseFloat(formData.specificDamagesAmount.replace(/[^\d.]/g, '')) : 0;
            const totalAmount = withheldAmount + additionalDamages;
            
            // Build factual background
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
            
            let demand = `AMERICAN ARBITRATION ASSOCIATION
SAN FRANCISCO, CALIFORNIA

DEMAND FOR ARBITRATION

${formData.companyName || '[COMPANY NAME]'}                                          AAA Case No. ___________
               Claimant

v.

Stripe, Inc.
               Respondent
_______________________________

TO THE HONORABLE ARBITRATOR:

JURISDICTION AND VENUE

1. This matter is subject to arbitration pursuant to Section 13 of the Stripe Services Agreement, which provides that disputes "must be resolved by individual binding arbitration" and shall be "conducted by the American Arbitration Association under its [Commercial Arbitration] rules and procedures." The SSA further provides that all disputes "will be determined by binding arbitration in San Francisco, California before a single arbitrator."

2. This dispute arises from Respondent's systematic breach of the Stripe Services Agreement ("SSA") and wrongful withholding of $${formData.withheldAmount || '[AMOUNT]'} in customer payments belonging to Claimant. ${additionalDamages > 0 ? `Additional business damages of $${additionalDamages.toLocaleString()} have resulted from Respondent's actions.` : ''} 

3. This case involves a pattern of conduct where Stripe terminates merchant accounts and indefinitely withholds funds using vague "risk" justifications that lack specificity and contractual basis.

FACTUAL BACKGROUND

4. ${establishmentBenefits.length > 0 ? 
    establishmentBenefits.join('. ') + '. ' : ''
}${formData.terminationDate ? 
    `On ${formData.terminationDate}, Respondent abruptly terminated Claimant's merchant account, citing only ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'}${!formData.specificViolationsIdentified ? ' without identifying any specific violations of the Services Agreement' : ''}.` :
    `Respondent initiated an indefinite hold on Claimant's merchant funds, citing ${reasons.length > 0 ? reasons.join(', ') : 'vague "risk" concerns'}${!formData.specificViolationsIdentified ? ' without identifying any specific violations of the Services Agreement or providing clear justification for the withholding' : ''}.`
} ${formData.promisedReleaseDate ? `At the time, Respondent promised to release the withheld funds by ${formData.promisedReleaseDate}, a promise it has since broken.` : ''}

5. Prior to this action, Claimant operated as a ${formData.businessType || '[BUSINESS TYPE]'} business for ${formData.processingHistory || '[PROCESSING HISTORY]'} with Stripe, maintaining ${formData.historicalDisputeRate ? `a dispute rate of ${formData.historicalDisputeRate}%` : 'a clean processing history'} throughout the relationship.${formData.historicalDisputeRate && parseFloat(formData.historicalDisputeRate) < 1 ? ` This dispute rate is well below the industry standard of 0.75%, yet Respondent continues to characterize Claimant as "high risk."` : ''}

${formData.shiftingTimelines || formData.shiftingDeadlines ? 
    '6. Since the initial fund hold, Respondent has engaged in a pattern of extending promised release dates without justification, creating what can only be characterized as an indefinite withholding scheme.' : ''}

${formData.communicationBlackout ? 
    '7. Following the fund hold, Respondent\'s support became unresponsive, providing only canned responses or complete silence to legitimate inquiries about fund release timelines and justifications.' : ''}

${formData.chargebackLoop ? 
    '8. Perversely, Respondent\'s withholding of funds has prevented Claimant from fulfilling customer orders, directly causing the very customer disputes that Respondent now cites as justification for continued withholding.' : ''}

CAUSES OF ACTION

FIRST CAUSE OF ACTION
(Breach of Contract)

9. Claimant and Respondent entered into the Stripe Services Agreement, whereby Respondent agreed to process payment transactions and release funds according to specified terms and timelines. The SSA does not grant Respondent unlimited discretion to withhold merchant funds indefinitely based on subjective "risk" assessments.

10. Respondent has materially breached the SSA by:
a) Withholding funds for an unreasonable period without contractual authority;
b) Failing to provide specific justification for fund withholding as required by good faith performance;
c) ${formData.promisedReleaseDate ? `Breaking its specific promise to release funds by ${formData.promisedReleaseDate};` : 'Continuously extending promised release dates without reasonable justification;'}
d) Applying retroactive "risk" designations to previously approved business models;
e) ${formData.communicationBlackout ? 'Failing to maintain reasonable communication regarding fund status and release timelines.' : 'Exercising discretionary powers in bad faith and without reasonable basis.'}

SECOND CAUSE OF ACTION
(Conversion)

11. The withheld funds of $${formData.withheldAmount || '[AMOUNT]'} were the property of Claimant, representing customer payments for goods and services already provided. Respondent has wrongfully exercised dominion over these funds beyond any reasonable period necessary for legitimate risk management.

12. Conversion is established by Respondent's intentional exercise of dominion or control over Claimant's property in a manner inconsistent with Claimant's rights. ${formData.promisedReleaseDate ? `Respondent's broken promise to release funds by ${formData.promisedReleaseDate} demonstrates intentional interference with Claimant's property rights.` : 'Respondent\'s indefinite withholding without clear resolution criteria constitutes intentional deprivation of Claimant\'s property.'}

THIRD CAUSE OF ACTION
(Breach of Implied Covenant of Good Faith and Fair Dealing)

13. Every contract contains an implied covenant that neither party will act to frustrate the other party's right to receive the benefits of the agreement. Respondent has violated this covenant by:

a) Exercising its discretionary powers under the SSA arbitrarily and capriciously;
b) Applying subjective "risk" criteria without providing objective standards or evidence;
c) Creating shifting and unreasonable timelines for fund release;
d) ${formData.retroactiveRisk ? 'Retroactively applying risk designations to previously approved business operations;' : 'Withholding funds based on vague and unsubstantiated concerns;'}
e) ${formData.communicationBlackout ? 'Implementing a communication blackout that prevents reasonable dispute resolution.' : 'Failing to act reasonably in the exercise of contractual discretion.'}

FOURTH CAUSE OF ACTION
(Violation of California Business & Professions Code § 17200)

14. California's Unfair Competition Law prohibits unfair, unlawful, or fraudulent business practices. Respondent's systematic withholding of merchant funds without clear contractual authority constitutes an unfair business practice that:

a) Violates public policy favoring prompt payment of earned compensation;
b) Creates an imbalance in contractual relationships through arbitrary exercise of power;
c) Damages competition by forcing merchants to seek alternative payment processors;
d) ${formData.includeInterestOnFunds ? 'Unjustly enriches Respondent through interest earned on improperly withheld funds;' : 'Provides Respondent with an unfair advantage over competitors;'}
e) Lacks reasonable business justification proportionate to claimed risks.

${formData.additionalClaims ? `
ADDITIONAL CAUSES OF ACTION

15. ${formData.additionalClaims}` : ''}

RELIEF SOUGHT

WHEREFORE, Claimant respectfully requests that this Tribunal:

A. Award damages for breach of contract in an amount to be proven at hearing, but not less than $${formData.withheldAmount || '[AMOUNT]'};
B. Award damages for conversion in an amount to be proven at hearing;
C. Order immediate release of all withheld funds;
D. ${formData.includeInterestOnFunds ? 'Award restitution of any interest or profits earned on withheld funds;' : 'Award consequential damages for business harm;'}
E. ${formData.includeAttorneyFees ? 'Award reasonable attorney fees and costs of this arbitration pursuant to SSA Section 13.3(d);' : 'Award costs and expenses of this arbitration;'}
${additionalDamages > 0 ? `F. Award additional damages of $${additionalDamages.toLocaleString()} for business losses and consequential harm;` : 'F. Award such other relief as the Tribunal deems just and proper.'}
${additionalDamages > 0 ? 'G. Award such other relief as the Tribunal deems just and proper.' : ''}

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}
Claimant

Dated: _________________`;

            return demand;
            
        } catch (error) {
            console.error('Error generating arbitration demand:', error);
            return 'Error generating arbitration demand. Please check your inputs.';
        }
    };

    // Generate the demand letter document
    const generateDemandLetter = () => {
        const dates = calculateDates();
        const { claims, violations } = getAutoSelectedClaims();
        const establishmentBenefits = getAccountEstablishmentBenefits();
        
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

${establishmentBenefits.length > 0 ? 
    establishmentBenefits.join('. ') + '. ' : ''
}${formData.terminationDate ? 
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

DEMAND FOR RESOLUTION

To resolve this matter without proceeding to arbitration, I demand the following:

1. Immediate release of the $${formData.withheldAmount || '[AMOUNT]'} in withheld funds
2. Accounting of any interest earned on these funds while held by Stripe
3. Written confirmation of the release timeline

If I do not receive a satisfactory response by ${dates.responseDate}, I intend to file an arbitration demand upon the expiration of the 30-day notice period required by Section 13.3(a) of the SSA.

${formData.includeArbitrationDraft ? 'Attached hereto as Exhibit A is a draft arbitration demand that will be filed with the American Arbitration Association if this matter is not resolved within the specified timeframe. This attachment demonstrates the seriousness of this matter and my preparedness to pursue all available legal remedies.' : ''}

I look forward to your prompt attention to this matter.

Sincerely,

${formData.contactName || '[CONTACT NAME]'}
${formData.companyName || '[COMPANY NAME]'}`;

        return letter;
    };
    
    // Get current document text - show combined document when arbitration is enabled
    const documentText = (() => {
        if (formData.includeArbitrationDraft) {
            // Show combined document like what will be downloaded
            const demandLetter = generateDemandLetter();
            const arbitrationDemand = generateArbitrationDemand();
            // For live preview, use visible separator since form feed won't display
            return demandLetter + '\n\n' + '='.repeat(80) + '\nARBITRATION DEMAND (ATTACHMENT)\n' + '='.repeat(80) + '\n\n' + arbitrationDemand;
        } else {
            return generateDemandLetter();
        }
    })();

    // Copy to clipboard function
    const copyToClipboard = () => {
        let finalDocumentText;
        
        if (formData.includeArbitrationDraft) {
            // Create combined document: demand letter + separator + arbitration demand
            const demandLetter = generateDemandLetter();
            const arbitrationDemand = generateArbitrationDemand();
            
            // Combine with clear separation for clipboard
            finalDocumentText = demandLetter + '\n\n' + '='.repeat(80) + '\nARBITRATION DEMAND (ATTACHMENT)\n' + '='.repeat(80) + '\n\n' + arbitrationDemand;
        } else {
            finalDocumentText = generateDemandLetter();
        }
        
        navigator.clipboard.writeText(finalDocumentText).then(() => {
            const docType = formData.includeArbitrationDraft ? 'Combined demand letter and arbitration demand' : 'Demand letter';
            alert(`${docType} copied to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try selecting and copying manually.');
        });
    };

    // Download as Word document
    const downloadAsWord = () => {
        try {
            console.log("Download MS Word button clicked");
            
            let finalDocumentText;
            let documentTitle;
            let fileName;
            
            if (formData.includeArbitrationDraft) {
                // Create combined document: demand letter + page break + arbitration demand
                const demandLetter = generateDemandLetter();
                const arbitrationDemand = generateArbitrationDemand();
                
                // Add proper page break formatting for MS Word
                finalDocumentText = demandLetter + '\f\n\n' + arbitrationDemand;
                documentTitle = "Stripe Demand Letter with Arbitration Demand";
                fileName = `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Combined-Demand-Letter-and-Arbitration`;
            } else {
                // Single demand letter only
                finalDocumentText = generateDemandLetter();
                documentTitle = "Stripe Demand Letter";
                fileName = `${formData.companyName ? formData.companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'Stripe'}-Demand-Letter`;
            }
            
            if (!finalDocumentText) {
                console.error("Document text is empty");
                alert("Cannot generate document - text is empty. Please check the form data.");
                return;
            }
            
            window.generateWordDoc(finalDocumentText, {
                documentTitle: documentTitle,
                fileName: fileName
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

    // FIXED: Highlighting functionality for ALL Tab 1 inputs
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        switch (currentTab) {
            case 0: // Account Details - ALL INPUTS NOW TRIGGER HIGHLIGHTING
                if (['companyName', 'contactName', 'stripeAccountId', 'withheldAmount'].includes(lastChanged)) {
                    return 'header-info';
                }
                if (['email', 'phone', 'address', 'city', 'state', 'zipCode'].includes(lastChanged)) {
                    return 'contact-info';
                }
                if (['terminationDate', 'promisedReleaseDate', 'businessType', 'processingHistory', 'historicalDisputeRate'].includes(lastChanged)) {
                    return 'background-section';
                }
                if (['accountStartDate', 'yearsWithStripe', 'totalVolumeProcessed', 'previousAccountIssues', 'industryCompliance', 'repeatCustomerBase', 'businessLicenses', 'professionalReferences', 'refundRate'].includes(lastChanged)) {
                    return 'establishment-section';
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
            case 4: // Arbitration Demand tab (NEW)
                if (lastChanged === 'includeArbitrationDraft') {
                    return formData.includeArbitrationDraft ? 'arbitration-section' : 'demand-letter-section';
                }
                if (['expeditedProcedures', 'claimPunitiveDamages', 'injunctiveRelief'].includes(lastChanged)) {
                    return 'arbitration-options';
                }
                if (['arbitrationVenue', 'hearingPreference', 'specificDamagesAmount', 'additionalClaims', 'includeAttorneyFees', 'includeInterestOnFunds'].includes(lastChanged)) {
                    return 'arbitration-config';
                }
                return null;
            case 5: // Risk Assessment tab (moved from 4 to 5)
                return null; // No highlighting needed for this tab
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
            'header-info': /Re:.*?Amount at Issue: \$[^\n]*/s,
            'contact-info': /^[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+\n[^\n]+/,
            'background-section': /FACTUAL BACKGROUND.*?(?=LEGAL CLAIMS)/s,
            'establishment-section': /FACTUAL BACKGROUND.*?(?=On |Stripe initiated)/s,
            'stripe-reasons': /citing (?:only )?[^.]*?(?=without identifying|\.)/,
            'evidence-section': /SUPPORTING EVIDENCE.*?(?=DEMAND FOR RESOLUTION)/s,
            'demand-letter-section': /^[^\n]+\n[^\n]+\n[^\n]+.*?(?=ARBITRATION DEMAND \(ATTACHMENT\)|$)/s,
            'arbitration-section': /ARBITRATION DEMAND \(ATTACHMENT\).*?(?=$)/s,
            'arbitration-options': /EXPEDITED PROCEDURES REQUESTED:.*?(?=PARTIES|ARBITRATION VENUE)/s,
            'arbitration-config': /RELIEF SOUGHT.*?(?=AMOUNT IN CONTROVERSY|ADMINISTRATIVE INFORMATION|$)/s
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
            
            // Clear highlighting after 8 seconds
            setTimeout(() => setLastChanged(null), 8000);
        }
    }, [lastChanged]);

    const highlightedText = createHighlightedText();

    // UPGRADED: Attorney-Level Risk Assessment
    const getRiskAssessment = () => {
        let score = 30; // Base score
        let factors = [];
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        
        // Strong evidence factors
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            score += 25;
            factors.push('✅ STRONGEST EVIDENCE: Broken promise creates ironclad breach of contract claim. Focus your demand on promissory estoppel liability.');
        }
        
        if (formData.historicalDisputeRate && parseFloat(formData.historicalDisputeRate) < 1.0) {
            score += 20;
            factors.push(`✅ STRONG DEFENSE: Your ${formData.historicalDisputeRate}% dispute rate destroys Stripe's "high risk" justification. Demand Stripe provide industry comparisons.`);
        }
        
        if (formData.lowChargebacks && formData.compliantPractices) {
            score += 15;
            factors.push('✅ COMPLIANCE DOCUMENTATION: Clean processing history supports good faith claims. Obtain 12-month chargeback statements for evidence package.');
        }
        
        if (formData.shiftingDeadlines || formData.shiftingTimelines) {
            score += 15;
            factors.push('✅ BAD FAITH PATTERN: Shifting deadlines support promissory estoppel and bad faith claims. Compile chronological timeline of all date changes.');
        }
        
        if (formData.communicationBlackout) {
            score += 10;
            factors.push('✅ DUE PROCESS VIOLATION: Communication blackout violates implied covenant. Document all unresponsive support interactions.');
        }
        
        // Account establishment benefits
        if (formData.accountStartDate) {
            const accountAge = (new Date() - new Date(formData.accountStartDate)) / (1000 * 60 * 60 * 24 * 365);
            if (accountAge > 2) {
                score += 12;
                factors.push(`✅ ESTABLISHED RELATIONSHIP: ${Math.floor(accountAge)}-year account history creates reasonable expectations. Emphasize relationship longevity in demand.`);
            } else if (accountAge < 0.5) {
                score -= 8;
                factors.push(`⚠️ NEW ACCOUNT: ${Math.floor(accountAge * 12)}-month processing history may support Stripe's risk concerns. Focus on compliance documentation instead.`);
            }
        }
        
        if (formData.totalVolumeProcessed && parseFloat(formData.totalVolumeProcessed.replace(/[^\d.]/g, '')) > 100000) {
            score += 8;
            factors.push(`✅ VOLUME HISTORY: $${formData.totalVolumeProcessed} processing volume demonstrates established business. Include lifetime processing statements.`);
        }
        
        // Risk reduction factors
        if (formData.refundRate && parseFloat(formData.refundRate) > 10) {
            score -= 12;
            factors.push(`⚠️ HIGH REFUNDS: ${formData.refundRate}% refund rate may indicate business model disputes. Prepare explanation of refund policy and customer satisfaction measures.`);
        }
        
        if (formData.highRisk && !formData.lowChargebacks) {
            score -= 15;
            factors.push('⚠️ WEAK COUNTER-EVIDENCE: High-risk designation without documented low chargebacks. Obtain dispute rate evidence immediately.');
        }
        
        if (!formData.processingHistory || formData.processingHistory.includes('month')) {
            score -= 10;
            factors.push('⚠️ LIMITED HISTORY: Short processing history strengthens Stripe\'s risk arguments. Focus on compliance and disclosure arguments.');
        }
        
        // Evidence gaps
        if (!formData.terminationDate && !formData.promisedReleaseDate) {
            score -= 8;
            factors.push('⚠️ TIMING WEAKNESS: No specific dates weaken timeline arguments. Document when hold began and any verbal promises.');
        }
        
        // Expedited procedures benefit
        if (amount < 25000) {
            score += 5;
            factors.push(`✅ COST ADVANTAGE: $${amount.toLocaleString()} qualifies for AAA expedited procedures. Lower fees and faster resolution (60-90 days).`);
        }
        
        // Ensure score stays within 0-100 range
        score = Math.max(5, Math.min(100, score));
        
        // SPECIFIC ATTORNEY-LEVEL RECOMMENDATIONS
        let riskLevel, riskClass, recommendations;
        
        if (score >= 70) {
            riskLevel = 'Strong Case';
            riskClass = 'risk-strong';
            recommendations = getStrongCaseStrategy();
        } else if (score >= 45) {
            riskLevel = 'Moderate Case';
            riskClass = 'risk-moderate';
            recommendations = getModerateCaseStrategy();
        } else {
            riskLevel = 'Challenging Case';
            riskClass = 'risk-weak';
            recommendations = getChallengingCaseStrategy();
        }
        
        return { riskLevel, riskClass, factors, recommendations, score };
    };

    // SPECIFIC CASE STRATEGIES
    const getStrongCaseStrategy = () => {
        const strategies = [];
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        
        if (formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date()) {
            strategies.push(`Your broken promise evidence creates a compelling breach of contract claim. Focus your demand on Section 5.4 violations and promissory estoppel liability.`);
        }
        
        strategies.push(`Timeline: File within 30 days of this letter for maximum pressure. AAA fees: $${amount < 25000 ? '1,775' : amount < 75000 ? '1,775' : '3,400'} vs. potential recovery of $${formData.withheldAmount || '[AMOUNT]'}.`);
        
        if (amount < 25000) {
            strategies.push(`EXPEDITED ADVANTAGE: Your claim qualifies for streamlined AAA procedures. Document-only resolution likely (60-90 days vs. 6-12 months standard).`);
        }
        
        const dynamicStrategies = getDynamicLegalStrategy();
        strategies.push(...dynamicStrategies);
        
        return strategies;
    };

    const getModerateCaseStrategy = () => {
        const strategies = [];
        const evidenceGaps = [];
        
        if (!formData.promisedReleaseDate) {
            evidenceGaps.push('Document any verbal promises or timeline commitments');
        }
        
        if (!formData.historicalDisputeRate) {
            evidenceGaps.push('Obtain 12-month chargeback rate statements from Stripe dashboard');
        }
        
        if (!formData.shiftingDeadlines && formData.shiftingTimelines) {
            evidenceGaps.push('Compile email chain showing pattern of extending deadlines');
        }
        
        strategies.push(`Your case hinges on ${evidenceGaps.length > 0 ? evidenceGaps[0] : 'strengthening procedural arguments'}. Strengthen by: 1) ${evidenceGaps[0] || 'Focus on bad faith conduct'}, 2) ${evidenceGaps[1] || 'Document communication failures'}, 3) ${evidenceGaps[2] || 'Gather industry compliance evidence'}.`);
        
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        strategies.push(`Cost-benefit: AAA fees $${amount < 25000 ? '1,775' : amount < 75000 ? '1,775' : '3,400'} vs. potential recovery $${formData.withheldAmount || '[AMOUNT]'}. Standard timeline: 6-12 months.`);
        
        strategies.push('Focus on Stripe\'s procedural failures rather than business model disputes. Emphasize good faith reliance on established relationship.');
        
        return strategies;
    };

    const getChallengingCaseStrategy = () => {
        const strategies = [];
        const obstacles = [];
        
        if (formData.highRisk && !formData.lowChargebacks) {
            obstacles.push('High-risk designation without counter-evidence');
        }
        
        if (!formData.processingHistory || formData.processingHistory.includes('month')) {
            obstacles.push('Limited processing history supports Stripe\'s position');
        }
        
        if (formData.refundRate && parseFloat(formData.refundRate) > 10) {
            obstacles.push('High refund rate may indicate business model issues');
        }
        
        strategies.push(`Primary obstacles: ${obstacles.join(', ')}. Required evidence: 1) ${getHighestPriorityEvidence()}, 2) Industry compliance documentation, 3) Customer satisfaction metrics.`);
        
        strategies.push('Alternative approach: Focus heavily on Stripe\'s procedural failures and communication blackouts rather than business model disputes.');
        
        strategies.push('Consider settlement discussions during 30-day notice period. Document preparation for arbitration while exploring resolution.');
        
        return strategies;
    };

    const getHighestPriorityEvidence = () => {
        if (formData.promisedReleaseDate) return 'Email proof of broken promise';
        if (formData.communicationBlackout) return 'Documentation of unresponsive support';
        if (formData.shiftingTimelines) return 'Timeline of shifting deadlines';
        return 'Stripe dashboard showing actual dispute metrics';
    };

    // Calculate AAA filing fees for both Standard and Flexible schedules (2025 fee schedule)
    const calculateAAAfees = () => {
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        
        let standardFees, flexibleFees;
        
        if (amount < 75000) {
            standardFees = {
                initial: 950,
                final: 825,
                total: 1775,
                expedited: true,
                schedule: 'Standard'
            };
            // Flexible not available for claims under $75k
            flexibleFees = null;
        } else if (amount < 150000) {
            standardFees = {
                initial: 1975,
                final: 1425,
                total: 3400,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 1875,
                proceed: 1925,
                final: 2275,
                total: 6075,
                expedited: false,
                schedule: 'Flexible'
            };
        } else if (amount < 300000) {
            standardFees = {
                initial: 2975,
                final: 2275,
                total: 5250,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 1875,
                proceed: 1925,
                final: 2275,
                total: 6075,
                expedited: false,
                schedule: 'Flexible'
            };
        } else if (amount < 500000) {
            standardFees = {
                initial: 4525,
                final: 3975,
                total: 8500,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 2275,
                proceed: 3400,
                final: 3975,
                total: 9650,
                expedited: false,
                schedule: 'Flexible'
            };
        } else if (amount < 1000000) {
            standardFees = {
                initial: 5650,
                final: 7025,
                total: 12675,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 2825,
                proceed: 4875,
                final: 7025,
                total: 14725,
                expedited: false,
                schedule: 'Flexible'
            };
        } else if (amount < 10000000) {
            standardFees = {
                initial: 7925,
                final: 8725,
                total: 16650,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 3975,
                proceed: 6475,
                final: 8725,
                total: 19175,
                expedited: false,
                schedule: 'Flexible'
            };
        } else {
            standardFees = {
                initial: 11325,
                final: 14150,
                total: 25475,
                expedited: false,
                schedule: 'Standard'
            };
            flexibleFees = {
                initial: 5650,
                proceed: 10300,
                final: 14150,
                total: 30100,
                expedited: false,
                schedule: 'Flexible'
            };
        }
        
        return { standardFees, flexibleFees, amount };
    };
    
    // Get fee schedule recommendation based on user's situation
    const getFeeScheduleRecommendation = () => {
        const amount = parseFloat((formData.withheldAmount || '0').replace(/[^\d.]/g, ''));
        const { standardFees, flexibleFees } = calculateAAAfees();
        
        if (!flexibleFees) {
            return {
                recommended: 'standard',
                reason: 'Flexible Fee Schedule is only available for claims $150,000 and above.'
            };
        }
        
        // Cash flow considerations
        const hasLimitedCashFlow = amount < 50000 || formData.businessDamages;
        
        // Strong case factors
        const hasStrongCase = formData.promisedReleaseDate && new Date(formData.promisedReleaseDate) < new Date();
        const hasGoodEvidence = formData.lowChargebacks && formData.historicalDisputeRate && parseFloat(formData.historicalDisputeRate) < 1;
        
        // Settlement likelihood
        const likelyToSettle = hasStrongCase || hasGoodEvidence || (formData.shiftingTimelines && formData.communicationBlackout);
        
        if (hasLimitedCashFlow && likelyToSettle) {
            return {
                recommended: 'flexible',
                reason: `Lower upfront cost ($${flexibleFees.initial.toLocaleString()} vs $${standardFees.initial.toLocaleString()}) makes sense given your situation. If case settles early, you save money despite higher total fees.`
            };
        } else if (hasStrongCase && !hasLimitedCashFlow) {
            return {
                recommended: 'standard',
                reason: `Your strong evidence suggests the case will proceed to hearing. Standard schedule saves $${(flexibleFees.total - standardFees.total).toLocaleString()} in total fees.`
            };
        } else if (amount > 100000) {
            return {
                recommended: 'standard',
                reason: `For higher-value claims, the Standard schedule typically provides better value and shows commitment to pursuing the case.`
            };
        } else {
            return {
                recommended: 'flexible',
                reason: `Flexible schedule provides cash flow advantages with lower initial filing fee. You can reassess your strategy during the 90-day proceed fee period.`
            };
        }
    };

    // IMPROVED: Analyze case complexity with refund rates and account age
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
        
        // Account establishment reduces complexity
        if (formData.accountStartDate) {
            const accountAge = (new Date() - new Date(formData.accountStartDate)) / (1000 * 60 * 60 * 24 * 365);
            if (accountAge > 2) {
                complexityScore -= 1;
                complexityFactors.push('✅ Long-standing relationship supports good faith arguments');
            }
        }
        
        if (formData.industryCompliance) {
            complexityScore -= 1;
            complexityFactors.push('✅ Regulated business compliance reduces perceived risk');
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
        
        // NEW: High refund rate increases complexity
        if (formData.refundRate && parseFloat(formData.refundRate) > 10) {
            complexityScore += 2;
            complexityFactors.push('⚠️ Pattern of refund requests may indicate business model disputes');
        }
        
        // NEW: New account increases complexity
        if (formData.accountStartDate) {
            const accountAge = (new Date() - new Date(formData.accountStartDate)) / (1000 * 60 * 60 * 24 * 365);
            if (accountAge < 0.5) {
                complexityScore += 1;
                complexityFactors.push('⚠️ Limited processing history weakens relationship argument');
            }
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
            procedures = 'Likely requires telephone hearings and limited document production (AAA rules restrict discovery)';
        }
        
        return { isComplex, timeline, procedures, complexityFactors, complexityScore };
    };
    
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
                    // Tab 1: Account Details (ENHANCED with Account Establishment Fields)
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
                        
                        React.createElement('div', { key: 'row6', className: 'form-row' }, [
                            React.createElement('div', { key: 'business', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Business Type'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'businessType',
                                    value: formData.businessType,
                                    onChange: handleChange,
                                    placeholder: 'e.g., SaaS, E-commerce, Consulting'
                                })
                            ]),
                            React.createElement('div', { key: 'processing', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Processing History'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'processingHistory',
                                    value: formData.processingHistory,
                                    onChange: handleChange,
                                    placeholder: '2 years, 6 months, etc.'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'row7', className: 'form-row' }, [
                            React.createElement('div', { key: 'dispute', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Historical Dispute Rate (%)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'historicalDisputeRate',
                                    value: formData.historicalDisputeRate,
                                    onChange: handleChange,
                                    placeholder: '0.5'
                                })
                            ]),
                            React.createElement('div', { key: 'refund', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Refund Rate (%)'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'refundRate',
                                    value: formData.refundRate,
                                    onChange: handleChange,
                                    placeholder: '5.0'
                                })
                            ])
                        ]),
                        
                        // NEW Account Establishment Section
                        React.createElement('h3', { key: 'establishment-title', style: { marginTop: '30px', color: '#2c3e50' } }, 'Account Establishment (Optional - Strengthens Case)'),
                        
                        React.createElement('div', { key: 'row8', className: 'form-row' }, [
                            React.createElement('div', { key: 'start-date', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Account Start Date'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'date',
                                    name: 'accountStartDate',
                                    value: formData.accountStartDate,
                                    onChange: handleChange
                                })
                            ]),
                            React.createElement('div', { key: 'volume', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Total Volume Processed'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'totalVolumeProcessed',
                                    value: formData.totalVolumeProcessed,
                                    onChange: handleChange,
                                    placeholder: '500,000'
                                })
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'establishment-checkboxes', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'prev-issues',
                                className: `checkbox-item ${formData.previousAccountIssues ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'previousAccountIssues', type: 'checkbox', checked: !formData.previousAccountIssues }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'previousAccountIssues',
                                    checked: formData.previousAccountIssues,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Prior Account Issues'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Check if account had previous violations or compliance issues.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'compliance',
                                className: `checkbox-item ${formData.industryCompliance ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'industryCompliance', type: 'checkbox', checked: !formData.industryCompliance }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'industryCompliance',
                                    checked: formData.industryCompliance,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Industry Compliance'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'PCI DSS, SOC compliance, or other industry-specific certifications.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'customers',
                                className: `checkbox-item ${formData.repeatCustomerBase ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'repeatCustomerBase', type: 'checkbox', checked: !formData.repeatCustomerBase }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'repeatCustomerBase',
                                    checked: formData.repeatCustomerBase,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Repeat Customer Base'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Established repeat customers demonstrating business legitimacy.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'licenses',
                                className: `checkbox-item ${formData.businessLicenses ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'businessLicenses', type: 'checkbox', checked: !formData.businessLicenses }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'businessLicenses',
                                    checked: formData.businessLicenses,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Business Licenses'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Proper business licensing and registration.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'references',
                                className: `checkbox-item ${formData.professionalReferences ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'professionalReferences', type: 'checkbox', checked: !formData.professionalReferences }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'professionalReferences',
                                    checked: formData.professionalReferences,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Professional References'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Bank references, business partner references available.')
                                ])
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'tip', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Account Establishment Benefits'),
                            React.createElement('p', { key: 'text' }, 'These optional fields strengthen your case by demonstrating established business legitimacy and long-term relationship with Stripe. Longer account history and higher processing volumes significantly improve legal position.')
                        ])
                    ]),
                    
                    // Tab 2: Stripe's Stated Reasons (REORGANIZED - Custom Reason moved above Specific Violations)
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
                                key: 'review',
                                className: `checkbox-item ${formData.accountReview ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'accountReview', type: 'checkbox', checked: !formData.accountReview }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'accountReview',
                                    checked: formData.accountReview,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Account Review in Progress'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Ongoing account review without specific timeline or completion criteria.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'business-model',
                                className: `checkbox-item ${formData.businessModelIssue ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'businessModelIssue', type: 'checkbox', checked: !formData.businessModelIssue }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'businessModelIssue',
                                    checked: formData.businessModelIssue,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Retroactive Business Model Concerns'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Business model concerns raised after initial approval and processing history.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'retroactive',
                                className: `checkbox-item ${formData.retroactiveRisk ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'retroactiveRisk', type: 'checkbox', checked: !formData.retroactiveRisk }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'retroactiveRisk',
                                    checked: formData.retroactiveRisk,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Retroactive Risk Designation'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Risk designation applied retroactively after processing payments for extended period.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'liability',
                                className: `checkbox-item ${formData.chargebackLiability ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'chargebackLiability', type: 'checkbox', checked: !formData.chargebackLiability }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'chargebackLiability',
                                    checked: formData.chargebackLiability,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Ongoing Chargeback Liability'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Chargeback liability concerns extending beyond reasonable dispute resolution windows.')
                                ])
                            ]),
                            
                            React.createElement('div', { 
                                key: 'risk-assessment',
                                className: `checkbox-item ${formData.riskAssessment ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'riskAssessment', type: 'checkbox', checked: !formData.riskAssessment }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'riskAssessment',
                                    checked: formData.riskAssessment,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Ongoing Risk Assessment'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Ongoing risk assessment without timeline, completion criteria, or clear resolution path.')
                                ])
                            ]),
                            
                            // MOVED: Custom Reason now after all main reasons but before Specific Violations
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
                        
                        // Custom reason text appears immediately after Custom Reason checkbox
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
                    
                    // Tab 5: Arbitration Demand Options (NEW TAB)
                    currentTab === 4 && React.createElement('div', { key: 'tab5' }, [
                        React.createElement('h2', { key: 'h2' }, 'Arbitration Demand Strategy'),
                        React.createElement('p', { key: 'p' }, 'Decide whether to include a draft AAA arbitration demand with your letter. This shows maximum seriousness and preparation.'),
                        
                        // Decision Factors Section
                        React.createElement('div', { key: 'decision-section', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Should You Include the Arbitration Demand?'),
                            React.createElement('div', { key: 'factors' }, [
                                React.createElement('p', { key: 'intro' }, React.createElement('strong', { key: 'bold' }, 'Choose YES for Maximum Pressure:')),
                                React.createElement('ul', { key: 'yes-list', style: { marginLeft: '20px' } }, [
                                    React.createElement('li', { key: 'yes1' }, 'Large withheld amount (>$10,000) where you need maximum leverage'),
                                    React.createElement('li', { key: 'yes2' }, 'Stripe has been unresponsive or given you the runaround'),
                                    React.createElement('li', { key: 'yes3' }, 'You have strong evidence (broken promises, low dispute rate, etc.)'),
                                    React.createElement('li', { key: 'yes4' }, 'Previous attempts at resolution have failed'),
                                    React.createElement('li', { key: 'yes5' }, 'You\'re prepared to follow through with actual filing if needed')
                                ]),
                                React.createElement('p', { key: 'middle', style: { marginTop: '15px' } }, React.createElement('strong', { key: 'bold' }, 'Choose NO for Friendlier Approach:')),
                                React.createElement('ul', { key: 'no-list', style: { marginLeft: '20px' } }, [
                                    React.createElement('li', { key: 'no1' }, 'Smaller amounts where arbitration costs might not be justified'),
                                    React.createElement('li', { key: 'no2' }, 'You want to maintain a future business relationship with Stripe'),
                                    React.createElement('li', { key: 'no3' }, 'This is your first formal communication attempt'),
                                    React.createElement('li', { key: 'no4' }, 'You prefer to escalate gradually rather than immediately'),
                                    React.createElement('li', { key: 'no5' }, 'Recent Stripe communication suggests resolution is possible')
                                ])
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'enable-checkbox', className: 'checkbox-grid' }, [
                            React.createElement('div', { 
                                key: 'enable-arb',
                                className: `checkbox-item ${formData.includeArbitrationDraft ? 'selected' : ''}`,
                                onClick: () => handleChange({ target: { name: 'includeArbitrationDraft', type: 'checkbox', checked: !formData.includeArbitrationDraft }})
                            }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'checkbox',
                                    name: 'includeArbitrationDraft',
                                    checked: formData.includeArbitrationDraft,
                                    onChange: handleChange
                                }),
                                React.createElement('div', { key: 'content' }, [
                                    React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Include Arbitration Demand Attachment'),
                                    React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Generate a professional AAA arbitration demand to attach. Creates maximum pressure and shows you\'re fully prepared.')
                                ])
                            ])
                        ]),
                        
                        formData.includeArbitrationDraft && React.createElement('div', { key: 'arb-options' }, [
                            React.createElement('h3', { key: 'h3', style: { marginTop: '30px', color: '#2c3e50' } }, 'Arbitration Configuration'),
                            
                            React.createElement('div', { key: 'damages-section', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Additional Business Damages Beyond Withheld Amount'),
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    name: 'specificDamagesAmount',
                                    value: formData.specificDamagesAmount,
                                    onChange: handleChange,
                                    placeholder: 'e.g., 5000 (emergency financing, lost sales, etc.)'
                                })
                            ]),
                            
                            React.createElement('div', { key: 'claims-checkboxes', className: 'checkbox-grid' }, [
                                React.createElement('div', { 
                                    key: 'expedited',
                                    className: `checkbox-item ${formData.expeditedProcedures ? 'selected' : ''}`,
                                    onClick: () => handleChange({ target: { name: 'expeditedProcedures', type: 'checkbox', checked: !formData.expeditedProcedures }})
                                }, [
                                    React.createElement('input', {
                                        key: 'input',
                                        type: 'checkbox',
                                        name: 'expeditedProcedures',
                                        checked: formData.expeditedProcedures,
                                        onChange: handleChange
                                    }),
                                    React.createElement('div', { key: 'content' }, [
                                        React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Request Expedited Procedures'),
                                        React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Faster resolution (60-90 days), available for most commercial disputes.')
                                    ])
                                ]),
                                
                                React.createElement('div', { 
                                    key: 'interest',
                                    className: `checkbox-item ${formData.includeInterestOnFunds ? 'selected' : ''}`,
                                    onClick: () => handleChange({ target: { name: 'includeInterestOnFunds', type: 'checkbox', checked: !formData.includeInterestOnFunds }})
                                }, [
                                    React.createElement('input', {
                                        key: 'input',
                                        type: 'checkbox',
                                        name: 'includeInterestOnFunds',
                                        checked: formData.includeInterestOnFunds,
                                        onChange: handleChange
                                    }),
                                    React.createElement('div', { key: 'content' }, [
                                        React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Claim Interest/Profits on Withheld Funds'),
                                        React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'Allowed under California law - demand profits Stripe earned while holding your money.')
                                    ])
                                ]),
                                
                                React.createElement('div', { 
                                    key: 'attorney-fees',
                                    className: `checkbox-item ${formData.includeAttorneyFees ? 'selected' : ''}`,
                                    onClick: () => handleChange({ target: { name: 'includeAttorneyFees', type: 'checkbox', checked: !formData.includeAttorneyFees }})
                                }, [
                                    React.createElement('input', {
                                        key: 'input',
                                        type: 'checkbox',
                                        name: 'includeAttorneyFees',
                                        checked: formData.includeAttorneyFees,
                                        onChange: handleChange
                                    }),
                                    React.createElement('div', { key: 'content' }, [
                                        React.createElement('div', { key: 'label', className: 'checkbox-label' }, 'Claim Attorney Fees and Costs'),
                                        React.createElement('div', { key: 'desc', className: 'checkbox-description' }, 'California UCL allows recovery of arbitration costs in unfair business practice cases.')
                                    ])
                                ])
                            ]),
                            
                            React.createElement('div', { key: 'additional-claims', className: 'form-group' }, [
                                React.createElement('label', { key: 'label' }, 'Additional Claims or Special Circumstances (Optional)'),
                                React.createElement('textarea', {
                                    key: 'textarea',
                                    name: 'additionalClaims',
                                    value: formData.additionalClaims,
                                    onChange: handleChange,
                                    placeholder: 'Describe any special circumstances or additional legal claims specific to your case...',
                                    rows: 3
                                })
                            ])
                        ]),
                        
                        // How to Send Section
                        React.createElement('div', { key: 'sending-section', className: 'tip-box warning' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'How to Send Your Demand Letter'),
                            React.createElement('div', { key: 'sending-steps' }, [
                                React.createElement('p', { key: 'step1' }, React.createElement('strong', { key: 'bold1' }, '1. Certified Mail: ')),
                                React.createElement('p', { key: 'step1-text', style: { marginLeft: '20px' } }, 'Send via USPS Certified Mail, Return Receipt Requested to:'),
                                React.createElement('p', { key: 'address', style: { marginLeft: '40px', fontFamily: 'monospace' } }, [
                                    'Stripe, Inc.',
                                    React.createElement('br', { key: 'br1' }),
                                    'Attn: Legal Department',
                                    React.createElement('br', { key: 'br2' }),
                                    '354 Oyster Point Blvd.',
                                    React.createElement('br', { key: 'br3' }),
                                    'South San Francisco, CA 94080'
                                ]),
                                React.createElement('p', { key: 'step2' }, React.createElement('strong', { key: 'bold2' }, '2. Email Copy: ')),
                                React.createElement('p', { key: 'step2-text', style: { marginLeft: '20px' } }, 'Also email to: support@stripe.com (Subject: "ATTN: Legal Department - Arbitration Notice")'),
                                React.createElement('p', { key: 'step3' }, React.createElement('strong', { key: 'bold3' }, '3. Keep Records: ')),
                                React.createElement('p', { key: 'step3-text', style: { marginLeft: '20px' } }, 'Save certified mail receipt, delivery confirmation, and email confirmation. You\'ll need these for arbitration filing.')
                            ])
                        ]),
                        
                        React.createElement('div', { key: 'strategy-tip', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Strategic Timing'),
                            React.createElement('p', { key: 'text' }, 'Including the arbitration demand often leads to faster settlements during the 30-day notice period - many companies prefer to resolve rather than face formal arbitration proceedings. However, you must be prepared to actually file if Stripe doesn\'t respond appropriately.')
                        ]),
                        
                        React.createElement('div', { key: 'timeline', className: 'tip-box info' }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, 'Timeline & Costs (2025 AAA Fee Schedule)'),
                            React.createElement('p', { key: 'notice' }, React.createElement('strong', { key: 'notice-label' }, '30-Day Notice Period: '), 'Required before filing arbitration (automatically calculated in your letter)'),
                            (() => {
                                const { standardFees, flexibleFees, amount } = calculateAAAfees();
                                const recommendation = getFeeScheduleRecommendation();
                                const complexity = analyzeCaseComplexity();
                                
                                const elements = [];
                                
                                // Fee Schedule Comparison
                                elements.push(
                                    React.createElement('div', { key: 'fee-comparison', style: { marginBottom: '20px' } }, [
                                        React.createElement('h4', { key: 'comparison-title', style: { marginBottom: '15px', color: '#2c3e50' } }, 'AAA Fee Schedule Options'),
                                        
                                        // Standard Schedule
                                        React.createElement('div', { key: 'standard-schedule', style: { 
                                            border: recommendation.recommended === 'standard' ? '2px solid #28a745' : '1px solid #ddd',
                                            borderRadius: '8px', 
                                            padding: '15px', 
                                            marginBottom: '15px',
                                            backgroundColor: recommendation.recommended === 'standard' ? '#f8fff9' : '#f8f9fa'
                                        } }, [
                                            React.createElement('div', { key: 'standard-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                                                React.createElement('h5', { key: 'standard-title', style: { margin: 0, color: '#2c3e50' } }, [
                                                    'Standard Fee Schedule',
                                                    recommendation.recommended === 'standard' && React.createElement('span', { key: 'recommended', style: { marginLeft: '10px', backgroundColor: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' } }, 'RECOMMENDED')
                                                ]),
                                                React.createElement('div', { key: 'standard-total', style: { fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' } }, `$${standardFees.total.toLocaleString()} Total`)
                                            ]),
                                            React.createElement('p', { key: 'standard-breakdown', style: { margin: '10px 0', fontSize: '14px' } }, [
                                                `$${standardFees.initial.toLocaleString()} initial filing fee + $${standardFees.final.toLocaleString()} final fee`,
                                                standardFees.expedited ? ' (Expedited procedures available)' : ''
                                            ]),
                                            React.createElement('p', { key: 'standard-explanation', style: { margin: 0, fontSize: '13px', color: '#6c757d' } }, 'Two-payment system: pay initial fee when filing, final fee when hearings are scheduled. Lower total cost if case proceeds to hearing.')
                                        ]),
                                        
                                        // Flexible Schedule (if available)
                                        flexibleFees && React.createElement('div', { key: 'flexible-schedule', style: { 
                                            border: recommendation.recommended === 'flexible' ? '2px solid #28a745' : '1px solid #ddd',
                                            borderRadius: '8px', 
                                            padding: '15px', 
                                            marginBottom: '15px',
                                            backgroundColor: recommendation.recommended === 'flexible' ? '#f8fff9' : '#f8f9fa'
                                        } }, [
                                            React.createElement('div', { key: 'flexible-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                                                React.createElement('h5', { key: 'flexible-title', style: { margin: 0, color: '#2c3e50' } }, [
                                                    'Flexible Fee Schedule',
                                                    recommendation.recommended === 'flexible' && React.createElement('span', { key: 'recommended', style: { marginLeft: '10px', backgroundColor: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' } }, 'RECOMMENDED')
                                                ]),
                                                React.createElement('div', { key: 'flexible-total', style: { fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' } }, `$${flexibleFees.total.toLocaleString()} Total`)
                                            ]),
                                            React.createElement('p', { key: 'flexible-breakdown', style: { margin: '10px 0', fontSize: '14px' } }, `$${flexibleFees.initial.toLocaleString()} initial + $${flexibleFees.proceed.toLocaleString()} proceed fee (due within 90 days) + $${flexibleFees.final.toLocaleString()} final fee`),
                                            React.createElement('p', { key: 'flexible-explanation', style: { margin: 0, fontSize: '13px', color: '#6c757d' } }, 'Three-payment system: lower upfront cost, spread payments over time. Good for cash flow but higher total cost if case proceeds to hearing.')
                                        ]),
                                        
                                        // Recommendation
                                        React.createElement('div', { key: 'recommendation', style: { 
                                            backgroundColor: '#e8f4fd', 
                                            border: '1px solid #bee5eb', 
                                            borderRadius: '6px', 
                                            padding: '15px',
                                            marginTop: '15px'
                                        } }, [
                                            React.createElement('h5', { key: 'rec-title', style: { margin: '0 0 10px 0', color: '#0c5460' } }, 'Our Recommendation:'),
                                            React.createElement('p', { key: 'rec-text', style: { margin: 0, fontSize: '14px', color: '#0c5460' } }, recommendation.reason)
                                        ])
                                    ])
                                );
                                
                                // Additional fee information
                                elements.push(
                                    React.createElement('p', { key: 'fee-explanation', style: { fontSize: '14px', color: '#6c757d', marginBottom: '15px' } }, [
                                        React.createElement('strong', { key: 'who-pays' }, 'Who Pays: '), 
                                        'You (claimant) pay administrative fees when filing. However, you can request fee reallocation in your arbitration demand, and the arbitrator can order Stripe to reimburse you for these costs if you prevail.'
                                    ])
                                );
                                
                                // Timeline and process info
                                elements.push(
                                    React.createElement('p', { key: 'timeline' }, [
                                        React.createElement('strong', { key: 'timeline-label' }, 'Expected Timeline: '), 
                                        complexity.timeline
                                    ])
                                );
                                
                                elements.push(
                                    React.createElement('p', { key: 'procedures' }, [
                                        React.createElement('strong', { key: 'procedures-label' }, 'Likely Process: '), 
                                        complexity.procedures
                                    ])
                                );
                                
                                elements.push(
                                    React.createElement('p', { key: 'arbitrator-costs', style: { fontSize: '14px', color: '#6c757d' } }, [
                                        React.createElement('strong', { key: 'arb-label' }, 'Arbitrator Compensation: '), 
                                        'Typically $300-600/hour, split equally between parties unless your arbitration clause or arbitrator rules otherwise. Can also be reallocated by the arbitrator.'
                                    ])
                                );
                                
                                if (standardFees.expedited) {
                                    elements.push(
                                        React.createElement('p', { key: 'expedited-tip' }, [
                                            React.createElement('strong', { key: 'expedited-label' }, 'Expedited Procedures Available: '), 
                                            'Claims under $75K qualify for expedited procedures - faster resolution and same AAA fees.'
                                        ])
                                    );
                                }
                                
                                return elements;
                            })()
                        ])
                    ]),
                    
                    // Tab 6: Risk Assessment (REMOVED "Attorney-Level" language)
                    currentTab === 5 && React.createElement('div', { key: 'tab6' }, [
                        React.createElement('h2', { key: 'h2' }, 'Case Analysis & Strategy'),
                        React.createElement('p', { key: 'p' }, 'Educational assessment of case factors and strategic considerations:'),
                        React.createElement('div', { key: 'disclaimer', className: 'tip-box warning', style: { marginBottom: '20px' } }, [
                            React.createElement('div', { key: 'title', className: 'tip-title' }, '⚠️ Important Disclaimer'),
                            React.createElement('p', { key: 'text' }, 'This analysis is for educational purposes only and does not constitute legal advice. Consult with a qualified attorney for professional legal guidance specific to your situation.')
                        ]),
                        
                        (() => {
                            const assessment = getRiskAssessment();
                            const complexity = analyzeCaseComplexity();
                            const evidenceStrategy = getEvidenceStrategy();
                            
                            return React.createElement('div', { key: 'assessment' }, [
                                React.createElement('div', { key: 'score-card', className: `risk-card ${assessment.riskClass}` }, [
                                    React.createElement('h3', { key: 'h3' }, `${assessment.riskLevel} (Score: ${assessment.score}/100)`),
                                    React.createElement('ul', { key: 'factors' }, 
                                        assessment.factors.map((factor, index) => 
                                            React.createElement('li', { key: index }, factor)
                                        )
                                    )
                                ]),
                                
                                React.createElement('div', { key: 'strategy-card', className: 'risk-card risk-strong' }, [
                                    React.createElement('h3', { key: 'h3' }, 'Strategic Recommendations'),
                                    React.createElement('ul', { key: 'recs' }, 
                                        assessment.recommendations.map((rec, index) => 
                                            React.createElement('li', { key: index }, rec)
                                        )
                                    )
                                ]),
                                
                                evidenceStrategy.length > 0 && React.createElement('div', { key: 'evidence-card', className: 'risk-card risk-moderate' }, [
                                    React.createElement('h3', { key: 'h3' }, 'Evidence Hierarchy - Priority Order'),
                                    React.createElement('div', { key: 'evidence-list' },
                                        evidenceStrategy.map((item, index) => 
                                            React.createElement('div', { key: index, className: 'evidence-item', style: { marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' } }, [
                                                React.createElement('strong', { key: 'priority' }, `Priority ${item.priority}: ${item.evidence}`),
                                                React.createElement('div', { key: 'impact', style: { color: '#28a745', fontSize: '14px' } }, `Impact: ${item.impact}`),
                                                React.createElement('div', { key: 'action', style: { color: '#6c757d', fontSize: '14px' } }, `Action: ${item.action}`)
                                            ])
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
                                ])
                            ]);
                        })()
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
                        React.createElement('p', { key: 'subtitle', className: 'preview-text' }, 
                            formData.includeArbitrationDraft ? 'Your AAA arbitration demand' : 
                            'Your demand letter with 30-day arbitration notice'
                        )
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
