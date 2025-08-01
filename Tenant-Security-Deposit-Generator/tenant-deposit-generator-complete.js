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
    const [hasPaywallAccess, setHasPaywallAccess] = useState(false);
    const previewRef = useRef(null);
    
    // Streamlined form data state - progressive disclosure
    const [formData, setFormData] = useState({
        // Essential info (collected progressively)
        tenantName: '',
        tenantAddress: '',
        tenantCity: '',
        tenantState: 'CA',
        tenantZip: '',
        tenantPhone: '',
        tenantEmail: '',
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
        petDeposit: '', // additional pet deposit
        cleaningDeposit: '', // additional cleaning deposit
        
        // What happened details
        landlordCommunication: '', // 'no-response', 'verbal-only', 'written-inadequate', 'written-disputed'
        landlordJustifications: [], // array of justification types
        disputedCharges: [], // array of disputed charge types
        customDisputedCharges: [], // array of custom charges with responses
        
        // Detailed evidence and arguments
        leaseViolationClaims: [], // specific lease clauses cited by user
        specificCounterArguments: {}, // detailed responses to each claim type
        
        // Evidence available
        evidenceTypes: [], // array of evidence types
        evidenceDetails: '',
        
        // Letter preferences  
        responseDeadline: 14,
        includeSmallClaimsThreat: true,
        requestAttorneyFees: true
    });

    // Tab definitions
    const tabs = [
        { id: 'scenarios', label: 'Your Situation', icon: 'message-circle' },
        { id: 'details', label: 'Details', icon: 'edit-3' },
        { id: 'assessment', label: 'Case Assessment', icon: 'bar-chart-2' }
    ];

    // Paywall integration
    useEffect(() => {
        // Function to check and update payment status
        const checkPaymentStatus = () => {
            if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                setHasPaywallAccess(true);
                return true;
            }
            return false;
        };
        
        // Initial check
        if (!checkPaymentStatus()) {
            // Apply non-copyable restrictions to preview if not paid
            setTimeout(() => {
                if (window.PaywallSystem && window.PaywallSystem.makePreviewNonCopyable) {
                    window.PaywallSystem.makePreviewNonCopyable();
                }
            }, 1000);
        }
        
        // Listen for payment success events
        const handlePaymentSuccess = () => {
            console.log('Payment success event received, updating access state');
            setHasPaywallAccess(true);
            if (window.PaywallSystem && window.PaywallSystem.enablePreviewInteraction) {
                window.PaywallSystem.enablePreviewInteraction();
            }
        };
        
        window.addEventListener('paywallPaymentSuccess', handlePaymentSuccess);
        
        const pollInterval = setInterval(() => {
            if (!hasPaywallAccess && checkPaymentStatus()) {
                console.log('Payment status changed, updating access state');
            }
        }, 2000);
        
        return () => {
            window.removeEventListener('paywallPaymentSuccess', handlePaymentSuccess);
            clearInterval(pollInterval);
        };
    }, [hasPaywallAccess]);

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
        if (['landlordCommunication', 'landlordJustifications', 'disputedCharges', 'customDisputedCharges', 'leaseViolationClaims'].includes(lastChanged)) {
            return 'scenario-content';
        }
        if (['evidenceTypes', 'evidenceDetails'].includes(lastChanged) || lastChanged.includes('_')) {
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
            'scenario-content': /(What Happened:|lease agreement violations include:|Specifically, I dispute charges for:).*?(?=<p><strong>|$)/s,
            'deposit-details': /(\$[\d,]+|\d+\.\d+)/g,
            'tenancy-details': /Tenancy Details:.*?(?=<p><strong>|$)/s,
            'evidence-section': /(Evidence Available:.*?)(?=<p><strong>Amount Due|$)/s,
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
        
        // Calculate based on all deposit amounts
        const totalDeposit = parseFloat(formData.totalDepositAmount) || 0;
        const petDeposit = parseFloat(formData.petDeposit) || 0;
        const cleaningDeposit = parseFloat(formData.cleaningDeposit) || 0;
        const totalAllDeposits = totalDeposit + petDeposit + cleaningDeposit;
        const amountReturned = parseFloat(formData.amountReturned) || 0;
        
        const calculations = window.StateLawUtils ? window.StateLawUtils.calculateTotalDemand(formData, state) : {
            total: totalAllDeposits,
            deposits: totalAllDeposits,
            penalty: 0,
            interest: 0,
            daysPassed: 45
        };
        
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Professional tone (fixed)
        const greeting = "Dear";
        const closingTone = "I look forward to your prompt response and resolution of this matter.";
        const urgencyLevel = "I respectfully request";

        // Build scenario-specific content
        let scenarioContent = [];
        let whatHappenedText = "";
        let evidenceText = "";
        
        // Generate content based on selected scenario
        if (formData.primaryScenario === 'complete-non-return') {
            let depositBreakdown = `security deposit of $${formData.totalDepositAmount || '0'}`;
            if (petDeposit > 0) depositBreakdown += `, pet deposit of $${petDeposit}`;
            if (cleaningDeposit > 0) depositBreakdown += `, cleaning deposit of $${cleaningDeposit}`;
            if (totalAllDeposits > totalDeposit) depositBreakdown += ` (total: $${totalAllDeposits.toFixed(2)})`;
            
            scenarioContent.push(`<strong>Complete Non-Return Situation:</strong> You have withheld my entire ${depositBreakdown}.`);
            
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
            const withheldAmount = Math.max(0, totalDeposit - amountReturned).toFixed(2);
            scenarioContent.push(`<strong>Partial Non-Return Situation:</strong> While you returned $${formData.amountReturned || '0'} of my $${formData.totalDepositAmount || '0'} security deposit, you improperly withheld $${withheldAmount}.`);
            
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
        
        // Add evidence section with detailed descriptions
        if (formData.evidenceTypes && formData.evidenceTypes.length > 0) {
            const evidenceDescriptions = formData.evidenceTypes.map(evidence => {
                let baseDescription = '';
                let detailsText = '';
                
                // Base description
                switch(evidence) {
                    case 'photos': 
                        baseDescription = 'move-in/move-out photos showing property condition';
                        if (formData.photos_photoDate) detailsText += ` taken on ${formData.photos_photoDate}`;
                        if (formData.photos_photoDetails) detailsText += `: ${formData.photos_photoDetails}`;
                        break;
                    case 'receipts': 
                        baseDescription = 'payment receipts and bank records proving deposit payment';
                        if (formData.receipts_paymentDate) detailsText += ` dated ${formData.receipts_paymentDate}`;
                        if (formData.receipts_paymentMethod) detailsText += ` via ${formData.receipts_paymentMethod}`;
                        if (formData.receipts_paymentDetails) detailsText += `: ${formData.receipts_paymentDetails}`;
                        break;
                    case 'communications': 
                        baseDescription = 'written communications with landlord';
                        if (formData.communications_commType) detailsText += ` (${formData.communications_commType})`;
                        if (formData.communications_commDates) detailsText += ` from ${formData.communications_commDates}`;
                        if (formData.communications_commDetails) detailsText += `: ${formData.communications_commDetails}`;
                        break;
                    case 'witnesses': 
                        baseDescription = 'witness statements attesting to property condition';
                        if (formData.witnesses_witnessCount) detailsText += ` (${formData.witnesses_witnessCount} witnesses)`;
                        if (formData.witnesses_witnessTypes) detailsText += ` including ${formData.witnesses_witnessTypes}`;
                        if (formData.witnesses_witnessDetails) detailsText += `: ${formData.witnesses_witnessDetails}`;
                        break;
                    case 'inspection': 
                        baseDescription = 'official inspection reports documenting condition';
                        if (formData.inspection_inspectionDate) detailsText += ` conducted on ${formData.inspection_inspectionDate}`;
                        if (formData.inspection_inspectorType) detailsText += ` by ${formData.inspection_inspectorType}`;
                        if (formData.inspection_inspectionFindings) detailsText += `: ${formData.inspection_inspectionFindings}`;
                        break;
                    case 'cleaning': 
                        baseDescription = 'professional cleaning receipts demonstrating proper maintenance';
                        if (formData.cleaning_cleaningDate) detailsText += ` performed on ${formData.cleaning_cleaningDate}`;
                        if (formData.cleaning_cleaningType) detailsText += ` (${formData.cleaning_cleaningType})`;
                        if (formData.cleaning_cleaningDetails) detailsText += `: ${formData.cleaning_cleaningDetails}`;
                        break;
                    case 'lease': 
                        baseDescription = 'lease agreement provisions supporting my position';
                        if (formData.lease_leaseDate) detailsText += ` signed ${formData.lease_leaseDate}`;
                        if (formData.lease_leaseType) detailsText += ` (${formData.lease_leaseType})`;
                        if (formData.lease_leaseNotes) detailsText += `: ${formData.lease_leaseNotes}`;
                        break;
                    case 'repairs': 
                        baseDescription = 'documentation of maintenance and repairs performed';
                        if (formData.repairs_repairDates) detailsText += ` during ${formData.repairs_repairDates}`;
                        if (formData.repairs_repairCost) detailsText += ` (total investment: $${formData.repairs_repairCost})`;
                        if (formData.repairs_repairTypes) detailsText += `: ${formData.repairs_repairTypes}`;
                        break;
                    default: 
                        baseDescription = evidence;
                }
                
                return baseDescription + detailsText;
            });
            
            evidenceText = `<strong>Evidence Available:</strong> I have the following evidence to support my claim: ${evidenceDescriptions.join("; ")}.`;
            
            // Add lease clause citations if available
            if (formData.leaseViolationClaims && formData.leaseViolationClaims.length > 0) {
                const validClauses = formData.leaseViolationClaims.filter(clause => clause.section && clause.violation);
                if (validClauses.length > 0) {
                    evidenceText += ` Specifically, the lease agreement violations include: `;
                    evidenceText += validClauses.map(clause => 
                        `${clause.section} (${clause.violation})`
                    ).join('; ') + '.';
                }
            }
            
            if (formData.evidenceDetails) {
                evidenceText += ` ${formData.evidenceDetails}`;
            }
        }
        
        // Create clean text version for eSignatures (no HTML, no asterisks, no strong tags)
        const cleanScenarioContent = scenarioContent.map(content => content.replace(/<[^>]*>/g, '')).join('\n');
        const cleanWhatHappenedText = whatHappenedText.replace(/<[^>]*>/g, '');
        const cleanEvidenceText = evidenceText ? evidenceText.replace(/<[^>]*>/g, '').replace(/\*\*/g, '') : '';
        
        // Build clean sections array, filtering out empty content
        const cleanSections = [];
        
        if (cleanScenarioContent.trim()) {
            cleanSections.push(cleanScenarioContent.trim());
        }
        
        if (formData.itemizedStatementReceived === 'not-received') {
            cleanSections.push(`No Itemization: You failed to provide the required itemized statement, which forfeits your right to withhold any deposit under ${stateData.citation}.`);
        }
        
        if (cleanWhatHappenedText.trim()) {
            cleanSections.push(`What Happened: ${cleanWhatHappenedText.trim()}`);
        }
        
        if (cleanEvidenceText.trim()) {
            cleanSections.push(cleanEvidenceText.trim());
        }
        
        const cleanText = `${today}

${greeting}: ${formData.landlordName || '[LANDLORD NAME]'}${formData.landlordCompany ? '\n' + formData.landlordCompany : ''}
${formData.landlordAddress || '[LANDLORD ADDRESS]'}
${formData.landlordCity || '[CITY]'}, ${formData.landlordState || 'CA'} ${formData.landlordZip || '[ZIP]'}

Re: Demand for Return of Security Deposit
Tenant: ${formData.tenantName || '[TENANT NAME]'}
Property: ${formData.rentalAddress || '[RENTAL ADDRESS]'}${formData.rentalUnit ? ', Unit ' + formData.rentalUnit : ''}, ${formData.rentalCity || '[CITY]'}, ${formData.rentalState || 'CA'}

${greeting} ${formData.landlordName || '[LANDLORD NAME]'},

${urgencyLevel} the immediate return of my security deposit in the amount of $${calculations.total.toFixed(2)}, as required under ${stateData.citation}.

Tenancy Details: I was a tenant from ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}, moved out on ${formData.moveOutDate || '[MOVE OUT DATE]'}, and paid a security deposit of $${formData.totalDepositAmount || '0'}.

Legal Violation: Under ${stateData.citation}, you were required to return my deposit${formData.itemizedStatementReceived !== 'not-received' ? ' or provide an itemized statement' : ''} within ${stateData.returnDeadline} days. As of today, ${calculations.daysPassed} days have passed${calculations.daysPassed > stateData.returnDeadline ? ', violating state law' : ''}.

${cleanSections.join('\n\n')}

Amount Due: Due to your non-compliance, you owe statutory penalties totaling $${calculations.total.toFixed(2)} (original deposit: $${calculations.deposits.toFixed(2)}${calculations.penalty > 0 ? `, penalty: $${calculations.penalty.toFixed(2)}` : ''}${calculations.interest > 0 ? `, interest: $${calculations.interest.toFixed(2)}` : ''}${formData.requestAttorneyFees ? ', plus attorney fees if legal action becomes necessary' : ''}).

Demand: You have ${formData.responseDeadline || 14} days from the date of this letter to pay $${calculations.total.toFixed(2)}.${formData.includeSmallClaimsThreat ? ` Failure to comply can result in a lawsuit seeking the full amount plus court costs and additional damages under ${stateData.citation}.` : ''}

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
            
            <p><strong>Demand:</strong> You have ${formData.responseDeadline || 14} days from the date of this letter to pay $${calculations.total.toFixed(2)}.${formData.includeSmallClaimsThreat ? ` Failure to comply can result in a lawsuit seeking the full amount plus court costs and additional damages under ${stateData.citation}.` : ''}</p>
            
            <p>${closingTone}</p>
            
            <p>Sincerely,</p>
            <p><strong>${formData.tenantName || '[YOUR NAME]'}</strong></p>
        `;
    };

    // eSignature document function
    const eSignDocument = async () => {
        if (!hasPaywallAccess) {
            if (window.PaywallSystem) {
                window.PaywallSystem.showAccessDenied('esign');
                window.PaywallSystem.createPaywallModal(() => {
                    // Double-check access status after modal closes
                    if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                        setHasPaywallAccess(true);
                        window.PaywallSystem.enablePreviewInteraction();
                        eSignDocument();
                    } else {
                        console.log('Payment not confirmed, retrying access check...');
                        setTimeout(() => {
                            if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                                setHasPaywallAccess(true);
                                window.PaywallSystem.enablePreviewInteraction();
                                eSignDocument();
                            }
                        }, 1000);
                    }
                });
            }
            return;
        }
        
        // Check eSignature usage limit (3 uses per payment)
        if (window.PaywallSystem && !window.PaywallSystem.canUseESignature()) {
            const paymentStatus = window.PaywallSystem.getPaymentStatus();
            const usageCount = paymentStatus.esignatureUsage || 0;
            alert(`🚫 eSignature Limit Reached\n\nYou have used ${usageCount}/3 eSignatures for this payment.\n\nTo create more eSignatures, please make a new payment.`);
            return;
        }
        
        // Validate required fields
        if (!formData.tenantEmail || !formData.tenantName) {
            alert('Please fill in your email address and name before signing the document.');
            return;
        }
        
        try {
            setESignLoading(true);
            console.log("eSignature button clicked");
            
            // Generate clean document text for eSignature
            generateLetterContent(); // This populates window.cleanLetterText
            const finalDocumentText = window.cleanLetterText || generateLetterContent();
            const documentTitle = `Security Deposit Demand Letter`;

            // eSignatures.com API call - using templates endpoint
            const apiData = {
                test: "no", // Production mode - no demo stamp
                template: {
                    title: documentTitle,
                    content: finalDocumentText,
                    content_type: "text"
                },
                signers: [{
                    email: formData.tenantEmail,
                    name: formData.tenantName,
                    role: "signer"
                }]
            };

            console.log("Sending to eSignatures.com API:", apiData);

            // Try Node.js proxy first, then fallback to demo mode
            let response, result;
            
            try {
                // Use Node.js proxy server to avoid CORS issues
                response = await fetch('http://localhost:3001/esign-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(apiData)
                });

                result = await response.json();
                console.log("eSignatures.com API response:", result);
                
                // Check if we got a real API response (not demo)
                if (response.ok && result && result.status === 'success' && result.data?.contract_id && !result.data.contract_id.startsWith('demo-')) {
                    console.log("Real API response received with contract_id:", result.data.contract_id);
                }
                
            } catch (proxyError) {
                console.log("Node.js proxy not available, using demo mode...", proxyError);
                
                // Demo mode - simulate successful eSignature creation
                result = {
                    success: true,
                    signing_url: "https://esignatures.com/demo-signing-page",
                    contract_id: "demo-" + Date.now(),
                    message: "Demo mode - would create real eSignature contract in production"
                };
                
                response = { ok: true };
                console.log("Demo mode response:", result);
            }

            if (response.ok && (result.signing_url || result.sign_url || result.url || result.data?.signing_url)) {
                // Increment usage counter for real eSignatures
                if (result.status === 'success' && result.data?.contract_id && !result.data.contract_id.startsWith('demo-')) {
                    if (window.PaywallSystem) {
                        window.PaywallSystem.incrementESignatureUsage();
                    }
                }
                
                // Open signing URL in new window to preserve form state
                const signingUrl = result.signing_url || result.sign_url || result.url || result.data?.signing_url;
                window.open(signingUrl, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
                
                // Show appropriate success message
                if (result.contract_id && result.contract_id.startsWith('demo-')) {
                    alert("🧪 Demo Mode: eSignature interface opened!\n\nNote: This is a demo. Real eSignature integration requires:\n1. Node.js proxy server: node esign-proxy.js\n2. Valid API credentials\n\nCurrently running in demo mode.");
                } else if (result.status === 'success' && result.data?.contract_id && result.data?.message?.includes("Real eSignature document created")) {
                    alert("🔥 REAL eSignature Created!\n\nContract ID: " + result.data.contract_id + "\n\nPlease review and sign the document in the new window.");
                } else if (result.status === 'success' && result.data?.contract_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.data.contract_id)) {
                    alert("🔥 LIVE eSignature Created!\n\nReal contract ID: " + result.data.contract_id + "\n\nPlease review and sign the document in the new window.");
                } else {
                    alert("📄 Document Ready for Signing!\n\nYour security deposit demand letter has been prepared for electronic signature.\n\nPlease review and sign the document in the new window.");
                }
            } else {
                console.error("eSignature creation failed:", result);
                alert("❌ eSignature creation failed. Please try again or contact support.\n\nError: " + (result.error || 'Unknown error'));
            }

        } catch (error) {
            console.error("eSignature error:", error);
            alert("❌ An error occurred while creating the eSignature. Please try again.\n\nError: " + error.message);
        } finally {
            setESignLoading(false);
        }
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
            React.createElement('h4', { key: 'scenarios-title' }, 'What is your situation?'),
            React.createElement('div', { key: 'help-scenarios', className: 'help-text' }, 'Choose the scenario that best describes your situation. This will guide the rest of the questions.'),
            
            // Two main scenarios - radio selection (mutually exclusive)
            React.createElement('div', { key: 'main-scenarios', className: 'radio-group' }, [
                createClickableItem('radio', 'primaryScenario', 'complete-non-return', 'Complete Non-Return', 'Landlord has not returned any portion of my security deposit', formData.primaryScenario === 'complete-non-return'),
                createClickableItem('radio', 'primaryScenario', 'partial-non-return', 'Partial Non-Return', 'Landlord returned some money but withheld the rest improperly', formData.primaryScenario === 'partial-non-return')
            ]),
            
            // Quick deposit amount input for immediate calculation
            formData.primaryScenario ? 
                React.createElement('div', { key: 'quick-amount', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Security Deposit Amount'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        min: '0',
                        value: formData.totalDepositAmount || '',
                        onChange: (e) => updateFormData('totalDepositAmount', e.target.value),
                        placeholder: 'Enter deposit amount',
                        className: 'form-control'
                    })
                ]) : null,
            
            // Progressive disclosure - Complete Non-Return questionnaire
            formData.primaryScenario === 'complete-non-return' ? 
                React.createElement('div', { key: 'complete-questions', className: 'step-by-step-questions' }, [
                    React.createElement('h5', { key: 'title' }, [
                        React.createElement(Icon, { key: 'icon', name: 'arrow-right' }),
                        'Complete Non-Return Details'
                    ]),
                    
                    // Move-out details
                    React.createElement('div', { key: 'moveout-details', className: 'question-item' }, [
                        React.createElement('label', { key: 'label' }, 'When did you move out?'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'date',
                            value: formData.moveOutDate || '',
                            onChange: (e) => updateFormData('moveOutDate', e.target.value),
                            className: 'form-control'
                        })
                    ]),
                    
                    // Days since move-out calculation
                    formData.moveOutDate ? 
                        React.createElement('div', { key: 'days-info', className: 'info-box' }, [
                            React.createElement('p', { key: 'days' }, `Days since move-out: ${Math.floor((new Date() - new Date(formData.moveOutDate)) / (1000 * 60 * 60 * 24))} days`),
                            React.createElement('p', { key: 'deadline' }, `Legal deadline: ${window.STATE_LAWS && window.STATE_LAWS[formData.rentalState] ? window.STATE_LAWS[formData.rentalState].returnDeadline : 21} days`)
                        ]) : null,
                    
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
                    
                    // Show comprehensive disputed charges if written-disputed is selected
                    formData.landlordCommunication === 'written-disputed' ?
                        React.createElement('div', { key: 'disputed-charges', className: 'question-item' }, [
                            React.createElement('label', { key: 'label' }, 'What specific charges do you dispute?'),
                            React.createElement('div', { key: 'charges-help', className: 'help-text premium-tip' }, 
                                '💡 Premium Feature: Build detailed counter-arguments for each disputed charge. Each selection provides strategic legal arguments to strengthen your position.'
                            ),
                            React.createElement('div', { key: 'charges', className: 'disputed-charges-grid' }, [
                                {
                                    id: 'normal-wear-painting',
                                    title: 'Normal Wear - Painting/Wall Touch-ups',
                                    description: 'Landlord charging for repainting or minor wall repairs',
                                    arguments: [
                                        'Normal wear and tear cannot be charged to tenant under state law',
                                        'Paint typically lasts 2-3 years in rental properties',
                                        'Minor nail holes and scuff marks are expected normal use',
                                        'Landlord must prove damage beyond normal wear'
                                    ],
                                    evidence: ['Before/after photos', 'Length of tenancy documentation', 'Professional assessment']
                                },
                                {
                                    id: 'normal-wear-carpet',
                                    title: 'Normal Wear - Carpet/Flooring',
                                    description: 'Charges for carpet cleaning, replacement, or floor refinishing',
                                    arguments: [
                                        'Carpet naturally wears with normal use over time',
                                        'Professional cleaning typically required only for excessive soil/stains',
                                        'Carpet replacement only justified for damage beyond normal wear',
                                        'Age and useful life of carpet must be considered'
                                    ],
                                    evidence: ['Move-in carpet condition photos', 'Professional cleaning receipts', 'Carpet age documentation']
                                },
                                {
                                    id: 'excessive-cleaning',
                                    title: 'Excessive Cleaning Fees',
                                    description: 'Unreasonable charges for cleaning or maintenance',
                                    arguments: [
                                        'Tenant only responsible for cleaning beyond normal standards',
                                        'Professional cleaning fees must be reasonable and documented',
                                        'Landlord cannot charge for cleaning normal move-out condition',
                                        'Excessive fees may violate state consumer protection laws'
                                    ],
                                    evidence: ['Move-out cleaning receipts', 'Property condition photos', 'Market rate cleaning comparisons']
                                },
                                {
                                    id: 'pre-existing-damage',
                                    title: 'Pre-existing Damage',
                                    description: 'Charges for damage that existed before tenancy',
                                    arguments: [
                                        'Tenant cannot be charged for damage present at move-in',
                                        'Landlord bears burden of proving damage occurred during tenancy',
                                        'Lack of proper move-in documentation protects tenant',
                                        'Pre-existing conditions documented in photos provide strong defense'
                                    ],
                                    evidence: ['Move-in photos/videos', 'Move-in inspection report', 'Email communications about existing issues']
                                },
                                {
                                    id: 'improper-repairs',
                                    title: 'Improper Repair Charges',
                                    description: 'Charges for repairs that are landlord responsibility',
                                    arguments: [
                                        'Landlord responsible for maintaining habitability and structural repairs',
                                        'Normal maintenance cannot be charged to tenant',
                                        'Tenant only liable for damage caused by negligence or misuse',
                                        'Repair costs must be reasonable and properly documented'
                                    ],
                                    evidence: ['Repair documentation', 'Communications about maintenance requests', 'Professional assessments']
                                },
                                {
                                    id: 'unauthorized-deductions',
                                    title: 'Unauthorized Deductions',
                                    description: 'Charges not permitted under lease or state law',
                                    arguments: [
                                        'Deductions must be specifically authorized by lease agreement',
                                        'State law limits allowable deposit deductions',
                                        'Tenant cannot waive rights protected by state law',
                                        'Invalid deductions may result in penalties against landlord'
                                    ],
                                    evidence: ['Lease agreement terms', 'State law research', 'Legal precedent documentation']
                                }
                            ].map(charge => {
                                const currentCharges = formData.disputedCharges || [];
                                const isChecked = currentCharges.includes(charge.id);
                                
                                return React.createElement('div', { 
                                    key: charge.id, 
                                    className: `disputed-charge-card ${isChecked ? 'selected' : ''}`,
                                    onClick: () => {
                                        const newCharges = isChecked 
                                            ? currentCharges.filter(c => c !== charge.id)
                                            : [...currentCharges, charge.id];
                                        updateFormData('disputedCharges', newCharges);
                                    }
                                }, [
                                    React.createElement('div', { key: 'header', className: 'charge-header' }, [
                                        React.createElement('input', {
                                            key: 'checkbox',
                                            type: 'checkbox',
                                            checked: isChecked,
                                            onChange: () => {}
                                        }),
                                        React.createElement('h6', { key: 'title' }, charge.title)
                                    ]),
                                    React.createElement('p', { key: 'desc', className: 'charge-description' }, charge.description),
                                    React.createElement('div', { key: 'arguments', className: 'legal-arguments' }, [
                                        React.createElement('strong', { key: 'arg-title' }, 'Legal Arguments:'),
                                        React.createElement('ul', { key: 'arg-list' }, 
                                            charge.arguments.map((arg, index) => 
                                                React.createElement('li', { key: index }, arg)
                                            )
                                        )
                                    ]),
                                    React.createElement('div', { key: 'evidence-suggest', className: 'evidence-suggestions' }, [
                                        React.createElement('strong', { key: 'ev-title' }, 'Recommended Evidence:'),
                                        React.createElement('div', { key: 'ev-list', className: 'evidence-tags' }, 
                                            charge.evidence.map((ev, index) => 
                                                React.createElement('span', { key: index, className: 'evidence-tag' }, ev)
                                            )
                                        )
                                    ])
                                ]);
                            })),
                            
                            // Custom disputed charges section
                            React.createElement('div', { key: 'custom-charges-section', className: 'custom-charges-section' }, [
                                React.createElement('h6', { key: 'custom-title' }, 'Additional Disputed Charges'),
                                React.createElement('div', { key: 'custom-help', className: 'help-text' }, 
                                    'Add any other charges not listed above that you want to dispute:'
                                ),
                                React.createElement('button', {
                                    key: 'add-custom',
                                    type: 'button',
                                    className: 'btn btn-secondary',
                                    onClick: () => {
                                        const currentCustom = formData.customDisputedCharges || [];
                                        const newCustom = [...currentCustom, { charge: '', amount: '', response: '' }];
                                        updateFormData('customDisputedCharges', newCustom);
                                    }
                                }, '+ Add Custom Disputed Charge'),
                                
                                // Render custom charge inputs
                                formData.customDisputedCharges && formData.customDisputedCharges.length > 0 ?
                                    React.createElement('div', { key: 'custom-charges', className: 'custom-charges-list' },
                                        formData.customDisputedCharges.map((custom, index) => 
                                            React.createElement('div', { key: index, className: 'custom-charge-item' }, [
                                                React.createElement('div', { key: 'charge-row', className: 'form-row' }, [
                                                    React.createElement('div', { key: 'charge', className: 'form-group' }, [
                                                        React.createElement('label', { key: 'label' }, 'Charge Description'),
                                                        React.createElement('input', {
                                                            key: 'input',
                                                            type: 'text',
                                                            value: custom.charge || '',
                                                            onChange: (e) => {
                                                                const updated = [...formData.customDisputedCharges];
                                                                updated[index] = { ...updated[index], charge: e.target.value };
                                                                updateFormData('customDisputedCharges', updated);
                                                            },
                                                            placeholder: 'e.g., Excessive utility charges',
                                                            className: 'form-control'
                                                        })
                                                    ]),
                                                    React.createElement('div', { key: 'amount', className: 'form-group' }, [
                                                        React.createElement('label', { key: 'label' }, 'Amount'),
                                                        React.createElement('input', {
                                                            key: 'input',
                                                            type: 'number',
                                                            step: '0.01',
                                                            value: custom.amount || '',
                                                            onChange: (e) => {
                                                                const updated = [...formData.customDisputedCharges];
                                                                updated[index] = { ...updated[index], amount: e.target.value };
                                                                updateFormData('customDisputedCharges', updated);
                                                            },
                                                            placeholder: '0.00',
                                                            className: 'form-control'
                                                        })
                                                    ])
                                                ]),
                                                React.createElement('div', { key: 'response', className: 'form-group' }, [
                                                    React.createElement('label', { key: 'label' }, 'Your Counter-Argument'),
                                                    React.createElement('textarea', {
                                                        key: 'textarea',
                                                        value: custom.response || '',
                                                        onChange: (e) => {
                                                            const updated = [...formData.customDisputedCharges];
                                                            updated[index] = { ...updated[index], response: e.target.value };
                                                            updateFormData('customDisputedCharges', updated);
                                                        },
                                                        placeholder: 'Explain why this charge is improper, citing relevant law or lease terms...',
                                                        rows: 3,
                                                        className: 'form-control'
                                                    })
                                                ]),
                                                React.createElement('button', {
                                                    key: 'remove',
                                                    type: 'button',
                                                    className: 'btn btn-danger btn-sm',
                                                    onClick: () => {
                                                        const updated = formData.customDisputedCharges.filter((_, i) => i !== index);
                                                        updateFormData('customDisputedCharges', updated);
                                                    }
                                                }, 'Remove')
                                            ])
                                        )
                                    ) : null
                            ])
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
                                min: '0',
                                max: formData.totalDepositAmount || '999999',
                                value: formData.amountReturned || '',
                                onChange: (e) => {
                                    const returnedAmount = parseFloat(e.target.value) || 0;
                                    const totalAmount = parseFloat(formData.totalDepositAmount) || 0;
                                    if (returnedAmount <= totalAmount) {
                                        updateFormData('amountReturned', e.target.value);
                                    }
                                },
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
                        React.createElement('div', { key: 'evidence-help', className: 'help-text premium-tip' }, 
                            '💡 Premium Feature: Smart evidence organization helps build the strongest possible case. Each type strengthens different legal arguments.'
                        ),
                        React.createElement('div', { key: 'evidence', className: 'evidence-grid' }, [
                            {
                                id: 'photos',
                                title: 'Move-in/Move-out Photos',
                                description: 'Shows actual condition vs. claimed damages',
                                strength: 'Very Strong',
                                tip: 'Take photos of every room, focusing on areas landlord claims are damaged',
                                professionalTip: '📸 Pro Tip: Use timestamp-enabled photos. Take wide shots for context, then close-ups of specific areas. Include a newspaper or dated item in photos for additional verification. Photos should be high-resolution and well-lit.',
                                fields: [
                                    { name: 'photoDate', label: 'Photo Date', type: 'date', placeholder: 'When photos were taken' },
                                    { name: 'photoDetails', label: 'Photo Details', type: 'textarea', placeholder: 'Describe what the photos show and how they support your case...' }
                                ]
                            },
                            {
                                id: 'receipts',
                                title: 'Payment Records & Receipts',
                                description: 'Proves deposit payment and amount',
                                strength: 'Essential',
                                tip: 'Include bank statements, money orders, or cancelled checks',
                                professionalTip: '💰 Pro Tip: Bank records trump cash receipts. If you paid cash, look for ATM withdrawal records on the same day. Money orders and cashier\'s checks provide excellent paper trails. Include both the payment method AND proof of landlord receipt.',
                                fields: [
                                    { name: 'paymentDate', label: 'Payment Date', type: 'date', placeholder: 'When deposit was paid' },
                                    { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Check', 'Money Order', 'Cash', 'Bank Transfer', 'Credit Card', 'Other'], placeholder: 'How was deposit paid' },
                                    { name: 'paymentDetails', label: 'Payment Details', type: 'textarea', placeholder: 'Check number, money order details, receipt information...' }
                                ]
                            },
                            {
                                id: 'communications',
                                title: 'Written Communications',
                                description: 'Email, texts, letters with landlord',
                                strength: 'Strong',
                                tip: 'Shows landlord admissions or contradictory statements',
                                professionalTip: '📧 Pro Tip: Screenshots of texts should show phone numbers and timestamps. Print emails with full headers. Look for admissions like "I know the carpet was old" or contradictory statements between conversations.',
                                fields: [
                                    { name: 'commType', label: 'Communication Type', type: 'select', options: ['Email', 'Text Messages', 'Letters', 'Voicemail Transcripts', 'Mixed'], placeholder: 'Type of communications' },
                                    { name: 'commDates', label: 'Date Range', type: 'text', placeholder: 'e.g., March 2024 - June 2024' },
                                    { name: 'commDetails', label: 'Key Communications', type: 'textarea', placeholder: 'Describe the most important communications and what they prove...' }
                                ]
                            },
                            {
                                id: 'lease',
                                title: 'Lease Agreement',
                                description: 'Original lease terms and deposit conditions',
                                strength: 'Essential',
                                tip: 'Specific lease clauses strengthen your legal arguments',
                                professionalTip: '📋 Pro Tip: Highlight specific clauses about deposit returns, normal wear definitions, and maintenance responsibilities. If lease is silent on key issues, state law applies in your favor.',
                                fields: [
                                    { name: 'leaseDate', label: 'Lease Signing Date', type: 'date', placeholder: 'When lease was signed' },
                                    { name: 'leaseType', label: 'Lease Type', type: 'select', options: ['Standard Residential', 'Month-to-Month', 'Corporate Housing', 'Rent-Controlled', 'Other'], placeholder: 'Type of lease agreement' },
                                    { name: 'leaseNotes', label: 'Relevant Lease Provisions', type: 'textarea', placeholder: 'Note specific sections that support your case...' }
                                ]
                            },
                            {
                                id: 'inspection',
                                title: 'Inspection Reports',
                                description: 'Official move-in or move-out inspections',
                                strength: 'Very Strong',
                                tip: 'Government or professional inspection carries most weight',
                                professionalTip: '🔍 Pro Tip: Official inspections by licensed professionals or government agencies carry the most legal weight. Even informal walkthroughs with witnesses are valuable if documented properly.',
                                fields: [
                                    { name: 'inspectionDate', label: 'Inspection Date', type: 'date', placeholder: 'Date of inspection' },
                                    { name: 'inspectorType', label: 'Inspector Type', type: 'select', options: ['Property Manager', 'Landlord', 'Professional Inspector', 'Government Agency', 'Tenant + Witness'], placeholder: 'Who conducted inspection' },
                                    { name: 'inspectionFindings', label: 'Key Findings', type: 'textarea', placeholder: 'What did the inspection show? Include any noted pre-existing conditions...' }
                                ]
                            },
                            {
                                id: 'cleaning',
                                title: 'Professional Cleaning Records',
                                description: 'Receipts showing you cleaned properly',
                                strength: 'Strong',
                                tip: 'Counters excessive cleaning fee claims',
                                professionalTip: '🧹 Pro Tip: Professional cleaning receipts provide objective evidence of cleanliness standards. Even DIY cleaning can be documented with before/after photos and detailed itemized lists of tasks completed.',
                                fields: [
                                    { name: 'cleaningDate', label: 'Cleaning Date', type: 'date', placeholder: 'When cleaning was performed' },
                                    { name: 'cleaningType', label: 'Cleaning Type', type: 'select', options: ['Professional Service', 'DIY Deep Clean', 'Carpet Professional', 'Window Professional', 'Mixed Services'], placeholder: 'Type of cleaning performed' },
                                    { name: 'cleaningDetails', label: 'Cleaning Details', type: 'textarea', placeholder: 'Company name, services performed, areas cleaned, cost...' }
                                ]
                            },
                            {
                                id: 'witnesses',
                                title: 'Witness Statements',
                                description: 'People who saw property condition',
                                strength: 'Moderate',
                                tip: 'Friends, family, or professionals who visited',
                                professionalTip: '👥 Pro Tip: Professional witnesses (contractors, real estate agents) carry more weight than friends. Get signed statements with witness contact info. Video testimony on phones can be powerful if done properly.',
                                fields: [
                                    { name: 'witnessCount', label: 'Number of Witnesses', type: 'number', placeholder: 'How many witnesses' },
                                    { name: 'witnessTypes', label: 'Witness Types', type: 'text', placeholder: 'e.g., friend, contractor, real estate agent' },
                                    { name: 'witnessDetails', label: 'What Witnesses Saw', type: 'textarea', placeholder: 'What did witnesses observe? Include their names and how to contact them...' }
                                ]
                            },
                            {
                                id: 'repairs',
                                title: 'Repair Documentation',
                                description: 'Records of maintenance you performed',
                                strength: 'Strong',
                                tip: 'Shows you maintained the property well',
                                professionalTip: '🔧 Pro Tip: Document all repairs with photos, receipts, and dates. This shows responsible tenancy and can counter claims of damage. Include both professional repairs and DIY maintenance.',
                                fields: [
                                    { name: 'repairDates', label: 'Repair Period', type: 'text', placeholder: 'e.g., Throughout 2023-2024' },
                                    { name: 'repairTypes', label: 'Types of Repairs', type: 'textarea', placeholder: 'List major repairs, maintenance, or improvements made...' },
                                    { name: 'repairCost', label: 'Total Investment', type: 'number', placeholder: 'Total spent on repairs/maintenance' }
                                ]
                            }
                        ].map(evidence => {
                            const currentEvidence = formData.evidenceTypes || [];
                            const isChecked = currentEvidence.includes(evidence.id);
                            
                            return React.createElement('div', { 
                                key: evidence.id, 
                                className: `evidence-card ${isChecked ? 'selected' : ''}`,
                                onClick: (e) => {
                                    // Don't toggle if clicking on input fields
                                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                                        return;
                                    }
                                    const newEvidence = isChecked 
                                        ? currentEvidence.filter(e => e !== evidence.id)
                                        : [...currentEvidence, evidence.id];
                                    updateFormData('evidenceTypes', newEvidence);
                                }
                            }, [
                                React.createElement('div', { key: 'header', className: 'evidence-header' }, [
                                    React.createElement('input', {
                                        key: 'checkbox',
                                        type: 'checkbox',
                                        checked: isChecked,
                                        onChange: () => {}
                                    }),
                                    React.createElement('div', { key: 'strength', className: `strength-badge ${evidence.strength.toLowerCase().replace(' ', '-')}` }, evidence.strength)
                                ]),
                                React.createElement('div', { key: 'content', className: 'evidence-content' }, [
                                    React.createElement('h6', { key: 'title' }, evidence.title),
                                    React.createElement('p', { key: 'desc' }, evidence.description),
                                    React.createElement('div', { key: 'tip', className: 'evidence-tip' }, [
                                        React.createElement('span', { key: 'icon' }, '💡 '),
                                        React.createElement('span', { key: 'text' }, evidence.tip)
                                    ]),
                                    // Professional tip section
                                    evidence.professionalTip ? 
                                        React.createElement('div', { key: 'pro-tip', className: 'professional-tip' }, evidence.professionalTip) : null,
                                    // Detailed input fields when evidence is selected
                                    isChecked && evidence.fields ? 
                                        React.createElement('div', { key: 'evidence-details', className: 'evidence-detail-fields' }, [
                                            React.createElement('h7', { key: 'details-title' }, 'Evidence Details:'),
                                            ...evidence.fields.map((field, fieldIndex) => 
                                                React.createElement('div', { key: `field-${fieldIndex}`, className: 'evidence-field' }, [
                                                    React.createElement('label', { key: 'label' }, field.label),
                                                    field.type === 'textarea' ? 
                                                        React.createElement('textarea', {
                                                            key: 'input',
                                                            value: formData[`${evidence.id}_${field.name}`] || '',
                                                            onChange: (e) => updateFormData(`${evidence.id}_${field.name}`, e.target.value),
                                                            placeholder: field.placeholder,
                                                            rows: 2,
                                                            className: 'form-control'
                                                        }) :
                                                    field.type === 'select' ?
                                                        React.createElement('select', {
                                                            key: 'input',
                                                            value: formData[`${evidence.id}_${field.name}`] || '',
                                                            onChange: (e) => updateFormData(`${evidence.id}_${field.name}`, e.target.value),
                                                            className: 'form-control'
                                                        }, [
                                                            React.createElement('option', { key: 'default', value: '' }, field.placeholder),
                                                            ...field.options.map(option => 
                                                                React.createElement('option', { key: option, value: option }, option)
                                                            )
                                                        ]) :
                                                        React.createElement('input', {
                                                            key: 'input',
                                                            type: field.type,
                                                            value: formData[`${evidence.id}_${field.name}`] || '',
                                                            onChange: (e) => updateFormData(`${evidence.id}_${field.name}`, e.target.value),
                                                            placeholder: field.placeholder,
                                                            className: 'form-control'
                                                        })
                                                ])
                                            )
                                        ]) : null
                                ])
                            ]);
                        }))
                    ]),
                    
                    // Lease clause citation system - shows if lease is selected as evidence
                    formData.evidenceTypes && formData.evidenceTypes.includes('lease') ?
                        React.createElement('div', { key: 'lease-citation-section', className: 'lease-violation-section' }, [
                            React.createElement('h6', { key: 'title' }, [
                                React.createElement(Icon, { key: 'icon', name: 'file-text' }),
                                ' Lease Agreement Evidence Details'
                            ]),
                            React.createElement('div', { key: 'lease-help', className: 'strategic-tip' }, 
                                'Citing specific lease clauses strengthens your legal position. Be precise about which sections support your case.'
                            ),
                            React.createElement('button', {
                                key: 'add-clause',
                                type: 'button',
                                className: 'btn btn-secondary',
                                onClick: () => {
                                    const currentClauses = formData.leaseViolationClaims || [];
                                    const newClauses = [...currentClauses, { section: '', clause: '', violation: '' }];
                                    updateFormData('leaseViolationClaims', newClauses);
                                }
                            }, '+ Add Lease Clause Citation'),
                            
                            // Render lease clause citation inputs
                            formData.leaseViolationClaims && formData.leaseViolationClaims.length > 0 ?
                                React.createElement('div', { key: 'lease-clauses', className: 'lease-clauses-list' },
                                    formData.leaseViolationClaims.map((clause, index) => 
                                        React.createElement('div', { key: index, className: 'lease-clause-item' }, [
                                            React.createElement('div', { key: 'section-row', className: 'form-row' }, [
                                                React.createElement('div', { key: 'section', className: 'form-group' }, [
                                                    React.createElement('label', { key: 'label' }, 'Lease Section/Paragraph'),
                                                    React.createElement('input', {
                                                        key: 'input',
                                                        type: 'text',
                                                        value: clause.section || '',
                                                        onChange: (e) => {
                                                            const updated = [...formData.leaseViolationClaims];
                                                            updated[index] = { ...updated[index], section: e.target.value };
                                                            updateFormData('leaseViolationClaims', updated);
                                                        },
                                                        placeholder: 'e.g., Section 12.3, Paragraph 8, Clause B',
                                                        className: 'form-control'
                                                    })
                                                ])
                                            ]),
                                            React.createElement('div', { key: 'clause', className: 'form-group' }, [
                                                React.createElement('label', { key: 'label' }, 'What the lease says (quote the exact language)'),
                                                React.createElement('textarea', {
                                                    key: 'textarea',
                                                    value: clause.clause || '',
                                                    onChange: (e) => {
                                                        const updated = [...formData.leaseViolationClaims];
                                                        updated[index] = { ...updated[index], clause: e.target.value };
                                                        updateFormData('leaseViolationClaims', updated);
                                                    },
                                                    placeholder: 'Quote the exact text from your lease agreement...',
                                                    rows: 2,
                                                    className: 'form-control'
                                                })
                                            ]),
                                            React.createElement('div', { key: 'violation', className: 'form-group' }, [
                                                React.createElement('label', { key: 'label' }, 'How is the landlord violating this lease provision?'),
                                                React.createElement('textarea', {
                                                    key: 'textarea',
                                                    value: clause.violation || '',
                                                    onChange: (e) => {
                                                        const updated = [...formData.leaseViolationClaims];
                                                        updated[index] = { ...updated[index], violation: e.target.value };
                                                        updateFormData('leaseViolationClaims', updated);
                                                    },
                                                    placeholder: 'Explain how the landlord\'s actions contradict this lease provision...',
                                                    rows: 3,
                                                    className: 'form-control'
                                                })
                                            ]),
                                            React.createElement('button', {
                                                key: 'remove',
                                                type: 'button',
                                                className: 'btn btn-danger btn-sm',
                                                onClick: () => {
                                                    const updated = formData.leaseViolationClaims.filter((_, i) => i !== index);
                                                    updateFormData('leaseViolationClaims', updated);
                                                }
                                            }, 'Remove Clause')
                                        ])
                                    )
                                ) : null
                        ]) : null,
                    
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


    // Comprehensive details tab for all property and contact information
    const renderDetailsTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Essential Details'),
            React.createElement('div', { key: 'help', className: 'help-text' }, 'Complete information for your demand letter. All fields help strengthen your legal position.'),
            
            // Property state selection (affects legal calculations)
            React.createElement('div', { key: 'state-selection', className: 'form-group highlighted-section' }, [
                React.createElement('label', { key: 'label' }, 'Property State (Important for Legal Requirements)'),
                React.createElement('select', {
                    key: 'select',
                    value: formData.rentalState || 'CA',
                    onChange: (e) => updateFormData('rentalState', e.target.value),
                    className: 'form-control'
                }, US_STATES.map(state => 
                    React.createElement('option', { key: state.value, value: state.value }, state.label)
                )),
                React.createElement('div', { key: 'state-info', className: 'help-text' }, 
                    window.STATE_LAWS && window.STATE_LAWS[formData.rentalState] ? 
                        `${window.STATE_LAWS[formData.rentalState].state} requires deposit return within ${window.STATE_LAWS[formData.rentalState].returnDeadline} days` : 
                        'Select your state to see specific legal requirements'
                )
            ]),
            
            React.createElement('h4', { key: 'tenant-info' }, 'Your Information'),
            React.createElement('div', { key: 'tenant-help', className: 'help-text' }, 'Your contact information will appear at the bottom of the demand letter for landlord response.'),
            
            React.createElement('div', { key: 'tenant-name', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Your Full Name'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.tenantName || '',
                    onChange: (e) => updateFormData('tenantName', e.target.value),
                    placeholder: 'Your full legal name',
                    className: 'form-control'
                })
            ]),
            
            React.createElement('div', { key: 'tenant-address', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Your Current Address'),
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: formData.tenantAddress || '',
                    onChange: (e) => updateFormData('tenantAddress', e.target.value),
                    placeholder: 'Street address',
                    className: 'form-control'
                })
            ]),
            
            React.createElement('div', { key: 'tenant-location', className: 'form-row' }, [
                React.createElement('div', { key: 'city', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'City'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.tenantCity || '',
                        onChange: (e) => updateFormData('tenantCity', e.target.value),
                        placeholder: 'City',
                        className: 'form-control'
                    })
                ]),
                React.createElement('div', { key: 'state', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'State'),
                    React.createElement('select', {
                        key: 'select',
                        value: formData.tenantState || 'CA',
                        onChange: (e) => updateFormData('tenantState', e.target.value),
                        className: 'form-control'
                    }, US_STATES.map(state => 
                        React.createElement('option', { key: state.value, value: state.value }, state.label)
                    ))
                ]),
                React.createElement('div', { key: 'zip', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'ZIP Code'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.tenantZip || '',
                        onChange: (e) => updateFormData('tenantZip', e.target.value),
                        placeholder: 'ZIP',
                        className: 'form-control'
                    })
                ])
            ]),
            
            React.createElement('div', { key: 'tenant-contact', className: 'form-row' }, [
                React.createElement('div', { key: 'phone', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Phone Number (Optional)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'tel',
                        value: formData.tenantPhone || '',
                        onChange: (e) => updateFormData('tenantPhone', e.target.value),
                        placeholder: '(555) 123-4567',
                        className: 'form-control'
                    })
                ]),
                React.createElement('div', { key: 'email', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Email Address (Optional)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'email',
                        value: formData.tenantEmail || '',
                        onChange: (e) => updateFormData('tenantEmail', e.target.value),
                        placeholder: 'your.email@example.com',
                        className: 'form-control'
                    })
                ])
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
                        onChange: (e) => updateFormData('leaseStartDate', e.target.value),
                        className: 'form-control'
                    })
                ]),
                React.createElement('div', { key: 'end', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Lease End Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.leaseEndDate || '',
                        onChange: (e) => updateFormData('leaseEndDate', e.target.value),
                        className: 'form-control'
                    })
                ]),
                React.createElement('div', { key: 'moveout', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Move-Out Date'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'date',
                        value: formData.moveOutDate || '',
                        onChange: (e) => updateFormData('moveOutDate', e.target.value),
                        className: 'form-control'
                    })
                ])
            ]),
            
            // Tenancy duration info
            formData.leaseStartDate && formData.leaseEndDate ? 
                React.createElement('div', { key: 'tenancy-info', className: 'info-box' }, [
                    React.createElement('p', { key: 'duration' }, 
                        `Lease Duration: ${Math.floor((new Date(formData.leaseEndDate) - new Date(formData.leaseStartDate)) / (1000 * 60 * 60 * 24 * 30))} months`
                    ),
                    React.createElement('p', { key: 'help' }, 'Longer tenancies often strengthen cases against normal wear and tear charges')
                ]) : null,
            
            // Additional deposit types
            React.createElement('h4', { key: 'additional-deposits' }, 'Additional Deposit Information'),
            React.createElement('div', { key: 'deposit-details', className: 'form-row' }, [
                React.createElement('div', { key: 'pet-deposit', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Pet Deposit (if any)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        min: '0',
                        value: formData.petDeposit || '',
                        onChange: (e) => updateFormData('petDeposit', e.target.value),
                        placeholder: '0.00',
                        className: 'form-control'
                    })
                ]),
                React.createElement('div', { key: 'cleaning-deposit', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'Cleaning Deposit (if any)'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        min: '0',
                        value: formData.cleaningDeposit || '',
                        onChange: (e) => updateFormData('cleaningDeposit', e.target.value),
                        placeholder: '0.00',
                        className: 'form-control'
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

    // Case Assessment tab for legal analysis
    const renderAssessmentTab = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        const calculations = stateData ? window.StateLawUtils.calculateTotalDemand(formData, state) : null;

        // Simple case analysis based on user input
        const analyzeCase = () => {
            let strengths = [];
            let weaknesses = [];
            let recommendations = [];

            if (formData.primaryScenario === 'complete-non-return') {
                strengths.push('Complete non-return of deposit strengthens your legal position');
                if (formData.landlordCommunication === 'no-response') {
                    strengths.push('No landlord response violates communication requirements');
                }
            }

            if (formData.primaryScenario === 'partial-non-return') {
                strengths.push('Partial return shows landlord acknowledges deposit obligation');
                if (formData.landlordCommunication === 'no-itemization') {
                    strengths.push('No itemization provided forfeits landlord\'s right to withhold');
                }
            }

            if (formData.evidenceTypes && formData.evidenceTypes.length > 0) {
                strengths.push(`Strong evidence available: ${formData.evidenceTypes.length} types of documentation`);
            }

            if (!formData.totalDepositAmount) {
                weaknesses.push('Deposit amount not specified - needed for calculations');
            }

            if (!formData.moveOutDate) {
                weaknesses.push('Move-out date not specified - needed to calculate violations');
            }

            if (!formData.evidenceTypes || formData.evidenceTypes.length === 0) {
                recommendations.push('Gather documentation to strengthen your case');
            }

            return { strengths, weaknesses, recommendations };
        };

        const caseAnalysis = analyzeCase();

        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Legal Case Assessment'),
            React.createElement('div', { key: 'help', className: 'help-text' }, 'Analysis of your security deposit case based on your specific situation.'),
            
            // Case strengths
            caseAnalysis.strengths.length > 0 ?
                React.createElement('div', { key: 'strengths', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '✅ Case Strengths'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list strengths' }, 
                        caseAnalysis.strengths.map((strength, index) => 
                            React.createElement('li', { key: index }, strength)
                        )
                    )
                ]) : React.createElement('div', { key: 'no-strengths', className: 'info-box' }, [
                    React.createElement('h4', { key: 'title' }, 'Complete Your Information'),
                    React.createElement('p', { key: 'text' }, 'Fill out your situation details to see your case strengths and legal analysis.')
                ]),

            // Case weaknesses
            caseAnalysis.weaknesses.length > 0 ?
                React.createElement('div', { key: 'weaknesses', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '⚠️ Areas to Address'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list weaknesses' }, 
                        caseAnalysis.weaknesses.map((weakness, index) => 
                            React.createElement('li', { key: index }, weakness)
                        )
                    )
                ]) : null,

            // Recommendations
            caseAnalysis.recommendations.length > 0 ?
                React.createElement('div', { key: 'recommendations', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '💡 Recommendations'),
                    React.createElement('ul', { key: 'list', className: 'analysis-list recommendations' }, 
                        caseAnalysis.recommendations.map((rec, index) => 
                            React.createElement('li', { key: index }, rec)
                        )
                    )
                ]) : null,

            // Financial analysis
            formData.totalDepositAmount && calculations ?
                React.createElement('div', { key: 'financial-analysis', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, '💰 Financial Analysis'),
                    React.createElement('div', { key: 'calculations', className: 'calculation-summary' }, [
                        React.createElement('div', { key: 'deposits', className: 'calculation-row' }, [
                            React.createElement('span', { key: 'label' }, 'Original Deposit:'),
                            React.createElement('span', { key: 'amount' }, `$${calculations.deposits.toFixed(2)}`)
                        ]),
                        calculations.penalty > 0 ?
                            React.createElement('div', { key: 'penalty', className: 'calculation-row' }, [
                                React.createElement('span', { key: 'label' }, 'Statutory Penalties:'),
                                React.createElement('span', { key: 'amount' }, `$${calculations.penalty.toFixed(2)}`)
                            ]) : null,
                        React.createElement('div', { key: 'total', className: 'calculation-row total' }, [
                            React.createElement('span', { key: 'label' }, 'Total Potential Recovery:'),
                            React.createElement('strong', { key: 'amount' }, `$${calculations.total.toFixed(2)}`)
                        ])
                    ])
                ]) : null,

            // State law info
            stateData ?
                React.createElement('div', { key: 'state-specifics', className: 'analysis-section' }, [
                    React.createElement('h4', { key: 'title' }, `⚖️ ${stateData.state} Law Summary`),
                    React.createElement('div', { key: 'content', className: 'state-details' }, [
                        React.createElement('p', { key: 'deadline' }, [
                            React.createElement('strong', null, 'Return Deadline: '),
                            `${stateData.returnDeadline} days from tenancy termination`
                        ]),
                        React.createElement('p', { key: 'penalty' }, [
                            React.createElement('strong', null, 'Violation Penalty: '),
                            stateData.penaltyDescription
                        ]),
                        React.createElement('p', { key: 'citation' }, [
                            React.createElement('strong', null, 'Legal Citation: '),
                            React.createElement('span', { className: 'legal-citation' }, stateData.citation)
                        ])
                    ])
                ]) : null,

            // Professional delivery strategies
            React.createElement('div', { key: 'delivery-tips', className: 'delivery-tips' }, [
                React.createElement('h6', { key: 'title' }, '📮 Professional Delivery Strategy'),
                React.createElement('ul', { key: 'list' }, [
                    React.createElement('li', { key: 'cert-mail' }, [
                        React.createElement('strong', null, 'Certified Mail with Return Receipt: '),
                        'Landlords perceive this as serious escalation. The signed receipt proves they received it and starts the legal clock ticking against them psychologically.'
                    ]),
                    React.createElement('li', { key: 'email-follow' }, [
                        React.createElement('strong', null, 'Email + PDF Copy: '),
                        'Send cert mail first, wait for confirmation, then follow up with email. When people receive physical letter, it creates psychological pressure and makes them feel it\'s getting serious.'
                    ]),
                    React.createElement('li', { key: 'follow-up' }, [
                        React.createElement('strong', null, 'Documentation Trail: '),
                        'Keep postal receipts, email delivery confirmations, and certified mail tracking. This trail becomes evidence in court if needed.'
                    ])
                ])
            ]),

            // Next steps
            React.createElement('div', { key: 'next-steps', className: 'next-steps' }, [
                React.createElement('h4', { key: 'title' }, '📋 Strategic Action Plan'),
                React.createElement('ol', { key: 'list' }, [
                    React.createElement('li', { key: 'review' }, 'Review your generated demand letter for accuracy and completeness'),
                    React.createElement('li', { key: 'gather' }, 'Organize all evidence in chronological order with clear labels'),
                    React.createElement('li', { key: 'send' }, 'Send via certified mail with return receipt AND email with PDF attachment'),
                    React.createElement('li', { key: 'calendar' }, `Mark calendar for ${formData.responseDeadline || 14}-day deadline and prepare for next actions`),
                    React.createElement('li', { key: 'prepare' }, 'If no response, prepare small claims court filing with all documentation ready'),
                    React.createElement('li', { key: 'attorney' }, 'For amounts over $3,000 or complex cases, consult a tenant rights attorney')
                ])
            ]),
            
            React.createElement('div', { key: 'disclaimer', className: 'disclaimer' }, [
                React.createElement('p', { key: 'text' }, 
                    '⚖️ This assessment is for informational purposes only and does not constitute legal advice. ' +
                    'Consult with a qualified attorney for complex cases or significant amounts.'
                )
            ])
        ]);
    };

    // Main tab content renderer
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: return renderScenariosTab();
            case 1: return renderDetailsTab();
            case 2: return renderAssessmentTab();
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
                
                // Action buttons with navigation all on same line
                React.createElement('div', { key: 'actions', className: 'action-buttons' }, [
                    // Navigation buttons
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
                    ]),
                    
                    // Document action buttons
                    React.createElement('button', {
                        key: 'copy',
                        className: 'btn btn-secondary',
                        onClick: () => {
                            if (!hasPaywallAccess) {
                                if (window.PaywallSystem) {
                                    window.PaywallSystem.showAccessDenied('copy');
                                    window.PaywallSystem.createPaywallModal(() => {
                                        if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                                            setHasPaywallAccess(true);
                                            window.PaywallSystem.enablePreviewInteraction();
                                            const content = generateLetterContent().replace(/<[^>]*>/g, '');
                                            window.copyToClipboard(content);
                                        }
                                    });
                                }
                                return;
                            }
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
                        onClick: () => {
                            if (!hasPaywallAccess) {
                                if (window.PaywallSystem) {
                                    window.PaywallSystem.showAccessDenied('download');
                                    window.PaywallSystem.createPaywallModal(() => {
                                        if (window.PaywallSystem && window.PaywallSystem.hasAccess()) {
                                            setHasPaywallAccess(true);
                                            window.PaywallSystem.enablePreviewInteraction();
                                            window.generateWordDoc(generateLetterContent(), formData);
                                        }
                                    });
                                }
                                return;
                            }
                            window.generateWordDoc(generateLetterContent(), formData);
                        }
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'download' }),
                        React.createElement('span', { key: 'text' }, 'Word Doc')
                    ]),
                    
                    React.createElement('button', {
                        key: 'esign',
                        className: 'btn btn-accent',
                        disabled: eSignLoading,
                        onClick: eSignDocument
                    }, [
                        React.createElement(Icon, { 
                            key: 'icon', 
                            name: eSignLoading ? 'loader' : 'edit-3',
                            style: eSignLoading ? { animation: 'spin 1s linear infinite' } : {}
                        }),
                        React.createElement('span', { key: 'text' }, eSignLoading ? 'Processing...' : 'eSignature')
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