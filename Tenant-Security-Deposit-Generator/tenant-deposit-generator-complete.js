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
        
        // Selected scenario tracking
        selectedScenario: null
    });

    // Tab definitions
    const tabs = [
        { id: 'scenarios', label: 'Letter Scenarios', icon: 'zap' },
        { id: 'property', label: 'Property & Tenancy', icon: 'home' },
        { id: 'deposits', label: 'Deposit & Deductions', icon: 'dollar-sign' },
        { id: 'violations', label: 'Legal Violations', icon: 'alert-triangle' },
        { id: 'assessment', label: 'Case Assessment', icon: 'shield-check' }
    ];

    // Update form data and trigger highlighting
    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setLastChanged(field);
        
        // Clear highlighting after 2 seconds
        setTimeout(() => setLastChanged(null), 2000);
    };

    // Auto-scroll to highlighted content within preview pane
    useEffect(() => {
        if (lastChanged && previewRef.current) {
            const highlightedElements = previewRef.current.querySelectorAll('.highlight');
            if (highlightedElements.length > 0) {
                const element = highlightedElements[0];
                const container = previewRef.current;
                
                // Get the position of the highlighted element relative to the container
                const elementRect = element.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top;
                
                // Scroll the container to center the highlighted element
                container.scrollTo({
                    top: container.scrollTop + relativeTop - container.clientHeight / 2,
                    behavior: 'smooth'
                });
            }
        }
    }, [lastChanged]);

    // Helper function for clickable checkbox/radio items
    const createClickableItem = (type, fieldName, value, title, description, checked, extraClassName = '') => {
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
            onClick: () => {
                if (type === 'checkbox') {
                    updateFormData(fieldName, !checked);
                } else {
                    updateFormData(fieldName, value);
                }
            }
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
                <div class="letterhead">
                    <h1>SECURITY DEPOSIT DEMAND LETTER</h1>
                </div>
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

        // Build disputed deductions list
        let disputedDeductions = [];
        if (formData.normalWearCharges) disputedDeductions.push("Normal wear and tear charges");
        if (formData.excessiveCleaningFees) disputedDeductions.push("Excessive cleaning fees");
        if (formData.paintingCosts) disputedDeductions.push("Painting costs for normal wear");
        if (formData.carpetReplacement) disputedDeductions.push("Carpet replacement for normal wear");
        if (formData.unpaidRentDisputes) disputedDeductions.push("Disputed unpaid rent claims");
        if (formData.keyReplacement) disputedDeductions.push("Key replacement charges");
        if (formData.preexistingDamage) disputedDeductions.push("Charges for pre-existing damage");
        if (formData.otherDeductions && formData.otherDeductionsText) {
            disputedDeductions.push(formData.otherDeductionsText);
        }

        // Build evidence list
        let evidenceItems = [];
        if (formData.evidenceMoveInPhotos) evidenceItems.push("Move-in photos documenting property condition");
        if (formData.evidenceReceipts) evidenceItems.push("Receipts and payment records");
        if (formData.evidenceCommunications) evidenceItems.push("Written communications with landlord");
        if (formData.evidenceWitnesses) evidenceItems.push("Witness statements");
        if (formData.evidenceInspectionReport) evidenceItems.push("Move-in/move-out inspection reports");
        if (formData.evidenceOther && formData.evidenceOtherText) {
            evidenceItems.push(formData.evidenceOtherText);
        }
        
        return `
            <div class="letterhead">
                <h1>DEMAND FOR RETURN OF SECURITY DEPOSIT</h1>
            </div>
            
            <div class="date">
                ${today}
            </div>
            
            <div class="address">
                ${greeting}: ${formData.landlordName || '[LANDLORD NAME]'}${formData.landlordCompany ? '<br>' + formData.landlordCompany : ''}<br>
                ${formData.landlordAddress || '[LANDLORD ADDRESS]'}<br>
                ${formData.landlordCity || '[CITY]'}, ${formData.landlordState || 'CA'} ${formData.landlordZip || '[ZIP]'}
            </div>
            
            <p><strong>Re: Demand for Return of Security Deposit</strong><br>
            <strong>Former Tenant:</strong> ${formData.tenantName || '[TENANT NAME]'}<br>
            <strong>Rental Property:</strong> ${formData.rentalAddress || '[RENTAL ADDRESS]'}${formData.rentalUnit ? ', Unit ' + formData.rentalUnit : ''}, ${formData.rentalCity || '[CITY]'}, ${formData.rentalState || 'CA'}</p>
            
            <p>${greeting} ${formData.landlordName || '[LANDLORD NAME]'},</p>
            
            <p>${urgencyLevel} the immediate return of my security deposit in the amount of <span class="demand-amount">$${calculations.total.toFixed(2)}</span>, as required under <span class="legal-citation">${stateData.citation}</span>.</p>
            
            <h2>TENANCY DETAILS</h2>
            <p>• Tenant: ${formData.tenantName || '[TENANT NAME]'}<br>
            • Lease Period: ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}<br>
            • Move-Out Date: ${formData.moveOutDate || '[MOVE OUT DATE]'}<br>
            ${formData.keyReturnDate ? `• Keys Returned: ${formData.keyReturnDate}<br>` : ''}
            ${formData.forwardingAddressDate ? `• Forwarding Address Provided: ${formData.forwardingAddressDate} (via ${formData.forwardingAddressMethod})<br>` : ''}
            • Security Deposit Paid: $${formData.securityDeposit || '0'}${formData.petDeposit ? '<br>• Pet Deposit: $' + formData.petDeposit : ''}${formData.cleaningDeposit ? '<br>• Cleaning Deposit: $' + formData.cleaningDeposit : ''}</p>
            
            <h2>LEGAL VIOLATION</h2>
            <p>Under <span class="legal-citation">${stateData.citation}</span>, you were required to return my security deposit ${formData.itemizedStatementReceived !== 'not-received' ? 'or provide an itemized statement of deductions ' : ''}within <strong>${stateData.returnDeadline} days</strong> of the termination of my tenancy.</p>
            
            <p>As of today, <span class="deadline-notice">${calculations.daysPassed} days have passed</span> since the required return date${calculations.daysPassed > stateData.returnDeadline ? ', constituting a violation of state law' : ''}.</p>
            
            ${formData.itemizedStatementReceived !== 'not-received' ? 
                `<p><strong>Itemized Statement Issues:</strong> ${formData.itemizedStatementReceived === 'inadequate' ? 'The itemized statement provided was inadequate and did not comply with legal requirements.' : formData.itemizedStatementReceived === 'disputed' ? 'I dispute the deductions listed in your itemized statement.' : ''}</p>` : 
                `<p><strong>No Itemization Provided:</strong> You have failed to provide the required itemized statement of deductions, which under ${stateData.citation} forfeits your right to withhold any portion of the deposit.</p>`
            }
            
            ${disputedDeductions.length > 0 ? `
            <h2>DISPUTED DEDUCTIONS</h2>
            <p>I specifically dispute the following deductions as improper under state law:</p>
            <ul>
                ${disputedDeductions.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p>These charges violate the prohibition against deducting for normal wear and tear under ${stateData.normalWearDefinition ? '<span class="legal-citation">' + stateData.citation + '</span>' : 'state law'}.</p>
            ` : ''}
            
            <h2>STATUTORY PENALTIES</h2>
            <p>Due to your failure to comply with state law, you are now liable for statutory penalties under <span class="legal-citation">${stateData.citation}</span>:</p>
            <ul>
                <li>Original Security Deposit: $${calculations.deposits.toFixed(2)}</li>
                ${calculations.penalty > 0 ? `<li>Statutory Penalty (${stateData.penaltyDescription}): $${calculations.penalty.toFixed(2)}</li>` : ''}
                ${calculations.interest > 0 ? `<li>Interest: $${calculations.interest.toFixed(2)}</li>` : ''}
                ${formData.requestAttorneyFees ? '<li>Attorney fees and court costs (if legal action is required)</li>' : ''}
            </ul>
            <p><strong>TOTAL AMOUNT DUE: <span class="demand-amount">$${calculations.total.toFixed(2)}</span></strong></p>
            
            ${evidenceItems.length > 0 ? `
            <h2>SUPPORTING EVIDENCE</h2>
            <p>I have the following evidence to support my claim:</p>
            <ul>
                ${evidenceItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ` : ''}
            
            ${formData.priorCommunications ? `
            <h2>PRIOR COMMUNICATIONS</h2>
            <p>${formData.priorCommunicationsDescription || 'Previous attempts have been made to resolve this matter amicably.'}</p>
            ` : ''}
            
            <h2>DEMAND FOR PAYMENT</h2>
            <p><strong>You have ${formData.responseDeadline || 14} days from receipt of this letter to pay the full amount of $${calculations.total.toFixed(2)}.</strong></p>
            
            ${formData.includeSmallClaimsThreat ? `
            <p>If you fail to comply with this demand within the specified timeframe, I will file a lawsuit in small claims court seeking:</p>
            <ul>
                <li>The full amount of $${calculations.total.toFixed(2)}</li>
                <li>Court costs and filing fees</li>
                ${formData.requestAttorneyFees ? '<li>Attorney fees as permitted by law</li>' : ''}
                <li>Any additional damages permitted under ${stateData.citation}</li>
            </ul>
            ` : ''}
            
            <p>${closingTone}</p>
            
            <div class="signature-block">
                <p>Sincerely,</p>
                <br><br>
                <p>_________________________<br>
                ${formData.tenantName || '[YOUR NAME]'}<br>
                ${formData.tenantCurrentAddress || '[YOUR CURRENT ADDRESS]'}<br>
                ${formData.tenantCity || '[CITY]'}, ${formData.tenantState || 'CA'} ${formData.tenantZip || '[ZIP]'}</p>
            </div>
            
            ${formData.deliveryMethod === 'certified-mail' ? `
            <div class="enclosures">
                <p><strong>Delivery Method:</strong> Certified Mail, Return Receipt Requested</p>
            </div>
            ` : ''}
            
            ${formData.ccRecipients && formData.ccRecipientsText ? `
            <div class="enclosures">
                <p><strong>cc:</strong> ${formData.ccRecipientsText}</p>
            </div>
            ` : ''}
        `;
    };

    // Real-world scenario presets based on actual deposit disputes
    const scenarios = [
        {
            id: 'complete-non-return',
            title: 'Complete Non-Return of Deposit',
            description: 'Landlord failed to return any portion of security deposit within legal deadline',
            situation: 'No deposit returned',
            useCase: 'Landlord missed legal deadline completely',
            sample: 'You have failed to return my security deposit within the legally required timeframe...',
            data: { 
                itemizedStatementReceived: 'not-received',
                normalWearCharges: false,
                excessiveCleaningFees: false,
                paintingCosts: false,
                carpetReplacement: false,
                includeSmallClaimsThreat: true,
                requestAttorneyFees: true,
                responseDeadline: 10
            }
        },
        {
            id: 'improper-wear-tear',
            title: 'Improper Wear & Tear Charges',
            description: 'Landlord deducted for normal wear and tear items that are legally prohibited',
            situation: 'Illegal deductions made',
            useCase: 'Charged for painting, carpet wear, minor scuffs, or normal aging',
            sample: 'The deductions you have taken for normal wear and tear violate state law...',
            data: { 
                itemizedStatementReceived: 'received',
                normalWearCharges: true,
                paintingCosts: true,
                carpetReplacement: true,
                evidenceMoveInPhotos: true,
                includeSmallClaimsThreat: true,
                requestAttorneyFees: true,
                responseDeadline: 14
            }
        },
        {
            id: 'no-itemization',
            title: 'No Itemization Provided',
            description: 'Landlord withheld deposit without providing required detailed itemization',
            situation: 'Missing itemized list',
            useCase: 'Partial return with no explanation or receipts for deductions',
            sample: 'You have failed to provide the legally required itemized statement of deductions...',
            data: { 
                itemizedStatementReceived: 'not-received',
                normalWearCharges: false,
                excessiveCleaningFees: false,
                includeSmallClaimsThreat: true,
                requestAttorneyFees: true,
                responseDeadline: 7
            }
        },
        {
            id: 'excessive-fees',
            title: 'Excessive Cleaning Charges',
            description: 'Unreasonable cleaning fees far exceeding normal market rates',
            situation: 'Inflated cleaning costs',
            useCase: 'Professional cleaning bills that seem excessive or suspicious',
            sample: 'The cleaning charges you have assessed are unreasonable and excessive...',
            data: { 
                itemizedStatementReceived: 'received',
                excessiveCleaningFees: true,
                evidenceReceipts: true,
                evidenceCommunications: true,
                includeSmallClaimsThreat: true,
                requestAttorneyFees: true,
                responseDeadline: 14
            }
        }
    ];

    // Tab content renderers
    const renderScenariosTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Choose Your Situation'),
            React.createElement('p', { key: 'subtitle' }, 'Select the scenario that best matches your deposit dispute:'),
            
            // Tone selector section
            React.createElement('div', { key: 'tone-section', className: 'form-group' }, [
                React.createElement('h4', { key: 'tone-title' }, 'Letter Tone'),
                React.createElement('p', { key: 'tone-subtitle', className: 'help-text' }, 'Choose the tone that matches your relationship with the landlord:'),
                React.createElement('div', { key: 'tone-options', className: 'radio-group' }, [
                    createClickableItem('radio', 'letterTone', 'professional', 'Professional & Respectful', 'Diplomatic approach for first contact or cooperative landlords', formData.letterTone === 'professional'),
                    createClickableItem('radio', 'letterTone', 'firm', 'Firm & Direct', 'Business-like tone when initial requests were ignored', formData.letterTone === 'firm'),
                    createClickableItem('radio', 'letterTone', 'litigation', 'Legal Warning', 'Formal notice threatening legal action as final step', formData.letterTone === 'litigation')
                ])
            ]),
            
            React.createElement('div', { key: 'scenarios-grid', className: 'scenarios-grid' }, 
                scenarios.map(scenario => 
                    React.createElement('div', {
                        key: scenario.id,
                        className: `scenario-card ${formData.selectedScenario === scenario.id ? 'selected' : ''}`,
                        onClick: () => {
                            // Apply scenario data to form
                            Object.keys(scenario.data).forEach(key => {
                                updateFormData(key, scenario.data[key]);
                            });
                            updateFormData('selectedScenario', scenario.id);
                        }
                    }, [
                        React.createElement('div', { key: 'header', className: 'scenario-header' }, [
                            React.createElement('h4', { key: 'title' }, scenario.title),
                            React.createElement('span', { key: 'situation', className: `tone-badge tone-${scenario.id}` }, scenario.situation)
                        ]),
                        React.createElement('p', { key: 'description', className: 'scenario-description' }, scenario.description),
                        React.createElement('div', { key: 'use-case', className: 'scenario-use-case' }, [
                            React.createElement('strong', { key: 'label' }, 'Best for: '),
                            React.createElement('span', { key: 'text' }, scenario.useCase)
                        ]),
                        React.createElement('div', { key: 'sample', className: 'scenario-sample' }, [
                            React.createElement('strong', { key: 'label' }, 'Sample opening: '),
                            React.createElement('em', { key: 'text' }, scenario.sample)
                        ]),
                        React.createElement('button', {
                            key: 'btn',
                            className: 'scenario-btn',
                            onClick: (e) => {
                                e.stopPropagation();
                                Object.keys(scenario.data).forEach(key => {
                                    updateFormData(key, scenario.data[key]);
                                });
                                updateFormData('selectedScenario', scenario.id);
                                setCurrentTab(1); // Move to Property tab
                            }
                        }, `Use This Scenario`)
                    ])
                )
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
            
            riskAssessment ?
                React.createElement('div', { key: 'risk-assessment', className: `risk-assessment ${riskAssessment.color}` }, [
                    React.createElement('h4', { key: 'title' }, `Case Strength Assessment: ${riskAssessment.level.toUpperCase()}`),
                    React.createElement('div', { key: 'details', className: 'assessment-details' }, [
                        React.createElement('div', { key: 'score', className: 'assessment-item' }, 
                            React.createElement('strong', null, `Strength Score: ${riskAssessment.score}/6`)
                        ),
                        React.createElement('div', { key: 'recommendation', className: 'assessment-item' }, 
                            React.createElement('strong', null, riskAssessment.recommendation)
                        )
                    ]),
                    riskAssessment.factors.length > 0 ?
                        React.createElement('div', { key: 'factors' }, [
                            React.createElement('p', { key: 'title' }, React.createElement('strong', null, 'Factors in your favor:')),
                            React.createElement('ul', { key: 'list' }, 
                                riskAssessment.factors.map((factor, index) => 
                                    React.createElement('li', { key: index }, factor)
                                )
                            )
                        ]) : null
                ]) : null
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
            React.createElement('p', { key: 'subtitle' }, 'Attorney-level analysis of your security deposit case based on your specific situation:'),
            
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
                    React.createElement('h4', { key: 'title' }, '💡 Attorney Recommendations'),
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
                
                // Action buttons
                React.createElement('div', { key: 'actions', className: 'action-buttons' }, [
                    React.createElement('button', {
                        key: 'copy',
                        className: 'btn btn-secondary',
                        onClick: () => {
                            const content = generateLetterContent().replace(/<[^>]*>/g, '');
                            window.copyToClipboard(content);
                        }
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'copy' }),
                        React.createElement('span', { key: 'text' }, 'Copy Letter')
                    ]),
                    
                    React.createElement('button', {
                        key: 'download',
                        className: 'btn btn-primary',
                        onClick: () => window.generateWordDoc(generateLetterContent(), formData)
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'download' }),
                        React.createElement('span', { key: 'text' }, 'Download Word Doc')
                    ]),
                    
                    React.createElement('button', {
                        key: 'esign',
                        className: 'btn btn-accent',
                        disabled: eSignLoading,
                        onClick: async () => {
                            setESignLoading(true);
                            try {
                                await window.initiateESign(generateLetterContent(), formData);
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
                    ]),
                    
                    React.createElement('button', {
                        key: 'consult',
                        className: 'btn btn-secondary',
                        onClick: () => window.openConsultationCalendar()
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'calendar' }),
                        React.createElement('span', { key: 'text' }, 'Schedule Consultation')
                    ])
                ])
            ]),
            
            // Preview pane
            React.createElement('div', { key: 'preview', className: 'preview-pane' }, [
                React.createElement('div', { key: 'header', className: 'preview-header' }, [
                    React.createElement('h3', { key: 'title' }, 'Letter Preview'),
                    React.createElement('div', { key: 'actions' }, [
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
                    ])
                ]),
                React.createElement('div', {
                    key: 'content',
                    className: 'preview-content',
                    ref: previewRef,
                    dangerouslySetInnerHTML: { 
                        __html: generateLetterContent().replace(
                            new RegExp(`(${lastChanged && formData[lastChanged] ? formData[lastChanged].toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : 'NOMATCH'})`, 'gi'),
                            lastChanged && formData[lastChanged] ? '<span class="highlight">$1</span>' : '$1'
                        )
                    }
                })
            ])
        ])
    ]);
};

// Export the component for use in index.html
window.TenantDepositGenerator = TenantDepositGenerator;