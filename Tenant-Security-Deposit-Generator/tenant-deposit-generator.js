// Tenant Security Deposit Demand Letter Generator - React Component
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
        const stateData = window.STATE_LAWS[state];
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
                urgencyLevel = "I hereby formally demand";
                break;
            default:
                greeting = "To";
                closingTone = "I expect your immediate attention to this matter.";
                urgencyLevel = "I demand";
        }

        // Build disputed deductions list
        const disputedItems = [];
        if (formData.normalWearCharges) disputedItems.push("charges for normal wear and tear");
        if (formData.excessiveCleaningFees) disputedItems.push("excessive cleaning fees");
        if (formData.paintingCosts) disputedItems.push("painting/repainting costs");
        if (formData.carpetReplacement) disputedItems.push("carpet replacement (normal wear)");
        if (formData.unpaidRentDisputes) disputedItems.push("disputed unpaid rent charges");
        if (formData.keyReplacement) disputedItems.push("key/remote replacement fees");
        if (formData.preexistingDamage) disputedItems.push("repairs for pre-existing damage");
        if (formData.otherDeductions && formData.otherDeductionsText) {
            disputedItems.push(formData.otherDeductionsText);
        }

        // Build evidence list
        const evidenceItems = [];
        if (formData.evidenceMoveInPhotos) evidenceItems.push("Move-in condition photographs");
        if (formData.evidenceReceipts) evidenceItems.push("Receipts and documentation");
        if (formData.evidenceCommunications) evidenceItems.push("Written communications");
        if (formData.evidenceWitnesses) evidenceItems.push("Witness statements");
        if (formData.evidenceInspectionReport) evidenceItems.push("Move-out inspection report");
        if (formData.evidenceOther && formData.evidenceOtherText) {
            evidenceItems.push(formData.evidenceOtherText);
        }

        return `
<div class="letterhead">
    <h1>DEMAND FOR RETURN OF SECURITY DEPOSIT</h1>
</div>

<div class="date">
    <p>${today}</p>
</div>

<div class="address">
    <p><strong>${greeting}:</strong></p>
    <p>${formData.landlordName}${formData.landlordCompany ? `<br>${formData.landlordCompany}` : ''}<br>
    ${formData.landlordAddress}<br>
    ${formData.landlordCity}, ${formData.landlordState} ${formData.landlordZip}</p>
</div>

<p><strong>RE: Demand for Return of Security Deposit</strong><br>
<strong>Property Address:</strong> ${formData.rentalAddress}${formData.rentalUnit ? `, Unit ${formData.rentalUnit}` : ''}, ${formData.rentalCity}, ${formData.rentalState} ${formData.rentalZip}<br>
<strong>Tenant(s):</strong> ${formData.tenantName}<br>
<strong>Lease Period:</strong> ${formData.leaseStartDate ? new Date(formData.leaseStartDate).toLocaleDateString() : '[Start Date]'} to ${formData.leaseEndDate ? new Date(formData.leaseEndDate).toLocaleDateString() : '[End Date]'}<br>
<strong>Move-Out Date:</strong> ${formData.moveOutDate ? new Date(formData.moveOutDate).toLocaleDateString() : '[Move-Out Date]'}</p>

<h2>LEGAL DEMAND</h2>

<p>${urgencyLevel} the immediate return of my security deposit in the amount of <span class="demand-amount">$${calculations.total.toLocaleString()}</span>, which consists of:</p>

<ul>
    <li>Security Deposit: $${(parseFloat(formData.securityDeposit) || 0).toLocaleString()}</li>
    ${formData.petDeposit ? `<li>Pet Deposit: $${(parseFloat(formData.petDeposit) || 0).toLocaleString()}</li>` : ''}
    ${formData.cleaningDeposit ? `<li>Cleaning Deposit: $${(parseFloat(formData.cleaningDeposit) || 0).toLocaleString()}</li>` : ''}
    ${calculations.penalty > 0 ? `<li>Statutory Penalty: $${calculations.penalty.toLocaleString()}</li>` : ''}
    ${calculations.interest > 0 ? `<li>Interest: $${calculations.interest.toLocaleString()}</li>` : ''}
</ul>

<h2>FACTUAL BACKGROUND</h2>

<p>I was a tenant at the above-referenced property from ${formData.leaseStartDate ? new Date(formData.leaseStartDate).toLocaleDateString() : '[Start Date]'} to ${formData.leaseEndDate ? new Date(formData.leaseEndDate).toLocaleDateString() : '[End Date]'}. I vacated the premises on ${formData.moveOutDate ? new Date(formData.moveOutDate).toLocaleDateString() : '[Move-Out Date]'} and returned all keys on ${formData.keyReturnDate ? new Date(formData.keyReturnDate).toLocaleDateString() : '[Key Return Date]'}.</p>

${formData.forwardingAddressDate ? `<p>I provided my forwarding address via ${formData.forwardingAddressMethod} on ${new Date(formData.forwardingAddressDate).toLocaleDateString()}, in compliance with state law requirements.</p>` : ''}

${formData.itemizedStatementReceived === 'not-received' 
    ? `<p>To date, you have failed to provide any itemized statement of deductions or return any portion of my security deposit, despite the legal requirement to do so within ${stateData?.returnDeadline || 30} days.</p>`
    : `<p>On ${formData.itemizedStatementDate ? new Date(formData.itemizedStatementDate).toLocaleDateString() : '[Date]'}, you provided an itemized statement claiming deductions that I dispute as improper.</p>`
}

${disputedItems.length > 0 ? `
<h2>DISPUTED DEDUCTIONS</h2>
<p>I specifically dispute the following deductions as improper under state law:</p>
<ul>
    ${disputedItems.map(item => `<li>${item}</li>`).join('')}
</ul>
` : ''}

<h2>LEGAL VIOLATIONS</h2>

<p>Under <span class="legal-citation">${stateData?.citation || '[State Citation]'}</span>, landlords in ${stateData?.state || formData.rentalState} must return security deposits within ${stateData?.returnDeadline || 30} days of lease termination${stateData?.normalWearDefinition ? ', and cannot charge tenants for normal wear and tear' : ''}.</p>

${calculations.daysPassed > 0 ? `
<p class="deadline-notice">You are now ${calculations.daysPassed} days past the legal deadline for returning my deposit.</p>
` : ''}

<p>Your failure to comply with state law entitles me to:</p>
<ul>
    <li>Return of the full deposit amount</li>
    ${stateData?.penaltyMultiplier > 1 ? `<li>${stateData.penaltyDescription}</li>` : ''}
    ${formData.requestAttorneyFees ? '<li>Attorney fees and court costs</li>' : ''}
    ${stateData?.interestRequired ? '<li>Interest on withheld deposits</li>' : ''}
</ul>

${evidenceItems.length > 0 ? `
<h2>SUPPORTING EVIDENCE</h2>
<p>I have maintained the following evidence supporting my position:</p>
<ul>
    ${evidenceItems.map(item => `<li>${item}</li>`).join('')}
</ul>
` : ''}

<h2>DEMAND FOR PAYMENT</h2>

<p><span class="deadline-notice">${urgencyLevel} payment of $${calculations.total.toLocaleString()} within ${formData.responseDeadline} days of receipt of this letter.</span></p>

${formData.includeSmallClaimsThreat ? `
<p>If you fail to comply with this demand, I will file a lawsuit in small claims court seeking the full amount owed plus additional damages, court costs, and attorney fees as permitted by law. The small claims limit in ${stateData?.state || formData.rentalState} is $${(stateData?.smallClaimsLimit || 10000).toLocaleString()}, which is sufficient to cover my claim.</p>
` : ''}

<p>${closingTone}</p>

<div class="signature-block">
    <p>Sincerely,</p>
    <br>
    <br>
    <p>_________________________<br>
    ${formData.tenantName}<br>
    ${formData.tenantCurrentAddress}<br>
    ${formData.tenantCity}, ${formData.tenantState} ${formData.tenantZip}</p>
</div>

${evidenceItems.length > 0 ? `
<div class="enclosures">
    <p><strong>Enclosures:</strong></p>
    <ul>
        ${evidenceItems.map(item => `<li>${item}</li>`).join('')}
    </ul>
</div>
` : ''}

${formData.ccRecipients && formData.ccRecipientsText ? `
<div class="enclosures">
    <p><strong>CC:</strong> ${formData.ccRecipientsText}</p>
</div>
` : ''}
        `;
    };

    // Render individual tabs
    const renderPropertyTab = () => (
        <div className="tab-content">
            <h3>Property & Tenancy Details</h3>
            
            <div className="form-group">
                <label>Tenant Name(s)</label>
                <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => updateFormData('tenantName', e.target.value)}
                    placeholder="Full name(s) of tenant(s)"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Current Address</label>
                    <input
                        type="text"
                        value={formData.tenantCurrentAddress}
                        onChange={(e) => updateFormData('tenantCurrentAddress', e.target.value)}
                        placeholder="Current street address"
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={formData.tenantCity}
                        onChange={(e) => updateFormData('tenantCity', e.target.value)}
                        placeholder="City"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>State</label>
                    <select
                        value={formData.tenantState}
                        onChange={(e) => updateFormData('tenantState', e.target.value)}
                    >
                        {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                        type="text"
                        value={formData.tenantZip}
                        onChange={(e) => updateFormData('tenantZip', e.target.value)}
                        placeholder="ZIP"
                    />
                </div>
            </div>

            <h4>Rental Property Information</h4>

            <div className="form-group">
                <label>Rental Property Address</label>
                <input
                    type="text"
                    value={formData.rentalAddress}
                    onChange={(e) => updateFormData('rentalAddress', e.target.value)}
                    placeholder="Street address of rental property"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Unit Number (if applicable)</label>
                    <input
                        type="text"
                        value={formData.rentalUnit}
                        onChange={(e) => updateFormData('rentalUnit', e.target.value)}
                        placeholder="Apt/Unit #"
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={formData.rentalCity}
                        onChange={(e) => updateFormData('rentalCity', e.target.value)}
                        placeholder="City"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>State (determines legal requirements)</label>
                    <select
                        value={formData.rentalState}
                        onChange={(e) => updateFormData('rentalState', e.target.value)}
                    >
                        {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                        type="text"
                        value={formData.rentalZip}
                        onChange={(e) => updateFormData('rentalZip', e.target.value)}
                        placeholder="ZIP"
                    />
                </div>
            </div>

            <h4>Lease & Move-Out Dates</h4>

            <div className="form-row">
                <div className="form-group">
                    <label>Lease Start Date</label>
                    <input
                        type="date"
                        value={formData.leaseStartDate}
                        onChange={(e) => updateFormData('leaseStartDate', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Lease End Date</label>
                    <input
                        type="date"
                        value={formData.leaseEndDate}
                        onChange={(e) => updateFormData('leaseEndDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Move-Out Date</label>
                    <input
                        type="date"
                        value={formData.moveOutDate}
                        onChange={(e) => updateFormData('moveOutDate', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Key Return Date</label>
                    <input
                        type="date"
                        value={formData.keyReturnDate}
                        onChange={(e) => updateFormData('keyReturnDate', e.target.value)}
                    />
                </div>
            </div>

            <h4>Landlord Information</h4>

            <div className="form-group">
                <label>Landlord/Property Manager Name</label>
                <input
                    type="text"
                    value={formData.landlordName}
                    onChange={(e) => updateFormData('landlordName', e.target.value)}
                    placeholder="Individual or company name"
                />
            </div>

            <div className="form-group">
                <label>Property Management Company (if applicable)</label>
                <input
                    type="text"
                    value={formData.landlordCompany}
                    onChange={(e) => updateFormData('landlordCompany', e.target.value)}
                    placeholder="Company name"
                />
            </div>

            <div className="form-group">
                <label>Landlord Address</label>
                <input
                    type="text"
                    value={formData.landlordAddress}
                    onChange={(e) => updateFormData('landlordAddress', e.target.value)}
                    placeholder="Street address"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={formData.landlordCity}
                        onChange={(e) => updateFormData('landlordCity', e.target.value)}
                        placeholder="City"
                    />
                </div>
                <div className="form-group">
                    <label>State</label>
                    <select
                        value={formData.landlordState}
                        onChange={(e) => updateFormData('landlordState', e.target.value)}
                    >
                        {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                        type="text"
                        value={formData.landlordZip}
                        onChange={(e) => updateFormData('landlordZip', e.target.value)}
                        placeholder="ZIP"
                    />
                </div>
            </div>

            <h4>Forwarding Address Notification</h4>

            <div className="form-row">
                <div className="form-group">
                    <label>Date Forwarding Address Provided</label>
                    <input
                        type="date"
                        value={formData.forwardingAddressDate}
                        onChange={(e) => updateFormData('forwardingAddressDate', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Method of Notification</label>
                    <select
                        value={formData.forwardingAddressMethod}
                        onChange={(e) => updateFormData('forwardingAddressMethod', e.target.value)}
                    >
                        <option value="email">Email</option>
                        <option value="written">Written Notice</option>
                        <option value="certified-mail">Certified Mail</option>
                        <option value="hand-delivered">Hand Delivered</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderDepositsTab = () => {
        const stateData = window.STATE_LAWS[formData.rentalState];
        const calculations = window.StateLawUtils.calculateTotalDemand(formData, formData.rentalState);
        
        return (
            <div className="tab-content">
                <h3>Deposit & Deductions</h3>
                
                {stateData && (
                    <div className="info-box">
                        <h4>{stateData.state} Law Summary:</h4>
                        <ul>
                            <li>Return deadline: {stateData.returnDeadline} days</li>
                            <li>Penalty for violation: {stateData.penaltyType}</li>
                            {stateData.interestRequired && <li>Interest required: {stateData.interestRate}</li>}
                            <li>Small claims limit: ${stateData.smallClaimsLimit.toLocaleString()}</li>
                        </ul>
                    </div>
                )}

                <h4>Deposit Amounts</h4>

                <div className="form-row">
                    <div className="form-group">
                        <label>Security Deposit Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.securityDeposit}
                            onChange={(e) => updateFormData('securityDeposit', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="form-group">
                        <label>Pet Deposit (if applicable)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.petDeposit}
                            onChange={(e) => updateFormData('petDeposit', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Cleaning Deposit (if applicable)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.cleaningDeposit}
                        onChange={(e) => updateFormData('cleaningDeposit', e.target.value)}
                        placeholder="0.00"
                    />
                </div>

                <h4>Itemized Statement Status</h4>

                <div className="form-group">
                    <label>Itemized Statement Received?</label>
                    <select
                        value={formData.itemizedStatementReceived}
                        onChange={(e) => updateFormData('itemizedStatementReceived', e.target.value)}
                    >
                        <option value="not-received">Not received</option>
                        <option value="received">Received</option>
                        <option value="partial">Partially received</option>
                    </select>
                </div>

                {formData.itemizedStatementReceived !== 'not-received' && (
                    <div className="form-group">
                        <label>Date Itemized Statement Received</label>
                        <input
                            type="date"
                            value={formData.itemizedStatementDate}
                            onChange={(e) => updateFormData('itemizedStatementDate', e.target.value)}
                        />
                    </div>
                )}

                <h4>Disputed Deduction Categories</h4>
                <p className="help-text">Check all categories that apply to your situation:</p>

                <div className="checkbox-grid">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.normalWearCharges}
                            onChange={(e) => updateFormData('normalWearCharges', e.target.checked)}
                        />
                        Normal wear and tear charges
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.excessiveCleaningFees}
                            onChange={(e) => updateFormData('excessiveCleaningFees', e.target.checked)}
                        />
                        Excessive cleaning fees
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.paintingCosts}
                            onChange={(e) => updateFormData('paintingCosts', e.target.checked)}
                        />
                        Painting/repainting costs
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.carpetReplacement}
                            onChange={(e) => updateFormData('carpetReplacement', e.target.checked)}
                        />
                        Carpet replacement (normal wear)
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.unpaidRentDisputes}
                            onChange={(e) => updateFormData('unpaidRentDisputes', e.target.checked)}
                        />
                        Unpaid rent disputes
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.keyReplacement}
                            onChange={(e) => updateFormData('keyReplacement', e.target.checked)}
                        />
                        Key/remote replacement
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.preexistingDamage}
                            onChange={(e) => updateFormData('preexistingDamage', e.target.checked)}
                        />
                        Repairs for pre-existing damage
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.otherDeductions}
                            onChange={(e) => updateFormData('otherDeductions', e.target.checked)}
                        />
                        Other deductions
                    </label>
                </div>

                {formData.otherDeductions && (
                    <div className="form-group">
                        <label>Describe Other Disputed Deductions</label>
                        <textarea
                            value={formData.otherDeductionsText}
                            onChange={(e) => updateFormData('otherDeductionsText', e.target.value)}
                            placeholder="Describe the specific deductions you dispute..."
                        />
                    </div>
                )}

                {calculations.total > 0 && (
                    <div className="calculation-summary">
                        <h4>Demand Calculation Summary</h4>
                        <div className="calculation-row">
                            <span>Total Deposits:</span>
                            <span>${calculations.deposits.toLocaleString()}</span>
                        </div>
                        {calculations.penalty > 0 && (
                            <div className="calculation-row">
                                <span>Statutory Penalty:</span>
                                <span>${calculations.penalty.toLocaleString()}</span>
                            </div>
                        )}
                        {calculations.interest > 0 && (
                            <div className="calculation-row">
                                <span>Interest:</span>
                                <span>${calculations.interest.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="calculation-row total">
                            <span><strong>Total Demand:</strong></span>
                            <span><strong>${calculations.total.toLocaleString()}</strong></span>
                        </div>
                        {calculations.daysPassed > 0 && (
                            <p className="warning">⚠️ {calculations.daysPassed} days past legal deadline</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderViolationsTab = () => {
        const riskAssessment = window.StateLawUtils.getRiskAssessment(formData, formData.rentalState);
        
        return (
            <div className="tab-content">
                <h3>Legal Violations & Evidence</h3>

                <div className={`risk-assessment ${riskAssessment.color}`}>
                    <h4>Case Strength Assessment: {riskAssessment.level.toUpperCase()}</h4>
                    <p>{riskAssessment.recommendation}</p>
                    <ul>
                        {riskAssessment.factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                        ))}
                    </ul>
                </div>

                <h4>Prior Communications</h4>

                <label className="checkbox-item">
                    <input
                        type="checkbox"
                        checked={formData.priorCommunications}
                        onChange={(e) => updateFormData('priorCommunications', e.target.checked)}
                    />
                    Have you communicated with the landlord about the deposit return?
                </label>

                {formData.priorCommunications && (
                    <div className="form-group">
                        <label>Describe Prior Communications</label>
                        <textarea
                            value={formData.priorCommunicationsDescription}
                            onChange={(e) => updateFormData('priorCommunicationsDescription', e.target.value)}
                            placeholder="Briefly describe your communications with the landlord..."
                        />
                    </div>
                )}

                <h4>Supporting Evidence Available</h4>
                <p className="help-text">Check all evidence you have to support your claim:</p>

                <div className="checkbox-grid">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceMoveInPhotos}
                            onChange={(e) => updateFormData('evidenceMoveInPhotos', e.target.checked)}
                        />
                        Move-in condition photographs
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceReceipts}
                            onChange={(e) => updateFormData('evidenceReceipts', e.target.checked)}
                        />
                        Receipts and documentation
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceCommunications}
                            onChange={(e) => updateFormData('evidenceCommunications', e.target.checked)}
                        />
                        Written communications
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceWitnesses}
                            onChange={(e) => updateFormData('evidenceWitnesses', e.target.checked)}
                        />
                        Witness statements
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceInspectionReport}
                            onChange={(e) => updateFormData('evidenceInspectionReport', e.target.checked)}
                        />
                        Move-out inspection report
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.evidenceOther}
                            onChange={(e) => updateFormData('evidenceOther', e.target.checked)}
                        />
                        Other evidence
                    </label>
                </div>

                {formData.evidenceOther && (
                    <div className="form-group">
                        <label>Describe Other Evidence</label>
                        <textarea
                            value={formData.evidenceOtherText}
                            onChange={(e) => updateFormData('evidenceOtherText', e.target.value)}
                            placeholder="Describe other evidence you have..."
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderDeliveryTab = () => (
        <div className="tab-content">
            <h3>Letter Tone & Delivery</h3>

            <h4>Letter Tone</h4>

            <div className="radio-group">
                <label className="radio-item">
                    <input
                        type="radio"
                        name="letterTone"
                        value="professional"
                        checked={formData.letterTone === 'professional'}
                        onChange={(e) => updateFormData('letterTone', e.target.value)}
                    />
                    <div className="radio-content">
                        <strong>Professional/Conciliatory</strong>
                        <p>Respectful tone focusing on resolution and compliance</p>
                    </div>
                </label>

                <label className="radio-item">
                    <input
                        type="radio"
                        name="letterTone"
                        value="firm"
                        checked={formData.letterTone === 'firm'}
                        onChange={(e) => updateFormData('letterTone', e.target.value)}
                    />
                    <div className="radio-content">
                        <strong>Firm/Statutory</strong>
                        <p>Direct language emphasizing legal obligations</p>
                    </div>
                </label>

                <label className="radio-item">
                    <input
                        type="radio"
                        name="letterTone"
                        value="litigation"
                        checked={formData.letterTone === 'litigation'}
                        onChange={(e) => updateFormData('letterTone', e.target.value)}
                    />
                    <div className="radio-content">
                        <strong>Final Notice/Litigation Ready</strong>
                        <p>Formal notice with clear litigation threat</p>
                    </div>
                </label>
            </div>

            <h4>Delivery Method</h4>

            <div className="form-group">
                <label>Preferred Delivery Method</label>
                <select
                    value={formData.deliveryMethod}
                    onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                >
                    <option value="email">Email</option>
                    <option value="certified-mail">Certified Mail</option>
                    <option value="regular-mail">Regular Mail</option>
                    <option value="hand-delivery">Hand Delivery</option>
                    <option value="multiple">Multiple Methods</option>
                </select>
            </div>

            <h4>CC Recipients</h4>

            <label className="checkbox-item">
                <input
                    type="checkbox"
                    checked={formData.ccRecipients}
                    onChange={(e) => updateFormData('ccRecipients', e.target.checked)}
                />
                Include CC recipients (housing authority, tenant organization, etc.)
            </label>

            {formData.ccRecipients && (
                <div className="form-group">
                    <label>CC Recipients</label>
                    <textarea
                        value={formData.ccRecipientsText}
                        onChange={(e) => updateFormData('ccRecipientsText', e.target.value)}
                        placeholder="List CC recipients (one per line)..."
                    />
                </div>
            )}
        </div>
    );

    const renderReviewTab = () => {
        const calculations = window.StateLawUtils.calculateTotalDemand(formData, formData.rentalState);
        const riskAssessment = window.StateLawUtils.getRiskAssessment(formData, formData.rentalState);
        const stateData = window.STATE_LAWS[formData.rentalState];
        
        return (
            <div className="tab-content">
                <h3>Review & Finalize</h3>

                <div className={`risk-assessment ${riskAssessment.color}`}>
                    <h4>Final Case Assessment</h4>
                    <div className="assessment-details">
                        <div className="assessment-item">
                            <strong>Strength:</strong> {riskAssessment.level.toUpperCase()}
                        </div>
                        <div className="assessment-item">
                            <strong>Total Demand:</strong> ${calculations.total.toLocaleString()}
                        </div>
                        <div className="assessment-item">
                            <strong>Days Past Deadline:</strong> {calculations.daysPassed}
                        </div>
                    </div>
                    <p>{riskAssessment.recommendation}</p>
                </div>

                <h4>Final Settings</h4>

                <div className="form-group">
                    <label>Response Deadline (days)</label>
                    <select
                        value={formData.responseDeadline}
                        onChange={(e) => updateFormData('responseDeadline', parseInt(e.target.value))}
                    >
                        <option value={7}>7 days</option>
                        <option value={10}>10 days</option>
                        <option value={14}>14 days</option>
                        <option value={21}>21 days</option>
                        <option value={30}>30 days</option>
                    </select>
                </div>

                <div className="checkbox-grid">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.includeSmallClaimsThreat}
                            onChange={(e) => updateFormData('includeSmallClaimsThreat', e.target.checked)}
                        />
                        Include small claims court threat
                    </label>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={formData.requestAttorneyFees}
                            onChange={(e) => updateFormData('requestAttorneyFees', e.target.checked)}
                        />
                        Request attorney fees and court costs
                    </label>
                </div>

                <h4>Next Steps If No Response</h4>
                <div className="next-steps">
                    <ol>
                        <li>Wait {formData.responseDeadline} days for landlord response</li>
                        <li>If no response, consider sending follow-up letter</li>
                        {formData.includeSmallClaimsThreat && (
                            <li>File small claims court case (limit: ${(stateData?.smallClaimsLimit || 10000).toLocaleString()})</li>
                        )}
                        <li>Consider consulting with a tenant rights attorney</li>
                    </ol>
                </div>

                <h4>Legal Disclaimer</h4>
                <div className="disclaimer">
                    <p><em>This document is provided for informational purposes only and does not constitute legal advice. Laws vary by jurisdiction and individual circumstances. Consider consulting with a qualified attorney for specific legal guidance.</em></p>
                </div>
            </div>
        );
    };

    // Copy to clipboard function
    const handleCopyToClipboard = () => {
        const letterContent = generateLetterContent();
        // Remove HTML tags for plain text copy
        const plainText = letterContent.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n\n');
        
        if (window.copyToClipboard) {
            window.copyToClipboard(plainText);
        }
    };

    // Download Word document
    const handleDownloadWord = () => {
        const letterContent = generateLetterContent();
        
        if (window.generateWordDoc) {
            window.generateWordDoc(letterContent, formData);
        }
    };

    // Open consultation calendar
    const handleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
            });
        } else {
            window.open('https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1', '_blank');
        }
    };

    // Send via eSign
    const handleESign = async () => {
        setESignLoading(true);
        
        try {
            // This would integrate with the same eSign API as Stripe generator
            // For now, show a placeholder
            alert('eSign integration coming soon! For now, please use Copy or Download options.');
        } catch (error) {
            console.error('eSign error:', error);
            alert('Error sending document. Please try again.');
        } finally {
            setESignLoading(false);
        }
    };

    // Navigation functions
    const goToPreviousTab = () => {
        if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
        }
    };

    const goToNextTab = () => {
        if (currentTab < tabs.length - 1) {
            setCurrentTab(currentTab + 1);
        }
    };

    // Auto-replace feather icons
    useEffect(() => {
        if (window.feather) {
            window.feather.replace();
        }
    });

    return React.createElement('div', { className: 'app-container' }, [
        // Header
        React.createElement('header', { key: 'header', className: 'app-header' }, [
            React.createElement('h1', { key: 'title' }, 'Tenant Security Deposit Demand Letter Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Create professional demand letters to recover your security deposit')
        ]),

        // Main content container
        React.createElement('div', { key: 'main', className: 'main-container' }, [
            // Left pane - Form
            React.createElement('div', { key: 'form-pane', className: 'form-pane' }, [
                // Tab navigation
                React.createElement('div', { key: 'tab-nav', className: 'tab-navigation' }, 
                    tabs.map((tab, index) => 
                        React.createElement('button', {
                            key: tab.id,
                            className: `tab-button ${index === currentTab ? 'active' : ''}`,
                            onClick: () => setCurrentTab(index)
                        }, [
                            React.createElement(Icon, { key: 'icon', name: tab.icon }),
                            React.createElement('span', { key: 'label' }, tab.label)
                        ])
                    )
                ),

                // Tab content
                React.createElement('div', { key: 'tab-content', className: 'tab-content-container' }, [
                    currentTab === 0 && renderPropertyTab(),
                    currentTab === 1 && renderDepositsTab(),
                    currentTab === 2 && renderViolationsTab(),
                    currentTab === 3 && renderDeliveryTab(),
                    currentTab === 4 && renderReviewTab()
                ]),

                // Action buttons
                React.createElement('div', { key: 'actions', className: 'action-buttons' }, [
                    React.createElement('button', {
                        key: 'prev',
                        className: 'btn btn-secondary',
                        onClick: goToPreviousTab,
                        disabled: currentTab === 0
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'chevron-left' }),
                        ' Previous'
                    ]),

                    React.createElement('button', {
                        key: 'copy',
                        className: 'btn btn-primary',
                        onClick: handleCopyToClipboard
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'copy' }),
                        ' Copy'
                    ]),

                    React.createElement('button', {
                        key: 'download',
                        className: 'btn btn-primary',
                        onClick: handleDownloadWord
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'download' }),
                        ' Download'
                    ]),

                    React.createElement('button', {
                        key: 'consultation',
                        className: 'btn btn-accent',
                        onClick: handleConsultation
                    }, [
                        React.createElement(Icon, { key: 'icon', name: 'calendar' }),
                        ' Consultation'
                    ]),

                    React.createElement('button', {
                        key: 'next',
                        className: 'btn btn-secondary',
                        onClick: goToNextTab,
                        disabled: currentTab === tabs.length - 1
                    }, [
                        'Next ',
                        React.createElement(Icon, { key: 'icon', name: 'chevron-right' })
                    ])
                ])
            ]),

            // Right pane - Preview
            React.createElement('div', { key: 'preview-pane', className: 'preview-pane' }, [
                React.createElement('div', { key: 'preview-header', className: 'preview-header' }, [
                    React.createElement('h3', { key: 'title' }, 'Live Preview'),
                    React.createElement('button', {
                        key: 'esign',
                        className: 'btn btn-accent',
                        onClick: handleESign,
                        disabled: eSignLoading
                    }, [
                        React.createElement(Icon, { 
                            key: 'icon', 
                            name: eSignLoading ? 'loader' : 'send',
                            style: eSignLoading ? { animation: 'spin 1s linear infinite' } : {}
                        }),
                        eSignLoading ? ' Sending...' : ' Send via eSign'
                    ])
                ]),

                React.createElement('div', { 
                    key: 'preview-content', 
                    className: 'preview-content',
                    ref: previewRef,
                    dangerouslySetInnerHTML: { 
                        __html: generateLetterContent().replace(
                            new RegExp(`(${lastChanged ? formData[lastChanged] : 'NOMATCH'})`, 'gi'),
                            lastChanged ? '<span class="highlight">$1</span>' : '$1'
                        )
                    }
                })
            ])
        ])
    ]);
};

// Render the app
ReactDOM.render(
    React.createElement(TenantDepositGenerator),
    document.getElementById('root')
);