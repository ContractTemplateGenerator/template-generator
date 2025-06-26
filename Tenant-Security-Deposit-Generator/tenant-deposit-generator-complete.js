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
        requestAttorneyFees: true
    });

    // Tab definitions
    const tabs = [
        { id: 'property', label: 'Property & Tenancy', icon: 'home' },
        { id: 'deposits', label: 'Deposit & Deductions', icon: 'dollar-sign' },
        { id: 'violations', label: 'Legal Violations', icon: 'alert-triangle' },
        { id: 'delivery', label: 'Letter Tone & Delivery', icon: 'send' },
        { id: 'review', label: 'Review & Finalize', icon: 'check-circle' }
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

    // Tab content renderers
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
                    React.createElement('div', { key: 'not-received', className: 'radio-item' }, [
                        React.createElement('input', {
                            key: 'input',
                            type: 'radio',
                            name: 'itemizedStatement',
                            value: 'not-received',
                            checked: formData.itemizedStatementReceived === 'not-received',
                            onChange: (e) => updateFormData('itemizedStatementReceived', e.target.value)
                        }),
                        React.createElement('div', { key: 'content', className: 'radio-content' }, [
                            React.createElement('strong', { key: 'title' }, 'No Statement Received'),
                            React.createElement('p', { key: 'desc' }, 'Landlord has not provided any itemization (strongest legal position)')
                        ])
                    ]),
                    React.createElement('div', { key: 'inadequate', className: 'radio-item' }, [
                        React.createElement('input', {
                            key: 'input',
                            type: 'radio',
                            name: 'itemizedStatement',
                            value: 'inadequate',
                            checked: formData.itemizedStatementReceived === 'inadequate',
                            onChange: (e) => updateFormData('itemizedStatementReceived', e.target.value)
                        }),
                        React.createElement('div', { key: 'content', className: 'radio-content' }, [
                            React.createElement('strong', { key: 'title' }, 'Inadequate Statement'),
                            React.createElement('p', { key: 'desc' }, 'Statement lacks required details or supporting documentation')
                        ])
                    ]),
                    React.createElement('div', { key: 'disputed', className: 'radio-item' }, [
                        React.createElement('input', {
                            key: 'input',
                            type: 'radio',
                            name: 'itemizedStatement',
                            value: 'disputed',
                            checked: formData.itemizedStatementReceived === 'disputed',
                            onChange: (e) => updateFormData('itemizedStatementReceived', e.target.value)
                        }),
                        React.createElement('div', { key: 'content', className: 'radio-content' }, [
                            React.createElement('strong', { key: 'title' }, 'Statement Received but Disputed'),
                            React.createElement('p', { key: 'desc' }, 'Statement contains improper or excessive charges')
                        ])
                    ])
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
                React.createElement('div', { key: 'normal-wear', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.normalWearCharges,
                        onChange: (e) => updateFormData('normalWearCharges', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Normal Wear and Tear Charges'),
                        React.createElement('p', { key: 'desc' }, 'Charges for normal deterioration from intended use')
                    ])
                ]),
                React.createElement('div', { key: 'cleaning', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.excessiveCleaningFees,
                        onChange: (e) => updateFormData('excessiveCleaningFees', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Excessive Cleaning Fees'),
                        React.createElement('p', { key: 'desc' }, 'Unreasonable or inflated cleaning charges')
                    ])
                ]),
                React.createElement('div', { key: 'painting', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.paintingCosts,
                        onChange: (e) => updateFormData('paintingCosts', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Painting Costs'),
                        React.createElement('p', { key: 'desc' }, 'Repainting for normal wear or cosmetic purposes')
                    ])
                ]),
                React.createElement('div', { key: 'carpet', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.carpetReplacement,
                        onChange: (e) => updateFormData('carpetReplacement', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Carpet Replacement'),
                        React.createElement('p', { key: 'desc' }, 'Carpet replacement due to normal wear')
                    ])
                ]),
                React.createElement('div', { key: 'rent', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.unpaidRentDisputes,
                        onChange: (e) => updateFormData('unpaidRentDisputes', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Disputed Unpaid Rent'),
                        React.createElement('p', { key: 'desc' }, 'Claims for rent that was actually paid')
                    ])
                ]),
                React.createElement('div', { key: 'keys', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.keyReplacement,
                        onChange: (e) => updateFormData('keyReplacement', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Key Replacement Charges'),
                        React.createElement('p', { key: 'desc' }, 'Excessive charges for key replacement')
                    ])
                ]),
                React.createElement('div', { key: 'preexisting', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.preexistingDamage,
                        onChange: (e) => updateFormData('preexistingDamage', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Pre-existing Damage'),
                        React.createElement('p', { key: 'desc' }, 'Charges for damage that existed before tenancy')
                    ])
                ]),
                React.createElement('div', { key: 'other', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.otherDeductions,
                        onChange: (e) => updateFormData('otherDeductions', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Other Improper Deductions'),
                        React.createElement('p', { key: 'desc' }, 'Specify other disputed charges')
                    ])
                ])
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
                React.createElement('div', { key: 'photos', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceMoveInPhotos,
                        onChange: (e) => updateFormData('evidenceMoveInPhotos', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Move-in/Move-out Photos'),
                        React.createElement('p', { key: 'desc' }, 'Photos documenting property condition')
                    ])
                ]),
                React.createElement('div', { key: 'receipts', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceReceipts,
                        onChange: (e) => updateFormData('evidenceReceipts', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Receipts & Payment Records'),
                        React.createElement('p', { key: 'desc' }, 'Proof of deposit payment and rent payments')
                    ])
                ]),
                React.createElement('div', { key: 'communications', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceCommunications,
                        onChange: (e) => updateFormData('evidenceCommunications', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Written Communications'),
                        React.createElement('p', { key: 'desc' }, 'Emails, texts, letters with landlord')
                    ])
                ]),
                React.createElement('div', { key: 'witnesses', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceWitnesses,
                        onChange: (e) => updateFormData('evidenceWitnesses', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Witness Statements'),
                        React.createElement('p', { key: 'desc' }, 'Third-party witnesses to condition/events')
                    ])
                ]),
                React.createElement('div', { key: 'inspection', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceInspectionReport,
                        onChange: (e) => updateFormData('evidenceInspectionReport', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Inspection Reports'),
                        React.createElement('p', { key: 'desc' }, 'Official move-in/move-out inspection documents')
                    ])
                ]),
                React.createElement('div', { key: 'other', className: 'checkbox-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.evidenceOther,
                        onChange: (e) => updateFormData('evidenceOther', e.target.checked)
                    }),
                    React.createElement('div', { key: 'content' }, [
                        React.createElement('strong', { key: 'title' }, 'Other Evidence'),
                        React.createElement('p', { key: 'desc' }, 'Specify other supporting documentation')
                    ])
                ])
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

    const renderDeliveryTab = () => {
        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Letter Tone & Delivery'),
            
            React.createElement('h4', { key: 'tone-title' }, 'Letter Tone'),
            React.createElement('p', { key: 'tone-desc' }, 'Choose the tone that best fits your situation:'),
            
            React.createElement('div', { key: 'tone-options', className: 'radio-group' }, [
                React.createElement('div', { key: 'professional', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'letterTone',
                        value: 'professional',
                        checked: formData.letterTone === 'professional',
                        onChange: (e) => updateFormData('letterTone', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Professional & Courteous'),
                        React.createElement('p', { key: 'desc' }, 'Respectful tone for first-time communication or ongoing relationships')
                    ])
                ]),
                React.createElement('div', { key: 'firm', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'letterTone',
                        value: 'firm',
                        checked: formData.letterTone === 'firm',
                        onChange: (e) => updateFormData('letterTone', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Firm & Direct'),
                        React.createElement('p', { key: 'desc' }, 'Strong but professional tone when previous attempts have failed')
                    ])
                ]),
                React.createElement('div', { key: 'litigation', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'letterTone',
                        value: 'litigation',
                        checked: formData.letterTone === 'litigation',
                        onChange: (e) => updateFormData('letterTone', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Litigation-Ready'),
                        React.createElement('p', { key: 'desc' }, 'Formal legal tone as final notice before court action')
                    ])
                ])
            ]),
            
            React.createElement('h4', { key: 'delivery-title' }, 'Delivery Method'),
            
            React.createElement('div', { key: 'delivery-options', className: 'radio-group' }, [
                React.createElement('div', { key: 'email', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'deliveryMethod',
                        value: 'email',
                        checked: formData.deliveryMethod === 'email',
                        onChange: (e) => updateFormData('deliveryMethod', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Email'),
                        React.createElement('p', { key: 'desc' }, 'Fast delivery with read receipts (if available)')
                    ])
                ]),
                React.createElement('div', { key: 'certified', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'deliveryMethod',
                        value: 'certified-mail',
                        checked: formData.deliveryMethod === 'certified-mail',
                        onChange: (e) => updateFormData('deliveryMethod', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Certified Mail'),
                        React.createElement('p', { key: 'desc' }, 'Legal proof of delivery (recommended for litigation)') 
                    ])
                ]),
                React.createElement('div', { key: 'both', className: 'radio-item' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'radio',
                        name: 'deliveryMethod',
                        value: 'both',
                        checked: formData.deliveryMethod === 'both',
                        onChange: (e) => updateFormData('deliveryMethod', e.target.value)
                    }),
                    React.createElement('div', { key: 'content', className: 'radio-content' }, [
                        React.createElement('strong', { key: 'title' }, 'Email + Certified Mail'),
                        React.createElement('p', { key: 'desc' }, 'Maximum legal protection and speed')
                    ])
                ])
            ]),
            
            React.createElement('h4', { key: 'cc-title' }, 'Copy Recipients'),
            
            React.createElement('div', { key: 'cc-checkbox', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.ccRecipients,
                        onChange: (e) => updateFormData('ccRecipients', e.target.checked)
                    }),
                    ' Send copies to additional recipients'
                ]),
                React.createElement('div', { key: 'help', className: 'help-text' }, 
                    'Consider copying your attorney, tenant rights organization, or property management company'
                )
            ]),
            
            formData.ccRecipients ?
                React.createElement('div', { key: 'cc-text', className: 'form-group' }, [
                    React.createElement('label', { key: 'label' }, 'CC Recipients'),
                    React.createElement('textarea', {
                        key: 'textarea',
                        value: formData.ccRecipientsText,
                        onChange: (e) => updateFormData('ccRecipientsText', e.target.value),
                        placeholder: 'List names and roles of copy recipients (e.g., "John Smith, Attorney; Local Tenant Rights Organization")',
                        rows: 3
                    })
                ]) : null
        ]);
    };

    const renderReviewTab = () => {
        const state = formData.rentalState;
        const stateData = window.STATE_LAWS ? window.STATE_LAWS[state] : null;
        const calculations = stateData ? window.StateLawUtils.calculateTotalDemand(formData, state) : null;

        return React.createElement('div', { className: 'tab-content' }, [
            React.createElement('h3', { key: 'title' }, 'Review & Finalize'),
            
            React.createElement('h4', { key: 'deadline-title' }, 'Response Deadline'),
            
            React.createElement('div', { key: 'deadline', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, 'Days to respond to this demand letter'),
                React.createElement('input', {
                    key: 'input',
                    type: 'number',
                    min: '7',
                    max: '30',
                    value: formData.responseDeadline,
                    onChange: (e) => updateFormData('responseDeadline', e.target.value)
                }),
                React.createElement('div', { key: 'help', className: 'help-text' }, 
                    'Recommended: 14-21 days for reasonable response time'
                )
            ]),
            
            React.createElement('h4', { key: 'legal-title' }, 'Legal Action Threats'),
            
            React.createElement('div', { key: 'small-claims', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.includeSmallClaimsThreat,
                        onChange: (e) => updateFormData('includeSmallClaimsThreat', e.target.checked)
                    }),
                    ' Include threat of small claims court action'
                ]),
                React.createElement('div', { key: 'help', className: 'help-text' }, 
                    'Strong deterrent - shows you are serious about pursuing legal action'
                )
            ]),
            
            React.createElement('div', { key: 'attorney-fees', className: 'form-group' }, [
                React.createElement('label', { key: 'label' }, [
                    React.createElement('input', {
                        key: 'input',
                        type: 'checkbox',
                        checked: formData.requestAttorneyFees,
                        onChange: (e) => updateFormData('requestAttorneyFees', e.target.checked)
                    }),
                    ' Request attorney fees and court costs'
                ]),
                React.createElement('div', { key: 'help', className: 'help-text' }, 
                    'Available in most states for security deposit violations'
                )
            ]),
            
            calculations ? 
                React.createElement('div', { key: 'final-calculation', className: 'calculation-summary' }, [
                    React.createElement('h4', { key: 'title' }, 'Final Demand Summary'),
                    React.createElement('div', { key: 'deposits', className: 'calculation-row' }, [
                        React.createElement('span', { key: 'label' }, 'Total Deposits:'),
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
                        React.createElement('span', { key: 'label' }, 'TOTAL DEMAND:'),
                        React.createElement('strong', { key: 'amount' }, `$${calculations.total.toFixed(2)}`)
                    ])
                ]) : null,
            
            React.createElement('div', { key: 'next-steps', className: 'next-steps' }, [
                React.createElement('h4', { key: 'title' }, 'Next Steps'),
                React.createElement('ol', { key: 'list' }, [
                    React.createElement('li', { key: 'review' }, 'Review the letter preview carefully'),
                    React.createElement('li', { key: 'download' }, 'Download or copy the letter'),
                    React.createElement('li', { key: 'send' }, `Send via ${formData.deliveryMethod === 'email' ? 'email' : formData.deliveryMethod === 'certified-mail' ? 'certified mail' : 'email and certified mail'}`),
                    React.createElement('li', { key: 'wait' }, `Wait ${formData.responseDeadline} days for response`),
                    React.createElement('li', { key: 'file' }, 'If no response, consider filing in small claims court')
                ])
            ]),
            
            React.createElement('div', { key: 'disclaimer', className: 'disclaimer' }, [
                React.createElement('p', { key: 'text' }, 
                    '⚠️ This tool provides general legal information only and does not constitute legal advice. ' +
                    'Consult with a qualified attorney for advice specific to your situation.'
                )
            ])
        ]);
    };

    // Main tab content renderer
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: return renderPropertyTab();
            case 1: return renderDepositsTab();
            case 2: return renderViolationsTab();
            case 3: return renderDeliveryTab();
            case 4: return renderReviewTab();
            default: return renderPropertyTab();
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