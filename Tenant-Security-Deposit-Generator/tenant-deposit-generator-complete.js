// Tenant Security Deposit Demand Letter Generator - Complete React Component
const { useState, useRef, useEffect } = React;

// Icon component
const Icon = ({ name, style = {} }) => React.createElement('i', {
    'data-feather': name,
    style: style
});

// All 50 US States
const US_STATES = [
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'NY', label: 'New York' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'OH', label: 'Ohio' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'MI', label: 'Michigan' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'IN', label: 'Indiana' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MD', label: 'Maryland' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'CO', label: 'Colorado' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'AL', label: 'Alabama' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'OR', label: 'Oregon' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'UT', label: 'Utah' },
    { value: 'IA', label: 'Iowa' },
    { value: 'NV', label: 'Nevada' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'KS', label: 'Kansas' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'ID', label: 'Idaho' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'ME', label: 'Maine' },
    { value: 'MT', label: 'Montana' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'DE', label: 'Delaware' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'AK', label: 'Alaska' },
    { value: 'VT', label: 'Vermont' },
    { value: 'WY', label: 'Wyoming' }
];

// Main Generator Component
const TenantDepositGenerator = () => {
    // State management
    const [currentTab, setCurrentTab] = useState(0);
    const [lastChanged, setLastChanged] = useState(null);
    const [eSignLoading, setESignLoading] = useState(false);
    const previewRef = useRef(null);
    
    // Streamlined form data state - progressive disclosure
    const [formData, setFormData] = useState({
        // Essential info (collected progressively)
        tenantName: '',
        landlordName: '',
        landlordCompany: '',
        landlordAddress: '',
        landlordCity: '',
        landlordState: 'CA',
        landlordZip: '',
        rentalAddress: '',
        rentalUnit: '',
        rentalCity: '',
        rentalState: 'CA',
        rentalZip: '',
        leaseStartDate: '',
        leaseEndDate: '',
        moveOutDate: '',
        
        // Scenario selection and details
        primaryScenario: '', // 'complete-non-return' or 'partial-non-return'
        
        // Deposit amounts (asked in scenarios)
        totalDepositAmount: '',
        amountReturned: '', // only for partial
        
        // What happened details
        landlordCommunication: '', // 'no-response', 'verbal-only', 'written-inadequate', 'written-disputed'
        landlordJustifications: [], // array of justification types
        disputedCharges: [], // array of disputed charge types
        
        // Evidence available
        evidenceTypes: [], // array of evidence types
        evidenceDetails: '',
        
        // Letter preferences
        letterTone: 'firm',
        responseDeadline: 14,
        includeSmallClaimsThreat: true,
        requestAttorneyFees: true
    });

    // Simplified tab definitions
    const tabs = [
        { id: 'scenarios', label: 'Your Situation', icon: 'message-circle' },
        { id: 'details', label: 'Details', icon: 'edit-3' }
    ];

    // Update form data and trigger highlighting (Stripe-style implementation)
    const updateFormData = (field, value) => {
        // Record what field was changed for highlighting
        setLastChanged(field);
        
        // Update form data
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Map form fields to document sections for highlighting (enhanced with better targeting)
    const getSectionToHighlight = () => {
        if (!lastChanged) return null;
        
        // Always highlight content based on what field changed
        if (['letterTone'].includes(lastChanged)) {
            return 'tone-changes'; // Highlight demand statements that change with tone
        }
        if (['primaryScenario'].includes(lastChanged)) {
            return 'scenario-content'; // Highlight content that changes with scenarios
        }
        if (['totalDepositAmount', 'amountReturned'].includes(lastChanged)) {
            return 'deposit-details';
        }
        if (['landlordCommunication', 'landlordJustifications', 'disputedCharges'].includes(lastChanged)) {
            return 'scenario-content';
        }
        if (['evidenceTypes', 'evidenceDetails'].includes(lastChanged)) {
            return 'evidence-section';
        }
        if (['tenantName', 'landlordName', 'rentalAddress'].includes(lastChanged)) {
            return 'header-info';
        }
        if (['leaseStartDate', 'leaseEndDate', 'moveOutDate'].includes(lastChanged)) {
            return 'tenancy-details';
        }
        if (['responseDeadline', 'includeSmallClaimsThreat'].includes(lastChanged)) {
            return 'demand-section';
        }
        
        return 'scenario-content'; // Default to scenario content
    };

    // Create highlighted text using Stripe-style regex targeting
    const createHighlightedText = (documentText) => {
        const sectionToHighlight = getSectionToHighlight();
        if (!sectionToHighlight) return documentText;
        
        let highlightedText = documentText;
        
        // Define more specific regex patterns for granular highlighting
        const sections = {
            'header-info': /Re: Demand for Return of Security Deposit.*?Property: [^\n]*/s,
            'tone-changes': /(I respectfully request|I demand|I hereby demand).*?(?=\.|\n)/s,
            'scenario-content': /(Complete Non-Return|Partial Non-Return|What Happened|Evidence Available).*?(?=<p><strong>|$)/s,
            'deposit-details': /(\$[\d,]+|\d+\.\d+)/g,
            'tenancy-details': /Tenancy Details:.*?(?=<p><strong>|$)/s,
            'evidence-section': /Evidence Available:.*?(?=<p><strong>|$)/s,
            'demand-section': /(You have|Demand:).*?days.*?(?=<p>|$)/s
        };
        
        if (sections[sectionToHighlight]) {
            highlightedText = documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }
        
        return highlightedText;
    };

    // Auto-scroll with Stripe-style implementation
    useEffect(() => {
        if (previewRef.current && lastChanged) {
            setTimeout(() => {
                const highlightedElement = previewRef.current.querySelector('.highlighted-text');
                if (highlightedElement) {
                    highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100); // Stripe timing for DOM updates
            
            // Clear highlighting after 8 seconds
            setTimeout(() => setLastChanged(null), 8000);
        }
    }, [lastChanged]);

    // Helper function for clickable checkbox/radio items
    const createClickableItem = (type, fieldName, value, title, description, checked, extraClassName = '', customOnClick = null) => {
        const inputProps = type === 'checkbox' 
            ? {
                type: 'checkbox',
                checked: checked,
                onChange: (e) => e.stopPropagation()
            }
            : {
                type: 'radio',
                name: fieldName,
                value: value,
                checked: checked,
                onChange: (e) => e.stopPropagation()
            };

        return React.createElement('div', { 
            key: value || fieldName,
            className: `${type}-item ${checked ? 'selected' : ''} ${extraClassName}`,
            onClick: customOnClick || (() => {
                if (type === 'checkbox') {
                    updateFormData(fieldName, !checked);
                } else {
                    updateFormData(fieldName, value);
                }
            })
        }, [
            React.createElement('input', {
                key: 'input',
                ...inputProps
            }),
            React.createElement('div', { key: 'content', className: `${type}-content` }, [
                React.createElement('strong', { key: 'title' }, title),
                React.createElement('p', { key: 'desc' }, description)
            ])
        ]);
    };

    // Generate streamlined letter content with progressive disclosure
    const generateLetterContent = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        
        if (!stateData) {
            return `
                <h1>DEMAND FOR RETURN OF SECURITY DEPOSIT</h1>
                <p><em>Please select your situation to generate your demand letter...</em></p>
            `;
        }
        
        // Calculate based on deposit amounts
        const totalDeposit = parseFloat(formData.totalDepositAmount) || 0;
        const amountReturned = parseFloat(formData.amountReturned) || 0;
        const calculations = window.StateLawUtils ? window.StateLawUtils.calculateTotalDemand(formData, state) : {
            total: totalDeposit,
            deposits: totalDeposit,
            penalty: 0,
            interest: 0,
            daysPassed: 45
        };
        
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Determine letter tone
        let greeting, closingTone, urgencyLevel;
        switch (formData.letterTone) {
            case 'professional':
                greeting = "Dear";
                closingTone = "I look forward to your prompt response and resolution of this matter.";
                urgencyLevel = "I respectfully request";
                break;
            case 'firm':
                greeting = "To";
                closingTone = "I expect your immediate attention to this matter and compliance with state law.";
                urgencyLevel = "I demand";
                break;
            case 'litigation':
                greeting = "TO";
                closingTone = "This letter serves as formal notice of your legal obligations. Failure to comply will result in legal action.";
                urgencyLevel = "I hereby demand";
                break;
            default:
                greeting = "Dear";
                closingTone = "I look forward to your prompt response.";
                urgencyLevel = "I request";
        }

        // Build scenario-specific content
        let scenarioContent = [];
        let whatHappenedText = "";
        let evidenceText = "";
        
        // Generate content based on selected scenario
        if (formData.primaryScenario === 'complete-non-return') {
            scenarioContent.push(`**Complete Non-Return Situation:** You have withheld my entire security deposit of $${formData.totalDepositAmount || '0'}.`);
            
            // What happened details
            if (formData.landlordCommunication === 'no-response') {
                whatHappenedText = `You have provided no response or justification for withholding my deposit, violating your legal obligation to communicate.`;
            } else if (formData.landlordCommunication === 'verbal-only') {
                whatHappenedText = `You provided only verbal explanations, failing to meet legal written notice requirements under ${stateData.citation}.`;
            } else if (formData.landlordCommunication === 'written-inadequate') {
                whatHappenedText = `The written justification you provided is inadequate and fails to meet state law requirements for itemized deductions.`;
            } else if (formData.landlordCommunication === 'written-disputed') {
                whatHappenedText = `While you provided written justifications, I dispute these charges as improper under state law.`;
            }
        }
        
        if (formData.primaryScenario === 'partial-non-return') {
            const withheldAmount = (totalDeposit - amountReturned).toFixed(2);
            scenarioContent.push(`**Partial Non-Return Situation:** While you returned $${formData.amountReturned || '0'} of my $${formData.totalDepositAmount || '0'} security deposit, you improperly withheld $${withheldAmount}.`);
            
            // What happened details for partial return
            if (formData.landlordCommunication === 'no-response') {
                whatHappenedText = `You provided no adequate explanation for the withheld amount, violating disclosure requirements.`;
            } else if (formData.landlordCommunication === 'written-inadequate') {
                whatHappenedText = `The justification you provided for withholding $${withheldAmount} is inadequate and violates state itemization requirements.`;
            } else if (formData.landlordCommunication === 'written-disputed') {
                whatHappenedText = `I dispute the charges used to justify withholding $${withheldAmount} as violations of tenant protection laws.`;
            }
        }
        
        // Add disputed charges details
        if (formData.disputedCharges && formData.disputedCharges.length > 0) {
            const disputeDescriptions = formData.disputedCharges.map(charge => {
                switch(charge) {
                    case 'normal-wear-painting': return 'normal wear and tear (painting)';
                    case 'normal-wear-carpet': return 'normal carpet wear';
                    case 'normal-wear-holes': return 'small nail holes';
                    case 'excessive-cleaning': return 'excessive cleaning fees';
                    case 'pre-existing-damage': return 'pre-existing damage';
                    case 'improper-repairs': return 'improper repair charges';
                    default: return charge;
                }
            });
            whatHappenedText += ` Specifically, I dispute charges for: ${disputeDescriptions.join(", ")}.`;
        }
        
        // Add evidence section
        if (formData.evidenceTypes && formData.evidenceTypes.length > 0) {
            const evidenceDescriptions = formData.evidenceTypes.map(evidence => {
                switch(evidence) {
                    case 'photos': return 'move-in/move-out photos';
                    case 'receipts': return 'payment receipts and records';
                    case 'communications': return 'written communications';
                    case 'witnesses': return 'witness statements';
                    case 'inspection': return 'inspection reports';
                    case 'cleaning': return 'professional cleaning receipts';
                    default: return evidence;
                }
            });
            evidenceText = `**Evidence Available:** I have the following evidence to support my claim: ${evidenceDescriptions.join(", ")}.`;
            if (formData.evidenceDetails) {
                evidenceText += ` ${formData.evidenceDetails}`;
            }
        }
        
        // Create clean text version for eSignatures (no HTML, but with formatting)
        const cleanText = `**DEMAND FOR RETURN OF SECURITY DEPOSIT**

${today}

${greeting}: ${formData.landlordName || '[LANDLORD NAME]'}${formData.landlordCompany ? '\n' + formData.landlordCompany : ''}
${formData.landlordAddress || '[LANDLORD ADDRESS]'}
${formData.landlordCity || '[CITY]'}, ${formData.landlordState || 'CA'} ${formData.landlordZip || '[ZIP]'}

**Re: Demand for Return of Security Deposit**
**Tenant:** ${formData.tenantName || '[TENANT NAME]'}
**Property:** ${formData.rentalAddress || '[RENTAL ADDRESS]'}${formData.rentalUnit ? ', Unit ' + formData.rentalUnit : ''}, ${formData.rentalCity || '[CITY]'}, ${formData.rentalState || 'CA'}

${greeting} ${formData.landlordName || '[LANDLORD NAME]'},

${urgencyLevel} the immediate return of my security deposit in the amount of **$${calculations.total.toFixed(2)}**, as required under ${stateData.citation}.

**Tenancy Details:** I was a tenant from ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}, moved out on ${formData.moveOutDate || '[MOVE OUT DATE]'}, and paid a security deposit of $${formData.securityDeposit || '0'}${formData.petDeposit ? ' plus a pet deposit of $' + formData.petDeposit : ''}.

**Legal Violation:** Under ${stateData.citation}, you were required to return my deposit${formData.itemizedStatementReceived !== 'not-received' ? ' or provide an itemized statement' : ''} within ${stateData.returnDeadline} days. As of today, ${calculations.daysPassed} days have passed${calculations.daysPassed > stateData.returnDeadline ? ', violating state law' : ''}.

${scenarioContent.length > 0 ? scenarioContent.join('\n\n') : ''}

${formData.itemizedStatementReceived === 'not-received' ? 
    `**No Itemization:** You failed to provide the required itemized statement, which forfeits your right to withhold any deposit under ${stateData.citation}.` : ''
}

${disputedText ? `**Disputed Deductions:** ${disputedText} These charges violate state law prohibiting deductions for normal wear and tear.` : ''}

**Amount Due:** Due to your non-compliance, you owe statutory penalties totaling **$${calculations.total.toFixed(2)}** (original deposit: $${calculations.deposits.toFixed(2)}${calculations.penalty > 0 ? `, penalty: $${calculations.penalty.toFixed(2)}` : ''}${calculations.interest > 0 ? `, interest: $${calculations.interest.toFixed(2)}` : ''}${formData.requestAttorneyFees ? ', plus attorney fees if legal action becomes necessary' : ''}).

**Demand:** You have ${formData.responseDeadline || 14} days from the date of this letter to pay **$${calculations.total.toFixed(2)}**.${formData.includeSmallClaimsThreat ? ` Failure to comply will result in a lawsuit seeking the full amount plus court costs and additional damages under ${stateData.citation}.` : ''}

${closingTone}

Sincerely,`;

        // Store clean text globally for eSignature use
        window.cleanLetterText = cleanText;
        
        // Return HTML version for preview (highlighting will be applied separately)
        return `
            <p>${today}</p>
            
            <p>${greeting}: ${formData.landlordName || '[LANDLORD NAME]'}${formData.landlordCompany ? '<br>' + formData.landlordCompany : ''}<br>
            ${formData.landlordAddress || '[LANDLORD ADDRESS]'}<br>
            ${formData.landlordCity || '[CITY]'}, ${formData.landlordState || 'CA'} ${formData.landlordZip || '[ZIP]'}</p>
            
            <p><strong>Re: Demand for Return of Security Deposit</strong><br>
            <strong>Tenant:</strong> ${formData.tenantName || '[TENANT NAME]'}<br>
            <strong>Property:</strong> ${formData.rentalAddress || '[RENTAL ADDRESS]'}${formData.rentalUnit ? ', Unit ' + formData.rentalUnit : ''}, ${formData.rentalCity || '[CITY]'}, ${formData.rentalState || 'CA'}</p>
            
            <p>${greeting} ${formData.landlordName || '[LANDLORD NAME]'},</p>
            
            <p>${urgencyLevel} the immediate return of my security deposit in the amount of <strong>$${calculations.total.toFixed(2)}</strong>, as required under ${stateData.citation}.</p>
            
            <p><strong>Tenancy Details:</strong> I was a tenant from ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}, moved out on ${formData.moveOutDate || '[MOVE OUT DATE]'}, and paid a security deposit of $${formData.totalDepositAmount || '0'}.</p>
            
            <p><strong>Legal Violation:</strong> Under ${stateData.citation}, you were required to return my deposit within ${stateData.returnDeadline} days. As of today, ${calculations.daysPassed} days have passed, violating state law.</p>
            
            ${scenarioContent.length > 0 ? scenarioContent.map(content => `<p>${content}</p>`).join('\n            ') : ''}
            
            ${whatHappenedText ? `<p><strong>What Happened:</strong> ${whatHappenedText}</p>` : ''}
            
            ${evidenceText ? `<p>${evidenceText}</p>` : ''}
            
            <p><strong>Amount Due:</strong> Due to your non-compliance, you owe statutory penalties totaling <strong>$${calculations.total.toFixed(2)}</strong> (original deposit: $${calculations.deposits.toFixed(2)}${calculations.penalty > 0 ? `, penalty: $${calculations.penalty.toFixed(2)}` : ''}${calculations.interest > 0 ? `, interest: $${calculations.interest.toFixed(2)}` : ''}${formData.requestAttorneyFees ? ', plus attorney fees if legal action becomes necessary' : ''}).</p>
            
            <p><strong>Demand:</strong> You have ${formData.responseDeadline || 14} days from the date of this letter to pay $${calculations.total.toFixed(2)}.${formData.includeSmallClaimsThreat ? ` Failure to comply will result in a lawsuit seeking the full amount plus court costs and additional damages under ${stateData.citation}.` : ''}</p>
            
            <p>${closingTone}</p>
            
            <p>Sincerely,</p>
        `;
    };

    // Step-by-step scenario system with mutual exclusivity
    const scenarios = [
        {
            id: 'complete-non-return',
            title: 'Complete Non-Return',
            description: 'Landlord has not returned any portion of my security deposit',
            situation: 'No deposit returned',
            mutuallyExclusive: ['partial-non-return'],
            stepByStepQuestions: [
                { field: 'totalDepositAmount', label: 'Total security deposit paid', type: 'number', required: true },
                { field: 'landlordJustifications', label: 'Did landlord provide any justifications?', type: 'radio', options: [
                    { value: 'no-response', label: 'No response/total silence' },
                    { value: 'verbal-only', label: 'Verbal explanations only' },
                    { value: 'written-reasons', label: 'Written justifications provided' }
                ]},
                { field: 'responseDeadline', label: 'Days to respond', type: 'number', default: 10 }
            ]
        },
        {
            id: 'partial-non-return',
            title: 'Partial Non-Return',
            description: 'Landlord returned some money but withheld the rest',
            situation: 'Partial withholding',
            mutuallyExclusive: ['complete-non-return'],
            stepByStepQuestions: [
                { field: 'totalDepositAmount', label: 'Total security deposit paid', type: 'number', required: true },
                { field: 'amountReturned', label: 'Amount returned to you', type: 'number', required: true },
                { field: 'landlordJustifications', label: 'What justifications did landlord provide?', type: 'radio', options: [
                    { value: 'no-itemization', label: 'No itemized statement provided' },
                    { value: 'inadequate-itemization', label: 'Vague/incomplete itemization' },
                    { value: 'disputed-charges', label: 'Detailed charges I want to dispute' }
                ]},
                { field: 'responseDeadline', label: 'Days to respond', type: 'number', default: 14 }
            ]
        },
        {
            id: 'excessive-charges',
            title: 'Excessive Charges',
            description: 'Landlord charged unreasonable amounts for wear, cleaning, or repairs',
            situation: 'Excessive or improper charges',
            mutuallyExclusive: [],
            stepByStepQuestions: [
                { field: 'totalDepositAmount', label: 'Total security deposit paid', type: 'number', required: true },
                { field: 'excessiveChargeAmount', label: 'Total amount of excessive charges', type: 'number', required: true },
                { field: 'excessiveChargeTypes', label: 'What types of excessive charges?', type: 'checkbox', options: [
                    { value: 'wear-tear-painting', label: 'Normal wear & tear - Painting/wall touch-ups' },
                    { value: 'wear-tear-carpet', label: 'Normal wear & tear - Carpet wear' },
                    { value: 'wear-tear-holes', label: 'Normal wear & tear - Small nail holes' },
                    { value: 'cleaning-professional', label: 'Excessive cleaning - Professional cleaning when not needed' },
                    { value: 'cleaning-carpet', label: 'Excessive cleaning - Full carpet replacement for minor stains' },
                    { value: 'repairs-minor', label: 'Excessive repairs - Minor maintenance charged as major repairs' },
                    { value: 'preexisting-damage', label: 'Pre-existing damage charges' }
                ]},
                { field: 'tenancyLength', label: 'How long did you live there?', type: 'radio', options: [
                    { value: 'under-1-year', label: 'Less than 1 year' },
                    { value: '1-3-years', label: '1-3 years' },
                    { value: 'over-3-years', label: 'More than 3 years' }
                ]},
                { field: 'propertyCondition', label: 'What was the condition when you moved out?', type: 'radio', options: [
                    { value: 'excellent', label: 'Excellent - professionally cleaned' },
                    { value: 'good', label: 'Good - normal cleaning done' },
                    { value: 'fair', label: 'Fair - some cleaning needed' }
                ]},
                { field: 'responseDeadline', label: 'Days to respond', type: 'number', default: 14 }
            ]
        },
        {
            id: 'no-itemization',
            title: 'No Itemization Provided',
            description: 'Landlord failed to provide required itemized statement of deductions',
            situation: 'Missing itemized statement',
            mutuallyExclusive: [],
            stepByStepQuestions: [
                { field: 'totalDepositAmount', label: 'Total security deposit paid', type: 'number', required: true },
                { field: 'amountReturned', label: 'Amount returned (if any)', type: 'number', required: false },
                { field: 'communicationAttempts', label: 'Have you contacted landlord about itemization?', type: 'radio', options: [
                    { value: 'no-contact', label: 'No, this is my first contact' },
                    { value: 'verbal-requests', label: 'Yes, requested verbally' },
                    { value: 'written-requests', label: 'Yes, requested in writing' }
                ]},
                { field: 'responseDeadline', label: 'Days to respond', type: 'number', default: 10 }
            ]
        }
    ];

    // Helper function to select/deselect scenarios with mutual exclusivity
    const toggleScenario = (scenarioId) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        const currentSelected = formData.selectedScenarios || [];
        const isCurrentlySelected = currentSelected.includes(scenarioId);
        
        let newSelected;
        
        if (isCurrentlySelected) {
            // Deselect scenario
            newSelected = currentSelected.filter(id => id !== scenarioId);
        } else {
            // Select scenario
            newSelected = [...currentSelected, scenarioId];
            
            // Handle mutual exclusivity - remove conflicting scenarios
            if (scenario && scenario.mutuallyExclusive) {
                scenario.mutuallyExclusive.forEach(exclusiveId => {
                    newSelected = newSelected.filter(id => id !== exclusiveId);
                });
            }
            
            // Also check if any existing scenarios exclude this new one
            scenarios.forEach(existingScenario => {
                if (existingScenario.mutuallyExclusive && 
                    existingScenario.mutuallyExclusive.includes(scenarioId) &&
                    newSelected.includes(existingScenario.id)) {
                    newSelected = newSelected.filter(id => id !== existingScenario.id);
                }
            });
        }
        
        updateFormData('selectedScenarios', newSelected);
    };

    // Tab content renderers
    const renderScenariosTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Your Situation'),
            
            // Letter tone selection (compact)
            React.createElement('div', { key: 'tone-section', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Letter Tone'),
                React.createElement('div', { key: 'tone-options', className: 'compact-radio-group' }, [
                    createClickableItem('radio', 'letterTone', 'professional', 'Professional', 'Respectful but clear', formData.letterTone === 'professional'),
                    createClickableItem('radio', 'letterTone', 'firm', 'Firm', 'Direct legal demands', formData.letterTone === 'firm'),
                    createClickableItem('radio', 'letterTone', 'litigation', 'Legal Warning', 'Strong litigation threats', formData.letterTone === 'litigation')
                ])
            ]),

            React.createElement('h4', { key: 'scenarios-title' }, 'What is your situation?'),
            React.createElement('div', { key: 'help-scenarios', className: 'help-text' }, 'Choose the scenario that best describes your situation. This will guide the rest of the questions.'),
            
            // Two main scenarios - radio selection (mutually exclusive)
            React.createElement('div', { key: 'main-scenarios', className: 'radio-group' }, [
                createClickableItem('radio', 'primaryScenario', 'complete-non-return', 'Complete Non-Return', 'Landlord has not returned any portion of my security deposit', formData.primaryScenario === 'complete-non-return'),
                createClickableItem('radio', 'primaryScenario', 'partial-non-return', 'Partial Non-Return', 'Landlord returned some money but withheld the rest improperly', formData.primaryScenario === 'partial-non-return')
            ]),
            
            // Progressive disclosure - Complete Non-Return questionnaire
            formData.primaryScenario === 'complete-non-return' ? 
                React.createElement('div', { key: 'complete-questions', className: 'step-by-step-questions' }, [
                    React.createElement('h5', { key: 'title' }, [
                        React.createElement(Icon, { key: 'icon', name: 'arrow-right' }),
                        'Complete Non-Return Details'
                    ]),
                    
                    // Deposit amount
                    React.createElement('div', { key: 'deposit-amount', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'Total security deposit paid'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'number',
                            step: '0.01',
                            value: formData.totalDepositAmount || '',
                            onChange: (e) => updateFormData('totalDepositAmount', e.target.value),
                            placeholder: '0.00'
                        })
                    ]),
                    
                    // Landlord communication
                    React.createElement('div', { key: 'communication', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'How has your landlord responded about the deposit?'),
                        React.createElement('div', { key: 'options', className: 'radio-options' }, [
                            React.createElement('div', { key: 'no-response', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'no-response',
                                    checked: formData.landlordCommunication === 'no-response',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'No response/total silence')
                            ]),
                            React.createElement('div', { key: 'verbal-only', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'verbal-only',
                                    checked: formData.landlordCommunication === 'verbal-only',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'Verbal explanations only')
                            ]),
                            React.createElement('div', { key: 'written-inadequate', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'written-inadequate',
                                    checked: formData.landlordCommunication === 'written-inadequate',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'Written justifications but inadequate')
                            ]),
                            React.createElement('div', { key: 'written-disputed', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'written-disputed',
                                    checked: formData.landlordCommunication === 'written-disputed',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'Written justifications that I dispute')
                            ])
                        ])
                    ]),
                    
                    // Show disputed charges if written-disputed is selected
                    formData.landlordCommunication === 'written-disputed' ?
                        React.createElement('div', { key: 'disputed-charges', className: 'question-item' }, [
                            React.createElement('label', { key: 'label' }, 'What charges do you dispute?'),
                            React.createElement('div', { key: 'charges', className: 'checkbox-grid' }, [
                                'normal-wear-painting', 'normal-wear-carpet', 'normal-wear-holes', 
                                'excessive-cleaning', 'pre-existing-damage', 'improper-repairs'
                            ].map(charge => {
                                const currentCharges = formData.disputedCharges || [];
                                const isChecked = currentCharges.includes(charge);
                                const labels = {
                                    'normal-wear-painting': 'Normal wear - Painting/wall touch-ups',
                                    'normal-wear-carpet': 'Normal wear - Carpet wear',
                                    'normal-wear-holes': 'Normal wear - Small nail holes',
                                    'excessive-cleaning': 'Excessive cleaning fees',
                                    'pre-existing-damage': 'Pre-existing damage',
                                    'improper-repairs': 'Improper repair charges'
                                };
                                
                                return React.createElement('div', { 
                                    key: charge, 
                                    className: `checkbox-item ${isChecked ? 'selected' : ''}`,
                                    onClick: () => {
                                        const newCharges = isChecked 
                                            ? currentCharges.filter(c => c !== charge)
                                            : [...currentCharges, charge];
                                        updateFormData('disputedCharges', newCharges);
                                    }
                                }, [
                                    React.createElement('input', {
                                        key: 'checkbox',
                                        type: 'checkbox',
                                        checked: isChecked,
                                        onChange: () => {}
                                    }),
                                    React.createElement('div', { key: 'content', className: 'checkbox-content' }, [
                                        React.createElement('strong', { key: 'title' }, labels[charge])
                                    ])
                                ]);
                            }))
                        ]) : null
                ]) : null,
                
            // Progressive disclosure - Partial Non-Return questionnaire  
            formData.primaryScenario === 'partial-non-return' ?
                React.createElement('div', { key: 'partial-questions', className: 'step-by-step-questions' }, [
                    React.createElement('h5', { key: 'title' }, [
                        React.createElement(Icon, { key: 'icon', name: 'arrow-right' }),
                        'Partial Non-Return Details'
                    ]),
                    
                    // Deposit amounts
                    React.createElement('div', { key: 'amounts', className: 'form-row' }, [
                        React.createElement('div', { key: 'total', className: 'question-item' }, [
                            React.createElement('label', { key: 'label' }, 'Total security deposit paid'),
                            React.createElement('input', {
                                key: 'input',
                                type: 'number',
                                step: '0.01',
                                value: formData.totalDepositAmount || '',
                                onChange: (e) => updateFormData('totalDepositAmount', e.target.value),
                                placeholder: '0.00'
                            })
                        ]),
                        React.createElement('div', { key: 'returned', className: 'question-item' }, [
                            React.createElement('label', { key: 'label' }, 'Amount returned to you'),
                            React.createElement('input', {
                                key: 'input',
                                type: 'number',
                                step: '0.01',
                                value: formData.amountReturned || '',
                                onChange: (e) => updateFormData('amountReturned', e.target.value),
                                placeholder: '0.00'
                            })
                        ])
                    ]),
                    
                    // Landlord justifications for partial
                    React.createElement('div', { key: 'partial-communication', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'What justifications did landlord provide for withholding money?'),
                        React.createElement('div', { key: 'options', className: 'radio-options' }, [
                            React.createElement('div', { key: 'no-itemization', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'no-itemization',
                                    checked: formData.landlordCommunication === 'no-itemization',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'No itemized statement provided')
                            ]),
                            React.createElement('div', { key: 'inadequate-itemization', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'inadequate-itemization',
                                    checked: formData.landlordCommunication === 'inadequate-itemization',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'Vague/incomplete itemization')
                            ]),
                            React.createElement('div', { key: 'disputed-charges', className: 'radio-option' }, [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'radio',
                                    name: 'landlordCommunication',
                                    value: 'disputed-charges',
                                    checked: formData.landlordCommunication === 'disputed-charges',
                                    onChange: (e) => updateFormData('landlordCommunication', e.target.value)
                                }),
                                React.createElement('label', { key: 'label' }, 'Detailed charges I want to dispute')
                            ])
                        ])
                    ]),
                    
                    // Show disputed charges for partial non-return if selected
                    formData.landlordCommunication === 'disputed-charges' ?
                        React.createElement('div', { key: 'partial-disputed-charges', className: 'question-item' }, [
                            React.createElement('label', { key: 'label' }, 'What charges do you dispute?'),
                            React.createElement('div', { key: 'charges', className: 'checkbox-grid' }, [
                                'normal-wear-painting', 'normal-wear-carpet', 'normal-wear-holes', 
                                'excessive-cleaning', 'pre-existing-damage', 'improper-repairs'
                            ].map(charge => {
                                const currentCharges = formData.disputedCharges || [];
                                const isChecked = currentCharges.includes(charge);
                                const labels = {
                                    'normal-wear-painting': 'Normal wear - Painting/wall touch-ups',
                                    'normal-wear-carpet': 'Normal wear - Carpet wear', 
                                    'normal-wear-holes': 'Normal wear - Small nail holes',
                                    'excessive-cleaning': 'Excessive cleaning fees',
                                    'pre-existing-damage': 'Pre-existing damage',
                                    'improper-repairs': 'Improper repair charges'
                                };
                                
                                return React.createElement('div', { 
                                    key: charge, 
                                    className: `checkbox-item ${isChecked ? 'selected' : ''}`,
                                    onClick: () => {
                                        const newCharges = isChecked 
                                            ? currentCharges.filter(c => c !== charge)
                                            : [...currentCharges, charge];
                                        updateFormData('disputedCharges', newCharges);
                                    }
                                }, [
                                    React.createElement('input', {
                                        key: 'checkbox',
                                        type: 'checkbox',
                                        checked: isChecked,
                                        onChange: () => {}
                                    }),
                                    React.createElement('div', { key: 'content', className: 'checkbox-content' }, [
                                        React.createElement('strong', { key: 'title' }, labels[charge])
                                    ])
                                ]);
                            }))
                        ]) : null
                ]) : null,
                
            // Evidence section (shows for both scenarios if one is selected)
            formData.primaryScenario ?
                React.createElement('div', { key: 'evidence-section', className: 'step-by-step-questions' }, [
                    React.createElement('h5', { key: 'title' }, [
                        React.createElement(Icon, { key: 'icon', name: 'file-text' }),
                        'Evidence Available'
                    ]),
                    
                    React.createElement('div', { key: 'evidence-types', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'What evidence do you have to support your claim?'),
                        React.createElement('div', { key: 'evidence', className: 'checkbox-grid' }, [
                            'photos', 'receipts', 'communications', 'witnesses', 'inspection', 'cleaning'
                        ].map(evidence => {
                            const currentEvidence = formData.evidenceTypes || [];
                            const isChecked = currentEvidence.includes(evidence);
                            const labels = {
                                'photos': 'Move-in/move-out photos',
                                'receipts': 'Payment receipts and records',
                                'communications': 'Written communications',
                                'witnesses': 'Witness statements',
                                'inspection': 'Inspection reports',
                                'cleaning': 'Professional cleaning receipts'
                            };
                            
                            return React.createElement('div', { 
                                key: evidence, 
                                className: `checkbox-item ${isChecked ? 'selected' : ''}`,
                                onClick: () => {
                                    const newEvidence = isChecked 
                                        ? currentEvidence.filter(e => e !== evidence)
                                        : [...currentEvidence, evidence];
                                    updateFormData('evidenceTypes', newEvidence);
                                }
                            }, [
                                React.createElement('input', {
                                    key: 'checkbox',
                                    type: 'checkbox',
                                    checked: isChecked,
                                    onChange: () => {}
                                }),
                                React.createElement('div', { key: 'content', className: 'checkbox-content' }, [
                                    React.createElement('strong', { key: 'title' }, labels[evidence])
                                ])
                            ]);
                        }))
                    ]),
                    
                    // Additional evidence details
                    React.createElement('div', { key: 'evidence-details', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'Additional evidence details (optional)'),
                        React.createElement('textarea', {
                            key: 'textarea',
                            value: formData.evidenceDetails || '',
                            onChange: (e) => updateFormData('evidenceDetails', e.target.value),
                            placeholder: 'Describe any additional evidence or details that strengthen your case...',
                            rows: 3
                        })
                    ])
                ]) : null
        ]);
    };

    const renderPropertyTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Property & Tenancy Details'),
            
            React.createElement('h4', { key: 'tenant-info' }, 'Tenant Information'),
            
            React.createElement('div', { key: 'tenant-name', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Tenant Name(s)'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.tenantName,
                    onChange: (e) => updateFormData('tenantName', e.target.value),
                    placeholder: 'Full name(s) of tenant(s)'
                })
            ]),
            
            React.createElement('div', { key: 'tenant-address', className: 'form-row' }, [
                React.createElement('div', { key: 'address', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Current Address'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.tenantCurrentAddress,
                        onChange: (e) => updateFormData('tenantCurrentAddress', e.target.value),
                        placeholder: 'Current street address'
                    })
                ]),
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.tenantCity,
                        onChange: (e) => updateFormData('tenantCity', e.target.value),
                        placeholder: 'City'
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'tenant-state', className: 'form-row' }, [
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.tenantState,
                        onChange: (e) => updateFormData('tenantState', e.target.value)
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ]),
                React.createElement('div', { key: 'zip', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'ZIP Code'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.tenantZip,
                        onChange: (e) => updateFormData('tenantZip', e.target.value),
                        placeholder: 'ZIP'
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'rental-info' }, 'Rental Property Information'),
            
            React.createElement('div', { key: 'rental-address', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Rental Property Address'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.rentalAddress,
                    onChange: (e) => updateFormData('rentalAddress', e.target.value),
                    placeholder: 'Street address of rental property'
                })
            ]),
            
            React.createElement('div', { key: 'rental-details', className: 'form-row' }, [
                React.createElement('div', { key: 'unit', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Unit Number (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.rentalUnit,
                        onChange: (e) => updateFormData('rentalUnit', e.target.value),
                        placeholder: 'Apt/Unit #'
                    })
                ]),
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.rentalCity,
                        onChange: (e) => updateFormData('rentalCity', e.target.value),
                        placeholder: 'City'
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'rental-state', className: 'form-row' }, [
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State (determines legal requirements)'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.rentalState,
                        onChange: (e) => updateFormData('rentalState', e.target.value)
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ]),
                React.createElement('div', { key: 'zip', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'ZIP Code'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.rentalZip,
                        onChange: (e) => updateFormData('rentalZip', e.target.value),
                        placeholder: 'ZIP'
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'dates-info' }, 'Important Dates'),
            
            React.createElement('div', { key: 'lease-dates', className: 'form-row' }, [
                React.createElement('div', { key: 'start', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Lease Start Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.leaseStartDate,
                        onChange: (e) => updateFormData('leaseStartDate', e.target.value)
                    })
                ]),
                React.createElement('div', { key: 'end', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Lease End Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.leaseEndDate,
                        onChange: (e) => updateFormData('leaseEndDate', e.target.value)
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'moveout-dates', className: 'form-row' }, [
                React.createElement('div', { key: 'moveout', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Move-Out Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.moveOutDate,
                        onChange: (e) => updateFormData('moveOutDate', e.target.value)
                    }),
                    React.createElement('div', { key: 'help', className: 'help-text' }, 'Used to calculate deadline violations')
                ]),
                React.createElement('div', { key: 'keys', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Key Return Date (if different)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.keyReturnDate,
                        onChange: (e) => updateFormData('keyReturnDate', e.target.value)
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'landlord-info' }, 'Landlord Information'),
            
            React.createElement('div', { key: 'landlord-names', className: 'form-row' }, [
                React.createElement('div', { key: 'name', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Landlord Name'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordName,
                        onChange: (e) => updateFormData('landlordName', e.target.value),
                        placeholder: 'Full name of landlord/property manager'
                    })
                ]),
                React.createElement('div', { key: 'company', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Company/Property Management (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordCompany,
                        onChange: (e) => updateFormData('landlordCompany', e.target.value),
                        placeholder: 'Company name'
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'landlord-contact', className: 'form-row' }, [
                React.createElement('div', { key: 'email', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Landlord Email (for eSign)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'email',
                        value: formData.landlordEmail,
                        onChange: (e) => updateFormData('landlordEmail', e.target.value),
                        placeholder: 'landlord@example.com'
                    }),
                    React.createElement('div', { key: 'help', className: 'help-text' }, 'Optional - for electronic signature delivery')
                ])
            ]),
            
            React.createElement('div', { key: 'landlord-address', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Landlord Mailing Address'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.landlordAddress,
                    onChange: (e) => updateFormData('landlordAddress', e.target.value),
                    placeholder: 'Street address'
                })
            ]),
            
            React.createElement('div', { key: 'landlord-location', className: 'form-row' }, [
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordCity,
                        onChange: (e) => updateFormData('landlordCity', e.target.value),
                        placeholder: 'City'
                    })
                ]),
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.landlordState,
                        onChange: (e) => updateFormData('landlordState', e.target.value)
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ]),
                React.createElement('div', { key: 'zip', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'ZIP Code'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordZip,
                        onChange: (e) => updateFormData('landlordZip', e.target.value),
                        placeholder: 'ZIP'
                    })
                ])
            ])
        ]);
    };

    const renderDepositsTab = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        const calculations = stateData ? window.StateLawUtils.calculateTotalDemand(formData, state) : null;

        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Deposit & Deductions'),
            
            React.createElement('h4', { key: 'deposits-title' }, 'Security Deposits Paid'),
            
            React.createElement('div', { key: 'deposit-amounts', className: 'form-row' }, [
                React.createElement('div', { key: 'security', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Security Deposit Amount'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: formData.securityDeposit,
                        onChange: (e) => updateFormData('securityDeposit', e.target.value),
                        placeholder: '0.00'
                    })
                ]),
                React.createElement('div', { key: 'pet', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Pet Deposit (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: formData.petDeposit,
                        onChange: (e) => updateFormData('petDeposit', e.target.value),
                        placeholder: '0.00'
                    })
                ]),
                React.createElement('div', { key: 'cleaning', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Cleaning Deposit (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: formData.cleaningDeposit,
                        onChange: (e) => updateFormData('cleaningDeposit', e.target.value),
                        placeholder: '0.00'
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'itemization-title' }, 'Itemized Statement Status'),
            
            React.createElement('div', { key: 'itemization', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Have you received an itemized statement of deductions?'),
                React.createElement('div', { key: 'radio-group', className: 'radio-group' }, [
                    createClickableItem('radio', 'itemizedStatementReceived', 'not-received', 'No Statement Received', 'Landlord has not provided any itemization (strongest legal position)', formData.itemizedStatementReceived === 'not-received'),
                    createClickableItem('radio', 'itemizedStatementReceived', 'inadequate', 'Inadequate Statement', 'Statement lacks required details or supporting documentation', formData.itemizedStatementReceived === 'inadequate'),
                    createClickableItem('radio', 'itemizedStatementReceived', 'disputed', 'Statement Received but Disputed', 'Statement contains improper or excessive charges', formData.itemizedStatementReceived === 'disputed')
                ])
            ]),
            
            formData.itemizedStatementReceived !== 'not-received' ? 
                React.createElement('div', { key: 'statement-date', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Date Statement Received'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.itemizedStatementDate,
                        onChange: (e) => updateFormData('itemizedStatementDate', e.target.value)
                    })
                ]) : null,
            
            React.createElement('h4', { key: 'deductions-title' }, 'Disputed Deductions'),
            React.createElement('p', { key: 'deductions-desc' }, 'Select all improper deductions from your security deposit:'),
            
            React.createElement('div', { key: 'deductions-grid', className: 'checkbox-grid' }, [
                createClickableItem('checkbox', 'normalWearCharges', null, 'Normal Wear and Tear Charges', 'Charges for normal deterioration from intended use', formData.normalWearCharges),
                createClickableItem('checkbox', 'excessiveCleaningFees', null, 'Excessive Cleaning Fees', 'Unreasonable or inflated cleaning charges', formData.excessiveCleaningFees),
                createClickableItem('checkbox', 'paintingCosts', null, 'Painting Costs', 'Repainting for normal wear or cosmetic purposes', formData.paintingCosts),
                createClickableItem('checkbox', 'carpetReplacement', null, 'Carpet Replacement', 'Carpet replacement due to normal wear', formData.carpetReplacement),
                createClickableItem('checkbox', 'unpaidRentDisputes', null, 'Disputed Unpaid Rent', 'Claims for rent that was actually paid', formData.unpaidRentDisputes),
                createClickableItem('checkbox', 'keyReplacement', null, 'Key Replacement Charges', 'Excessive charges for key replacement', formData.keyReplacement),
                createClickableItem('checkbox', 'preexistingDamage', null, 'Pre-existing Damage', 'Charges for damage that existed before tenancy', formData.preexistingDamage),
                createClickableItem('checkbox', 'otherDeductions', null, 'Other Improper Deductions', 'Specify other disputed charges', formData.otherDeductions)
            ]),
            
            formData.otherDeductions ?
                React.createElement('div', { key: 'other-text', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Describe Other Disputed Deductions'),
                    React.createElement('textarea', {
                        key: 'textarea',
                        value: formData.otherDeductionsText,
                        onChange: (e) => updateFormData('otherDeductionsText', e.target.value),
                        placeholder: 'Describe the specific deductions you dispute and why they are improper...',
                        rows: 3
                    })
                ]) : null,
            
            stateData ?
                React.createElement('div', { key: 'state-info', className: 'info-box' }, [
                    React.createElement('h4', { key: 'title' }, `${stateData.state} Law Summary`),
                    React.createElement('ul', { key: 'list' }, [
                        React.createElement('li', { key: 'deadline' }, `Return deadline: ${stateData.returnDeadline} days`),
                        React.createElement('li', { key: 'penalty' }, `Penalty for violation: ${stateData.penaltyDescription}`),
                        stateData.interestRequired ? 
                            React.createElement('li', { key: 'interest' }, `Interest required: ${stateData.interestRate}`) : null,
                        React.createElement('li', { key: 'small-claims' }, `Small claims limit: $${stateData.smallClaimsLimit.toLocaleString()}`)
                    ])
                ]) : null,
            
            calculations ?
                React.createElement('div', { key: 'calculations', className: 'calculation-summary' }, [
                    React.createElement('h4', { key: 'title' }, 'Demand Calculation'),
                    React.createElement('div', { key: 'original', className: 'calculation-row' }, [
                        React.createElement('span', { key: 'label' }, 'Total Deposits Paid:'),
                        React.createElement('span', { key: 'amount' }, `$${calculations.deposits.toFixed(2)}`)
                    ]),
                    calculations.penalty > 0 ?
                        React.createElement('div', { key: 'penalty', className: 'calculation-row' }, [
                            React.createElement('span', { key: 'label' }, 'Statutory Penalty:'),
                            React.createElement('span', { key: 'amount' }, `$${calculations.penalty.toFixed(2)}`)
                        ]) : null,
                    calculations.interest > 0 ?
                        React.createElement('div', { key: 'interest', className: 'calculation-row' }, [
                            React.createElement('span', { key: 'label' }, 'Interest:'),
                            React.createElement('span', { key: 'amount' }, `$${calculations.interest.toFixed(2)}`)
                        ]) : null,
                    React.createElement('div', { key: 'total', className: 'calculation-row total' }, [
                        React.createElement('span', { key: 'label' }, 'Total Demand Amount:'),
                        React.createElement('strong', { key: 'amount' }, `$${calculations.total.toFixed(2)}`)
                    ]),
                    calculations.daysPassed > 0 ?
                        React.createElement('div', { key: 'warning', className: 'warning' }, 
                            `⚠️ ${calculations.daysPassed} days past deadline - statutory penalties apply`
                        ) : null
                ]) : null
        ]);
    };

    const renderViolationsTab = () => {
        const state = formData.rentalState;
        const riskAssessment = window.StateLawUtils ? window.StateLawUtils.getRiskAssessment(formData, state) : null;

        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Legal Violations & Evidence'),
            
            React.createElement('h4', { key: 'communications-title' }, 'Prior Communications'),
            
            React.createElement('div', { key: 'prior-comms', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.priorCommunications,
                        onChange: (e) => updateFormData('priorCommunications', e.target.checked)
                    }),
                    ' I have previously contacted the landlord about this matter'
                ])
            ]),
            
            formData.priorCommunications ?
                React.createElement('div', { key: 'comms-desc', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Describe Previous Communications'),
                    React.createElement('textarea', {
                        key: 'textarea',
                        value: formData.priorCommunicationsDescription,
                        onChange: (e) => updateFormData('priorCommunicationsDescription', e.target.value),
                        placeholder: 'Describe when and how you contacted the landlord, their response (if any), and any other relevant communications...',
                        rows: 4
                    })
                ]) : null,
            
            React.createElement('h4', { key: 'evidence-title' }, 'Available Evidence'),
            React.createElement('p', { key: 'evidence-desc' }, 'Select all evidence you have to support your claim:'),
            
            React.createElement('div', { key: 'evidence-grid', className: 'checkbox-grid' }, [
                createClickableItem('checkbox', 'evidenceMoveInPhotos', null, 'Move-in/Move-out Photos', 'Photos documenting property condition', formData.evidenceMoveInPhotos),
                createClickableItem('checkbox', 'evidenceReceipts', null, 'Receipts & Payment Records', 'Proof of deposit payment and rent payments', formData.evidenceReceipts),
                createClickableItem('checkbox', 'evidenceCommunications', null, 'Written Communications', 'Emails, texts, letters with landlord', formData.evidenceCommunications),
                createClickableItem('checkbox', 'evidenceWitnesses', null, 'Witness Statements', 'Third-party witnesses to condition/events', formData.evidenceWitnesses),
                createClickableItem('checkbox', 'evidenceInspectionReport', null, 'Inspection Reports', 'Official move-in/move-out inspection documents', formData.evidenceInspectionReport),
                createClickableItem('checkbox', 'evidenceOther', null, 'Other Evidence', 'Specify other supporting documentation', formData.evidenceOther)
            ]),
            
            formData.evidenceOther ?
                React.createElement('div', { key: 'other-evidence', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Describe Other Evidence'),
                    React.createElement('textarea', {
                        key: 'textarea',
                        value: formData.evidenceOtherText,
                        onChange: (e) => updateFormData('evidenceOtherText', e.target.value),
                        placeholder: 'Describe any other evidence you have to support your claim...',
                        rows: 3
                    })
                ]) : null,
            
        ]);
    };

    const renderAssessmentTab = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        const calculations = stateData ? window.StateLawUtils.calculateTotalDemand(formData, state) : null;
        const riskAssessment = stateData ? window.StateLawUtils.getRiskAssessment(formData, state) : null;

        // Detailed case analysis based on user input
        const analyzeCase = () => {
            let strengths = [];
            let weaknesses = [];
            let recommendations = [];

            if (calculations && calculations.daysPassed > 0) {
                strengths.push(`Landlord missed legal deadline by ${calculations.daysPassed} days`);
                if (calculations.daysPassed > 30) {
                    strengths.push('Significant delay strengthens penalty claims');
                }
            }

            if (formData.itemizedStatementReceived === 'not-received') {
                strengths.push('No itemization provided - forfeits landlord\'s right to withhold');
                strengths.push('Strongest legal position under state law');
            }

            if (formData.evidenceMoveInPhotos) {
                strengths.push('Move-in photos provide strong evidence of property condition');
            }

            if (formData.evidenceReceipts) {
                strengths.push('Payment records prove deposit was actually paid');
            }

            if (formData.normalWearCharges) {
                strengths.push('Normal wear charges are illegal under state law');
            }

            // Check for potential weaknesses
            if (!formData.moveOutDate) {
                weaknesses.push('Move-out date not specified - needed to calculate violations');
            }

            if (!formData.securityDeposit) {
                weaknesses.push('Security deposit amount not specified');
            }

            if (!formData.evidenceMoveInPhotos && !formData.evidenceReceipts) {
                weaknesses.push('Limited documentation could weaken case');
                recommendations.push('Gather any available photos, receipts, or records');
            }

            if (formData.priorCommunications && !formData.priorCommunicationsDescription) {
                recommendations.push('Document previous communications in detail');
            }

            return { strengths, weaknesses, recommendations };
        };

        const caseAnalysis = analyzeCase();

        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Legal Case Assessment'),
            React.createElement('p', { key: 'subtitle' }, 'Analysis of your security deposit case based on your specific situation:'),
            
            // Overall case strength
            riskAssessment ?
                React.createElement('div', { key: 'risk-assessment', className: `risk-assessment ${riskAssessment.color}` }, [
                    React.createElement('h4', { key: 'title' }, `Case Strength: ${riskAssessment.level.toUpperCase()}`),
                    React.createElement('div', { key: 'details', className: 'assessment-details' }, [
                        React.createElement('div', { key: 'score', className: 'assessment-item' }, 
                            React.createElement('strong', null, `Strength Score: ${riskAssessment.score}/6`)
                        ),
                        React.createElement('div', { key: 'recommendation', className: 'assessment-item' }, 
                            React.createElement('strong', null, riskAssessment.recommendation)
                        )
                    ])
                ]) : null,

            // Detailed financial analysis
            calculations ?
                React.createElement('div', { key: 'financial-analysis', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, 'Financial Analysis'),
                    React.createElement('div', { key: 'calculations', className: 'calculation-summary' }, [
                        React.createElement('div', { key: 'deposits', className: 'calculation-row' }, [
                            React.createElement('span', { key: 'label' }, 'Original Deposits:'),
                            React.createElement('span', { key: 'amount' }, `$${calculations.deposits.toFixed(2)}`)
                        ]),
                        calculations.penalty > 0 ?
                            React.createElement('div', { key: 'penalty', className: 'calculation-row' }, [
                                React.createElement('span', { key: 'label' }, 'Statutory Penalties:'),
                                React.createElement('span', { key: 'amount' }, `$${calculations.penalty.toFixed(2)}`)
                            ]) : null,
                        calculations.interest > 0 ?
                            React.createElement('div', { key: 'interest', className: 'calculation-row' }, [
                                React.createElement('span', { key: 'label' }, 'Interest:'),
                                React.createElement('span', { key: 'amount' }, `$${calculations.interest.toFixed(2)}`)
                            ]) : null,
                        React.createElement('div', { key: 'total', className: 'calculation-row total' }, [
                            React.createElement('span', { key: 'label' }, 'Total Recovery Potential:'),
                            React.createElement('strong', { key: 'amount' }, `$${calculations.total.toFixed(2)}`)
                        ])
                    ])
                ]) : null,

            // Case strengths
            caseAnalysis.strengths.length > 0 ?
                React.createElement('div', { key: 'strengths', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '✅ Case Strengths'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list strengths' }, 
                        caseAnalysis.strengths.map((strength, index) => 
                            React.createElement('li', { key: index }, strength)
                        )
                    )
                ]) : null,

            // Case weaknesses
            caseAnalysis.weaknesses.length > 0 ?
                React.createElement('div', { key: 'weaknesses', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '⚠️ Potential Issues'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list weaknesses' }, 
                        caseAnalysis.weaknesses.map((weakness, index) => 
                            React.createElement('li', { key: index }, weakness)
                        )
                    )
                ]) : null,

            // Recommendations
            caseAnalysis.recommendations.length > 0 ?
                React.createElement('div', { key: 'recommendations', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '💡 General Suggestions'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list recommendations' }, 
                        caseAnalysis.recommendations.map((rec, index) => 
                            React.createElement('li', { key: index }, rec)
                        )
                    )
                ]) : null,

            // State-specific insights
            stateData ?
                React.createElement('div', { key: 'state-specifics', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, `${stateData.state} Law Specifics`),
                    React.createElement('div', { key: 'content', className: 'state-details' }, [
                        React.createElement('p', { key: 'citation' }, [
                            React.createElement('strong', null, 'Governing Law: '),
                            React.createElement('span', { className: 'legal-citation' }, stateData.citation)
                        ]),
                        React.createElement('p', { key: 'deadline' }, [
                            React.createElement('strong', null, 'Return Deadline: '),
                            `${stateData.returnDeadline} days from tenancy termination`
                        ]),
                        React.createElement('p', { key: 'penalty' }, [
                            React.createElement('strong', null, 'Violation Penalty: '),
                            stateData.penaltyDescription
                        ]),
                        React.createElement('p', { key: 'small-claims' }, [
                            React.createElement('strong', null, 'Small Claims Limit: '),
                            `$${stateData.smallClaimsLimit.toLocaleString()}`
                        ])
                    ])
                ]) : null,

            // Next steps
            React.createElement('div', { key: 'next-steps', className: 'next-steps' }, [
                React.createElement('h4', { key: 'title' }, 'Recommended Next Steps'),
                React.createElement('ol', { key: 'list' }, [
                    React.createElement('li', { key: 'review' }, 'Review the generated demand letter carefully'),
                    React.createElement('li', { key: 'send' }, 'Send via email and certified mail for maximum legal protection'),
                    React.createElement('li', { key: 'wait' }, `Wait ${formData.responseDeadline || 14} days for landlord response`),
                    React.createElement('li', { key: 'file' }, 'If no response, file in small claims court immediately'),
                    React.createElement('li', { key: 'attorney' }, 'Consider consulting an attorney if damages exceed small claims limit')
                ])
            ]),
            
            React.createElement('div', { key: 'disclaimer', className: 'disclaimer' }, [
                React.createElement('p', { key: 'text' }, 
                    '⚖️ This assessment is based on general legal principles and your provided information. ' +
                    'For complex cases or significant amounts, consult with a qualified attorney in your jurisdiction.'
                )
            ])
        ]);
    };


    // Simplified details tab for essential info not covered in progressive disclosure
    const renderDetailsTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Essential Details'),
            React.createElement('div', { key: 'help', className: 'help-text' }, 'Fill in the remaining details needed for your demand letter.'),
            
            React.createElement('h4', { key: 'tenant-info' }, 'Your Information'),
            
            React.createElement('div', { key: 'tenant-name', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Your Full Name'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.tenantName || '',
                    onChange: (e) => updateFormData('tenantName', e.target.value),
                    placeholder: 'Your full legal name'
                })
            ]),
            
            React.createElement('h4', { key: 'landlord-info' }, 'Landlord Information'),
            
            React.createElement('div', { key: 'landlord-details', className: 'form-row' }, [
                React.createElement('div', { key: 'name', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Landlord Name'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordName || '',
                        onChange: (e) => updateFormData('landlordName', e.target.value),
                        placeholder: 'Landlord full name'
                    })
                ]),
                React.createElement('div', { key: 'company', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Company (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordCompany || '',
                        onChange: (e) => updateFormData('landlordCompany', e.target.value),
                        placeholder: 'Property management company'
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'landlord-address', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Landlord Mailing Address'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.landlordAddress || '',
                    onChange: (e) => updateFormData('landlordAddress', e.target.value),
                    placeholder: 'Street address'
                })
            ]),
            
            React.createElement('div', { key: 'landlord-location', className: 'form-row' }, [
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordCity || '',
                        onChange: (e) => updateFormData('landlordCity', e.target.value),
                        placeholder: 'City'
                    })
                ]),
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.landlordState || 'CA',
                        onChange: (e) => updateFormData('landlordState', e.target.value)
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ]),
                React.createElement('div', { key: 'zip', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'ZIP Code'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.landlordZip || '',
                        onChange: (e) => updateFormData('landlordZip', e.target.value),
                        placeholder: 'ZIP'
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'rental-info' }, 'Rental Property'),
            
            React.createElement('div', { key: 'rental-address', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Rental Property Address'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.rentalAddress || '',
                    onChange: (e) => updateFormData('rentalAddress', e.target.value),
                    placeholder: 'Street address of rental property'
                })
            ]),
            
            React.createElement('div', { key: 'rental-details', className: 'form-row' }, [
                React.createElement('div', { key: 'unit', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Unit (if applicable)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.rentalUnit || '',
                        onChange: (e) => updateFormData('rentalUnit', e.target.value),
                        placeholder: 'Apt/Unit #'
                    })
                ]),
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.rentalCity || '',
                        onChange: (e) => updateFormData('rentalCity', e.target.value),
                        placeholder: 'City'
                    })
                ]),
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.rentalState || 'CA',
                        onChange: (e) => updateFormData('rentalState', e.target.value)
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ])
            ]),
            
            React.createElement('h4', { key: 'dates-info' }, 'Important Dates'),
            
            React.createElement('div', { key: 'lease-dates', className: 'form-row' }, [
                React.createElement('div', { key: 'start', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Lease Start Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.leaseStartDate || '',
                        onChange: (e) => updateFormData('leaseStartDate', e.target.value)
                    })
                ]),
                React.createElement('div', { key: 'end', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Lease End Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.leaseEndDate || '',
                        onChange: (e) => updateFormData('leaseEndDate', e.target.value)
                    })
                ]),
                React.createElement('div', { key: 'moveout', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Move-Out Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.moveOutDate || '',
                        onChange: (e) => updateFormData('moveOutDate', e.target.value)
                    })
                ])
            ]),
            
            React.createElement('h4', { key: 'response-info' }, 'Response Preferences'),
            
            React.createElement('div', { key: 'response-details', className: 'form-row' }, [
                React.createElement('div', { key: 'deadline', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Days to respond'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        min: '7',
                        max: '30',
                        value: formData.responseDeadline || 14,
                        onChange: (e) => updateFormData('responseDeadline', e.target.value)
                    })
                ]),
                React.createElement('div', { key: 'threats', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Include legal threats'),
                    React.createElement('div', { key: 'checkbox' }, [
                        React.createElement('input', {
                            key: 'input',
                            type: 'checkbox',
                            checked: formData.includeSmallClaimsThreat || false,
                            onChange: (e) => updateFormData('includeSmallClaimsThreat', e.target.checked)
                        }),
                        React.createElement('span', { key: 'text' }, ' Mention small claims court lawsuit')
                    ])
                ])
            ])
        ]);
    };

    // Main tab content renderer
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: return renderScenariosTab();
            case 1: return renderDetailsTab();
            default: return renderScenariosTab();
        }
    };

    // Render main component
    return React.createElement('div', { className: 'app-container' }, [
        // Header
        React.createElement('header', { key: 'header', className: 'app-header' }, [
            React.createElement('h1', { key: 'title' }, 'Tenant Security Deposit Demand Letter Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Generate professional demand letters with state-specific legal requirements')
        ]),
        
        // Main container
        React.createElement('div', { key: 'main', className: 'main-container' }, [
            // Form pane
            React.createElement('div', { key: 'form', className: 'form-pane' }, [
                // Tab navigation
                React.createElement('div', { key: 'tabs', className: 'tab-navigation' },
                    tabs.map((tab, index) => 
                        React.createElement('button', {
                            key: tab.id,
                            className: `tab-button ${currentTab === index ? 'active' : ''}`,
                            onClick: () => setCurrentTab(index)
                        }, [
                            React.createElement(Icon, { key: 'icon', name: tab.icon }),
                            React.createElement('span', { key: 'label' }, tab.label)
                        ])
                    )
                ),
                
                // Tab content
                React.createElement('div', { key: 'content', className: 'tab-content-container' },
                    renderTabContent()
                ),
                
                // Action buttons with navigation
                React.createElement('div', { key: 'actions', className: 'action-buttons' }, [
                    // Navigation buttons on the left
                    React.createElement('div', { key: 'navigation', className: 'nav-buttons' }, [
                        React.createElement('button', {
                            key: 'prev-tab',
                            className: 'btn btn-secondary',
                            disabled: currentTab === 0,
                            onClick: () => setCurrentTab(Math.max(0, currentTab - 1))
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'chevron-left' }),
                            React.createElement('span', { key: 'text' }, 'Previous')
                        ]),
                        React.createElement('button', {
                            key: 'next-tab',
                            className: 'btn btn-primary',
                            disabled: currentTab === tabs.length - 1,
                            onClick: () => setCurrentTab(Math.min(tabs.length - 1, currentTab + 1))
                        }, [
                            React.createElement('span', { key: 'text' }, 'Next'),
                            React.createElement(Icon, { key: 'icon', name: 'chevron-right' })
                        ])
                    ]),
                    
                    // Action buttons on the right
                    React.createElement('div', { key: 'document-actions', className: 'doc-buttons' }, [
                        React.createElement('button', {
                            key: 'copy',
                            className: 'btn btn-secondary',
                            onClick: () => {
                                const content = generateLetterContent().replace(/<[^>]*>/g, '');
                                window.copyToClipboard(content);
                            }
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'copy' }),
                            React.createElement('span', { key: 'text' }, 'Copy')
                        ]),
                        
                        React.createElement('button', {
                            key: 'download',
                            className: 'btn btn-primary',
                            onClick: () => window.generateWordDoc(generateLetterContent(), formData)
                        }, [
                            React.createElement(Icon, { key: 'icon', name: 'download' }),
                            React.createElement('span', { key: 'text' }, 'Word Doc')
                        ]),
                        
                        React.createElement('button', {
                            key: 'esign',
                            className: 'btn btn-accent',
                            disabled: eSignLoading,
                            onClick: async () => {
                                setESignLoading(true);
                                try {
                                    // Generate letter content to populate window.cleanLetterText
                                    generateLetterContent();
                                    // Use clean text version for eSignature
                                    await window.initiateESign(window.cleanLetterText || generateLetterContent(), formData);
                                } finally {
                                    setESignLoading(false);
                                }
                            }
                        }, [
                            React.createElement(Icon, { 
                                key: 'icon', 
                                name: eSignLoading ? 'loader' : 'edit-3',
                                style: eSignLoading ? { animation: 'spin 1s linear infinite' } : {}
                            }),
                            React.createElement('span', { key: 'text' }, eSignLoading ? 'Processing...' : 'eSignature')
                        ])
                    ])
                ])
            ]),
            
            // Preview pane
            React.createElement('div', { key: 'preview', className: 'preview-pane' }, [
                React.createElement('div', { key: 'header', className: 'preview-header' }, [
                    React.createElement('h3', { key: 'title' }, 'Live Preview')
                ]),
                React.createElement('div', {
                    key: 'content',
                    className: 'preview-content',
                    ref: previewRef,
                    dangerouslySetInnerHTML: { 
                        __html: createHighlightedText(generateLetterContent())
                    }
                })
            ])
        ])
    ]);
};

// Export the component for use in index.html
window.TenantDepositGenerator = TenantDepositGenerator;