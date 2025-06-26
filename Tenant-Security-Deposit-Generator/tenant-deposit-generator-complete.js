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
    
    // Form data state - comprehensive
    const [formData, setFormData] = useState({
        // Tab 1: Property & Tenancy Details
        tenantName: '',
        tenantCurrentAddress: '',
        tenantCity: '',
        tenantState: 'CA',
        tenantZip: '',
        rentalAddress: '',
        rentalUnit: '',
        rentalCity: '',
        rentalState: 'CA',
        rentalZip: '',
        leaseStartDate: '',
        leaseEndDate: '',
        moveOutDate: '',
        keyReturnDate: '',
        forwardingAddressDate: '',
        forwardingAddressMethod: 'email',
        landlordName: '',
        landlordCompany: '',
        landlordAddress: '',
        landlordCity: '',
        landlordState: 'CA',
        landlordZip: '',
        landlordEmail: '',
        
        // Tab 2: Deposit & Deductions
        securityDeposit: '',
        petDeposit: '',
        cleaningDeposit: '',
        itemizedStatementReceived: 'not-received',
        itemizedStatementDate: '',
        
        // Disputed deduction categories
        normalWearCharges: false,
        excessiveCleaningFees: false,
        paintingCosts: false,
        carpetReplacement: false,
        unpaidRentDisputes: false,
        keyReplacement: false,
        preexistingDamage: false,
        otherDeductions: false,
        otherDeductionsText: '',
        
        // Tab 3: Legal Violations
        priorCommunications: false,
        priorCommunicationsDescription: '',
        
        // Evidence available
        evidenceMoveInPhotos: false,
        evidenceReceipts: false,
        evidenceCommunications: false,
        evidenceWitnesses: false,
        evidenceInspectionReport: false,
        evidenceOther: false,
        evidenceOtherText: '',
        
        // Tab 4: Letter Tone & Delivery
        letterTone: 'firm',
        deliveryMethod: 'email',
        ccRecipients: false,
        ccRecipientsText: '',
        
        // Tab 5: Review & Finalize
        responseDeadline: 14,
        includeSmallClaimsThreat: true,
        requestAttorneyFees: true,
        
        // Multiple scenario selections (some mutually exclusive)
        selectedScenarios: [],
        // Step-by-step answers for all scenarios
        totalDepositAmount: '',
        amountReturned: '',
        landlordJustifications: '',
        landlordJustificationDetails: [],
        
        // Additional scenario-specific fields
        excessiveChargeAmount: '',
        excessiveChargeTypes: [],
        tenancyLength: '',
        communicationAttempts: '',
        propertyCondition: ''
    });

    // Tab definitions
    const tabs = [
        { id: 'scenarios', label: 'Letter Scenarios', icon: 'zap' },
        { id: 'property', label: 'Property & Tenancy', icon: 'home' },
        { id: 'deposits', label: 'Deposit & Deductions', icon: 'dollar-sign' },
        { id: 'violations', label: 'Legal Violations', icon: 'alert-triangle' },
        { id: 'assessment', label: 'Case Assessment', icon: 'shield-check' }
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
        
        switch (currentTab) {
            case 0: // Scenarios
                if (['letterTone'].includes(lastChanged)) {
                    return 'tone-changes'; // Highlight demand statements that change with tone
                }
                if (['selectedScenarios'].includes(lastChanged)) {
                    return 'scenario-content'; // Highlight content that changes with scenarios
                }
                if (['totalDepositAmount', 'amountReturned', 'excessiveChargeAmount'].includes(lastChanged)) {
                    return 'deposit-details';
                }
                if (['landlordJustifications', 'communicationAttempts', 'tenancyLength', 'propertyCondition'].includes(lastChanged)) {
                    return 'scenario-content';
                }
                if (['excessiveChargeTypes'].includes(lastChanged)) {
                    return 'disputed-deductions';
                }
                if (['responseDeadline', 'includeSmallClaimsThreat'].includes(lastChanged)) {
                    return 'demand-section';
                }
                break;
            case 1: // Property & Tenancy
                if (['tenantName', 'landlordName', 'rentalAddress'].includes(lastChanged)) {
                    return 'header-info';
                }
                if (['leaseStartDate', 'leaseEndDate', 'moveOutDate', 'securityDeposit'].includes(lastChanged)) {
                    return 'tenancy-details';
                }
                break;
            case 2: // Deposit & Deductions
                if (['normalWearCharges', 'excessiveCleaningFees', 'paintingCosts', 'carpetReplacement', 'preexistingDamage'].includes(lastChanged)) {
                    return 'disputed-deductions';
                }
                if (['itemizedStatementReceived'].includes(lastChanged)) {
                    return 'legal-violation';
                }
                break;
            case 3: // Legal Violations
                if (['responseDeadline', 'includeSmallClaimsThreat'].includes(lastChanged)) {
                    return 'demand-section';
                }
                break;
        }
        return null;
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
            'scenario-content': /(Tenancy Details:|Legal Violation:|Disputed Deductions:|No Itemization:|Amount Due:).*?(?=\n\n|<p><strong>)/s,
            'deposit-details': /security deposit.*?\$[\d,]+/gi,
            'tenancy-details': /Tenancy Details:.*?(?=<p><strong>|\n\n)/s,
            'legal-violation': /Legal Violation:.*?(?=<p><strong>|\n\n)/s,
            'disputed-deductions': /Disputed Deductions:.*?(?=<p><strong>|\n\n)/s,
            'demand-section': /(You have|Demand:).*?days.*?(?=<p>|\n\n)/s
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

    // Generate comprehensive letter content
    const generateLetterContent = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        
        if (!stateData) {
            return `
                <h1>DEMAND FOR RETURN OF SECURITY DEPOSIT</h1>
                <p><em>Please complete the form to generate your demand letter...</em></p>
            `;
        }
        
        const calculations = window.StateLawUtils.calculateTotalDemand(formData, state);
        const riskAssessment = window.StateLawUtils.getRiskAssessment(formData, state);
        
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

        
        // Build scenario-specific content based on selected scenarios and step-by-step answers
        const selectedScenarios = formData.selectedScenarios || [];
        let scenarioContent = [];
        let disputedText = "";
        
        // Complete Non-Return scenario content
        if (selectedScenarios.includes('complete-non-return')) {
            scenarioContent.push(`**Complete Non-Return Situation:** You have withheld my entire security deposit of $${formData.totalDepositAmount || '0'}.`);
            
            if (formData.landlordJustifications === 'no-response') {
                scenarioContent.push(`You have provided no response or justification for withholding my deposit.`);
            } else if (formData.landlordJustifications === 'verbal-only') {
                scenarioContent.push(`You have only provided verbal explanations, failing to meet legal written notice requirements.`);
            } else if (formData.landlordJustifications === 'written-reasons') {
                scenarioContent.push(`While you provided written justifications, these deductions are improper under state law.`);
            }
        }
        
        // Partial Non-Return scenario content  
        if (selectedScenarios.includes('partial-non-return')) {
            const returnedAmount = formData.amountReturned || '0';
            const totalDeposit = formData.totalDepositAmount || '0';
            const withheldAmount = (parseFloat(totalDeposit) - parseFloat(returnedAmount)).toFixed(2);
            
            scenarioContent.push(`**Partial Non-Return Situation:** While you returned $${returnedAmount} of my $${totalDeposit} security deposit, you improperly withheld $${withheldAmount}.`);
            
            if (formData.landlordJustifications === 'no-itemization') {
                scenarioContent.push(`You failed to provide the required itemized statement of deductions.`);
            } else if (formData.landlordJustifications === 'inadequate-itemization') {
                scenarioContent.push(`The itemization you provided is vague and inadequate under state law requirements.`);
            } else if (formData.landlordJustifications === 'disputed-charges') {
                scenarioContent.push(`I dispute the charges detailed in your itemization as improper under state law.`);
            }
        }
        
        // Excessive Charges scenario content
        if (selectedScenarios.includes('excessive-charges')) {
            scenarioContent.push(`**Excessive Charges:** You charged $${formData.excessiveChargeAmount || '0'} in excessive and improper fees.`);
            
            const chargeTypes = formData.excessiveChargeTypes || [];
            if (chargeTypes.length > 0) {
                const chargeDescriptions = chargeTypes.map(type => {
                    switch(type) {
                        case 'wear-tear-painting': return 'normal wear and tear for painting/wall touch-ups';
                        case 'wear-tear-carpet': return 'normal carpet wear';
                        case 'wear-tear-holes': return 'small nail holes from pictures';
                        case 'cleaning-professional': return 'unnecessary professional cleaning';
                        case 'cleaning-carpet': return 'full carpet replacement for minor stains';
                        case 'repairs-minor': return 'minor maintenance charged as major repairs';
                        case 'preexisting-damage': return 'pre-existing damage';
                        default: return type;
                    }
                });
                disputedText = `I specifically dispute the following improper charges: ${chargeDescriptions.join(", ")}.`;
            }
            
            if (formData.tenancyLength === 'over-3-years') {
                scenarioContent.push(`Having lived in the property for over 3 years, normal wear and tear is legally expected.`);
            } else if (formData.tenancyLength === '1-3-years') {
                scenarioContent.push(`During my 1-3 year tenancy, any wear is normal and legally non-chargeable.`);
            }
            
            if (formData.propertyCondition === 'excellent') {
                scenarioContent.push(`I left the property in excellent condition with professional cleaning completed.`);
            } else if (formData.propertyCondition === 'good') {
                scenarioContent.push(`I left the property in good condition with normal cleaning completed.`);
            }
        }
        
        // No Itemization scenario content
        if (selectedScenarios.includes('no-itemization')) {
            scenarioContent.push(`**Missing Itemization:** You failed to provide the legally required itemized statement of deductions.`);
            
            if (formData.communicationAttempts === 'written-requests') {
                scenarioContent.push(`Despite my written requests for itemization, you have failed to comply.`);
            } else if (formData.communicationAttempts === 'verbal-requests') {
                scenarioContent.push(`Despite my requests for itemization, you have failed to provide the required documentation.`);
            } else if (formData.communicationAttempts === 'no-contact') {
                scenarioContent.push(`This letter serves as my formal request for the required itemization and deposit return.`);
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
            
            <p><strong>Tenancy Details:</strong> I was a tenant from ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}, moved out on ${formData.moveOutDate || '[MOVE OUT DATE]'}, and paid a security deposit of $${formData.securityDeposit || '0'}${formData.petDeposit ? ' plus a pet deposit of $' + formData.petDeposit : ''}.</p>
            
            <p><strong>Legal Violation:</strong> Under ${stateData.citation}, you were required to return my deposit${formData.itemizedStatementReceived !== 'not-received' ? ' or provide an itemized statement' : ''} within ${stateData.returnDeadline} days. As of today, ${calculations.daysPassed} days have passed${calculations.daysPassed > stateData.returnDeadline ? ', violating state law' : ''}.</p>
            
            ${scenarioContent.length > 0 ? scenarioContent.map(content => `<p>${content}</p>`).join('\n            ') : ''}
            
            ${formData.itemizedStatementReceived === 'not-received' ? 
                `<p><strong>No Itemization:</strong> You failed to provide the required itemized statement, which forfeits your right to withhold any deposit under ${stateData.citation}.</p>` : ''
            }
            
            ${disputedText ? `<p><strong>Disputed Deductions:</strong> ${disputedText} These charges violate state law prohibiting deductions for normal wear and tear.</p>` : ''}
            
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
            // Letter tone section
            React.createElement('h3', { key: 'tone-title' }, 'Letter Tone'),
            React.createElement('div', { key: 'tone-options', className: 'radio-group compact-radio-group' }, [
                createClickableItem('radio', 'letterTone', 'professional', 'Professional', 'Diplomatic approach', formData.letterTone === 'professional'),
                createClickableItem('radio', 'letterTone', 'firm', 'Firm', 'Business-like tone', formData.letterTone === 'firm'),
                createClickableItem('radio', 'letterTone', 'litigation', 'Legal Warning', 'Formal legal notice', formData.letterTone === 'litigation')
            ]),
            
            // Scenarios section - Radio buttons for mutual exclusivity
            React.createElement('h3', { key: 'scenarios-title' }, 'Your Situation'),
            React.createElement('p', { key: 'scenarios-subtitle', className: 'help-text' }, 'Select all scenarios that apply to your situation (you can choose multiple):'),
            
            React.createElement('div', { key: 'scenarios-section', className: 'checkbox-grid' }, 
                scenarios.map(scenario => {
                    const selectedScenarios = formData.selectedScenarios || [];
                    const isSelected = selectedScenarios.includes(scenario.id);
                    return React.createElement('div', { key: scenario.id }, [
                        createClickableItem('checkbox', 'selectedScenarios', scenario.id, scenario.title, scenario.description, isSelected, '', () => toggleScenario(scenario.id)),
                        
                        // Step-by-step questions when scenario is selected
                        isSelected && scenario.stepByStepQuestions ? React.createElement('div', {
                            key: 'questions',
                            className: 'step-by-step-questions'
                        }, [
                            React.createElement('h5', { 
                                key: 'questions-title'
                            }, [
                                React.createElement(Icon, { key: 'icon', name: 'help-circle' }),
                                'Tell us about your situation:'
                            ]),
                            ...scenario.stepByStepQuestions.map(question => {
                                if (question.type === 'number') {
                                    return React.createElement('div', {
                                        key: question.field,
                                        className: 'question-item'
                                    }, [
                                        React.createElement('label', {
                                            key: 'label'
                                        }, question.label + (question.required ? ' *' : '')),
                                        React.createElement('input', {
                                            key: 'input',
                                            type: 'number',
                                            step: '0.01',
                                            value: formData[question.field] || '',
                                            onChange: (e) => updateFormData(question.field, e.target.value),
                                            placeholder: '$0.00'
                                        })
                                    ]);
                                } else if (question.type === 'radio' && question.options) {
                                    return React.createElement('div', {
                                        key: question.field,
                                        className: 'question-item'
                                    }, [
                                        React.createElement('label', {
                                            key: 'label'
                                        }, question.label + (question.required ? ' *' : '')),
                                        React.createElement('div', {
                                            key: 'options',
                                            className: 'radio-options'
                                        }, question.options.map(option => 
                                            React.createElement('div', {
                                                key: option.value,
                                                className: 'radio-option',
                                                onClick: () => updateFormData(question.field, option.value)
                                            }, [
                                                React.createElement('input', {
                                                    key: 'input',
                                                    type: 'radio',
                                                    name: question.field,
                                                    value: option.value,
                                                    checked: formData[question.field] === option.value,
                                                    onChange: () => updateFormData(question.field, option.value)
                                                }),
                                                React.createElement('label', {
                                                    key: 'label'
                                                }, option.label)
                                            ])
                                        ))
                                    ]);
                                } else if (question.type === 'checkbox' && question.options) {
                                    return React.createElement('div', {
                                        key: question.field,
                                        className: 'question-item'
                                    }, [
                                        React.createElement('label', {
                                            key: 'label'
                                        }, question.label + (question.required ? ' *' : '')),
                                        React.createElement('div', {
                                            key: 'options',
                                            className: 'radio-options'
                                        }, question.options.map(option => {
                                            const fieldValue = formData[question.field] || [];
                                            const isChecked = Array.isArray(fieldValue) ? fieldValue.includes(option.value) : false;
                                            return React.createElement('div', {
                                                key: option.value,
                                                className: 'radio-option',
                                                onClick: () => {
                                                    const currentValue = formData[question.field] || [];
                                                    const newValue = isChecked 
                                                        ? currentValue.filter(v => v !== option.value)
                                                        : [...currentValue, option.value];
                                                    updateFormData(question.field, newValue);
                                                }
                                            }, [
                                                React.createElement('input', {
                                                    key: 'input',
                                                    type: 'checkbox',
                                                    checked: isChecked,
                                                    onChange: () => {}
                                                }),
                                                React.createElement('label', {
                                                    key: 'label'
                                                }, option.label)
                                            ]);
                                        }))
                                    ]);
                                }
                                return null;
                            })
                        ]) : null
                    ]);
                })
            )
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


    // Main tab content renderer
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: return renderScenariosTab();
            case 1: return renderPropertyTab();
            case 2: return renderDepositsTab();
            case 3: return renderViolationsTab();
            case 4: return renderAssessmentTab();
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