// Tenant Security Deposit Demand Letter Generator - React Component (Fixed)
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
    
    // Form data state
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

    // Auto-scroll to highlighted content
    useEffect(() => {
        if (lastChanged && previewRef.current) {
            const highlightedElements = previewRef.current.querySelectorAll('.highlight');
            if (highlightedElements.length > 0) {
                highlightedElements[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    }, [lastChanged]);

    // Generate letter content
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
        
        return `
            <div class="letterhead">
                <h1>DEMAND FOR RETURN OF SECURITY DEPOSIT</h1>
            </div>
            
            <div class="date">
                ${today}
            </div>
            
            <div class="address">
                To: ${formData.landlordName || '[LANDLORD NAME]'}${formData.landlordCompany ? '<br>' + formData.landlordCompany : ''}<br>
                ${formData.landlordAddress || '[LANDLORD ADDRESS]'}<br>
                ${formData.landlordCity || '[CITY]'}, ${formData.landlordState || 'CA'} ${formData.landlordZip || '[ZIP]'}
            </div>
            
            <p><strong>Re: Demand for Return of Security Deposit</strong><br>
            <strong>Rental Property:</strong> ${formData.rentalAddress || '[RENTAL ADDRESS]'}, ${formData.rentalCity || '[CITY]'}, ${formData.rentalState || 'CA'}</p>
            
            <p>Dear ${formData.landlordName || '[LANDLORD NAME]'},</p>
            
            <p>I am writing to formally demand the immediate return of my security deposit in the amount of <span class="demand-amount">$${calculations.total.toFixed(2)}</span>, as required under <span class="legal-citation">${stateData.citation}</span>.</p>
            
            <h2>TENANCY DETAILS</h2>
            <p>• Tenant: ${formData.tenantName || '[TENANT NAME]'}<br>
            • Lease Period: ${formData.leaseStartDate || '[START DATE]'} to ${formData.leaseEndDate || '[END DATE]'}<br>
            • Move-Out Date: ${formData.moveOutDate || '[MOVE OUT DATE]'}<br>
            • Security Deposit: $${formData.securityDeposit || '0'}</p>
            
            <h2>LEGAL VIOLATION</h2>
            <p>Under ${stateData.citation}, you were required to return my security deposit within ${stateData.returnDeadline} days of the termination of my tenancy. As of today, <span class="deadline-notice">${calculations.daysPassed} days have passed</span> since the required return date.</p>
            
            <h2>DEMAND FOR PAYMENT</h2>
            <p>I hereby demand payment of:</p>
            <ul>
                <li>Security Deposit: $${calculations.deposits.toFixed(2)}</li>
                ${calculations.penalty > 0 ? `<li>Statutory Penalty: $${calculations.penalty.toFixed(2)}</li>` : ''}
                ${calculations.interest > 0 ? `<li>Interest: $${calculations.interest.toFixed(2)}</li>` : ''}
                <li><strong>TOTAL AMOUNT DUE: $${calculations.total.toFixed(2)}</strong></li>
            </ul>
            
            <p>You have ${formData.responseDeadline || 14} days from receipt of this letter to comply with this demand. Failure to return the full amount will result in legal action in small claims court, where I will seek the above amount plus court costs and attorney fees as permitted by law.</p>
            
            <div class="signature-block">
                <p>Sincerely,</p>
                <br>
                <p>${formData.tenantName || '[YOUR NAME]'}<br>
                ${formData.tenantCurrentAddress || '[YOUR CURRENT ADDRESS]'}<br>
                ${formData.tenantCity || '[CITY]'}, ${formData.tenantState || 'CA'} ${formData.tenantZip || '[ZIP]'}</p>
            </div>
        `;
    };

    // Simple tab renderer
    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return React.createElement('div', { className: 'tab-content' }, [
                    React.createElement('h3', { key: 'title' }, 'Property & Tenancy Details'),
                    React.createElement('div', { key: 'content', className: 'form-group' }, [
                        React.createElement('label', { key: 'label' }, 'Tenant Name'),
                        React.createElement('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.tenantName,
                            onChange: (e) => updateFormData('tenantName', e.target.value),
                            placeholder: 'Your full name'
                        })
                    ])
                ]);
            default:
                return React.createElement('div', { className: 'tab-content' }, 
                    React.createElement('p', null, 'Tab content under development...'));
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
                    }, 'Copy Letter'),
                    
                    React.createElement('button', {
                        key: 'download',
                        className: 'btn btn-primary',
                        onClick: () => window.generateWordDoc(generateLetterContent(), formData)
                    }, 'Download Word Doc')
                ])
            ]),
            
            // Preview pane
            React.createElement('div', { key: 'preview', className: 'preview-pane' }, [
                React.createElement('div', { key: 'header', className: 'preview-header' },
                    React.createElement('h3', null, 'Letter Preview')
                ),
                React.createElement('div', {
                    key: 'content',
                    className: 'preview-content',
                    ref: previewRef,
                    dangerouslySetInnerHTML: { 
                        __html: generateLetterContent()
                    }
                })
            ])
        ])
    ]);
};

// Export the component for use in index.html
window.TenantDepositGenerator = TenantDepositGenerator;